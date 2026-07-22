import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import PageComponent from "./page";

const Page = PageComponent as unknown as () => ReactElement;

// Mock the MermaidDiagram component
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

// Stub IntersectionObserver
class IntersectionObserverStub {
  observe() {
    // stub
  }
  unobserve() {
    // stub
  }
  disconnect() {
    // stub
  }
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

describe("Gemma 4 Best Practices Guide Page Contract", () => {
  it("should have correct page title", () => {
    render(<Page />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title.textContent).toContain("Google Gemma 実践ガイド");
  });

  it("should have 14 major sections (h2)", () => {
    const { container } = render(<Page />);
    const headings = container.querySelectorAll("h2");
    expect(headings.length).toBe(14);
  });

  it("should have secure external links with target and rel attributes", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && (href.startsWith("http://") || href.startsWith("https://"));
    });

    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("should have clean internal links without .html extension", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && !href.startsWith("http") && !href.startsWith("#");
    });

    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      expect(href).not.toContain(".html");
    }
  });

  it("should have correct language class on code elements", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre code");

    if (codeBlocks.length > 0) {
      for (const code of Array.from(codeBlocks)) {
        const className = code.className || "";
        expect(className).toMatch(/language-\w+/);
      }
    }
  });

  it("should be registered in the page registry", () => {
    const entry = findBySlug("/google/gemma-best-practices-guide");
    expect(entry).toBeDefined();
    expect(entry?.title).toBe("Gemma Best Practices Guide");
    expect(entry?.group).toBe("Providers");
    expect(entry?.category).toBe("Google");
  });
});
