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

/** YYYY-MM-DD 形式の日付文字列バリデーター（jpy_rate_date 用） */
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD");

/** ISO 8601 datetime 文字列バリデーター（generated_at 用） */
const datetimeString = z.iso.datetime({ offset: true });

export const ApiModelSchema: z.ZodType<ApiModel> = z
  .object({
    provider: z.string(),
    name: z.string(),
    tag: z.string(),
    cls: z.string(),
    price_in: z.number().nonnegative(),
    price_out: z.number().nonnegative(),
    sub_ja: z.string(),
    sub_en: z.string(),
    scrape_status: ScrapeStatusSchema,
  })
  .strict();

export const SubToolSchema: z.ZodType<SubTool> = z
  .object({
    group: z.string(),
    name: z.string(),
    monthly: z.number().nonnegative(),
    annual: z.number().nonnegative().nullable(),
    tag: z.string(),
    cls: z.string(),
    note_ja: z.string(),
    note_en: z.string(),
    scrape_status: ScrapeStatusSchema,
  })
  .strict();

export const PricingDataSchema: z.ZodType<PricingData> = z
  .object({
    generated_at: datetimeString,
    jpy_rate: z.number().positive(),
    jpy_rate_date: dateString,
    api_models: z.array(ApiModelSchema),
    sub_tools: z.array(SubToolSchema),
  })
  .strict();

/**
 * `unknown` 入力を検証し、失敗時は詳細メッセージを投げる。
 * Server Component から呼び出して SSG ビルド時に不正データを検出する。
 */
export function parsePricingData(input: unknown): PricingData {
  return PricingDataSchema.parse(input);
}

/**
 * 型定義と Zod スキーマの乖離を **コンパイル時** に検出するパリティチェック。
 * どちらか一方だけ変更するとここで型エラーになる。ランタイムコードには
 * 影響しない（`never` 型の定数は tree-shake される）。
 */
type _AssertParity = [
  ApiModel extends z.infer<typeof ApiModelSchema> ? true : never,
  z.infer<typeof ApiModelSchema> extends ApiModel ? true : never,
  SubTool extends z.infer<typeof SubToolSchema> ? true : never,
  z.infer<typeof SubToolSchema> extends SubTool ? true : never,
  PricingData extends z.infer<typeof PricingDataSchema> ? true : never,
  z.infer<typeof PricingDataSchema> extends PricingData ? true : never,
];
const _parityCheck: _AssertParity = [true, true, true, true, true, true];
void _parityCheck;
