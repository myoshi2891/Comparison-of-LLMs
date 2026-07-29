// Contract test for /google/agent (Antigravity Spec-Driven Development Guide).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import AntigravitySpecPage, { metadata as rawMetadata } from "@/app/google/agent/page";

const Page = AntigravitySpecPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "section-1",
  "section-2",
  "section-3",
  "section-4",
  "section-5",
  "section-6",
  "section-7",
  "section-8",
  "section-9",
  "section-10",
] as const;

describe("/google/agent - metadata", () => {
  it("exports a metadata object with title containing Antigravity and Spec-Driven", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Antigravity/);
    expect(title).toMatch(/仕様駆動開発/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/google/agent - page structure", () => {
  it("renders an <h1> containing 'AI仕様駆動開発'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/AI仕様駆動開発/);
  });

  it("renders all 10 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 10 TOC links pointing to all section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#section-"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    const expectedHrefs = EXPECTED_SECTION_IDS.map((id) => `#${id}`);
    expect(tocHrefs).toHaveLength(expectedHrefs.length);
    expect(tocHrefs).toEqual(expect.arrayContaining(expectedHrefs));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/google/agent - external link safety", () => {
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

  it("section-10 contains at least 12 external links", () => {
    const { container } = render(<Page />);
    const section10 = container.querySelector("#section-10");
    expect(section10).not.toBeNull();
    if (!section10) throw new Error("section-10 is null");
    const externals = section10.querySelectorAll('a[href^="http"]');
    expect(externals.length).toBeGreaterThanOrEqual(12);
  });
});

describe("/google/agent - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});

