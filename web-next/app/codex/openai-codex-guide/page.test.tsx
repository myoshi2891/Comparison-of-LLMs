// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

const normalizeText = (value: string | null | undefined) => value?.replace(/\s+/g, "").trim() ?? "";

const EXPECTED_CHECKLIST_LABELS = [
  "プロンプトにGoal・Context・Constraints・Donewhenの4要素を意識して書いているか",
  "タスクの複雑さに応じてReasoningEffortを使い分けているか(既定はmedium)",
  "複雑・曖昧なタスクでは/planや/goalを使って計画・完了条件を先に固めているか",
  "チームの規約・検証手順をAGENTS.mdに書き、プロンプトで毎回繰り返していないか",
  "~/.codex/config.tomlと.codex/config.tomlで個人設定とプロジェクト設定を役割分担しているか",
  "V1ではagents.max_concurrent_threads_per_session(agents.max_threadsは別名)で親スレッドを除くサブエージェント同時実行上限を設定し、MultiAgentV2ではfeatures.multi_agent_v2.max_concurrent_threads_per_sessionで主スレッドを含む上限を設定して、サブエージェント実効上限が設定値−1になることとagents.max_threadsが設定エラーになることを確認したか。agents.max_depthはV1の実行時深さ制限としては適用されないが、lineageとtask-pathの深さ計算に使用される",
  "サブエージェントのデフォルトモデル設定を各config.tomlのagents.default_subagent_modelで確認・指定し、gpt-5.6またはgpt-5.6-terraを設定しているか",
  "Skillが利用するMCPツールをagents/openai.yamlのdependencies.toolsに具体的な依存関係として宣言しているか",
  "サンドボックス・承認ポリシーを用途(初回調査/通常開発/CI)に応じて使い分けているか",
  "テスト・Lint・差分レビューをワークフローに組み込み、/reviewやAGENTS.md経由のレビュー観点を活用しているか",
  "リポジトリ外のコンテキストが必要な場面でMCPを検討しているか(ただし繋ぎすぎに注意)",
  "繰り返し行っている作業をSkillに切り出しているか",
  "安定したワークフローだけをAutomationsに切り出しているか",
  "並列作業ではgitworktreeでスレッドを分離しているか",
  "CI/CDでは公式のopenai/codex-actionやcodexexecを使い、APIキーをジョブ全体に晒していないか",
] as const;

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
      const sectionHeader = container.querySelector(`#${expected.id} h2`);
      expect(sectionHeader, `H2 inside #${expected.id} should exist`).not.toBeNull();
      expect(sectionHeader?.textContent).toBe(expected.text);
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
      expect(
        h3List.some((t) => t?.includes(title)),
        `H3 containing '${title}' should exist`
      ).toBe(true);
    }
  });

  it("クイックナビゲーション TOC リンク（16個）が正しく配置されている", () => {
    const { container } = render(<Page />);
    const navLinks = Array.from(container.querySelectorAll("nav a[href^='#sec-']"));
    expect(navLinks.length).toBe(16);
    expect(navLinks[0].getAttribute("href")).toBe("#sec-1");
    expect(navLinks[15].getAttribute("href")).toBe("#sec-16");
    expect(navLinks[0].classList.contains(styles.active)).toBe(true);
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

  it("原本と同期した運用チェックリストの 15 項目が存在する", () => {
    const { container } = render(<Page />);
    const checklist = container.querySelector("#sec-15");
    const checklistItems = Array.from(checklist?.querySelectorAll(":scope > ul > li") ?? []);
    const actualLabels = checklistItems.map((item) => {
      const checkbox = item.querySelector("input[type='checkbox']");
      const label = item.querySelector("label");

      expect(checkbox).not.toBeNull();
      expect(label).not.toBeNull();
      expect(label?.htmlFor).toBe(checkbox?.id);
      return normalizeText(label?.textContent);
    });

    expect(actualLabels).toEqual(EXPECTED_CHECKLIST_LABELS);
  });

  it("MCP 設定場所と Skill のツール依存宣言を原本どおり区別する", () => {
    const { container } = render(<Page />);
    const mcpSection = container.querySelector("#sec-8");
    const configGuidance = Array.from(mcpSection?.querySelectorAll("p") ?? []).find((paragraph) =>
      paragraph.textContent?.includes("MCPサーバーの直接設定")
    );
    const configEntries = Array.from(configGuidance?.querySelectorAll("code") ?? []);
    const findConfigEntry = (text: string) =>
      configEntries.find((entry) => entry.textContent === text);

    expect(findConfigEntry("~/.codex/config.toml")?.textContent).toBe("~/.codex/config.toml");
    expect(findConfigEntry(".codex/config.toml")?.textContent).toBe(".codex/config.toml");
    expect(findConfigEntry("[mcp_servers.<server-name>]")?.textContent).toBe(
      "[mcp_servers.<server-name>]"
    );
    expect(findConfigEntry("agents/openai.yaml")?.textContent).toBe("agents/openai.yaml");
    expect(findConfigEntry("dependencies.tools")?.textContent).toBe("dependencies.tools");
  });

  it("TOC番号をCSSで重複生成せず、モバイルサイドバーの操作状態を同期する", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");

    expect(css).not.toMatch(/counter-(?:reset|increment):\s*toc/);
    expect(css).not.toMatch(/\.tocLink::before/);
    expect(css).toMatch(/\.sidebar\s*\{[^}]*transition:[^}]*visibility/s);
    expect(css).toMatch(/@media[\s\S]*\.sidebar\s*\{[^}]*visibility:\s*hidden/s);
    expect(css).toMatch(/@media[\s\S]*\.sidebar\s*\{[^}]*pointer-events:\s*none/s);
    expect(css).toMatch(/\.sidebar\.sidebarOpen\s*\{[^}]*visibility:\s*visible/s);
    expect(css).toMatch(/\.sidebar\.sidebarOpen\s*\{[^}]*pointer-events:\s*auto/s);
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
    expect(metadata.description).toContain(
      "2026年最新情報に基づくOpenAI Codexベストプラクティスガイド"
    );
  });
});
