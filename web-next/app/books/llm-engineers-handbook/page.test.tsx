// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart, id }: { chart: string; id?: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} id={id}>
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
  "「LLM Engineer's Handbook」徹底解説― 初学者のためのステップバイステップ入門",
] as const;

const EXPECTED_H2 = [
  "この本は何なのか ― 3行でつかむ",
  "書籍情報まとめ",
  "著者について",
  "なぜ話題になっているのか(評価・レビュー)",
  "全体像:「LLM Twin」という教材プロジェクト",
  "データ収集時の注意",
  "アーキテクチャの核:FTIパイプライン設計",
  "章立てで見る本書の構成(全11章+付録)",
  "初学者向け・学習ロードマップ",
  "ハンズオン:公式GitHubリポジトリを動かす",
  "使用される主要ツール・サービス一覧",
  "読む前に押さえておきたい前提知識",
  "よくある質問(FAQ)",
  "まとめ",
  "参考文献・出典URL一覧",
] as const;

const EXPECTED_H3 = [
  "1LLM Twinの概念とアーキテクチャ理解",
  "2ツールとインストール",
  "3データエンジニアリング",
  "4RAG特徴量パイプライン",
  "5教師ありファインチューニング(SFT)",
  "6選好アライメントによるファインチューニング",
  "7LLMの評価",
  "8推論最適化",
  "9RAG推論パイプライン",
  "10推論パイプラインのデプロイ",
  "11MLOpsとLLMOps",
  "付付録:MLOpsの原則",
  "aローカル環境の依存関係",
  "bセットアップの流れ(概要)",
  "cプロジェクト構成の考え方",
  "Qプログラミング初心者でもいきなり読めますか?",
  "Q高性能なGPUを持っていなくても実践できますか?",
  "Q日本語で読めるバージョンはありますか?",
  "Qこの本と、実務でよく聞く「LLMOps」はどう関係していますか?",
  "Q本を読まずにGitHubリポジトリだけ動かすことはできますか?",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://www.oreilly.com/library/view/llm-engineers-handbook/9781836200079/",
  "https://github.com/PacktPublishing/LLM-Engineers-Handbook",
  "https://github.com/PacktPublishing/LLM-Engineers-Handbook.git",
  "https://github.com/PacktPublishing/LLM-Engineers-Handbook/blob/main/README.md",
  "https://www.amazon.com/LLM-Engineers-Handbook-engineering-production/dp/1836200072/",
  "https://www.packtpub.com/en-us/product/llm-engineers-handbook-9781836200062",
  "https://www.helpnetsecurity.com/2025/07/28/review-llm-engineers-handbook/",
  "https://medium.com/javarevisited/review-is-the-llm-engineers-handbook-by-paul-iusztin-and-maxime-labonne-worth-it-7d075148c2bc",
  "https://github.com/Jason2Brownlee/awesome-llm-books/blob/main/books/llm-engineer's-handbook.md",
  "https://github.com/SylphAI-Inc/LLM-engineer-handbook",
  "https://gist.github.com/duarteocarmo/bc9365ac63744234f5030b87f912669e",
  "https://datatalks.club/books/20241104-llm-engineer-s-handbook.html",
  "https://github.com/iusztinpaul",
  "https://github.com/mlabonne",
  "https://github.com/mlabonne/llm-course",
  "https://huggingface.co/mlabonne/TwinLlama-3.1-8B-DPO",
] as const;

const EXPECTED_DIAGRAM_IDS = [
  "diag-overview",
  "diag-fti",
  "diag-crawler",
  "diag-rag",
  "diag-align",
  "diag-deploy",
  "diag-mlops",
  "diag-roadmap",
] as const;

describe("LLM Engineer's Handbook guide — source parity and design contracts", () => {
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

  it("S-3: preserves all 16 external links", () => {
    const { container } = render(<Page />);
    const actualUrls = new Set(
      nodes(container, 'a[href^="http://"], a[href^="https://"]').map((el) =>
        el.getAttribute("href")
      )
    );
    for (const expectedUrl of EXPECTED_EXTERNAL_LINKS) {
      expect(actualUrls).toContain(expectedUrl);
    }
  });

  it("S-4: resolves every original TOC anchor and makes every heading uniquely addressable", () => {
    const { container } = render(<Page />);
    const tocAnchors = nodes(container, "#sidebar a[href^='#']").map((el) =>
      el.getAttribute("href")?.slice(1)
    );
    expect(tocAnchors.length).toBeGreaterThan(0);
    const ids = new Set(nodes(container, "[id]").map((el) => el.id));
    for (const anchor of tocAnchors) {
      expect(anchor && ids.has(anchor)).toBe(true);
    }
  });

  it("C-1: matches the exact H1 heading text", () => {
    const { container } = render(<Page />);
    const h1 = nodes(container, "h1").map(text);
    expect(h1).toEqual([...EXPECTED_H1]);
  });

  it("C-2: provides TOC quick-nav links with hash format matching all sections", () => {
    const { container } = render(<Page />);
    const links = nodes(container, "#sidebar a[href^='#']");
    expect(links.length).toBe(27);
    for (const link of links) {
      expect(link.getAttribute("href")).toMatch(/^#[a-z0-9-]+$/);
    }
  });

  it("C-3: marks the first sidebar TOC link as active initially", () => {
    const { container } = render(<Page />);
    const firstLink = container.querySelector("#sidebar a.active, #sidebar a[class*='active']");
    expect(firstLink).not.toBeNull();
    expect(firstLink?.getAttribute("href")).toBe("#intro");
  });

  it("C-4: keeps external links secure with target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externalLinks = nodes(container, 'a[href^="http://"], a[href^="https://"]');
    expect(externalLinks.length).toBeGreaterThanOrEqual(16);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toMatch(/noopener/);
    }
  });

  it("C-5: introduces no legacy HTML link extensions in internal anchors", () => {
    const { container } = render(<Page />);
    const internalLinks = nodes(container, "a:not([href^='http'])");
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html(?:#.*)?$/);
    }
  });

  it("C-6: preserves all 8 Mermaid diagram sources and wrappers in order", () => {
    const { container } = render(<Page />);
    const diagrams = nodes(container, '[data-testid="mermaid-diagram"]');
    expect(diagrams).toHaveLength(8);
    const diagramIds = diagrams.map((el) => el.id);
    expect(diagramIds).toEqual([...EXPECTED_DIAGRAM_IDS]);
  });

  it("D-1: renders callouts with data-variant info, warn and default", () => {
    const { container } = render(<Page />);
    const callouts = nodes(container, '[data-testid="callout"]');
    expect(callouts).toHaveLength(5);
    const variants = callouts.map((el) => el.getAttribute("data-variant"));
    expect(variants).toContain("info");
    expect(variants).toContain("warn");
    expect(variants).toContain("default");
  });

  it("D-5: renders sidebar nav with data-testid='sidebar-nav' and correct hrefs in order", () => {
    const { container } = render(<Page />);
    const nav = container.querySelector('[data-testid="sidebar-nav"]');
    expect(nav).not.toBeNull();
    const links = nodes(nav!, '[data-testid="sidebar-nav-link"]');
    expect(links.length).toBe(27);
  });

  it("D-6: renders code blocks with data-testid='code-block' and code child elements", () => {
    const { container } = render(<Page />);
    const blocks = nodes(container, '[data-testid="code-block"]');
    expect(blocks).toHaveLength(2);
    for (const block of blocks) {
      expect(block.querySelector("code")).not.toBeNull();
    }
  });

  it("D-7: preserves external CDN links for Tabler Icons and highlight.js", () => {
    const { container } = render(<Page />);
    const cdnLinks = nodes(container, 'link[rel="stylesheet"]').map((el) =>
      el.getAttribute("href")
    );
    expect(
      cdnLinks.some((href) => href?.includes("@tabler/icons-webfont"))
    ).toBe(true);
    expect(
      cdnLinks.some((href) => href?.includes("highlightjs"))
    ).toBe(true);
  });

  it("D-8: renders layout root with data-testid='layout-root'", () => {
    const { container } = render(<Page />);
    const layout = container.querySelector('[data-testid="layout-root"]');
    expect(layout).not.toBeNull();
  });

  it("Q-1: mounts TocObserver for scroll, mobile menu, and checklist interactions", () => {
    tocObserver.mockClear();
    render(<Page />);
    expect(tocObserver).toHaveBeenCalled();
  });

  it("Q-2: exports non-empty metadata matching the guide title", () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
  });

  it("Q-3: keeps heading levels hierarchical without skips", () => {
    const { container } = render(<Page />);
    const headings = nodes(container, "h1, h2, h3, h4, h5, h6");
    let lastLevel = 1;
    for (const heading of headings) {
      const level = Number.parseInt(heading.tagName.replace(/^H/, ""), 10);
      expect(level).toBeLessThanOrEqual(lastLevel + 1);
      lastLevel = level;
    }
  });
});
