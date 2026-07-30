import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GrokBestPracticesIntermediatePage, { metadata } from "./page";

describe("GrokBestPracticesIntermediatePage", () => {
  it("exports proper metadata", () => {
    expect(metadata.title).toBe("xAI Grok API 実践ベストプラクティスガイド");
    expect(metadata.description).toContain("モデル選定からエージェント型ツール");
  });

  it("returns JSX element tree when called", () => {
    const jsx = GrokBestPracticesIntermediatePage();
    expect(jsx).toBeDefined();
    expect(jsx.type).toBe("div");
  });

  it("renders 15 section elements", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBe(15);
  });

  it("has target='_blank' and rel='noopener noreferrer' on external links", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      const rel = link.getAttribute("rel") || "";
      expect(rel.includes("noopener")).toBe(true);
      expect(rel.includes("noreferrer")).toBe(true);
    }
  });
});
