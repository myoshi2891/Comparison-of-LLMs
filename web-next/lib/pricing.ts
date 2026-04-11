/**
 * pricing.json のランタイム検証スキーマ。
 *
 * Python 側 Pydantic v2 モデル（scraper/src/scraper/models.py）と
 * TypeScript 側型定義（@/types/pricing）に対応する Zod スキーマを提供する。
 * ビルド時 / SSR 時にデータをパースすることで、型と実データの乖離を
 * 起動時点で検出できるようにする。
 */

import { z } from "zod";
import type { ApiModel, PricingData, SubTool } from "@/types/pricing";

export const ScrapeStatusSchema = z.enum(["success", "fallback", "manual"]);

export const ApiModelSchema: z.ZodType<ApiModel> = z.object({
  provider: z.string(),
  name: z.string(),
  tag: z.string(),
  cls: z.string(),
  price_in: z.number().nonnegative(),
  price_out: z.number().nonnegative(),
  sub_ja: z.string(),
  sub_en: z.string(),
  scrape_status: ScrapeStatusSchema,
});

export const SubToolSchema: z.ZodType<SubTool> = z.object({
  group: z.string(),
  name: z.string(),
  monthly: z.number().nonnegative(),
  annual: z.number().nonnegative().nullable(),
  tag: z.string(),
  cls: z.string(),
  note_ja: z.string(),
  note_en: z.string(),
  scrape_status: ScrapeStatusSchema,
});

export const PricingDataSchema: z.ZodType<PricingData> = z.object({
  generated_at: z.string(),
  jpy_rate: z.number().positive(),
  jpy_rate_date: z.string(),
  api_models: z.array(ApiModelSchema),
  sub_tools: z.array(SubToolSchema),
});

/**
 * `unknown` 入力を検証し、失敗時は詳細メッセージを投げる。
 * Server Component から呼び出して SSG ビルド時に不正データを検出する。
 */
export function parsePricingData(input: unknown): PricingData {
  return PricingDataSchema.parse(input);
}
