import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, {
  metadata as rawMetadata,
} from "@/app/google/notebook-lm/page";

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

// Mock the MermaidDiagram component to avoid syntax and rendering issues in testing environment
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

// Stub IntersectionObserver for testing in jsdom environment
class IntersectionObserverStub {
  observe() {
    // mock
  }
  unobserve() {
    // mock
  }
  disconnect() {
    // mock
  }
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

const EXPECTED_SECTION_IDS = [
  "ch1",
  "ch2",
  "ch3",
  "ch4",
  "ch5",
  "ch6",
  "ch7",
  "ch8",
  "ch9",
  "ch10",
  "ch11",
  "ch12",
  "ch13",
  "ch14",
  "ch15",
  "ch16",
  "ch17",
] as const;

describe("/google/notebook-lm - metadata", () => {
  it("exports a metadata object with correct title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("Google NotebookLM 完全ベストプラクティスガイド | LLM-Studies");
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/google/notebook-lm - page structure", () => {
  it("renders an <h1> containing 'Google NotebookLM 完全ベストプラクティスガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("Google NotebookLM 完全ベストプラクティスガイド");
  });

  it("renders all 17 expected sections", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 18 h2 elements (17 chapters + end note)", () => {
    const { container } = render(<Page />);
    const h2List = container.querySelectorAll("h2");
    expect(h2List.length).toBe(18);
  });

  it("renders TOC links pointing to all section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll("nav a[href^='#']");
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/google/notebook-lm - external link safety", () => {
  it("all external http(s) links have correct target and rel attributes", () => {
    const { container } = render(<Page />);
    const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return /^https?:\/\//.test(href);
    });
    expect(externals.length).toBeGreaterThan(0);
    for (const link of externals) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});

describe("/google/notebook-lm - internal links", () => {
  it("all internal links point to clean URLs (no .html extension)", () => {
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return href.startsWith("/") || href.startsWith("#");
    });
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      expect(href.endsWith(".html")).toBe(false);
    }
  });
});

describe("/google/notebook-lm - code blocks", () => {
  it("all code elements inside pre have a language class", () => {
    const { container } = render(<Page />);
    const pres = container.querySelectorAll("pre");
    // Some pre elements might represent mock mermaid charts in the dummy component, so filter them
    const codePres = Array.from(pres).filter((pre) => !pre.getAttribute("data-testid"));
    for (const pre of codePres) {
      const code = pre.querySelector("code");
      expect(code).not.toBeNull();
      const className = code?.getAttribute("class") ?? "";
      expect(className).toMatch(/language-\w+/);
    }
  });
});
