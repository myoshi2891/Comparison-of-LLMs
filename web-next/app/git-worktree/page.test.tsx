import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

// MermaidDiagram は next/dynamic の ssr:false コンポーネントのため、テスト環境でモック
vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

describe("/git-worktree page", () => {
  it("h1 にタイトルテキストが含まれる", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("git worktree");
  });

  it("8 セクション（section タグ）が存在する", () => {
    const { container } = render(<Page />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(8);
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

  it("metadata が export されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("git worktree");
  });
});
