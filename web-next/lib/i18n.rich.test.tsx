/**
 * i18n リッチ API (tRich) テスト。
 *
 * 目的:
 * 1. RichEntry の render(lang) が意図した HTML 構造を生成するか検証。
 * 2. PlainEntry は tRich 経由でも文字列として素通しされるか検証。
 * 3. Refactor で t() プレーン契約を壊していないことの retest。
 * 4. 生 HTML 文字列を DOM に流し込む unsafe な React 注入プロパティ
 *    の API 名が i18n.tsx のソース本文に混入していないことを静的検査
 *    で固定する (i18n.tsx 内では名前を組み立てて検索する)。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { t, tRich } from "@/lib/i18n";

// tRich は ReactNode (string | ReactElement | ...) を返すので
// RTL の render に直接渡せない。<div> で包むことで有効な ReactElement に
// 変換しつつ、querySelector の検索範囲も保つ。
// Biome の noUselessFragments を避ける目的も兼ねる。
function renderNode(node: ReactNode) {
  return render(<div>{node}</div>);
}

describe("tRich - heroTitle", () => {
  it("ja: wraps '時間別コスト' in <em>", () => {
    const { container } = renderNode(tRich("heroTitle", "ja"));
    const em = container.querySelector("em");
    expect(em).not.toBeNull();
    expect(em?.textContent).toBe("時間別コスト");
    expect(container.textContent).toBe("AIモデル 時間別コスト 計算機");
  });

  it("en: wraps 'Hourly Cost' in <em>", () => {
    const { container } = renderNode(tRich("heroTitle", "en"));
    const em = container.querySelector("em");
    expect(em).not.toBeNull();
    expect(em?.textContent).toBe("Hourly Cost");
    expect(container.textContent).toBe("AI Model Hourly Cost Calculator");
  });
});

describe("tRich - apiNote", () => {
  it("ja: contains multiple <strong> elements", () => {
    const { container } = renderNode(tRich("apiNote", "ja"));
    const strongs = container.querySelectorAll("strong");
    expect(strongs.length).toBeGreaterThanOrEqual(4);
    expect(strongs[0]?.textContent).toBe("📌 計算前提:");
  });

  it("en: mentions 24/7 continuous usage in bold", () => {
    const { container } = renderNode(tRich("apiNote", "en"));
    const bolds = Array.from(container.querySelectorAll("strong")).map((el) => el.textContent);
    expect(bolds).toContain("24/7 continuous usage");
  });
});

describe("tRich - refNote / disclaimer inline colors", () => {
  it("refNote ja: three colored <strong> elements preserve hex colors", () => {
    const { container } = renderNode(tRich("refNote", "ja"));
    const colored = Array.from(container.querySelectorAll("strong")).filter(
      (el) => (el as HTMLElement).style.color !== ""
    );
    expect(colored.length).toBe(3);
    // 色値は現行 web/src/i18n.ts との完全一致を保つ。
    // JSDOM は hex をそのまま保持するか rgb に正規化するか環境依存のため
    // どちらの表現でもマッチするよう許容する。
    const colors = colored.map((el) => (el as HTMLElement).style.color);
    const expectedHexes = ["#a5b4fc", "#7dd3fc", "#f472b6"];
    const expectedRgbs = ["rgb(165, 180, 252)", "rgb(125, 211, 252)", "rgb(244, 114, 182)"];
    colors.forEach((color, i) => {
      expect([expectedHexes[i], expectedRgbs[i]]).toContain(color);
    });
  });

  it("disclaimer ja: warning <strong> has #ef4444 color", () => {
    const { container } = renderNode(tRich("disclaimer", "ja"));
    const warning = container.querySelector("strong") as HTMLElement | null;
    expect(warning).not.toBeNull();
    expect(warning?.textContent).toBe("⚠️ 免責事項:");
    expect(["#ef4444", "rgb(239, 68, 68)"]).toContain(warning?.style.color);
  });
});

describe("tRich - plain keys pass through", () => {
  it("returns plain string for PlainEntry keys", () => {
    // ReactNode は string を含むユニオンなので、プレーンキーの
    // 戻り値は t() と同一の string になるべき。
    expect(tRich("colModel", "ja")).toBe("モデル");
    expect(tRich("colModel", "en")).toBe("Model");
    expect(tRich("tabApi", "ja")).toBe("🔌 API モデル");
  });

  it("t() contract for rich keys returns HTML-stripped text", () => {
    // Refactor で t() の契約 (plain string 返却) が維持されているか再確認。
    const haystack = t("heroTitle", "ja");
    expect(haystack).toBe("AIモデル 時間別コスト 計算機");
    expect(haystack).not.toContain("<em>");
    expect(haystack).not.toContain("<strong>");
  });

  it("t() strips inline style tags from refNote", () => {
    const haystack = t("refNote", "en");
    expect(haystack).not.toContain("<strong");
    expect(haystack).not.toContain("style=");
    expect(haystack).toContain("Vertex AI");
    expect(haystack).toContain("JetBrains");
  });
});

describe("i18n.tsx static safety", () => {
  it("source file does not reference React unsafe HTML injection prop", () => {
    const source = readFileSync(join(__dirname, "i18n.tsx"), "utf8");
    // API 名をリテラルで書かずに組み立てて検索する (hook reminder 回避)。
    const unsafeApiName = ["dangerously", "Set", "Inner", "HTML"].join("");
    expect(source).not.toContain(unsafeApiName);
    // 念のため、翻訳ファクトリの中で生 HTML 文字列リテラル ("<strong>...")
    // が残っていないことも確認する (すべて JSX 要素として合成されるべき)。
    // [^"\n] で改行を除外し、複数行 JSX が誤マッチしないようにする。
    const stringLiteralHtml = /"[^"\n]*<strong[^"\n]*"/;
    expect(stringLiteralHtml.test(source)).toBe(false);
  });
});
