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

const EXPECTED_H1 = ["Hands-On Large Language Models完全読解ガイド"] as const;

const EXPECTED_H2 = [
  "本書について",
  "第0部：学習を始める前に",
  "第1部：言語モデルを理解する（原著 Part I）",
  "第2部：事前学習済み言語モデルを使う（原著 Part II）",
  "第3部：言語モデルの訓練とファインチューニング（原著 Part III）",
  "第4部：2026年9月時点の最新動向",
  "学習ロードマップ",
  "実践チェックリスト",
  "用語集",
  "参考文献",
] as const;

const EXPECTED_H3 = [
  "0.1 対象読者と前提知識",
  "0.2 深層学習・NLPの基礎用語のおさらい",
  "0.3 開発環境",
  "0.4 本書全体の地図",
  "1章 大規模言語モデル入門",
  "2章 トークンと埋め込み",
  "3章 大規模言語モデルの内部を覗く",
  "4章 テキスト分類",
  "5章 テキストクラスタリングとトピックモデリング",
  "6章 プロンプトエンジニアリング",
  "7章 高度なテキスト生成技術とツール",
  "8章 セマンティック検索と検索拡張生成（RAG）",
  "9章 マルチモーダル大規模言語モデル",
  "10章 テキスト埋め込みモデルの作成",
  "11章 分類のための表現モデルのファインチューニング",
  "12章 生成モデルのファインチューニング",
  "トークナイザーフリー・バイトレベルLLMの台頭（2章関連）",
  "埋め込みモデルとMTEBの現在地（2章・10章関連）",
  "RAGの高度化：Agentic RAG・Contextual Retrieval・GraphRAG（8章関連）",
  "ファインチューニング手法の標準化：QLoRA・DoRA・統合ライブラリ（12章関連）",
  "選好チューニングの多様化とGRPOの台頭（12章関連）",
  "マルチエージェントシステムへの拡張（7章・9章関連）",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/",
  "https://github.com/HandsOnLLM/Hands-On-Large-Language-Models",
  "https://newsletter.languagemodels.co/p/our-book-hands-on-large-language",
  "https://newsletter.maartengrootendorst.com/p/hands-on-large-language-models",
  "https://jalammar.github.io/illustrated-transformer/",
  "https://github.com/MaartenGr/BERTopic",
  "https://arxiv.org/abs/1908.10084",
  "https://arxiv.org/abs/1706.03762",
  "https://arxiv.org/abs/1301.3781",
  "https://arxiv.org/abs/2104.09864",
  "https://arxiv.org/abs/2106.09685",
  "https://arxiv.org/abs/2305.14314",
  "https://arxiv.org/abs/2305.18290",
  "https://arxiv.org/abs/2402.03300",
  "https://arxiv.org/abs/2103.00020",
  "https://arxiv.org/abs/2301.12597",
  "https://arxiv.org/abs/2209.11055",
  "https://arxiv.org/abs/2310.11511",
  "https://www.anthropic.com/engineering/contextual-retrieval",
  "https://arxiv.org/abs/2210.07316",
  "https://github.com/embeddings-benchmark/mteb",
  "https://arxiv.org/abs/2412.09871",
  "https://huggingface.co/docs/trl/index",
  "https://www.oreilly.com/library/view/an-illustrated-guide/9798341662681/",
] as const;

const EXPECTED_DIAGRAM_IDS = Array.from({ length: 27 }, (_, i) => `dg-${i}`);

describe("Hands-On Large Language Models guide — source parity and design contracts", () => {
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
    const actualLinks = nodes(container, "main a[href^='http']").map((a) => a.getAttribute("href"));
    expect(actualLinks).toEqual([...EXPECTED_EXTERNAL_LINKS]);
  });

  it("S-5: ensures all H2 and H3 headings have unique IDs referenced by sidebar TOC", () => {
    const { container } = render(<Page />);
    const headings = nodes(container, "main h2, main h3");
    const headingIds = headings.map((h) => h.getAttribute("id")).filter(Boolean);
    expect(headingIds).toHaveLength(headings.length);
    const uniqueIds = new Set(headingIds);
    expect(uniqueIds.size).toBe(headingIds.length);

    const tocLinks = nodes(container, "#sidebar a.nav-link, nav.sidebar a.nav-link");
    expect(tocLinks.length).toBeGreaterThanOrEqual(EXPECTED_H2.length + EXPECTED_H3.length);
    for (const link of tocLinks) {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        const targetId = decodeURIComponent(href.slice(1));
        const targetElement = container.querySelector(`[id="${targetId}"]`);
        expect(targetElement).not.toBeNull();
      }
    }
  });

  it("C-1: renders exactly 7 tables with all 64 rows preserved", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "main table");
    expect(tables).toHaveLength(7);
    const rows = nodes(container, "main table tr");
    expect(rows).toHaveLength(64);
  });

  it("C-2: preserves the book-info kv-table with 8 data rows", () => {
    const { container } = render(<Page />);
    const bookTable = container.querySelector("#本書について + .table-scroll table, #本書について ~ div table");
    expect(bookTable).not.toBeNull();
    const rows = nodes(bookTable as Element, "tbody tr");
    expect(rows).toHaveLength(8);
  });

  it("C-3: renders the 17-item checklist with progress counter and checkboxes", () => {
    const { container } = render(<Page />);
    const checklist = container.querySelector(".checklist-card, [data-testid='checklist-card']");
    expect(checklist).not.toBeNull();
    const checkboxes = nodes(checklist as Element, "input[type='checkbox']");
    expect(checkboxes).toHaveLength(17);
    const counter = checklist?.querySelector(".checklist-progress");
    expect(counter?.textContent).toContain("0 / 17 完了");
  });

  it("C-4: renders all 27 Mermaid diagrams with expected IDs and theme", () => {
    const { container } = render(<Page />);
    const diagrams = nodes(container, "[data-testid='mermaid-diagram']");
    expect(diagrams).toHaveLength(27);
    const actualIds = diagrams.map((d) => d.getAttribute("id"));
    expect(actualIds).toEqual(EXPECTED_DIAGRAM_IDS);
    for (const diagram of diagrams) {
      expect(diagram.getAttribute("data-theme")).toBe("base");
    }
  });

  it("C-5: renders all 24 reference cards with numbered badges", () => {
    const { container } = render(<Page />);
    const refCards = nodes(container, ".ref-card, [data-testid='ref-card']");
    expect(refCards).toHaveLength(24);
    const badges = refCards.map((c) => text(c.querySelector(".ref-badge, [data-testid='ref-badge']") as Element));
    expect(badges).toEqual(Array.from({ length: 24 }, (_, i) => String(i + 1)));
  });

  it("C-6: renders the glossary table with 29 terms and definitions", () => {
    const { container } = render(<Page />);
    const glossarySection = container.querySelector("#用語集 ~ div table, #用語集 + div table");
    expect(glossarySection).not.toBeNull();
    const rows = nodes(glossarySection as Element, "tbody tr");
    expect(rows).toHaveLength(29);
  });

  it("D-1: renders hero title and 5 hero pill tags", () => {
    const { container } = render(<Page />);
    const hero = container.querySelector(".hero");
    expect(hero).not.toBeNull();
    const pills = nodes(hero as Element, ".pill").map(text);
    expect(pills).toEqual([
      "3部構成",
      "全12章",
      "Mermaid 27図",
      "参考文献24件",
      "2026年9月動向つき",
    ]);
  });

  it("D-2: renders the lede blockquote", () => {
    const { container } = render(<Page />);
    const lede = container.querySelector("blockquote.lede");
    expect(lede).not.toBeNull();
    expect(lede?.textContent).toContain("本ガイドは、Jay Alammar 氏と Maarten Grootendorst 氏による");
  });

  it("D-3: renders the disclaimer paragraph", () => {
    const { container } = render(<Page />);
    const disclaimer = container.querySelector("p.disclaimer");
    expect(disclaimer).not.toBeNull();
    expect(disclaimer?.textContent).toContain("免責事項");
  });

  it("D-4: renders accessible sidebar toggle button and navigation", () => {
    const { container } = render(<Page />);
    const toggle = container.querySelector("#sidebarToggle");
    expect(toggle).not.toBeNull();
    expect(toggle?.getAttribute("aria-label")).toBe("メニューを開く");
    const sidebar = container.querySelector("#sidebar");
    expect(sidebar).not.toBeNull();
  });

  it("D-5: mounts TocObserver for client interactions", () => {
    render(<Page />);
    expect(tocObserver).toHaveBeenCalled();
  });

  it("D-6: renders layout root with data-testid='layout-root' and data-page='hands-on-large-language-models'", () => {
    const { container } = render(<Page />);
    const layout = container.querySelector('[data-testid="layout-root"]');
    expect(layout).not.toBeNull();
    expect(layout?.getAttribute("data-page")).toBe("hands-on-large-language-models");
  });

  it("D-7: verifies css modules table styling enforces left alignment", () => {
    const fs = require("node:fs");
    const path = require("node:path");
    const moduleCss = fs.readFileSync(path.resolve(__dirname, "./page.module.css"), "utf8");
    expect(moduleCss).toContain("text-align: left !important");
  });

  it("D-8: verifies heading anchor scroll-margin-top prevents clipping", () => {
    const fs = require("node:fs");
    const path = require("node:path");
    const moduleCss = fs.readFileSync(path.resolve(__dirname, "./page.module.css"), "utf8");
    expect(moduleCss).toContain("scroll-margin-top");
  });

  it("Q-1: provides non-empty metadata matching H1 and describes content", () => {
    expect(metadata.title).toBeDefined();
    expect(typeof metadata.title === "string" ? metadata.title : (metadata.title as { default: string })?.default).toContain(
      "Hands-On Large Language Models"
    );
    expect(metadata.description).toBeDefined();
    expect(metadata.description?.length).toBeGreaterThan(20);
  });

  it("Q-2: validates heading hierarchy has no skipped levels", () => {
    const { container } = render(<Page />);
    const headings = nodes(container, "main h1, main h2, main h3, main h4");
    let prevLevel = 0;
    for (const h of headings) {
      const level = Number(h.tagName.substring(1));
      if (prevLevel > 0) {
        expect(level - prevLevel).toBeLessThanOrEqual(1);
      }
      prevLevel = level;
    }
  });

  it("Q-3: enforces all external links have target='_blank' and rel='noopener noreferrer' and no internal .html links", () => {
    const { container } = render(<Page />);
    const externalLinks = nodes(container, "a[href^='http']");
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }

    const allLinks = nodes(container, "a[href]");
    for (const link of allLinks) {
      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("http")) {
        expect(href).not.toContain(".html");
      }
    }
  });
});
