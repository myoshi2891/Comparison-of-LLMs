import { describe, expect, it } from "vitest";
import {
  byAddedAtDesc,
  byLastReviewedDesc,
  findBySlug,
  PageEntrySchema,
  pageRegistry,
} from "@/lib/page-registry";

describe("PageEntrySchema", () => {
  const valid = {
    slug: "/claude/skill",
    title: "Skill",
    group: "Providers",
    // F-4'（plans/008）: Providers はナビで 2 段ネストするため category が必須。
    category: "Claude",
    provider: "claude",
    topics: ["skill"],
    summary: "テスト用の要約。",
    addedAt: "2026-04-18",
    lastReviewed: "2026-07-01",
  };

  it("正当なエントリを受理する", () => {
    expect(() => PageEntrySchema.parse(valid)).not.toThrow();
  });

  it("provider は省略可能", () => {
    const { provider: _provider, ...rest } = valid;
    expect(() => PageEntrySchema.parse(rest)).not.toThrow();
  });

  it("ネストしないグループでは category を省略できる", () => {
    const { category: _category, provider: _provider, ...rest } = valid;
    expect(() => PageEntrySchema.parse({ ...rest, group: "Agent 開発" })).not.toThrow();
  });

  it("Providers エントリの category 欠落を拒否する（ナビ 2 段目が作れない）", () => {
    const { category: _category, ...rest } = valid;
    expect(() => PageEntrySchema.parse(rest)).toThrow();
  });

  it("NAV_GROUPS に無い group を拒否する（typo 検知）", () => {
    expect(() => PageEntrySchema.parse({ ...valid, group: "存在しないグループ" })).toThrow();
  });

  it("空 slug を拒否する", () => {
    expect(() => PageEntrySchema.parse({ ...valid, slug: "" })).toThrow();
  });

  it("/ で始まらない slug を拒否する", () => {
    expect(() => PageEntrySchema.parse({ ...valid, slug: "claude/skill" })).toThrow();
  });

  it("YYYY-MM-DD でない日付を拒否する", () => {
    expect(() => PageEntrySchema.parse({ ...valid, lastReviewed: "2026/07/01" })).toThrow();
    expect(() => PageEntrySchema.parse({ ...valid, addedAt: "2026-7-1" })).toThrow();
  });

  it("空タイトルを拒否する", () => {
    expect(() => PageEntrySchema.parse({ ...valid, title: "" })).toThrow();
  });
});

describe("pageRegistry", () => {
  it("Home（/）を含む", () => {
    expect(pageRegistry.some((e) => e.slug === "/")).toBe(true);
  });

  it("全エントリがスキーマを満たす", () => {
    for (const entry of pageRegistry) {
      expect(() => PageEntrySchema.parse(entry)).not.toThrow();
    }
  });

  it("slug が重複しない", () => {
    const slugs = pageRegistry.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("addedAt <= lastReviewed（不変条件）", () => {
    for (const entry of pageRegistry) {
      expect(entry.addedAt.localeCompare(entry.lastReviewed)).toBeLessThanOrEqual(0);
    }
  });

  it("provider は既知のプロバイダーのみ", () => {
    const known = ["claude", "google", "codex", "copilot", "moonshot", "deepseek", "xai", "zhipu"];
    for (const entry of pageRegistry) {
      if (entry.provider) expect(known).toContain(entry.provider);
    }
  });
});

describe("findBySlug", () => {
  it("既知の slug でエントリを返す", () => {
    const entry = findBySlug("/claude/skill");
    expect(entry?.slug).toBe("/claude/skill");
    expect(entry?.provider).toBe("claude");
  });

  it("未知の slug では undefined を返す", () => {
    expect(findBySlug("/does/not/exist")).toBeUndefined();
  });

  it("末尾スラッシュを正規化して解決する", () => {
    expect(findBySlug("/claude/skill/")?.slug).toBe("/claude/skill");
  });
});

describe("byAddedAtDesc / byLastReviewedDesc", () => {
  it("byAddedAtDesc は addedAt の降順で全件返す", () => {
    const sorted = byAddedAtDesc();
    expect(sorted).toHaveLength(pageRegistry.length);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].addedAt.localeCompare(sorted[i].addedAt)).toBeGreaterThanOrEqual(0);
    }
  });

  it("byLastReviewedDesc は lastReviewed の降順で全件返す", () => {
    const sorted = byLastReviewedDesc();
    expect(sorted).toHaveLength(pageRegistry.length);
    for (let i = 1; i < sorted.length; i++) {
      expect(
        sorted[i - 1].lastReviewed.localeCompare(sorted[i].lastReviewed)
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("limit を指定すると件数を絞る", () => {
    expect(byAddedAtDesc(5)).toHaveLength(5);
    expect(byLastReviewedDesc(3)).toHaveLength(3);
  });

  it("元の pageRegistry を破壊しない", () => {
    const before = pageRegistry.map((e) => e.slug);
    byAddedAtDesc();
    byLastReviewedDesc();
    expect(pageRegistry.map((e) => e.slug)).toEqual(before);
  });
});
