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

  it("returns valid JSX element tree and renders core elements", () => {
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

    // Verify external links
    const externalLinks = Array.from(container.querySelectorAll("a")).filter(
      (a) => a.getAttribute("href")?.startsWith("http")
    );
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }

    // Verify internal links have no .html
    const internalLinks = Array.from(container.querySelectorAll("a")).filter(
      (a) => a.getAttribute("href")?.startsWith("/")
    );
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });
});
