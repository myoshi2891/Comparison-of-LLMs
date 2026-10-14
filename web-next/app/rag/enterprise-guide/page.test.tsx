// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart, id, theme }: { chart: string; id?: string; theme?: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} data-theme={theme} id={id}>
      {chart}
    </div>
  ),
}));

const tocObserver = vi.hoisted(() => vi.fn(() => null));
vi.mock("./TocObserver", () => ({ default: tocObserver }));

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));

const EXPECTED_H1 = [
  "エンタープライズRAG完全ガイド：初学者のためのステップバイステップ解説",
] as const;

const EXPECTED_H2 = [
  "Part 1RAGの基礎を理解する",
  "Part 2エンタープライズRAGを支える主要技術",
  "Part 3エンタープライズ特有の要件",
  "Part 4まとめ",
] as const;

const EXPECTED_H3 = [
  "1なぜ企業にRAGが必要なのか",
  "2RAGを支える2つのパイプライン",
  "3ドキュメントの前処理とチャンキング戦略",
  "4Embeddingとベクトルデータベースの選定",
  "5検索精度を高める：ハイブリッド検索とコンテキスト検索",
  "6リランキングでノイズを除去する",
  "7GraphRAG：構造化された関係性を活用する",
  "8エージェント型RAG（Agentic RAG）",
  "9セキュリティとアクセス制御",
  "10評価とモニタリング",
  "11本番運用：スケーリングと継続的改善",
  "エンタープライズRAG 全体アーキテクチャ",
  "よくある落とし穴とベストプラクティス",
  "さらに学ぶために",
  "参考ソース一覧",
] as const;

const EXPECTED_H4 = [
  "RAGの基本的な流れ（Naive RAG）",
  "インデックスパイプライン",
  "クエリパイプライン（基本形）",
  "Embeddingモデルの選び方",
  "ベクトルデータベースの選定基準",
  "ハイブリッド検索（Embedding + BM25）",
  "Anthropicの「コンテキスト検索（Contextual Retrieval）」",
  "RAGAS：代表的な評価フレームワーク",
  "7つの代表的な失敗パターン",
  "観測性（Observability）とコスト管理",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
  "https://www.manning.com/books/enterprise-rag",
  "https://www.manning.com/books/enterprise-rag",
  "https://www.manning.com/books/enterprise-rag",
  "https://www.anthropic.com/engineering/contextual-retrieval",
  "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
  "https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/",
  "https://www.pinecone.io/learn/retrieval-augmented-generation/",
  "https://www.pinecone.io/learn/chunking-strategies/",
  "https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html",
  "https://arxiv.org/abs/2401.05856",
  "https://docs.ragas.io/en/v0.2.1/concepts/metrics/available_metrics/context_precision/",
  "https://www.langchain.com/blog/nvidia-enterprise",
  "https://www.linkedin.com/posts/jerry-liu-64390071_llamaindex-webinar-make-rag-production-ready-activity-7098827023791398912-v9x8",
  "https://aws.amazon.com/blogs/machine-learning/build-powerful-rag-pipelines-with-llamaindex-and-amazon-bedrock/",
  "https://www.csoonline.com/article/4163888/securing-rag-pipelines-in-enterprise-saas.html",
  "https://www.lastingdynamics.com/blog/enterprise-rag-architecture-guide/",
  "https://atlan.com/know/what-is-graphrag/",
] as const;

const EXPECTED_DIAGRAM_IDS = [
  "dg-0",
  "dg-1",
  "dg-2",
  "dg-3",
  "dg-4",
  "dg-5",
] as const;

describe("Enterprise RAG guide — source parity and design contracts", () => {
  it("S-1: preserves every H2 heading in original order", () => {
    const { container } = render(<Page />);
    const actualH2 = nodes(container, "main h2").map(text);
    expect(actualH2).toEqual([...EXPECTED_H2]);
  });

  it("S-2: preserves every H3 heading in original order", () => {
    const { container } = render(<Page />);
    const actualH3 = nodes(container, "main h3").map(text);
    expect(actualH3).toEqual([...EXPECTED_H3]);
  });

  it("S-3: preserves H1 title text exactly", () => {
    const { container } = render(<Page />);
    const actualH1 = nodes(container, "h1").map(text);
    expect(actualH1).toEqual([...EXPECTED_H1]);
  });

  it("S-4: preserves all external links with exact URLs in original order", () => {
    const { container } = render(<Page />);
    const actualLinks = nodes(container, "main a[href^='http']").map((a) =>
      a.getAttribute("href"),
    );
    expect(actualLinks).toEqual([...EXPECTED_EXTERNAL_LINKS]);
  });

  it("C-1: renders exactly 11 tables with all 67 rows preserved", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "main table");
    expect(tables.length).toBe(11);
    const rows = nodes(container, "main table tr");
    expect(rows.length).toBe(67);
  });

  it("C-2: preserves all 4 code blocks with code-lang headers and span tokens", () => {
    const { container } = render(<Page />);
    const codeCards = nodes(container, "main .code-card");
    expect(codeCards.length).toBe(4);
    const langs = nodes(container, "main .code-lang").map(text);
    expect(langs).toEqual(["Plain text", "Python", "Python", "Python"]);
  });

  it("C-3: renders all 6 Mermaid diagrams with expected IDs and theme", () => {
    const { container } = render(<Page />);
    const diagrams = nodes(container, "[data-testid='mermaid-diagram']");
    expect(diagrams.length).toBe(6);
    const actualIds = diagrams.map((d) => d.getAttribute("id"));
    expect(actualIds).toEqual([...EXPECTED_DIAGRAM_IDS]);
    for (const diagram of diagrams) {
      expect(diagram.getAttribute("data-theme")).toBe("base");
    }
  });

  it("C-4: renders all 15 reference source cards with links and domains", () => {
    const { container } = render(<Page />);
    const sourceCards = nodes(container, ".source-list .source-card");
    expect(sourceCards.length).toBe(15);
    for (const card of sourceCards) {
      expect(card.getAttribute("target")).toBe("_blank");
      expect(card.getAttribute("rel")).toBe("noopener noreferrer");
      expect(card.querySelector(".source-card-domain")).not.toBeNull();
    }
  });

  it("C-5: preserves intro-panel blockquote with target audience, prerequisites, and cutoff date", () => {
    const { container } = render(<Page />);
    const intro = container.querySelector(".intro-panel");
    expect(intro).not.toBeNull();
    expect(intro?.id).toBe("intro");
    const content = text(intro as Element);
    expect(content).toContain("対象読者");
    expect(content).toContain("前提知識");
    expect(content).toContain("情報基準日：2026年9月10日時点");
  });

  it("C-6: preserves all H4 subheadings in original order", () => {
    const { container } = render(<Page />);
    const actualH4 = nodes(container, "main h4").map(text);
    expect(actualH4).toEqual([...EXPECTED_H4]);
  });

  it("D-1: renders layout root with data-testid='layout-root' and data-page='enterprise-rag-guide'", () => {
    const { container } = render(<Page />);
    const root = container.querySelector("[data-testid='layout-root']");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("data-page")).toBe("enterprise-rag-guide");
  });

  it("D-2: mounts TocObserver for client interactions", () => {
    render(<Page />);
    expect(tocObserver).toHaveBeenCalled();
  });

  it("D-3: renders part-badge and step-badge elements for hierarchy badges", () => {
    const { container } = render(<Page />);
    const partBadges = nodes(container, ".part-badge").map(text);
    expect(partBadges).toEqual(["Part 1", "Part 2", "Part 3", "Part 4"]);
    const stepBadges = nodes(container, ".step-badge").map(text);
    expect(stepBadges).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });

  it("D-4: renders mobile top-bar and back-to-top button", () => {
    const { container } = render(<Page />);
    const mobileBar = container.querySelector(".mobile-bar");
    expect(mobileBar).not.toBeNull();
    const topBtn = container.querySelector("#topBtn");
    expect(topBtn).not.toBeNull();
  });

  it("D-5: renders article-footer with last-updated notice", () => {
    const { container } = render(<Page />);
    const footer = container.querySelector(".article-footer");
    expect(footer).not.toBeNull();
    expect(text(footer as Element)).toContain("2026年9月10日");
  });

  it("D-6: table cells are styled within table-scroll wrappers", () => {
    const { container } = render(<Page />);
    const tableWraps = nodes(container, ".table-scroll");
    expect(tableWraps.length).toBe(11);
  });

  it("Q-1: exports metadata with canonical URL and open graph fields", () => {
    expect(metadata.title).toBe(
      "エンタープライズRAG完全ガイド：初学者のためのステップバイステップ解説",
    );
    expect(metadata.description).toContain(
      "エンタープライズRAG(Retrieval-Augmented Generation)を初学者向けにステップバイステップで解説",
    );
    expect(metadata.alternates?.canonical).toBe("/rag/enterprise-guide");
  });

  it("Q-2: table direct children do not include loose text nodes", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "main table");
    for (const table of tables) {
      for (const child of Array.from(table.childNodes)) {
        if (child.nodeType === 3) {
          expect((child.textContent ?? "").trim()).toBe("");
        }
      }
    }
  });

  it("Q-3: sidebar navigation links match section anchors and provide aria-label", () => {
    const { container } = render(<Page />);
    const sidebar = container.querySelector("nav.sidebar");
    expect(sidebar?.getAttribute("aria-label")).toBe("目次");
    const links = nodes(container, "nav.sidebar a.toc-link");
    expect(links.length).toBeGreaterThan(15);
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("#intro");
    expect(hrefs).toContain("#part-1-rag");
    expect(hrefs).toContain("#step-1-rag");
    expect(hrefs).toContain("#step-11");
    expect(hrefs).toContain("#_6");
  });
});
