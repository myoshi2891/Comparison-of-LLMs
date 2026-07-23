// Phase A [Green] contract test.
//
// Red 初稿では「SiteHeader は RSC 必須」と決めていたが、Next.js 16 App Router +
// output: 'export' の環境では RSC から pathname を参照する手段がなく
// (`usePathname` は Client 専用。`headers()` は SSG と相性が悪い)、
// SiteHeader は Client Component とし `usePathname()` で現在地を読むように
// 契約を反転した。構造・active 判定・GitHub 外部リンクの契約は Red のまま据え置き。

/**
 * Phase A 契約テスト (SiteHeader / 構造 + active 判定)。
 *
 * 役割分担:
 * - SiteHeader (Client Component): usePathname で現在地を取得しつつ、
 *   マークアップ・active 判定・navLinks の展開・GitHub 外部リンクの注入を担当。
 * - SiteHeaderClient (Client Component): hamburger/dropdown の
 *   開閉・Escape・外側クリックなど DOM インタラクションだけを束ねる。
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
 * - 静的検査: `"use client"` ディレクティブが先頭にある (usePathname 依存のため必須)。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { SiteHeader as RawSiteHeader } from "@/components/site/SiteHeader";

const SiteHeader = RawSiteHeader as unknown as (props: { pathname: string }) => ReactElement;

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

// F-4'（plans/008）: ナビは page-registry からの導出になり、トップレベルは
// 5 ドロップダウン（Providers / Agent 開発 / 開発プロセス / 運用・品質 / モデル・データ）
// + Home / What's New のフラットリンクへ集約された。Providers のみ 2 段ネストする。
describe("SiteHeader dropdown rendering", () => {
  it("renders 5 dropdowns (Providers / Agent 開発 / 開発プロセス / 運用・品質 / モデル・データ)", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const dropdowns = container.querySelectorAll("li.ch-dropdown");
    expect(dropdowns.length).toBe(5);
  });

  it("each dropdown has a .ch-dropdown-toggle button with aria-haspopup=true", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const toggles = container.querySelectorAll("li.ch-dropdown > .ch-dropdown-toggle");
    expect(toggles.length).toBe(5);
    toggles.forEach((btn) => {
      expect(btn.getAttribute("aria-haspopup")).toBe("true");
    });
  });

  it("each dropdown has a .ch-submenu <ul> with at least one child", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const submenus = container.querySelectorAll("li.ch-dropdown > ul.ch-submenu");
    expect(submenus.length).toBe(5);
    submenus.forEach((ul) => {
      expect(ul.querySelectorAll("li").length).toBeGreaterThan(0);
    });
  });
});

describe("SiteHeader nested sub-dropdown rendering (Providers only)", () => {
  it("renders 5 sub-dropdowns (Claude / Google / Codex / Copilot / Moonshot) under Providers", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const subs = container.querySelectorAll("li.ch-subdropdown");
    expect(subs.length).toBe(5);
    expect(Array.from(subs).map((li) => li.querySelector("button")?.textContent)).toEqual([
      "Claude",
      "Google",
      "Codex",
      "Copilot",
      "Moonshot",
    ]);
  });

  it("each sub-dropdown has a toggle with aria-haspopup and a .ch-subsubmenu <ul>", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const toggles = container.querySelectorAll("li.ch-subdropdown > .ch-subdropdown-toggle");
    expect(toggles.length).toBe(5);
    toggles.forEach((btn) => {
      expect(btn.getAttribute("aria-haspopup")).toBe("true");
    });
    const subsubmenus = container.querySelectorAll("li.ch-subdropdown > ul.ch-subsubmenu");
    expect(subsubmenus.length).toBe(5);
    subsubmenus.forEach((ul) => {
      expect(ul.querySelectorAll("li").length).toBeGreaterThan(0);
    });
  });

  it("nests sub-dropdowns inside the Providers submenu (not at top level)", () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const stray = container.querySelectorAll("ul.ch-links > li.ch-subdropdown");
    expect(stray.length).toBe(0);
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

  // F-4': /claude/skill は Providers ▸ Claude ▸ Skill の 3 階層下にある。
  // 祖先の Providers トグルまで active が波及しないと、現在地が畳まれたメニューの
  // 中に埋もれて見えなくなる（isParentActive の再帰化がこれを担保する）。
  it("propagates ch-active to the top-level dropdown toggle when a nested leaf is active", () => {
    const { container } = render(<SiteHeader pathname="/claude/skill" />);
    const toggles = container.querySelectorAll("li.ch-dropdown > .ch-dropdown-toggle");
    const activeToggles = Array.from(toggles).filter((t) => t.className.includes("ch-active"));
    expect(activeToggles.length).toBe(1);
    expect(activeToggles[0].textContent).toContain("Providers");
  });

  it("propagates ch-active to the sub-dropdown toggle when a nested leaf is active", () => {
    const { container } = render(<SiteHeader pathname="/claude/skill" />);
    const subToggles = container.querySelectorAll("li.ch-subdropdown > .ch-subdropdown-toggle");
    const active = Array.from(subToggles).filter((t) => t.className.includes("ch-active"));
    expect(active.length).toBe(1);
    expect(active[0].textContent).toContain("Claude");
  });

  // 非ネストのグループ（Agent 開発）は 1 段のまま。サブトグルは active にならない。
  it("propagates ch-active to a flat group's toggle without touching sub-dropdowns", () => {
    const { container } = render(<SiteHeader pathname="/agent/loop-engineering" />);
    const toggles = container.querySelectorAll("li.ch-dropdown > .ch-dropdown-toggle");
    const activeToggles = Array.from(toggles).filter((t) => t.className.includes("ch-active"));
    expect(activeToggles.length).toBe(1);
    expect(activeToggles[0].textContent).toContain("Agent 開発");

    const subToggles = container.querySelectorAll("li.ch-subdropdown > .ch-subdropdown-toggle");
    const activeSubs = Array.from(subToggles).filter((t) => t.className.includes("ch-active"));
    expect(activeSubs.length).toBe(0);
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

  it("declares 'use client' on the first effective line (usePathname requires Client)", () => {
    const source = readFileSync(join(__dirname, "SiteHeader.tsx"), "utf8");
    const firstStmt = source.replace(/^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n?)*/g, "");
    expect(firstStmt).toMatch(/^["']use client["']/);
  });
});
