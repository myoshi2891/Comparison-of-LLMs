import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("/claude/cowork-guide 契約テスト", () => {
  it("metadata.title が非空文字列である", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に Claude Cowork 実践ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("Claude Cowork 実践ガイド");
  });

  it("h2 が 14 本存在する（STEP 0 〜 11 + チェックリスト + 参考文献）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(14);
  });

  it("Mermaid 図解が 8 点描画される", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll('[data-testid="mermaid"]').length).toBe(8);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const external = Array.from(container.querySelectorAll('a[href^="http"]'));
    expect(external.length).toBeGreaterThan(0);
    for (const a of external) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").startsWith("/")
    );
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("TechCrunchの記事を第三者報道として表示する", () => {
    const { container } = render(<Page />);
    const article = container.querySelector(
      'a[href="https://www.techcrunch.com/2026/01/30/anthropic-brings-agentic-plugins-to-cowork/"]'
    );
    const badge = article?.querySelector("span");

    expect(article).not.toBeNull();
    expect(badge?.textContent).toBe("第三者報道");
  });

  it("無効化されたチェックボックスを隣接する説明文とラベルで関連付ける", () => {
    const { container } = render(<Page />);
    const checkboxes = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="checkbox"][disabled]')
    );

    expect(checkboxes).toHaveLength(14);
    for (const checkbox of checkboxes) {
      const label = checkbox.closest("label");
      expect(label).not.toBeNull();
      expect(label?.textContent?.trim().length).toBeGreaterThan(0);
    }
  });
});
