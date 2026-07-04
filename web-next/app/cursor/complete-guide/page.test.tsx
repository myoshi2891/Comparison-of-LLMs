import { render } from "@testing-library/react";
import { beforeAll, expect, test } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

beforeAll(() => {
  // Minimal stub so `new IntersectionObserver(...)` doesn't throw in jsdom
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

test("Cursor Complete Guide Page Contract Tests", () => {
  const { container } = render(<Page />);

  // 1. Title test
  const title = container.querySelector("h1");
  expect(title).not.toBeNull();
  expect(title?.textContent).toContain("Cursor 完全ガイド");

  // 2. Sections test (h2 count should be 17 based on chapter-titles)
  const h2Elements = container.querySelectorAll("h2");
  expect(h2Elements.length).toBe(17);

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
  expect(metadata.title).toBe(
    "Cursor 完全ガイド ― 初学者のためのステップバイステップ・ベストプラクティス"
  );
  expect(metadata.description).toBe(
    "初学者のためのCursor完全ガイド。AIオートコンプリート(Tab補完)、自律Agentモード、コンテキスト管理(@ Symbols)、カスタムルール/サブエージェント設定、MCP連携等の使い方とベストプラクティスを解説。"
  );

  // 7. TOC Text Content Tests (should match legacy HTML exactly)
  const tocLinks = container.querySelectorAll("aside nav a");
  const expectedTocTexts = [
    "00Cursor とは何か",
    "01インストールとクイックスタート",
    "02Tab補完",
    "03Agentモード",
    "04Inline Edit (Cmd/Ctrl+K)",
    "05コンテキスト管理",
    "06Rules",
    "07Skills / Subagents / Hooks",
    "08Memories",
    "09Model Context Protocol (MCP)",
    "10モデル選択・Max Mode・料金体系",
    "11Background Agents / Cloud Agents",
    "12Bugbot",
    "13セキュリティとガードレール",
    "14キーボードショートカット早見表",
    "15実践ワークフロー",
    "16参考文献",
  ];
  expect(tocLinks.length).toBe(expectedTocTexts.length);
  tocLinks.forEach((link, idx) => {
    expect(link.textContent?.trim()).toBe(expectedTocTexts[idx]);
  });

  // 8. Footer Layout nesting test (footer must not be inside layout container)
  const footer = container.querySelector("footer");
  expect(footer).not.toBeNull();
  const parent = footer?.parentElement;
  expect(parent?.className).not.toContain("layout");

  // 9. Active TOC item test (TOC item active styles verification)
  // 初期レンダリング時に styles.tocLinkActive がいずれかのリンク（マウント後に設定されるはず）に付与されているかアサート
  // 現在は styles.tocLinkActive 自体が page.tsx で使われていないため、以下の要素は null になり、テストが Red（失敗）します。
  const activeLink = container.querySelector(`.${styles.tocLinkActive}`);
  expect(activeLink).not.toBeNull();

  // 10. Code block structure test (codeWrap > codeBar + codeBody > codeLine)
  const codeWraps = container.querySelectorAll(`.${styles.codeWrap}`);
  expect(codeWraps.length).toBeGreaterThan(0);
  for (const wrap of codeWraps) {
    const bar = wrap.querySelector(`.${styles.codeBar}`);
    const body = wrap.querySelector(`.${styles.codeBody}`);
    expect(bar).not.toBeNull();
    expect(body).not.toBeNull();
    // codeBody must have codeLine children
    const lines = body?.querySelectorAll(`.${styles.codeLine}`);
    expect(lines?.length).toBeGreaterThan(0);
  }

  // 11. Footer center alignment class test (pageFooter must have text-align: center set via CSS module)
  const footerEl = container.querySelector(`.${styles.pageFooter}`);
  expect(footerEl).not.toBeNull();
});
