import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("/google/antigravity-slash-commands-guide", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe("スラッシュコマンド完全ガイド");
  });

  it("主要セクション h2 が 15 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(15);
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

  it("metadata の title と description が定義されている", () => {
    const title =
      typeof metadata.title === "string"
        ? metadata.title
        : (metadata.title as { default?: string } | undefined)?.default;
    expect(title).toContain("スラッシュコマンド");
    expect(metadata.description).toBeDefined();
  });

  it("参考リンクの最新版ラベルは v0.66.0 で、検証基準は v0.44.1 のまま区別する", () => {
    const { container } = render(<Page />);
    const card = container.querySelector(
      'a[href="https://github.com/google-gemini/gemini-cli/releases/tag/v0.44.1"]'
    );
    expect(card?.querySelector(".ref-title")?.textContent).toBe(
      "Gemini CLI v0.44.1 リリース — 本ガイドの基準バージョン（2026年10月時点の最新は v0.66.0）"
    );
  });

  it("Plan Mode の起動例とカスタムコマンドの引数は v0.44.1 の書式を使う", () => {
    const { container } = render(<Page />);
    const blocks = Array.from(container.querySelectorAll("pre.code-body")).map(
      (pre) => pre.textContent ?? ""
    );
    const planBlocks = blocks.filter((text) => text.includes("Plan Mode で開始する"));
    expect(planBlocks).toEqual([
      "# Gemini CLI v0.44.1: 起動時に Plan Mode で開始する\ngemini --approval-mode=plan\n\n# 現在のセッションで Plan Mode に入る\n/plan\n# または Shift+Tab で承認モードを切り替え\n\n# /settings で利用可否を変えた場合は再起動が必要",
      "# Antigravity CLI 1.1.0 以降: 起動時に Plan Mode で開始する\nagy --mode=plan",
    ]);
    const tomlPrompts = blocks
      .filter((text) => text.startsWith("description = ") && text.includes("{{args}}"))
      .map((text) => text.slice(text.indexOf("prompt = ")));
    expect(tomlPrompts).toEqual([
      'prompt = "以下の問題に対するコード修正案を提供してください: {{args}}"',
      'prompt = """\n以下のコードをレビューしてください: {{args}}\n以下のベストプラクティスに従ってレビューすること:\n@{docs/best-practices.md}\n"""',
    ]);
    expect(blocks.filter((text) => /gemini --plan\b|<args>/.test(text))).toEqual([]);
  });

  it("フッターは本文の基準日と最新版の確認時期を区別して表示する", () => {
    const { container } = render(<Page />);
    const paragraphs = Array.from(container.querySelectorAll("footer p"));
    expect(paragraphs[1]?.textContent?.replace(/\u00a0/g, " ")).toBe(
      "本文の基準日: 2026年5月31日（最新バージョンの確認: 2026年10月） | 公式ドキュメント ↗"
    );
  });
  it("Plan Mode の定義は既定動作とポリシー依存を明記する", () => {
    const { container } = render(<Page />);
    const definition = Array.from(container.querySelectorAll("p")).find((p) =>
      p.textContent?.startsWith("定義: Gemini CLI の Plan Mode")
    );
    expect(definition?.textContent?.replace(/\s+/g, " ")).toBe(
      "定義: Gemini CLI の Plan Mode は、既定では read-only で動作し、コードを変更せずに変更計画を立案するモードです。ただし実際の動作は有効なポリシーに従います。ポリシーで許可されたシェルコマンドがコードを変更する可能性もあるため、適用中のポリシーを確認してください。"
    );
  });

  it("Plan Mode の可否表は Gemini CLI と Antigravity CLI を区別する", () => {
    const { container } = render(<Page />);
    const table = Array.from(container.querySelectorAll("table")).find((t) =>
      t.textContent?.includes("ファイルの書き込み・変更")
    );
    const headers = Array.from(table?.querySelectorAll("thead th") ?? []).map(
      (th) => th.textContent
    );
    expect(headers).toEqual([
      "操作",
      "Gemini CLI Plan Mode",
      "Antigravity CLI --mode=plan",
      "通常モード",
    ]);
    const rows = Array.from(table?.querySelectorAll("tbody tr") ?? []).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.textContent)
    );
    expect(rows).toEqual([
      ["ファイルの読み取り・分析", "できる", "できる", "できる"],
      ["コードの計画立案・提案", "できる", "できる", "できる"],
      ["ファイルの書き込み・変更", "既定ではできない（ポリシー次第）", "権限次第", "できる"],
      ["シェルコマンドの実行", "ポリシーで許可されたもののみ", "権限次第", "できる"],
    ]);
  });

  it("コマンド選択フローの計画立案ノードは Antigravity CLI が read-only を強制しないことを示す", () => {
    const { getAllByTestId } = render(<Page />);
    const chart = getAllByTestId("mermaid")
      .map((el) => el.textContent ?? "")
      .find((text) => text.includes('Q7["コードを変えず計画だけ立てたい"]'));
    const r7Lines = (chart ?? "").split("\n").filter((line) => line.startsWith("Q7 --> R7["));
    expect(r7Lines).toEqual([
      'Q7 --> R7["Gemini CLI: Plan Mode を有効化<br />既定は read-only（ポリシー次第）<br />Antigravity CLI: agy --mode=plan<br />read-only は強制されない<br />使う前に権限設定を確認"]',
    ]);
  });
});
