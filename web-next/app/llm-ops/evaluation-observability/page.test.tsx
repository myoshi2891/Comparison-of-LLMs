import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/llm-ops/evaluation-observability/page";

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
  "section1",
  "section2",
  "section3",
  "section4",
  "section5",
  "section6",
  "section7",
  "section8",
  "section9",
  "section10",
  "section11",
  "section12",
  "section13",
  "section14",
  "section15",
  "section16",
  "section17",
  "section18",
] as const;

describe("/llm-ops/evaluation-observability - metadata", () => {
  it("exports a metadata object with title containing 'LLM評価・ベンチマーク'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe(
      "LLM評価・ベンチマーク & オブザーバビリティ ベストプラクティスガイド(2026年版) | LLM-Studies"
    );
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/llm-ops/evaluation-observability - page structure", () => {
  it("renders an <h1> containing 'LLM評価・ベンチマーク & オブザーバビリティ ベストプラクティスガイド(2026年版)'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("main h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("LLM評価・ベンチマーク & オブザーバビリティ ベストプラクティスガイド(2026年版)");
  });

  it("renders all 18 expected sections", () => {
    const { container } = render(<Page />);
    const sections = container.querySelectorAll("section");
    // We check for sections with expected IDs
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
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

describe("/llm-ops/evaluation-observability - external link safety", () => {
  it("all external http(s) links have correct target and rel attributes", () => {
    const { container } = render(<Page />);
    const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return /^https?:\/\//.test(href);
    });
    expect(externals.length).toBeGreaterThan(0);
    for (const a of externals) {
      expect(a.getAttribute("target")).toBe("_blank");
      const rel = a.getAttribute("rel") ?? "";
      expect(rel).toMatch(/\bnoopener\b/);
      expect(rel).toMatch(/\bnoreferrer\b/);
    }
  });

  it("contains clean internal links only (no .html extensions)", () => {
    const { container } = render(<Page />);
    const links = container.querySelectorAll("a");
    for (const a of Array.from(links)) {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/") && !href.startsWith("//")) {
        expect(href).not.toContain(".html");
      }
    }
  });
});

describe("/llm-ops/evaluation-observability - code block validation", () => {
  it("renders code blocks with correct language classes", () => {
    const { container } = render(<Page />);
    const codeBlock = container.querySelector("pre code");
    expect(codeBlock).not.toBeNull();
    expect(codeBlock?.className).toContain("language-bash");
  });
});

describe("/llm-ops/evaluation-observability - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
