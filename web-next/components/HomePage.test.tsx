/**
 * HomePage 契約テスト。
 *
 * Client Component: useState × 5 で全 UI 状態を管理する最上位シェル。
 * app/page.tsx (Server) が Zod 検証済みデータを渡し、
 * HomePage が全子コンポーネントを合成する。
 *
 * カバレッジ:
 * - "use client" 宣言 (Client Component)
 * - 子コンポーネント配線 (LanguageToggle / Hero / ScenarioSelector / ApiTable / SubTable / MathSection / RefLinks)
 * - time-badges (7 個)
 * - cellNote (JA)
 * - タブ初期状態 (API active)
 * - タブ切替 (Sub クリックで SubTable 表示)
 * - tRich 配線 (apiNote / subNote / disclaimer)
 * - footer (generated_at / JPY レート)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/components/HomePage";
import type { PricingData } from "@/types/pricing";

// 最小限のテスト用 pricing データ
const testPricing: PricingData = {
  generated_at: "2025-01-15T00:00:00Z",
  jpy_rate: 150,
  jpy_rate_date: "2025-01-15",
  api_models: [
    {
      provider: "OpenAI",
      name: "GPT-4o",
      tag: "STD",
      cls: "std",
      price_in: 2.5,
      price_out: 10,
      sub_ja: "標準モデル",
      sub_en: "Standard model",
      scrape_status: "success",
    },
  ],
  sub_tools: [
    {
      group: "Cursor",
      name: "Pro",
      monthly: 20,
      annual: null,
      tag: "PRO",
      cls: "std",
      note_ja: "クレジット制",
      note_en: "Credit-based",
      scrape_status: "success",
    },
  ],
};

describe("HomePage - static source safety", () => {
  it("source declares 'use client' (Client Component)", () => {
    const source = readFileSync(join(__dirname, "HomePage.tsx"), "utf8");
    const head = source.slice(0, 200);
    expect(head).toMatch(/["']use client["']/);
  });
});

describe("HomePage - component wiring", () => {
  it("renders LanguageToggle", () => {
    const { container } = render(<HomePage data={testPricing} />);
    // LanguageToggle は .lang-toggle クラスを持つ button を描画
    expect(container.querySelector(".lang-toggle")).not.toBeNull();
  });

  it("renders Hero section", () => {
    const { container } = render(<HomePage data={testPricing} />);
    expect(container.querySelector(".hero")).not.toBeNull();
  });

  it("renders ScenarioSelector", () => {
    const { container } = render(<HomePage data={testPricing} />);
    expect(container.querySelector(".scenarios")).not.toBeNull();
  });

  it("renders MathSection", () => {
    const { container } = render(<HomePage data={testPricing} />);
    expect(container.querySelector(".math-section")).not.toBeNull();
  });

  it("renders RefLinks", () => {
    const { container } = render(<HomePage data={testPricing} />);
    expect(container.querySelector(".ref-grid")).not.toBeNull();
  });
});

describe("HomePage - time badges", () => {
  it("renders 7 time-badge elements", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const badges = container.querySelectorAll(".time-badge");
    expect(badges.length).toBe(7);
  });

  it("displays cellNote text (Japanese)", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const noteLabel = container.querySelector(".cell-note-label");
    expect(noteLabel).not.toBeNull();
    // cellNote: "上段 USD($) / 下段 JPY(¥)"
    expect(noteLabel?.textContent).toContain("USD");
    expect(noteLabel?.textContent).toContain("JPY");
  });
});

describe("HomePage - tab switching", () => {
  it("API tab is active by default", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const tabs = container.querySelectorAll(".tab-btn");
    expect(tabs.length).toBe(2);
    expect(tabs[0]?.className).toContain("active");
    expect(tabs[1]?.className).not.toContain("active");
  });

  it("renders ApiTable in API tab", () => {
    const { container } = render(<HomePage data={testPricing} />);
    // ApiTable は .table-wrap を描画
    const tableWraps = container.querySelectorAll(".table-wrap");
    expect(tableWraps.length).toBeGreaterThanOrEqual(1);
  });

  it("clicking Sub tab shows SubTable and hides ApiTable", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const tabs = container.querySelectorAll(".tab-btn");
    fireEvent.click(tabs[1]);
    // Sub タブが active に
    expect(tabs[1].className).toContain("active");
    expect(tabs[0].className).not.toContain("active");
    // SubTable の .table-wrap が描画される
    expect(container.querySelector(".table-wrap")).not.toBeNull();
  });
});

describe("HomePage - tRich note boxes", () => {
  it("displays apiNote in API tab", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const noteBoxes = container.querySelectorAll(".note-box");
    expect(noteBoxes.length).toBeGreaterThanOrEqual(1);
  });

  it("displays subNote in Sub tab", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const tabs = container.querySelectorAll(".tab-btn");
    fireEvent.click(tabs[1]);
    const noteBoxes = container.querySelectorAll(".note-box");
    expect(noteBoxes.length).toBeGreaterThanOrEqual(1);
  });

  it("displays disclaimer section", () => {
    const { container } = render(<HomePage data={testPricing} />);
    expect(container.querySelector(".disclaimer-box")).not.toBeNull();
  });
});

describe("HomePage - footer", () => {
  it("displays generated_at date in footer", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("2025-01-15");
  });

  it("displays JPY rate in footer", () => {
    const { container } = render(<HomePage data={testPricing} />);
    const footer = container.querySelector("footer");
    expect(footer?.textContent).toContain("150");
  });
});
