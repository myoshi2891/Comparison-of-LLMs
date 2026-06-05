"""USD/JPY 為替レートを Frankfurter API から取得する。

Frankfurter (https://www.frankfurter.app) は ECB データを使用する
APIキー不要の無料パブリック API。
失敗時は既存の pricing.json の値をフォールバックとして使用。
"""

from __future__ import annotations
import logging
from datetime import date as dt_date

import httpx

logger = logging.getLogger(__name__)

# Frankfurter API: ECB の公式レートを使用、APIキー不要
# 2026-06: api.frankfurter.app → api.frankfurter.dev/v1 に移転
_FRANKFURTER_URL = "https://api.frankfurter.dev/v1/latest?from=USD&to=JPY"


def fetch_jpy_rate(fallback: float = 155.0) -> tuple[float, str]:
    """
    Fetches the latest USD→JPY exchange rate from the Frankfurter API.
    
    Parameters:
        fallback (float): Rate to return if the API request or response parsing fails (default 155.0).
    
    Returns:
        (rate, date_str): `rate` is the fetched JPY rate; `date_str` is the date string from the API. On failure returns `fallback` and the string `"fallback"`.
    """
    try:
        resp = httpx.get(_FRANKFURTER_URL, timeout=15, follow_redirects=True)
        resp.raise_for_status()
        data = resp.json()
        # {"amount": 1.0, "base": "USD", "date": "2026-02-21", "rates": {"JPY": 155.22}}
        rate: float = data["rates"]["JPY"]
        date_str: str = data.get("date", str(dt_date.today()))
        logger.info("USD/JPY rate fetched: %.2f (date: %s)", rate, date_str)
        return rate, date_str
    except Exception as exc:
        logger.warning("Frankfurter API fetch failed: %s — using fallback %.2f", exc, fallback)
    return fallback, "fallback"
