import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { parse } from "postcss";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import source from "./source-contract.json";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: (props: { chart: string; id: string; theme: string; flowchartHtmlLabels: boolean }) => (
    <div
      data-testid="mermaid"
      id={props.id}
      data-theme={props.theme}
      data-labels={String(props.flowchartHtmlLabels)}
    >
      {props.chart}
    </div>
  ),
}));
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
const main = () => render(<Page />).container.querySelector("main") as HTMLElement;
const css = readFileSync("app/books/generative-ai-with-langchain/page.module.css", "utf8");
const rules: { selector: string; media: string | null; declarations: Record<string, string> }[] =
  [];
const cssNormalize = (value: string) =>
  normalize(value)
    .replace(/'/g, '"')
    .replace(/\s*,\s*/g, ", ");
parse(css).walkRules((rule) => {
  rules.push({
    selector: cssNormalize(rule.selector),
    media: rule.parent?.type === "atrule" ? rule.parent.params : null,
    declarations: Object.fromEntries(
      rule.nodes
        .filter((node) => node.type === "decl")
        .map((node) => [
          node.prop,
          cssNormalize(node.value) + (node.important ? " !important" : ""),
        ])
    ),
  });
});
function declarations(selector: string, media: string | null = null) {
  return Object.assign(
    {},
    ...rules
      .filter((rule) => rule.selector === cssNormalize(selector) && rule.media === media)
      .map((rule) => rule.declarations)
  ) as Record<string, string>;
}
const body = ":global(body):has(.layout)";
const related = `${body} :global(nav[aria-label="関連ページ"])`;
const freshness = `${body} :global(#site-freshness-bar)`;

describe("LangChain guide — frozen original content and design contracts", () => {
  it("preserves every H1, H2 and H3 heading in original order", () => {
    const root = main();
    expect(nodes(root, "h1").map(text)).toEqual(source.h1);
    expect(nodes(root, "h2").map(text)).toEqual(source.h2);
    expect(nodes(root, "h3").map(text)).toEqual(source.h3);
    expect(
      nodes(root, "h1,h2,h3,h4").map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: text(element),
      }))
    ).toEqual(source.headings);
  });
  it("preserves all paragraphs including the eight diagram fallback descriptions", () =>
    expect(nodes(main(), "p").map(text)).toEqual(source.paragraphs));
  it("preserves the complete body links and labels in order", () =>
    expect(
      nodes(main(), "a").map((element) => ({
        href: element.getAttribute("href"),
        text: text(element),
      }))
    ).toEqual(source.links));
  it("preserves list types, full items and their order", () =>
    expect(
      nodes(main(), "ul,ol").map((element) => ({
        tag: element.tagName.toLowerCase(),
        items: Array.from(element.children)
          .filter((child) => child.tagName === "LI")
          .map(text),
      }))
    ).toEqual(source.lists));
  it("preserves every table row, cell and header tag", () =>
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
  it("contains no invalid children or whitespace in table structures", () => {
    const allowed: Record<string, string[]> = {
      TABLE: ["THEAD", "TBODY", "TFOOT", "CAPTION", "COLGROUP"],
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
  it("preserves all code languages and exact text including indentation, line breaks and backslashes", () =>
    expect(
      nodes(main(), '[data-testid="code-block"] code').map((element) => ({
        language: Array.from(element.classList).find((name) => name.startsWith("language-")),
        text: element.textContent,
      }))
    ).toEqual(source.codes));
  it("wraps every code line and explicitly preserves its initial whitespace", () => {
    expect(
      nodes(main(), '[data-testid="code-block"]').map((element) =>
        nodes(element, '[data-testid="code-line"]').map((line) => line.textContent)
      )
    ).toEqual(source.codes.map((code) => code.text.split("\n")));
    expect(declarations(".codeLine")).toEqual({ "white-space": "pre" });
  });
  it("preserves every inline code value", () =>
    expect(
      nodes(main(), "code")
        .filter((element) => !element.closest("pre"))
        .map(text)
    ).toEqual(source.inlineCodes));
  it("preserves all callout classes, variants and full contents", () =>
    expect(
      nodes(main(), '[data-testid="callout"]').map((element) => ({
        classes: Array.from(element.classList),
        variant: element.getAttribute("data-variant"),
        text: text(element),
      }))
    ).toEqual(
      source.callouts.map((callout) => ({
        ...callout,
        classes: callout.classes.map((name) => styles[name]),
      }))
    ));
  it("labels every warning with its original title or untitled body", () =>
    expect(
      nodes(main(), '[data-variant="warn"] [data-testid="callout-label"]').map((element) =>
        text(element.closest('[data-testid="callout"]') as Element)
      )
    ).toEqual(
      source.callouts.filter((callout) => callout.variant === "warn").map((callout) => callout.text)
    ));
  it("preserves all reference cards and chapter number badges", () => {
    expect(nodes(main(), `.${styles.refCard}`).map(text)).toEqual(source.refs);
    expect(nodes(main(), '[data-testid="step-tag"]').map(text)).toEqual(source.steps);
  });
  it("preserves every original styled content element", () => {
    expect(
      nodes(main(), "[class]")
        .filter((element) => !element.matches('[data-testid="code-line"], [data-token]'))
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          classes: Array.from(element.classList).filter((name) => name !== "hljs"),
        }))
    ).toEqual(
      source.styledNodes.map((element) => ({
        tag: element.tag,
        classes: element.classes.map((name) =>
          name === "ti" || name.startsWith("ti-") || name.startsWith("language-")
            ? name
            : styles[name]
        ),
      }))
    );
  });
  it("preserves all TOC labels and anchors without introducing a mobile menu", () => {
    const { getByTestId, container } = render(<Page />);
    expect(
      nodes(getByTestId("sidebar-nav"), "a").map((element) => ({
        href: element.getAttribute("href"),
        text: text(element),
      }))
    ).toEqual(source.toc);
    expect(
      nodes(getByTestId("sidebar-nav"), '[data-testid="sidebar-nav-link"]').map((element) =>
        element.getAttribute("href")
      )
    ).toEqual(source.toc.map((link) => link.href));
    expect(nodes(container, "button,[inert]")).toEqual([]);
  });
  it("initializes the first TOC link as current", () =>
    expect(
      nodes(render(<Page />).getByTestId("sidebar-nav"), `.${styles.active}`).map((element) =>
        element.getAttribute("href")
      )
    ).toEqual(["#intro"]));
  it("resolves every original TOC anchor and makes every heading uniquely addressable", () => {
    const { container } = render(<Page />);
    const ids = nodes(container, "[id]").map((element) => element.id);
    expect(ids.filter((value, index) => ids.indexOf(value) !== index)).toEqual([]);
    expect(nodes(container, "h2,h3").map((element) => Boolean(element.id))).toEqual(
      Array(source.h2.length + source.h3.length).fill(true)
    );
    expect(
      source.toc.map((link) =>
        nodes(container, "[id]")
          .filter((element) => element.id === link.href.slice(1))
          .map((element) => element.id)
      )
    ).toEqual(source.toc.map((link) => [link.href.slice(1)]));
  });
  it("keeps heading levels consecutive", () => {
    const levels = nodes(main(), "h1,h2,h3,h4,h5,h6").map((element) =>
      Number(element.tagName.slice(1))
    );
    expect(levels.filter((level, index) => index > 0 && level > levels[index - 1] + 1)).toEqual([]);
  });
  it("keeps external links secure and introduces no legacy HTML route", () => {
    const links = nodes(main(), 'a[href^="http"]');
    expect(
      links.map((element) => [element.getAttribute("target"), element.getAttribute("rel")])
    ).toEqual(source.links.map(() => ["_blank", "noopener noreferrer"]));
    expect(
      nodes(main(), "a[href]").filter(
        (element) =>
          !element.getAttribute("href")?.startsWith("http") &&
          element.getAttribute("href")?.includes(".html")
      )
    ).toEqual([]);
  });
  it("preserves all diagram sources, ids, captions and fallback paragraphs in order", () => {
    const root = main();
    expect(nodes(root, '[data-testid="mermaid"]').map((element) => element.textContent)).toEqual(
      source.diagrams.map((diagram) => diagram.chart)
    );
    expect(nodes(root, `.${styles.diagramTarget}`).map((element) => element.id)).toEqual(
      source.diagrams.map((diagram) => diagram.id)
    );
    expect(nodes(root, `.${styles.diagramCaption}`).map(text)).toEqual(
      source.diagrams.map((diagram) => diagram.caption)
    );
    expect(nodes(root, `.${styles.diagramFallback}`).map((element) => element.textContent)).toEqual(
      source.diagrams.map((diagram) => diagram.fallback)
    );
  });
  it("uses the shared diagram renderer with dark theme and color-preserving SVG labels", () => {
    const root = main();
    expect(
      nodes(root, `.${styles.diagramCard} .${styles.diagramWrap} [data-testid="mermaid"]`)
    ).toEqual(nodes(root, '[data-testid="mermaid"]'));
    expect(
      nodes(root, '[data-testid="mermaid"]').map((element) => [
        element.getAttribute("data-theme"),
        element.getAttribute("data-labels"),
      ])
    ).toEqual(source.diagrams.map(() => ["dark", "false"]));
    expect(
      source.diagrams.map((diagram) => diagram.chart.split("\n")[0].startsWith("flowchart "))
    ).toEqual(source.diagrams.map(() => true));
    expect(source.diagrams.filter((diagram) => diagram.chart.includes("block-beta"))).toEqual([]);
  });
  it("preserves both original CDN stylesheets including React-hoisted links", () => {
    render(<Page />);
    expect(
      nodes(document, 'link[rel="stylesheet"][data-guide="langchain"]').map((element) =>
        element.getAttribute("href")
      )
    ).toEqual(source.stylesheets);
  });
  it("transfers all original CSS declarations except three renderer-owned layout rules", () => {
    for (const expected of source.cssRules.filter((rule) => !rule.delegated)) {
      expect(
        rules.some(
          (rule) =>
            rule.selector === cssNormalize(expected.selector) &&
            rule.media === expected.media &&
            Object.entries(expected.declarations).every(
              ([property, value]) => rule.declarations[property] === cssNormalize(value)
            )
        ),
        expected.selector
      ).toBe(true);
    }
    expect(source.cssRules.filter((rule) => rule.delegated).map((rule) => rule.selector)).toEqual([
      ".diagramWrap",
      ".diagramTarget",
      ".diagramTarget :global(svg)",
    ]);
  });
  it("restores disc and decimal markers and prevents hidden table alignment overrides", () => {
    expect(declarations(".layout :global(ul)")["list-style-type"]).toBe("disc");
    expect(declarations(".layout :global(ol)")["list-style-type"]).toBe("decimal");
    expect(
      declarations(
        ".layout :global(th), .layout :global(td), .layout :global(thead th:not(:first-child))"
      )
    ).toEqual({ "text-align": "left !important" });
    expect(
      declarations(
        ".layout :global(h2), .layout :global(h3), .layout :global(section), .layout :global(header)"
      )
    ).toEqual({ "scroll-margin-top": "calc(var(--header-height, 60px) + 80px)" });
  });
  it("retains native dark scrollbars and constrains the sidebar below shared chrome", () => {
    expect(declarations(".layout")["color-scheme"]).toBe("dark");
    const sidebar = declarations(".sidebar");
    expect([
      sidebar.position,
      sidebar.width,
      sidebar.top,
      sidebar.height,
      sidebar["overflow-y"],
    ]).toEqual([
      "fixed",
      "280px",
      "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
      "calc(100dvh - var(--header-height, 60px) - var(--ch-disclaimer-height, 0px))",
      "auto",
    ]);
    expect(declarations(".main").width).toBe("calc(100% - 280px)");
    expect(declarations(".layout").width).toBe("100%");
  });
  it("retains the original inline mobile TOC at the exact 900px breakpoint", () => {
    const mobile = declarations(".sidebar", "(max-width: 900px)");
    expect([mobile.position, mobile.width, mobile.height, mobile.top]).toEqual([
      "static",
      "auto",
      "auto",
      "auto",
    ]);
    expect(declarations(".main", "(max-width: 900px)").width).toBe("100%");
  });
  it("matches shared date and footer backgrounds to the guide and clears the desktop sidebar", () => {
    expect(declarations(body)).toEqual({ background: "#07111e" });
    expect(declarations(freshness)).toEqual({
      "box-sizing": "border-box",
      "max-width": "none",
      width: "calc(100% - 280px)",
      "margin-left": "280px",
      "margin-right": "0",
      "padding-right": "72px",
      background: "#07111e",
      color: "#a8b3c7",
      "justify-content": "flex-end",
    });
    expect(declarations(`${freshness} :global(time)`)).toEqual({ color: "#e8edf7" });
    expect(declarations(related)).toEqual({
      "--line": "#212e4a",
      "--card": "#0d1a2b",
      "--fg": "#e8edf7",
      "--muted": "#a8b3c7",
      "--accent": "#7c9eff",
      "box-sizing": "border-box",
      "max-width": "none",
      width: "calc(100% - 280px)",
      "margin-left": "280px",
      "margin-right": "0",
      "padding-left": "72px",
      "padding-right": "72px",
    });
    expect(declarations(`${freshness}, ${related}`, "(max-width: 900px)")).toEqual({
      width: "100%",
      "margin-left": "0",
      "padding-left": "20px",
      "padding-right": "20px",
    });
  });
  it("keeps code highlighting multi-colored with the original stylesheet token classes", () => {
    const blocks = nodes(main(), '[data-testid="code-block"]');
    expect(
      blocks.map((block) =>
        nodes(block, '[data-token="comment"]').map((element) => element.textContent)
      )
    ).toEqual(
      source.codes.map((code) =>
        code.text
          .split("\n")
          .filter((line) => line.trimStart().startsWith("#"))
          .map((line) => line.trimStart())
      )
    );
    for (const block of blocks)
      expect(
        nodes(block, "[data-token]").every(
          (element) => element.className === `hljs-${element.getAttribute("data-token")}`
        )
      ).toBe(true);
    expect(declarations(".layout :global(pre code)").background).toBe("none");
  });
  it("exports consistent metadata and registers the new guide for all derived navigation", () => {
    expect(metadata.title).toBe(`${source.title} | LLM コスト計算機`);
    const entry = findBySlug("/books/generative-ai-with-langchain");
    expect(entry).toMatchObject({
      slug: "/books/generative-ai-with-langchain",
      title: "Generative AI with LangChain",
      group: "推薦書籍",
      topics: ["book", "generative-ai", "langchain", "langgraph", "agent", "rag"],
      addedAt: "2026-10-11",
      lastReviewed: "2026-10-11",
    });
    expect(metadata.description).toBe(entry?.description);
  });
  it("uses Pure JSX without runtime source parsing or raw HTML injection", () => {
    const code = readFileSync("app/books/generative-ai-with-langchain/page.tsx", "utf8");
    expect(
      [
        ["danger", "ously", "Set", "Inner", "HTML"].join(""),
        "readFileSync",
        "source-contract",
        '"use client"',
      ].filter((needle) => code.includes(needle))
    ).toEqual([]);
  });
});
