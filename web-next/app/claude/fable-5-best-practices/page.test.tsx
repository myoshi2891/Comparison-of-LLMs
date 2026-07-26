import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/claude/fable-5-best-practices/page";
import { navLinks } from "@/components/site/nav-links";
import { findNavLeaf } from "@/tests/helpers/nav";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

const Page = PageComponent as unknown as () => ReactElement;
type MetadataLike = { title?: unknown; description?: unknown };
const metadata = rawMetadata as unknown as MetadataLike;

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("/claude/fable-5-best-practices - metadata", () => {
  it("exports a metadata object with title containing 'Claude Fable 5'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Claude Fable 5/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/claude/fable-5-best-practices - page structure (Step 1)", () => {
  it("renders an <h1> containing '地図は、現地ではない' and 'Claude Fable 5 実践活用ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.replace(/\s+/g, "")).toContain("地図は、現地ではない");
    expect(h1?.textContent?.replace(/\s+/g, "")).toContain("ClaudeFable5実践活用ガイド");
  });

  it("renders <h2> headings for ch1 to ch15 with updated field guide titles", () => {
    const { container } = render(<Page />);
    const h2s = Array.from(container.querySelectorAll("h2"));
    expect(h2s).toHaveLength(15);
    expect(h2s[0].textContent).toContain("Claude Fable 5 とは何か");
    expect(h2s[1].textContent).toContain("タイムライン: リリースから輸出規制、価格変更まで");
    expect(h2s[2].textContent).toContain("安全分類器と自動フォールバックの仕組み");
    expect(h2s[3].textContent).toContain("プロンプティング思想の転換: チェックリストからゴールへ");
    expect(h2s[4].textContent).toContain("Effort(推論深度)レベルの使い方");
    expect(h2s[5].textContent).toContain("Claude Code での実践設定");
    expect(h2s[6].textContent).toContain("Loop Engineering: 長時間自律ループの設計思想");
    expect(h2s[7].textContent).toContain("Thariq の「Unknowns フレームワーク」徹底解説");
    expect(h2s[8].textContent).toContain("検証ループとメモリシステムの設計");
    expect(h2s[9].textContent).toContain("コスト管理とモデル選定フロー");
    expect(h2s[10].textContent).toContain("よくある落とし穴(アンチパターン)");
    expect(h2s[11].textContent).toContain("実力・ベンチマークと「検証必須」の理由");
    expect(h2s[12].textContent).toContain("既知の制限事項");
    expect(h2s[13].textContent).toContain("まとめ");
    expect(h2s[14].textContent).toContain("参考文献・ソースURL一覧");
  });

  it("renders footer containing updated base date text", () => {
    const { container } = render(<Page />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("2026年7月16日時点の公式ドキュメント");
  });
});

describe("/claude/fable-5-best-practices - registration", () => {
  it("is reachable from the site navigation", () => {
    const link = findNavLeaf(navLinks, "/claude/fable-5-best-practices");
    expect(link).toBeDefined();
    expect(link?.name).toBe("Fable 5 Best Practices");
  });
});
