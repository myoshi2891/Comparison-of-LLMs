"""Official standard text-token prices checked on 2026-11-13.

Sources: https://platform.claude.com/docs/en/about-claude/pricing
and https://aistudio.google.com/docs/pricing (not Batch/Flex/video prices).
"""

from datetime import date
from unittest.mock import patch

import pytest

from scraper.providers import anthropic, google, moonshot


@pytest.mark.parametrize(
    "module,name,prices,tag,cls",
    [
        (anthropic, "Claude Fable 5.2", (8.0, 40.0), "最上位 Flagship", "tag-flag"),
        (anthropic, "Claude Mythos 5.2", (8.0, 40.0), "Restricted", "tag-flag"),
        (google, "Gemini 4 Carbon", (2.0, 10.0), "最新 Flagship", "tag-flag"),
        (google, "Gemini 4 Hydrogen", (1.5, 7.5), "最新 Balanced", "tag-bal"),
        (google, "Gemini Omni 1.2 Flash", (1.5, 9.0), "Multimodal", "tag-bal"),
    ],
)
def test_latest_standard_text_prices(module, name, prices, tag, cls):
    """New models retain verified prices, bilingual notes and their provenance offline."""
    with (
        patch("scraper.providers.anthropic.get_page_text", side_effect=RuntimeError("offline")),
        patch("scraper.providers.google._today_utc", return_value=date(2026, 11, 13)),
    ):
        models = module.scrape()
    model = next((m for m in models if m.name == name), None)
    assert model is not None, name
    assert (model.price_in, model.price_out, model.tag, model.cls) == (*prices, tag, cls)
    assert model.sub_ja and model.sub_en
    assert model.scrape_status == "fallback"
    assert model.provenance is not None
    assert (model.provenance.origin, model.provenance.fallback_in, model.provenance.fallback_out) == (
        "hardcoded", *prices,
    )


@pytest.mark.parametrize("today,expected", [
    (date(2026, 11, 30), (2.0, 10.0)),
    (date(2026, 12, 1), (4.0, 20.0)),
])
def test_carbon_promo_boundary(today, expected):
    """Carbon switches to the announced standard price after November 30 UTC."""
    with patch("scraper.providers.google._today_utc", return_value=today):
        models = google.scrape()
    model = next((m for m in models if m.name == "Gemini 4 Carbon"), None)
    assert model is not None
    assert (model.price_in, model.price_out) == expected


@pytest.mark.parametrize("html", [
    "<p>Kimi K3.1 Pro output $10</p>",
    "<nav>Kimi K3</nav>" + "x" * 200 + "<p>Other output $0.95</p>",
    "<p>Kimi K3</p>\n<p>Other output $0.95</p>",
    "<tr><td>Kimi K3</td></tr>\n<tr><td>Other output $0.95</td></tr>",
    "Kimi K3\nKimi K2.6 output $0.95",
])
def test_kimi_k3_rejects_other_model_prices(html):
    """A newer dotted version or distant price must not contaminate K3 pricing."""
    with patch("scraper.providers.moonshot.get_page_text", return_value=html):
        model = next(m for m in moonshot.scrape() if m.name == "Kimi K3")
    assert (model.price_in, model.price_out, model.scrape_status) == (3.0, 15.0, "fallback")


def test_kimi_k3_extracts_multiline_prices():
    """Formatting whitespace within a bounded record preserves both live prices."""
    html = """
        <p>Kimi K3
            input
            $3.25</p>
        <p>Kimi K3
            output
            $16.50</p>
    """
    with patch("scraper.providers.moonshot.get_page_text", return_value=html):
        model = next(m for m in moonshot.scrape() if m.name == "Kimi K3")
    assert (model.price_in, model.price_out, model.scrape_status) == (3.25, 16.50, "success")
