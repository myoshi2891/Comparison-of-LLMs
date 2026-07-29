import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Page from "./page";
import styles from "./page.module.css";

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

  it("renders all six migrated Mermaid diagrams", async () => {
    const pageObj = await Page();
    render(pageObj);
    expect(screen.getAllByTestId("mermaid-diagram")).toHaveLength(6);
  });

  it("opens and closes the mobile table of contents", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const sidebar = container.querySelector("nav");
    const toggle = screen.getByRole("button", { name: "目次を開く" });

    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    fireEvent.click(toggle);
    expect(sidebar).toHaveClass(styles.sidebarOpen);
    const closeToggle = screen.getByRole("button", { name: "目次を閉じる" });
    expect(closeToggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(closeToggle);
    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    expect(screen.getByRole("button", { name: "目次を開く" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
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
    const internalLinks = Array.from(container.querySelectorAll("a[href^='#']"));
    expect(internalLinks.length).toBeGreaterThan(0);
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("marks inline SVG icons as decorative", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon.querySelector("title")).toBeNull();
    }
  });

  it("renders code elements correctly", async () => {
    const pageObj = await Page();
    const { container } = render(pageObj);
    const codeElements = container.querySelectorAll("code");
    expect(codeElements.length).toBeGreaterThan(0);
  });
});
