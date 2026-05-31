import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/claude/managed-agents 契約テスト", () => {
  it("metadata.title が非空文字列である", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に Claude Managed Agents が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("Claude Managed Agents");
  });

  it("h1 に 完全ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("完全ガイド");
  });

  it("h2 が 13 本（セクション数と一致）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(13);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const external = Array.from(container.querySelectorAll('a[href^="http"]'));
    for (const a of external) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").startsWith("/")
    );
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });
});
