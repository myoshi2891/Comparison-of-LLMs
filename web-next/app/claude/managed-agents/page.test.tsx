import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page, { metadata } from "./page";

describe("/claude/managed-agents 契約テスト", () => {
  it("metadata.title が非空文字列である", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
  });

  it("metadata.description が非空文字列である", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("h1 に Claude Managed Agents が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("Claude Managed Agents");
  });

  it("h1 に 完全ガイド が含まれる", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toContain("完全ガイド");
  });

  it("h2 が 13 本（セクション数と一致）", () => {
    const { container } = render(<Page />);
    expect(container.querySelectorAll("h2").length).toBe(13);
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
    const internal = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").startsWith("/")
    );
    for (const a of internal) {
      expect(a.getAttribute("href")).not.toMatch(/\.html$/);
    }
  });
  it("権限ポリシーの例は always_ask / auto の承認待ち、stream 例の制約、always_allow の信頼境界を明記する", () => {
    const { container } = render(<Page />);
    const section = Array.from(container.querySelectorAll("section")).find(
      (el) => el.querySelector("h2")?.textContent === "権限ポリシー"
    );
    const note = section?.lastElementChild;
    expect(note?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "always_ask を選んだ場合や auto が ask と判定した場合、セッションはツール実行の直前で一時停止し、user.tool_confirmation イベントによる承認・拒否を待ちます。セクション5の sessions.stream() の例はイベントを表示するだけで確認イベントを返さないため、always_ask / auto と組み合わせると停止したままになります。この例では always_allow を使いますが、always_allow では bash や write_file も確認なしで実行されるため、信頼できる環境でファイル書き込みを伴わないストリーム例に限って使用してください。承認を挟んで再開する場合は always_ask / auto を選び、user.tool_confirmation を送信してセッションを再開する処理を実装してください（Events and streaming の公式ドキュメントを参照）。"
    );
  });
});
