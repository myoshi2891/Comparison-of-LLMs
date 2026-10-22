import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("第7章 reasoning_effort フローチャート", () => {
  it("low を high より軽い独立した推論として示し、medium を対応値として示さない", async () => {
    const page = await Page();
    const { container } = render(page);
    const chart = container
      .querySelector("#s7 [data-testid='mermaid-diagram']")
      ?.getAttribute("data-chart");
    expect(chart).toBe(`flowchart LR
    A["リクエスト受信"] --> B{"thinking.type"}
    B -->|"enabled"| C{"reasoning_effort"}
    B -->|"disabled"| D["即時応答(CoTなし)"]
    C -->|"max または xhigh"| E["最大推論(高精度・高コスト)"]
    C -->|"high"| F["拡張推論(精度とコストのバランス)"]
    C -->|"low"| G["軽量推論(high より浅く低コスト・低遅延)"]
    C -->|"minimal または none"| D`);
  });
});
