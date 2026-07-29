import { readFileSync } from "node:fs";
import { join } from "node:path";
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
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toContain("仕様駆動開発");
  });

  it("uses a non-recursive local monospace font token", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");
    expect(css).toContain("--font-mono-stack:");
    expect(css).not.toContain("var(--font-mono)");
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
