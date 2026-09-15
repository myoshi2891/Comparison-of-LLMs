"""OpenAI 公式料金ページスクレイパー。

対象: https://openai.com/api/pricing/
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, model_key_pattern, sanity_check
from scraper.models import ApiModel
from scraper.provenance import FallbackResolver

logger = logging.getLogger(__name__)

_URL = "https://openai.com/api/pricing/"

_GPT_6_ASTRA = "GPT-6 Astra"
_GPT_5_6_SOL = "GPT-5.6 Sol"
_GPT_5_6_TERRA = "GPT-5.6 Terra"
_GPT_5_6_LUNA = "GPT-5.6 Luna"
_GPT_5_5_PRO = "GPT-5.5 Pro"
_GPT_5_5 = "GPT-5.5"
_GPT_5_3_CODEX = "GPT-5.3 Codex"
_GPT_5_2_PRO = "GPT-5.2 Pro"
_GPT_5_2 = "GPT-5.2"
_GPT_5_1 = "GPT-5.1"
_O3_PRO = "o3-pro"
_O1 = "o1"
_O3 = "o3"
_O4_MINI = "o4-mini"
_GPT_5_PRO = "GPT-5 Pro"
_GPT_5_4 = "GPT-5.4"
_GPT_5 = "GPT-5"
_GPT_4O_LATEST = "GPT-4o-latest"
_GPT_4O = "GPT-4o"
_GPT_4_1 = "GPT-4.1"
_GPT_5_4_MINI = "GPT-5.4-mini"
_GPT_5_MINI = "GPT-5 Mini"
_GPT_4_1_MINI = "GPT-4.1 Mini"
_GPT_4O_MINI = "GPT-4o Mini"
_GPT_5_4_NANO = "GPT-5.4 Nano"
_GPT_4_1_NANO = "GPT-4.1 Nano"
_GPT_5_NANO = "GPT-5 Nano"

_FALLBACKS: dict[str, tuple[float, float]] = {
    _GPT_6_ASTRA:     ( 10.00,  50.00),
    _GPT_5_6_SOL:     (  4.00,  20.00),
    _GPT_5_6_TERRA:   (  2.00,  12.00),
    _GPT_5_6_LUNA:    (  0.20,   1.20),
    _GPT_5_5_PRO:     ( 30.00, 180.00),
    _GPT_5_5:         (  5.00,  30.00),
    _GPT_5_3_CODEX:   (  1.75,  14.00),
    _GPT_5_2_PRO:     ( 21.00, 168.00),
    _GPT_5_2:         (  1.75,  14.00),
    _GPT_5_1:         (  1.25,  10.00),
    _O3_PRO:          ( 20.00,  80.00),
    _O1:              ( 15.00,  60.00),
    _O3:              (  2.00,   8.00),
    _O4_MINI:         (  1.10,   4.40),
    _GPT_5_PRO:       ( 15.00, 120.00),
    _GPT_5_4:         (  2.50,  15.00),
    _GPT_5:           (  1.25,  10.00),
    _GPT_4O_LATEST:   (  5.00,  15.00),
    _GPT_4O:          (  2.50,  10.00),
    _GPT_4_1:         (  2.00,   8.00),
    _GPT_5_4_MINI:    (  0.75,   4.50),
    _GPT_5_MINI:      (  0.25,   2.00),
    _GPT_4_1_MINI:    (  0.40,   1.60),
    _GPT_4O_MINI:     (  0.15,   0.60),
    _GPT_5_4_NANO:    (  0.20,   1.25),
    _GPT_4_1_NANO:    (  0.10,   0.40),
    _GPT_5_NANO:      (  0.05,   0.40),
}

_TAG = {
    _GPT_6_ASTRA:     "最新 Flagship",
    _GPT_5_6_SOL:     "Flagship",
    _GPT_5_6_TERRA:   "Balanced",
    _GPT_5_6_LUNA:    "Value",
    _GPT_5_5_PRO:     "Pro 最高品質",
    _GPT_5_5:         "Stable",
    _GPT_5_3_CODEX:   "Codex 特化",
    _GPT_5_2_PRO:     "Pro",
    _GPT_5_2:         "Stable",
    _GPT_5_1:         "Stable",
    _O3_PRO:          "Reasoning",
    _O1:              "Legacy",
    _O3:              "Reasoning ↓80%OFF",
    _O4_MINI:         "Reasoning",
    _GPT_5_PRO:       "Pro",
    _GPT_5_4:         "Flagship",
    _GPT_5:           "Flagship",
    _GPT_4O_LATEST:   "Latest",
    _GPT_4O:          "Stable",
    _GPT_4_1:         "New",
    _GPT_5_4_MINI:    "Mini",
    _GPT_5_MINI:      "Balanced",
    _GPT_4_1_MINI:    "Mini",
    _GPT_4O_MINI:     "Budget",
    _GPT_5_4_NANO:    "Budget",
    _GPT_4_1_NANO:    "Budget",
    _GPT_5_NANO:      "Budget",
}

_CLS = {
    _GPT_6_ASTRA:     "tag-flag",
    _GPT_5_6_SOL:     "tag-flag",
    _GPT_5_6_TERRA:   "tag-flag",
    _GPT_5_6_LUNA:    "tag-bal",
    _GPT_5_5_PRO:     "tag-rsn",
    _GPT_5_5:         "tag-flag",
    _GPT_5_3_CODEX:   "tag-bal",
    _GPT_5_2_PRO:     "tag-rsn",
    _GPT_5_2:         "tag-flag",
    _GPT_5_1:         "tag-flag",
    _O3_PRO:          "tag-rsn",
    _O1:              "tag-leg",
    _O3:              "tag-rsn",
    _O4_MINI:         "tag-rsn",
    _GPT_5_PRO:       "tag-rsn",
    _GPT_5_4:         "tag-flag",
    _GPT_5:           "tag-flag",
    _GPT_4O_LATEST:   "tag-bal",
    _GPT_4O:          "tag-bal",
    _GPT_4_1:         "tag-bal",
    _GPT_5_4_MINI:    "tag-mini",
    _GPT_5_MINI:      "tag-bal",
    _GPT_4_1_MINI:    "tag-mini",
    _GPT_4O_MINI:     "tag-mini",
    _GPT_5_4_NANO:    "tag-mini",
    _GPT_4_1_NANO:    "tag-mini",
    _GPT_5_NANO:      "tag-mini",
}

_SUB_JA = {
    _GPT_6_ASTRA:     "最新フラッグシップ / GPT-6 世代",
    _GPT_5_6_SOL:     "1M ctx / 2026-07 値下げ ($5/$30→$4/$20)",
    _GPT_5_6_TERRA:   "バランス型 / 1M ctx / 値下げ済み",
    _GPT_5_6_LUNA:    "コスト重視 / 1M ctx / 大幅値下げ ($1/$6→$0.2/$1.2)",
    _GPT_5_5_PRO:     "最高品質 Pro ティア / 長考型",
    _GPT_5_5:         "前フラッグシップ / 1M ctx / May 2026",
    _GPT_5_3_CODEX:   "コーディングエージェント特化 (Codex)",
    _GPT_5_2_PRO:     "Pro ティア / 高品質推論",
    _GPT_5_2:         "汎用フラッグシップ / 高コスパ",
    _GPT_5_1:         "GPT-5 系 安定版",
    _O3_PRO:          "最高品質推論 / Jun 2025",
    _O1:              "旧推論フラッグシップ",
    _O3:              "Jun 2025: $10→$2 値下げ",
    _O4_MINI:         "軽量推論 / 200K ctx",
    _GPT_5_PRO:       "GPT-5 世代の Pro ティア",
    _GPT_5_4:         "フラッグシップ / 1M ctx / Apr 2026",
    _GPT_5:           "SWE-bench最高クラス / 400K",
    _GPT_4O_LATEST:   "ChatGPT最新版追跡モデル",
    _GPT_4O:          "マルチモーダル安定版 / 128K",
    _GPT_4_1:         "1Mコンテキスト / Apr 2025",
    _GPT_5_4_MINI:    "高速小型 / Apr 2026",
    _GPT_5_MINI:      "汎用バランスモデル / 400K",
    _GPT_4_1_MINI:    "1Mコンテキスト軽量版",
    _GPT_4O_MINI:     "コスト重視マルチモーダル",
    _GPT_5_4_NANO:    "超低コスト / Apr 2026",
    _GPT_4_1_NANO:    "4.1系の最安クラス / 1M ctx",
    _GPT_5_NANO:      "最安クラス / 大量分類向け",
}

_SUB_EN = {
    _GPT_6_ASTRA:     "Latest flagship / GPT-6 generation",
    _GPT_5_6_SOL:     "1M ctx / price cut Jul 2026 ($5/$30 to $4/$20)",
    _GPT_5_6_TERRA:   "Balanced / 1M ctx / price cut applied",
    _GPT_5_6_LUNA:    "Value tier / 1M ctx / major price cut ($1/$6 to $0.2/$1.2)",
    _GPT_5_5_PRO:     "Top-quality Pro tier / extended reasoning",
    _GPT_5_5:         "Prev flagship / 1M ctx / May 2026",
    _GPT_5_3_CODEX:   "Coding-agent specialized (Codex)",
    _GPT_5_2_PRO:     "Pro tier / high-quality reasoning",
    _GPT_5_2:         "General flagship / good value",
    _GPT_5_1:         "GPT-5 line / stable",
    _O3_PRO:          "Highest quality reasoning / Jun 2025",
    _O1:              "Legacy reasoning flagship",
    _O3:              "Jun 2025: $10 to $2 price cut",
    _O4_MINI:         "Lightweight reasoning / 200K ctx",
    _GPT_5_PRO:       "Pro tier of the GPT-5 generation",
    _GPT_5_4:         "Flagship / 1M ctx / Apr 2026",
    _GPT_5:           "Top-class SWE-bench / 400K",
    _GPT_4O_LATEST:   "Tracks the latest ChatGPT model",
    _GPT_4O:          "Stable multimodal / 128K",
    _GPT_4_1:         "1M context / Apr 2025",
    _GPT_5_4_MINI:    "Fast and small / Apr 2026",
    _GPT_5_MINI:      "General balanced model / 400K",
    _GPT_4_1_MINI:    "1M context lightweight",
    _GPT_4O_MINI:     "Cost-focused multimodal",
    _GPT_5_4_NANO:    "Ultra low cost / Apr 2026",
    _GPT_4_1_NANO:    "Cheapest of the 4.1 line / 1M ctx",
    _GPT_5_NANO:      "Cheapest class / bulk classification",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """OpenAI の価格をスクレイピングして ApiModel リストを返す。"""
    logger.info("OpenAI: スクレイピング開始 %s", _URL)

    # 出自（provenance）ベースのフォールバック解決。判定ルールは provenance.py を参照。
    resolver = FallbackResolver.build("OpenAI", _FALLBACKS, existing)
    fallback_map = resolver.prices

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.error("OpenAI: ページ取得失敗 %s", exc)
        return _build_fallback(resolver)

    models = []
    for name in _FALLBACKS:
        # ハードコード値ではなく fallback_map を見る（既存のスクレイプ成功値を尊重）
        fb_in, fb_out = fallback_map[name]
        # モデル名をキーに周辺の価格テキストを探す
        key = model_key_pattern(name, _FALLBACKS)
        in_price = extract_price(html, [
            rf"{key}[^$]*?\$([\d.]+)\s*/\s*1M.*?input",
            rf"{key}[^$]*?\$([\d.]+)\s*per\s*(?:1M|million).*?input",
            rf"input[^$]*?\$([\d.]+)[^$]*?{key}",
        ])
        out_price = extract_price(html, [
            rf"{key}[^$]*?output[^$]*?\$([\d.]+)",
            rf"output[^$]*?\$([\d.]+)[^$]*?{key}",
        ])
        pi, si = sanity_check(in_price, f"OpenAI/{name}/in", fb_in)
        po, so = sanity_check(out_price, f"OpenAI/{name}/out", fb_out)
        status = si if si == so else "fallback"
        models.append(ApiModel(
            provider="OpenAI",
            name=name,
            tag=_TAG.get(name, ""),
            cls=_CLS.get(name, "tag-bal"),
            price_in=pi,
            price_out=po,
            sub_ja=_SUB_JA.get(name, ""),
            sub_en=_SUB_EN.get(name, ""),
            scrape_status=status,  # type: ignore[arg-type]
            provenance=resolver.provenance(name, status == "success", (pi, po)),
        ))

    return models


def _build_fallback(resolver: FallbackResolver) -> list[ApiModel]:
    return [
        ApiModel(
            provider="OpenAI",
            name=n,
            tag=_TAG.get(n, ""),
            cls=_CLS.get(n, "tag-bal"),
            price_in=resolver.prices[n][0],
            price_out=resolver.prices[n][1],
            sub_ja=_SUB_JA.get(n, ""),
            sub_en=_SUB_EN.get(n, ""),
            scrape_status="fallback",
            provenance=resolver.provenance(n, False),
        )
        for n in _FALLBACKS
    ]
