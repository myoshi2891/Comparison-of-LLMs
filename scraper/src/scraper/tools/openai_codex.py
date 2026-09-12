"""OpenAI Codex (ChatGPT) 料金スクレイパー。

対象: https://openai.com/chatgpt/pricing/
"""

from __future__ import annotations
import logging

from scraper.browser import get_page_text, extract_price, sanity_check
from scraper.models import SubTool

logger = logging.getLogger(__name__)

_URL = "https://openai.com/chatgpt/pricing/"

# プラン名と価格の距離を制限する。無制限（[^$\n]*?）にすると、改行の少ない
# 巨大な 1 塊テキストを横断して無関係な金額（別ティアの月額など）に到達しうる。
_GAP = r"[^$\n]{0,80}?"

_FALLBACKS: list[tuple[str, str, float, float | None, str, str, str, str]] = [
    ("OpenAI Codex", "ChatGPT Plus (Codex)",  20,  None, "Plus", "tag-bal",
     "30-150 tasks/5h | codex-1",    "30-150 tasks/5h | codex-1"),
    ("OpenAI Codex", "ChatGPT Pro Codex",    100,  None, "Pro Codex", "tag-flag",
     "Codex 上限拡大ティア | 2026-04 新設", "Elevated Codex limits | added Apr 2026"),
    ("OpenAI Codex", "ChatGPT Pro (Codex)",  200,  None, "Pro Max",   "tag-flag",
     "300-1500 tasks/5h | 全機能",   "300-1500 tasks/5h | All features"),
]


def scrape(existing: list[SubTool] | None = None) -> list[SubTool]:
    logger.info("OpenAI Codex: スクレイピング開始 %s", _URL)

    try:
        html = get_page_text(_URL, timeout_ms=40_000)
    except Exception as exc:
        logger.warning("OpenAI Codex: ページ取得失敗 %s → fallback", exc)
        return _build_fallback()

    tools: list[SubTool] = []
    for group, name, fb_m, fb_a, tag, cls, note_ja, note_en in _FALLBACKS:
        price = None
        if name == "ChatGPT Plus (Codex)":
            price = extract_price(html, [rf"plus{_GAP}\$([\d]+)\s*/\s*month"])
        elif name == "ChatGPT Pro Codex":
            # Pro が 2 ティアに分割されたため、総称の "pro" では両行が同じ値になる。
            price = extract_price(html, [rf"pro\s+codex{_GAP}\$([\d]+)\s*/\s*month"])
        elif name == "ChatGPT Pro (Codex)":
            price = extract_price(html, [rf"pro\s+max{_GAP}\$([\d]+)\s*/\s*month"])

        cur_m = fb_m
        status = "fallback"
        if price is not None:
            new_m, s = sanity_check(price, f"OpenAICodex/{name}/monthly", fb_m)
            cur_m = new_m
            status = s

        tools.append(SubTool(
            group=group, name=name,
            monthly=cur_m, annual=fb_a,
            tag=tag, cls=cls,
            note_ja=note_ja, note_en=note_en,
            scrape_status=status,  # type: ignore[arg-type]
        ))
    return tools


def _build_fallback() -> list[SubTool]:
    return [
        SubTool(group=g, name=n, monthly=m, annual=a, tag=t, cls=c,
                note_ja=nj, note_en=ne, scrape_status="fallback")
        for g, n, m, a, t, c, nj, ne in _FALLBACKS
    ]
