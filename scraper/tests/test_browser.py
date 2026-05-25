import pytest
from scraper.browser import extract_price, sanity_check

class TestExtractPrice:
    def test_dollar_pattern(self):
        """$X.XX パターンから価格を抽出"""
        html = '<span>Input: $3.00 per 1M tokens</span>'
        result = extract_price(html, [r"\$\s*([\d.]+)\s*per"])
        assert result == 3.0

    def test_no_match_returns_none(self):
        """マッチしない場合は None"""
        result = extract_price("no price here", [r"\$\s*([\d.]+)"])
        assert result is None

    def test_out_of_range_rejected(self):
        """範囲外の値は None"""
        html = "$999999.00"
        result = extract_price(html, [r"\$([\d.]+)"])
        assert result is None

class TestSanityCheck:
    def test_valid_value(self):
        """正常値はそのまま返し、ステータスは success"""
        value, status = sanity_check(3.0, "test", 5.0)
        assert value == 3.0
        assert status == "success"

    def test_none_falls_back(self):
        """None の場合はフォールバック値を返し、ステータスは fallback"""
        value, status = sanity_check(None, "test", 5.0)
        assert value == 5.0
        assert status == "fallback"
