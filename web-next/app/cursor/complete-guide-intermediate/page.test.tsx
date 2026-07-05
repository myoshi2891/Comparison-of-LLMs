import { render } from "@testing-library/react";
import { beforeAll, expect, test, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

// Mock MermaidDiagram component
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

beforeAll(() => {
  class IntersectionObserverStub {
    // biome-ignore lint/suspicious/noEmptyBlockStatements: test stub
    observe() {
      /* noop */
    }
    // biome-ignore lint/suspicious/noEmptyBlockStatements: test stub
    unobserve() {
      /* noop */
    }
    // biome-ignore lint/suspicious/noEmptyBlockStatements: test stub
    disconnect() {
      /* noop */
    }
  }
  global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
});

test("Cursor Intermediate Guide Page Contract Tests", () => {
  const { container } = render(<Page />);

  // 1. Title test
  const title = container.querySelector("h1");
  expect(title).not.toBeNull();
  expect(title?.textContent).toContain("Cursor 実践ガイド");

  // 2. Sections test (h2 count should be 21 based on chapters)
  const h2Elements = container.querySelectorAll("h2");
  expect(h2Elements.length).toBe(21);

  // 3. External link safety tests
  const links = container.querySelectorAll("a");
  for (const link of links) {
    const href = link.getAttribute("href");
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  }

  // 4. Internal link clean URL tests
  for (const link of links) {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.startsWith("http://") &&
      !href.startsWith("https://") &&
      !href.startsWith("#")
    ) {
      expect(href.endsWith(".html")).toBe(false);
    }
  }

  // 5. Code block class test (should have language-* for custom blocks)
  const codeBlocks = container.querySelectorAll("pre code");
  for (const code of codeBlocks) {
    const className = code.getAttribute("class");
    expect(className).not.toBeNull();
    expect(className).toMatch(/language-.+/);
  }

  // 6. Metadata test
  expect(metadata).toBeDefined();
  expect(metadata.title).toBe("Cursor 実践ガイド ｜ 中〜上級者のためのベストプラクティス集");
  expect(metadata.description).toBe(
    "中〜上級者のためのCursor実践ガイド。アーキテクチャ全体像、Tab補完、インライン編集、Plan Mode、Debug Mode、MCP、Agent Skills、Subagents、Hooks等の各機能の仕組みとベストプラクティスを解説。"
  );

  // 7. TOC Text Content Tests
  const tocLinks = container.querySelectorAll("aside nav a, nav a");
  // We look for navigation links in the sidebar
  const sidebarLinks = Array.from(tocLinks).filter(link => link.classList.contains(styles.tocLink) || link.className.includes("nav-link"));
  
  const expectedTocTexts = [
    "01アーキテクチャ全体像",
    "02Tab 補完",
    "03インライン編集",
    "04Agent モード",
    "05Plan Mode",
    "06Debug Mode",
    "07コンテキスト管理",
    "08Rules",
    "09MCP",
    "10Agent Skills",
    "11Subagents",
    "12Hooks",
    "13Terminal & Sandbox",
    "14Browser ツール",
    "15Worktrees",
    "16Cloud Agents",
    "17Cursor CLI",
    "18Bugbot / Agent Review",
    "19モデル選定とコスト",
    "20ワークフロー統合",
    "21参考文献一覧",
  ];
  
  expect(sidebarLinks.length).toBe(expectedTocTexts.length);
  sidebarLinks.forEach((link, idx) => {
    expect(link.textContent?.trim().replace(/\s+/g, " ")).toBe(expectedTocTexts[idx]);
  });
});
