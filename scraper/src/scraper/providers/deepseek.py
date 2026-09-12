"""DeepSeek 料金スクレイパー。

対象: https://platform.deepseek.com/api-docs/pricing
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel

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

    fallback_map: dict[str, tuple[float, float]] = {}
    if existing:
        for m in existing:
            # 過去に実際にスクレイプ成功した値のみをフォールバックとして採用する。
            # 単なるフォールバック値の写しを優先すると、_FALLBACKS 側の価格改定が
            # 既存 JSON に固着して永久に反映されなくなる。
            if m.provider == "DeepSeek" and m.scrape_status == "success":
                fallback_map[m.name] = (m.price_in, m.price_out)
    for k, v in _FALLBACKS.items():
        fallback_map.setdefault(k, v)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.error("DeepSeek: ページ取得失敗 %s", exc)
        return _build_fallback(fallback_map)

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
        ))
    return models


def _build_fallback(fallback_map: dict[str, tuple[float, float]]) -> list[ApiModel]:
    return [
        ApiModel(
            provider="DeepSeek",
            name=n,
            tag=_TAG[n], cls=_CLS[n],
            price_in=fallback_map[n][0], price_out=fallback_map[n][1],
            sub_ja=_SUB_JA[n], sub_en=_SUB_EN[n],
            scrape_status="fallback",
        )
        for n in _FALLBACKS
    ]
