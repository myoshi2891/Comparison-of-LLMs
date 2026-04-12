/**
 * ScenarioSelector 契約テスト。
 *
 * Client Component の理由:
 * - onScenarioChange 関数 prop (Server → Client 境界不可)
 * - useState でカスタム入力値を保持
 * - onClick / onChange イベントハンドラ
 *
 * カバレッジ:
 * - Root structure / 6 ボタン / active クラス
 * - onScenarioChange コールバック
 * - custom-panel の条件描画
 * - assumption-bar の ratio 計算 (正常系 / 0 除算系)
 * - SCENARIOS エクスポート契約
 * - type="button" 属性 (レガシーからの改善)
 * - 静的検査: ファイル先頭に "use client" ディレクティブ
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SCENARIOS, type ScenarioKey, ScenarioSelector } from "@/components/ScenarioSelector";

const DEFAULT_PROPS = {
  lang: "ja",
  currentInput: 150_000,
  currentOutput: 50_000,
  scenario: "standard" as ScenarioKey,
  onScenarioChange: vi.fn(),
} as const;

describe("ScenarioSelector - root structure", () => {
  it("renders .panel wrapper", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} onScenarioChange={vi.fn()} />
    );
    expect(container.querySelector(".panel")).not.toBeNull();
  });

  it("renders .panel-title with Japanese step1Title", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} lang="ja" onScenarioChange={vi.fn()} />
    );
    const title = container.querySelector(".panel-title");
    expect(title?.textContent).toContain("Step 1");
    expect(title?.textContent).toContain("使用シナリオ選択");
  });

  it("renders .panel-title with English step1Title", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} lang="en" onScenarioChange={vi.fn()} />
    );
    const title = container.querySelector(".panel-title");
    expect(title?.textContent).toContain("Select Usage Scenario");
  });
});

describe("ScenarioSelector - scenario buttons", () => {
  it("renders exactly 6 .scenario-btn buttons", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} onScenarioChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    expect(buttons.length).toBe(6);
  });

  it("renders Japanese scenario labels", () => {
    render(<ScenarioSelector {...DEFAULT_PROPS} lang="ja" onScenarioChange={vi.fn()} />);
    expect(screen.getByText(/Nano — 超軽量/)).toBeInTheDocument();
    expect(screen.getByText(/Light — 軽量/)).toBeInTheDocument();
    expect(screen.getByText(/Standard — 標準/)).toBeInTheDocument();
    expect(screen.getByText(/Heavy — 重量/)).toBeInTheDocument();
    expect(screen.getByText(/Agentic — 自律AI/)).toBeInTheDocument();
    expect(screen.getByText(/Custom — カスタム/)).toBeInTheDocument();
  });

  it("renders English scenario labels", () => {
    render(<ScenarioSelector {...DEFAULT_PROPS} lang="en" onScenarioChange={vi.fn()} />);
    expect(screen.getByText(/Nano — Ultra Light/)).toBeInTheDocument();
    expect(screen.getByText(/Standard — Normal/)).toBeInTheDocument();
    expect(screen.getByText(/Agentic — Autonomous AI/)).toBeInTheDocument();
  });

  it("all scenario buttons carry type='button' attribute", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} onScenarioChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    buttons.forEach((btn) => {
      expect(btn.getAttribute("type")).toBe("button");
    });
  });
});

describe("ScenarioSelector - active state", () => {
  it("marks only the 'standard' button active when scenario='standard'", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="standard" onScenarioChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    // 3番目のボタン = standard (nano / light / standard / heavy / agentic / custom)
    expect(buttons[2]?.className).toContain("active");
    expect(buttons[0]?.className).not.toContain("active");
    expect(buttons[5]?.className).not.toContain("active");
  });

  it("marks only the 'custom' button active when scenario='custom'", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="custom" onScenarioChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    expect(buttons[5]?.className).toContain("active");
    expect(buttons[2]?.className).not.toContain("active");
  });
});

describe("ScenarioSelector - click callback", () => {
  it("calls onScenarioChange('light', 50000, 15000) when light clicked", () => {
    const onScenarioChange = vi.fn();
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} onScenarioChange={onScenarioChange} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    fireEvent.click(buttons[1] as Element);
    expect(onScenarioChange).toHaveBeenCalledWith("light", 50_000, 15_000);
  });

  it("calls onScenarioChange('standard', 150000, 50000) when standard clicked", () => {
    const onScenarioChange = vi.fn();
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="nano" onScenarioChange={onScenarioChange} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    fireEvent.click(buttons[2] as Element);
    expect(onScenarioChange).toHaveBeenCalledWith("standard", 150_000, 50_000);
  });

  it("calls onScenarioChange('custom', 150000, 50000) using stored custom state when custom clicked", () => {
    const onScenarioChange = vi.fn();
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="nano" onScenarioChange={onScenarioChange} />
    );
    const buttons = container.querySelectorAll(".scenario-btn");
    fireEvent.click(buttons[5] as Element);
    // custom state デフォルトは 150_000 / 50_000
    expect(onScenarioChange).toHaveBeenCalledWith("custom", 150_000, 50_000);
  });
});

describe("ScenarioSelector - custom panel conditional render", () => {
  it("does NOT render .custom-panel when scenario !== 'custom'", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="standard" onScenarioChange={vi.fn()} />
    );
    expect(container.querySelector(".custom-panel")).toBeNull();
  });

  it("renders .custom-panel with two input-groups when scenario === 'custom'", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="custom" onScenarioChange={vi.fn()} />
    );
    const panel = container.querySelector(".custom-panel");
    expect(panel).not.toBeNull();
    expect(panel?.querySelectorAll(".input-group").length).toBe(2);
  });

  it("custom range input change propagates to onScenarioChange", () => {
    const onScenarioChange = vi.fn();
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} scenario="custom" onScenarioChange={onScenarioChange} />
    );
    const rangeInputs = container.querySelectorAll('input[type="range"]');
    expect(rangeInputs.length).toBe(2);
    // INPUT tokens range を変更
    fireEvent.change(rangeInputs[0] as Element, { target: { value: "500000" } });
    expect(onScenarioChange).toHaveBeenCalledWith("custom", 500_000, 50_000);
  });
});

describe("ScenarioSelector - assumption bar", () => {
  it("displays ratio '3.0:1' when currentInput=150000 currentOutput=50000", () => {
    const { container } = render(
      <ScenarioSelector
        {...DEFAULT_PROPS}
        currentInput={150_000}
        currentOutput={50_000}
        onScenarioChange={vi.fn()}
      />
    );
    expect(container.textContent).toContain("3.0:1");
  });

  it("displays ratio '–' when currentOutput=0", () => {
    const { container } = render(
      <ScenarioSelector
        {...DEFAULT_PROPS}
        currentInput={150_000}
        currentOutput={0}
        onScenarioChange={vi.fn()}
      />
    );
    const bar = container.querySelector(".assumption-bar");
    expect(bar?.textContent).toContain("–");
  });

  it("displays the cost-per-hour formula text", () => {
    const { container } = render(
      <ScenarioSelector {...DEFAULT_PROPS} onScenarioChange={vi.fn()} />
    );
    expect(container.textContent).toContain("(IN/1M × $price_in + OUT/1M × $price_out) × h");
  });
});

describe("ScenarioSelector - SCENARIOS export contract", () => {
  it("exposes all 6 scenario keys", () => {
    const keys = Object.keys(SCENARIOS).sort();
    expect(keys).toEqual(["agentic", "custom", "heavy", "light", "nano", "standard"]);
  });

  it("nano preset is 10_000 / 3_000", () => {
    expect(SCENARIOS.nano.input).toBe(10_000);
    expect(SCENARIOS.nano.output).toBe(3_000);
  });

  it("standard preset is 150_000 / 50_000", () => {
    expect(SCENARIOS.standard.input).toBe(150_000);
    expect(SCENARIOS.standard.output).toBe(50_000);
  });

  it("custom default matches useState initial values (150_000 / 50_000)", () => {
    expect(SCENARIOS.custom.input).toBe(150_000);
    expect(SCENARIOS.custom.output).toBe(50_000);
  });
});

describe("ScenarioSelector - static source safety", () => {
  it("declares 'use client' directive at the top of the file", () => {
    const source = readFileSync(join(__dirname, "ScenarioSelector.tsx"), "utf8");
    // 最初の非空行が "use client" / 'use client' であることを確認。
    const head = source.slice(0, 200);
    expect(head).toMatch(/["']use client["']/);
  });
});
