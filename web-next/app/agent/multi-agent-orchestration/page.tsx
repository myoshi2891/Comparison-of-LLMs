import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "マルチエージェントオーケストレーション ベストプラクティスガイド | AI Model Cost Calculator",
  description:
    "2026年最新のマルチエージェントオーケストレーション実践ガイド。Anthropic、Google、OpenAIの最新プラクティスに基づくアーキテクチャ、協調パターン、プロトコル（MCP/A2A）、可観測性、セキュリティを完全解説。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1 = `flowchart TD
    A["新しいタスクを受け取る"] --> B{"3つのシグナルに該当するか?"}
    B -->|"いいえ"| C["シングルエージェントで実装する"]
    C --> D["プロンプト/ツール設計を改善する"]
    B -->|"はい"| E["マルチエージェント設計を検討する"]
    E --> F["Step2: タスク分解の設計へ進む"]`;

const DIAGRAM_2 = `flowchart LR
    subgraph PC["Problem-centric分解(非推奨)"]
        direction TB
        P1["Planner"] --> P2["Implementer"]
        P2 --> P3["Tester"]
        P3 --> P4["Reviewer"]
    end
    subgraph CC["Context-centric分解(推奨)"]
        direction TB
        C1["機能A担当(実装とテストを一体で保持)"]
        C2["機能B担当(実装とテストを一体で保持)"]
        C3["独立した検証者(ブラックボックステスト)"]
    end`;

const DIAGRAM_3 = `flowchart LR
    T["タスク"] --> G["Generator"]
    G --> V["Verifier"]
    V -->|"基準を満たす"| O["最終出力"]
    V -->|"却下 + 具体的な理由"| G`;

const DIAGRAM_4 = `flowchart TD
    U["ユーザーリクエスト"] --> O["Orchestrator(Lead Agent)"]
    O --> S1["Subagent: セキュリティ監査"]
    O --> S2["Subagent: テストカバレッジ確認"]
    O --> S3["Subagent: コードスタイル評価"]
    S1 --> O
    S2 --> O
    S3 --> O
    O --> R["統合されたレビュー結果"]`;

const DIAGRAM_5 = `flowchart TD
    C["Coordinator"] --> Q["共有タスクキュー"]
    Q --> T1["Teammate 1(永続的に稼働)"]
    Q --> T2["Teammate 2(永続的に稼働)"]
    Q --> T3["Teammate 3(永続的に稼働)"]
    T1 --> C
    T2 --> C
    T3 --> C`;

const DIAGRAM_6 = `flowchart LR
    A1["トリアージエージェント"] -->|"publish: 高深刻度ネットワークアラート"| Bus["メッセージバス(Router)"]
    A2["別のソース"] -->|"publish: 認証系アラート"| Bus
    Bus -->|"subscribe"| A3["ネットワーク調査エージェント"]
    Bus -->|"subscribe"| A4["ID分析エージェント"]
    A3 -->|"publish: エンリッチメント要求"| Bus
    Bus -->|"subscribe"| A5["コンテキスト収集エージェント"]`;

const DIAGRAM_7 = `flowchart TD
    S["共有ストア(DB / ファイル / ドキュメント)"]
    A1["学術文献調査エージェント"] --> S
    A2["業界レポート分析エージェント"] --> S
    A3["特許調査エージェント"] --> S
    A4["ニュース監視エージェント"] --> S
    S --> A1
    S --> A2
    S --> A3
    S --> A4`;

const DIAGRAM_8 = `flowchart TD
    M["メインエージェントが成果物を生成"] --> V["Verification Subagentを起動"]
    V --> T["テストスイート全体を実行"]
    T --> J{"全項目が基準を満たすか?"}
    J -->|"はい"| P["PASSと判定"]
    J -->|"いいえ"| F["具体的な失敗理由を返却"]
    F --> M
    M -->|"最大試行回数に到達"| Esc["人間にエスカレーション"]`;

const DIAGRAM_9 = `flowchart LR
    Agent["自組織のAIエージェント"] -->|"MCP: 垂直統合(ツール・データアクセス)"| Tool["外部ツール・DB・SaaS API"]
    Agent -->|"A2A: 水平連携(エージェント間の委任・発見)"| Other["他ベンダー・他モデルのAIエージェント"]
    Other -->|"Agent Cardで能力を公開"| Agent`;

const DIAGRAM_10 = `flowchart TD
    Root["Root: SequentialAgent"] --> R1["Research Agent"]
    R1 --> Loop["LoopAgent(最大反復回数あり)"]
    Loop --> Cr["Critic Agent"]
    Cr --> Ref["Refine Agent"]
    Ref -->|"品質基準を満たすまで繰り返す"| Cr
    Loop --> Con["Conclusion Agent"]`;

const DIAGRAM_11 = `flowchart TD
    Task["タスク実行開始"] --> CP["チェックポイントを保存"]
    CP --> Exec["エージェントを実行"]
    Exec --> Err{"エラーが発生したか?"}
    Err -->|"いいえ"| Next["次のステップへ進む"]
    Err -->|"はい"| Retry{"リトライ上限内か?"}
    Retry -->|"はい"| Restore["直前のチェックポイントから再開"]
    Restore --> Exec
    Retry -->|"いいえ"| Escalate["人間にエスカレーションする"]`;

const DIAGRAM_12 = `flowchart TD
    Ext["外部入力(Webページ・ツール出力・メール等)"] --> A1["エージェントA(信頼境界の内側)"]
    A1 -->|"要約・ハンドオフ"| A2["エージェントB"]
    A2 -->|"要約・ハンドオフ"| A3["エージェントC"]
    A1 -.->|"最小権限のツールのみ許可"| Guard1["ガードレール/権限チェック"]
    A2 -.->|"最小権限のツールのみ許可"| Guard2["ガードレール/権限チェック"]
    A3 -.->|"高リスク操作は人間承認"| Human["人間の承認ステップ"]`;

const DIAGRAM_13 = `flowchart LR
    Req["ユーザーリクエスト"] --> Root["Orchestratorのスパン"]
    Root --> S1["Subagent Aのスパン"]
    Root --> S2["Subagent Bのスパン"]
    S1 --> Tool1["ツール呼び出しのスパン"]
    S2 --> Tool2["ツール呼び出しのスパン"]
    Root --> Trace["分散トレース(OpenTelemetryベース)"]
    Trace --> Judge["LLM-as-a-Judgeによる自動評価"]
    Judge --> Human["人間レビューによる抜き取り検証"]`;

const DIAGRAM_14 = `flowchart TD
    S1["Step1: シングル/マルチの判断"] --> S2["Step2: Context-centricな分解設計"]
    S2 --> S3["Step3: 協調パターンの選択"]
    S3 --> S4["Step4: 検証エージェントの設計"]
    S4 --> S5["Step5: 通信プロトコル設計(MCP/A2A)"]
    S5 --> S6["Step6: フレームワーク選定"]
    S6 --> S7["Step7: 状態管理とコンテキスト設計"]
    S7 --> S8["Step8: 耐障害性設計"]
    S8 --> S9["Step9: セキュリティ設計"]
    S9 --> S10["Step10: 可観測性と評価の組み込み"]
    S10 --> S11["Step11: コスト最適化"]
    S11 --> Done["本番デプロイと継続的モニタリング"]
    Done -.->|"問題発生時はパターンを見直す"| S3`;

export default function MultiAgentOrchestrationPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          <div className={styles.badge}>
            <i className={styles.tiTiTopologyStar3} /> ARCHITECTURE GUIDE
          </div>
          <div className={styles.sidebarTitleText}>マルチエージェントオーケストレーション</div>
          <p>ベストプラクティスガイド 2026</p>
        </div>

        <nav className={styles.tocNav}>
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>導入と判断</div>
            <a href="#intro">1. 概要と背景</a>
            <a href="#why-now">2. なぜ注目されるのか</a>
            <a href="#step1">Step1: 判断基準</a>
          </div>

          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>設計と協調</div>
            <a href="#step2">Step2: ドメイン分解</a>
            <a href="#step3">Step3: 協調パターン</a>
            <a href="#step4">Step4: 早期合格問題</a>
          </div>

          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>プロトコルと実装</div>
            <a href="#step5">Step5: 通信プロトコル(MCP/A2A)</a>
            <a href="#step6">Step6: フレームワーク選定</a>
            <a href="#step7">Step7: 状態管理</a>
          </div>

          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>運用と品質</div>
            <a href="#step8">Step8: 耐障害性</a>
            <a href="#step9">Step9: セキュリティ</a>
            <a href="#step10">Step10: 可観測性と評価</a>
            <a href="#step11">Step11: コストとレイテンシ</a>
          </div>

          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>まとめ</div>
            <a href="#antipatterns">アンチパターン</a>
            <a href="#big-picture">全体ワークフロー</a>
            <a href="#summary">まとめ</a>
            <a href="#references">参考文献</a>
          </div>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.hero}>
          <div className={styles.chip}>
            <span>Architecture &amp; Best Practices</span>
          </div>
          <h1>マルチエージェントオーケストレーション ベストプラクティスガイド</h1>
          <p>
            複数のAIエージェントを自律的かつ協調的に動作させる「マルチエージェントシステム」の設計・構築・本番運用における最新知見を包括的に解説。Anthropic、Google、OpenAI、OWASPの2026年最新の設計思想を凝縮。
          </p>

          <div className={styles.metaGrid}>
            <div className={styles.metaCard}>
              <div className={styles.metaCardLabel}>対象読者</div>
              <div className={styles.metaCardVal}>AIアーキテクト / エンジニア</div>
            </div>
            <div className={styles.metaCardCard ?? styles.metaCard}>
              <div className={styles.metaCardLabel}>主要プロトコル</div>
              <div className={styles.metaCardVal}>MCP / A2A Protocol</div>
            </div>
            <div className={styles.metaCard}>
              <div className={styles.metaCardLabel}>Mermaid図解</div>
              <div className={styles.metaCardVal}>全14点収録</div>
            </div>
          </div>
        </header>

        {/* Section 1: Intro */}
        <section id="intro" className={styles.section}>
          <h2 className={styles.sectionTitle}>1. マルチエージェントオーケストレーションとは</h2>
          <p>
            マルチエージェントオーケストレーションとは、単一のAIモデル（シングルエージェント）では解決が困難な複雑なタスクを、それぞれ専門化された複数のAIエージェントに分割・委任し、協調して成果物を生成させるアーキテクチャ設計手法です。
          </p>
          <p>
            単に複数のエージェントを並べるだけでなく、タスクの分解、コンテキストの管理、通信プロトコルの定義、出力の検証、エラーハンドリングまでを含めた総合的な制御システムを指します。
          </p>
        </section>

        {/* Section 2: Why Now */}
        <section id="why-now" className={styles.section}>
          <h2 className={styles.sectionTitle}>2. なぜ今マルチエージェントが注目されているのか</h2>
          <p>
            2026年現在、フロンティアLLM（Claude 4、GPT-5.6、Gemini 3.6等）の性能向上に伴い、AIに対する要求が「一問一答」から「長期的なタスク自動化（Agentic Workflows）」へと変化しています。
          </p>
          <p>
            単一エージェントで巨大なプロンプトと膨大なツールを与えると、アテンションの散乱、コンテキストウィンドウの消費、ツール誤用、命令無視などの限界に直面します。これを解決するため、責務とコンテキストを分離するマルチエージェント設計が標準的となっています。
          </p>
        </section>

        {/* Section 3: Step 1 */}
        <section id="step1" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step1: シングル vs マルチの判断基準</h2>
          <p>
            マルチエージェント設計を導入する前に、まず「本当にマルチエージェントが必要か」を慎重に判断する必要があります。マルチエージェント化は複雑性とコストを跳ね上げるため、<strong>シングルエージェントで解決できる問題にはシングルエージェントを採用するのが最大の原則</strong>です。
          </p>
          <p>
            Anthropicのガイドラインでは、以下の3つの条件のうち1つ以上を満たす場合にのみマルチエージェント化を検討することを推奨しています。
          </p>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>1. コンテキスト限界</div>
              <p>単一エージェントのコンテキスト（アテンション）が溢れ、過去の指示やコンテキストを忘れ始める場合。</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>2. 明確な並列化機会</div>
              <p>タスクが完全に独立した複数のサブタスクに分解でき、並行して処理することでレイテンシを大幅に短縮できる場合。</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>3. 専門特化の必要性</div>
              <p>異なるツール群や背景知識、相反するロール（開発者と安全検証者など）を完全に分離する必要がある場合。</p>
            </div>
          </div>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_1} />
            <div className={styles.mermaidCaption}>図1: マルチエージェント化の判断フロー</div>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>参照URL</div>
            <p>
              <Ext href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them">
                Building multi-agent systems: When and how to use them — Claude by Anthropic
              </Ext>
            </p>
          </div>
        </section>

        {/* Section 4: Step 2 */}
        <section id="step2" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step2: タスク分解の設計原則(Context-Centric Decomposition)</h2>
          <p>
            マルチエージェント化を決めた後、最も重要な設計判断は「<strong>どうやって作業をエージェント間に分割するか</strong>」です。ここでチームが最も頻繁に間違える判断でもあります。
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>2-1. Problem-Centric(作業種別による分解)は非推奨</h3>
            <p>
              「実装担当」「テスト担当」「レビュー担当」のように<strong>作業の種類</strong>で分割すると、ハンドオフのたびにコンテキストが失われ、常に調整コストが発生します。実際にソフトウェア開発ロールごとにサブエージェントを分けた実験では、実作業よりも調整(coordination)にトークンを多く消費したという報告があります。
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>2-2. Context-Centric(コンテキスト境界による分解)が有効</h3>
            <p>
              「必要なコンテキストの境界」で分割するのが原則です。たとえば1つの機能を実装するエージェントは、そのテストも担当すべきです。すでに実装の背景知識を持っているためです。分割してよいのは、コンテキストが本当に独立している場合に限ります。
            </p>
          </div>

          <div className={`${styles.callout} ${styles.calloutSuccess}`}>
            <div className={styles.calloutTitle}>有効な分割境界の例</div>
            <p>
              独立したリサーチ経路(「アジア市場動向」と「欧州市場動向」は並行して進められる)、明確なAPI契約で結ばれた疎結合コンポーネント(フロントエンドとバックエンド)、ブラックボックス検証(実装の背景を知らなくてもテストを実行し結果を報告できる検証者)。
            </p>
          </div>

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <div className={styles.calloutTitle}>問題のある分割境界の例</div>
            <p>
              同じ機能の逐次フェーズ(計画・実装・テストは背景知識を共有しすぎている)、密結合なコンポーネント(頻繁なすり合わせが必要なものは1つのエージェントにまとめる)、共有状態を頻繁に同期する必要がある作業。
            </p>
          </div>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_2} />
            <div className={styles.mermaidCaption}>図2: Problem-centric分解 と Context-centric分解の比較</div>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>参照URL</div>
            <p>
              <Ext href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them">
                Building multi-agent systems: When and how to use them — Claude by Anthropic
              </Ext>
            </p>
          </div>
        </section>

        {/* Section 5: Step 3 */}
        <section id="step3" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step3: 協調パターン(Coordination Pattern)を選ぶ</h2>
          <p>
            タスク分解の方針が決まったら、次に「エージェント同士がどう協調するか」というコーディネーションパターンを選びます。2026年4月にAnthropicが公開した整理では、以下の5つのパターンが実運用で定着しています。<strong>最初はもっとも単純なパターンから始め、限界にぶつかったら次のパターンへ進化させる</strong>のが推奨アプローチです。
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3-1. Generator-Verifier(生成者-検証者)</h3>
            <p>
              最もシンプルで、最も広く導入されているパターンです。生成者(Generator)がタスクを受け取り初期出力を作成し、検証者(Verifier)がその出力を評価します。基準を満たせば完了、満たさなければ具体的なフィードバックとともに生成者へ差し戻します。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_3} />
              <div className={styles.mermaidCaption}>図3: Generator-Verifierパターン</div>
            </div>
            <p>
              <strong>向いている用途:</strong> コード生成(1体が実装しもう1体がテストを実行する)、ファクトチェック、ルーブリック採点、コンプライアンス確認など、出力品質が重要で評価基準を明文化できる領域。
            </p>
            <p>
              <strong>弱点:</strong> 検証者の基準が曖昧だと「とりあえずOK」を出す「お墨付き」問題が起きます。生成とレビューが同程度に難しいタスクでは、検証者が問題を確実に検出できない場合もあります。また収束しない場合に備えて最大反復回数とフォールバック(人間へのエスカレーション、注意書き付きでベスト出力を返すなど)を必ず設定します。
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3-2. Orchestrator-Subagent(オーケストレーター-サブエージェント)</h3>
            <p>
              階層構造が特徴です。リード(Lead)エージェントが計画・委任・統合を行い、サブエージェントはリードから割り当てられた特定の責務のみを実行し結果を返します。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_4} />
              <div className={styles.mermaidCaption}>図4: Orchestrator-Subagentパターン</div>
            </div>
            <p>
              <strong>向いている用途:</strong> タスク分解が明確でサブタスク間の依存が少ない場合。たとえばプルリクエストのレビューで、セキュリティ・テストカバレッジ・スタイル・アーキテクチャ整合性をそれぞれ専門サブエージェントに割り当て、最後に統合するケース。Claude Codeのバックグラウンドサブエージェント機能もこのパターンを採用しています。
            </p>
            <p>
              <strong>弱点:</strong> オーケストレーターが情報のボトルネックになります。あるサブエージェントの発見が別のサブエージェントの分析に関係する場合、その情報はオーケストレーターを経由しなければならず、何度もハンドオフを重ねるうちに重要な詳細が失われがちです。また明示的に並列化しない限り逐次実行になり、速度面のメリットを得られないままマルチエージェントのコストだけがかかることがあります。
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3-3. Agent Teams(エージェントチーム)</h3>
            <p>
              サブタスクが長期間独立して並行進行できる場合に有効です。コーディネーターが複数のワーカーエージェントを独立プロセスとして起動し、ワーカーは共有キューからタスクを取得して自律的に複数ステップにわたり作業し、完了を通知します。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_5} />
              <div className={styles.mermaidCaption}>図5: Agent Teamsパターン</div>
            </div>
            <p>
              Orchestrator-Subagentとの違いは「ワーカーの永続性」です。オーケストレーターは1つの束縛されたサブタスクのためにサブエージェントを起動し、結果を返したら終了させますが、Agent Teamsのワーカーは多数の割り当てにまたがって稼働し続け、ドメイン知識を蓄積していきます。
            </p>
            <p>
              <strong>向いている用途:</strong> 大規模なコードベースのフレームワーク移行のように、サービスごとに独立した依存関係・テストスイート・デプロイ設定を持つ場合。各ワーカーはその担当領域に習熟していきます。
            </p>
            <p>
              <strong>弱点:</strong> 独立性が前提条件です。1つのワーカーの作業が別のワーカーに影響する場合、互いに気づけず、出力が衝突する可能性があります。完了検出も難しく(あるワーカーは2分で終わり、別のワーカーは20分かかるなど)、共有リソース(同じコードベースやDB)への同時書き込みには衝突解決の仕組みが必要です。
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3-4. Message Bus(メッセージバス)</h3>
            <p>
              エージェント数が増え、相互作用が複雑になった場合に有効です。エージェントは共有の通信レイヤーを通じてイベントをpublish(発行)し、関心のあるトピックをsubscribe(購読)します。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_6} />
              <div className={styles.mermaidCaption}>図6: Message Busパターン</div>
            </div>
            <p>
              <strong>向いている用途:</strong> セキュリティオペレーションの自動化のように、ワークフローが決められたシーケンスではなくイベント発生に応じて動的に変化するパイプライン。新しいエージェント種別を後から追加しても既存の接続を書き換える必要がありません。
            </p>
            <p>
              <strong>弱点:</strong> イベント駆動の柔軟性はトレーサビリティを犠牲にします。1つのアラートが5つのエージェントにまたがる連鎖を引き起こすと、何が起きたかを把握するには丁寧なログと相関分析が必要になります。ルーティングの精度も重要で、ルーターが誤分類・見落としをすると「サイレント障害(クラッシュせずに何も処理しない)」が起きます。
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3-5. Shared State(共有ステート)</h3>
            <p>
              これまでのパターンはすべて中央の管理役(オーケストレーター、チームリード、ルーター)が情報の流れを管理していました。Shared Stateはその仲介者を排除し、全エージェントが直接読み書きできる永続ストアを通じて協調します。
            </p>
            <div className={styles.mermaidWrap}>
              <MermaidDiagram chart={DIAGRAM_7} />
              <div className={styles.mermaidCaption}>図7: Shared Stateパターン</div>
            </div>
            <p>
              <strong>向いている用途:</strong> 複数のエージェントが複雑な問いの異なる側面を調査し、互いの発見が他の調査に影響するリサーチ統合システム。学術文献担当が発見した重要な研究者情報を、業界分析担当がすぐに参照できます。単一障害点(コーディネーターやルーターの停止)を排除できる点も利点です。
            </p>
            <p>
              <strong>弱点:</strong> 明示的な調整がないため、重複作業や矛盾するアプローチが起きやすくなります。より深刻なのは「反応ループ」です。AがBへの気づきを書き込み、BがそれをもとにAへの追記を書き込み…と収束しない堂々巡りが起き、トークンを消費し続けます。重複書き込みにはロックやバージョニングといった技術的対策がありますが、反応ループには時間予算・収束閾値(Nサイクル新しい発見がなければ終了)・十分な回答が揃ったかを判断する専任エージェントなど、<strong>明示的な終了条件</strong>を最初から設計する必要があります。
            </p>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3-6. パターン選択の早見表</h3>
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>パターン</th>
                    <th>制御モデル</th>
                    <th>状態管理</th>
                    <th>最適な接続数</th>
                    <th>得意なユースケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Generator-Verifier</td>
                    <td>2体間のループ</td>
                    <td>各交代時</td>
                    <td>1対1</td>
                    <td>品質重視・コード評価</td>
                  </tr>
                  <tr>
                    <td>Orchestrator-Subagent</td>
                    <td>中央集中（階層）</td>
                    <td>Lead集約</td>
                    <td>1対N（スター型）</td>
                    <td>明瞭なタスク分解・並列実行</td>
                  </tr>
                  <tr>
                    <td>Agent Teams</td>
                    <td>自律並行</td>
                    <td>共有キュー</td>
                    <td>N対N（疎結合）</td>
                    <td>長期独立タスク・ドメイン熟達</td>
                  </tr>
                  <tr>
                    <td>Message Bus</td>
                    <td>イベント駆動</td>
                    <td>メッセージログ</td>
                    <td>N対N（ルーター経由）</td>
                    <td>動的パイプライン・SOC対応</td>
                  </tr>
                  <tr>
                    <td>Shared State</td>
                    <td>分散（中央なし）</td>
                    <td>共有DB/Store</td>
                    <td>全結合（Direct）</td>
                    <td>リサーチ統合・高相互依存</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 6: Step 4 */}
        <section id="step4" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step4: 早期合格(Early Victory)問題への対策</h2>
          <p>
            検証サブエージェント(Verifier)を導入する際、最も頻繁に発生するバグが「早期合格(Early Victory)問題」です。検証エージェントが十分にテストを実行せず、生成エージェントの出力を「問題なし」と安易に承認してしまう現象です。
          </p>

          <p>対策として、以下の3つのテクニックを組み込む必要があります。</p>
          <ul className={styles.checklist}>
            <li className={styles.checklistItem}>
              <i className={styles.tiTiCircleCheck ?? ""} />
              <span><strong>ブラックボックス検証を徹底する:</strong> 検証エージェントには生成プロンプトや中間思考を見せず、純粋な出力成果物とテスト仕様のみを与える。</span>
            </li>
            <li className={styles.checklistItem}>
              <i className={styles.tiTiCircleCheck ?? ""} />
              <span><strong>ネガティブテストを含める:</strong> あえて失敗すべきテストケースや不正入力を与え、検証エージェントが正しく失敗を検出できるかを試す。</span>
            </li>
            <li className={styles.checklistItem}>
              <i className={styles.tiTiCircleCheck ?? ""} />
              <span><strong>明示的な判定基準を与える:</strong> 「全ユニットテストを実行しパスしたログを確認するまでPASSを出してはならない」という行動規約をプロンプトで要求する。</span>
            </li>
          </ul>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_8} />
            <div className={styles.mermaidCaption}>図8: 検証サブエージェントと早期合格問題への対策フロー</div>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>参照URL</div>
            <p>
              <Ext href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them">
                Building multi-agent systems: When and how to use them — Claude by Anthropic
              </Ext>
            </p>
          </div>
        </section>

        {/* Section 7: Step 5 */}
        <section id="step5" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step5: エージェント間通信プロトコルを設計する(MCPとA2A)</h2>
          <p>
            エージェントを協調させるには、「ツールへのアクセス」と「エージェント同士の連携」という2つの異なるレイヤーの通信を標準化する必要があります。この2つを混同するのが2026年時点で最もよくある設計ミスの一つです。
          </p>
          <ul>
            <li>
              <strong>MCP(Model Context Protocol):</strong> Anthropicが2024年11月に公開したオープン標準で、エージェントがツール・データソース・外部サービスにアクセスする方法を統一します。垂直方向(エージェント→外部世界)の接続を担います。
            </li>
            <li>
              <strong>A2A(Agent2Agent Protocol):</strong> Googleが2025年4月に発表し、その後Linux Foundationに寄贈されたオープン標準で、異なるベンダー・異なるモデル基盤で構築されたエージェント同士が発見・通信・協調するための水平方向の接続を担います。各エージェントは自身の能力とエンドポイントを記述した「Agent Card」を公開し、他のエージェントがそれを参照して委任先を判断します。
            </li>
          </ul>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_9} />
            <div className={styles.mermaidCaption}>図9: MCPとA2Aの役割分担</div>
          </div>

          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>MCP</th>
                  <th>A2A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>接続方向</td>
                  <td>垂直(エージェント→ツール/データ)</td>
                  <td>水平(エージェント→エージェント)</td>
                </tr>
                <tr>
                  <td>主な提唱者</td>
                  <td>Anthropic(2024年11月公開)</td>
                  <td>Google(2025年4月公開、Linux Foundationへ寄贈)</td>
                </tr>
                <tr>
                  <td>中心概念</td>
                  <td>ツール定義・リソース・コンテキスト提供</td>
                  <td>Agent Card・タスク委任・クライアント-リモートエージェントモデル</td>
                </tr>
                <tr>
                  <td>想定シーン</td>
                  <td>DB接続、SaaS操作、ファイルアクセスなど</td>
                  <td>異なるベンダー・フレームワーク間のエージェント連携</td>
                </tr>
                <tr>
                  <td>2026年の状態</td>
                  <td>本番運用の標準として定着</td>
                  <td>v1.0系で本番運用グレードに到達、150以上の組織が支持</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            実務では<strong>両方を併用する</strong>のが一般的です。エージェント内部のツール呼び出しはMCPで、組織や基盤モデルをまたぐエージェント間の委任はA2Aで処理するハイブリッド構成が2026年の主流です。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>参照URL</div>
            <p>
              <Ext href="https://beam.ai/agentic-insights/agent2agent-vs-mcp-2026-ai-agent-stack">
                Agent2Agent vs MCP: 2 Protocols Your 2026 Stack Needs — Beam.ai
              </Ext>
            </p>
            <p>
              <Ext href="https://zuplo.com/blog/agent-protocol-stack-mcp-a2a-acp-2026">
                MCP, A2A, and Where ACP Went — Zuplo
              </Ext>
            </p>
            <p>
              <Ext href="https://onereach.ai/blog/guide-choosing-mcp-vs-a2a-protocols/">
                MCP vs A2A: Protocols for Multi-Agent Collaboration 2026 — OneReach.ai
              </Ext>
            </p>
          </div>
        </section>

        {/* Section 8: Step 6 */}
        <section id="step6" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step6: フレームワークを選定する</h2>
          <p>
            フレームワークは「エージェントがどう推論し、どうハンドオフし、どうエラーから回復し、どう負荷に耐えるか」を決めますが、「誰が何にアクセスできるか」「どうガバナンスするか」「本番でいくらかかるか」までは決めてくれません。それらはフレームワークの上位にあるインフラ/ガバナンス層の責務です。この前提を踏まえた上で、2026年時点で代表的なフレームワークを比較します。
          </p>

          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>フレームワーク</th>
                  <th>提供元</th>
                  <th>得意な協調パターン</th>
                  <th>特徴</th>
                  <th>向いている用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Claude Agent SDK</td>
                  <td>Anthropic</td>
                  <td>Orchestrator-Subagent</td>
                  <td>エージェントループ・並列ツール実行・フックを標準提供。Temporalと組み合わせて耐久実行を構築するのが定番構成</td>
                  <td>コーディングエージェント、本番グレードの独自オーケストレーション</td>
                </tr>
                <tr>
                  <td>LangGraph</td>
                  <td>LangChain</td>
                  <td>全パターン(グラフベースで柔軟)</td>
                  <td>ノードとエッジでワークフローを明示的にグラフ化。状態遷移の可視化に強い</td>
                  <td>複雑な分岐・条件付きワークフロー</td>
                </tr>
                <tr>
                  <td>CrewAI</td>
                  <td>CrewAI</td>
                  <td>Orchestrator-Subagent/Sequential</td>
                  <td>Role・Goal・Backstoryというロールベースの抽象化で素早く着手できる。単純作業ではトークン消費が重くなりやすい</td>
                  <td>業務ワークフロー自動化、コンテンツパイプライン</td>
                </tr>
                <tr>
                  <td>OpenAI Agents SDK</td>
                  <td>OpenAI</td>
                  <td>Orchestrator-Subagent</td>
                  <td>実験的だったSwarmの後継となる本番運用パス</td>
                  <td>OpenAIモデル中心のエージェント構築</td>
                </tr>
                <tr>
                  <td>Google ADK</td>
                  <td>Google</td>
                  <td>Sequential/Parallel/Loop/Custom</td>
                  <td>組み込みのワークフローエージェントを提供し、コードファーストで制御できる</td>
                  <td>Google Cloud中心の本番運用、決定的な制御が必要なワークフロー</td>
                </tr>
                <tr>
                  <td>AutoGen</td>
                  <td>Microsoft</td>
                  <td>Message Bus寄り(イベント駆動)</td>
                  <td>イベント駆動でスケーラブルな設計を志向</td>
                  <td>研究寄り・イベント駆動型の実験的構成</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Google ADKは、決定的オーケストレーション(コードで明示的に流れを定義する)と動的委任(モデル自身がどのエージェントに処理させるか判断する)の2方式を提供している点が特徴です。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_10} />
            <div className={styles.mermaidCaption}>図10: Google ADKにおけるSequential + Loop構成の例</div>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>参照URL</div>
            <p>
              <Ext href="https://www.truefoundry.com/blog/multi-agent-orchestration-frameworks">
                Best Multi-agent Orchestration Frameworks in 2026 — TrueFoundry
              </Ext>
            </p>
          </div>
        </section>

        {/* Section 9: Step 7 */}
        <section id="step7" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step7: 状態管理とコンテキストエンジニアリング</h2>
          <p>
            Anthropicのリサーチシステムでは、リードエージェントが調査計画を記憶(Memory)システムに保存し続けることで、会話がモデルのコンテキストウィンドウの上限(20万トークン超)を超えても計画や発見を失わないようにしています。マルチエージェント設計では次の点を押さえておきましょう。
          </p>
          <ul>
            <li><strong>サブエージェントは要約だけを返す:</strong> フルの調査結果ではなく、要点を凝縮した情報だけをオーケストレーターに返却し、メインのコンテキストを汚染しないようにする</li>
            <li><strong>計画をメモリに永続化する:</strong> 長時間稼働するタスクでは、コンテキストが切り詰められても計画を再構築できるよう、外部メモリに定期的に書き出す</li>
            <li><strong>ツール数が15〜20を超えたら再検討する:</strong> モデルがツール選択に多くの注意を割かれるようになったら、動的にツールを発見できる仕組みの導入や、マルチエージェント化を検討するタイミング</li>
            <li><strong>コンテキスト圧縮(Compaction)を活用する:</strong> 近年のコンテキスト管理技術の進歩により、単一エージェントでも長時間の会話履歴を維持しやすくなっており、マルチエージェント化の閾値は今後も変化していく</li>
          </ul>
        </section>

        {/* Section 10: Step 8 */}
        <section id="step8" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step8: エラーハンドリングと耐障害性</h2>
          <p>
            マルチエージェントシステムは非決定的に振る舞うため、ループに陥ったり、存在しない情報源を探し続けたり、不要なステータス更新でお互いを中断させ合ったりする失敗モードが起こり得ます。本番運用のために以下の仕組みを導入します。
          </p>
          <ul>
            <li><strong>チェックポインティング:</strong> 実行途中の状態を定期的に保存し、失敗時に最初からやり直すのではなく直前のチェックポイントから再開できるようにする</li>
            <li><strong>リトライロジック:</strong> 一時的な失敗(APIタイムアウトなど)には自動再試行を設定するが、最大試行回数を設けて無限ループを防ぐ</li>
            <li><strong>レインボーデプロイメント:</strong> 新旧バージョンを並行稼働させ、進行中のセッションを壊さずに安全に切り替える</li>
          </ul>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_11} />
            <div className={styles.mermaidCaption}>図11: チェックポイント/リトライによる耐障害性フロー</div>
          </div>
        </section>

        {/* Section 11: Step 9 */}
        <section id="step9" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step9: セキュリティとガードレール</h2>
          <p>
            複数エージェントが連携するシステムは、単一エージェントのガードレールでは対処しきれないリスクを抱えます。OWASPが2026年に公開した「Top 10 for Agentic Applications(ASI)」では、エージェント特有のリスクが体系化されています。
          </p>

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <div className={styles.calloutTitle}>プロンプトインジェクションの連鎖</div>
            <p>
              あるエージェントの出力が次のエージェントの入力になる構成では、1箇所で成功したインジェクションが後続のすべての層に伝播します。
            </p>
          </div>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_12} />
            <div className={styles.mermaidCaption}>図12: マルチエージェント間の信頼境界とガードレール配置</div>
          </div>
        </section>

        {/* Section 12: Step 10 */}
        <section id="step10" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step10: 可観測性(Observability)と評価(Evaluation)</h2>
          <p>
            マルチエージェントシステムは非決定的であるため、従来型アプリケーションのログ監視だけでは不十分です。「最終出力は間違っていたが、どのエージェントが原因か分からない」状態を避けるための可観測性設計が不可欠です。
          </p>
          <ol>
            <li><strong>分散トレーシング:</strong> エージェント間の呼び出しをまたいでスパン(span)を親子関係のまま記録する</li>
            <li><strong>評価フレームワーク(LLM-as-a-Judge):</strong> 高速・低コストなモデルを使い、正確性・関連性をスコアリングする</li>
            <li><strong>リアルタイムログ:</strong> 即座のデバッグを可能にする</li>
          </ol>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_13} />
            <div className={styles.mermaidCaption}>図13: マルチエージェントのトレーシングと評価パイプライン</div>
          </div>

          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>ツール</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Arize Phoenix(OSS)</td>
                  <td>忠実性・関連性・ハルシネーション検出などの評価指標を50種類以上内蔵</td>
                </tr>
                <tr>
                  <td>Braintrust</td>
                  <td>本番トレースをそのまま評価用データセット化するTrace-to-Evalワークフローが特徴</td>
                </tr>
                <tr>
                  <td>MLflow</td>
                  <td>マルチターン評価やプロンプト自動最適化を含む評価領域をカバー</td>
                </tr>
                <tr>
                  <td>W&amp;B Weave</td>
                  <td>既存のWeights &amp; Biasesワークフローに統合しやすい</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 13: Step 11 */}
        <section id="step11" className={styles.section}>
          <h2 className={styles.sectionTitle}>Step11: コストとレイテンシのマネジメント</h2>
          <p>
            マルチエージェント化は品質・網羅性を高める一方で、必ずコストとレイテンシのトレードオフを伴います。
          </p>

          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>指標</th>
                  <th>目安</th>
                  <th>出典の要旨</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>同等タスクでのトークン消費倍率</td>
                  <td>シングルエージェント比で約3〜10倍</td>
                  <td>エージェントごとに個別のコンテキストを持ち、調整メッセージのやり取りでコストが発生するため</td>
                </tr>
                <tr>
                  <td>深いリサーチ用途でのトークン消費倍率</td>
                  <td>通常のチャット比で約15倍</td>
                  <td>網羅性を優先する設計のトレードオフとして意図的に許容されている</td>
                </tr>
                <tr>
                  <td>リード+並列サブエージェント構成の性能改善</td>
                  <td>単体エージェント比で約90.2%向上</td>
                  <td>Claude Opus 4をリード、Claude Sonnet 4をサブエージェントとした構成での評価</td>
                </tr>
                <tr>
                  <td>単純なタスクでシングルエージェントが優位だった割合</td>
                  <td>約64%</td>
                  <td>Princeton NLPのベンチマークで、同じツール・コンテキストを与えた場合の比較</td>
                </tr>
                <tr>
                  <td>5ツール呼び出し規模のマルチエージェントワークフロー</td>
                  <td>単一API呼び出し比で約5倍のトークン消費</td>
                  <td>ワークフローの複雑さに比例してコストが増える傾向</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 14: Antipatterns */}
        <section id="antipatterns" className={styles.section}>
          <h2 className={styles.sectionTitle}>よくあるアンチパターン</h2>
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>何が起きるか</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>見栄えの良さでパターンを選ぶ</td>
                  <td>実際の問題に合わないパターンを採用し、不要な調整コストが発生する</td>
                  <td>最もシンプルなパターンから始め、限界にぶつかってから次のパターンへ進化させる</td>
                </tr>
                <tr>
                  <td>Problem-centricな分解</td>
                  <td>ハンドオフのたびにコンテキストが劣化する「伝言ゲーム」が起きる</td>
                  <td>Context-centricな分解に切り替える</td>
                </tr>
                <tr>
                  <td>検証基準を明文化しない</td>
                  <td>検証エージェントが「お墨付き」を出すだけになる(早期合格問題)</td>
                  <td>具体的・網羅的・ネガティブテストを含む明示的な基準を与える</td>
                </tr>
                <tr>
                  <td>反応ループの終了条件を設計しない(特にShared State)</td>
                  <td>収束せずにトークンを消費し続ける</td>
                  <td>時間予算・収束閾値・専任の終了判断エージェントを最初から設計する</td>
                </tr>
                <tr>
                  <td>ツールを1体のエージェントに詰め込みすぎる</td>
                  <td>ツール選択の精度が落ち、ドメイン混同が起きる</td>
                  <td>15〜20個を超えたら専門特化やツール動的検索を検討する</td>
                </tr>
                <tr>
                  <td>エージェント間を無条件に信頼する</td>
                  <td>プロンプトインジェクションが連鎖的に伝播し、権限昇格につながる</td>
                  <td>最小権限の原則、入出力フィルタリング、高リスク操作の人間承認を徹底する</td>
                </tr>
                <tr>
                  <td>可観測性を後回しにする</td>
                  <td>本番障害が起きた際にどのエージェント・どのツール呼び出しが原因か分からない</td>
                  <td>初期段階から分散トレーシングと評価フレームワークを組み込む</td>
                </tr>
                <tr>
                  <td>コスト試算をせずにマルチエージェント化する</td>
                  <td>3〜15倍のトークンコスト増加に後から気づく</td>
                  <td>導入前にコストとレイテンシのトレードオフを見積もる</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 15: Big Picture */}
        <section id="big-picture" className={styles.section}>
          <h2 className={styles.sectionTitle}>全体ワークフローまとめ</h2>
          <p>
            以下は、本ガイドで解説したステップを俯瞰したフローです。実際にはStep3〜11を並行して検討しながら反復的に設計を洗練させていくことになります。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAGRAM_14} />
            <div className={styles.mermaidCaption}>図14: ベストプラクティス全体ワークフロー</div>
          </div>
        </section>

        {/* Section 16: Summary */}
        <section id="summary" className={styles.section}>
          <h2 className={styles.sectionTitle}>まとめ</h2>
          <p>
            マルチエージェントオーケストレーションは強力ですが、あらゆる場面に適した万能解ではありません。設計に着手する前に、次の3点を必ず確認してください。
          </p>
          <ol>
            <li><strong>本当に正当化される制約があるか</strong>(コンテキスト限界・並列化の機会・専門特化の必要性)</li>
            <li><strong>分解は作業種別ではなくコンテキスト境界に基づいているか</strong></li>
            <li><strong>サブエージェントが完全なコンテキストなしで検証できる明確なポイントがあるか</strong></li>
          </ol>
          <p>
            最もシンプルなアプローチから始め、根拠が積み上がってから複雑さを追加していくことが、2026年時点での最も確実なベストプラクティスです。
          </p>
        </section>

        {/* Section 17: References */}
        <section id="references" className={styles.section}>
          <h2 className={styles.sectionTitle}>参考文献一覧</h2>
          <ol>
            <li>
              <Ext href="https://www.truefoundry.com/blog/multi-agent-orchestration-tools">
                Which are the Best Multi-Agent Orchestration Tools in 2026? — TrueFoundry
              </Ext>
            </li>
            <li>
              <Ext href="https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production">
                6 Multi-Agent Orchestration Patterns for Production (2026) — Beam.ai
              </Ext>
            </li>
            <li>
              <Ext href="https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work">
                Multi-Agent Orchestration: 5 Patterns That Work in 2026 — Digital Applied
              </Ext>
            </li>
            <li>
              <Ext href="https://www.truefoundry.com/blog/multi-agent-orchestration-frameworks">
                Best Multi-agent Orchestration Frameworks in 2026 — TrueFoundry
              </Ext>
            </li>
            <li>
              <Ext href="https://www.augmentcode.com/tools/multi-agent-orchestration-platforms-build-vs-buy">
                7 Multi-Agent Orchestration Platforms: Build vs Buy in 2026 — Augment Code
              </Ext>
            </li>
          </ol>
        </section>

        <footer className={styles.pageFooter}>
          <p>© 2026 AI Model Cost Calculator. Multi-Agent Orchestration Architecture Guide.</p>
        </footer>
      </main>
    </div>
  );
}
