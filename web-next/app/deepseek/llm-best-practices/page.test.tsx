import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

// MermaidDiagram のモック
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("DeepSeek LLM Best Practices Page", () => {
  it("exports valid metadata with title and description", () => {
    expect(metadata.title).toBe(
      "DeepSeek LLM ベストプラクティスガイド — 初学者向けステップバイステップ解説"
    );
    expect(metadata.description).toContain("DeepSeek-V3 / R1 / V4");
  });

  it("renders page title correctly in h1", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.replace(/\s+/g, " ").trim()).toContain(
      "DeepSeek LLM ベストプラクティスガイド〜初学者向けステップバイステップ解説〜"
    );
  });

  it("renders exactly 17 section headings (h2)", () => {
    const { container } = render(<Page />);
    const h2List = container.querySelectorAll("h2");
    expect(h2List.length).toBe(17);
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

  it("renders 8 Mermaid diagrams", () => {
    const { container } = render(<Page />);
    const diagrams = container.querySelectorAll("[data-testid='mermaid-diagram']");
    expect(diagrams.length).toBe(8);
  });

  it("移行チェックリストは Flash の正式 ID deepseek-flash を案内する", () => {
    const { container } = render(<Page />);
    const items = Array.from(container.querySelectorAll("#migration li")).map((li) =>
      li.textContent?.replace(/\s+/g, " ").trim()
    );
    expect(items).toEqual([
      "[ ] deepseek-chat の記述を deepseek-flash または deepseek-v4-pro へ変更",
      "[ ] deepseek-reasoner の記述を deepseek-v4-pro (Thinking Mode) へ変更",
      "[ ] API Base URL が https://api.deepseek.com であることを確認",
      "[ ] 2026年7月24日の完全廃止後に新モデル環境での動作検証を完了",
    ]);
  });
});

describe("DeepSeek 新規開発の既定モデル", () => {
  const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

  it("旧モデル廃止 callout は新規開発に deepseek-flash と deepseek-v4-pro を指定させる", () => {
    const { container } = render(<Page />);
    const texts = Array.from(container.querySelectorAll("p")).map((p) => norm(p.textContent));
    expect(texts).toContain(
      "旧モデルエイリアスである deepseek-chat （DeepSeek-V3実体）および deepseek-reasoner （DeepSeek-R1実体）は、2026年7月24日をもって提供終了（完全廃止）となりました。現在は利用できません。新規開発では必ず deepseek-flash または deepseek-v4-pro を指定してください。"
    );
  });

  it("first_call.py は暫定エイリアスではなく deepseek-flash を呼び出す", () => {
    const { container } = render(<Page />);
    const lines = Array.from(container.querySelectorAll("[class*='codeLine']")).map((l) =>
      norm(l.textContent)
    );
    expect(lines).toContain('model="deepseek-flash",');
    expect(lines).not.toContain('model="deepseek-v4-flash",');
  });
});
