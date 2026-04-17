// Phase A [Red] contract test. Expected to FAIL until Green phase
// implements components/site/SiteHeader.tsx (RSC structure) and
// components/site/SiteHeaderClient.tsx (client handlers).

/**
 * Phase A 契約テスト (SiteHeader / RSC 構造)。
 *
 * 役割分担:
 * - SiteHeader (Server Component): マークアップ・active 判定・
 *   navLinks の展開・GitHub 外部リンクの注入。
 * - SiteHeaderClient (Client Component): hamburger/dropdown の
 *   開閉・Escape・外側クリックなど DOM インタラクション。本テストは
 *   RSC 側の契約のみ固定する。
 *
 * 固定する契約:
 * - ルート `<nav id="common-header" aria-label="Main Navigation" class="ch-nav">`。
 * - `<a class="ch-brand" href="/">LLM Studies</a>`。
 * - `<ul class="ch-links">` 配下に navLinks 由来の `<li>` が描画される。
 * - dropdown は `<li class="ch-dropdown">` > toggle + submenu 構造。
 * - pathname="/claude/skill" で該当 `<a>` に ch-active + aria-current="page"。
 * - 親 dropdown トグルにも ch-active が波及 (isParentActive 相当)。
 * - GitHub 外部リンクが末尾に target/rel 付きで描画される。
 * - 静的検査: 生 HTML 注入 API 名をソースに含まない (XSS 不使用証明)。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site/SiteHeader";

describe("Phase A - SiteHeader root structure", () => {
  it("renders <nav id=common-header aria-label='Main Navigation'>", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const nav = container.querySelector("nav#common-header");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("Main Navigation");
    expect(nav?.className).toContain("ch-nav");
  });

  it("renders .ch-brand anchor pointing to /", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const brand = container.querySelector("a.ch-brand");
    expect(brand?.getAttribute("href")).toBe("/");
    expect(brand?.textContent).toBe("LLM Studies");
  });

  it("renders a .ch-links list", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    expect(container.querySelector("ul.ch-links")).not.toBeNull();
  });
});

describe("Phase A - SiteHeader dropdown rendering", () => {
  it("renders 4 dropdowns (Claude/Gemini/Codex/Copilot) as .ch-dropdown <li>", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const dropdowns = container.querySelectorAll("li.ch-dropdown");
    expect(dropdowns.length).toBe(4);
  });

  it("each dropdown has a .ch-dropdown-toggle button with aria-haspopup=true", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const toggles = container.querySelectorAll("li.ch-dropdown .ch-dropdown-toggle");
    expect(toggles.length).toBe(4);
    toggles.forEach((btn) => {
      expect(btn.getAttribute("aria-haspopup")).toBe("true");
    });
  });

  it("each dropdown has a .ch-submenu <ul> with at least one child", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const submenus = container.querySelectorAll("li.ch-dropdown ul.ch-submenu");
    expect(submenus.length).toBe(4);
    submenus.forEach((ul) => {
      expect(ul.querySelectorAll("li").length).toBeGreaterThan(0);
    });
  });
});

describe("Phase A - SiteHeader active-path handling", () => {
  it("marks the matching leaf link with ch-active and aria-current=page", () => {
    const { container } = render(<SiteHeader pathname="/claude/skill" />);
    const active = container.querySelector("a.ch-active");
    expect(active).not.toBeNull();
    expect(active?.getAttribute("href")).toBe("/claude/skill");
    expect(active?.getAttribute("aria-current")).toBe("page");
  });

  it("propagates ch-active to the parent dropdown toggle when a child is active", () => {
    const { container } = render(<SiteHeader pathname="/claude/skill" />);
    const toggles = container.querySelectorAll("li.ch-dropdown .ch-dropdown-toggle");
    const activeToggles = Array.from(toggles).filter((t) => t.className.includes("ch-active"));
    expect(activeToggles.length).toBe(1);
    expect(activeToggles[0].textContent).toContain("Claude");
  });

  it("does not add ch-active to any link when pathname is unrecognized", () => {
    const { container } = render(<SiteHeader pathname="/not-a-real-page" />);
    expect(container.querySelector("a.ch-active")).toBeNull();
  });
});

describe("Phase A - SiteHeader GitHub external link", () => {
  it("renders a trailing GitHub anchor with target=_blank and rel=noopener noreferrer", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const items = container.querySelectorAll("ul.ch-links > li");
    const lastItem = items[items.length - 1];
    const anchor = lastItem?.querySelector("a");
    expect(anchor?.getAttribute("href")).toMatch(/github\.com/);
    expect(anchor?.getAttribute("target")).toBe("_blank");
    expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("Phase A - SiteHeader static source safety", () => {
  it("source file does not use React unsafe HTML injection API", () => {
    const source = readFileSync(join(__dirname, "SiteHeader.tsx"), "utf8");
    // API 名をリテラルで書かずに組み立てて検索 (Phase 5 XSS 監査パターン)。
    const unsafeApiName = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source).not.toContain(unsafeApiName);
  });

  it("source file does not declare 'use client' (RSC is mandatory)", () => {
    const source = readFileSync(join(__dirname, "SiteHeader.tsx"), "utf8");
    const firstStmt = source.replace(/^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n?)*/g, "");
    expect(firstStmt).not.toMatch(/^["']use client["']/);
  });
});
