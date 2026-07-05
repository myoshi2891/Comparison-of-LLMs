import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/claude/fable-5-best-practices/page";
import { navLinks } from "@/components/site/nav-links";

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
  it("renders an <h1> containing 'Claude Fable 5 実践活用ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.replace(/\s+/g, "")).toContain("ClaudeFable5実践活用ガイド");
  });

  it("renders <h2> headings for ch1 to ch15", () => {
    const { container } = render(<Page />);
    const h2s = Array.from(container.querySelectorAll("h2"));
    expect(h2s).toHaveLength(15);
    expect(h2s[0].textContent).toContain("Claude Fable 5 とは何か");
    expect(h2s[1].textContent).toContain("タイムライン");
    expect(h2s[2].textContent).toContain("安全分類器");
    expect(h2s[3].textContent).toContain("プロンプティング思想");
    expect(h2s[4].textContent).toContain("Effort");
    expect(h2s[5].textContent).toContain("Claude Code");
    expect(h2s[6].textContent).toContain("Loop Engineering");
    expect(h2s[7].textContent).toContain("Unknowns");
    expect(h2s[8].textContent).toContain("検証ループとメモリ");
    expect(h2s[9].textContent).toContain("モデル選定フロー");
    expect(h2s[10].textContent).toContain("よくある落とし穴");
    expect(h2s[11].textContent).toContain("実力");
    expect(h2s[12].textContent).toContain("既知の制限事項");
    expect(h2s[13].textContent).toContain("まとめ");
    expect(h2s[14].textContent).toContain("参考文献");
  });

  it("renders footer containing the base date text", () => {
    const { container } = render(<Page />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("2026年7月4日時点の情報");
  });
});

describe("/claude/fable-5-best-practices - registration", () => {
  it("is registered in nav-links.ts under Claude category", () => {
    const claudeGroup = navLinks.find(g => g.name === "Claude");
    expect(claudeGroup).toBeDefined();
    if (claudeGroup && "children" in claudeGroup) {
      const link = claudeGroup.children.find(c => c.href === "/claude/fable-5-best-practices");
      expect(link).toBeDefined();
      expect(link?.name).toBe("Fable 5 Best Practices");
    }
  });
});
