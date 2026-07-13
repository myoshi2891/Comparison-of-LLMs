/**
 * F-1c 契約テスト: sitemap を page-registry から導出する。
 *
 * 従来はハードコードの ROUTES 配列（24 件）で、実ルート 55 と乖離していた
 * （plans/006 §2.3 が指摘する「属性の複製先が増えると腐る」の実例）。
 */
import { describe, expect, it } from "vitest";
import { pageRegistry } from "@/lib/page-registry";
import sitemap from "./sitemap";

const entries = sitemap();

describe("sitemap", () => {
  it("registry の全ページ分のエントリを出力する", () => {
    expect(entries).toHaveLength(pageRegistry.length);
  });

  it("registry の全 slug が URL に含まれる（欠落ルート検知）", () => {
    const urls = entries.map((e) => e.url);
    for (const page of pageRegistry) {
      const expected = page.slug === "/" ? "/" : page.slug;
      expect(urls.some((u) => new URL(u).pathname === expected)).toBe(true);
    }
  });

  it("lastModified に該当ページの lastReviewed を反映する", () => {
    const skill = pageRegistry.find((e) => e.slug === "/claude/skill");
    const entry = entries.find((e) => new URL(e.url).pathname === "/claude/skill");
    expect(entry?.lastModified).toBe(skill?.lastReviewed);
  });

  it("全 URL が絶対 URL（http/https）である", () => {
    for (const e of entries) {
      expect(e.url).toMatch(/^https?:\/\//);
    }
  });

  it("ルート（/）の priority が最も高い", () => {
    const root = entries.find((e) => new URL(e.url).pathname === "/");
    expect(root?.priority).toBe(1.0);
    for (const e of entries) {
      if (new URL(e.url).pathname !== "/") {
        expect(e.priority).toBeLessThan(1.0);
      }
    }
  });
});
