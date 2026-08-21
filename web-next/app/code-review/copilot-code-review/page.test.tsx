// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

// 原本照合用 見出し配列（順序込み完全一致）
const EXPECTED_H1 = [
  "GitHub Copilot Code Review 実践ガイド中級〜上級エンジニアのためのベストプラクティス",
] as const;

const EXPECTED_H2 = [
  "はじめに",
  "GitHub Copilot Code Reviewとは何か",
  "レビューを起動する",
  "カスタムインストラクションを設計する",
  "Agent SkillsとMCPで文脈を拡張する",
  "レビューコメントを運用する",
  "限界を理解し、人間レビューと組み合わせる",
  "セキュリティとガバナンスを固める",
  "他のAIコードレビューツールとの位置づけ",
  "チーム導入ロードマップ",
  "納品前・運用開始前チェックリスト",
  "まとめ",
  "参考文献・出典",
] as const;

const EXPECTED_H3 = [
  "何をしてくれるのか",
  "処理の流れ(アーキテクチャ)",
  "利用できる環境",
  "3種類の指示ファイル",
  "指示ファイルをどこに書くか判断する",
  "効果的な書き方",
  "コメントの構造",
  "コメントへの対応フロー",
  "チーム運用上の推奨事項",
  "Content Exclusion(コンテンツ除外)の適用範囲を正しく理解する",
  "Copilot Code Review自体のセキュリティ制御",
  "エンタープライズでの一括ガバナンス",
  "公式ドキュメント(GitHub Docs)",
  "公式ブログ・Changelog(GitHub Blog)",
  "コミュニティ・実務者による記事",
] as const;

const EXPECTED_H4 = [
  "*.instructions.mdファイルの例",
  ".github/skills/配下のSKILL.md",
  "読み取り専用の外部連携",
  "アトリビューション表示",
  "個人トライアル",
  "リポジトリ導入",
  "組織展開",
  "計測と改善",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://github.blog/changelog/label/copilot/",
  "https://docs.github.com/en/copilot/get-started/best-practices",
  "https://docs.github.com/copilot/using-github-copilot/code-review/using-copilot-code-review",
  "https://docs.github.com/en/copilot/tutorials/customize-code-review",
  "https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-automatic-review",
  "https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/enable-copilot-code-review",
  "https://docs.github.com/copilot/responsible-use-of-github-copilot-features/responsible-use-of-github-copilot-code-review",
  "https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot",
  "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions",
  "https://docs.github.com/zh/enterprise-cloud@latest/copilot/managing-copilot/managing-github-copilot-in-your-organization/managing-github-copilot-features-in-your-organization/testing-changes-to-content-exclusions-in-your-ide",
  "https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/",
  "https://github.blog/changelog/2026-07-17-copilot-code-review-customization-and-configurability-improvements/",
  "https://github.blog/changelog/2026-06-25-copilot-code-review-analysis-depth-and-efficiency-updates/",
  "https://github.blog/changelog/2026-06-12-copilot-code-review-new-configurations-and-controls/",
  "https://www.digitalapplied.com/blog/mcp-adoption-week-copilot-code-review-ga",
  "https://github.blog/changelog/2025-09-03-copilot-code-review-path-scoped-custom-instruction-file-support/",
  "https://github.blog/ai-and-ml/github-copilot/unlocking-the-full-power-of-copilot-code-review-master-your-instructions-files/",
  "https://dev.to/rahulxsingh/github-copilot-code-review-complete-guide-2026-255h",
  "https://dev.to/pwd9000/mastering-code-reviews-with-github-copilot-the-definitive-guide-3nfp",
  "https://blog.mrinalmaheshwari.com/github-copilot-code-review-guidelines-best-practices-and-how-to-integrate-it-into-your-pr-b4518073b4c9",
  "https://blog.cloud-eng.nl/2026/03/13/copilot-content-exclusions-four-layers/",
  "https://codeant.ai/blogs/best-ai-code-review-tools",
  "https://refacto.ai/blog/github-copilot-code-review-in-2026-what-it-does-well-and-where-it-falls-short/",
  "https://www.morphllm.com/comparisons/coderabbit-vs-copilot",
  "https://simonwillison.net/tags/github-copilot/",
] as const;

/** 原本 <title> の文言。ページの h1 とは別に metadata の契約として固定する。 */
const EXPECTED_METADATA_TITLE =
  "GitHub Copilot Code Review 実践ガイド ― 中級〜上級エンジニアのためのベストプラクティス";

/** 原本には meta description が無いため、本ページ用に定めた SEO 文言を契約として固定する。 */
const EXPECTED_METADATA_DESCRIPTION =
  "AI駆動のコードレビューをチーム開発に深く組み込む——概念・設定・運用まで中〜上級者向けにステップバイステップで解説";

/** 原本 <pre><code> の全文（1 ブロックのみ）。 */
const EXPECTED_CODE_BLOCKS = [
  `---
applyTo:
  - "webapp/src/**"
  - "ui/components/**"
---
アクセシビリティ(ARIA属性、フォーカス管理)を重視してください。
デザイントークンの利用を優先してください。
legacy/配下の非推奨コンポーネントの利用を検出したら指摘してください。`,
] as const;

/**
 * コードブロックの比較用正規化。
 * ページ側は 1 行を 1 つの div (codeLine) で組むため textContent に改行が現れない。
 * 改行だけを除去して比較し、インデントと文字列そのものは厳密に突き合わせる。
 */
function normalizeCode(raw: string | null): string {
  return (raw ?? "").replace(/\r?\n/g, "").trim();
}

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
    A["入力処理<br/>PR差分 + タイトル/本文 + カスタム指示を統合"] --> B["言語モデル解析<br/>GPT系 / Claude Opus系 / Gemini系 等を使い分け"]
    B --> C["応答生成<br/>指摘 + severity + 修正提案(自然言語/コード)"]
    C --> D["出力整形<br/>PRのインライン差分コメントとして投稿"]`,
  `flowchart TB
    Start["自動化のレベルを決める"] --> Triage{"どの範囲で有効化する?"}
    Triage -->|"自分のPRだけ"| P["個人設定<br/>Your Copilot > Automatic code review"]
    Triage -->|"1つのリポジトリ"| R["リポジトリRuleset<br/>Automatically request Copilot code review"]
    Triage -->|"組織全体"| O["組織Ruleset<br/>Repository Rulesetsを一括適用"]
    P --> Merge["PR作成/更新時にCopilotが自動レビュー"]
    R --> Merge
    O --> Merge
    Merge --> End["レビューコメントがPRに投稿される"]`,
  `flowchart TB
    A["PR作成 (Draftも可)"] --> B["Copilot code reviewを起動<br/>(自動設定 または 手動Request)"]
    B --> C["レビューコメント生成<br/>severity: High / Medium / Low"]
    C --> D{"開発者が内容を確認"}
    D -->|"妥当な指摘"| E["提案を適用 または 手動修正"]
    D -->|"誤検知/対象外"| F["コメントをResolve"]
    E --> G["人間レビュアーが最終レビュー"]
    F --> G
    G --> H{"Approve?"}
    H -->|"Yes"| I["マージ"]
    H -->|"No / 追加修正"| B`,
  `flowchart TB
    L1["レイヤー1: Content Exclusion<br/>機密ファイルをレビュー対象から除外"] --> L2["レイヤー2: Firewall<br/>Copilotのネットワークアクセスを制御"]
    L2 --> L3["レイヤー3: MCP read-only制約<br/>ツール呼び出しを読み取り専用に限定"]
    L3 --> L4["レイヤー4: CODEOWNERS<br/>設定ファイル自体の変更を承認制に"]`,
  `flowchart TB
    P1["フェーズ1: 個人トライアル<br/>数名が手動リクエストで試用"] --> P2["フェーズ2: リポジトリ導入<br/>copilot-instructions.md整備 + 自動レビュー有効化"]
    P2 --> P3["フェーズ3: 組織展開<br/>組織Ruleset・Agent Skills・MCPの標準化"]
    P3 --> P4["フェーズ4: 計測と改善<br/>採用率とfalse positive率をモニタリングし指示を継続改善"]`,
] as const;

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

// Mock MermaidDiagram component
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

/** 見出しの表示テキストを正規化 */
function headingText(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("/code-review/copilot-code-review — 原本照合契約 (S)", () => {
  it("S-1: h2 の見出しが原本と完全一致する（順序込み）", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll("h2")).map(headingText);
    expect(actual).toEqual([...EXPECTED_H2]);
  });

  it("S-2: h3 の見出しが原本と完全一致する（順序込み）", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll("h3")).map(headingText);
    expect(actual).toEqual([...EXPECTED_H3]);
  });

  it("S-3: 原本の外部リンクがすべて存在する", () => {
    const { container } = render(<Page />);
    const hrefs = new Set(
      Array.from(container.querySelectorAll('a[href^="http"]')).map((a) =>
        (a.getAttribute("href") ?? "").replace(/\/+$/, "")
      )
    );
    for (const url of EXPECTED_EXTERNAL_LINKS) {
      expect(hrefs.has(url.replace(/\/+$/, ""))).toBe(true);
    }
  });

  it("S-4: 全 h2 / h3 が一意なアンカー id を持ち TOC から到達できる", () => {
    const { container } = render(<Page />);
    const headings = Array.from(container.querySelectorAll("h2, h3"));
    const ids = headings.map((h) => h.getAttribute("id"));
    expect(ids.every((id) => Boolean(id))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);

    const tocHrefs = Array.from(container.querySelectorAll('nav a[href^="#"]')).map((a) =>
      (a.getAttribute("href") ?? "").slice(1)
    );
    for (const href of tocHrefs) {
      expect(ids).toContain(href);
    }
  });
});

describe("/code-review/copilot-code-review — コンテンツ契約 (C)", () => {
  it("C-1: h1 のテキストが完全一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    if (h1) {
      expect(headingText(h1)).toBe(EXPECTED_H1[0]);
    }
  });

  it("C-2: クイックナビ（TOC リンク）の件数と href 形式", () => {
    const { container } = render(<Page />);
    const tocLinks = Array.from(container.querySelectorAll("nav a[href^='#']"));
    expect(tocLinks.length).toBe(EXPECTED_H2.length);
    // 件数だけでは href の綴り間違い・空アンカーを見逃すため、形式と解決先も検証する
    for (const link of tocLinks) {
      const href = link.getAttribute("href") ?? "";
      expect(href).toMatch(/^#[\w-]+$/);
      expect(container.querySelector(`#${CSS.escape(href.slice(1))}`)).not.toBeNull();
    }
  });

  it("C-3: サイドバー TOC の初期アクティブ状態が存在する", () => {
    const { container } = render(<Page />);
    // [class*='active'] は "inactive" 等にも当たるため、CSS Modules の生成クラスで厳密に選ぶ
    const activeLinks = Array.from(container.querySelectorAll(`nav a.${styles.active}`));
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0].getAttribute("href")).toBe("#intro");
  });

  it("C-4: 外部リンク全件に target='_blank' かつ rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll('a[href^="#"], a[href^="/"]'));
    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      if (href) {
        expect(href).not.toContain(".html");
      }
    }
  });

  it("C-6: 原本の Mermaid 図解ソースが順序・内容・出現回数込みで完全一致する", () => {
    const { container } = render(<Page />);
    const mermaidElements = Array.from(
      container.querySelectorAll('[data-testid="mermaid-diagram"]')
    );
    expect(mermaidElements.length).toBe(EXPECTED_MERMAID_SOURCES.length);
    mermaidElements.forEach((el, index) => {
      const chart = el.getAttribute("data-chart")?.trim();
      expect(chart).toBe(EXPECTED_MERMAID_SOURCES[index].trim());
    });
  });
});

describe("/code-review/copilot-code-review — デザイン契約 (D)", () => {
  // 原本 archive/html/Microsoft/Github-copilot-code-review-best-practices.html の
  // callout 出現順（"default" = バリアント指定なしの素の callout）。
  const EXPECTED_CALLOUT_VARIANTS = ["default", "default", "warn", "default", "default"] as const;

  it("D-1: callout が原本と同数・同じバリアント順で存在する", () => {
    const { container } = render(<Page />);
    const callouts = Array.from(container.querySelectorAll(".callout"));
    // 件数だけ / some() だけでは callout を落としても通るため、順序込みで比較する。
    const variants = callouts.map(
      (c) => c.getAttribute("data-variant") ?? (c.classList.contains("warn") ? "warn" : "default")
    );
    expect(variants).toEqual([...EXPECTED_CALLOUT_VARIANTS]);
  });

  it("D-6: コードブロックが原本と同数・同内容で存在する", () => {
    const { container } = render(<Page />);
    const codeBlocks = Array.from(
      container.querySelectorAll("pre code, [data-testid='code-block']")
    );
    // 件数下限 + 部分一致では行を落としても通る。原本の全文と順序込みで比較する。
    expect(codeBlocks.map((cb) => normalizeCode(cb.textContent))).toEqual([
      ...EXPECTED_CODE_BLOCKS.map(normalizeCode),
    ]);
  });

  it("D-7: highlight.js atom-one-dark CDN リンクが存在する", () => {
    const { container } = render(<Page />);
    const link = container.querySelector('link[href*="atom-one-dark"]');
    expect(link).not.toBeNull();
  });

  it("D-8: layout ルート要素が存在する", () => {
    const { container } = render(<Page />);
    const root = container.querySelector('[data-testid="layout-root"]');
    expect(root).not.toBeNull();
  });
});

describe("/code-review/copilot-code-review — 品質契約 (Q)", () => {
  it("Q-2: export const metadata の title / description が原本の値と完全一致する", () => {
    // truthy 判定では文言が入れ替わっても通る。定数と厳密比較する。
    expect(metadata.title).toBe(EXPECTED_METADATA_TITLE);
    expect(metadata.description).toBe(EXPECTED_METADATA_DESCRIPTION);
  });

  it("Q-3: h4 の見出しが原本と完全一致する（順序込み）", () => {
    const { container } = render(<Page />);
    const actual = Array.from(container.querySelectorAll("h4")).map(headingText);
    expect(actual).toEqual([...EXPECTED_H4]);
  });
});
