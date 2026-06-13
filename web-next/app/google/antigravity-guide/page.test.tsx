import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

describe("/google/antigravity-guide", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe(
      "AI仕様駆動開発におけるGoogle Antigravityベストプラクティス完全ガイド"
    );
  });

  it("主要セクション h2 が 10 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(10);
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
    const internalLinks = Array.from(container.querySelectorAll('a[href^="/"]'));
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("コードブロック（codeBody）が少なくとも 1 つ存在し、span 子要素を持つ", () => {
    const { container } = render(<Page />);
    const codeBodyDivs = container.querySelectorAll(`.${styles.codeBody}`);
    expect(codeBodyDivs.length).toBeGreaterThan(0);
    const firstBody = codeBodyDivs[0];
    expect(firstBody?.querySelectorAll("span").length).toBeGreaterThan(0);
  });

  it("metadata の title と description が定義されている", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toContain("Google Antigravity");
    expect(title).toContain("AI仕様駆動開発");
    expect(title).toContain("ベストプラクティス完全ガイド");
    expect(metadata.description).toBeDefined();
  });

  it("metadata が Google I/O 2026 アナウンス（Antigravity 2.0 / Gemini 3.5 Flash）を反映している", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toMatch(/Antigravity 2\.0/);
    expect(title).toMatch(/Gemini 3\.5 Flash/);
    expect(metadata.description as string).toMatch(/Antigravity 2\.0/);
    expect(metadata.description as string).toMatch(/2026-05-19/);
  });

  it("本文に Antigravity 2.0 / Gemini 3.5 Flash / I/O 2026 / Antigravity CLI が含まれる", () => {
    const { container } = render(<Page />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/Gemini 3\.5 Flash/);
    expect(text).toMatch(/Antigravity 2\.0/);
    expect(text).toMatch(/2026-05-19/);
    expect(text).toMatch(/Antigravity CLI/);
    expect(text).toMatch(/Managed Agents/);
  });

  it("SOURCES に I/O 2026 関連の新規 3 URL が含まれる", () => {
    const { container } = render(<Page />);
    const sources = container.querySelector("#sources");
    expect(sources).not.toBeNull();
    const html = sources?.innerHTML ?? "";
    const requiredUrlFragments = [
      "blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights",
      "developers.googleblog.com/all-the-news-from-the-google-io-2026-developer-keynote",
      "developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli",
    ];
    for (const fragment of requiredUrlFragments) {
      expect(html).toContain(fragment);
    }
  });
});
