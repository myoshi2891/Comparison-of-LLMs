"""Moonshot(Kimi) 料金スクレイパー。

対象: https://platform.moonshot.ai/docs/pricing
中国系 OSS 系ラボ。DeepSeek と同じ抽出パターン（cls="tag-oss"）。
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel

logger = logging.getLogger(__name__)

_PROVIDER = "Moonshot(Kimi)"
_URL = "https://platform.moonshot.ai/docs/pricing"

# フォールバック価格（USD / 1M tokens、cache-miss 標準入力価格）
_FALLBACKS: dict[str, tuple[float, float]] = {
    "Kimi K3":   (3.00, 15.00),
    "Kimi K2.6": (0.95,  4.00),
}
_TAG = {
    "Kimi K3":   "最新 Flagship",
    "Kimi K2.6": "General",
}
_CLS = {
    "Kimi K3":   "tag-oss",
    "Kimi K2.6": "tag-oss",
}
_SUB_JA = {
    "Kimi K3":   "2.8T MoE / 1M ctx / OSS / 2026-07-16 最新旗艦",
    "Kimi K2.6": "前世代フラッグシップ / OSS / 1M ctx",
}
_SUB_EN = {
    "Kimi K3":   "2.8T MoE / 1M ctx / OSS / new flagship Jul 2026",
    "Kimi K2.6": "Prev flagship / OSS / 1M ctx",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    logger.info("Moonshot(Kimi): スクレイピング開始 %s", _URL)

    fallback_map: dict[str, tuple[float, float]] = {}
    if existing:
        for m in existing:
            if m.provider == _PROVIDER:
                fallback_map[m.name] = (m.price_in, m.price_out)
    for k, v in _FALLBACKS.items():
        fallback_map.setdefault(k, v)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception:
        logger.exception("Moonshot(Kimi): ページ取得失敗")
        return _build_fallback(fallback_map)

    models = []
    for name, (fb_in, fb_out) in _FALLBACKS.items():
        key = name.lower().replace(" ", "[-\\s]?").replace(".", r"\.")
        in_price = extract_price(html, [
            rf"{key}[^$]*?\$([\d.]+)",
        ])
        out_price = extract_price(html, [
            rf"{key}[^$]*?output[^$]*?\$([\d.]+)",
        ])
        pi, si = sanity_check(in_price, f"Moonshot/{name}/in", fb_in)
        po, so = sanity_check(out_price, f"Moonshot/{name}/out", fb_out)
        models.append(ApiModel(
            provider=_PROVIDER,
            name=name,
            tag=_TAG[name], cls=_CLS[name],
            price_in=pi, price_out=po,
            sub_ja=_SUB_JA[name], sub_en=_SUB_EN[name],
            scrape_status=si if si == so else "fallback",  # type: ignore[arg-type]
        ))
    return models


def _build_fallback(fallback_map: dict[str, tuple[float, float]]) -> list[ApiModel]:
    return [
        ApiModel(
            provider=_PROVIDER,
            name=n, tag=_TAG[n], cls=_CLS[n],
            price_in=fallback_map[n][0], price_out=fallback_map[n][1],
            sub_ja=_SUB_JA[n], sub_en=_SUB_EN[n],
            scrape_status="fallback",
        )
        for n in _FALLBACKS
    ]
