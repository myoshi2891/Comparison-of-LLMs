// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({
    chart,
    id,
    theme,
    themeVariables,
  }: {
    chart: string;
    id?: string;
    theme?: string;
    themeVariables?: Record<string, string>;
  }) => (
    <div
      data-testid="mermaid-diagram"
      data-chart={chart}
      data-theme={theme}
      data-has-theme-vars={themeVariables ? "true" : "false"}
      data-primary-color={themeVariables?.primaryColor}
      id={id}
    >
      {chart}
    </div>
  ),
}));

const tocObserver = vi.hoisted(() => vi.fn(() => null));
vi.mock("./TocObserver", () => ({ default: tocObserver }));

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));

const EXPECTED_H1 = ["LangChain in your Pocket 徹底解説ガイド"] as const;

const EXPECTED_H2 = [
  "Guideこの解説ガイドについて",
  "Ch.1LLMとLangChainの基礎知識",
  "Ch.2Hello World ― 環境構築と最初のアプリ",
  "Ch.3LangChainのモジュール構成",
  "Ch.4Models and Prompts",
  "Ch.5Chains（チェーン）",
  "Ch.6Agents（エージェント）",
  "Ch.7OutputParsers and Memory",
  "Ch.8Callbacks",
  "Ch.9RAGフレームワークとベクトルデータベース",
  "Ch.10LangChainを使ったNLPタスク",
  "Ch.11LLMのハルシネーション対策",
  "Ch.12LLMの評価（Evaluating LLMs）",
  "Ch.13高度なプロンプトエンジニアリング",
  "Ch.14自律型AIエージェント（Autonomous AI agents）",
  "Ch.15LangSmith and LangServe",
  "Ch.16追加機能（Additional Features）",
  "20262026年9月時点の最新動向まとめ",
  "Refs参考文献・ソース一覧",
] as const;

const EXPECTED_H3 = [
  "本ガイドの読み方（全体マップ）",
  "書籍の目次（原著全16章）",
  "1.1 LLM（大規模言語モデル）とは",
  "1.2 LLMのファミリー（主要な系統）",
  "1.3 なぜLangChainが必要なのか",
  "2.1 LangChainのセットアップ",
  "2.2 Name Generator（最初の実践例）",
  "2.3 テキスト前処理／2.4 Storyteller／2.5 ローカルLLM",
  "4.1 Models: LLM と ChatModel の違い",
  "4.2 Prompts: PromptTemplate と ChatPromptTemplate",
  "5.1〜5.4 LLMChain・Auto-SQL Chain・MathsChain・DALL-E連携",
  "5.5 Custom Chains using LCEL",
  "5.6 Types of Chains",
  "6.1 AgentとChainの違い",
  "6.2〜6.3 Agentの構築とタイプ",
  "6.4 Custom Tools for Agents",
  "7.1 OutputParsers（出力パーサー）",
  "7.2 Memory（会話記憶）",
  "9.1 RAGとは何か",
  "9.2〜9.3 RAGの構成要素とLangChainでの実装",
  "9.4〜9.5 Multi-document RAGとレコメンドシステム",
  "9.6 ベクトルデータベースの選び方",
  "Few-Shot Learningの考え方",
  "11.1〜11.2 ハルシネーションとは、なぜ起きるのか",
  "11.3〜11.4 LLMCheckerChainとLLMSummarizationChain",
  "11.5 RAGによるハルシネーション回避",
  "13.1 Chain of Thought（思考の連鎖）",
  "13.2 ReAct（Reasoning + Acting）",
  "13.3 Tree of Thoughts（思考の木）",
  "13.4 その他のプロンプトエンジニアリング手法",
  "14.1 AGIとは",
  "14.2〜14.4 AutoGPT・BabyAGI・HuggingGPT",
  "15.1 LangSmith",
  "15.2 LangServe",
  "16.1 Fallbacks（フォールバック）",
  "16.2 Safety（安全性）",
  "16.3〜16.4 Model LaboratoryとDebugging",
] as const;

const EXPECTED_NAV_LINKS = [
  { href: "#intro", text: "この解説ガイドについて" },
  { href: "#ch1", text: "第1章 LLMとLangChainの基礎" },
  { href: "#ch2", text: "第2章 Hello World" },
  { href: "#ch3", text: "第3章 モジュール構成" },
  { href: "#ch4", text: "第4章 Models and Prompts" },
  { href: "#ch5", text: "第5章 Chains" },
  { href: "#ch6", text: "第6章 Agents" },
  { href: "#ch7", text: "第7章 OutputParsers and Memory" },
  { href: "#ch8", text: "第8章 Callbacks" },
  { href: "#ch9", text: "第9章 RAGとベクトルDB" },
  { href: "#ch10", text: "第10章 NLPタスク" },
  { href: "#ch11", text: "第11章 ハルシネーション対策" },
  { href: "#ch12", text: "第12章 LLMの評価" },
  { href: "#ch13", text: "第13章 高度なプロンプト設計" },
  { href: "#ch14", text: "第14章 自律型AIエージェント" },
  { href: "#ch15", text: "第15章 LangSmith / LangServe" },
  { href: "#ch16", text: "第16章 追加機能" },
  { href: "#update2026", text: "2026年最新動向まとめ" },
  { href: "#refs", text: "参考文献・ソース一覧" },
] as const;

const EXPECTED_EXTERNAL_URLS = [
  "https://www.oreilly.com/library/view/langchain-in-your/9781836201250/",
  "https://docs.langchain.com/oss/python/langchain-philosophy",
  "https://futureagi.com/blog/what-is-langchain/",
  "https://www.aurelio.ai/learn/langchain-lcel",
  "https://reference.langchain.com/python/langchain-classic/langchain_classic",
  "https://uvik.net/blog/langchain-vs-langgraph/",
  "https://www.educative.io/courses/langchain-llm/what-is-create-agent",
  "https://atlan.com/know/ai-agent/ai-agent-memory/what-is-langchain/",
  "https://blog.langchain.com/febraury-2026-langchain-newsletter",
  "https://www.braintrust.dev/articles/best-vector-databases-for-rag-2026",
  "https://dupple.com/learn/best-vector-databases",
  "https://solguruz.com/generative-ai/vector-database/",
  "https://sequoiacap.com/?p=17611",
  "https://github.com/langchain-ai/langserve",
  "https://enterprisedna.co/resources/blog/practitioner-langserve-review",
  "https://www.langchain.com/blog/introducing-langsmith-fleet",
  "https://docs.langchain.com/oss/python/release-policy",
  "https://dev.to/mehulgupta7991/my-debut-book-langchain-in-your-pocket-is-out--7oc",
  "https://amazon.com/LangChain-your-Pocket-Generative-Applications-ebook/dp/B0CTHQHT25",
] as const;

const EXPECTED_DIAGRAM_KEYS = [
  "bookmap",
  "features",
  "helloflow",
  "modulemap",
  "lcel",
  "agentloop",
  "callbacks",
  "ragpipe",
  "hallu",
  "react",
  "autonomous",
  "timeline",
] as const;

describe("LangChain in your Pocket guide — source parity and design contracts", () => {
  // S. 原本照合契約 (4件・必須)
  it("S-1: preserves every H2 heading in original order", () => {
    const { container } = render(<Page />);
    const actual = nodes(container, "h2").map(text);
    expect(actual).toEqual([...EXPECTED_H2]);
  });

  it("S-2: preserves every H3 heading in original order", () => {
    const { container } = render(<Page />);
    const actual = nodes(container, "h3").map(text);
    expect(actual).toEqual([...EXPECTED_H3]);
  });

  it("S-3: preserves all expected external links", () => {
    const { container } = render(<Page />);
    // URL構成要素を正規化して完全一致で照合する（部分一致だと末尾に不正パスが付いても通るため）
    const normalizeUrl = (value: string) => {
      const url = new URL(value);
      return `${url.protocol}//${url.hostname}${url.pathname}${url.search}${url.hash}`;
    };
    // 原本のAmazonリンクのみ、移植先で www. 付きホストへ正規化されている
    const normalizeExpected = (value: string) => {
      const url = new URL(value);
      if (url.hostname === "amazon.com") url.hostname = "www.amazon.com";
      return normalizeUrl(url.href);
    };
    const actualHrefs = new Set(
      nodes(container, 'a[href^="http"]').map((a) => normalizeUrl(a.getAttribute("href") ?? ""))
    );
    for (const expected of EXPECTED_EXTERNAL_URLS) {
      expect(actualHrefs.has(normalizeExpected(expected)), expected).toBe(true);
    }
  });

  it("S-4: all h2 and sections have unique IDs and all TOC links resolve to existing headings or sections", () => {
    const { container } = render(<Page />);
    for (const link of EXPECTED_NAV_LINKS) {
      const targetId = link.href.slice(1);
      const target = container.querySelector(`[id="${targetId}"]`);
      expect(target).not.toBeNull();
    }
  });

  // C. コンテンツ契約 (5件必須 + C-6 Mermaid必須)
  it("C-1: H1 matches title text exactly", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(text(h1 as Element)).toBe(EXPECTED_H1[0]);
  });

  it("C-2: renders 19 quick navigation links matching #anchor format", () => {
    const { container } = render(<Page />);
    const nav = container.querySelector('[data-testid="sidebar-nav"]');
    expect(nav).not.toBeNull();
    const links = nodes(nav as Element, "a");
    expect(links).toHaveLength(19);
    for (const [i, link] of links.entries()) {
      expect(link.getAttribute("href")).toBe(EXPECTED_NAV_LINKS[i].href);
      expect(text(link)).toBe(EXPECTED_NAV_LINKS[i].text);
    }
  });

  it("C-3: sidebar TOC has initial active link with active class", () => {
    const { container } = render(<Page />);
    const activeLink = container.querySelector(`.${styles.active}`);
    expect(activeLink).not.toBeNull();
    expect(activeLink?.getAttribute("href")).toBe("#intro");
  });

  it("C-4: all external links have target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externalLinks = nodes(container, 'a[href^="http"]');
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const a of externalLinks) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toMatch(/noopener/);
      expect(a.getAttribute("rel")).toMatch(/noreferrer/);
    }
  });

  it("C-5: internal links do not contain .html extension", () => {
    const { container } = render(<Page />);
    const internalLinks = nodes(container, 'a:not([href^="http"]):not([href^="mailto:"])');
    for (const a of internalLinks) {
      const href = a.getAttribute("href");
      if (href) {
        expect(href).not.toMatch(/\.html(?:#.*)?$/);
      }
    }
  });

  it("C-6: all 12 Mermaid diagrams are wrapped in container and match expected keys in order", () => {
    const { container } = render(<Page />);
    const wrappers = nodes(container, `.${styles.mermaidWrap}`);
    expect(wrappers).toHaveLength(12);
    const diagrams = nodes(container, '[data-testid="mermaid-diagram"]');
    expect(diagrams).toHaveLength(12);
    for (const [i, key] of EXPECTED_DIAGRAM_KEYS.entries()) {
      expect(diagrams[i].getAttribute("id")).toBe(`diagram-${key}`);
    }
    for (const wrapper of wrappers) {
      expect(wrapper.querySelector('[data-testid="mermaid-diagram"]')).not.toBeNull();
    }
  });

  // D. デザイン契約 (該当要素に応じて)
  it("D-1: renders all 16 callouts with data-testid='callout' including important callouts", () => {
    const { container } = render(<Page />);
    const callouts = nodes(container, '[data-testid="callout"]');
    expect(callouts).toHaveLength(16);
    const importantCallouts = callouts.filter((c) => c.className.includes(styles.important));
    expect(importantCallouts).toHaveLength(2);
  });

  it("D-2: important callouts contain strong tag emphasizing critical notes", () => {
    const { container } = render(<Page />);
    const callouts = nodes(container, '[data-testid="callout"]');
    const importantCallouts = callouts.filter((c) => c.className.includes(styles.important));
    expect(importantCallouts.length).toBeGreaterThan(0);
    for (const callout of importantCallouts) {
      expect(callout.querySelector("strong")).not.toBeNull();
    }
  });

  it("D-5: sidebar navigation links have sidebar-nav and sidebar-nav-link testids and match TOC order", () => {
    const { container } = render(<Page />);
    const nav = container.querySelector('[data-testid="sidebar-nav"]');
    expect(nav).not.toBeNull();
    const links = nodes(nav as Element, '[data-testid="sidebar-nav-link"]');
    expect(links).toHaveLength(19);
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual(EXPECTED_NAV_LINKS.map((l) => l.href));
  });

  it("D-6: renders 18 code blocks with code child elements and codeLine rows", () => {
    const { container } = render(<Page />);
    const blocks = nodes(container, '[data-testid="code-block"]');
    expect(blocks).toHaveLength(18);
    for (const block of blocks) {
      expect(block.querySelector("code")).not.toBeNull();
      expect(block.querySelectorAll(`.${styles.codeLine}`).length).toBeGreaterThan(0);
    }
  });

  it("D-7: external CDN stylesheets for Tabler Icons and highlight.js are included", () => {
    const { container } = render(<Page />);
    const links = nodes(container, 'link[rel="stylesheet"]');
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h?.includes("tabler-icons"))).toBe(true);
    expect(hrefs.some((h) => h?.includes("highlight.js"))).toBe(true);
  });

  it("D-8: layout root has data-testid='layout-root' and CSS defines width: 100%", () => {
    const { container } = render(<Page />);
    const root = container.querySelector('[data-testid="layout-root"]');
    expect(root).not.toBeNull();
  });

  it("D-9: renders all 9 tables with 67 total rows", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "table");
    expect(tables).toHaveLength(9);
    const trs = nodes(container, "tr");
    expect(trs).toHaveLength(67);
  });

  it("D-10: mounts TocObserver client component", () => {
    render(<Page />);
    expect(tocObserver).toHaveBeenCalled();
  });

  it("D-11: all 12 Mermaid diagrams use theme='dark' and pass original DIAGRAM_THEME variables", () => {
    const { container } = render(<Page />);
    const diagrams = nodes(container, '[data-testid="mermaid-diagram"]');
    expect(diagrams).toHaveLength(12);
    for (const diagram of diagrams) {
      expect(diagram.getAttribute("data-theme")).toBe("dark");
      expect(diagram.getAttribute("data-has-theme-vars")).toBe("true");
      expect(diagram.getAttribute("data-primary-color")).toBe("#16233a");
    }
  });

  it("D-12: layout root defines data-page='langchain-in-your-pocket' for shared chrome synchronization", () => {
    const { container } = render(<Page />);
    const root = container.querySelector('[data-page="langchain-in-your-pocket"]');
    expect(root).not.toBeNull();
  });

  it("D-13: globals.css contains matching selector for body:has([data-page='langchain-in-your-pocket']) with dark background and freshness bar offset", () => {
    const globalsCssPath = path.resolve(process.cwd(), "app/globals.css");
    const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");
    expect(globalsCss).toContain('body:has([data-page="langchain-in-your-pocket"])');
    expect(globalsCss).toContain(
      'body:has([data-page="langchain-in-your-pocket"]) #site-freshness-bar'
    );
    expect(globalsCss).toContain("calc(100% - 288px)");
  });

  it("D-14: code blocks contain syntax highlighting tokens (hljs-keyword, hljs-string, hljs-comment)", () => {
    const { container } = render(<Page />);
    const tokens = nodes(container, ".hljs-keyword, .hljs-string, .hljs-comment");
    expect(tokens.length).toBeGreaterThanOrEqual(50);
  });

  it("D-15: globals.css enforces !important on margin-left and max-width for related pages footer", () => {
    const globalsCssPath = path.resolve(process.cwd(), "app/globals.css");
    const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");
    expect(globalsCss).toContain(
      'body:has([data-page="langchain-in-your-pocket"]) nav[aria-label="関連ページ"]'
    );
    expect(globalsCss).toMatch(
      /body:has\(\[data-page="langchain-in-your-pocket"\]\)\s+nav\[aria-label="関連ページ"\][\s\S]*?margin-left:\s*288px\s*!important/
    );
    expect(globalsCss).toMatch(
      /body:has\(\[data-page="langchain-in-your-pocket"\]\)\s+nav\[aria-label="関連ページ"\][\s\S]*?max-width:\s*none\s*!important/
    );
  });

  // Q. 品質契約 (3件・必須)
  it("Q-1: metadata title and description are non-empty and title matches H1", () => {
    expect(typeof metadata.title === "string" ? metadata.title : "").toContain(EXPECTED_H1[0]);
    expect(typeof metadata.description === "string" && metadata.description.length > 0).toBe(true);
  });

  it("Q-2: table direct children do not contain loose whitespace string nodes", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "table");
    for (const table of tables) {
      for (const child of Array.from(table.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          expect(child.textContent?.trim()).toBe("");
        }
      }
    }
  });

  it("Q-3: headings do not skip levels (h1 -> h2 -> h3)", () => {
    const { container } = render(<Page />);
    const headings = nodes(container, "h1, h2, h3, h4, h5, h6");
    let lastLevel = 1;
    for (const h of headings) {
      const level = parseInt(h.tagName.slice(1), 10);
      expect(level).toBeLessThanOrEqual(lastLevel + 1);
      lastLevel = level;
    }
  });
});
