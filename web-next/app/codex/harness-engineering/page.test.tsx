import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render } from "@testing-library/react";
import type { Metadata } from "next";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

describe("OpenAI Codex Harness Engineering Evals Guide - Comprehensive Regression Tests", () => {
  it("renders the correct page title (<h1>)", () => {
    const { container } = render(<Page />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("OpenAI Codexにおけるハーネスエンジニアリング実践ガイド");
  });

  it("renders exactly 9 major sections (<h2>) with exact titles and valid IDs", () => {
    const { container } = render(<Page />);
    const h2Elements = container.querySelectorAll("h2");
    expect(h2Elements.length).toBe(9);

    const expectedTitles = [
      "はじめに — なぜ「評価基盤」がハーネスエンジニアリングの核心なのか",
      "ハーネスエンジニアリングとは何か",
      "なぜ評価が「継続的」でなければならないのか",
      "評価基盤の7層モデル — 詳細解説",
      "ステップバイステップ実装ガイド",
      "ハーネス成熟度チェックリスト",
      "アンチパターン",
      "まとめ",
      "参考文献",
    ];

    expectedTitles.forEach((title, index) => {
      const h2 = h2Elements[index];
      expect(h2?.textContent).toContain(title);
      expect(h2?.getAttribute("id")).toBeTruthy();
    });
  });

  it("renders Layer 1 to Layer 7 H3 headings with dedicated layer styling classes", () => {
    const { container } = render(<Page />);

    const layerIds = [
      "41-layer-1-セッション内自己検証ループralph-wiggum-loop",
      "42-layer-2-リポジトリレベルのメカニカル強制",
      "43-layer-3-ランタイムオブザーバビリティによる実行時検証",
      "44-layer-4-cicdにおける非対話型品質ゲートcodex-exec",
      "45-layer-5-プラットフォームevals--tracesgradersdatasetseval-runsのフライホイール",
      "46-layer-6-外部標準ベンチマーク--swe-bench-verifiedとterminal-bench-20--harbor",
      "47-layer-7-継続的セキュリティ評価codex-security-cli",
    ];

    layerIds.forEach((id, idx) => {
      const h3 = container.querySelector(`h3[id="${id}"]`);
      expect(h3).not.toBeNull();
      expect(h3?.className).toContain(`layer${idx + 1}`);
      expect(h3?.className).toContain("layerH3");
    });
  });

  it("renders 7 quick-navigation cards (L1 to L7) with correct card classes and anchor links", () => {
    const { container } = render(<Page />);
    const quicknavCards = container.querySelectorAll('a[class*="quicknavCard"]');
    expect(quicknavCards.length).toBe(7);

    for (let i = 1; i <= 7; i++) {
      const card = container.querySelector(`a[class*="cardL${i}"]`);
      expect(card).not.toBeNull();
      expect(card?.getAttribute("href")).toMatch(new RegExp(`^#4${i}-layer-${i}`));
    }
  });

  it("renders initial active state on the first sidebar TOC link", () => {
    const { container } = render(<Page />);
    const firstTocLink = container.querySelector("#sidebar nav a");
    expect(firstTocLink).not.toBeNull();
    expect(firstTocLink?.className).toContain(styles.active);
  });

  it("updates sidebar active link on scroll event via TocObserver", () => {
    const { container } = render(<Page />);
    const navLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>("#sidebar nav a"));
    expect(navLinks.length).toBe(9);

    const headings = Array.from(container.querySelectorAll<HTMLElement>("h2[id]"));
    headings.forEach((h, index) => {
      vi.spyOn(h, "getBoundingClientRect").mockReturnValue({
        top: index <= 3 ? 50 : 2000,
        bottom: 500,
        left: 0,
        right: 1000,
        width: 1000,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      });
    });

    // Trigger scroll event with scrollY
    Object.defineProperty(window, "scrollY", { value: 1500, writable: true });
    fireEvent.scroll(window);

    // Section 4 (#4-評価基盤の7層モデル--詳細解説) link should now be active
    const section4Link = navLinks.find(
      (a) => a.getAttribute("href") === "#4-評価基盤の7層モデル--詳細解説"
    );
    expect(section4Link?.className).toContain(styles.active);
  });

  it("renders all 7 Mermaid diagrams in proper container wrappers", () => {
    const { container } = render(<Page />);
    const mermaidDiagrams = container.querySelectorAll('[data-testid="mermaid"]');
    expect(mermaidDiagrams.length).toBe(7);

    mermaidDiagrams.forEach((diagram) => {
      const parent = diagram.parentElement;
      expect(parent?.className).toContain("mermaidWrap");
    });
  });

  it("renders 4 reference categories with external links and proper security attributes", () => {
    const { container } = render(<Page />);
    const refCards = container.querySelectorAll('div[class*="refCard"]');
    expect(refCards.length).toBe(4);

    const refHeadings = [
      "OpenAI公式ソース",
      "外部評価ベンチマーク・研究機関",
      "著名な開発者による分析",
      "業界メディア報道",
    ];

    refHeadings.forEach((headingText) => {
      const found = Array.from(refCards).some((card) =>
        card.querySelector("h3")?.textContent?.includes(headingText)
      );
      expect(found).toBe(true);
    });

    const externalLinks = Array.from(container.querySelectorAll("a")).filter((a) =>
      a.getAttribute("href")?.startsWith("http")
    );

    expect(externalLinks.length).toBeGreaterThan(15);
    externalLinks.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("rel")).toContain("noreferrer");
    });
  });

  it("ensures all internal anchor links use clean relative fragment URLs", () => {
    const { container } = render(<Page />);
    const internalLinks = Array.from(container.querySelectorAll("a")).filter((a) => {
      const href = a.getAttribute("href");
      return href && !href.startsWith("http");
    });

    internalLinks.forEach((a) => {
      const href = a.getAttribute("href");
      expect(href).toMatch(/^#/);
      expect(href).not.toMatch(/\.html$/);
    });
  });

  it("delegates Mermaid sizing and centering to the shared component", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");

    expect(css).not.toMatch(/\.mermaidWrap\s*\{[^}]*(?:display|justify-content)\s*:/s);
    expect(css).toMatch(/\.mermaidWrap\s*\{[^}]*overflow-x:\s*auto/s);
  });

  it("preserves disc bullets in reference cards", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");

    expect(css).toMatch(/\.refCard ul\s*\{[^}]*list-style:\s*disc/s);
    expect(css).toMatch(/\.refCard ul\s*\{[^}]*padding-left:\s*1\.1rem/s);
    expect(css).toMatch(/\.refCard ul\s*\{[^}]*margin:\s*0/s);
  });

  it("makes the open mobile overlay cover the viewport", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");

    expect(css).toMatch(/\.overlayOpen\s*\{[^}]*display:\s*block\s*!important/s);
    expect(css).toMatch(/\.overlayOpen\s*\{[^}]*position:\s*fixed/s);
    expect(css).toMatch(/\.overlayOpen\s*\{[^}]*inset:\s*0/s);
    expect(css).toMatch(/\.overlayOpen\s*\{[^}]*width:\s*100%/s);
    expect(css).toMatch(/\.overlayOpen\s*\{[^}]*height:\s*100%/s);
  });
});

describe("/codex/harness-engineering metadata", () => {
  it("metadata が export されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.title).toBe("string");
    expect(meta.title).toContain("ハーネスエンジニアリング");
  });

  it("description が設定されている", () => {
    const meta = metadata as Metadata;
    expect(typeof meta.description).toBe("string");
    expect((meta.description ?? "").length).toBeGreaterThan(20);
  });
});
