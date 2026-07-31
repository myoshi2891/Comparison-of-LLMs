import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "マルチエージェント・オーケストレーション実践ガイド",
  description:
    "Anthropicのリサーチシステム、5つの基本パターン、MAST失敗モード分類、MCP/A2Aプロトコル等を網羅したマルチエージェント・オーケストレーション実践ガイド。",
};

const PIE_THEME_VARS = {
  pie1: "#57c7ff",
  pie2: "#a996ff",
  pie3: "#ff9d66",
  pieTitleTextColor: "#ffffff",
  pieSectionTextColor: "#07111e",
  pieLegendTextColor: "#dfe8fa",
  pieStrokeColor: "#07111e",
  pieStrokeWidth: "2px",
  pieOuterLineColor: "#dfe8fa",
};

function Ext({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const MMD_1 = `flowchart TD
                  Y1["<b>2023</b><br/>AutoGen論文発表<br/>(会話型マルチエージェントの提案)"]
                  Y2["<b>2024</b><br/>MCP(Model Context Protocol)発表"]
                  Y3["<b>2025年4月</b><br/>Anthropicマルチエージェント・リサーチシステム公開<br/>/ OpenAI Agents SDK / Google A2Aプロトコル発表"]
                  Y4["<b>2025年6月</b><br/>A2AがLinux Foundationに寄贈"]
                  Y5["<b>2025年10月</b><br/>Microsoft Agent Framework<br/>(AutoGen+Semantic Kernel統合)プレビュー"]
                  Y6["<b>2026年前半</b><br/>A2A v1.0 / Microsoft Agent Framework 1.0 GA<br/>/ LangGraph・CrewAIの本番機能拡充"]
                  Y7["<b>2026年中盤</b><br/>「5〜6パターンへの収斂」が業界コンセンサスに"]

                  Y1 --> Y2 --> Y3 --> Y4 --> Y5 --> Y6 --> Y7

                  classDef node fill:#123049,stroke:#57c7ff,stroke-width:1.5px,color:#e8eef5,text-align:left;
                  class Y1,Y2,Y3,Y4,Y5,Y6,Y7 node;`;
const MMD_2_1 = `flowchart LR
                  A1[LLM呼び出し1] --> A2[ゲート/検証] --> A3[LLM呼び出し2] --> A4[出力]`;
const MMD_2_2 = `flowchart LR
                  B1[入力] --> B2{分類LLM}
                  B2 -->|簡単| B3[軽量モデル]
                  B2 -->|複雑| B4[高性能モデル]`;
const MMD_2_3 = `flowchart LR
                  C1[タスク] --> C2[分割]
                  C2 --> C3a[並列LLM A]
                  C2 --> C3b[並列LLM B]
                  C2 --> C3c[並列LLM C]
                  C3a --> C4[集約]
                  C3b --> C4
                  C3c --> C4`;
const MMD_2_4 = `flowchart LR
                  D1[オーケストレーター] --> D2[タスク分解]
                  D2 --> D3a[ワーカー1]
                  D2 --> D3b[ワーカー2]
                  D3a --> D4[統合]
                  D3b --> D4`;
const MMD_2_5 = `flowchart LR
                  E1[生成モデル] --> E2[評価モデル]
                  E2 -->|要修正| E1
                  E2 -->|合格| E3[最終出力]`;
const MMD_3 = `flowchart TD
                  U[ユーザー] --> O[オーケストレーター<br/>/ リードエージェント]
                  O --> W1[ワーカー1<br/>専門タスクA]
                  O --> W2[ワーカー2<br/>専門タスクB]
                  O --> W3[ワーカー3<br/>専門タスクC]
                  W1 -.結果のみ返す.-> O
                  W2 -.結果のみ返す.-> O
                  W3 -.結果のみ返す.-> O
                  O --> R[統合・合成]
                  R --> U`;
const MMD_4 = `sequenceDiagram
                  participant User as ユーザー
                  participant Sup as スーパーバイザー
                  participant Bill as 請求エージェント
                  participant Tech as 技術サポートエージェント

                  User->>Sup: 複合的な問い合わせ
                  Sup->>Sup: 意図を分類
                  Sup->>Tech: SSO不具合を委任
                  Tech-->>Sup: 対応結果を返却
                  Sup->>Bill: 料金プラン変更を委任
                  Bill-->>Sup: 対応結果を返却
                  Sup->>User: 統合した回答`;
const MMD_5 = `flowchart LR
                  A((エージェントA)) <--> B((エージェントB))
                  B <--> C((エージェントC))
                  A <--> C
                  C <--> D((エージェントD))
                  A <--> D
                  B <--> D`;
const MMD_6 = `flowchart TD
                  Top[トップレベル<br/>スーパーバイザー] --> RS[リサーチ<br/>チームスーパーバイザー]
                  Top --> MS[数理計算<br/>チームスーパーバイザー]
                  RS --> RA1[リサーチエージェント1]
                  RS --> RA2[リサーチエージェント2]
                  MS --> MA1[数理エージェント1]`;
const MMD_7 = `flowchart TD
                  Q[問い] --> P1[視点A エージェント]
                  Q --> P2[視点B エージェント]
                  Q --> P3[視点C エージェント]
                  P1 --> J{審判/合意形成<br/>エージェント}
                  P2 --> J
                  P3 --> J
                  J --> F[最終結論]`;
const MMD_8 = `flowchart TD
                  U[ユーザーのクエリ] --> LR[Lead Researcher<br/>リード・エージェント]
                  LR -->|戦略を記憶に保存| MEM[(メモリ<br/>200Kトークン超の<br/>コンテキスト対策)]
                  LR --> S1[サブエージェント1<br/>独自コンテキスト]
                  LR --> S2[サブエージェント2<br/>独自コンテキスト]
                  LR --> S3[サブエージェント3<br/>独自コンテキスト]
                  S1 --> T1[検索ツール群を<br/>反復使用]
                  S2 --> T2[検索ツール群を<br/>反復使用]
                  S3 --> T3[検索ツール群を<br/>反復使用]
                  T1 --> D1[凝縮された知見を返却]
                  T2 --> D2[凝縮された知見を返却]
                  T3 --> D3[凝縮された知見を返却]
                  D1 --> LR
                  D2 --> LR
                  D3 --> LR
                  LR -->|十分な情報が<br/>集まるまで反復| LR
                  LR --> CA[Citation Agent<br/>引用エージェント]
                  CA --> OUT[最終レポート<br/>+ 引用付き]`;
const MMD_9 = `flowchart LR
                  subgraph Main["メインエージェント(オーケストレーター)"]
                      direction TB
                      M1[高レベルの計画を保持]
                  end
                  subgraph Sub1["サブエージェント1"]
                      direction TB
                      S1[数万トークン規模で<br/>深く探索]
                  end
                  subgraph Sub2["サブエージェント2"]
                      direction TB
                      S2[独立したコンテキスト<br/>ウィンドウで並列作業]
                  end
                  Main -- タスク委任 --> Sub1
                  Main -- タスク委任 --> Sub2
                  Sub1 -- 凝縮された要約<br/>(1,000〜2,000トークン)--> Main
                  Sub2 -- 凝縮された要約<br/>(1,000〜2,000トークン)--> Main`;
const MMD_10 = `flowchart LR
                  subgraph Before["〜2025年"]
                      AG[AutoGen<br/>研究指向<br/>マルチエージェント会話]
                      SK[Semantic Kernel<br/>エンタープライズ指向<br/>本番運用機能]
                  end
                  subgraph After["2026年〜"]
                      AF[Microsoft Agent Framework<br/>統合後継製品]
                  end
                  AG --> AF
                  SK --> AF`;
const MMD_11 = `flowchart TB
                  subgraph L1["レイヤー1: エージェント間通信(A2A)"]
                      AgA[エージェントA<br/>組織1] <-->|Agent Card経由で<br/>能力を発見・タスク委任| AgB[エージェントB<br/>組織2]
                  end
                  subgraph L2["レイヤー2: エージェント-ツール通信(MCP)"]
                      AgA --> MCP1[MCPサーバー<br/>DB / API / ファイル]
                      AgB --> MCP2[MCPサーバー<br/>DB / API / ファイル]
                  end`;
const MMD_12 = `pie showData
                  "仕様・システム設計の問題" : 41.8
                  "エージェント間の不整合" : 36.9
                  "タスク検証の失敗" : 21.3`;
const MMD_13 = `flowchart TD
                  ATT[悪意ある入力<br/>プロンプトインジェクション] --> A1[エージェント1<br/>Web検索担当]
                  A1 -->|汚染された結果を<br/>そのまま転送| A2[エージェント2<br/>コード実行担当]
                  A2 -->|権限昇格された<br/>コマンドを実行| SYS[システムリソース]

                  style ATT fill:#5a1a1a,color:#fff
                  style SYS fill:#5a1a1a,color:#fff`;
const MMD_14 = `flowchart LR
                  subgraph Trad["従来型アプリのログ"]
                      L1[単一の実行パス] --> L2[決定的な入出力]
                  end
                  subgraph MAS["マルチエージェントの<br/>トレース"]
                      T1[分岐する意思決定] --> T2[並列実行される<br/>複数エージェント]
                      T2 --> T3[ツール呼び出しの連鎖]
                      T3 --> T4[非決定的な最終出力]
                  end`;
const MMD_15 = `flowchart TD
                  Q[1回のユーザークエリ] --> LR[リードエージェント<br/>トークン消費: 1x]
                  LR --> S1[サブエージェント1<br/>独自コンテキストで<br/>トークン消費: 数x]
                  LR --> S2[サブエージェント2<br/>独自コンテキストで<br/>トークン消費: 数x]
                  LR --> S3[サブエージェント3<br/>独自コンテキストで<br/>トークン消費: 数x]
                  S1 --> Sum[合計: 単一エージェント比<br/>約15倍のトークン消費]
                  S2 --> Sum
                  S3 --> Sum`;
const MMD_16 = `flowchart TD
                  Start[タスクを検討] --> Q1{サブタスクは<br/>真に独立しているか?<br/>互いに依存しないか}
                  Q1 -->|依存関係が強い| Single1[単一エージェント<br/>または直列パイプラインで十分]
                  Q1 -->|独立している| Q2{単一エージェント+<br/>優れたプロンプト設計で<br/>同等の精度に届くか?}
                  Q2 -->|届く| Single2[単一エージェントの<br/>プロンプト改善を優先]
                  Q2 -->|届かない・<br/>規模的に不可能| Q3{コスト増<br/>約2〜15倍を<br/>正当化できるか?}
                  Q3 -->|正当化できない| Single3[単一エージェントで妥協<br/>または範囲を絞る]
                  Q3 -->|正当化できる| Q4{高stakesで<br/>多角的検証が<br/>必要か?}
                  Q4 -->|はい| Debate[ディベート型 /<br/>Evaluator-Optimizerループ]
                  Q4 -->|いいえ| Q5{エージェント数の<br/>見込みは?}
                  Q5 -->|少数・専門領域が<br/>明確に分離| Swarm[スウォーム型<br/>ハンドオフ]
                  Q5 -->|多数 or 動的な<br/>タスク分解が必要| Q6{組織階層のような<br/>多段階構造が必要か?}
                  Q6 -->|はい| Hier[階層型<br/>マルチレベル・スーパーバイザー]
                  Q6 -->|いいえ| OW[オーケストレーター・ワーカー型<br/>またはスーパーバイザー型]`;
const MMD_17 = `flowchart TB
                  subgraph R1
                      direction LR
                      S1["① 単一エージェントの<br/>ベースライン構築"] --> S2["② タスク分解<br/>可能性の検証"] --> S3["③ サブエージェント<br/>契約の設計"] --> S4["④ オーケストレーター<br/>の実装"]
                  end
                  subgraph R2
                      direction LR
                      S5["⑤ コンテキスト<br/>分離の実装"] --> S6["⑥ 評価・可観測性<br/>の組み込み"] --> S7["⑦ ガードレールと<br/>コスト上限の設定"] --> S8["⑧ 段階的<br/>ロールアウト"]
                  end
                  S4 --> S5
                  R1 ~~~ R2`;

export default function MultiAgentOrchestrationPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.pageContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className={styles.brandKicker}>Best Practices Guide · 2026.07</span>
            <span className={styles.brandTitle}>マルチエージェント・<br />オーケストレーション実践ガイド</span>
            <span className={styles.brandSub}>中級〜上級エンジニア向け</span>
          </div>

          <div className={styles.navGroupLabel}>はじめに</div>
          <nav className={styles.tocNav}>
            <ul>
              <li><a href="#sec-1" className={styles.tocLink}><span className={styles.num}>01</span>なぜ今マルチエージェントか</a></li>
              <li><a href="#sec-2" className={styles.tocLink}><span className={styles.num}>02</span>5つのワークフローパターン</a></li>
            </ul>
          </nav>

          <div className={styles.navGroupLabel}>アーキテクチャ</div>
          <nav className={styles.tocNav}>
            <ul>
              <li><a href="#sec-3" className={styles.tocLink}><span className={styles.num}>03</span>全カタログ</a></li>
              <li><a href="#sec-4" className={styles.tocLink}><span className={styles.num}>04</span>Anthropicリサーチシステム</a></li>
              <li><a href="#sec-5" className={styles.tocLink}><span className={styles.num}>05</span>コンテキスト・エンジニアリング</a></li>
              <li><a href="#sec-6" className={styles.tocLink}><span className={styles.num}>06</span>主要フレームワーク比較</a></li>
              <li><a href="#sec-7" className={styles.tocLink}><span className={styles.num}>07</span>プロトコル: MCPとA2A</a></li>
            </ul>
          </nav>

          <div className={styles.navGroupLabel}>設計と実装</div>
          <nav className={styles.tocNav}>
            <ul>
              <li><a href="#sec-8" className={styles.tocLink}><span className={styles.num}>08</span>失敗モード分類(MAST)</a></li>
              <li><a href="#sec-9" className={styles.tocLink}><span className={styles.num}>09</span>セキュリティとガードレール</a></li>
              <li><a href="#sec-10" className={styles.tocLink}><span className={styles.num}>10</span>可観測性と評価</a></li>
              <li><a href="#sec-11" className={styles.tocLink}><span className={styles.num}>11</span>コスト最適化とトークン管理</a></li>
            </ul>
          </nav>

          <div className={styles.navGroupLabel}>ガバナンス</div>
          <nav className={styles.tocNav}>
            <ul>
              <li><a href="#sec-12" className={styles.tocLink}><span className={styles.num}>12</span>意思決定フレームワーク</a></li>
              <li><a href="#sec-13" className={styles.tocLink}><span className={styles.num}>13</span>ステップバイステップ実装</a></li>
              <li><a href="#sec-14" className={styles.tocLink}><span className={styles.num}>14</span>チェックリストとまとめ</a></li>
              <li><a href="#sec-15" className={styles.tocLink}><span className={styles.num}>15</span>参考文献一覧</a></li>
            </ul>
          </nav>
        </aside>

        <div className={styles.content}>

        <div className={styles.contentInner}>
          <div className={styles.hero}>
            <span className={styles.kicker}>Multi-Agent Orchestration · Best Practices</span>
            <h1>マルチエージェント・オーケストレーション実践ガイド</h1>
            <p className={styles.lead}>
              本ガイドは2026年7月時点でWeb上に公開されている一次情報(Anthropic公式ブログ・各フレームワーク公式ドキュメント・査読前論文を含む学術論文・業界分析記事)を調査し、要点を整理したものです。各セクション末尾に参照元URLを明記しています。マルチエージェントの世界は変化が速いため、実装時は必ずリンク先の一次情報で最新仕様を確認してください。
            </p>
          </div>

          <section className={styles.docSection} id="sec-1">
            <div className={styles.sectionEyebrow}>Section 01</div>
            <h2 className={styles.sectionTitle}>なぜ今マルチエージェントか ― 期待と現実</h2>

            <p>
              2026年、マルチエージェント・オーケストレーションは「実験的な流行り物」から「本番アーキテクチャの選択肢の一つ」へと位置づけが変わりました。Gartnerの予測では、2026年末までに企業アプリケーションの40%がタスク特化型のAIエージェントを組み込むとされており、これは2025年時点の5%未満から急激な伸びです。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_1} caption="図1: マルチエージェント・オーケストレーションの成熟度推移" /><div className={styles.diagramCaption}>図1: マルチエージェント・オーケストレーションの成熟度推移</div></div>
            

            <h3>1.1 しかし「多いほど良い」わけではない</h3>
            <p>マルチエージェント導入を検討する前に必ず押さえておくべき事実があります。</p>
            <ul>
              <li>
                <strong>Princeton NLPの検証</strong
                >では、同じツール・同じコンテキストを与えた場合、単一エージェントが64%のベンチマークタスクでマルチエージェントシステムと同等かそれ以上の性能を示しました。マルチエージェント化によって得られる精度向上は平均2.1ポイント程度である一方、コストはおよそ2倍に跳ね上がります。
              </li>
              <li>
                Anthropic自身も「単一エージェントの方が優れているタスクに対し、チームが数か月かけて精巧なマルチエージェント・アーキテクチャを構築した結果、単一エージェントのプロンプト改善で同等の性能に到達してしまうケースを何度も見てきた」と明言しています。
              </li>
              <li>
                学術的にも、MAST(Multi-Agent System Failure
                Taxonomy、後述)の著者らは「人気ベンチマークにおけるMASの性能向上は、単一エージェント方式と比較して依然として最小限にとどまっている」と述べています。
              </li>
            </ul>

            <div className={styles.callout}>
              <strong>結論:</strong>
              マルチエージェントは「デフォルトの選択肢」ではなく、「単一エージェント+優れたプロンプト・ツール設計では解決できない、明確な理由がある場合にのみ採用するアーキテクチャ」として扱うべきです。この前提を念頭に置いた上で、以降のベストプラクティスを読み進めてください。
            </div>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work"
                    target="_blank"
                    >Multi-Agent Orchestration: 5 Patterns That Work in 2026 — Digital Applied</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.truefoundry.com/blog/multi-agent-orchestration-tools"
                    target="_blank"
                    >Which are the Best Multi-Agent Orchestration Tools in 2026? — TrueFoundry</a
                  >
                </li>
                <li>
                  <a
                    href="https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production"
                    target="_blank"
                    >6 Multi-Agent Orchestration Patterns for Production (2026) — Beam AI</a
                  >
                </li>
                <li>
                  <a
                    href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them"
                    target="_blank"
                    >When to use multi-agent systems (and when not to) — Claude by Anthropic</a
                  >
                </li>
                <li>
                  <a href="https://arxiv.org/abs/2503.13657" target="_blank"
                    >Why Do Multi-Agent LLM Systems Fail? — arXiv:2503.13657</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-2">
            <div className={styles.sectionEyebrow}>Section 02</div>
            <h2 className={styles.sectionTitle}>基礎: Anthropicの5つのワークフローパターン</h2>

            <p>
              マルチエージェント設計に入る前に、土台となる「エージェント的ワークフロー」の基本パターンを押さえる必要があります。Anthropicのエンジニアリングブログ
              <em>Building Effective Agents</em>
              は、最もシンプルで組み合わせ可能な5つのパターンを定義しており、これは2026年時点でも業界の共通言語として広く引用され続けています。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>パターン名</th>
                    <th>概要</th>
                    <th>適したユースケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><strong>Prompt Chaining(逐次連鎖)</strong></td>
                    <td>あるLLM呼び出しの出力を、次のLLM呼び出しの入力として順番に渡す</td>
                    <td>明確に分解できる多段階の変換処理(文書生成→翻訳など)</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><strong>Routing(振り分け)</strong></td>
                    <td>最初のLLM呼び出しが入力を分類し、適切なハンドラー/モデルに振り分ける</td>
                    <td>
                      簡単なタスクはHaiku、難しいタスクはSonnet/Opusに振り分けるなど、性質の異なるタスク群
                    </td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td><strong>Parallelization(並列化)</strong></td>
                    <td>
                      タスクを分割して並列実行する。Sectioning(独立したサブタスクに分割)とVoting(同じタスクを複数回実行し多数決/合議)の2種類がある
                    </td>
                    <td>独立したサブタスク処理、コード脆弱性レビューの多重チェックなど</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td><strong>Orchestrator-Workers</strong></td>
                    <td>
                      中心となるLLMが動的にタスクを分解し、ワーカーLLMに委任し、結果を統合する
                    </td>
                    <td>
                      事前にサブタスクを予測できない複雑なタスク(複数ソースを横断する検索など)
                    </td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td><strong>Evaluator-Optimizer(評価・最適化ループ)</strong></td>
                    <td>1つのモデルが生成し、別のモデルがループで評価・フィードバックする</td>
                    <td>
                      明確な評価基準があり、反復的な改善に価値があるタスク(コード生成→レビュー→修正)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_2_1} caption="図2-①: Prompt Chaining(逐次連鎖)" /><div className={styles.diagramCaption}>図2-①: Prompt Chaining(逐次連鎖)</div></div>
            

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_2_2} caption="図2-②: Routing(振り分け)" /><div className={styles.diagramCaption}>図2-②: Routing(振り分け)</div></div>
            

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_2_3} caption="図2-③: Parallelization(並列化)" /><div className={styles.diagramCaption}>図2-③: Parallelization(並列化)</div></div>
            

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_2_4} caption="図2-④: Orchestrator-Workers" /><div className={styles.diagramCaption}>図2-④: Orchestrator-Workers</div></div>
            

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_2_5} caption="図2-⑤: Evaluator-Optimizer(評価・最適化ループ)" /><div className={styles.diagramCaption}>図2-⑤: Evaluator-Optimizer(評価・最適化ループ)</div></div>
            

            <h3>2.1 マルチエージェントとの関係</h3>
            <p>
              重要なのは、④Orchestrator-Workersと③Parallelizationの2つが、この後説明する「マルチエージェント・アーキテクチャ」の理論的な起源になっているという点です。単一エージェントのワークフローパターンの延長線上に、自律性の高いマルチエージェントシステムが存在すると理解すると設計判断がしやすくなります。
            </p>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/building-effective-agents"
                    target="_blank"
                    >Building effective agents — Anthropic Engineering</a
                  >
                </li>
                <li>
                  <a
                    href="https://simonwillison.net/2024/Dec/20/building-effective-agents/"
                    target="_blank"
                    >Building effective agents(要約と論評)— Simon Willison</a
                  >
                </li>
                <li>
                  <a
                    href="https://pub.towardsai.net/agent-workflow-patterns-beyond-anthropics-playbook-1bd76a48d63d"
                    target="_blank"
                    >Agent Workflow Patterns — Beyond Anthropic's Playbook — Towards AI</a
                  >
                </li>
                <li>
                  <a href="https://arxiv.org/pdf/2606.24937" target="_blank"
                    >The Hitchhiker's Guide to Agentic AI: From Foundations to Systems —
                    arXiv:2606.24937</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.baeldung.com/spring-ai-building-effective-agents"
                    target="_blank"
                    >Building Effective Agents with Spring AI — Baeldung</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-3">
            <div className={styles.sectionEyebrow}>Section 03</div>
            <h2 className={styles.sectionTitle}>マルチエージェント・アーキテクチャ全カタログ</h2>

            <p>
              単一エージェントのワークフローパターンを踏まえた上で、複数の自律的エージェントが協調する際の代表的なトポロジー(構造パターン)を整理します。2026年時点の業界分析では「5〜6パターンへの収斂」がコンセンサスになりつつあります。
            </p>

            <h3>3.1 オーケストレーター・ワーカー型(Orchestrator-Worker / Hub-and-Spoke)</h3>
            <p>
              中心となる「リード(オーケストレーター)エージェント」がタスクを分解し、専門化された「サブエージェント(ワーカー)」に委任し、結果を統合するパターンです。ワーカー同士は直接会話しません。Anthropicのマルチエージェント・リサーチシステムがこの代表例であり、詳細は次章で深掘りします。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_3} caption="図3: オーケストレーター・ワーカー型" /><div className={styles.diagramCaption}>図3: オーケストレーター・ワーカー型</div></div>
            

            <p>
              <strong>特徴</strong>:
              制御フローが単純で追跡しやすく、失敗の切り分けが容易。単一障害点(オーケストレーターのダウン)がリスクとなる。
            </p>

            <h3>3.2 スーパーバイザー型(Supervisor)</h3>
            <p>
              LangGraphのドキュメントで定義される、オーケストレーター・ワーカー型の実装形態の一つ。中央のスーパーバイザーが実行時の状態を見ながら、動的にどのワーカーエージェントを呼び出すか判断し続ける点が特徴です。オーケストレーター・ワーカー型が「一度分解したら並列実行」であるのに対し、スーパーバイザー型は「一手ごとに次のエージェントを再選択する」会話的なループを想定しています。2026年時点でネイティブなフレームワーク対応が最も広い(Claude
              Agent SDK、LangGraph、OpenAI Agents
              SDK、CrewAIの階層Processなど)ことから、実務上の出発点として推奨されています。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_4} caption="図4: スーパーバイザー型の対話フロー例" /><div className={styles.diagramCaption}>図4: スーパーバイザー型の対話フロー例</div></div>
            

            <h3>3.3 スウォーム型(Swarm / Peer-to-Peer)</h3>
            <p>
              中央のコーディネーターを置かず、エージェント同士が直接「ハンドオフ(制御の受け渡し)」を行う分散型パターンです。LangGraphの<code>langgraph-swarm</code>やOpenAI
              Agents
              SDKの<code>handoffs</code>機能がこれに該当します。レイテンシは低い(仲介者を挟まないため)反面、経路の追跡が難しく、完全連結型のスウォームでは、エージェント数の増加に伴い障害点の組み合わせが<strong>組合せ的に爆発</strong>します(4エージェントで6通り、10エージェントで45通りの相互作用パス)。8エージェントを超えると、この失敗表面積はEnd-to-Endテストでカバーしきれなくなるとされ、階層型オーケストレーションへの切り替えが信頼性上の要件になります。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_5} caption="図5: スウォーム型(完全連結)" /><div className={styles.diagramCaption}>図5: スウォーム型(完全連結)</div></div>
            

            <h3>3.4 階層型マルチレベル・スーパーバイザー(Hierarchical Multi-Level Supervisor)</h3>
            <p>
              スーパーバイザーがさらに別のスーパーバイザーを管理する「スーパーバイザーのスーパーバイザー」構造です。LangGraphでは<code>create_supervisor</code>にサブチームを渡すことで多段階の階層システムを構築できます。大規模な組織構造を模した設計に適しており、責任の連鎖(chain
              of
              responsibility)が明確になる一方、末端のワーカーからトップレベルの意思決定までのレイテンシが積み重なります。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_6} caption="図6: 階層型マルチレベル・スーパーバイザー" /><div className={styles.diagramCaption}>図6: 階層型マルチレベル・スーパーバイザー</div></div>
            

            <h3>3.5 パイプライン型(Pipeline)</h3>
            <p>
              各エージェントの出力が次のエージェントの入力に順次流れ込む、最もシンプルな直列パターン。Prompt
              Chainingのマルチエージェント版と考えると理解しやすく、各段階で明確な受け渡し契約(スキーマ)を定義できるタスクに向いています。
            </p>

            <h3>3.6 ディベート型(Debate / Multi-Perspective)</h3>
            <p>
              複数のエージェントが同じ問題に対して独立した見解を出し、互いの見解を批評しあった上で合意形成する、あるいは審判(judge)役のエージェントが最終判断を下すパターンです。Evaluator-Optimizerのマルチエージェント拡張とも言えます。コストはおよそ2.5倍に跳ね上がりますが、多角的検証が必要な高stakesの意思決定(医療・法務・金融のリスク評価など)では投資対効果が見合います。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_7} caption="図7: ディベート型" /><div className={styles.diagramCaption}>図7: ディベート型</div></div>
            

            <h3>3.7 パターン比較表</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>パターン</th>
                    <th>制御フロー</th>
                    <th>コスト目安</th>
                    <th>主な失敗モード</th>
                    <th>代表的な採用場面</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>オーケストレーター・ワーカー</td>
                    <td>中央集権・一括委任</td>
                    <td>中〜高(並列度に比例)</td>
                    <td>オーケストレーターの過剰委任(単純タスクへの過剰分解)</td>
                    <td>独立した並列調査、幅優先(breadth-first)探索</td>
                  </tr>
                  <tr>
                    <td>スーパーバイザー</td>
                    <td>中央集権・逐次再選択</td>
                    <td>中(ルーティング呼び出し分の追加コスト)</td>
                    <td>ルーティング精度低下(8〜12往復以降で顕著)</td>
                    <td>カスタマーサポートの意図別振り分け</td>
                  </tr>
                  <tr>
                    <td>スウォーム</td>
                    <td>分散・ピアツーピア</td>
                    <td>低〜中(仲介者コストなし)</td>
                    <td>ハンドオフ連鎖の暴走、経路追跡困難</td>
                    <td>エージェント数が少なく、専門領域の重複が少ないケース</td>
                  </tr>
                  <tr>
                    <td>階層型マルチレベル</td>
                    <td>多段階中央集権</td>
                    <td>高</td>
                    <td>階層間のレイテンシ蓄積</td>
                    <td>大規模組織を模した業務プロセス</td>
                  </tr>
                  <tr>
                    <td>パイプライン</td>
                    <td>直列</td>
                    <td>低</td>
                    <td>上流の誤りが下流にそのまま伝播(検証なし)</td>
                    <td>明確な段階分割が可能な変換処理</td>
                  </tr>
                  <tr>
                    <td>ディベート</td>
                    <td>並列+合意形成</td>
                    <td>非常に高(約2.5倍)</td>
                    <td>少数意見の圧殺(同調圧力によるcollapse)</td>
                    <td>高stakesな多角的検証</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work"
                    target="_blank"
                    >Multi-Agent Orchestration: 5 Patterns That Work in 2026 — Digital Applied</a
                  >
                </li>
                <li>
                  <a
                    href="https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production"
                    target="_blank"
                    >6 Multi-Agent Orchestration Patterns for Production (2026) — Beam AI</a
                  >
                </li>
                <li>
                  <a href="https://www.augmentcode.com/guides/swarm-vs-supervisor" target="_blank"
                    >Swarm vs. Supervisor: Multi-Agent Architecture Guide — Augment Code</a
                  >
                </li>
                <li>
                  <a
                    href="https://lilys.ai/en/notes/langgraph-swarm-20260202/langgraph-hierarchical-supervisor-swarm-ai-agents"
                    target="_blank"
                    >LangGraph Advanced – Hierarchical Multi-Level Supervisor & Swarm Agents</a
                  >
                </li>
                <li>
                  <a
                    href="https://dev.to/focused_dot_io/multi-agent-orchestration-in-langgraph-supervisor-vs-swarm-tradeoffs-and-architecture-1b7e"
                    target="_blank"
                    >Multi-Agent Orchestration in LangGraph: Supervisor vs Swarm — DEV Community</a
                  >
                </li>
                <li>
                  <a href="https://pypi.org/project/langgraph-supervisor/" target="_blank"
                    >langgraph-supervisor · PyPI</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-4">
            <div className={styles.sectionEyebrow}>Section 04</div>
            <h2 className={styles.sectionTitle}>
              ディープダイブ: Anthropicのマルチエージェント・リサーチシステム
            </h2>

            <p>
              Anthropicが公開した技術ブログ
              <em>How we built our multi-agent research system</em>
              は、オーケストレーター・ワーカーパターンの本番実装として、業界で最も詳細に語られている事例の一つです。Claude
              Researchの内部構造を教材として、実務に転用できる原則を抽出します。
            </p>

            <h3>4.1 全体アーキテクチャ</h3>
            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_8} caption="図8: Anthropicマルチエージェント・リサーチシステムの全体構造" /><div className={styles.diagramCaption}>図8: Anthropicマルチエージェント・リサーチシステムの全体構造</div></div>
            

            <p>構成要素は3種類です。</p>
            <ul>
              <li>
                <strong>Lead Researcher(リードエージェント)</strong>:
                ユーザーのクエリを分析し、全体戦略を立て、その計画を記憶(メモリ)に保存します。大規模な調査タスクはモデルのコンテキストウィンドウを容易に超過するため、計画を外部化しておくことで、コンテキストが切り詰められても調査の軌道を見失わないようにしています。
              </li>
              <li>
                <strong>サブエージェント</strong>:
                リードエージェントによって生成される専門タスク担当。それぞれが独立したコンテキストウィンドウ・ツールセット・探索軌跡を持ち、並列に検索・評価・クエリの洗練を行います。「知的なフィルター」として機能し、大量の情報から重要なトークンだけを凝縮してリードエージェントに返します。
              </li>
              <li>
                <strong>Citation Agent(引用エージェント)</strong>:
                集まった文書と調査レポートを処理し、すべての主張が出典に正しく紐づくよう引用箇所を特定する専用エージェント。
              </li>
            </ul>

            <h3>4.2 なぜ機能するのか: トークン経済性という視点</h3>
            <p>
              Anthropicの分析では、BrowseCompの内部評価においてトークン使用量だけで性能分散の<strong>80%</strong>を説明できるという結果が出ています(ツール呼び出し数とモデル選択が残りを説明)。つまり、マルチエージェント化の本質的な価値は「複数の独立したコンテキストウィンドウに計算資源(トークン)を分散させ、単一エージェントでは実現できない規模の推論を可能にすること」にあります。
            </p>

            <p>
              一方でこの並列化にはコストが伴います。マルチエージェントシステムは通常のチャット対話のおよそ<strong>15倍のトークン</strong>を消費します。Opus
              4をリードエージェント、Sonnet
              4をサブエージェントとした構成では、単一エージェントのOpus
              4と比較して調査タスクの内部評価で<strong>90.2%の性能向上</strong>を達成した一方、この15倍のコストは「アウトプットの価値がコストを上回る、高付加価値なタスク」でのみ正当化されると明言されています。
            </p>

            <h3>4.3 適用すべきでないドメイン</h3>
            <div className={styles.callout + " " + styles.warn}>
              Anthropicのブログは非常に率直にこう述べています:「すべてのエージェントが同じコンテキストを共有する必要がある、あるいはエージェント間に多くの依存関係があるドメインは、現状のマルチエージェントシステムには適していない」
            </div>
            <p>
              コーディング、デバッグ、そしてほとんどのエージェント的ワークフローはこの条件に当てはまり、マルチエージェント化に不向きとされています。サブエージェントBがサブエージェントAの調査結果に依存する場合、並列化は「オーバーヘッド付きの高コストな直列実行」に退化してしまうためです。並列サブエージェントが機能するのは、サブタスクが<strong>真に独立</strong>している場合に限られます。
            </p>

            <h3>4.4 効果的な委任のためのプロンプト設計原則</h3>
            <p>
              Anthropicが試行錯誤の末にたどり着いた、マルチエージェント・プロンプトエンジニアリングの主要原則を整理します。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>原則</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>エージェントの思考をシミュレートする</strong></td>
                    <td>
                      同じプロンプト・ツールを使った簡易シミュレーションを構築し、エージェントの挙動をステップごとに観察する。これにより「早すぎる打ち切り」「冗長すぎる検索クエリ」「誤ったツール選択」などの失敗モードが即座に可視化される
                    </td>
                  </tr>
                  <tr>
                    <td><strong>オーケストレーターに委任方法を教える</strong></td>
                    <td>
                      各サブエージェントには「明確な目的」「出力フォーマット」「使うべきツール・情報源のガイダンス」「タスクの境界線(何をやらないか)」の4点を明示する。これを欠くとサブエージェント同士が重複調査を行ってしまう(実例:
                      2021年の自動車用半導体不足を調査するサブエージェントと、2025年時点のサプライチェーンを調査する2つのサブエージェントが同じ話題を重複調査してしまった)
                    </td>
                  </tr>
                  <tr>
                    <td><strong>努力量をタスクの複雑さにスケーリングさせる</strong></td>
                    <td>
                      単純な事実確認は1エージェント・3〜10回のツール呼び出し、直接比較は2〜4サブエージェント・10〜15回のツール呼び出し、複雑な調査には10以上のサブエージェントで明確に役割分担、という具体的なルールをプロンプトに埋め込む。これがないと初期システムでは「単純な質問に50個のサブエージェントを生成する」という過剰投資が発生した
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong
                        >拡張思考(Extended Thinking)を制御可能なスクラッチパッドとして使う</strong
                      >
                    </td>
                    <td>
                      リードエージェントはツール選択やサブエージェント数を決める前に推論を書き出し、サブエージェントはツール出力受領後に「Interleaved
                      Thinking」でギャップを特定し次のクエリを洗練する
                    </td>
                  </tr>
                  <tr>
                    <td><strong>並列化を前提としたプロンプト設計に切り替える</strong></td>
                    <td>
                      初期システムは検索を逐次実行していたため低速だった。リードエージェントが複数のサブエージェントを同時生成し、各サブエージェントも複数ツールを並列使用するよう再設計した結果、複雑なクエリの調査時間を最大90%短縮した
                    </td>
                  </tr>
                  <tr>
                    <td><strong>人間による評価は自動化では拾えないものを拾う</strong></td>
                    <td>
                      人間のテスターは、SEO最適化されたコンテンツファームを、学術PDFや個人ブログのような権威ある情報源より優先して選んでしまうという、初期システムのソース選定バイアスを発見した。これに基づき情報源の品質判断のヒューリスティックをプロンプトに追加した
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>4.5 評価アプローチ</h3>
            <p>
              マルチエージェントワークフローには単一の「正解パス」が存在しないため、従来型のテストがそのまま通用しません。Anthropicは以下を組み合わせています。
            </p>
            <ul>
              <li>
                <strong>LLM-as-judge評価</strong>:
                事実の正確性・引用・情報源の品質に関するルーブリックで自動評価
              </li>
              <li>
                <strong>少数サンプルでの早期反復</strong>:
                大規模評価の前に小規模サンプルで素早く反復
              </li>
              <li>
                <strong>人間評価者によるチェック</strong>:
                幻覚(hallucination)、システム障害、微妙なソース選定バイアスなど、自動評価が見逃す問題を検出
              </li>
            </ul>

            <h3>4.6 本番運用上の工学的課題</h3>
            <p>
              プロトタイプから本番システムへの移行では、プロンプト改善だけでなく以下のようなシステムエンジニアリング上の投資が必要でした。
            </p>
            <ul>
              <li>ツール呼び出し失敗をまたいだ<strong>エージェント状態の永続化</strong></li>
              <li>動的な挙動をデバッグするための<strong>完全なトレーサビリティ</strong></li>
              <li>
                中断のない<strong>レインボーデプロイ</strong>(段階的ロールアウトによる安全なアップデート)
              </li>
              <li>
                現状は<strong>同期的実行</strong>がボトルネックであり、より高い並列性を実現する非同期アーキテクチャは開発中の課題として残っている
              </li>
            </ul>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/multi-agent-research-system"
                    target="_blank"
                    >How we built our multi-agent research system — Anthropic
                    Engineering(一次情報)</a
                  >
                </li>
                <li>
                  <a
                    href="https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent"
                    target="_blank"
                    >How Anthropic Built a Multi-Agent Research System — ByteByteGo</a
                  >
                </li>
                <li>
                  <a
                    href="https://theaiengineer.substack.com/p/how-anthropic-built-multi-agent-deep"
                    target="_blank"
                    >Anthropic's Multi-Agent Research Architecture Explained — The AI Engineer</a
                  >
                </li>
                <li>
                  <a
                    href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them"
                    target="_blank"
                    >When to use multi-agent systems (and when not to) — Claude by Anthropic</a
                  >
                </li>
                <li>
                  <a
                    href="https://fountaincity.tech/resources/blog/anthropic-multi-agent-blueprint-production/"
                    target="_blank"
                    >Anthropic's Multi-Agent Blueprint: What Production Adds — Fountain City</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.zenml.io/llmops-database/building-a-multi-agent-research-system-for-complex-information-tasks"
                    target="_blank"
                    >Anthropic: Building a Multi-Agent Research System — ZenML LLMOps Database</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-5">
            <div className={styles.sectionEyebrow}>Section 05</div>
            <h2 className={styles.sectionTitle}>コンテキスト・エンジニアリングと状態管理</h2>

            <p>
              マルチエージェントシステムの実装品質を分けるのは、突き詰めれば「各エージェントに何を、いつ見せるか」という<strong>コンテキスト・エンジニアリング</strong>の設計です。Anthropicのエンジニアリングブログ
              <em>Effective context engineering for AI agents</em> と、Claude Agent
              SDKのドキュメントに基づき、実装レベルの原則を整理します。
            </p>

            <h3>5.1 サブエージェントによるコンテキスト分離</h3>
            <p>
              サブエージェント・アーキテクチャは、コンテキストウィンドウの制約を回避するもう一つの手段です。1つのエージェントがプロジェクト全体の状態を維持し続けようとするのではなく、専門化されたサブエージェントがクリーンなコンテキストウィンドウで焦点を絞ったタスクを処理します。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_9} caption="図9: サブエージェントによるコンテキスト分離" /><div className={styles.diagramCaption}>図9: サブエージェントによるコンテキスト分離</div></div>
            

            <p>Claude Agent SDKでは、サブエージェントはデフォルトで以下の性質を持ちます。</p>
            <ul>
              <li><strong>並列化</strong>: 複数のサブエージェントを異なるタスクに同時展開できる</li>
              <li>
                <strong>コンテキスト管理</strong>:
                各サブエージェントは独立したコンテキストウィンドウを使い、オーケストレーターには「関連情報のみ」を返す。オーケストレーターが全文脈を見る必要はない
              </li>
            </ul>
            <p>
              これにより、大量の情報をふるいにかける必要があるが、そのほとんどが最終的には不要になるようなタスク(ログ解析、大規模な文書横断検索など)に理想的な構造となります。
            </p>

            <h3>5.2 「ジャストインタイム」コンテキスト戦略</h3>
            <p>
              事前にすべての関連データを前処理してコンテキストに詰め込むのではなく、軽量な識別子(ファイルパス・保存済みクエリ・Webリンクなど)だけを維持し、実行時にツールを使って必要な部分だけを動的にロードするアプローチです。Claude
              Codeはこの方式で、<code>grep</code>や<code>tail</code>のようなBashコマンドを使い、巨大なデータベースやログファイルの全体をコンテキストに載せることなく、ターゲットを絞ったクエリで分析を行います。
            </p>
            <p>
              エージェント的検索(agentic
              search)は、埋め込みベクトルによるセマンティック検索よりも透明性が高くメンテナンスしやすいため、まずはエージェント的検索から始め、より高速な結果や表現のバリエーションが必要になった場合にのみセマンティック検索を追加することが推奨されています。
            </p>

            <h3>5.3 4部構成のサブエージェント契約</h3>
            <p>
              Anthropicの実装知見から抽出される、サブエージェントへの委任プロンプトが必ず含むべき4要素です。このうちどれか一つでも欠けると、モデルの振る舞いが悪いからではなく、「完了とは何か」をオーケストレーターが十分に指定できていないために、サブエージェントの挙動がドリフト(逸脱)します。
            </p>
            <ol>
              <li><strong>明確な目的(Objective)</strong></li>
              <li><strong>出力フォーマット</strong></li>
              <li><strong>使うべきツール・情報源のガイダンス</strong></li>
              <li>
                <strong>タスクの境界線</strong
                >(何をやらないか、他のサブエージェントの担当範囲との切り分け)
              </li>
            </ol>

            <h3>5.4 アーティファクト・パターン(ファイルシステム経由の受け渡し)</h3>
            <p>
              サブエージェントが発見内容をチャット形式の長い文章でリードエージェントに返すのではなく、共有ファイルシステムに結果を書き込み、軽量な参照(ポインタ)だけを返す設計です。リードエージェントは詳細をすべて再読み込みするのではなく、必要なときにポインタから取得します。これにより、リードエージェントのトークン消費を大幅に削減できます。
            </p>

            <h3>5.5 メモリツールとコンパクション(圧縮)</h3>
            <ul>
              <li>
                <strong>メモリツール</strong>: Claude Developer
                Platformで提供されるファイルベースのメモリ機構により、エージェントはコンテキストウィンドウの外側に知識ベースを構築し、セッションをまたいでプロジェクトの状態を維持し、過去の作業をコンテキストに残さずに参照できます。
              </li>
              <li>
                <strong>コンパクション(compact機能)</strong>:
                長時間稼働するエージェントではコンテキストの維持管理が重要になります。Claude Agent
                SDKの<code>compact</code>機能は会話履歴を自動的に要約します。あるベンダーの実務分析では、名目上200,000トークンのウィンドウに対し、実効的な作業コンテキストは60,000〜80,000トークン程度に留めることが推奨されています。SDKは<code>PreCompact</code>フックを公開しており、圧縮イベントを検知して独自のロジックを挟むことも可能です。
              </li>
            </ul>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                    target="_blank"
                    >Effective context engineering for AI agents — Anthropic
                    Engineering(一次情報)</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk"
                    target="_blank"
                    >Building agents with the Claude Agent SDK — Anthropic Engineering(一次情報)</a
                  >
                </li>
                <li>
                  <a href="https://platform.claude.com/docs/en/agent-sdk/subagents" target="_blank"
                    >Subagents in the SDK — Claude API Docs(一次情報)</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.augmentcode.com/guides/anthropic-agent-sdk-what-ships-vs-what-you-build"
                    target="_blank"
                    >Anthropic Agent SDK: What It Ships vs. What It Leaves to You — Augment Code</a
                  >
                </li>
                <li>
                  <a href="https://arxiv.org/pdf/2508.08322" target="_blank"
                    >Context Engineering for Multi-Agent LLM Code Assistants — arXiv:2508.08322</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-6">
            <div className={styles.sectionEyebrow}>Section 06</div>
            <h2 className={styles.sectionTitle}>主要フレームワーク比較(2026年中期時点)</h2>

            <p>
              2025年後半〜2026年前半にかけて、マルチエージェント・フレームワークの勢力図は大きく動きました。特にMicrosoftがAutoGenとSemantic
              Kernelを単一の「Agent
              Framework」に統合したことは、本ガイド執筆時点(2026年7月)における最大の構造変化です。
            </p>

            <h3>6.1 フレームワーク一覧</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>フレームワーク</th>
                    <th>提供元</th>
                    <th>オーケストレーションモデル</th>
                    <th>相互運用性</th>
                    <th>得意領域</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Claude Agent SDK</strong></td>
                    <td>Anthropic</td>
                    <td>サブエージェント委任・コンテキスト分離が組み込み</td>
                    <td>MCP標準対応</td>
                    <td>Claudeネイティブの本番エージェント構築、コーディング系エージェント</td>
                  </tr>
                  <tr>
                    <td><strong>LangGraph</strong></td>
                    <td>LangChain</td>
                    <td>
                      グラフベース(ノード/エッジ)。Supervisor・Swarmライブラリを別パッケージで提供
                    </td>
                    <td>MCP・カスタムツール対応</td>
                    <td>複雑な状態遷移・分岐を明示的に制御したい場合</td>
                  </tr>
                  <tr>
                    <td><strong>CrewAI</strong></td>
                    <td>CrewAI Inc.</td>
                    <td>
                      「Crew(役割ベースの協調)」と「Flow(手続き的制御)」の2モデルを併用。階層的Process対応
                    </td>
                    <td>MCP対応</td>
                    <td>役割分担が明確なチーム型タスク、迅速なプロトタイピング</td>
                  </tr>
                  <tr>
                    <td><strong>OpenAI Agents SDK</strong></td>
                    <td>OpenAI</td>
                    <td>
                      Agents(ツールとして子エージェントを保持)とHandoffs(制御を完全委譲)の2方式
                    </td>
                    <td>MCP対応</td>
                    <td>OpenAIモデル中心のプロダクション実装</td>
                  </tr>
                  <tr>
                    <td><strong>Microsoft Agent Framework</strong></td>
                    <td>Microsoft</td>
                    <td>
                      AutoGenの実験的マルチエージェント研究機能とSemantic
                      Kernelのエンタープライズ機能(状態管理・テレメトリ・セキュリティ)を統合
                    </td>
                    <td>MCP・A2A双方に標準対応</td>
                    <td>.NETやAzureエコシステムでのエンタープライズ展開</td>
                  </tr>
                  <tr>
                    <td><strong>Google Agent Development Kit (ADK)</strong></td>
                    <td>Google</td>
                    <td>モデル非依存のコード・ファーストなオーケストレーション</td>
                    <td>MCP・A2A双方に標準対応</td>
                    <td>Google CloudおよびGeminiエコシステム、A2A採用初期の代表実装</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>6.2 Microsoft Agent Frameworkの統合(2025年10月プレビュー→2026年前半 GA)</h3>
            <p>
              MicrosoftはAutoGen(研究指向のマルチエージェント会話フレームワーク)とSemantic
              Kernel(エンタープライズ指向のSDK)を、単一の後継製品であるMicrosoft Agent
              Frameworkへ統合しました。これはAutoGenの実験的なマルチエージェントオーケストレーション機能と、Semantic
              Kernelの本番運用機能(スレッドベースの状態管理、テレメトリ、セキュリティフィルター)を一つ屋根の下に集約する取り組みです。.NETおよびPython向けに2026年前半に正式GA(Generally
              Available)がアナウンスされ、Microsoftは既存のAutoGen/Semantic
              Kernelプロジェクトからの移行ガイドを公式に提供しています。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_10} caption="図10: Microsoft Agent Frameworkへの統合" /><div className={styles.diagramCaption}>図10: Microsoft Agent Frameworkへの統合</div></div>
            

            <h3>6.3 選定時の判断軸</h3>
            <ul>
              <li>
                <strong>既にどのモデルベンダーを主軸にしているか</strong>: Claude中心ならClaude
                Agent SDK、Azure/.NETエコシステムならMicrosoft Agent
                Framework、マルチベンダー横断ならLangGraphやMCP/A2A標準準拠のADK
              </li>
              <li>
                <strong>状態遷移の明示制御が必要か</strong>:
                複雑な条件分岐やループを可視化したい場合はLangGraphのグラフベースモデルが有利
              </li>
              <li>
                <strong>役割ベースのチーム比喩が組織の意思決定に合うか</strong>:
                CrewAIの「Crew」比喩はビジネスサイドとのコミュニケーションが取りやすい
              </li>
              <li>
                <strong>相互運用性を最優先するか</strong>:
                他社エージェントとの相互接続を見据えるなら、MCP・A2Aの両対応が標準装備されているフレームワーク(Microsoft
                Agent Framework、Google ADK)が有利
              </li>
            </ul>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.truefoundry.com/blog/multi-agent-orchestration-tools"
                    target="_blank"
                    >Which are the Best Multi-Agent Orchestration Tools in 2026? — TrueFoundry</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.truefoundry.com/blog/multi-agent-orchestration-frameworks"
                    target="_blank"
                    >Top Multi-Agent Orchestration Frameworks for 2026 — TrueFoundry</a
                  >
                </li>
                <li>
                  <a
                    href="https://devblogs.microsoft.com/agent-framework/migrate-your-semantic-kernel-and-autogen-projects-to-microsoft-agent-framework-release-candidate/"
                    target="_blank"
                    >Migrate your Semantic Kernel and AutoGen projects to Microsoft Agent Framework
                    — Microsoft DevBlogs(一次情報)</a
                  >
                </li>
                <li>
                  <a
                    href="https://visualstudiomagazine.com/articles/2026/04/06/microsoft-ships-production-ready-agent-framework-1-0-for-net-and-python.aspx"
                    target="_blank"
                    >Microsoft Ships Production-Ready Agent Framework 1.0 for .NET and Python —
                    Visual Studio Magazine</a
                  >
                </li>
                <li>
                  <a
                    href="https://learn.microsoft.com/en-us/agent-framework/overview/"
                    target="_blank"
                    >Agent Framework overview — Microsoft Learn(一次情報)</a
                  >
                </li>
                <li>
                  <a
                    href="https://openai.github.io/openai-agents-python/multi_agent/"
                    target="_blank"
                    >Multi-agent orchestration — OpenAI Agents SDK Docs(一次情報)</a
                  >
                </li>
                <li>
                  <a href="https://openai.github.io/openai-agents-python/handoffs/" target="_blank"
                    >Handoffs — OpenAI Agents SDK Docs(一次情報)</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-7">
            <div className={styles.sectionEyebrow}>Section 07</div>
            <h2 className={styles.sectionTitle}>相互運用性プロトコル: MCPとA2A</h2>

            <p>
              マルチエージェントシステムが複数の組織・ベンダーをまたぐようになるにつれ、「エージェントがツールとどう話すか」と「エージェントが別のエージェントとどう話すか」を分離して標準化する動きが加速しました。
            </p>

            <h3>7.1 2つのプロトコルの役割分担</h3>
            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_11} caption="図11: MCPとA2Aのレイヤー分担" /><div className={styles.diagramCaption}>図11: MCPとA2Aのレイヤー分担</div></div>
            

            <ul>
              <li>
                <strong>MCP(Model Context Protocol)</strong>:
                エージェントが外部のツール・データソース・APIに接続するための標準規格。「エージェントとリソースの垂直的な接続」を担う。
              </li>
              <li>
                <strong>A2A(Agent2Agent Protocol)</strong>:
                2025年4月にGoogleが50社以上のパートナーと共に提唱したオープンプロトコルで、異なるベンダー・異なるフレームワークで構築されたエージェント同士が、互いの内部実装を知らなくても発見・通信・協調できるようにする「エージェント間の水平的な接続」を担う。2025年6月にLinux
                Foundationへ寄贈され、ベンダー中立なガバナンス体制に移行しました。
              </li>
            </ul>
            <p>
              両者は競合ではなく補完関係にあり、実務では「A2Aでエージェント同士がタスクを受け渡し、各エージェントの内部ではMCPでツールを呼び出す」という組み合わせが標準的な設計パターンになっています。
            </p>

            <h3>7.2 Agent Cardによる能力発見</h3>
            <p>
              A2Aプロトコルの中核機能の一つが<strong>Agent Card</strong
              >です。各エージェントは<code>/.well-known/agent-card.json</code>のような公開エンドポイントで自身の能力・認証要件・対応タスク種別を宣言し、他のエージェントはこれを読み取ることで「このエージェントに何を頼めるか」を実行時に判断できます。これにより、静的に事前登録された固定のエージェント一覧ではなく、動的なエージェントの発見と連携が可能になります。
            </p>

            <h3>7.3 2026年時点の普及状況</h3>
            <p>
              2026年前半の時点でA2Aの採用組織は150を超え、Microsoft・SAP・Salesforce・ServiceNowなど大手ベンダーが自社のエージェント基盤にA2A対応を組み込んでいます。A2A
              v1.0は2026年初頭に安定版として確定し、エンタープライズ導入における「マルチベンダー・エージェントメッシュ」構築の基盤として位置づけられています。
            </p>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.programming-helper.com/tech/agent-to-agent-protocol-2026-google-a2a-standard"
                    target="_blank"
                    >A2A: The Agent Interoperability Standard That's Reshaping 2026 — Programming
                    Helper</a
                  >
                </li>
                <li>
                  <a
                    href="https://galileo.ai/blog/google-agent2agent-a2a-protocol-guide"
                    target="_blank"
                    >What Is Google's Agent2Agent (A2A) Protocol? — Galileo AI</a
                  >
                </li>
                <li>
                  <a
                    href="https://zylos.ai/research/2026-02-15-agent-to-agent-communication-protocols/"
                    target="_blank"
                    >Agent-to-Agent Communication Protocols in 2026 — Zylos AI Research</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.glukhov.org/ai-systems/comparisons/a2a-protocol-2026-adoption"
                    target="_blank"
                    >A2A Protocol Adoption in 2026 — Glukhov.org</a
                  >
                </li>
                <li>
                  <a href="https://atlan.com/know/google-a2a-protocol/" target="_blank"
                    >What is Google's Agent2Agent Protocol (A2A)? — Atlan</a
                  >
                </li>
                <li>
                  <a href="https://www.ibm.com/think/topics/agent2agent-protocol" target="_blank"
                    >Agent2Agent Protocol — IBM Think</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-8">
            <div className={styles.sectionEyebrow}>Section 08</div>
            <h2 className={styles.sectionTitle}>失敗モード分類(MAST)と対策</h2>

            <p>
              カリフォルニア大学バークレー校を含む研究チームが発表した論文
              <em>Why Do Multi-Agent LLM Systems Fail?</em>
              は、7つの人気マルチエージェントフレームワーク・200件以上のタスクの軌跡(トレース)を分析し、<strong
                >MAST(Multi-Agent System Failure Taxonomy)</strong
              >という14種類の失敗モードを3つの大分類にまとめました。これは2026年時点でマルチエージェントの信頼性を議論する際の共通言語になっています。
            </p>

            <h3>8.1 3大分類と発生率</h3>
            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_12} caption="図12: MASTにおける失敗カテゴリの発生比率(概算)" /><div className={styles.diagramCaption}>図12: MASTにおける失敗カテゴリの発生比率(概算)</div></div>
            

            <h3>8.2 14の具体的な失敗モード</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>カテゴリ</th>
                    <th>ID</th>
                    <th>失敗モード名</th>
                    <th>説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan="5"><strong>① 仕様・システム設計の問題</strong><br />(約41.8%)</td>
                    <td>FM-1.1</td>
                    <td>タスク仕様違反</td>
                    <td>エージェントがタスクの要件・制約に従わない</td>
                  </tr>
                  <tr>
                    <td>FM-1.2</td>
                    <td>役割仕様違反</td>
                    <td>割り当てられた役割・権限の範囲を逸脱する</td>
                  </tr>
                  <tr>
                    <td>FM-1.3</td>
                    <td>ステップの繰り返し</td>
                    <td>同じ手順・行動を無意味に繰り返す</td>
                  </tr>
                  <tr>
                    <td>FM-1.4</td>
                    <td>会話履歴の喪失</td>
                    <td>重要な文脈やこれまでのやり取りを見失う</td>
                  </tr>
                  <tr>
                    <td>FM-1.5</td>
                    <td>終了条件の認識不足</td>
                    <td>いつ処理を終えるべきかの判断基準を認識していない</td>
                  </tr>
                  <tr>
                    <td rowSpan="6"><strong>② エージェント間の不整合</strong><br />(約36.9%)</td>
                    <td>FM-2.1</td>
                    <td>会話のリセット</td>
                    <td>進行中の文脈を不必要に消去・再開してしまう</td>
                  </tr>
                  <tr>
                    <td>FM-2.2</td>
                    <td>確認要求の欠如</td>
                    <td>曖昧な指示に対し、確認を取らずに進めてしまう</td>
                  </tr>
                  <tr>
                    <td>FM-2.3</td>
                    <td>タスクの逸脱</td>
                    <td>本来の目的から話がそれていく</td>
                  </tr>
                  <tr>
                    <td>FM-2.4</td>
                    <td>情報の隠蔽</td>
                    <td>他エージェントに必要な情報を共有しない</td>
                  </tr>
                  <tr>
                    <td>FM-2.5</td>
                    <td>他エージェントの入力の無視</td>
                    <td>他エージェントからのフィードバック・入力を反映しない</td>
                  </tr>
                  <tr>
                    <td>FM-2.6</td>
                    <td>推論と行動の不一致</td>
                    <td>内部の推論結果と実際に取った行動が矛盾する</td>
                  </tr>
                  <tr>
                    <td rowSpan="3"><strong>③ タスク検証の失敗</strong><br />(約21.3%)</td>
                    <td>FM-3.1</td>
                    <td>早すぎる終了</td>
                    <td>タスクが未完了なのに完了したと判断してしまう</td>
                  </tr>
                  <tr>
                    <td>FM-3.2</td>
                    <td>検証の欠如・不完全</td>
                    <td>結果の正しさを十分に検証しないまま次に進む</td>
                  </tr>
                  <tr>
                    <td>FM-3.3</td>
                    <td>誤った検証</td>
                    <td>検証自体が誤っており、間違った結果を「正しい」と判定してしまう</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>8.3 対策の方向性</h3>
            <p>MAST論文および後続の実務分析では、以下のような対策が提案されています。</p>
            <ul>
              <li>
                <strong>FM-1系(仕様問題)への対策</strong>:
                サブエージェント契約(5.3節)を厳密化し、役割・境界・終了条件を明文化する。曖昧な自然言語指示ではなく、構造化された(スキーマ化された)タスク定義を使う。
              </li>
              <li>
                <strong>FM-2系(不整合)への対策</strong>:
                エージェント間のハンドオフ回数を最小限に抑える設計(スウォームの過度な相互接続を避ける)。共有される状態(shared
                state/blackboard)を明示的なデータ構造として持たせ、暗黙の会話履歴だけに依存しない。
              </li>
              <li>
                <strong>FM-3系(検証)への対策</strong>:
                Evaluator-Optimizerパターンを要所に組み込み、専用の検証エージェントまたはルールベースのチェックを最終出力の前に必ず挟む。人間によるレビュー(Human-in-the-loop)を高stakesな意思決定の前段に置く。
              </li>
            </ul>

            <div className={styles.callout + " " + styles.danger}>
              論文の著者らは、既存の介入策(改善されたプロンプト設計・より明確な役割仕様など)がFM-1.1や検証関連の失敗を実質的に減らせることを示す一方で、<strong>MASの性能向上は依然として人気ベンチマークにおいて最小限にとどまっている</strong>とも指摘しており、「マルチエージェント化すれば自動的に賢くなる」という前提そのものへの警鐘となっています。
            </div>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a href="https://arxiv.org/abs/2503.13657" target="_blank"
                    >Why Do Multi-Agent LLM Systems Fail? — arXiv:2503.13657(一次情報/論文)</a
                  >
                </li>
                <li>
                  <a href="https://arxiv.org/pdf/2601.17915" target="_blank"
                    >Multi-Agent System Failure Taxonomy(詳細版PDF)— arXiv:2601.17915</a
                  >
                </li>
                <li>
                  <a href="https://galileo.ai/blog/agent-failure-modes-guide" target="_blank"
                    >Agent Failure Modes: A Practical Guide — Galileo AI</a
                  >
                </li>
                <li>
                  <a
                    href="https://futureagi.substack.com/p/why-do-multi-agent-llm-systems-fail"
                    target="_blank"
                    >Why Do Multi-Agent LLM Systems Fail?(要約と論評)— Future AGI</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-9">
            <div className={styles.sectionEyebrow}>Section 09</div>
            <h2 className={styles.sectionTitle}>セキュリティとガードレール</h2>

            <p>
              マルチエージェントシステムは単一エージェントよりも攻撃対象領域(アタックサーフェス)が広がります。エージェント間のハンドオフやツール呼び出しの連鎖そのものが新たな脆弱性の経路になり得るためです。
            </p>

            <h3>9.1 マルチエージェント特有のリスク</h3>
            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_13} caption="図13: 連鎖的プロンプトインジェクションのリスク経路" /><div className={styles.diagramCaption}>図13: 連鎖的プロンプトインジェクションのリスク経路</div></div>
            

            <ul>
              <li>
                <strong>連鎖的プロンプトインジェクション</strong>:
                あるエージェントが外部ソース(Webページ、ユーザー入力、他社のAPIレスポンスなど)から取り込んだ悪意ある指示が、そのままハンドオフ先のエージェントに伝播し、意図しないツール実行を引き起こすリスク。
              </li>
              <li>
                <strong>権限のなし崩し的拡大</strong>:
                サブエージェントが「親エージェントと同じ権限」をデフォルトで継承する設計だと、本来必要のない権限まで持ってしまう。
              </li>
              <li>
                <strong>監査証跡の断片化</strong>:
                エージェント間のやり取りが複数のログ・複数のプロセスに分散し、インシデント発生時の原因追跡が困難になる。
              </li>
            </ul>

            <h3>9.2 防御原則</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>原則</th>
                    <th>実装例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>最小権限の原則(Least Privilege)</strong></td>
                    <td>
                      各サブエージェントには、そのタスク遂行に必要な最小限のツール・データアクセスのみを付与する。書き込み系ツールと読み取り専用ツールを明確に分離する
                    </td>
                  </tr>
                  <tr>
                    <td><strong>入力のサニタイズとコンテキスト境界の明示</strong></td>
                    <td>
                      外部から取得したコンテンツ(Web検索結果など)を、明示的に「信頼できないデータ」としてタグ付けし、それ自体を実行可能な指示として扱わないようプロンプトで明示する
                    </td>
                  </tr>
                  <tr>
                    <td><strong>ガードレールの多層防御</strong></td>
                    <td>
                      入力ガードレール(悪意あるプロンプトの検出)・出力ガードレール(機密情報の漏洩防止)・行動ガードレール(高リスクな操作の前の承認フロー)を組み合わせる
                    </td>
                  </tr>
                  <tr>
                    <td><strong>人間承認ゲート(Human-in-the-loop)</strong></td>
                    <td>
                      金銭取引・本番環境へのデプロイ・外部への送信など、不可逆な操作の前には必ず人間の承認を挟む
                    </td>
                  </tr>
                  <tr>
                    <td><strong>統一された監査ログ</strong></td>
                    <td>
                      エージェント間のすべてのハンドオフ・ツール呼び出しを、単一のトレースIDに紐づけて記録し、事後追跡を可能にする(次章の可観測性と連動)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>9.3 業界標準への準拠</h3>
            <p>
              OWASP(Open Web Application Security Project)は生成AIアプリケーション向けに「LLM Top
              10」を拡張し、エージェント的アプリケーション特有のリスク(プロンプトインジェクションの連鎖、過剰な自律性、不適切な出力の取り扱いなど)を明文化しています。マルチエージェントシステムの設計時には、これらの標準を参照しながら脅威モデリングを行うことが2026年時点のベストプラクティスとして定着しています。
            </p>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://webyot.in/learning/ai-app-security-2026-prompt-injection-guardrails"
                    target="_blank"
                    >AI App Security 2026: Prompt Injection & Guardrails — Webyot</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.getmaxim.ai/articles/the-complete-ai-guardrails-implementation-guide-for-2026/"
                    target="_blank"
                    >The Complete AI Guardrails Implementation Guide for 2026 — Maxim AI</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.augmentcode.com/guides/multi-agent-ai-security-risks-compliance-fixes"
                    target="_blank"
                    >Multi-Agent AI Security Risks, Compliance & Fixes — Augment Code</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-10">
            <div className={styles.sectionEyebrow}>Section 10</div>
            <h2 className={styles.sectionTitle}>可観測性(オブザーバビリティ)と評価</h2>

            <p>
              マルチエージェントシステムは非決定的(non-deterministic)であり、同じ入力でも実行のたびに異なる経路をたどることがあります。これにより、従来型のソフトウェアテストの発想だけでは不十分になり、専用の可観測性基盤が不可欠になります。
            </p>

            <h3>10.1 なぜ従来型のロギングでは不十分か</h3>
            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_14} caption="図14: 従来型ログとマルチエージェント・トレースの違い" /><div className={styles.diagramCaption}>図14: 従来型ログとマルチエージェント・トレースの違い</div></div>
            

            <p>
              単一のログ行ではなく、「どのエージェントが」「どの時点で」「どのツールを」「どんな理由で」呼び出したかという<strong>因果関係を含んだトレース</strong>を記録する必要があります。
            </p>

            <h3>10.2 主要な可観測性ツール</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツール</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>LangSmith</strong></td>
                    <td>
                      LangChain/LangGraphとのネイティブ統合。トレース・評価・データセット管理を一体化
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Langfuse</strong></td>
                    <td>
                      OSS(オープンソース)のLLM可観測性プラットフォーム。フレームワーク非依存でトレース・プロンプト管理・評価を提供
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Arize Phoenix</strong></td>
                    <td>
                      OpenTelemetryベースのトレーシングとエージェント評価に強み。ドリフト検知など運用監視機能も充実
                    </td>
                  </tr>
                  <tr>
                    <td><strong>OpenTelemetry(OTel)ベースの自作基盤</strong></td>
                    <td>
                      ベンダーロックインを避けたい場合、OTel標準に沿ってスパン(span)を計装し、任意のバックエンド(Grafana,
                      Datadogなど)に送る構成も広がっている
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>10.3 評価(Evaluation)の観点</h3>
            <p>
              マルチエージェントの評価は、最終出力の正しさだけでなく、プロセスの質も対象にする必要があります。
            </p>
            <ul>
              <li><strong>タスク完了率</strong>: エンドツーエンドでタスクが正しく完了したか</li>
              <li>
                <strong>軌跡(トラジェクトリ)評価</strong>:
                正しい答えにたどり着いたとしても、非効率・冗長・危険な経路を通っていないか(MASTのFM系失敗モードの検出に直結)
              </li>
              <li>
                <strong>LLM-as-judge</strong>:
                ルーブリックに基づき、別のLLMが出力品質を採点する。人手評価よりスケールするが、判定バイアスに注意が必要
              </li>
              <li>
                <strong>人間評価によるサンプリング</strong>:
                自動評価では拾えない微妙な問題(ソース選定バイアスなど、4.4節で触れたAnthropicの事例)を定期的にサンプルチェックする
              </li>
            </ul>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.confident-ai.com/knowledge-base/compare/best-ai-agent-observability-tools-2026"
                    target="_blank"
                    >Best AI Agent Observability Tools 2026 — Confident AI</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.firecrawl.dev/blog/best-llm-observability-tools"
                    target="_blank"
                    >Best LLM Observability Tools — Firecrawl</a
                  >
                </li>
                <li>
                  <a
                    href="https://langfuse.com/blog/2024-07-ai-agent-observability-with-langfuse"
                    target="_blank"
                    >AI Agent Observability with Langfuse — Langfuse Blog(一次情報)</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-11">
            <div className={styles.sectionEyebrow}>Section 11</div>
            <h2 className={styles.sectionTitle}>コスト最適化とトークン管理</h2>

            <p>
              4.2節で見た通り、マルチエージェントシステムは通常のチャット対話の<strong>約15倍</strong>のトークンを消費します。この経済性を無視した設計は、本番運用でのコスト超過に直結します。
            </p>

            <h3>11.1 コスト構造の可視化</h3>
            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_15} caption="図15: マルチエージェントのコスト構造" /><div className={styles.diagramCaption}>図15: マルチエージェントのコスト構造</div></div>
            

            <h3>11.2 主要な最適化戦略</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>戦略</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>モデルルーティング(Model Routing)</strong></td>
                    <td>
                      すべてのエージェントに最高性能・最高コストのモデルを使うのではなく、タスクの難易度に応じてモデルを使い分ける。例:
                      リードエージェント(戦略立案・統合)にはOpus/Sonnet級、定型的なサブタスク実行にはHaiku級の軽量モデルを割り当てる
                    </td>
                  </tr>
                  <tr>
                    <td><strong>プロンプトキャッシング</strong></td>
                    <td>
                      システムプロンプト・ツール定義・繰り返し参照される長いコンテキストをキャッシュし、同一プレフィックスの再計算コストを削減する
                    </td>
                  </tr>
                  <tr>
                    <td><strong>並列度の上限設定</strong></td>
                    <td>
                      「複雑なタスクには10以上のサブエージェント」という原則(4.4節)を無制限に適用せず、タスクの価値に対してどこまでの並列度が経済的に見合うかを事前に見積もる
                    </td>
                  </tr>
                  <tr>
                    <td><strong>早期終了条件の明確化</strong></td>
                    <td>
                      4.4節の「終了条件の認識不足」(FM-1.5)はコスト超過にも直結する。十分な情報が集まった時点で追加の探索を打ち切る基準をプロンプトに明示する
                    </td>
                  </tr>
                  <tr>
                    <td><strong>トークン予算の強制(Budget Enforcement)</strong></td>
                    <td>
                      セッションやタスク単位でトークン上限をシステム側で強制し、予算超過時には人間にエスカレーションする仕組みを組み込む
                    </td>
                  </tr>
                  <tr>
                    <td><strong>コンテキストの圧縮・要約(5.5節参照)</strong></td>
                    <td>
                      名目上のコンテキストウィンドウを使い切るのではなく、実効コンテキストを絞り込むことで、単価の高い大規模モデルでもコストを抑える
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>11.3 投資対効果の判断軸</h3>
            <p>
              Anthropicの事例(4.2節)が示すように、マルチエージェント化は「アウトプットの価値がコストを正当化できる高付加価値タスク」でのみ採用すべきです。実務的には以下の問いに答えられるかを事前に検証することが推奨されます。
            </p>
            <ul>
              <li>
                このタスクは本当に<strong>独立した並列探索</strong>を必要とするか(依存関係が強いタスクなら並列化のコストが正当化されない)
              </li>
              <li>
                単一エージェント+優れたプロンプト設計で、同等の精度に近づける余地は本当にないか(1.1節のPrinceton
                NLPの知見)
              </li>
              <li>
                コスト増(約2〜15倍)に見合うビジネス価値(意思決定の重要度、エラーの許容コスト)があるか
              </li>
            </ul>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://zylos.ai/research/2026-02-19-ai-agent-cost-optimization-token-economics/"
                    target="_blank"
                    >AI Agent Cost Optimization & Token Economics — Zylos AI Research</a
                  >
                </li>
                <li>
                  <a
                    href="https://harnessengineering.academy/blog/cost-optimization-production-ai-agents-token-budgets-model-selection-caching/"
                    target="_blank"
                    >Cost Optimization for Production AI Agents: Token Budgets, Model Selection,
                    Caching — Harness Engineering Academy</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.requesty.ai/blog/ai-agent-cost-optimization-how-to-cut-llm-spend-by-80-percent-with-routing"
                    target="_blank"
                    >AI Agent Cost Optimization: How to Cut LLM Spend by 80% with Routing —
                    Requesty</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/multi-agent-research-system"
                    target="_blank"
                    >How we built our multi-agent research system — Anthropic
                    Engineering(トークン経済性の一次情報)</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-12">
            <div className={styles.sectionEyebrow}>Section 12</div>
            <h2 className={styles.sectionTitle}>
              意思決定フレームワーク: いつマルチエージェントを使うべきか
            </h2>

            <p>ここまでの内容を統合し、実務で使える意思決定フローチャートとして整理します。</p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_16} caption="図16: マルチエージェント採用の意思決定フロー" /><div className={styles.diagramCaption}>図16: マルチエージェント採用の意思決定フロー</div></div>
            

            <h3>12.1 判断チェックリスト</h3>
            <ul className={styles.checklist}>
              <li>サブタスクの独立性を検証したか(依存関係グラフを一度書き出す)</li>
              <li>単一エージェントのベースラインを必ず先に構築し、比較対象としたか</li>
              <li>コスト試算(トークン消費倍率 × 想定リクエスト数)を事前に見積もったか</li>
              <li>
                MASTの3大失敗カテゴリ(仕様・不整合・検証)に対する具体的な対策を設計に組み込んだか
              </li>
              <li>
                セキュリティのガードレール(最小権限・人間承認ゲート)を設計段階から組み込んだか
              </li>
              <li>可観測性基盤(トレーシング)を本番導入前に用意したか</li>
            </ul>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them"
                    target="_blank"
                    >When to use multi-agent systems (and when not to) — Claude by Anthropic</a
                  >
                </li>
                <li>
                  <a
                    href="https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production"
                    target="_blank"
                    >6 Multi-Agent Orchestration Patterns for Production (2026) — Beam AI</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-13">
            <div className={styles.sectionEyebrow}>Section 13</div>
            <h2 className={styles.sectionTitle}>ステップバイステップ実装ガイド</h2>

            <p>
              ここでは、オーケストレーター・ワーカー型のマルチエージェントシステムを実装する際の標準的な進め方を、実務の順序に沿って解説します。
            </p>

            <div className={styles.diagramWrap}><MermaidDiagram chart={MMD_17} caption="図17: 実装の8ステップ" /><div className={styles.diagramCaption}>図17: 実装の8ステップ</div></div>
            

            <h3>ステップ① 単一エージェントのベースラインを必ず先に作る</h3>
            <p>
              マルチエージェント化の効果を測定する基準点として、まず単一エージェント+十分に練られたプロンプトでどこまでできるかを検証します。1.1節で見た通り、多くのケースでこれが最終解になります。
            </p>

            <h3>ステップ② タスク分解可能性を検証する</h3>
            <p>
              対象タスクを依存関係グラフとして書き出し、本当に独立した並列サブタスクに分解できるかを確認します。依存が強い場合は4.3節の警告通り、マルチエージェント化は「オーバーヘッド付きの直列実行」に退化するため、パイプライン型や単一エージェントへの回帰を検討します。
            </p>

            <h3>ステップ③ サブエージェント契約を設計する</h3>
            <p>
              5.3節の4部構成(目的・出力フォーマット・ツールガイダンス・タスク境界)に沿って、各サブエージェントへの委任テンプレートを作成します。以下はClaude
              Agent SDKスタイルの疑似コード例です。
            </p>

            <div className={styles.codeBody}>
              <div className={styles.codeLine}><span className={styles.ck}>orchestrator_scaling_rules</span> = <span className={styles.cs}>&quot;&quot;&quot;</span></div>
              <div className={styles.codeLine}><span className={styles.cm}>タスクの複雑さに応じて、生成するサブエージェント数とツール呼び出し回数を決定すること:</span></div>
              <div className={styles.codeLine}><span className={styles.cg}>- 単純な事実確認:</span> <span className={styles.cv}>1エージェント、3〜10回のツール呼び出し</span></div>
              <div className={styles.codeLine}><span className={styles.cg}>- 直接比較(2〜3項目):</span> <span className={styles.cv}>2〜4サブエージェント、各10〜15回のツール呼び出し</span></div>
              <div className={styles.codeLine}><span className={styles.cg}>- 複雑な多面的調査:</span> <span className={styles.cv}>10以上のサブエージェント、明確な役割分担を伴う</span></div>
              <div className={styles.codeLine}><span className={styles.cw}>サブエージェントを生成する前に、まず拡張思考で分解計画を書き出すこと。</span></div>
              <div className={styles.codeLine}><span className={styles.cs}>&quot;&quot;&quot;</span></div>
            </div>
            

            <h3>ステップ⑤ コンテキスト分離を実装する</h3>
            <p>
              各サブエージェントには独立したコンテキストウィンドウを割り当て、5.4節のアーティファクト・パターンに従い、詳細な調査結果はファイルシステム(または外部ストレージ)に書き込み、オーケストレーターには凝縮された要約(1,000〜2,000トークン程度)のみを返す設計にします。
            </p>

            <h3>ステップ⑥ 評価と可観測性を組み込む</h3>
            <p>
              実装と並行して、10章で扱ったトレーシング基盤(Langfuse、LangSmithなど)を導入し、各サブエージェントの意思決定過程を後から追跡できるようにします。LLM-as-judgeによる自動評価と、少数サンプルの人間レビューを組み合わせます。
            </p>

            <h3>ステップ⑦ ガードレールとコスト上限を設定する</h3>
            <p>
              9章の最小権限原則に基づき、サブエージェントごとにツールアクセスをスコープダウンします。同時に11章のトークン予算強制を実装し、想定外のコスト超過を防ぎます。
            </p>

            <h3>ステップ⑧ 段階的ロールアウトを行う</h3>
            <p>
              4.6節でAnthropicが言及した「中断のないレインボーデプロイ」のように、本番トラフィックの一部だけに新しいエージェント構成を適用し、失敗率・コスト・レイテンシを監視しながら段階的に展開範囲を広げます。
            </p>

            <div className={styles.refs}>
              <div className={styles.refsTitle}>参考文献</div>
              <ul>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk"
                    target="_blank"
                    >Building agents with the Claude Agent SDK — Anthropic Engineering(一次情報)</a
                  >
                </li>
                <li>
                  <a
                    href="https://www.anthropic.com/engineering/multi-agent-research-system"
                    target="_blank"
                    >How we built our multi-agent research system — Anthropic
                    Engineering(一次情報)</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.docSection} id="sec-14">
            <div className={styles.sectionEyebrow}>Section 14</div>
            <h2 className={styles.sectionTitle}>チェックリストとまとめ</h2>

            <h3>14.1 本番導入前の最終チェックリスト</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>確認項目</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan="3"><strong>設計判断</strong></td>
                    <td>
                      単一エージェントのベースラインと比較し、マルチエージェント化の効果を定量的に確認したか
                    </td>
                  </tr>
                  <tr>
                    <td>サブタスクの独立性を依存関係グラフとして検証したか</td>
                  </tr>
                  <tr>
                    <td>
                      採用したトポロジー(オーケストレーター・ワーカー/スーパーバイザー/スウォーム/階層型/パイプライン/ディベート)がタスク特性と一致しているか
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan="3"><strong>コンテキスト設計</strong></td>
                    <td>
                      各サブエージェントに4部構成の契約(目的・出力形式・ツールガイダンス・境界)を与えているか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      ジャストインタイムのコンテキストロードとアーティファクト・パターンを活用し、無駄なトークン消費を避けているか
                    </td>
                  </tr>
                  <tr>
                    <td>長時間稼働セッション向けにコンパクション(圧縮)戦略を用意したか</td>
                  </tr>
                  <tr>
                    <td rowSpan="2"><strong>信頼性</strong></td>
                    <td>
                      MASTの3大失敗カテゴリ(仕様・不整合・検証)それぞれに対する具体的な緩和策を実装したか
                    </td>
                  </tr>
                  <tr>
                    <td>検証エージェントまたはルールベースの最終チェックを組み込んでいるか</td>
                  </tr>
                  <tr>
                    <td rowSpan="3"><strong>セキュリティ</strong></td>
                    <td>最小権限の原則でツールアクセスをスコープダウンしたか</td>
                  </tr>
                  <tr>
                    <td>不可逆な操作の前に人間承認ゲートを設けたか</td>
                  </tr>
                  <tr>
                    <td>OWASPのエージェント的アプリケーション向けリスク項目と照合したか</td>
                  </tr>
                  <tr>
                    <td rowSpan="2"><strong>可観測性・評価</strong></td>
                    <td>トレーシング基盤を導入し、因果関係を含むログを記録しているか</td>
                  </tr>
                  <tr>
                    <td>LLM-as-judgeと人間レビューを組み合わせた評価パイプラインを用意したか</td>
                  </tr>
                  <tr>
                    <td rowSpan="2"><strong>コスト管理</strong></td>
                    <td>モデルルーティングとプロンプトキャッシングを実装したか</td>
                  </tr>
                  <tr>
                    <td>トークン予算の上限とエスカレーションフローを設定したか</td>
                  </tr>
                  <tr>
                    <td><strong>相互運用性</strong></td>
                    <td>将来的な他社エージェントとの連携を見据え、MCP・A2Aへの対応を検討したか</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>14.2 まとめ</h3>
            <p>
              マルチエージェント・オーケストレーションは、2026年時点で「実験段階の技術」から「明確なトレードオフを伴う本番アーキテクチャの選択肢」へと成熟しました。しかし、その本質は依然として単純です。
            </p>
            <ol>
              <li>
                <strong>マルチエージェントはデフォルトではない</strong
                >。単一エージェント+優れたプロンプト・ツール設計で解決できないか、まず検証する。
              </li>
              <li>
                <strong>効果があるのは「真に独立した並列タスク」</strong
                >。依存関係が強いタスクへの適用は、コストだけが増える「見せかけの並列化」に終わる。
              </li>
              <li>
                <strong
                  >トポロジーの選択は、制御の集中度とレイテンシ・コストのトレードオフである</strong
                >。5〜6の代表パターンから、タスク特性に応じて選ぶ。
              </li>
              <li>
                <strong
                  >失敗は「モデルの賢さ」ではなく「仕様と検証の設計」に起因することが多い</strong
                >。MASTの14の失敗モードは、その大半がプロンプト設計・アーキテクチャ設計で予防可能であることを示している。
              </li>
              <li>
                <strong
                  >コスト・セキュリティ・可観測性は、後付けではなく設計の最初から組み込む</strong
                >。約15倍のトークン消費という現実を直視し、投資対効果を継続的に検証する。
              </li>
            </ol>
          </section>

          <section className={styles.docSection} id="sec-15">
            <div className={styles.sectionEyebrow}>Section 15</div>
            <h2 className={styles.sectionTitle}>参考文献一覧</h2>
            <p>
              本ガイド全体で参照した一次情報・技術記事・学術論文のURLを集約します(セクションごとの参考文献と重複を含みます)。
            </p>

            <h3>Anthropic公式(一次情報)</h3>
            <ul>
              <li>
                <a
                  href="https://www.anthropic.com/engineering/multi-agent-research-system"
                  target="_blank"
                  >https://www.anthropic.com/engineering/multi-agent-research-system</a
                >
              </li>
              <li>
                <a
                  href="https://www.anthropic.com/engineering/building-effective-agents"
                  target="_blank"
                  >https://www.anthropic.com/engineering/building-effective-agents</a
                >
              </li>
              <li>
                <a
                  href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
                  target="_blank"
                  >https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents</a
                >
              </li>
              <li>
                <a
                  href="https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk"
                  target="_blank"
                  >https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk</a
                >
              </li>
              <li>
                <a href="https://platform.claude.com/docs/en/agent-sdk/subagents" target="_blank"
                  >https://platform.claude.com/docs/en/agent-sdk/subagents</a
                >
              </li>
              <li>
                <a
                  href="https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them"
                  target="_blank"
                  >https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them</a
                >
              </li>
            </ul>

            <h3>学術論文</h3>
            <ul>
              <li>
                <a href="https://arxiv.org/abs/2503.13657" target="_blank"
                  >https://arxiv.org/abs/2503.13657</a
                >(MAST: Why Do Multi-Agent LLM Systems Fail?)
              </li>
              <li>
                <a href="https://arxiv.org/pdf/2601.17915" target="_blank"
                  >https://arxiv.org/pdf/2601.17915</a
                >(MAST詳細版)
              </li>
              <li>
                <a href="https://arxiv.org/pdf/2606.24937" target="_blank"
                  >https://arxiv.org/pdf/2606.24937</a
                >(The Hitchhiker's Guide to Agentic AI)
              </li>
              <li>
                <a href="https://arxiv.org/pdf/2508.08322" target="_blank"
                  >https://arxiv.org/pdf/2508.08322</a
                >(Context Engineering for Multi-Agent LLM Code Assistants)
              </li>
            </ul>

            <h3>フレームワーク公式ドキュメント</h3>
            <ul>
              <li>
                <a
                  href="https://learn.microsoft.com/en-us/agent-framework/overview/"
                  target="_blank"
                  >https://learn.microsoft.com/en-us/agent-framework/overview/</a
                >
              </li>
              <li>
                <a
                  href="https://devblogs.microsoft.com/agent-framework/migrate-your-semantic-kernel-and-autogen-projects-to-microsoft-agent-framework-release-candidate/"
                  target="_blank"
                  >https://devblogs.microsoft.com/agent-framework/migrate-your-semantic-kernel-and-autogen-projects-to-microsoft-agent-framework-release-candidate/</a
                >
              </li>
              <li>
                <a href="https://openai.github.io/openai-agents-python/multi_agent/" target="_blank"
                  >https://openai.github.io/openai-agents-python/multi_agent/</a
                >
              </li>
              <li>
                <a href="https://openai.github.io/openai-agents-python/handoffs/" target="_blank"
                  >https://openai.github.io/openai-agents-python/handoffs/</a
                >
              </li>
              <li>
                <a href="https://pypi.org/project/langgraph-supervisor/" target="_blank"
                  >https://pypi.org/project/langgraph-supervisor/</a
                >
              </li>
              <li>
                <a
                  href="https://langfuse.com/blog/2024-07-ai-agent-observability-with-langfuse"
                  target="_blank"
                  >https://langfuse.com/blog/2024-07-ai-agent-observability-with-langfuse</a
                >
              </li>
            </ul>

            <h3>業界分析・技術ブログ</h3>
            <ul>
              <li>
                <a
                  href="https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work"
                  target="_blank"
                  >https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work</a
                >
              </li>
              <li>
                <a
                  href="https://www.truefoundry.com/blog/multi-agent-orchestration-tools"
                  target="_blank"
                  >https://www.truefoundry.com/blog/multi-agent-orchestration-tools</a
                >
              </li>
              <li>
                <a
                  href="https://www.truefoundry.com/blog/multi-agent-orchestration-frameworks"
                  target="_blank"
                  >https://www.truefoundry.com/blog/multi-agent-orchestration-frameworks</a
                >
              </li>
              <li>
                <a
                  href="https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production"
                  target="_blank"
                  >https://beam.ai/agentic-insights/multi-agent-orchestration-patterns-production</a
                >
              </li>
              <li>
                <a href="https://www.augmentcode.com/guides/swarm-vs-supervisor" target="_blank"
                  >https://www.augmentcode.com/guides/swarm-vs-supervisor</a
                >
              </li>
              <li>
                <a
                  href="https://www.augmentcode.com/guides/anthropic-agent-sdk-what-ships-vs-what-you-build"
                  target="_blank"
                  >https://www.augmentcode.com/guides/anthropic-agent-sdk-what-ships-vs-what-you-build</a
                >
              </li>
              <li>
                <a
                  href="https://www.augmentcode.com/guides/multi-agent-ai-security-risks-compliance-fixes"
                  target="_blank"
                  >https://www.augmentcode.com/guides/multi-agent-ai-security-risks-compliance-fixes</a
                >
              </li>
              <li>
                <a
                  href="https://lilys.ai/en/notes/langgraph-swarm-20260202/langgraph-hierarchical-supervisor-swarm-ai-agents"
                  target="_blank"
                  >https://lilys.ai/en/notes/langgraph-swarm-20260202/langgraph-hierarchical-supervisor-swarm-ai-agents</a
                >
              </li>
              <li>
                <a
                  href="https://dev.to/focused_dot_io/multi-agent-orchestration-in-langgraph-supervisor-vs-swarm-tradeoffs-and-architecture-1b7e"
                  target="_blank"
                  >https://dev.to/focused_dot_io/multi-agent-orchestration-in-langgraph-supervisor-vs-swarm-tradeoffs-and-architecture-1b7e</a
                >
              </li>
              <li>
                <a
                  href="https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent"
                  target="_blank"
                  >https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent</a
                >
              </li>
              <li>
                <a
                  href="https://theaiengineer.substack.com/p/how-anthropic-built-multi-agent-deep"
                  target="_blank"
                  >https://theaiengineer.substack.com/p/how-anthropic-built-multi-agent-deep</a
                >
              </li>
              <li>
                <a
                  href="https://fountaincity.tech/resources/blog/anthropic-multi-agent-blueprint-production/"
                  target="_blank"
                  >https://fountaincity.tech/resources/blog/anthropic-multi-agent-blueprint-production/</a
                >
              </li>
              <li>
                <a
                  href="https://www.zenml.io/llmops-database/building-a-multi-agent-research-system-for-complex-information-tasks"
                  target="_blank"
                  >https://www.zenml.io/llmops-database/building-a-multi-agent-research-system-for-complex-information-tasks</a
                >
              </li>
              <li>
                <a
                  href="https://www.programming-helper.com/tech/agent-to-agent-protocol-2026-google-a2a-standard"
                  target="_blank"
                  >https://www.programming-helper.com/tech/agent-to-agent-protocol-2026-google-a2a-standard</a
                >
              </li>
              <li>
                <a
                  href="https://galileo.ai/blog/google-agent2agent-a2a-protocol-guide"
                  target="_blank"
                  >https://galileo.ai/blog/google-agent2agent-a2a-protocol-guide</a
                >
              </li>
              <li>
                <a
                  href="https://zylos.ai/research/2026-02-15-agent-to-agent-communication-protocols/"
                  target="_blank"
                  >https://zylos.ai/research/2026-02-15-agent-to-agent-communication-protocols/</a
                >
              </li>
              <li>
                <a
                  href="https://www.glukhov.org/ai-systems/comparisons/a2a-protocol-2026-adoption"
                  target="_blank"
                  >https://www.glukhov.org/ai-systems/comparisons/a2a-protocol-2026-adoption</a
                >
              </li>
              <li>
                <a href="https://atlan.com/know/google-a2a-protocol/" target="_blank"
                  >https://atlan.com/know/google-a2a-protocol/</a
                >
              </li>
              <li>
                <a href="https://www.ibm.com/think/topics/agent2agent-protocol" target="_blank"
                  >https://www.ibm.com/think/topics/agent2agent-protocol</a
                >
              </li>
              <li>
                <a href="https://galileo.ai/blog/agent-failure-modes-guide" target="_blank"
                  >https://galileo.ai/blog/agent-failure-modes-guide</a
                >
              </li>
              <li>
                <a
                  href="https://futureagi.substack.com/p/why-do-multi-agent-llm-systems-fail"
                  target="_blank"
                  >https://futureagi.substack.com/p/why-do-multi-agent-llm-systems-fail</a
                >
              </li>
              <li>
                <a
                  href="https://webyot.in/learning/ai-app-security-2026-prompt-injection-guardrails"
                  target="_blank"
                  >https://webyot.in/learning/ai-app-security-2026-prompt-injection-guardrails.html</a
                >
              </li>
              <li>
                <a
                  href="https://www.getmaxim.ai/articles/the-complete-ai-guardrails-implementation-guide-for-2026/"
                  target="_blank"
                  >https://www.getmaxim.ai/articles/the-complete-ai-guardrails-implementation-guide-for-2026/</a
                >
              </li>
              <li>
                <a
                  href="https://www.confident-ai.com/knowledge-base/compare/best-ai-agent-observability-tools-2026"
                  target="_blank"
                  >https://www.confident-ai.com/knowledge-base/compare/best-ai-agent-observability-tools-2026</a
                >
              </li>
              <li>
                <a
                  href="https://www.firecrawl.dev/blog/best-llm-observability-tools"
                  target="_blank"
                  >https://www.firecrawl.dev/blog/best-llm-observability-tools</a
                >
              </li>
              <li>
                <a
                  href="https://zylos.ai/research/2026-02-19-ai-agent-cost-optimization-token-economics/"
                  target="_blank"
                  >https://zylos.ai/research/2026-02-19-ai-agent-cost-optimization-token-economics/</a
                >
              </li>
              <li>
                <a
                  href="https://harnessengineering.academy/blog/cost-optimization-production-ai-agents-token-budgets-model-selection-caching/"
                  target="_blank"
                  >https://harnessengineering.academy/blog/cost-optimization-production-ai-agents-token-budgets-model-selection-caching/</a
                >
              </li>
              <li>
                <a
                  href="https://www.requesty.ai/blog/ai-agent-cost-optimization-how-to-cut-llm-spend-by-80-percent-with-routing"
                  target="_blank"
                  >https://www.requesty.ai/blog/ai-agent-cost-optimization-how-to-cut-llm-spend-by-80-percent-with-routing</a
                >
              </li>
              <li>
                <a
                  href="https://visualstudiomagazine.com/articles/2026/04/06/microsoft-ships-production-ready-agent-framework-1-0-for-net-and-python.aspx"
                  target="_blank"
                  >https://visualstudiomagazine.com/articles/2026/04/06/microsoft-ships-production-ready-agent-framework-1-0-for-net-and-python.aspx</a
                >
              </li>
              <li>
                <a
                  href="https://simonwillison.net/2024/Dec/20/building-effective-agents/"
                  target="_blank"
                  >https://simonwillison.net/2024/Dec/20/building-effective-agents/</a
                >
              </li>
              <li>
                <a
                  href="https://pub.towardsai.net/agent-workflow-patterns-beyond-anthropics-playbook-1bd76a48d63d"
                  target="_blank"
                  >https://pub.towardsai.net/agent-workflow-patterns-beyond-anthropics-playbook-1bd76a48d63d</a
                >
              </li>
              <li>
                <a
                  href="https://www.baeldung.com/spring-ai-building-effective-agents"
                  target="_blank"
                  >https://www.baeldung.com/spring-ai-building-effective-agents</a
                >
              </li>
            </ul>

            <div className={styles.callout + " " + styles.warn}>
              <strong>免責事項:</strong> 上記のうち一部の業界分析記事(TrueFoundry, Zylos AI
              Research, Beam AI, Augment Code
              など)は一次情報ではなく第三者による分析・まとめ記事です。実装の意思決定に用いる際は、可能な限りAnthropic公式ドキュメントや各フレームワークの公式リファレンス、および査読前論文の原文を優先して確認してください。
            </div>

            <footer className={styles.docFooter}>
              マルチエージェント・オーケストレーション実践ガイド — 2026年7月版 · 全15セクション
            </footer>
          </section>
        </div>
      
        </div>
      </div>
    </div>
  );
}
