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

  it("本番チェックリストの汎用モデルは grok-4.7 で、grok-4.5 は互換維持用", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const label = Array.from(container.querySelectorAll("label")).find((el) =>
      el.textContent?.includes("モデル選定:")
    );
    expect(label?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "モデル選定: grok-4.7（汎用。既存システムの互換性維持なら grok-4.5）/ grok-4.3（長文脈・低コスト）/ grok-4.20-multi-agent（ディープリサーチ）を用途で使い分けたか"
    );
  });
});
