import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({
    chart,
    id,
  }: {
    chart: string;
    id?: string;
  }) {
    return (
      <div data-testid="mermaid" id={id}>
        <pre>{chart}</pre>
      </div>
    );
  },
}));

describe("/google/antigravity-guide (Antigravity CLI Complete Guide - 100% Faithful)", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.replace(/\s+/g, " ")).toBe("Antigravity CLI 完全ガイド");
  });

  it("主要セクション h2 が 16 個ある (00〜15)", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(16);
  });

  it("AGENTS.md の説明文に重複助詞がない", () => {
    const { container } = render(<Page />);
    expect(container.textContent).not.toContain("にには");
  });

  it("外部リンクはすべて target='_blank' と rel='noopener noreferrer' が正しい", () => {
    const { container } = render(<Page />);
    const externalLinks = Array.from(
      container.querySelectorAll('a[href^="http"]')
    );
    expect(externalLinks.length).toBeGreaterThan(20);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(
      container.querySelectorAll('a[href^="/"]')
    );
    for (const link of internalLinks) {
      expect(link.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("コードブロック（codeWrap / codeBody）が存在する", () => {
    const { container } = render(<Page />);
    const codeBodies = container.querySelectorAll(`.${styles.codeBody}`);
    expect(codeBodies.length).toBeGreaterThan(10);
  });

  it("テーブル (tableWrap / table) が 15 個以上存在する", () => {
    const { container } = render(<Page />);
    const tables = container.querySelectorAll("table");
    expect(tables.length).toBeGreaterThanOrEqual(15);
  });

  it("metadata の title と description が定義されている", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toContain("Antigravity CLI 完全ガイド");
    expect(metadata.description).toBeDefined();
    expect(metadata.description).toContain("Antigravity CLI");
  });

  it("本文に CLI 関連キーワード・スラッシュコマンドがすべて含まれる", () => {
    const { container } = render(<Page />);
    const text = container.textContent ?? "";
    expect(text).toContain("Antigravity CLI");
    expect(text).toContain("agy");
    expect(text).toContain("Shared Agent Harness");
    expect(text).toContain("settings.json");
    expect(text).toContain("toolPermission");
    expect(text).toContain("/add-dir");
    expect(text).toContain("/agents");
    expect(text).toContain("/statusline");
    expect(text).toContain("/codesearch");
  });

  it("v1.1.5 以降の effort コマンドと起動フラグを案内する", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    expect(source).toContain("全 32 個の中核コマンド");
    expect(source).toContain("/effort [level]");
    expect(source).toContain("--effort");
  });

  it("外部実行例を不変参照と厳密なパッケージバージョンへ固定する", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    expect(source).toContain(
      "4a13498f354f36bc82375a1ab9a920ae364c90c8/scripts/context-bar.sh"
    );
    expect(source).toContain("5c5593e50a09262a80ccfae53b0167467bc7e563556a8a92543c32f796ab5e9c");
    expect(source).toContain("snyk@1.1306.2");
    expect(source).toContain("mcp-remote@0.1.38");
    expect(source).toContain("@playwright/mcp@0.0.78");
    expect(source).toContain("@modelcontextprotocol/server-github@2025.4.8");
  });

  it("MCP 設定と AGENTS.md シンボリックリンクが現行仕様に一致する", () => {
    const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
    expect(source).toContain("~/.gemini/config/mcp_config.json");
    expect(source).toContain('"serverUrl"');
    expect(source).toContain("ln -s CLAUDE.md AGENTS.md");
  });

  it("MermaidDiagram コンポーネントが 8 つ存在する (diag-1 〜 diag-8)", () => {
    const { container } = render(<Page />);
    const mermaids = container.querySelectorAll('[data-testid="mermaid"]');
    expect(mermaids.length).toBe(8);
  });
});
