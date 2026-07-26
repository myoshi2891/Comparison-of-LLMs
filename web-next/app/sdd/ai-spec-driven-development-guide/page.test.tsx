import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Page from "./page";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

// Mock MermaidDiagram component to avoid dynamic import and DOM issues in Vitest
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("AI Spec-Driven Development Guide Page", () => {
  it("renders page title in h1 accurately", async () => {
    const pageObj = await Page();
    render(pageObj);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("AI仕様駆動開発（Spec-Driven Development）実践ガイド");
  });

  it("contains 13 major section h2 headings", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(13);
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

  it("renders code elements correctly", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const codeElements = container.querySelectorAll("code");
    expect(codeElements.length).toBeGreaterThan(0);
  });
});
