import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { findBySlug } from "@/lib/page-registry";
import PageComponent from "./page";

const Page = PageComponent as unknown as () => ReactElement;

// Mock the MermaidDiagram component
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

// Stub IntersectionObserver
class IntersectionObserverStub {
  observe() {
    // stub
  }
  unobserve() {
    // stub
  }
  disconnect() {
    // stub
  }
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

describe("Gemini Enterprise Agent Platform (Intermediate) Page Contract", () => {
  it("should have correct page title", () => {
    render(<Page />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title.textContent).toBe("Gemini Enterprise Agent Platform実践ベストプラクティスガイド");
  });

  it("should have 14 major sections (h2)", () => {
    const { container } = render(<Page />);
    const headings = container.querySelectorAll("h2");
    expect(headings.length).toBe(14);
  });

  it("should have secure external links with target and rel attributes", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && (href.startsWith("http://") || href.startsWith("https://"));
    });

    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("should have clean internal links without .html extension", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && !href.startsWith("http") && !href.startsWith("#");
    });

    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      expect(href).not.toContain(".html");
    }
  });

  it("should have correct language class on code elements", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre code");

    // もしコードブロックがあれば、クラス名に language- が含まれていること
    if (codeBlocks.length > 0) {
      for (const code of Array.from(codeBlocks)) {
        const className = code.className || "";
        expect(className).toMatch(/language-\w+/);
      }
    }
  });

  it("should be registered in the page registry", () => {
    const entry = findBySlug("/google/enterprise-agent-platform-intermediate");
    expect(entry).toBeDefined();
    expect(entry?.title).toBe("Gemini Enterprise Agent Platform (中級)");
    expect(entry?.group).toBe("Providers");
    expect(entry?.category).toBe("Google");
  });
});

describe("Gemini Enterprise Agent Platform (Intermediate) 日付表示", () => {
  const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

  it("サイドバーは基準日 2026-07-17 と Argon 追記の更新日 2026-10-22 を区別して示す", () => {
    const { container } = render(<Page />);
    const tags = Array.from(container.querySelectorAll("[class*='brandTag']")).map((el) =>
      norm(el.textContent)
    );
    expect(tags).toEqual(["2026-07-17 基準 ／ 2026-10-22 更新（Gemini 4 Argon）"]);
  });

  it("ヒーローは基準日とモデル更新日を別々のピルで示す", () => {
    const { container } = render(<Page />);
    const pills = Array.from(container.querySelectorAll("[class*='metaRow'] [class*='pill']")).map(
      (el) => norm(el.textContent)
    );
    expect(pills).toEqual([
      "2026年7月17日時点の情報に基づく",
      "2026年10月22日更新: Gemini 4 Argon（2026年10月13日GA）を追記",
      "Vertex AI からの刷新版",
      "Mermaid 図解 7点",
      "一次情報源・URL付き",
    ]);
  });
});
