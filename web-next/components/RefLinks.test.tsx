/**
 * RefLinks 契約テスト。
 *
 * レガシーからの重要差分:
 * - 生 HTML 注入 (React の unsafe HTML 注入 prop) を撲滅し、
 *   tRich("refNote", lang) で React ノードとして合成する
 *   （Phase 5 の XSS 対策投資を回収する最後のコンポーネント）。
 * - Server Component: 完全に presentational、副作用なし。
 *
 * カバレッジ:
 * - Root structure / カード数 / リンク属性
 * - 代表カード (OpenAI) の JA/EN desc 切替
 * - 通貨カード (ci === 15) の動的タイトル切替
 * - refNote を tRich 経由で描画していること (インライン色 strong)
 * - 静的検査: ソースに生 HTML 注入 API 名が含まれない
 * - 静的検査: ソースに "use client" が含まれない (Server Component)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RefLinks } from "@/components/RefLinks";

describe("RefLinks - root structure", () => {
  it("renders .ref-section.section container", () => {
    const { container } = render(<RefLinks lang="ja" />);
    expect(container.querySelector(".ref-section.section")).not.toBeNull();
  });

  it("renders .ref-title with Japanese title", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const title = container.querySelector(".ref-title");
    expect(title).not.toBeNull();
    expect(title?.textContent).toContain("参考リンク集");
  });

  it("renders .ref-title with English title", () => {
    const { container } = render(<RefLinks lang="en" />);
    const title = container.querySelector(".ref-title");
    expect(title?.textContent).toContain("Reference Links");
  });

  it("renders .ref-grid container", () => {
    const { container } = render(<RefLinks lang="ja" />);
    expect(container.querySelector(".ref-grid")).not.toBeNull();
  });
});

describe("RefLinks - cards", () => {
  it("renders exactly 16 ref-cards", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const cards = container.querySelectorAll(".ref-card");
    expect(cards.length).toBe(16);
  });

  it("each card has h5 heading and .ref-link body", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const cards = container.querySelectorAll(".ref-card");
    cards.forEach((card) => {
      expect(card.querySelector("h5")).not.toBeNull();
      expect(card.querySelector(".ref-link")).not.toBeNull();
    });
  });

  it("every anchor opens in new tab with noopener noreferrer", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const anchors = container.querySelectorAll(".ref-card a");
    expect(anchors.length).toBeGreaterThan(0);
    anchors.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });
});

describe("RefLinks - OpenAI card representative content", () => {
  it("first card contains openai.com/api/pricing label", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const firstCard = container.querySelector(".ref-card");
    expect(firstCard?.textContent).toContain("openai.com/api/pricing");
  });

  it("first card shows Japanese description in ja mode", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const firstCard = container.querySelector(".ref-card");
    expect(firstCard?.textContent).toContain("API全モデル料金");
  });

  it("first card shows English description in en mode", () => {
    const { container } = render(<RefLinks lang="en" />);
    const firstCard = container.querySelector(".ref-card");
    expect(firstCard?.textContent).toContain("All models pricing");
  });
});

describe("RefLinks - currency card dynamic title (ci === 15)", () => {
  it("last card shows '💱 為替レート参考' in ja", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const cards = container.querySelectorAll(".ref-card");
    const lastCard = cards[cards.length - 1];
    const heading = lastCard?.querySelector("h5");
    expect(heading?.textContent).toBe("💱 為替レート参考");
  });

  it("last card shows '💱 FX Rate Reference' in en", () => {
    const { container } = render(<RefLinks lang="en" />);
    const cards = container.querySelectorAll(".ref-card");
    const lastCard = cards[cards.length - 1];
    const heading = lastCard?.querySelector("h5");
    expect(heading?.textContent).toBe("💱 FX Rate Reference");
  });
});

describe("RefLinks - refNote rendered via tRich (XSS-safe)", () => {
  it("renders .note-box inside the ref-section", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const noteBox = container.querySelector(".ref-section .note-box");
    expect(noteBox).not.toBeNull();
  });

  it("note-box contains Japanese refNote heading", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const noteBox = container.querySelector(".note-box");
    expect(noteBox?.textContent).toContain("📚 価格・為替の正確性について:");
  });

  it("note-box contains English refNote heading", () => {
    const { container } = render(<RefLinks lang="en" />);
    const noteBox = container.querySelector(".note-box");
    expect(noteBox?.textContent).toContain("📚 About Accuracy:");
  });

  it("note-box preserves inline colored <strong> elements (3 colors)", () => {
    const { container } = render(<RefLinks lang="ja" />);
    const noteBox = container.querySelector(".note-box");
    const colored = Array.from(noteBox?.querySelectorAll("strong") ?? []).filter(
      (el) => (el as HTMLElement).style.color !== ""
    );
    expect(colored.length).toBe(3);
    const colors = colored.map((el) => (el as HTMLElement).style.color);
    const expectedHexes = ["#a5b4fc", "#7dd3fc", "#f472b6"];
    const expectedRgbs = ["rgb(165, 180, 252)", "rgb(125, 211, 252)", "rgb(244, 114, 182)"];
    colors.forEach((color, i) => {
      expect([expectedHexes[i], expectedRgbs[i]]).toContain(color);
    });
  });
});

describe("RefLinks - static source safety", () => {
  it("source file does not use React unsafe HTML injection API", () => {
    const source = readFileSync(join(__dirname, "RefLinks.tsx"), "utf8");
    // API 名をリテラルで書かずに組み立てて検索する。
    const unsafeApiName = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source).not.toContain(unsafeApiName);
  });

  it("source file does not declare a 'use client' directive (Server Component)", () => {
    const source = readFileSync(join(__dirname, "RefLinks.tsx"), "utf8");
    // ファイル先頭 200 文字以内の "use client" / 'use client' ディレクティブを検査。
    const head = source.slice(0, 200);
    expect(head).not.toMatch(/["']use client["']/);
  });
});
