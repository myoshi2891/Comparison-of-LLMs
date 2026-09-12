"""GitHub Copilot 料金スクレイパー。

対象: https://github.com/features/copilot#pricing
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import SubTool

logger = logging.getLogger(__name__)

_URL = "https://github.com/features/copilot#pricing"

# プラン名と価格の間に許容する最大文字数。料金表のセル内に収まる程度に狭くする。
_GAP = r"[^$\n]{0,80}?"

# フォールバック: (monthly, annual, tag, cls, note_ja, note_en)
_FALLBACKS: list[tuple[str, str, float, float | None, str, str, str, str]] = [
    ("GitHub Copilot", "Free",       0,   0,    "Free",       "tag-mini",
     "2,000補完+50 Premium req/月",      "2,000 completions + 50 Premium req/mo"),
    ("GitHub Copilot", "Pro",        10,  100,  "Individual", "tag-bal",
     "300 Premium req/月 | 学生無料",    "300 Premium req/mo | Free for students"),
    ("GitHub Copilot", "Pro+",       39,  390,  "Pro+",       "tag-flag",
     "1,500 req/月 | 全モデルアクセス", "1,500 req/mo | All model access"),
    ("GitHub Copilot", "Max",        100, None, "Max",        "tag-flag",
     "高負荷エージェント向け最上位",     "Top tier for sustained agent workflows"),
    ("GitHub Copilot", "Business",   19,  None, "Team",       "tag-bal",
     "超過 $0.04/req | /user/month",     "Overage $0.04/req | /user/month"),
    ("GitHub Copilot", "Enterprise", 39,  None, "Enterprise", "tag-flag",
     "全機能 + GH Enterprise Cloud",     "All features + GH Enterprise Cloud"),
]


def scrape(existing: list[SubTool] | None = None) -> list[SubTool]:
    logger.info("GitHub Copilot: スクレイピング開始 %s", _URL)

    fb_map: dict[str, tuple[float, float | None]] = {
        row[1]: (row[2], row[3]) for row in _FALLBACKS
    }
    if existing:
        for t in existing:
            if t.group == "GitHub Copilot":
                fb_map[t.name] = (t.monthly, t.annual)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.warning("GitHub Copilot: ページ取得失敗 %s → fallback", exc)
        return _build_fallback()

    tools: list[SubTool] = []
    for group, name, fb_m, fb_a, tag, cls, note_ja, note_en in _FALLBACKS:
        # プラン名と価格の距離を _GAP で制限する。無制限（[^$\n]*?）にすると
        # 約 890KB の 1 塊テキストを横断して無関係な金額へ到達し、Max ティアの
        # 特典クレジット "$100/month in GitHub credits" を Pro / Pro+ の価格として
        # 誤検出する（2026-09-12 実測）。近傍に無ければ fallback に落とすのが正しい。
        price = None
        if name == "Pro":
            # "Pro+" / "Pro Max" を除外する。直後の "+" だけを禁止すると
            # "Pro Max" の "pro" にマッチし _GAP が " Max " を食って Max の
            # 価格を Pro として拾うため、後続の max も明示的に除外する。
            # さらに \b で語全体を要求する。これがないと "Professional" の
            # "pro" にマッチし、_GAP が "fessional ..." を食って無関係な
            # 月額を Pro の価格として拾う。
            price = extract_price(
                html, [rf"\bpro\b(?!\+)(?!\s*max){_GAP}\$([\d]+)\s*/\s*month"]
            )
        elif name == "Pro+":
            price = extract_price(html, [rf"\bpro\+{_GAP}\$([\d]+)\s*/\s*month"])
        elif name == "Max":
            # \b がないと "Maximum" 等の部分一致から無関係な月額に到達する。
            price = extract_price(html, [rf"\bmax\b{_GAP}\$([\d]+)\s*/\s*month"])
        elif name == "Business":
            price = extract_price(html, [rf"business{_GAP}\$([\d]+)\s*/\s*(?:user|seat)"])
        elif name == "Enterprise":
            price = extract_price(html, [rf"enterprise{_GAP}\$([\d]+)\s*/\s*(?:user|seat)"])

        cur_m = fb_m
        status = "fallback"
        if price is not None:
            new_m, s = sanity_check(price, f"GitHub Copilot/{name}/monthly", fb_m)
            cur_m = new_m
            status = s

        tools.append(SubTool(
            group=group, name=name,
            monthly=cur_m, annual=fb_a,
            tag=tag, cls=cls,
            note_ja=note_ja, note_en=note_en,
            scrape_status=status,  # type: ignore[arg-type]
        ))
    return tools


def _build_fallback() -> list[SubTool]:
    return [
        SubTool(
            group=group, name=name,
            monthly=fb_m, annual=fb_a,
            tag=tag, cls=cls,
            note_ja=note_ja, note_en=note_en,
            scrape_status="fallback",
        )
        for group, name, fb_m, fb_a, tag, cls, note_ja, note_en in _FALLBACKS
    ]
