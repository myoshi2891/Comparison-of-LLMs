"""Google AI Studio / Vertex AI 料金スクレイパー。

対象:
  - Google AI Studio: https://ai.google.dev/pricing
  - Vertex AI:        https://cloud.google.com/vertex-ai/generative-ai/pricing
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text
from scraper.models import ApiModel

logger = logging.getLogger(__name__)

_URL_GOOGLE_AI = "https://ai.google.dev/pricing"
_URL_VERTEX = "https://cloud.google.com/vertex-ai/generative-ai/pricing"

_FALLBACKS: dict[str, tuple[float, float, str, str, str, str, str]] = {
    # name: (price_in, price_out, provider, tag, cls, sub_ja, sub_en)
    "Gemini 3.1 Pro Preview": (2.00,  12.00, "Google AI", "Preview",  "tag-flag", "最新世代 / 1M ctx",            "Latest generation / 1M ctx"),
    "Gemini 3.8 Flash":       (0.75,   3.75, "Google AI", "最新 Flash", "tag-bal", "最新Flash / 1M ctx / 2026-12-31までの特価 (以降 $1.5/$7.5)", "Latest Flash / 1M ctx / promo through 2026-12-31 (then $1.5/$7.5)"),
    "Gemini 3.7 Flash":       (0.75,   3.75, "Google AI", "Fast",     "tag-bal",  "前Flash / 1M ctx / 2026-12-31までの特価 (以降 $1.5/$7.5)", "Prev Flash / 1M ctx / promo through 2026-12-31 (then $1.5/$7.5)"),
    "Gemini 3.6 Flash":       (0.75,   3.75, "Google AI", "Fast",     "tag-bal",  "1M ctx / 2026-12-31までの特価 (以降 $1.5/$7.5)", "1M ctx / promo through 2026-12-31 (then $1.5/$7.5)"),
    "Gemini 3.5 Flash":       (1.50,   9.00, "Google AI", "Fast",     "tag-bal",  "前Flash / 1M ctx / 高速推論",  "Prev Flash / 1M ctx / fast inference"),
    "Gemini 3.5 Flash-Lite":  (0.30,   2.50, "Google AI", "Budget",   "tag-mini", "2026-07-21 新バジェット枠 / 1M ctx / 大量処理", "Jul 2026 new budget tier / 1M ctx / high-volume"),
    "Gemini 3.1 Flash-Lite":  (0.25,   1.50, "Google AI", "Budget",   "tag-mini", "バジェット枠 / 1M ctx / 音声入力は $0.50", "Budget tier / 1M ctx / audio input $0.50"),
    "Gemini 2.5 Pro":         (1.25,  10.00, "Google AI", "Flagship", "tag-flag", "コーディング最強 / 1M ctx",    "Top coding model / 1M ctx"),
    "Gemini 3 Flash Preview": (0.50,   3.00, "Google AI", "Retired",  "tag-leg",  "公式料金表から削除 (提供終了)",   "Removed from the official price list (retired)"),
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

    return [
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
        )
        for name, (price_in, price_out, provider, tag, cls, sub_ja, sub_en) in _FALLBACKS.items()
    ]
