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
    logging.disable(logging.CRITICAL)
    yield
    logging.disable(logging.NOTSET)


def _find(tools: list[SubTool], name: str) -> SubTool:
    for t in tools:
        if t.name == name:
            return t
    raise AssertionError(f"plan '{name}' not found in {[t.name for t in tools]}")


def _assert_all_fallback(tools: list[SubTool], fallbacks: list[tuple]):
    """全プランが _FALLBACKS の monthly/annual・status・件数・名前に一致することを確認。"""
    assert len(tools) == len(fallbacks)
    by_name = {row[_NAME]: row for row in fallbacks}
    assert {t.name for t in tools} == set(by_name.keys())
    for t in tools:
        row = by_name[t.name]
        assert t.monthly == row[_MONTHLY], f"{t.name} monthly"
        assert t.annual == row[_ANNUAL], f"{t.name} annual"
        assert t.scrape_status == "fallback", f"{t.name} status"


def _run(module, html: str) -> list[SubTool]:
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
        _assert_all_fallback(_run(github_copilot, _EMPTY), github_copilot._FALLBACKS)


class TestJetbrains:
    def test_success_extracts_all_products_price(self):
        tools = _run(jetbrains, "<p>All Products Pack $33.50 / month</p>")
        pack = _find(tools, "AI Pro (All Products Pack)")
        assert pack.monthly == 33.50
        assert pack.scrape_status == "success"

    def test_fallback_on_empty_html(self):
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
        tools = _run(google_one, "<p>AI Pro $24.99 / month</p>")
        pro = _find(tools, "AI Pro")
        assert pro.monthly == 24.99
        assert pro.scrape_status == "success"

    def test_fallback_on_empty_html(self):
        _assert_all_fallback(_run(google_one, _EMPTY), google_one._FALLBACKS)


class TestAntigravity:
    def test_success_extracts_pro_price(self):
        tools = _run(antigravity, "<p>Pro $26 / month</p>")
        pro = _find(tools, "Pro")
        assert pro.monthly == 26
        assert pro.scrape_status == "success"
        assert pro.group == "Antigravity"

    def test_fallback_on_empty_html(self):
        _assert_all_fallback(_run(antigravity, _EMPTY), antigravity._FALLBACKS)
