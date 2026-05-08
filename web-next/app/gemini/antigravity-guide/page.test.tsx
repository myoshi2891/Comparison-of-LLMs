import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

describe("/gemini/antigravity-guide", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe(
      "AI仕様駆動開発におけるGoogle Antigravityベストプラクティス完全ガイド"
    );
  });

  it("主要セクション h2 が 10 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(10);
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

  it("コードブロック（codeBody）が少なくとも 1 つ存在し、span 子要素を持つ", () => {
    const { container } = render(<Page />);
    const codeBodyDivs = container.querySelectorAll(`.${styles.codeBody}`);
    expect(codeBodyDivs.length).toBeGreaterThan(0);
    const firstBody = codeBodyDivs[0];
    expect(firstBody?.querySelectorAll("span").length).toBeGreaterThan(0);
  });

  it("metadata の title と description が定義されている", () => {
    expect(metadata.title).toBe("Google Antigravity — AI仕様駆動開発 ベストプラクティス完全ガイド");
    expect(metadata.description).toBeDefined();
  });
});
