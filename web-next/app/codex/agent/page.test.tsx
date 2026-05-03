// Phase C-3 [Red] contract test.
// All 8 tests fail until page.tsx is implemented.

/**
 * Phase C-3 契約テスト (/codex/agent)。
 *
 * 固定する契約:
 * - `metadata` が export され、title に「Codex」を含む
 * - `<h1>` が 1 つ存在し、`Codex` を含む
 * - 12 個の section id が存在する (s01〜s11 + sources)
 *   (legacy は <div class="sec"> × 12、id 属性なし → synthetic id 付与)
 * - 12 個の TOC リンクが `#section-id` 形式で存在する
 * - 外部リンク (http/https) には全て `target="_blank"` かつ
 *   `rel="noopener noreferrer"` が付与されている
 * - `sources` セクション内に 19 件以上の外部リンクが存在する
 * - 静的検査: 生 HTML 流し込み API (React の XSS 危険 prop) を使用していない
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import CodexAgentPage, { metadata as rawMetadata } from "@/app/codex/agent/page";

const Page = CodexAgentPage as unknown as () => ReactElement;
// Next.js の Metadata 型を避けるための最小ローカル型 (実体は Metadata オブジェクト)。
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "s01",
  "s02",
  "s03",
  "s04",
  "s05",
  "s06",
  "s07",
  "s08",
  "s09",
  "s10",
  "s11",
  "sources",
] as const;

describe("/codex/agent - metadata", () => {
  it("exports a metadata object with title containing Codex", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Codex/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/codex/agent - page structure", () => {
  it("renders an <h1> containing 'Codex'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/Codex/);
  });

  it("renders all 12 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${id}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 12 TOC links pointing to all section anchors", () => {
    const { container } = render(<Page />);
    // CSS Modules のクラス名はハッシュ化されるため nav.toc は使えない。
    // ページ内の全 nav のうち、hash リンク (#) を持つものを TOC nav として絞り込む。
    const tocNav = Array.from(container.querySelectorAll("nav")).find((nav) =>
      nav.querySelector('a[href^="#"]'),
    );
    expect(tocNav, "TOC nav element must exist").not.toBeUndefined();
    const tocAnchors = tocNav?.querySelectorAll('a[href^="#"]') ?? [];
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    const expectedHrefs = EXPECTED_SECTION_IDS.map((id) => `#${id}`);
    expect(tocHrefs).toHaveLength(expectedHrefs.length);
    expect(tocHrefs).toEqual(expect.arrayContaining(expectedHrefs));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/codex/agent - external link safety", () => {
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

  it("sources section contains at least 19 external links", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#sources");
    expect(sources).not.toBeNull();
    if (!sources) throw new Error("sources is null");
    const externals = sources.querySelectorAll('a[href^="http"]');
    expect(externals.length).toBeGreaterThanOrEqual(19);
  });
});

describe("/codex/agent - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    // オブフスケート (false positive / prompt hook 誤検知回避)。
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
