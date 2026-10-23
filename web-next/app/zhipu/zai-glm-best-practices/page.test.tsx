import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("ZaiGlmBestPracticesPage", () => {
  it("exports valid metadata with title and description", () => {
    expect(metadata.title).toBe(
      "Z.ai (GLM) LLM ベストプラクティスガイド | AI Model Cost Calculator"
    );
    expect(metadata.description).toContain("Z.ai(GLM) LLMの初学者向け実践ベストプラクティスガイド");
  });

  it("renders main heading (h1)", async () => {
    const page = await Page();
    render(page);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeDefined();
    expect(h1.textContent).toContain("初学者向けステップバイステップ解説");
  });

  it("renders 17 section headings (h2)", async () => {
    const page = await Page();
    const { container } = render(page);
    const h2s = container.querySelectorAll("h2");
    expect(h2s.length).toBe(17);
  });

  it("軽量タスクの指針で GLM-5.3 の強制 thinking を他モデルの disabled と区別する", async () => {
    const page = await Page();
    const { container } = render(page);
    const item = Array.from(container.querySelectorAll("li")).find((li) =>
      li.textContent?.startsWith("単純なFAQ応答や定型フォーマット変換")
    );
    expect(item?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      '単純なFAQ応答や定型フォーマット変換のような軽量タスクでは、GLM-5.3 系以外のモデルなら thinking: {"type": "disabled"} にして応答速度とコストを最適化する。GLM-5.3 / GLM-5.3-Flash / GLM-5.3-FlashX は thinking が強制で無効化できない(thinking.type は enabled のまま)ため、代わりに reasoning_effort: "low" を指定して思考量を抑える。'
    );
  });

  it("renders 8 mermaid diagrams", async () => {
    const page = await Page();
    const { container } = render(page);
    const diagrams = container.querySelectorAll(".mermaid, [data-testid='mermaid-diagram']");
    expect(diagrams.length).toBe(8);
  });

  it("has valid external link security attributes", async () => {
    const page = await Page();
    const { container } = render(page);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("has clean internal links without .html extension", async () => {
    const page = await Page();
    const { container } = render(page);
    const internalLinks = Array.from(container.querySelectorAll("a[href^='/']"));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });

  it("第7章の reasoning_effort 表で GLM-5.3 の low と high を区別する", async () => {
    const page = await Page();
    const { container } = render(page);
    const table = Array.from(container.querySelectorAll("#s7 table"))[0];
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.replace(/\s+/g, " ").trim())
    );
    expect(rows).toEqual([
      ["max(デフォルト・推奨)", "最も深い推論。精度重視、コストと遅延は最大"],
      ["xhigh", "それ以前のモデルのみ。内部的にmaxとして扱われる"],
      ["high", "拡張推論。精度とコストのバランス型"],
      ["medium", "内部的にhighとして扱われる(GLM-5.3 / GLM-5.3-Flash は非対応)"],
      [
        "low",
        "GLM-5.3 / GLM-5.3-Flash では high より浅い軽量推論として区別され、思考量・コスト・遅延を抑えられる。それ以前のモデルでは内部的にhighとして扱われる",
      ],
      ["minimal / none", "それ以前のモデルのみ。思考をスキップし、即座に応答を生成"],
    ]);
    expect(table.closest("div")?.nextElementSibling?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "GLM-5.3 系(GLM-5.3 / GLM-5.3-Flash / GLM-5.3-FlashX)で指定する値は low・high・max の3つのみ。xhigh・minimal・none はそれ以前のモデル向けの値として扱う。"
    );
  });
});
