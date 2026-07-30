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
});
