/**
 * i18n プレーンテキスト API 契約テスト。
 *
 * 意図:
 * - T の内部 shape には触れず、t(key, lang) の戻り値契約のみを検証する。
 *   これにより、後続 Refactor フェーズで T の型が {ja,en} から
 *   {text, render} 型に変化しても本ファイルのテストは影響を受けない。
 * - プレースホルダ ({n}/{m}/{date}) の補完は呼び出し側責務であり、
 *   i18n 層は素のまま返すことを契約として固定する。
 */

import { describe, expect, it } from "vitest";
import { T, type TranslationKey, t } from "@/lib/i18n";

describe("i18n - key coverage", () => {
  it("has exactly 45 translation keys", () => {
    // 将来キーが増減したら本アサートを意識的に更新する (契約変更ゲート)。
    expect(Object.keys(T).length).toBe(45);
  });

  it("returns non-empty ja and en strings for every key", () => {
    const keys = Object.keys(T) as TranslationKey[];
    for (const key of keys) {
      const ja = t(key, "ja");
      const en = t(key, "en");
      expect(typeof ja, `${key}/ja type`).toBe("string");
      expect(typeof en, `${key}/en type`).toBe("string");
      expect(ja.length, `${key}/ja empty`).toBeGreaterThan(0);
      expect(en.length, `${key}/en empty`).toBeGreaterThan(0);
    }
  });
});

describe("i18n - round-trip for plain keys", () => {
  it("returns correct ja text for representative plain keys", () => {
    expect(t("colModel", "ja")).toBe("モデル");
    expect(t("colTool", "ja")).toBe("ツール / プラン");
    expect(t("tabApi", "ja")).toBe("🔌 API モデル");
    expect(t("cheapestBadge", "ja")).toBe("最安");
  });

  it("returns correct en text for representative plain keys", () => {
    expect(t("colModel", "en")).toBe("Model");
    expect(t("rateLabel", "en")).toBe("Exchange Rate:");
    expect(t("tabSub", "en")).toBe("💳 Coding Tools");
    expect(t("annualLabel", "en")).toBe("Annual");
  });

  it("returns identical ja and en for language-neutral eyebrow key", () => {
    // eyebrow は現状 ja/en が同一文字列 ("AI Cost Simulator · v5 ...")。
    // この不変条件が崩れたら意図的な変更として検知したい。
    expect(t("eyebrow", "ja")).toBe(t("eyebrow", "en"));
  });
});

describe("i18n - placeholder preservation", () => {
  it("keeps {n} and {m} placeholders unresolved in metaModels", () => {
    // 補完は呼び出し側責務 (App.tsx で .replace する) であることを契約化。
    expect(t("metaModels", "ja")).toContain("{n}");
    expect(t("metaModels", "ja")).toContain("{m}");
    expect(t("metaModels", "en")).toContain("{n}");
    expect(t("metaModels", "en")).toContain("{m}");
  });

  it("keeps {date} placeholder unresolved in rateDate", () => {
    expect(t("rateDate", "ja")).toContain("{date}");
    expect(t("rateDate", "en")).toContain("{date}");
  });
});
