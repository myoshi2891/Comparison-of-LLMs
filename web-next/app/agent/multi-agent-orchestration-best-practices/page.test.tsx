import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

// Mock Mermaid component to avoid rendering issues in vitest environment
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart, caption }: { chart: string; caption?: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart}>
      {caption && <span>{caption}</span>}
    </div>
  ),
}));

// Mock TocObserver to avoid IntersectionObserver in unit test environment
vi.mock("@/components/docs/TocObserver", () => ({
  default: () => <div data-testid="toc-observer" />,
}));

describe("Multi-Agent Orchestration Best Practices Page", () => {
  it("renders page title correctly", async () => {
    const pageComponent = await Page();
    render(pageComponent);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("マルチエージェント・オーケストレーション実践ガイド");
  });

  it("renders all 15 major section headings", async () => {
    const pageComponent = await Page();
    const { container } = render(pageComponent);
    const sectionHeadings = container.querySelectorAll("h2.section-title, h2");
    expect(sectionHeadings.length).toBeGreaterThanOrEqual(15);
  });

  it("ensures external links have secure target and rel attributes", async () => {
    const pageComponent = await Page();
    const { container } = render(pageComponent);
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

  it("ensures internal links have clean URLs without .html extensions", async () => {
    const pageComponent = await Page();
    const { container } = render(pageComponent);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && (href.startsWith("/") || href.startsWith("#"));
    });

    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      if (href?.startsWith("/")) {
        expect(href).not.toContain(".html");
      }
    }
  });

  it("renders all 21 mermaid diagrams", async () => {
    const pageComponent = await Page();
    const { container } = render(pageComponent);
    const diagrams = container.querySelectorAll('[data-testid="mermaid-diagram"]');
    expect(diagrams.length).toBe(21);
  });
});
