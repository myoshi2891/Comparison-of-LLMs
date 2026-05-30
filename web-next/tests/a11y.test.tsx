import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import * as matchers from "vitest-axe/matchers";
import { HomePage } from "@/components/HomePage";
import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";
import { SiteHeader as RawSiteHeader } from "@/components/site/SiteHeader";
import AntigravityGuidePage from "@/app/gemini/antigravity-guide/page";
import HarnessEngineeringPage from "@/app/gemini/harness-engineering/page";
import AgentHarnessEngineeringPage from "@/app/gemini/agent-harness-engineering/page";
import type { PricingData } from "@/types/pricing";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

// Custom type definitions for vitest-axe matchers
interface CustomMatchers<R = unknown> {
  toHaveNoViolations(): R;
}

declare module "vitest" {
  interface Assertion<T> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend(matchers);

const SiteHeader = RawSiteHeader as unknown as (props: { pathname: string }) => ReactElement;

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

describe("Accessibility Automated Audit (axe-core)", () => {
  it("SiteHeader has no accessibility violations", async () => {
    const { container } = render(<SiteHeader pathname="/" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("DisclaimerBanner has no accessibility violations", async () => {
    const { container } = render(<DisclaimerBanner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("HomePage has no accessibility violations", async () => {
    const { container } = render(<HomePage data={testPricing} />);
    const results = await axe(container, {
      rules: {
        "heading-order": { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("AntigravityGuidePage has no accessibility violations", async () => {
    const { container } = render(<AntigravityGuidePage />);
    const results = await axe(container, {
      rules: {
        "heading-order": { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("HarnessEngineeringPage has no accessibility violations", async () => {
    const { container } = render(<HarnessEngineeringPage />);
    const results = await axe(container, {
      rules: {
        "heading-order": { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("AgentHarnessEngineeringPage has no accessibility violations", async () => {
    const { container } = render(<AgentHarnessEngineeringPage />);
    const results = await axe(container, {
      rules: {
        "heading-order": { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
