/**
 * F-7 契約テスト: 関連ページリンクが registry の topics 近接から導出されることを固定する（plans/009）。
 *
 * 中核は「決定論性」— 同点スコアのタイブレークまで一意に決まること。順序が偶然に決まると、
 * 無関係なページ追加で全ページの関連リンクが揺れ、SSG の出力が不安定になる。
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RelatedPages } from "@/components/site/RelatedPages";
import { type PageEntry, pageRegistry } from "@/lib/page-registry";
import { relatedEntries } from "@/lib/related-pages";

const entry = (over: Partial<PageEntry>): PageEntry => ({
  slug: "/x",
  title: "X",
  group: "Agent 開発",
  topics: [],
  summary: "s",
  addedAt: "2026-01-01",
  lastReviewed: "2026-01-01",
  ...over,
});

describe("F-7 - relatedEntries スコアリング", () => {
  it("共有 topics 数の降順で返す", () => {
    const source = entry({ slug: "/a", topics: ["agent", "security", "guide"] });
    const pool = [
      source,
      entry({ slug: "/one", topics: ["agent"] }),
      entry({ slug: "/three", topics: ["agent", "security", "guide"] }),
      entry({ slug: "/two", topics: ["agent", "security"] }),
    ];
    expect(relatedEntries("/a", 3, pool).map((e) => e.slug)).toEqual(["/three", "/two", "/one"]);
  });

  it("共有 topics 数が同点なら同一 group を優先する", () => {
    const source = entry({ slug: "/a", group: "Agent 開発", topics: ["agent"] });
    const pool = [
      source,
      entry({ slug: "/other-group", group: "運用・品質", topics: ["agent"] }),
      entry({ slug: "/same-group", group: "Agent 開発", topics: ["agent"] }),
    ];
    expect(relatedEntries("/a", 2, pool).map((e) => e.slug)).toEqual(["/same-group", "/other-group"]);
  });

  it("スコア・group が同点なら addedAt 降順 → slug 昇順（決定論的タイブレーク）", () => {
    const source = entry({ slug: "/a", topics: ["agent"] });
    const pool = [
      source,
      entry({ slug: "/b", topics: ["agent"], addedAt: "2026-01-05" }),
      entry({ slug: "/c", topics: ["agent"], addedAt: "2026-06-01" }),
      entry({ slug: "/d", topics: ["agent"], addedAt: "2026-06-01" }),
    ];
    expect(relatedEntries("/a", 3, pool).map((e) => e.slug)).toEqual(["/c", "/d", "/b"]);
  });

  it("自分自身は含まれない", () => {
    const source = entry({ slug: "/a", topics: ["agent"] });
    const pool = [source, entry({ slug: "/b", topics: ["agent"] })];
    expect(relatedEntries("/a", 3, pool).map((e) => e.slug)).not.toContain("/a");
  });

  it("共有 topics が 0 件のページは除外する（無関係なリンクを出さない）", () => {
    const source = entry({ slug: "/a", topics: ["agent"] });
    const pool = [source, entry({ slug: "/b", topics: ["rag"] })];
    expect(relatedEntries("/a", 3, pool)).toEqual([]);
  });

  it("topics が空のページ（Home 等）は関連なしを返す", () => {
    const source = entry({ slug: "/a", topics: [] });
    const pool = [source, entry({ slug: "/b", topics: ["agent"] })];
    expect(relatedEntries("/a", 3, pool)).toEqual([]);
  });

  it("limit を超えて返さない", () => {
    const source = entry({ slug: "/a", topics: ["agent"] });
    const pool = [
      source,
      entry({ slug: "/b", topics: ["agent"] }),
      entry({ slug: "/c", topics: ["agent"] }),
      entry({ slug: "/d", topics: ["agent"] }),
    ];
    expect(relatedEntries("/a", 2, pool)).toHaveLength(2);
  });

  it("registry 未登録の slug は空配列", () => {
    expect(relatedEntries("/not-registered")).toEqual([]);
  });

  it("実 registry: openclaw ガイドは 3 件の関連ページを持つ", () => {
    const results = relatedEntries("/agent/openclaw-advanced-agent-security-guide");
    expect(results).toHaveLength(3);
    expect(results.map((e) => e.slug)).not.toContain("/agent/openclaw-advanced-agent-security-guide");
  });

  it("実 registry: 呼び出しが冪等（同じ入力に同じ順序）", () => {
    const first = relatedEntries("/agent/skills").map((e) => e.slug);
    const second = relatedEntries("/agent/skills").map((e) => e.slug);
    expect(first).toEqual(second);
  });

  it("実 registry: 返るエントリはすべて registry のエントリ", () => {
    const slugs = new Set(pageRegistry.map((e) => e.slug));
    for (const e of relatedEntries("/security/ai-security-best-practices")) {
      expect(slugs.has(e.slug)).toBe(true);
    }
  });
});

describe("F-7 - RelatedPages コンポーネント", () => {
  it("registry 未登録のパスでは何も描画しない", () => {
    const { container } = render(<RelatedPages pathname="/not-registered" />);
    expect(container.firstChild).toBeNull();
  });

  it("topics が空の Home では何も描画しない", () => {
    const { container } = render(<RelatedPages pathname="/" />);
    expect(container.firstChild).toBeNull();
  });

  it("登録ページでは関連リンクを描画する", () => {
    render(<RelatedPages pathname="/agent/openclaw-advanced-agent-security-guide" />);
    const nav = screen.getByRole("navigation", { name: "関連ページ" });
    const links = screen.getAllByRole("link");
    expect(nav).toBeTruthy();
    expect(links.length).toBe(3);
    for (const link of links) {
      expect(link.getAttribute("href")?.startsWith("/")).toBe(true);
    }
  });
});
