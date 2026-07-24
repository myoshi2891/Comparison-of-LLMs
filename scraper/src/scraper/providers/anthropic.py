"""Anthropic 公式料金ページスクレイパー。

対象: https://www.anthropic.com/pricing
"""

from __future__ import annotations
import datetime
import logging
from zoneinfo import ZoneInfo

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel

logger = logging.getLogger(__name__)

_URL = "https://www.anthropic.com/pricing"
_CLAUDE_SONNET_5 = "Claude Sonnet 5"
_CLAUDE_FABLE_5 = "Claude Fable 5"

_SPEC_TZ = ZoneInfo("Asia/Tokyo")

# Claude Sonnet 5 促進価格の最終適用日(2026-08-31 まで $2/$10、以降 $3/$15)。
_SONNET_5_PROMO_UNTIL = datetime.date(2026, 8, 31)


def _sonnet_5_fallback(today: datetime.date | None = None) -> tuple[float, float]:
    """Claude Sonnet 5 のフォールバック価格を適用日で切り替える。

    Sonnet 5 はライブ抽出対象外(フォールバック固定)のため、促進価格の
    期限をここで表現する。2026-08-31 まで促進価格 $2/$10、2026-09-01 以降は
    恒久価格 $3/$15 を返す(_SUB_JA / _SUB_EN の説明と一致させる)。
    """
    day = today or datetime.datetime.now(_SPEC_TZ).date()
    if day <= _SONNET_5_PROMO_UNTIL:
        return (2.00, 10.00)
    return (3.00, 15.00)


# フォールバック価格(ハードコード最終手段)
_FALLBACKS: dict[str, tuple[float, float]] = {
    _CLAUDE_FABLE_5:            (10.00, 50.00),
    "Claude Opus 4.8":          (5.00,  25.00),
    "Claude Opus 4.7":          (5.00,  25.00),
    "Claude Opus 4.6":          (5.00,  25.00),
    # 促進価格は _sonnet_5_fallback() が適用日で $2/$10 ↔ $3/$15 を切替
    _CLAUDE_SONNET_5:           _sonnet_5_fallback(),
    "Claude Sonnet 4.6":        (3.00,  15.00),
    "Claude Haiku 4.5":         (1.00,   5.00),
    "Claude Haiku 3.5":         (0.80,   4.00),
    "Claude Opus 4.1 (Legacy)": (15.00, 75.00),
}


def scrape(
    existing: list[ApiModel] | None = None,
    today: datetime.date | None = None,
) -> list[ApiModel]:
    """
    Scrape Anthropic's pricing page and produce ApiModel entries for supported Claude models.
    
    Attempts to extract in/out prices for specific Claude models from Anthropic's pricing HTML. If `existing` is provided, its Anthropic model prices seed fallbacks; hardcoded fallback prices are used when extraction fails, when fetch fails, or when extracted in/out sanity checks disagree. Models not found on the page are added from the fallback set with scrape status "fallback".
    
    Parameters:
        existing (list[ApiModel] | None): Optional previously known ApiModel list whose Anthropic entries provide preferred fallback prices.
        today (datetime.date | None): Optional target date override for fallback calculation.
    
    Returns:
        list[ApiModel]: ApiModel objects for each model with `price_in`/`price_out` populated from extracted values or fallbacks and `scrape_status` set to indicate whether the value came from a successful scrape or a fallback.
    """
    logger.info("Anthropic: スクレイピング開始 %s", _URL)

    current_fallbacks = dict(_FALLBACKS)
    current_fallbacks[_CLAUDE_SONNET_5] = _sonnet_5_fallback(today)

    # 既存値をフォールバックとして使う（既存 JSON があれば）
    fallback_map: dict[str, tuple[float, float]] = {}
    if existing:
        for m in existing:
            if m.provider == "Anthropic":
                fallback_map[m.name] = (m.price_in, m.price_out)
    for k, v in current_fallbacks.items():
        fallback_map.setdefault(k, v)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.error("Anthropic: ページ取得失敗 %s", exc)
        return _build_models(fallback_map, "fallback")

    results: dict[str, tuple[float, float, str]] = {}

    # Claude Opus 4.6: $5 / $25
    in_price = extract_price(html, [
        r"opus[^\n]*?4\.6[^\n]*?\$\s*([\d.]+)",
        r"claude-opus-4[^\n]*?\$\s*([\d.]+)",
    ])
    out_price = extract_price(html, [
        r"opus[^\n]*?4\.6[^\n]*?\$[\d.]+[^\n]*?\$\s*([\d.]+)",
    ])
    fb_in, fb_out = fallback_map["Claude Opus 4.6"]
    pi, si = sanity_check(in_price, "Anthropic/Opus4.6/in", fb_in)
    po, so = sanity_check(out_price, "Anthropic/Opus4.6/out", fb_out)
    results["Claude Opus 4.6"] = (pi, po, si if si == so else "fallback")

    # Claude Sonnet 4.6: $3 / $15
    in_price = extract_price(html, [
        r"sonnet[^\n]*?4\.6[^\n]*?\$\s*([\d.]+)",
        r"claude-sonnet-4[^\n]*?\$\s*([\d.]+)",
    ])
    out_price = extract_price(html, [
        r"sonnet[^\n]*?4\.6[^\n]*?\$[\d.]+[^\n]*?\$\s*([\d.]+)",
    ])
    fb_in, fb_out = fallback_map["Claude Sonnet 4.6"]
    pi, si = sanity_check(in_price, "Anthropic/Sonnet4.6/in", fb_in)
    po, so = sanity_check(out_price, "Anthropic/Sonnet4.6/out", fb_out)
    results["Claude Sonnet 4.6"] = (pi, po, si if si == so else "fallback")

    # Claude Haiku 4.5: $1 / $5
    in_price = extract_price(html, [
        r"haiku[^\n]*?4\.5[^\n]*?\$\s*([\d.]+)",
        r"claude-haiku-4[^\n]*?\$\s*([\d.]+)",
    ])
    out_price = extract_price(html, [
        r"haiku[^\n]*?4\.5[^\n]*?\$[\d.]+[^\n]*?\$\s*([\d.]+)",
    ])
    fb_in, fb_out = fallback_map["Claude Haiku 4.5"]
    pi, si = sanity_check(in_price, "Anthropic/Haiku4.5/in", fb_in)
    po, so = sanity_check(out_price, "Anthropic/Haiku4.5/out", fb_out)
    results["Claude Haiku 4.5"] = (pi, po, si if si == so else "fallback")

    # 未スクレイプのモデルはフォールバック維持
    for name in _FALLBACKS:
        if name not in results:
            fb_in, fb_out = fallback_map.get(name, (0.0, 0.0))
            results[name] = (fb_in, fb_out, "fallback")

    return _build_models_from_results(results, fallback_map)


def _build_models(
    fallback_map: dict[str, tuple[float, float]], status: str
) -> list[ApiModel]:
    """
    Construct a list of ApiModel entries for all fallback models using provided prices and scrape status.
    
    Parameters:
        fallback_map (dict[str, tuple[float, float]]): Mapping from model name to a tuple of (price_in, price_out) used for each ApiModel's pricing.
        status (str): Scrape status value to assign to each ApiModel's `scrape_status` field.
    
    Returns:
        list[ApiModel]: ApiModel objects for every model key in the `_FALLBACKS` order with provider set to "Anthropic", metadata fields (`tag`, `cls`, `sub_ja`, `sub_en`) populated from module maps, prices taken from `fallback_map`, and `scrape_status` set to `status`.
    """
    return [
        ApiModel(
            provider="Anthropic",
            name=n,
            tag=_TAG.get(n, ""),
            cls=_CLS.get(n, "tag-bal"),
            price_in=fallback_map[n][0],
            price_out=fallback_map[n][1],
            sub_ja=_SUB_JA.get(n, ""),
            sub_en=_SUB_EN.get(n, ""),
            scrape_status=status,  # type: ignore[arg-type]
        )
        for n in _FALLBACKS
    ]


def _build_models_from_results(
    results: dict[str, tuple[float, float, str]],
    fallback_map: dict[str, tuple[float, float]],
) -> list[ApiModel]:
    order = list(_FALLBACKS.keys())
    return [
        ApiModel(
            provider="Anthropic",
            name=n,
            tag=_TAG.get(n, ""),
            cls=_CLS.get(n, "tag-bal"),
            price_in=results[n][0],
            price_out=results[n][1],
            sub_ja=_SUB_JA.get(n, ""),
            sub_en=_SUB_EN.get(n, ""),
            scrape_status=results[n][2],  # type: ignore[arg-type]
        )
        for n in order
        if n in results
    ]


_TAG = {
    _CLAUDE_FABLE_5:            "最上位 Flagship",
    "Claude Opus 4.8":          "最新",
    "Claude Opus 4.7":          "Stable",
    "Claude Opus 4.6":          "Stable",
    _CLAUDE_SONNET_5:           "最新 Sonnet",
    "Claude Sonnet 4.6":        "Stable",
    "Claude Haiku 4.5":         "Fast",
    "Claude Haiku 3.5":         "Budget",
    "Claude Opus 4.1 (Legacy)": "Legacy",
}
_CLS = {
    _CLAUDE_FABLE_5:            "tag-flag",
    "Claude Opus 4.8":          "tag-flag",
    "Claude Opus 4.7":          "tag-flag",
    "Claude Opus 4.6":          "tag-flag",
    _CLAUDE_SONNET_5:           "tag-flag",
    "Claude Sonnet 4.6":        "tag-flag",
    "Claude Haiku 4.5":         "tag-mini",
    "Claude Haiku 3.5":         "tag-mini",
    "Claude Opus 4.1 (Legacy)": "tag-leg",
}
_SUB_JA = {
    _CLAUDE_FABLE_5:            "最上位モデル / 1M ctx / 長期エージェント最強 / thinking常時ON",
    "Claude Opus 4.8":          "2026年5月 / 1M ctx / Adaptive thinking / 最新フラッグシップ",
    "Claude Opus 4.7":          "SWE-bench 87.6% / コーディング特化 / Apr 2026",
    "Claude Opus 4.6":          "旧フラッグシップ / エージェントチーム / 1M ctx",
    _CLAUDE_SONNET_5:           "最新Sonnet / 8/31まで促進価格 $2/$10 (以降 $3/$15)",
    "Claude Sonnet 4.6":        "バランス最適 / 200K ctx / 前世代",
    "Claude Haiku 4.5":         "高速・高ボリューム向け",
    "Claude Haiku 3.5":         "コスト効率モデル / 前世代",
    "Claude Opus 4.1 (Legacy)": "旧フラッグシップ / 非推奨",
}
_SUB_EN = {
    _CLAUDE_FABLE_5:            "Most capable / 1M ctx / best long-horizon agent / thinking always on",
    "Claude Opus 4.8":          "May 2026 / 1M ctx / Adaptive thinking / latest flagship",
    "Claude Opus 4.7":          "SWE-bench 87.6% / Coding-focused / Apr 2026",
    "Claude Opus 4.6":          "Prev flagship / Agent teams / 1M ctx",
    _CLAUDE_SONNET_5:           "Latest Sonnet / intro $2/$10 until Aug 31 (then $3/$15)",
    "Claude Sonnet 4.6":        "Optimal balance / 200K ctx / prev-gen",
    "Claude Haiku 4.5":         "Fast / high-volume use cases",
    "Claude Haiku 3.5":         "Cost-efficient / prev-gen",
    "Claude Opus 4.1 (Legacy)": "Legacy flagship / deprecated",
}
