import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/claude/skill-guide-intermediate 契約テスト", () => {
  it("metadata.title が非空文字列で SKILL.md 実践ガイド を含む", () => {
    expect(typeof metadata.title).toBe("string");
    expect(metadata.title as string).toContain("SKILL.md 実践ガイド");
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に SKILL.md 実践ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("SKILL.md 実践ガイド");
  });

  it("h2 が 17 本（全セクション数と一致）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(17);
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

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").startsWith("/")
    );
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("モバイル目次トグルのラベルと展開状態が同期する", () => {
    const { container } = render(<Page />);
    const toggle = container.querySelector(
      'button[aria-controls="skillSidebar"]'
    ) as HTMLButtonElement;

    expect(toggle.getAttribute("aria-label")).toBe("目次を開く");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-label")).toBe("目次を閉じる");
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("モバイル目次は閉状態で操作不可、開状態で操作可能になる", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");
    expect(css).toMatch(/\.sidebar\s*\{[\s\S]*visibility:\s*hidden/);
    expect(css).toMatch(/\.sidebar\s*\{[\s\S]*pointer-events:\s*none/);
    expect(css).toMatch(/\.sidebarOpen\s*\{[\s\S]*visibility:\s*visible/);
    expect(css).toMatch(/\.sidebarOpen\s*\{[\s\S]*pointer-events:\s*auto/);
  });
});
