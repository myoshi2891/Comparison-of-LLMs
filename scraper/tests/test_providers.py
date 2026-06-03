"""API プロバイダースクレイパーの価格抽出ユニットテスト。

smoke テスト（test_smoke.py）は `<html>Mock</html>` を返して `isinstance` のみ
確認するため、各プロバイダーの**正規表現パターンは一度も実行されず常に
fallback パスしか通らない**。本ファイルは get_page_text / httpx.get をモックし、

  - success パス: 実価格を含む HTML/JSON を返し、対象モデルが
    scrape_status == "success" かつ抽出値（fallback と異なる識別可能な値）に一致
  - fallback パス: マッチしない入力で全モデルが _FALLBACKS 値・名前・件数に一致

を検証する。対象モデルは正規表現キーの prefix 衝突を避けて名前で特定する。
"""

from __future__ import annotations

import logging
from unittest.mock import MagicMock, patch

import pytest

from scraper.models import ApiModel
from scraper.providers import anthropic, aws, deepseek, google, openai, xai


@pytest.fixture(autouse=True)
def _silence_logging():
    """
    Temporarily suppresses logging output to prevent warning messages from polluting test output.
    
    Disables logging before the test runs and restores the previous logging state after the test completes.
    """
    logging.disable(logging.CRITICAL)
    yield
    logging.disable(logging.NOTSET)


def _find(models: list[ApiModel], name: str) -> ApiModel:
    """
    Return the ApiModel from `models` whose `name` equals `name`.
    
    Parameters:
        models (list[ApiModel]): Collection of models to search.
        name (str): Model name to match.
    
    Returns:
        ApiModel: The model with a matching `name`.
    
    Raises:
        AssertionError: If no model with `name` is found in `models`.
    """
    for m in models:
        if m.name == name:
            return m
    raise AssertionError(f"model '{name}' not found in {[m.name for m in models]}")


def _assert_all_fallback(models: list[ApiModel], fallbacks: dict, provider_field: str | None):
    """
    Verify that every model in `models` matches its corresponding fallback entry for prices, status, count, and optionally provider.
    
    Parameters:
        models (list[ApiModel]): List of ApiModel instances to check.
        fallbacks (dict): Mapping from model name (str) to a tuple (price_in, price_out) representing expected fallback values.
        provider_field (str | None): If provided, each model's `provider` field must equal this value; if None, provider is not checked.
    
    Raises:
        AssertionError: If the number of models differs from `fallbacks`, any model name is missing, any `price_in`/`price_out` differs from the fallback, any model's `scrape_status` is not "fallback", or (when `provider_field` is provided) any model's `provider` does not match.
    """
    assert len(models) == len(fallbacks)
    names = {m.name for m in models}
    assert names == set(fallbacks.keys())
    for m in models:
        fb = fallbacks[m.name]
        assert m.price_in == fb[0], f"{m.name} price_in"
        assert m.price_out == fb[1], f"{m.name} price_out"
        assert m.scrape_status == "fallback", f"{m.name} status"
        if provider_field is not None:
            assert m.provider == provider_field


# --------------------------------------------------------------------------- #
# Anthropic（パターンは [^\n] のため価格は 1 行に並べる）
# --------------------------------------------------------------------------- #
class TestAnthropic:
    _HTML = (
        "<html><body>"
        "<p>Claude Opus 4.6 input $7.77 output $30.30</p>"
        "<p>Claude Sonnet 4.6 input $4.44 output $18.18</p>"
        "</body></html>"
    )

    def test_success_extracts_prices(self):
        with patch("scraper.providers.anthropic.get_page_text", return_value=self._HTML):
            models = anthropic.scrape()
        opus = _find(models, "Claude Opus 4.6")
        assert opus.price_in == 7.77
        assert opus.price_out == 30.30
        assert opus.scrape_status == "success"
        assert opus.provider == "Anthropic"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.anthropic.get_page_text", return_value="<html></html>"):
            models = anthropic.scrape()
        _assert_all_fallback(models, anthropic._FALLBACKS, "Anthropic")


# --------------------------------------------------------------------------- #
# OpenAI（パターンは [^$] / .* — $ を挟まないよう in/out を別セグメントに）
# --------------------------------------------------------------------------- #
class TestOpenAI:
    _HTML = (
        "<html><body>"
        "<p>o3-pro $33.00 / 1M tokens input</p>"
        "<p>o3-pro output cost is $88.00</p>"
        "</body></html>"
    )

    def test_success_extracts_prices(self):
        with patch("scraper.providers.openai.get_page_text", return_value=self._HTML):
            models = openai.scrape()
        o3pro = _find(models, "o3-pro")
        assert o3pro.price_in == 33.00
        assert o3pro.price_out == 88.00
        assert o3pro.scrape_status == "success"
        assert o3pro.provider == "OpenAI"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.openai.get_page_text", return_value="<html></html>"):
            models = openai.scrape()
        _assert_all_fallback(models, openai._FALLBACKS, "OpenAI")


# --------------------------------------------------------------------------- #
# Google AI（Google AI ページのみ抽出。Vertex は常に fallback）
# --------------------------------------------------------------------------- #
class TestGoogle:
    _HTML = (
        "<html><body>"
        "<p>Gemini 2.5 Flash $0.99 / 1M</p>"
        "<p>Gemini 2.5 Flash output $5.55</p>"
        "</body></html>"
    )

    def test_success_extracts_google_ai_price(self):
        with patch("scraper.providers.google.get_page_text", return_value=self._HTML):
            models = google.scrape()
        flash = _find(models, "Gemini 2.5 Flash")
        assert flash.price_in == 0.99
        assert flash.price_out == 5.55
        assert flash.scrape_status == "success"
        assert flash.provider == "Google AI"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.google.get_page_text", return_value="<html></html>"):
            models = google.scrape()
        # _FALLBACKS の値は 7-tuple（[0]=price_in, [1]=price_out）
        assert len(models) == len(google._FALLBACKS)
        for m in models:
            fb = google._FALLBACKS[m.name]
            assert m.price_in == fb[0]
            assert m.price_out == fb[1]
            assert m.scrape_status == "fallback"


# --------------------------------------------------------------------------- #
# DeepSeek
# --------------------------------------------------------------------------- #
class TestDeepSeek:
    _HTML = (
        "<html><body>"
        "<p>DeepSeek-V3.2 $1.11</p>"
        "<p>DeepSeek-V3.2 output $2.22</p>"
        "</body></html>"
    )

    def test_success_extracts_prices(self):
        with patch("scraper.providers.deepseek.get_page_text", return_value=self._HTML):
            models = deepseek.scrape()
        v32 = _find(models, "DeepSeek-V3.2")
        assert v32.price_in == 1.11
        assert v32.price_out == 2.22
        assert v32.scrape_status == "success"
        assert v32.provider == "DeepSeek"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.deepseek.get_page_text", return_value="<html></html>"):
            models = deepseek.scrape()
        _assert_all_fallback(models, deepseek._FALLBACKS, "DeepSeek")


# --------------------------------------------------------------------------- #
# xAI（"Grok 4.3" のみ。"Grok 4.1 Fast" を含めないことで key 衝突を回避）
# --------------------------------------------------------------------------- #
class TestXai:
    _HTML = (
        "<html><body>"
        "<p>Grok 4.3 $9.50</p>"
        "<p>Grok 4.3 output $25.00</p>"
        "</body></html>"
    )

    def test_success_extracts_prices(self):
        with patch("scraper.providers.xai.get_page_text", return_value=self._HTML):
            models = xai.scrape()
        grok43 = _find(models, "Grok 4.3")
        assert grok43.price_in == 9.50
        assert grok43.price_out == 25.00
        assert grok43.scrape_status == "success"
        assert grok43.provider == "xAI"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.xai.get_page_text", return_value="<html></html>"):
            models = xai.scrape()
        _assert_all_fallback(models, xai._FALLBACKS, "xAI")


# --------------------------------------------------------------------------- #
# AWS（httpx + Pricing JSON。per-1M 単位・USE1 リージョンを模した JSON）
# --------------------------------------------------------------------------- #
class TestAws:
    # usd_per_unit * 1_000_000（desc に "1k"/"1,000" を含めない）
    _JSON = {
        "products": {
            "SKU_IN": {
                "attributes": {
                    "modelId": "amazon.nova-pro-v1:0",
                    "model": "Nova Pro",
                    "usagetype": "USE1-NovaPro-input-tokens",
                }
            },
            "SKU_OUT": {
                "attributes": {
                    "modelId": "amazon.nova-pro-v1:0",
                    "model": "Nova Pro",
                    "usagetype": "USE1-NovaPro-output-tokens",
                }
            },
        },
        "terms": {
            "OnDemand": {
                "SKU_IN": {
                    "T1": {
                        "priceDimensions": {
                            "PD1": {
                                "pricePerUnit": {"USD": "0.0000015"},
                                "description": "per 1M tokens input",
                            }
                        }
                    }
                },
                "SKU_OUT": {
                    "T1": {
                        "priceDimensions": {
                            "PD1": {
                                "pricePerUnit": {"USD": "0.0000050"},
                                "description": "per 1M tokens output",
                            }
                        }
                    }
                },
            }
        },
    }

    def _mock_resp(self, payload: dict) -> MagicMock:
        """
        Create a MagicMock that mimics an HTTP response whose json() call returns the given payload.
        
        Parameters:
            payload (dict): The JSON-like payload to be returned by the mock response's json() method.
        
        Returns:
            MagicMock: A mock response object whose json() returns `payload` and whose raise_for_status() is a no-op.
        """
        resp = MagicMock()
        resp.json.return_value = payload
        resp.raise_for_status.return_value = None
        return resp

    def test_success_parses_pricing_json(self):
        with patch("scraper.providers.aws.httpx.get", return_value=self._mock_resp(self._JSON)):
            models = aws.scrape()
        nova_pro = _find(models, "Amazon Nova Pro")
        assert nova_pro.price_in == 1.5  # 0.0000015 * 1_000_000
        assert nova_pro.price_out == 5.0  # 0.0000050 * 1_000_000
        assert nova_pro.scrape_status == "success"
        assert nova_pro.provider == "AWS"
        # JSON に含めなかった Nova Micro は fallback
        nova_micro = _find(models, "Amazon Nova Micro")
        assert nova_micro.scrape_status == "fallback"
        assert nova_micro.price_in == aws._FALLBACKS["Amazon Nova Micro"][0]

    def test_fallback_on_empty_json(self):
        with patch("scraper.providers.aws.httpx.get", return_value=self._mock_resp({})):
            models = aws.scrape()
        _assert_all_fallback(models, aws._FALLBACKS, "AWS")
