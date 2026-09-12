"""xAI (Grok) 料金スクレイパー。

対象: https://x.ai/api
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel
from scraper.provenance import FallbackResolver

logger = logging.getLogger(__name__)

_URL = "https://x.ai/api"

_FALLBACKS: dict[str, tuple[float, float]] = {
    "Grok 4.6":        ( 2.00,  6.00),
    "Grok 4.5":        ( 2.00,  6.00),
    "Grok 4.3":        ( 1.25,  2.50),
    "Grok 4.20":       ( 1.25,  2.50),
    "Grok Build 0.1":  ( 1.00,  2.00),
    "Grok 4.1 Fast":   ( 0.20,  0.50),
}
_TAG = {
    "Grok 4.6":        "最新 Flagship",
    "Grok 4.5":        "Stable",
    "Grok 4.3":        "Stable",
    "Grok 4.20":       "Stable",
    "Grok Build 0.1":  "Compact",
    "Grok 4.1 Fast":   "Retired",
}
_CLS = {
    "Grok 4.6":        "tag-flag",
    "Grok 4.5":        "tag-flag",
    "Grok 4.3":        "tag-flag",
    "Grok 4.20":       "tag-flag",
    "Grok Build 0.1":  "tag-mini",
    "Grok 4.1 Fast":   "tag-leg",
}
_SUB_JA = {
    "Grok 4.6":        "最新旗艦 / 500K ctx / 200K超は $4/$12",
    "Grok 4.5":        "前旗艦 / 500K ctx / 200K超は $4/$12",
    "Grok 4.3":        "1M ctx / 200K超は $2.5/$5",
    "Grok 4.20":       "1M ctx / 値下げ ($2/$6→$1.25/$2.5)",
    "Grok Build 0.1":  "256K ctx / 軽量ビルド向け",
    "Grok 4.1 Fast":   "公式料金表から削除 (提供終了)",
}
_SUB_EN = {
    "Grok 4.6":        "Latest flagship / 500K ctx / $4/$12 above 200K",
    "Grok 4.5":        "Prev flagship / 500K ctx / $4/$12 above 200K",
    "Grok 4.3":        "1M ctx / $2.5/$5 above 200K",
    "Grok 4.20":       "1M ctx / price cut ($2/$6 to $1.25/$2.5)",
    "Grok Build 0.1":  "256K ctx / lightweight build tier",
    "Grok 4.1 Fast":   "Removed from the official price list (retired)",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    logger.info("xAI: スクレイピング開始 %s", _URL)

    # 出自（provenance）ベースのフォールバック解決。判定ルールは provenance.py を参照。
    resolver = FallbackResolver.build("xAI", _FALLBACKS, existing)
    fallback_map = resolver.prices

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.error("xAI: ページ取得失敗 %s", exc)
        return _build_fallback(resolver)

    models = []
    for name in _FALLBACKS:
        # ハードコード値ではなく fallback_map を見る（既存のスクレイプ成功値を尊重）
        fb_in, fb_out = fallback_map[name]
        key = name.lower().replace(" ", "[-\\s]?").replace(".", r"\.")
        in_price = extract_price(html, [
            rf"{key}[^$]*?\$([\d.]+)",
        ])
        out_price = extract_price(html, [
            rf"{key}[^$]*?output[^$]*?\$([\d.]+)",
        ])
        pi, si = sanity_check(in_price, f"xAI/{name}/in", fb_in)
        po, so = sanity_check(out_price, f"xAI/{name}/out", fb_out)
        models.append(ApiModel(
            provider="xAI",
            name=name,
            tag=_TAG[name], cls=_CLS[name],
            price_in=pi, price_out=po,
            sub_ja=_SUB_JA[name], sub_en=_SUB_EN[name],
            scrape_status=si if si == so else "fallback",  # type: ignore[arg-type]
            provenance=resolver.provenance(name, si == "success" and so == "success"),
        ))
    return models


def _build_fallback(resolver: FallbackResolver) -> list[ApiModel]:
    return [
        ApiModel(
            provider="xAI",
            name=n, tag=_TAG[n], cls=_CLS[n],
            price_in=resolver.prices[n][0], price_out=resolver.prices[n][1],
            sub_ja=_SUB_JA[n], sub_en=_SUB_EN[n],
            scrape_status="fallback",
            provenance=resolver.provenance(n, False),
        )
        for n in _FALLBACKS
    ]
