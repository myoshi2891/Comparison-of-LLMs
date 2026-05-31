"""コーディングツール（サブスク）スクレイパーの価格抽出ユニットテスト。

test_smoke.py は `<html>Mock</html>` で isinstance のみ確認するため、各ツールの
価格抽出パターンが一度も実行されない。本ファイルは get_page_text をモックし、

  - success パス: 価格を含む HTML を返し、対象プランが scrape_status == "success"
    かつ抽出した monthly（fallback と異なる値）に一致
  - fallback パス: 非マッチ入力で全プランが _FALLBACKS の monthly/annual・名前・件数に一致

を検証する。対象プランはパターン衝突を避けて名前で特定する。
"""

from __future__ import annotations

import logging
from unittest.mock import patch

import pytest

from scraper.models import SubTool
from scraper.tools import (
    antigravity,
    claude_code,
    cursor,
    github_copilot,
    google_one,
    jetbrains,
    openai_codex,
    windsurf,
)

# _FALLBACKS タプルのインデックス: (group, name, monthly, annual, tag, cls, note_ja, note_en)
_NAME, _MONTHLY, _ANNUAL = 1, 2, 3


@pytest.fixture(autouse=True)
def _silence_logging():
    """
    Temporarily suppress logging output for the duration of a test.
    
    Disables logging at and below CRITICAL, and restores the logging level to NOTSET when the fixture finishes. Intended for use as an autouse pytest fixture to silence test log output.
    """
    logging.disable(logging.CRITICAL)
    yield
    logging.disable(logging.NOTSET)


def _find(tools: list[SubTool], name: str) -> SubTool:
    """
    Locate and return the SubTool with the given name from a list of tools.
    
    Parameters:
        tools (list[SubTool]): Iterable of SubTool objects to search.
        name (str): Exact plan name to find.
    
    Returns:
        SubTool: The first SubTool whose `name` attribute equals `name`.
    
    Raises:
        AssertionError: If no SubTool with the given name is found; the message lists available tool names.
    """
    for t in tools:
        if t.name == name:
            return t
    raise AssertionError(f"plan '{name}' not found in {[t.name for t in tools]}")


def _assert_all_fallback(tools: list[SubTool], fallbacks: list[tuple]):
    """
    Assert that every plan in `tools` matches its fallback definition for name, monthly price, annual price, and scrape status.
    
    Parameters:
        tools (list[SubTool]): SubTool objects produced by the scraper.
        fallbacks (list[tuple]): Fallback definitions (rows) where each row includes the plan name and the expected monthly and annual values.
    
    Raises:
        AssertionError: If the number of tools differs from fallbacks, any plan name is missing, or any plan's monthly, annual, or scrape_status does not match the fallback.
    """
    assert len(tools) == len(fallbacks)
    by_name = {row[_NAME]: row for row in fallbacks}
    assert {t.name for t in tools} == set(by_name.keys())
    for t in tools:
        row = by_name[t.name]
        assert t.monthly == row[_MONTHLY], f"{t.name} monthly"
        assert t.annual == row[_ANNUAL], f"{t.name} annual"
        assert t.scrape_status == "fallback", f"{t.name} status"


def _run(module, html: str) -> list[SubTool]:
    """
    Run a scraper module's scrape() with its get_page_text function mocked to return the provided HTML.
    
    Parameters:
        module: The scraper module whose get_page_text will be patched and whose scrape() will be invoked.
        html (str): The HTML string that get_page_text should return during the scrape.
    
    Returns:
        list[SubTool]: The list of SubTool objects returned by module.scrape().
    """
    target = f"{module.__name__}.get_page_text"
    with patch(target, return_value=html):
        return module.scrape()


_EMPTY = "<html></html>"


class TestClaudeCode:
    def test_success_extracts_pro_price(self):
        tools = _run(claude_code, "<p>Pro plan $25 / month</p>")
        pro = _find(tools, "Pro")
        assert pro.monthly == 25
        assert pro.scrape_status == "success"
        assert pro.group == "Claude Code"

    def test_fallback_on_empty_html(self):
        _assert_all_fallback(_run(claude_code, _EMPTY), claude_code._FALLBACKS)


class TestCursor:
    def test_success_extracts_pro_price(self):
        tools = _run(cursor, "<p>Pro $23 / month</p>")
        pro = _find(tools, "Pro")
        assert pro.monthly == 23
        assert pro.scrape_status == "success"

    def test_fallback_on_empty_html(self):
        """
        Verify that an empty page causes every plan to use the module's fallback values.
        
        Asserts that each returned SubTool's name, monthly, annual, and scrape_status match the entries in cursor._FALLBACKS via _assert_all_fallback.
        """
        _assert_all_fallback(_run(cursor, _EMPTY), cursor._FALLBACKS)


class TestWindsurf:
    def test_success_extracts_pro_price(self):
        tools = _run(windsurf, "<p>Pro $18 / month</p>")
        pro = _find(tools, "Pro")
        assert pro.monthly == 18
        assert pro.scrape_status == "success"

    def test_fallback_on_empty_html(self):
        _assert_all_fallback(_run(windsurf, _EMPTY), windsurf._FALLBACKS)


class TestGithubCopilot:
    def test_success_extracts_business_price(self):
        # "Business" は他プラン名と衝突しない（pro パターンは Pro/Pro+ に衝突する）
        tools = _run(github_copilot, "<p>Business $25 / user</p>")
        biz = _find(tools, "Business")
        assert biz.monthly == 25
        assert biz.scrape_status == "success"
        assert biz.group == "GitHub Copilot"

    def test_fallback_on_empty_html(self):
        """
        Verify that when the fetched page is empty, every GitHub Copilot plan falls back to the module's predefined fallback values.
        
        Asserts that each plan's monthly, annual, name, and scrape_status match the entries in github_copilot._FALLBACKS.
        """
        _assert_all_fallback(_run(github_copilot, _EMPTY), github_copilot._FALLBACKS)


class TestJetbrains:
    def test_success_extracts_all_products_price(self):
        tools = _run(jetbrains, "<p>All Products Pack $33.50 / month</p>")
        pack = _find(tools, "AI Pro (All Products Pack)")
        assert pack.monthly == 33.50
        assert pack.scrape_status == "success"

    def test_fallback_on_empty_html(self):
        """
        Verify that all JetBrains plans fall back to their default definitions when the fetched page is empty.
        
        Asserts that running the JetBrains scraper with empty HTML produces a list of plans whose `monthly`, `annual`, `name`, and `scrape_status` match the entries in `jetbrains._FALLBACKS` (with `scrape_status` equal to "fallback").
        """
        _assert_all_fallback(_run(jetbrains, _EMPTY), jetbrains._FALLBACKS)


class TestOpenaiCodex:
    def test_success_extracts_plus_price(self):
        tools = _run(openai_codex, "<p>Plus $25 / month</p>")
        plus = _find(tools, "ChatGPT Plus (Codex)")
        assert plus.monthly == 25
        assert plus.scrape_status == "success"

    def test_fallback_on_empty_html(self):
        _assert_all_fallback(_run(openai_codex, _EMPTY), openai_codex._FALLBACKS)


class TestGoogleOne:
    def test_success_extracts_ai_pro_price(self):
        """
        Verify the Google One scraper extracts the AI Pro monthly price.
        
        Asserts that the "AI Pro" plan's `monthly` equals 24.99 and its `scrape_status` is "success".
        """
        tools = _run(google_one, "<p>AI Pro $24.99 / month</p>")
        pro = _find(tools, "AI Pro")
        assert pro.monthly == 24.99
        assert pro.scrape_status == "success"

    def test_fallback_on_empty_html(self):
        """
        Verify that all Google One plans use the module fallbacks when the page HTML is empty.
        
        Asserts that each returned plan's name, monthly, annual, and scrape_status match the entries defined in google_one._FALLBACKS (scrape_status should be "fallback").
        """
        _assert_all_fallback(_run(google_one, _EMPTY), google_one._FALLBACKS)


class TestAntigravity:
    def test_success_extracts_pro_price(self):
        tools = _run(antigravity, "<p>Pro $26 / month</p>")
        pro = _find(tools, "Pro")
        assert pro.monthly == 26
        assert pro.scrape_status == "success"
        assert pro.group == "Antigravity"

    def test_fallback_on_empty_html(self):
        """
        Verify that when the scraper receives empty HTML, every Antigravity plan reports fallback pricing and a 'fallback' scrape status.
        """
        _assert_all_fallback(_run(antigravity, _EMPTY), antigravity._FALLBACKS)
