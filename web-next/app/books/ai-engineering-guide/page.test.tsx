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

const EXPECTED_H1 = ["AI Engineering 入門ガイド"] as const;

const EXPECTED_H2 = [
  "はじめに — AI Engineeringとは何か",
  "なぜ今、AI Engineeringなのか（歴史的背景）",
  "AI EngineeringとMLエンジニアリングの違い",
  "AIエンジニアリングスタック：3つの層",
  "Foundation Modelsの基礎を理解する",
  "プロンプトエンジニアリングからコンテキストエンジニアリングへ",
  "評価（Evaluation）を設計する",
  "RAG（検索拡張生成）で外部知識を活用する",
  "AIエージェントを構築する",
  "Model Context Protocol（MCP）でツールを繋ぐ",
  "Fine-tuningが必要になる場面",
  "推論最適化とコスト・レイテンシ管理",
  "LLMOps：本番運用のオブザーバビリティ",
  "セキュリティと安全性",
  "AIエンジニアになるためのロードマップ",
  "まとめ",
  "参考文献・出典",
] as const;

const EXPECTED_H3 = [
  "基盤となる書籍",
  "ソフトウェアの世代交代とコンテキストエンジニアリング（Andrej Karpathy）",
  "AI Engineerという職種の起源（swyx / Latent Space）",
  "エージェントとワークフロー（Anthropic）",
  "評価（LLM-as-a-judge・Hamel Husain）",
  "セキュリティ（Simon Willison）",
  "Model Context Protocol（MCP）",
  "RAG",
  "LLMOps・オブザーバビリティ",
  "キャリアロードマップ",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://arxiv.org/abs/2306.05685",
  "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
  "https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack",
  "https://www.latent.space/p/s3",
  "https://ikyle.me/blog/2025/andrej-karpathy-software-is-changing-again",
  "https://x.com/karpathy/status/1937902205765607626",
  "https://nextagile.ai/blogs/gen-ai/context-engineering-vs-prompt-engineering/",
  "https://ai.engineer/speakers/swyx",
  "https://www.latent.space/about",
  "https://www.anthropic.com/engineering/building-effective-agents",
  "https://hamel.dev/blog/posts/evals-faq/",
  "https://hamel.dev/blog/posts/evals-skills/",
  "https://labelyourdata.com/articles/llm-as-a-judge",
  "https://agent-wars.com/news/2026-03-14-simon-willison-agentic-engineering-tdd-prompt-injection",
  "https://tomrochette.com/agents/simon-willison/",
  "https://modelcontextprotocol.io/",
  "https://www.anthropic.com/news",
  "https://chatforest.com/guides/mcp-ecosystem-2026-state-of-the-standard/",
  "https://www.rauljitechnologies.com/blog/mcp-model-context-protocol-2026/",
  "https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol",
  "https://jobsbyculture.com/blog/rag-architecture-guide-2026",
  "https://lushbinary.com/blog/rag-retrieval-augmented-generation-production-guide/",
  "https://blog.starmorph.com/blog/rag-techniques-compared-best-practices-guide",
  "https://mlflow.org/articles/top-llm-observability-tools-in-2026-a-pro-guide/",
  "https://www.firecrawl.dev/blog/best-llm-observability-tools",
  "https://www.dataquest.io/blog/ai-engineer-roadmap/",
  "https://dataskew.io/roadmaps/ai-engineering/",
  "https://www.kdnuggets.com/how-to-become-an-ai-engineer-in-2026-a-self-study-roadmap",
] as const;

const EXPECTED_TOC_HREFS = [
  "#sec-1",
  "#sec-2",
  "#sec-3",
  "#sec-4",
  "#sec-5",
  "#sec-6",
  "#sec-7",
  "#sec-8",
  "#sec-9",
  "#sec-10",
  "#sec-11",
  "#sec-12",
  "#sec-13",
  "#sec-14",
  "#sec-15",
  "#sec-16",
  "#sec-17",
] as const;

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
    A["Software 1.0<br/>人間が明示的にコードを書く<br/>例: C++, Python"] --> B["Software 2.0<br/>ニューラルネットワークの重みが「コード」になる<br/>例: 画像認識モデルの学習"]
    B --> C["Software 3.0<br/>LLMを自然言語のプロンプトでプログラムする<br/>例: システムプロンプト, エージェント指示"]
    C --> D["AI Engineering<br/>基盤モデルを使って実際の製品を作る実践知"]`,
  `flowchart TB
    subgraph App["① アプリケーション開発層"]
        A1["プロンプト設計・コンテキスト構築"]
        A2["評価（Evaluation）"]
        A3["ユーザーインターフェース"]
    end
    subgraph Model["② モデル開発層"]
        M1["モデリング・学習・Fine-tuning"]
        M2["データセットエンジニアリング"]
        M3["推論最適化"]
    end
    subgraph Infra["③ インフラ層"]
        I1["モデルサービング"]
        I2["データ・計算リソース管理"]
        I3["モニタリング"]
    end
    App --> Model --> Infra`,
  `flowchart TB
    CW["コンテキストウィンドウ全体の設計 = コンテキストエンジニアリング"]
    CW --> P["プロンプト本文の文言<br/>（プロンプトエンジニアリングの範囲）"]
    CW --> H["会話履歴"]
    CW --> R["検索で取得したドキュメント（RAG）"]
    CW --> T["ツール定義（Function Calling / MCP）"]
    CW --> M["メモリー・過去のやり取りの要約"]
    P ~~~ H
    H ~~~ R
    R ~~~ T
    T ~~~ M`,
  `flowchart TB
    S1["① システム内の各コンポーネントを個別に評価する"] --> S2["② 評価ガイドラインを作成する"]
    S2 --> S3["③ 評価手法と評価データを定義する"]
    S3 --> S4["④ 自動評価を実行する（LLM-as-a-judge / 類似度 / 厳密評価）"]
    S4 --> S5["⑤ 実際の出力を読み、エラー分析を行う"]
    S5 --> S6["⑥ 修正を反映し、再評価する"]
    S6 -.->|継続的改善のループ| S1`,
  `flowchart TB
    Q["ユーザーの質問"] --> E["クエリを埋め込みベクトルに変換"]
    E --> RT["検索: ベクトル検索・キーワード検索・ハイブリッド検索"]
    RT --> RR["リランキングで関連度の高い文書に絞り込む"]
    RR --> CTX["取得した文書をコンテキストとして追加"]
    CTX --> LLM["LLMが回答を生成"]
    LLM --> A["引用付きで回答をユーザーへ返す"]`,
  `flowchart TB
    subgraph WF["ワークフロー: 開発者があらかじめ実行経路を決める"]
        direction TB
        W1["入力"] --> W2["LLM呼び出し 1"]
        W2 --> W3["LLM呼び出し 2"]
        W3 --> W4["出力"]
    end
    subgraph AG["エージェント: LLMが自律的に次の行動を決める"]
        direction TB
        A1["入力・目標"] --> A2["LLMが次のツールを選択"]
        A2 --> A3["ツールを実行し結果を観察"]
        A3 --> A4{"目標を達成したか"}
        A4 -- "いいえ" --> A2
        A4 -- "はい" --> A5["出力"]
    end
    WF ~~~ AG`,
  `flowchart TB
    Host["MCPホスト（AIアプリ本体）"] --> Client["MCPクライアント"]
    Client -- "標準化されたプロトコルで通信" --> Server1["MCPサーバー: 社内データベース"]
    Client --> Server2["MCPサーバー: ファイルシステム"]
    Client --> Server3["MCPサーバー: 外部API・SaaS連携"]`,
  `flowchart TB
    Q1{"プロンプト設計とコンテキスト追加だけで<br/>十分な精度が出るか"}
    Q1 -- "はい" --> R1["プロンプト/コンテキストエンジニアリングで十分"]
    Q1 -- "いいえ" --> Q2{"外部知識や最新情報の不足が原因か"}
    Q2 -- "いいえ" --> Q3{"特定の出力形式・トーン・<br/>専門ドメインの振る舞いをモデル自体に<br/>学習させたいか"}
    Q2 -- "はい" --> Q2b{"代表的な質問で検証: ナレッジベースの規模・更新頻度、入力コンテキスト上限、プロンプトキャッシュの可否、品質/コスト/レイテンシを踏まえても全文投入で足りるか"}
    Q2b -- "はい" --> R2b["コンテキストへの全文投入で十分（RAG導入は不要）"]
    Q2b -- "いいえ" --> R2["RAGを導入する"]
    Q3 -- "はい" --> R3["Fine-tuningを検討する"]
    Q3 -- "いいえ" --> R4["RAGと評価による改善サイクルを継続する"]`,
  `flowchart TB
    P1["1. プログラミング基礎（Python, Git, データ構造）"] --> P2["2. LLM APIの基本とプロンプト/コンテキストエンジニアリング"]
    P2 --> P3["3. 評価（Evaluation）設計の基礎"]
    P3 --> P4["4. RAGパイプラインの構築"]
    P4 --> P5["5. AIエージェントとMCPツール連携"]
    P5 --> P6["6. Fine-tuningと推論最適化"]
    P6 --> P7["7. LLMOps：本番監視と継続的改善"]`,
] as const;

function cleanText(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

describe("AI Engineering 入門ガイド契約テスト", () => {
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
      const headingElements = Array.from(container.querySelectorAll("h2, h3"));
      const ids = headingElements.map((el) => el.getAttribute("id"));
      expect(ids.every((id) => !!id)).toBe(true);
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

  // C. コンテンツ契約 (6件)
  describe("C. コンテンツ契約", () => {
    it("C-1: h1 テキストが原本と完全一致する", () => {
      const { container } = render(<Page />);
      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      if (!h1) throw new Error("h1 not found");
      expect(cleanText(h1)).toBe(EXPECTED_H1[0]);
    });

    it("C-2: クイックナビ（TOC リンク）が 17 件存在し href='#sec-...' 形式である", () => {
      const { container } = render(<Page />);
      const tocLinks = Array.from(container.querySelectorAll('[data-testid="sidebar-nav-link"]'));
      expect(tocLinks.length).toBe(EXPECTED_TOC_HREFS.length);
      for (const link of tocLinks) {
        const href = link.getAttribute("href");
        expect(href).toMatch(/^#sec-/);
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

    it("C-6: Mermaid 9 件が専用ラッパーに包まれ、原本のソースと順序・内容込みで完全一致する", () => {
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
    it("D-1: callout ボックスが存在し data-variant 属性を持つ（2件: info, warn）", () => {
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

    it("D-9: 原本準拠の Google Fonts（Source Serif 4 & Inter）link が存在する", () => {
      const { container } = render(<Page />);
      const fontLink = container.querySelector('link[href*="Source+Serif+4"]');
      expect(fontLink).not.toBeNull();
      expect(fontLink?.getAttribute("href")).toContain("Inter");
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

  // Q. 品質契約 (2件)
  describe("Q. 品質契約", () => {
    it("Q-2: metadata の title / description が空でなく title が h1 と整合する", () => {
      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      const titleStr = typeof metadata.title === "string" ? metadata.title : "";
      expect(titleStr).toContain("AI Engineering 入門ガイド");
    });

    it("Q-3: 見出し階層が飛ばない（h1 → h2 → h3）", () => {
      const { container } = render(<Page />);
      const headings = Array.from(container.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      let previousLevel = 0;
      for (const h of headings) {
        const level = parseInt(h.tagName.substring(1), 10);
        if (previousLevel > 0) {
          expect(level - previousLevel).toBeLessThanOrEqual(1);
        }
        previousLevel = level;
      }
    });
  });
});
