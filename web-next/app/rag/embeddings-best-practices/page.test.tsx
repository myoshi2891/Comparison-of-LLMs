import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata as rawMetadata } from "./page";

type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

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

describe("RAG and Embeddings Best Practices Guide Contract Tests", () => {
  it("renders the page with correct H1 title", async () => {
    render(await Page());
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("RAG(Retrieval-Augmented Generation)とEmbeddings 完全ガイド");
  });

  it("exports metadata with correct title and description", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
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

  it("contains code blocks with appropriate language tags", async () => {
    const { container } = render(await Page());
    // Use the page's actual codeWrap/codeLang structure instead of generic pre/code iteration
    // Use partial class selector to support CSS Modules in test environment
    const codeWraps = container.querySelectorAll("[class*='codeWrap']");
    expect(codeWraps.length).toBeGreaterThan(0);
    for (const wrap of Array.from(codeWraps)) {
      const langLabel = wrap.querySelector("[class*='codeLang']");
      expect(langLabel).not.toBeNull();
      expect(langLabel?.textContent).not.toBe("");
    }

    // Separate handling for Mermaid blocks
    const mermaidPres = container.querySelectorAll('[data-testid="mermaid"]');
    expect(mermaidPres.length).toBeGreaterThan(0);
  });
});
