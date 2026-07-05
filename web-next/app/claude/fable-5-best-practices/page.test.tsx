import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/claude/fable-5-best-practices/page";

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

  it("renders <h2> headings for ch1 to ch10", () => {
    const { container } = render(<Page />);
    const h2s = Array.from(container.querySelectorAll("h2"));
    expect(h2s).toHaveLength(10);
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
  });
});
