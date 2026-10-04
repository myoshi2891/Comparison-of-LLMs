"""Windsurf 料金スクレイパー。

対象: https://windsurf.com/pricing
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import SubTool

logger = logging.getLogger(__name__)

_URL = "https://windsurf.com/pricing"

_FALLBACKS: list[tuple[str, str, float, float | None, str, str, str, str]] = [
    ("Windsurf", "Free",  0,  None, "Free",       "tag-mini",
     "25 credits/月 | 全モデル対応",   "25 credits/mo | All models"),
    ("Windsurf", "Pro",   20, None, "Individual", "tag-bal",
     "Free より拡大した使用枠 | OpenAI・Claude・Gemini 等のフロンティアモデル",
     "Increased quotas | Frontier models from OpenAI, Claude, Gemini, etc."),
    ("Windsurf", "Max",   200, None, "Top Tier",  "tag-flag",
     "最上位個人プラン (2026-09 新設)", "Top individual tier (new Sep 2026)"),
    ("Windsurf", "Teams", 40, None, "Team",       "tag-bal",
     "1席あたり + 基本料 $80/月 | 管理機能", "Per seat + $80/mo base fee | admin features"),
]

# 席単価（monthly）とは別に課金される組織単位の月額基本料
_BASE_FEES: dict[str, float] = {"Teams": 80}


def scrape(existing: list[SubTool] | None = None) -> list[SubTool]:
    logger.info("Windsurf: スクレイピング開始 %s", _URL)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.warning("Windsurf: ページ取得失敗 %s → fallback", exc)
        return _build_fallback()

    tools: list[SubTool] = []
    for group, name, fb_m, fb_a, tag, cls, note_ja, note_en in _FALLBACKS:
        price = None
        if name == "Pro":
            price = extract_price(html, [r"pro[^$\n]*?\$([\d]+)\s*/\s*month"])
        elif name == "Teams":
            # 基本料（$80/month）を席単価として拾わないよう、席単価の表記に限定する
            price = extract_price(html, [
                r"team[^\n]{0,200}?\$([\d]+)\s*/\s*mo(?:nth)?\s*per\s*(?:full\s*)?(?:dev(?:eloper)?\s*)?seat",
                r"team[^$\n]{0,80}?\$([\d]+)\s*/\s*(?:user|seat)",
            ])

        cur_m = fb_m
        status = "fallback"
        if price is not None:
            new_m, s = sanity_check(price, f"Windsurf/{name}/monthly", fb_m)
            cur_m = new_m
            status = s

        tools.append(SubTool(
            group=group, name=name,
            monthly=cur_m, annual=fb_a, base_fee=_BASE_FEES.get(name),
            tag=tag, cls=cls,
            note_ja=note_ja, note_en=note_en,
            scrape_status=status,  # type: ignore[arg-type]
        ))
    return tools


def _build_fallback() -> list[SubTool]:
    return [
        SubTool(group=g, name=n, monthly=m, annual=a, base_fee=_BASE_FEES.get(n),
                tag=t, cls=c,
                note_ja=nj, note_en=ne, scrape_status="fallback")
        for g, n, m, a, t, c, nj, ne in _FALLBACKS
    ]
