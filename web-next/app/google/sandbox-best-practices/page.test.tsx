import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import GoogleSandboxBestPracticesPage, {
  metadata as rawMetadata,
} from "@/app/google/sandbox-best-practices/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = GoogleSandboxBestPracticesPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "intro",
  "selector",
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "compare",
  "glossary",
  "resources",
] as const;

describe("/google/sandbox-best-practices - metadata", () => {
  it("exports a metadata object with title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("Google Sandbox 完全ガイド 2026 — 初学者向け");
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect(metadata.description).toMatch(/サンドボックス/);
  });
});

describe("/google/sandbox-best-practices - page structure", () => {
  it("renders an <h1> containing correct title", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/Google/);
    expect(h1?.textContent).toMatch(/サンドボックス/);
  });

  it("renders all expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders intro content correctly", () => {
    const { container } = render(<Page />);
    const intro = container.querySelector("#intro");
    expect(intro).not.toBeNull();
    expect(intro?.textContent).toMatch(/砂場/);
    expect(intro?.querySelector("table")).not.toBeNull();
  });

  it("renders selector content correctly", () => {
    const { container } = render(<Page />);
    const selector = container.querySelector("#selector");
    expect(selector).not.toBeNull();
    expect(selector?.textContent).toMatch(/ユースケース/);
  });

  it("renders s1 GKE Agent Sandbox correctly", () => {
    const { container } = render(<Page />);
    const s1 = container.querySelector("#s1");
    expect(s1).not.toBeNull();
    expect(s1?.textContent).toMatch(/GKE Agent Sandbox/);
    expect(s1?.querySelector("table")).not.toBeNull();
  });

  it("renders s2 Gemini Code Execution correctly", () => {
    const { container } = render(<Page />);
    const s2 = container.querySelector("#s2");
    expect(s2).not.toBeNull();
    expect(s2?.textContent).toMatch(/Gemini Code Execution/);
    expect(s2?.querySelector("table")).not.toBeNull();
  });

  it("renders s3 gVisor correctly", () => {
    const { container } = render(<Page />);
    const s3 = container.querySelector("#s3");
    expect(s3).not.toBeNull();
    expect(s3?.textContent).toMatch(/gVisor/);
    expect(s3?.querySelector("table")).not.toBeNull();
  });

  it("renders s4 Sandbox2 correctly", () => {
    const { container } = render(<Page />);
    const s4 = container.querySelector("#s4");
    expect(s4).not.toBeNull();
    expect(s4?.textContent).toMatch(/Sandbox2/);
    expect(s4?.querySelector("table")).not.toBeNull();
  });

  it("renders s5 V8 Sandbox correctly", () => {
    const { container } = render(<Page />);
    const s5 = container.querySelector("#s5");
    expect(s5).not.toBeNull();
    expect(s5?.textContent).toMatch(/V8 Sandbox/);
    expect(s5?.querySelector("table")).not.toBeNull();
  });

  it("renders s6 Privacy Sandbox correctly", () => {
    const { container } = render(<Page />);
    const s6 = container.querySelector("#s6");
    expect(s6).not.toBeNull();
    expect(s6?.textContent).toMatch(/Privacy Sandbox/);
    expect(s6?.querySelector("table")).not.toBeNull();
  });

  it("renders comparison matrix correctly", () => {
    const { container } = render(<Page />);
    const compare = container.querySelector("#compare");
    expect(compare).not.toBeNull();
    expect(compare?.querySelector("table")).not.toBeNull();
  });

  it("renders glossary correctly", () => {
    const { container } = render(<Page />);
    const glossary = container.querySelector("#glossary");
    expect(glossary).not.toBeNull();
    expect(glossary?.textContent).toMatch(/syscall/);
  });

  it("renders resources link section correctly", () => {
    const { container } = render(<Page />);
    const resources = container.querySelector("#resources");
    expect(resources).not.toBeNull();
    expect(resources?.querySelector("a")?.getAttribute("href")).toBeDefined();
  });

  it("renders TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/google/sandbox-best-practices - external link safety", () => {
  it("all external http(s) links have target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return /^https?:\/\//.test(href);
    });
    expect(externals.length).toBeGreaterThan(0);
    for (const a of externals) {
      expect(a.getAttribute("target")).toBe("_blank");
      const rel = a.getAttribute("rel") ?? "";
      expect(rel).toMatch(/noopener/);
      expect(rel).toMatch(/noreferrer/);
    }
  });
});

describe("/google/sandbox-best-practices - clean internal links", () => {
  it("all internal links do not contain .html extension", () => {
    const { container } = render(<Page />);
    const anchors = Array.from(container.querySelectorAll("a"));
    for (const a of anchors) {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/") || href.startsWith("#")) {
        expect(href.includes(".html")).toBe(false);
      }
    }
  });
});

describe("/google/sandbox-best-practices - language classes on code blocks", () => {
  it("all pre elements for code samples have language-* classes", () => {
    const { container } = render(<Page />);
    const codeBlocks = Array.from(container.querySelectorAll("pre"));
    const actualBlocks = codeBlocks.filter((pre) => pre.getAttribute("data-testid") !== "mermaid");
    expect(actualBlocks.length).toBeGreaterThan(0);
    for (const pre of actualBlocks) {
      const className = pre.className || "";
      expect(className).toMatch(/language-\w+/);
    }
  });
});

describe("/google/sandbox-best-practices - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
