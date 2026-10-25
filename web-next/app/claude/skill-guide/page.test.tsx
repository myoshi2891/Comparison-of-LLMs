import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram" data-chart={chart} />
  ),
}));

describe("/claude/skill-guide 契約テスト", () => {
  it("metadata.title が非空文字列である", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に SKILL.md が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("SKILL.md");
  });

  it("h1 に 完全解説ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("完全解説ガイド");
  });

  it("h2 が 16 本（サイドバー 1 + セクション 15）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(16);
  });

  it("外部リンクに target=_blank と rel=noopener noreferrer が付与されている", () => {
    const { container } = render(<Page />);
    const external = Array.from(container.querySelectorAll('a[href^="http"]'));
    for (const a of external) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("内部リンク（/ 始まり）に .html 拡張子がない", () => {
    const { container } = render(<Page />);
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) => {
      const href = a.getAttribute("href") ?? "";
      return href.startsWith("/") && !href.startsWith("//");
    });
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });

  it("フロントマター図解は disable-model-invocation の false / true で呼び出し方を示す", () => {
    const { container } = render(<Page />);
    const chart = Array.from(container.querySelectorAll('[data-testid="mermaid-diagram"]'))
      .map((el) => el.getAttribute("data-chart") ?? "")
      .find((c) => c.includes("--- YAMLフロントマター ---"));
    const lines = (chart ?? "").split("\n");
    expect(lines.filter((l) => l.startsWith("FM --> INV"))).toEqual([
      'FM --> INV["⚡ disable-model-invocation\\nfalse: Claude自動判断（デフォルト）\\ntrue: /deploy 等の手動呼び出しのみ実行"]',
    ]);
    expect(chart).not.toMatch(/invocation\\nautomatic|explicit:/);
  });

  it("security-audit 完全版は disable-model-invocation: false で自動呼び出しを維持する", () => {
    const { container } = render(<Page />);
    const block = Array.from(container.querySelectorAll("pre")).find((pre) =>
      pre.textContent?.includes("name: security-audit")
    );
    expect(block?.textContent?.split("\n")).toEqual([
      "---",
      "name: security-audit",
      "description: >",
      "  コードのセキュリティ監査を行う。",
      "  「セキュリティをチェックして」「脆弱性を探して」と言われたときに使用する。",
      "allowed-tools:",
      "  - Read",
      "  - Grep",
      "  - Glob",
      "disable-model-invocation: false",
      "context: fork",
      "agent: general-purpose",
      'version: "1.0.0"',
      "---",
    ]);
  });
});
