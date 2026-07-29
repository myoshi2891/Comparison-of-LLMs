import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "仕様駆動開発（SDD）実践ガイド ― 中級・上級エンジニア向けベストプラクティス",
  description:
    "バイブコーディング脱却からマルチエージェント検証、EARS記法、GitHub Spec Kit・AWS Kiro・BMAD実践まで網羅した、中級・上級エンジニア向け仕様駆動開発（Spec-Driven Development）の決定版ガイド。",
};

const MMD_1 = `flowchart LR
    A["バイブコーディング<br/>(曖昧な自然言語プロンプト)"] -->|直接生成| B["コード"]
    B -->|意図とズレる| C["ドリフト・技術的負債"]

    D["仕様駆動開発 (SDD)<br/>構造化された仕様"] --> E["計画 (Plan)"]
    E --> F["タスク分解 (Tasks)"]
    F --> G["コード生成・検証"]
    G -->|要件変更時は仕様を先に更新| D

    style A fill:#3a1f1f,stroke:#e06c75,color:#fff
    style C fill:#3a1f1f,stroke:#e06c75,color:#fff
    style D fill:#1f2f3a,stroke:#61afef,color:#fff
    style G fill:#1f3a2a,stroke:#98c379,color:#fff`;

const MMD_2 = `flowchart LR
    subgraph L1["Level 1: Spec-First"]
        direction TB
        A1["仕様を先に書く"] --> A2["実装後は<br/>仕様を放置しがち"]
    end
    subgraph L2["Level 2: Spec-Anchored"]
        direction TB
        B1["仕様を先に書く"] --> B2["タスク完了後も<br/>仕様を保持・更新"]
        B2 --> B3["機能の進化・保守に<br/>継続利用"]
    end
    subgraph L3["Level 3: Spec-as-Source"]
        direction TB
        C1["仕様がメインの<br/>ソースファイル"] --> C2["人間は仕様のみ編集"]
        C2 --> C3["コードは常に<br/>再生成される"]
    end
    L1 -->|成熟度が上がる| L2 -->|成熟度が上がる| L3

    style L1 fill:#2a1f1f,stroke:#e5c07b
    style L2 fill:#1f2a1f,stroke:#98c379
    style L3 fill:#1f1f2a,stroke:#61afef`;

const MMD_3 = `flowchart TD
    S0["0. Constitution<br/>プロジェクトの非交渉的な原則を定義"] --> S1
    S1["1. Specify<br/>何を・なぜ作るかを記述<br/>(技術スタックには触れない)"] --> S2
    S2["2. Clarify<br/>曖昧な箇所を対話的に解消"] --> S3
    S3["3. Plan<br/>技術スタック・アーキテクチャを決定"] --> S4
    S4["4. Checklist<br/>要件の完全性・一貫性を検証する<br/>「英語のユニットテスト」を生成"] --> S5
    S5["5. Tasks<br/>実行可能・依存関係付きの<br/>タスクリストに分解"] --> S6
    S6["6. Analyze<br/>仕様・計画・タスクの<br/>整合性をクロスチェック"] --> S7
    S7["7. Implement<br/>AIエージェントがタスクを実行"] --> S8
    S8["8. Converge / Review<br/>実装が仕様と一致するか<br/>最終検証"]
    S8 -.要件変更.-> S1

    style S0 fill:#2a1f3a,stroke:#c678dd,color:#fff
    style S7 fill:#1f3a2a,stroke:#98c379,color:#fff
    style S8 fill:#1f2f3a,stroke:#61afef,color:#fff`;

const MMD_4 = `flowchart TD
    Start["要求を1文で書く"] --> Q1{"常に真であるか？<br/>（トリガー不要）"}
    Q1 -- Yes --> P1["Ubiquitous パターン<br/>the システム shall 応答"]
    Q1 -- No --> Q2{"特定イベントで<br/>発火するか？"}
    Q2 -- Yes --> P2["Event-Driven パターン<br/>When トリガー, shall 応答"]
    Q2 -- No --> Q3{"異常系・エラー系か？"}
    Q3 -- Yes --> P3["Unwanted Behavior パターン<br/>If 条件, then shall 応答"]
    Q3 -- No --> Q4{"特定の状態継続中か？"}
    Q4 -- Yes --> P4["State-Driven パターン<br/>While 状態, shall 応答"]
    Q4 -- No --> P5["Optional Feature パターン<br/>Where 機能, shall 応答"]

    style P1 fill:#1f2f3a,stroke:#61afef,color:#fff
    style P2 fill:#1f3a2a,stroke:#98c379,color:#fff
    style P3 fill:#3a1f1f,stroke:#e06c75,color:#fff
    style P4 fill:#2a1f3a,stroke:#c678dd,color:#fff
    style P5 fill:#3a2a1f,stroke:#e5c07b,color:#fff`;

const MMD_5 = `flowchart TD
    Q1{"既存システムの<br/>小規模な変更か？"} -- Yes --> R1["OpenSpec<br/>(デルタ形式で軽量に)"]
    Q1 -- No --> Q2{"複雑な新規開発で<br/>PM/アーキテクト/QAの<br/>役割分担が必要か？"}
    Q2 -- Yes --> R2["BMAD-METHOD<br/>(多エージェント・フルライフサイクル)"]
    Q2 -- No --> Q3{"チーム全体で1つの<br/>規約を標準化したいか？<br/>(複数AIエージェント混在)"}
    Q3 -- Yes --> R3["GitHub Spec Kit<br/>(constitution + 8ステップ)"]
    Q3 -- No --> Q4{"AWSネイティブな<br/>環境で完結したいか？"}
    Q4 -- Yes --> R4["AWS Kiro<br/>(requirements/design/tasks)"]
    Q4 -- No --> R5["Claude Code等の<br/>軽量スキルベース運用"]

    style R1 fill:#1f3a2a,stroke:#98c379,color:#fff
    style R2 fill:#3a2a1f,stroke:#e5c07b,color:#fff
    style R3 fill:#1f2f3a,stroke:#61afef,color:#fff
    style R4 fill:#2a1f3a,stroke:#c678dd,color:#fff
    style R5 fill:#3a1f1f,stroke:#e06c75,color:#fff`;

const MMD_6 = `sequenceDiagram
    participant Dev as 開発者
    participant Agent as AIコーディングエージェント
    participant Repo as リポジトリ (.specify/)

    Dev->>Agent: /speckit.constitution (非交渉的な原則を記述)
    Agent->>Repo: .specify/memory/constitution.md を生成
    Dev->>Agent: /speckit.specify (何を・なぜ作るか)
    Agent->>Repo: spec.md を生成
    Dev->>Agent: /speckit.clarify (曖昧な点を対話で解消)
    Agent->>Repo: spec.md を更新
    Dev->>Agent: /speckit.plan (技術スタックを指定)
    Agent->>Repo: plan.md を生成
    Dev->>Agent: /speckit.checklist
    Agent->>Repo: 要件の完全性チェックリストを生成
    Dev->>Agent: /speckit.tasks
    Agent->>Repo: tasks.md (依存関係付きタスク一覧) を生成
    Dev->>Agent: /speckit.analyze
    Agent-->>Dev: spec/plan/tasksの不整合を報告
    Dev->>Agent: /speckit.implement
    Agent->>Repo: タスクに従いコードを生成・変更`;

const MMD_7 = `flowchart TD
    P0["初期プロンプト<br/>(自然言語で機能を記述)"] --> P1
    P1["Phase 1: Requirements<br/>requirements.md<br/>ユーザーストーリー・受け入れ基準を<br/>EARS形式(When/Then)で記述"] -->|人間がレビュー・承認| P2
    P2["Phase 2: Design<br/>design.md<br/>技術アーキテクチャ・シーケンス図・<br/>データモデルを文書化"] -->|人間がレビュー・承認| P3
    P3["Phase 3: Tasks<br/>tasks.md<br/>実装計画をアトミックな<br/>タスクへ分解"] --> P4
    P4["タスク実行<br/>(Wave方式で並列実行)"]

    style P1 fill:#1f2f3a,stroke:#61afef,color:#fff
    style P2 fill:#2a1f3a,stroke:#c678dd,color:#fff
    style P3 fill:#1f3a2a,stroke:#98c379,color:#fff
    style P4 fill:#3a2a1f,stroke:#e5c07b,color:#fff`;

const MMD_8 = `flowchart LR
    subgraph Wave1["Wave 1（依存関係なし・並列実行）"]
        T1["タスクA"]
        T2["タスクB"]
        T3["タスクC"]
    end
    subgraph Wave2["Wave 2（Wave1完了後・並列実行）"]
        T4["タスクD<br/>(A,Bに依存)"]
        T5["タスクE<br/>(Cに依存)"]
    end
    subgraph Wave3["Wave 3"]
        T6["タスクF<br/>(D,Eに依存)"]
    end
    Wave1 --> Wave2 --> Wave3`;

const MMD_9 = `flowchart TD
    Spec["確定した仕様<br/>(spec.md / plan.md / tasks.md)"] --> Coordinator["Coordinatorエージェント<br/>仕様をサブタスクに分解し委譲"]
    Coordinator --> Impl1["Implementorエージェント A<br/>(サブ仕様1を実装)"]
    Coordinator --> Impl2["Implementorエージェント B<br/>(サブ仕様2を実装)"]
    Impl1 --> Verifier
    Impl2 --> Verifier
    Verifier["Verifierエージェント<br/>仕様との整合性を検証<br/>(欠陥を探すことが目的)"]
    Verifier -->|不整合を検出| Impl1
    Verifier -->|不整合を検出| Impl2
    Verifier -->|検証OK| Done["マージ・レビューへ"]

    style Coordinator fill:#2a1f3a,stroke:#c678dd,color:#fff
    style Verifier fill:#3a1f1f,stroke:#e06c75,color:#fff
    style Done fill:#1f3a2a,stroke:#98c379,color:#fff`;

const MMD_10 = `flowchart LR
    A["Step 1<br/>個人での練習<br/>ツールなしでSDDセッションを体験する"] --> B
    B["Step 2<br/>小規模なグリーンフィールド機能で<br/>軽量パス(specify→plan→tasks→implement)<br/>を試す"] --> C
    C["Step 3<br/>チーム内でconstitution/steeringを<br/>定義し、1つのツールに標準化する"] --> D
    D["Step 4<br/>brownfield・複雑な機能へ拡大<br/>Verifierパターン等の品質ゲートを追加"] --> E
    E["Step 5<br/>監査証跡・コンプライアンス要件を<br/>仕様スタックに組み込み、<br/>組織全体の標準プロセス化"]

    style A fill:#3a2a1f,stroke:#e5c07b,color:#fff
    style C fill:#1f2f3a,stroke:#61afef,color:#fff
    style E fill:#1f3a2a,stroke:#98c379,color:#fff`;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default async function SpecDrivenDevelopmentGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <nav className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.tag}>PRACTICE GUIDE</span>
          <p className={styles.brandTitle}>仕様駆動開発 (SDD)</p>
          <p>中級・上級エンジニア向け実践ベストプラクティス</p>
        </div>
        <ul className={styles.sidebarNav}>
          <li>
            <a href="#sec1">
              <span className={styles.num}>01</span>SDDとは何か
            </a>
          </li>
          <li>
            <a href="#sec2">
              <span className={styles.num}>02</span>基本原則：真実の源
            </a>
          </li>
          <li>
            <a href="#sec3">
              <span className={styles.num}>03</span>3段階の成熟度モデル
            </a>
          </li>
          <li>
            <a href="#sec4">
              <span className={styles.num}>04</span>TDD/BDDとの比較
            </a>
          </li>
          <li>
            <a href="#sec5">
              <span className={styles.num}>05</span>標準ワークフロー
            </a>
          </li>
          <li>
            <a href="#sec6">
              <span className={styles.num}>06</span>EARS記法
            </a>
          </li>
          <li>
            <a href="#sec7">
              <span className={styles.num}>07</span>主要ツールの比較
            </a>
          </li>
          <li>
            <a href="#sec8">
              <span className={styles.num}>08</span>GitHub Spec Kit
            </a>
          </li>
          <li>
            <a href="#sec9">
              <span className={styles.num}>09</span>AWS Kiro
            </a>
          </li>
          <li>
            <a href="#sec10">
              <span className={styles.num}>10</span>マルチエージェント検証
            </a>
          </li>
          <li>
            <a href="#sec11">
              <span className={styles.num}>11</span>ベストプラクティス12選
            </a>
          </li>
          <li>
            <a href="#sec12">
              <span className={styles.num}>12</span>アンチパターン
            </a>
          </li>
          <li>
            <a href="#sec13">
              <span className={styles.num}>13</span>セキュリティ・監査
            </a>
          </li>
          <li>
            <a href="#sec14">
              <span className={styles.num}>14</span>組織導入ロードマップ
            </a>
          </li>
          <li>
            <a href="#sec15">
              <span className={styles.num}>15</span>チェックリスト
            </a>
          </li>
          <li>
            <a href="#sec16">
              <span className={styles.num}>16</span>参考文献
            </a>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.heroBadge}>
            <span>Spec-Driven Development</span>
            <span>•</span>
            <span>2026 Practice Guide</span>
          </div>
          <h1>仕様駆動開発（SDD）実践ガイド ― 中級・上級エンジニア向けベストプラクティス</h1>
          <p className={styles.heroLead}>
            バイブコーディング脱却からマルチエージェント検証、EARS記法、GitHub Spec Kit・AWS
            Kiro・BMAD実践まで網羅した、中級・上級エンジニア向け仕様駆動開発（Spec-Driven
            Development）の決定版ガイド。
          </p>
          <div className={styles.heroMeta}>
            <span>最終更新日: 2026-07-26</span>
            <span>対象: ソフトウェアアーキテクト, チームリード, AIエージェント活用エンジニア</span>
          </div>
        </header>

        {/* ============ 01 ============ */}
        <section className={styles.chapter} id="sec1">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>01</span>SDDとは何か ― なぜ2026年に主流になったのか
            </h2>
          </div>
          <p className={styles.sectionLead}>
            仕様駆動開発（Spec-Driven Development,
            SDD）とは、コードではなく、実行可能でバージョン管理された「仕様（Spec）」を単一の真実の源（Single
            Source of
            Truth）とする開発手法です。開発チーム、あるいはAIコーディングエージェントは、まず「何を作るか」を詳細な仕様として書き下し、そこから実装計画を導出し、計画をアトミックなタスクに分解し、その後で初めてコードを生成します。
          </p>

          <h3>1.1 なぜ今、SDDが必要とされているのか</h3>
          <p>
            2025年前半に Andrej Karpathy が広めた「バイブコーディング（Vibe
            Coding）」という言葉は、AIエージェントに自然言語で緩くプロンプトを与え、出てきたコードをそのまま受け入れるワークフローを指します。プロトタイプや使い捨てスクリプトには有効ですが、本番運用が前提のソフトウェアでは、次のような失敗モードが顕在化することが指摘されています。
          </p>
          <ul>
            <li>
              <strong>意図のドリフト（Intent Drift）</strong>
              ：会話を重ねるうちに、AIエージェントの出力が当初の意図から徐々にずれていく
            </li>
            <li>
              <strong>アーキテクチャの不整合</strong>
              ：一貫した設計判断がされないまま機能が積み重なる
            </li>
            <li>
              <strong>技術的負債の蓄積</strong>：要件未達のコードを都度手直しすることで負債が増える
            </li>
            <li>
              <strong>API・仕様のハルシネーション</strong>：存在しないAPIやパラメータをAIが生成する
            </li>
          </ul>
          <p>
            SDDはこの「バイブコーディング」への直接的な対抗策として2025年に登場し、2026年には GitHub
            Spec Kit、AWS Kiro、Claude Code、Cursor、OpenSpec、BMAD-METHOD、Tessl、Google
            Antigravity
            といった主要なAIコーディングツールがそれぞれ独自のSDD実装を提供するに至っています。DeepLearning.AI
            が2025年後半に専門コースを開講したことも、この手法が実験段階から主流へ移行したシグナルの一つとされています。
          </p>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutLabel}>一言でいうと</span>
            <br />
            「仕様がプロンプトである」という表現が、2025〜2026年のGitHubやAWSのブログ記事で繰り返し使われています。曖昧な会話ではなく、構造化された仕様書がAIエージェントへの入力となることで、再現性と検証可能性を確保するという考え方です。
          </div>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_1} />
            <div className={styles.diagramCaption}>図1：バイブコーディングとSDDの構造的な違い</div>
          </div>

          <h3>参照（第1章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://thebcms.com/blog/spec-driven-development">
                Spec-Driven Development (SDD): The Definitive 2026 Guide - BCMS
              </Ext>
            </li>
            <li>
              <Ext href="https://blog.allegro.tech/2026/06/spec-driven-development-best-practices.html">
                Spec-Driven Development (SDD) — best practices (so far) - Allegro Tech
              </Ext>
            </li>
            <li>
              <Ext href="https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2">
                Spec-Driven Development in 2026 - DEV Community
              </Ext>
            </li>
            <li>
              <Ext href="https://www.prnewswire.com/news-releases/thoughtworks-technology-radar-highlights-the-rapid-evolution-of-ai-assistance-in-2025-302600950.html">
                Thoughtworks Technology Radar Highlights The Rapid Evolution of AI Assistance in
                2025 - PR Newswire
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 02 ============ */}
        <section className={styles.chapter} id="sec2">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>02</span>基本原則：仕様を「真実の源」にする
            </h2>
          </div>
          <p className={styles.sectionLead}>
            SDDにおける「仕様（Spec）」は、従来のPRDや設計ドキュメントとは本質的に異なります。両者の違いを理解することが、SDD導入の第一歩です。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>従来のPRD・設計ドキュメント</th>
                  <th>SDDにおける仕様（Spec）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>読み手</td>
                  <td>人間（曖昧さを文脈から補完できる）</td>
                  <td>
                    人間 <strong>と</strong> AIエージェント（曖昧さを補完できない）
                  </td>
                </tr>
                <tr>
                  <td>更新タイミング</td>
                  <td>実装後に更新されないことが多い</td>
                  <td>実装前・変更のたびに更新される「生きた」文書</td>
                </tr>
                <tr>
                  <td>検証方法</td>
                  <td>レビューによる目視確認</td>
                  <td>BDDシナリオ、APIコントラクトテスト、モデルシミュレーションとして実行可能</td>
                </tr>
                <tr>
                  <td>位置づけ</td>
                  <td>参考資料</td>
                  <td>実行のための契約（Contract）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Augment Code社のガイドおよびarXiv論文（Piskala,
            2026）が指摘するように、SDD仕様は「実行される検証ゲート」として機能する点が最大の違いです。PRDは人間が解釈して穴を埋めますが、SDD仕様はAIエージェントに対して明示的な目標・制約・受け入れ基準を与える必要があります。
          </p>

          <h3>2.1 SDDが解決する具体的な問題</h3>
          <ul>
            <li>
              <strong>セキュリティ</strong>
              ：LLMが生成するコードの脆弱性混入率はベンチマークによって9.8%〜42.1%と報告されており（詳細は第13章）、実行可能な仕様がこれに対する検証ゲートとして機能します。
            </li>
            <li>
              <strong>コンプライアンス</strong>：仕様が監査証跡（audit
              trail）として機能し、規制業界での証跡要件を満たします。
            </li>
            <li>
              <strong>チーム間の整合性</strong>
              ：PM、エンジニア、AIエージェント、レビュアーの間で「仕様」という共通言語を持つことで、役割間の解釈のズレを減らします。
            </li>
          </ul>

          <h3>参照（第2章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://arxiv.org/abs/2602.00180">
                Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants
                (arXiv:2602.00180)
              </Ext>
            </li>
            <li>
              <Ext href="https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering">
                Spec-Driven Development: A Spec-First Approach to AI-Native Engineering - Microsoft
                for Developers
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 03 ============ */}
        <section className={styles.chapter} id="sec3">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>03</span>成熟度モデル：Spec-First / Spec-Anchored /
              Spec-as-Source
            </h2>
          </div>
          <p className={styles.sectionLead}>
            Thoughtworksのコンサルタント Birgitta Böckeler が提唱し、Piskalaの論文（arXiv,
            2026）でも採用されている3段階の成熟度モデルが、実務上もっとも参照される分類です。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_2} />
            <div className={styles.diagramCaption}>図2：SDDの3段階成熟度モデル</div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>定義</th>
                  <th>向いているケース</th>
                  <th>リスク</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Spec-First</strong>
                  </td>
                  <td>仕様をよく考えて先に書き、その後のAI支援開発フローで使う</td>
                  <td>小規模機能、探索的な開発</td>
                  <td>実装が進むにつれ仕様が「置き去り」になりやすい</td>
                </tr>
                <tr>
                  <td>
                    <strong>Spec-Anchored</strong>
                  </td>
                  <td>タスク完了後も仕様を保持し、機能の進化・保守のために使い続ける</td>
                  <td>本番運用が前提の機能、チーム開発、監査要件がある場合</td>
                  <td>仕様更新を怠るとドリフトが発生</td>
                </tr>
                <tr>
                  <td>
                    <strong>Spec-as-Source</strong>
                  </td>
                  <td>
                    仕様がメインのソースファイルであり、人間は仕様のみを編集し、コードには触れない
                  </td>
                  <td>高度に定型化された領域（API定義、契約駆動開発など）</td>
                  <td>現時点ではツール・エージェントの成熟度に依存し、リスクが大きい</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            2026年のフィールドガイド（DEV
            Community）では、実務上の落とし所として「Spec-as-Sourceではなく、Spec-Anchoredを目標にすべき」という提言がなされています。これは、コードを最終的な真実の源として保持しつつ、テストを強制力として使い、仕様は最も重要な人間の成果物として扱うという現実的なアプローチです。
          </p>

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>実践者の声</span>
            <br />
            Claude Codeでの実践例を報告したHeeki
            Park氏も、実際にはプロジェクトが進むにつれてSpec-Firstのつもりが「Spec-Once（一度きりの仕様）」に陥りやすいと率直に振り返っています。
          </div>

          <h3>参照（第3章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29">
                Using spec-driven development with Claude Code - Heeki Park (Medium)
              </Ext>
            </li>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2">
                Spec-Driven Development in 2026 - DEV Community
              </Ext>
            </li>
            <li>
              <Ext href="https://arxiv.org/abs/2602.00180">
                Spec-Driven Development: From Code to Contract (arXiv:2602.00180)
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 04 ============ */}
        <section className={styles.chapter} id="sec4">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>04</span>TDD・BDD・ウォーターフォールとの違い
            </h2>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>主たる成果物</th>
                  <th>サイクル</th>
                  <th>対象範囲</th>
                  <th>AIエージェントとの親和性</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>ウォーターフォール</strong>
                  </td>
                  <td>仕様書（フェーズ開始時に固定）</td>
                  <td>一方向・変更を前提としない</td>
                  <td>プロジェクト全体</td>
                  <td>低い（変更に対して硬直的）</td>
                </tr>
                <tr>
                  <td>
                    <strong>TDD</strong>（テスト駆動開発）
                  </td>
                  <td>失敗するユニットテスト</td>
                  <td>テスト→実装→リファクタの短いループ</td>
                  <td>関数・クラス単位</td>
                  <td>中（人間開発者の思考ループ）</td>
                </tr>
                <tr>
                  <td>
                    <strong>BDD</strong>（振る舞い駆動開発）
                  </td>
                  <td>Gherkin形式のシナリオ</td>
                  <td>シナリオ→実装→検証</td>
                  <td>ユーザーの振る舞い単位</td>
                  <td>中〜高（自然言語に近い）</td>
                </tr>
                <tr>
                  <td>
                    <strong>SDD</strong>（仕様駆動開発）
                  </td>
                  <td>実行可能でバージョン管理された仕様一式</td>
                  <td>Spec→Plan→Tasks→Implement→（仕様へ差し戻し）</td>
                  <td>アーキテクチャ・非機能要件を含むシステム全体</td>
                  <td>高い（AIエージェント実行を前提に設計）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            BCMSのガイドやPiskalaの論文で共通して強調されているポイントは、SDDはTDDより対象範囲が広いという点です。TDDは開発者だけの厳格なループであるのに対し、SDDはアーキテクチャ・非機能要件・制約を含み、AIエージェントによる実行を前提としています。多くのSDDワークフローは、最終的にTDDスタイルのテストを成果物の一つとして生成します。
          </p>
          <p>
            ウォーターフォールとの違いとして、ウォーターフォールは仕様を数ヶ月単位のフェーズの冒頭で固定し変更を歓迎しないのに対し、SDDでは仕様は「生きた」文書として継続的に更新される点が決定的に異なります。
          </p>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutLabel}>実務上のポイント</span>
            <br />
            Augment
            Code社は、単体テストは個々の関数を検証できても、複数サービスにまたがるアーキテクチャ違反・APIコントラクトのドリフト・セキュリティのアンチパターンは捕捉できないと指摘し、SDDの仕様はシステムレベルで動作するためこれらの欠陥クラスを構造的に検出できるとしています。
          </div>

          <h3>参照（第4章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://thebcms.com/blog/spec-driven-development">
                Spec-Driven Development (SDD): The Definitive 2026 Guide - BCMS
              </Ext>
            </li>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://arxiv.org/abs/2602.00180">
                Spec-Driven Development: From Code to Contract (arXiv:2602.00180)
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 05 ============ */}
        <section className={styles.chapter} id="sec5">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>05</span>標準ワークフロー全体像
            </h2>
          </div>
          <p className={styles.sectionLead}>
            ツールによって命名は異なりますが、2026年時点で業界標準となりつつあるSDDワークフローは、おおむね次の8〜9ステップに集約されます（GitHub
            Spec Kitの公式Quick Startドキュメントの構成をベースに一般化）。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_3} />
            <div className={styles.diagramCaption}>図3：標準的なSDDワークフロー（8ステップ）</div>
          </div>

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>補足</span>
            <br />
            重要なのは、すべてのステップが必須ではないという点です。GitHub Spec
            Kitの公式ドキュメントでも、簡単な検証であれば{" "}
            <code>specify → plan → tasks → implement</code>{" "}
            の4ステップの「軽量パス」で十分とされ、本番機能や曖昧さが残る作業に対してのみ{" "}
            <code>clarify</code> <code>checklist</code> <code>analyze</code>{" "}
            を品質ゲートとして追加することが推奨されています。
          </div>

          <h3>5.1 各ステップの目的（要点整理）</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ステップ</th>
                  <th>目的</th>
                  <th>実施しないとどうなるか</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Constitution</td>
                  <td>
                    チーム/プロジェクト共通の非交渉的な原則（言語、アーキテクチャ、品質基準）を固定
                  </td>
                  <td>機能ごとに矛盾した技術判断がなされる</td>
                </tr>
                <tr>
                  <td>Specify</td>
                  <td>「何を」「なぜ」作るかを明確化（技術スタックは後回し）</td>
                  <td>実装の前提がAIエージェント任せになり手戻りが発生</td>
                </tr>
                <tr>
                  <td>Clarify</td>
                  <td>要件の穴（権限、エラー処理、永続化要否など）を対話で埋める</td>
                  <td>Plan/Tasks段階で誤った前提のまま進む</td>
                </tr>
                <tr>
                  <td>Plan</td>
                  <td>技術スタック・アーキテクチャ・依存関係を決定</td>
                  <td>実装がその場しのぎのアーキテクチャ判断に流れる</td>
                </tr>
                <tr>
                  <td>Checklist</td>
                  <td>要件の完全性・明確性・一貫性を検証するチェックリストを生成</td>
                  <td>要件の欠落に気づかないまま実装に入る</td>
                </tr>
                <tr>
                  <td>Tasks</td>
                  <td>実行可能で依存関係が明示された単位に分解</td>
                  <td>巨大なタスクをAIエージェントに丸投げしレビュー不能になる</td>
                </tr>
                <tr>
                  <td>Analyze</td>
                  <td>仕様・計画・タスクの整合性をクロス検証</td>
                  <td>実装後に不整合が発覚し手戻りコストが増大</td>
                </tr>
                <tr>
                  <td>Implement</td>
                  <td>確定した文書に基づきAIエージェントが実装</td>
                  <td>―</td>
                </tr>
                <tr>
                  <td>Converge/Review</td>
                  <td>実装が仕様どおりであることを最終確認</td>
                  <td>ドリフトが未検出のままマージされる</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>参照（第5章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://github.github.com/spec-kit/quickstart.html">
                Quick Start Guide - Spec Kit Documentation
              </Ext>
            </li>
            <li>
              <Ext href="https://github.com/github/spec-kit">GitHub - github/spec-kit</Ext>
            </li>
            <li>
              <Ext href="https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/">
                Meet GitHub Spec-Kit - MarkTechPost
              </Ext>
            </li>
            <li>
              <Ext href="https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering">
                Spec-Driven Development: A Spec-First Approach to AI-Native Engineering - Microsoft
                for Developers
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 06 ============ */}
        <section className={styles.chapter} id="sec6">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>06</span>要求定義のベストプラクティス：EARS記法
            </h2>
          </div>
          <p className={styles.sectionLead}>
            SDDにおける「仕様」の質は、要求（Requirements）の書き方に大きく依存します。ここで業界標準になりつつあるのが{" "}
            <strong>EARS（Easy Approach to Requirements Syntax）</strong> 記法です。AWS
            Kiroもこの記法を <code>requirements.md</code> の標準フォーマットとして採用しています。
          </p>

          <h3>6.1 EARSの背景</h3>
          <p>
            EARSは2009年にRolls-Royce社のAlistair
            Mavin氏らのチームが、航空機エンジン制御システムの耐空性規制を分析する過程で開発し、同年のIEEE
            Requirements
            Engineering会議（RE&apos;09）で発表されました。自然言語で書かれる要求は本質的に曖昧になりがちであるという問題意識から、少数のキーワードとシンプルなルールセットで自然言語要求を緩やかに制約する手法として設計されました。Airbus、Bosch、Dyson、Honeywell、Intel、NASA、Rolls-Royce、Siemensなど多くの企業で採用されている実績があります。
          </p>

          <h3>6.2 EARSの基本構文</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>EARS Syntax</span>
              <span className={styles.codeLang}>TEXT</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                While [任意の事前条件], When [任意のトリガー], the [システム名] shall
                [システムの応答]
              </div>
            </div>
          </div>
          <p>
            ルールとして、事前条件は0個以上、トリガーは0個または1個、システム名は1つ、システム応答は1つ以上を持つことができます。
          </p>

          <h3>6.3 EARSの5つのパターン</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>パターン名</th>
                  <th>キーワード</th>
                  <th>用途</th>
                  <th>例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Ubiquitous</strong>（普遍要求）
                  </td>
                  <td>なし</td>
                  <td>常に真である基本的な性質を記述</td>
                  <td>「本システムはすべてのユーザー入力を検証しなければならない (shall)」</td>
                </tr>
                <tr>
                  <td>
                    <strong>Event-Driven</strong>（イベント駆動）
                  </td>
                  <td>When</td>
                  <td>特定のイベント発生時のみ有効</td>
                  <td>「決済が完了した時 (When)、本システムは通知を送信しなければならない」</td>
                </tr>
                <tr>
                  <td>
                    <strong>Unwanted Behavior</strong>（望まない振る舞い）
                  </td>
                  <td>If / Then</td>
                  <td>エラー・故障・異常系を扱う</td>
                  <td>
                    「パスワードが誤って入力された場合
                    (If)、本システムはエラーメッセージを表示しなければならない」
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>State-Driven</strong>（状態駆動）
                  </td>
                  <td>While</td>
                  <td>特定の状態が継続している間有効</td>
                  <td>
                    「決済処理中である間
                    (While)、本システムはキャンセルボタンを無効化しなければならない」
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Optional Feature</strong>（オプション機能）
                  </td>
                  <td>Where</td>
                  <td>特定のオプション機能が存在する場合のみ有効</td>
                  <td>
                    「多要素認証機能が有効な場合
                    (Where)、本システムは確認コードを要求しなければならない」
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            複数のキーワードを組み合わせた「複合要求（Complex
            requirements）」も定義されています。例えば事前条件とトリガーを両方含む形として、「航空機が地上にある間、逆推力が指令された時、エンジン制御システムは逆推力を有効化しなければならない」のように記述します。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_4} />
            <div className={styles.diagramCaption}>図4：EARSパターン選択のための判断フロー</div>
          </div>

          <h3>6.4 実務上のポイント</h3>
          <ul>
            <li>
              EARSは「何を書くか」ではなく「どう書くか」の迷いをなくすことが目的であり、その分、要求の意味（何を実現したいか）に思考リソースを割けるようになります。
            </li>
            <li>
              AWS Kiroの <code>requirements.md</code>{" "}
              は、ユーザーストーリーと受け入れ基準をEARS形式（特にWhen/Then構文）で記述する運用が公式に案内されています。
            </li>
            <li>
              INCOSE Requirements Working
              Groupなどの専門家コミュニティは、EARSはあくまで「文の型（テンプレート）」であり、適格な要求（well-formed
              requirements）にするにはINCOSEの要求記述ガイドなど、上位のルールセットと併用すべきだと指摘しています。EARSだけで要求の質がすべて保証されるわけではない点に注意してください。
            </li>
          </ul>

          <h3>参照（第6章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://alistairmavin.com/ears/">
                Alistair Mavin - EARS: Easy Approach to Requirements Syntax | Official Guide
              </Ext>
            </li>
            <li>
              <Ext href="https://dev.to/sebastian_dingler/ears-the-easy-approach-to-requirements-syntax-39a5">
                EARS: The Easy Approach to Requirements Syntax - DEV Community
              </Ext>
            </li>
            <li>
              <Ext href="https://www.jamasoftware.com/requirements-management-guide/writing-requirements/adopting-the-ears-notation-to-improve-requirements-engineering/">
                Adopting the EARS Notation to Improve Requirements Engineering - Jama Software
              </Ext>
            </li>
            <li>
              <Ext href="https://ieeexplore.ieee.org/document/5328509/">
                Easy Approach to Requirements Syntax (EARS) - IEEE Xplore
              </Ext>
            </li>
            <li>
              <Ext href="https://www.researchgate.net/publication/224079416_Easy_approach_to_requirements_syntax_EARS">
                (PDF) Easy approach to requirements syntax (EARS) - ResearchGate
              </Ext>
            </li>
            <li>
              <Ext href="https://www.linkedin.com/pulse/easy-approach-requirements-syntax-ears-chatgpt-rob-black">
                Easy Approach to Requirements Syntax (EARS) with ChatGPT - LinkedIn (Rob Black)
              </Ext>
            </li>
            <li>
              <Ext href="https://kiro.dev/docs/specs/">Specs - IDE - Docs - Kiro</Ext>
            </li>
            <li>
              <Ext href="https://repost.aws/articles/AROjWKtr5RTjy6T2HbFJD_Mw/%F0%9F%91%BB-kiro-agentic-ai-ide-beyond-a-coding-assistant-full-stack-software-development-with-spec-driven-ai">
                👻 Kiro Agentic AI IDE - AWS re:Post
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 07 ============ */}
        <section className={styles.chapter} id="sec7">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>07</span>主要ツールの選定基準と比較
            </h2>
          </div>
          <p className={styles.sectionLead}>
            2026年半ば時点で、SDDを実践するための代表的なツール／フレームワークは以下の通りです。それぞれ「仕様のライフサイクル（生きた資産か、静的文書か）」「オーケストレーションの範囲（ワークスペース単位か組織単位か）」という2軸で性格が大きく異なります。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>提供元</th>
                  <th>仕様ライフサイクル</th>
                  <th>得意な状況</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>GitHub Spec Kit</strong>
                  </td>
                  <td>GitHub/Microsoft（OSS・MIT）</td>
                  <td>静的（specify→plan→tasksの文書一式）</td>
                  <td>チーム全体で1つのAIコーディング規約を標準化したい</td>
                  <td>
                    <code>specify</code> CLI、30以上のAIエージェント統合、constitution機構
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>AWS Kiro</strong>
                  </td>
                  <td>Amazon Web Services</td>
                  <td>静的〜準生きた文書（steering filesで補完）</td>
                  <td>AWSネイティブな環境で構造化された要求管理をしたい</td>
                  <td>requirements.md/design.md/tasks.mdの三点セット、EARS採用、Wave並列実行</td>
                </tr>
                <tr>
                  <td>
                    <strong>OpenSpec</strong>
                  </td>
                  <td>OSS</td>
                  <td>デルタ形式（ADDED/MODIFIED/REMOVED）</td>
                  <td>既存システムの改修（ブラウンフィールド）</td>
                  <td>変更提案ごとに差分を明示。軽量</td>
                </tr>
                <tr>
                  <td>
                    <strong>BMAD-METHOD</strong>
                  </td>
                  <td>OSS</td>
                  <td>フルライフサイクル・多エージェント</td>
                  <td>複雑なグリーンフィールド開発</td>
                  <td>Analyst/PM/Architect/Developer/QA等12以上のペルソナ</td>
                </tr>
                <tr>
                  <td>
                    <strong>Claude Code系（cc-sdd等）</strong>
                  </td>
                  <td>Anthropicエコシステム</td>
                  <td>プロジェクトにより柔軟</td>
                  <td>Claude Codeを中心にした開発フロー</td>
                  <td>CLAUDE.md・スキル・サブエージェントと組み合わせ運用</td>
                </tr>
                <tr>
                  <td>
                    <strong>Cursor (.cursor/rules)</strong>
                  </td>
                  <td>Cursor</td>
                  <td>軽量な規約ベース</td>
                  <td>IDE内で軽量にAI出力を制御したい</td>
                  <td>Plan Modeでプラン生成。版管理された仕様の強制はない</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Augment
            Code社の比較検証（グリーンフィールドAPI、ブラウンフィールドのExpress.js機能追加、4マイクロサービスのリファクタという3シナリオでテスト）によれば、静的な仕様ツールは数時間で実装と乖離し始めるため、まず「仕様のライフサイクル」を最初に問うべきだとされています。
          </p>

          <h3>7.1 意思決定のためのフローチャート</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_5} />
            <div className={styles.diagramCaption}>図5：SDDツール選定の意思決定フロー</div>
          </div>

          <h3>7.2 併用パターン</h3>
          <p>
            複数の比較記事（Reenbit社、Reinvently社）は、プロジェクトのフェーズによってツールを乗り換える実例を報告しています。ブラウンフィールドの改修（OpenSpec）が軌道に乗り新規機能を積み上げる段階になると、デルタフォーマットだけでは薄く感じられるようになり、アーカイブ済みの仕様をBMADのArchitectエージェントへの入力として引き継ぐ、といった移行が語られています。また、スタートアップがシリーズAを迎えPMを初採用したタイミングで、Spec
            KitのconstitutionをBMADのマスターエージェントプロンプトへ移す、という移行パターンも紹介されています。
          </p>

          <h3>参照（第7章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://www.augmentcode.com/tools/best-spec-driven-development-tools">
                6 Best Spec-Driven Development Tools for AI Coding in 2026 - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://github.com/cameronsjo/spec-compare">
                GitHub - cameronsjo/spec-compare
              </Ext>
            </li>
            <li>
              <Ext href="https://www.marktechpost.com/2026/05/08/9-best-ai-tools-for-spec-driven-development-in-2026-kiro-bmad-gsd-and-more-compare/">
                9 Best AI Tools for Spec-Driven Development in 2026 - MarkTechPost
              </Ext>
            </li>
            <li>
              <Ext href="https://reenbit.com/bmad-vs-spec-kit-vs-openspec-choosing-your-spec-driven-ai-framework/">
                BMAD vs Spec Kit vs OpenSpec - Reenbit
              </Ext>
            </li>
            <li>
              <Ext href="https://reinvently.co.uk/blog/ai-dev-workflow-frameworks-gsd-bmad-openspec-speckit/">
                GSD, BMAD, OpenSpec, or GitHub Spec Kit - Reinvently
              </Ext>
            </li>
            <li>
              <Ext href="https://www.nosam.com/spec-driven-development-openspec-vs-spec-kit-vs-bmad-which-ones-actually-worth-your-time/">
                Spec-Driven Development: OpenSpec vs Spec-Kit vs BMAD - Nosam
              </Ext>
            </li>
            <li>
              <Ext href="https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/">
                What Is SDD? BMAD vs spec-kit vs OpenSpec vs PromptX
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 08 ============ */}
        <section className={styles.chapter} id="sec8">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>08</span>実践編①：GitHub Spec Kit ワークフロー
            </h2>
          </div>
          <p className={styles.sectionLead}>
            GitHub Spec Kitは、GitHubがOSS（MITライセンス）として提供する <code>specify</code>{" "}
            という名前のCLIツールで、2026年時点でもっとも広く採用されているSDDツールの一つです（報告によりスター数の数字に幅がありますが、2026年前半時点でおよそ88,000〜110,000以上のGitHubスターを獲得しています）。Claude
            Code、GitHub Copilot、Gemini
            CLI、Cursorなど30以上のAIエージェント統合をサポートしています。
          </p>

          <h3>8.1 インストールと初期化</h3>
          <p>
            <code>uv</code>{" "}
            パッケージマネージャーを使い、次のようにインストールし、プロジェクトを初期化します。Claude
            Codeでは <code>.claude/skills/</code> 配下、Codex CLIでは <code>.agents/skills/</code>{" "}
            配下に <code>speckit-*</code> スキルを配置する形式が使われる点に注意してください。
          </p>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Terminal</span>
              <span className={styles.codeLang}>BASH</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cc}># インストール</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>
                  uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
                </span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.cc}># プロジェクト初期化（例：Claude Codeと統合）</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>specify init my-project --integration claude</span>
              </div>
            </div>
          </div>

          <h3>8.2 コマンドの実行シーケンス</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_6} />
            <div className={styles.diagramCaption}>図6：GitHub Spec Kit コマンド実行シーケンス</div>
          </div>

          <h3>8.3 constitutionの役割</h3>
          <p>
            constitutionは、そのプロジェクトにおいてAIエージェントがどんな理由があっても逸脱してはならない制約を定義するものです。例えば「TypeScriptのみ・strictモード」「外部の状態管理ライブラリを使わない」「すべての機能に結合テストを持たせる」「WCAG
            2.1
            AA準拠」「明示的なオプトインなしのテレメトリ禁止」といった原則を1回定義すれば、以降のすべてのspec/plan/tasksがこの原則に照らしてチェックされます。
          </p>

          <h3>8.4 実務上の注意点</h3>
          <ul>
            <li>
              公式のガイダンスでは、<code>/speckit.specify</code>{" "}
              の段階では技術スタックにできるだけ触れず、「何を」「なぜ」作るのかを先に明確にすることが推奨されています。
            </li>
            <li>
              <code>/speckit.analyze</code>{" "}
              は実装前の最後の防衛線であり、要件が複数箇所に異なる表現で重複していないか、要件同士が矛盾していないかを検出します。
            </li>
            <li>
              実務者のブログ（Den Delimarsky氏）は、30タスクのリストをいきなり無人で{" "}
              <code>/speckit.implement</code>{" "}
              させず、まず3〜5タスクから始めてレビューし、constitutionを調整してからスケールアップすることを推奨しています。
            </li>
            <li>
              Spec Kitは頻繁にCLIの仕様が変更されており（例えば <code>--ai</code>{" "}
              フラグ体系がv0.7.1で非推奨化され、v0.10.0で完全削除されて <code>--integration</code>{" "}
              方式に置き換えられた）、2026年6月以前のチュートリアルのコマンドが動作しない場合があるため、常に公式ドキュメントを確認する必要があります。
            </li>
            <li>
              Spec
              Kit自体が「実験的（experimental）」と位置づけられており、グリーンフィールドの新規開発や大規模な機能追加に最も適しており、小さなバグ修正には仕様のオーバーヘッドが見合わないとされています。
            </li>
          </ul>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <span className={styles.calloutLabel}>注意</span>
            <br />
            Spec
            Kitのコマンド体系・CLIフラグは変更が速いペースで行われています。実装前には必ず公式ドキュメント（github.github.com/spec-kit）で最新仕様を確認してください。
          </div>

          <h3>参照（第8章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://github.github.com/spec-kit/quickstart.html">
                Quick Start Guide - Spec Kit Documentation
              </Ext>
            </li>
            <li>
              <Ext href="https://github.com/github/spec-kit">GitHub - github/spec-kit</Ext>
            </li>
            <li>
              <Ext href="https://den.dev/blog/github-spec-kit/">
                What&apos;s The Deal With GitHub Spec Kit - Den Delimarsky
              </Ext>
            </li>
            <li>
              <Ext href="https://knightli.com/en/2026/05/25/github-spec-kit-spec-driven-development/">
                What Is GitHub Spec Kit? - knightli.com
              </Ext>
            </li>
            <li>
              <Ext href="https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/">
                Meet GitHub Spec-Kit - MarkTechPost
              </Ext>
            </li>
            <li>
              <Ext href="https://blog.logrocket.com/github-spec-kit/">
                Exploring spec-driven development with the new GitHub Spec Kit - LogRocket Blog
              </Ext>
            </li>
            <li>
              <Ext href="https://www.fundesk.io/spec-driven-development-github-spec-kit-guide">
                GitHub Spec Kit: The 2026 Spec-Driven Development Guide - funDesk
              </Ext>
            </li>
            <li>
              <Ext href="https://rywalker.com/research/github-spec-kit">
                GitHub Spec Kit - Ry Walker Research
              </Ext>
            </li>
            <li>
              <Ext href="https://dev.to/daveu1983/creating-my-portfolio-website-using-githubs-spec-kit-5g40">
                Creating my portfolio website using GitHub&apos;s Spec-kit - DEV Community
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 09 ============ */}
        <section className={styles.chapter} id="sec9">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>09</span>実践編②：AWS Kiro ワークフロー
            </h2>
          </div>
          <p className={styles.sectionLead}>
            AWS Kiroは、Amazon Q Developerの後継として登場したエージェント型IDEで、コード生成前に{" "}
            <code>requirements.md</code>・<code>design.md</code>・<code>tasks.md</code>{" "}
            の3文書を必須とする「spec mandate（仕様の義務化）」を特徴とします。
          </p>

          <h3>9.1 3フェーズのワークフロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_7} />
            <div className={styles.diagramCaption}>図7：AWS Kiroの3フェーズ仕様ワークフロー</div>
          </div>

          <p>
            各フェーズの後、人間によるレビューと承認を経てから次のフェーズへ進む「人間参加型（human-in-the-loop）」の設計になっている点がAWS
            Kiroの特徴です。requirements.mdは「何を」「なぜ」作るかをビジネス用語で捉え、design.mdは技術アーキテクチャ・実装アプローチ・統合ポイントを記述し、tasks.mdは詳細な実装計画を追跡可能な単位で提供します。
          </p>

          <h3>9.2 Wave方式によるタスク並列実行</h3>
          <p>
            Kiroの特徴的な機能として、<code>tasks.md</code>{" "}
            内のタスクの依存関係グラフを自動構築し、依存関係のないタスクを同じ「Wave（波）」としてグループ化し、Wave内は並列実行、Wave間は順次実行するという方式があります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_8} />
            <div className={styles.diagramCaption}>
              図8：Kiroのタスク依存関係に基づくWave並列実行
            </div>
          </div>

          <h3>9.3 Steering Filesとの役割分担</h3>
          <p>
            <code>requirements.md</code> が「何を作るか」、<code>design.md</code>{" "}
            が「どう作るか」を定義するのに対し、Steering
            Filesは機能を横断してすべてのビルドに適用される制約（コーディング規約、セキュリティポリシーなど）を定義します。規制業界向けには、AWS
            GovCloudデプロイでコンプライアンス制約が事前設定されたSteering
            Filesを使う運用も紹介されています。
          </p>

          <h3>9.4 実際の事例：3週間での創薬エージェント構築</h3>
          <p>
            AWSの公式ブログでは、ライフサイエンス業界向けにKiroのspec駆動アプローチを用いた事例が報告されています。3名のソリューションアーキテクトが、他の会議やワークショップと並行しながら3週間で本番稼働するシステムを構築し、Kiroがビジネスロジックコードの95%以上を生成、開発時間にして80時間以上を節約したと報告されています。Agent
            Hooksによりコード変更時に自動でREADME.mdドキュメントを更新する仕組みも活用されました。
          </p>

          <div className={`${styles.callout} ${styles.calloutTip}`}>
            <span className={styles.calloutLabel}>同ブログの提言</span>
            <br />
            「仕様に前もって投資することはすぐに元が取れる（Invest in Specifications Upfront—It Pays
            Off Fast）」
          </div>

          <h3>9.5 実務上の注意点</h3>
          <ul>
            <li>
              実践者の報告では、Kiroが生成するdesign.mdにはエラーハンドリングとテスト戦略が含まれるため、実装ステップでの検証・許可のやり取りが増え、想定より時間がかかることがあると指摘されています。素早く動くものを見たい場合は、テストとエラーハンドリングの量を減らし、後から追加する運用も選択肢です。
            </li>
            <li>
              Kiro技術レビューの中には、要求された仕様の詳細度を「過剰仕様（over-specification）」と評する声もありますが、実践者側の反論としては「AIエージェントが信頼できる出力をするためにはこの詳細度がちょうど良い」という立場もあり、仕様作成フェーズ自体が本質的な作業であるという認識転換が必要だとされています。
            </li>
            <li>
              Kiroは既存コードベース（ブラウンフィールド）向けに、新規開発前に{" "}
              <code>structure.md</code>（コードベースのアーキテクチャ）・<code>tech.md</code>
              （技術スタックとパターン）・<code>product.md</code>
              （ビジネス文脈）の3文書を自動生成し、ベースラインの理解を確立する機能も持っています。
            </li>
          </ul>

          <h3>参照（第9章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://aws.amazon.com/blogs/industries/from-spec-to-production-a-three-week-drug-discovery-agent-using-kiro/">
                From spec to production: a three-week drug discovery agent using Kiro - AWS for
                Industries
              </Ext>
            </li>
            <li>
              <Ext href="https://kiro.dev/docs/specs/">Specs - IDE - Docs - Kiro</Ext>
            </li>
            <li>
              <Ext href="https://builder.aws.com/content/36nn9PbSZuKJiWWoO2UWmFaaCHs/getting-started-with-spec-driven-development-using-kiro">
                Getting Started with Spec-driven Development Using Kiro - AWS Builder Center
              </Ext>
            </li>
            <li>
              <Ext href="https://www.softwareseni.com/aws-kiro-amazons-spec-first-bet-on-agentic-development/">
                AWS Kiro — Amazon&apos;s Spec-First Bet on Agentic Development - SoftwareSeni
              </Ext>
            </li>
            <li>
              <Ext href="https://builder.aws.com/content/3ARqetAlGRTpUYC0R7X24Avy2Wf/experience-with-kiros-spec-driven-development-methodology">
                Experience with Kiro&apos;s spec driven development methodology - AWS Builder Center
              </Ext>
            </li>
            <li>
              <Ext href="https://repost.aws/articles/AROjWKtr5RTjy6T2HbFJD_Mw/%F0%9F%91%BB-kiro-agentic-ai-ide-beyond-a-coding-assistant-full-stack-software-development-with-spec-driven-ai">
                👻 Kiro Agentic AI IDE - AWS re:Post
              </Ext>
            </li>
            <li>
              <Ext href="https://aws.plainenglish.io/what-is-spec-driven-development-and-how-to-implement-it-with-kiro-b5846bd55869">
                What Is Spec-Driven Development and How to Implement It with Kiro - Carlos Biagolini
              </Ext>
            </li>
            <li>
              <Ext href="https://aws.amazon.com/documentation-overview/kiro/">
                Kiro Documentation - AWS
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 10 ============ */}
        <section className={styles.chapter} id="sec10">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>10</span>マルチエージェント検証パターン（Verifier
              Pattern）
            </h2>
          </div>
          <p className={styles.sectionLead}>
            Augment
            Code社のガイドで「もっとも活用されていないパターン」として紹介されているのが、実装を行うエージェント自身に自己検証させるのではなく、別のエージェントに検証させるというパターンです。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_9} />
            <div className={styles.diagramCaption}>
              図9：Coordinator / Implementor / Verifier のマルチエージェント検証パターン
            </div>
          </div>

          <p>
            このパターンの本質は、ImplementorとVerifierが対立する目標を持つことです。Implementorはタスクの完了を最適化しようとするため、自分の出力に対して楽観的になりがちです。一方Verifierは欠陥を見つけることを目的とするエージェントとして設計することで、健全な緊張関係が生まれます。
          </p>

          <p>
            Thoughtworks Technology Radarも、この考え方を「フィードバックセンサー（feedback sensors
            for coding
            agents）」という概念で捉えています。これは、コンパイラ・リンター・型チェッカー・テストスイートといった決定論的な品質ゲートをエージェントのワークフローに直接組み込み、失敗があれば人間のレビュー前に自動修正のループへ入るというアプローチです。
          </p>

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>産業スケールの実例</span>
            <br />
            arXivの「Bootstrapping Coding Agents: The Specification Is the
            Program」という論文では、3〜7名のエンジニアチームが5ヶ月かけて100万行規模のコードベースを、Codexを使い一切人手でコードを書かずに構築した事例が紹介されています。このチームは構造化された{" "}
            <code>docs/</code>{" "}
            ディレクトリを参照システムとして扱い、コードそのものではなく仕様を安定した成果物として位置づけています。
          </div>

          <h3>参照（第10章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://www.thoughtworks.com/radar">Technology Radar | Thoughtworks</Ext>
            </li>
            <li>
              <Ext href="https://arxiv.org/html/2603.17399v1">
                Bootstrapping Coding Agents: The Specification Is the Program (arXiv)
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 11 ============ */}
        <section className={styles.chapter} id="sec11">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>11</span>ベストプラクティス集（12項目）
            </h2>
          </div>
          <ol className={styles.bpList}>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>01</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>仕様の粒度は「annoyance test」で判断する</p>
                <p className={styles.bpDesc}>
                  AIエージェントに意図と違う解釈をされたら困る場合は仕様を書く。ワンショットの追加プロンプトで直せる程度なら仕様のオーバーヘッドは正当化されない、という実務上の判断基準がAugment
                  Code社のガイドで紹介されています。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>02</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>Constitution（原則）を最初に一度だけ固める</p>
                <p className={styles.bpDesc}>
                  機能ごとの原則ではなく、プロジェクト全体・チーム全体の非交渉的な原則として1回定義し、以降のすべての仕様・計画・タスクをこれに照らしてチェックします。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>03</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>Clarifyフェーズを飛ばさない</p>
                <p className={styles.bpDesc}>
                  曖昧さが残る本番機能では、必ず対話的な明確化フェーズを設け、権限・エラー処理・永続化要否などの穴を実装前に埋めます。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>04</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>技術スタックの決定は「何を」の後にする</p>
                <p className={styles.bpDesc}>
                  仕様定義の初期段階では技術スタックに触れず、まず「何を」「なぜ」作るかを明確にしてから、計画フェーズで技術的な意思決定を行います。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>05</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>成熟度はSpec-Anchoredを目標にする</p>
                <p className={styles.bpDesc}>
                  Spec-as-Sourceは魅力的に見えますが、2026年時点ではツール・エージェントの成熟度がまだ追いついていないという指摘が複数あり、コードを真実の源として保持しつつ仕様を最重要の成果物として扱うSpec-Anchoredが現実的な落とし所です。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>06</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>タスクは小さく・段階的に実装する</p>
                <p className={styles.bpDesc}>
                  巨大なタスクリストをいきなり無人実行させず、3〜5タスク程度から始めてレビューし、constitutionや仕様を調整してからスケールさせます。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>07</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>別エージェントによる検証を組み込む</p>
                <p className={styles.bpDesc}>
                  実装エージェントの自己申告に頼らず、Coordinator/Implementor/Verifierのように役割を分離し、対立する目標を持つエージェントに相互チェックさせます。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>08</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>仕様は「生きた文書」として運用する</p>
                <p className={styles.bpDesc}>
                  バグ修正や仕様変更が発生した際は、コードより先に仕様を更新する習慣を徹底します。実務者の報告では、エージェントが変更と同じ手間で仕様を更新できるため、これは追加の負担にはならないとされています。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>09</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>仕様のドリフトは「バグ」として同じ運用で扱う</p>
                <p className={styles.bpDesc}>
                  エージェントが仕様と異なるコードを生成した場合、それは新しい問題ではなく、従来のバグ管理と同じ扱いで直す。レビュー・テストで検出し、ガードレールがなぜ機能しなかったかを分析して再発防止に努めます。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>10</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>
                  ブラウンフィールドとグリーンフィールドでツールを使い分ける
                </p>
                <p className={styles.bpDesc}>
                  既存システムの小規模な改修にはOpenSpecのような軽量なデルタ形式を、複雑な新規開発にはBMAD-METHODのような多エージェント・フルライフサイクル型を使うなど、状況に応じてツールを選定・併用します。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>11</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>
                  監査証跡・ガバナンスが必要な場合は仕様をバージョン管理する
                </p>
                <p className={styles.bpDesc}>
                  規制業界やコンプライアンス要件がある場合、仕様スタックをコードと一緒にバージョン管理へ含めることで、後から「なぜこの変更をしたか」を人間が読める形で追跡できるようにします。
                </p>
              </div>
            </li>
            <li className={styles.bpItem}>
              <div className={styles.bpNum}>12</div>
              <div className={styles.bpContent}>
                <p className={styles.bpTitle}>API呼び出し量の増加を織り込む</p>
                <p className={styles.bpDesc}>
                  SDDワークフローでは、エージェントが毎ターン仕様・計画・タスクを再読み込みするため、バイブコーディングと比較して概ね20〜40%程度APIコストが増加するという実務上の目安が報告されています。予算計画に織り込んでおきましょう。
                </p>
              </div>
            </li>
          </ol>

          <h3>参照（第11章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://medium.com/@tojosphine/spec-driven-development-what-i-wish-i-knew-before-i-started-1213d485a244">
                Spec-Driven Development, What I Wish I Knew Before I Started - Josphine Job
              </Ext>
            </li>
            <li>
              <Ext href="https://blog.allegro.tech/2026/06/spec-driven-development-best-practices.html">
                Spec-Driven Development (SDD) — best practices (so far) - Allegro Tech
              </Ext>
            </li>
            <li>
              <Ext href="https://den.dev/blog/github-spec-kit/">
                What&apos;s The Deal With GitHub Spec Kit - Den Delimarsky
              </Ext>
            </li>
            <li>
              <Ext href="https://www.fundesk.io/spec-driven-development-github-spec-kit-guide">
                GitHub Spec Kit: The 2026 Spec-Driven Development Guide - funDesk
              </Ext>
            </li>
            <li>
              <Ext href="https://aws.amazon.com/blogs/industries/from-spec-to-production-a-three-week-drug-discovery-agent-using-kiro/">
                From spec to production: a three-week drug discovery agent using Kiro - AWS for
                Industries
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 12 ============ */}
        <section className={styles.chapter} id="sec12">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>12</span>アンチパターンと落とし穴
            </h2>
          </div>
          <p className={styles.sectionLead}>
            Thoughtworks Technology Radar（Volume 33,
            2025年11月発行）は、SDDを「Assess（試してみる価値はあるが、まだ本格採用の段階ではない）」リングに位置づけ、次のようなアンチパターンへの警戒を促しています。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>内容</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>過剰仕様</strong>（Over-specification）
                  </td>
                  <td>
                    「良いAI生成体験を得るため」という理由で、開発着手前にアプリケーションのあらゆる側面を定義しようとし、管理不能なほど大量のファイルが生まれる
                  </td>
                  <td>仕様の粒度は必要最小限に留め、annoyance testで都度判断する</td>
                </tr>
                <tr>
                  <td>
                    <strong>ビッグバンリリースへの偏り</strong>
                  </td>
                  <td>重厚な事前仕様化と、一括での大規模リリースに偏りがちになる</td>
                  <td>小さなタスク単位での段階的実装・レビューを徹底する</td>
                </tr>
                <tr>
                  <td>
                    <strong>AI生成コードへの慢心</strong>（complacency）
                  </td>
                  <td>
                    仕様に基づいて生成されたコードだからと過信し、人間のレビューを省略してしまう
                  </td>
                  <td>
                    Verifierパターンや Analyzeステップでの機械的検証と、人間レビューを併用する
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>セマンティック拡散</strong>（Semantic diffusion）
                  </td>
                  <td>
                    「spec-driven development」「harness
                    engineering」といった新語が定義の定まらないまま広まり、成熟したエンジニアリング手法なのか、単なる日常的なAIツール利用の言い換えなのかの境界が曖昧になる
                  </td>
                  <td>自チーム内で用語の定義を明文化し、共通認識を持つ</td>
                </tr>
                <tr>
                  <td>
                    <strong>ツールのAPI・CLI変更への追従漏れ</strong>
                  </td>
                  <td>
                    Spec
                    Kitのようなツールは頻繁にCLI仕様が変更されており、古いチュートリアルのコマンドが動作しなくなることがある
                  </td>
                  <td>常に公式ドキュメントを一次情報として参照する</td>
                </tr>
                <tr>
                  <td>
                    <strong>ブラウンフィールドでの過負荷</strong>
                  </td>
                  <td>
                    複雑な既存システムに重厚な仕様駆動ツール（Kiro/BMAD）を適用すると、過剰投資になりがちである
                  </td>
                  <td>小規模な改修にはOpenSpecのようなデルタ形式の軽量ツールを選ぶ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <span className={styles.calloutLabel}>Thoughtworksポッドキャストより</span>
            <br />
            SDDが「テスト駆動開発と同じように良さそうに見える」一方で、実際には「アプリケーションのすべてを事前に定義すればAIが完璧に生成してくれる」という誤解のもとに運用されると、かえって解決しようとした複雑さより深い層の複雑さに踏み込んでしまう、という懸念が語られています。
          </div>

          <h3>参照（第12章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development">
                Spec-driven development | Technology Radar | Thoughtworks
              </Ext>
            </li>
            <li>
              <Ext href="https://www.thoughtworks.com/radar">Technology Radar | Thoughtworks</Ext>
            </li>
            <li>
              <Ext href="https://www.thoughtworks.com/insights/podcasts/technology-podcasts/themes-technology-radar-33">
                Themes from Technology Radar Vol.33 - Thoughtworks (Podcast)
              </Ext>
            </li>
            <li>
              <Ext href="https://rywalker.com/research/github-spec-kit">
                GitHub Spec Kit - Ry Walker Research
              </Ext>
            </li>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 13 ============ */}
        <section className={styles.chapter} id="sec13">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>13</span>セキュリティ・コンプライアンスの実証データ
            </h2>
          </div>
          <p className={styles.sectionLead}>
            SDDが単なる開発生産性の手法ではなく、セキュリティ上のリスク低減策としても位置づけられている背景には、以下の実証データがあります。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>指標</th>
                  <th>数値</th>
                  <th>出典</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LLMが生成するコードの脆弱性混入率</td>
                  <td>
                    <strong>9.8%〜42.1%</strong>（ベンチマークにより幅あり）
                  </td>
                  <td>Yan et al., 2025（Augment Code社ガイド経由）</td>
                </tr>
                <tr>
                  <td>AIコード生成ツール3種類にまたがるCWEのカタログ化数</td>
                  <td>
                    <strong>43種類のCWE</strong>
                  </td>
                  <td>Fu et al., ACM TOSEM, 2025（同上）</td>
                </tr>
                <tr>
                  <td>本番リポジトリに残存するAI起因の欠陥数（2026年2月時点の大規模実証研究）</td>
                  <td>
                    <strong>11万件以上</strong>
                  </td>
                  <td>arXiv, 2026（同上）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            これらのデータを踏まえ、Augment
            Code社のガイドでは「SDDの仕様は、まさにこうした失敗に対する実行可能な検証ゲートとして機能する」と位置づけています。同ガイドはさらに、いわゆる「Constitutional
            SDD」という発展系のアプローチにも言及しており、ガバナンス層・憲法的制約・監督チェックポイントを仕様駆動開発に追加するパターンとして、規制業界の監査要件、複数チームにまたがるサービス連携、AIが生成したコードに人間の承認を必須とする場面などで採用が進んでいるとされています。
          </p>

          <h3>13.1 コンプライアンスの観点</h3>
          <ul>
            <li>
              仕様がバージョン管理された監査証跡として機能するため、規制要件がコンプライアンスの「証拠」として仕様を扱うようになりつつあります。
            </li>
            <li>
              Kiroの事例のように、規制業界向けにはSteering
              Filesへコンプライアンス制約を事前設定する運用が有効です（第9章参照）。
            </li>
            <li>
              ただし、脆弱性混入率や欠陥残存数の数値はベンチマークや対象リポジトリによって幅があるため、自組織のコードベースにそのまま当てはめず、自組織での計測を行うことが推奨されます。
            </li>
          </ul>

          <h3>参照（第13章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://www.augmentcode.com/guides/what-is-spec-driven-development">
                What Is Spec-Driven Development? A Complete Guide - Augment Code
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 14 ============ */}
        <section className={styles.chapter} id="sec14">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>14</span>組織導入ロードマップ
            </h2>
          </div>
          <p className={styles.sectionLead}>
            SDDを組織へ導入する際は、いきなり全社標準化を狙うのではなく、段階的なロードマップを描くことが推奨されます。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_10} />
            <div className={styles.diagramCaption}>図10：SDD組織導入の5ステップ・ロードマップ</div>
          </div>

          <p>
            Allegro
            Tech社のブログでは、外部ツールなしでもLLMとの対話だけで「今からSDD手法で機能Xを実装したい。ブラウンフィールド／グリーンフィールドかを踏まえ、どんなフェーズでどんな文書を作るべきか」と明示的に伝えるだけで練習セッションが始められるとしており、まずは道具に頼らずSDDの型を体で覚えることを勧めています。同社は社内実装として{" "}
            <code>PRODUCT-SPEC.md</code>（技術非依存のビジネス要求）と{" "}
            <code>TECHNICAL-SPEC.md</code>（技術・非機能要求）を分離する独自運用も紹介しています。
          </p>

          <div className={styles.callout}>
            <span className={styles.calloutLabel}>導入判断の参考データ</span>
            <br />
            2026年1月のJetBrains AI Pulse
            Survey（11,000人の開発者対象）では、90%が業務でAIを使用している一方、SDLC全体でAIを活用しているのはわずか13%にとどまるという調査結果が示されています。またStack
            Overflowの2025年調査では、84%の開発者がAIツールを利用中または利用予定である一方、その正確性を信頼しているのは33%にとどまり、ポジティブな感情は2023〜2024年の70%超から2025年には60%まで低下したと報告されています。これらのデータは、導入のボトルネックはツールの有無ではなく、AIエージェントの出力に対する「信頼」であることを示唆しており、SDDはこの信頼のギャップを埋めるための検証可能な仕組みとして位置づけられます。
          </div>

          <h3>参照（第14章）</h3>
          <ul className={styles.refs}>
            <li>
              <Ext href="https://blog.allegro.tech/2026/06/spec-driven-development-best-practices.html">
                Spec-Driven Development (SDD) — best practices (so far) - Allegro Tech
              </Ext>
            </li>
            <li>
              <Ext href="https://www.augmentcode.com/tools/best-spec-driven-development-tools">
                6 Best Spec-Driven Development Tools for AI Coding in 2026 - Augment Code
              </Ext>
            </li>
            <li>
              <Ext href="https://aws.amazon.com/blogs/industries/from-spec-to-production-a-three-week-drug-discovery-agent-using-kiro/">
                From spec to production: a three-week drug discovery agent using Kiro - AWS for
                Industries
              </Ext>
            </li>
          </ul>
        </section>

        {/* ============ 15 ============ */}
        <section className={styles.chapter} id="sec15">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>15</span>まとめチェックリスト
            </h2>
          </div>
          <p className={styles.sectionLead}>
            導入・実践の際に確認すべきチェックリストとして整理します。
          </p>
          <ul className={styles.checklist}>
            <li>
              プロジェクト／チーム共通の <strong>constitution（原則）</strong> を1つ定義したか
            </li>
            <li>仕様定義の初期段階で、技術スタックに触れず「何を」「なぜ」を明確化したか</li>
            <li>
              曖昧な要件は <strong>clarify</strong> フェーズで対話的に解消したか
            </li>
            <li>
              要求は <strong>EARS記法</strong>（Ubiquitous / Event-Driven / Unwanted Behavior /
              State-Driven / Optional Feature）で書かれているか
            </li>
            <li>
              成熟度モデルとして <strong>Spec-Anchored</strong>{" "}
              を目標に据えているか（Spec-as-Sourceに性急に飛びついていないか）
            </li>
            <li>タスクは小さく分解され、段階的に実装・レビューされているか</li>
            <li>
              実装エージェントとは別に <strong>検証（Verifier）</strong> の仕組みがあるか
            </li>
            <li>仕様は実装より先に更新される「生きた文書」として運用されているか</li>
            <li>
              ブラウンフィールド／グリーンフィールドに応じてツール（OpenSpec / BMAD / Spec Kit /
              Kiro 等）を使い分けているか
            </li>
            <li>監査証跡が必要な場合、仕様一式がバージョン管理下に置かれているか</li>
            <li>APIコスト増加（目安20〜40%）を予算計画に織り込んでいるか</li>
            <li>
              過剰仕様・ビッグバンリリース・AI生成コードへの慢心といったアンチパターンを定期的にレビューしているか
            </li>
          </ul>
        </section>

        {/* ============ 16 ============ */}
        <section className={styles.chapter} id="sec16">
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>16</span>参考文献・出典一覧
            </h2>
          </div>
          <p className={styles.sectionLead}>
            本ガイド全体で参照した情報源の一覧です（2026年7月時点でアクセス可能なURLです）。
          </p>
          <div className={styles.refGrid}>
            {[
              [
                "https://thebcms.com/blog/spec-driven-development",
                "Spec-Driven Development (SDD): The Definitive 2026 Guide - BCMS",
              ],
              [
                "https://blog.allegro.tech/2026/06/spec-driven-development-best-practices.html",
                "Spec-Driven Development (SDD) — best practices (so far) - Allegro Tech",
              ],
              [
                "https://www.augmentcode.com/guides/what-is-spec-driven-development",
                "What Is Spec-Driven Development? A Complete Guide - Augment Code",
              ],
              [
                "https://www.augmentcode.com/tools/best-spec-driven-development-tools",
                "6 Best Spec-Driven Development Tools for AI Coding in 2026 - Augment Code",
              ],
              [
                "https://medium.com/@tojosphine/spec-driven-development-what-i-wish-i-knew-before-i-started-1213d485a244",
                "Spec-Driven Development, What I Wish I Knew Before I Started - Josphine Job (Medium)",
              ],
              [
                "https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering",
                "Spec-Driven Development: A Spec-First Approach to AI-Native Engineering - Microsoft for Developers",
              ],
              [
                "https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29",
                "Using spec-driven development with Claude Code - Heeki Park (Medium)",
              ],
              [
                "https://evangelistsoftware.com/blog/spec-driven-development-guide/",
                "Spec Driven Development [2026]: What It Is & How to Use It - Evangelist Software",
              ],
              [
                "https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2",
                "Spec-Driven Development in 2026 - DEV Community",
              ],
              [
                "https://setronica.com/media/blog/what-is-spec-driven-development-implementation-framework-best-practices/",
                "Spec-Driven Development Explained - Setronica",
              ],
              [
                "https://github.github.com/spec-kit/quickstart.html",
                "Quick Start Guide - Spec Kit Documentation",
              ],
              ["https://github.com/github/spec-kit", "GitHub - github/spec-kit"],
              [
                "https://www.fundesk.io/spec-driven-development-github-spec-kit-guide",
                "GitHub Spec Kit: The 2026 Spec-Driven Development Guide - funDesk",
              ],
              [
                "https://den.dev/blog/github-spec-kit/",
                "What's The Deal With GitHub Spec Kit - Den Delimarsky",
              ],
              [
                "https://knightli.com/en/2026/05/25/github-spec-kit-spec-driven-development/",
                "What Is GitHub Spec Kit? - knightli.com",
              ],
              [
                "https://www.marktechpost.com/2026/05/08/meet-github-spec-kit-an-open-source-toolkit-for-spec-driven-development-with-ai-coding-agents/",
                "Meet GitHub Spec-Kit - MarkTechPost",
              ],
              [
                "https://blog.logrocket.com/github-spec-kit/",
                "Exploring spec-driven development with the new GitHub Spec Kit - LogRocket Blog",
              ],
              [
                "https://rywalker.com/research/github-spec-kit",
                "GitHub Spec Kit - Ry Walker Research",
              ],
              [
                "https://dev.to/daveu1983/creating-my-portfolio-website-using-githubs-spec-kit-5g40",
                "Creating my portfolio website using GitHub's Spec-kit - DEV Community",
              ],
              [
                "https://alistairmavin.com/ears/",
                "Alistair Mavin - EARS: Easy Approach to Requirements Syntax",
              ],
              [
                "https://medium.com/paramtech/ears-the-easy-approach-to-requirements-syntax-b09597aae31d",
                "EARS: The Easy Approach to Requirements Syntax - Medium",
              ],
              [
                "https://dev.to/sebastian_dingler/ears-the-easy-approach-to-requirements-syntax-39a5",
                "EARS: The Easy Approach to Requirements Syntax - DEV Community",
              ],
              [
                "https://www.jamasoftware.com/requirements-management-guide/writing-requirements/adopting-the-ears-notation-to-improve-requirements-engineering/",
                "Adopting the EARS Notation to Improve Requirements Engineering - Jama Software",
              ],
              [
                "https://ieeexplore.ieee.org/document/5328509/",
                "Easy Approach to Requirements Syntax (EARS) - IEEE Xplore",
              ],
              [
                "https://www.researchgate.net/publication/224079416_Easy_approach_to_requirements_syntax_EARS",
                "(PDF) Easy approach to requirements syntax (EARS) - ResearchGate",
              ],
              [
                "https://www.iaria.org/conferences2013/filesICCGI13/ICCGI_2013_Tutorial_Terzakis.pdf",
                "EARS: The Easy Approach to Requirements Syntax Version 1.0 - Intel/IARIA Tutorial",
              ],
              [
                "https://www.linkedin.com/pulse/easy-approach-requirements-syntax-ears-chatgpt-rob-black",
                "Easy Approach to Requirements Syntax (EARS) with ChatGPT - Rob Black",
              ],
              [
                "https://engx.theiet.org/f/discussions/27493/easy-approach-to-requirements-syntax-ears-by-alistair-mavin-requirements-specialist-at-rolls-royce-plc",
                "Easy Approach to Requirements Syntax (EARS) - IET EngX",
              ],
              [
                "https://aws.amazon.com/blogs/industries/from-spec-to-production-a-three-week-drug-discovery-agent-using-kiro/",
                "From spec to production: a three-week drug discovery agent using Kiro - AWS for Industries",
              ],
              ["https://kiro.dev/docs/specs/", "Specs - IDE - Docs - Kiro"],
              [
                "https://builder.aws.com/content/36nn9PbSZuKJiWWoO2UWmFaaCHs/getting-started-with-spec-driven-development-using-kiro",
                "Getting Started with Spec-driven Development Using Kiro - AWS Builder Center",
              ],
              [
                "https://www.softwareseni.com/aws-kiro-amazons-spec-first-bet-on-agentic-development/",
                "AWS Kiro — Amazon's Spec-First Bet on Agentic Development - SoftwareSeni",
              ],
              [
                "https://aws.amazon.com/startups/prompt-library/kiro-project-init?lang=en-US",
                "Kiro Project Init: Automated Spec-Driven Development Setup - AWS Startups",
              ],
              [
                "https://builder.aws.com/content/3ARqetAlGRTpUYC0R7X24Avy2Wf/experience-with-kiros-spec-driven-development-methodology",
                "Experience with Kiro's spec driven development methodology - AWS Builder Center",
              ],
              [
                "https://repost.aws/articles/AROjWKtr5RTjy6T2HbFJD_Mw/%F0%9F%91%BB-kiro-agentic-ai-ide-beyond-a-coding-assistant-full-stack-software-development-with-spec-driven-ai",
                "👻 Kiro Agentic AI IDE: Beyond a Coding Assistant - AWS re:Post",
              ],
              [
                "https://dev.to/aws-heroes/getting-started-with-spec-driven-development-using-kiro-400l",
                "Getting Started with Spec-driven Development Using Kiro - DEV Community",
              ],
              [
                "https://aws.plainenglish.io/what-is-spec-driven-development-and-how-to-implement-it-with-kiro-b5846bd55869",
                "What Is Spec-Driven Development and How to Implement It with Kiro - Carlos Biagolini",
              ],
              ["https://aws.amazon.com/documentation-overview/kiro/", "Kiro Documentation - AWS"],
              [
                "https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2025/11/tr_technology_radar_vol_33_en.pdf",
                "Thoughtworks Technology Radar Volume 33 (PDF)",
              ],
              [
                "https://www.thoughtworks.com/radar",
                "Technology Radar | Guide to technology landscape | Thoughtworks",
              ],
              [
                "https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development",
                "Spec-driven development | Technology Radar | Thoughtworks United States",
              ],
              [
                "https://peterwarnock.com/blog/posts/thoughtworks-tech-radar-33/",
                "Thoughtworks Technology Radar Volume 33 - Peter Warnock",
              ],
              [
                "https://www.thoughtworks.com/insights/podcasts/technology-podcasts/themes-technology-radar-33",
                "Themes from Technology Radar Vol.33 - Thoughtworks (Podcast)",
              ],
              [
                "https://www.thoughtworks.com/about-us/news/2025/thoughtworks-tech-radar-33-rapid-ai",
                "Thoughtworks Technology Radar Highlights The Rapid Evolution of AI Assistance in 2025 - Thoughtworks",
              ],
              [
                "https://www.prnewswire.com/news-releases/thoughtworks-technology-radar-highlights-the-rapid-evolution-of-ai-assistance-in-2025-302600950.html",
                "Thoughtworks Technology Radar Highlights The Rapid Evolution of AI Assistance in 2025 - PR Newswire",
              ],
              ["https://github.com/cameronsjo/spec-compare", "GitHub - cameronsjo/spec-compare"],
              [
                "https://www.marktechpost.com/2026/05/08/9-best-ai-tools-for-spec-driven-development-in-2026-kiro-bmad-gsd-and-more-compare/",
                "9 Best AI Tools for Spec-Driven Development in 2026 - MarkTechPost",
              ],
              [
                "https://redreamality.com/blog/-sddbmad-vs-spec-kit-vs-openspec-vs-promptx/",
                "What Is SDD? BMAD vs spec-kit vs OpenSpec vs PromptX - redreamality",
              ],
              [
                "https://reenbit.com/bmad-vs-spec-kit-vs-openspec-choosing-your-spec-driven-ai-framework/",
                "BMAD vs Spec Kit vs OpenSpec: Choosing Your Spec-Driven AI Framework - Reenbit",
              ],
              [
                "https://reinvently.co.uk/blog/ai-dev-workflow-frameworks-gsd-bmad-openspec-speckit/",
                "GSD, BMAD, OpenSpec, or GitHub Spec Kit - Reinvently",
              ],
              [
                "https://www.nosam.com/spec-driven-development-openspec-vs-spec-kit-vs-bmad-which-ones-actually-worth-your-time/",
                "Spec-Driven Development: OpenSpec vs Spec-Kit vs BMAD - Nosam",
              ],
              [
                "https://medium.com/@reenbit/bmad-vs-spec-kit-vs-openspec-choosing-your-spec-driven-ai-framework-in-2026-a6996b3ebb8d",
                "BMAD vs Spec Kit vs OpenSpec: Choosing Your Spec-Driven AI Framework in 2026 - Reenbit (Medium)",
              ],
              [
                "https://arxiv.org/html/2603.17399v1",
                "Bootstrapping Coding Agents: The Specification Is the Program (arXiv)",
              ],
              [
                "https://www.researchgate.net/publication/400370399_Spec-Driven_DevelopmentFrom_Code_to_Contract_in_the_Age_of_AI_Coding_Assistants",
                "(PDF) Spec-Driven Development: From Code to Contract - ResearchGate",
              ],
              [
                "https://arxiv.org/abs/2602.00180",
                "[2602.00180] Spec-Driven Development: From Code to Contract - arXiv",
              ],
              [
                "https://arxiv.org/html/2602.00180v1",
                "Spec-Driven Development: From Code to Contract（HTML版）- arXiv",
              ],
              [
                "https://huggingface.co/papers/2602.00180",
                "Paper page - Spec-Driven Development: From Code to Contract - Hugging Face",
              ],
            ].map(([href, label], i) => (
              <div key={href} className={styles.refItem}>
                <span className={styles.refNum}>{String(i + 1).padStart(2, "0")}</span>
                <a href={href} target="_blank" rel="noopener noreferrer" className={styles.refLink}>
                  {label}
                </a>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <p>
            本ガイドはAI検索によって収集した2026年7月時点の一次情報を基に作成していますが、各ツールの仕様やコマンド体系は非常に速いペースで更新されています。実装の前には必ず各ツールの公式ドキュメントで最新の仕様を確認してください。
          </p>
        </footer>
      </main>
    </div>
  );
}
