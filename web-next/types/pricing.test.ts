/**
 * types/pricing.ts（TypeScript 型）と lib/pricing.ts（Zod スキーマ）の
 * **ランタイム** 整合性検証。
 *
 * lib/pricing.ts の `_AssertParity` はコンパイル時のみのチェックであり、
 * 実データに対するランタイムの拒否（negative test）は検証しない。
 * 本ファイルは以下を補完する:
 *   1. 型として正当なオブジェクトがスキーマを通過すること（ランタイム parity）
 *   2. lib/pricing.test.ts に存在しない negative ケース（型強制拒否・
 *      フィールド欠落・数値制約・日付フォーマット境界）
 */

import { describe, expect, it } from "vitest";
import { ApiModelSchema, PricingDataSchema, parsePricingData, SubToolSchema } from "@/lib/pricing";
import type { ApiModel, PricingData, SubTool } from "@/types/pricing";

// 型注釈付きの正当オブジェクト。型エラーがあればコンパイルが通らない（= 静的 parity）
const apiModel: ApiModel = {
  provider: "Anthropic",
  name: "Claude Opus 4.6",
  tag: "最新",
  cls: "tag-flag",
  price_in: 5.0,
  price_out: 25.0,
  sub_ja: "エージェントチーム / 200K",
  sub_en: "Agent teams / 200K ctx",
  scrape_status: "fallback",
};

const subTool: SubTool = {
  group: "Claude Code",
  name: "Pro",
  monthly: 20,
  annual: 17,
  tag: "Individual",
  cls: "tag-bal",
  note_ja: "~45 msg/5h",
  note_en: "~45 msg/5h",
  scrape_status: "success",
};

const pricingData: PricingData = {
  generated_at: "2026-05-30",
  jpy_rate: 157.92,
  jpy_rate_date: "2026-05-29",
  api_models: [apiModel],
  sub_tools: [subTool],
};

describe("ランタイム型 parity（_AssertParity のランタイム版）", () => {
  it("ApiModel 型のオブジェクトは ApiModelSchema を通過する", () => {
    expect(ApiModelSchema.parse(apiModel)).toEqual(apiModel);
  });

  it("SubTool 型のオブジェクトは SubToolSchema を通過する", () => {
    expect(SubToolSchema.parse(subTool)).toEqual(subTool);
  });

  it("PricingData 型のオブジェクトは parsePricingData を通過する", () => {
    expect(parsePricingData(pricingData)).toEqual(pricingData);
  });

  it("annual: null（年払いなし）の SubTool も型・スキーマ双方で有効", () => {
    const monthlyOnly: SubTool = { ...subTool, annual: null };
    expect(SubToolSchema.parse(monthlyOnly).annual).toBeNull();
  });
});

describe("ApiModelSchema — 数値フィールドの型強制拒否", () => {
  it("price_in が数値文字列でも coercion せず拒否する", () => {
    expect(() => ApiModelSchema.parse({ ...apiModel, price_in: "5.0" })).toThrow();
  });

  it("price_out が数値文字列でも coercion せず拒否する", () => {
    expect(() => ApiModelSchema.parse({ ...apiModel, price_out: "25" })).toThrow();
  });

  it("price_in が null は拒否する", () => {
    expect(() => ApiModelSchema.parse({ ...apiModel, price_in: null })).toThrow();
  });
});

describe("SubToolSchema — 欠落フィールド・annual 制約", () => {
  it("必須フィールド group の欠落を拒否する", () => {
    const { group: _omitted, ...incomplete } = subTool;
    expect(() => SubToolSchema.parse(incomplete)).toThrow();
  });

  it("必須フィールド monthly の欠落を拒否する", () => {
    const { monthly: _omitted, ...incomplete } = subTool;
    expect(() => SubToolSchema.parse(incomplete)).toThrow();
  });

  it("annual が負値の場合は拒否する", () => {
    expect(() => SubToolSchema.parse({ ...subTool, annual: -1 })).toThrow();
  });

  it("annual が数値文字列の場合は拒否する（null か number のみ許容）", () => {
    expect(() => SubToolSchema.parse({ ...subTool, annual: "17" })).toThrow();
  });

  it("monthly: 0（無料プラン）は許容する", () => {
    expect(() => SubToolSchema.parse({ ...subTool, monthly: 0 })).not.toThrow();
  });
});

describe("PricingDataSchema — jpy_rate の positive 制約", () => {
  it("jpy_rate: 0 は拒否する（positive 制約）", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, jpy_rate: 0 })).toThrow();
  });

  it("jpy_rate が負値は拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, jpy_rate: -157.92 })).toThrow();
  });

  it("jpy_rate が null は拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, jpy_rate: null })).toThrow();
  });

  it("jpy_rate が数値文字列でも coercion せず拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, jpy_rate: "157" })).toThrow();
  });
});

describe("PricingDataSchema — sub_tools 配列・型強制", () => {
  it("sub_tools が非配列の場合は拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, sub_tools: "not-array" })).toThrow();
  });

  it("api_models 要素の型エラー（provider が数値）を伝播して拒否する", () => {
    const badNested = { ...pricingData, api_models: [{ ...apiModel, provider: 123 }] };
    expect(() => PricingDataSchema.parse(badNested)).toThrow();
  });
});

describe("dateString — フォーマット境界（YYYY-MM-DD のゼロ埋め必須）", () => {
  it("ゼロ埋めなしの月（2026-5-30）は拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, generated_at: "2026-5-30" })).toThrow();
  });

  it("ゼロ埋めなしの日（2026-05-3）は拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, generated_at: "2026-05-3" })).toThrow();
  });

  it("区切りなし（20260530）は拒否する", () => {
    expect(() => PricingDataSchema.parse({ ...pricingData, generated_at: "20260530" })).toThrow();
  });

  it("フォーマットのみ検証のため意味的に不正な日付（2026-13-01）は通過する", () => {
    // 仕様: dateString は /^\d{4}-\d{2}-\d{2}$/ のみで意味的妥当性は検証しない。
    // この挙動を明示的に固定（将来 strict 化した場合に検知できるよう）。
    expect(() =>
      PricingDataSchema.parse({ ...pricingData, generated_at: "2026-13-01" })
    ).not.toThrow();
  });

  it("jpy_rate_date は 'fallback' リテラルを許容する", () => {
    expect(() =>
      PricingDataSchema.parse({ ...pricingData, jpy_rate_date: "fallback" })
    ).not.toThrow();
  });
});
