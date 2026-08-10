import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("OpenAI Codex Harness Engineering Evals Guide", () => {
  it("renders the correct title (<h1>)", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("OpenAI Codexにおけるハーネスエンジニアリング実践ガイド");
  });

  it("renders exactly 9 major sections (<h2>)", () => {
    const { container } = render(<Page />);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(9);

    const expectedTitles = [
      "はじめに — なぜ「評価基盤」がハーネスエンジニアリングの核心なのか",
      "ハーネスエンジニアリングとは何か",
      "なぜ評価が「継続的」でなければならないのか",
      "評価基盤の7層モデル — 詳細解説",
      "ステップバイステップ実装ガイド",
      "ハーネス成熟度チェックリスト",
      "アンチパターン",
      "まとめ",
      "参考文献",
    ];

    expectedTitles.forEach((title, index) => {
      expect(h2Elements[index]?.textContent).toContain(title);
    });
  });

  it("renders 7 mermaid diagrams", () => {
    const { container } = render(<Page />);
    const mermaidDiagrams = container.querySelectorAll('[data-testid="mermaid"]');
    expect(mermaidDiagrams.length).toBe(7);
  });

  it('ensures all external links have target="_blank" and rel="noopener noreferrer"', () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a")).filter((a) =>
      a.getAttribute("href")?.startsWith("http")
    );

    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("rel")).toContain("noreferrer");
    });
  });

  it("ensures all internal links use clean URLs (no .html)", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && !href.startsWith("http") && !href.startsWith("#");
    });

    internalLinks.forEach((a) => {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    });
  });
});

describe("/codex/harness-engineering metadata", () => {
  it("metadata が export されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("ハーネスエンジニアリング");
  });

  it("description が設定されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.description).toBe("string");
    expect((meta.description ?? "").length).toBeGreaterThan(20);
  });
});
