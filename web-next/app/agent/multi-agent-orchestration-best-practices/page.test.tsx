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

  it("returns valid JSX element tree with original font colors, grouped TOC and refined pie theme", () => {
    const jsx = MultiAgentOrchestrationPage();
    expect(jsx).toBeDefined();

    const jsxString = JSON.stringify(jsx);

    // Verify TOC navigation groups exist
    expect(jsxString).toContain("はじめに");
    expect(jsxString).toContain("アーキテクチャ");
    expect(jsxString).toContain("設計と実装");
    expect(jsxString).toContain("ガバナンス");

    // Verify refined pie chart theme color palette (cyan #57c7ff, purple #a996ff, coral #ff9d66)
    expect(jsxString).toContain("#57c7ff");
    expect(jsxString).toContain("#a996ff");
    expect(jsxString).toContain("#ff9d66");

    // Verify checklist and refs classes are preserved
    expect(jsxString).toContain("checklist");
    expect(jsxString).toContain("refs");

    // Verify code block tokens have highlight classes
    expect(jsxString).toContain("subagent_contract");
    expect(jsxString).toContain("orchestrator_scaling_rules");

    // Verify no lowercase rowspan attribute
    expect(jsxString).not.toContain('"rowspan"');
  });
});
