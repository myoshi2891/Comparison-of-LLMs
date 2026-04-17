// Phase A [Red] contract test. Expected to FAIL until Green phase
// implements components/site/DisclaimerBanner.tsx (Client Component with
// ResizeObserver syncing --ch-disclaimer-height CSS custom property).

/**
 * Phase A 契約テスト (DisclaimerBanner)。
 *
 * 固定する契約:
 * - ルート `<div class="ch-disclaimer" lang="ja">`。
 * - 2 行の `<span class="ch-disclaimer-line">` が描画される。
 * - line1 テキスト完全一致: legacy/shared/common-header.js:302 と同一。
 * - line2 テキスト完全一致: legacy/shared/common-header.js:306 と同一。
 * - マウント時に ResizeObserver が disclaimer 要素を observe し、
 *   document.documentElement.style に --ch-disclaimer-height が設定される。
 * - 静的検査: `"use client"` ディレクティブ存在 (useEffect 経由 DOM 操作のため)。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";

// jsdom は ResizeObserver を実装しないため、テスト用の最小モックを注入する。
// observe() 時に即座にコールバックを呼び、syncDisclaimerHeight のロジックを発火させる。
class MockResizeObserver {
  private cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
  }
  observe(target: Element) {
    // レイアウトは jsdom で計算されないため、contentRect を仮値で用意する。
    this.cb([{ target, contentRect: { height: 72 } } as unknown as ResizeObserverEntry], this);
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  // 各テスト前に CSS カスタムプロパティをクリア。
  document.documentElement.style.removeProperty("--ch-disclaimer-height");
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

describe("Phase A - DisclaimerBanner root structure", () => {
  it("renders a .ch-disclaimer root with lang=ja", () => {
    const { container } = render(<DisclaimerBanner />);
    const root = container.querySelector(".ch-disclaimer");
    expect(root).not.toBeNull();
    expect(root?.getAttribute("lang")).toBe("ja");
  });

  it("renders exactly 2 .ch-disclaimer-line spans", () => {
    const { container } = render(<DisclaimerBanner />);
    const lines = container.querySelectorAll(".ch-disclaimer-line");
    expect(lines.length).toBe(2);
  });
});

describe("Phase A - DisclaimerBanner text contract", () => {
  it("line 1 matches the legacy common-header text exactly", () => {
    const { container } = render(<DisclaimerBanner />);
    const lines = container.querySelectorAll(".ch-disclaimer-line");
    expect(lines[0].textContent).toBe(
      "\u26A0 本サイトは個人開発の参考用に作成したものです。必ず各社公式ページで最新の料金/仕様をご確認ください。"
    );
  });

  it("line 2 matches the legacy common-header text exactly", () => {
    const { container } = render(<DisclaimerBanner />);
    const lines = container.querySelectorAll(".ch-disclaimer-line");
    expect(lines[1].textContent).toBe(
      "情報の正確性は保証しません。本サイトの利用による損害等について一切の責任を負いません。"
    );
  });
});

describe("Phase A - DisclaimerBanner ResizeObserver integration", () => {
  it("sets --ch-disclaimer-height on <html> after mount", () => {
    render(<DisclaimerBanner />);
    const val = document.documentElement.style.getPropertyValue("--ch-disclaimer-height");
    expect(val).not.toBe("");
    expect(val).toMatch(/px$/);
  });
});

describe("Phase A - DisclaimerBanner static source", () => {
  it("declares 'use client' on the first effective line", () => {
    const source = readFileSync(join(__dirname, "DisclaimerBanner.tsx"), "utf8");
    const firstStmt = source.replace(/^\s*(\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n?)*/g, "");
    expect(firstStmt).toMatch(/^["']use client["']/);
  });
});
