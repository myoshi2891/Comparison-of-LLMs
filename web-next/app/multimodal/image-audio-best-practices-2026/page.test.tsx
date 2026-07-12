import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page from "./page";

// Mermaid component mock to avoid rendering library issues in JSDOM
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

// Stub IntersectionObserver for testing in jsdom environment
class IntersectionObserverStub {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {
    // no-op
  }
  unobserve() {
    // no-op
  }
  disconnect() {
    // no-op
  }
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

describe("Multimodal Image & Audio Best Practices 2026 Guide Contract Tests", () => {
  it("renders the page with correct H1 title", async () => {
    render(await Page());
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("マルチモーダルAI実践ガイド");
    expect(h1.textContent).toContain("画像・音声生成のベストプラクティス");
  });

  it("contains exactly 16 major sections with H2 headings", async () => {
    const { container } = render(await Page());
    const h2List = container.querySelectorAll("h2");
    expect(h2List.length).toBe(16);
  });

  it("ensures all external links have target='_blank' and rel='noopener noreferrer'", async () => {
    const { container } = render(await Page());
    const links = Array.from(container.querySelectorAll("a"));
    const externalLinks = links.filter((a) => {
      const href = a.getAttribute("href");
      return href?.startsWith("http");
    });

    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("ensures all internal links are clean URLs without .html extension", async () => {
    const { container } = render(await Page());
    const links = Array.from(container.querySelectorAll("a"));
    const internalLinks = links.filter((a) => {
      const href = a.getAttribute("href");
      return href && !href.startsWith("http") && !href.startsWith("#");
    });

    for (const link of internalLinks) {
      const href = link.getAttribute("href") || "";
      expect(href.endsWith(".html")).toBe(false);
    }
  });

  it("contains inline code elements", async () => {
    const { container } = render(await Page());
    const codeElements = container.querySelectorAll("code");
    expect(codeElements.length).toBeGreaterThan(0);
  });

  it("renders mermaid diagrams", async () => {
    const { getAllByTestId } = render(await Page());
    const diagrams = getAllByTestId("mermaid");
    expect(diagrams.length).toBe(18);
  });
});
