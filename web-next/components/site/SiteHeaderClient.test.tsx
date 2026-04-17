// Phase A [Red] contract test. Expected to FAIL until Green phase
// implements components/site/SiteHeaderClient.tsx with hamburger/dropdown
// toggle, Escape and outside-click close handlers.

/**
 * Phase A 契約テスト (SiteHeaderClient / インタラクション)。
 *
 * 役割分担:
 * - SiteHeader (RSC) が DOM 構造と navLinks 展開を担当。
 * - SiteHeaderClient が hamburger / dropdown の開閉・キーボード・
 *   外側クリック処理だけを引き受ける Client Component。
 *
 * 固定する契約:
 * - `"use client"` ディレクティブが先頭行に存在する。
 * - hamburger ボタン click で .ch-links に ch-open クラスが付与/除去される。
 * - dropdown toggle click で aria-expanded が false ↔ true に切替。
 * - Escape キー入力で dropdown が閉じる (aria-expanded=false に戻る)。
 * - 外側クリック (document.body) で menu と dropdown の両方が閉じる。
 * - hamburger の aria-expanded が menu 開閉と同期する。
 * - hamburger 内に .ch-bar が 3 本描画される。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeaderClient } from "@/components/site/SiteHeaderClient";

/**
 * 最小のテスト用 children:
 * SiteHeaderClient は RSC 側で組み立てた DOM を children で受け取って
 * インタラクションだけを付与するラッパーを想定する。テスト独立性のため
 * ここで期待する DOM の最小集合を注入する。
 */
const minimalNavDom = (
  <nav id="common-header" className="ch-nav" aria-label="Main Navigation">
    <button className="ch-hamburger" aria-controls="ch-menu" aria-expanded="false" aria-label="Toggle menu">
      <span className="ch-bar" />
      <span className="ch-bar" />
      <span className="ch-bar" />
    </button>
    <ul id="ch-menu" className="ch-links">
      <li className="ch-dropdown">
        <button className="ch-dropdown-toggle" aria-expanded="false" aria-haspopup="true">
          <span>Claude</span>
        </button>
        <ul className="ch-submenu">
          <li>
            <a href="/claude/skill">Skill</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
);

describe("Phase A - SiteHeaderClient directive", () => {
  it("declares 'use client' on the first effective line", () => {
    const source = readFileSync(join(__dirname, "SiteHeaderClient.tsx"), "utf8");
    const firstStmt = source.replace(/^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n?)*/g, "");
    expect(firstStmt).toMatch(/^["']use client["']/);
  });
});

describe("Phase A - SiteHeaderClient hamburger toggle", () => {
  it("renders 3 .ch-bar spans inside the hamburger", () => {
    const { container } = render(<SiteHeaderClient>{minimalNavDom}</SiteHeaderClient>);
    const bars = container.querySelectorAll(".ch-hamburger .ch-bar");
    expect(bars.length).toBe(3);
  });

  it("adds ch-open to .ch-links when hamburger is clicked", () => {
    const { container } = render(<SiteHeaderClient>{minimalNavDom}</SiteHeaderClient>);
    const hamburger = container.querySelector(".ch-hamburger") as HTMLElement;
    const links = container.querySelector(".ch-links") as HTMLElement;
    fireEvent.click(hamburger);
    expect(links.className).toContain("ch-open");
  });

  it("syncs hamburger aria-expanded with menu state", () => {
    const { container } = render(<SiteHeaderClient>{minimalNavDom}</SiteHeaderClient>);
    const hamburger = container.querySelector(".ch-hamburger") as HTMLElement;
    expect(hamburger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(hamburger);
    expect(hamburger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(hamburger);
    expect(hamburger.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Phase A - SiteHeaderClient dropdown toggle", () => {
  it("flips dropdown aria-expanded false -> true on click", () => {
    const { container } = render(<SiteHeaderClient>{minimalNavDom}</SiteHeaderClient>);
    const toggle = container.querySelector(".ch-dropdown-toggle") as HTMLElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("closes dropdown on Escape keydown", () => {
    const { container } = render(<SiteHeaderClient>{minimalNavDom}</SiteHeaderClient>);
    const toggle = container.querySelector(".ch-dropdown-toggle") as HTMLElement;
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Phase A - SiteHeaderClient outside click", () => {
  it("closes menu and dropdown when clicking outside the nav", () => {
    const { container } = render(<SiteHeaderClient>{minimalNavDom}</SiteHeaderClient>);
    const hamburger = container.querySelector(".ch-hamburger") as HTMLElement;
    const toggle = container.querySelector(".ch-dropdown-toggle") as HTMLElement;
    const links = container.querySelector(".ch-links") as HTMLElement;

    fireEvent.click(hamburger);
    fireEvent.click(toggle);
    expect(links.className).toContain("ch-open");
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(document.body);
    expect(links.className).not.toContain("ch-open");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});
