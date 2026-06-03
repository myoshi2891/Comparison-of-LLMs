import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRICE_CHECKED_AT, TOOLS } from "./constants";
import Page from "./page";

describe("/code-review/tool-pricing", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.trim().replace(/\s+/g, " ")).toBe("AI Code Review Tools 料金比較");
  });

  it("主要セクション h2 が 5 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(5);
  });

  it("ツールカードが TOOLS の件数ぶん存在する", () => {
    const { container } = render(<Page />);
    const cards = container.querySelectorAll("[data-tool-card]");
    expect(cards).toHaveLength(TOOLS.length);
  });

  it("各ツールに価格出典リンクが存在する", () => {
    const { container } = render(<Page />);
    const sourceLinks = container.querySelectorAll("[data-source-link]");
    expect(sourceLinks.length).toBeGreaterThanOrEqual(TOOLS.length);
  });

  it("ページに最終確認年月 (PRICE_CHECKED_AT) が表示される", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain(PRICE_CHECKED_AT);
  });

  it("外部リンクはすべて target と rel が正しい", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll('a[href^="#"], a[href^="/"]'));
    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      if (href) {
        expect(href).not.toContain(".html");
      }
    }
  });
});
