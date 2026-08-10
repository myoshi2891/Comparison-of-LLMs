// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

// Mock MermaidDiagram component to avoid Vitest DOM rendering issues with canvas/SVG
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid-diagram">{chart}</pre>;
  },
}));

describe("/codex/openai-codex-guide (2026 Best Practices)", () => {
  it("h1 に 'OpenAI Codexベストプラクティスガイド' が含まれる", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.replace(/\s+/g, "")).toContain("OpenAICodexベストプラクティスガイド");
  });

  it("h2 が 16 個存在し、各セクションのアンカー ID とタイトルが正しく紐づいている", () => {
    const { container } = render(<Page />);
    const h2List = Array.from(container.querySelectorAll("h2"));
    expect(h2List).toHaveLength(16);

    const expectedSections = [
      { id: "sec-1", text: "1. Codexとは何か ― 2026年時点の全体像" },
      { id: "sec-2", text: "2. Codexの基本動作ループを理解する" },
      { id: "sec-3", text: "効果的なプロンプトを設計する" },
      { id: "sec-4", text: "難しいタスクはまず計画させる" },
      { id: "sec-5", text: "AGENTS.mdで恒久的なガイダンスを構築する" },
      { id: "sec-6", text: "config.tomlで環境を安定させる" },
      { id: "sec-7", text: "テストとレビューを組み込んで信頼性を高める" },
      { id: "sec-8", text: "MCPで外部システムと接続する" },
      { id: "sec-9", text: "繰り返し作業をSkillsに変換する" },
      { id: "sec-10", text: "自動化・並列実行・サブエージェント" },
      { id: "sec-11", text: "CI/CDへの統合(codex exec / GitHub Action)" },
      { id: "sec-12", text: "セキュリティと権限管理のベストプラクティス" },
      { id: "sec-13", text: "よくある間違い(公式ガイドより)" },
      { id: "sec-14", text: "著名開発者の視点: Codexは実際どう評価されているか" },
      { id: "sec-15", text: "まとめ: 運用チェックリスト" },
      { id: "sec-16", text: "参考情報源(出典一覧)" },
    ];

    for (const expected of expectedSections) {
      const sectionHeader = container.querySelector(`#${expected.id}`);
      expect(sectionHeader, `Section with id #${expected.id} should exist`).not.toBeNull();
      expect(sectionHeader?.textContent).toContain(expected.text);
    }
  });

  it("h3 セクションが全主要サブセクションに存在する", () => {
    const { container } = render(<Page />);
    const h3List = Array.from(container.querySelectorAll("h3")).map((el) => el.textContent);
    
    const expectedSubsections = [
      "モデルの系譜(コミュニティ報告ベースの概観)",
      "Reasoning Effort(推論の深さ)を使い分ける",
      "何を書くべきか",
      "階層構造と優先順位",
      "サンドボックスと承認ポリシー",
      "Automations(自動化)",
      "サブエージェントによる並列実行",
      "スレッド管理とworktree",
      "Simon Willison ― 著名なOSS開発者・LLMウォッチャー",
      "Armin Ronacher ― Flask/Jinja2の作者、Sentryのエンジニアリング責任者",
      "主要なコーディングエージェントの位置付け(2026年半ば時点のコミュニティ評価)",
      "OpenAI公式ドキュメント",
      "著名な開発者・オピニオンリーダーの発信",
      "業界動向・比較記事・コミュニティガイド",
      "セキュリティインシデント関連(2026年7月)",
    ];

    for (const title of expectedSubsections) {
      expect(h3List.some((t) => t?.includes(title)), `H3 containing '${title}' should exist`).toBe(true);
    }
  });

  it("クイックナビゲーション TOC リンク（16個）が正しく配置されている", () => {
    const { container } = render(<Page />);
    const navLinks = Array.from(container.querySelectorAll("nav a[href^='#sec-']"));
    expect(navLinks.length).toBe(16);
    expect(navLinks[0].getAttribute("href")).toBe("#sec-1");
    expect(navLinks[15].getAttribute("href")).toBe("#sec-16");
  });

  it("6つの Mermaid 図解が専用ラッパー内に配置されている", () => {
    const { container } = render(<Page />);
    const mermaidElements = container.querySelectorAll("[data-testid='mermaid-diagram']");
    expect(mermaidElements.length).toBe(6);
  });

  it("すべての表（table）が存在し、適切なカラム・行構造を持っている", () => {
    const { container } = render(<Page />);
    const tables = container.querySelectorAll("table");
    expect(tables.length).toBeGreaterThanOrEqual(9);
  });

  it("運用チェックリストの 12 項目が存在する", () => {
    const { container } = render(<Page />);
    const checklistItems = container.querySelectorAll("ul[class*='checklist'] li, input[type='checkbox']");
    expect(checklistItems.length).toBeGreaterThanOrEqual(12);
  });

  it("Callout/Alert 要素（info, warn, good）がそれぞれ data-variant で区別されている", () => {
    const { container } = render(<Page />);
    // info, warn, good の variant がすべて存在すること
    const infoCallouts = container.querySelectorAll("[data-testid='callout'][data-variant='info']");
    const warnCallouts = container.querySelectorAll("[data-testid='callout'][data-variant='warn']");
    const goodCallouts = container.querySelectorAll("[data-testid='callout'][data-variant='good']");
    expect(infoCallouts.length).toBeGreaterThan(0);
    expect(warnCallouts.length).toBeGreaterThan(0);
    expect(goodCallouts.length).toBeGreaterThan(0);
  });

  it("callout.warn が data-variant='warn' を持ち、danger(赤系)セマンティクスで区別される", () => {
    const { container } = render(<Page />);
    const warnCallouts = container.querySelectorAll("[data-testid='callout'][data-variant='warn']");
    expect(warnCallouts.length).toBeGreaterThan(0);
    // callout.warn の label テキストが存在すること
    for (const callout of Array.from(warnCallouts)) {
      const label = callout.querySelector("[data-testid='callout-label']");
      expect(label).not.toBeNull();
    }
  });

  it("callout の label が data-testid='callout-label' を持つ", () => {
    const { container } = render(<Page />);
    const calloutLabels = container.querySelectorAll("[data-testid='callout-label']");
    expect(calloutLabels.length).toBeGreaterThan(0);
  });

  it("stepTag が各セクションに存在し data-testid='step-tag' を持つ", () => {
    const { container } = render(<Page />);
    const stepTags = container.querySelectorAll("[data-testid='step-tag']");
    // sec-1 から sec-16 の 16 セクション分のタグが存在すること
    expect(stepTags.length).toBe(16);
    // Overview, Core Concept, Step 01 〜 Step 10, Reference, Perspective, Summary, Appendix の順
    const texts = Array.from(stepTags).map((el) => el.textContent);
    expect(texts).toContain("Overview");
    expect(texts).toContain("Core Concept");
    expect(texts).toContain("Step 01");
    expect(texts).toContain("Step 10");
    expect(texts).toContain("Appendix");
  });

  it("blockquote.voice が data-testid='voice' を持ち、金色 border の文脈で存在する", () => {
    const { container } = render(<Page />);
    const voiceBlocks = container.querySelectorAll("[data-testid='voice']");
    expect(voiceBlocks.length).toBeGreaterThan(0);
    for (const block of Array.from(voiceBlocks)) {
      // .who 相当の span が存在すること
      const who = block.querySelector("[data-testid='voice-who']");
      expect(who).not.toBeNull();
    }
  });

  it("外部リンクに target='_blank' と rel='noopener noreferrer' が両方付与されている", () => {
    const { container } = render(<Page />);
    const extLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(extLinks.length).toBeGreaterThan(15);
    for (const a of extLinks) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("内部リンクが .html を含まない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a:not([target])"));
    for (const a of internalLinks) {
      expect(a.getAttribute("href")).not.toContain(".html");
    }
  });

  it("metadata.title と metadata.description が適切に定義されている", () => {
    expect(metadata.title).toContain("OpenAI Codex");
    expect(metadata.description).toContain("2026年最新情報に基づくOpenAI Codexベストプラクティスガイド");
  });
});
