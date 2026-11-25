"""Moonshot(Kimi) 料金スクレイパー。

対象: https://platform.moonshot.ai/docs/pricing
中国系 OSS 系ラボ。DeepSeek と同じ抽出パターン（cls="tag-oss"）。
"""

from __future__ import annotations
import logging
import re

from scraper.browser import get_page_text, extract_price, model_key_pattern, sanity_check
from scraper.models import ApiModel
from scraper.provenance import FallbackResolver

logger = logging.getLogger(__name__)

_PROVIDER = "Moonshot(Kimi)"
_URL = "https://platform.moonshot.ai/docs/pricing"

_KIMI_K2_7_CODE_HIGHSPEED = "Kimi K2.7 Code Highspeed"
_KIMI_K2_7_CODE = "Kimi K2.7 Code"

# タグは丸ごと読み飛ばし、属性値（data-field="input" / data-label="output" 等）をラベルとみなさない。
# 通常文字の分岐は完結したタグの開始を読まない（タグの読み方が分岐すると指数的に後戻りする）。
_ANY_TAG = r"<(?:[^<>\"']|\"[^\"]*\"|'[^']*')*>"
_TAG_RE = re.compile(_ANY_TAG)
_TEMPLATE_TAG_RE = re.compile(r"<(/?)template(?=[\s/>])", re.IGNORECASE)
# cached と input や次モデル名（Kimi&nbsp;K2.6 等）の間の HTML 空白エンティティを区切りとして扱う。
_HTML_WS_ENTITY = r"&(?:nbsp|ensp|emsp|thinsp|#0*(?:9|10|12|13|32|160)|#x0*(?:9|a|c|d|20|a0));"
# レコード終端・次モデルを越えず、outputより前では入力価格の$を許可する。
# 次モデル名は "<span>Kimi</span> <span>K2.6</span>" や "Kimi&nbsp;K2.6" のようにインラインタグや空白エンティティで区切られても境界とみなす。
_RECORD_GAP = (
    r"(?:(?!</(?:p|div|tr|li|dl|section|article|nav|h[1-6])\b|<dt\b"
    rf"|\bkimi(?:[-\s]|{_HTML_WS_ENTITY}|<[^<>]*>)*k)[\s\S]){{0,80}}?"
)
_PRICE_GAP = _RECORD_GAP.replace(r"[\s\S]", r"[^$]")
# 次の Kimi モデル見出し（レコード境界）。
# 完結した HTML タグ（属性値を含む）は丸ごと読み飛ばし、可視テキスト上の次モデル名だけを境界にする。
_NEXT_KIMI_RECORD = re.compile(
    rf"{_ANY_TAG}|(\bkimi(?:[-\s]|{_HTML_WS_ENTITY}|{_ANY_TAG})*k)",
    re.IGNORECASE,
)
# cached と input の間には空白、HTML 空白エンティティ（&nbsp; 等）、またはレコード境界ではないインラインタグ（span・br 等）を許す。
_INLINE_TAG = r"<(?!/?(?:p|div|tr|li|dl|dt|section|article|nav|h[1-6])\b)(?:[^<>\"']|\"[^\"]*\"|'[^']*')*>"
_INLINE_SEP = rf"(?:\s|{_HTML_WS_ENTITY}|{_INLINE_TAG})+"
_OPT_INLINE_SEP = rf"(?:\s|{_HTML_WS_ENTITY}|{_INLINE_TAG})*"
# batch input と cache-hit の入力（"input (cache hit)" / "cache hit input"）も標準入力
# ではないため、cached input と同様に価格ごと読み飛ばす。標準入力は cache-miss 側を選ぶ。
# "cache-hit input" のように後ろへ続く input もラベルの一部として読む（価格探索の禁止語に当たらないように）。
# input が続く場合は必ず含め、後戻りで input を手放して cache-hit 価格を標準入力にしない。
_CACHED_LABEL = (
    rf"(?:\b(?:cached|batch){_INLINE_SEP}input\b"
    rf"|\bcache(?:{_OPT_INLINE_SEP}-{_OPT_INLINE_SEP}|{_INLINE_SEP})?hit\b"
    rf"(?:{_INLINE_SEP}input\b|(?!{_INLINE_SEP}input\b)))"
)
# cached input の価格を探す間も output・標準 input のラベルは越えない
# （output 価格や、cached が N/A のときの標準 input 価格を cached 扱いにしない）。
# インラインタグは丸ごと読み飛ばし、属性値（class="input-price" 等）をラベルとみなさない。
# 通常文字の分岐はインラインタグの開始を読まない（タグの読み方が分岐すると指数的に後戻りする）。
_CACHED_PRICE_GAP = _RECORD_GAP.replace(
    r"[\s\S]", rf"(?:{_INLINE_TAG}|(?!{_INLINE_TAG})(?!\b(?:output|input)\b)[^$])"
)
# cached inputの価格はひとまとまりで読み飛ばし、output以降へは進まない。
# 価格のない cached（N/A 等）はラベルだけを読み飛ばす。価格が続く場合はこの分岐を使えず、
# cached 価格を標準入力として拾わない。
_INPUT_PRICE_GAP = _RECORD_GAP.replace(
    r"[\s\S]",
    rf"(?!\boutput\b)(?:{_ANY_TAG}|{_CACHED_LABEL}(?:{_CACHED_PRICE_GAP}\$[\d.]+(?![\d.])"
    rf"|(?!{_CACHED_PRICE_GAP}\$))|(?!{_ANY_TAG}|{_CACHED_LABEL})[^$])",
)
# 標準 output の価格は batch・cached など別フィールドのラベルを越えて探さない。
_OUTPUT_LABEL = r"(?<!batch\s)(?<!cached\s)\boutput"
# batch/cached output は区切りの空白・インラインタグの量によらず一塊で読み飛ばす。
# 途中で止まれないため、直後の output を標準ラベルとして誤認しない。
_OTHER_OUTPUT_LABEL = rf"\b(?:batch|cached){_INLINE_SEP}output\b"
# batch/cached input のラベルを越えるのは、その後ろ（output より前）に標準 input
# （"input" または "Cache Miss"）が続く場合だけ。続かなければそのレコードは batch/cached の行であり、
# 後続の output は標準 output ではない。
_STD_INPUT_LABEL = (
    rf"(?:\binput\b(?!{_OPT_INLINE_SEP}\({_OPT_INLINE_SEP}"
    rf"cache(?:{_OPT_INLINE_SEP}-{_OPT_INLINE_SEP}|{_INLINE_SEP})?hit{_OPT_INLINE_SEP}\))"
    rf"|\bcache(?:-|{_INLINE_SEP})?miss\b)"
)
_STD_INPUT_AHEAD = _RECORD_GAP.replace(
    r"[\s\S]",
    rf"(?!\boutput\b)(?:{_ANY_TAG}|{_CACHED_LABEL}|(?!{_ANY_TAG}|{_CACHED_LABEL})[\s\S])",
)
_PRE_STD_INPUT_GAP = _RECORD_GAP.replace(
    r"[\s\S]",
    rf"(?!\boutput\b)(?:{_ANY_TAG}|{_OTHER_OUTPUT_LABEL}"
    rf"|(?!{_ANY_TAG}|{_OTHER_OUTPUT_LABEL}|{_CACHED_LABEL})[\s\S])",
)
# 標準 input の後でも batch input のラベルは、さらに後ろに標準 input が続く場合だけ越える。
# 続かなければ batch の行であり、後続の output は標準 output ではない。
_BATCH_INPUT_LABEL = rf"\bbatch{_INLINE_SEP}input\b"
_POST_STD_INPUT_OUTPUT_GAP = _RECORD_GAP.replace(
    r"[\s\S]",
    rf"(?:{_ANY_TAG}|{_OTHER_OUTPUT_LABEL}"
    rf"|(?!{_BATCH_INPUT_LABEL}){_CACHED_LABEL}"
    rf"|{_BATCH_INPUT_LABEL}(?={_STD_INPUT_AHEAD}{_STD_INPUT_LABEL})"
    rf"|(?!{_ANY_TAG}|{_OTHER_OUTPUT_LABEL}|{_CACHED_LABEL})[\s\S])",
)
_OUTPUT_LABEL_GAP = _RECORD_GAP.replace(
    r"[\s\S]",
    rf"(?:{_ANY_TAG}|{_OTHER_OUTPUT_LABEL}|{_CACHED_LABEL}"
    rf"(?={_STD_INPUT_AHEAD}{_STD_INPUT_LABEL})"
    rf"|(?!{_ANY_TAG}|{_OTHER_OUTPUT_LABEL}|{_CACHED_LABEL})[\s\S])",
)
_OUTPUT_PRICE_GAP = _RECORD_GAP.replace(
    r"[\s\S]",
    rf"(?:{_ANY_TAG}|(?!{_ANY_TAG})(?!\b(?:batch|cached|cache|input)\b)[^$])",
)

# フォールバック価格（USD / 1M tokens、cache-miss 標準入力価格）
_FALLBACKS: dict[str, tuple[float, float]] = {
    "Kimi K3":                   ( 3.00, 15.00),
    _KIMI_K2_7_CODE_HIGHSPEED:   ( 1.90,  8.00),
    _KIMI_K2_7_CODE:             ( 0.95,  4.00),
    "Kimi K2.6":                 ( 0.95,  4.00),
}
_TAG = {
    "Kimi K3":                   "最新 Flagship",
    _KIMI_K2_7_CODE_HIGHSPEED:   "Code 高速",
    _KIMI_K2_7_CODE:             "Code 特化",
    "Kimi K2.6":                 "General",
}
_CLS = {
    "Kimi K3":                   "tag-oss",
    _KIMI_K2_7_CODE_HIGHSPEED:   "tag-oss",
    _KIMI_K2_7_CODE:             "tag-oss",
    "Kimi K2.6":                 "tag-oss",
}
_SUB_JA = {
    "Kimi K3":                   "2.8T MoE / 1M ctx / OSS / 最新旗艦",
    _KIMI_K2_7_CODE_HIGHSPEED:   "コーディング特化 / 高速版",
    _KIMI_K2_7_CODE:             "コーディング特化 / 標準速度",
    "Kimi K2.6":                 "前世代フラッグシップ / OSS / 1M ctx",
}
_SUB_EN = {
    "Kimi K3":                   "2.8T MoE / 1M ctx / OSS / latest flagship",
    _KIMI_K2_7_CODE_HIGHSPEED:   "Coding-specialized / high-speed variant",
    _KIMI_K2_7_CODE:             "Coding-specialized / standard speed",
    "Kimi K2.6":                 "Prev flagship / OSS / 1M ctx",
}


def _strip_templates(html: str) -> str:
    """template 要素を、入れ子を含めて中身ごと空白 1 つへ置き換える（閉じられない場合は末尾まで除く）。"""
    parts: list[str] = []
    depth = 0
    pos = 0
    for tag in _TAG_RE.finditer(html):
        template = _TEMPLATE_TAG_RE.match(tag.group())
        if template is None:
            continue
        if not template.group(1):
            if depth == 0:
                parts += [html[pos:tag.start()], " "]
            depth += 1
        elif depth > 0:
            depth -= 1
            pos = tag.end()
    if depth == 0:
        parts.append(html[pos:])
    return "".join(parts)


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """
    Builds Moonshot (Kimi) model pricing records from the pricing page.
    
    Parameters:
        existing (list[ApiModel] | None): Existing Moonshot records used to preserve fallback prices when the page cannot be retrieved.
    
    Returns:
        list[ApiModel]: Pricing records for the configured models, using fallback values when retrieval or price extraction fails.
    """
    logger.info("Moonshot(Kimi): スクレイピング開始 %s", _URL)

    # 出自（provenance）ベースのフォールバック解決。判定ルールは provenance.py を参照。
    resolver = FallbackResolver.build(_PROVIDER, _FALLBACKS, existing)
    fallback_map = resolver.prices

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception:
        logger.exception("Moonshot(Kimi): ページ取得失敗")
        return _build_fallback(resolver)

    # HTML コメントと script/style/template の中身は可視テキストではないため、モデル候補の探索前に取り除く。
    html = re.sub(
        r"<!--.*?-->|<(script|style)\b[^>]*>.*?</\1\s*>",
        " ",
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    html = _strip_templates(html)

    models = []
    for name in _FALLBACKS:
        # ハードコード値ではなく fallback_map を見る（既存のスクレイプ成功値を尊重）
        fb_in, fb_out = fallback_map[name]
        # K3.1 など未登録の派生版と別レコード・遠距離の価格を拾わない。
        key = model_key_pattern(name, _FALLBACKS) + r"(?![.\d])"
        in_patterns = [rf"\A{key}{_INPUT_PRICE_GAP}\$([\d.]+)"]
        out_patterns = [
            rf"\A{key}(?:{_PRE_STD_INPUT_GAP}{_STD_INPUT_LABEL}{_POST_STD_INPUT_OUTPUT_GAP}|{_OUTPUT_LABEL_GAP}){_OUTPUT_LABEL}{_OUTPUT_PRICE_GAP}\$([\d.]+)",
        ]
        # 入力・出力は同一レコード内で組にする（別レコードの価格を混成しない）。
        # 完全な組を持つレコードがなければ None のまま既存のフォールバック組を使う。
        in_price = out_price = None
        # 完結した HTML タグ（属性値を含む）は丸ごと読み飛ばし、可視テキスト上のモデル名だけを開始位置にする。
        key_finder = re.compile(rf"{_ANY_TAG}|({key})", re.IGNORECASE | re.DOTALL)
        key_starts = [m.start() for m in key_finder.finditer(html) if m.group(1) is not None]
        for begin in key_starts:
            # 同一モデルの繰り返し記載は同じレコードとして扱い、別の Kimi モデルの見出しで区切る。
            boundary = next(
                (
                    m
                    for m in _NEXT_KIMI_RECORD.finditer(html, begin + 1)
                    if m.group(1) is not None and m.start() not in key_starts
                ),
                None,
            )
            end = boundary.start() if boundary else len(html)
            # タグ属性内のモデル名にマッチしないよう、レコード内の可視モデル名開始位置だけにアンカーして抽出する。
            record_starts = [s for s in key_starts if begin <= s < end]
            # まず単一のモデル記載内で input/output の完全な組を探し、見つからない場合だけ複数記載をまたいで組にする。
            single_pair = None
            for idx, s in enumerate(record_starts):
                mention_end = record_starts[idx + 1] if idx + 1 < len(record_starts) else end
                mention = html[s:mention_end]
                p_in = extract_price(mention, in_patterns)
                p_out = extract_price(mention, out_patterns)
                if p_in is not None and p_out is not None:
                    single_pair = (p_in, p_out)
                    break
            if single_pair is not None:
                in_price, out_price = single_pair
                break
            rec_in = next(
                (p for s in record_starts if (p := extract_price(html[s:end], in_patterns)) is not None),
                None,
            )
            rec_out = next(
                (p for s in record_starts if (p := extract_price(html[s:end], out_patterns)) is not None),
                None,
            )
            if rec_in is not None and rec_out is not None:
                in_price, out_price = rec_in, rec_out
                break
        pi, si = sanity_check(in_price, f"Moonshot/{name}/in", fb_in)
        po, so = sanity_check(out_price, f"Moonshot/{name}/out", fb_out)
        # 片側だけ抽出できた混成ペアは採用しない（取れた側も誤抽出のことが多い）
        if si != so:
            pi, po = fb_in, fb_out
        models.append(ApiModel(
            provider=_PROVIDER,
            name=name,
            tag=_TAG[name], cls=_CLS[name],
            price_in=pi, price_out=po,
            sub_ja=_SUB_JA[name], sub_en=_SUB_EN[name],
            scrape_status=si if si == so else "fallback",  # type: ignore[arg-type]
            provenance=resolver.provenance(name, si == "success" and so == "success", (pi, po)),
        ))
    return models


def _build_fallback(resolver: FallbackResolver) -> list[ApiModel]:
    """
    Builds model entries using fallback pricing.
    
    Parameters:
    	resolver (FallbackResolver): Fallback price/provenance resolver for the Moonshot(Kimi) provider.

    Returns:
    	list[ApiModel]: Model entries marked with a fallback scrape status.
    """
    return [
        ApiModel(
            provider=_PROVIDER,
            name=n, tag=_TAG[n], cls=_CLS[n],
            price_in=resolver.prices[n][0], price_out=resolver.prices[n][1],
            sub_ja=_SUB_JA[n], sub_en=_SUB_EN[n],
            scrape_status="fallback",
            provenance=resolver.provenance(n, False),
        )
        for n in _FALLBACKS
    ]
