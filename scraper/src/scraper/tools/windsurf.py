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
     "1席あたり + 基本料 ${base_fee}/月 | 管理機能", "Per seat + ${base_fee}/mo base fee | admin features"),
]

# 席単価（monthly）とは別に課金される組織単位の月額基本料（抽出失敗時のフォールバック）
_BASE_FEES: dict[str, float] = {"Teams": 80}

# 基本料の表記に限定する（席単価 "$45/month per seat" を基本料として拾わない）
_BASE_FEE_PATTERNS: dict[str, list[str]] = {
    "Teams": [
        r"team[^$\n]{0,80}?\$([\d]+)\s*/\s*mo(?:nth)?\s*base",
        r"team[^$\n]{0,80}?base\s*fee[^$\n]{0,20}?\$([\d]+)",
    ],
}


def _extract_base_fee(html: str, name: str) -> float | None:
    """基本料をページから抽出し、失敗時は _BASE_FEES の値を返す。"""
    fallback = _BASE_FEES.get(name)
    patterns = _BASE_FEE_PATTERNS.get(name)
    if fallback is None or patterns is None:
        return fallback
    fee, _ = sanity_check(extract_price(html, patterns), f"Windsurf/{name}/base_fee", fallback)
    return fee


def _format_note(note: str, base_fee: float | None) -> str:
    """note 内の {base_fee} を採用された基本料で置換する（固定額と実値の乖離を防ぐ）。"""
    if base_fee is None or "{base_fee}" not in note:
        return note
    return note.replace("{base_fee}", f"{base_fee:g}")


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

        base_fee = _extract_base_fee(html, name)
        tools.append(SubTool(
            group=group, name=name,
            monthly=cur_m, annual=fb_a, base_fee=base_fee,
            tag=tag, cls=cls,
            note_ja=_format_note(note_ja, base_fee), note_en=_format_note(note_en, base_fee),
            scrape_status=status,  # type: ignore[arg-type]
        ))
    return tools


def _build_fallback() -> list[SubTool]:
    return [
        SubTool(group=g, name=n, monthly=m, annual=a, base_fee=_BASE_FEES.get(n),
                tag=t, cls=c,
                note_ja=_format_note(nj, _BASE_FEES.get(n)),
                note_en=_format_note(ne, _BASE_FEES.get(n)), scrape_status="fallback")
        for g, n, m, a, t, c, nj, ne in _FALLBACKS
    ]
