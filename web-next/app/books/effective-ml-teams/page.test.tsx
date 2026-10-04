// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { parse } from "postcss";
import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
// Frozen from the original HTML before implementation; never derive from JSX.
import source from "./source-contract.json";

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
    <pre
      data-testid="mermaid"
      data-theme={theme}
      data-theme-variables={JSON.stringify(themeVariables)}
    >
      {chart}
    </pre>
  ),
}));
vi.mock("./TocObserver", () => ({ default: () => null }));
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
const text = (e: Element) => normalize(e.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
const main = () => render(<Page />).container.querySelector("main") as HTMLElement;
const css = readFileSync("app/books/effective-ml-teams/page.module.css", "utf8");
const cssNormalize = (s: string) =>
  normalize(s)
    .replace(/'/g, '"')
    .replace(/\s*,\s*/g, ", ");
const rules: { selector: string; media: string | null; declarations: Record<string, string> }[] =
  [];
parse(css).walkRules((r) => {
  rules.push({
    selector: cssNormalize(r.selector),
    media: r.parent?.type === "atrule" ? r.parent.params : null,
    declarations: Object.fromEntries(
      r.nodes.filter((n) => n.type === "decl").map((n) => [n.prop, cssNormalize(n.value)])
    ),
  });
});
function hasRule(
  selector: string,
  declarations: Record<string, string>,
  media: string | null = null
) {
  expect(
    rules.some(
      (r) =>
        r.selector === selector &&
        r.media === media &&
        Object.entries(declarations).every(([k, v]) => r.declarations[k] === cssNormalize(v))
    ),
    selector
  ).toBe(true);
}

describe("/books/effective-ml-teams — complete source contracts", () => {
  it("S-1: every h2 preserves full wording and order", () => {
    expect(nodes(main(), "h2").map(text)).toEqual(source.h2);
  });
  it("S-2: every h3 preserves full wording and order", () => {
    expect(nodes(main(), "h3").map(text)).toEqual(source.h3);
  });
  it("C-1: h1 and all heading IDs and levels match the source", () => {
    expect(nodes(main(), "h1").map(text)).toEqual(source.h1);
    expect(
      nodes(main(), "h1,h2,h3,h4,h5,h6").map((e) => ({
        tag: e.tagName.toLowerCase(),
        id: e.getAttribute("id"),
        text: text(e),
      }))
    ).toEqual(source.headings);
  });
  it("S-3: all citations and external links preserve URLs, wording, order and multiplicity", () => {
    expect(
      nodes(main(), "a").map((e) => ({ href: e.getAttribute("href"), text: text(e) }))
    ).toEqual(source.links);
  });
  it("S-4: every heading has a unique anchor and every TOC/citation anchor resolves", () => {
    const { container } = render(<Page />);
    const ids = nodes(container, "[id]").map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const h of nodes(container, "h2,h3")) expect(h.id).toMatch(/\S+/);
    for (const a of nodes(container, 'a[href^="#"]'))
      expect(
        nodes(container, "[id]").filter((e) => e.id === a.getAttribute("href")?.slice(1))
      ).toHaveLength(1);
    const headingIds = nodes(container, "h2,h3").map((e) => e.id);
    expect(
      nodes(container, '[data-testid="sidebar-nav-link"]').map((e) =>
        e.getAttribute("href")?.slice(1)
      )
    ).toEqual(headingIds);
  });
  it("C-2/D-5: every nested TOC link preserves wording, order and target", () => {
    const root = render(<Page />).getByTestId("sidebar-nav");
    expect(
      nodes(root, '[data-testid="sidebar-nav-link"]').map((e) => ({
        href: e.getAttribute("href"),
        text: text(e),
      }))
    ).toEqual(source.toc);
  });
  it("C-3: exactly the first TOC link starts active", () => {
    expect(
      nodes(render(<Page />).container, `[data-testid="sidebar-nav-link"].${styles.active}`).map(
        (e) => e.getAttribute("href")
      )
    ).toEqual([source.toc[0].href]);
  });
  it("C-4: every external link has both safety attributes", () => {
    expect(
      nodes(main(), 'a[href^="http"]').map((e) => [e.getAttribute("target"), e.getAttribute("rel")])
    ).toEqual(
      source.links
        .filter((e) => e.href.startsWith("http"))
        .map(() => ["_blank", "noopener noreferrer"])
    );
  });
  it("C-5: all internal document links use clean routes", () => {
    expect(
      nodes(main(), 'a:not([href^="http"])')
        .map((e) => e.getAttribute("href"))
        .filter((h) => h?.includes(".html"))
    ).toEqual([]);
  });
  it("C-6: every Mermaid source, order, wrapper and original theme is preserved", () => {
    const root = main();
    const charts = nodes(root, '[data-testid="mermaid"]');
    expect(charts.map((e) => (e.textContent ?? "").trim())).toEqual(source.charts);
    expect(nodes(root, `.${styles.mermaidWrap} > [data-testid="mermaid"]`)).toEqual(charts);
    for (const chart of charts) {
      expect(chart.getAttribute("data-theme")).toBe("base");
      expect(JSON.parse(chart.getAttribute("data-theme-variables") ?? "{}")).toEqual(source.theme);
      expect((chart.textContent ?? "").split("\n")[0]).toMatch(
        /^(flowchart|graph|sequenceDiagram|stateDiagram-v2)\b/
      );
      expect(chart.textContent).not.toContain("block-beta");
    }
  });
  it("all paragraphs preserve full wording, citations and order", () => {
    expect(
      nodes(main(), "p")
        .filter((e) => !e.closest('[data-testid="mermaid"]'))
        .map(text)
    ).toEqual(source.paragraphs);
  });
  it("every list preserves ul/ol, numbering type and all items in order", () => {
    expect(
      nodes(main(), "ul,ol").map((e) => ({
        tag: e.tagName.toLowerCase(),
        type: e.getAttribute("type"),
        items: Array.from(e.children)
          .filter((c) => c.tagName === "LI")
          .map(text),
      }))
    ).toEqual(source.lists);
  });
  it("all tables preserve every cell, header type, row and order", () => {
    expect(
      nodes(main(), "table").map((e) =>
        nodes(e, "tr").map((r) =>
          Array.from(r.children).map((c) => ({ tag: c.tagName.toLowerCase(), text: text(c) }))
        )
      )
    ).toEqual(source.tables);
  });
  it("table elements contain only valid structural elements and no text nodes", () => {
    const failures: string[] = [];
    function walk(node: ReactNode) {
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (!node || typeof node !== "object" || !("props" in node)) return;
      const e = node as ReactElement<{ children?: ReactNode }>;
      const allowed: Record<string, string[]> = {
        table: ["thead", "tbody", "tfoot", "caption", "colgroup"],
        thead: ["tr"],
        tbody: ["tr"],
        tfoot: ["tr"],
        tr: ["td", "th"],
      };
      if (typeof e.type === "string" && allowed[e.type]) {
        const children = Array.isArray(e.props.children) ? e.props.children : [e.props.children];
        for (const child of children) {
          if (
            child &&
            (typeof child !== "object" ||
              !("type" in child) ||
              !allowed[e.type].includes(String(child.type)))
          )
            failures.push(e.type);
        }
      }
      walk(e.props.children);
    }
    walk(Page());
    expect(failures).toEqual([]);
  });
  it("D-1: all practice/source callouts retain variants, tags and complete wording", () => {
    expect(
      nodes(main(), '[data-testid="callout"]').map((e) => ({
        variant: e.getAttribute("data-variant"),
        tag: e.tagName.toLowerCase(),
        text: text(e),
      }))
    ).toEqual(source.callouts);
  });
  it("all quotations retain their complete original text without adding an attribution", () => {
    expect(nodes(main(), "blockquote").map(text)).toEqual(source.quotes);
  });
  it("all reference cards retain their IDs, numbered badges and full text", () => {
    expect(
      nodes(main(), `.${styles.refCard}`).map((e) => ({
        id: e.id,
        number: text(e.querySelector(`.${styles.refBadge}`) as Element),
        text: text(e),
      }))
    ).toEqual(source.refs);
  });
  it("every original styled element retains its tag and local classes", () => {
    expect(
      nodes(main(), "[class]")
        .filter((e) => !e.classList.contains(styles.mermaidWrap))
        .map((e) => ({ tag: e.tagName.toLowerCase(), classes: Array.from(e.classList) }))
    ).toEqual(
      source.styledNodes.map((e) => ({ tag: e.tag, classes: e.classes.map((c) => styles[c]) }))
    );
  });
  it("D-8: layout fills the page and main uses all available sidebar space", () => {
    expect(
      render(<Page />)
        .getByTestId("layout-root")
        .classList.contains(styles.layout)
    ).toBe(true);
    hasRule(".layout", { width: "100%", "max-width": "100%" });
    hasRule(".main", { "min-width": "0", width: "calc(100% - var(--sidebar-w))" });
    hasRule(".main", { width: "100%" }, "(max-width: 900px)");
  });
  it("all original CSS declarations and responsive rules survive scoped transfer", () => {
    for (const rule of source.cssRules)
      hasRule(cssNormalize(rule.selector), rule.declarations, rule.media);
  });
  it("bullet points and decimal numbering override reset styles without marking TOC/checklist", () => {
    hasRule(".layout :global(ul)", { "list-style-type": "disc" });
    hasRule(".layout :global(ol)", { "list-style-type": "decimal" });
    hasRule(".layout .navList, .layout .navSub, .layout :global(ul).checklistList", {
      "list-style": "none",
      padding: "0",
    });
  });
  it("all table columns are forced left and anchors clear the header plus disclaimer", () => {
    hasRule(
      ".layout :global(th), .layout :global(td), .layout :global(thead th:not(:first-child))",
      { "text-align": "left" }
    );
    expect(css).toMatch(/text-align:\s*left\s*!important/);
    hasRule(".layout :global(h2), .layout :global(h3), .layout .refCard", {
      "scroll-margin-top":
        "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px) + 80px)",
    });
  });
  it("sidebar and toolbar clear the shared header and closed mobile TOC is inaccessible", () => {
    hasRule(".sidebar", {
      top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
      height: "calc(100dvh - var(--header-height, 60px) - var(--ch-disclaimer-height, 0px))",
    });
    hasRule(".sidebarToggle", {
      top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px) + 14px)",
    });
    hasRule(".sidebar", { visibility: "hidden", "pointer-events": "none" }, "(max-width: 900px)");
    hasRule(
      ".sidebar.open",
      { visibility: "visible", "pointer-events": "auto" },
      "(max-width: 900px)"
    );
  });
  it("checklist starts at zero, retains all original labels and custom checked styles", () => {
    const root = main();
    expect(nodes(root, `.${styles.checklistList} label`).map(text)).toEqual(
      source.lists.find((e) => e.items.length === 12)?.items
    );
    expect(
      nodes(root, 'input[type="checkbox"]').map((e) => (e as HTMLInputElement).checked)
    ).toEqual(Array(12).fill(false));
    expect(root.querySelector(`.${styles.checklistCounter}`)?.textContent).toBe("0 / 12 完了");
    hasRule(".layout :global(input).clCheck:checked", {
      background: "var(--accent)",
      "border-color": "var(--accent)",
    });
    hasRule(
      ".layout :global(ul).checklistList :global(li):has(:global(input):checked) :global(label)",
      { "text-decoration": "line-through" }
    );
  });
  it("Mermaid layout is owned by the shared component", () => {
    expect(
      rules
        .filter(
          (r) => r.selector.includes(":global(svg)") || r.selector.includes(":global(.mermaid)")
        )
        .flatMap((r) =>
          Object.keys(r.declarations).filter((k) =>
            ["width", "max-width", "height", "max-height", "display", "justify-content"].includes(k)
          )
        )
    ).toEqual([]);
  });
  it("Q-2: metadata retains the original full document title and a precise description", () => {
    expect(metadata.title).toBe(`${source.title} | LLM コスト計算機`);
    expect(metadata.description).toBe(
      "『Effective Machine Learning Teams』を土台に、プロダクト開発、依存関係管理、テスト、MLOps・CD4ML、チームと組織の設計を学ぶ入門ガイド。全11図解、12項目の実践チェックリスト、18件の参考文献を収録。"
    );
  });
  it("Q-3: heading levels do not skip", () => {
    let previous = 0;
    for (const h of nodes(main(), "h1,h2,h3,h4,h5,h6")) {
      const level = Number(h.tagName.slice(1));
      expect(level).toBeLessThanOrEqual(previous + 1);
      previous = level;
    }
  });
  it("new page is registered in Recommended Books with source date and migration date separated", () => {
    expect(findBySlug("/books/effective-ml-teams")).toMatchObject({
      slug: "/books/effective-ml-teams",
      title: "Effective Machine Learning Teams 入門ガイド",
      group: "推薦書籍",
      addedAt: "2026-10-04",
      lastReviewed: "2026-10-04",
      topics: ["mlops", "machine-learning", "testing", "team-topologies", "cd4ml"],
    });
    expect(nodes(main(), `.${styles.disclaimer}`).map(text)).toEqual(source.paragraphs.slice(-1));
  });
});
