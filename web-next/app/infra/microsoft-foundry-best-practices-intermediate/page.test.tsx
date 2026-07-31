import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MicrosoftFoundryBestPracticesIntermediatePage, {
  metadata,
} from "./page";

describe("MicrosoftFoundryBestPracticesIntermediatePage", () => {
  it("exports proper metadata", () => {
    expect(metadata.title).toBe(
      "Microsoft Foundry 実践ベストプラクティスガイド",
    );
    expect(metadata.description).toContain(
      "Microsoft Foundry（旧Azure AI Studio/Azure AI Foundry）を用いたAIアプリ・エージェント開発",
    );
  });

  it("returns JSX element tree when called", () => {
    const jsx = MicrosoftFoundryBestPracticesIntermediatePage();
    expect(jsx).toBeDefined();
  });

  it("renders h1 and 17 h2 section titles", () => {
    const { container } = render(
      <MicrosoftFoundryBestPracticesIntermediatePage />,
    );
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain(
      "Microsoft Foundry 実践ベストプラクティスガイド",
    );

    const h2s = container.querySelectorAll("h2");
    expect(h2s.length).toBe(17);

    const mermaidDiagrams = container.querySelectorAll(".mermaid");
    expect(mermaidDiagrams.length).toBe(9);
  });

  it("has target='_blank' and rel='noopener noreferrer' on external links", () => {
    const { container } = render(
      <MicrosoftFoundryBestPracticesIntermediatePage />,
    );
    const externalLinks = Array.from(
      container.querySelectorAll("a[href^='http']"),
    );
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      const rel = link.getAttribute("rel") || "";
      expect(rel.includes("noopener")).toBe(true);
      expect(rel.includes("noreferrer")).toBe(true);
    }
  });
});
