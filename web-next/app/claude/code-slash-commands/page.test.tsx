import { act, render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Page from "./page";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof IntersectionObserver;
});

describe("/claude/code-slash-commands", () => {
  it("h1 の見出しテキストが一致する", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent?.trim().replace(/\s+/g, " ")).toBe(
      "Claude Code / スラッシュコマンド完全ガイド"
    );
  });

  it("主要セクション h2 が 13 個ある", () => {
    const { container } = render(<Page />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s).toHaveLength(13);
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
    const internalLinks = Array.from(container.querySelectorAll('a[href^="#"], a[href^="/"]'));
    for (const link of internalLinks) {
      const href = link.getAttribute("href");
      if (href) {
        expect(href).not.toContain(".html");
      }
    }
  });

  it("コードブロック（codeBlock または shiki）が存在する", () => {
    const { container } = render(<Page />);
    const codeBlocks = container.querySelectorAll("pre, code");
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  it("/model のエイリアス説明は固定バージョンを示さず、ピッカー説明は維持する", () => {
    const { container } = render(<Page />);
    const pre = Array.from(container.querySelectorAll("pre")).find((p) =>
      p.textContent?.includes("/model opus")
    );
    const lines = (pre?.textContent ?? "").split("\n").map((l) => l.trim().replace(/\s+/g, " "));
    expect(lines).toEqual([
      "/model opus # Claude Opus（解決先のバージョンはプロバイダーにより異なる）— 高精度・複雑タスク向け",
      "/model sonnet # Claude Sonnet（解決先のバージョンはプロバイダーにより異なる）— バランス型・日常タスク向け",
      "/model haiku # Claude Haiku（解決先のバージョンはプロバイダーにより異なる）— 高速・軽量タスク向け",
      "/model # モデルピッカー UI を開く",
    ]);
  });

  it("xhigh はモデル推奨ではなく、測定で効果が確認できた場合に使うと説明する", () => {
    const { container } = render(<Page />);
    const row = Array.from(container.querySelectorAll("tr")).find(
      (tr) => tr.querySelector("td code")?.textContent === "xhigh"
    );
    const cells = Array.from(row?.querySelectorAll("td") ?? []).map((td) => td.textContent?.trim());
    expect(cells).toEqual([
      "xhigh",
      "最高レベル（測定で効果が確認できた場合のみ）",
      "難解なバグ修正、アーキテクチャ設計",
    ]);
  });

  it("/effort 使用例の表示とコピー内容が一致し、Opus 5.5 推奨を含まない", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const { container } = render(<Page />);
    const block = Array.from(container.querySelectorAll("pre")).find((p) =>
      p.textContent?.includes("/effort xhigh")
    );
    const lines = (block?.textContent ?? "").split("\n").map((l) => l.trim().replace(/\s+/g, " "));
    const expected = [
      "/effort high # 高精度推論に設定",
      "/effort xhigh # 最高精度（測定で効果が確認できた場合のみ）",
      "/effort # インタラクティブスライダーを開く",
      "/fast on # 素早い・簡潔な回答に切り替え",
      "/fast off # 通常モードに戻す",
    ];
    expect(lines).toEqual(expected);

    const button = block?.parentElement?.querySelector("button");
    await act(async () => {
      button?.click();
    });
    const copied = String(writeText.mock.calls[0]?.[0] ?? "")
      .split("\n")
      .map((l) => l.trim().replace(/\s+/g, " "));
    expect(copied).toEqual(expected);
  });
});
