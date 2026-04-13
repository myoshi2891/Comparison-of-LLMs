/**
 * 統合テスト用 PricingData フィクスチャ。
 *
 * 設計書: docs/NEXTJS_INTEGRATION_TEST_DESIGN.md
 *
 * 3 種のファクトリ関数を公開する:
 * - minimalPricing: 複数プロバイダ・複数モデルを含む最小データ（Zod 通過）
 * - fullPricing:    data/pricing.json 実データ（Zod 通過・スモーク用）
 * - edgePricing:    jpy_rate=0 等の異常系を含む耐性検証用（Zod バイパス）
 *
 * mutation 耐性のため、呼び出しごとに新規インスタンスを返す（関数化）。
 */

import pricingJson from "@/data/pricing.json";
import { parsePricingData } from "@/lib/pricing";
import type { PricingData } from "@/types/pricing";

/**
 * 最小だが統合テストに必要な件数を満たすフィクスチャ。
 * - API: 2 プロバイダ × 複数モデル（最安行ハイライト・ソート・グループヘッダ検証用）
 * - Sub: 2 グループ（タブ切替・年払い表示検証用）
 */
export function minimalPricing(): PricingData {
  return parsePricingData({
    generated_at: "2025-01-15",
    jpy_rate: 150,
    jpy_rate_date: "2025-01-15",
    api_models: [
      {
        provider: "OpenAI",
        name: "GPT-4o",
        tag: "STD",
        cls: "std",
        price_in: 2.5,
        price_out: 10,
        sub_ja: "標準モデル",
        sub_en: "Standard model",
        scrape_status: "success",
      },
      {
        provider: "Anthropic",
        name: "Claude Sonnet",
        tag: "STD",
        cls: "std",
        price_in: 3,
        price_out: 15,
        sub_ja: "バランス型",
        sub_en: "Balanced",
        scrape_status: "success",
      },
      {
        provider: "Anthropic",
        name: "Claude Haiku",
        tag: "FAST",
        cls: "fast",
        price_in: 1,
        price_out: 5,
        sub_ja: "高速軽量",
        sub_en: "Fast & light",
        scrape_status: "success",
      },
    ],
    sub_tools: [
      {
        group: "Cursor",
        name: "Pro",
        monthly: 20,
        annual: null,
        tag: "PRO",
        cls: "std",
        note_ja: "クレジット制",
        note_en: "Credit-based",
        scrape_status: "success",
      },
      {
        group: "GitHub Copilot",
        name: "Pro",
        monthly: 10,
        annual: 100,
        tag: "PRO",
        cls: "std",
        note_ja: "年払割引あり",
        note_en: "Annual discount",
        scrape_status: "success",
      },
    ],
  });
}

/**
 * data/pricing.json の実データ全件。
 * 「HomePage が実データでクラッシュしない」「件数 > 0」のスモーク検証専用。
 * 将来 pricing.json が更新されると件数依存の assertion は壊れるので、
 * テスト側では件数の具体値に依存しないこと（> 0 のみを検証する）。
 */
export function fullPricing(): PricingData {
  return parsePricingData(pricingJson);
}

/**
 * 異常値耐性検証用フィクスチャ。
 *
 * Zod スキーマ（lib/pricing.ts）は jpy_rate を positive() で拘束するため、
 * 意図的に parsePricingData をバイパスして直接 PricingData を構築する。
 * 本 fixture は「正当なデータ」ではなく「実装の耐性を確かめるための毒データ」。
 * HomePage が以下の異常値に遭遇してもクラッシュしないことを検証する:
 * - jpy_rate = 0（為替レート取得失敗を模擬 → fmtJPY が ¥— を返すパスに乗る）
 * - price_in = 0 / price_out = 0（全カラムで cost = 0）
 * - annual = null（年払い情報なし）
 */
export function edgePricing(): PricingData {
  return {
    generated_at: "2025-01-15",
    jpy_rate: 0,
    jpy_rate_date: "fallback",
    api_models: [
      {
        provider: "OpenAI",
        name: "Zero Model",
        tag: "FREE",
        cls: "std",
        price_in: 0,
        price_out: 0,
        sub_ja: "ゼロ価格",
        sub_en: "Zero price",
        scrape_status: "fallback",
      },
    ],
    sub_tools: [
      {
        group: "Cursor",
        name: "Free",
        monthly: 0,
        annual: null,
        tag: "FREE",
        cls: "std",
        note_ja: "無料プラン",
        note_en: "Free plan",
        scrape_status: "fallback",
      },
    ],
  };
}
