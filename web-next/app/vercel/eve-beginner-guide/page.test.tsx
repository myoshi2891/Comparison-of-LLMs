import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("VercelEveBeginnerGuidePage", () => {
  it("renders page title correctly", () => {
    render(<Page />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Vercel eve 完全ガイド");
    expect(heading.textContent).toContain(
      "初学者のためのステップバイステップ・ベストプラクティス",
    );
  });

  it("renders all 11 h2 sections", () => {
    const { container } = render(<Page />);
    const h2Elements = container.querySelectorAll("main section > h2");
    expect(h2Elements.length).toBe(11);
  });

  it("renders 8 mermaid diagrams", () => {
    render(<Page />);
    const diagrams = screen.getAllByTestId("mermaid");
    expect(diagrams.length).toBe(8);
  });

  it("adds safety attributes to all external links", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a")).filter(
      (a) => a.getAttribute("href")?.startsWith("http"),
    );
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("uses clean internal links without .html extension", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter(
      (a) =>
        a.getAttribute("href")?.startsWith("/") ||
        a.getAttribute("href")?.startsWith("#"),
    );
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });
});
