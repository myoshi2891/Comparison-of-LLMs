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

const EXPECTED_H1 = [
  "Generative AI for Software Development ― 初学者のためのステップバイステップガイド",
] as const;

const EXPECTED_H2 = [
  "この本について",
  "Step 0. なぜ今このテーマなのか",
  "Step 1. コード生成とオートコンプリート",
  "Step 2. UI/UXデザインとフロントエンド開発",
  "Step 3. バグ検出とコードレビュー",
  "Step 4. 自動テストと品質保証(QA)",
  "Step 5. 予測分析とパフォーマンス最適化",
  "Step 6. ドキュメントとテクニカルライティング",
  "Step 7. チャットボットとバーチャルアシスタント",
  "Step 8. 実装成功事例から学ぶ",
  "Step 9. AI時代のソフトウェア開発ワークフロー実践編",
  "Step 10. リスクとガバナンス、責任あるAI活用",
  "Step 11. ツール選定のための評価フレームワーク",
  "Step 12. ソフトウェア開発の未来",
  "用語集",
  "学習チェックリスト",
  "参考文献・出典URL一覧",
] as const;

const EXPECTED_H3 = [
  "0-1. 数字で見る「AIが当たり前になった」開発現場",
  "0-2. 「バイブコーディング」という言葉の広がり",
  "0-3. 本ガイドの読み方",
  "1-1. ブラウザベースのツール",
  "1-2. IDE統合型ツール(2026年の主戦場)",
  "1-3. 使い分けの考え方",
  "2-1. 主要な「AIアプリビルダー」",
  "2-2. 使う上での注意点(初学者向け)",
  "3-1. なぜAIコードレビューが急速に普及したのか",
  "3-2. 代表的なツール",
  "3-3. レビューワークフローの実際",
  "4-1. AIテストツールの3つの型",
  "4-2. 代表的なツール",
  "4-3. テストピラミッドとAIの役割",
  "5-1. 主なユースケース",
  "5-2. 代表的なツールの位置づけ",
  "6-1. 「ドキュメントは書かれない」から「ドキュメントは陳腐化する」へ",
  "6-2. 代表的なツール",
  "6-3. 実践のコツ",
  "7-1. チャットボットからエージェントへ",
  "7-2. 代表的なツール・フレームワーク",
  "7-3. 使い分けの目安",
  "8-1. 個人開発者の事例: Pieter Levels",
  "8-2. 大企業の事例: Shopify",
  "8-3. 2つの事例から見えるパターン",
  "9-1. エージェント中心の開発ループ",
  "9-2. 段階別に見るツールの組み合わせ例",
  "10-1. 「レビューの質」対「開発の速さ」のトレードオフ",
  "10-2. プロンプトインジェクションと「致死の三要素」",
  "10-3. 「AIが書いたコードは1.7倍の問題を含む」という調査",
  "10-4. 実務者への提言",
  "12-1. 2026年時点で見えてきた変化の兆し",
  "12-2. まとめ",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://www.oreilly.com/library/view/generative-ai-for/9781098162269/",
  "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/",
  "https://github.blog/ai-and-ml/generative-ai/how-ai-is-reshaping-developer-choice-and-octoverse-data-proves-it/",
  "https://www.infoq.com/news/2026/03/ai-reshapes-language-choice/",
  "https://visualstudiomagazine.com/articles/2025/10/31/typescript-tops-github-octoverse-as-ai-era-reshapes-language-choices.aspx",
  "https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report",
  "https://blog.google/innovation-and-ai/technology/developers-tools/dora-report-2025/",
  "https://particula.tech/blog/lovable-vs-bolt-vs-v0-ai-app-builders",
  "https://weavai.app/blog/en/2026/05/12/2026-ai-app-builder-guide-v0-vs-bolt-new-vs-lovable/",
  "https://blog.tooljet.com/lovable-vs-bolt-vs-v0/",
  "https://www.nxcode.io/resources/news/bolt-new-vs-lovable-2026",
  "https://www.nxcode.io/resources/news/lovable-vs-bolt-new-2026-ai-app-builder-comparison",
  "https://tech-insider.org/au/lovable-vs-bolt-new-vs-v0-2026/",
  "https://ai-tldr.dev/releases/simon-willison-vibe-coding-agentic-engineering-may6/",
  "https://simonw.substack.com/p/agentic-engineering-patterns",
  "https://ai-tldr.dev/releases/simonw-conceptual-integrity-aug19/",
  "https://dev.to/nickpe/how-to-build-a-full-stack-app-with-an-ai-coding-agent-9p9",
  "https://www.deployhq.com/guides/cursor",
  "https://codersera.com/blog/cursor-ide-complete-guide-2026/",
  "https://cognition.com/blog/windsurf",
  "https://www.nxcode.io/resources/news/cognition-windsurf-acquisition-swe-1-5-codemaps-2026",
  "https://www.techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf/",
  "https://petronellatech.com/blog/cursor-ai-ide-setup-guide/",
  "https://www.buildmvpfast.com/blog/best-ai-code-review-tools-anthropic-2026",
  "https://reptile.haus/journal/ai-code-review-mainstream-adopt-without-losing-quality-2026/",
  "https://www.ideaplan.io/blog/ai-code-review-tools-market-share-2026",
  "https://ucstrategies.com/news/coderabbit-review-2026-fast-ai-code-reviews-but-a-critical-gap-enterprises-cant-ignore/",
  "https://aisotools.com/blog/coderabbit-review-2026",
  "https://www.verdent.ai/guides/best-ai-for-code-review-2026",
  "https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report",
  "https://momentic.ai/blog/ai-test-automation-tools",
  "https://testcollab.com/blog/ai-testing-tools",
  "https://ttms.com/10-best-ai-tools-for-testers/",
  "https://qaskills.sh/blog/best-ai-testing-tools-2026",
  "https://dualite.dev/blogs/code-documentation-best-practices",
  "https://baeseokjae.github.io/posts/ai-documentation-generator-tools-2026/",
  "https://happysupport.ai/blog/auto-code-documentation-tools",
  "https://neuraplus-ai.github.io/blog/langchain-ai-agent-tutorial-2026.html",
  "https://releasebot.io/updates/langchain-ai",
  "https://www.yaitec.com/en/blog/langchain-vs-langgraph-frameworks-agentes-ai-2026",
  "https://findskill.ai/learn-ai-for-entrepreneurs/",
  "https://levelup.gitconnected.com/one-of-the-most-successful-indie-hackers-says-ai-killed-the-playbook-716f27f995ec",
  "https://levels.io/indie-hackers-first-to-go-extinct-with-ai",
  "https://betakit.com/shopify-ceo-tobi-lutke-tells-employees-to-prove-ai-cant-do-the-job-before-asking-for-resources/",
  "https://www.cnbc.com/2025/04/07/shopify-ceo-prove-ai-cant-do-jobs-before-asking-for-more-headcount.html",
  "https://www.marketingaiinstitute.com/blog/shopify-ceo-ai-memo",
] as const;

const EXPECTED_TOC_HREFS = [
  "#book-info",
  "#step0",
  "#step1",
  "#step2",
  "#step3",
  "#step4",
  "#step5",
  "#step6",
  "#step7",
  "#step8",
  "#step9",
  "#step10",
  "#step11",
  "#step12",
  "#glossary",
  "#checklist",
  "#references",
] as const;

const EXPECTED_MERMAID_SOURCES = [
  `flowchart LR
    A["要件定義"] --> B["設計・UIプロトタイプ"]
    B --> C["コード生成"]
    C --> D["コードレビュー"]
    D --> E["テスト・QA"]
    E --> F["ドキュメント作成"]
    F --> G["デプロイ・運用監視"]
    G -.->|"フィードバック"| A
    class A hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`,
  `flowchart TD
    Q["タスクの性質は"] --> S["単発の質問・スニペット生成"]
    Q --> M["複数ファイルにまたがる機能追加"]
    Q --> L["長時間の自律的な作業 リファクタ・移行等"]
    S --> S1["チャット型ツールで十分 ChatGPT・Gemini"]
    M --> M1["IDE統合エージェント Cursor・Copilot Agent mode等"]
    L --> L1["長時間実行エージェント Claude Code・Cloud Agents等"]
    class Q hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`,
  `flowchart TD
    A["開発者がPRを作成"] --> B["AIレビューボットが自動解析"]
    B --> C{"重大な問題を検出?"}
    C -->|"はい"| D["インラインコメントで指摘・修正案を提示"]
    C -->|"いいえ"| E["要約コメントを投稿"]
    D --> F["人間のレビュアーが最終確認"]
    E --> F
    F --> G["マージ"]
    class G done
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;`,
  `flowchart TD
    T["テストピラミッド"] --> Un["多数 単体テスト"]
    Un --> I["中間 統合テスト"]
    I --> U["少数 E2E・UIテスト"]
    AI1["AIコーディングエージェントが単体テストを自動生成"] -.-> Un
    AI2["セルフヒーリング機能がロケーター変更を自動修正"] -.-> I
    AI3["自律エージェントがE2Eシナリオを実行・検証"] -.-> U
    class T hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`,
  `flowchart LR
    U["ユーザーの入力"] --> C["従来型チャットボット"]
    U --> Agt["AIエージェント"]
    C --> C1["あらかじめ定義された応答を返す"]
    Agt --> A1["外部ツール・APIを呼び出す"]
    A1 --> A2["結果を確認し次の行動を判断"]
    A2 --> A3["必要なら再度ツールを呼び出す ループ"]
    A3 --> A4["最終的な回答・行動を返す"]
    class Agt hub
    class A4 done
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;`,
  `flowchart TD
    P["タスクを具体的に定義する"] --> A["AIエージェントに実行を委任"]
    A --> V["結果を検証する テスト実行・差分レビュー"]
    V --> D{"期待通りか?"}
    D -->|"はい"| M["人間が最終承認しマージ"]
    D -->|"いいえ"| R["フィードバックを与えて再試行、または人間が引き取る"]
    R --> A
    class M done
    classDef done fill:#bfe4d2,color:#123722,stroke:#2f6b4f,stroke-width:1px;`,
  `flowchart TD
    A["機密性の高い社内データへのアクセス"] --> X["致死の三要素が揃う"]
    B["信頼できない外部コンテンツの読み込み"] --> X
    C["外部との通信能力"] --> X
    X --> R["悪意ある指示の注入による情報漏洩リスク"]
    R --> M1["対策 権限を必要最小限に絞る"]
    R --> M2["対策 重要な操作の前に人間の承認を挟む"]
    R --> M3["対策 三要素のうち少なくとも1つを切り離す設計にする"]
    class X hub
    classDef hub fill:#c9c4ef,color:#221f52,stroke:#413d8f,stroke-width:1px;`,
] as const;

function cleanText(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("Generative AI for Software Development ガイド契約テスト", () => {
  // S. 原本照合契約 (4件・必須)
  describe("S. 原本照合契約", () => {
    it("S-1: h2 見出しが原本と順序込みで完全一致する", () => {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h2")).map(cleanText);
      expect(headings).toEqual([...EXPECTED_H2]);
    });

    it("S-2: h3 見出しが原本と順序込みで完全一致する", () => {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h3")).map(cleanText);
      expect(headings).toEqual([...EXPECTED_H3]);
    });

    it("S-3: 原本の外部リンク URL が全件存在する", () => {
      const { container } = render(<Page />);
      const renderedUrls = new Set(
        Array.from(container.querySelectorAll('a[href^="http"]')).map((a) => a.getAttribute("href"))
      );
      for (const url of EXPECTED_EXTERNAL_LINKS) {
        expect(renderedUrls).toContain(url);
      }
    });

    it("S-4: 全 h2/h3 が一意な id を持ち、TOC アンカーが実在する見出しを指す", () => {
      const { container } = render(<Page />);
      const idElements = Array.from(container.querySelectorAll("section[id], h2[id], h3[id]"));
      const ids = idElements.map((el) => el.getAttribute("id")).filter(Boolean);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      const tocAnchors = Array.from(
        container.querySelectorAll('nav a[href^="#"], [data-testid="sidebar-nav"] a[href^="#"]')
      );
      for (const anchor of tocAnchors) {
        const targetId = anchor.getAttribute("href")?.slice(1);
        if (targetId && targetId !== "top") {
          expect(container.querySelector(`#${targetId}`)).not.toBeNull();
        }
      }
    });
  });

  // C. コンテンツ契約 (5件必須 + C-6 Mermaid)
  describe("C. コンテンツ契約", () => {
    it("C-1: h1 テキストが原本と完全一致する", () => {
      const { container } = render(<Page />);
      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      if (!h1) throw new Error("h1 not found");
      expect(cleanText(h1)).toBe(EXPECTED_H1[0]);
    });

    it("C-2: クイックナビ（TOC リンク）が 17 件存在し href='#...' 形式である", () => {
      const { container } = render(<Page />);
      const tocLinks = Array.from(container.querySelectorAll('[data-testid="sidebar-nav-link"]'));
      expect(tocLinks.length).toBe(EXPECTED_TOC_HREFS.length);
      for (const link of tocLinks) {
        const href = link.getAttribute("href");
        expect(href).toMatch(/^#/);
      }
    });

    it("C-3: サイドバー TOC の初期アクティブ項目が存在する", () => {
      const { container } = render(<Page />);
      const activeLink = container.querySelector(`.${styles.active}`);
      expect(activeLink).not.toBeNull();
    });

    it("C-4: 外部リンク全件に target='_blank' かつ rel='noopener noreferrer'（または rel='noopener'）が付与されている", () => {
      const { container } = render(<Page />);
      const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
      expect(externalLinks.length).toBeGreaterThan(0);
      for (const a of externalLinks) {
        expect(a.getAttribute("target")).toBe("_blank");
        const rel = a.getAttribute("rel") ?? "";
        expect(rel).toMatch(/noopener/);
      }
    });

    it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
      const { container } = render(<Page />);
      const internalLinks = Array.from(
        container.querySelectorAll('a:not([href^="http"]):not([href^="#"])')
      );
      for (const a of internalLinks) {
        const href = a.getAttribute("href") ?? "";
        expect(href).not.toContain(".html");
      }
    });

    it("C-6: Mermaid 7 件が専用ラッパーに包まれ、原本のソースと順序・内容込みで完全一致する", () => {
      const { container } = render(<Page />);
      const mermaidWrappers = container.querySelectorAll('[data-testid="mermaid-diagram"]');
      expect(mermaidWrappers.length).toBe(EXPECTED_MERMAID_SOURCES.length);

      const actualSources = Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map(
        (el) => normalizeMermaidSource(el.textContent ?? "")
      );
      const expectedNormalized = EXPECTED_MERMAID_SOURCES.map((src) => normalizeMermaidSource(src));

      for (const src of actualSources) {
        expect(MERMAID_DIAGRAM_DECLARATION.test(src)).toBe(true);
      }
      expect(actualSources).toEqual(expectedNormalized);
    });
  });

  // D. デザイン契約
  describe("D. デザイン契約", () => {
    it("D-1: callout ボックスが存在し data-variant 属性を持つ", () => {
      const { container } = render(<Page />);
      const callouts = container.querySelectorAll('[data-testid="callout"]');
      expect(callouts.length).toBe(2);
      for (const c of Array.from(callouts)) {
        expect(c.getAttribute("data-variant")).toBeTruthy();
      }
    });

    it("D-5: サイドバーナビが存在し、リンクの href 一覧が原本 TOC と完全一致する", () => {
      const { container } = render(<Page />);
      const nav = container.querySelector('[data-testid="sidebar-nav"]');
      expect(nav).not.toBeNull();

      const hrefs = Array.from(container.querySelectorAll('[data-testid="sidebar-nav-link"]')).map(
        (a) => a.getAttribute("href")
      );
      expect(hrefs).toEqual([...EXPECTED_TOC_HREFS]);
    });

    it("D-7: 外部 CSS リンク（Tabler Icons）が SRI 付きで存在する", () => {
      const { container } = render(<Page />);
      const link = container.querySelector(
        'link[href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"]'
      );
      expect(link).not.toBeNull();
      expect(link?.getAttribute("integrity")).toBe(
        "sha384-ND+q1IVc0KDElX60dZaqKc7Xl9cdxd2PpU2JfVUHcurCkFVtVLFdt9vJfxtHSL3p"
      );
      expect(link?.getAttribute("crossorigin")).toBe("anonymous");
    });

    it("D-8: .layout 最外殻に data-testid='layout-root' が存在する", () => {
      const { container } = render(<Page />);
      const layout = container.querySelector('[data-testid="layout-root"]');
      expect(layout).not.toBeNull();
    });

    it("D-9: 原本準拠の Google Fonts（Source Serif 4 & Noto Serif JP）link が存在する", () => {
      const { container } = render(<Page />);
      const fontLink = container.querySelector(
        'link[href*="fonts.googleapis.com/css2?family=Source+Serif+4"]'
      );
      expect(fontLink).not.toBeNull();
      expect(fontLink?.getAttribute("href")).toContain("Noto+Serif+JP");
    });

    it("D-10: ヒーローセクション内に最終確認日および公開日バッジが存在する", () => {
      const { container } = render(<Page />);
      const badge = container.querySelector('[data-testid="page-freshness"]');
      expect(badge).not.toBeNull();
      expect(badge?.textContent).toContain("最終確認");
      expect(badge?.textContent).toContain("公開");
      const times = badge?.querySelectorAll("time");
      expect(times?.length).toBe(2);
      expect(times?.[0].getAttribute("dateTime")).toBe("2026-09-17");
      expect(times?.[1].getAttribute("dateTime")).toBe("2026-09-17");
    });
  });

  // Q. 品質契約 (3件・必須)
  describe("Q. 品質契約", () => {
    it("Q-1: 学習チェックリストのアイテムが 9 件存在し、カウンター要素 checkCounter を持つ", () => {
      const { container } = render(<Page />);
      const checkItems = container.querySelectorAll(".check-item");
      expect(checkItems.length).toBe(9);
      const checkboxes = container.querySelectorAll(".check-item input[type='checkbox']");
      expect(checkboxes.length).toBe(9);
      const counter = container.querySelector("#checkCounter, [data-testid='check-counter']");
      expect(counter).not.toBeNull();
      expect(counter?.textContent?.trim()).toBe("0 / 9 完了");
    });

    it("Q-4: チェックボックス操作時にカウンターが更新され、done クラスが付与される", () => {
      const { container } = render(<Page />);
      const counter = container.querySelector("#checkCounter");
      const firstCheck = container.querySelector<HTMLInputElement>(
        ".check-item input[type='checkbox']"
      );
      const firstItem = container.querySelector(".check-item");

      expect(firstCheck).not.toBeNull();
      expect(counter?.textContent?.trim()).toBe("0 / 9 完了");

      if (firstCheck && firstItem) {
        firstCheck.checked = true;
        firstCheck.dispatchEvent(new Event("change", { bubbles: true }));
        expect(counter?.textContent?.trim()).toBe("1 / 9 完了");
        expect(firstItem.classList.contains("done")).toBe(true);

        firstCheck.checked = false;
        firstCheck.dispatchEvent(new Event("change", { bubbles: true }));
        expect(counter?.textContent?.trim()).toBe("0 / 9 完了");
        expect(firstItem.classList.contains("done")).toBe(false);
      }
    });

    it("Q-2: metadata の title / description が空でなく title が h1 と整合する", () => {
      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      const titleStr = typeof metadata.title === "string" ? metadata.title : "";
      expect(titleStr).toContain("Generative AI for Software Development");
    });

    it("Q-3: 見出し階層が飛ばない（h1 → h2 → h3）", () => {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      let maxLevelSeen = 0;
      for (const h of headings) {
        const level = parseInt(h.tagName.substring(1), 10);
        if (maxLevelSeen > 0) {
          expect(level - maxLevelSeen).toBeLessThanOrEqual(1);
        }
        maxLevelSeen = Math.max(maxLevelSeen, level);
      }
    });
  });
});
