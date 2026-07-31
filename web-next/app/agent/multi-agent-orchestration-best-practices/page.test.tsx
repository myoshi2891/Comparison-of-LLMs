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

  it("returns valid JSX element tree and renders TOC links and code highlights", () => {
    const jsx = MultiAgentOrchestrationPage();
    expect(jsx).toBeDefined();

    const { container } = render(jsx);

    // Verify Title
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain(
      "マルチエージェント・オーケストレーション実践ガイド"
    );

    // Verify 15 section titles
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBe(15);

    // Verify TOC navigation links exist for all 15 sections
    const tocLinks = container.querySelectorAll("nav a");
    expect(tocLinks.length).toBeGreaterThanOrEqual(15);

    // Verify code block tokens have highlight classes
    const highlightTokens = container.querySelectorAll(
      "code span, div[class*='codeLine'] span"
    );
    expect(highlightTokens.length).toBeGreaterThan(0);

    // Verify no lowercase rowspan attribute
    const invalidRowspan = container.querySelectorAll("[rowspan]");
    expect(invalidRowspan.length).toBe(0);
  });
});
