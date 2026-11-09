// @vitest-environment jsdom
import fs from "node:fs";
import { cleanup, render } from "@testing-library/react";
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
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const i = expected.sections.indexOf(this.id);
    return { top: i < 0 ? 100 : i * 1000, bottom: 200, height: 600 } as DOMRect;
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
const text = (e: Element) => (e.textContent ?? "").replace(/\s+/g, " ").trim();
// Additional site dates are checked separately; preserve the full original hero copy contract.
const originalHeroText = (element: Element) => {
  const copy = element.cloneNode(true) as Element;
  copy.querySelector('[data-testid="hero-dates"]')?.remove();
  return text(copy);
};
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
  it(`原本の本文全件・順序・重複を保持: ${selector}`, () => {
    const { container } = render(<Page />);
    expect(
      Array.from(container.querySelectorAll(selector)).map((e) =>
        selector === "pre code" ? e.textContent : text(e)
      )
    ).toEqual(expected[selector]);
  });
for (const cls of ["callout", "closing", "hero", "footer", "meta-card", "code-head"] as const)
  it(`原本の複合要素本文を保持: ${cls}`, () => {
    const { container } = render(<Page />);
    const selector = `.${styles[cls]}`;
    expect(
      Array.from(container.querySelectorAll(selector)).map(cls === "hero" ? originalHeroText : text)
    ).toEqual(expected[`.${cls}`]);
  });
it("全21表のセル型・結合・全文・行順序を保持", () => {
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
it("リスト型・開始番号・直属項目・入れ子の完全一致", () => {
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
it("目次全リンクの本文・順序・アンカーと初期選択", () => {
  const { container } = render(<Page />);
  const links = Array.from(container.querySelectorAll('[data-testid="sidebar-nav-link"]'));
  expect(links.map((e) => [e.getAttribute("href"), text(e)])).toEqual(expected.toc);
  expect(Array.from(container.querySelectorAll("section")).map((e) => e.id)).toEqual(
    expected.sections
  );
  for (const a of links)
    expect(container.querySelector(`${a.getAttribute("href")} h2`)).toBeTruthy();
  const ids = Array.from(container.querySelectorAll("h2,h3")).map((e) => e.id);
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
  expect(links.filter((e) => e.getAttribute("aria-current") === "location")).toEqual([links[0]]);
  expect(links[0].classList.contains(styles.active)).toBe(true);
});
it("外部49リンクの本文・URL・順序・安全属性", () => {
  const { container } = render(<Page />);
  const links = Array.from(container.querySelectorAll('a[href^="http"]'));
  expect(links.map((e) => [e.getAttribute("href"), text(e)])).toEqual(expected.external);
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
it("図解8件の全文・順序・テーマ・専用ラッパー", () => {
  const { container } = render(<Page />);
  const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
  expect(diagrams.map((e) => e.textContent)).toEqual(expected.diagrams);
  expect(
    Array.from(container.querySelectorAll(`.${styles["diagram-wrap"]} [data-testid="mermaid"]`))
  ).toEqual(diagrams);
  for (const e of diagrams) {
    expect(e.getAttribute("data-theme")).toBe("base");
    expect(JSON.parse(e.getAttribute("data-vars") ?? "{}")).toEqual(expected.theme);
    expect(e.textContent).toMatch(/^(flowchart|sequenceDiagram)/);
    expect(e.textContent).not.toMatch(/^\s|block-beta/);
  }
});
it("10コード例の全ハイライトトークンを原本11.11.1と照合", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("pre code")).map((e) =>
      Array.from(e.querySelectorAll("span[class]")).map((s) => [s.className, s.textContent])
    )
  ).toEqual(expected.tokens);
  expect(
    Array.from(container.querySelectorAll('[data-testid="code-block"] code')).map(
      (e) => e.textContent
    )
  ).toEqual(expected["pre code"]);
});
it("CDNスタイルシート全件と原本順序", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('link[rel="stylesheet"]')).map((e) =>
      e.getAttribute("href")
    )
  ).toEqual(expected.stylesheets);
});
it("メタデータ・見出し階層・全幅外殻・callout種別", () => {
  expect(metadata.title).toBe(expected.h1[0]);
  expect(metadata.description).toBe(
    "OpenAI のモデル選択、Responses API、reasoning effort、ツールとコスト最適化の実践ガイド。情報基準日2026-10-23。"
  );
  const { container, getByTestId } = render(<Page />);
  expect(getByTestId("layout-root").classList.contains(styles.layout)).toBe(true);
  let level = 0;
  for (const h of container.querySelectorAll("h1,h2,h3,h4")) {
    const n = Number(h.tagName[1]);
    expect(n - level).toBeLessThanOrEqual(1);
    level = n;
  }
  expect(
    Array.from(container.querySelectorAll(`.${styles.callout}`)).map((e) =>
      e.getAttribute("data-variant")
    )
  ).toEqual(["info"]);
  for (const e of container.querySelectorAll('[data-variant="warn"]'))
    expect(e.querySelector('[data-testid="callout-label"]')).toBeTruthy();
});
it("レジストリからCodexの導線へ登録し移行確認日を記録", () => {
  expect(pageRegistry.find((p) => p.slug === "/codex/models-best-practices")).toEqual({
    slug: "/codex/models-best-practices",
    title: "OpenAI 最新モデル ベストプラクティス",
    group: "Providers",
    category: "Codex",
    provider: "codex",
    topics: ["openai", "prompting", "agent", "agents"],
    summary:
      "OpenAI のモデル選択、Responses API、reasoning effort、ツールとコスト最適化の実践ガイド。",
    addedAt: "2026-11-02",
    lastReviewed: "2026-11-02",
  });
});
const cssValue = (v: unknown) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().replace(/'/g, '"') : v;
const css = () => fs.readFileSync("app/codex/models-best-practices/page.module.css", "utf8");
// 元CSSを独立した固定期待値として保存。共有図解への委譲とルート・開閉スコープだけ明示変換する。
const scoped = (s: string) =>
  s
    .split(",")
    .map((s) => {
      s = s.trim();
      if ([":root", "body", "html"].includes(s)) return ".root";
      s = s.replace(/^body\.nav-open /, ".root.open ").replace(/#progress/g, ":global(#progress)");
      s = s.replace(/(^|[ >+~])([a-z][a-z0-9-]*)(?=[\s.#:[>+~]|$)/g, "$1:global($2)");
      return s.startsWith(".root") ? s : `.root ${s}`;
    })
    .join(", ")
    .replace(/\s+/g, " ");
it("原本80 CSS規則の宣言・メディア条件を漏れなく転写", () => {
  const ast = postcss.parse(css());
  for (const source of expected.css) {
    if ([".diagram-canvas svg", ".mermaidTooltip"].includes(source.selector)) continue;
    const rules: postcss.Rule[] = [];
    ast.walkRules((r) => {
      if (
        r.selector.replace(/\s+/g, " ") === scoped(source.selector) &&
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
            return [d.prop, cssValue(d.value), !!d.important];
          })
      ),
      source.selector
    ).toContainEqual(
      source.declarations
        .filter(
          (d) =>
            source.selector !== ".diagram-wrap" ||
            !["display", "justify-content", "width"].includes(String(d[0]))
        )
        .map((d) => d.map(cssValue))
    );
  }
});
it("リストの点・番号と原本のmarker色、表・アンカー・コードリセット", () => {
  expect(css()).toMatch(/\.root :global\(ul\)\s*\{[^}]*list-style-type: disc/);
  expect(css()).toMatch(/\.root :global\(ol\)\s*\{[^}]*list-style-type: decimal/);
  expect(css()).toMatch(/::marker\s*\{[^}]*color: var\(--gold\)/);
  expect(css()).toMatch(
    /\.root :global\(th\),\s*\.root :global\(td\)\s*\{[^}]*text-align: left !important/
  );
  expect(css()).toContain("scroll-margin-top: calc(var(--header-height, 60px) + 80px)");
  expect(css()).toMatch(/\.root :global\(pre code\)\s*\{[^}]*background: none/);
  expect(css()).toMatch(/\.layout\s*\{[^}]*width: 100%/);
  expect(css()).toMatch(/\.codeLine\s*\{[^}]*white-space: pre/);
});
it("モバイル目次の不可視・操作不能・復元と共有ヘッダーオフセット", () => {
  expect(css()).toMatch(
    /@media \(max-width: 900px\)[\s\S]*?\.root \.sidebar\s*\{[^}]*visibility: hidden;[^}]*pointer-events: none/
  );
  expect(css()).toMatch(
    /\.root\.open \.sidebar\s*\{[^}]*visibility: visible;[^}]*pointer-events: auto/
  );
  expect(css()).toContain("top: calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))");
  const globals = fs.readFileSync("app/globals.css", "utf8");
  expect(globals).toContain('body:has([data-page="openai-models"]) nav[aria-label="関連ページ"]');
});
it("開いたモバイル目次のoverlayはinset: 0より後で共有ヘッダー分のtopを適用する", () => {
  // 900px以下の規則を出現順に走査し、同一セレクタ内の後勝ちカスケードを再現する
  const mobileDecls = (selector: string) => {
    const decls: Array<[string, string]> = [];
    postcss.parse(css()).walkAtRules("media", (m) => {
      if (m.params !== "(max-width: 900px)") return;
      m.walkRules((r) => {
        if (r.selector !== selector) return;
        r.walkDecls((d) => {
          decls.push([d.prop, d.value]);
        });
      });
    });
    return decls;
  };
  const resolvedTop = mobileDecls(".root.open .overlay").reduce<string | undefined>(
    (top, [prop, value]) => (prop === "top" || prop === "inset" ? value : top),
    undefined
  );
  expect(resolvedTop).toBe("calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))");
  expect(mobileDecls(".root .overlay")).toEqual([
    ["border", "0"],
    ["padding", "0"],
    ["width", "100%"],
  ]);
});
it("生HTML注入・実行script・表直下の空白・図解サイズ強制を禁止", () => {
  const src = fs.readFileSync("app/codex/models-best-practices/page.tsx", "utf8");
  expect(src).not.toContain(["danger", "ously", "Set", "Inner", "HTML"].join(""));
  expect(src).not.toContain("<script");
  expect(css()).not.toMatch(/:global\(svg\)/);
});

it("最終確認日と公開日はregistryを参照してヒーロー内に表示する", () => {
  const entry = pageRegistry.find((p) => p.slug === "/codex/models-best-practices");
  if (entry === undefined) throw new Error("pageRegistry に /codex/models-best-practices がない");
  const { lastReviewed, addedAt } = entry;
  const { container, getByTestId } = render(<Page />);
  const dates = getByTestId("hero-dates");
  expect(dates.closest("header")).toBe(container.querySelector(`.${styles.hero}`));
  expect(text(dates)).toBe(`最終確認日 ${lastReviewed} 公開日 ${addedAt}`);
  expect(
    Array.from(dates.querySelectorAll("time")).map((e) => [e.dateTime, e.textContent])
  ).toEqual([
    [lastReviewed, lastReviewed],
    [addedAt, addedAt],
  ]);
});
it("免責バナーとヒーロー間の重複余白・外部日付バーを無くす", () => {
  const ast = postcss.parse(fs.readFileSync("app/globals.css", "utf8"));
  const values = (selector: string) => {
    const result: Record<string, string> = {};
    ast.walkRules((r) => {
      if (r.selector !== selector) return;
      r.walkDecls((d) => {
        result[d.prop] = d.value;
      });
    });
    return result;
  };
  const body = values('body:has([data-page="openai-models"]).has-common-header');
  expect(body["margin-top"]).toBe("0");
  expect(body["padding-top"]).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(values('body:has([data-page="openai-models"]) #site-freshness-bar').display).toBe("none");
  const page = postcss.parse(css());
  const dates: Record<string, string> = {};
  page.walkRules((r) => {
    if (r.selector !== ".root .heroDates") return;
    r.walkDecls((d) => {
      dates[d.prop] = d.value;
    });
  });
  expect(dates.display).toBe("flex");
  expect(dates["flex-wrap"]).toBe("wrap");
  expect(dates.color).toBe("inherit");
});

it("共有リセットで失われる原本の見出し既定太字を復元する", () => {
  const ast = postcss.parse(css());
  for (const heading of ["h2", "h3"]) {
    const weights: string[] = [];
    ast.walkRules((rule) => {
      if (
        !rule.selector
          .split(",")
          .map((s) => s.trim())
          .includes(`.root .section :global(${heading})`)
      )
        return;
      rule.walkDecls("font-weight", (decl) => {
        weights.push(decl.value);
      });
    });
    expect(weights.at(-1)).toBe("700");
  }
});

it("紙色テーマの関連ページカードは文字色・境界・強調色を可読な値で宣言する", () => {
  const ast = postcss.parse(fs.readFileSync("app/globals.css", "utf8"));
  const decls = (selector: string) => {
    const result: Record<string, string> = {};
    ast.walkRules((r) => {
      if (r.selector !== selector) return;
      r.walkDecls((d) => {
        result[d.prop] = d.value;
      });
    });
    return result;
  };
  const nav = 'body:has([data-page="openai-models"]) nav[aria-label="関連ページ"]';
  const vars = decls(nav);
  const link = decls(`${nav} a`);
  // 既存の境界色・リンク色・カード背景とテーマ変数を一致させる
  expect(vars["--line"]).toBe(vars["border-color"]);
  expect(vars["--accent"]).toBe(link.color);
  expect(vars["--card"]).toBe(link.background);
  // WCAG 相対輝度によるコントラスト比（本文サイズ 4.5:1 以上）
  const luminance = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
    const [r, g, b] = [0, 2, 4].map((i) => {
      const c = Number.parseInt(full.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  for (const name of ["--fg", "--muted", "--accent"]) {
    expect(vars[name], name).toMatch(/^#[0-9a-f]{3,6}$/i);
    expect(contrast(vars[name], vars["--card"]), name).toBeGreaterThanOrEqual(4.5);
  }
});
