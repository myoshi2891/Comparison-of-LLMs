// Red contract test for /copilot/skill updated for Github-copilot-skillmd-guide.html migration.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import CopilotSkillPage, { metadata as rawMetadata } from "@/app/copilot/skill/page";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";

const Page = CopilotSkillPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "このガイドについて",
  "1-agent-skills-とは何か",
  "2-標準化の経緯とタイムライン",
  "3-3段階ローディングprogressive-disclosure完全解説",
  "4-フロントマター完全仕様",
  "5-ディレクトリ構造とスコープ",
  "6-ステップバイステップ作成ガイド",
  "7-github-cligh-skillによるスキル管理",
  "8-実践テンプレート集",
  "9-copilotの各サーフェスでの挙動差分",
  "10-skills-vs-custom-instructions-vs-mcp-vs-subagents",
  "11-セキュリティベストプラクティス",
  "12-トラブルシューティング完全ガイド",
  "13-ベストプラクティスチェックリスト",
  "14-まとめ",
  "参考文献出典",
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
  it("renders an <h1> containing 'GitHub Copilot Agent Skills 実践ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(/GitHub Copilot Agent Skills 実践ガイド/);
  });

  it("renders all 16 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`[id="${id}"]`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 16 TOC links pointing to section anchors", () => {
    const io = installIntersectionObserverStub();
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_SECTION_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }

    const firstHeading = container.querySelector(`[id="${EXPECTED_SECTION_IDS[0]}"]`) as Element;
    const secondHeading = container.querySelector(`[id="${EXPECTED_SECTION_IDS[1]}"]`) as Element;
    io.emit([
      {
        target: firstHeading,
        isIntersecting: true,
        boundingClientRect: { top: 20 } as DOMRectReadOnly,
      },
    ]);
    io.emit([
      {
        target: secondHeading,
        isIntersecting: true,
        boundingClientRect: { top: 40 } as DOMRectReadOnly,
      },
    ]);
    expect(tocAnchors[0].classList.contains(styles.active)).toBe(true);
    expect(tocAnchors[1].classList.contains(styles.active)).toBe(false);

    io.emit([
      {
        target: firstHeading,
        isIntersecting: true,
        boundingClientRect: { top: 50 } as DOMRectReadOnly,
      },
      {
        target: secondHeading,
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(tocAnchors[0].classList.contains(styles.active)).toBe(false);
    expect(tocAnchors[1].classList.contains(styles.active)).toBe(true);

    io.emit([
      {
        target: secondHeading,
        isIntersecting: false,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(tocAnchors[0].classList.contains(styles.active)).toBe(true);
    expect(tocAnchors[1].classList.contains(styles.active)).toBe(false);
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

    const sourcesHeading = container.querySelector('[id="参考文献出典"]');
    const sourcesGrid = sourcesHeading?.nextElementSibling?.nextElementSibling;
    const sourceLinks = sourcesGrid?.querySelectorAll('a[href^="http"]');

    expect(sourceLinks?.length).toBeGreaterThanOrEqual(23);
  });
});

describe("/copilot/skill - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
