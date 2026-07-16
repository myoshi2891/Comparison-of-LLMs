import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { load } from "cheerio";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, {
  metadata as rawMetadata,
} from "@/app/local-llm/finetuning-best-practices/page";

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

class IntersectionObserverStub {
  observe() {
    // mock
  }
  disconnect() {
    // mock
  }
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

const EXPECTED_ANCHOR_IDS = [
  "intro",
  "sec-1",
  "sec-2",
  "sec-3",
  "step-1",
  "step-2",
  "step-3",
  "step-4",
  "step-5",
  "step-6",
  "step-7",
  "step-8",
  "step-9",
  "step-10",
  "step-11",
  "pitfalls",
  "summary",
  "references",
] as const;

describe("/local-llm/finetuning-best-practices - metadata", () => {
  it("exports the guide metadata", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("LLMファインチューニング ベストプラクティスガイド | LLM-Studies");
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/local-llm/finetuning-best-practices - page structure", () => {
  it("renders the h1 and every source anchor", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain(
      "LLMファインチューニングベストプラクティスガイド"
    );
    for (const id of EXPECTED_ANCHOR_IDS) {
      expect(container.querySelector(`#${id}`), `anchor #${id} must exist`).not.toBeNull();
    }
  });

  it("renders TOC links for every source anchor", () => {
    const { container } = render(<Page />);
    const hrefs = Array.from(container.querySelectorAll(".nav-list a[href^='#']")).map((link) =>
      link.getAttribute("href")
    );
    for (const id of EXPECTED_ANCHOR_IDS) {
      expect(hrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/local-llm/finetuning-best-practices - faithful content safeguards", () => {
  it("renders all external links safely", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks).toHaveLength(99);
    for (const link of externalLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")).toMatch(/\bnoopener\b/);
      expect(link.getAttribute("rel")).toMatch(/\bnoreferrer\b/);
    }
  });

  it("renders the five source code blocks and nine Mermaid diagrams", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("pre code")).toHaveLength(5);
    expect(container.querySelector("code.language-python")).not.toBeNull();
    expect(container.querySelector("code.language-json")).not.toBeNull();
    expect(container.querySelector("code.language-bash")).not.toBeNull();
    expect(container.querySelectorAll("[data-testid='mermaid']")).toHaveLength(9);
  });

  it("syntax-highlights every source code block without changing its text", () => {
    const source = load(
      readFileSync(
        join(process.cwd(), "..", "archive", "Finetuning-best-practices-guide.html"),
        "utf8"
      )
    );
    const sourceBlocks = source("pre code")
      .toArray()
      .map((block) => source(block).text());
    const { container } = render(<Page />);
    const renderedBlocks = Array.from(container.querySelectorAll("pre code"));

    expect(renderedBlocks).toHaveLength(5);
    for (const [index, block] of renderedBlocks.entries()) {
      expect(block.textContent).toBe(sourceBlocks[index]);
      expect(block.querySelectorAll("[data-syntax-token]").length).toBeGreaterThan(0);
    }
  });

  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
