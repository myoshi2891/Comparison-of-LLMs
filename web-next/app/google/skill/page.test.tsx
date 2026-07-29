// Phase B-2 [Red] contract test. Expected to FAIL until Green phase
// implements app/google/skill/page.tsx with Agent-skills-antigravity-best-practices.html content.

/**
 * Phase B-2 契約テスト (/google/skill)。
 *
 * 固定する契約:
 * - `metadata` が export され、title に「Agent Skills 実践ガイド」と「Antigravity IDE」を含む
 * - `<h1>` が 1 つ存在し、「Agent Skills 実践ガイド」を含む
 * - 10 個の section id が存在する (intro, origin, philosophy, architecture,
 *   antigravity, practices, operations, example, summary, references)
 * - 10 個の TOC リンクが `#section-id` 形式で存在する
 * - 外部リンク (http/https) には全て `target="_blank"` かつ
 *   `rel="noopener noreferrer"` が付与されている
 * - `references` セクション内に 20 件以上の外部リンクが存在する
 * - 静的検査: 生 HTML 流し込み API (React の XSS 危険 prop) を使用していない
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import AgentSkillsPage, { metadata as rawMetadata } from "@/app/google/skill/page";

const Page = AgentSkillsPage as unknown as () => ReactElement;
// Next.js の Metadata 型を避けるための最小ローカル型 (実体は Metadata オブジェクト)。
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "intro",
  "origin",
  "philosophy",
  "architecture",
  "antigravity",
  "practices",
  "operations",
  "example",
  "summary",
  "references",
] as const;

describe("/google/skill - metadata", () => {
  it("exports a metadata object with title containing Agent Skills 実践ガイド and Antigravity IDE", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Agent Skills 実践ガイド/);
    expect(title).toMatch(/Antigravity IDE/);
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/google/skill - page structure", () => {
  it("renders an <h1> containing 'Agent Skills 実践ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/Agent Skills 実践ガイド/);
  });

  it("renders all 10 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 10 TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/google/skill - external link safety", () => {
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

  it("references section contains at least 20 external links", () => {
    const { container } = render(<Page />);
    const references = container.querySelector("#references");
    expect(references).not.toBeNull();
    const externals =
      references?.querySelectorAll('a[href^="http"]') ??
      ([] as unknown as NodeListOf<HTMLAnchorElement>);
    expect(externals.length).toBeGreaterThanOrEqual(20);
  });
});

describe("/google/skill - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    // オブフスケート (false positive / prompt hook 誤検知回避)。
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
