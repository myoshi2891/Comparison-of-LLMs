// @vitest-environment jsdom
import fs from "node:fs";
import { cleanup, fireEvent, render } from "@testing-library/react";
import postcss from "postcss";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { pageRegistry } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import expected from "./source-contract.json";

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
    <div data-testid="mermaid" data-theme={theme} data-vars={JSON.stringify(themeVariables)}>
      {chart}
    </div>
  ),
}));
const text = (e: Element) => (e.textContent ?? "").replace(/\s+/g, " ").trim();
const css = () => fs.readFileSync("app/xai/grok-bot-guide/page.module.css", "utf8");
const globalCss = css;
const originalText = (e: Element) => {
  const clone = e.cloneNode(true) as Element;
  clone.querySelector('[data-testid="hero-dates"]')?.remove();
  return text(clone);
};
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const index = expected.toc.findIndex(([href]) => href === `#${this.id}`);
    return { top: index < 0 ? 100 : index * 1000, bottom: 200, height: 600 } as DOMRect;
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
for (const selector of [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "ul",
  "ol",
  "blockquote",
  "pre code",
] as const)
  it(`原本全文・順序・重複を保持: ${selector}`, () => {
    const { container } = render(<Page />);
    expect(
      Array.from(container.querySelectorAll(selector)).map((e) =>
        selector === "pre code" ? e.textContent : text(e)
      )
    ).toEqual(expected[selector]);
  });
for (const cls of ["hero", "footer", "meta"] as const)
  it(`原本の複合要素本文: ${cls}`, () => {
    const { container } = render(<Page />);
    expect(Array.from(container.querySelectorAll(`.${styles[cls]}`)).map(originalText)).toEqual(
      expected[`.${cls}`]
    );
  });
it("全77見出しのレベル・ID・本文と21セクションの境界を原本通り保持", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("h1,h2,h3,h4")).map((e) => [
      e.localName,
      e.getAttribute("id"),
      text(e),
    ])
  ).toEqual(expected.headings);
  expect(
    Array.from(container.querySelectorAll("section")).map((e) =>
      Array.from(e.querySelectorAll("h1,h2,h3,h4")).map((h) => [h.localName, h.id])
    )
  ).toEqual(expected.sections);
  let level = 0;
  for (const h of container.querySelectorAll("h1,h2,h3,h4")) {
    const next = Number(h.tagName[1]);
    expect(next - level).toBeLessThanOrEqual(1);
    level = next;
  }
});
it("30表の全セル・結合・順序と表直下の不正な空白ノード不在", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("table")).map((t) =>
      Array.from(t.querySelectorAll("tr")).map((r) =>
        Array.from(r.children).map((c) => [
          c.localName,
          c.getAttribute("colspan"),
          c.getAttribute("rowspan"),
          text(c),
        ])
      )
    )
  ).toEqual(expected.tables);
  expect(
    Array.from(container.querySelectorAll("table,thead,tbody,tr")).flatMap((e) =>
      Array.from(e.childNodes).filter((n) => n.nodeType === 3)
    )
  ).toEqual([]);
});
it("全リストの型・開始番号・直属項目・入れ子を原本と完全一致", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("ul,ol")).map((l) => [
      l.localName,
      l.getAttribute("start"),
      Array.from(l.children).map((e) => [e.localName, text(e)]),
      Array.from(l.querySelectorAll("ul,ol")).map((e) => e.localName),
    ])
  ).toEqual(expected.lists);
});
it("日本語・数字を含む目次21リンクの本文・順序・到達先・初期選択", () => {
  const { container, getByTestId } = render(<Page />);
  expect(getByTestId("sidebar-nav").getAttribute("aria-label")).toBe("目次");
  const links = Array.from(container.querySelectorAll('[data-testid="sidebar-nav-link"]'));
  expect(links.map((a) => [a.getAttribute("href"), text(a)])).toEqual(expected.toc);
  for (const [href] of expected.toc) {
    const heading = Array.from(container.querySelectorAll("h2")).find(
      (h) => h.closest("section")?.id === href.slice(1)
    );
    expect(heading?.localName).toBe("h2");
  }
  const ids = Array.from(container.querySelectorAll("h2,h3")).map((h) => h.id);
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
  expect(links.filter((a) => a.getAttribute("aria-current") === "location")).toEqual([links[0]]);
  expect(links[0].classList.contains(styles.active)).toBe(true);
});
it("外部51リンクはURL・本文・順序・安全属性を全件保持", () => {
  const { container } = render(<Page />);
  const links = Array.from(container.querySelectorAll('a[href^="http"]'));
  expect(links.map((a) => [a.getAttribute("href"), text(a)])).toEqual(expected.external);
  for (const a of links) {
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener noreferrer");
  }
  expect(
    Array.from(container.querySelectorAll("a")).filter(
      (a) =>
        !/^https?:/.test(a.getAttribute("href") ?? "") && a.getAttribute("href")?.includes(".html")
    )
  ).toEqual([]);
});
it("11図の全文・順序・テーマ・専用ラッパーと構文宣言", () => {
  const { container } = render(<Page />);
  const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
  expect(diagrams.map((e) => e.textContent)).toEqual(expected.diagrams);
  expect(
    Array.from(container.querySelectorAll(`.${styles["diagram-wrap"]} [data-testid="mermaid"]`))
  ).toEqual(diagrams);
  for (const e of diagrams) {
    expect(e.getAttribute("data-theme")).toBe("base");
    expect(JSON.parse(e.getAttribute("data-vars") ?? "{}")).toEqual(expected.theme);
    expect(e.textContent).toMatch(/^flowchart /);
    expect(e.textContent).not.toMatch(/^\s|block-beta/);
  }
});
it("10コード例の全文・改行・先頭空白とhighlight.js11.11.1の全トークン", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('[data-testid="code-block"] code')).map(
      (e) => e.textContent
    )
  ).toEqual(expected["pre code"]);
  expect(
    Array.from(container.querySelectorAll("pre code")).map((e) =>
      Array.from(e.querySelectorAll("span[class]")).map((s) => [s.className, s.textContent])
    )
  ).toEqual(expected.tokens);
});
it("stylesheet2件のURL・SRI・crossoriginを原本通り保持", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('link[rel="stylesheet"]')).map((e) => [
      e.getAttribute("href"),
      e.getAttribute("integrity"),
      e.getAttribute("crossorigin"),
    ])
  ).toEqual(expected.stylesheets);
});
it("原本チェック11項目をlabel/inputで保持し、全件クリックと取消しが可能", () => {
  const { container } = render(<Page />);
  const labels = Array.from(container.querySelectorAll(`li.${styles.check} label`));
  expect(labels.map(text)).toEqual(expected["li.check label"]);
  const boxes = labels.map((l) => l.querySelector("input") as HTMLInputElement);
  expect(boxes.map((b) => [b.type, b.checked])).toEqual(Array(11).fill(["checkbox", false]));
  boxes.forEach((b) => {
    fireEvent.click(b);
  });
  expect(boxes.map((b) => b.checked)).toEqual(Array(11).fill(true));
  boxes.forEach((b) => {
    fireEvent.click(b);
  });
  expect(boxes.map((b) => b.checked)).toEqual(Array(11).fill(false));
});
it("metadata・外殻・原本の情報基準日を保持", () => {
  expect(metadata.title).toBe(expected.h1[0]);
  expect(metadata.description).toBe(
    "Grok Bot の導入、依頼の書き方、Skill・Routine、承認と最小権限を学ぶ初学者向けガイド。情報基準日2026-10-24。"
  );
  const { getByTestId } = render(<Page />);
  expect(getByTestId("layout-root").classList.contains(styles.layout)).toBe(true);
});
it("registryへxAIカテゴリで登録し全導線へ導出", () => {
  expect(pageRegistry.find((p) => p.slug === "/xai/grok-bot-guide")).toEqual({
    slug: "/xai/grok-bot-guide",
    title: "Grok Bot 初学者ガイド",
    group: "Providers",
    category: "xAI",
    provider: "xai",
    topics: ["xai", "grok", "agent", "security", "automation"],
    summary:
      "Grok Bot の導入、依頼の書き方、Skill・Routine、承認と最小権限を学ぶ初学者向けガイド。",
    addedAt: "2026-11-05",
    lastReviewed: "2026-11-05",
  });
});
it("registryの日付をヒーロー内へ表示", () => {
  const { getByTestId, container } = render(<Page />);
  const dates = getByTestId("hero-dates");
  expect(dates.closest("header")).toBe(container.querySelector(`.${styles.hero}`));
  const entry = pageRegistry.find((p) => p.slug === "/xai/grok-bot-guide");
  expect(
    Array.from(dates.querySelectorAll("time")).map((e) => [e.dateTime, e.textContent])
  ).toEqual([
    [entry?.lastReviewed, entry?.lastReviewed],
    [entry?.addedAt, entry?.addedAt],
  ]);
});
const normalized = (s: string) => s.replace(/\s+/g, " ").trim().replace(/'/g, '"');
const scoped = (selector: string) =>
  selector
    .split(",")
    .map((s) => {
      s = s.trim();
      if ([":root", "html", "body"].includes(s)) return ".root";
      s = s.replace(/^body\.nav-open /, ".root.open ");
      s = s.replace(/(^|[ >+~])([a-z][a-z0-9-]*)(?=[\s.#:[>+~]|$)/g, "$1:global($2)");
      return s.startsWith(".root") ? s : `.root ${s}`;
    })
    .join(", ");
it("原本78 CSS規則の全宣言・media条件を保持（図の配置は共有部品へ委譲）", () => {
  const ast = postcss.parse(css());
  for (const source of expected.css) {
    if (
      [
        ".diagram-canvas svg",
        ".mermaidTooltip",
        ".diagram-canvas .nodeLabel,\n      .diagram-canvas .edgeLabel",
      ].includes(source.selector)
    )
      continue;
    const rules: postcss.Rule[] = [];
    ast.walkRules((r) => {
      if (
        normalized(r.selector) === normalized(scoped(source.selector)) &&
        (r.parent?.type === "atrule" ? (r.parent as postcss.AtRule).params : null) === source.media
      )
        rules.push(r);
    });
    expect(
      rules.map((r) =>
        r.nodes
          .filter((n) => n.type === "decl")
          .map((n) => {
            const d = n as postcss.Declaration;
            return [d.prop, normalized(d.value), !!d.important];
          })
      ),
      source.selector
    ).toContainEqual(
      source.declarations
        .filter(
          (d) =>
            ![".diagram-wrap", ".diagram-canvas"].includes(source.selector) ||
            !["display", "justify-content", "width"].includes(String(d[0]))
        )
        .map((d) => d.map((v) => (typeof v === "string" ? normalized(v) : v)))
    );
  }
});
const declarations = (source: string, selector: string) => {
  const result: Record<string, string> = {};
  postcss.parse(source).walkRules((r) => {
    if (r.parent?.type === "atrule") return;
    if (
      !r.selector
        .split(",")
        .map((s) => s.trim().replace(/:global\(([^)]+)\)/g, "$1"))
        .includes(selector.replace(/:global\(([^)]+)\)/g, "$1"))
    )
      return;
    r.walkDecls((d) => {
      result[d.prop] = d.value;
    });
  });
  return result;
};
it("リストの点・番号・入れ子と11チェックの装飾を復元", () => {
  expect(declarations(css(), ".root :global(ul)")["list-style-type"]).toBe("disc");
  expect(declarations(css(), ".root :global(ol)")["list-style-type"]).toBe("decimal");
  expect(declarations(css(), ".root .section :global(li).check")["list-style"]).toBe("none");
  expect(
    declarations(css(), ".root .section :global(li).check :global(input):checked").background
  ).toBe("var(--forest)");
  expect(declarations(css(), ".root :global(ul) :global(ul)")["list-style-type"]).toBe("circle");
  expect(declarations(css(), ".root :global(ul) :global(ul) :global(ul)")["list-style-type"]).toBe(
    "square"
  );
});
it("表全列左寄せ・アンカー余白・コードリセット・全幅・既定太字", () => {
  expect(css()).toMatch(
    /\.root :global\(th\),\s*\.root :global\(td\)\s*\{[^}]*text-align: left !important/
  );
  expect(css()).toContain("scroll-margin-top: calc(var(--header-height, 60px) + 80px)");
  expect(declarations(css(), ".root :global(pre code)").background).toBe("none");
  expect(declarations(css(), ".codeLine")["white-space"]).toBe("pre");
  expect(declarations(css(), ".layout").width).toBe("100%");
  for (const h of ["h1", "h2", "h3", "h4"])
    expect(declarations(css(), `.root .section :global(${h})`)["font-weight"]).toBe("700");
});
it("モバイル閉状態の不可視・操作不能と開状態の復元・共有ヘッダー高さ", () => {
  expect(css()).toMatch(
    /@media \(max-width: 960px\)[\s\S]*?\.root \.sidebar\s*\{[^}]*visibility: hidden;[^}]*pointer-events: none/
  );
  expect(css()).toMatch(
    /\.root\.open \.sidebar\s*\{[^}]*visibility: visible;[^}]*pointer-events: auto/
  );
  expect(declarations(css(), ".root .sidebar").top).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  const body = declarations(globalCss(), "body:has(.root).has-common-header");
  expect(body["margin-top"]).toBe("0");
  expect(body["padding-top"]).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(declarations(globalCss(), "body:has(.root) #site-freshness-bar").display).toBe("none");
});
it("生HTML注入・実行script・ページ側SVGサイズ強制を禁止", () => {
  const source = fs.readFileSync("app/xai/grok-bot-guide/page.tsx", "utf8");
  expect(source).not.toContain(["danger", "ously", "Set", "Inner", "HTML"].join(""));
  expect(source).not.toContain("<script");
  expect(css()).not.toMatch(/:global\(svg\)/);
});

it("モバイル目次とscrimは実測バーの下に配置しトグルを覆わない", () => {
  const tops: Record<string, string> = {};
  postcss.parse(css()).walkAtRules("media", (media) => {
    if (media.params !== "(max-width: 960px)") return;
    media.walkRules((rule) => {
      rule.walkDecls("top", (decl) => {
        tops[rule.selector] = decl.value;
      });
    });
  });
  for (const selector of [".root .sidebar", ".root .scrim"])
    expect(tops[selector]).toBe(
      "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px) + var(--mobile-bar-height))"
    );
});

it("原本の高詳細度アンカー規則を補正し全見出しの実効余白を確保する", () => {
  const ast = postcss.parse(css());
  for (const mobile of [false, true]) {
    for (const heading of ["h1", "h2", "h3"]) {
      const host = document.createElement("div");
      host.className = "root";
      const section = document.createElement("section");
      section.className = "section";
      const node = document.createElement(heading);
      host.append(section);
      section.append(node);
      let value = "",
        specificity = -1;
      ast.walkRules((rule) => {
        if (
          rule.parent?.type === "atrule" &&
          (!mobile || (rule.parent as postcss.AtRule).params !== "(max-width: 960px)")
        )
          return;
        for (const source of rule.selector.split(",")) {
          const selector = source.trim().replace(/:global\(([^)]+)\)/g, "$1");
          if (!node.matches(selector)) continue;
          const rank =
            (selector.match(/\.[\w-]+/g) ?? []).length * 100 +
            (selector.match(/(?:^|\s)[a-z][\w-]*/g) ?? []).length;
          rule.walkDecls("scroll-margin-top", (decl) => {
            const score = rank + (decl.important ? 10000 : 0);
            if (score >= specificity) {
              specificity = score;
              value = decl.value;
            }
          });
        }
      });
      expect(value, `${heading}, mobile=${mobile}`).toBe("calc(var(--header-height, 60px) + 80px)");
    }
  }
});

it("原本の全装飾クラスを同じタグへ同じ順序で適用", () => {
  const { container } = render(<Page />);
  const sourceLayout = container.querySelector(`.${styles.root} > .${styles.layout}`) as Element;
  for (const [cls, tags] of Object.entries(expected.classElements)) {
    const nodes =
      cls === "layout"
        ? [sourceLayout]
        : Array.from(sourceLayout.querySelectorAll(`.${styles[cls]}`));
    expect(
      nodes.map((e) => e.localName),
      cls
    ).toEqual(tags);
  }
});
it("目次リンクの通常・hover・active色は共有リンク規則より優先される", () => {
  const sheet = css();
  expect(declarations(sheet, ".root .nav-a").color).toBe("var(--ink)");
  expect(declarations(sheet, ".root .nav-a:hover").background).toBe("var(--paper-alt)");
  expect(declarations(sheet, ".root .nav-a.active").color).toBe("var(--indigo)");
  expect(declarations(sheet, ".root .nav-a.active")["border-left-color"]).toBe("var(--indigo)");
});

it("共通bodyクラスと鮮度バーIDをCSS Modulesでハッシュ化しない", () => {
  const selectors: string[] = [];
  postcss.parse(css()).walkRules((rule) => {
    if (rule.selector.startsWith("body:has(.root)")) selectors.push(rule.selector);
  });
  expect(selectors).toContain("body:has(.root):global(.has-common-header)");
  expect(selectors).toContain("body:has(.root) :global(#site-freshness-bar)");
  expect(
    selectors.some((s) => s.includes(").has-common-header") || s.includes(") #site-freshness-bar"))
  ).toBe(false);
});

it("引用段落とチェック項目は原本の親要素から文字色を継承する", () => {
  // Root already supplies the normal ink; leaf overrides would erase quote/check colors.
  const sheet = css();
  for (const selector of [".root .section :global(p)", ".root .section :global(li)"]) {
    expect(declarations(sheet, selector).color ?? "inherit").toBe("inherit");
  }
  expect(declarations(sheet, ".root .section :global(blockquote)").color).toBe("#3d3520");
  expect(
    declarations(sheet, ".root .section :global(li).check:has(:global(input):checked)").color
  ).toBe("var(--ink-soft)");
});
