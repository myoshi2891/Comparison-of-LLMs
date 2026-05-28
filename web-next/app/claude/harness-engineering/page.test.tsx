import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import HarnessEngineeringPage, {
  metadata as rawMetadata,
} from "@/app/claude/harness-engineering/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = HarnessEngineeringPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
] as const;

describe("/claude/harness-engineering - metadata", () => {
  it("exports a metadata object with title", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/ハーネスエンジニアリング/);
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/claude/harness-engineering - page structure", () => {
  it("renders an <h1> containing 'ハーネスエンジニアリング'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/ハーネスエンジニアリング/);
  });

  it("renders all 11 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 11 TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/claude/harness-engineering - external link safety", () => {
  it("all external http(s) links have target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const externals = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return /^https?:\/\//.test(href);
    });
    // 初期状態ではリンクがないため、このテストは0個でも一旦許容するか、
    // 実装が進んだらリンクがあることを検証します。
    if (externals.length > 0) {
      for (const a of externals) {
        expect(a.getAttribute("target")).toBe("_blank");
        const rel = a.getAttribute("rel") ?? "";
        expect(rel).toMatch(/noopener/);
        expect(rel).toMatch(/noreferrer/);
      }
    }
  });

  it("s11 (sources) section contains at least 3 external links", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#s11");
    expect(sources).not.toBeNull();
    const externals =
      sources?.querySelectorAll('a[href^="http"]') ??
      ([] as unknown as NodeListOf<HTMLAnchorElement>);
    expect(externals.length).toBeGreaterThanOrEqual(3);
  });
});

describe("/claude/harness-engineering - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
