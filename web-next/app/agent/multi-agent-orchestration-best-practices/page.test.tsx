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

  it("returns valid JSX element tree with vivid pie chart styling overrides", () => {
    const jsx = MultiAgentOrchestrationPage();
    expect(jsx).toBeDefined();

    const jsxString = JSON.stringify(jsx);

    // Verify TOC navigation groups exist
    expect(jsxString).toContain("はじめに");
    expect(jsxString).toContain("アーキテクチャ");
    expect(jsxString).toContain("設計と実装");
    expect(jsxString).toContain("ガバナンス");

    // Verify refined pie chart diagram MMD_12 exists
    expect(jsxString).toContain("MMD_12");

    // Verify no lowercase rowspan attribute
    expect(jsxString).not.toContain('"rowspan"');
  });
});
