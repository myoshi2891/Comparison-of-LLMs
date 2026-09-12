"""Zhipu(GLM) 料金スクレイパー。

対象: https://z.ai/pricing （国際版。bigmodel.cn は不可）
中国系 OSS 系ラボ。DeepSeek と同じ抽出パターン（cls="tag-oss"）。
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, model_key_pattern, sanity_check
from scraper.models import ApiModel
from scraper.provenance import FallbackResolver

logger = logging.getLogger(__name__)

_PROVIDER = "Zhipu(GLM)"
_URL = "https://z.ai/pricing"

# フォールバック価格（USD / 1M tokens）
_FALLBACKS: dict[str, tuple[float, float]] = {
    "GLM-5.3":        ( 1.40,  4.40),
    "GLM-5.2":        ( 1.40,  4.40),
    "GLM-4.6":        ( 0.60,  2.20),
    "GLM-5.3-Flash":  ( 0.15,  0.50),
}
_TAG = {
    "GLM-5.3":        "最新 Flagship",
    "GLM-5.2":        "Stable",
    "GLM-4.6":        "Budget",
    "GLM-5.3-Flash":  "Budget",
}
_CLS = {
    "GLM-5.3":        "tag-oss",
    "GLM-5.2":        "tag-oss",
    "GLM-4.6":        "tag-oss",
    "GLM-5.3-Flash":  "tag-oss",
}
_SUB_JA = {
    "GLM-5.3":        "最新旗艦 / OSS / 高コスパ",
    "GLM-5.2":        "前世代旗艦 / OSS",
    "GLM-4.6":        "低コスト枠 / OSS / 前世代 (公式値へ修正)",
    "GLM-5.3-Flash":  "最安クラス / OSS / 大量処理向け",
}
_SUB_EN = {
    "GLM-5.3":        "Latest flagship / OSS / cost-efficient",
    "GLM-5.2":        "Prev flagship / OSS",
    "GLM-4.6":        "Budget tier / OSS / prev-gen (corrected to official)",
    "GLM-5.3-Flash":  "Cheapest class / OSS / high-volume",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """
    Extract Zhipu(GLM) model pricing and build API model records.
    
    Parameters:
    	existing (list[ApiModel] | None): Existing Zhipu(GLM) records used to supply prices if page retrieval fails.
    
    Returns:
    	list[ApiModel]: Model records with extracted prices or fallback prices.
    """
    logger.info("Zhipu(GLM): スクレイピング開始 %s", _URL)

    # 出自（provenance）ベースのフォールバック解決。判定ルールは provenance.py を参照。
    resolver = FallbackResolver.build(_PROVIDER, _FALLBACKS, existing)
    fallback_map = resolver.prices

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception:
        logger.exception("Zhipu(GLM): ページ取得失敗")
        return _build_fallback(resolver)

    models = []
    for name in _FALLBACKS:
        # ハードコード値ではなく fallback_map を見る（既存のスクレイプ成功値を尊重）
        fb_in, fb_out = fallback_map[name]
        key = model_key_pattern(name, _FALLBACKS)
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
            provenance=resolver.provenance(name, si == "success" and so == "success", (pi, po)),
        ))
    return models


def _build_fallback(resolver: FallbackResolver) -> list[ApiModel]:
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
            price_in=resolver.prices[n][0], price_out=resolver.prices[n][1],
            sub_ja=_SUB_JA[n], sub_en=_SUB_EN[n],
            scrape_status="fallback",
            provenance=resolver.provenance(n, False),
        )
        for n in _FALLBACKS
    ]
