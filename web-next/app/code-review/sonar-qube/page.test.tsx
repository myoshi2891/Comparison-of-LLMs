import { render } from "@testing-library/react";
import type { Metadata } from "next";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("/code-review/sonar-qube", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "SonarQubeコードレビュー実践ガイド中級者〜上級者のためのベストプラクティス"
    );
  });

  it("主要セクション h2 が 16 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(16);
  });

  it("外部リンクはすべて target と rel が正しい", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      const rel = link.getAttribute("rel");
      expect(rel).toBeTruthy();
      expect(rel?.includes("noopener")).toBe(true);
      expect(rel?.includes("noreferrer")).toBe(true);
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

  it("コードブロック（code または pre）が存在する", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre, code");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });
});

describe("/code-review/sonar-qube metadata", () => {
  it("metadata が export されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("SonarQube");
  });

  it("description が設定されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.description).toBe("string");
    expect((meta.description ?? "").length).toBeGreaterThan(20);
  });
});
