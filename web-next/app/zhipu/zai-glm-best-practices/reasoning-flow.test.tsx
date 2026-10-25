import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("第7章 reasoning_effort フローチャート", () => {
  it("GLM-5.3 系は low / high / max のみ、xhigh・minimal・none はそれ以前のモデルのみに分岐して示し、medium を対応値として示さない", async () => {
    const page = await Page();
    const { container } = render(page);
    const chart = container
      .querySelector("#s7 [data-testid='mermaid-diagram']")
      ?.getAttribute("data-chart");
    expect(chart).toBe(`flowchart LR
    A["リクエスト受信"] --> B{"thinking.type"}
    B -->|"enabled"| M{"モデル"}
    B -->|"disabled(GLM-5.3 系以外)"| D["即時応答(CoTなし)"]
    M -->|"GLM-5.3 系"| C1{"reasoning_effort"}
    M -->|"それ以前のモデル"| C2{"reasoning_effort"}
    C1 -->|"max"| E["最大推論(高精度・高コスト)"]
    C1 -->|"high"| F["拡張推論(精度とコストのバランス)"]
    C1 -->|"low"| G["軽量推論(high より浅く低コスト・低遅延)"]
    C2 -->|"max または xhigh"| E
    C2 -->|"high または low"| F
    C2 -->|"minimal または none"| D`);
  });
});
