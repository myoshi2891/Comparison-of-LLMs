// Contract test for /agent/hermes-agent-advanced-guide
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import PageComponent, {
  metadata as rawMetadata,
} from "@/app/agent/hermes-agent-advanced-guide/page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

const EXPECTED_H2_IDS = [
  "1-hermes-agentとは何か",
  "2-アーキテクチャ概観",
  "3-セットアップとプロファイル運用のベストプラクティス",
  "4-メモリシステム設計のベストプラクティス",
  "5-スキルシステムとprogressive-disclosure",
  "6-curatorによるスキルの自動メンテナンス",
  "7-コンテキストファイル戦略agentsmd--soulmd",
  "8-サブエージェント委任delegation",
  "9-execute_codeによるトークン最適化",
  "10-persistent-goalsgoal-ralph-loopの実践",
  "11-cron自動化のベストプラクティス",
  "12-mcp統合のベストプラクティス",
  "13-本番運用のセキュリティチェックリスト",
  "14-コスト最適化とプロンプトキャッシュ",
  "15-トラブルシューティング",
  "16-ベストプラクティス総括チェックリスト",
  "17-参考文献出典",
] as const;

describe("/agent/hermes-agent-advanced-guide - metadata", () => {
  it("exports a metadata object with correct title and description", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toBe("Hermes Agent ベストプラクティスガイド ― 中級者から上級者向け");
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/agent/hermes-agent-advanced-guide - page structure", () => {
  it("renders an <h1> with exact title text", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.trim()).toBe("Hermes Agent ベストプラクティスガイド ― 中級者から上級者向け");
  });

  it("renders all 17 expected section H2 ids", () => {
    const { container } = render(<Page />);
    const h2Elements = container.querySelectorAll("h2[id]");
    expect(h2Elements.length).toBe(EXPECTED_H2_IDS.length);
    for (const id of EXPECTED_H2_IDS) {
      const el = container.querySelector(`h2#${CSS.escape(id)}`);
      expect(el, `h2 id="${id}" must exist`).not.toBeNull();
    }
  });

  it("renders exactly 11 Mermaid diagrams", () => {
    const { container } = render(<Page />);
    const mermaids = container.querySelectorAll('[data-testid="mermaid"]');
    expect(mermaids.length).toBe(11);
  });

  it("renders TOC links pointing to section anchors", () => {
    const { container } = render(<Page />);
    const tocAnchors = container.querySelectorAll('nav a[href^="#"]');
    const tocHrefs = Array.from(tocAnchors).map((a) => a.getAttribute("href"));
    for (const id of EXPECTED_H2_IDS) {
      expect(tocHrefs, `TOC must link to #${id}`).toContain(`#${id}`);
    }
  });
});

describe("/agent/hermes-agent-advanced-guide - external link safety", () => {
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
      expect(rel).toMatch(/\bnoopener\b/);
      expect(rel).toMatch(/\bnoreferrer\b/);
    }
  });

  it("contains clean internal links only (no .html extensions)", () => {
    const { container } = render(<Page />);
    const links = container.querySelectorAll("a");
    for (const a of Array.from(links)) {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/") && !href.startsWith("//")) {
        expect(href).not.toContain(".html");
      }
    }
  });
});

describe("/agent/hermes-agent-advanced-guide - static source safety", () => {
  it("does not use the React raw-HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    const needle = ["danger", "ously", "Set", "Inner", "HTML"].join("");
    expect(source.includes(needle)).toBe(false);
  });
});

