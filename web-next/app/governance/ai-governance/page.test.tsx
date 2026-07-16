import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/governance/ai-governance/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_ANCHOR_IDS = [
  "intro",
  "chapter1",
  "chapter2",
  "s2-1",
  "s2-2",
  "s2-3",
  "s2-4",
  "s2-5",
  "s2-6",
  "chapter3",
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
  "step8",
  "chapter4",
  "chapter5",
  "summary",
  "references",
] as const;

describe("/governance/ai-governance - metadata", () => {
  it("exports the guide metadata", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("AIガバナンス実践ガイド | LLM-Studies");
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/governance/ai-governance - page structure", () => {
  it("renders the h1 and every source anchor", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("AIガバナンス実践ガイド");
    for (const id of EXPECTED_ANCHOR_IDS) {
      expect(container.querySelector(`#${id}`), `anchor #${id} must exist`).not.toBeNull();
    }
  });

  it("renders TOC links for every source anchor", () => {
    const { container } = render(<Page />);
    const hrefs = Array.from(container.querySelectorAll("nav a[href^='#']")).map((link) =>
      link.getAttribute("href")
    );
    for (const id of EXPECTED_ANCHOR_IDS) {
      expect(hrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/governance/ai-governance - faithful content safeguards", () => {
  it("renders all external links safely", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks).toHaveLength(84);
    for (const link of externalLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toMatch(/\bnoopener\b/);
      expect(link.getAttribute("rel")).toMatch(/\bnoreferrer\b/);
    }
  });

  it("renders the four source tables and five Mermaid diagrams", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("table")).toHaveLength(4);
    expect(container.querySelectorAll("[data-testid='mermaid']")).toHaveLength(5);
  });

  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
