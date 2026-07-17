import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { navLinks } from "@/components/site/nav-links";
import { findNavLeaf } from "@/tests/helpers/nav";
import PageComponent, { metadata as rawMetadata } from "@/app/model-data/gpt-5-6-best-practices/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "overview",
  "lineup",
  "selection-flow",
  "effort-mode",
  "persisted-reasoning",
  "ptc",
  "multi-agent",
  "prompt-caching",
  "prompt-design",
  "verbosity",
  "autonomy",
  "safety",
  "migration",
  "code",
  "availability",
  "cost",
  "summary",
  "sources",
] as const;

describe("/model-data/gpt-5-6-best-practices - contract", () => {
  it("exports GPT-5.6 guide metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("OpenAI GPT-5.6 完全ガイド | LLM-Studies");
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders the source h1 and every section anchor", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("OpenAI GPT-5.6 完全ガイド");
    for (const id of EXPECTED_SECTION_IDS) {
      expect(container.querySelector(`#${id}`), `anchor #${id} must exist`).not.toBeNull();
    }
  });

  it("renders TOC links for every section anchor", () => {
    const { container } = render(<Page />);
    const hrefs = Array.from(container.querySelectorAll("nav a[href^='#']")).map((link) =>
      link.getAttribute("href")
    );
    for (const id of EXPECTED_SECTION_IDS) {
      expect(hrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });

  it("faithfully renders the six source tables and nine Mermaid diagrams", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("table")).toHaveLength(6);
    expect(container.querySelectorAll("[data-testid='mermaid']")).toHaveLength(9);
  });

  it("marks every external link as a safe new-tab link", () => {
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(`${__dirname}/page.tsx`, "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });

  it("is reachable from the site navigation", () => {
    const link = findNavLeaf(navLinks, "/model-data/gpt-5-6-best-practices");
    expect(link).toBeDefined();
    expect(link?.name).toBe("GPT-5.6 Best Practices");
  });
});
