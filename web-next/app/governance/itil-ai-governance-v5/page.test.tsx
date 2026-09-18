// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { normalizeMermaidSource } from "@/tests/helpers/mermaid";
import Page, { metadata } from "./page";
import styles from "./page.module.css";

vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: function DummyMermaidDiagram({
    chart,
    theme,
    themeVariables,
  }: {
    chart: string;
    theme?: string;
    themeVariables?: Record<string, string>;
  }) {
    return (
      <pre
        data-testid="mermaid"
        data-theme={theme}
        data-has-theme-vars={String(Boolean(themeVariables))}
      >
        {chart}
      </pre>
    );
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

const EXPECTED_MERMAID_SOURCES = [
  `flowchart TB
subgraph found["土台となる考え方"]
A["ガバナンスとは何か<br/>(Module 2)"]
B["AIとは何か<br/>(Module 3)"]
end

subgraph core["中核となる2つのモデル"]
C["ITIL AI Capability Model<br/>6C モデル<br/>(Module 4)"]
D["ITIL AI Governance<br/>Improvement Model<br/>Assess-Design-Implement-Maintain<br/>(Module 6・7)"]
end

subgraph support["支える基盤と外部連携"]
E["ITIL Value System /<br/>Four Dimensions<br/>(Module 5)"]
F["規制・外部標準<br/>EU AI Act / ISO 42001 等<br/>(Module 7・9)"]
G["PRINCE2 / DevOps との連携<br/>(Module 9)"]
end

H["実務適用<br/>役割・業界別の実践<br/>(Module 8)"]

found --> core
core --> support
support --> H
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class A,B,E,F,G box;
class C,D hub;
class H done;`,
  `flowchart LR
A["ツールとしてのAI<br/>(AI as a Tool)"] --> B["アシスタントとしてのAI<br/>(AI as an Assistant)"]
B --> C["同僚としてのAI<br/>(AI as a Co-worker)"]
C --> D["AI対応ワークフォース<br/>(AI-enabled Workforce)"]
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class A,B,C box;
class D done;`,
  `flowchart TB
G["ガバナンス<br/>Governance<br/>(方向づけ・監督・説明責任)"] -->|"方針・境界を設定"| M["マネジメント<br/>Management<br/>(計画・実行・統制)"]
M -->|"実績・課題をフィードバック"| G
L["リーダーシップ<br/>Leadership<br/>(動機づけ・方向性への共感)"] -.->|"下支えする"| G
L -.->|"下支えする"| M
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class M,L box;
class G hub;`,
  `flowchart TB
subgraph patterns["4つのガバナンスパターン"]
D1["Directive<br/>指示型<br/>厳格なルール・低い裁量"]
D2["Guided<br/>誘導型<br/>ガイドラインの範囲内で判断"]
D3["Federated<br/>連邦型<br/>中央方針＋部門ごとの裁量"]
D4["Autonomous<br/>自律型<br/>広い裁量・強い自己判断"]
end
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class D1,D2,D3,D4 box;`,
  `flowchart LR
N["Narrow AI<br/>特化型AI<br/>単一タスクに特化<br/>例: 需要予測モデル"]
G["Generative AI<br/>生成AI<br/>コンテンツ・コードを新規生成<br/>例: チャットボット, コード生成"]
A["Agentic AI<br/>エージェント型AI<br/>目標達成のため自律的に<br/>複数ステップを実行"]

N -->|"自律性・複雑性が増す"| G --> A
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class N,G box;
class A hub;`,
  `flowchart TB
Hub(("6C Model"))
C1["Creation<br/>創出<br/>新規コンテンツ・コード・<br/>ドキュメントの生成"]
C2["Curation<br/>キュレーション<br/>既存データの重複排除・<br/>品質/関連性の向上"]
C3["Clarification<br/>明確化<br/>複雑な情報の要約・<br/>ナビゲーション支援"]
C4["Cognition<br/>認知<br/>パターン検出・予測・<br/>問題の予兆把握"]
C5["Communication<br/>コミュニケーション<br/>チャットボット等の<br/>自然な対話インターフェース"]
C6["Coordination<br/>調整<br/>複数タスク・エージェント間の<br/>連携とオーケストレーション"]

Hub --- C1
Hub --- C2
Hub --- C3
Hub --- C4
Hub --- C5
Hub --- C6
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class C1,C2,C3,C4,C5,C6 box;
class Hub hub;`,
  `flowchart TB
subgraph VS["ITIL Value System"]
GP["Guiding Principles<br/>指針となる原則"]
GOV["Governance<br/>ガバナンス"]
PSL["Product and Service<br/>Lifecycle Model<br/>旧称: Value Chain"]
PRAC["Practices<br/>プラクティス"]
CIM["Continual Improvement<br/>継続的改善"]
end

OPP["機会・需要<br/>Opportunity/Demand"] --> VS --> VAL["価値<br/>Value"]
GOV -.->|"境界・方向づけ"| PSL
GP -.->|"判断の指針"| PSL
CIM -.->|"フィードバック"| VS
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class GP,PSL,PRAC,CIM,OPP box;
class GOV hub;
class VAL done;`,
  `flowchart LR
D1["Organizations and<br/>People<br/>組織と人材<br/>Organizations, people and AI 節"]
D2["Information and<br/>Technology<br/>情報と技術<br/>ITIL AI Capability Model 6C"]
D3["Partners and<br/>Suppliers<br/>パートナーと供給者"]
D4["Value Streams and<br/>Processes<br/>バリューストリームと<br/>プロセス"]

CENTER(("Product and<br/>Service<br/>Lifecycle"))
D1 --- CENTER
D2 --- CENTER
D3 --- CENTER
D4 --- CENTER
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class D1,D2,D3,D4 box;
class CENTER hub;`,
  `flowchart LR
A["Assess<br/>アセス<br/>現状のガバナンス成熟度を<br/>評価し、ストレステストする"] --> B["Design<br/>デザイン<br/>ガバナンス要件を定義し、<br/>統制・調整策を設計する"]
B --> C["Implement<br/>インプリメント<br/>ガバナンスの調整策を<br/>導入する"]
C --> D["Maintain<br/>メンテイン<br/>監視・保証・継続的改善を<br/>通じて維持する"]
D -.->|"継続的なフィードバック"| A
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class A,B,C,D hub;`,
  `flowchart LR
subgraph timeline["時間軸で見た統制の役割"]
P["Preventive<br/>予防的統制<br/>問題の発生を未然に防ぐ"]
DT["Detective<br/>発見的統制<br/>発生した問題を検知する"]
CR["Corrective<br/>是正的統制<br/>検知した問題を修正する"]
end
P -->|"発生前"| DT -->|"発生後"| CR
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class P,DT,CR box;`,
  `flowchart TB
IMP["Implement<br/>導入"] --> OBS["Observability<br/>可観測性の確保"]
OBS --> MON["Monitoring<br/>継続的な監視"]
MON --> AUD["Auditability<br/>監査可能性の担保"]
AUD --> ASSU["Assurance Evidence Pack<br/>保証のためのエビデンス収集"]
ASSU -->|"改善点をフィードバック"| IMP
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class IMP,OBS,MON,AUD box;
class ASSU done;`,
  `flowchart TB
subgraph inputs["外部からの入力"]
REG["各国・地域の規制<br/>EU AI Act 等"]
ISO["ISO/IEC 42001<br/>AIマネジメントシステム標準"]
IEEE["IEEE 7014-2024<br/>擬似共感の倫理的配慮"]
end

subgraph aig["ITIL AI Governance<br/>Improvement Model"]
ASS["Assess"] --> DES["Design"] --> IMPL["Implement"] --> MAI["Maintain"]
end

inputs --> aig
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class REG,ISO,IEEE box;
class ASS,DES,IMPL,MAI hub;`,
  `flowchart TB
ITILHUB(("ITIL AI<br/>Governance"))

P2["PRINCE2<br/>このAI導入プロジェクトを<br/>どう管理・統制するか<br/>に答える"]
DO["DevOps<br/>AIをどう安全かつ迅速に<br/>継続的にデリバリーするか<br/>に答える"]
REG["規制・外部標準<br/>何が法的・社会的に<br/>許容されるかに答える"]

ITILHUB ---|"プロダクト・サービス全体の<br/>統治の枠組みを提供"| P2
ITILHUB ---|"パイプラインへの<br/>ガバナンス組み込み"| DO
ITILHUB ---|"統制設計への<br/>入力として反映"| REG
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class P2,DO,REG box;
class ITILHUB hub;`,
  `flowchart TB
VS["ITIL Value System /<br/>Four Dimensions<br/>第5章"]
PAT["4つのガバナンスパターン<br/>Directive/Guided/<br/>Federated/Autonomous<br/>第2章"]
PERS["4つのガバナンス視点<br/>権限/倫理/データ/規制<br/>第4章"]
CAP["6C Capability Model<br/>第4章"]
IMP["ITIL AI Governance<br/>Improvement Model<br/>Assess-Design-Implement-Maintain<br/>第6・7章"]
MAT["ITIL Maturity Model /<br/>AI Governance Maturity<br/>Assessment 第5章"]
EXT["外部標準・規制<br/>EU AI Act/ISO42001/<br/>IEEE7014 第7・9章"]

VS --> CAP
CAP --> PERS
PAT --> IMP
PERS --> IMP
MAT --> IMP
EXT --> IMP
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class VS,PAT,PERS,CAP,MAT,EXT box;
class IMP hub;`,
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

  // S-4: Mermaid ダイアグラム契約（全14図解、原本ソースと順序・内容込みで完全一致）
  it("S-4: 14個のMermaid図解が原本のソースと順序・内容込みで完全一致し、ライトテーマ(theme='base')とthemeVariablesが設定されている", () => {
    const { container } = render(<Page />);
    const diagrams = container.querySelectorAll("[data-testid='mermaid']");
    expect(diagrams).toHaveLength(14);

    const actualSources = Array.from(diagrams).map((diagram) =>
      normalizeMermaidSource(diagram.textContent ?? "")
    );
    const expectedSources = EXPECTED_MERMAID_SOURCES.map((src) => normalizeMermaidSource(src));
    expect(actualSources).toEqual(expectedSources);

    for (const diagram of Array.from(diagrams)) {
      expect(diagram.getAttribute("data-theme")).toBe("base");
      expect(diagram.getAttribute("data-has-theme-vars")).toBe("true");
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
  it("D-3: page.module.css が本ページ限定で #site-freshness-bar を display: none !important で非表示化する", () => {
    const css = readFileSync(join(__dirname, "page.module.css"), "utf8");
    expect(css).toMatch(
      /:global\(body:has\(\[data-itil-ai-governance="true"\]\)\s*#site-freshness-bar\)\s*\{[^}]*display:\s*none\s*!important/s
    );
  });

  // D-4: レイアウトルート契約（黒線防止用）
  it("D-4: layout-root data-testid が付与されている", () => {
    const { container } = render(<Page />);
    const layoutRoot = container.querySelector("[data-testid='layout-root']");
    expect(layoutRoot).not.toBeNull();
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
