/**
 * MathSection 契約テスト。
 *
 * - 4 枚の数式カード構造と見出し
 * - jpyRate を toFixed(2) で動的埋め込み
 * - JA/EN で見出しが切替わる
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MathSection } from "@/components/MathSection";

describe("MathSection - root structure", () => {
  it("renders .math-section.section container with title", () => {
    const { container } = render(<MathSection lang="ja" jpyRate={152.34} />);
    expect(container.querySelector(".math-section.section")).not.toBeNull();
    expect(container.querySelector(".math-title")).not.toBeNull();
  });

  it("renders exactly 4 math cards", () => {
    const { container } = render(<MathSection lang="ja" jpyRate={152.34} />);
    const cards = container.querySelectorAll(".math-card");
    expect(cards.length).toBe(4);
  });
});

describe("MathSection - card headings (ja)", () => {
  it("renders API cost formula card", () => {
    render(<MathSection lang="ja" jpyRate={152.34} />);
    expect(screen.getByText(/API コスト基本計算式/)).toBeInTheDocument();
  });

  it("renders scenario tokens card", () => {
    render(<MathSection lang="ja" jpyRate={152.34} />);
    expect(screen.getByText(/各シナリオの前提トークン量/)).toBeInTheDocument();
  });

  it("renders USD/JPY rate card", () => {
    render(<MathSection lang="ja" jpyRate={152.34} />);
    expect(screen.getByText(/USD\/JPY 換算レート根拠/)).toBeInTheDocument();
  });

  it("renders Vertex AI vs Google AI Studio card", () => {
    render(<MathSection lang="ja" jpyRate={152.34} />);
    expect(screen.getByText(/Vertex AI vs Google AI Studio/)).toBeInTheDocument();
  });
});

describe("MathSection - card headings (en)", () => {
  it("renders API Cost Formula in English", () => {
    render(<MathSection lang="en" jpyRate={152.34} />);
    expect(screen.getByText(/API Cost Formula/)).toBeInTheDocument();
  });

  it("renders Scenario Token Assumptions in English", () => {
    render(<MathSection lang="en" jpyRate={152.34} />);
    expect(screen.getByText(/Scenario Token Assumptions/)).toBeInTheDocument();
  });
});

describe("MathSection - dynamic jpyRate embedding", () => {
  it("embeds jpyRate.toFixed(2) inside USD/JPY card", () => {
    const { container } = render(<MathSection lang="ja" jpyRate={152.34} />);
    // "1 USD = 152.34 JPY" — numeric parts are wrapped in <span>,
    // so assert on the containing .math-card text content
    const cards = container.querySelectorAll(".math-card");
    const rateCard = Array.from(cards).find((c) =>
      c.textContent?.includes("USD/JPY 換算レート根拠")
    );
    expect(rateCard).toBeDefined();
    expect(rateCard?.textContent).toContain("152.34");
  });

  it("reflects a different jpyRate without stale value", () => {
    const { container, rerender } = render(<MathSection lang="ja" jpyRate={152.34} />);
    const cards = container.querySelectorAll(".math-card");
    const rateCard = Array.from(cards).find((c) => c.textContent?.includes("USD/JPY"));
    expect(rateCard?.textContent).toContain("152.34");

    rerender(<MathSection lang="ja" jpyRate={200.5} />);
    expect(rateCard?.textContent).toContain("200.50");
    expect(rateCard?.textContent).not.toContain("152.34");
  });
});

describe("MathSection - period hours reference", () => {
  it("includes 168 (7d) and 8,760 (12mo) hour constants in the formula card", () => {
    const { container } = render(<MathSection lang="ja" jpyRate={152.34} />);
    const cards = container.querySelectorAll(".math-card");
    const formulaCard = Array.from(cards).find((c) =>
      c.textContent?.includes("API コスト基本計算式")
    );
    expect(formulaCard?.textContent).toContain("168");
    expect(formulaCard?.textContent).toContain("8,760");
  });
});
