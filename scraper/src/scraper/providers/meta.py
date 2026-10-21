"""Meta Model API（Muse シリーズ）料金スクレイパー。

対象: https://dev.meta.ai/docs/pricing-rate-limits

料金ページは Muse Spark 1.1 / 1.2 / 1.3 が同額で並び、Standard / Contributor の
2 モードが併記されるため、正規表現でモデルと価格を確実に対応付けられない。
Google と同じくライブ抽出は行わず、公式確認値の _FALLBACKS を固定採用する。
価格改定は月次で _FALLBACKS を更新して反映する。
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text
from scraper.models import ApiModel, PriceProvenance

logger = logging.getLogger(__name__)

_URL = "https://dev.meta.ai/docs/pricing-rate-limits"

_FALLBACKS: dict[str, tuple[float, float, str, str, str, str]] = {
    # name: (price_in, price_out, tag, cls, sub_ja, sub_en)  ※ Standard モード
    "Muse Wonder 1.0": (4.00, 20.00, "Preview",   "tag-flag",
                        "最上位 Preview / キャッシュ入力 $0.20", "Top-tier preview / cached input $0.20"),
    "Muse Spark 1.3":  (1.25,  4.25, "最新 Spark", "tag-bal",
                        "推奨モデル / 1M ctx / エージェント向け / 長文脈の追加料金なし",
                        "Recommended / 1M ctx / agentic / no long-context premium"),
    "Muse Spark 1.2":  (1.25,  4.25, "Stable",    "tag-bal",
                        "前版 / 1M ctx / 音声入力は 1.3 より安定", "Prev version / 1M ctx / better audio input than 1.3"),
    "Muse Spark 1.1":  (1.25,  4.25, "Stable",    "tag-bal",
                        "初の API 版 (2026-07) / 1M ctx / Standard のみ", "First API release (Jul 2026) / 1M ctx / Standard only"),
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """
    Builds Meta Model API pricing data from configured fallback values.

    Parameters:
        existing: Ignored; retained for interface compatibility.

    Returns:
        list[ApiModel]: One entry per configured fallback, with `scrape_status` "fallback".
    """
    logger.info("Meta: フォールバック値を使用（ライブ抽出は無効）")
    return [
        ApiModel(
            provider="Meta",
            name=name,
            tag=tag,
            cls=cls,
            price_in=price_in,
            price_out=price_out,
            sub_ja=sub_ja,
            sub_en=sub_en,
            scrape_status="fallback",
            # ライブ抽出を行わない設計のため、出自は常にハードコード値。
            provenance=PriceProvenance(
                origin="hardcoded", fallback_in=price_in, fallback_out=price_out
            ),
        )
        for name, (price_in, price_out, tag, cls, sub_ja, sub_en) in _FALLBACKS.items()
    ]
