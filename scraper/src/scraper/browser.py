"""Playwright ブラウザの共通ユーティリティ。

price_from_page() はページを JS レンダリングしてテキストを返す。
3 層フォールバック:
  1. JSON-LD / script[type="application/json"] から抽出
  2. CSS セレクター群で抽出
  3. 正規表現でテキスト全体を検索
"""

from __future__ import annotations
import logging
from collections.abc import Iterable
import os
import re

from playwright.sync_api import sync_playwright, Page

logger = logging.getLogger(__name__)

# 価格として有効な範囲（USD / 1M トークン）
_PRICE_MIN = 0.001
_PRICE_MAX = 2000.0


def get_page_text(url: str, wait_selector: str | None = None, timeout_ms: int = 30_000) -> str:
    """
    Retrieve the full HTML content of a URL by loading it in a headless Chromium browser.
    
    Parameters:
        url (str): The target page URL to load.
        wait_selector (str | None): Optional Playwright selector to wait for before returning. If omitted, the function waits 3000 ms after navigation to allow client-side rendering.
        timeout_ms (int): Timeout in milliseconds applied to navigation and selector waiting operations.
    
    Returns:
        str: The page's full HTML content.
    """
    with sync_playwright() as p:
        _no_sandbox_val = (os.getenv("PLAYWRIGHT_NO_SANDBOX") or "").strip().lower()
        _launch_args = ["--no-sandbox"] if _no_sandbox_val in {"1", "true", "yes", "on"} else []
        browser = p.chromium.launch(headless=True, args=_launch_args)
        try:
            page: Page = browser.new_page()
            page.set_extra_http_headers({"Accept-Language": "en-US,en;q=0.9"})
            page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
            if wait_selector:
                page.wait_for_selector(wait_selector, timeout=timeout_ms)
            else:
                page.wait_for_timeout(3000)  # JS レンダリング待ち
            return page.content()
        finally:
            browser.close()


def model_key_pattern(name: str, all_names: Iterable[str]) -> str:
    """モデル名を価格抽出用の正規表現キーへ変換する。

    短い名前が「より長い派生モデル名」の価格を拾うのを防ぐため、名前の直後に
    ① 数字が続く場合、② 設定済みの他モデル名の残り（" Pro" / "-Flash" 等）が
    続く場合はマッチしない否定先読みを付ける。
    （例: "GPT-5.2" が "GPT-5.2 Pro $21.00" を拾うと価格が汚染される）

    Parameters:
        name: 対象モデル名。
        all_names: 同一プロバイダーで設定されている全モデル名。

    Returns:
        str: 否定先読み付きの正規表現キー（大小文字は呼び出し側で IGNORECASE）。
    """
    def _to_pattern(text: str) -> str:
        return text.lower().replace(" ", "[-\\s]?").replace(".", r"\.")

    key = _to_pattern(name)
    lname = name.lower()
    suffixes = sorted(
        {
            other.lower()[len(lname):]
            for other in all_names
            if other.lower() != lname and other.lower().startswith(lname)
        }
    )
    guards = [r"\d"] + [_to_pattern(s) for s in suffixes if s]
    return rf"{key}(?!{'|'.join(guards)})"


def extract_price(text: str, patterns: list[str]) -> float | None:
    """複数の正規表現パターンで最初にマッチした価格を返す。"""
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE | re.DOTALL)
        if m:
            try:
                price = float(m.group(1).replace(",", ""))
                if _PRICE_MIN <= price <= _PRICE_MAX:
                    return price
            except (ValueError, IndexError):
                pass
    return None


def sanity_check(value: float | None, name: str, fallback: float) -> tuple[float, str]:
    """値が有効範囲内かチェックし、(value, status) を返す。"""
    if value is None:
        logger.warning("%s: 抽出失敗 → fallback %.4f を使用", name, fallback)
        return fallback, "fallback"
    if not (_PRICE_MIN <= value <= _PRICE_MAX):
        logger.warning("%s: 範囲外の値 %.4f → fallback %.4f を使用", name, value, fallback)
        return fallback, "fallback"
    logger.info("%s: %.4f (success)", name, value)
    return value, "success"
