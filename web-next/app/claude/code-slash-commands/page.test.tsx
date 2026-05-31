import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("/claude/code-slash-commands", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.trim().replace(/\s+/g, " ")).toBe(
      "Claude Code / スラッシュコマンド完全ガイド"
    );
  });

  it("主要セクション h2 が 13 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(13);
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
    const internalLinks = Array.from(container.querySelectorAll('a[href^="#"], a[href^="/"]'));
    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      if (href) {
        expect(href).not.toContain(".html");
      }
    }
  });

  it("コードブロック（codeBlock または shiki）が存在する", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre, code");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });
});
