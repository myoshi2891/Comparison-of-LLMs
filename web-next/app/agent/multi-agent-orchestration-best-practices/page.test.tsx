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

  it("returns valid JSX element tree with BOTH code blocks (subagent_contract & orchestrator_scaling_rules)", () => {
    const jsx = MultiAgentOrchestrationPage();
    expect(jsx).toBeDefined();

    const jsxString = JSON.stringify(jsx);

    // Verify BOTH code block 1 and code block 2 exist in JSX element tree
    expect(jsxString).toContain("subagent_contract");
    expect(jsxString).toContain("orchestrator_scaling_rules");

    // Verify section anchors
    expect(jsxString).toContain('id="sec-13"');

    // Verify no lowercase rowspan attribute
    expect(jsxString).not.toContain('"rowspan"');
  });
});
