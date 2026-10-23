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
    expect(rows[1]).toEqual([
      "grok-4.5（2026年7月時点のフラッグシップ。2026年10月時点の最新は grok-4.7）",
      "500k",
      "$2.00 (<200k) / $4.00 (≥200k)",
      "$0.30 (<200k) / $0.60 (≥200k)",
      "$6.00 (<200k) / $12.00 (≥200k)",
      "エージェント型ツール呼び出し、幻覚が少ない、推論強度を調整可能",
    ]);
  });

  it("総まとめチェックリストの基本モデルは grok-4.7", () => {
    const { container } = render(<Page />);
    const item = Array.from(container.querySelectorAll("li")).find((li) =>
      li.textContent?.includes("用途に応じて適切なモデル")
    );
    expect(item?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "用途に応じて適切なモデル（基本は grok-4.7）を選定した"
    );
  });

  it("11.1 Chat API の料金表に全モデルの2段階料金を載せる", () => {
    const { container } = render(<Page />);
    const heading = Array.from(container.querySelectorAll("h3")).find(
      (h) => h.textContent === "11.1 Chat API（テキストモデル）"
    );
    const table = heading?.nextElementSibling;
    const rows = Array.from(table?.querySelectorAll("tbody tr") ?? []).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.replace(/\s+/g, " ").trim())
    );
    expect(rows).toEqual([
      [
        "grok-4.7",
        "500k",
        "$2.00 (<200k) / $4.00 (≥200k)",
        "$0.50 (<200k) / $1.00 (≥200k)",
        "$6.00 (<200k) / $12.00 (≥200k)",
      ],
      [
        "grok-4.5",
        "500k",
        "$2.00 (<200k) / $4.00 (≥200k)",
        "$0.30 (<200k) / $0.60 (≥200k)",
        "$6.00 (<200k) / $12.00 (≥200k)",
      ],
      [
        "grok-4.3",
        "1M",
        "$1.25 (<200k) / $2.50 (≥200k)",
        "$0.20 (<200k) / $0.40 (≥200k)",
        "$2.50 (<200k) / $5.00 (≥200k)",
      ],
      [
        "grok-4.20 系（reasoning/non-reasoning/multi-agent）",
        "1M",
        "$1.25 (<200k) / $2.50 (≥200k)",
        "$0.20 (<200k) / $0.40 (≥200k)",
        "$2.50 (<200k) / $5.00 (≥200k)",
      ],
    ]);
  });

  it("Step1 の導入文は grok-4.7 を現在の汎用の基本モデルとして示す", () => {
    const { container } = render(<Page />);
    const intro = container.querySelector("#step1 > p");
    expect(intro?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "xAI は用途別に複数のモデルファミリーを提供しています。汎用のテキスト用途では、2026年10月時点のフラッグシップである Grok 4.7 を基本に選べばよい、という単純な整理ができるのが大きな特徴です。"
    );
  });
  it("1.1 比較表と Step11 の価格出典は 7月3日を旧モデルの基準時点とし grok-4.7 の確認日を区別する", () => {
    const { container } = render(<Page />);
    const norm = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, " ").trim();
    const step1Note = container.querySelector("#step1 table")?.nextElementSibling;
    const step11Note = container.querySelector("#step11")?.lastElementChild;
    const grok47 = "grok-4.7 の価格は同 Pricing ページで2026年10月23日に確認";
    expect([norm(step1Note), norm(step11Note)]).toEqual([
      `出典: Models | xAI Docs（最終更新 2026年7月9日）、Pricing | xAI Docs（最終更新 2026年7月3日。grok-4.5 以前のモデルの価格の基準時点）。${grok47}`,
      `出典: Pricing | xAI Docs（最終更新 2026年7月3日。grok-4.5 以前のモデルの価格の基準時点）。${grok47}`,
    ]);
  });
});
