import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

// Mock MermaidDiagram component to avoid dynamic import / rendering issues in unit tests
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("MultiAgentOrchestrationPage", () => {
  it("renders the page title in h1", () => {
    render(<Page />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("マルチエージェントオーケストレーション");
  });

  it("renders 17 h2 section headings", () => {
    const { container } = render(<Page />);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(17);
  });

  it("ensures all external links have target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a")).filter((a) =>
      a.getAttribute("href")?.startsWith("http")
    );
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("ensures all internal links are clean URLs without .html extension", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) =>
      a.getAttribute("href")?.startsWith("/")
    );
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });

  it("renders 14 Mermaid diagram instances", () => {
    const { container } = render(<Page />);
    const mermaidDiagrams = container.querySelectorAll('[data-testid="mermaid"]');
    expect(mermaidDiagrams.length).toBe(14);
  });
});
