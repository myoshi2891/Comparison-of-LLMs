import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GrokBestPracticesIntermediatePage, { metadata } from "./page";

describe("GrokBestPracticesIntermediatePage", () => {
  it("exports proper metadata", () => {
    expect(metadata.title).toBe("xAI Grok API 実践ベストプラクティスガイド");
    expect(metadata.description).toContain("モデル選定からエージェント型ツール");
  });

  it("returns JSX element tree when called", () => {
    const jsx = GrokBestPracticesIntermediatePage();
    expect(jsx).toBeDefined();
    expect(jsx.type).toBe("div");
  });

  it("renders 15 section elements", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBe(15);
  });

  it("has target='_blank' and rel='noopener noreferrer' on external links", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const externalLinks = Array.from(container.querySelectorAll("a[href^='http']"));
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      const rel = link.getAttribute("rel") || "";
      expect(rel.includes("noopener")).toBe(true);
      expect(rel.includes("noreferrer")).toBe(true);
    }
  });

  it("本番チェックリストの汎用モデルは grok-4.7 で、grok-4.5 は互換維持用", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const label = Array.from(container.querySelectorAll("label")).find((el) =>
      el.textContent?.includes("モデル選定:")
    );
    expect(label?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "モデル選定: grok-4.7（汎用。既存システムの互換性維持なら grok-4.5）/ grok-4.3（長文脈・低コスト）/ grok-4.20-multi-agent（ディープリサーチ）を用途で使い分けたか"
    );
  });

  it("12.1 Batch API の対象モデル一覧に grok-4.7, grok-4.6, grok-4.5 を含む", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const heading = Array.from(container.querySelectorAll("h3")).find(
      (h) => h.textContent === "12.1 Batch API（非同期処理割引）"
    );
    const paragraph = heading?.nextElementSibling;
    expect(paragraph?.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "リアルタイム性が不要な大量処理は Batch API で最大 20% の割引を受けられます（対象: grok-4.7, grok-4.6, grok-4.5, grok-4.3, grok-4.20-0309-reasoning, grok-4.20-0309-non-reasoning, grok-4.20-multi-agent-0309）。"
    );
  });

  it("7月の基準日を保ちつつ、ページ単位の日付ラベルに10月の更新日を示す", () => {
    const { container } = render(<GrokBestPracticesIntermediatePage />);
    const text = (sel: string) =>
      container.querySelector(sel)?.textContent?.replace(/\s+/g, " ").trim();
    expect(text("#grok-sidebar > div:last-child")).toBe(
      "docs.x.ai / grok.com2026年7月15日時点の情報に基づく（2026年10月24日更新）"
    );
    expect(text("main > div:first-child > div:last-child")).toBe(
      "本ガイドは docs.x.ai および grok.com の公式情報（2026年7月15日時点、2026年10月24日更新）を実際に調査した上で作成しています。xAI のドキュメントは更新頻度が高いため、本番投入前に第15章のリンクから最新版を再確認してください。"
    );
    expect(text("#sec-15 > p")).toBe(
      "本ガイドの内容はすべて以下の xAI 公式ドキュメント（2026年7月時点、2026年10月24日更新）および公式サイトを参照して作成しています。"
    );
    expect(text("#sec-15 footer")).toBe(
      "xAI のドキュメントは頻繁に更新されます。本番導入前には必ず上記リンクから最新版をご確認ください。Generated: 2026年7月15日時点の公開情報に基づく（2026年10月24日更新）。"
    );
  });
});
