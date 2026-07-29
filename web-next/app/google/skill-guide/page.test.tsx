import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/google/skill-guide 契約テスト", () => {
  it("metadata.title が非空文字列で SKILL.md 実践ベストプラクティスガイド を含む", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
    expect(metadata.title as string).toContain("SKILL.md 実践ベストプラクティスガイド");
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に SKILL.md 実践ベストプラクティスガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("SKILL.md 実践ベストプラクティスガイド");
  });

  it("h2 が 12 本（全12セクションと一致）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(12);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const external = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(external.length).toBeGreaterThan(0);
    for (const a of external) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("sec-12 参考文献セクションが存在し、10 件以上の外部リンクが含まれる", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#sec-12");
    expect(sources).not.toBeNull();
    const externals = sources?.querySelectorAll('a[href^="http"]') ?? [];
    expect(externals.length).toBeGreaterThanOrEqual(10);
  });

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return href.startsWith("/") && !href.startsWith("//");
    });
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });
});

