import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/codex/openai-codex-guide", () => {
  it("h1 に OpenAI Codex が含まれる", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toContain("OpenAI Codex");
  });

  it("h2 が 9 個存在する", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2")).toHaveLength(9);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const extLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(extLinks.length).toBeGreaterThan(0);
    for (const a of extLinks) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクが .html を含まない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a:not([target])"));
    for (const a of internalLinks) {
      expect(a.getAttribute("href")).not.toContain(".html");
    }
  });

  it("コードブロックが存在する", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre, code");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  it("metadata.title と metadata.description が定義されている", () => {
    expect(metadata.title).toBeTruthy();
    expect(typeof metadata.title).toBe("string");
    expect(metadata.description).toBeTruthy();
    expect(typeof metadata.description).toBe("string");
  });
});
