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
    // 3.6 Flash は期限付き特価のため金額を固定せず、課金先との一致だけを契約とする
    const { name, tag } = find(models, "Gemini 3.7 Flash");
    expect({ name, tag }).toEqual({ name: "Gemini 3.7 Flash", tag: "Deprecated" });
    const target = find(models, "Gemini 3.6 Flash");
    expect(pick(find(models, "Gemini 3.5 Flash"))).toEqual({
      name: "Gemini 3.5 Flash",
      tag: "Deprecated",
      price_in: target.price_in,
      price_out: target.price_out,
    });
  });
});

describe("pricing.json の2つのコピー", () => {
  it("data と public は同一内容である", () => {
    expect(publicPricing).toEqual(dataPricing);
  });
});
