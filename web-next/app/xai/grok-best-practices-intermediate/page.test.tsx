import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

// MermaidDiagram のモック
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("GrokBestPracticesIntermediatePage", () => {
  it("renders page title in h1", async () => {
    const pageComponent = await Page();
    render(pageComponent);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("xAI Grok API");
    expect(heading.textContent).toContain("実践ベストプラクティスガイド");
  });

  it("renders 15 major section headings (h2)", async () => {
    const pageComponent = await Page();
    const { container } = render(pageComponent);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(15);
  });

  it("adds target='_blank' and rel='noopener noreferrer' to external links", async () => {
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

  it("uses clean URLs without .html for internal links", async () => {
    const pageComponent = await Page();
    const { container } = render(pageComponent);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter(
      (a) => a.getAttribute("href")?.startsWith("/") ?? false
    );
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });
});
