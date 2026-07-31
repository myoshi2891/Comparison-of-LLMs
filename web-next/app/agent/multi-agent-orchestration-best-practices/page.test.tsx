import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MultiAgentOrchestrationPage, { metadata } from "./page";

describe("MultiAgentOrchestrationPage", () => {
  it("exports proper metadata", () => {
    expect(metadata.title).toBe(
      "マルチエージェント・オーケストレーション実践ガイド"
    );
    expect(metadata.description).toContain(
      "Anthropicのリサーチシステム、5つの基本パターン、MAST失敗モード分類"
    );
  });

  it("renders MultiAgentOrchestrationPage and contains key code blocks and anchors", () => {
    const { container } = render(<MultiAgentOrchestrationPage />);

    expect(container.textContent).toContain("subagent_contract");
    expect(container.textContent).toContain("orchestrator_scaling_rules");

    // Verify section anchors
    const sec13 = container.querySelector("#sec-13");
    expect(sec13).not.toBeNull();
  });
});
