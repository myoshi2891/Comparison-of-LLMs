// Phase B-2 [Red] contract test. Expected to FAIL until Green phase
// implements app/gemini/skill/page.tsx.

/**
 * Phase B-2 契約テスト (/gemini/skill)。
 *
 * 固定する契約:
 * - `metadata` が export され、title に「マークダウンファイル」と
 *   「Antigravity」を含む
 * - `<h1>` が 1 つ存在し、`マークダウンファイル` を含む
 * - 11 個の section id が存在する (overview, directory, gemini-md, rules,
 *   skills, workflows, context, artifacts, sdd, best-practices, sources)
 * - 11 個の TOC リンクが `#section-id` 形式で存在する
 * - 外部リンク (http/https) には全て `target="_blank"` かつ
 *   `rel="noopener noreferrer"` が付与されている
 * - `sources` セクション内に 15 件以上の外部リンクが存在する
 * - 静的検査: 生 HTML 流し込み API (React の XSS 危険 prop) を使用していない
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import GeminiSkillPage, { metadata as rawMetadata } from "@/app/gemini/skill/page";

const Page = GeminiSkillPage as unknown as () => ReactElement;
// Next.js の Metadata 型を避けるための最小ローカル型 (実体は Metadata オブジェクト)。
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "overview",
  "directory",
  "gemini-md",
  "rules",
  "skills",
  "workflows",
  "context",
  "artifacts",
  "sdd",
  "best-practices",
  "sources",
] as const;

describe("/gemini/skill - metadata", () => {
  it("exports a metadata object with title containing マークダウンファイル and Antigravity", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/マークダウンファイル/);
    expect(title).toMatch(/Antigravity/);
  });

  it("exports a metadata object with description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("reflects Google I/O 2026 announcements (Antigravity 2.0 / Gemini 3.5 Flash)", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Antigravity 2\.0/);
    expect(title).toMatch(/Gemini 3\.5 Flash/);
    expect(metadata.description as string).toMatch(/Antigravity 2\.0/);
  });
});

describe("/gemini/skill - page structure", () => {
  it("renders an <h1> containing 'マークダウンファイル'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/マークダウンファイル/);
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

describe("/gemini/skill - external link safety", () => {
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

  it("sources section contains at least 17 external links (≥15 baseline + 3 I/O 2026 entries)", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#sources");
    expect(sources).not.toBeNull();
    const externals =
      sources?.querySelectorAll('a[href^="http"]') ??
      ([] as unknown as NodeListOf<HTMLAnchorElement>);
    expect(externals.length).toBeGreaterThanOrEqual(17);
  });
});

describe("/gemini/skill - Google I/O 2026 content", () => {
  it("renders Antigravity 2.0 / Gemini 3.5 Flash / I/O 2026 references in the body", () => {
    const { container } = render(<Page />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/Gemini 3\.5 Flash/);
    expect(text).toMatch(/Antigravity 2\.0/);
    expect(text).toMatch(/2026-05-19/);
    expect(text).toMatch(/Antigravity CLI/);
  });

  it("includes the three new I/O 2026 SOURCES entries by URL", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#sources");
    expect(sources).not.toBeNull();
    const html = sources?.innerHTML ?? "";
    const requiredUrlFragments = [
      "blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights",
      "developers.googleblog.com/all-the-news-from-the-google-io-2026-developer-keynote",
      "developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli",
    ];
    for (const fragment of requiredUrlFragments) {
      expect(html).toContain(fragment);
    }
  });
});

describe("/gemini/skill - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    // オブフスケート (false positive / prompt hook 誤検知回避)。
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
