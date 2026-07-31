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

  it("returns valid JSX element tree and renders TOC links, custom pie colors and code highlights", () => {
    const jsx = MultiAgentOrchestrationPage();
    expect(jsx).toBeDefined();

    const jsxString = JSON.stringify(jsx);

    // Verify TOC navigation links exist for sections
    expect(jsxString).toContain("#sec-1");
    expect(jsxString).toContain("#sec-15");

    // Verify custom pie chart theme colors for diagram 12
    expect(jsxString).toContain("#57c7ff");
    expect(jsxString).toContain("#a996ff");
    expect(jsxString).toContain("#5eead4");

    // Verify code block lines and highlights are rendered
    expect(jsxString).toContain("subagent_contract");
    expect(jsxString).toContain("orchestrator_scaling_rules");

    // Verify no lowercase rowspan attribute
    expect(jsxString).not.toContain('"rowspan"');
  });
});
