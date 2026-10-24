"""Microsoft Foundry（MAI シリーズ）料金スクレイパー。

対象: https://ai.azure.com/catalog/models/MAI-Thinking-1

カタログページの価格欄は空で、料金は Foundry ブログ側にのみ記載される
（"starting at" 表記）。Google と同じくライブ抽出は行わず、公式確認値の
_FALLBACKS を固定採用する。価格改定は月次で _FALLBACKS を更新して反映する。

MAI-Code-1.1-Flash は GitHub Copilot 経由のみで単体 API がないため対象外。
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text
from scraper.models import ApiModel, PriceProvenance

logger = logging.getLogger(__name__)

_URL = "https://ai.azure.com/catalog/models/MAI-Thinking-1"

_FALLBACKS: dict[str, tuple[float, float, str, str, str, str]] = {
    # name: (price_in, price_out, tag, cls, sub_ja, sub_en)
    "MAI-Thinking-1": (2.00, 8.00, "Preview", "tag-flag",
                       "初の自社推論モデル / 256K ctx / Foundry Global Standard / $2/$8〜",
                       "First in-house reasoning model / 256K ctx / Foundry Global Standard / from $2/$8"),
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """
    Builds Microsoft Foundry MAI pricing data from configured fallback values.

    Parameters:
        existing: Ignored; retained for interface compatibility.

    Returns:
        list[ApiModel]: One entry per configured fallback, with `scrape_status` "fallback".
    """
    logger.info("Microsoft: フォールバック値を使用（ライブ抽出は無効）")
    return [
        ApiModel(
            provider="Microsoft",
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
