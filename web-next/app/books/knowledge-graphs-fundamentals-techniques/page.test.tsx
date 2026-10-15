// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { parse } from "postcss";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import source from "./source-contract.json";
import syntax from "./syntax-contract.json";

vi.mock("./TocObserver", () => ({ default: () => null }));
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({
    chart,
    theme,
    themeVariables,
  }: {
    chart: string;
    theme: string;
    themeVariables: Record<string, string>;
  }) => (
    <div data-testid="mermaid" data-theme={theme} data-variables={JSON.stringify(themeVariables)}>
      {chart}
    </div>
  ),
}));
const dir = "app/books/knowledge-graphs-fundamentals-techniques";
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
// Additive study aids are verified in ReviewSections.test.tsx; preserve the frozen original oracle here.
const main = () => {
  const root = render(<Page />).container.querySelector("main") as HTMLElement;
  nodes(root, "[data-study-addition]").forEach((element) => {
    element.remove();
  });
  return root;
};
const cssNorm = (s: string) =>
  normalize(s)
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
          .filter((n) => n.type === "decl")
          .map((n) => [n.prop, cssNorm(n.value) + (n.important ? " !important" : "")])
      ),
    });
  });
  return rules;
}
const css = readFileSync(`${dir}/page.module.css`, "utf8");
const rules = rulesOf(css);
const declarations = (selector: string, media: string | null = null) =>
  Object.assign(
    {},
    ...rules
      .filter((r) => r.selector === cssNorm(selector) && r.media === media)
      .map((r) => r.declarations)
  );

describe("Knowledge Graphs fundamentals — frozen original contracts", () => {
  for (const tag of ["h1", "h2", "h3"])
    it(`preserves every ${tag} in order`, () =>
      expect(nodes(main(), tag).map(text)).toEqual(
        source.headings.filter((h) => h.tag === tag).map((h) => h.text)
      ));
  it("preserves the complete heading hierarchy", () =>
    expect(nodes(main(), "h1,h2,h3,h4").map((e) => ({ tag: e.localName, text: text(e) }))).toEqual(
      source.headings
    ));
  it("preserves all paragraphs including footer", () =>
    expect(nodes(main(), "p").map(text)).toEqual(source.paragraphs));
  it("preserves every list type, item, nesting and order", () =>
    expect(
      nodes(main(), "ul,ol").map((e) => ({
        tag: e.localName,
        items: Array.from(e.children)
          .filter((e) => e.localName === "li")
          .map(text),
        depth: (() => {
          let n = e.parentElement,
            d = 0;
          while (n && n.localName !== "main") {
            if (n.matches("ul,ol")) d++;
            n = n.parentElement;
          }
          return d;
        })(),
      }))
    ).toEqual(source.lists));
  it("preserves every table cell, span, header tag and row in order", () =>
    expect(
      nodes(main(), "table").map((e) =>
        nodes(e, "tr").map((e) =>
          Array.from(e.children).map((c) => ({
            tag: c.localName,
            text: text(c),
            colspan: c.getAttribute("colspan"),
            rowspan: c.getAttribute("rowspan"),
          }))
        )
      )
    ).toEqual(source.tables));
  it("keeps valid table children without whitespace text nodes", () => {
    const allowed: Record<string, string[]> = {
      TABLE: ["THEAD", "TBODY", "TFOOT"],
      THEAD: ["TR"],
      TBODY: ["TR"],
      TFOOT: ["TR"],
      TR: ["TD", "TH"],
    };
    expect(
      nodes(main(), "table,thead,tbody,tfoot,tr").flatMap((e) =>
        Array.from(e.childNodes).filter(
          (c) => c.nodeType !== 1 || !allowed[e.tagName].includes((c as Element).tagName)
        )
      )
    ).toEqual([]);
  });
  it("preserves all link labels and URLs in order", () =>
    expect(
      nodes(main(), "a").map((e) => ({ href: e.getAttribute("href"), text: text(e) }))
    ).toEqual(source.links));
  it("secures every original external link", () =>
    expect(
      nodes(main(), 'a[href^="http"]').map((e) => [e.getAttribute("target"), e.getAttribute("rel")])
    ).toEqual(
      source.links
        .filter((l) => l.href.startsWith("http"))
        .map(() => ["_blank", "noopener noreferrer"])
    ));
  it("preserves all inline code", () =>
    expect(
      nodes(main(), "code")
        .filter((e) => !e.closest("pre"))
        .map(text)
    ).toEqual(source.inlineCodes));
  it("preserves exact code including whitespace and languages", () =>
    expect(
      nodes(main(), "pre code").map((e) => ({ language: e.className, text: e.textContent }))
    ).toEqual(source.codes));
  it("preserves code lines, empty lines and indentation", () =>
    expect(
      nodes(main(), "pre code").map((e) =>
        nodes(e, '[data-testid="code-line"]').map((e) => e.textContent)
      )
    ).toEqual(source.codes.map((c) => c.text.split("\n"))));
  it("preserves quotes and callout variants and text", () => {
    expect(nodes(main(), 'blockquote[data-testid="voice"]').map(text)).toEqual(source.quotes);
    expect(
      nodes(main(), `.${styles.callout}`).map((e) => ({
        classes: Array.from(e.classList),
        text: text(e),
        variant: e.getAttribute("data-variant"),
      }))
    ).toEqual(
      source.callouts.map((e) => ({
        classes: e.classes.map((c) => styles[c]),
        text: e.text,
        variant: e.classes.includes("callout-intro") ? "info" : "glossary",
      }))
    );
  });
  it("preserves every original styled element", () =>
    expect(
      nodes(main(), "[class]")
        .filter((e) => !e.matches('[data-testid="code-line"],[data-token]'))
        .map((e) => ({ tag: e.localName, classes: Array.from(e.classList) }))
    ).toEqual(
      source.styledNodes.map((e) => ({
        ...e,
        classes: e.classes.map((c) =>
          c === "ti" || c.startsWith("ti-") || c.startsWith("language-") ? c : styles[c]
        ),
      }))
    ));
  it("preserves complete main text", () => {
    const root = main();
    nodes(root, '[data-testid="mermaid"]').forEach((e) => {
      e.remove();
    });
    expect(text(root)).toBe(source.bodyText);
  });
  it("preserves all original TOC labels, titles and targets with initial selection", () => {
    const nav = render(<Page />).getByTestId("sidebar-nav");
    expect(
      nodes(nav, '[data-testid="sidebar-nav-link"]').map((e) => ({
        href: e.getAttribute("href"),
        text: text(e),
        title: e.getAttribute("title"),
      }))
    ).toEqual(source.toc);
    expect(
      nodes(nav, `.${styles.active}`).map((e) => [
        e.getAttribute("href"),
        e.getAttribute("aria-current"),
      ])
    ).toEqual([["#sec-0", "location"]]);
  });
  it("resolves every TOC target and gives every heading a unique id", () => {
    const { container } = render(<Page />);
    const ids = nodes(container, "[id]").map((e) => e.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    expect(nodes(container, "h2,h3").map((e) => !!e.id)).toEqual(
      source.headings.filter((h) => ["h2", "h3"].includes(h.tag)).map(() => true)
    );
    expect(source.toc.map((l) => container.querySelector(l.href)?.tagName)).toEqual(
      source.toc.map(() => "SECTION")
    );
  });
  it("preserves all diagram sources and original dark theme in their wrappers", () => {
    const ds = nodes(
      main(),
      `.${styles["mermaid-wrap"]} .${styles["mermaid-diagram"]} [data-testid="mermaid"]`
    );
    expect(ds.map((e) => e.textContent?.replace(/^ {4}/gm, ""))).toEqual(
      source.diagrams.map((d) => d.chart)
    );
    expect(ds.map((e) => e.getAttribute("data-theme"))).toEqual(source.diagrams.map(() => "dark"));
    expect(ds.map((e) => JSON.parse(e.getAttribute("data-variables") ?? "{}"))).toEqual(
      source.diagrams.map(() => source.theme)
    );
    expect(
      source.diagrams.filter(
        (d) => !d.chart.startsWith("flowchart ") || d.chart.includes("block-beta")
      )
    ).toEqual([]);
  });
  it("preserves all three original CDN stylesheets", () => {
    render(<Page />);
    expect(
      nodes(document, 'link[data-guide="kg-fundamentals"]').map((e) => e.getAttribute("href"))
    ).toEqual(source.stylesheets);
  });
  it("transfers every original CSS declaration except renderer-owned rules", () => {
    for (const expected of source.cssRules.filter((r) => !r.delegated))
      expect(
        rules.some(
          (r) =>
            r.selector === cssNorm(expected.selector) &&
            r.media === expected.media &&
            Object.entries(expected.declarations).every(
              ([p, v]) => r.declarations[p] === cssNorm(v)
            )
        ),
        expected.selector
      ).toBe(true);
    expect(source.cssRules.filter((r) => r.delegated).map((r) => r.selector)).toEqual([
      ".layout .mermaid-wrap",
      ".layout .mermaid-diagram :global(svg)",
      ".layout .mermaid-diagram.is-loading::after",
    ]);
    expect(declarations(".layout .mermaid-wrap")).toEqual({
      margin: "8px 0 24px",
      padding: "20px",
      background: "var(--color-background-secondary)",
      border: "1px solid var(--color-border-secondary)",
      "border-radius": "var(--border-radius-lg)",
      "overflow-x": "auto",
    });
    expect(declarations(".layout .mermaid-diagram")).toEqual({ "min-width": "0" });
  });
  it("restores disc, decimal and nested markers", () => {
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
  it("forces left aligned tables and safe anchor offsets", () => {
    expect(
      declarations(
        ".layout :global(th), .layout :global(td), .layout :global(thead th:not(:first-child))"
      )["text-align"]
    ).toBe("left !important");
    expect(
      declarations(
        ".layout .chapter :global(h2), .layout .chapter :global(h3), .layout :global(section)"
      )["scroll-margin-top"]
    ).toBe("calc(var(--header-height, 60px) + 80px)");
    expect(declarations(".layout :global(pre code)")).toMatchObject({
      background: "none",
      border: "none",
      padding: "0",
      "white-space": "pre",
    });
    expect(declarations(".layout .codeLine")["white-space"]).toBe("pre");
  });
  it("keeps full width, fixed sidebar and original mobile flow", () => {
    expect(declarations(".layout")).toMatchObject({
      width: "100%",
      "color-scheme": "dark",
      "--sidebar-width": "320px",
    });
    expect(declarations(".layout .sidebar")).toMatchObject({
      position: "fixed",
      top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
      height: "calc(100dvh - var(--header-height, 60px) - var(--ch-disclaimer-height, 0px))",
      "overflow-y": "auto",
    });
    expect(declarations(".layout .content")).toMatchObject({
      "min-width": "0",
      width: "calc(100% - var(--sidebar-width))",
    });
    expect(declarations(".layout .sidebar", "(max-width: 980px)")).toMatchObject({
      position: "static",
      width: "auto",
      height: "auto",
      top: "auto",
    });
    // Apply matching base and mobile rules in source order, including later overrides.
    expect(
      Object.assign(
        {},
        ...rules
          .filter(
            (r) =>
              r.selector === ".layout .sidebar" &&
              (r.media === null || r.media === "(max-width: 980px)")
          )
          .map((r) => r.declarations)
      )
    ).toMatchObject({ position: "static", height: "auto", width: "auto", top: "auto" });
    expect(declarations(".layout .content", "(max-width: 980px)")).toMatchObject({
      width: "100%",
      "margin-left": "0",
      padding: "40px 24px 100px",
    });
  });
  it("scopes shared chrome and clears sidebar at 980px", () => {
    const rs = rulesOf(readFileSync("app/globals.css", "utf8"));
    const body = 'body:has([data-page="knowledge-graphs-fundamentals-techniques"])';
    const get = (s: string, m: string | null = null) =>
      Object.assign(
        {},
        ...rs.filter((r) => r.selector === cssNorm(s) && r.media === m).map((r) => r.declarations)
      );
    expect(get(body).background).toBe("#07111e");
    for (const s of ["#site-freshness-bar", 'nav[aria-label="関連ページ"]'])
      expect(get(`${body} ${s}`)).toMatchObject({
        "margin-left": "320px",
        width: "calc(100% - 320px)",
      });
    expect(
      get(`${body} #site-freshness-bar, ${body} nav[aria-label="関連ページ"]`, "(max-width: 980px)")
    ).toMatchObject({ "margin-left": "0", width: "100%" });
  });
  it("preserves nav colors and decorations through the actual cascade", () => {
    const vars = Object.assign(
      {},
      ...source.cssRules.filter((r) => r.selector === ".layout").map((r) => r.declarations)
    );
    const sheet = document.createElement("style");
    sheet.textContent = rules
      .filter((r) => !r.media)
      .map((r) => {
        const sel = r.selector
          .replace(/:global\(([^)]+)\)/g, "$1")
          .replace(/\.([A-Za-z_][\w-]*)/g, (_m, n) => `.${styles[n]}`)
          .replace(/:hover/g, '[data-test-hover="true"]');
        const ds = Object.entries(r.declarations)
          .filter(([p]) => ["color", "text-decoration", "background", "font-weight"].includes(p))
          .map(
            ([p, v]) => `${p}:${v.replace(/var\((--[\w-]+)\)/g, (_m, n) => vars[n] ?? "inherit")}`
          )
          .join(";");
        return `${sel}{${ds}}`;
      })
      .join("\n");
    document.head.append(sheet);
    try {
      const { container } = render(<Page />);
      const link = container.querySelector("nav a") as HTMLElement;
      link.classList.remove(styles.active);
      expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
        "rgb(169, 184, 207)",
        "none",
      ]);
      link.dataset.testHover = "true";
      expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
        "rgb(232, 237, 246)",
        "none",
      ]);
      delete link.dataset.testHover;
      link.classList.add(styles.active);
      expect([getComputedStyle(link).color, getComputedStyle(link).textDecoration]).toEqual([
        "rgb(232, 237, 246)",
        "none",
      ]);
    } finally {
      sheet.remove();
    }
  });
  it("highlights supported Python/SQL examples statically and preserves unsupported plain grammars", () => {
    const blocks = nodes(main(), "pre code");
    expect(blocks.map((e) => !!e.querySelector("[data-token]"))).toEqual(
      source.codes.map((c) => ["language-python", "language-sql"].includes(c.language))
    );
    expect(
      nodes(main(), '[data-testid="code-block"]').map((e) => e.querySelector("code")?.className)
    ).toEqual(source.codes.map((c) => c.language));
  });
  it("preserves every original highlight.js token including multiline Python strings", () => {
    expect(
      nodes(main(), "pre code").map((code) =>
        nodes(code, "[data-token]").map((token) => ({
          text: token.textContent,
          classes: Array.from(token.classList),
        }))
      )
    ).toEqual(syntax.tokens);
  });
  it("registers metadata and derived navigation", () => {
    expect(metadata.title).toBe(`${source.title} | LLM コスト計算機`);
    const e = findBySlug("/books/knowledge-graphs-fundamentals-techniques");
    expect(e).toMatchObject({
      group: "推薦書籍",
      addedAt: "2026-10-15",
      lastReviewed: "2026-10-15",
      topics: ["book", "knowledge-graph", "rdf", "sparql", "llm", "graphrag"],
    });
    expect(metadata.description).toBe(e?.description);
  });
  it("uses Pure JSX and clean internal links", () => {
    const code = readFileSync(`${dir}/page.tsx`, "utf8");
    expect(
      [
        ["danger", "ously", "Set", "Inner", "HTML"].join(""),
        "readFileSync",
        "source-contract",
        '"use client"',
      ].filter((n) => code.includes(n))
    ).toEqual([]);
    expect(nodes(render(<Page />).container, 'a[href$=".html"]')).toEqual([]);
  });
});
