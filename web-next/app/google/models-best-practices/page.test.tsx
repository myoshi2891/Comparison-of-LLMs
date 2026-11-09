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
for (const cls of ["callout", "diagram-title", "chk-list label", "hero", "footer"] as const)
  it(`原本の複合要素本文を保持: ${cls}`, () => {
    const { container } = render(<Page />);
    const selector = cls === "chk-list label" ? `.${styles["chk-list"]} label` : `.${styles[cls]}`;
    expect(
      Array.from(container.querySelectorAll(selector)).map(cls === "hero" ? originalHeroText : text)
    ).toEqual(expected[`.${cls}`]);
  });
it("全32表のセル型・結合・全文・行順序を保持", () => {
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
it("外部65リンクの本文・URL・順序・安全属性", () => {
  const { container } = render(<Page />);
  const links = Array.from(container.querySelectorAll('a[href^="http"]'));
  expect(links.map((e) => [e.getAttribute("href"), text(e)])).toEqual(expected.external);
  for (const a of links) {
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener noreferrer");
  }
  expect(
    // jsdom の a.href は相対URLを http://localhost… へ解決するため、生の href 属性で内部リンクを判定する。
    Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return !href.startsWith("http") && href.includes(".html");
    })
  ).toEqual([]);
});
it("図解10件の全文・順序・テーマ・専用ラッパー", () => {
  const { container } = render(<Page />);
  const diagrams = Array.from(container.querySelectorAll('[data-testid="mermaid"]'));
  expect(diagrams.map((e) => e.textContent)).toEqual(expected.diagrams);
  expect(
    Array.from(container.querySelectorAll(`.${styles["diagram-wrap"]} [data-testid="mermaid"]`))
  ).toEqual(diagrams);
  for (const e of diagrams) {
    expect(e.getAttribute("data-theme")).toBe("base");
    expect(JSON.parse(e.getAttribute("data-vars") ?? "{}")).toEqual({
      fontFamily:
        '"Noto Sans JP","Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif',
      fontSize: "15px",
      primaryColor: "#ffffff",
      primaryTextColor: "#26231e",
      primaryBorderColor: "#34439a",
      lineColor: "#4b453b",
      secondaryColor: "#f2ede1",
      tertiaryColor: "#faf7f0",
      edgeLabelBackground: "#ffffff",
    });
    expect(e.textContent).toMatch(/^(flowchart|sequenceDiagram)/);
    expect(e.textContent).not.toMatch(/^\s|block-beta/);
  }
});
it("12コード例の全ハイライトトークンを原本11.12.0と照合", () => {
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
    "Gemini のモデル選択、思考水準、Long Decode、API移行と本番運用の実践ガイド。情報基準日2026-10-23。"
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
  ).toEqual(["info", "warn", "info", "good", "info", "warn", "info", "info"]);
  for (const e of container.querySelectorAll('[data-variant="warn"]'))
    expect(e.querySelector('[data-testid="callout-label"]')).toBeTruthy();
});
it("レジストリからGoogleの導線へ登録し移行確認日を記録", () => {
  expect(pageRegistry.find((p) => p.slug === "/google/models-best-practices")).toEqual({
    slug: "/google/models-best-practices",
    title: "Gemini 最新モデル ベストプラクティス",
    group: "Providers",
    category: "Google",
    provider: "google",
    topics: ["google", "prompting", "agent", "agents"],
    summary: "Gemini のモデル選択、思考水準、Long Decode、API移行と本番運用の実践ガイド。",
    addedAt: "2026-11-02",
    lastReviewed: "2026-11-02",
  });
});
const cssValue = (v: unknown) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().replace(/'/g, '"') : v;
const css = () => fs.readFileSync("app/google/models-best-practices/page.module.css", "utf8");
// 元CSSを独立した固定期待値として保存。共有図解への委譲とルート・開閉スコープだけ明示変換する。
const scoped = (s: string) =>
  s
    .split(",")
    .map((s) => {
      s = s.trim();
      if ([":root", "body", "html"].includes(s)) return ".root";
      s = s.replace(/^body\.menu-open /, ".root.open ");
      s = s.replace(/(^|[ >+~])([a-z][a-z0-9-]*)(?=[\s.#:[>+~]|$)/g, "$1:global($2)");
      return s.startsWith(".root") ? s : `.root ${s}`;
    })
    .join(", ")
    .replace(/\s+/g, " ");
it("原本104 CSS規則の宣言・メディア条件を漏れなく転写", () => {
  const ast = postcss.parse(css());
  for (const source of expected.css) {
    if ([".diagram-canvas", ".diagram-canvas svg", ".mermaidTooltip"].includes(source.selector))
      continue;
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
    ).toContainEqual(source.declarations.map((d) => d.map(cssValue)));
  }
});
it("リストの点・番号とチェックリスト例外、表・アンカー・コードリセット", () => {
  expect(css()).toMatch(/\.root :global\(ul\)\s*\{[^}]*list-style-type: disc/);
  expect(css()).toMatch(/\.root :global\(ol\)\s*\{[^}]*list-style-type: decimal/);
  expect(css()).toMatch(/\.root \.chk-list\s*\{[^}]*list-style(?:-type)?: none/);
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
  expect(globals).toContain('body:has([data-page="gemini-models"]) nav[aria-label="関連ページ"]');
});
it("チェックリストのフォーカス枠は転写値を保持し、後続規則で濃色へ補強する", () => {
  const rules: postcss.Rule[] = [];
  postcss.parse(css()).walkRules(".root .chk :global(input):focus-visible", (r) => {
    rules.push(r);
  });
  const declarations = rules.map((r) =>
    r.nodes.map((n) => {
      const d = n as postcss.Declaration;
      return [d.prop, d.value];
    })
  );
  // 同じ詳細度のため順序も契約に含める。補強が先に来ると outline の短縮指定に打ち消される。
  expect(declarations).toEqual([
    [
      ["outline", "3px solid #9aa6e8"],
      ["outline-offset", "2px"],
    ],
    [["outline-color", "var(--indigo)"]],
  ]);
});
it("免責バナーは淡色の本文背景に透けず、共有の黄色文字が読める暗色背景を持つ", () => {
  const rules: postcss.Rule[] = [];
  postcss
    .parse(fs.readFileSync("app/globals.css", "utf8"))
    .walkRules('body:has([data-page="gemini-models"]) .ch-disclaimer', (r) => {
      rules.push(r);
    });
  expect(
    rules.map((r) =>
      r.nodes.map((n) => {
        const d = n as postcss.Declaration;
        return [d.prop, d.value];
      })
    )
  ).toEqual([[["background", "#26231c"]]]);
});
it("生HTML注入・実行script・表直下の空白・図解サイズ強制を禁止", () => {
  const src = fs.readFileSync("app/google/models-best-practices/page.tsx", "utf8");
  expect(src).not.toContain(["danger", "ously", "Set", "Inner", "HTML"].join(""));
  expect(src).not.toContain("<script");
  expect(css()).not.toMatch(/\.diagram-canvas|:global\(svg\)/);
});

it("最終確認日と公開日はregistryを参照してヒーロー内に表示する", () => {
  // 期待値は registry の当該エントリから導出する。月次更新では registry の lastReviewed と、
  // 上の registry 完全一致テストの期待値を同時に更新すること。
  const entry = pageRegistry.find((p) => p.slug === "/google/models-best-practices");
  expect(entry, "pageRegistry に /google/models-best-practices がない").toBeDefined();
  if (entry === undefined) return;
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
  const body = values('body:has([data-page="gemini-models"]).has-common-header');
  expect(body["margin-top"]).toBe("0");
  expect(body["padding-top"]).toBe(
    "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))"
  );
  expect(values('body:has([data-page="gemini-models"]) #site-freshness-bar').display).toBe("none");
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
  const nav = 'body:has([data-page="gemini-models"]) nav[aria-label="関連ページ"]';
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
