// Phase B-4 [Red] contract test. Expected to FAIL until Green phase
// implements app/copilot/skill/page.tsx.

/**
 * Phase B-4 契約テスト (/copilot/skill)。
 *
 * 固定する契約:
 * - `metadata` が export され、title に「SKILL.md」と「Copilot」を含む
 * - `<h1>` が 1 つ存在し、`SKILL.md` を含む
 * - 12 個の TOC 対象 section id が存在する (skill-concept, skill-3level,
 *   skill-spec, skill-paths, skill-stepbystep, skill-templates,
 *   skill-vs-instructions, skill-advanced, skill-troubleshoot,
 *   skill-bestpractices, skill-community, sources)
 * - 12 個の TOC リンクが `#section-id` 形式で存在する
 * - 外部リンク (http/https) には全て `target="_blank"` かつ
 *   `rel="noopener noreferrer"` が付与されている
 * - `sources` セクション内に 16 件以上の外部リンクが存在する
 *   (legacy HTML は [A]〜[L] 12 件 + 既存 [1][4][9][15] 4 件 = 計 16 件)
 * - 静的検査: 生 HTML 流し込み API (React の XSS 危険 prop) を使用していない
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import CopilotSkillPage, { metadata as rawMetadata } from "@/app/copilot/skill/page";

const Page = CopilotSkillPage as unknown as () => ReactElement;
// Next.js の Metadata 型を避けるための最小ローカル型 (実体は Metadata オブジェクト)。
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "skill-concept",
  "skill-3level",
  "skill-spec",
  "skill-paths",
  "skill-stepbystep",
  "skill-templates",
  "skill-vs-instructions",
  "skill-advanced",
  "skill-troubleshoot",
  "skill-bestpractices",
  "skill-community",
  "sources",
] as const;

describe("/copilot/skill - metadata", () => {
  it("exports a metadata object with title containing SKILL.md and Copilot", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/SKILL\.md/);
    expect(title).toMatch(/Copilot/);
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/copilot/skill - page structure", () => {
  it("renders an <h1> containing 'SKILL.md'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/SKILL\.md/);
  });

  it("renders all 12 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 12 TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/copilot/skill - external link safety", () => {
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

  it("sources section contains at least 16 external links", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#sources");
    expect(sources).not.toBeNull();
    const externals =
      sources?.querySelectorAll('a[href^="http"]') ??
      ([] as unknown as NodeListOf<HTMLAnchorElement>);
    expect(externals.length).toBeGreaterThanOrEqual(16);
  });
});

describe("/copilot/skill - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    // オブフスケート (false positive / prompt hook 誤検知回避)。
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
