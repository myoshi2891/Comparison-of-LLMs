import { describe, expect, it } from "vitest";
import {
  ApiModelSchema,
  PricingDataSchema,
  ScrapeStatusSchema,
  SubToolSchema,
} from "@/lib/pricing";

const validApiModel = {
  provider: "Anthropic",
  name: "Claude Opus 4.6",
  tag: "最新",
  cls: "tag-flag",
  price_in: 5.0,
  price_out: 25.0,
  sub_ja: "エージェントチーム / 200K",
  sub_en: "Agent teams / 200K ctx",
  scrape_status: "fallback",
} as const;

const validSubTool = {
  group: "IDE",
  name: "Cursor Pro",
  monthly: 20,
  annual: 16.67,
  tag: "人気",
  cls: "tag-flag",
  note_ja: "月額プラン",
  note_en: "Monthly plan",
  scrape_status: "success",
} as const;

const validPricingData = {
  generated_at: "2026-03-07",
  jpy_rate: 157.92,
  jpy_rate_date: "2026-03-06",
  api_models: [validApiModel],
  sub_tools: [validSubTool],
};

describe("ScrapeStatusSchema", () => {
  it("accepts all three literal values", () => {
    expect(ScrapeStatusSchema.parse("success")).toBe("success");
    expect(ScrapeStatusSchema.parse("fallback")).toBe("fallback");
    expect(ScrapeStatusSchema.parse("manual")).toBe("manual");
  });

  it("rejects any other string", () => {
    expect(() => ScrapeStatusSchema.parse("pending")).toThrow();
    expect(() => ScrapeStatusSchema.parse("")).toThrow();
  });

  it("rejects non-string types", () => {
    expect(() => ScrapeStatusSchema.parse(1)).toThrow();
    expect(() => ScrapeStatusSchema.parse(null)).toThrow();
  });
});

describe("ApiModelSchema", () => {
  it("parses a valid ApiModel", () => {
    const result = ApiModelSchema.parse(validApiModel);
    expect(result).toEqual(validApiModel);
  });

  it("rejects negative price_in", () => {
    expect(() => ApiModelSchema.parse({ ...validApiModel, price_in: -1 })).toThrow();
  });

  it("rejects negative price_out", () => {
    expect(() => ApiModelSchema.parse({ ...validApiModel, price_out: -0.01 })).toThrow();
  });

  it("accepts zero prices (free tier)", () => {
    const zero = { ...validApiModel, price_in: 0, price_out: 0 };
    expect(() => ApiModelSchema.parse(zero)).not.toThrow();
  });

  it("rejects missing required fields", () => {
    const { sub_ja: _omitted, ...incomplete } = validApiModel;
    expect(() => ApiModelSchema.parse(incomplete)).toThrow();
  });

  it("rejects invalid scrape_status", () => {
    expect(() => ApiModelSchema.parse({ ...validApiModel, scrape_status: "draft" })).toThrow();
  });

  it("rejects unknown extra fields (strict schema)", () => {
    expect(() => ApiModelSchema.parse({ ...validApiModel, extra_field: "x" })).toThrow();
  });
});

describe("SubToolSchema", () => {
  it("parses a valid SubTool with annual price", () => {
    expect(SubToolSchema.parse(validSubTool)).toEqual(validSubTool);
  });

  it("accepts annual: null", () => {
    const monthlyOnly = { ...validSubTool, annual: null };
    expect(SubToolSchema.parse(monthlyOnly).annual).toBeNull();
  });

  it("rejects negative monthly", () => {
    expect(() => SubToolSchema.parse({ ...validSubTool, monthly: -5 })).toThrow();
  });

  it("rejects monthly as string", () => {
    expect(() => SubToolSchema.parse({ ...validSubTool, monthly: "20" })).toThrow();
  });

  it("rejects unknown extra fields (strict schema)", () => {
    expect(() => SubToolSchema.parse({ ...validSubTool, extra_field: "x" })).toThrow();
  });
});

describe("PricingDataSchema", () => {
  it("parses a valid PricingData object", () => {
    const result = PricingDataSchema.parse(validPricingData);
    expect(result.api_models).toHaveLength(1);
    expect(result.sub_tools).toHaveLength(1);
    expect(result.jpy_rate).toBe(157.92);
  });

  it("accepts empty arrays", () => {
    const empty = { ...validPricingData, api_models: [], sub_tools: [] };
    expect(() => PricingDataSchema.parse(empty)).not.toThrow();
  });

  it("rejects missing jpy_rate", () => {
    const { jpy_rate: _omitted, ...incomplete } = validPricingData;
    expect(() => PricingDataSchema.parse(incomplete)).toThrow();
  });

  it("rejects non-array api_models", () => {
    expect(() =>
      PricingDataSchema.parse({ ...validPricingData, api_models: "not-array" })
    ).toThrow();
  });

  it("propagates nested validation errors", () => {
    const badNested = {
      ...validPricingData,
      api_models: [{ ...validApiModel, price_in: -1 }],
    };
    expect(() => PricingDataSchema.parse(badNested)).toThrow();
  });

  it("rejects unknown extra fields (strict schema)", () => {
    expect(() => PricingDataSchema.parse({ ...validPricingData, extra_field: "x" })).toThrow();
  });

  it("rejects invalid generated_at format", () => {
    expect(() =>
      PricingDataSchema.parse({ ...validPricingData, generated_at: "2026-03-07T14:30:00Z" })
    ).toThrow();
    expect(() =>
      PricingDataSchema.parse({ ...validPricingData, generated_at: "not-a-date" })
    ).toThrow();
  });

  it("rejects invalid jpy_rate_date format", () => {
    expect(() =>
      PricingDataSchema.parse({ ...validPricingData, jpy_rate_date: "03/07/2026" })
    ).toThrow();
  });
});
