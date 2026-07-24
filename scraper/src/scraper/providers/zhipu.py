"""Zhipu(GLM) 料金スクレイパー。

対象: https://z.ai/pricing （国際版。bigmodel.cn は不可）
中国系 OSS 系ラボ。DeepSeek と同じ抽出パターン（cls="tag-oss"）。
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel

logger = logging.getLogger(__name__)

_PROVIDER = "Zhipu(GLM)"
_URL = "https://z.ai/pricing"

# フォールバック価格（USD / 1M tokens）
_FALLBACKS: dict[str, tuple[float, float]] = {
    "GLM-5.2": (1.40, 4.40),
    "GLM-4.6": (0.43, 1.74),
}
_TAG = {
    "GLM-5.2": "最新 Flagship",
    "GLM-4.6": "Budget",
}
_CLS = {
    "GLM-5.2": "tag-oss",
    "GLM-4.6": "tag-oss",
}
_SUB_JA = {
    "GLM-5.2": "最新旗艦 / OSS / 2026-06-16 / 高コスパ",
    "GLM-4.6": "低コスト枠 / OSS / 前世代",
}
_SUB_EN = {
    "GLM-5.2": "Latest flagship / OSS / Jun 2026 / cost-efficient",
    "GLM-4.6": "Budget tier / OSS / prev-gen",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """
    Extract Zhipu(GLM) model pricing and build API model records.
    
    Parameters:
    	existing (list[ApiModel] | None): Existing models whose Zhipu(GLM) prices are used as fallbacks.
    
    Returns:
    	list[ApiModel]: Model records with scraped prices, or fallback prices when retrieval or validation fails.
    """
    logger.info("Zhipu(GLM): スクレイピング開始 %s", _URL)

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
        logger.exception("Zhipu(GLM): ページ取得失敗")
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
        pi, si = sanity_check(in_price, f"Zhipu/{name}/in", fb_in)
        po, so = sanity_check(out_price, f"Zhipu/{name}/out", fb_out)
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
    """
    Build model records using the supplied fallback prices.
    
    Parameters:
    	fallback_map (dict[str, tuple[float, float]]): Maps each supported model name to its input and output prices.
    
    Returns:
    	list[ApiModel]: Model records populated with fallback pricing and metadata.
    """
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
