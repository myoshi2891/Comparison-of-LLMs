import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import Page, { metadata } from "./page";

test("Vercel Sandbox Page Contract Tests", () => {
  const { container } = render(<Page />);

  // 1. Title test
  const title = container.querySelector("h1");
  expect(title).not.toBeNull();
  expect(title?.textContent).toContain("Vercel Sandbox");
  expect(title?.textContent).toContain("完全入門ガイド");

  // 2. Sections test (h2 count should be 15)
  const h2Elements = container.querySelectorAll("h2");
  expect(h2Elements.length).toBe(15);

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

  // 5. Code block class test
  const codeBlocks = container.querySelectorAll("pre code");
  for (const code of codeBlocks) {
    const className = code.getAttribute("class");
    expect(className).not.toBeNull();
    expect(className).toMatch(/language-.+/);
  }

  // 6. Metadata test
  expect(metadata).toBeDefined();
  expect(metadata.title).toBe("Vercel Sandbox 完全入門ガイド 2026");
  expect(metadata.description).toBe(
    "信頼できないコードをミリ秒単位で安全に実行できる Linux マイクロVM。初学者でもわかるステップバイステップ解説＋ベストプラクティス付き。"
  );
});
