"""DeepSeek 料金スクレイパー。

対象: https://platform.deepseek.com/api-docs/pricing
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel
from scraper.provenance import FallbackResolver

logger = logging.getLogger(__name__)

_URL = "https://platform.deepseek.com/api-docs/pricing"

_FALLBACKS: dict[str, tuple[float, float]] = {
    "DeepSeek V4 Flash":  ( 0.30,  1.20),
    "DeepSeek V4 Pro":    ( 1.32,  3.96),
    "DeepSeek-V3.2":      ( 0.28,  0.42),
    "DeepSeek-R1":        ( 0.55,  2.19),
}
_TAG = {
    "DeepSeek V4 Flash":  "最新 Flash",
    "DeepSeek V4 Pro":    "最新 Pro",
    "DeepSeek-V3.2":      "Retired",
    "DeepSeek-R1":        "Retired",
}
_CLS = {
    "DeepSeek V4 Flash":  "tag-oss",
    "DeepSeek V4 Pro":    "tag-oss",
    "DeepSeek-V3.2":      "tag-leg",
    "DeepSeek-R1":        "tag-leg",
}
_SUB_JA = {
    "DeepSeek V4 Flash":  "1M ctx / MIT / off-peak は 50% 引き",
    "DeepSeek V4 Pro":    "高度推論 / 1.6T MoE / MIT / off-peak は 50% 引き",
    "DeepSeek-V3.2":      "公式料金表から削除 (提供終了)",
    "DeepSeek-R1":        "公式料金表から削除 (提供終了)",
}
_SUB_EN = {
    "DeepSeek V4 Flash":  "1M ctx / MIT / 50% off during off-peak",
    "DeepSeek V4 Pro":    "Advanced reasoning / 1.6T MoE / MIT / 50% off during off-peak",
    "DeepSeek-V3.2":      "Removed from the official price list (retired)",
    "DeepSeek-R1":        "Removed from the official price list (retired)",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    logger.info("DeepSeek: スクレイピング開始 %s", _URL)

    # 出自（provenance）ベースのフォールバック解決。判定ルールは provenance.py を参照。
    resolver = FallbackResolver.build("DeepSeek", _FALLBACKS, existing)
    fallback_map = resolver.prices

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.error("DeepSeek: ページ取得失敗 %s", exc)
        return _build_fallback(resolver)

    models = []
    for name in _FALLBACKS:
        # ハードコード値ではなく fallback_map を見る（既存のスクレイプ成功値を尊重）
        fb_in, fb_out = fallback_map[name]
        key = name.lower().replace("-", "[-]?").replace(".", r"\.")
        in_price = extract_price(html, [
            rf"{key}[^$]*?\$([\d.]+)",
            rf"\$([\d.]+)[^$]*?{key}",
        ])
        out_price = extract_price(html, [
            rf"{key}[^$]*?output[^$]*?\$([\d.]+)",
            rf"output[^$]*?\$([\d.]+)[^$]*?{key}",
        ])
        pi, si = sanity_check(in_price, f"DeepSeek/{name}/in", fb_in)
        po, so = sanity_check(out_price, f"DeepSeek/{name}/out", fb_out)
        models.append(ApiModel(
            provider="DeepSeek",
            name=name,
            tag=_TAG[name],
            cls=_CLS[name],
            price_in=pi,
            price_out=po,
            sub_ja=_SUB_JA[name],
            sub_en=_SUB_EN[name],
            scrape_status=si if si == so else "fallback",  # type: ignore[arg-type]
            provenance=resolver.provenance(name, si == "success" and so == "success"),
        ))
    return models


def _build_fallback(resolver: FallbackResolver) -> list[ApiModel]:
    return [
        ApiModel(
            provider="DeepSeek",
            name=n,
            tag=_TAG[n], cls=_CLS[n],
            price_in=resolver.prices[n][0], price_out=resolver.prices[n][1],
            sub_ja=_SUB_JA[n], sub_en=_SUB_EN[n],
            scrape_status="fallback",
            provenance=resolver.provenance(n, False),
        )
        for n in _FALLBACKS
    ]
