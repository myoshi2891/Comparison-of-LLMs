import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

// MermaidDiagram のモック
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("xAI Grok Best Practices Page", () => {
  it("exports valid metadata with title and description", () => {
    expect(metadata.title).toBe("xAI の LLM（Grok）完全ガイド ― 初学者のためのベストプラクティス");
    expect(metadata.description).toContain("xAI API（Grok モデル群）");
  });

  it("renders page title correctly in h1", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.replace(/\s+/g, " ").trim()).toContain(
      "xAI の LLM（Grok）完全ガイド ― 初学者のためのベストプラクティス"
    );
  });

  it("renders exactly 18 section headings (h2)", () => {
    const { container } = render(<Page />);
    const h2List = container.querySelectorAll("h2");
    expect(h2List.length).toBe(18);
  });

  it("has target=_blank and rel=noopener noreferrer on external links", () => {
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      const rel = link.getAttribute("rel") || "";
      expect(rel.includes("noopener")).toBe(true);
      expect(rel.includes("noreferrer")).toBe(true);
    }
  });

  it("has clean internal links without .html extensions", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a[href^='/']"));

    for (const link of internalLinks) {
      const href = link.getAttribute("href") || "";
      expect(href.endsWith(".html")).toBe(false);
    }
  });

  it("renders 5 Mermaid diagrams", () => {
    const { container } = render(<Page />);
    const diagrams = container.querySelectorAll("[data-testid='mermaid-diagram']");
    expect(diagrams.length).toBe(5);
  });

  it("1.1 モデル比較表に grok-4.7 の行が grok-4.5 の直前に同じ列構成で並ぶ", () => {
    const { container } = render(<Page />);
    const h3 = Array.from(container.querySelectorAll("h3")).find((h) =>
      h.textContent?.startsWith("1.1 ")
    );
    const table = h3?.nextElementSibling;
    const rows = Array.from(table?.querySelectorAll("tbody tr") ?? []).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) =>
        (td.textContent ?? "").replace(/\s+/g, " ").trim()
      )
    );
    expect(rows[0]).toEqual([
      "grok-4.7（2026年10月時点のフラッグシップ）",
      "500k",
      "$2.00 (<200k) / $4.00 (≥200k)",
      "$0.50 (<200k) / $1.00 (≥200k)",
      "$6.00 (<200k) / $12.00 (≥200k)",
      "2026年9月21日登場の grok-4.5 後継。プロンプトが 200k トークン以上のリクエストは全トークンに高い単価を適用",
    ]);
    expect(rows[1][0]).toContain("grok-4.5");
  });
});
