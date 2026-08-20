// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MERMAID_DIAGRAM_DECLARATION } from "@/lib/mermaid-diagram-types";
import { normalizeMermaidSource } from "@/tests/helpers/mermaid";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

function normalizeText(text: string | null | undefined): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

const EXPECTED_H1 = "AI仕様駆動開発におけるMarkdownファイル実践ガイド";

const EXPECTED_H2 = [
  "Markdownファイル実践ガイド",
  "SDDとは何か、なぜMarkdownなのか",
  "成熟度モデル:Spec-first / Spec-anchored / Spec-as-source",
  "全体ワークフロー:Specify → Plan → Tasks → Implement",
  "ファイル構成の全体像",
  "spec.md / requirements.md の書き方",
  "plan.md / design.md の書き方",
  "tasks.md の書き方",
  "AGENTS.md / CLAUDE.md:プロジェクト全体のコンテキストファイル",
  "SKILL.md:段階的開示(Progressive Disclosure)",
  "Markdown記法そのもののベストプラクティス",
  "生きたドキュメントとしての運用",
  "よくある落とし穴と対策",
  "導入前チェックリスト",
  "まとめ",
  "参考文献",
] as const;

const EXPECTED_H3 = [
  "Vibe Codingの限界",
  "SDDの定義",
  "なぜMarkdownなのか",
  "Step 1: メタデータと目的を明記する",
  "Step 2: ユーザーストーリーを優先度付きで書く",
  "Step 3: 受け入れ基準をEARS記法で書く",
  "Step 4: 曖昧さを可視化するマーカーを使う",
  "Step 5: 実装詳細を書かない(Whatに徹する)",
  "10.1 見出し階層とセクション分け",
  "10.2 表 vs 箇条書きの使い分け",
  "10.3 Mermaidダイアグラムのルール",
  "10.4 コードブロックとfrontmatter",
] as const;

const EXPECTED_EXTERNAL_URLS = [
  "https://github.com/github/spec-kit",
  "https://github.github.com/spec-kit/",
  "https://den.dev/blog/github-spec-kit/",
  "https://developer.microsoft.com/blog/spec-driven-development-spec-kit/",
  "https://kiro.dev/docs/specs/",
  "https://kiro.dev/docs/specs/feature-specs/",
  "https://agents.md/",
  "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
  "https://addyosmani.com/blog/good-spec/",
  "https://simonw.substack.com/p/agentic-engineering-patterns",
  "https://simonwillison.net/tags/ai-assisted-programming/",
  "https://martinfowler.com/articles/exploring-gen-ai.html",
  "https://en.wikipedia.org/wiki/Spec-driven_development",
  "https://www.javacodegeeks.com/2026/05/spec-driven-development-with-ai-write-the-spec-first-then-prompt-the-implementation.html",
  "https://thebcms.com/blog/spec-driven-development",
  "https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html",
  "https://blog.agentailor.com/posts/top-ai-agent-standards-2026",
  "https://ssojet.com/blog/prd-spec-templates-ai-agents",
  "https://joshmcdonald.medium.com/ears-fifteen-years-on-the-requirements-format-built-for-the-agent-era-0f78f8ff35a0",
  "https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2",
  "https://www.augmentcode.com/tools/best-spec-driven-development-tools",
  "https://www.softwareseni.com/spec-driven-development-is-replacing-vibe-coding-as-the-professional-standard-for-ai-teams/",
  "https://codemyspec.com/blog/spec-driven-development",
  "https://codersera.com/blog/agents-md-complete-guide-2026/",
  "https://blog.buildbetter.ai/agents-md-complete-guide-for-engineering-teams-in-2026/",
  "https://www.morphllm.com/agents-md-guide",
  "https://deepwiki.com/openai/agents.md/5-agents.md-format-documentation",
  "https://www.agensi.io/learn/agent-skills-open-standard",
  "https://bitbytebit.substack.com/p/spec-driven-development-from-vibe",
  "https://www.the-main-thread.com/p/spec-driven-development-exit-strategy",
  "https://builder.aws.com/content/36nn9PbSZuKJiWWoO2UWmFaaCHs/getting-started-with-spec-driven-development-using-kiro",
  "https://medium.com/@kanaiduttaiem/experience-with-kiros-spec-driven-development-methodology-1e57af895fd7",
] as const;

/** 原本のコードブロック数。 */
const EXPECTED_CODE_BLOCK_COUNT = 4;

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
A["constitution.md<br/>（プロジェクトの不変原則）"] --> B["① Specify<br/>spec.md / requirements.md"]
B --> C{"人間によるレビュー<br/>曖昧さの解消（Clarify）"}
C -->|"要修正"| B
C -->|"承認"| D["② Plan<br/>plan.md / design.md"]
D --> E{"技術レビュー"}
E -->|"要修正"| D
E -->|"承認"| F["③ Tasks<br/>tasks.md"]
F --> G["④ Implement<br/>AIエージェントによる実装"]
G --> H{"テスト・検証"}
H -->|"失敗"| F
H -->|"合格"| I["マージ"]
I -.->|"仕様は生きたドキュメント：<br/>変更時はSpecを先に更新"| B`,
  `flowchart TB
subgraph Root["リポジトリルート"]
    AGENTS["AGENTS.md<br/>プロジェクト全体のコンテキスト"]
    CONST["constitution.md<br/>不変の原則"]
end
subgraph Feature["specs/001-feature/"]
    SPEC["spec.md<br/>What と Why"]
    PLAN["plan.md<br/>How"]
    TASKS["tasks.md<br/>実行単位"]
end
subgraph Skills["再利用可能な手順"]
    SKILL["SKILL.md<br/>YAML frontmatter + 手順"]
end
AGENTS --> SPEC
CONST --> SPEC
SPEC --> PLAN
PLAN --> TASKS
TASKS -.->|"必要時にオンデマンドで読込"| SKILL`,
  `flowchart TD
Q1{"常に真であるべき要件か？"}
Q1 -->|"Yes"| U["Ubiquitous<br/>THE SYSTEM SHALL ..."]
Q1 -->|"No"| Q2{"特定のイベントで発火するか？"}
Q2 -->|"Yes"| EV["Event-driven<br/>WHEN event THE SYSTEM SHALL ..."]
Q2 -->|"No"| Q3{"特定の状態が続く間だけ有効か？"}
Q3 -->|"Yes"| ST["State-driven<br/>WHILE state THE SYSTEM SHALL ..."]
Q3 -->|"No"| Q4{"望ましくない事象への対応か？"}
Q4 -->|"Yes"| UB["Unwanted behavior<br/>IF trigger THEN THE SYSTEM SHALL ..."]
Q4 -->|"No"| OPT["Optional feature<br/>WHERE feature THE SYSTEM SHALL ..."]`,
  `flowchart TB
S1["セッション開始<br/>SKILL.md の name / description のみ読込"] --> S2{"タスクがスキルの<br/>ドメインと一致するか？"}
S2 -->|"No"| S1
S2 -->|"Yes"| S3["SKILL.md 本文を読込"]
S3 --> S4{"補助ファイルが必要か？<br/>（スクリプト・参考資料）"}
S4 -->|"Yes"| S5["補助ファイルをオンデマンドで読込"]
S4 -->|"No"| S6["タスクを実行"]
S5 --> S6`,
] as const;

describe("/codex/skill - AI仕様駆動開発におけるMarkdownファイル実践ガイド Contract Tests", () => {
  // S. 原本照合契約
  it("S-1: h2 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<Page />);
    const actualH2 = Array.from(container.querySelectorAll("h2")).map((el) =>
      normalizeText(el.textContent)
    );
    expect(actualH2).toEqual([...EXPECTED_H2]);
  });

  it("S-2: h3 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<Page />);
    const actualH3 = Array.from(container.querySelectorAll("h3")).map((el) =>
      normalizeText(el.textContent)
    );
    expect(actualH3).toEqual([...EXPECTED_H3]);
  });

  it("S-3: 原本の外部リンク URL が全件存在", () => {
    const { container } = render(<Page />);
    const renderedHrefs = Array.from(container.querySelectorAll("a[href^='http']")).map((a) =>
      a.getAttribute("href")
    );
    for (const url of EXPECTED_EXTERNAL_URLS) {
      expect(renderedHrefs).toContain(url);
    }
  });

  it("S-4: 全 h2/h3 が一意な id を持ち、TOC のアンカーが全て実在する見出しを指す", () => {
    const { container } = render(<Page />);
    const sectionIds = Array.from(container.querySelectorAll("section[id], h2[id], h3[id]")).map(
      (el) => el.id
    );
    const uniqueIds = new Set(sectionIds);
    expect(uniqueIds.size).toBe(sectionIds.length);

    const tocLinks = Array.from(
      container.querySelectorAll("aside a[href^='#'], [data-testid='sidebar-nav'] a[href^='#']")
    );
    expect(tocLinks.length).toBeGreaterThanOrEqual(15);
    for (const link of tocLinks) {
      const targetId = link.getAttribute("href")?.replace(/^#/, "");
      expect(targetId).toBeTruthy();
      expect(container.querySelector(`#${CSS.escape(targetId as string)}`)).not.toBeNull();
    }
  });

  // C. コンテンツ契約
  it("C-1: h1 のテキストが完全一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(normalizeText(h1?.textContent)).toBe(EXPECTED_H1);
  });

  it("C-2: クイックナビ（TOC リンク）の件数と href 形式", () => {
    const { container } = render(<Page />);
    const tocLinks = Array.from(
      container.querySelectorAll("aside a[href^='#'], [data-testid='sidebar-nav'] a[href^='#']")
    );
    expect(tocLinks.length).toBe(15);
    for (const link of tocLinks) {
      expect(link.getAttribute("href")).toMatch(/^#sec-(?:[1-9]|1[0-5])$/);
    }
  });

  it("C-3: サイドバー TOC の初期アクティブ状態が存在する", () => {
    const { container } = render(<Page />);
    const firstTocLink = container.querySelector("aside ul li:first-child a");
    expect(firstTocLink).not.toBeNull();
    expect(firstTocLink?.classList.contains(styles.active)).toBe(true);
  });

  it("C-4: 外部リンク全件に target='_blank' かつ rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const extLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    // 下限比較だと原本のリンクを落としても通る。fixture の件数と厳密に一致させる。
    expect(extLinks.length).toBe(EXPECTED_EXTERNAL_URLS.length);
    for (const link of extLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      const rel = (link.getAttribute("rel") ?? "").split(/\s+/);
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });

  it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a:not([href^='http'])"));
    for (const link of internalLinks) {
      const href = link.getAttribute("href") ?? "";
      expect(href).not.toMatch(/\.html(?:#.*)?$/);
    }
  });

  // C-6: Mermaid 契約
  it("C-6a: Mermaid ソースが原本と順序・内容・出現回数込みで完全一致する", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
      normalizeMermaidSource(el.textContent ?? "")
    );
    expect(actual).toEqual(EXPECTED_MERMAID_SOURCES.map(normalizeMermaidSource));
  });

  it("C-6b: 全 Mermaid 図解がページ専用ラッパーに包まれている", () => {
    const { container } = render(<Page />);
    const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
    const wrapped = Array.from(
      container.querySelectorAll(`.${styles.mermaidWrapper} [data-testid="mermaid"]`)
    );
    expect(wrapped).toEqual(diagrams);
  });

  it("C-6c: 各図解が空でなく、図種別の宣言から始まる", () => {
    const { container } = render(<Page />);
    const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
      (el.textContent ?? "").trim()
    );
    expect(charts.length).toBe(4);
    for (const chart of charts) {
      expect(chart.length).toBeGreaterThan(0);
      expect(chart).toMatch(MERMAID_DIAGRAM_DECLARATION);
    }
  });

  it("C-6d: 禁止構文 block-beta を使っていない", () => {
    const { container } = render(<Page />);
    const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
      (el) => el.textContent ?? ""
    );
    for (const chart of charts) {
      expect(chart).not.toContain("block-beta");
    }
  });

  it("C-6e: 図解のソースが左端揃え（先頭行にインデントが無い）", () => {
    const { container } = render(<Page />);
    const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
      (el) => el.textContent ?? ""
    );
    for (const chart of charts) {
      const firstLine = chart.split("\n").find((l) => l.trim().length > 0) ?? "";
      expect(firstLine).toBe(firstLine.trimStart());
    }
  });

  // D. デザイン契約
  it("D-1: callout が data-variant で区別され、warn/good/default が存在する", () => {
    const { container } = render(<Page />);
    const callouts = container.querySelectorAll(`.${styles.callout}`);
    expect(callouts.length).toBeGreaterThanOrEqual(3);
    const variants = Array.from(callouts).map((el) => el.getAttribute("data-variant"));
    expect(variants).toContain("warn");
    expect(variants).toContain("good");
  });

  it("D-2: callout[data-variant='warn'] が callout-label 子要素を持つ", () => {
    const { container } = render(<Page />);
    const warnCallout = container.querySelector(
      `.${styles.callout}[data-variant="warn"], .${styles.callout}.${styles.warn}`
    );
    expect(warnCallout).not.toBeNull();
    const label = warnCallout?.querySelector(`.${styles.calLabel}`);
    expect(label).not.toBeNull();
  });

  it("D-5: サイドバーナビが存在し、データ属性が付与されている", () => {
    const { container } = render(<Page />);
    const sidebar = container.querySelector("aside");
    expect(sidebar).not.toBeNull();
    expect(sidebar?.getAttribute("data-testid")).toBe("sidebar-nav");
  });

  it("D-6: コードブロックが data-testid='code-block' で識別される", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll('[data-testid="code-block"]');
    // 原本のコードブロック数。下限比較にすると転写漏れを検出できない。
    expect(codeBlocks.length).toBe(EXPECTED_CODE_BLOCK_COUNT);
  });

  it("D-8: layout-root が存在し全幅展開される", () => {
    const { container } = render(<Page />);
    const layout = container.querySelector('[data-testid="layout-root"]');
    expect(layout).not.toBeNull();
  });

  // Q. 品質契約
  it("Q-2: metadata の title / description が空でなく h1 と整合する", () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(String(metadata.title)).toContain("AI仕様駆動開発");
    expect(String(metadata.title)).toContain("Markdown");
  });

  it("Q-3: 見出し階層が飛ばない（h1 → h2 → h3）", () => {
    const { container } = render(<Page />);
    const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((el) =>
      Number.parseInt(el.tagName.replace(/^H/, ""), 10)
    );
    expect(headings.length).toBeGreaterThan(0);
    let prevLevel = 0;
    for (const level of headings) {
      if (prevLevel > 0) {
        expect(level - prevLevel).toBeLessThanOrEqual(1);
      }
      prevLevel = level;
    }
  });
});
