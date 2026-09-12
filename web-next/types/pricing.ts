/**
 * pricing.json のスキーマ型定義（Python 側 scraper/src/scraper/models.py と同期）
 *
 * 同期ポリシー: ApiModel / SubTool / PricingData の構造を変更する際は、
 * Pydantic v2 の models.py と本ファイルの双方を更新すること。
 * ランタイム検証は @/lib/pricing.ts の Zod スキーマが担う。
 */

export type ScrapeStatus = "success" | "fallback" | "manual";

/** 価格そのものの出自（scrape_status は「その実行の結果」しか表さない） */
export type PriceOrigin = "scraped" | "hardcoded";

/**
 * 価格の出自と、記録時点で有効だったハードコードフォールバック値。
 * スクレイプが連続失敗しても過去の成功値を保持しつつ、
 * ハードコード値の改定は取りこぼさないための判定材料。
 */
export interface PriceProvenance {
  origin: PriceOrigin;
  /** 記録時点の _FALLBACKS 入力価格（USD / 1M tokens） */
  fallback_in: number;
  /** 記録時点の _FALLBACKS 出力価格（USD / 1M tokens） */
  fallback_out: number;
}

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
  /** 旧スキーマの pricing.json では欠落しうる（後方互換） */
  provenance?: PriceProvenance | null;
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
