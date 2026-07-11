import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, {
  metadata as rawMetadata,
} from "@/app/security/ai-security-best-practices-intermediate/page";

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
  "sec-01",
  "sec-02",
  "sec-03",
  "sec-04",
  "sec-05",
  "sec-06",
  "sec-07",
  "sec-08",
  "sec-09",
  "sec-10",
  "sec-11",
  "sec-12",
  "sec-13",
  "sec-14",
  "sec-15",
  "sec-16",
  "sec-17",
] as const;

describe("/security/ai-security-best-practices-intermediate - metadata", () => {
  it("exports a metadata object with title containing 'AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け）'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け） | LLM-Studies");
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/security/ai-security-best-practices-intermediate - page structure", () => {
  it("renders an <h1> containing 'AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け）'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toBe("AIセキュリティ ベストプラクティス完全ガイド（中級〜上級者向け）");
  });

  it("renders all 17 expected sections", () => {
    const { container } = render(<Page />);
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

describe("/security/ai-security-best-practices-intermediate - external link safety", () => {
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

describe("/security/ai-security-best-practices-intermediate - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
