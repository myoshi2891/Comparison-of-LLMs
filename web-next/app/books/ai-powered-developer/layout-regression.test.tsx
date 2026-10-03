// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { parse } from "postcss";
import { Children, isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({ default: () => null }));
vi.mock("./TocObserver", () => ({ default: () => null }));
const css = parse(readFileSync("app/books/ai-powered-developer/page.module.css", "utf8"));
const scope = 'body:has([data-page="ai-powered-developer"])';
function declarations(selector: string, media: string | null = null) {
  const result: Record<string, string> = {};
  css.walkRules((rule) => {
    const parentMedia = rule.parent?.type === "atrule" ? rule.parent.params : null;
    if (rule.selector.replace(/\s+/g, " ").trim() !== selector || parentMedia !== media) return;
    rule.walkDecls((decl) => {
      result[decl.prop] = decl.value;
    });
  });
  return result;
}

describe("AI-Powered Developer hydration and shared layout regressions", () => {
  it("all table structures contain only permitted element children, never text nodes", () => {
    const allowed: Record<string, string[]> = {
      table: ["caption", "colgroup", "thead", "tbody", "tfoot"],
      thead: ["tr"],
      tbody: ["tr"],
      tfoot: ["tr"],
      tr: ["td", "th"],
      colgroup: ["col"],
    };
    const violations: string[] = [];
    function visit(node: ReactNode, parent?: string) {
      Children.forEach(node, (child) => {
        if (child == null || typeof child === "boolean") return;
        if (!isValidElement<{ children?: ReactNode }>(child)) {
          if (parent && allowed[parent]) violations.push(`${parent}: ${JSON.stringify(child)}`);
          return;
        }
        const tag = typeof child.type === "string" ? child.type : undefined;
        if (parent && allowed[parent] && (!tag || !allowed[parent].includes(tag))) {
          violations.push(`${parent}: <${tag ?? "component"}>`);
        }
        visit(child.props.children, tag);
      });
    }
    visit(Page());
    expect(violations).toEqual([]);
  });
  it("places exact registry dates first inside main content", () => {
    const { container } = render(<Page />);
    const main = container.querySelector(`.${styles.main}`);
    expect(main?.firstElementChild?.getAttribute("data-testid")).toBe("page-freshness");
    expect(
      Array.from(main?.firstElementChild?.querySelectorAll("time") ?? []).map((e) => ({
        dateTime: e.getAttribute("datetime"),
        text: e.textContent,
      }))
    ).toEqual([
      { dateTime: "2026-10-03", text: "2026-10-03" },
      { dateTime: "2026-10-03", text: "2026-10-03" },
    ]);
    expect(main?.firstElementChild?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "最終確認 2026-10-03 / 公開 2026-10-03"
    );
    expect(declarations(".freshness")).toEqual({
      padding: "1rem 3.4rem 0",
      color: "#000",
      background: "var(--paper)",
      "font-size": "0.8rem",
      "text-align": "right",
    });
  });
  it("adds modest space around the hero and above the guide explanation", () => {
    expect(declarations(".main .hero")).toEqual({ margin: "0.75rem 1rem" });
    expect(declarations(".hero .heroNote")).toEqual({ "margin-top": "1rem" });
  });
  it("removes the shared date bar and surplus body offset only on this page", () => {
    expect(declarations(`:global(${scope})`)).toEqual({
      "margin-top": "calc(var(--ch-height, 60px) + var(--ch-disclaimer-height, 0px))",
      background: "#faf6ec",
    });
    expect(declarations(`:global(${scope} #site-freshness-bar)`)).toEqual({ display: "none" });
    expect(declarations(".sidebar").top).toBe(
      "calc(var(--header-height, 60px) + var(--ch-disclaimer-height, 0px))"
    );
    expect(declarations(".sidebar").height).toBe(
      "calc(100dvh - var(--header-height, 60px) - var(--ch-disclaimer-height, 0px))"
    );
  });
  it("keeps the related-page footer inside the desktop content column and resets it on mobile", () => {
    const selector = `:global(${scope} nav[aria-label="関連ページ"])`;
    expect(declarations(selector)).toEqual({
      "margin-left": "288px",
      "margin-right": "0",
      "margin-top": "0",
      "max-width": "none",
      "--line": "#e4dac6",
      "--card": "#fffefb",
      "--fg": "#2a241c",
      "--muted": "#6b6255",
      "--accent": "#4b4b85",
    });
    expect(declarations(selector, "(max-width: 980px)")).toEqual({ "margin-left": "0" });
  });
});
