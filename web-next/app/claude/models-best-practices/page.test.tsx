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
  const b = getByRole("button", { name: "menu" });
  expect(b.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(b);
  expect(b.getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(container.querySelector("aside a") as HTMLAnchorElement);
  expect(b.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(b);
  fireEvent.keyDown(window, { key: "Escape" });
  expect(b.getAttribute("aria-expanded")).toBe("false");
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
  expect(css).toMatch(/scroll-margin-top: calc\(var\(--header-height, 60px\) \+ 80px\)/);
  expect(css).toMatch(/width: 100%/);
  expect(styles.layout).toBeTruthy();
});
