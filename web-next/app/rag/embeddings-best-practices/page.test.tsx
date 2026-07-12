import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mermaid component mock to avoid rendering library issues in JSDOM
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("RAG and Embeddings Best Practices Guide Contract Tests", () => {
  it("renders the page with correct H1 title", async () => {
    render(await Page());
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("RAG(Retrieval-Augmented Generation)とEmbeddings 完全ガイド");
  });

  it("contains exactly 14 major sections with H2 headings", async () => {
    const { container } = render(await Page());
    const h2List = container.querySelectorAll("h2");
    expect(h2List.length).toBe(14);
  });

  it("ensures all external links have target='_blank' and rel='noopener noreferrer'", async () => {
    const { container } = render(await Page());
    const links = Array.from(container.querySelectorAll("a"));
    const externalLinks = links.filter((a) => {
      const href = a.getAttribute("href");
      return href && href.startsWith("http");
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

  it("contains code blocks with appropriate language tags", async () => {
    const { container } = render(await Page());
    // Checking code blocks have structured styling with standard monospace layout
    const codeBlocks = container.querySelectorAll("pre");
    expect(codeBlocks.length).toBeGreaterThan(0);
    for (const block of Array.from(codeBlocks)) {
      const code = block.querySelector("code");
      if (code) {
        expect(code.className).toMatch(/language-.+/);
      }
    }
  });
});
