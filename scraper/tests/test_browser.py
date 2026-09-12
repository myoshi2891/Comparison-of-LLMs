import re

import pytest
from scraper.browser import extract_price, model_key_pattern, sanity_check

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

class TestModelKeyPattern:
    """モデル名 → 正規表現キー変換（区切り文字の表記ゆれ吸収）"""

    def test_hyphenated_variant_does_not_leak_into_base_model(self):
        """"GPT-5.4 Mini" が "GPT-5.4" より先に現れても基底モデルが mini 価格を拾わない"""
        # Arrange: 設定名はハイフン区切り、ページ表記は空白区切り（表記ゆれ）
        names = ["GPT-5.4-mini", "GPT-5.4"]
        text = "GPT-5.4 Mini $0.75 / 1M input  GPT-5.4 $2.50 / 1M input"
        base = model_key_pattern("GPT-5.4", names)
        mini = model_key_pattern("GPT-5.4-mini", names)

        # Act
        base_price = extract_price(text, [rf"{base}[^$]*?\$([\d.]+)\s*/\s*1M.*?input"])
        mini_price = extract_price(text, [rf"{mini}[^$]*?\$([\d.]+)\s*/\s*1M.*?input"])

        # Assert
        assert base_price == 2.50
        assert mini_price == 0.75

    def test_separator_variants_match_either_notation(self):
        """空白区切り / ハイフン区切りのどちらの表記にもマッチする"""
        # Arrange
        key = model_key_pattern("GPT-5.4 Mini", ["GPT-5.4 Mini"])

        # Act / Assert
        assert re.search(key, "GPT-5.4 Mini", re.IGNORECASE)
        assert re.search(key, "GPT-5.4-Mini", re.IGNORECASE)

    def test_guard_blocks_longer_derived_name(self):
        """派生モデル名（Nano）の直前では基底モデルのキーがマッチしない"""
        # Arrange
        key = model_key_pattern("GPT-5.4", ["GPT-5.4", "GPT-5.4 Nano"])

        # Act / Assert
        assert re.search(key, "GPT-5.4 Nano", re.IGNORECASE) is None
        assert re.search(key, "GPT-5.4 $2.50", re.IGNORECASE) is not None
