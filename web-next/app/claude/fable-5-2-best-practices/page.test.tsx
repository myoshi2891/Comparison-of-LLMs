// @vitest-environment jsdom
import fs from "node:fs";
import { cleanup, fireEvent, render } from "@testing-library/react";
import postcss from "postcss";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
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
/** 表示上同義の整形空白だけを正規化する。 */
const text = (e: Element) => (e.textContent ?? "").replace(/\s+/g, " ").trim();
const css = () => fs.readFileSync("app/claude/fable-5-2-best-practices/page.module.css", "utf8");
// 原本の列ずれだけを逆変換し、保存済みの全文・構造契約はそのまま照合する。
const correctedReferenceIds = new Set(
  expected.tables
    .filter((table) => table[0].map((cell) => cell[3]).join("|") === "ID|発信者|内容|取得状況|URL")
    .flatMap((table) =>
      table
        .slice(1)
        .filter((row) => row[4][3] === "")
        .map((row) => row[0][3])
    )
);
/** 訂正された空の内容セルを、原本契約との比較時だけ旧位置へ戻す。 */
function sourceCells(row: Element): Node[] {
  const cells = Array.from(row.childNodes);
  return row.localName === "tr" && correctedReferenceIds.has(row.id)
    ? [...cells.slice(0, 2), ...cells.slice(3), cells[2]]
    : cells;
}
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
for (const selector of ["h1", "h2", "h3", "h4", "p", "li", "ul", "ol", "blockquote"] as const)
  it(`原本の全文・順序・重複: ${selector}`, () => {
    const { container } = render(<Page />);
    expect(Array.from(container.querySelectorAll(selector)).map(text)).toEqual(expected[selector]);
  });
for (const cls of ["hero", "footer", "sidebar-brand", "callout"] as const)
  it(`複合要素の全文: ${cls}`, () => {
    const { container } = render(<Page />);
    expect(
      Array.from(container.querySelectorAll(`.${styles[cls]}`)).map((e) => {
        const clone = e.cloneNode(true) as Element;
        clone.querySelector('[data-testid="hero-dates"]')?.remove();
        clone.querySelectorAll("[data-progress-panel]").forEach((p) => {
          p.remove();
        });
        return text(clone);
      })
    ).toEqual(expected[`.${cls}`]);
  });
it("45表363行の全セル・タグ・結合を順序込みで照合し不正な空白ノードを禁止", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("table")).map((t) =>
      Array.from(t.querySelectorAll("tr")).map((r) =>
        sourceCells(r).map((node) => {
          const c = node as Element;
          return [c.localName, c.getAttribute("colspan"), c.getAttribute("rowspan"), text(c)];
        })
      )
    )
  ).toEqual(expected.tables);
  expect(
    Array.from(container.querySelectorAll("table,thead,tbody,tr")).flatMap((e) =>
      Array.from(e.childNodes).filter((n) => n.nodeType === 3)
    )
  ).toEqual([]);
});
it("著者・独立評価の参考行で内容・取得状況・URLが列見出しに対応する", () => {
  const { container } = render(<Page />);
  const rows = expected.tables
    .filter((table) => table[0].map((cell) => cell[3]).join("|") === "ID|発信者|内容|取得状況|URL")
    .flatMap((table) => table.slice(1));
  expect(
    rows.map((row) => {
      const id = row[0][3];
      const cells = Array.from(container.querySelector(`#${id}`)?.children ?? []);
      return [
        id,
        cells.map(text),
        cells.map((cell) => cell.querySelector("a")?.getAttribute("href") ?? null),
      ];
    })
  ).toEqual(
    rows.map((row) => {
      const values = row.map((cell) => cell[3]);
      const ordered = values[4] === "" ? [values[0], values[1], "", values[2], values[3]] : values;
      return [values[0], ordered, [null, null, null, null, ordered[4]]];
    })
  );
});
it("全リストの型・開始番号・全項目・入れ子を完全一致", () => {
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
it("目次19リンクの文言・順序・アンカー解決・全ID一意性・初期選択", () => {
  const { container, getByTestId } = render(<Page />);
  const links = Array.from(getByTestId("sidebar-nav").querySelectorAll("a"));
  expect(links.map((e) => [e.getAttribute("href"), text(e)])).toEqual(expected.toc);
  expect(
    links.map(
      (e) =>
        container.querySelector(e.getAttribute("href") as string)?.querySelector("h2")?.textContent
    )
  ).toEqual(expected.h2);
  const ids = Array.from(container.querySelectorAll("[id]")).map((e) => e.id);
  expect(ids).toEqual([...new Set(ids)]);
  expect(Array.from(container.querySelectorAll("h2,h3")).every((e) => !!e.id)).toBe(true);
  expect(links.filter((e) => e.getAttribute("aria-current") === "location")).toEqual([links[0]]);
  expect(links[0].classList.contains(styles.active)).toBe(true);
});
it("外部49リンクの全文・順序・URL・安全属性を保持し内部htmlリンクを禁止", () => {
  const { container } = render(<Page />);
  const links = Array.from(container.querySelectorAll('a[href^="http"]'));
  expect(links.map((e) => [e.getAttribute("href"), text(e)])).toEqual(expected.external);
  for (const a of links)
    expect([a.getAttribute("target"), a.getAttribute("rel")]).toEqual([
      "_blank",
      "noopener noreferrer",
    ]);
  expect(
    Array.from(container.querySelectorAll("a")).filter(
      (a) =>
        !/^https?:/.test(a.getAttribute("href") ?? "") && a.getAttribute("href")?.includes(".html")
    )
  ).toEqual([]);
});
it("19コード例の全文・改行・先頭空白とhighlight.js11.12.0の全構文トークン", () => {
  const { container } = render(<Page />);
  const codes = Array.from(container.querySelectorAll('[data-testid="code-block"] pre code'));
  expect(codes.map((e) => e.textContent)).toEqual(expected.codes);
  expect(
    codes.map((e) =>
      Array.from(e.querySelectorAll("span[class]"))
        .filter((s) => !s.classList.contains(styles.codeLine))
        .map((s) => [s.className, s.textContent])
    )
  ).toEqual(expected.tokens);
  expect(
    codes.map((e) =>
      Array.from(e.querySelectorAll(`.${styles.codeLine}`))
        .map((s) => s.textContent)
        .join("\n")
    )
  ).toEqual(expected.codes);
});
it("10図の完全なソースと実行時追加classDef・テーマ・ラッパー・左端配置", () => {
  const { container } = render(<Page />);
  const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
  expect(diagrams.map((e) => e.textContent)).toEqual(expected.diagrams);
  expect(
    Array.from(container.querySelectorAll(`.${styles["diagram-wrap"]} [data-testid="mermaid"]`))
  ).toEqual(diagrams);
  for (const d of diagrams) {
    expect(d.getAttribute("data-theme")).toBe("base");
    expect(JSON.parse(d.getAttribute("data-vars") ?? "{}")).toEqual(expected.theme);
    expect(d.textContent).toMatch(/^flowchart /);
    expect(d.textContent).not.toMatch(/^\s|block-beta/);
  }
});
it("原本全stylesheetのURL・SRI・crossoriginを保持", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('link[rel="stylesheet"]')).map((e) => [
      e.getAttribute("href"),
      e.getAttribute("integrity"),
      e.getAttribute("crossorigin"),
    ])
  ).toEqual(expected.stylesheets);
});
it("9リスト41チェックの全文とリストごとの独立集計・取消し・バー幅", () => {
  const { container } = render(<Page />);
  const groups = Array.from(container.querySelectorAll(`ul.${styles.checklist}`));
  expect(groups.map((l) => Array.from(l.querySelectorAll("label")).map(text))).toEqual(
    expected.checks
  );
  const counts = () =>
    Array.from(container.querySelectorAll('[data-testid="check-progress"]')).map(
      (e) => e.textContent
    );
  const initial = expected.checks.map((a) => `0 / ${a.length} 完了`);
  expect(counts()).toEqual(initial);
  groups.forEach((g, i) => {
    const boxes = Array.from(g.querySelectorAll("input"));
    expect(boxes.map((b) => [b.type, b.checked])).toEqual(
      expected.checks[i].map(() => ["checkbox", false])
    );
    for (const b of boxes) fireEvent.click(b);
    expect(counts()).toEqual(
      initial.map((s, j) => (j === i ? `${boxes.length} / ${boxes.length} 完了` : s))
    );
    expect(
      (g.previousElementSibling?.querySelector("[data-check-bar]") as HTMLElement).style.width
    ).toBe("100%");
    for (const b of boxes) fireEvent.click(b);
    expect(counts()).toEqual(initial);
    expect(
      (g.previousElementSibling?.querySelector("[data-check-bar]") as HTMLElement).style.width
    ).toBe("0%");
  });
});
it("metadata・registry・ヒーローの日付を保持", () => {
  expect(metadata).toEqual({
    title: expected.title,
    description:
      "Claude Fable 5.2 のモデル選定、effort、API実装、履歴管理、Claude Code・マルチエージェント運用、コストと評価を学ぶ中級〜上級ガイド。情報基準日2026-11-12。",
  });
  const entry = pageRegistry.find((p) => p.slug === "/claude/fable-5-2-best-practices");
  expect(entry).toEqual({
    slug: "/claude/fable-5-2-best-practices",
    title: "Claude Fable 5.2 ベストプラクティス",
    group: "Providers",
    category: "Claude",
    provider: "claude",
    topics: ["claude", "agent", "prompt", "api", "cost", "security"],
    summary:
      "Claude Fable 5.2 のモデル選定、effort、API実装、履歴管理、Claude Code・マルチエージェント運用、コストと評価を学ぶ中級〜上級ガイド。",
    addedAt: "2026-11-13",
    lastReviewed: "2026-11-13",
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
  expect(getByTestId("layout-root").classList.contains(styles.layout)).toBe(true);
});
/** 原本の全クラスをCSS Modulesのローカルクラスへ対応させる。 */
const className = (c: string) =>
  c.startsWith("ti") || c.startsWith("hljs") || c.startsWith("language-") || c === "function_"
    ? c
    : styles[c];
it("全装飾クラスが原本と同じタグ・順序へ付く", () => {
  const { container } = render(<Page />);
  for (const [c, tags] of Object.entries(expected.classElements))
    expect(
      Array.from(
        container.querySelectorAll(
          `.${styles.layout} .${className(c)}, .${styles.layout}.${className(c)}`
        )
      ).map((e) => e.localName),
      c
    ).toEqual(tags);
});
/** DOMを原本の意味的ツリーへ正規化し、追加日付・進捗だけを除く。 */
function tree(n: Node): unknown {
  if (n.nodeType === 3) {
    const s = (n.textContent ?? "").replace(/\s+/g, " ").trim();
    return s ? ["text", s] : null;
  }
  if (!(n instanceof Element) || n.matches('[data-progress-panel],[data-testid="hero-dates"]'))
    return null;
  if (n.matches("pre code")) return ["code", n.textContent];
  if (n.classList.contains(styles["diagram-wrap"]))
    return ["diagram", n.querySelector('[data-testid="mermaid"]')?.textContent];
  const attrs: Record<string, string> = {};
  for (const key of ["class", "href", "colspan", "rowspan", "start", "type", "aria-hidden"]) {
    let v = n.getAttribute(key);
    if (key === "class" && v)
      v = v
        .split(/\s+/)
        .filter((c) => c !== styles.active && c !== styles.main)
        .map(
          (c) =>
            [...Object.keys(expected.classElements), "mobile-bar", "mb-title", "backdrop"].find(
              (k) => styles[k] === c
            ) ?? c
        )
        .join(" ");
    if (key === "type" && n.id === "fable52-backdrop") v = null;
    if (v) attrs[key] = v;
  }
  return [
    n.id === "fable52-backdrop" ? "div" : n.localName,
    attrs,
    sourceCells(n).map(tree).filter(Boolean),
  ];
}
it("原本の全要素ツリー・タグ・本文・リスト階層・図位置を完全一致", () => {
  const { container } = render(<Page />);
  const root = container.querySelector(`.${styles.root}`) as Element;
  expect(
    Array.from(root.children)
      .filter((e) => !e.matches("link"))
      .map(tree)
      .filter(Boolean)
  ).toEqual(expectedTree);
});
const normalize = (s: string) => s.replace(/\s+/g, " ").trim().replace(/'/g, '"');
/** 原本CSSのセレクターをページスコープへ移す。 */
function scoped(selector: string): string {
  return selector
    .split(",")
    .map((s) => {
      s = s.trim();
      if ([":root", "body"].includes(s)) return ".root";
      s = s.replace(/^body\.menu-open /, ".root.open ");
      s = s.replace(/#s16/g, ":global(#s16)");
      s = s.replace(/(^|[ >+~])([a-z][a-z0-9-]*|\*)(?=[\s.#:[>+~]|$)/g, "$1:global($2)");
      s = s.replace(/\.hljs\b/g, ":global(.hljs)");
      return s.startsWith(".root") ? s : `.root ${s}`;
    })
    .join(", ");
}
it("原本110 CSS規則の全宣言・順序・media条件を一致（図寸法は共有部品へ委譲）", () => {
  const actual: unknown[] = [];
  postcss.parse(css().split("/* Tailwind")[0]).walkRules((r) => {
    if (!r.selector.startsWith(".root")) return;
    actual.push({
      selector: normalize(r.selector),
      media: r.parent?.type === "atrule" ? (r.parent as postcss.AtRule).params : null,
      declarations: r.nodes
        .filter((n) => n.type === "decl")
        .map((n) => {
          const d = n as postcss.Declaration;
          return [d.prop, normalize(d.value), !!d.important];
        }),
    });
  });
  expect(actual).toEqual(
    expected.css
      .filter((r) => !["html", ".diagram-wrap svg", ".mermaidTooltip"].includes(r.selector))
      .map((r) => ({
        selector: normalize(scoped(r.selector)),
        media: r.media,
        declarations: r.declarations
          .filter(
            (d) =>
              r.selector !== ".diagram-wrap" ||
              !["display", "justify-content", "width"].includes(String(d[0]))
          )
          .map((d) => d.map((v) => (typeof v === "string" ? normalize(v) : v))),
      }))
  );
});
/** 最終的な明示補正値を読む。 */
function declarations(selector: string): Record<string, string> {
  const out: Record<string, string> = {};
  postcss.parse(css()).walkRules((r) => {
    if (
      r.parent?.type === "atrule" ||
      !r.selector
        .split(",")
        .map((s) => s.trim())
        .includes(selector)
    )
      return;
    r.walkDecls((d) => {
      out[d.prop] = d.value;
    });
  });
  return out;
}
it("点・番号・入れ子・nav/chips/checklistのマーカーなしと取り消し線", () => {
  expect(declarations(".root :global(ul)")["list-style-type"]).toBe("disc");
  expect(declarations(".root :global(ol)")["list-style-type"]).toBe("decimal");
  expect(declarations(".root :global(ul) :global(ul)")["list-style-type"]).toBe("circle");
  expect(declarations(".root :global(ul) :global(ul) :global(ul)")["list-style-type"]).toBe(
    "square"
  );
  for (const c of ["nav", "chips", "checklist"])
    expect(declarations(`.root :global(ul).${c}`)["list-style"]).toBe("none");
  expect(declarations(".root .checklist :global(input:checked + span)")["text-decoration"]).toBe(
    "line-through"
  );
});
it("表全列左寄せ・太字・コードリセット・全幅・実測ヘッダーに対するアンカー余白", () => {
  expect(css()).toMatch(
    /\.root :global\(th\),\s*\.root :global\(td\)\s*\{[^}]*text-align: left !important/
  );
  expect(declarations(".root :global(pre code)").background).toBe("none");
  expect(declarations(".codeLine")["white-space"]).toBe("pre");
  expect(declarations(".layout").width).toBe("100%");
  for (const h of ["h1", "h2", "h3", "h4"])
    expect(declarations(`.root :global(${h})`)["font-weight"]).toBe("700");
  expect(css()).toContain("scroll-margin-top: calc(var(--header-height, 60px) + 80px)");
  expect(normalize(css()).replace(/\s*\+\s*/g, " + ")).toContain(
    "var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px) + var(--mobile-bar-height, 0px) + 16px"
  );
  expect(declarations(".root .table-wrap :global(thead)").position).toBe("static");
  for (const cell of ["th", "td"])
    expect(declarations(`.root .table-wrap :global(${cell})`)["font-family"]).toBe("inherit");
});
it("900pxモバイル開閉・閉状態の操作防止と共有クローム配置", () => {
  expect(css()).toMatch(
    /@media \(max-width: 900px\)[\s\S]*?\.root \.sidebar\s*\{[^}]*visibility: hidden;[^}]*pointer-events: none/
  );
  expect(css()).toMatch(
    /\.root\.open \.sidebar\s*\{[^}]*visibility: visible;[^}]*pointer-events: auto/
  );
  expect(declarations(".root .sidebar").top).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(declarations("body:has(.root):global(.has-common-header)")["margin-top"]).toBe("0");
  expect(declarations("body:has(.root) :global(#site-freshness-bar)").display).toBe("none");
});
it("見出し階層が飛ばず生HTML注入・実行script・SVG寸法上書きがない", () => {
  const { container } = render(<Page />);
  let level = 0;
  for (const h of container.querySelectorAll("h1,h2,h3,h4")) {
    const next = Number(h.tagName[1]);
    expect(next - level).toBeLessThanOrEqual(1);
    level = next;
  }
  const source = fs.readFileSync("app/claude/fable-5-2-best-practices/page.tsx", "utf8");
  expect(source).not.toContain(["danger", "ously", "Set", "Inner", "HTML"].join(""));
  expect(source).not.toContain("<script");
  expect(css()).not.toMatch(/:global\(svg\)/);
});
it("原本CSSは共有のthead thより高い詳細度で配色・余白を保持し、表書体を復元", () => {
  const sourceRules = css().split("/* Tailwind")[0];
  const ast = postcss.parse(sourceRules);
  const rules: string[] = [];
  ast.walkRules((r) => {
    rules.push(r.selector);
  });
  expect(rules.every((r) => r.split(",").every((s) => s.trim().startsWith(".root")))).toBe(true);
  expect(declarations(".root :global(table)")["font-size"]).toBe("inherit");
});
it("共有目次へ渡す完了クラスが実際のCSS Modulesにも定義される", () => {
  expect(declarations(".root .checklist .done :global(span)")["text-decoration"]).toBe(
    "line-through"
  );
});
it("S5256: 全表がヘッダーセルを持ち、概要のキー値表は行見出しth[scope=row]を使う", () => {
  const { container } = render(<Page />);
  for (const table of Array.from(container.querySelectorAll("table")))
    expect(table.querySelectorAll("th").length).toBeGreaterThan(0);
  expect(
    Array.from(container.querySelectorAll(`.${styles["kv-wrap"]} th[scope="row"]`)).map(text)
  ).toEqual(["対象モデル", "調査時点", "想定読者", "情報源", "図解のルール"]);
});
it("S5256: キー値表の行見出しは原本のtd:first-childと同じ表示を保つ", () => {
  const d = declarations(`.root .kv-wrap :global(th[scope="row"])`);
  expect(d).toMatchObject({
    background: "transparent",
    color: "var(--indigo)",
    "font-weight": "700",
    "white-space": "nowrap",
    padding: "12px 16px",
    "border-bottom": "1px solid var(--border)",
    "vertical-align": "top",
    "line-height": "1.7",
    "overflow-wrap": "break-word",
  });
  expect(
    declarations(`.root .kv-wrap :global(tbody tr:last-child th[scope="row"])`)["border-bottom"]
  ).toBe("none");
});
