import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { beforeAll, describe, expect, it, vi } from "vitest";
// page.tsx は "use client" のため metadata を持てない。Next.js の規約どおり layout.tsx から export する。
import { metadata } from "./layout";
import Page from "./page";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

describe("/code-review/coderabbit-guide", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.trim().replace(/\s+/g, " ")).toBe(
      "Ship Better Code, AI がレビューする時代の実践マスターガイド"
    );
  });

  it("主要セクション h2 が 9 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(9);
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

describe("/code-review/coderabbit-guide metadata", () => {
  it("metadata が export されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("CodeRabbit");
  });

  it("description が設定されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.description).toBe("string");
    expect((meta.description ?? "").length).toBeGreaterThan(20);
  });
});
