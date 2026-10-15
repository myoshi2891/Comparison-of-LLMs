// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({
    chart,
    id,
    theme,
    themeVariables,
  }: {
    chart: string;
    id?: string;
    theme?: string;
    themeVariables?: Record<string, string>;
  }) => (
    <div
      data-testid="mermaid-diagram"
      data-chart={chart}
      data-theme={theme}
      data-has-theme-vars={themeVariables ? "true" : "false"}
      data-primary-color={themeVariables?.primaryColor}
      id={id}
    >
      {chart}
    </div>
  ),
}));

const tocObserver = vi.hoisted(() => vi.fn(() => null));
vi.mock("./TocObserver", () => ({ default: tocObserver }));

const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
const text = (element: Element) => normalize(element.textContent ?? "");
const nodes = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll(selector));

const EXPECTED_H1 = [
  "Reliable Machine Learning ― SREの原則をML本番運用に適用する 初学者向け完全ガイド",
] as const;

const EXPECTED_H2 = [
  "この本の著者について",
  "1. イントロダクション：なぜMLにSREの原則が必要なのか",
  "2. MLライフサイクルの全体像",
  "3. データマネジメントの原則：データという名の負債",
  "4. モデルの基礎：モデルは何でできているのか",
  "5. 特徴量とトレーニングデータのエンジニアリング",
  "6. モデルの検証と品質評価",
  "7. 公平性・プライバシー・責任あるML",
  "8. 学習システムの信頼性設計",
  "9. モデルサービングのアーキテクチャと可用性",
  "10. モニタリングと可観測性：サイレント障害を検知する",
  "11. 継続的MLとSLO・エラーバジェット設計",
  "12. インシデント対応と組織へのMLの統合（まとめ）",
  "13. 学習チェックリスト",
  "14. 参考文献",
] as const;

const EXPECTED_H3 = [
  "1.1 「動くML」と「本番で信頼できるML」は別物",
  "1.2 従来ソフトウェアの信頼性 vs MLシステムの信頼性",
  "1.3 本ガイドのゴール",
  "2.1 ループとしてのML",
  "2.2 各段階でSREが問うべき質問",
  "3.1 「データは資産ではなく負債である」という視点",
  "3.2 データのライフサイクル：6つのフェーズ",
  "3.3 データの信頼性を構成する9つの次元",
  "4.1 「モデル」という言葉の3つの意味",
  "4.2 モデル作成のワークフローと脆弱性ポイント",
  "4.3 具体例：ECサイトのクリック予測モデル",
  "5.1 特徴量のライフサイクルとフィーチャーストア",
  "5.2 ラベルとアノテーション",
  "5.3 メタデータシステム",
  "6.1 「妥当性」と「品質」は別の問い",
  "6.2 オフライン評価とその限界",
  "6.3 MLテストスコア：本番準備度を定量化する",
  "7.1 公平性は「エンドポイント」ではなく「プロセス」",
  "7.2 プライバシーを守る手法",
  "7.3 責任あるAI（Responsible AI）をパイプライン全体に組み込む",
  "8.1 学習システムを構成するコンポーネント",
  "8.2 一般的な信頼性の原則",
  "8.3 学習の再現性という落とし穴",
  "9.1 サービング設計で問うべき6つの質問",
  "9.2 サービングアーキテクチャの比較",
  "9.3 安全なロールアウト：シャドーデプロイとカナリアリリース",
  "9.4 精度か、それとも可用性か",
  "10.1 なぜML特有のモニタリングが必要か",
  "10.2 データ分布シフトの3つの型",
  "10.3 モデルモニタリングのベストプラクティス",
  "11.1 継続的MLシステムの解剖",
  "11.2 MLシステムのためのSLO設計",
  "12.1 MLに特有のインシデントの解剖",
  "12.2 役割ごとのインシデント対応責務",
  "12.3 プロダクトとMLの関係、そして組織への統合",
  "12.4 このガイド全体のまとめ",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://www.oreilly.com/library/view/reliable-machine-learning/9781098106218/",
  "https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems",
  "https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/",
  "https://developers.google.com/machine-learning/guides/rules-of-ml",
  "https://sre.google/sre-book/embracing-risk/",
  "https://sre.google/sre-book/service-best-practices/",
  "https://sre.google/workbook/implementing-slos/",
  "https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
  "https://www.uber.com/en-CA/blog/michelangelo-machine-learning-platform/",
  "https://www.uber.com/us/en/blog/scaling-michelangelo/",
  "https://developers.google.com/machine-learning/guides/intro-responsible-ai/fairness",
  "https://developers.google.com/machine-learning/managing-ml-projects/ethics",
  "https://ai.google/responsibilities/responsible-ai-practices/",
  "https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html",
  "https://mikulskibartosz.name/shadow-deployment-vs-canary-release",
] as const;

describe("Reliable Machine Learning ガイド契約テスト", () => {
  // S. 原本照合契約 (4件)
  it("S-1: H2 見出しが原本と順序込みで完全一致する", () => {
    const { container } = render(<Page />);
    const actualH2 = nodes(container, "main h2").map(text);
    expect(actualH2).toEqual([...EXPECTED_H2]);
  });

  it("S-2: H3 見出しが原本と順序込みで完全一致する", () => {
    const { container } = render(<Page />);
    const actualH3 = nodes(container, "main h3").map(text);
    expect(actualH3).toEqual([...EXPECTED_H3]);
  });

  it("S-3: 原本の外部リンク URL が全件存在する", () => {
    const { container } = render(<Page />);
    const actualUrls = new Set(
      nodes(container, "a[href^='http']")
        .map((a) => a.getAttribute("href")?.trim())
        .filter((href): href is string => Boolean(href))
    );
    for (const url of EXPECTED_EXTERNAL_LINKS) {
      expect(actualUrls.has(url)).toBe(true);
    }
  });

  it("S-4: 全 H2/H3 が一意な ID を持ち、TOC アンカーが全て実在する見出しを指す", () => {
    const { container } = render(<Page />);
    const headings = nodes(container, "main h2, main h3");
    const ids = headings.map((h) => h.getAttribute("id")).filter(Boolean);
    expect(new Set(ids).size).toBe(headings.length);

    const tocLinks = nodes(
      container,
      "nav.sidebar a[href^='#'], nav[data-testid='sidebar-nav'] a[href^='#']"
    );
    expect(tocLinks.length).toBe(51); // 15 H2 + 36 H3
    for (const link of tocLinks) {
      const targetId = decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "");
      const target = container.querySelector(`[id='${CSS.escape(targetId)}']`);
      expect(target).not.toBeNull();
    }
  });

  // C. コンテンツ契約 (6件)
  it("C-1: H1 テキストが原本と完全一致する", () => {
    const { container } = render(<Page />);
    const actualH1 = nodes(container, "h1").map(text);
    expect(actualH1).toEqual([...EXPECTED_H1]);
  });

  it("C-2: TOC リンクが全て # 形式で 51 件存在する", () => {
    const { container } = render(<Page />);
    const tocLinks = nodes(container, "nav a[href^='#']");
    expect(tocLinks.length).toBe(51);
  });

  it("C-3: サイドバー TOC のアクティブ状態クラスが定義可能である", () => {
    expect(styles.active).toBeDefined();
  });

  it("C-4: 外部リンク全件に target='_blank' かつ rel='noopener noreferrer' が付与されている", () => {
    const { container } = render(<Page />);
    const extLinks = nodes(container, "a[href^='http']");
    expect(extLinks.length).toBeGreaterThanOrEqual(15);
    for (const a of extLinks) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("C-5: 内部リンクに .html 拡張子が含まれない", () => {
    const { container } = render(<Page />);
    const internalLinks = nodes(container, "a[href^='/'], a[href^='#']");
    for (const a of internalLinks) {
      expect(a.getAttribute("href")).not.toMatch(/\.html(?:#|$)/);
    }
  });

  it("C-6: Mermaid 図解が 12 件存在し、theme='base' とテーマ変数が正しく渡されている", () => {
    const { container } = render(<Page />);
    const diagrams = nodes(container, "[data-testid='mermaid-diagram']");
    expect(diagrams.length).toBe(12);
    for (const d of diagrams) {
      expect(d.getAttribute("data-theme")).toBe("base");
      expect(d.getAttribute("data-has-theme-vars")).toBe("true");
      expect(d.getAttribute("data-primary-color")).toBe("#eaeef6");
    }
  });

  // D. デザイン契約 (7件)
  it("D-1: callout が 7 件存在し、すべて data-variant='good' を持つ", () => {
    const { container } = render(<Page />);
    const callouts = nodes(container, "[data-testid='callout']");
    expect(callouts.length).toBe(7);
    for (const c of callouts) {
      expect(c.getAttribute("data-variant")).toBe("good");
    }
  });

  it("D-2: 各 callout が callout-label を持ち『ベストプラクティス』と表示される", () => {
    const { container } = render(<Page />);
    const labels = nodes(container, "[data-testid='callout-label']");
    expect(labels.length).toBe(7);
    for (const l of labels) {
      expect(text(l)).toBe("ベストプラクティス");
    }
  });

  it("D-5: サイドバーナビゲーションが存在し、全リンクに data-testid='sidebar-nav-link' が付与されている", () => {
    const { container } = render(<Page />);
    const nav = container.querySelector("[data-testid='sidebar-nav']");
    expect(nav).not.toBeNull();
    const links = nodes(container, "[data-testid='sidebar-nav-link']");
    expect(links.length).toBe(51);
  });

  it("D-8: 最外殻に data-testid='layout-root' があり、.layout が width: 100% を持つ", () => {
    const { container } = render(<Page />);
    const root = container.querySelector("[data-testid='layout-root']");
    expect(root).not.toBeNull();

    const cssPath = path.join(__dirname, "page.module.css");
    const css = fs.readFileSync(cssPath, "utf-8");
    expect(css).toMatch(/\.layout\s*\{[^}]*width:\s*100%/);
  });

  it("D-9: テーブルが 10 件存在し、CSS に全列左寄せが定義されている", () => {
    const { container } = render(<Page />);
    const tables = nodes(container, "table");
    expect(tables.length).toBe(10);

    const cssPath = path.join(__dirname, "page.module.css");
    const css = fs.readFileSync(cssPath, "utf-8");
    expect(css).toMatch(/text-align:\s*left\s*!important/);
  });

  it("D-10: チェックリストに 10 個のチェックボックスが存在し初期状態が 0/10 である", () => {
    const { container } = render(<Page />);
    const checkboxes = nodes(container, "input[type='checkbox']");
    expect(checkboxes.length).toBe(10);
    const counter = container.querySelector(`.${styles.checklistCounter}`);
    expect(counter).not.toBeNull();
    expect(counter ? text(counter) : "").toBe("0/10");
  });

  it("D-11: 参考文献カードが 15 件存在し、ref-1 〜 ref-15 の ID を持つ", () => {
    const { container } = render(<Page />);
    const cards = nodes(container, `.${styles.refCard}`);
    expect(cards.length).toBe(15);
    for (let i = 1; i <= 15; i++) {
      const card = container.querySelector(`#ref-${i}`);
      expect(card).not.toBeNull();
    }
  });

  // Q. 品質契約 (2件)
  it("Q-2: metadata の title と description が適切に定義され、H1 と整合する", () => {
    expect(metadata.title).toBeDefined();
    expect(metadata.description).toBeDefined();
    expect(typeof metadata.title).toBe("string");
    expect(typeof metadata.description).toBe("string");
    expect(metadata.title).toContain("Reliable Machine Learning");
  });

  it("Q-3: 見出し階層にスキップが存在しない", () => {
    const { container } = render(<Page />);
    const headings = nodes(container, "h1, h2, h3, h4, h5, h6");
    let prevLevel = 0;
    for (const h of headings) {
      const level = Number.parseInt(h.tagName.slice(1), 10);
      if (prevLevel > 0) {
        expect(level - prevLevel).toBeLessThanOrEqual(1);
      }
      prevLevel = level;
    }
  });
});
