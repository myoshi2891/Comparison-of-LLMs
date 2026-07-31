import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart, id }: { chart: string; id?: string }) {
    return (
      <div data-testid="mermaid-diagram" id={id}>
        <pre>{chart}</pre>
      </div>
    );
  },
}));

vi.mock("./TocObserver", () => ({
  TocObserver: function DummyTocObserver() {
    return null;
  },
}));

describe("Microsoft Foundry Best Practices Guide Page", () => {
  it("renders the main heading correctly", () => {
    render(<Page />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("Microsoft Foundry 活用ガイド");
  });

  it("renders all 15 major h2 sections", () => {
    render(<Page />);
    const h2Elements = screen.getAllByRole("heading", { level: 2 });
    expect(h2Elements).toHaveLength(15);
  });

  it("ensures all external links have target='_blank' and rel containing 'noopener'", () => {
    const { container } = render(<Page />);
    const externalLinks = container.querySelectorAll("a[target='_blank']");
    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toMatch(/noopener/);
    });
  });

  it("renders 5 mermaid diagrams", () => {
    const { container } = render(<Page />);
    const diagrams = container.querySelectorAll("[data-testid='mermaid-diagram']");
    expect(diagrams).toHaveLength(5);
  });

  it("renders code blocks with syntax highlighting container", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });
});
