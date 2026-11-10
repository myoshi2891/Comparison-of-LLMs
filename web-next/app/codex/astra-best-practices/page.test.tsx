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
const css = () => fs.readFileSync("app/codex/astra-best-practices/page.module.css", "utf8");
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
for (const cls of ["hero", "footer", "brand"] as const)
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
it("全見出しのレベルと原文、17セクションの境界を保持", () => {
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
it("24表177行のセル型・結合・全文と不正空白ノード不在", () => {
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
it("目次17リンクの文言・順序・到達先と初期選択", () => {
  const { container, getByTestId } = render(<Page />);
  expect(getByTestId("sidebar-nav").getAttribute("aria-label")).toBe("目次");
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
it("外部40リンクのURL・本文・順序・安全属性と内部リンクを保持", () => {
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
it("11コード例の改行・先頭空白とhighlight.js11.9.0全トークン", () => {
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
// 原本スクリプトのUL単位の8・7・7集計を保持。
it("22チェック全文・3リスト別の進捗・完了クラスを原本どおり同期", () => {
  const { container } = render(<Page />);
  const labels = Array.from(container.querySelectorAll(`li.${styles.chk} label`));
  expect(labels.map(text)).toEqual(expected["li.chk label"]);
  const boxes = labels.map((l) => l.querySelector("input") as HTMLInputElement);
  expect(boxes.map((b) => [b.type, b.checked])).toEqual(Array(22).fill(["checkbox", false]));
  const groups = Array.from(container.querySelectorAll(`ul.${styles.checklist}`));
  expect(groups.map((g) => g.querySelectorAll("input").length)).toEqual([8, 7, 7]);
  expect(groups.map((g) => Array.from(g.querySelectorAll("li")).map(text))).toEqual(
    expected.checklists
  );
  const counts = () =>
    Array.from(container.querySelectorAll('[data-testid="check-progress"]')).map(
      (e) => e.textContent
    );
  expect(counts()).toEqual(["0 / 8 完了", "0 / 7 完了", "0 / 7 完了"]);
  for (const b of boxes.slice(0, 8)) fireEvent.click(b);
  expect(counts()).toEqual(["8 / 8 完了", "0 / 7 完了", "0 / 7 完了"]);
  fireEvent.click(boxes[8]);
  expect(counts()).toEqual(["8 / 8 完了", "1 / 7 完了", "0 / 7 完了"]);
  fireEvent.click(boxes[15]);
  expect(counts()).toEqual(["8 / 8 完了", "1 / 7 完了", "1 / 7 完了"]);
  for (const b of boxes.slice(9, 15).concat(boxes.slice(16))) fireEvent.click(b);
  expect(counts()).toEqual(["8 / 8 完了", "7 / 7 完了", "7 / 7 完了"]);
  expect(boxes.map((b) => b.closest("li")?.classList.contains(styles.done))).toEqual(
    Array(22).fill(true)
  );
  for (const b of boxes) fireEvent.click(b);
  expect(counts()).toEqual(["0 / 8 完了", "0 / 7 完了", "0 / 7 完了"]);
  expect(boxes.map((b) => b.closest("li")?.classList.contains(styles.done))).toEqual(
    Array(22).fill(false)
  );
});
it("チェック進捗を含む全IDが一意で、各進捗表示は対象リストの直前に置かれる", () => {
  const { container } = render(<Page />);
  const ids = Array.from(container.querySelectorAll("[id]")).map((e) => e.id);
  expect(ids).toEqual([...new Set(ids)]);
  const groups = Array.from(container.querySelectorAll(`ul.${styles.checklist}`));
  expect(groups.map((g) => g.previousElementSibling?.className)).toEqual(
    Array(3).fill(styles.progress)
  );
  expect(
    groups.map(
      (g) => g.previousElementSibling?.querySelector('[data-testid="check-progress"]')?.textContent
    )
  ).toEqual(["0 / 8 完了", "0 / 7 完了", "0 / 7 完了"]);
});
it("metadataと全幅の外殻を保持", () => {
  expect(metadata.title).toBe(expected.h1[0]);
  expect(metadata.description).toBe(
    "GPT-6 Astra のモデル選定、Responses API、推論強度、プロンプト・スキル、ツール利用、安全運用と評価を学ぶ中級〜上級ガイド。情報基準日2026-11-05。"
  );
  const { getByTestId } = render(<Page />);
  expect(getByTestId("layout-root").classList.contains(styles.layout)).toBe(true);
});
it("registry登録とヒーロー内の日付表示", () => {
  const entry = pageRegistry.find((p) => p.slug === "/codex/astra-best-practices");
  expect(entry).toEqual({
    slug: "/codex/astra-best-practices",
    title: "GPT-6 Astra ベストプラクティス",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["openai", "astra", "agent", "prompt", "api", "cost", "security"],
    summary:
      "GPT-6 Astra のモデル選定、Responses API、推論強度、プロンプト・スキル、ツール利用、安全運用と評価を学ぶ中級〜上級ガイド。",
    addedAt: "2026-11-10",
    lastReviewed: "2026-11-10",
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
it("原本62 CSS規則の全宣言・media条件を保持（図の配置は共有部品へ委譲）", () => {
  const ast = postcss.parse(css());
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
        // 同一規則内で後続の宣言に上書きされる無効な宣言は、実効値が同じため照合しない。
        .filter(
          (d, i, all) => !all.some((later, j) => j > i && later[0] === d[0] && (later[2] || !d[2]))
        )
        .filter(
          (d) =>
            ![".diagram-wrap", ".diagram-canvas"].includes(source.selector) ||
            !["display", "justify-content", "width"].includes(String(d[0]))
        )
        .map((d) => d.map((v) => (typeof v === "string" ? normalized(v) : v)))
    );
  }
});
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
      result[d.prop] = d.value;
    });
  });
  return result;
};
it("リストの点・番号・入れ子とチェックリストのマーカーなしを保持", () => {
  expect(declarations(".root :global(ul)")["list-style-type"]).toBe("disc");
  expect(declarations(".root :global(ol)")["list-style-type"]).toBe("decimal");
  expect(declarations(".root :global(ul) :global(ul)")["list-style-type"]).toBe("circle");
  expect(declarations(".root :global(ul) :global(ul) :global(ul)")["list-style-type"]).toBe(
    "square"
  );
  expect(declarations(".root :global(ul).checklist")["list-style"]).toBe("none");
  expect(declarations(".root :global(li).chk.done :global(span)")["text-decoration"]).toBe(
    "line-through"
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
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(declarations("body:has(.root):global(.has-common-header)")["margin-top"]).toBe("0");
  expect(declarations("body:has(.root):global(.has-common-header)")["padding-top"]).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(declarations("body:has(.root) :global(#site-freshness-bar)").display).toBe("none");
});
it("生HTML注入・実行script・SVG寸法の上書きを禁止", () => {
  const source = fs.readFileSync("app/codex/astra-best-practices/page.tsx", "utf8");
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
    ".root .table-wrap :global(tbody tr:hover)": { background: "transparent" },
  };
  for (const [selector, props] of Object.entries(expectedDefaults)) {
    const actual = declarations(selector);
    for (const [prop, value] of Object.entries(props))
      expect(actual[prop], `${selector} ${prop}`).toBe(value);
  }
});

it("ヒーローのマーカーなし・paddingゼロと通常本文の点と番号を区別する", () => {
  const props = declarations(".root .hero :global(ul)");
  expect(props["list-style"]).toBe("none");
  expect(props["padding-left"]).toBe("0");
  expect(declarations(".root :global(ul)")["list-style-type"]).toBe("disc");
  expect(declarations(".root :global(ol)")["list-style-type"]).toBe("decimal");
});
