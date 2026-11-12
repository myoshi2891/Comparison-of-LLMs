// @vitest-environment jsdom
import fs from "node:fs";
import { cleanup, fireEvent, render } from "@testing-library/react";
import postcss from "postcss";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MERMAID_DIAGRAM_DECLARATION } from "@/lib/mermaid-diagram-types";
import { pageRegistry } from "@/lib/page-registry";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import expected from "./source-contract.json";
import expectedTree from "./structure-contract.json";

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
/** DOM本文の比較用に連続空白を正規化する。 */
const text = (e: Element) => (e.textContent ?? "").replace(/\s+/g, " ").trim();
/** ページ固有のCSSを原本との照合用に読み込む。 */
const css = () => fs.readFileSync("app/codex/best-practices/page.module.css", "utf8");
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
  it(`全文・順序・重複を保持: ${selector}`, () => {
    const { container } = render(<Page />);
    expect(
      Array.from(container.querySelectorAll(selector)).map((e) =>
        selector === "pre code" ? e.textContent : text(e)
      )
    ).toEqual(expected[selector]);
  });
for (const cls of ["hero", "foot", "brand"] as const)
  it(`複合要素の原文を保持: ${cls}`, () => {
    const { container } = render(<Page />);
    expect(
      Array.from(container.querySelectorAll(`.${styles[cls]}`)).map((e) => {
        const clone = e.cloneNode(true) as Element;
        clone.querySelector('[data-testid="hero-dates"]')?.remove();
        return text(clone);
      })
    ).toEqual(expected[`.${cls}`]);
  });
it("全見出しのレベルと原文、21セクションの境界を保持", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("h1,h2,h3,h4")).map((e) => [e.localName, text(e)])
  ).toEqual(expected.headings.map(([tag, _id, txt]) => [tag, txt]));
  expect(
    Array.from(container.querySelectorAll("section")).map((e) => [
      e.id,
      Array.from(e.querySelectorAll("h1,h2,h3,h4")).map((h) => [h.localName, text(h)]),
    ])
  ).toEqual(expected.sections);
  let level = 0;
  for (const h of container.querySelectorAll("h1,h2,h3,h4")) {
    const next = Number(h.tagName[1]);
    expect(next - level).toBeLessThanOrEqual(1);
    level = next;
  }
});
it("26表177行のセル型・結合・全文と不正空白ノード不在", () => {
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
it("全リストの型・開始番号・直属項目・入れ子を完全一致", () => {
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
it("目次21リンクの文言・順序・到達先と初期選択", () => {
  const { container, getByTestId } = render(<Page />);
  expect(getByTestId("sidebar-nav").getAttribute("aria-label")).toBe("ページ内ナビゲーション");
  const links = Array.from(container.querySelectorAll('[data-testid="sidebar-nav-link"]'));
  expect(links.map((a) => [a.getAttribute("href"), text(a)])).toEqual(expected.toc);
  for (const [href] of expected.toc)
    expect(container.querySelector(href)?.querySelector("h2")?.textContent?.trim()).toBe(
      expected.h2[expected.toc.findIndex(([h]) => h === href)]
    );
  const ids = Array.from(container.querySelectorAll("h2,h3,h4")).map((h) => h.id);
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
  expect(links.filter((a) => a.getAttribute("aria-current") === "location")).toEqual([links[0]]);
  expect(links[0].classList.contains(styles.active)).toBe(true);
});
it("外部160リンクのURL・本文・順序・安全属性と内部リンクを保持", () => {
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
it("12図の全文・順序・ラッパー・テーマ・左端配置", () => {
  const { container } = render(<Page />);
  const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
  expect(diagrams.map((e) => e.textContent)).toEqual(expected.diagrams);
  expect(
    Array.from(container.querySelectorAll(`.${styles["diagram-wrap"]} [data-testid="mermaid"]`))
  ).toEqual(diagrams);
  for (const e of diagrams) {
    expect(e.getAttribute("data-theme")).toBe("base");
    expect(JSON.parse(e.getAttribute("data-vars") ?? "{}")).toEqual(expected.theme);
    expect(e.textContent).toMatch(MERMAID_DIAGRAM_DECLARATION);
    expect(e.textContent).not.toMatch(/^\s|block-beta/);
  }
});
it("16コード例の改行・先頭空白とhighlight.js11.11.0全トークン", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('[data-testid="code-block"] code')).map(
      (e) => e.textContent
    )
  ).toEqual(expected["pre code"]);
  expect(
    Array.from(container.querySelectorAll("pre code")).map((e) =>
      Array.from(e.querySelectorAll("span[class]"))
        .filter((s) => !s.classList.contains(styles.codeLine))
        .map((s) => [s.className, s.textContent])
    )
  ).toEqual(expected.tokens);
});
it("原本の外部stylesheetを全件保持", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('link[rel="stylesheet"]')).map((e) => [
      e.getAttribute("href"),
      e.getAttribute("integrity"),
      e.getAttribute("crossorigin"),
    ])
  ).toEqual(expected.stylesheets);
});
it("19の表形式チェック・全項目の集計・行の取消線を保持", () => {
  const { container } = render(<Page />);
  const boxes = Array.from(
    container.querySelectorAll<HTMLInputElement>(`label.${styles.chk} input`)
  );
  expect(
    boxes.map((b) => [b.getAttribute("aria-label"), text(b.closest("tr") as Element)])
  ).toEqual(expected.checks);
  expect(boxes.map((b) => [b.type, b.checked])).toEqual(
    expected.checks.map(() => ["checkbox", false])
  );
  const count = container.querySelector("#chkDone");
  expect(count?.parentElement?.textContent).toBe("進捗: 0 / 19");
  for (let i = 0; i < boxes.length; i++) {
    fireEvent.click(boxes[i]);
    expect(count?.textContent).toBe(String(i + 1));
    expect(boxes.map((b) => b.closest("tr")?.classList.contains(styles.done))).toEqual(
      boxes.map((_, j) => j <= i)
    );
  }
  for (let i = 0; i < boxes.length; i++) {
    fireEvent.click(boxes[i]);
    expect(count?.textContent).toBe(String(boxes.length - i - 1));
    expect(boxes.map((b) => b.closest("tr")?.classList.contains(styles.done))).toEqual(
      boxes.map((_, j) => j > i)
    );
  }
  expect(container.querySelectorAll("[data-check-bar]")).toHaveLength(0);
  const ids = Array.from(container.querySelectorAll("[id]")).map((e) => e.id);
  expect(ids).toEqual([...new Set(ids)]);
});
it("metadataと全幅の外殻を保持", () => {
  expect(metadata.title).toBe(expected.h1[0]);
  expect(metadata.description).toBe(
    "OpenAI Codex のモデル選定・環境設定・権限・AGENTS.md・Skills・MCP・検証・並列化・長時間タスク・CI・コスト・セキュリティを学ぶ中級〜上級ガイド。情報基準日2026-11-07。"
  );
  const { getByTestId } = render(<Page />);
  expect(getByTestId("layout-root").classList.contains(styles.layout)).toBe(true);
});
it("registry登録とヒーロー内の日付表示", () => {
  const entry = pageRegistry.find((p) => p.slug === "/codex/best-practices");
  expect(entry).toEqual({
    slug: "/codex/best-practices",
    title: "Codex ベストプラクティス（中級〜上級）",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["codex", "best-practices", "agent", "security"],
    summary:
      "OpenAI Codex のモデル選定・環境設定・権限・AGENTS.md・Skills・MCP・検証・並列化・長時間タスク・CI・コスト・セキュリティを学ぶ中級〜上級ガイド。",
    addedAt: "2026-11-11",
    lastReviewed: "2026-11-11",
  });
  const { getByTestId } = render(<Page />);
  const dates = getByTestId("hero-dates");
  expect(dates.closest("header")?.classList.contains(styles.hero)).toBe(true);
  expect(
    Array.from(dates.querySelectorAll("time")).map((e) => [e.dateTime, e.textContent])
  ).toEqual([
    [entry?.lastReviewed, entry?.lastReviewed],
    [entry?.addedAt, entry?.addedAt],
  ]);
});
/** CSS整形の空白と引用符だけを同義の表現へ揃える。 */
const normalized = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .trim()
    .replace(/'/g, '"')
    .replace(/\s*\/\s*/g, "/")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");
/** 原本のセレクターをページ限定のCSS Modules表記へ変換する。 */
const scoped = (selector: string) =>
  selector
    .split(",")
    .map((s) => {
      s = s.trim();
      if ([":root", "html", "body"].includes(s)) return ".root";
      s = s.replace(/^\.sidebar\.open$/, ".root.open .sidebar");
      s = s.replace(/(^|[ >+~])([a-z][a-z0-9-]*)(?=[\s.#:[>+~]|$)/g, "$1:global($2)");
      s = s.replace(/\.hljs\b/g, ":global(.hljs)");
      return s.startsWith(".root") ? s : `.root ${s}`;
    })
    .join(", ");
it("同一規則内で同じプロパティを二重宣言しない（SonarQube css:S4656）", () => {
  const duplicates: string[] = [];
  postcss.parse(css()).walkRules((r) => {
    const props = r.nodes
      .filter((n): n is postcss.Declaration => n.type === "decl")
      .map((d) => d.prop);
    for (const prop of new Set(props.filter((p, i) => props.indexOf(p) !== i)))
      duplicates.push(`${r.selector} ${prop}`);
  });
  expect(duplicates).toEqual([]);
});
it("原本75 CSS規則の全宣言・media条件を保持（図の配置は共有部品へ委譲）", () => {
  const ast = postcss.parse(css());
  // 共有リセット・クローム・モバイル操作への既存補正だけを、宣言全体で許容する。
  const additions = postcss.parse(`
    .root { width: 100%; color-scheme: light; }
    .root .sidebar {
      top: calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px) + var(--mobile-bar-height, 0px));
      z-index: 61;
    }
    .root .nav-a { text-decoration: none; }
    .root .main { width: calc(100% - var(--side)); }
    .root :global(p) { margin: 1em 0; }
    .root :global(a) { text-decoration: underline; }
    .root :global(th), .root :global(td) { text-align: left !important; }
    .root .section {
      scroll-margin-top: calc(var(--header-height, 60px) + 80px);
    }
    .root :global(pre) { color: #abb2bf; }
    .root :global(table) { font-size: inherit; }
    .root .mobile-bar {
      top: calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px));
      z-index: 63;
    }
    .root .foot {
      border-top: none; display: block; font-size: inherit;
      font-family: inherit; max-width: none; margin: 0;
    }
    @media (max-width: 900px) {
      .root .sidebar { visibility: hidden; pointer-events: none; }
      .root.open .sidebar { visibility: visible; pointer-events: auto; }
      .root .main { width: 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      .root .sidebar { transition: none; }
    }
    .root .section {
      scroll-margin-top: calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px) + var(--mobile-bar-height, 0px) + 16px);
    }
  `);
  const ruleKey = (selector: string, media: string | null) =>
    JSON.stringify([normalized(selector), media]);
  type Declarations = (string | boolean)[][];
  const expectedRules = new Map<string, Declarations[]>();
  const selectors = new Set<string>();
  for (const source of expected.css) {
    if (
      [
        ".diagram-canvas svg",
        ".mermaidTooltip",
        // 原本のhtml規則はページのスクロール領域に効く規則で、globals.cssのhtml規則が担当する
        "html",
      ].includes(source.selector)
    )
      continue;
    const declarations = source.declarations
      // 同一規則内で後続の宣言に上書きされる無効な宣言は、実効値が同じため照合しない。
      .filter(
        (d, i, all) => !all.some((later, j) => j > i && later[0] === d[0] && (later[2] || !d[2]))
      )
      .filter(
        (d) =>
          ![".diagram-wrap", ".diagram-canvas"].includes(source.selector) ||
          !["display", "justify-content", "width"].includes(String(d[0]))
      )
      .map((d) => d.map((v) => (typeof v === "string" ? normalized(v) : v)));
    for (const selector of scoped(source.selector).split(",").map(normalized)) {
      selectors.add(selector);
      const key = ruleKey(selector, source.media);
      expectedRules.set(key, [...(expectedRules.get(key) ?? []), declarations]);
    }
  }
  const actualRules = new Map<string, Declarations[]>();
  for (const [tree, target] of [
    [additions, expectedRules],
    [ast, actualRules],
  ] as const) {
    tree.walkRules((r) => {
      const media = r.parent?.type === "atrule" ? (r.parent as postcss.AtRule).params : null;
      const declarations = r.nodes
        .filter((n): n is postcss.Declaration => n.type === "decl")
        .map((d) => [d.prop, normalized(d.value), !!d.important]);
      for (const selector of r.selectors.map(normalized)) {
        if (!selectors.has(selector)) continue;
        const key = ruleKey(selector, media);
        target.set(key, [...(target.get(key) ?? []), declarations]);
      }
    });
  }
  expect(actualRules).toEqual(expectedRules);
});
/** 指定セレクターの非media宣言を後勝ちの順で集める。 */
const declarations = (selector: string) => {
  const result: Record<string, string> = {};
  postcss.parse(css()).walkRules((r) => {
    if (r.parent?.type === "atrule") return;
    if (
      !r.selector
        .split(",")
        .map((s) => s.trim())
        .includes(selector)
    )
      return;
    r.walkDecls((d) => {
      result[d.prop] = normalized(d.value);
    });
  });
  return result;
};
it("リストの点・番号・入れ子と表形式チェックの装飾を保持", () => {
  expect(declarations(".root :global(ul)")["list-style-type"]).toBe("disc");
  expect(declarations(".root :global(ol)")["list-style-type"]).toBe("decimal");
  expect(declarations(".root :global(ul) :global(ul)")["list-style-type"]).toBe("circle");
  expect(declarations(".root :global(ul) :global(ul) :global(ul)")["list-style-type"]).toBe(
    "square"
  );
  expect(declarations(".root :global(tr).done :global(td)")["text-decoration"]).toBe(
    "line-through"
  );
  expect(declarations(".root .chk :global(input)").width).toBe("24px");
  expect(declarations(".root .chk :global(input):checked")["box-shadow"]).toBe(
    "inset 0 0 0 4px #fff"
  );
});
it("表全列左寄せ・アンカー余白・コードリセット・既定太字を復元", () => {
  expect(css()).toMatch(
    /\.root :global\(th\),\s*\.root :global\(td\)\s*\{[^}]*text-align: left !important/
  );
  expect(css()).toContain("scroll-margin-top: calc(var(--header-height, 60px) + 80px)");
  expect(declarations(".root :global(pre code)").background).toBe("none");
  expect(declarations(".codeLine")["white-space"]).toBe("pre");
  expect(declarations(".layout").width).toBe("100%");
  for (const h of ["h1", "h2", "h3", "h4"])
    expect(declarations(`.root :global(${h})`)["font-weight"]).toBe("700");
});
it("900pxモバイル開閉・操作不能・共有ヘッダーとの配置を保持", () => {
  expect(css()).toMatch(
    /@media \(max-width: 900px\)[\s\S]*?\.root \.sidebar\s*\{[^}]*visibility: hidden;[^}]*pointer-events: none/
  );
  expect(css()).toMatch(
    /\.root\.open \.sidebar\s*\{[^}]*visibility: visible;[^}]*pointer-events: auto/
  );
  expect(declarations(".root .sidebar").top).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px) + var(--mobile-bar-height, 0px))"
  );
  expect(declarations("body:has(.root):global(.has-common-header)")["margin-top"]).toBe("0");
  expect(declarations("body:has(.root):global(.has-common-header)")["padding-top"]).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(declarations("body:has(.root) :global(#site-freshness-bar)").display).toBe("none");
});
it("生HTML注入・実行script・SVG寸法の上書きを禁止", () => {
  const source = fs.readFileSync("app/codex/best-practices/page.tsx", "utf8");
  expect(source).not.toContain(["danger", "ously", "Set", "Inner", "HTML"].join(""));
  expect(source).not.toContain("<script");
  expect(css()).not.toMatch(/:global\(svg\)/);
});
it("原本の全装飾クラスを同じタグへ同じ順序で適用", () => {
  const { container } = render(<Page />);
  const layout = container.querySelector(`.${styles.root} > .${styles.layout}`) as Element;
  for (const [cls, tags] of Object.entries(expected.classElements)) {
    const nodes =
      cls === "layout"
        ? [layout]
        : Array.from(
            layout.querySelectorAll(`.${cls.startsWith("language-") ? cls : styles[cls]}`)
          );
    expect(
      nodes.map((e) => e.localName),
      cls
    ).toEqual(tags);
  }
});
it("共有計算機の表専用スタイルが原本の本文書体・折返し・ヘッダー位置へ漏れない", () => {
  const expectedDefaults: Record<string, Record<string, string>> = {
    ".root .table-wrap :global(thead)": { position: "static" },
    ".root .table-wrap :global(th)": {
      "font-family": "inherit",
      "font-size": "inherit",
      "text-transform": "none",
      "letter-spacing": "normal",
      "white-space": "normal",
      "min-width": "0",
      "border-bottom": "none",
    },
    ".root .table-wrap :global(td)": { "font-family": "inherit" },
    ".root .table-wrap :global(tbody tr)": { "border-bottom": "none" },
    ".root .table-wrap :global(tbody tr:hover)": { background: "var(--paper-alt)" },
  };
  for (const [selector, props] of Object.entries(expectedDefaults)) {
    const actual = declarations(selector);
    for (const [prop, value] of Object.entries(props))
      expect(actual[prop], `${selector} ${prop}`).toBe(value);
  }
});

it("本文の既定余白・リンク装飾とモバイルバーが共有リセットで失われない", () => {
  expect(declarations(".root :global(p)").margin).toBe("1em 0");
  expect(declarations(".root :global(ul)")["padding-left"]).toBe("40px");
  expect(declarations(".root :global(ol)")["padding-left"]).toBe("40px");
  expect(declarations(".root :global(a)")["text-decoration"]).toBe("underline");
  expect(declarations(".root .nav-a")["text-decoration"]).toBe("none");
  expect(declarations(".root .mobile-bar").top).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
});

it("全要素ツリーのタグ・本文・入れ子・図位置を原本と完全一致で照合", () => {
  const { getByTestId } = render(<Page />);
  const layout = getByTestId("layout-root").cloneNode(true) as Element;
  layout.querySelector('[data-testid="hero-dates"]')?.remove();
  const content = layout.querySelector("[data-guide-content]");
  content?.replaceWith(...Array.from(content.childNodes));
  /** 本文・属性・図位置を原本と比較できる要素ツリーへ変換する。 */
  function shape(n: Node): unknown {
    if (n.nodeType === 3) return n.textContent?.replace(/\s+/g, " ").trim() || null;
    if (!(n instanceof Element)) return null;
    const attrs: Record<string, string> = {};
    for (const k of ["href", "colspan", "rowspan", "start", "type"]) {
      const v = n.getAttribute(k);
      if (v !== null) attrs[k] = v;
    }
    if (n.localName === "code" && n.parentElement?.localName === "pre")
      return ["code", {}, n.textContent];
    if (n.hasAttribute("data-diagram-id")) return ["diagram", n.getAttribute("data-diagram-id")];
    return [
      n.localName,
      attrs,
      Array.from(n.childNodes)
        .map(shape)
        .filter((x) => x !== null),
    ];
  }
  expect(shape(layout)).toEqual(expectedTree);
});

it("共有の小さい表文字と計算機フッターが原本の書体・幅・配置へ漏れない", () => {
  expect(declarations(".root :global(table)")["font-size"]).toBe("inherit");
  const footer = declarations(".root .foot");
  for (const [property, value] of Object.entries({
    "border-top": "none",
    display: "block",
    "font-size": "inherit",
    "font-family": "inherit",
    "max-width": "none",
    margin: "0",
  }))
    expect(footer[property], `footer ${property}`).toBe(value);
});

it("参考文献4種のカード・リンク・マーカーなしを原本どおり保持", () => {
  const { container } = render(<Page />);
  for (const cls of [
    "reflist",
    "refcard",
    "rc-official",
    "rc-dev",
    "rc-res",
    "rc-sec",
    "rc-head",
    "rc-title",
    "rc-count",
    "rc-dom",
    "rc-path",
    "t-res",
  ] as const) {
    expect(
      Array.from(container.querySelectorAll(`.${styles[cls]}`)).map((e) => [e.localName, text(e)])
    ).toEqual(expected.referenceElements[cls]);
  }
  expect(declarations(".root .refcard :global(ul)")["list-style"]).toBe("none");
  expect(declarations(".root .refcard :global(ul)").padding).toBe("0");
  expect(declarations(".root .refcard :global(a)")["text-decoration"]).toBe("none");
});
it("highlight.jsの実クラスにCSS規則が一致する", () => {
  expect(declarations(".root :global(pre) :global(code):global(.hljs)")).toEqual({
    padding: "16px 18px",
    background: "transparent",
  });
});
it("アンカー移動の余白は実測のヘッダー・免責バナー・モバイルバー高さから導出する", () => {
  const measured =
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px) + var(--mobile-bar-height, 0px) + 16px)";
  // 複数規則に一致する場合は後勝ちの実効値を declarations() が返す
  for (const selector of [
    ".root .section",
    ".root :global(h1)",
    ".root :global(h2)",
    ".root :global(h3)",
  ])
    expect(declarations(selector)["scroll-margin-top"], selector).toBe(measured);
});

it("完了行は白・ホバー背景で4.5:1以上の文字色と取り消し線を保つ", () => {
  /** #rrggbb の相対輝度からWCAGのコントラストを計算する。 */
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const done = declarations(".root .table-wrap :global(tr).done :global(td)");
  expect(done.color).toMatch(/^#[0-9a-f]{6}$/);
  for (const background of ["#ffffff", "#f1ece0"]) {
    const [hi, lo] = [luminance(done.color), luminance(background)].sort((a, b) => b - a);
    expect((hi + 0.05) / (lo + 0.05), background).toBeGreaterThanOrEqual(4.5);
  }
  expect(declarations(".root :global(tr).done :global(td)")["text-decoration"]).toBe(
    "line-through"
  );
});
