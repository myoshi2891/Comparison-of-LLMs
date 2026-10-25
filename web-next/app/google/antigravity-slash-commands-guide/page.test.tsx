import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/google/antigravity-slash-commands-guide", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("スラッシュコマンド完全ガイド");
  });

  it("主要セクション h2 が 15 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(15);
  });

  it("外部リンクはすべて target と rel が正しい", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll('a[href^="/"]'));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("metadata の title と description が定義されている", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toContain("スラッシュコマンド");
    expect(metadata.description).toBeDefined();
  });

  it("参考リンクの最新版ラベルは v0.65.0 で、検証基準は v0.44.1 のまま区別する", () => {
    const { container } = render(<Page />);
    const card = container.querySelector(
      'a[href="https://github.com/google-gemini/gemini-cli/releases/tag/v0.44.1"]'
    );
    expect(card?.querySelector(".ref-title")?.textContent).toBe(
      "Gemini CLI v0.44.1 リリース — 本ガイドの基準バージョン（2026年10月時点の最新は v0.65.0。コマンド例は v0.44.1 で検証）"
    );
  });
});
