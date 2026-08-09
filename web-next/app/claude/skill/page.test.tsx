/**
 * Phase B-1 契約テスト (/claude/skill)。
 *
 * Claude Codeで始めるAI仕様駆動開発 ― Markdownファイル完全ガイド
 *
 * 固定する契約:
 * - `metadata` が export され、title に「Claude Codeで始めるAI仕様駆動開発」を含む
 * - `<h1>` が 1 つ存在し、「Claude Codeで始めるAI仕様駆動開発」を含む
 * - 15 個の section id が存在する (s0 ～ s14)
 * - 15 個の TOC リンクが `#s0` ～ `#s14` 形式で存在する
 * - 5 個の Mermaid 図 (`diagram-workflow`, `diagram-login-sequence`, `diagram-implementation`,
 *   `diagram-context-loading`, `diagram-data-flow`) が存在する
 * - 外部リンク (http/https) には全て `target="_blank"` かつ
 *   `rel="noopener noreferrer"` が付与されている
 * - `s14` (参考文献・出典) セクション内に 14 件以上の外部リンクが存在する
 * - 静的検査: 生 HTML 流し込み API (React の XSS 危険 prop) を使用していない
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ClaudeSkillPage, { metadata as rawMetadata } from "@/app/claude/skill/page";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart, id }: { chart: string; id?: string }) {
    return (
      <div id={id} data-testid="mermaid">
        {chart}
      </div>
    );
  },
}));

const Page = ClaudeSkillPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "s0",
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
  "s12",
  "s13",
  "s14",
] as const;

const EXPECTED_MERMAID_IDS = [
  "diagram-workflow",
  "diagram-login-sequence",
  "diagram-implementation",
  "diagram-context-loading",
  "diagram-data-flow",
] as const;

describe("/claude/skill - metadata", () => {
  it("exports a metadata object with title containing 'Claude Codeで始めるAI仕様駆動開発'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Claude Codeで始めるAI仕様駆動開発/);
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/claude/skill - page structure", () => {
  it("renders an <h1> containing 'Claude Codeで始めるAI仕様駆動開発'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/Claude Codeで始めるAI仕様駆動開発/);
  });

  it("renders all 15 expected section ids (s0 ~ s14)", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 15 TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });

  it("renders all 5 expected Mermaid diagram containers", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_MERMAID_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `Mermaid diagram id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders the back to top button element", () => {
    const { container } = render(<Page />);
    const backToTopBtn = container.querySelector("#backToTop");
    expect(backToTopBtn).not.toBeNull();
  });
});

describe("/claude/skill - external link safety", () => {
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

  it("s14 section contains at least 14 external links", () => {
    const { container } = render(<Page />);
    const s14 = container.querySelector("#s14");
    expect(s14).not.toBeNull();
    const externals =
      s14?.querySelectorAll('a[href^="http"]') ?? ([] as unknown as NodeListOf<HTMLAnchorElement>);
    expect(externals.length).toBeGreaterThanOrEqual(14);
  });
});

describe("/claude/skill - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});

describe("/claude/skill - TocObserver intersection handling", () => {
  it("selects the closest intersecting entry (smallest boundingClientRect.top) for TOC active state", () => {
    const io = installIntersectionObserverStub();

    const { container } = render(<Page />);
    const tocLinks = container.querySelectorAll("nav a[href^='#']");
    expect(tocLinks.length).toBeGreaterThan(0);

    io.emit([
      {
        isIntersecting: true,
        target: { id: "s1" } as unknown as HTMLElement,
        boundingClientRect: { top: 300 } as DOMRectReadOnly,
      },
      {
        isIntersecting: true,
        target: { id: "s0" } as unknown as HTMLElement,
        boundingClientRect: { top: 100 } as DOMRectReadOnly,
      },
    ]);

    const s0Link = container.querySelector('nav a[href="#s0"]');
    const s1Link = container.querySelector('nav a[href="#s1"]');
    expect(s0Link?.classList.contains("toc-active")).toBe(true);
    expect(s1Link?.classList.contains("toc-active")).toBe(false);
  });
});
