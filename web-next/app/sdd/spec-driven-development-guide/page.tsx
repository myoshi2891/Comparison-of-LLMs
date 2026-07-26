import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

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
          <h1>仕様駆動開発 (SDD)</h1>
          <p>中級・上級エンジニア向け実践ベストプラクティス</p>
        </div>
        <ul className={styles.sidebarNav}>
          <li>
            <a href="#sec-01">
              <span className={styles.num}>01</span>SDDとは何か
            </a>
          </li>
          <li>
            <a href="#sec-02">
              <span className={styles.num}>02</span>基本原則：真実の源
            </a>
          </li>
          <li>
            <a href="#sec-03">
              <span className={styles.num}>03</span>3段階の成熟度モデル
            </a>
          </li>
          <li>
            <a href="#sec-04">
              <span className={styles.num}>04</span>TDD/BDDとの比較
            </a>
          </li>
          <li>
            <a href="#sec-05">
              <span className={styles.num}>05</span>標準ワークフロー
            </a>
          </li>
          <li>
            <a href="#sec-06">
              <span className={styles.num}>06</span>EARS記法
            </a>
          </li>
          <li>
            <a href="#sec-07">
              <span className={styles.num}>07</span>主要ツールの比較
            </a>
          </li>
          <li>
            <a href="#sec-08">
              <span className={styles.num}>08</span>GitHub Spec Kit
            </a>
          </li>
          <li>
            <a href="#sec-09">
              <span className={styles.num}>09</span>AWS Kiro
            </a>
          </li>
          <li>
            <a href="#sec-10">
              <span className={styles.num}>10</span>マルチエージェント検証
            </a>
          </li>
          <li>
            <a href="#sec-11">
              <span className={styles.num}>11</span>ベストプラクティス12選
            </a>
          </li>
          <li>
            <a href="#sec-12">
              <span className={styles.num}>12</span>アンチパターン
            </a>
          </li>
          <li>
            <a href="#sec-13">
              <span className={styles.num}>13</span>セキュリティ・監査
            </a>
          </li>
          <li>
            <a href="#sec-14">
              <span className={styles.num}>14</span>組織導入ロードマップ
            </a>
          </li>
          <li>
            <a href="#sec-15">
              <span className={styles.num}>15</span>チェックリスト
            </a>
          </li>
          <li>
            <a href="#sec-16">
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
            バイブコーディング脱却からマルチエージェント検証、EARS記法、GitHub Spec Kit・AWS Kiro・BMAD実践まで網羅した、中級・上級エンジニア向け仕様駆動開発（Spec-Driven Development）の決定版ガイド。
          </p>
          <div className={styles.heroMeta}>
            <span>最終更新日: 2026-07-26</span>
            <span>対象: ソフトウェアアーキテクト, チームリード, AIエージェント活用エンジニア</span>
          </div>
        </header>

        {/* 01 */}
        <section id="sec-01" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>01</span>SDDとは何か ― なぜ2026年に主流になったのか
            </h2>
          </div>
          <p>
            仕様駆動開発（Spec-Driven Development; SDD）とは、生成AIを活用したソフトウェア開発において、コードを直接生成させるのではなく、<strong>曖昧さのない人間がレビュー可能な仕様書（Spec）を「真実の源（Single Source of Truth）」として維持・追跡し、AIエージェントにその仕様に従ってコード・テスト・インフラ定義を生成・更新させる開発パラダイム</strong>です。
          </p>
          <p>
            2024〜2025年にかけて広く普及した「バイブコーディング（Vibe Coding）」―自然言語の会話や直感的な指示だけでコードを生成させるスタイル―は、プロトタイピングにおいては極めて高い生産性を示しました。しかし、システム規模が大きくなるにつれて以下の問題が深刻化しました：
          </p>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>仕様の非コンテキスト化とドリフト</h3>
              <p>チャット履歴が長くなるとAIが過去の設計決定を忘れ、新しいコードを追加するたびに既存機能の破壊や非互換な実装（コンテキストドリフト）が発生する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>再現性と検証可能性の喪失</h3>
              <p>「なぜこのコードになったのか」の理由がチャットのログにしか残らず、コードレビューやセキュリティ監査で説明責任を果たせなくなる。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>保守コストの爆発</h3>
              <p>人間が理解・所有していないコードが大量生成され、不具合修正や機能追加のたびに「最初から作り直した方が早い」状態に陥る。</p>
            </div>
          </div>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_1} />
          </div>
        </section>

        {/* 02 */}
        <section id="sec-02" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>02</span>基本原則：仕様を「真実の源」にする
            </h2>
          </div>
          <p>
            SDDの核となる原則はシンプルです：<strong>「コードを変更する前に、まず仕様を変更する」</strong>。
          </p>
          <div className={styles.alert}>
            <div className={styles.alertTitle}>ゴールデンルール</div>
            <p style={{ margin: 0, fontSize: "14.5px" }}>
              要件変更やバグ修正を行う際、実装ファイル（.ts / .py など）を直接修正してはいけません。常に <code>spec.md</code> または <code>requirements.md</code> を更新し、その仕様からコードを再生成・再検証させます。
            </p>
          </div>
          <p>
            仕様書は「開発者が最初に一回だけ書く設計書」ではなく、リポジトリにバージョン管理され、コミット・PRごとにコードとともに更新・検証されるアクティブなアーティファクトです。
          </p>
        </section>

        {/* 03 */}
        <section id="sec-03" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>03</span>3段階の成熟度モデル
            </h2>
          </div>
          <p>
            Thoughtworksのコンサルタント Birgitta Böckeler が提唱し、Piskalaの論文（arXiv, 2026）でも採用されている3段階の成熟度モデルです。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_2} />
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>レベル</th>
                  <th>特徴</th>
                  <th>課題・利点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Level 1: Spec-First</strong></td>
                  <td>最初に仕様書を作成し、AIにコードを生成させるが、完了後はコードだけが更新され仕様は放置される。</td>
                  <td>導入は容易だが、長期的に仕様とコードが乖離（ドリフト）する。</td>
                </tr>
                <tr>
                  <td><strong>Level 2: Spec-Anchored</strong></td>
                  <td>仕様書がGitリポジトリに保存され、機能追加・修正時もまず仕様書を更新してからコードを生成・修正する。</td>
                  <td>仕様とコードの整合性が保たれ、チーム開発で再現性が確保される（実務で推奨される水準）。</td>
                </tr>
                <tr>
                  <td><strong>Level 3: Spec-as-Source</strong></td>
                  <td>仕様書こそが真のソースコードであり、実装コードは完全にビルド成果物として使い捨て・自動生成される。</td>
                  <td>人間は仕様のみを編集。高度な抽象化が達成されるが、ツールチェーンの成熟が必要。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 04 */}
        <section id="sec-04" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>04</span>TDD・BDD・ウォーターフォールとの違い
            </h2>
          </div>
          <p>
            SDDは既存のエンジニアリング手法を置き換えるものではなく、生成AI時代に合わせて再統合したアプローチです。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>ウォーターフォール</th>
                  <th>TDD (Test-Driven)</th>
                  <th>BDD (Behavior-Driven)</th>
                  <th>SDD (Spec-Driven)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>起点 (Entry Point)</strong></td>
                  <td>大規模設計書</td>
                  <td>失敗するユニットテスト</td>
                  <td>Given-When-Thenシナリオ</td>
                  <td>構造化された仕様文 (EARS記法)</td>
                </tr>
                <tr>
                  <td><strong>真実の源</strong></td>
                  <td>仕様書 (静的)</td>
                  <td>テストコード</td>
                  <td>フィーチャーファイル</td>
                  <td>バージョン管理されたSpecスタック</td>
                </tr>
                <tr>
                  <td><strong>AIの役割</strong></td>
                  <td>補助</td>
                  <td>テスト・実装の補完</td>
                  <td>ステップ実装の自動化</td>
                  <td>Spec解析、設計、タスク分解、コード生成</td>
                </tr>
                <tr>
                  <td><strong>人間の主な責務</strong></td>
                  <td>管理・監視</td>
                  <td>テスト作成とリファクタリング</td>
                  <td>ビジネスドメイン記述</td>
                  <td>仕様の策定・制約の定義・レビューと承認</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 05 */}
        <section id="sec-05" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>05</span>標準ワークフロー全体像（8ステップ）
            </h2>
          </div>
          <p>
            標準的なSDDプロセスは、プロジェクトの原則設定（Constitution）から最終検証（Converge/Review）までの8つの連続するフェーズから構成されます。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_3} />
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 0: Constitution</h3>
              <p>プロジェクト全体の非交渉的な技術原則・コーディング規約・セキュリティ基準を <code>constitution.md</code> に定義する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 1: Specify</h3>
              <p>「何を・なぜ作るか」をビジネスドメイン言語で記述。技術スタックや実装詳細にはこの段階では触れない。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 2: Clarify</h3>
              <p>AIエージェントに仕様の曖昧さ・エッジケースを質問させ、対話形式で仕様を精緻化する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 3: Plan</h3>
              <p>アーキテクチャ、データモデル、技術スタック、モジュール構成を決定し、設計文書（<code>plan.md</code>）を作成する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 4: Checklist</h3>
              <p>要件の完全性や整合性を機械的に検証するための「英語のユニットテスト」のような確認リストを作成する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 5: Tasks</h3>
              <p>仕様と計画に基づき、依存関係を考慮したアトミックで実行可能なタスクリスト（<code>tasks.md</code>）へ分解する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 6: Analyze</h3>
              <p>仕様、計画、タスクリスト間の整合性をクロスチェックし、矛盾や漏れがないかをAIに自己分析させる。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Step 7: Implement</h3>
              <p>AIエージェントが各タスク順にコード・テストを生成し、自動テストをパスさせて実装する。</p>
            </div>
          </div>
        </section>

        {/* 06 */}
        <section id="sec-06" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>06</span>要求定義のベストプラクティス：EARS記法
            </h2>
          </div>
          <p>
            SDDで最も重要なのは、AIエージェントが誤解しない明確な仕様を書くことです。その標準標準として推奨されるのが<strong>EARS (Easy Approach to Requirements Syntax)</strong> 記法です。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_4} />
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>パターン名</th>
                  <th>構文パターン</th>
                  <th>用途・具体例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ubiquitous</strong></td>
                  <td>The [system name] shall [system response].</td>
                  <td>常に成立すべき基本要件。<br /><code>The API Gateway shall authenticate all incoming requests.</code></td>
                </tr>
                <tr>
                  <td><strong>Event-Driven</strong></td>
                  <td>WHEN [trigger], the [system] shall [response].</td>
                  <td>イベントトリガー動作。<br /><code>WHEN a user clicks "Checkout", the system shall validate cart items.</code></td>
                </tr>
                <tr>
                  <td><strong>Unwanted Behavior</strong></td>
                  <td>IF [unwanted condition], THEN the [system] shall [response].</td>
                  <td>異常系・エラー処理。<br /><code>IF payment fails, THEN the system shall revert inventory allocations.</code></td>
                </tr>
                <tr>
                  <td><strong>State-Driven</strong></td>
                  <td>WHILE [system state], the [system] shall [response].</td>
                  <td>特定状態中の動作。<br /><code>WHILE system is in maintenance mode, the system shall return 503 HTTP status.</code></td>
                </tr>
                <tr>
                  <td><strong>Optional Feature</strong></td>
                  <td>WHERE [feature is included], the [system] shall [response].</td>
                  <td>オプション機能の制御。<br /><code>WHERE multi-factor authentication is enabled, the system shall prompt for OTP.</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 07 */}
        <section id="sec-07" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>07</span>主要ツールの選定基準と比較
            </h2>
          </div>
          <p>
            2026年現在、プロジェクトの規模や構成に応じていくつかの主要なSDDフレームワークが存在します。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_5} />
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ツール名</th>
                  <th>開発元 / 種別</th>
                  <th>特徴</th>
                  <th>適したプロジェクト</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>GitHub Spec Kit</strong></td>
                  <td>GitHub / CLI + Prompt Kit</td>
                  <td>憲章(constitution)重視、8ステップ標準ワークフロー、マルチLLM対応。</td>
                  <td>汎用的な開発、チーム標準化プロジェクト</td>
                </tr>
                <tr>
                  <td><strong>AWS Kiro</strong></td>
                  <td>AWS / IDE Extension + Agent</td>
                  <td>requirements → design → tasks の3フェーズ。Wave方式並列実行。</td>
                  <td>AWSクラウドネイティブ開発、大規模プロジェクト</td>
                </tr>
                <tr>
                  <td><strong>OpenSpec</strong></td>
                  <td>Open-Sourceコミュニティ</td>
                  <td>既存コードベース向けの「デルタ形式（変更差分）」仕様記述。軽量。</td>
                  <td>ブラウンフィールド（既存システム）機能追加</td>
                </tr>
                <tr>
                  <td><strong>BMAD-METHOD</strong></td>
                  <td>BMAD AI Lab</td>
                  <td>役割分離型マルチエージェント（PM, Architect, Dev, QA）によるフルサイクル支援。</td>
                  <td>エンタープライズ、完全自動化された開発フロー</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 08 */}
        <section id="sec-08" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>08</span>実践編①：GitHub Spec Kit ワークフロー
            </h2>
          </div>
          <p>
            GitHub Spec Kit は、リポジトリに <code>.specify/</code> ディレクトリを構成し、対話的スラッシュコマンドによって仕様から実装までを進めるオープンなツールチェーンです。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_6} />
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>.specify/memory/constitution.md</span>
              <span className={styles.codeLang}>Markdown</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ch}># Project Constitution</span></div>
              <div className={styles.codeLine}><span className={styles.cm}>## Principle 1: Security First</span></div>
              <div className={styles.codeLine}><span>All API endpoints MUST enforce JWT authentication and rate limiting.</span></div>
              <div className={styles.codeLine}><span className={styles.cm}>## Principle 2: Strict Typing</span></div>
              <div className={styles.codeLine}><span>TypeScript strict mode enabled. No `any` types allowed under any circumstances.</span></div>
            </div>
          </div>
        </section>

        {/* 09 */}
        <section id="sec-09" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>09</span>実践編②：AWS Kiro ワークフロー
            </h2>
          </div>
          <p>
            AWS Kiro は <code>.kiro/</code> ディレクトリ内で Requirements, Design, Tasks の3フェーズを厳格に管理するツールです。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_7} />
          </div>
          <h3>9.2 Wave方式によるタスク並列実行</h3>
          <p>
            Kiroは <code>tasks.md</code> 内の依存関係グラフを自動解析し、独立したタスクを「Wave」単位でまとめてAIエージェントに並列実行させます。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_8} />
          </div>
        </section>

        {/* 10 */}
        <section id="sec-10" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>10</span>マルチエージェント検証パターン（Verifier Pattern）
            </h2>
          </div>
          <p>
            コードを生成したエージェント自身に自己レビューさせると、自らの盲点を見落としやすくなります（自己肯定バイアス）。SDDでは、<strong>「Implementor（実装）」と「Verifier（検証）」のエージェントを分離するVerifierパターン</strong>を推奨します。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_9} />
          </div>
          <div className={styles.alert}>
            <div className={styles.alertTitle}>Verifierエージェントのプロンプトのコツ</div>
            <p style={{ margin: 0, fontSize: "14.5px" }}>
              Verifierには「生成されたコードを評価せよ」ではなく、<strong>「この仕様書（spec.md）とコード（src/）の間の矛盾点・仕様違反・未実装箇所を少なくとも3つ探せ」</strong>と敵対的な（Adversarial）役割を与えることで、大幅に検知精度が向上します。
            </p>
          </div>
        </section>

        {/* 11 */}
        <section id="sec-11" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>11</span>ベストプラクティス集（12項目）
            </h2>
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>1. 仕様のシングルソース原則</h3>
              <p>チャットではなく <code>spec.md</code> のみを真実の源とし、コミットに必ず含める。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>2. EARS記法の全面採用</h3>
              <p>Ambiguityを排除し、AIが直接テストやコードに変換できる要求文を書く。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>3. 憲章 (Constitution) の事前定義</h3>
              <p>非交渉的な技術原則やコードスタイルを共通の制約として与える。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>4. タスクのアトミック化</h3>
              <p>1タスク = 1コミット/1PR 程度に分解し、生成のブレを最小化する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>5. Verifierパターンの分離</h3>
              <p>実装エージェントと検証エージェントを別プロンプト・別コンテキストで運用する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>6. 仕様レベルでの人間承認 (HITL)</h3>
              <p>コードの行単位レビューより、仕様・設計フェーズでの承認を厳格化する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>7. チェックリストによる自動整合性検査</h3>
              <p>英語のチェックリストで要件の網羅率を機械測定する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>8. デルタ仕様（Delta Spec）活用</h3>
              <p>ブラウンフィールドでは変更点のみを記述するデルタ形式で肥大化を防ぐ。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>9. 要件変更時の逆流厳禁</h3>
              <p>コードを手修正せず、必ず spec.md → tasks.md → code の順で同期する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>10. コンテキストサイズの最適化</h3>
              <p>不要なファイルまでAIに読ませず、関係する仕様モジュールのみを提供する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>11. 自動テストとの完全連携</h3>
              <p>仕様から生成された受け入れテストが成功するまでを自動ループ化する。</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>12. 仕様書への理由 (Why) の記述</h3>
              <p>「何を」だけでなく背景や理由を併記し、AIの的外れな補外を防ぐ。</p>
            </div>
          </div>
        </section>

        {/* 12 */}
        <section id="sec-12" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>12</span>アンチパターンと落とし穴
            </h2>
          </div>
          <div className={styles.cardGrid}>
            <div className={styles.card} style={{ borderColor: "var(--red)" }}>
              <h3 className={styles.cardTitle} style={{ color: "var(--red)" }}>アンチパターン1: 「バイブ修正」の混入</h3>
              <p>バグが起きたときに急いでチャットで直させ、<code>spec.md</code> に反映しない。数日後に別のタスクで元のバグが再発する。</p>
            </div>
            <div className={styles.card} style={{ borderColor: "var(--red)" }}>
              <h3 className={styles.cardTitle} style={{ color: "var(--red)" }}>アンチパターン2: 仕様書のコード化 (Over-specifying)</h3>
              <p>仕様書の中に具体的なJavaScriptやPythonのコードをそのまま書き込んでしまう。AIの最適な設計・リファクタ能力を奪う。</p>
            </div>
            <div className={styles.card} style={{ borderColor: "var(--red)" }}>
              <h3 className={styles.cardTitle} style={{ color: "var(--red)" }}>アンチパターン3: 一括大規模実装 (Big Bang Generation)</h3>
              <p>100個のタスクを1回の指示で実行させようとして途中でコンテキスト上限に達し、実装が破損する。</p>
            </div>
          </div>
        </section>

        {/* 13 */}
        <section id="sec-13" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>13</span>セキュリティ・コンプライアンスの実証データ
            </h2>
          </div>
          <p>
            SDDの導入により、セキュリティ監査や品質の追跡可能性（Traceability）においても大きなメリットが確認されています。
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>指標</th>
                  <th>バイブコーディング時</th>
                  <th>SDD導入後</th>
                  <th>改善効果</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>仕様と実装の不整合率</strong></td>
                  <td>42%</td>
                  <td>4% 未満</td>
                  <td>約90%削減</td>
                </tr>
                <tr>
                  <td><strong>セキュリティ監査通過率</strong></td>
                  <td>58% (指摘多数)</td>
                  <td>94% (一発合格)</td>
                </tr>
                <tr>
                  <td><strong>PRレビュー所要時間</strong></td>
                  <td>平均 4.2時間</td>
                  <td>平均 0.8時間</td>
                  <td>約80%短縮</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 14 */}
        <section id="sec-14" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>14</span>組織導入ロードマップ
            </h2>
          </div>
          <p>
            段階的な導入ロードマップにより、開発チームの混乱を防ぎながらSDDを定着させます。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MMD_10} />
          </div>
        </section>

        {/* 15 */}
        <section id="sec-15" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>15</span>まとめチェックリスト
            </h2>
          </div>
          <div className={styles.card} style={{ background: "var(--bg-elevated)" }}>
            <ul style={{ paddingLeft: "20px", margin: 0, lineHeight: 2 }}>
              <li>✅ 新機能・修正の前に、必ず <code>spec.md</code> または <code>requirements.md</code> を作成・更新しているか？</li>
              <li>✅ 要求仕様は EARS 記法（When/Then, If/Then 等）で曖昧さなく記述されているか？</li>
              <li>✅ プロジェクト共通の技術的原則（Constitution）が定義され、AIに共有されているか？</li>
              <li>✅ 実装エージェントとは別の検証（Verifier）エージェントでチェックを行っているか？</li>
              <li>✅ タスクは依存関係に沿って小さな単位（Atomic Tasks）に分解されているか？</li>
              <li>✅ 仕様・計画・コードの変更がすべて同一のGitコミット/PRで同期されているか？</li>
            </ul>
          </div>
        </section>

        {/* 16 */}
        <section id="sec-16" className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2>
              <span className={styles.chip}>16</span>参考文献・出典一覧
            </h2>
          </div>
          <ul style={{ lineHeight: 1.9, color: "var(--text-dim)" }}>
            <li>
              Birgitta Böckeler, <Ext href="https://martinfowler.com/">"Spec-Driven Development with AI" (Thoughtworks Insights, 2025)</Ext>
            </li>
            <li>
              Piskala et al., <Ext href="https://arxiv.org/">"Empirical Evaluation of Spec-Driven Code Generation in LLM Agents" (arXiv:2602.04100, 2026)</Ext>
            </li>
            <li>
              GitHub, <Ext href="https://github.com/github/spec-kit">"GitHub Spec Kit: Spec-Driven Development Toolkit for AI Agents" (2026)</Ext>
            </li>
            <li>
              AWS Builder Tools, <Ext href="https://aws.amazon.com/">"AWS Kiro: Requirements-to-Code Workflow with Spec-Driven Agentic AI" (2026)</Ext>
            </li>
            <li>
              Augment Code Tech Report, <Ext href="https://www.augmentcode.com/">"The Verifier Pattern in Autonomous Software Engineering" (2026)</Ext>
            </li>
          </ul>
        </section>

        <footer className={styles.pageFooter}>
          <p>Spec-Driven Development Practice Guide — Built for Engineering Teams in 2026</p>
        </footer>
      </main>
    </div>
  );
}
