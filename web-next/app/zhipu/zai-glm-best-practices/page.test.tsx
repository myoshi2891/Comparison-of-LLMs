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

  it("軽量タスクの指針で thinking の扱いをモデル別マトリクスで示し、GLM-4.7 系(Flash / FlashX 含む)の enabled 時の強制 thinking と disabled による無効化を区別する", async () => {
    const page = await Page();
    const { container } = render(page);
    const norm = (t: string | null | undefined) => t?.replace(/\s+/g, " ").trim();
    const item = Array.from(container.querySelectorAll("li")).find((li) =>
      li.textContent?.startsWith("単純なFAQ応答や定型フォーマット変換")
    );
    const intro =
      "単純なFAQ応答や定型フォーマット変換のような軽量タスクでは、Z.ai の Chat Completions API で対象モデルごとに thinking の扱いを分ける。";
    const matrix = [
      'GLM-5.2 / GLM-5.1 / GLM-5 / GLM-4.6: thinking: {"type": "disabled"} で無効化でき、応答速度とコストを最適化できる。',
      'GLM-5-Turbo: thinking は既定で有効(enabled)だが、thinking: {"type": "disabled"} で無効化できるため、軽量なターンでは無効化する。',
      'GLM-4.7 / GLM-4.7-Flash / GLM-4.7-FlashX: thinking.type が enabled(既定)のときは強制 thinking(必ず思考する)になるが、thinking: {"type": "disabled"} で無効化できるため、軽量なターンでは無効化する。',
      'GLM-5.3 / GLM-5.3-Flash / GLM-5.3-FlashX: thinking が強制で無効化できない(thinking.type は enabled のまま)ため、代わりに reasoning_effort: "low" を指定して思考量を抑える。',
      'GLM-4.5 / GLM-4.5-Air / GLM-4.5-Flash: GLM-4.5 シリーズは thinking パラメータに対応しているため、軽量なターンでは thinking: {"type": "disabled"} で無効化する。GLM-4.5 より前のモデルは対象外のため、thinking を指定せず省略する。',
    ];
    expect(
      Array.from(item?.querySelectorAll("li") ?? []).map((li) => norm(li.textContent))
    ).toEqual(matrix);
    expect(norm(item?.textContent)).toBe(intro + matrix.join(""));
  });

  it("チェックリストの軽量タスク項目でモデル別の thinking の扱いを区別し、GLM-4.7 / GLM-4.7-Flash / GLM-4.7-FlashX も disabled で無効化できると示す", async () => {
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
      '複雑な推論タスクでのみreasoning_effort=maxを使い、軽量タスクではモデル別に、GLM-5.2 / GLM-5.1 / GLM-5 / GLM-4.6はthinkingを無効化、GLM-5-Turboも既定でenabledだがdisabledで無効化、GLM-4.7 / GLM-4.7-Flash / GLM-4.7-FlashXもenabled時は強制thinkingだがdisabledで無効化、GLM-5.3 系はthinkingを有効のままreasoning_effort: "low"、GLM-4.5 / GLM-4.5-Air / GLM-4.5-Flashはthinkingを無効化、GLM-4.5 より前のモデルはthinkingを省略、と使い分けているか',
      "7, 13",
    ]);
  });

  it("Deep Thinking の既定説明で GLM-4.7 系を自動判断のモデルから除外し、enabled 時は必ず思考すると示し、GLM-4.6 はハイブリッド思考が既定で有効で disabled 指定で無効化すると示す", async () => {
    const page = await Page();
    const { container } = render(page);
    const para = Array.from(container.querySelectorAll("#s7 > p")).find((p) =>
      p.textContent?.startsWith("GLM-4.5以降のモデルは")
    );
    expect(para?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "GLM-4.5以降のモデルは、回答前に内部で段階的な思考(Chain-of-Thought)を行う「Deep Thinking」機能を備えている。thinking.typeで有効/無効を切り替え、GLM-5.2以降ではさらにreasoning_effortで思考の深さを段階的に制御できる。GLM-5.2/5.1/5ではthinkingが既定で有効で、モデルがタスクの難易度を見て思考の要否を自動判断する。GLM-4.7系もthinkingが既定で有効だが、enabledのときは自動判断せず必ず思考する(強制thinking)。GLM-4.6のようなハイブリッドモデルもハイブリッド思考が既定で有効で、無効にするにはthinking.typeにdisabledを明示的に指定する必要がある点に注意する。"
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
      ["medium", "内部的にhighとして扱われる(GLM-5.3 / GLM-5.3-Flash / GLM-5.3-FlashX は非対応)"],
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
