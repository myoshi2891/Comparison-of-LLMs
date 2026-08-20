// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MERMAID_DIAGRAM_DECLARATION } from "@/lib/mermaid-diagram-types";
import { normalizeMermaidSource } from "@/tests/helpers/mermaid";
import MarkdownFileGuidePage, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const EXPECTED_H1 = ["GitHub Copilot AI仕様駆動開発 ベストプラクティスガイド"] as const;

const EXPECTED_H2 = [
  "全体像:Copilotのコンテキストはどう組み立てられるか",
  "1copilot-instructions.md — リポジトリ全体のルール",
  "2.instructions.md — パス限定ルールと AGENTS.md",
  "3.prompt.md — 再利用可能なスラッシュコマンド",
  "4.chatmode.md → .agent.md — カスタムエージェント",
  "5SKILL.md — Agent Skills(手続き的知識)",
  "6MCP — 外部ツール・データソースとの接続",
  "7Plan Mode — 実装前に合意形成する",
  "仕様駆動開発(SDD)への統合: GitHub Spec Kit",
  "セキュリティとガバナンスの勘所",
  "成熟度モデルとチェックリスト",
  "参考文献",
] as const;

const EXPECTED_H3 = [
  "概要",
  "ベストプラクティス",
  "サンプル",
  ".instructions.md",
  "AGENTS.md との違い",
  "概要",
  "フロントマター",
  "サンプル",
  "重要な仕様変更",
  "何のためのファイルか",
  "フロントマター",
  "サンプル: プランニング専用エージェント",
  "概要",
  "Instructions(常時適用)との違い",
  "ディレクトリ構成",
  "SKILL.mdのサンプル",
  "description の書き方が命",
  "概要",
  "設定ファイルの注意点",
  "トランスポートの種類",
  "利用範囲",
  "なぜPlan Modeが必要か",
  "実践例: Burke Hollandの「ハーネス」ワークフロー",
  "4つの成果物",
  "実務上のコツ",
  "Plan Mode との使い分け",
  "最終チェックリスト",
  "公式ドキュメント・一次情報",
  "著名な開発者・実務者による解説",
] as const;

const EXPECTED_EXTERNAL_URLS = [
  "https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks",
  "https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices",
  "https://docs.github.com/en/copilot/tutorials/customization-library/custom-instructions/your-first-custom-instructions",
  "https://docs.github.com/copilot/concepts/about-customizing-github-copilot-chat-responses",
  "https://docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file",
  "https://code.visualstudio.com/docs/agent-customization/prompt-files",
  "https://code.visualstudio.com/docs/agent-customization/custom-instructions",
  "https://code.visualstudio.com/docs/agent-customization/custom-agents",
  "https://github.com/microsoft/vscode-docs/blob/main/docs/copilot/customization/custom-chat-modes.md",
  "https://devblogs.microsoft.com/visualstudio/custom-agents-in-visual-studio-built-in-and-build-your-own-agents/",
  "https://devblogs.microsoft.com/visualstudio/plan-before-you-build-introducing-the-plan-agent-in-visual-studio/",
  "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills",
  "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills",
  "https://learn.microsoft.com/en-us/visualstudio/ide/copilot-agent-skills?view=visualstudio",
  "https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/",
  "https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/",
  "https://developer.microsoft.com/blog/spec-driven-development-spec-kit/",
  "https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/",
  "https://github.github.com/spec-kit/",
  "https://github.blog/ai-and-ml/github-copilot/the-harness-is-all-you-need-mostly/",
  "https://burkeholland.github.io/posts/essential-custom-instructions/",
  "https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/",
  "https://github.blog/ai-and-ml/github-copilot/unlocking-the-full-power-of-copilot-code-review-master-your-instructions-files/",
  "https://code.visualstudio.com/blogs/2025/03/26/custom-instructions",
  "https://hiddedesmet.com/agent-md-explained",
  "https://www.skills.sh/mattpocock/skills/grill-me",
];

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
    subgraph AO["常時適用 (Always-on)"]
        A["Personal Instructions<br/>個人のユーザー設定"]
        B["Organization Instructions<br/>組織/Enterprise設定"]
        C["Repository Instructions<br/>copilot-instructions.md / AGENTS.md"]
        D[".instructions.md<br/>applyTo で条件付き適用"]
    end
    subgraph OD["呼び出し時のみ (On-demand)"]
        E[".prompt.md<br/>/コマンドで手動起動"]
        F[".agent.md（旧 .chatmode.md）<br/>役割・ツールセットを切替"]
        G["SKILL.md<br/>description との一致で自動ロード"]
    end
    subgraph EXT["外部連携 (External)"]
        H["MCP Servers<br/>ツール・データソースの接続"]
    end
    A --> M["1回のリクエストごとに<br/>Copilotがコンテキストを統合"]
    B --> M
    C --> M
    D --> M
    M --> E
    M --> F
    M --> G
    M --> H

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    classDef coral fill:#4a2620,stroke:#f0a688,color:#fbe4da;
    class A,B,C,D purple;
    class E,F,G teal;
    class H,M coral;`,
  `flowchart TD
    Q1{"このルールは常に<br/>適用したいか?"}
    Q1 -->|"はい・リポジトリ全体"| R1["copilot-instructions.md<br/>または AGENTS.md"]
    Q1 -->|"はい・特定言語/ディレクトリのみ"| R2[".instructions.md<br/>applyTo で限定"]
    Q1 -->|"いいえ・手動で呼び出したい"| Q2{"再利用したいのは何か?"}
    Q2 -->|"定型プロンプト・単発タスク"| R3[".prompt.md<br/>/command"]
    Q2 -->|"AIの役割・使えるツール・モデル"| R4[".agent.md<br/>カスタムエージェント"]
    Q2 -->|"手順書・スクリプト付き専門知識"| R5["SKILL.md<br/>description一致で自動ロード"]
    Q1 -->|"外部システムのデータ/操作が必要"| R6["MCP サーバー"]

    classDef decision fill:#16233a,stroke:#47607f,color:#d7e0ec;
    classDef result fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class Q1,Q2 decision;
    class R1,R2,R3,R4,R5,R6 result;`,
  `flowchart LR
    U["ユーザーが<br/>/explain-code と入力"] --> F["explain-code.prompt.md<br/>を読み込み"]
    F --> Ag["Agent modeで実行<br/>(frontmatterのagent/tools/modelに従う)"]
    Ag --> Out["結果を返す"]

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    class U,F,Ag,Out purple;`,
  `flowchart LR
    Old[".chatmode.md<br/>(旧: Custom Chat Modes)"] -->|"リネーム"| New[".agent.md<br/>(新: Custom Agents)"]
    New --> Loc[".github/agents/<br/>または ユーザープロファイル"]

    classDef coral fill:#4a2620,stroke:#f0a688,color:#fbe4da;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class Old coral;
    class New,Loc teal;`,
  `flowchart TB
    L1["Level 1: Discovery<br/>全SKILL.mdの description だけを常時スキャン"] --> L2["Level 2: Instructions<br/>関連しそうなSKILL.md本文を読み込む"]
    L2 --> L3["Level 3: Resources<br/>スクリプト・参照資料・テンプレートを必要時にのみ読み込む"]

    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class L1,L2,L3 teal;`,
  `flowchart TB
    S1["Explore and clarify<br/>読み取り専用ツールでコードベースを調査し、<br/>曖昧な点は質問する"] --> S2["Draft and refine<br/>詳細な実装計画を作成し、一緒にレビューする"]
    S2 --> S3["Edit the plan directly<br/>計画は .copilot/plans/plan-{title}.md<br/>として保存され、直接編集できる"]
    S3 --> S4["Implement<br/>『Implement plan』を押すまで<br/>コードは一切変更されない"]

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    class S1,S2,S3,S4 purple;`,
  `flowchart TB
    P1["1. プロトタイピング<br/>複数案をモックで比較する"] --> P2["2. Plan Mode<br/>/plan で要件を詰める・質問に答える"]
    P2 --> P3["3. Autopilot<br/>計画に沿って自律的に実装するループ"]
    P3 --> P4["4. 人間によるレビューと反復"]
    P4 --> P5["5. Rubber Duck Review<br/>別系統のモデルにセカンドオピニオンを求める"]
    P5 -->|"要修正"| P3
    P5 -->|"承認"| P6["6. コミット・PR作成"]

    classDef coral fill:#4a2620,stroke:#f0a688,color:#fbe4da;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class P1,P2,P3,P4,P5 coral;
    class P6 teal;`,
  `flowchart LR
    C["constitution.md<br/>プロジェクトの<br/>非交渉的な原則"] --> S["/specify<br/>spec.md を生成"]
    S --> P["/plan<br/>plan.md（技術方針）を生成"]
    P --> T["/tasks<br/>tasks.md（実行可能な単位に分解）"]
    T --> I["/implement<br/>タスクごとに<br/>段階的にコード生成"]
    I --> Rev{"人間による<br/>チェックポイント"}
    Rev -->|"要修正"| P
    Rev -->|"承認"| Done["PR作成・マージ"]

    classDef purple fill:#2f2a52,stroke:#b6a6f0,color:#efe9fd;
    classDef gray fill:#16233a,stroke:#47607f,color:#d7e0ec;
    classDef teal fill:#113f3b,stroke:#7fd9c9,color:#e3faf5;
    class C,S,P,T,I purple;
    class Rev gray;
    class Done teal;`,
] as const;

function headingText(el: Element): string {
  return el.textContent?.trim().replace(/\s+/g, " ") ?? "";
}

describe("/copilot/markdown-file-guide (Copilot Spec-Driven Development Guide) Contract Tests", () => {
  // S-1: h2 の見出しが原本と完全一致（順序込み）
  it("S-1: h2 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const actualH2 = Array.from(container.querySelectorAll("main h2")).map(headingText);
    expect(actualH2).toEqual([...EXPECTED_H2]);
  });

  // S-2: h3 の見出しが原本と完全一致（順序込み）
  it("S-2: h3 の見出しが原本と完全一致（順序込み）", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const actualH3 = Array.from(container.querySelectorAll("main h3")).map(headingText);
    expect(actualH3).toEqual([...EXPECTED_H3]);
  });

  // S-3: 原本の外部リンク URL が全件存在
  it("S-3: 原本の外部リンク URL が全件存在", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const actualUrls = new Set(
      Array.from(container.querySelectorAll("a[href]")).map((a) => a.getAttribute("href"))
    );
    for (const url of EXPECTED_EXTERNAL_URLS) {
      expect(actualUrls).toContain(url);
    }
  });

  // S-4: 全 h2/h3 が一意な id を持ち、TOC のアンカーが全て実在する見出し/セクションを指す
  it("S-4: 全 h2/h3 またはセクションが一意な id を持ち、TOC のアンカーが全て実在する要素を指す", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const ids = Array.from(container.querySelectorAll("section[id], h2[id], h3[id]")).map(
      (el) => el.id
    );
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    // id を持つ要素だけを集めると「id の無い見出し」が黙って検査対象から外れる。
    // 本ページは原本どおり section 側に id を置くため、見出し自身か祖先 section の
    // いずれかで必ずアンカー先になっていることを全 h2/h3 について要求する。
    const headings = Array.from(container.querySelectorAll("h2, h3"));
    expect(headings.length).toBeGreaterThan(0);
    for (const heading of headings) {
      const anchorId = heading.id || (heading.closest("section[id]")?.id ?? "");
      expect(anchorId).not.toBe("");
    }

    const tocLinks = Array.from(container.querySelectorAll(`.${styles.navLink}`)).map((a) =>
      a.getAttribute("href")
    );
    for (const href of tocLinks) {
      expect(href).toMatch(/^#/);
      const targetId = href?.slice(1);
      expect(uniqueIds).toContain(targetId);
    }
  });

  // C-1: h1 のテキストが完全一致する
  it("C-1: h1 のテキストが完全一致する", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const actualH1 = Array.from(container.querySelectorAll("h1")).map(headingText);
    expect(actualH1).toEqual([...EXPECTED_H1]);
  });

  // C-2: クイックナビ（TOC リンク）の件数と href="#..." 形式
  it("C-2: クイックナビ（TOC リンク）の件数と href 形式", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const tocLinks = Array.from(container.querySelectorAll(`.${styles.navLink}`));
    expect(tocLinks.length).toBe(EXPECTED_H2.length);
    for (const link of tocLinks) {
      expect(link.getAttribute("href")).toMatch(/^#[a-z0-9_-]+$/);
    }
  });

  // C-3: サイドバー TOC の初期アクティブ状態（styles.active）が 1 件だけ存在する
  it("C-3: サイドバー TOC の初期アクティブ状態が先頭セクションに 1 件だけ付く", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const activeLinks = Array.from(
      container.querySelectorAll(`.${styles.navLink}.${styles.active}`)
    );
    // 下限比較だと複数リンクが同時にアクティブでも通る。初期状態は先頭の 1 件のみ。
    expect(activeLinks.map((link) => link.getAttribute("href"))).toEqual(["#overview"]);
  });

  // C-4: 外部リンク全件に target="_blank" かつ rel="noopener noreferrer"
  it("C-4: 外部リンク全件に target='_blank' かつ rel='noopener noreferrer'", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const extLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(extLinks.length).toBeGreaterThan(0);
    for (const link of extLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  // C-5: 内部リンクに .html 拡張子が含まれない
  it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const internalLinks = Array.from(container.querySelectorAll('a[href]:not([href^="http"])'));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });

  // C-6a: Mermaid ソースが原本と順序・内容・出現回数込みで完全一致する
  it("C-6a: Mermaid ソースが原本と順序・内容・出現回数込みで完全一致する", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const actual = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
      normalizeMermaidSource(el.textContent ?? "")
    );
    expect(actual).toEqual(EXPECTED_MERMAID_SOURCES.map(normalizeMermaidSource));
  });

  // C-6b: 全 Mermaid 図解がページ専用ラッパーに包まれている
  it("C-6b: 全 Mermaid 図解がページ専用ラッパーに包まれている", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
    const wrapped = Array.from(
      container.querySelectorAll(`.${styles.mermaidWrap} [data-testid="mermaid"]`)
    );
    expect(wrapped).toEqual(diagrams);
  });

  // C-6c: 各図解が空でなく、図種別の宣言から始まる
  it("C-6c: 各図解が空でなく、図種別の宣言から始まる", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((el) =>
      (el.textContent ?? "").trim()
    );
    for (const chart of charts) {
      expect(chart.length).toBeGreaterThan(0);
      expect(chart).toMatch(MERMAID_DIAGRAM_DECLARATION);
    }
  });

  // C-6d: 禁止構文 block-beta を使っていない
  it("C-6d: 禁止構文 block-beta を使っていない", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
      (el) => el.textContent ?? ""
    );
    for (const chart of charts) {
      expect(chart).not.toContain("block-beta");
    }
  });

  // C-6e: 図解のソースが左端揃え（先頭行にインデントが無い）
  it("C-6e: 図解のソースが左端揃え（先頭行にインデントが無い）", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const charts = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
      (el) => el.textContent ?? ""
    );
    for (const chart of charts) {
      const firstLine = chart.split("\n").find((l) => l.trim().length > 0) ?? "";
      expect(firstLine).toBe(firstLine.trimStart());
    }
  });

  // D-1: 原本の callout-warning が正しく存在する
  // 件数は原本 archive/html/Microsoft/Copilot-spec-driven-development-best-practices.html
  // の `callout callout-warning` 出現数（1 件）に固定する。
  const EXPECTED_CALLOUT_WARNING_COUNT = 1;

  it("D-1: callout-warning が原本と同数存在する", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const warnings = container.querySelectorAll(`.${styles.calloutWarning}`);
    expect(warnings).toHaveLength(EXPECTED_CALLOUT_WARNING_COUNT);
  });

  // D-2: 原本の step-badge が 7 件存在する
  it("D-2: step-badge が 7 件存在する", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const badges = container.querySelectorAll(`.${styles.stepBadge}`);
    expect(badges.length).toBe(7);
  });

  // Q-1: metadata の title / description が空でなく整合する
  it("Q-1: metadata の title / description が空でなく整合する", () => {
    expect(typeof metadata.title).toBe("string");
    expect(metadata.title).toContain("GitHub Copilot");
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(20);
  });

  // Q-2: 見出し階層がスキップしない（h1 -> h2 -> h3）
  it("Q-2: 見出し階層がスキップしない", () => {
    const { container } = render(<MarkdownFileGuidePage />);
    const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    let prevLevel = 0;
    for (const h of headings) {
      const level = Number.parseInt(h.tagName.slice(1), 10);
      if (prevLevel > 0) {
        expect(level).toBeLessThanOrEqual(prevLevel + 1);
      }
      prevLevel = level;
    }
  });
});
