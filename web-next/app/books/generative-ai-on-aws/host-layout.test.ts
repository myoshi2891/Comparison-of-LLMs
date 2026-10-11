import { readFileSync } from "node:fs";
import { parse } from "postcss";
import { describe, expect, it } from "vitest";

const css = parse(readFileSync("app/books/generative-ai-on-aws/page.module.css", "utf8"));
const body = ":global(body):has(.layout)";
const freshness = `${body} :global(#site-freshness-bar)`;
const related = `${body} :global(nav[aria-label="関連ページ"])`;

function declarations(selector: string, media: string | null = null) {
  const result: Record<string, string> = {};
  css.walkRules((rule) => {
    const parentMedia = rule.parent?.type === "atrule" ? rule.parent.params : null;
    if (
      rule.selector.replace(/\s+/g, " ") !== selector.replace(/\s+/g, " ") ||
      parentMedia !== media
    )
      return;
    rule.walkDecls((declaration) => {
      result[declaration.prop] = declaration.value;
    });
  });
  return result;
}

describe("AWS guide — shared chrome and original native scrollbar", () => {
  it("restores the original light native controls without a custom scrollbar design", () => {
    expect(declarations(".layout")["color-scheme"]).toBe("light");
    const customScrollbars: string[] = [];
    css.walkRules((rule) => {
      if (rule.selector.includes("scrollbar")) customScrollbars.push(rule.selector);
      rule.walkDecls((declaration) => {
        if (declaration.prop.startsWith("scrollbar-")) customScrollbars.push(declaration.prop);
      });
    });
    expect(customScrollbars).toEqual([]);
    const sidebar = declarations(".sidebar");
    expect([sidebar.position, sidebar.bottom, sidebar["overflow-y"], sidebar.padding]).toEqual([
      "fixed",
      "0",
      "auto",
      "1.6rem 1.1rem 3rem",
    ]);
  });

  it("uses the original paper background around the shared date bar and footer", () => {
    expect(declarations(body)).toEqual({
      "--sidebar-w": "300px",
      background: "#faf6ec",
    });
    expect(declarations(freshness)).toEqual({
      "box-sizing": "border-box",
      "max-width": "none",
      width: "calc(100% - var(--sidebar-w))",
      "margin-left": "var(--sidebar-w)",
      "margin-right": "0",
      "padding-right": "3.5rem",
      background: "#faf6ec",
      color: "#5c5544",
      "justify-content": "flex-end",
    });
    expect(declarations(`${freshness} :global(time)`)).toEqual({ color: "#2a2418" });
  });

  it("keeps every shared footer card outside the fixed desktop sidebar", () => {
    expect(declarations(related)).toEqual({
      "--line": "#e4dcc8",
      "--card": "#fffdf8",
      "--fg": "#2a2418",
      "--muted": "#5c5544",
      "--accent": "#3f3d8a",
      "box-sizing": "border-box",
      "max-width": "none",
      width: "calc(100% - var(--sidebar-w))",
      "margin-left": "var(--sidebar-w)",
      "margin-right": "0",
      "padding-left": "3.5rem",
      "padding-right": "3.5rem",
    });
  });

  it("removes desktop sidebar spacing from both shared elements at the mobile breakpoint", () => {
    expect(declarations(`${freshness},\n${related}`, "(max-width: 980px)")).toEqual({
      width: "100%",
      "margin-left": "0",
      "padding-left": "1.3rem",
      "padding-right": "1.3rem",
    });
  });
});
