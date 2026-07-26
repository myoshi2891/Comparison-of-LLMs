import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

// Mock MermaidDiagram component to avoid dynamic import and DOM issues in Vitest
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("Spec-Driven Development Guide Page (Middle/Advanced)", () => {
  it("renders page title in h1 accurately", async () => {
    const pageObj = await Page();
    render(pageObj);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("仕様駆動開発（SDD）実践ガイド");
  });

  it("contains 16 major section h2 headings", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(16);
  });

  it("ensures all external links have target='_blank' and rel containing 'noopener'", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toMatch(/noopener/);
    }
  });

  it("ensures internal anchor links do not end with .html", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const internalLinks = Array.from(container.querySelectorAll("a[href^='/']"));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("renders mermaid diagrams", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const mermaidElements = container.querySelectorAll("[data-testid='mermaid-diagram']");
    expect(mermaidElements.length).toBe(10);
  });
});
