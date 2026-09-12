"""OpenAI 公式料金ページスクレイパー。

対象: https://openai.com/api/pricing/
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import ApiModel

logger = logging.getLogger(__name__)

_URL = "https://openai.com/api/pricing/"

_FALLBACKS: dict[str, tuple[float, float]] = {
    "GPT-6 Astra":    ( 10.00,  50.00),
    "GPT-5.6 Sol":    (  4.00,  20.00),
    "GPT-5.6 Terra":  (  2.00,  12.00),
    "GPT-5.6 Luna":   (  0.20,   1.20),
    "GPT-5.5 Pro":    ( 30.00, 180.00),
    "GPT-5.5":        (  5.00,  30.00),
    "GPT-5.3 Codex":  (  1.75,  14.00),
    "GPT-5.2 Pro":    ( 21.00, 168.00),
    "GPT-5.2":        (  1.75,  14.00),
    "GPT-5.1":        (  1.25,  10.00),
    "o3-pro":         ( 20.00,  80.00),
    "o1":             ( 15.00,  60.00),
    "o3":             (  2.00,   8.00),
    "o4-mini":        (  1.10,   4.40),
    "GPT-5 Pro":      ( 15.00, 120.00),
    "GPT-5.4":        (  2.50,  15.00),
    "GPT-5":          (  1.25,  10.00),
    "GPT-4o-latest":  (  5.00,  15.00),
    "GPT-4o":         (  2.50,  10.00),
    "GPT-4.1":        (  2.00,   8.00),
    "GPT-5.4-mini":   (  0.75,   4.50),
    "GPT-5 Mini":     (  0.25,   2.00),
    "GPT-4.1 Mini":   (  0.40,   1.60),
    "GPT-4o Mini":    (  0.15,   0.60),
    "GPT-5.4 Nano":   (  0.20,   1.25),
    "GPT-4.1 Nano":   (  0.10,   0.40),
    "GPT-5 Nano":     (  0.05,   0.40),
}

_TAG = {
    "GPT-6 Astra":    "最新 Flagship",
    "GPT-5.6 Sol":    "Flagship",
    "GPT-5.6 Terra":  "Balanced",
    "GPT-5.6 Luna":   "Value",
    "GPT-5.5 Pro":    "Pro 最高品質",
    "GPT-5.5":        "Stable",
    "GPT-5.3 Codex":  "Codex 特化",
    "GPT-5.2 Pro":    "Pro",
    "GPT-5.2":        "Stable",
    "GPT-5.1":        "Stable",
    "o3-pro":         "Reasoning",
    "o1":             "Legacy",
    "o3":             "Reasoning ↓80%OFF",
    "o4-mini":        "Reasoning",
    "GPT-5 Pro":      "Pro",
    "GPT-5.4":        "Flagship",
    "GPT-5":          "Flagship",
    "GPT-4o-latest":  "Latest",
    "GPT-4o":         "Stable",
    "GPT-4.1":        "New",
    "GPT-5.4-mini":   "Mini",
    "GPT-5 Mini":     "Balanced",
    "GPT-4.1 Mini":   "Mini",
    "GPT-4o Mini":    "Budget",
    "GPT-5.4 Nano":   "Budget",
    "GPT-4.1 Nano":   "Budget",
    "GPT-5 Nano":     "Budget",
}

_CLS = {
    "GPT-6 Astra":    "tag-flag",
    "GPT-5.6 Sol":    "tag-flag",
    "GPT-5.6 Terra":  "tag-flag",
    "GPT-5.6 Luna":   "tag-bal",
    "GPT-5.5 Pro":    "tag-rsn",
    "GPT-5.5":        "tag-flag",
    "GPT-5.3 Codex":  "tag-bal",
    "GPT-5.2 Pro":    "tag-rsn",
    "GPT-5.2":        "tag-flag",
    "GPT-5.1":        "tag-flag",
    "o3-pro":         "tag-rsn",
    "o1":             "tag-leg",
    "o3":             "tag-rsn",
    "o4-mini":        "tag-rsn",
    "GPT-5 Pro":      "tag-rsn",
    "GPT-5.4":        "tag-flag",
    "GPT-5":          "tag-flag",
    "GPT-4o-latest":  "tag-bal",
    "GPT-4o":         "tag-bal",
    "GPT-4.1":        "tag-bal",
    "GPT-5.4-mini":   "tag-mini",
    "GPT-5 Mini":     "tag-bal",
    "GPT-4.1 Mini":   "tag-mini",
    "GPT-4o Mini":    "tag-mini",
    "GPT-5.4 Nano":   "tag-mini",
    "GPT-4.1 Nano":   "tag-mini",
    "GPT-5 Nano":     "tag-mini",
}

_SUB_JA = {
    "GPT-6 Astra":    "最新フラッグシップ / GPT-6 世代",
    "GPT-5.6 Sol":    "1M ctx / 2026-07 値下げ ($5/$30→$4/$20)",
    "GPT-5.6 Terra":  "バランス型 / 1M ctx / 値下げ済み",
    "GPT-5.6 Luna":   "コスト重視 / 1M ctx / 大幅値下げ ($1/$6→$0.2/$1.2)",
    "GPT-5.5 Pro":    "最高品質 Pro ティア / 長考型",
    "GPT-5.5":        "前フラッグシップ / 1M ctx / May 2026",
    "GPT-5.3 Codex":  "コーディングエージェント特化 (Codex)",
    "GPT-5.2 Pro":    "Pro ティア / 高品質推論",
    "GPT-5.2":        "汎用フラッグシップ / 高コスパ",
    "GPT-5.1":        "GPT-5 系 安定版",
    "o3-pro":         "最高品質推論 / Jun 2025",
    "o1":             "旧推論フラッグシップ",
    "o3":             "Jun 2025: $10→$2 値下げ",
    "o4-mini":        "軽量推論 / 200K ctx",
    "GPT-5 Pro":      "GPT-5 世代の Pro ティア",
    "GPT-5.4":        "フラッグシップ / 1M ctx / Apr 2026",
    "GPT-5":          "SWE-bench最高クラス / 400K",
    "GPT-4o-latest":  "ChatGPT最新版追跡モデル",
    "GPT-4o":         "マルチモーダル安定版 / 128K",
    "GPT-4.1":        "1Mコンテキスト / Apr 2025",
    "GPT-5.4-mini":   "高速小型 / Apr 2026",
    "GPT-5 Mini":     "汎用バランスモデル / 400K",
    "GPT-4.1 Mini":   "1Mコンテキスト軽量版",
    "GPT-4o Mini":    "コスト重視マルチモーダル",
    "GPT-5.4 Nano":   "超低コスト / Apr 2026",
    "GPT-4.1 Nano":   "4.1系の最安クラス / 1M ctx",
    "GPT-5 Nano":     "最安クラス / 大量分類向け",
}

_SUB_EN = {
    "GPT-6 Astra":    "Latest flagship / GPT-6 generation",
    "GPT-5.6 Sol":    "1M ctx / price cut Jul 2026 ($5/$30 to $4/$20)",
    "GPT-5.6 Terra":  "Balanced / 1M ctx / price cut applied",
    "GPT-5.6 Luna":   "Value tier / 1M ctx / major price cut ($1/$6 to $0.2/$1.2)",
    "GPT-5.5 Pro":    "Top-quality Pro tier / extended reasoning",
    "GPT-5.5":        "Prev flagship / 1M ctx / May 2026",
    "GPT-5.3 Codex":  "Coding-agent specialized (Codex)",
    "GPT-5.2 Pro":    "Pro tier / high-quality reasoning",
    "GPT-5.2":        "General flagship / good value",
    "GPT-5.1":        "GPT-5 line / stable",
    "o3-pro":         "Highest quality reasoning / Jun 2025",
    "o1":             "Legacy reasoning flagship",
    "o3":             "Jun 2025: $10 to $2 price cut",
    "o4-mini":        "Lightweight reasoning / 200K ctx",
    "GPT-5 Pro":      "Pro tier of the GPT-5 generation",
    "GPT-5.4":        "Flagship / 1M ctx / Apr 2026",
    "GPT-5":          "Top-class SWE-bench / 400K",
    "GPT-4o-latest":  "Tracks the latest ChatGPT model",
    "GPT-4o":         "Stable multimodal / 128K",
    "GPT-4.1":        "1M context / Apr 2025",
    "GPT-5.4-mini":   "Fast and small / Apr 2026",
    "GPT-5 Mini":     "General balanced model / 400K",
    "GPT-4.1 Mini":   "1M context lightweight",
    "GPT-4o Mini":    "Cost-focused multimodal",
    "GPT-5.4 Nano":   "Ultra low cost / Apr 2026",
    "GPT-4.1 Nano":   "Cheapest of the 4.1 line / 1M ctx",
    "GPT-5 Nano":     "Cheapest class / bulk classification",
}


def scrape(existing: list[ApiModel] | None = None) -> list[ApiModel]:
    """OpenAI の価格をスクレイピングして ApiModel リストを返す。"""
    logger.info("OpenAI: スクレイピング開始 %s", _URL)

    fallback_map: dict[str, tuple[float, float]] = {}
    if existing:
        for m in existing:
            # 過去に実際にスクレイプ成功した値のみをフォールバックとして採用する。
            # 単なるフォールバック値の写しを優先すると、_FALLBACKS 側の価格改定が
            # 既存 JSON に固着して永久に反映されなくなる。
            if m.provider == "OpenAI" and m.scrape_status == "success":
                fallback_map[m.name] = (m.price_in, m.price_out)
    for k, v in _FALLBACKS.items():
        fallback_map.setdefault(k, v)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.error("OpenAI: ページ取得失敗 %s", exc)
        return _build_fallback(fallback_map)

    models = []
    for name in _FALLBACKS:
        # ハードコード値ではなく fallback_map を見る（既存のスクレイプ成功値を尊重）
        fb_in, fb_out = fallback_map[name]
        # モデル名をキーに周辺の価格テキストを探す
        key = name.lower().replace(" ", "[-\\s]?").replace(".", r"\.")
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
        ))

    return models


def _build_fallback(fallback_map: dict[str, tuple[float, float]]) -> list[ApiModel]:
    return [
        ApiModel(
            provider="OpenAI",
            name=n,
            tag=_TAG.get(n, ""),
            cls=_CLS.get(n, "tag-bal"),
            price_in=fallback_map[n][0],
            price_out=fallback_map[n][1],
            sub_ja=_SUB_JA.get(n, ""),
            sub_en=_SUB_EN.get(n, ""),
            scrape_status="fallback",
        )
        for n in _FALLBACKS
    ]
