"""Google AI Studio / Vertex AI 料金スクレイパー。

対象:
  - Google AI Studio: https://ai.google.dev/pricing
  - Vertex AI:        https://cloud.google.com/vertex-ai/generative-ai/pricing
"""

from __future__ import annotations
import logging
from datetime import date

from scraper.browser import get_page_text
from scraper.models import ApiModel, PriceProvenance

logger = logging.getLogger(__name__)

_URL_GOOGLE_AI = "https://ai.google.dev/pricing"
_URL_VERTEX = "https://cloud.google.com/vertex-ai/generative-ai/pricing"

# 3.6/3.7/3.8 Flash の $0.75/$3.75 特価はこの日付まで。以降は自動的に標準価格 $1.50/$7.50 へ切り替える。
_FLASH_PROMO_EXPIRY = date(2026, 12, 31)
_FLASH_PROMO_NAMES = {"Gemini 3.8 Flash", "Gemini 3.6 Flash"}
_FLASH_STANDARD_PRICE = (1.50, 7.50)

# Gemini 4 Argon の $2/$10 導入価格はこの日付まで。2026-12-01 以降は標準価格 $4/$20。
# 切り替えは実行時判定のため、配信中の pricing.json へ反映するには 2026-12-01 以降に
# update.sh を実行して生成物をコミットする必要がある（月次更新で実施）。
_ARGON_NAME = "Gemini 4 Argon"
_ARGON_PROMO_EXPIRY = date(2026, 11, 30)
_ARGON_STANDARD_PRICE = (4.00, 20.00)


def _resolve_price(name: str, price_in: float, price_out: float) -> tuple[float, float]:
    if name in _FLASH_PROMO_NAMES and date.today() > _FLASH_PROMO_EXPIRY:
        return _FLASH_STANDARD_PRICE
    if name == _ARGON_NAME and date.today() > _ARGON_PROMO_EXPIRY:
        return _ARGON_STANDARD_PRICE
    return price_in, price_out


_FALLBACKS: dict[str, tuple[float, float, str, str, str, str, str]] = {
    # name: (price_in, price_out, provider, tag, cls, sub_ja, sub_en)
    _ARGON_NAME:              (2.00,  10.00, "Google AI", "最新 Flagship", "tag-flag", "最新旗艦 / 2026-11-30までの特価 (以降 $4/$20) / キャッシュ入力95%引き", "Latest flagship / promo through 2026-11-30 (then $4/$20) / 95% off cached input"),
    "Gemini 3.1 Pro Preview": (2.00,  12.00, "Google AI", "Preview",  "tag-flag", "前世代 Pro / 1M ctx / 200K超は $4/$18", "Prev-gen Pro / 1M ctx / $4/$18 above 200K"),
    "Gemini 3.8 Flash":       (0.75,   3.75, "Google AI", "最新 Flash", "tag-bal", "最新Flash / 1M ctx / 2026-12-31までの特価 (以降 $1.5/$7.5)", "Latest Flash / 1M ctx / promo through 2026-12-31 (then $1.5/$7.5)"),
    "Gemini 3.7 Flash":       (0.75,   3.75, "Google AI", "Retired",  "tag-leg",  "公式料金表から削除 (提供終了)",   "Removed from the official price list (retired)"),
    "Gemini 3.6 Flash":       (0.75,   3.75, "Google AI", "Fast",     "tag-bal",  "1M ctx / 2026-12-31までの特価 (以降 $1.5/$7.5)", "1M ctx / promo through 2026-12-31 (then $1.5/$7.5)"),
    "Gemini Omni Flash":      (1.50,   9.00, "Google AI", "Multimodal", "tag-bal", "マルチモーダル生成 / テキスト出力 (動画出力は $17.5)", "Multimodal generation / text output (video output $17.5)"),
    "Gemini 3.5 Flash":       (1.50,   9.00, "Google AI", "Retired",  "tag-leg",  "公式料金表から削除 (提供終了)",   "Removed from the official price list (retired)"),
    "Gemini 3.5 Flash-Lite":  (0.30,   2.50, "Google AI", "Budget",   "tag-mini", "2026-07-21 新バジェット枠 / 1M ctx / 大量処理", "Jul 2026 new budget tier / 1M ctx / high-volume"),
    "Gemini 3.1 Flash-Lite":  (0.25,   1.50, "Google AI", "Budget",   "tag-mini", "バジェット枠 / 1M ctx / 音声入力は $0.50", "Budget tier / 1M ctx / audio input $0.50"),
    "Gemini 2.5 Pro":         (1.25,  10.00, "Google AI", "Flagship", "tag-flag", "コーディング最強 / 1M ctx",    "Top coding model / 1M ctx"),
    "Gemini 3 Flash Preview": (0.50,   3.00, "Google AI", "Legacy",   "tag-leg",  "レガシー Preview (料金表に残存)", "Legacy preview (still on the price list)"),
    "Gemini 2.5 Flash":       (0.30,   2.50, "Google AI", "Fast",     "tag-bal",  "バランス高速 / 1M ctx",         "Balanced & fast / 1M ctx"),
    "Gemini 2.5 Flash-Lite":  (0.10,   0.40, "Google AI", "Budget",   "tag-mini", "超低コスト / 1M ctx",           "Ultra low cost / 1M ctx"),
    "Gemini 2.5 Pro (Vertex)":        (1.25,  10.00, "Vertex AI", "GCP Enterprise", "tag-vtx",
                                       "Google AIと同額 / GCP SLA / ≤200K", "Same as Google AI / GCP SLA / ≤200K"),
    "Gemini 2.5 Pro >200K (Vertex)":  (2.50,  15.00, "Vertex AI", "Long Context",   "tag-vtx",
                                       "200K超コンテキスト / VPC Controls", ">200K context / VPC Controls"),
    "Gemini 2.5 Flash (Vertex)":      (0.30,   2.50, "Vertex AI", "GCP Fast",       "tag-vtx",
                                       "同Google AI料金 / GCP課金 / 1M", "Same as Google AI / GCP billing / 1M"),
    "Gemini 2.5 Flash-Lite (Vertex)": (0.10,   0.40, "Vertex AI", "GCP Budget",     "tag-vtx",
                                       "最安 / GCP無料枠あり / 1M", "Lowest cost / GCP free tier / 1M"),
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """
    Builds API model pricing data for Google AI and Vertex AI from configured fallback values.
    
    Parameters:
        existing: Ignored; retained for interface compatibility.
    
    Returns:
        list[ApiModel]: One model entry for each configured fallback, each with
            `scrape_status` set to `"fallback"`.
    """
    logger.info("Google AI / Vertex AI: フォールバック値を使用（ライブ抽出は無効）")

    models: list[ApiModel] = []
    for name, (price_in, price_out, provider, tag, cls, sub_ja, sub_en) in _FALLBACKS.items():
        price_in, price_out = _resolve_price(name, price_in, price_out)
        models.append(
            ApiModel(
                provider=provider,
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
        )
    return models
