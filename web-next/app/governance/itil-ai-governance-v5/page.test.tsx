// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({ chart }: { chart: string }) {
    return <pre data-testid="mermaid">{chart}</pre>;
  },
}));

const EXPECTED_H1 = ["ITIL AI Governance (Version 5) 完全学習ガイド"] as const;

const EXPECTED_H2 = [
  "この教材について",
  "第1章: AI の世界と AI ガバナンスの必要性",
  "第2章: ガバナンスの基本概念",
  "第3章: AI の基本概念とガバナンスが必要な理由",
  "第4章: ITIL AI Capability Model（6C）とリスク・戦略",
  "第5章: ガバナンスツールキットとしての ITIL",
  "第6章: ITIL AI Governance Improvement Model — Assess ＆ Design",
  "第7章: ITIL AI Governance Improvement Model — Implement ＆ Maintain",
  "第8章: 自分の役割・業界で AI を活かす",
  "第9章: 他のフレームワーク・規制・標準との連携",
  "第10章: 試験対策まとめと用語集",
  "参考文献・出典一覧",
] as const;

const EXPECTED_H3 = [
  "初学者向け ステップバイステップ解説 + ベストプラクティス集",
  "資格の基本情報（試験概要）",
  "全体像（この資格で学ぶ主要モデル）",
  "1-1. なぜ今 AI ガバナンスが必要なのか",
  "1-2. AI がもたらす機会と脅威",
  "1-3. AI 統治の成熟度スペクトラムと「ガバナンスギャップ」",
  "1-4. 「良いガバナンス」の6つの特性",
  "2-1. ガバナンス・マネジメント・リーダーシップの違い",
  "2-2. AI ガバナンスシステムの6つの構成要素",
  "2-3. 4つのガバナンスパターン",
  "2-4. ガバナンスが確保するもの",
  "3-1. AI の3つのタイプ",
  "3-2. AI の主要な特性",
  "3-3. AI の主なリスクカテゴリ",
  "4-1. 6C モデルとは",
  "4-2. 能力がガバナンスの境界をどう形づくるか",
  "4-3. 4つの AI ガバナンス視点（Four AI Governance Perspectives）",
  "4-4. リスクから対策へ（From risks to countermeasures）",
  "4-5. Shadow AI（シャドーAI）と戦略への影響",
  "5-1. ITIL Value System と価値の共創",
  "5-2. ITIL Product and Service Lifecycle Model と AI",
  "5-3. ITIL Guiding Principles（指針となる7つの原則）",
  "5-4. ITIL Four Dimensions と AI",
  "5-5. ITIL Maturity Model と AI Governance Maturity Assessment",
  "5-6. Continual Improvement Model と Transformation Model",
  "5-7. サステナビリティと AI の価値",
  "6-1. なぜ専用モデルが必要か",
  "6-2. Assess（評価・ストレステスト）ステップ",
  "6-3. Design（要件定義・設計）ステップ",
  "7-1. Implement（実装）ステップ",
  "7-2. Maintain（維持）ステップ",
  "7-3. コンプライアンス・規制をガバナンスへの入力として扱う",
  "8-1. 価値実現（Value Realization）: 期待価値から実際価値へ",
  "8-2. 業界・組織機能ごとの AI ユースケース",
  "8-3. AI ユースケース評価テンプレート",
  "9-1. なぜフレームワーク同士の連携が必要か",
  "9-2. PRINCE2 との連携",
  "9-3. DevOps との連携",
  "9-4. 全体像の統合",
  "10-1. 試験の心構え",
  "10-2. 章ごとの学習チェックリスト",
  "10-3. 用語集（日英対照）",
  "一次情報源（公式資料）",
  "二次資料（トレーニング事業者・解説記事）",
] as const;

const EXPECTED_H4 = [
  "6-3-1. コンテキスト・リスク要因と比例的ガバナンス",
  "6-3-2. リスク優先度評価（Risk Priority Rating）",
  "6-3-3. 統制の3類型（Preventive / Detective / Corrective）",
  "6-3-4. 意思決定境界・人間の監督・倫理的設計",
  "6-3-5. Shadow AI 統制の設計とサステナビリティ要件",
  "7-3-1. 世界的な規制の潮流（The Global Regulatory Landscape）",
  "7-3-2. 外部標準との関係",
  "7-3-3. サードパーティ・サプライヤー・エンドツーエンドのガバナンス",
] as const;

const EXPECTED_TOC_HREFS = [
  "#この教材について",
  "#第1章-AI-の世界と-AI-ガバナンスの必要性",
  "#第2章-ガバナンスの基本概念",
  "#第3章-AI-の基本概念とガバナンスが必要な理由",
  "#第4章-ITIL-AI-Capability-Model-6C-とリスク-戦略",
  "#第5章-ガバナンスツールキットとしての-ITIL",
  "#第6章-ITIL-AI-Governance-Improvement-Model-Assess-Design",
  "#第7章-ITIL-AI-Governance-Improvement-Model-Implement-Maintain",
  "#第8章-自分の役割-業界で-AI-を活かす",
  "#第9章-他のフレームワーク-規制-標準との連携",
  "#第10章-試験対策まとめと用語集",
  "#参考文献-出典一覧",
] as const;

const EXPECTED_EXTERNAL_LINKS = [
  "https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-ai-governance-version-5-4234",
  "https://itsmacademy.com/itil-ai-governance-course",
  "https://agilepmhub.com/itil-ai-governance",
  "https://itcko.sk/en/itil-v5-ai-governance-module/",
  "https://www.pmgacademy.com/en/articles/itil/information-and-technology-in-itil-version-5-the-guide-for-the-ai-era-and-data-governance/",
  "https://standards.ieee.org/ieee/7014/7648/",
  "https://itsm.tools/itil-version-5-vs-itil-4-key-changes/",
  "https://www.iso.org/standard/81230.html",
  "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  "https://www.itil.com/professionals/certifications/ITIL-AI-Governance-Version-5",
  "https://www.axelos.com/best-practice-solutions/itil",
  "https://gogotraining.com/blog/2026/08/itil-ai-governance-the-itil-certification-you-cant-live-without/",
  "https://www.innovativelearning.eu/products/itil-5/itil-ai-governance-5.html",
  "https://www.itil.org.uk/training/itil-extension-modules/itil-ai-governance-version-5-training-course",
] as const;

describe("ITIL AI Governance (Version 5) 完全学習ガイド - 契約テスト", () => {
  // S-1: 原本見出し契約（順序込み完全一致）
  it("S-1: H1見出しが原本と完全一致する", () => {
    const { container } = render(<Page />);
    const h1s = Array.from(container.querySelectorAll("h1")).map((el) => el.textContent?.trim());
    expect(h1s).toEqual([...EXPECTED_H1]);
  });

  it("S-1: H2見出しが原本と順序込み完全一致する", () => {
    const { container } = render(<Page />);
    const h2s = Array.from(container.querySelectorAll("h2")).map((el) => el.textContent?.trim());
    expect(h2s).toEqual([...EXPECTED_H2]);
  });

  it("S-1: H3見出しが原本と順序込み完全一致する", () => {
    const { container } = render(<Page />);
    const h3s = Array.from(container.querySelectorAll("h3")).map((el) => el.textContent?.trim());
    expect(h3s).toEqual([...EXPECTED_H3]);
  });

  it("S-1: H4見出しが原本と順序込み完全一致する", () => {
    const { container } = render(<Page />);
    const h4s = Array.from(container.querySelectorAll("h4")).map((el) => el.textContent?.trim());
    expect(h4s).toEqual([...EXPECTED_H4]);
  });

  // S-2: 外部リンク契約
  it("S-2: 原本の主要外部リンクがすべて含まれる", () => {
    const { container } = render(<Page />);
    const links = Array.from(container.querySelectorAll("a[href^='http']")).map((el) =>
      el.getAttribute("href")
    );
    for (const expectedUrl of EXPECTED_EXTERNAL_LINKS) {
      expect(links).toContain(expectedUrl);
    }
  });

  // S-3: 目次（TOC）アンカーリンク契約
  it("S-3: 目次（TOC）のhrefが原本の全12セクションと完全一致する", () => {
    const { container } = render(<Page />);
    const tocLinks = Array.from(container.querySelectorAll("nav[data-testid='toc'] a")).map((el) =>
      el.getAttribute("href")
    );
    expect(tocLinks).toEqual([...EXPECTED_TOC_HREFS]);
  });

  // S-4: Mermaid ダイアグラム契約（全14図解）
  it("S-4: 14個のMermaid図解が描画され、それぞれ構文を持つ", () => {
    const { container } = render(<Page />);
    const diagrams = container.querySelectorAll("[data-testid='mermaid']");
    expect(diagrams).toHaveLength(14);
    for (const diagram of Array.from(diagrams)) {
      expect(diagram.textContent).toMatch(/flowchart\s+(?:TB|LR)/);
    }
  });

  // C-1: タイトルとサブタイトル
  it("C-1: タイトルと初学者向けサブタイトルが表示される", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("h1")?.textContent).toBe(
      "ITIL AI Governance (Version 5) 完全学習ガイド"
    );
    expect(container.querySelector("h1 + h3")?.textContent).toBe(
      "初学者向け ステップバイステップ解説 + ベストプラクティス集"
    );
  });

  // C-2: テーブル契約（111行相当のテーブル構造）
  it("C-2: 資格基本情報テーブルおよび各章のテーブルが存在する", () => {
    const { container } = render(<Page />);
    const tables = container.querySelectorAll("table");
    expect(tables.length).toBeGreaterThanOrEqual(10);
    const firstThs = Array.from(tables[0].querySelectorAll("thead th")).map((th) =>
      th.textContent?.trim()
    );
    expect(firstThs).toEqual(["項目", "内容"]);
  });

  // C-3: Callout 契約（全24件）
  it("C-3: 全24件のcallout（practice: 9, source: 11, note: 4）が存在する", () => {
    const { container } = render(<Page />);
    const callouts = container.querySelectorAll("[data-testid='callout']");
    expect(callouts).toHaveLength(24);

    const practiceCallouts = container.querySelectorAll(
      "[data-testid='callout'][data-variant='practice']"
    );
    expect(practiceCallouts).toHaveLength(9);

    const sourceCallouts = container.querySelectorAll(
      "[data-testid='callout'][data-variant='source']"
    );
    expect(sourceCallouts).toHaveLength(11);

    const noteCallouts = container.querySelectorAll("[data-testid='callout'][data-variant='note']");
    expect(noteCallouts).toHaveLength(4);
  });

  // C-4: 参考文献カード契約
  it("C-4: 14件の参考文献カードが存在し、ナンバリングバッジを持つ", () => {
    const { container } = render(<Page />);
    const refCards = container.querySelectorAll("[data-testid='ref-card']");
    expect(refCards).toHaveLength(14);
    const badges = Array.from(container.querySelectorAll("[data-testid='ref-badge']")).map((b) =>
      b.textContent?.trim()
    );
    expect(badges).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
    ]);
  });

  // C-5: 外部リンクのセキュリティ属性
  it("C-5: 外部へのリンクに target='_blank' と rel='noopener noreferrer' が設定されている", () => {
    const { container } = render(<Page />);
    const extLinks = container.querySelectorAll("a[href^='http']");
    for (const link of Array.from(extLinks)) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    }
  });

  // D-1: 表の左寄せ
  it("D-1: テーブルヘッダーとセルに左寄せ用クラスまたはルールが適用される", () => {
    const { container } = render(<Page />);
    const tables = container.querySelectorAll("table");
    for (const table of Array.from(tables)) {
      expect(table.className).toContain(styles.table);
    }
  });

  // D-2: ブランドSVG
  it("D-2: サイドバーにブランドSVGが表示される", () => {
    const { container } = render(<Page />);
    const brandSvg = container.querySelector("svg");
    expect(brandSvg).not.toBeNull();
  });

  // D-3: 鮮度バー非表示
  it("D-3: page.module.css にグローバル鮮度バー非表示クラスが含まれている", () => {
    expect(styles.layout).toBeDefined();
    expect(styles.sidebar).toBeDefined();
    expect(styles.main).toBeDefined();
    expect(styles.callout).toBeDefined();
  });

  // Q-1: メタデータ契約
  it("Q-1: 正しいメタデータがエクスポートされている", () => {
    expect(metadata.title).toBe("ITIL AI Governance (Version 5) 完全学習ガイド");
    expect(metadata.description).toContain(
      "PeopleCert 認定資格 ITIL AI Governance (Version 5) の出題範囲"
    );
  });

  // Q-2: TocObserver コンポーネントのマウント
  it("Q-2: TocObserver が配置されている", () => {
    const { container } = render(<Page />);
    expect(container.querySelector("[data-testid='toc-observer']")).not.toBeNull();
  });
});
