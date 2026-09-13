"""pricing.json のスキーマ定義 (Pydantic v2)"""

from __future__ import annotations
from typing import Literal
from pydantic import BaseModel, Field


ScrapeStatus = Literal["success", "fallback", "manual"]

# 価格そのものの出自。scrape_status が「今回の実行」の結果しか表さないのに対し、
# PriceOrigin は値がどこから来たかを実行をまたいで持ち越す。
PriceOrigin = Literal["scraped", "hardcoded"]


class PriceProvenance(BaseModel):
    """価格の出自と、記録時点で有効だったハードコードフォールバック値。

    `scrape_status` はその実行でスクレイプが成功したかしか表さないため、
    スクレイプが 2 回連続で失敗すると 1 回目でフォールバックへ落ちた
    「過去のスクレイプ成功値」が 2 回目で破棄されハードコード値へ巻き戻る。
    `origin` を持ち越すことでこれを防ぐ。

    同時に `fallback_in` / `fallback_out`（記録時点の `_FALLBACKS` 値）を持つことで、
    ハードコード値が月次更新で改定されたかを判定できる。改定されていれば
    過去のスクレイプ値より新しいハードコード値を優先する（設計判断 2026-09-12 を維持）。
    """

    origin: PriceOrigin
    fallback_in: float = Field(ge=0)
    fallback_out: float = Field(ge=0)


class ApiModel(BaseModel):
    provider: str
    name: str
    tag: str
    cls: str
    price_in: float = Field(ge=0)   # USD per 1M input tokens
    price_out: float = Field(ge=0)  # USD per 1M output tokens
    sub_ja: str
    sub_en: str
    scrape_status: ScrapeStatus = "manual"
    # 旧スキーマの pricing.json を読めるよう既定値 None（後方互換）。
    provenance: PriceProvenance | None = None


class SubTool(BaseModel):
    group: str
    name: str
    monthly: float = Field(ge=0)
    annual: float | None = None     # None = 年払いなし、値 = 月換算年払い
    tag: str
    cls: str
    note_ja: str
    note_en: str
    scrape_status: ScrapeStatus = "manual"


class PricingData(BaseModel):
    generated_at: str               # ISO 8601 datetime string
    jpy_rate: float                 # 1 USD = jpy_rate JPY
    jpy_rate_date: str              # YYYY-MM-DD
    api_models: list[ApiModel]
    sub_tools: list[SubTool]
