/**
 * 契約テスト (/codex/agent)。
 * OpenAI Codex サブエージェント開発ベストプラクティス完全ガイドの契約検証
 *
 * 固定する契約:
 * - `metadata` が export され、title に「OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド」を含む
 * - `<h1>` が 1 つ存在し、`OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド` と一致する
 * - 20 個の section id (前提, Step 1-18, 参考文献) が存在する
 * - 20 個の TOC リンクが `#...` 形式で存在する
 * - 外部リンク (http/https) には全て `target="_blank"` かつ `rel="noopener noreferrer"` が付与されている
 * - 参考文献セクション内に 17 件の外部リンクが存在する
 * - 静的検査: 生 HTML 流し込み API (React の XSS 危険 prop) を使用していない
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import CodexAgentPage, { metadata as rawMetadata } from "@/app/codex/agent/page";

const Page = CodexAgentPage as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_SECTION_IDS = [
  "この記事の前提-requirementsmdについて一点補足",
  "step-1-codex-エコシステム全体像",
  "step-2-agentsmd--基本のプロジェクト指示ファイル",
  "step-3-agentsoverridemd--一時的な上書きレイヤー",
  "step-4-発見順序とマージロジックの詳細",
  "step-5-configtoml--階層構造とスコープ",
  "step-6-configtoml-の主要キーとスキーマ",
  "step-7-requirementstoml--管理者施行の強制設定",
  "step-8-skillmd--progressive-disclosure-によるスキル拡張",
  "step-9-skills-運用のベストプラクティス",
  "step-10-subagents-の概念--コンテキスト汚染とコンテキスト腐敗",
  "step-11-カスタムサブエージェント定義ファイル",
  "step-12-マルチエージェントワークフロー設計パターン①-prレビューの3分割",
  "step-13-マルチエージェントワークフロー設計パターン②-csvファンアウト",
  "step-14-モデルreasoning-effort-の選定指針",
  "step-15-hooks-と-rulesexecpolicy-によるガバナンス",
  "step-16-実践チェックリスト",
  "step-17-トラブルシューティング",
  "step-18-まとめ",
  "参考文献",
] as const;

describe("/codex/agent - metadata", () => {
  it("exports a metadata object with title containing OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/codex/agent - page structure", () => {
  it("renders an <h1> containing 'OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toMatch(
      /OpenAI Codex サブエージェント開発ベストプラクティス完全ガイド/
    );
  });

  it("renders all 20 expected section ids", () => {
    const { container } = render(<Page />);
    for (const id of EXPECTED_SECTION_IDS) {
      const el = container.querySelector(`#${CSS.escape(id)}`);
      expect(el, `section id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders 20 TOC links pointing to all section anchors", () => {
    const { container } = render(<Page />);
    const tocNav = Array.from(container.querySelectorAll("nav")).find((nav) =>
      nav.querySelector('a[href^="#"]')
    );
    expect(tocNav, "TOC nav element must exist").not.toBeUndefined();
    const tocAnchors = tocNav?.querySelectorAll('a[href^="#"]') ?? [];
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    expect(tocHrefs).toHaveLength(20);
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

  it("references section contains at least 17 external links", () => {
    const { container } = render(<Page />);
    const references = container.querySelector(`#${CSS.escape("参考文献")}`);
    expect(references).not.toBeNull();
    if (!references) throw new Error("references section is null");
    const externals = references.querySelectorAll('a[href^="http"]');
    expect(externals.length).toBeGreaterThanOrEqual(17);
  });
});

describe("/codex/agent - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});
