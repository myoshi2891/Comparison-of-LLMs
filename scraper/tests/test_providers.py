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

from scraper.models import ApiModel, PriceProvenance
from scraper.providers import anthropic, aws, deepseek, google, moonshot, openai, xai, zhipu


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
        # スクレイプ成功時は出自が "scraped" として刻まれ、次回以降の実行で
        # ハードコード値へ巻き戻らないことを保証する
        assert opus.provenance is not None
        assert opus.provenance.origin == "scraped"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.anthropic.get_page_text", return_value="<html></html>"):
            models = anthropic.scrape()
        _assert_all_fallback(models, anthropic._FALLBACKS, "Anthropic")

    def test_includes_fable_5(self):
        """
        Verifies that Claude Fable 5 is included with its fallback pricing and metadata.
        """
        with patch("scraper.providers.anthropic.get_page_text", return_value="<html></html>"):
            models = anthropic.scrape()
        fable = _find(models, "Claude Fable 5")
        assert fable.price_in == 10.00
        assert fable.price_out == 50.00
        assert fable.provider == "Anthropic"
        assert fable.scrape_status == "fallback"
        assert fable.tag  # タグが空でない
        assert fable.cls == "tag-flag"


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

    # 前方一致するモデル名（GPT-5.5 / GPT-5.5 Pro、GPT-5.2 / GPT-5.2 Pro）が
    # 互いの価格を拾わないことを検証する（Copilot Pro/Pro Max と同型の汚染）。
    _OVERLAP_HTML = (
        "<html><body>"
        "<p>GPT-5.5 Pro $31.00 / 1M tokens input</p>"
        "<p>GPT-5.5 Pro output cost is $181.00</p>"
        "<p>GPT-5.5 $5.50 / 1M tokens input</p>"
        "<p>GPT-5.5 output cost is $31.50</p>"
        "<p>GPT-5.2 Pro $22.00 / 1M tokens input</p>"
        "<p>GPT-5.2 Pro output cost is $169.00</p>"
        "<p>GPT-5.2 $1.85 / 1M tokens input</p>"
        "<p>GPT-5.2 output cost is $14.50</p>"
        "</body></html>"
    )

    @pytest.mark.parametrize(
        ("name", "price_in", "price_out"),
        [
            ("GPT-5.5", 5.50, 31.50),
            ("GPT-5.5 Pro", 31.00, 181.00),
            ("GPT-5.2", 1.85, 14.50),
            ("GPT-5.2 Pro", 22.00, 169.00),
        ],
    )
    def test_overlapping_names_keep_own_prices(self, name, price_in, price_out):
        with patch("scraper.providers.openai.get_page_text", return_value=self._OVERLAP_HTML):
            models = openai.scrape()
        m = _find(models, name)
        assert m.price_in == price_in
        assert m.price_out == price_out
        assert m.scrape_status == "success"


# --------------------------------------------------------------------------- #
# Google AI（Google AI ページのみ抽出。Vertex は常に fallback）
# --------------------------------------------------------------------------- #
class TestGoogle:
    def test_uses_fallback_for_all_models(self):
        """Google AI / Vertex AI は常に _FALLBACKS(SSoT) を採用する（ライブ抽出は無効）。

        料金ページは TOC 重複・ラベル無し価格・1モデル複数価格併記のため正規表現抽出が
        構造的に不安定（実測で正しく取れるモデルが 0 件で、近傍の無関係な額を誤取得する）。
        誤値を静かに混入させるより、WebSearch 確定値の _FALLBACKS を決定論的に採用する。
        価格改定は月次で _FALLBACKS を更新して反映する。
        """
        models = google.scrape()
        # _FALLBACKS の値は 7-tuple（[0]=price_in, [1]=price_out）
        assert len(models) == len(google._FALLBACKS)
        for m in models:
            fb = google._FALLBACKS[m.name]
            assert m.price_in == fb[0]
            assert m.price_out == fb[1]
            assert m.scrape_status == "fallback"

    def test_does_not_fetch_network(self):
        """Verify that Google scraping does not fetch page content."""
        with patch("scraper.providers.google.get_page_text") as mock_fetch:
            google.scrape()
        mock_fetch.assert_not_called()


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


# --------------------------------------------------------------------------- #
# Moonshot(Kimi)（"Kimi K3" のみ。key "kimi[-\s]?k3" は "Kimi K2.6" と衝突しない）
# --------------------------------------------------------------------------- #
class TestMoonshot:
    _HTML = (
        "<html><body>"
        "<p>Kimi K3 $9.99</p>"
        "<p>Kimi K3 output $44.44</p>"
        "</body></html>"
    )

    def test_success_extracts_prices(self):
        with patch("scraper.providers.moonshot.get_page_text", return_value=self._HTML):
            models = moonshot.scrape()
        k3 = _find(models, "Kimi K3")
        assert k3.price_in == 9.99
        assert k3.price_out == 44.44
        assert k3.scrape_status == "success"
        assert k3.provider == "Moonshot(Kimi)"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.moonshot.get_page_text", return_value="<html></html>"):
            models = moonshot.scrape()
        _assert_all_fallback(models, moonshot._FALLBACKS, "Moonshot(Kimi)")

    # "Kimi K2.7 Code" が "Kimi K2.7 Code Highspeed" の価格を拾わないこと。
    _OVERLAP_HTML = (
        "<html><body>"
        "<p>Kimi K2.7 Code Highspeed $1.95</p>"
        "<p>Kimi K2.7 Code Highspeed output $8.50</p>"
        "<p>Kimi K2.7 Code $0.99</p>"
        "<p>Kimi K2.7 Code output $4.50</p>"
        "</body></html>"
    )

    @pytest.mark.parametrize(
        ("name", "price_in", "price_out"),
        [
            ("Kimi K2.7 Code", 0.99, 4.50),
            ("Kimi K2.7 Code Highspeed", 1.95, 8.50),
        ],
    )
    def test_overlapping_names_keep_own_prices(self, name, price_in, price_out):
        with patch("scraper.providers.moonshot.get_page_text", return_value=self._OVERLAP_HTML):
            models = moonshot.scrape()
        m = _find(models, name)
        assert m.price_in == price_in
        assert m.price_out == price_out
        assert m.scrape_status == "success"


# --------------------------------------------------------------------------- #
# Zhipu(GLM)（"GLM-5.2" のみ。key "glm-5\.2" は "GLM-4.6" と衝突しない）
# --------------------------------------------------------------------------- #
class TestZhipu:
    _HTML = (
        "<html><body>"
        "<p>GLM-5.2 $7.77</p>"
        "<p>GLM-5.2 output $22.22</p>"
        "</body></html>"
    )

    def test_success_extracts_prices(self):
        with patch("scraper.providers.zhipu.get_page_text", return_value=self._HTML):
            models = zhipu.scrape()
        glm = _find(models, "GLM-5.2")
        assert glm.price_in == 7.77
        assert glm.price_out == 22.22
        assert glm.scrape_status == "success"
        assert glm.provider == "Zhipu(GLM)"

    def test_fallback_on_empty_html(self):
        with patch("scraper.providers.zhipu.get_page_text", return_value="<html></html>"):
            models = zhipu.scrape()
        _assert_all_fallback(models, zhipu._FALLBACKS, "Zhipu(GLM)")

    # "GLM-5.3" が "GLM-5.3-Flash" の価格を拾わないこと。
    _OVERLAP_HTML = (
        "<html><body>"
        "<p>GLM-5.3-Flash $0.16</p>"
        "<p>GLM-5.3-Flash output $0.55</p>"
        "<p>GLM-5.3 $1.45</p>"
        "<p>GLM-5.3 output $4.45</p>"
        "</body></html>"
    )

    @pytest.mark.parametrize(
        ("name", "price_in", "price_out"),
        [
            ("GLM-5.3", 1.45, 4.45),
            ("GLM-5.3-Flash", 0.16, 0.55),
        ],
    )
    def test_overlapping_names_keep_own_prices(self, name, price_in, price_out):
        with patch("scraper.providers.zhipu.get_page_text", return_value=self._OVERLAP_HTML):
            models = zhipu.scrape()
        m = _find(models, name)
        assert m.price_in == price_in
        assert m.price_out == price_out
        assert m.scrape_status == "success"


# --------------------------------------------------------------------------- #
# 3層フォールバックの優先順位
#
# 「スクレイプ成功 → 既存 JSON の値 → ハードコード値」の 2 層目は、本来
# **過去に実際にスクレイプ成功した値**を保持するためのもの。既存 JSON の値が
# 単なるフォールバック値の写し（scrape_status == "fallback"）だった場合にまで
# 優先してしまうと、_FALLBACKS 側の価格改定が永久に反映されなくなる。
# --------------------------------------------------------------------------- #
_FALLBACK_PRECEDENCE_CASES = [
    # (provider モジュール, 価格取得関数のパッチ先, existing の provider 文字列)
    (anthropic, "scraper.providers.anthropic.get_page_text", "Anthropic"),
    (openai, "scraper.providers.openai.get_page_text", "OpenAI"),
    (deepseek, "scraper.providers.deepseek.get_page_text", "DeepSeek"),
    (moonshot, "scraper.providers.moonshot.get_page_text", "Moonshot(Kimi)"),
    (xai, "scraper.providers.xai.get_page_text", "xAI"),
    (zhipu, "scraper.providers.zhipu.get_page_text", "Zhipu(GLM)"),
]

_STALE_IN = 999.01
_STALE_OUT = 999.02


def _stale_existing(
    provider: str,
    name: str,
    status: str,
    provenance: PriceProvenance | None = None,
) -> list[ApiModel]:
    """
    Build a one-element existing-model list carrying deliberately wrong prices.

    Parameters:
        provider (str): Provider string the target scraper filters on.
        name (str): Model name that must exist in the scraper's `_FALLBACKS`.
        status (str): `scrape_status` to stamp on the stale entry.
        provenance (PriceProvenance | None): 価格の出自。None なら旧スキーマ相当。

    Returns:
        list[ApiModel]: Single stale model usable as the `existing` argument.
    """
    return [
        ApiModel(
            provider=provider,
            name=name,
            tag="",
            cls="tag-bal",
            price_in=_STALE_IN,
            price_out=_STALE_OUT,
            sub_ja="",
            sub_en="",
            scrape_status=status,  # type: ignore[arg-type]
            provenance=provenance,
        )
    ]


@pytest.mark.parametrize(
    "module,patch_target,provider",
    _FALLBACK_PRECEDENCE_CASES,
    ids=[c[2] for c in _FALLBACK_PRECEDENCE_CASES],
)
def test_stale_fallback_existing_does_not_shadow_hardcoded_price(
    module, patch_target, provider
):
    """既存 JSON の値が fallback 由来なら _FALLBACKS のハードコード値が勝つ。"""
    name = next(iter(module._FALLBACKS))
    expected_in, expected_out = module._FALLBACKS[name]
    existing = _stale_existing(provider, name, "fallback")

    with patch(patch_target, return_value="<html></html>"):
        models = module.scrape(existing)

    m = _find(models, name)
    assert m.price_in == expected_in, f"{provider}/{name} price_in"
    assert m.price_out == expected_out, f"{provider}/{name} price_out"


@pytest.mark.parametrize(
    "module,patch_target,provider",
    _FALLBACK_PRECEDENCE_CASES,
    ids=[c[2] for c in _FALLBACK_PRECEDENCE_CASES],
)
def test_previously_scraped_existing_price_is_preserved(module, patch_target, provider):
    """既存 JSON の値がスクレイプ成功由来なら、その値を保持する（3層設計の本来の意図）。"""
    name = next(iter(module._FALLBACKS))
    existing = _stale_existing(provider, name, "success")

    with patch(patch_target, return_value="<html></html>"):
        models = module.scrape(existing)

    m = _find(models, name)
    assert m.price_in == _STALE_IN, f"{provider}/{name} price_in"
    assert m.price_out == _STALE_OUT, f"{provider}/{name} price_out"


def test_aws_stale_fallback_existing_does_not_shadow_hardcoded_price():
    """AWS は httpx 経由のため個別に検証する。"""
    name = next(iter(aws._FALLBACKS))
    expected_in, expected_out = aws._FALLBACKS[name]
    existing = _stale_existing("AWS", name, "fallback")

    with patch("scraper.providers.aws.httpx.get", side_effect=RuntimeError("offline")):
        models = aws.scrape(existing)

    m = _find(models, name)
    assert m.price_in == expected_in
    assert m.price_out == expected_out


def test_aws_previously_scraped_existing_price_is_preserved():
    name = next(iter(aws._FALLBACKS))
    existing = _stale_existing("AWS", name, "success")

    with patch("scraper.providers.aws.httpx.get", side_effect=RuntimeError("offline")):
        models = aws.scrape(existing)

    m = _find(models, name)
    assert m.price_in == _STALE_IN
    assert m.price_out == _STALE_OUT


# --------------------------------------------------------------------------- #
# 出自（provenance）の持ち越し
#
# `scrape_status` は「その実行でスクレイプが成功したか」しか表さないため、
# スクレイプが 2 回連続で失敗すると 1 回目で "fallback" へ落ちた過去の成功値が
# 2 回目で破棄され、ハードコード値まで巻き戻ってしまう。
# `ApiModel.provenance` はこれを防ぐ。ただしハードコード値が月次更新で
# 改定されていた場合は、そちらを優先する（2026-09-12 の設計判断を維持）。
# --------------------------------------------------------------------------- #
def _scraped_provenance(fb: tuple[float, float]) -> PriceProvenance:
    """記録時点のハードコード値が `fb` だったスクレイプ成功値の出自。"""
    return PriceProvenance(origin="scraped", fallback_in=fb[0], fallback_out=fb[1])


@pytest.mark.parametrize(
    "module,patch_target,provider",
    _FALLBACK_PRECEDENCE_CASES,
    ids=[c[2] for c in _FALLBACK_PRECEDENCE_CASES],
)
def test_scraped_provenance_survives_consecutive_failures(module, patch_target, provider):
    """2 回連続でスクレイプ失敗しても、過去のスクレイプ成功値は保持される。"""
    name = next(iter(module._FALLBACKS))
    # 1 回目の失敗で scrape_status は "fallback" に落ちているが、
    # provenance には出自が残っている状態。
    existing = _stale_existing(
        provider, name, "fallback", _scraped_provenance(module._FALLBACKS[name])
    )

    with patch(patch_target, return_value="<html></html>"):
        models = module.scrape(existing)

    m = _find(models, name)
    assert m.price_in == _STALE_IN, f"{provider}/{name} price_in"
    assert m.price_out == _STALE_OUT, f"{provider}/{name} price_out"
    assert m.provenance is not None and m.provenance.origin == "scraped"


@pytest.mark.parametrize(
    "module,patch_target,provider",
    _FALLBACK_PRECEDENCE_CASES,
    ids=[c[2] for c in _FALLBACK_PRECEDENCE_CASES],
)
def test_revised_hardcoded_price_beats_stale_scraped_value(module, patch_target, provider):
    """ハードコード値が改定されていれば、過去のスクレイプ成功値より優先される。"""
    name = next(iter(module._FALLBACKS))
    expected_in, expected_out = module._FALLBACKS[name]
    # 記録時点のハードコード値が現在と異なる = 月次更新で改定された
    existing = _stale_existing(
        provider, name, "fallback", _scraped_provenance((expected_in + 1, expected_out + 1))
    )

    with patch(patch_target, return_value="<html></html>"):
        models = module.scrape(existing)

    m = _find(models, name)
    assert m.price_in == expected_in, f"{provider}/{name} price_in"
    assert m.price_out == expected_out, f"{provider}/{name} price_out"


@pytest.mark.parametrize(
    "module,patch_target,provider",
    _FALLBACK_PRECEDENCE_CASES,
    ids=[c[2] for c in _FALLBACK_PRECEDENCE_CASES],
)
def test_fallback_run_stamps_hardcoded_provenance(module, patch_target, provider):
    """フォールバック出力には、その時点のハードコード値が出自として刻まれる。"""
    name = next(iter(module._FALLBACKS))
    fb_in, fb_out = module._FALLBACKS[name]

    with patch(patch_target, side_effect=RuntimeError("offline")):
        models = module.scrape(None)

    m = _find(models, name)
    assert m.provenance is not None
    assert m.provenance.origin == "hardcoded"
    assert (m.provenance.fallback_in, m.provenance.fallback_out) == (fb_in, fb_out)


def test_aws_scraped_provenance_survives_consecutive_failures():
    """AWS は httpx 経由のため個別に検証する。"""
    name = next(iter(aws._FALLBACKS))
    existing = _stale_existing(
        "AWS", name, "fallback", _scraped_provenance(aws._FALLBACKS[name])
    )

    with patch("scraper.providers.aws.httpx.get", side_effect=RuntimeError("offline")):
        models = aws.scrape(existing)

    m = _find(models, name)
    assert m.price_in == _STALE_IN
    assert m.price_out == _STALE_OUT
    assert m.provenance is not None and m.provenance.origin == "scraped"


def test_aws_revised_hardcoded_price_beats_stale_scraped_value():
    name = next(iter(aws._FALLBACKS))
    expected_in, expected_out = aws._FALLBACKS[name]
    existing = _stale_existing(
        "AWS", name, "fallback", _scraped_provenance((expected_in + 1, expected_out + 1))
    )

    with patch("scraper.providers.aws.httpx.get", side_effect=RuntimeError("offline")):
        models = aws.scrape(existing)

    m = _find(models, name)
    assert m.price_in == expected_in
    assert m.price_out == expected_out
