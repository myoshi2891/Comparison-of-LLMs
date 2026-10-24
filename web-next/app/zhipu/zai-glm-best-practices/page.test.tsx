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

  it("チェックリストの軽量タスク項目で GLM-5.3 系は thinking を有効のまま low にすると区別する", async () => {
    const page = await Page();
    const { container } = render(page);
    const row = Array.from(container.querySelectorAll("tr")).find((tr) =>
      tr.querySelector("td")?.textContent?.startsWith("複雑な推論タスクでのみ")
    );
    expect(
      Array.from(row?.querySelectorAll("td") ?? []).map((td) =>
        td.textContent?.replace(/\s+/g, " ").trim()
      )
    ).toEqual([
      '複雑な推論タスクでのみreasoning_effort=maxを使い、軽量タスクではGLM-5.3 系以外ならthinkingを無効化、GLM-5.3 系ならthinkingを有効のままreasoning_effort: "low"にしているか',
      "7, 13",
    ]);
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
        "GLM-5.3 / GLM-5.3-Flash / GLM-5.3-FlashX では high より浅い軽量推論として区別され、思考量・コスト・遅延を抑えられる。それ以前のモデルでは内部的にhighとして扱われる",
      ],
      ["minimal / none", "それ以前のモデルのみ。思考をスキップし、即座に応答を生成"],
    ]);
    expect(table.closest("div")?.nextElementSibling?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "GLM-5.3 系(GLM-5.3 / GLM-5.3-Flash / GLM-5.3-FlashX)で指定する値は low・high・max の3つのみ。xhigh・minimal・none はそれ以前のモデル向けの値として扱う。"
    );
  });

  it("導入・バッジ・フッターの検証日は 7月16日の原本検証と 10月のモデル状況更新を区別する", async () => {
    const page = await Page();
    const { container } = render(page);
    const norm = (t: string | null | undefined) => t?.replace(/\s+/g, " ").trim();
    const intro = Array.from(container.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("これから Z.ai")
    );
    expect(norm(intro?.textContent)).toBe(
      "これから Z.ai の GLM モデル API を触り始めるエンジニア向けに、アカウント作成から本番運用のエラーハンドリング・コスト最適化までを順を追って解説する。当初の内容は 2026年7月16日時点で docs.z.ai / z.ai の公式ドキュメントを直接確認し、検証済みである。GLM-5.3 系など2026年10月時点のモデル状況はその後の更新で追記したものであり、7月16日の検証には含まれない。"
    );
    const badge = Array.from(container.querySelectorAll("div")).find((d) =>
      d.textContent?.startsWith("✓公式ドキュメント")
    );
    expect(norm(badge?.textContent)).toBe(
      "✓公式ドキュメント docs.z.ai / z.ai を直接確認して作成(2026年7月16日時点。2026年10月時点のモデル状況は後日追記)"
    );
    expect(norm(container.querySelector("footer")?.textContent)).toBe(
      "本ガイドはZ.ai公式ドキュメント(docs.z.ai / z.ai)を一次情報源とし、2026年7月16日時点ですべての参照先に直接アクセスして内容を検証したうえで作成している。2026年10月時点のモデル状況(GLM-5.3 系など)はその後の更新で追記したものであり、7月16日の検証範囲には含まれない。API仕様・料金・モデルラインナップ・プラン内容は頻繁に更新されるため、実装前に必ず公式ドキュメントの最新版を確認すること。"
    );
  });
});
