import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import PageComponent, { metadata as rawMetadata } from "@/app/claude/skills-sh/page";
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

describe("/claude/skills-sh - metadata", () => {
  it("exports a metadata object with title containing 'skills.sh'", () => {
    expect(metadata).toBeDefined();
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/skills\.sh/);
  });

  it("exports a metadata object with non-empty description", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});

describe("/claude/skills-sh - page structure", () => {
  it("renders an <h1> containing 'skills.sh 完全ガイド'", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent?.replace(/\s+/g, "")).toContain("skills.sh完全ガイド");
  });

  it("renders <h2> headings for ch1 to ch12", () => {
    const { container } = render(<Page />);
    const h2s = Array.from(container.querySelectorAll("h2"));
    expect(h2s).toHaveLength(12);
    expect(h2s[0].textContent).toContain("skills.sh とは何か");
    expect(h2s[1].textContent).toContain("そもそも「Agent Skills」とは何か");
    expect(h2s[2].textContent).toContain("SKILL.md のフォーマットを理解する");
    expect(h2s[3].textContent).toContain("skills.sh エコシステムの全体像");
    expect(h2s[4].textContent).toContain("CLI のインストールと使い方");
    expect(h2s[5].textContent).toContain("主要スキル カテゴリ別マップ");
    expect(h2s[6].textContent).toContain("主要スキル 徹底解説");
    expect(h2s[7].textContent).toContain("対応しているAIエージェント");
    expect(h2s[8].textContent).toContain("セキュリティと監査 of 仕組み" || "セキュリティと監査の仕組み"); // HTML contains "セキュリティと監査の仕組み"
    expect(h2s[9].textContent).toContain("自分だけのスキルを作る");
    expect(h2s[10].textContent).toContain("まとめ");
    expect(h2s[11].textContent).toContain("参考URL一覧");
  });

  it("renders footer containing the base date text", () => {
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

describe("/claude/skills-sh - registration", () => {
  it("is registered in nav-links.ts under Claude category", () => {
    const claudeGroup = navLinks.find(g => g.name === "Claude");
    expect(claudeGroup).toBeDefined();
    if (claudeGroup && "children" in claudeGroup) {
      const link = claudeGroup.children.find(c => c.href === "/claude/skills-sh");
      expect(link).toBeDefined();
      expect(link?.name).toBe("skills.sh Guide");
    }
  });
});
