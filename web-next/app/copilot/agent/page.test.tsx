// @vitest-environment jsdom

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import CopilotAgentPage, { metadata as rawMetadata } from "@/app/copilot/agent/page";

const Page = CopilotAgentPage as unknown as () => ReactElement;

type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "overview",
  "frontmatter",
  "stepbystep",
  "handoffs",
  "subagents",
  "mcp",
  "patterns",
  "troubleshooting",
  "bestpractices",
  "references",
] as const;

describe("/copilot/agent - metadata", () => {
  it("exports a metadata object with title containing Copilot and .agent.md", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/\.agent\.md/);
    expect(title).toMatch(/GitHub Copilot/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/copilot/agent - page structure", () => {
  it("renders an <h1> containing '.agent.md 実践ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/\.agent\.md 実践ガイド/);
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
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    const expectedHrefs = EXPECTED_SECTION_IDS.map((id) => `#${id}`);
    expect(tocHrefs).toHaveLength(expectedHrefs.length);
    expect(tocHrefs).toEqual(expect.arrayContaining(expectedHrefs));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });

  it("renders exactly 52 h3 subsections", () => {
    const { container } = render(<Page />);
    const h3s = container.querySelectorAll("h3");
    expect(h3s.length).toBe(52);
  });

  it("renders 6 Mermaid diagrams within wrappers", () => {
    const { container } = render(<Page />);
    const diagrams = container.querySelectorAll("[data-testid='mermaid-diagram'], [data-mermaid]");
    expect(diagrams.length).toBe(6);
  });

  it("renders callout boxes with proper data-variant", () => {
    const { container } = render(<Page />);
    const callouts = container.querySelectorAll("[data-variant]");
    expect(callouts.length).toBeGreaterThanOrEqual(3);
  });
});

describe("/copilot/agent - external link safety", () => {
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

  it("references section contains at least 5 external reference cards/links", () => {
    const { container } = render(<Page />);
    const references = container.querySelector("#references");
    expect(references).not.toBeNull();
    if (!references) throw new Error("references section is null");
    const externals = references.querySelectorAll('a[href^="http://"], a[href^="https://"]');
    expect(externals.length).toBeGreaterThanOrEqual(5);
  });
});

describe("/copilot/agent - static source safety", () => {
  it("does not use React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
