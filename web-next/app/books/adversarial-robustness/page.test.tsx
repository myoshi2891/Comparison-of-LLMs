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

const EXPECTED_H1 = ["Adversarial Robustness for Machine Learning 初学者ガイド"] as const;

const EXPECTED_H2 = [
  "この記事の対象読者",
  "書籍情報",
  "書籍の全26章構成",
  "Step 0 前提知識のおさらい",
  "Step 1 Adversarial Example の発見と直感",
  "Step 2 脅威モデル Threat Model を理解する",
  "Step 3 代表的なWhite-box攻撃 FGSM PGD C&W",
  "Step 4 Black-box攻撃と転移性",
  "Step 5 物理世界での攻撃",
  "Step 6 防御1 Adversarial Training",
  "Step 7 防御2 証明可能な頑健性 Certified Robustness",
  "Step 8 壊れた防御と正しい評価方法",
  "Step 9 画像分類を超えて",
  "Step 10 LLM時代のAdversarial Robustness",
  "Step 11 実践 ツールとライブラリ",
  "Step 12 学習ロードマップ",
  "まとめ",
  "理解度チェックリスト",
  "参考文献 情報源",
] as const;

const EXPECTED_H3 = [
  "1-1 発見の経緯",
  "1-2 直感的なイメージ",
  "1-3 なぜ起きるのか",
  "3-1 FGSM Fast Gradient Sign Method",
  "3-2 PGD Projected Gradient Descent",
  "3-3 Carlini and Wagner攻撃 C&W",
  "3-4 攻撃手法の比較",
  "8-1 Obfuscated Gradients という落とし穴",
  "8-2 標準化された評価 AutoAttack と RobustBench",
  "10-1 GCG Universal and Transferable Adversarial Attacks",
  "10-2 分野を横断する標準フレームワーク",
  "10-3 何がどこまで同じで何が違うのか",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://shop.elsevier.com/books/adversarial-robustness-for-machine-learning/chen/978-0-12-824020-5",
  "https://shop.elsevier.com/books/adversarial-robustness-for-machine-learning/chen/978-0-12-824020-5",
  "https://www.sciencedirect.com/science/book/9780128240205",
  "https://arxiv.org/abs/1312.6199",
  "https://arxiv.org/abs/1412.6572",
  "https://arxiv.org/abs/1706.06083",
  "https://arxiv.org/abs/1608.04644",
  "https://arxiv.org/abs/1607.02533",
  "https://openaccess.thecvf.com/content_cvpr_2018/papers/Eykholt_Robust_Physical-World_Attacks_CVPR_2018_paper.pdf",
  "https://arxiv.org/abs/1902.02918",
  "https://arxiv.org/abs/1802.00420",
  "https://arxiv.org/abs/2010.09670",
  "https://robustbench.github.io/",
  "https://nicholas.carlini.com/writing",
  "https://nicholas.carlini.com/papers",
  "https://arxiv.org/abs/1708.06733",
  "https://arxiv.org/abs/1712.03141",
  "https://arxiv.org/abs/2307.15043",
  "https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-2e2025.pdf",
  "https://atlas.mitre.org/",
  "https://genai.owasp.org/initiatives/top-10-for-llm-and-genai/",
  "https://github.com/Trusted-AI/adversarial-robustness-toolbox",
  "https://github.com/bethgelab/foolbox",
  "https://github.com/cleverhans-lab/cleverhans",
] as const;

const EXPECTED_DIAGRAM_IDS = [
  "dg-0",
  "dg-1",
  "dg-2",
  "dg-3",
  "dg-4",
  "dg-5",
  "dg-6",
  "dg-7",
  "dg-8",
  "dg-9",
  "dg-10",
  "dg-11",
] as const;

describe("Adversarial Robustness guide — source parity and design contracts", () => {
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

  it("C-1: renders exactly 7 tables with all 66 rows preserved", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "main table");
    expect(tables).toHaveLength(7);
    const rows = nodes(container, "main table tr");
    expect(rows).toHaveLength(66);
  });

  it("C-2: preserves the book-info kv-table with 8 rows", () => {
    const { container } = render(<Page />);
    const kvTable = container.querySelector(
      "table.kvTable, table.kv-table, table[data-testid='kv-table']"
    );
    expect(kvTable).not.toBeNull();
    const rows = nodes(kvTable as Element, "tr");
    expect(rows).toHaveLength(8);
  });

  it("C-3: renders the 26-chapter table with 27 total rows (header + 26 chapters)", () => {
    const { container } = render(<Page />);
    const chapterSection = container.querySelector("#toc26");
    expect(chapterSection).not.toBeNull();
    const rows = nodes(chapterSection as Element, "table tr");
    expect(rows).toHaveLength(27);
  });

  it("C-4: renders the formula block with minimax optimization equation", () => {
    const { container } = render(<Page />);
    const formulaPre = container.querySelector(
      "[data-testid='formula-block'] pre, div.formulaBlock pre, div.formula-block pre"
    );
    expect(formulaPre).not.toBeNull();
    expect(normalize(formulaPre?.textContent ?? "")).toContain(
      "min_θ E[ max_{δ∈Δ(x)} L( f_θ(x+δ), y ) ]"
    );
  });

  it("C-5: renders the 10-item checklist with counter and checkboxes", () => {
    const { container } = render(<Page />);
    const checklist = container.querySelector("#checklistItems, [data-testid='checklist-items']");
    expect(checklist).not.toBeNull();
    const checkboxes = nodes(checklist as Element, "input[type='checkbox']");
    expect(checkboxes).toHaveLength(10);
  });

  it("C-6: renders all 12 Mermaid diagrams with expected IDs and theme", () => {
    const { container } = render(<Page />);
    const diagrams = nodes(container, "[data-testid='mermaid-diagram']");
    expect(diagrams).toHaveLength(12);
    const actualIds = diagrams.map((d) => d.getAttribute("id"));
    expect(actualIds).toEqual([...EXPECTED_DIAGRAM_IDS]);
    for (const diagram of diagrams) {
      expect(diagram.getAttribute("data-theme")).toBe("base");
    }
  });

  it("D-1: renders the plum callout with book icon and Elsevier shop link", () => {
    const { container } = render(<Page />);
    const callout = container.querySelector("[data-testid='callout-plum'], div.callout");
    expect(callout).not.toBeNull();
    expect(callout?.textContent).toContain("原書情報");
    expect(callout?.querySelector("a")?.getAttribute("href")).toBe(
      "https://shop.elsevier.com/books/adversarial-robustness-for-machine-learning/chen/978-0-12-824020-5"
    );
  });

  it("D-2: renders hero kicker, subtitle, lead, and 4 meta tags", () => {
    const { container } = render(<Page />);
    const hero = container.querySelector("header");
    expect(hero).not.toBeNull();
    expect(hero?.textContent).toContain("AI Security 初学者ガイド");
    expect(hero?.textContent).toContain("なぜAIは「だまされる」のか、そしてどう守るのか");
    expect(hero?.textContent).toContain("2026年9月14日時点の情報");
    expect(hero?.textContent).toContain("全26章 書籍を要約");
    expect(hero?.textContent).toContain("Mermaid図解 12点");
    expect(hero?.textContent).toContain("参考URL 22件");
  });

  it("D-3: renders all 22 reference cards with numbered badges", () => {
    const { container } = render(<Page />);
    const refCards = nodes(container, "[data-testid='ref-card'], div.refCard, div.ref-card");
    expect(refCards).toHaveLength(22);
    const badges = refCards.map((c) =>
      text(c.querySelector("[data-testid='ref-num'], div.refNum, div.ref-num") as Element)
    );
    expect(badges).toEqual(Array.from({ length: 22 }, (_, i) => String(i + 1)));
  });

  it("D-4: mounts TocObserver for client interactions", () => {
    render(<Page />);
    expect(tocObserver).toHaveBeenCalled();
  });

  it("D-5: renders in-hero freshness bar with dark ink text and correct dates", () => {
    const { container } = render(<Page />);
    const freshness = container.querySelector('[data-testid="page-freshness"]');
    expect(freshness).not.toBeNull();
    expect(freshness?.textContent).toContain("最終確認");
    expect(freshness?.textContent).toContain("2026-10-14");
    expect(freshness?.textContent).toContain("公開");
  });

  it("D-6: renders layout root with data-testid='layout-root' and data-page='adversarial-robustness'", () => {
    const { container } = render(<Page />);
    const layout = container.querySelector('[data-testid="layout-root"]');
    expect(layout).not.toBeNull();
    expect(layout?.getAttribute("data-page")).toBe("adversarial-robustness");
  });

  it("D-7: hides global freshness bar and offsets related-pages from 300px sidebar in css", () => {
    const fs = require("node:fs");
    const path = require("node:path");
    const moduleCss = fs.readFileSync(path.resolve(__dirname, "./page.module.css"), "utf8");
    expect(moduleCss).toContain('data-page="adversarial-robustness"');
    expect(moduleCss).toContain("display: none !important");
    expect(moduleCss).toContain('nav[aria-label="関連ページ"]');
    expect(moduleCss).toContain("margin-left: 300px");

    const globalsCss = fs.readFileSync(path.resolve(__dirname, "../../globals.css"), "utf8");
    expect(globalsCss).toContain('data-page="adversarial-robustness"');
    expect(globalsCss).toContain("margin-left: 300px !important");
  });

  it("Q-1: exports metadata with canonical URL and open graph fields", () => {
    expect(metadata.title).toBe("Adversarial Robustness for Machine Learning 初学者ガイド");
    expect(metadata.description).toContain("Pin-Yu Chen");
    expect(metadata.description).toContain("Adversarial Robustness");
    expect(metadata.alternates?.canonical).toBe("/books/adversarial-robustness");
    expect(metadata.openGraph?.title).toBe(
      "Adversarial Robustness for Machine Learning 初学者ガイド"
    );
  });

  it("Q-2: table direct children do not include loose text nodes", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "main table");
    for (const table of tables) {
      for (const child of Array.from(table.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          expect(child.textContent?.trim()).toBe("");
        }
      }
    }
  });

  it("Q-3: sidebar navigation links match all 19 section anchors plus top", () => {
    const { container } = render(<Page />);
    const navAnchors = nodes(
      container,
      "aside nav a, aside .navList a, aside [data-testid='nav-list'] a"
    ).map((a) => a.getAttribute("href"));
    const expectedAnchors = [
      "#top",
      "#audience",
      "#book-info",
      "#toc26",
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
      "#summary",
      "#checklist",
      "#references",
    ];
    expect(navAnchors).toEqual(expectedAnchors);
  });
});
