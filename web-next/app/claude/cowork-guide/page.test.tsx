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
      'a[href="https://techcrunch.com/2026/01/30/anthropic-brings-agentic-plugins-to-cowork/"]'
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
  it("ヒーローの日付ラベルが初版の情報基準日と 10 月 22 日の更新を区別する", () => {
    const { container } = render(<Page />);
    const chips = Array.from(container.querySelectorAll("header span")).map((el) =>
      el.textContent?.trim()
    );
    expect(chips).toEqual([
      "情報基準日：2026年7月26日（初版）",
      "最終更新：2026年10月22日",
      "対象：初めてClaude Coworkに触れる方",
      "形式：全12ステップ + チェックリスト",
    ]);
  });

  it("Step 3 の Global Instructions 設定手順が統合体験と従来のインターフェースの経路を区別する", () => {
    const { container } = render(<Page />);
    const heading = Array.from(container.querySelectorAll("#step3 h3")).find(
      (el) => el.textContent === "Global Instructions（全セッション共通の指示）"
    );
    const list = heading?.nextElementSibling?.nextElementSibling;
    const note = list?.nextElementSibling;

    expect(list?.tagName).toBe("OL");
    expect(Array.from(list?.querySelectorAll("li") ?? []).map((li) => li.textContent)).toEqual([
      "統合体験で Settings > Account が表示される場合：「Instructions for Claude」欄に指示文を入力し、画面に表示される操作に従って保存する",
      "統合体験で Settings > Your Claude が表示される場合：その画面の「Instructions」欄に指示文を入力し、画面に表示される操作に従って保存する",
      "従来のインターフェースの場合：Settings > Cowork を開き、「Global instructions」の横にある「Edit」をクリックして指示文を入力し「Save」をクリック",
    ]);
    expect(note?.textContent).toBe(
      "統合体験では、ここに書いた指示はCoworkタスクに限らずすべての会話に適用されます。"
    );
  });
});
