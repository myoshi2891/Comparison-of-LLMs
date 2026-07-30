import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("ZaiGlmBestPracticesPage", () => {
  it("renders main heading (h1)", async () => {
    const page = await Page();
    render(page);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeDefined();
    expect(h1.textContent).toContain("初学者向けステップバイステップ解説");
  });

  it("renders 17 section headings (h2)", async () => {
    const page = await Page();
    const { container } = render(page);
    const h2s = container.querySelectorAll("h2");
    expect(h2s.length).toBe(17);
  });

  it("renders 8 mermaid diagrams", async () => {
    const page = await Page();
    const { container } = render(page);
    const diagrams = container.querySelectorAll(".mermaid, [data-testid='mermaid-diagram']");
    expect(diagrams.length).toBe(8);
  });

  it("has valid external link security attributes", async () => {
    const page = await Page();
    const { container } = render(page);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("has clean internal links without .html extension", async () => {
    const page = await Page();
    const { container } = render(page);
    const internalLinks = Array.from(container.querySelectorAll("a[href^='/']"));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });
});
