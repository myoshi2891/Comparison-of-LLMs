import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/claude/fable-5-best-practices/page";
import { navLinks } from "@/components/site/nav-links";
import { pageRegistry } from "@/lib/page-registry";
import { findNavLeaf } from "@/tests/helpers/nav";
import styles from "./page.module.css";

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
    expect(footer?.textContent).toContain("2026年7月26日時点の公式ドキュメント");
  });

  it("uses the latest timeline date and current model comparison", () => {
    const { container } = render(<Page />);
    const sidebarMeta = container.querySelector(`.${styles.sidebarMeta}`);
    expect(sidebarMeta?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "最終更新: 2026-10-22対象: Claude Code 中〜上級者"
    );
    expect(container.querySelector(`.${styles.heroMeta}`)?.textContent).toContain("2026年7月26日");
    expect(container.textContent).toContain("Claude Opus 5 / Opus 4.8");
  });

  it("Fable 5.1 への互換性はプロンプティングの考え方に限定し、API 連携は移行チェックを求める", () => {
    const { container } = render(<Page />);
    const paragraph = Array.from(container.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("2026年10月追記")
    );
    expect(paragraph?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "2026年10月追記: 2026年9月に後継の Claude Fable 5.1（claude-fable-5-1、入力 $10 / 出力 $50 per 1M tokens、1M コンテキスト）と Mythos 5.1 が登場し、Fable 5 はレガシーモデルとなった。あわせて Opus 5.5 / Sonnet 5.5 / Haiku 5.5 も提供が始まっている。本ガイドのプロンプティングの考え方（ゴール・境界・検証基準を渡す）は Fable 5.1 にもそのまま適用できるが、既存の API 連携は次の移行チェックを済ませるまでそのままでは動かない場合がある。新規採用時のモデル ID・価格は公式の Models overview で確認すること。"
    );
  });

  it("API 移行チェックで強制 tool_choice の制限と thinking ブロックの例外を示す", () => {
    const { container } = render(<Page />);
    const paragraph = Array.from(container.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("API 連携の移行チェック")
    );
    expect(paragraph?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "API 連携の移行チェック: Fable 5.1 では強制ツール使用（tool_choice の any / tool）が 400 エラーになるため、auto とプロンプトでのツール指定、strict: true、または構造化出力に置き換える。また thinking ブロックは生成したモデルに紐づく。Claude Mythos 5.1 は、それを生成した会話の中であれば Fable 5.1 の thinking ブロックを読めるが、それ以外のモデル(評価モデルなど)へ渡すクロスモデル評価フローでは、受け取ったモデル側でブロックが無視される。また過去のターンを編集して再送すると、それ以降の thinking ブロックが無効になる(2026年8月31日以降に作成されたアカウントでは編集済み履歴が 400 エラーになる)。会話履歴は追記のみで扱う設計にし、移行時は公式の Migration guide の Fable 5.1 の項を確認すること。"
    );
  });

  it("opens and closes the mobile sidebar from an accessible button", () => {
    const { container } = render(<Page />);
    const sidebar = container.querySelector("aside");
    const toggle = screen.getByRole("button", { name: "目次を開く" });

    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    fireEvent.click(toggle);
    expect(sidebar).toHaveClass(styles.sidebarOpen);
    const closeToggle = screen.getByRole("button", { name: "目次を閉じる" });
    expect(closeToggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(closeToggle);
    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    expect(screen.getByRole("button", { name: "目次を開く" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("タイムラインの凡例と順序付きリストを正しいリスト構造で描画する", () => {
    const { container } = render(<Page />);
    const legend = container.querySelector(`ul.${styles.timelineLegend}`);
    const timeline = container.querySelector(`ol.${styles.timeline}`);
    const timelineWrap = timeline?.parentElement;

    expect(legend).not.toBeNull();
    expect(legend?.querySelectorAll(":scope > li")).toHaveLength(5);
    expect(timelineWrap).toHaveClass(styles.timelineWrap);
    expect(timelineWrap?.querySelector(`:scope > .${styles.timelineTrack}`)).not.toBeNull();
    expect(timeline?.querySelector(`:scope > .${styles.timelineTrack}`)).toBeNull();
    expect(Array.from(timeline?.children ?? []).every((child) => child.tagName === "LI")).toBe(
      true
    );
  });
});

describe("/claude/fable-5-best-practices - registration", () => {
  it("is reachable from the site navigation", () => {
    const link = findNavLeaf(navLinks, "/claude/fable-5-best-practices");
    expect(link).toBeDefined();
    expect(link?.name).toBe("Fable 5 Best Practices");
  });

  it("uses the latest timeline date in the page registry", () => {
    const entry = pageRegistry.find(({ slug }) => slug === "/claude/fable-5-best-practices");
    expect(entry?.lastReviewed).toBe("2026-10-22");
  });
});
