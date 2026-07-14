/**
 * F-5 契約テスト: 横断検索（plans/009）。
 *
 * 検索インデックスは page-registry からのビルド時導出であり、外部ライブラリを使わない。
 * ここでは検索の意味論（AND・大小無視・NFKC・タグ絞り込み）とページ契約を固定する。
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { type PageEntry, pageRegistry } from "@/lib/page-registry";
import { allTopics, searchEntries } from "@/lib/search";
import SearchPage, { metadata } from "./page";

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

const pool: PageEntry[] = [
  entry({
    slug: "/a",
    title: "Claude Skills",
    topics: ["claude", "skill"],
    summary: "スキルの作り方",
  }),
  entry({
    slug: "/b",
    title: "Agent Security",
    group: "運用・品質",
    topics: ["agent", "security"],
    summary: "エージェントの安全な運用",
  }),
  entry({ slug: "/c", title: "RAG Embeddings", topics: ["rag"], summary: "埋め込みの選び方" }),
];

describe("F-5 - searchEntries", () => {
  it("大文字小文字を無視して title に部分一致する", () => {
    expect(searchEntries("claude", null, pool).map((e) => e.slug)).toEqual(["/a"]);
    expect(searchEntries("CLAUDE", null, pool).map((e) => e.slug)).toEqual(["/a"]);
  });

  it("summary に一致する", () => {
    expect(searchEntries("埋め込み", null, pool).map((e) => e.slug)).toEqual(["/c"]);
  });

  it("topics に一致する", () => {
    expect(searchEntries("security", null, pool).map((e) => e.slug)).toEqual(["/b"]);
  });

  it("複数トークンは AND（全トークンがどこかに一致）", () => {
    expect(searchEntries("claude skill", null, pool).map((e) => e.slug)).toEqual(["/a"]);
    expect(searchEntries("claude rag", null, pool)).toEqual([]);
  });

  it("NFKC 正規化で全角英数を吸収する", () => {
    expect(searchEntries("ＲＡＧ", null, pool).map((e) => e.slug)).toEqual(["/c"]);
  });

  it("タグで絞り込む", () => {
    expect(searchEntries("", "agent", pool).map((e) => e.slug)).toEqual(["/b"]);
  });

  it("タグとクエリを併用できる（AND）", () => {
    expect(searchEntries("security", "agent", pool).map((e) => e.slug)).toEqual(["/b"]);
    expect(searchEntries("claude", "agent", pool)).toEqual([]);
  });

  it("クエリもタグも空なら全件を返す（ブラウズ用途）", () => {
    expect(searchEntries("", null, pool)).toHaveLength(pool.length);
  });

  it("空白のみのクエリは空クエリと同じ", () => {
    expect(searchEntries("   ", null, pool)).toHaveLength(pool.length);
  });

  it("一致なしは空配列", () => {
    expect(searchEntries("存在しない語", null, pool)).toEqual([]);
  });

  it("結果は決定論的（同じ入力に同じ順序）", () => {
    const first = searchEntries("", null).map((e) => e.slug);
    const second = searchEntries("", null).map((e) => e.slug);
    expect(first).toEqual(second);
    expect(first).toHaveLength(pageRegistry.length);
  });
});

describe("F-5 - allTopics", () => {
  it("頻度降順 → 名前昇順（決定論的）", () => {
    const topics = allTopics(pool);
    expect(topics.map((t) => t.topic)).toEqual(["agent", "claude", "rag", "security", "skill"]);
    expect(topics.every((t) => t.count === 1)).toBe(true);
  });

  it("同一 topic を数え上げる", () => {
    const dupes = [
      entry({ slug: "/1", topics: ["agent"] }),
      entry({ slug: "/2", topics: ["agent"] }),
    ];
    expect(allTopics(dupes)).toEqual([{ topic: "agent", count: 2 }]);
  });

  it("実 registry の topics をすべて含む", () => {
    const topics = new Set(allTopics().map((t) => t.topic));
    for (const e of pageRegistry) {
      for (const t of e.topics) expect(topics.has(t)).toBe(true);
    }
  });
});

describe("F-5 - /search ページ契約", () => {
  it("metadata に title / description を持つ", () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
  });

  it("h1 とタグチップを描画する", () => {
    render(<SearchPage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("検索");
    expect(screen.getByRole("searchbox")).toBeTruthy();
  });
});
