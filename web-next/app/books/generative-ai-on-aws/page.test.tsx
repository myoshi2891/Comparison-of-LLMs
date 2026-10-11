import { readFileSync } from "node:fs";
import { fireEvent, render } from "@testing-library/react";
import { parse } from "postcss";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import source from "./source-contract.json";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: (props: {
    chart: string;
    id: string;
    theme: string;
    themeVariables: object;
    flowchartHtmlLabels: boolean;
  }) => (
    <pre
      id={props.id}
      data-testid="mermaid"
      data-theme={props.theme}
      data-vars={JSON.stringify(props.themeVariables)}
      data-labels={String(props.flowchartHtmlLabels)}
    >
      {props.chart}
    </pre>
  ),
}));
const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));
const main = () => render(<Page />).container.querySelector("main") as HTMLElement;
const css = readFileSync("app/books/generative-ai-on-aws/page.module.css", "utf8");
const cssNormalize = (value: string) =>
  normalize(value)
    .replace(/'/g, '"')
    .replace(/\s*,\s*/g, ", ");
const rules: { selector: string; media: string | null; declarations: Record<string, string> }[] =
  [];
parse(css).walkRules((rule) => {
  rules.push({
    selector: cssNormalize(rule.selector),
    media: rule.parent?.type === "atrule" ? rule.parent.params : null,
    declarations: Object.fromEntries(
      rule.nodes
        .filter((node) => node.type === "decl")
        .map((node) => [node.prop, cssNormalize(node.value)])
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
      (rule) =>
        rule.selector === cssNormalize(selector) &&
        rule.media === media &&
        Object.entries(declarations).every(
          ([property, value]) => rule.declarations[property] === cssNormalize(value)
        )
    ),
    selector
  ).toBe(true);
}

describe("Generative AI on AWS — frozen source contracts", () => {
  it("preserves every H2 in order", () => expect(nodes(main(), "h2").map(text)).toEqual(source.h2));
  it("preserves the absence of H3 and all author H4 headings", () => {
    expect(nodes(main(), "h3").map(text)).toEqual(source.h3);
    expect(nodes(main(), "h4").map(text)).toEqual(
      source.headings.filter((heading) => heading.tag === "h4").map((heading) => heading.text)
    );
  });
  it("preserves H1 and every heading level and wording", () => {
    expect(nodes(main(), "h1").map(text)).toEqual(source.h1);
    expect(
      nodes(main(), "h1,h2,h3,h4").map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: text(element),
      }))
    ).toEqual(source.headings.map(({ tag, text: wording }) => ({ tag, text: wording })));
  });
  it("preserves every paragraph including the information date", () =>
    expect(nodes(main(), "p").map(text)).toEqual(source.paragraphs));
  it("preserves all links with order, wording and multiplicity", () =>
    expect(
      nodes(main(), "a").map((element) => ({
        href: element.getAttribute("href"),
        text: text(element),
      }))
    ).toEqual(source.links));
  it("preserves every list type and complete item in order", () =>
    expect(
      nodes(main(), "ul,ol").map((element) => ({
        tag: element.tagName.toLowerCase(),
        type: element.getAttribute("type"),
        items: Array.from(element.children)
          .filter((child) => child.tagName === "LI")
          .map(text),
      }))
    ).toEqual(source.lists));
  it("preserves all table cells and header tags", () =>
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
  it("contains no invalid text nodes in table structure", () => {
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
  it("preserves all callout classes and full contents", () =>
    expect(
      nodes(main(), `.${styles.callout}`).map((element) => ({
        classes: Array.from(element.classList),
        text: text(element),
      }))
    ).toEqual(
      source.callouts.map((callout) => ({
        classes: callout.classes.map((name) => styles[name]),
        text: callout.text,
      }))
    ));
  it("preserves all 23 reference cards including URL text", () =>
    expect(nodes(main(), `.${styles.refCard}`).map(text)).toEqual(source.refs));
  it("preserves all twelve chapter numbers and tags", () =>
    expect(nodes(main(), `.${styles.stepMarker}`).map(text)).toEqual(source.steps));
  it("preserves every styled content element", () =>
    expect(
      nodes(main(), "[class]").map((element) => ({
        tag: element.tagName.toLowerCase(),
        classes: Array.from(element.classList),
      }))
    ).toEqual(
      source.styledNodes.map((element) => ({
        tag: element.tag,
        classes: element.classes.map((name) => styles[name]),
      }))
    ));
  it("preserves TOC link labels, groups and order", () =>
    expect(
      nodes(render(<Page />).getByTestId("sidebar-nav"), "a").map((element) => ({
        href: element.getAttribute("href"),
        text: text(element),
      }))
    ).toEqual(source.toc));
  it("resolves every TOC anchor and has unique IDs", () => {
    const { container } = render(<Page />);
    const ids = nodes(container, "[id]").map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const link of source.toc)
      expect(
        nodes(container, "[id]").filter((element) => element.id === link.href.slice(1))
      ).toHaveLength(1);
    expect(nodes(container, "h2").map((element) => element.closest("section")?.id)).toEqual(
      source.toc.map((link) => link.href.slice(1))
    );
  });
  it("activates exactly the first TOC link initially", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      return { top: this.id === "intro" ? 0 : 1000 } as DOMRect;
    });
    expect(
      nodes(render(<Page />).container, `.${styles.navA}.${styles.active}`).map((element) =>
        element.getAttribute("href")
      )
    ).toEqual([source.toc[0].href]);
    vi.restoreAllMocks();
  });
  it("preserves Mermaid source, order, wrappers and theme", () => {
    const root = main();
    const charts = nodes(root, '[data-testid="mermaid"]');
    expect(charts.map((element) => element.textContent)).toEqual(source.charts);
    expect(nodes(root, `.${styles.diagramWrap} > [data-testid="mermaid"]`)).toEqual(charts);
    expect(charts.map((element) => element.id)).toEqual(
      source.chartKeys.map((key) => `aws-diagram-${key}`)
    );
    for (const chart of charts) {
      expect(chart.getAttribute("data-theme")).toBe("base");
      expect(JSON.parse(chart.getAttribute("data-vars") ?? "{}")).toEqual(source.theme);
      expect(chart.getAttribute("data-labels")).toBe("false");
      expect(chart.textContent).toMatch(/^flowchart /);
      expect(chart.textContent).not.toContain("block-beta");
    }
  });
  it("preserves all stylesheet URLs", () =>
    expect(
      nodes(render(<Page />).container, 'link[rel="stylesheet"]').map((element) =>
        element.getAttribute("href")
      )
    ).toEqual(source.stylesheets));
  it("preserves all source CSS rules except documented shared layout adaptations", () => {
    for (const rule of source.cssRules) hasRule(rule.selector, rule.declarations, rule.media);
  });
  it("restores bullets, decimal numbers and unmarked navigation/checklist", () => {
    hasRule(".layout :global(ul)", { "list-style-type": "disc" });
    hasRule(".layout :global(ol)", { "list-style-type": "decimal" });
    hasRule(".layout .sidebarNav, .layout .checklist", { "list-style": "none", padding: "0" });
  });
  it("forces all table columns left and clears anchors below the header", () => {
    hasRule(
      ".layout :global(th), .layout :global(td), .layout :global(thead th:not(:first-child))",
      { "text-align": "left" }
    );
    expect(css).toMatch(/text-align:\s*left\s*!important/);
    hasRule(
      ".layout :global(h2), .layout :global(h3), .layout :global(h4), .layout :global(section)",
      { "scroll-margin-top": "calc(var(--header-height, 60px) + 80px)" }
    );
  });
  it("fills the available content width and positions the mobile toolbar below the header", () => {
    expect(
      render(<Page />)
        .getByTestId("layout-root")
        .classList.contains(styles.layout)
    ).toBe(true);
    hasRule(".layout", { width: "100%" });
    hasRule(".sidebar", {
      top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
    });
    hasRule(".mobileBar", {
      top: "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))",
    });
    hasRule(".sidebar", { visibility: "hidden", "pointer-events": "none" }, "(max-width: 980px)");
    hasRule(
      ".sidebar.open",
      { visibility: "visible", "pointer-events": "auto" },
      "(max-width: 980px)"
    );
  });
  it("preserves checklist labels, initial counter and checked styles", () => {
    const root = main();
    expect(nodes(root, ".checklist-unused")).toEqual([]);
    expect(
      nodes(root, 'input[type="checkbox"]').map((element) => (element as HTMLInputElement).checked)
    ).toEqual(Array(13).fill(false));
    expect(root.querySelector("#checklistCounterText")?.textContent).toBe("0 / 13 完了");
    hasRule('.checklist :global(input)[type="checkbox"]:checked', {
      background: "var(--forest)",
      "border-color": "var(--forest)",
    });
  });
  it("counts every actual checkbox and reverses checked styling", () => {
    const root = main();
    const boxes = nodes(root, 'input[type="checkbox"]');
    for (const box of boxes) fireEvent.click(box);
    expect(root.querySelector("#checklistCounterText")?.textContent).toBe("13 / 13 完了");
    expect(nodes(root, `.${styles.checklist} li.${styles.done}`).map(text)).toEqual(
      source.lists.find((list) => list.items.length === 13)?.items
    );
    for (const box of boxes) fireEvent.click(box);
    expect(root.querySelector("#checklistCounterText")?.textContent).toBe("0 / 13 完了");
    expect(nodes(root, `.${styles.checklist} li.${styles.done}`)).toEqual([]);
  });
  it("uses clean internal links and safe external links", () => {
    const root = main();
    expect(nodes(root, 'a[href*=".html"]')).toEqual([]);
    for (const link of nodes(root, 'a[href^="http"]'))
      expect([link.getAttribute("target"), link.getAttribute("rel")]).toEqual([
        "_blank",
        "noopener noreferrer",
      ]);
  });
  it("keeps Mermaid sizing in the shared component and preserves classDef colors", () => {
    expect(
      rules
        .filter(
          (rule) =>
            rule.selector.includes(":global(svg)") || rule.selector.includes(":global(.mermaid)")
        )
        .flatMap((rule) =>
          Object.keys(rule.declarations).filter((property) =>
            ["width", "max-width", "height", "max-height", "display"].includes(property)
          )
        )
    ).toEqual([]);
    hasRule(".diagramWrap :global(.hub text)", { fill: "#221f52" });
    hasRule(".diagramWrap :global(.done text)", { fill: "#123722" });
  });
  it("exports exact metadata and avoids raw HTML injection", () => {
    expect(metadata.title).toBe(`${source.title} | LLM コスト計算機`);
    expect(metadata.description).toBe(
      "『Generative AI on AWS』の全12章を、生成AIの基礎から最適化・RAG・マルチモーダル・Amazon Bedrockまで順に学ぶ初学者向けガイド。2026年9月10日時点の補足情報、13項目のチェックリストと23件の出典を収録。"
    );
    expect(readFileSync("app/books/generative-ai-on-aws/page.tsx", "utf8")).not.toContain(
      ["danger", "ously", "SetInnerHTML"].join("")
    );
  });
  it("permits only the three original author heading skips", () => {
    let previous = 0;
    const skips: string[] = [];
    for (const heading of nodes(main(), "h1,h2,h3,h4")) {
      const level = Number(heading.tagName.slice(1));
      if (level > previous + 1) skips.push(text(heading));
      previous = level;
    }
    expect(skips).toEqual(["Chris Fregly"]);
  });
  it("registers the page in Recommended Books", () =>
    expect(findBySlug("/books/generative-ai-on-aws")).toMatchObject({
      slug: "/books/generative-ai-on-aws",
      group: "推薦書籍",
      addedAt: "2026-10-11",
      lastReviewed: "2026-10-11",
    }));
});
