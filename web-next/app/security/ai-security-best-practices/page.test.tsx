import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, {
  metadata as rawMetadata,
} from "@/app/security/ai-security-best-practices/page";

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

// Mock the MermaidDiagram component to avoid syntax and rendering issues in testing environment
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const EXPECTED_SECTION_IDS = [
  "intro",
  "overview",
  "atlas",
  "owasp-llm",
  "owasp-agentic",
  "prompt-injection",
  "saif",
  "nist",
  "regulation",
  "redteam",
  "checklist",
  "summary",
  "references",
] as const;

describe("/security/ai-security-best-practices - metadata", () => {
  it("exports a metadata object with title containing 'AIセキュリティ ベストプラクティスガイド'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("AIセキュリティ ベストプラクティスガイド | LLM-Studies");
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/security/ai-security-best-practices - page structure", () => {
  it("renders an <h1> containing 'AIセキュリティ ベストプラクティスガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toBe("AIセキュリティ ベストプラクティスガイド");
  });

  it("renders all 13 expected sections", () => {
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

describe("/security/ai-security-best-practices - external link safety", () => {
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

describe("/security/ai-security-best-practices - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
