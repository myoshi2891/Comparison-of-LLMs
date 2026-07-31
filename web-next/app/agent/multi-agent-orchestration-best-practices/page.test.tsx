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

  it("returns valid JSX element tree with full code block syntax highlights and inline code styling", () => {
    const jsx = MultiAgentOrchestrationPage();
    expect(jsx).toBeDefined();

    const jsxString = JSON.stringify(jsx);

    // Verify TOC navigation groups exist
    expect(jsxString).toContain("はじめに");
    expect(jsxString).toContain("アーキテクチャ");

    // Verify code block tokens have syntax highlight classes
    expect(jsxString).toContain("subagent_contract");
    expect(jsxString).toContain("orchestrator_scaling_rules");
    expect(jsxString).toContain("codeBody");

    // Verify no lowercase rowspan attribute
    expect(jsxString).not.toContain('"rowspan"');
  });
});
