/**
 * pricing.json のスキーマ型定義（Python 側 scraper/src/scraper/models.py と同期）
 *
 * 同期ポリシー: ApiModel / SubTool / PricingData の構造を変更する際は、
 * Pydantic v2 の models.py と本ファイルの双方を更新すること。
 * ランタイム検証は @/lib/pricing.ts の Zod スキーマが担う。
 */

export type ScrapeStatus = "success" | "fallback" | "manual";

export interface ApiModel {
  provider: string;
  name: string;
  tag: string;
  cls: string;
  /** USD per 1M input tokens */
  price_in: number;
  /** USD per 1M output tokens */
  price_out: number;
  sub_ja: string;
  sub_en: string;
  scrape_status: ScrapeStatus;
}

export interface SubTool {
  group: string;
  name: string;
  monthly: number;
  /** null = 年払いなし、値 = 月換算年払い */
  annual: number | null;
  tag: string;
  cls: string;
  note_ja: string;
  note_en: string;
  scrape_status: ScrapeStatus;
}

export interface PricingData {
  /** ISO 8601 date string */
  generated_at: string;
  jpy_rate: number;
  /** YYYY-MM-DD or 'fallback' */
  jpy_rate_date: string;
  api_models: ApiModel[];
  sub_tools: SubTool[];
}
