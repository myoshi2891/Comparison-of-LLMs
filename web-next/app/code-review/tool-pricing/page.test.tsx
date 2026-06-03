import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRICE_CHECKED_AT, TOOLS, type PricingPlan, planAmounts } from "./constants";
import Page from "./page";

describe("/code-review/tool-pricing", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.trim().replace(/\s+/g, " ")).toBe("AI Code Review Tools 料金比較");
  });

  it("主要セクション h2 が 5 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(5);
  });

  it("ツールカードが TOOLS の件数ぶん存在する", () => {
    const { container } = render(<Page />);
    const cards = container.querySelectorAll("[data-tool-card]");
    expect(cards).toHaveLength(TOOLS.length);
  });

  it("各ツールに価格出典リンクが存在する", () => {
    const { container } = render(<Page />);
    const sourceLinks = container.querySelectorAll("[data-source-link]");
    expect(sourceLinks.length).toBeGreaterThanOrEqual(TOOLS.length);
  });

  it("ページに最終確認年月 (PRICE_CHECKED_AT) が表示される", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain(PRICE_CHECKED_AT);
  });

  it("外部リンクはすべて target と rel が正しい", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll('a[href^="#"], a[href^="/"]'));
    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      if (href) {
        expect(href).not.toContain(".html");
      }
    }
  });

  it("各カードに料金表ヘッダー（1ヶ月/3ヶ月/12ヶ月）が存在する", () => {
    const { container } = render(<Page />);
    const headers = container.querySelectorAll("[data-plan-header]");
    expect(headers.length).toBeGreaterThanOrEqual(TOOLS.length);
  });

  it("プラン行の総数が TOOLS.flatMap(t => t.plans).length と一致する", () => {
    const { container } = render(<Page />);
    const rows = container.querySelectorAll("[data-plan-row]");
    const expected = TOOLS.flatMap((t) => t.plans).length;
    expect(rows).toHaveLength(expected);
  });

  it("円記号「¥」がページに描画される", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain("¥");
  });
});

describe("planAmounts", () => {
  it("monthlyUsd が数値の場合は m1/m3/m12 を返し discounted=false", () => {
    const plan: PricingPlan = { name: "Pro", monthlyUsd: 10 };
    const result = planAmounts(plan);
    expect(result).toEqual({ m1: 10, m3: 30, m12: 120, discounted: false });
  });

  it("annualMonthlyUsd がある場合は m12 に年額換算を使い discounted=true", () => {
    const plan: PricingPlan = { name: "Pro", monthlyUsd: 10, annualMonthlyUsd: 8.33 };
    const result = planAmounts(plan);
    expect(result.m1).toBe(10);
    expect(result.m3).toBe(30);
    expect(result.m12).toBeCloseTo(8.33 * 12);
    expect(result.discounted).toBe(true);
  });

  it("monthlyUsd が null の場合は全て null、discounted=false", () => {
    const plan: PricingPlan = { name: "Enterprise", monthlyUsd: null, priceNote: "要問合せ" };
    const result = planAmounts(plan);
    expect(result).toEqual({ m1: null, m3: null, m12: null, discounted: false });
  });

  it("monthlyUsd が 0（Free プラン）は数値として扱われる", () => {
    const plan: PricingPlan = { name: "Free", monthlyUsd: 0 };
    const result = planAmounts(plan);
    expect(result).toEqual({ m1: 0, m3: 0, m12: 0, discounted: false });
  });
});
