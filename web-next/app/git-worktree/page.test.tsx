import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

// MermaidDiagram は useEffect 内で mermaid を動的 import するためモック
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("/git-worktree page", () => {
  it("h1 にタイトルテキスト「git worktreeで実現する並列開発ベストプラクティスガイド」が含まれる", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("git worktreeで実現する");
    expect(h1?.textContent).toContain("並列開発ベストプラクティスガイド");
  });

  it("15 個の主要セクション（h2 または section）が存在する", () => {
    const { container } = render(<Page />);
    const h2List = container.querySelectorAll("h2");
    expect(h2List.length).toBeGreaterThanOrEqual(15);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a[target='_blank']"));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクが .html を含まない（clean URL）", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a[href^='/'], a[href^='#']"));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toContain(".html");
    }
  });

  it("metadata が export されており適切なタイトルが含まれる", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("git worktreeで実現する並列開発ベストプラクティスガイド");
  });
});
