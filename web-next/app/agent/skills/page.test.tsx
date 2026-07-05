import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/agent/skills/page";
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

describe("/agent/skills - metadata", () => {
  it("exports a metadata object with title containing 'Agent Skills'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Agent Skills/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/agent/skills - page structure", () => {
  it("renders an <h1> containing 'Agent Skills 完全ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.replace(/\s+/g, "")).toContain("AgentSkills完全ガイド");
  });

  it("renders <h2> headings for ch1 to ch15", () => {
    const { container } = render(<Page />);
    const h2s = Array.from(container.querySelectorAll("h2"));
    expect(h2s).toHaveLength(15);
    expect(h2s[0].textContent).toContain("1. Agent Skillsとは何か");
    expect(h2s[1].textContent).toContain("2. なぜAgent Skillsが必要なのか（4つの課題）");
    expect(h2s[2].textContent).toContain("3. 仕組み：Progressive Disclosure（段階的開示）");
    expect(h2s[3].textContent).toContain("4. SKILL.mdファイルの構造");
    expect(h2s[4].textContent).toContain("5. フォルダ構成：scripts references assets");
    expect(h2s[5].textContent).toContain("6. ステップバイステップ：最初のSkillを作る");
    expect(h2s[6].textContent).toContain("7. どこで使えるか（対応プラットフォーム）");
    expect(h2s[7].textContent).toContain("8. 良いdescriptionの書き方");
    expect(h2s[8].textContent).toContain("9. Skills vs MCP vs AGENTS.md");
    expect(h2s[9].textContent).toContain("10. セキュリティに関する注意点");
    expect(h2s[10].textContent).toContain("11. 評価とベストプラクティス");
    expect(h2s[11].textContent).toContain("12. 実践ハンズオン：commitメッセージ生成Skillを作る");
    expect(h2s[12].textContent).toContain("13. トラブルシューティング");
    expect(h2s[13].textContent).toContain("14. まとめ：5つの黄金律と次のステップ");
    expect(h2s[14].textContent).toContain("15. 参考文献一覧");
  });

  it("renders footer containing target text", () => {
    const { container } = render(<Page />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("2026年7月");
  });

  it("ensures all external links have target='_blank' and rel='noopener noreferrer'", () => {
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll("a"));
    const externalLinks = links.filter((link) => {
      const href = link.getAttribute("href") || "";
      return href.startsWith("http://") || href.startsWith("https://");
    });

    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });
});

describe("/agent/skills - registration", () => {
  it("is registered in nav-links.ts under Agent category", () => {
    const agentGroup = navLinks.find((g) => g.name === "Agent");
    expect(agentGroup).toBeDefined();
    if (agentGroup && "children" in agentGroup) {
      const link = agentGroup.children.find((c) => c.href === "/agent/skills");
      expect(link).toBeDefined();
      expect(link?.name).toBe("Agent Skills Guide");
    }
  });
});
