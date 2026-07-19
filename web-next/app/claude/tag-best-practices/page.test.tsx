import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Page from "./page";
import { findBySlug } from "../../../lib/page-registry";

// Stub IntersectionObserver for testing in jsdom environment
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;

// Mermaidコンポーネントをモック
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

test("Claude Tag Best Practices page contract tests", () => {
  const { container } = render(<Page />);

  // 1. タイトルの検証
  const heading = container.querySelector("h1");
  expect(heading).toBeTruthy();
  expect(heading?.textContent).toContain("Claude Tag 活用ガイド");

  // 2. 主要セクション数（<h2> の数）
  const h2List = container.querySelectorAll("h2");
  expect(h2List.length).toBe(15);

  // 3. 外部リンクのセキュリティ検証
  const links = container.querySelectorAll("a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  // 4. 内部リンクの検証 (.html なし)
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("#")) {
      expect(href.endsWith(".html")).toBe(false);
    }
  });

  // 5. ページレジストリ登録の検証
  const registryEntry = findBySlug("/claude/tag-best-practices");
  expect(registryEntry).toBeDefined();
  expect(registryEntry?.title).toBe("Tag Best Practices");
  expect(registryEntry?.group).toBe("Providers");
  expect(registryEntry?.category).toBe("Claude");
});
