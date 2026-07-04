import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Page, { metadata } from "./page";

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
  expect(metadata.title).toBe("Cursor 完全ガイド ― 初学者のためのステップバイステップ・ベストプラクティス");
  expect(metadata.description).toBe(
    "初学者のためのCursor完全ガイド。AIオートコンプリート(Tab補完)、自律Agentモード、コンテキスト管理(@ Symbols)、カスタムルール/サブエージェント設定、MCP連携等の使い方とベストプラクティスを解説。"
  );
});
