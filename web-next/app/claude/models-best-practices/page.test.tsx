import fs from "node:fs";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";
import expected from "./source-contract.json";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart, theme }: { chart: string; theme: string }) => (
    <div data-testid="mermaid" data-theme={theme}>
      {chart}
    </div>
  ),
}));
afterEach(cleanup);
const text = (e: Element) => (e.textContent ?? "").replace(/\s+/g, " ").trim();
for (const selector of [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "ul",
  "ol",
  "tr",
  "blockquote",
  "pre code",
])
  it(`原本完全一致 ${selector}`, () => {
    const { container } = render(<Page />);
    expect(
      Array.from(container.querySelectorAll(selector)).map((e) =>
        selector === "pre code"
          ? e.textContent
          : selector === "tr"
            ? Array.from(e.children).map(text).join(" ").trim()
            : text(e)
      )
    ).toEqual(expected[selector as keyof typeof expected]);
  });
it("目次の全リンクと順序", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll("aside nav a")).map((e) => [
      e.getAttribute("href"),
      text(e),
    ])
  ).toEqual(expected["aside nav a"]);
  for (const e of container.querySelectorAll("aside nav a"))
    expect(container.querySelector(e.getAttribute("href") ?? "#missing")).toBeTruthy();
});
it("図解本文とテーマ", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((e) => e.textContent)
  ).toEqual(expected.diagrams);
  expect(
    Array.from(container.querySelectorAll('[data-testid="mermaid"]')).map((e) =>
      e.getAttribute("data-theme")
    )
  ).toEqual(expected.diagrams.map(() => "base"));
});
it("CDN全件", () => {
  const { container } = render(<Page />);
  expect(
    Array.from(container.querySelectorAll('link[rel="stylesheet"]')).map((e) =>
      e.getAttribute("href")
    )
  ).toEqual(expected['link[rel="stylesheet"]']);
});
it("メタデータと階層", () => {
  expect(metadata.title).toBe(expected.h1[0]);
  expect(metadata.description).toBeTruthy();
  const { container } = render(<Page />);
  let level = 0;
  for (const h of container.querySelectorAll("h1,h2,h3,h4")) {
    const next = Number(h.tagName[1]);
    expect(next - level).toBeLessThanOrEqual(1);
    level = next;
  }
});
it("メニュー開閉とリンク選択", () => {
  const { container, getByRole } = render(<Page />);
  const b = getByRole("button", { name: "目次を開く" });
  expect(b.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(b);
  expect(b.getAttribute("aria-expanded")).toBe("true");
  expect(b.getAttribute("aria-label")).toBe("目次を閉じる");
  fireEvent.click(container.querySelector("aside a") as HTMLAnchorElement);
  expect(b.getAttribute("aria-expanded")).toBe("false");
  expect(b.getAttribute("aria-label")).toBe("目次を開く");
  fireEvent.click(b);
  expect(b.getAttribute("aria-label")).toBe("目次を閉じる");
  fireEvent.keyDown(window, { key: "Escape" });
  expect(b.getAttribute("aria-expanded")).toBe("false");
  expect(b.getAttribute("aria-label")).toBe("目次を開く");
});
it("チェック全件と解除", () => {
  const { container } = render(<Page />);
  const boxes = Array.from(container.querySelectorAll("input"));
  for (const box of boxes) fireEvent.click(box);
  expect(container.querySelector("#ckCount")?.textContent).toBe("10 / 10 完了");
  expect((container.querySelector("#ckFill") as HTMLElement).style.width).toBe("100%");
  fireEvent.click(boxes[0]);
  expect(container.querySelector("#ckCount")?.textContent).toBe("9 / 10 完了");
});
it("初期目次とスクロール追従・cleanup", () => {
  const { container, unmount } = render(<Page />);
  const links = Array.from(container.querySelectorAll("aside a"));
  expect(links.filter((e) => e.getAttribute("aria-current") === "location")).toEqual([links[10]]);
  const h = container.querySelector("#sec10") as HTMLElement;
  vi.spyOn(h, "getBoundingClientRect").mockReturnValue({ top: 9999 } as DOMRect);
  fireEvent.scroll(window);
  expect(links.filter((e) => e.getAttribute("aria-current") === "location")).toEqual([links[9]]);
  unmount();
  fireEvent.scroll(window);
});
it("リスト・表・アンカー・幅のCSS契約", () => {
  const css = fs.readFileSync("app/claude/models-best-practices/page.module.css", "utf8");
  expect(css).toMatch(/list-style-type: disc/);
  expect(css).toMatch(/list-style-type: decimal/);
  expect(css).toMatch(/text-align: left !important/);
  // 共有ヘッダー・折り返す免責バナー・モバイルバーの実測高さでアンカー位置を補正する
  expect(css).toMatch(
    /scroll-margin-top: calc\(var\(--ch-height, 60px\) \+ var\(--ch-disclaimer-height, 0px\) \+ 24px\)/
  );
  expect(css).toMatch(
    /scroll-margin-top: calc\(\s*var\(--ch-height, 60px\)\s*\+\s*var\(--ch-disclaimer-height, 0px\)\s*\+\s*var\(--mobile-bar-height\)\s*\+\s*16px\s*\)/
  );
  expect(css).not.toMatch(/--header-height/);
  expect(css).toMatch(/width: 100%/);
  expect(styles.layout).toBeTruthy();
});
// @media ブロックを波括弧の対応で切り出す（宣言がどのブレークポイントに属するかを判定するため）
const MOBILE_QUERY = "@media (max-width: 900px) {";
const mediaRanges = (css: string): Array<{ query: string; start: number; end: number }> => {
  const ranges: Array<{ query: string; start: number; end: number }> = [];
  for (let at = css.indexOf("@media"); at !== -1; at = css.indexOf("@media", at + 1)) {
    const open = css.indexOf("{", at);
    let depth = 0;
    let end = open;
    for (; end < css.length; end++) {
      if (css[end] === "{") depth++;
      if (css[end] === "}" && --depth === 0) break;
    }
    ranges.push({ query: css.slice(at, open + 1), start: at, end: end + 1 });
  }
  return ranges;
};
// 指定セレクタの全ルールを出現順に返す（所属する media クエリ付き。トップレベルは null）
const rulesFor = (css: string, selector: string) => {
  const ranges = mediaRanges(css);
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Array.from(css.matchAll(new RegExp(`(?:^|\\n)\\s*${escaped} \\{([^}]*)\\}`, "g"))).map(
    (m) => ({
      body: m[1],
      index: m.index ?? 0,
      media: ranges.find((r) => (m.index ?? 0) > r.start && (m.index ?? 0) < r.end)?.query ?? null,
    })
  );
};
it("モバイル目次の閉状態は不可視・操作不能、開状態で復元するCSS契約", () => {
  const css = fs.readFileSync("app/claude/models-best-practices/page.module.css", "utf8");
  const sidebar = rulesFor(css, ".root .sidebar");
  const open = rulesFor(css, ".root .sidebar.open");
  // 900px 超（デスクトップ）: トップレベルのサイドバーは不可視・操作不能にしてはならない
  const desktop = sidebar.filter((r) => r.media === null).map((r) => r.body);
  expect(desktop.length).toBeGreaterThan(0);
  expect(desktop.join("\n")).not.toMatch(/visibility:\s*hidden|pointer-events:\s*none/);
  // 900px 以下（モバイル）: 閉状態は hidden / none、開状態で visible / auto に戻す
  const mobile = sidebar.filter((r) => r.media === MOBILE_QUERY).map((r) => r.body);
  expect(mobile.join("\n")).toMatch(/visibility: hidden;[^}]*pointer-events: none;/);
  const mobileOpen = open.filter((r) => r.media === MOBILE_QUERY).map((r) => r.body);
  expect(mobileOpen.join("\n")).toMatch(/visibility: visible;[^}]*pointer-events: auto;/);
  expect(open.filter((r) => r.media === null)).toEqual([]);
});
it("モバイルバーは開いたサイドバーより前面にあり、サイドバーはバーの下から始まるCSS契約", () => {
  const css = fs.readFileSync("app/claude/models-best-practices/page.module.css", "utf8");
  const zIndex = (rules: ReturnType<typeof rulesFor>) =>
    rules
      .map((r) => r.body.match(/z-index:\s*(\d+)/)?.[1])
      .filter((v): v is string => v !== undefined)
      .map(Number)
      .at(-1);
  const sidebarZ = zIndex(rulesFor(css, ".root .sidebar"));
  const barZ = zIndex(rulesFor(css, ".root .mobile-bar").filter((r) => r.media === MOBILE_QUERY));
  expect(sidebarZ).toBe(20);
  expect(barZ).toBeGreaterThan(sidebarZ ?? Number.POSITIVE_INFINITY);
  // カスケード上で最後に効く top 指定が、モバイルではバーの高さ分だけ下げたものであること
  const tops = rulesFor(css, ".root .sidebar").filter((r) => /(^|\s|;)top:/.test(r.body));
  const desktopTop = tops.filter((r) => r.media === null).at(-1);
  const mobileTop = tops.filter((r) => r.media === MOBILE_QUERY).at(-1);
  expect(desktopTop?.body).toMatch(
    /top: calc\(var\(--ch-height, 60px\) \+ var\(--ch-disclaimer-height, 0px\)\);/
  );
  expect(mobileTop?.body).toMatch(
    /top: calc\(\s*var\(--ch-height, 60px\)\s*\+\s*var\(--ch-disclaimer-height, 0px\)\s*\+\s*var\(--mobile-bar-height\)\s*\);/
  );
  expect(mobileTop?.index ?? -1).toBeGreaterThan(desktopTop?.index ?? Number.POSITIVE_INFINITY);
});
it("図解ラッパーは横スクロールのみ担当し、配置・幅はMermaidDiagramへ委譲するCSS契約", () => {
  const css = fs.readFileSync("app/claude/models-best-practices/page.module.css", "utf8");
  const block = css.match(/\.diagram-wrap \{([^}]*)\}/)?.[1] ?? "";
  expect(block).toMatch(/overflow-x: auto;/);
  expect(block).not.toMatch(/display:|justify-content:|(^|[^-])width:/);
});
