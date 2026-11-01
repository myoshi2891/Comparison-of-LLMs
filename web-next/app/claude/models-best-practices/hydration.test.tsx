import fs from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({ default: () => null }));
afterEach(cleanup);
it("表の構造要素直下にテキストノードを生成しない", () => {
  const { container } = render(<Page />);
  const invalid = Array.from(
    container.querySelectorAll("table,thead,tbody,tfoot,tr,colgroup")
  ).flatMap((el) =>
    Array.from(el.childNodes)
      .filter((node) => node.nodeType === 3)
      .map((node) => [el.tagName, node.textContent])
  );
  expect(invalid).toEqual([]);
});
it("共有クロームのオフセットと公開日背景をページ限定で統合する", () => {
  const css = fs.readFileSync("app/globals.css", "utf8");
  expect(css).toContain('body:has([data-page="claude-models"]).has-common-header');
  expect(css).toContain('body:has([data-page="claude-models"]) #site-freshness-bar');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const rule = (selector: string) => rules.find((match) => match[1].trim() === selector)?.[2] ?? "";
  const bodyRule = rule('body:has([data-page="claude-models"]).has-common-header');
  expect(bodyRule).toMatch(
    /margin-top: calc\(var\(--ch-height, 60px\) \+ var\(--ch-disclaimer-height, 0px\)\)/
  );
  const bar = rule('body:has([data-page="claude-models"]) #site-freshness-bar');
  expect(bar).toMatch(/width: calc\(100% - 272px\)/);
  expect(bar).toMatch(/margin: 0 0 0 272px/);
  expect(bar).toMatch(/background: linear-gradient\(135deg, #2f3e8f, #6b3a5e\)/);
  const { container } = render(<Page />);
  expect(container.querySelector('[data-page="claude-models"]')).toBeTruthy();
});
it("smooth scrollingのNext.js契約をルートhtmlに宣言する", () => {
  const layout = fs.readFileSync("app/layout.tsx", "utf8");
  expect(layout).toMatch(/<html[^>]*data-scroll-behavior="smooth"/);
});
