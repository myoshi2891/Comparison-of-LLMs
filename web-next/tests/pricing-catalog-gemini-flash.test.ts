import { describe, expect, it } from "vitest";
import dataPricing from "@/data/pricing.json";
import publicPricing from "@/public/pricing.json";

// 非推奨 Flash エイリアスは提供終了ではなく後継モデルへ自動ルーティングされる。
// 3.5 Flash は 3.6 Flash として課金されるため、価格も 3.6 Flash と一致させる。
type ApiModelLike = { name: string; tag: string; price_in: number; price_out: number };

const find = (models: ApiModelLike[], name: string): ApiModelLike => {
  const model = models.find((m) => m.name === name);
  if (!model) throw new Error(`${name} が見つからない`);
  return model;
};

const pick = ({ name, tag, price_in, price_out }: ApiModelLike) => ({
  name,
  tag,
  price_in,
  price_out,
});

describe.each([
  ["data/pricing.json", dataPricing.api_models],
  ["public/pricing.json", publicPricing.api_models],
])("%s の非推奨 Gemini Flash エイリアス", (_label, models) => {
  it("3.7 Flash / 3.5 Flash のライフサイクルは Deprecated で、3.5 Flash は 3.6 Flash と同額", () => {
    expect(pick(find(models, "Gemini 3.7 Flash"))).toEqual({
      name: "Gemini 3.7 Flash",
      tag: "Deprecated",
      price_in: 0.75,
      price_out: 3.75,
    });
    expect(pick(find(models, "Gemini 3.5 Flash"))).toEqual({
      name: "Gemini 3.5 Flash",
      tag: "Deprecated",
      price_in: 0.75,
      price_out: 3.75,
    });
    const target = find(models, "Gemini 3.6 Flash");
    expect([target.price_in, target.price_out]).toEqual([0.75, 3.75]);
  });
});

describe("pricing.json の2つのコピー", () => {
  it("data と public は同一内容である", () => {
    expect(publicPricing).toEqual(dataPricing);
  });
});
