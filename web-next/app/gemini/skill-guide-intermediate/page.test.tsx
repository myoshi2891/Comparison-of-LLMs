import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/gemini/skill-guide-intermediate", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("Agent Skills の完全解剖ガイド");
  });

  it("主要セクション h2 が 12 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(12);
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

  it("コードブロックに language-* クラスが付与されている", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre code");
    for (const block of codeBlocks) {
      const hasLanguageClass = Array.from(block.classList).some((c) => c.startsWith("language-"));
      expect(hasLanguageClass).toBe(true);
    }
  });

  it("metadata の title と description が定義されている", () => {
    expect(metadata.title).toBe(
      "SKILL.md 完全解剖ガイド | Gemini CLI v0.34.0 & Antigravity v1.20.3 中級者以上向け"
    );
    expect(metadata.description).toBe(
      "Google Gemini CLI・Antigravity IDE における SKILL.md の設計思想、アーキテクチャ、実装パターン、運用まで。エージェント駆動開発を次のレベルに引き上げるすべての知識を網羅する。"
    );
  });
});
