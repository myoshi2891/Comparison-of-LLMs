import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("OpenAI Harness Engineering Guide", () => {
  it("renders the correct title (<h1>)", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("ハーネスエンジニアリング");
    expect(h1?.textContent).toContain("完全ガイド");
  });

  it("renders exactly 11 major sections (<h2>)", () => {
    const { container } = render(<Page />);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(11);

    const expectedTitles = [
      "ハーネスエンジニアリングとは何か？",
      "なぜ必要なのか？",
      "OpenAI Evals フレームワーク全体像",
      "5ステップでゼロから始める",
      "Eval の3大パターン",
      "ハーネス設計のベストプラクティス",
      "AGENTS.md / TEST.md とハーネスの統合",
      "CI/CD パイプラインへの組み込み",
      "上級テクニック",
      "よくある落とし穴と対策",
      "参考ソース一覧",
    ];

    expectedTitles.forEach((title, index) => {
      expect(h2Elements[index]?.textContent).toContain(title);
    });
  });

  it('ensures all external links have target="_blank" and rel="noopener noreferrer"', () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a")).filter((a) =>
      a.getAttribute("href")?.startsWith("http")
    );

    expect(externalLinks.length).toBeGreaterThan(0);
    externalLinks.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("rel")).toContain("noreferrer");
    });
  });

  it("ensures all internal links use clean URLs (no .html)", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && !href.startsWith("http") && !href.startsWith("#");
    });

    internalLinks.forEach((a) => {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    });
  });

  it("renders code blocks with appropriate structure", () => {
    const { container } = render(<Page />);
    // CSS modules transform class names, so we check if any class contains 'codeWrap'
    const codeBlocks = Array.from(container.querySelectorAll("div")).filter((el) =>
      el.className?.includes("codeWrap")
    );
    expect(codeBlocks.length).toBeGreaterThan(0);
  });
});
