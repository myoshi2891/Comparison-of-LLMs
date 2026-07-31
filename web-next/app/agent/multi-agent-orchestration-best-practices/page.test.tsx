import { render, screen } from "@testing-library/react";
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

  it("renders MultiAgentOrchestrationPage with headings, sections, code blocks, and anchors", () => {
    const { container } = render(<MultiAgentOrchestrationPage />);

    // Verify heading
    expect(
      screen.getByRole("heading", {
        name: "マルチエージェント・オーケストレーション実践ガイド",
      })
    ).toBeTruthy();

    // Verify section count (15 section elements)
    expect(container.querySelectorAll("section")).toHaveLength(15);

    // Verify code blocks content
    expect(container.textContent).toContain("subagent_contract");
    expect(container.textContent).toContain("orchestrator_scaling_rules");

    // Verify section anchors
    const sec13 = container.querySelector("#sec-13");
    expect(sec13).not.toBeNull();

    // Verify all target="_blank" links contain rel="noopener noreferrer"
    const blankLinks = container.querySelectorAll<HTMLAnchorElement>(
      'a[target="_blank"]'
    );
    expect(blankLinks.length).toBeGreaterThan(0);
    for (const link of blankLinks) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
