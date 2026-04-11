/**
 * Hero 契約テスト。
 *
 * レガシーからの重要差分:
 * - 生 HTML 注入を撲滅し、tRich('heroTitle'|'heroDesc') で
 *   React 要素として直接合成する（Phase 5 の XSS 対策投資を回収）
 * - プレースホルダ {n}/{m}/{date} は呼び出し側で置換する契約
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/Hero";
import type { PricingData } from "@/types/pricing";

const samplePricing: PricingData = {
  generated_at: "2026-04-12T00:00:00+00:00",
  jpy_rate: 152.34,
  jpy_rate_date: "2026-04-10",
  api_models: [],
  sub_tools: [],
};

describe("Hero - structural skeleton", () => {
  it("renders .hero > .hero-inner wrapper", () => {
    const { container } = render(
      <Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />
    );
    expect(container.querySelector(".hero")).not.toBeNull();
    expect(container.querySelector(".hero-inner")).not.toBeNull();
  });

  it("renders eyebrow text from T.eyebrow", () => {
    render(<Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText(/AI Cost Simulator · v5 USD \+ JPY/)).toBeInTheDocument();
  });
});

describe("Hero - heroTitle rendered via tRich", () => {
  it("renders the Japanese hero title with an <em> element for '時間別コスト'", () => {
    const { container } = render(
      <Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />
    );
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    const em = h1?.querySelector("em");
    expect(em?.textContent).toBe("時間別コスト");
  });

  it("renders the English hero title with an <em> element for 'Hourly Cost'", () => {
    const { container } = render(
      <Hero lang="en" data={samplePricing} apiCount={30} toolCount={12} />
    );
    const em = container.querySelector("h1 em");
    expect(em?.textContent).toBe("Hourly Cost");
  });
});

describe("Hero - heroDesc rendered via tRich", () => {
  it("renders .hero-desc paragraph with strong segments for the time list (ja)", () => {
    const { container } = render(
      <Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />
    );
    const desc = container.querySelector(".hero-desc");
    expect(desc).not.toBeNull();
    const strongs = desc?.querySelectorAll("strong");
    expect(strongs?.length ?? 0).toBeGreaterThanOrEqual(3);
    // "1時間・8時間・..." の strong が必ず含まれる
    const texts = Array.from(strongs ?? []).map((el) => el.textContent);
    expect(texts).toContain("1時間・8時間・24時間・7日・30日・4ヶ月・12ヶ月");
  });
});

describe("Hero - metaModels placeholder substitution", () => {
  it("substitutes {n} and {m} placeholders in Japanese", () => {
    render(<Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText("APIモデル 30種 + コーディングツール 12プラン")).toBeInTheDocument();
  });

  it("substitutes {n} and {m} placeholders in English", () => {
    render(<Hero lang="en" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText("30 API models + 12 coding tool plans")).toBeInTheDocument();
  });
});

describe("Hero - rate badge", () => {
  it("renders the formatted exchange rate", () => {
    render(<Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText("1 USD = 152.34 JPY")).toBeInTheDocument();
  });

  it("renders the rate date when provided", () => {
    render(<Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText(/2026-04-10/)).toBeInTheDocument();
  });

  it("substitutes '–' for rate date when source is 'fallback'", () => {
    const fallbackPricing: PricingData = { ...samplePricing, jpy_rate_date: "fallback" };
    render(<Hero lang="ja" data={fallbackPricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText(/–/)).toBeInTheDocument();
  });
});

describe("Hero - updated-at footer line", () => {
  it("renders the price-update date from generated_at ISO", () => {
    render(<Hero lang="ja" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText(/価格更新:\s*2026-04-12/)).toBeInTheDocument();
  });

  it("localizes the 'Prices updated:' label in English", () => {
    render(<Hero lang="en" data={samplePricing} apiCount={30} toolCount={12} />);
    expect(screen.getByText(/Prices updated:\s*2026-04-12/)).toBeInTheDocument();
  });
});
