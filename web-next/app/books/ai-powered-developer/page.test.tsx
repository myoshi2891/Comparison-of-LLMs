// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { parse } from "postcss";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
// Fixed expectations extracted from the original HTML before implementation.
// This is a source inventory, not a rendering snapshot; never regenerate from JSX.
import source from "./source-contract.json";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({
    chart,
    id,
    theme,
    themeVariables,
    flowchartHtmlLabels,
  }: {
    chart: string;
    id: string;
    theme: string;
    themeVariables: Record<string, string>;
    flowchartHtmlLabels?: boolean;
  }) => (
    <pre
      data-testid="mermaid"
      id={id}
      data-theme={theme}
      data-theme-variables={JSON.stringify(themeVariables)}
      data-html-labels={String(flowchartHtmlLabels)}
    >
      {chart}
    </pre>
  ),
}));
vi.mock("./TocObserver", () => ({ default: () => null }));
const css = readFileSync("app/books/ai-powered-developer/page.module.css", "utf8");
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
// Biome changes CSS string delimiters; their rendered values remain identical.
const normalizeCss = (s: string) => normalize(s).replace(/'/g, '"');
const text = (e: Element) => normalize(e.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
const main = () => render(<Page />).container.querySelector(`.${styles.main}`) as HTMLElement;
const cssRules: { selector: string; media: string | null; declarations: Record<string, string> }[] =
  [];
parse(css).walkRules((rule) => {
  cssRules.push({
    selector: normalizeCss(rule.selector).replace(/\s*,\s*/g, ", "),
    media: rule.parent?.type === "atrule" ? rule.parent.params : null,
    declarations: Object.fromEntries(
      rule.nodes.filter((n) => n.type === "decl").map((n) => [n.prop, n.value])
    ),
  });
});

describe("/books/ai-powered-developer — strict source parity", () => {
  it("Mermaid uses SVG labels so the original hub/done/box text colours remain effective", () => {
    const diagrams = nodes(main(), '[data-testid="mermaid"]');
    expect(diagrams.map((e) => e.getAttribute("data-html-labels"))).toEqual(
      source.charts.map(() => "false")
    );
    for (const name of ["hub", "done", "box"]) {
      const colourRule = cssRules.find((r) => r.selector === `.mermaidWrap :global(.${name} text)`);
      expect(colourRule?.declarations).toEqual({ fill: `var(--${name}-text)` });
    }
  });
  it("fixed sidebar and mobile toolbar clear the dynamically sized disclaimer", () => {
    expect(cssRules).toContainEqual({
      selector: ".sidebar",
      media: null,
      declarations: {
        top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
        height: "calc(100dvh - var(--header-height, 60px) - var(--ch-disclaimer-height, 0px))",
      },
    });
    expect(cssRules).toContainEqual({
      selector: ".mobileBar",
      media: "(max-width: 980px)",
      declarations: {
        top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
      },
    });
  });
  it("S-1: every h2 matches the source in order", () => {
    expect(nodes(main(), "h2").map(text)).toEqual(source.h2);
  });
  it("S-2: every h3 matches the source in order", () => {
    expect(nodes(main(), "h3").map(text)).toEqual(source.h3);
  });
  it("S-3: every link preserves its full URL, text, order and multiplicity", () => {
    expect(
      nodes(main(), "a").map((e) => ({ href: e.getAttribute("href"), text: text(e) }))
    ).toEqual(source.links);
  });
  it("S-4: heading IDs are unique and every TOC and citation anchor resolves", () => {
    const { container } = render(<Page />);
    const ids = nodes(container, "[id]").map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const h of nodes(container, "h2,h3")) expect(h.id).toMatch(/\S+/);
    for (const a of nodes(container, 'a[href^="#"]')) {
      const target = container.querySelector(a.getAttribute("href") ?? "");
      expect(target, a.getAttribute("href") ?? "").not.toBeNull();
    }
    for (const a of nodes(container, '[data-testid="sidebar-nav-link"]')) {
      const target = container.querySelector(a.getAttribute("href") ?? "") as Element;
      expect(target.querySelector("h1,h2,h3") ?? target.closest("h1,h2,h3")).not.toBeNull();
    }
  });
  it("C-1: h1 preserves the full original wording", () => {
    expect(nodes(main(), "h1").map(text)).toEqual(source.h1);
  });
  it("C-2/D-5: all sidebar links preserve their text, order and anchors", () => {
    const { container } = render(<Page />);
    const nav = container.querySelector('[data-testid="sidebar-nav"]') as Element;
    expect(
      nodes(nav, '[data-testid="sidebar-nav-link"]').map((e) => ({
        href: e.getAttribute("href"),
        text: text(e),
      }))
    ).toEqual(source.toc);
  });
  it("C-3: only the first TOC link is initially active", () => {
    const { container } = render(<Page />);
    expect(
      nodes(container, `[data-testid="sidebar-nav-link"].${styles.active}`).map((e) =>
        e.getAttribute("href")
      )
    ).toEqual([source.toc[0].href]);
  });
  it("C-4: all external links have both safety attributes", () => {
    expect(
      nodes(main(), 'a[href^="http"]').map((e) => [e.getAttribute("target"), e.getAttribute("rel")])
    ).toEqual(
      source.links
        .filter((e) => e.href.startsWith("http"))
        .map(() => ["_blank", "noopener noreferrer"])
    );
  });
  it("C-5: internal document links use clean routes", () => {
    expect(
      nodes(main(), 'a:not([href^="http"])')
        .map((e) => e.getAttribute("href"))
        .filter((h) => h?.includes(".html"))
    ).toEqual([]);
  });
  it("C-6: all diagrams preserve their exact sources, IDs, wrappers and light theme", () => {
    const root = main();
    const diagrams = nodes(root, '[data-testid="mermaid"]');
    expect(diagrams.map((e) => ({ id: e.id, chart: (e.textContent ?? "").trim() }))).toEqual(
      source.charts
    );
    expect(nodes(root, `.${styles.mermaidWrap} > [data-testid="mermaid"]`)).toEqual(diagrams);
    for (const e of diagrams) {
      expect(e.getAttribute("data-theme")).toBe("base");
      expect(JSON.parse(e.getAttribute("data-theme-variables") ?? "{}")).toEqual({
        primaryColor: "#fffefb",
        primaryBorderColor: "#4b4394",
        primaryTextColor: "#2a241c",
        lineColor: "#4b4394",
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Hiragino Sans,Meiryo,sans-serif",
        fontSize: "16px",
      });
      expect((e.textContent ?? "").split("\n")[0]).toMatch(/^flowchart /);
      expect(e.textContent).not.toContain("block-beta");
    }
    expect(nodes(root, `.${styles.diagramCaption}`).map(text)).toEqual(source.captions);
  });
  it("all paragraphs preserve their full wording and order", () => {
    expect(nodes(main(), "p").map(text)).toEqual(source.paragraphs);
  });
  it("every list preserves its type and all items in order, including the checklist", () => {
    expect(
      nodes(main(), "ul,ol").map((e) => ({
        tag: e.tagName.toLowerCase(),
        items: Array.from(e.children)
          .filter((c) => c.tagName === "LI")
          .map(text),
      }))
    ).toEqual(source.lists);
  });
  it("all tables preserve every row, cell, header type and order", () => {
    expect(
      nodes(main(), "table").map((e) =>
        nodes(e, "tr").map((r) =>
          Array.from(r.children).map((c) => ({ tag: c.tagName.toLowerCase(), text: text(c) }))
        )
      )
    ).toEqual(source.tables);
  });
  it("all glossary terms and definitions preserve their order", () => {
    expect(nodes(main(), "dt,dd").map(text)).toEqual(source.glossary);
  });
  it("D-1: all callouts retain their variant, complete text and title labels", () => {
    const callouts = nodes(main(), '[data-testid="callout"]');
    expect(
      callouts.map((e) => ({ variant: e.getAttribute("data-variant"), text: text(e) }))
    ).toEqual(source.callouts);
    for (const e of callouts)
      expect(e.querySelector('[data-testid="callout-label"]')).not.toBeNull();
  });
  it("D-3: all step badges preserve their wording and order", () => {
    expect(nodes(main(), '[data-testid="step-tag"]').map(text)).toEqual(source.steps);
  });
  it("all 22 reference cards retain their numbers, IDs and full text", () => {
    expect(
      nodes(main(), `.${styles.refCard}`).map((e) => ({
        id: e.id,
        number: text(e.querySelector(`.${styles.refNum}`) as Element),
        text: text(e),
      }))
    ).toEqual(source.refs);
  });
  it("all original styled content elements retain their tags and CSS classes", () => {
    expect(
      nodes(main(), '[class]:not([data-testid="page-freshness"])').map((e) => ({
        tag: e.tagName.toLowerCase(),
        classes: Array.from(e.classList),
      }))
    ).toEqual(
      source.styledNodes.map((e) => ({
        tag: e.tag,
        classes: e.classes.map((c) => (c.startsWith("ti") ? c : styles[c])),
      }))
    );
  });
  it("D-7: both external stylesheets retain full URLs, integrity and CORS", () => {
    const { container } = render(<Page />);
    expect(
      nodes(container, 'link[rel="stylesheet"]').map((e) => ({
        href: e.getAttribute("href"),
        integrity: e.getAttribute("integrity"),
        crossOrigin: e.getAttribute("crossorigin"),
      }))
    ).toEqual(source.stylesheets);
  });
  it("D-8: the layout is full width and the sidebar/main adapt to the site header", () => {
    expect(
      render(<Page />)
        .getByTestId("layout-root")
        .classList.contains(styles.layout)
    ).toBe(true);
    expect(cssRules).toContainEqual({
      selector: ".layout",
      media: null,
      declarations: { width: "100%", "max-width": "100%", "color-scheme": "light" },
    });
    expect(cssRules).toContainEqual({
      selector: ".main",
      media: null,
      declarations: { "min-width": "0", width: "calc(100% - var(--sidebar-w))" },
    });
  });
  it("every original CSS rule and declaration is transferred, including responsive rules", () => {
    for (const rule of source.cssRules) {
      expect(
        cssRules.some(
          (actual) =>
            actual.selector === normalizeCss(rule.selector).replace(/\s*,\s*/g, ", ") &&
            actual.media === rule.media &&
            Object.entries(rule.declarations).every(
              ([p, v]) => normalizeCss(actual.declarations[p] ?? "") === normalizeCss(v)
            )
        ),
        rule.selector
      ).toBe(true);
    }
  });
  it("list markers and checklist exceptions survive Tailwind resets; tables stay left aligned", () => {
    const required = [
      {
        selector: ".layout :global(ul)",
        media: null,
        declarations: { "list-style-type": "disc", "padding-left": "40px", margin: "1em 0" },
      },
      {
        selector: ".layout :global(ol)",
        media: null,
        declarations: { "list-style-type": "decimal", "padding-left": "40px", margin: "1em 0" },
      },
      {
        selector: ".layout .checklist",
        media: null,
        declarations: { "list-style": "none", padding: "0", margin: "1.2rem 0" },
      },
      {
        selector:
          ".layout :global(th), .layout :global(td), .layout :global(thead th:not(:first-child))",
        media: null,
        declarations: { "text-align": "left" },
      },
      {
        selector:
          ".layout :global(h1), .layout :global(h2), .layout :global(h3), .layout :global(section[id])",
        media: null,
        declarations: { "scroll-margin-top": "calc(var(--header-height, 60px) + 80px)" },
      },
    ];
    for (const r of required) expect(cssRules).toContainEqual(r);
    expect(css).toMatch(/text-align:\s*left\s*!important/);
  });
  it("Q-2: static metadata matches the book title and includes a description", () => {
    expect(metadata.title).toBe(`${source.h1[0]} | LLM コスト計算機`);
    expect(metadata.description).toBe(
      "Nathan B. Crocker 著『AI-Powered Developer』を土台に、LLMの基礎から設計・実装・テスト・デプロイ・セキュリティまでを学ぶステップバイステップガイド。2026年9月の補足動向、用語集、学習チェックリスト、全出典を収録。"
    );
  });
  it("Q-3: heading levels never skip a level", () => {
    let previous = 0;
    for (const h of nodes(main(), "h1,h2,h3,h4,h5,h6")) {
      const level = Number(h.tagName.slice(1));
      expect(level).toBeLessThanOrEqual(previous + 1);
      previous = level;
    }
  });
});
