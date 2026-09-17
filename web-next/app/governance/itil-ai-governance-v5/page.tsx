import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "ITIL AI Governance (Version 5) 完全学習ガイド",
  description:
    "PeopleCert 認定資格 ITIL AI Governance (Version 5) の出題範囲（Module 1〜9）を初学者向けに体系的に解説した完全学習ガイド。6Cモデル、Assess-Design-Implement-Maintainモデル、各フレームワーク・規制との連携を網羅。",
};

const DIAGRAM_0 = `flowchart TB
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
class H done;`;

const DIAGRAM_1 = `flowchart LR
A["ツールとしてのAI<br/>(AI as a Tool)"] --> B["アシスタントとしてのAI<br/>(AI as an Assistant)"]
B --> C["同僚としてのAI<br/>(AI as a Co-worker)"]
C --> D["AI対応ワークフォース<br/>(AI-enabled Workforce)"]
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class A,B,C box;
class D done;`;

const DIAGRAM_2 = `flowchart TB
G["ガバナンス<br/>Governance<br/>(方向づけ・監督・説明責任)"] -->|"方針・境界を設定"| M["マネジメント<br/>Management<br/>(計画・実行・統制)"]
M -->|"実績・課題をフィードバック"| G
L["リーダーシップ<br/>Leadership<br/>(動機づけ・方向性への共感)"] -.->|"下支えする"| G
L -.->|"下支えする"| M
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class M,L box;
class G hub;`;

const DIAGRAM_3 = `flowchart TB
subgraph patterns["4つのガバナンスパターン"]
D1["Directive<br/>指示型<br/>厳格なルール・低い裁量"]
D2["Guided<br/>誘導型<br/>ガイドラインの範囲内で判断"]
D3["Federated<br/>連邦型<br/>中央方針＋部門ごとの裁量"]
D4["Autonomous<br/>自律型<br/>広い裁量・強い自己判断"]
end
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class D1,D2,D3,D4 box;`;

const DIAGRAM_4 = `flowchart LR
N["Narrow AI<br/>特化型AI<br/>単一タスクに特化<br/>例: 需要予測モデル"]
G["Generative AI<br/>生成AI<br/>コンテンツ・コードを新規生成<br/>例: チャットボット, コード生成"]
A["Agentic AI<br/>エージェント型AI<br/>目標達成のため自律的に<br/>複数ステップを実行"]

N -->|"自律性・複雑性が増す"| G --> A
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class N,G box;
class A hub;`;

const DIAGRAM_5 = `flowchart TB
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
class Hub hub;`;

const DIAGRAM_6 = `flowchart TB
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
class VAL done;`;

const DIAGRAM_7 = `flowchart LR
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
class CENTER hub;`;

const DIAGRAM_8 = `flowchart LR
A["Assess<br/>アセス<br/>現状のガバナンス成熟度を<br/>評価し、ストレステストする"] --> B["Design<br/>デザイン<br/>ガバナンス要件を定義し、<br/>統制・調整策を設計する"]
B --> C["Implement<br/>インプリメント<br/>ガバナンスの調整策を<br/>導入する"]
C --> D["Maintain<br/>メンテイン<br/>監視・保証・継続的改善を<br/>通じて維持する"]
D -.->|"継続的なフィードバック"| A
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class A,B,C,D hub;`;

const DIAGRAM_9 = `flowchart LR
subgraph timeline["時間軸で見た統制の役割"]
P["Preventive<br/>予防的統制<br/>問題の発生を未然に防ぐ"]
DT["Detective<br/>発見的統制<br/>発生した問題を検知する"]
CR["Corrective<br/>是正的統制<br/>検知した問題を修正する"]
end
P -->|"発生前"| DT -->|"発生後"| CR
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class P,DT,CR box;`;

const DIAGRAM_10 = `flowchart TB
IMP["Implement<br/>導入"] --> OBS["Observability<br/>可観測性の確保"]
OBS --> MON["Monitoring<br/>継続的な監視"]
MON --> AUD["Auditability<br/>監査可能性の担保"]
AUD --> ASSU["Assurance Evidence Pack<br/>保証のためのエビデンス収集"]
ASSU -->|"改善点をフィードバック"| IMP
classDef box fill:#EEF1F8,stroke:#2E3F72,color:#161B26;
classDef hub fill:#FAF1DF,stroke:#B8802A,color:#161B26;
classDef done fill:#EAF4EC,stroke:#2F6B3D,color:#161B26;
class IMP,OBS,MON,AUD box;
class ASSU done;`;

const DIAGRAM_11 = `flowchart TB
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
class ASS,DES,IMPL,MAI hub;`;

const DIAGRAM_12 = `flowchart TB
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
class ITILHUB hub;`;

const DIAGRAM_13 = `flowchart TB
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
class IMP hub;`;

export default function ItilAiGovernancePage() {
  return (
    <div className={styles.layout}>
      {/* 外部フォント & アイコン */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/source-serif-4@5.3.0/index.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/source-serif-4@5.3.0/600.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/source-serif-4@5.3.0/700.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.3.0/index.css"
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.3.0/500.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.3.0/600.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.3.0/700.css" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.46.0/dist/tabler-icons.min.css"
      />

      <TocObserver />

      <div className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: 原本再現のため */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="19" stroke="#2E3F72" strokeWidth="1.5" fill="#F6F7F9" />
            <circle cx="20" cy="20" r="14" stroke="#B8802A" strokeWidth="1" fill="none" />
            <path
              d="M20 10 L23 18 L31 18 L24.5 23 L27 31 L20 26 L13 31 L15.5 23 L9 18 L17 18 Z"
              fill="#2E3F72"
              opacity="0.85"
            />
          </svg>
          <div className={styles.brandText}>
            ITIL AI Governance
            <br />
            (Version 5)
            <div className={styles.brandSub}>完全学習ガイド</div>
          </div>
        </div>
        <nav className={styles.toc} data-testid="toc">
          <a href="#この教材について">この教材について</a>
          <a href="#第1章-AI-の世界と-AI-ガバナンスの必要性">
            第1章: AI の世界と AI ガバナンスの必要性
          </a>
          <a href="#第2章-ガバナンスの基本概念">第2章: ガバナンスの基本概念</a>
          <a href="#第3章-AI-の基本概念とガバナンスが必要な理由">
            第3章: AI の基本概念とガバナンスが必要な理由
          </a>
          <a href="#第4章-ITIL-AI-Capability-Model-6C-とリスク-戦略">
            第4章: ITIL AI Capability Model（6C）とリスク・戦略
          </a>
          <a href="#第5章-ガバナンスツールキットとしての-ITIL">
            第5章: ガバナンスツールキットとしての ITIL
          </a>
          <a href="#第6章-ITIL-AI-Governance-Improvement-Model-Assess-Design">
            第6章: ITIL AI Governance Improvement Model — Assess ＆ Design
          </a>
          <a href="#第7章-ITIL-AI-Governance-Improvement-Model-Implement-Maintain">
            第7章: ITIL AI Governance Improvement Model — Implement ＆ Maintain
          </a>
          <a href="#第8章-自分の役割-業界で-AI-を活かす">第8章: 自分の役割・業界で AI を活かす</a>
          <a href="#第9章-他のフレームワーク-規制-標準との連携">
            第9章: 他のフレームワーク・規制・標準との連携
          </a>
          <a href="#第10章-試験対策まとめと用語集">第10章: 試験対策まとめと用語集</a>
          <a href="#参考文献-出典一覧">参考文献・出典一覧</a>
        </nav>
      </div>
      <div className={styles.main}>
        <div className={styles.prose}>
          <h1>ITIL AI Governance (Version 5) 完全学習ガイド</h1>
          <h3 className={styles.subtitle}>
            初学者向け ステップバイステップ解説 + ベストプラクティス集
          </h3>
          <hr className={styles.divider} />
          <h2 id="この教材について">この教材について</h2>
          <p>
            このガイドは、PeopleCert 認定資格
            <strong>ITIL AI Governance (Version 5)</strong> の出題範囲を、初めて AI
            ガバナンスを学ぶ方にもわかりやすいように、公式カリキュラム（Module
            1〜9）の順に沿って解説したものです。各章は次の3部構成になっています。
          </p>
          <ol>
            <li>
              <strong>概念解説</strong> — 専門用語（英語表記を保持）を丁寧に噛み砕いて説明
            </li>
            <li>
              <strong>ベストプラクティス</strong> — 実務でその概念をどう活かすかの具体的な指針
            </li>
            <li>
              <strong>ソース</strong> — 主張の根拠となる一次情報・公式情報源の URL
            </li>
          </ol>
          <div
            className={`${styles.callout} ${styles.note}`}
            data-testid="callout"
            data-variant="note"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-info-circle" />
              <span>補足</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                <strong>注記:</strong> ITIL AI Governance (Version 5) は PeopleCert
                が管理する商用資格であり、公式教材（Official eBook / Learning Resource
                Kit）は有償です。本ガイドは公式サイト・公式認定トレーニングパートナー（ATO）が公開しているシラバス情報をもとに作成した学習補助教材であり、公式教材の代替ではありません。試験直前は必ず公式
                eBook を参照してください。
              </p>
            </div>
          </div>
          <h3>資格の基本情報（試験概要）</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>項目</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>認定団体</td>
                <td>PeopleCert</td>
              </tr>
              <tr>
                <td>ITIL 資格体系における位置づけ</td>
                <td>
                  ITIL (Version 5) の<strong>唯一の拡張モジュール (Extension Module)</strong>
                  。Foundation / Managing Professional / Practice Manager / Strategic Leader
                  のいずれの必須パスウェイにも属さないスタンドアロン資格
                </td>
              </tr>
              <tr>
                <td>前提条件</td>
                <td>
                  <strong>なし</strong>（ITIL Foundation 未取得でも受験可能）
                </td>
              </tr>
              <tr>
                <td>出題数</td>
                <td>40問</td>
              </tr>
              <tr>
                <td>出題形式</td>
                <td>
                  多肢選択式（Multiple Choice）、シナリオベース（"ITIL Car Rental Scenario"
                  と呼ばれる想定シナリオを用いる）
                </td>
              </tr>
              <tr>
                <td>試験時間</td>
                <td>90分（非英語ネイティブ受験者には追加時間あり）</td>
              </tr>
              <tr>
                <td>参照</td>
                <td>オープンブック（公式 eBook・シナリオブックレットの参照可）</td>
              </tr>
              <tr>
                <td>合格点</td>
                <td>70%（40問中28問正解）</td>
              </tr>
              <tr>
                <td>Bloom's Taxonomy レベル</td>
                <td>BL2（理解）、BL3（適用）、BL4（分析）が中心</td>
              </tr>
              <tr>
                <td>資格更新</td>
                <td>
                  3年ごと。次のいずれかで更新できる。(A)
                  同一プロダクトスイート（ITIL）の別資格を取得する、(B)
                  同じ資格の試験を再受験して合格する、(C) 3年間連続で毎年 20 CPD ポイント（合計 60
                  ポイント）を PeopleCert アカウントに記録する
                </td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-ai-governance-version-5-4234"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PeopleCert 公式製品ページ
                </a>
                ,
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コース概要
                </a>
                ,{" "}
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB コース概要
                </a>
              </p>
            </div>
          </div>
          <h3>全体像（この資格で学ぶ主要モデル）</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_0} />
          </div>
          <hr className={styles.divider} />
          <h2 id="第1章-AI-の世界と-AI-ガバナンスの必要性">
            第1章: AI の世界と AI ガバナンスの必要性
          </h2>
          <p>
            <em>(Module 1: The AI World and the Need for AI Governance)</em>
          </p>
          <h3>1-1. なぜ今 AI ガバナンスが必要なのか</h3>
          <p>
            生成AI・エージェント型AIの普及により、組織の意思決定・業務運用・サービス提供の多くの場面で
            AI が関与するようになりました。PeopleCert の公式紹介ページによれば、GenAI
            に投資した組織の
            <strong>95%が投資対効果（ROI）を実感できていない</strong>、専門職の
            <strong>
              46%が機密情報や知的財産を一般公開の AI プラットフォームにアップロードしたことがある
            </strong>
            、そして仕事の <strong>50%が AI によって形を変える</strong>と見込まれています。一方で AI
            スキルを持つ専門職には
            <strong>56%の給与プレミアム</strong>がつくというデータもあります。つまり「AI
            を使えること」と「AI
            を安全に統治（ガバナンス）できること」は別の能力であり、後者の需要が急速に高まっているというのが、この資格が新設された背景です。
          </p>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-ai-governance-version-5-4234"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PeopleCert 公式ページ「Why certify now」
                </a>
              </p>
            </div>
          </div>
          <h3>1-2. AI がもたらす機会と脅威</h3>
          <p>
            Module 1 では、まず「AI opportunities and threats（AIの機会と脅威）」を整理し、AI
            が職場をどう変えつつあるか、そして実際に
            <strong>AI が誤作動・誤用された事例（When AI goes wrong）</strong>
            から何を学ぶべきかを扱います。ここでの狙いは、AI
            を「魔法の道具」としてではなく、統治対象となる
            <strong>能力（Capability）の集合体</strong>として捉え直すことです。
          </p>
          <h3>1-3. AI 統治の成熟度スペクトラムと「ガバナンスギャップ」</h3>
          <p>
            多くの組織では、AI
            利用は現場主導で先行し、統治（ガバナンス）の整備が後追いになりがちです。この「ガバナンスの空白（governance
            gap）」こそが、ITIL AI Governance が対応しようとしている中心課題です。AGILEPM HUB
            のコース資料では、組織における AI の役割は次のように段階的に進化すると説明されています。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_1} />
          </div>
          <p>
            この進行に伴って必要な統治の水準（人間の監督範囲、意思決定権限の委譲範囲など）も段階的に変化していきます。
            <strong>
              AI
              が「同僚」や「ワークフォースの一員」に近づくほど、事前に定義された裁量の境界（decision
              boundaries）と、逸脱を検知する仕組みが不可欠になる
            </strong>
            、というのが本章の重要な着眼点です。
          </p>
          <h3>1-4. 「良いガバナンス」の6つの特性</h3>
          <p>
            Module 1 では「良いAIガバナンスとは何か（What good looks like）」として、6つの特性（six
            characteristics of good AI
            governance）が導入されます。文献上、厳密な6項目の公式名称までは一般公開情報からは確認できませんが、複数の公式トレーニングパートナー資料に一貫して現れる要素を整理すると、次の観点で評価されることが分かります。
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>観点</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>説明責任（Accountability）</td>
                <td>誰が AI の判断・結果に責任を持つかが明確</td>
              </tr>
              <tr>
                <td>透明性（Transparency）</td>
                <td>AI がなぜその出力を出したか説明できる</td>
              </tr>
              <tr>
                <td>比例性（Proportionality）</td>
                <td>リスクの大きさに見合った統制のみを課す（過剰統制も過小統制も避ける）</td>
              </tr>
              <tr>
                <td>適応性（Adaptability）</td>
                <td>AI 技術の進化・利用状況の変化に合わせて統治を更新できる</td>
              </tr>
              <tr>
                <td>人間中心性（Human-centricity）</td>
                <td>重要な判断において人間が実質的な関与を保持する</td>
              </tr>
              <tr>
                <td>価値創出との両立（Value alignment）</td>
                <td>統制がイノベーションを不必要に阻害しない</td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  AI
                  導入の初期段階から「誰が承認するか」「何が失敗の兆候か」を定義し、後追いでガバナンスを足そうとしない。
                </li>
                <li>
                  「AI
                  ポリシーがある」ことと「実効性のあるガバナンスがある」ことは別物と認識する。ポリシー文書の存在は統治の証明にはならない。
                </li>
                <li>
                  過去の AI
                  インシデント事例（自社・他社問わず）を定期的にレビューし、「何が事前にあれば防げたか」を組織の学習材料にする。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 1)
                </a>
                ,
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 1)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第2章-ガバナンスの基本概念">第2章: ガバナンスの基本概念</h2>
          <p>
            <em>(Module 2: Key Concepts of Governance)</em>
          </p>
          <h3>2-1. ガバナンス・マネジメント・リーダーシップの違い</h3>
          <p>
            初学者が最も混同しやすいのが「ガバナンス（governance）」「マネジメント（management）」「リーダーシップ（leadership）」の違いです。
          </p>
          <ul>
            <li>
              <strong>ガバナンス（Governance）</strong>:
              方向性を定め、監督し、説明責任の枠組みを設定する活動。「何をすべきで、何をしてはいけないか」の境界線を引く。
            </li>
            <li>
              <strong>マネジメント（Management）</strong>:
              ガバナンスが定めた方針の範囲内で、日々の計画・実行・統制を行う活動。
            </li>
            <li>
              <strong>リーダーシップ（Leadership）</strong>:
              人を動機づけ、方向性への共感を生み出す活動。ガバナンスにもマネジメントにも通底する。
            </li>
          </ul>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_2} />
          </div>
          <p>
            さらに本章では、<strong>コーポレートガバナンス（企業全体の統治）</strong>、
            <strong>ITガバナンス（IT資源の統治）</strong>、
            <strong>AIガバナンス（AI能力に特化した統治）</strong>
            の関係が整理されます。AI ガバナンスは IT ガバナンスの単なる一部ではなく、AI
            特有の性質（自律性・学習性・不透明性）に対応する<strong>専用の統治レイヤー</strong>
            として位置づけられます。これが「なぜ従来の IT ガバナンスだけでは不十分なのか（Why IT
            governance is insufficient）」という、後の Module 6 につながる重要な伏線です。
          </p>
          <h3>2-2. AI ガバナンスシステムの6つの構成要素</h3>
          <p>
            Module 2 では「AI ガバナンスシステムの6つの構成要素（six components of the AI governance
            system）」が導入されます。これは、統治を「単発のルール」ではなく「相互に連動する仕組み（システム）」として設計する考え方です。
          </p>
          <h3>2-3. 4つのガバナンスパターン</h3>
          <p>
            ITIL AI Governance のシラバスで特に重要なのが、
            <strong>4つのガバナンスパターン（four governance patterns）</strong>
            です。これは「誰が・どの程度の裁量を持って AI
            の意思決定を行うか」を分類する枠組みで、複数の公式トレーニングパートナー資料で一貫して次の4種類として説明されています。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_3} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>パターン</th>
                <th>特徴</th>
                <th>適した状況の例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Directive（指示型）</strong>
                </td>
                <td>明確なルールと承認プロセスに厳密に従う。裁量の余地が最も小さい</td>
                <td>規制産業・高リスクな意思決定（与信判断など）</td>
              </tr>
              <tr>
                <td>
                  <strong>Guided（誘導型）</strong>
                </td>
                <td>ガイドラインや原則の範囲内で現場が判断する</td>
                <td>中程度のリスクを伴う定型業務の自動化</td>
              </tr>
              <tr>
                <td>
                  <strong>Federated（連邦型）</strong>
                </td>
                <td>
                  全社共通の方針は中央が設定しつつ、実装や運用の裁量は各部門・各事業単位に委ねる
                </td>
                <td>複数事業部を持つ大規模組織でのAI展開</td>
              </tr>
              <tr>
                <td>
                  <strong>Autonomous（自律型）</strong>
                </td>
                <td>定義された境界の中で AI／チームが高い自律性を持って判断する</td>
                <td>迅速な意思決定が価値創出に直結する、成熟度の高い領域</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>エージェント型 AI（Agentic AI）</strong>
            はこの分類に強い緊張をもたらします。エージェントが自律的に複数ステップの行動を実行できるようになるほど、「委任された権限（delegated
            authority）」がどこまで安全かをストレステストする必要が生じます（Module 6 で再登場）。
          </p>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  全社で単一のガバナンスパターンに固定するのではなく、
                  <strong>AI ユースケースのリスクレベルに応じてパターンを使い分ける</strong>。
                </li>
                <li>
                  Federated
                  パターンを採用する場合は、「中央が譲らない最低限のガードレール」と「現場に委ねる裁量」を文書で明確に切り分ける。
                </li>
                <li>
                  Autonomous パターンを許可する前に、必ず Directive／Guided
                  パターンでの運用実績（トラックレコード）を積む段階的アプローチを取る。
                </li>
              </ul>
            </div>
          </div>
          <h3>2-4. ガバナンスが確保するもの</h3>
          <p>
            本章の締めくくりとして、「ガバナンスが何を確保するか（What governance
            ensures）」が次の6要素として整理されます:
          </p>
          <ul>
            <li>
              <strong>統制（Control）</strong>
            </li>
            <li>
              <strong>リスク管理（Risk management）</strong>
            </li>
            <li>
              <strong>コンプライアンス（Compliance）</strong>
            </li>
            <li>
              <strong>説明責任（Accountability）</strong>
            </li>
            <li>
              <strong>スチュワードシップ（Stewardship）</strong>
            </li>
            <li>
              <strong>価値創出（Value creation）</strong>
            </li>
          </ul>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 2)
                </a>
                ,
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 2)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第3章-AI-の基本概念とガバナンスが必要な理由">
            第3章: AI の基本概念とガバナンスが必要な理由
          </h2>
          <p>
            <em>(Module 3: Key Concepts of AI and Why We Need AI Governance)</em>
          </p>
          <h3>3-1. AI の3つのタイプ</h3>
          <p>ITIL AI Governance では AI を大きく3つのタイプに分類します。</p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_4} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>タイプ</th>
                <th>特徴</th>
                <th>ガバナンス上の主な論点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Narrow AI</strong>（特化型）
                </td>
                <td>定義された1つのタスクを高精度でこなす。予測・分類など</td>
                <td>精度低下・バイアスの監視</td>
              </tr>
              <tr>
                <td>
                  <strong>Generative AI</strong>（生成）
                </td>
                <td>新しいテキスト・画像・コードなどを生成する</td>
                <td>ハルシネーション、著作権、出力の事実確認</td>
              </tr>
              <tr>
                <td>
                  <strong>Agentic AI</strong>（エージェント型）
                </td>
                <td>目標に対して自律的に計画・実行・ツール利用を行う</td>
                <td>権限の逸脱、意図しない連鎖行動、ロールバックの可否</td>
              </tr>
            </tbody>
          </table>
          <h3>3-2. AI の主要な特性</h3>
          <p>AI を統治対象として扱う上で重要な3つの特性が定義されます。</p>
          <ul>
            <li>
              <strong>自律性（Autonomy）</strong>: 人間の介入なしにどこまで判断・行動できるか
            </li>
            <li>
              <strong>学習性・適応性（Learning and adaptability）</strong>:
              運用中にモデルやふるまいがどう変化しうるか（モデルドリフトの温床）
            </li>
            <li>
              <strong>不透明性（Opacity）</strong>:
              内部の意思決定プロセスがどれだけ説明可能か（ブラックボックス性）
            </li>
          </ul>
          <p>
            この3特性が高くなるほど、統治の難易度は上がります。特に <strong>Agentic AIOps</strong>
            （AI エージェントを IT
            オペレーションに組み込む活用）に関しては、次のようなガバナンス上の問いが明示的に検討課題として挙げられます。
          </p>
          <ul>
            <li>どのアクションを AI に許可するか（permitted actions）</li>
            <li>何を明示的に除外するか（exclusions）</li>
            <li>人間による上書き（override）はどのような条件で発動するか</li>
            <li>すべての行動がログに残る仕組みになっているか（logging）</li>
            <li>結果責任は誰が負うか（accountability）</li>
            <li>継続的な監視の仕組み（monitoring）</li>
            <li>想定外の挙動時に安全に後退できるか（rollback）</li>
          </ul>
          <h3>3-3. AI の主なリスクカテゴリ</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>リスクカテゴリ</th>
                <th>内容</th>
                <th>具体例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>バイアス（Bias）</td>
                <td>学習データや設計に起因する不公平な出力</td>
                <td>採用選考AIが特定属性を不利に扱う</td>
              </tr>
              <tr>
                <td>プライバシー（Privacy）</td>
                <td>個人情報・機密情報の不適切な取り扱い</td>
                <td>学習データへの機密情報混入、出力への漏洩</td>
              </tr>
              <tr>
                <td>ハルシネーション（Hallucination）</td>
                <td>もっともらしいが事実に基づかない出力</td>
                <td>存在しない社内規定をチャットボットが回答</td>
              </tr>
              <tr>
                <td>不透明性（Opacity）</td>
                <td>判断根拠が説明できない</td>
                <td>与信・人事判断で理由開示ができない</td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  AI 導入前に必ず「この AI はどのタイプか（Narrow / Generative /
                  Agentic）」を明示し、タイプごとに異なる統制セットを適用する。
                </li>
                <li>
                  Agentic AI
                  を業務に組み込む際は、上記7つの統治上の問い（許可行動・除外・上書き・ログ・責任・監視・ロールバック）を
                  <strong>導入前チェックリスト</strong>として文書化する。
                </li>
                <li>
                  AI
                  の価値評価は「成果（outcomes）」「コスト（costs）」「リスク（risks）」の3軸で行い、性能指標だけで導入判断をしない。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 3)
                </a>
                ,
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 3)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第4章-ITIL-AI-Capability-Model-6C-とリスク-戦略">
            第4章: ITIL AI Capability Model（6C）とリスク・戦略
          </h2>
          <p>
            <em>(Module 4: Risk, Strategy, and the Consequences of Getting It Wrong)</em>
          </p>
          <h3>4-1. 6C モデルとは</h3>
          <p>
            <strong>ITIL AI Capability Model（通称「6C モデル」）</strong>は、ITIL (Version 5) の
            Four Dimensions のうち「Information and Technology」次元に新設された枠組みで、AI
            システムが<strong>何をしているか</strong>を6つの機能カテゴリで分類します。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_5} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>能力 (Capability)</th>
                <th>説明</th>
                <th>ITSM での典型例</th>
                <th>一般的なリスクの傾向</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Creation</strong>（創出）
                </td>
                <td>新しいコンテンツ・コード・文書を生成する</td>
                <td>コード生成、ナレッジ記事の自動作成</td>
                <td>ハルシネーション、著作権・ライセンス</td>
              </tr>
              <tr>
                <td>
                  <strong>Curation</strong>（キュレーション）
                </td>
                <td>既存データの重複排除、品質・関連性の向上</td>
                <td>重複インシデントのマージ、CMDBのクレンジング</td>
                <td>データ品質の誤判定</td>
              </tr>
              <tr>
                <td>
                  <strong>Clarification</strong>（明確化）
                </td>
                <td>複雑な内容を要約し、利用者の理解を助ける</td>
                <td>長大なインシデントチケットの要約</td>
                <td>要約による重要情報の欠落</td>
              </tr>
              <tr>
                <td>
                  <strong>Cognition</strong>（認知）
                </td>
                <td>パターン検出・予測・異常の早期発見</td>
                <td>障害予兆検知、キャパシティ予測</td>
                <td>誤検知・見逃し、説明可能性の不足</td>
              </tr>
              <tr>
                <td>
                  <strong>Communication</strong>（コミュニケーション）
                </td>
                <td>自然言語での対話インターフェース</td>
                <td>チャットボット、バーチャルアシスタント</td>
                <td>過信を招く擬人化、感情的な誤誘導</td>
              </tr>
              <tr>
                <td>
                  <strong>Coordination</strong>（調整）
                </td>
                <td>複数のタスク・エージェント・システム間の連携</td>
                <td>マルチエージェントによる自動復旧オーケストレーション</td>
                <td>連鎖的な誤動作、権限の意図しない拡大</td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.note}`}
            data-testid="callout"
            data-variant="note"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-info-circle" />
              <span>補足</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                <strong>なぜ Communication に IEEE 7014-2024 が関係するのか</strong>
              </p>
              <p>
                Communication 能力を持つ AI（チャットボット等）が人間の共感を模倣（emulated
                empathy）する場合、利用者に過剰な信頼や誤解を与えるリスクがあります。この倫理的配慮を扱う外部標準として
                <strong>IEEE 7014-2024</strong>
                （自律・知能システムにおける模倣共感の倫理的配慮に関する標準）が、ITIL AI Governance
                のシラバスで参照標準の一つとして挙げられています（詳細は第7章・第9章）。
              </p>
            </div>
          </div>
          <h3>4-2. 能力がガバナンスの境界をどう形づくるか</h3>
          <p>
            6C の各能力は、リスクの種類・大きさが異なるため、
            <strong>統治の境界線（governance boundaries）</strong>
            もそれぞれ異なります。例えば、同じ「AIチャットボット」でも、単純な FAQ
            回答（Communication
            のみ）と、そこから自動でチケットをクローズしたりシステム変更を実行したりする機能（Communication
            + Coordination の組み合わせ）とでは、必要な統制の強度が全く異なります。
            <strong>
              複数の能力が組み合わさるほど、リスクは単純な足し算ではなく複合的に増大する
            </strong>
            という考え方（combined behavior）が重要です。
          </p>
          <h3>4-3. 4つの AI ガバナンス視点（Four AI Governance Perspectives）</h3>
          <p>
            6C モデルで「何を統治するか」を特定したら、次に「どの側面から統治するか」を定める視点が
            <strong>4つの AI ガバナンス視点</strong>
            です。情報源によって表現の粒度に多少の違いがありますが、一貫して次の4テーマとして説明されています。
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>視点</th>
                <th>主な問い</th>
                <th>具体的な統制の例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>意思決定権限とリスク管理</strong>
                  <br />
                  (Decision authority &amp; risk management)
                </td>
                <td>誰が自律的なAI行動を承認するか</td>
                <td>自動エスカレーション、修復スクリプト実行の承認フロー</td>
              </tr>
              <tr>
                <td>
                  <strong>倫理原則</strong>
                  <br />
                  (Ethical principles)
                </td>
                <td>バイアス・説明可能性・組織の価値観との整合は取れているか</td>
                <td>バイアステスト、判断の説明可能性(explainability)確保</td>
              </tr>
              <tr>
                <td>
                  <strong>データガバナンスとパフォーマンス管理</strong>
                  <br />
                  (Data Governance &amp; Performance Management)
                </td>
                <td>学習データの妥当性・モデルの劣化をどう監視するか</td>
                <td>学習データの監視、モデルドリフトの追跡、再学習の精度閾値設定</td>
              </tr>
              <tr>
                <td>
                  <strong>規制コンプライアンスと運用標準</strong>
                  <br />
                  (Regulatory Compliance &amp; Operational Standards)
                </td>
                <td>適用される規制は何か、リスク分類にどう対応するか</td>
                <td>EU AI Act のリスクレベル分類へのマッピング</td>
              </tr>
            </tbody>
          </table>
          <p>
            これら4つの視点は独立ではなく<strong>相互依存的（interdependent）</strong>
            です。例えば、倫理原則で定めた透明性要件が、規制コンプライアンス（EU AI Act
            の説明可能性要件）と直接結びつくように、視点をまたいだ整合性の確保が重要になります。
          </p>
          <h3>4-4. リスクから対策へ（From risks to countermeasures）</h3>
          <p>
            Module 4 では、AI
            リスクカテゴリ（バイアス・プライバシー・ハルシネーション・不透明性など）を「
            <strong>AI capability risk heatmap</strong>」として 6C
            モデルに重ね合わせ、どの能力がどのリスクに特に晒されやすいかを可視化する考え方が導入されます。そのうえで、リスクごとに倫理原則と具体的な対策（countermeasure）を対応づけます。
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>リスク</th>
                <th>関連する倫理原則</th>
                <th>代表的な対策例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>バイアス</td>
                <td>公平性（Fairness）</td>
                <td>多様なテストデータでのバイアス検証、定期監査</td>
              </tr>
              <tr>
                <td>プライバシー</td>
                <td>データ最小化・機密保持</td>
                <td>アクセス制御、匿名化、機密情報のマスキング</td>
              </tr>
              <tr>
                <td>ハルシネーション</td>
                <td>正確性・誠実性</td>
                <td>根拠提示の強制（RAGなど）、人間によるファクトチェック</td>
              </tr>
              <tr>
                <td>不透明性</td>
                <td>説明可能性</td>
                <td>モデルカードの整備、判断根拠のログ化</td>
              </tr>
            </tbody>
          </table>
          <h3>4-5. Shadow AI（シャドーAI）と戦略への影響</h3>
          <p>
            現場が正式な承認なしに独自に AI ツールを導入・利用する「<strong>Shadow AI</strong>
            」は、機密情報漏洩やコンプライアンス違反の温床になります。Module 4 では、Shadow AI
            が組織の戦略的な整合性（strategy and alignment）をどう損なうかが扱われ、これは Module
            6・7 で扱う「Shadow AI 統制の設計」に直結します。
          </p>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  新しい AI ユースケースを評価する際は、必ず「どの 6C
                  能力を組み合わせているか」を最初に特定し、能力の組み合わせごとにリスクレビューを行う。
                </li>
                <li>
                  4つのガバナンス視点（意思決定権限／倫理／データ／規制）を
                  <strong>チェックリスト化</strong>し、AI 導入の承認プロセスに組み込む。
                </li>
                <li>
                  Shadow AI を「禁止」するだけでなく、「なぜ現場が正規プロセス外で AI
                  を使うのか」（速度・使い勝手の不足など）を可視化し、正規ルートを魅力的にする。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 4)
                </a>
                ,{" "}
                <a
                  href="https://itcko.sk/en/itil-v5-ai-governance-module/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  itcko.sk 解説記事
                </a>
                ,
                <a
                  href="https://www.pmgacademy.com/en/articles/itil/information-and-technology-in-itil-version-5-the-guide-for-the-ai-era-and-data-governance/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PMG Academy 6C モデル解説
                </a>
                ,{" "}
                <a
                  href="https://standards.ieee.org/ieee/7014/7648/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IEEE 7014-2024
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第5章-ガバナンスツールキットとしての-ITIL">
            第5章: ガバナンスツールキットとしての ITIL
          </h2>
          <p>
            <em>(Module 5: ITIL as a Governance Toolkit)</em>
          </p>
          <h3>5-1. ITIL Value System と価値の共創</h3>
          <p>
            ITIL (Version 5) では、従来の「Service Value System」が
            <strong>ITIL Value System（ITIL VS）</strong>
            に発展的に改称されました。プロダクトやサービスの利用を通じて、組織と顧客が共同で価値を生み出す「価値の共創（value
            co-creation）」という考え方の中に、ガバナンスが明示的に組み込まれています。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_6} />
          </div>
          <h3>5-2. ITIL Product and Service Lifecycle Model と AI</h3>
          <p>
            旧来の「Service Value Chain」に相当する概念が、v5 では
            <strong>ITIL Product and Service Lifecycle Model</strong>
            として再構成されています。AI（特に 6C の各能力）は、このライフサイクルの
            <strong>あらゆる段階</strong>
            を支援しうるとされ、例えば計画段階での需要予測（Cognition）、設計段階でのコード生成（Creation）、運用段階でのインシデント要約（Clarification）などが該当します。重要なのは、
            <strong>
              AI ガバナンスはライフサイクルの一部の段階だけでなく、全段階に一貫して適用される
            </strong>
            という考え方です。
          </p>
          <h3>5-3. ITIL Guiding Principles（指針となる7つの原則）</h3>
          <p>ITIL の7つの指針原則は AI ガバナンスにもそのまま適用されます。</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>原則</th>
                <th>AI ガバナンスへの適用例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>価値に着目する (Focus on value)</td>
                <td>統制の強度を、AIが生む価値とリスクに比例させる</td>
              </tr>
              <tr>
                <td>現在地から始める (Start where you are)</td>
                <td>既存の IT ガバナンス資産（変更管理など）を土台に AI 統制を拡張する</td>
              </tr>
              <tr>
                <td>フィードバックを伴い反復的に進める (Progress iteratively with feedback)</td>
                <td>小規模なパイロットでガバナンスを検証してから全社展開する</td>
              </tr>
              <tr>
                <td>協働し、可視性を高める (Collaborate and promote visibility)</td>
                <td>Shadow AI を減らすため、AI 利用状況を組織横断で可視化する</td>
              </tr>
              <tr>
                <td>全体的に考え、働く (Think and work holistically)</td>
                <td>単一システムだけでなく、サプライヤー・データ・利用者を含めて統治する</td>
              </tr>
              <tr>
                <td>シンプルかつ実践的に保つ (Keep it simple and practical)</td>
                <td>過剰なプロセスでイノベーションを阻害しない、比例的な統制を選ぶ</td>
              </tr>
              <tr>
                <td>最適化し自動化する (Optimize and automate)</td>
                <td>ガバナンス自体（監視・監査ログ収集等）も自動化・効率化する</td>
              </tr>
            </tbody>
          </table>
          <h3>5-4. ITIL Four Dimensions と AI</h3>
          <p>
            ITIL (Version 5) では Four Dimensions（4つの側面）のうち、次の2つに AI
            関連の内容が明示的に追加されています。次元の名称自体は ITIL 4 から変わっておらず、AI
            は各次元の中の節（例: 「Organizations, people and AI」）として扱われます。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_7} />
          </div>
          <ul>
            <li>
              <strong>Organizations and People</strong>: 「Organizations, people and
              AI」の節が追加され、AI
              が組織構造・人材のスキルセット・役割分担にどう影響するかを扱う次元。AI
              ガバナンスの人的側面（誰が何に責任を持つか）はここに位置づけられます。
            </li>
            <li>
              <strong>Information and Technology</strong>: 6C モデル（ITIL AI Capability
              Model）が組み込まれている次元。技術的な能力分類の土台です。
            </li>
          </ul>
          <h3>5-5. ITIL Maturity Model と AI Governance Maturity Assessment</h3>
          <p>
            ITIL Maturity Model
            は、組織のサービスマネジメント実践の成熟度を評価する仕組みです。Version 5 ではこれを AI
            に特化させた <strong>AI Governance Maturity Assessment</strong> が導入され、組織が「AI
            ガバナンスのどの成熟段階にいるか」を診断できるようになっています。この診断結果は、第6章で扱う
            Improvement Model の「Assess（評価）」ステップの出発点になります。
          </p>
          <h3>5-6. Continual Improvement Model と Transformation Model</h3>
          <ul>
            <li>
              <strong>ITIL Continual Improvement Model</strong>: 「ビジョンは何か → 現在地はどこか →
              どこを目指すか → どう到達するか → 行動する → 維持できたか」というサイクルを回す、ITIL
              全体で共通の継続的改善の型。AI ガバナンスの成熟度向上にもそのまま適用されます。
            </li>
            <li>
              <strong>ITIL Transformation Model</strong>: Version 5
              で新設された、組織的な変革（トランスフォーメーション）を扱うモデル。AI
              導入がしばしば業務プロセスや組織構造の変革を伴うことから、AI
              ガバナンスの実装を「変革プロジェクト」として捉える視点を提供します（変革への備え、transformation
              readiness、を含む）。
            </li>
          </ul>
          <h3>5-7. サステナビリティと AI の価値</h3>
          <p>
            AI の価値評価には、環境負荷（計算資源の消費など）を含む
            <strong>サステナビリティ（持続可能性）</strong>の観点も明示的に含まれます。AI 導入の ROI
            を測る際は、経済的価値だけでなく環境・社会的な持続可能性も検討要素とすることが求められます。
          </p>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  新規 AI ユースケースの企画書には、必ず「ITIL Guiding Principles
                  のどれに合致するか」を明記する欄を設け、思考の一貫性を担保する。
                </li>
                <li>
                  AI Governance Maturity Assessment を年1回など定期的に実施し、Continual Improvement
                  Model のサイクルに組み込む。
                </li>
                <li>
                  AI導入の価値評価に、計算コスト・エネルギー消費などのサステナビリティ指標を KPI
                  として加える。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 5)
                </a>
                ,
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 5)
                </a>
                ,
                <a
                  href="https://itsm.tools/itil-version-5-vs-itil-4-key-changes/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITIL (Version 5) の変更点まとめ
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第6章-ITIL-AI-Governance-Improvement-Model-Assess-Design">
            第6章: ITIL AI Governance Improvement Model — Assess ＆ Design
          </h2>
          <p>
            <em>(Module 6)</em>
          </p>
          <h3>6-1. なぜ専用モデルが必要か</h3>
          <p>
            第2章で触れたとおり、従来の IT ガバナンスの枠組みだけでは AI
            特有の自律性・学習性・不透明性に対応しきれません。
            <strong>ITIL AI Governance Improvement Model</strong>
            は、AI
            ガバナンスを一過性の対応ではなく、継続的に評価・調整するための4ステップの改善サイクルとして提供します。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_8} />
          </div>
          <p>
            本章（Module 6）では前半の <strong>Assess</strong> と<strong>Design</strong>{" "}
            を扱い、第7章（Module 7）で後半の <strong>Implement</strong> と<strong>Maintain</strong>{" "}
            を扱います。
          </p>
          <h3>6-2. Assess（評価・ストレステスト）ステップ</h3>
          <p>
            このステップの目的は、「現在のガバナンスがどこまで通用し、どこで破綻するか（breaking
            points）」を明らかにすることです。
          </p>
          <ul>
            <li>
              <strong>ガバナンスのベースライン化</strong>:
              現行の統制・承認フロー・責任分担を棚卸しする
            </li>
            <li>
              <strong>成熟度 vs パフォーマンスの比較</strong>:
              ガバナンスの「成熟度（整備されているか）」と「実際の運用パフォーマンス（機能しているか）」は別軸であり、両方を評価する
            </li>
            <li>
              <strong>ストレステスト</strong>: Agentic AI
              などの高自律性ケースを想定し、「委任された権限がどこまで安全か」を意図的に限界まで検証する（第2章のガバナンスパターンの議論と直結）
            </li>
          </ul>
          <h3>6-3. Design（要件定義・設計）ステップ</h3>
          <p>Assess で明らかになったギャップをもとに、具体的な統制を設計します。</p>
          <h4>6-3-1. コンテキスト・リスク要因と比例的ガバナンス</h4>
          <p>
            すべての AI ユースケースに同じ強度の統制をかけるのは非効率です。
            <strong>比例的ガバナンス（proportionate governance）</strong>
            の考え方に基づき、次のようなコンテキスト要因（contextual risk
            factors）を踏まえてリスクの大きさを判定します。
          </p>
          <ul>
            <li>意思決定の対象（人・資金・安全に影響するか）</li>
            <li>自律性の度合い（人間の承認なしにどこまで進むか）</li>
            <li>影響範囲（一部門か全社か、社外顧客に及ぶか）</li>
            <li>可逆性（誤りが発生した場合に取り消せるか）</li>
          </ul>
          <h4>6-3-2. リスク優先度評価（Risk Priority Rating）</h4>
          <p>
            リスクの大きさは「<strong>発生可能性（Likelihood）× 影響度（Impact）</strong>
            」の掛け算で評価します（Risk Priority
            Rating）。これをマトリクス表として整理すると次のようになります。
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>発生可能性 ＼ 影響度</th>
                <th>軽微 (Low)</th>
                <th>中程度 (Medium)</th>
                <th>重大 (High)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>高い (High)</strong>
                </td>
                <td>中リスク</td>
                <td>高リスク</td>
                <td>
                  <strong>最優先で統制</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>中程度 (Medium)</strong>
                </td>
                <td>低リスク</td>
                <td>中リスク</td>
                <td>高リスク</td>
              </tr>
              <tr>
                <td>
                  <strong>低い (Low)</strong>
                </td>
                <td>最小限の統制で可</td>
                <td>低リスク</td>
                <td>中リスク</td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.note}`}
            data-testid="callout"
            data-variant="note"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-info-circle" />
              <span>補足</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                このマトリクスで「最優先で統制」に分類されたユースケース（例:
                高自律性のエージェントが顧客への金銭的影響を伴う判断を行う場合）には、後述する
                preventive（予防的）統制を厚く設計する必要があります。
              </p>
            </div>
          </div>
          <h4>6-3-3. 統制の3類型（Preventive / Detective / Corrective）</h4>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_9} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>統制タイプ</th>
                <th>目的</th>
                <th>AI ガバナンスでの具体例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Preventive（予防的）</strong>
                </td>
                <td>問題の発生自体を防ぐ</td>
                <td>
                  エージェントに実行可能なアクションを許可リストで制限する、承認なしに本番環境を変更できないようにする
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Detective（発見的）</strong>
                </td>
                <td>発生した問題を早期に検知する</td>
                <td>出力の異常検知アラート、モデルドリフトの自動監視</td>
              </tr>
              <tr>
                <td>
                  <strong>Corrective（是正的）</strong>
                </td>
                <td>検知した問題を修正・是正する</td>
                <td>自動ロールバック、人間へのエスカレーションと再学習トリガー</td>
              </tr>
            </tbody>
          </table>
          <h4>6-3-4. 意思決定境界・人間の監督・倫理的設計</h4>
          <p>
            「決定境界（decision boundaries）」とは、AI
            が自律的に判断してよい範囲と、必ず人間の承認を要する範囲の線引きです。設計時には次を明文化します。
          </p>
          <ul>
            <li>どこまでは AI が完結してよいか</li>
            <li>どこからは人間の承認（human-in-the-loop）が必須か</li>
            <li>
              倫理原則（公平性・透明性・説明責任など）をどう設計に組み込むか（designing with
              ethics）
            </li>
          </ul>
          <h4>6-3-5. Shadow AI 統制の設計とサステナビリティ要件</h4>
          <p>
            Design ステップでは、Shadow AI
            を「見える化」し、正規の統制下に置くための具体策（許可された AI
            ツールのカタログ化、利用申請フローの簡素化など）も設計します。あわせて、サステナビリティ要件（計算資源の使用上限など）もこの段階で統制の一部として組み込みます。
          </p>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  リスク優先度マトリクスは、担当者の主観に頼らず「発生可能性」「影響度」それぞれに具体的な判定基準（数値・閾値）を事前に定義しておく。
                </li>
                <li>
                  すべての AI ユースケースに preventive／detective／corrective
                  の3種類の統制がバランス良く設計されているかをチェックリストで確認する（予防偏重で検知が疎かになるケースが多い）。
                </li>
                <li>
                  決定境界は「文章」だけでなく、可能な限り
                  <strong>システム上の技術的な制約（ハードな境界）</strong>
                  として実装する。人間の運用ルール順守だけに頼らない。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 6)
                </a>
                ,
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 6)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第7章-ITIL-AI-Governance-Improvement-Model-Implement-Maintain">
            第7章: ITIL AI Governance Improvement Model — Implement ＆ Maintain
          </h2>
          <p>
            <em>(Module 7)</em>
          </p>
          <h3>7-1. Implement（実装）ステップ</h3>
          <p>Design で設計した統制を実際に組織へ導入する段階です。</p>
          <ul>
            <li>
              <strong>7つの実装経路（seven pathways）</strong>: ポリシー文書化から DevOps
              パイプラインへの組み込みまで、統制を実装する経路は一つではありません。ポリシー／プロセス／ツール／トレーニング／契約（サプライヤー条項）／技術的ガードレール／パイプライン組み込みなど、複数の経路を組み合わせて実装します。
            </li>
            <li>
              <strong>ブリッジング・メカニズム（bridging mechanisms）</strong>:
              ガバナンス能力が十分に成熟する前でも、AI
              運用を安全に続けられるようにするための暫定的な補完策（例:
              人手によるダブルチェックを一時的に強化するなど）。
            </li>
            <li>
              <strong>ガバナンス運用モデルと実装レディネス</strong>:
              統制を「誰が」「どの頻度で」運用するかという運用モデルを定義し、組織が実装に耐えられる状態（readiness）にあるかを確認します。
            </li>
            <li>
              <strong>決定境界・Shadow AI 統制の運用化</strong>:
              設計した境界やカタログを実際の承認フロー・監視ツールに落とし込みます。
            </li>
          </ul>
          <h3>7-2. Maintain（維持）ステップ</h3>
          <p>導入した統制を継続的に機能させ、改善し続ける段階です。</p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_10} />
          </div>
          <ul>
            <li>
              <strong>
                可観測性（Observability）・監視（Monitoring）・監査可能性（Auditability）
              </strong>
              : AI
              の挙動を「見える」「追跡できる」「後から検証できる」状態にすることが、統制の実効性を維持する前提条件です。
            </li>
            <li>
              <strong>
                統制（Control）とスチュワードシップ（Stewardship）の違い、そしてガバナンスの姿勢（governance
                orientation）
              </strong>
              :
              統制は「禁止・制限」に重心があるのに対し、スチュワードシップは「責任を持って良い方向へ導く」という、より能動的で協働的な姿勢です。成熟した
              AI ガバナンスは、統制一辺倒からスチュワードシップへと重心を移していく必要があります。
            </li>
            <li>
              <strong>保証エビデンスパック（Assurance evidence pack）</strong>:
              監査・規制当局・経営層への説明責任を果たすために、統制が実際に機能している証拠（ログ、監査結果、インシデント対応記録など）を体系的に蓄積しておくパッケージです。
            </li>
          </ul>
          <h3>7-3. コンプライアンス・規制をガバナンスへの入力として扱う</h3>
          <p>
            規制・コンプライアンス要件は、統制を設計した後に確認するものではなく、
            <strong>Design・Implement・Maintain 全体を貫く入力（input）</strong>として扱われます。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_11} />
          </div>
          <h4>7-3-1. 世界的な規制の潮流（The Global Regulatory Landscape）</h4>
          <ul>
            <li>
              <strong>EU AI Act（EU AI法）</strong>: AI
              システムをリスクレベル（許容できないリスク／高リスク／限定リスク／最小リスク）に応じて分類し、高リスクシステムには厳格な義務を課す、世界初の包括的な
              AI 規制。ITIL AI Governance
              では、この分類手法を組織内のリスク評価にマッピングする方法が扱われます。
            </li>
            <li>
              <strong>各国・業界固有の規制</strong>: NIS2（EU
              のサイバーセキュリティ指令）など、地域・業界ごとの規制も統治の入力として考慮する必要があります。
            </li>
          </ul>
          <h4>7-3-2. 外部標準との関係</h4>
          <ul>
            <li>
              <strong>ISO/IEC 42001:2023</strong>: 組織が AI
              マネジメントシステム（AIMS）を構築・運用するための国際標準。ITIL AI Governance
              の統制設計は、この標準が求める仕組み（方針・リスク管理・継続的改善）と整合させることができます。
            </li>
            <li>
              <strong>IEEE 7014-2024</strong>:
              「自律・知能システムにおける模倣共感の倫理的考慮に関する標準」。チャットボット等（6Cの
              Communication
              能力）が人間の共感を模倣する際の倫理的設計・運用・廃止に関する指針を提供します。
            </li>
          </ul>
          <h4>7-3-3. サードパーティ・サプライヤー・エンドツーエンドのガバナンス</h4>
          <p>
            自社で開発した AI だけでなく、
            <strong>
              サードパーティ製 AI（外部ベンダーが提供する AI 機能）やサプライチェーンに組み込まれた
              AI
            </strong>
            も統治の対象です。契約条項（データ利用範囲、説明責任の所在）や、サプライヤー監査を通じて、エンドツーエンド（end-to-end）でガバナンスの一貫性を確保します。
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>標準・規制</th>
                <th>種別</th>
                <th>主な役割</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EU AI Act</td>
                <td>法規制</td>
                <td>AIシステムをリスクベースで分類し、義務を課す</td>
              </tr>
              <tr>
                <td>ISO/IEC 42001:2023</td>
                <td>国際標準（マネジメントシステム）</td>
                <td>組織のAIマネジメント体制の認証・整備の枠組み</td>
              </tr>
              <tr>
                <td>IEEE 7014-2024</td>
                <td>技術標準（倫理）</td>
                <td>AIによる模倣共感の倫理的設計指針</td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  規制・標準は「対応すべきチェックリスト」としてではなく、Assess-Design-Implement-Maintain
                  サイクルへの継続的な入力として運用プロセスに組み込む。
                </li>
                <li>
                  保証エビデンスパックは、監査直前に慌てて作るのではなく、日々の運用ログ・監視結果から自動的に蓄積される仕組みを最初から設計する。
                </li>
                <li>
                  サードパーティ AI
                  を調達する際は、契約段階で「説明責任の所在」「インシデント時の通知義務」「監査への協力義務」を明記する。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 7)
                </a>
                ,{" "}
                <a
                  href="https://itcko.sk/en/itil-v5-ai-governance-module/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  itcko.sk 解説記事
                </a>
                ,
                <a
                  href="https://www.iso.org/standard/81230.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ISO/IEC 42001 公式ページ
                </a>
                ,
                <a
                  href="https://standards.ieee.org/ieee/7014/7648/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IEEE 7014-2024 公式ページ
                </a>
                ,
                <a
                  href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  EU AI Act 法令本文 (EUR-Lex)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第8章-自分の役割-業界で-AI-を活かす">第8章: 自分の役割・業界で AI を活かす</h2>
          <p>
            <em>
              (Module 8: AI in Your World: Unlock AI in Your Role, Industry, and Organizational
              Function)
            </em>
          </p>
          <h3>8-1. 価値実現（Value Realization）: 期待価値から実際価値へ</h3>
          <p>
            AI 導入プロジェクトの多くは「期待された価値（expected
            value）」を計画段階で語りますが、実際に運用してみて得られる「実際の価値（actual
            value）」との間にギャップが生じがちです（本ガイド冒頭で触れた「GenAI投資の95%がROIを実感できていない」という統計はまさにこのギャップの表れです）。Module
            8 では、このギャップを構造的に把握し、埋めていく視点を扱います。
          </p>
          <h3>8-2. 業界・組織機能ごとの AI ユースケース</h3>
          <p>AI の価値は業界・機能ごとに異なる形で現れます。例えば:</p>
          <ul>
            <li>
              <strong>ITSM／サービスデスク</strong>:
              チケットの自動トリアージ（Cognition）、FAQ対応の自動化（Communication）
            </li>
            <li>
              <strong>人事機能</strong>:
              採用選考の一次スクリーニング（Cognition）※バイアスリスクが高いため統制が特に重要
            </li>
            <li>
              <strong>金融・与信</strong>: 与信判断支援（Cognition）※説明可能性・規制対応が必須
            </li>
            <li>
              <strong>製造・運用</strong>: 予知保全（Cognition）、マニュアル生成（Creation）
            </li>
          </ul>
          <h3>8-3. AI ユースケース評価テンプレート</h3>
          <p>
            Module 8 では、シナリオを解釈し、AI
            ユースケースを体系的にアセスメントするための包括的なテンプレート（full AI use-case
            assessment
            template）が扱われます。このテンプレートには、少なくとも次の要素が含まれます。
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>評価項目</th>
                <th>確認すべき内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ステークホルダー (Stakeholders)</td>
                <td>誰がこのAIの利用者・影響を受ける当事者か（顧客・従業員・規制当局など）</td>
              </tr>
              <tr>
                <td>サービス特性 (Service characteristics)</td>
                <td>どのプロダクト・サービスライフサイクル段階に位置するか</td>
              </tr>
              <tr>
                <td>6C 能力の組み合わせ</td>
                <td>
                  どの
                  Capability（Creation/Curation/Clarification/Cognition/Communication/Coordination）を使っているか
                </td>
              </tr>
              <tr>
                <td>ガバナンス視点</td>
                <td>意思決定権限／倫理／データ／規制の4視点それぞれの要件</td>
              </tr>
              <tr>
                <td>ガバナンスパターン</td>
                <td>Directive/Guided/Federated/Autonomous のどれが適切か</td>
              </tr>
              <tr>
                <td>期待価値と実際価値</td>
                <td>想定していた成果と、実際の運用結果のギャップ</td>
              </tr>
              <tr>
                <td>リスク優先度</td>
                <td>発生可能性×影響度によるリスクレベル</td>
              </tr>
            </tbody>
          </table>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  新規 AI
                  ユースケースの企画には、必ずこの評価テンプレートを使い、思いつきでの導入を避ける。
                </li>
                <li>
                  「期待価値」を定義する際は、必ず測定可能な指標（KPI）とセットにし、後から「実際価値」と比較できるようにしておく。
                </li>
                <li>
                  業界・機能ごとにベストプラクティス事例を蓄積し、組織内のナレッジベースとして共有する（車輪の再発明を防ぐ）。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 8)
                </a>
                ,
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 8)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第9章-他のフレームワーク-規制-標準との連携">
            第9章: 他のフレームワーク・規制・標準との連携
          </h2>
          <p>
            <em>
              (Module 9: Connecting AI Governance with Frameworks, Regulations, and Standards)
            </em>
          </p>
          <h3>9-1. なぜフレームワーク同士の連携が必要か</h3>
          <p>
            AI ガバナンスは ITIL だけで完結するものではありません。プロジェクト管理の
            PRINCE2、ソフトウェア開発・運用の DevOps、そして外部の法規制・標準（EU AI Act、ISO/IEC
            42001、IEEE 7014-2024）は、それぞれ<strong>異なる問い（question）に答える</strong>
            ために存在します。Module 9
            では、これらが競合するのではなく補完し合う関係にあることを理解します。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_12} />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>フレームワーク／標準</th>
                <th>主に答える問い</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>ITIL (AI Governance)</strong>
                </td>
                <td>AIをどう責任を持って統治し、価値創出とリスク管理を両立させるか</td>
              </tr>
              <tr>
                <td>
                  <strong>PRINCE2</strong>
                </td>
                <td>AI導入プロジェクトをどのステージ・意思決定ポイントで統制するか</td>
              </tr>
              <tr>
                <td>
                  <strong>DevOps</strong>
                </td>
                <td>AIモデル・機能の変更をどう安全かつ継続的にデリバリーするか</td>
              </tr>
              <tr>
                <td>
                  <strong>ISO/IEC 42001</strong>
                </td>
                <td>組織のAIマネジメントシステムをどう認証可能な形で構築するか</td>
              </tr>
              <tr>
                <td>
                  <strong>IEEE 7014-2024</strong>
                </td>
                <td>AIによる模倣共感をどう倫理的に設計・運用するか</td>
              </tr>
              <tr>
                <td>
                  <strong>各国規制 (EU AI Act 等)</strong>
                </td>
                <td>何が法的に許容され、何が禁止・制限されるか</td>
              </tr>
            </tbody>
          </table>
          <h3>9-2. PRINCE2 との連携</h3>
          <p>
            PRINCE2 のステージゲート（各ステージの節目にある意思決定ポイント）に、AI
            ガバナンスの承認プロセスを組み込むことで、プロジェクトの進行と統制を同期させます。例えば、「ビジネスケース承認」のタイミングで
            AI
            ユースケース評価テンプレート（第8章）を用いたリスク評価を必須化する、といった連携が考えられます。
          </p>
          <h3>9-3. DevOps との連携</h3>
          <p>
            DevOps の CI/CD
            パイプラインに、ガバナンス上のチェック（バイアステスト、セキュリティスキャン、決定境界の自動検証など）を
            <strong>技術的なゲート</strong>
            として組み込むことで、「ガバナンスがデリバリー速度を落とす」という対立構造を避け、「安全に速く届ける（DevSecOps
            的発想の AI
            版）」を実現します。第7章で触れた「7つの実装経路」のひとつに、まさにこの「DevOps
            パイプラインへの組み込み」が含まれています。
          </p>
          <h3>9-4. 全体像の統合</h3>
          <p>
            本ガイドで扱った主要モデル・概念を1枚に統合すると、次のような関係になります。これは公式シラバスにある「seven
            key models in one
            view」というトピックタイトルを踏まえた、本ガイド独自の整理です。実際の7モデルの厳密な定義は公式eBookを参照してください。
          </p>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_13} />
          </div>
          <div
            className={`${styles.callout} ${styles.practice}`}
            data-testid="callout"
            data-variant="practice"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-bulb" />
              <span>ベストプラクティス</span>
            </div>
            <div className={styles.calloutBody}>
              <ul>
                <li>
                  AI 導入プロジェクトの立ち上げ時に、PMO（PRINCE2運用チーム）と AI
                  ガバナンス担当を必ず同席させ、ステージゲートへの統制組み込みを最初から設計する。
                </li>
                <li>
                  DevOps
                  チームに対しては、ガバナンス要件を「後工程の承認待ち」ではなく「パイプライン内の自動チェック」として提示し、開発速度への影響を最小化する。
                </li>
                <li>
                  ISO/IEC 42001 の認証取得を目指す組織は、ITIL AI Governance Improvement Model の
                  Assess ステップの成果物をそのまま ISO 42001 のギャップ分析の入力として再利用する。
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.source}`}
            data-testid="callout"
            data-variant="source"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-external-link" />
              <span>ソース</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                出典:
                <a
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AGILEPM HUB シラバス (Module 9)
                </a>
                ,
                <a
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ITSM Academy コースアウトライン (Module 9)
                </a>
              </p>
            </div>
          </div>
          <hr className={styles.divider} />
          <h2 id="第10章-試験対策まとめと用語集">第10章: 試験対策まとめと用語集</h2>
          <h3>10-1. 試験の心構え</h3>
          <ul>
            <li>
              <strong>オープンブックだが時間管理が重要</strong>:
              90分・40問はシナリオ読解の時間を含めると決して余裕はありません。eBook
              の該当箇所をすぐ探せるよう、事前に目次・索引に慣れておく。
            </li>
            <li>
              <strong>シナリオベース出題への対策</strong>: 実在の企業を想定した架空シナリオ（"ITIL
              Car Rental Scenario"
              など）が提示され、そこに登場する状況にモデル・原則を当てはめる形式の出題が中心です。丸暗記よりも「このシナリオでは、どのガバナンスパターン／統制タイプが適切か」を判断する練習が有効です。
            </li>
            <li>
              <strong>Bloom's Taxonomy BL2〜BL4 を意識する</strong>:
              単純な用語の暗記（BL1）ではなく、「理解（BL2: 概念を正しく説明できる）」「適用（BL3:
              シナリオに当てはめられる）」「分析（BL4:
              複数要素を比較・統合できる）」のレベルで問われます。
            </li>
          </ul>
          <h3>10-2. 章ごとの学習チェックリスト</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>章</th>
                <th>最低限説明できるようになるべきこと</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>良いガバナンスの必要性、AIの職場への影響、統治成熟度スペクトラム</td>
              </tr>
              <tr>
                <td>2</td>
                <td>ガバナンス/マネジメント/リーダーシップの違い、4つのガバナンスパターン</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Narrow/Generative/Agentic AI の違い、AIの主要リスクカテゴリ</td>
              </tr>
              <tr>
                <td>4</td>
                <td>6C モデルの6要素、4つのガバナンス視点、リスクと対策の対応関係</td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  ITIL Value System、Four Dimensions への AI の組み込まれ方、Guiding Principles
                </td>
              </tr>
              <tr>
                <td>6</td>
                <td>
                  Improvement Model の
                  Assess/Design、リスク優先度評価、preventive/detective/corrective
                </td>
              </tr>
              <tr>
                <td>7</td>
                <td>
                  Improvement Model の Implement/Maintain、EU AI Act・ISO42001・IEEE7014 の役割
                </td>
              </tr>
              <tr>
                <td>8</td>
                <td>AI ユースケース評価テンプレート、期待価値と実際価値のギャップ</td>
              </tr>
              <tr>
                <td>9</td>
                <td>ITIL・PRINCE2・DevOps・外部標準がそれぞれ答える問いの違い</td>
              </tr>
            </tbody>
          </table>
          <h3>10-3. 用語集（日英対照）</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>日本語</th>
                <th>英語</th>
                <th>意味</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ガバナンス</td>
                <td>Governance</td>
                <td>方向づけ・監督・説明責任の枠組み</td>
              </tr>
              <tr>
                <td>ガバナンスギャップ</td>
                <td>Governance gap</td>
                <td>AI利用の広がりに統治の整備が追いついていない状態</td>
              </tr>
              <tr>
                <td>ガバナンスパターン</td>
                <td>Governance pattern</td>
                <td>意思決定の裁量配分を分類する4類型（Directive/Guided/Federated/Autonomous）</td>
              </tr>
              <tr>
                <td>ガバナンス視点</td>
                <td>Governance perspective</td>
                <td>統治を評価する4つの切り口（権限・倫理・データ・規制）</td>
              </tr>
              <tr>
                <td>6Cモデル</td>
                <td>ITIL AI Capability Model (6C)</td>
                <td>AIの機能を6分類する枠組み</td>
              </tr>
              <tr>
                <td>シャドーAI</td>
                <td>Shadow AI</td>
                <td>正式な承認を経ずに現場が独自導入するAI利用</td>
              </tr>
              <tr>
                <td>エージェント型AI</td>
                <td>Agentic AI</td>
                <td>目標達成のため自律的に計画・実行するAI</td>
              </tr>
              <tr>
                <td>ハルシネーション</td>
                <td>Hallucination</td>
                <td>もっともらしいが誤った内容をAIが生成すること</td>
              </tr>
              <tr>
                <td>決定境界</td>
                <td>Decision boundary</td>
                <td>AIが自律判断してよい範囲と人間承認が必要な範囲の境界線</td>
              </tr>
              <tr>
                <td>予防的統制</td>
                <td>Preventive control</td>
                <td>問題の発生自体を未然に防ぐ統制</td>
              </tr>
              <tr>
                <td>発見的統制</td>
                <td>Detective control</td>
                <td>発生した問題を検知する統制</td>
              </tr>
              <tr>
                <td>是正的統制</td>
                <td>Corrective control</td>
                <td>検知した問題を修正する統制</td>
              </tr>
              <tr>
                <td>リスク優先度評価</td>
                <td>Risk priority rating</td>
                <td>発生可能性×影響度でリスクの大きさを評価する手法</td>
              </tr>
              <tr>
                <td>スチュワードシップ</td>
                <td>Stewardship</td>
                <td>統制よりも能動的・協働的にAIを良い方向へ導く姿勢</td>
              </tr>
              <tr>
                <td>保証エビデンスパック</td>
                <td>Assurance evidence pack</td>
                <td>統制の実効性を証明するための証拠一式</td>
              </tr>
              <tr>
                <td>比例的ガバナンス</td>
                <td>Proportionate governance</td>
                <td>リスクの大きさに見合った強度の統制のみを課す考え方</td>
              </tr>
            </tbody>
          </table>
          <hr className={styles.divider} />
          <h2 id="参考文献-出典一覧">参考文献・出典一覧</h2>
          <p>
            本ガイドの内容は、以下の資料をもとに作成しました。一次情報源（PeopleCert・ITIL.com
            の公式ページ、ISO・IEEE・EU の公式文書）と、二次資料（PeopleCert
            認定トレーニングパートナー各社の公開シラバス、解説記事）を区別して記載します。特にモジュール構成・学習目標の詳細については、複数の独立したソースで内容が一致していることを確認しています。
          </p>
          <h3>一次情報源（公式資料）</h3>
          <div className={styles.refList}>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                1
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-ai-governance-version-5-4234"
                  target="_blank"
                  rel="noopener"
                >
                  PeopleCert 公式製品ページ
                </a>
                <div className={styles.refNote}>ユーザー提供URL</div>
                <div className={styles.refUrl}>
                  https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-ai-governance-version-5-4234
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                2
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.itil.com/professionals/certifications/ITIL-AI-Governance-Version-5"
                  target="_blank"
                  rel="noopener"
                >
                  ITIL.com 公式資格ページ
                </a>

                <div className={styles.refUrl}>
                  https://www.itil.com/professionals/certifications/ITIL-AI-Governance-Version-5
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                3
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.axelos.com/best-practice-solutions/itil"
                  target="_blank"
                  rel="noopener"
                >
                  AXELOS ITIL ベストプラクティスページ
                </a>

                <div className={styles.refUrl}>
                  https://www.axelos.com/best-practice-solutions/itil
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                4
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.iso.org/standard/81230.html"
                  target="_blank"
                  rel="noopener"
                >
                  ISO/IEC 42001:2023 公式ページ
                </a>
                <div className={styles.refNote}>AIマネジメントシステム国際標準</div>
                <div className={styles.refUrl}>https://www.iso.org/standard/81230.html</div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                5
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://standards.ieee.org/ieee/7014/7648/"
                  target="_blank"
                  rel="noopener"
                >
                  IEEE 7014-2024 公式ページ
                </a>
                <div className={styles.refNote}>模倣共感の倫理的配慮に関する標準</div>
                <div className={styles.refUrl}>https://standards.ieee.org/ieee/7014/7648/</div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                6
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
                  target="_blank"
                  rel="noopener"
                >
                  EU AI Act 法令本文 (EUR-Lex)
                </a>
                <div className={styles.refNote}>Regulation (EU) 2024/1689</div>
                <div className={styles.refUrl}>https://eur-lex.europa.eu/eli/reg/2024/1689/oj</div>
              </div>
            </div>
          </div>
          <h3>二次資料（トレーニング事業者・解説記事）</h3>
          <div className={styles.refList}>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                7
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://itsmacademy.com/itil-ai-governance-course"
                  target="_blank"
                  rel="noopener"
                >
                  ITSM Academy コース詳細
                </a>
                <div className={styles.refNote}>PeopleCert認定ATO、全9モジュールアウトライン</div>
                <div className={styles.refUrl}>
                  https://itsmacademy.com/itil-ai-governance-course
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                8
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://agilepmhub.com/itil-ai-governance"
                  target="_blank"
                  rel="noopener"
                >
                  AGILEPM HUB コース詳細
                </a>
                <div className={styles.refNote}>
                  PeopleCert認定ATO、全9モジュールアウトライン・試験詳細
                </div>
                <div className={styles.refUrl}>https://agilepmhub.com/itil-ai-governance</div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                9
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://itcko.sk/en/itil-v5-ai-governance-module/"
                  target="_blank"
                  rel="noopener"
                >
                  ITčko 解説記事
                </a>
                <div className={styles.refNote}>
                  「ITIL v5 AI Governance: a new module for responsible AI management」
                </div>
                <div className={styles.refUrl}>
                  https://itcko.sk/en/itil-v5-ai-governance-module/
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                10
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://gogotraining.com/blog/2026/08/itil-ai-governance-the-itil-certification-you-cant-live-without/"
                  target="_blank"
                  rel="noopener"
                >
                  GogoTraining ブログ
                </a>
                <div className={styles.refNote}>
                  「AI Governance – The ITIL Cert you Can't Live Without!」
                </div>
                <div className={styles.refUrl}>
                  https://gogotraining.com/blog/2026/08/itil-ai-governance-the-itil-certification-you-cant-live-without/
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                11
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.innovativelearning.eu/products/itil-5/itil-ai-governance-5.html"
                  target="_blank"
                  rel="noopener"
                >
                  Innovative Learning コース概要
                </a>

                <div className={styles.refUrl}>
                  https://www.innovativelearning.eu/products/itil-5/itil-ai-governance-5.html
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                12
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.itil.org.uk/training/itil-extension-modules/itil-ai-governance-version-5-training-course"
                  target="_blank"
                  rel="noopener"
                >
                  ITIL.org.uk トレーニングコース概要
                </a>

                <div className={styles.refUrl}>
                  https://www.itil.org.uk/training/itil-extension-modules/itil-ai-governance-version-5-training-course
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                13
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://itsm.tools/itil-version-5-vs-itil-4-key-changes/"
                  target="_blank"
                  rel="noopener"
                >
                  itsm.tools 解説記事
                </a>
                <div className={styles.refNote}>
                  「ITIL (Version 5) Changes Explained」6Cモデル・Four Dimensionsの変更点
                </div>
                <div className={styles.refUrl}>
                  https://itsm.tools/itil-version-5-vs-itil-4-key-changes/
                </div>
              </div>
            </div>
            <div className={styles.refCard} data-testid="ref-card">
              <div className={styles.refBadge} data-testid="ref-badge">
                14
              </div>
              <div className={styles.refBody}>
                <a
                  className={styles.refTitle}
                  href="https://www.pmgacademy.com/en/articles/itil/information-and-technology-in-itil-version-5-the-guide-for-the-ai-era-and-data-governance/"
                  target="_blank"
                  rel="noopener"
                >
                  PMG Academy 解説記事
                </a>
                <div className={styles.refNote}>
                  「Information and Technology in ITIL Version 5」6Cモデル各要素の説明
                </div>
                <div className={styles.refUrl}>
                  https://www.pmgacademy.com/en/articles/itil/information-and-technology-in-itil-version-5-the-guide-for-the-ai-era-and-data-governance/
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${styles.callout} ${styles.note}`}
            data-testid="callout"
            data-variant="note"
          >
            <div className={styles.calloutHead}>
              <i className="ti ti-info-circle" />
              <span>免責事項</span>
            </div>
            <div className={styles.calloutBody}>
              <p>
                本ガイドは公開情報をもとにした学習補助資料であり、PeopleCert
                の公式教材・公式見解を代替するものではありません。ITIL は PeopleCert
                グループの登録商標です。試験対策の最終確認には、必ず購入した公式 eBook / Learning
                Resource Kit をご利用ください。また、ITIL AI Governance (Version 5)
                は比較的新しい資格であるため、シラバスや試験形式が今後改定される可能性があります。受験前に必ず
                PeopleCert 公式サイトで最新情報をご確認ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
