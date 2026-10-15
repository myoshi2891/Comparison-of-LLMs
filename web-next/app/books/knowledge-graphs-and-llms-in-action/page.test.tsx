// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { parse } from "postcss";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import source from "./source-contract.json";

vi.mock("./TocObserver", () => ({ default: () => null }));
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({
    chart,
    id,
    theme,
    themeVariables,
  }: {
    chart: string;
    id: string;
    theme: string;
    themeVariables: Record<string, string>;
  }) => (
    <div
      data-testid="mermaid"
      id={id}
      data-theme={theme}
      data-variables={JSON.stringify(themeVariables)}
    >
      {chart}
    </div>
  ),
}));
const dir = "app/books/knowledge-graphs-and-llms-in-action";
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
const main = () => render(<Page />).container.querySelector("main") as HTMLElement;
const css = readFileSync(`${dir}/page.module.css`, "utf8");
const cssNorm = (value: string) =>
  normalize(value)
    .replace(/'/g, '"')
    .replace(/\s*,\s*/g, ", ");
function rulesOf(code: string) {
  const rules: { selector: string; media: string | null; declarations: Record<string, string> }[] =
    [];
  parse(code).walkRules((rule) => {
    rules.push({
      selector: cssNorm(rule.selector),
      media: rule.parent?.type === "atrule" ? rule.parent.params : null,
      declarations: Object.fromEntries(
        rule.nodes
          .filter((node) => node.type === "decl")
          .map((node) => [node.prop, cssNorm(node.value) + (node.important ? " !important" : "")])
      ),
    });
  });
  return rules;
}
const rules = rulesOf(css);
const declarations = (selector: string, media: string | null = null) =>
  Object.assign(
    {},
    ...rules
      .filter((rule) => rule.selector === cssNorm(selector) && rule.media === media)
      .map((rule) => rule.declarations)
  );

describe("Knowledge Graphs and LLMs in Action — frozen source contracts", () => {
  for (const tag of ["h1", "h2", "h3", "h4"])
    it(`preserves every ${tag} in order`, () =>
      expect(nodes(main(), tag).map(text)).toEqual(
        source.headings.filter((heading) => heading.tag === tag).map((heading) => heading.text)
      ));
  it("preserves the complete heading hierarchy", () =>
    expect(
      nodes(main(), "h1,h2,h3,h4").map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: text(element),
      }))
    ).toEqual(source.headings));
  it("preserves all paragraphs including the footer", () =>
    expect(nodes(main(), "p").map(text)).toEqual(source.paragraphs));
  it("preserves every list type, item, nesting and order", () =>
    expect(
      nodes(main(), "ul,ol").map((element) => ({
        tag: element.tagName.toLowerCase(),
        items: Array.from(element.children)
          .filter((child) => child.tagName === "LI")
          .map(text),
      }))
    ).toEqual(source.lists));
  it("preserves all table rows, cells and header tags", () =>
    expect(
      nodes(main(), "table").map((element) =>
        nodes(element, "tr").map((row) =>
          Array.from(row.children).map((cell) => ({
            tag: cell.tagName.toLowerCase(),
            text: text(cell),
          }))
        )
      )
    ).toEqual(source.tables));
  it("keeps table children valid", () => {
    const allowed: Record<string, string[]> = {
      TABLE: ["THEAD", "TBODY", "TFOOT"],
      THEAD: ["TR"],
      TBODY: ["TR"],
      TFOOT: ["TR"],
      TR: ["TD", "TH"],
    };
    expect(
      nodes(main(), "table,thead,tbody,tfoot,tr").flatMap((element) =>
        Array.from(element.childNodes).filter(
          (child) =>
            child.nodeType !== 1 || !allowed[element.tagName].includes((child as Element).tagName)
        )
      )
    ).toEqual([]);
  });
  it("preserves all links and labels in order", () =>
    expect(
      nodes(main(), "a").map((element) => ({
        href: element.getAttribute("href"),
        text: text(element),
      }))
    ).toEqual(source.links));
  it("secures every external link", () =>
    expect(
      nodes(main(), 'a[href^="http"]').map((element) => [
        element.getAttribute("target"),
        element.getAttribute("rel"),
      ])
    ).toEqual(
      source.links
        .filter((link) => link.href.startsWith("http"))
        .map(() => ["_blank", "noopener noreferrer"])
    ));
  it("keeps inline code unchanged", () =>
    expect(
      nodes(main(), "code")
        .filter((element) => !element.closest("pre"))
        .map(text)
    ).toEqual(source.inlineCodes));
  it("preserves exact code, languages and ids", () =>
    expect(
      nodes(main(), "pre code").map((element) => ({
        id: element.id,
        language: Array.from(element.classList).find((name) => name.startsWith("language-")),
        text: element.textContent,
      }))
    ).toEqual(source.codes));
  it("preserves each code line including indentation and empty lines", () =>
    expect(
      nodes(main(), "pre code").map((element) =>
        nodes(element, '[data-testid="code-line"]').map((line) => line.textContent)
      )
    ).toEqual(source.codes.map((code) => code.text.split("\n"))));
  it("keeps every quote and its original attribution text", () => {
    expect(nodes(main(), "blockquote").map(text)).toEqual(source.quotes);
    expect(nodes(main(), '[data-testid="voice"]').map(text)).toEqual(source.quotes);
    expect(nodes(main(), '[data-testid="voice-who"]').map(text)).toEqual(
      source.quotes.map((quote) => quote)
    );
  });
  it("preserves all native accordions and summaries", () =>
    expect(
      nodes(main(), "details").map((element) => ({
        summary: text(element.querySelector("summary") as Element),
        text: text(element),
      }))
    ).toEqual(source.details));
  it("preserves all evidence badges and their variants", () =>
    expect(
      nodes(main(), `.${styles.badge}`).map((element) => ({
        classes: Array.from(element.classList),
        text: text(element),
      }))
    ).toEqual(
      source.badges.map((badge) => ({
        ...badge,
        classes: badge.classes.map((name) => styles[name]),
      }))
    ));
  it("preserves all original styled elements", () =>
    expect(
      nodes(main(), "[class]")
        .filter(
          (element) =>
            !element.matches('[data-testid="code-line"], [data-token], [data-testid="mermaid"]')
        )
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          classes: Array.from(element.classList),
        }))
    ).toEqual(
      source.styledNodes.map((element) => ({
        ...element,
        classes: element.classes.map((name) =>
          name === "ti" || name.startsWith("ti-") || name.startsWith("language-")
            ? name
            : styles[name]
        ),
      }))
    ));
  it("preserves full main text after excluding rendered diagram source", () => {
    const root = main();
    nodes(root, '[data-testid="mermaid"]').forEach((element) => {
      element.remove();
    });
    expect(text(root)).toBe(source.bodyText);
  });
  it("preserves the full TOC and its initial selection", () => {
    const root = render(<Page />).getByTestId("sidebar-nav");
    expect(
      nodes(root, 'a[data-testid="sidebar-nav-link"]').map((element) => ({
        href: element.getAttribute("href"),
        text: text(element),
      }))
    ).toEqual(source.toc);
    expect(nodes(root, `.${styles.active}`).map((element) => element.getAttribute("href"))).toEqual(
      ["#sec-0"]
    );
  });
  it("resolves TOC targets and has unique ids for all headings", () => {
    const { container } = render(<Page />);
    const ids = nodes(container, "[id]").map((element) => element.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    expect(nodes(container, "h2,h3").map((element) => !!element.id)).toEqual(
      source.headings.filter((heading) => ["h2", "h3"].includes(heading.tag)).map(() => true)
    );
    expect(
      source.toc.map((link) =>
        nodes(container, "[id]")
          .filter((element) => element.id === link.href.slice(1))
          .map((element) => element.tagName)
      )
    ).toEqual(source.toc.map((link) => [link.href.startsWith("#step-") ? "H3" : "H2"]));
  });
  it("preserves all diagrams in order and uses the original theme", () => {
    const diagrams = nodes(main(), '[data-testid="mermaid"]');
    expect(diagrams.map((element) => element.textContent)).toEqual(source.charts);
    expect(diagrams.map((element) => element.getAttribute("data-theme"))).toEqual(
      source.charts.map(() => "dark")
    );
    expect(
      diagrams.map((element) => JSON.parse(element.getAttribute("data-variables") ?? "{}"))
    ).toEqual(source.charts.map(() => source.theme));
    expect(
      nodes(
        main(),
        `.${styles["mermaid-container"]} .${styles["mermaid-target"]} [data-testid="mermaid"]`
      ).map((element) => element.textContent)
    ).toEqual(source.charts);
    expect(source.charts.map((chart) => chart.split("\n")[0])).toEqual(
      source.charts.map((chart) => chart.split("\n")[0].trimStart())
    );
  });
  it("preserves both CDN stylesheets", () => {
    render(<Page />);
    expect(
      nodes(document, 'link[data-guide="kgllm"]').map((element) => element.getAttribute("href"))
    ).toEqual(source.stylesheets);
  });
  it("transfers every source CSS declaration except renderer-owned rules", () => {
    for (const expected of source.cssRules.filter((rule) => !rule.delegated))
      expect(
        rules.some(
          (rule) =>
            rule.selector === cssNorm(expected.selector) &&
            rule.media === expected.media &&
            Object.entries(expected.declarations).every(
              ([property, value]) => rule.declarations[property] === cssNorm(value)
            )
        ),
        expected.selector
      ).toBe(true);
    expect(source.cssRules.filter((rule) => rule.delegated).map((rule) => rule.selector)).toEqual([
      ".mermaid-container",
      ".mermaid-target",
      ".mermaid-target :global(svg)",
    ]);
    expect(declarations(".mermaid-container")).toMatchObject({
      margin: "0 0 24px",
      padding: "20px",
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-tertiary)",
      "border-radius": "var(--radius-lg)",
    });
    expect(declarations(".mermaid-target")).toEqual({ "min-width": "0" });
  });
  it("restores disc, decimal and nested list markers", () => {
    expect(declarations(".layout :global(ul)")["list-style-type"]).toBe("disc");
    expect(declarations(".layout :global(ol)")["list-style-type"]).toBe("decimal");
    expect(declarations(".layout :global(ul ul), .layout :global(ol ul)")["list-style-type"]).toBe(
      "circle"
    );
    expect(
      declarations(
        ".layout :global(ul ul ul), .layout :global(ul ol ul), .layout :global(ol ul ul), .layout :global(ol ol ul)"
      )["list-style-type"]
    ).toBe("square");
  });
  it("forces left aligned tables and safe anchors", () => {
    expect(
      declarations(
        ".layout :global(th), .layout :global(td), .layout :global(thead th:not(:first-child))"
      )["text-align"]
    ).toBe("left !important");
    expect(
      declarations(".layout :global(h2), .layout :global(h3), .layout :global(section)")[
        "scroll-margin-top"
      ]
    ).toBe("calc(var(--header-height, 60px) + 80px)");
    expect(declarations(".layout :global(pre code)")).toMatchObject({
      background: "none",
      border: "none",
      padding: "0",
      "white-space": "pre",
    });
    expect(declarations(".codeLine")["white-space"]).toBe("pre");
  });
  it("keeps full width, native dark scrollbars and a fixed sidebar below shared chrome", () => {
    expect(declarations(".layout")).toMatchObject({ width: "100%", "color-scheme": "dark" });
    expect(declarations(".sidebar")).toMatchObject({
      position: "fixed",
      width: "var(--sidebar-width)",
      top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
    });
    expect(declarations(".main")).toMatchObject({
      "min-width": "0",
      width: "calc(100% - var(--sidebar-width))",
    });
    expect(declarations(".sidebar", "(max-width: 960px)")).toMatchObject({
      position: "static",
      width: "auto",
      top: "auto",
      bottom: "auto",
    });
    expect(declarations(".main", "(max-width: 960px)").width).toBe("100%");
  });
  it("scopes shared chrome to this guide and clears the sidebar at the original breakpoint", () => {
    const globalRules = rulesOf(readFileSync("app/globals.css", "utf8"));
    const body = 'body:has([data-page="knowledge-graphs-and-llms-in-action"])';
    const get = (selector: string, media: string | null = null) =>
      Object.assign(
        {},
        ...globalRules
          .filter((rule) => rule.selector === cssNorm(selector) && rule.media === media)
          .map((rule) => rule.declarations)
      );
    expect(get(body).background).toBe("#07111e");
    expect(get(`${body} #site-freshness-bar`)).toMatchObject({
      background: "#07111e",
      "margin-left": "320px",
      width: "calc(100% - 320px)",
    });
    expect(get(`${body} nav[aria-label="関連ページ"]`)).toMatchObject({
      "margin-left": "320px",
      width: "calc(100% - 320px)",
    });
    expect(
      get(`${body} #site-freshness-bar, ${body} nav[aria-label="関連ページ"]`, "(max-width: 960px)")
    ).toMatchObject({ "margin-left": "0", width: "100%" });
  });
  it("uses the original Atom One Dark token palette on static code spans", () => {
    const root = main();
    const tokens = nodes(root, "[data-token]");
    expect(
      [...new Set(tokens.map((element) => element.getAttribute("data-token")))].sort()
    ).toEqual(["comment", "keyword", "number", "string"]);
    expect(
      tokens.filter((element) => element.className !== `hljs-${element.getAttribute("data-token")}`)
    ).toEqual([]);
    expect(
      nodes(root, '[data-testid="code-block"]').map((element) => element.querySelector("code")?.id)
    ).toEqual(source.codes.map((code) => code.id));
  });
  for (const [kind, baseColor, activeColor] of [
    ["nav__link", "rgb(174, 188, 214)", "rgb(234, 240, 251)"],
    ["nav__sub-link", "rgb(124, 139, 171)", "rgb(124, 158, 255)"],
  ] as const) {
    it(`keeps original ${kind} colors and decorations through the actual selector cascade`, () => {
      const variables = Object.assign(
        {},
        ...source.cssRules
          .filter((rule) => rule.selector === ".layout")
          .map((rule) => rule.declarations)
      );
      const stylesheet = document.createElement("style");
      // jsdom does not resolve CSS variables. Substitute the frozen source palette,
      // then let its CSS engine decide specificity rather than just checking rule presence.
      stylesheet.textContent = rules
        .filter((rule) => !rule.media)
        .map((rule) => {
          const selector = rule.selector
            .replace(/:global\(([^)]+)\)/g, "$1")
            .replace(/\.([A-Za-z_][\w-]*)/g, (_match, name) => `.${styles[name]}`)
            .replace(/:hover/g, '[data-test-hover="true"]');
          const declarations = Object.entries(rule.declarations)
            .filter(([property]) =>
              ["color", "text-decoration", "background", "font-weight"].includes(property)
            )
            .map(
              ([property, value]) =>
                `${property}:${value.replace(/var\((--[\w-]+)\)/g, (_match, name) => variables[name] ?? "inherit")}`
            )
            .join(";");
          return `${selector}{${declarations}}`;
        })
        .join("\n");
      document.head.appendChild(stylesheet);
      try {
        const { container } = render(<Page />);
        const link = container.querySelector(`.${styles[kind]}`) as HTMLAnchorElement;
        link.classList.remove(styles.active);
        expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
          baseColor,
          "none",
        ]);
        link.dataset.testHover = "true";
        expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
          "rgb(234, 240, 251)",
          "none",
        ]);
        delete link.dataset.testHover;
        link.classList.add(styles.active);
        expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
          activeColor,
          "none",
        ]);
        link.dataset.testHover = "true";
        expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
          activeColor,
          "none",
        ]);
      } finally {
        stylesheet.remove();
      }
    });
  }
  it("registers metadata and derived navigation", () => {
    expect(metadata.title).toBe(`${source.title} | LLM コスト計算機`);
    const entry = findBySlug("/books/knowledge-graphs-and-llms-in-action");
    expect(entry).toMatchObject({
      group: "推薦書籍",
      addedAt: "2026-10-15",
      lastReviewed: "2026-10-15",
      topics: ["book", "knowledge-graph", "llm", "rag", "graphrag", "neo4j", "langgraph"],
    });
    expect(metadata.description).toBe(entry?.description);
  });
  it("uses Pure JSX without runtime source loading or raw HTML injection", () => {
    const code = readFileSync(`${dir}/page.tsx`, "utf8");
    expect(
      [
        ["danger", "ously", "Set", "Inner", "HTML"].join(""),
        "readFileSync",
        "source-contract",
        '"use client"',
      ].filter((needle) => code.includes(needle))
    ).toEqual([]);
    expect(nodes(render(<Page />).container, 'a[href$=".html"]')).toEqual([]);
  });
});
