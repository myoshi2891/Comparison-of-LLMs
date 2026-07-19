import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import Ext from "@/components/docs/Ext";
import styles from "./page.module.css";
import TocObserver from "@/components/docs/TocObserver";

export const metadata: Metadata = {
  title: "Gemini Enterprise Agent Platform 実践ベストプラクティスガイド | LLM コスト計算機",
  description:
    "中級〜上級エンジニア向け。ADK・Agent Runtime・Memory Bank・A2A/MCP・ガバナンス機能を実務レベルで使いこなすための設計指針を、ステップバイステップで解説します。",
};

const DIAGRAMS = {
  evolution: `flowchart LR
    A["Vertex AI<br>(モデル訓練・MLOps)"] --> D["Gemini Enterprise<br>Agent Platform"]
    B["Agentspace<br>(検索・チャットUX)"] --> D
    C["Gemini API<br>(モデルアクセス)"] --> D
    D --> E["単一の開発者体験<br>aiplatform.googleapis.com"]`,

  pillars: `flowchart TB
    subgraph BUILD["🔨 Build"]
        B1["Agent Studio<br>(ローコード)"]
        B2["Agent Development Kit / ADK<br>(プロコード)"]
        B3["Model Garden<br>(200+ 基盤モデル)"]
        B4["MCPツール接続"]
    end
    subgraph SCALE["📈 Scale"]
        S1["Agent Runtime<br>(サーバーレス実行基盤)"]
        S2["Memory Bank / Memory Profiles"]
        S3["Sessions<br>(会話状態管理)"]
        S4["双方向ストリーミング"]
    end
    subgraph GOVERN["🛡️ Govern"]
        G1["Agent Identity<br>(暗号学的ID)"]
        G2["Agent Registry"]
        G3["Agent Gateway"]
        G4["Model Armor / SGP"]
    end
    subgraph OPTIMIZE["📊 Optimize"]
        O1["Agent Simulation"]
        O2["Agent Evaluation"]
        O3["Agent Observability"]
        O4["Agent Optimizer"]
    end
    BUILD --> SCALE --> GOVERN --> OPTIMIZE
    OPTIMIZE -.フィードバックループ.-> BUILD`,

  coreConcept: `flowchart LR
    U["ユーザー入力"] --> Agent["LlmAgent<br>(instruction / tools / model)"]
    Agent -->|"output_key で書き込み"| State["session.state<br>(共有ホワイトボード)"]
    State --> NextAgent["次のエージェントが参照"]
    Agent --> Tools["Tools<br>(関数呼び出し / MCP / AgentTool)"]
    Agent --> Memory["Memory Bank<br>(長期記憶の読み書き)"]`,

  memoryFlow: `sequenceDiagram
    participant U as ユーザー
    participant S as Sessions
    participant M as Memory Bank
    U->>S: 会話イベントを蓄積(AppendEvent)
    S->>M: GenerateMemories を呼び出し
    M->>M: 抽出: memory_topicsに合致する情報のみ保持
    M->>M: 統合: 同一scope内の既存記憶と重複/矛盾を解消
    M-->>U: 次回セッション開始時に記憶を注入`,

  a2aMcp: `flowchart TD
    Q{"何を接続したいか?"}
    Q -->|"データベース・API・社内システムへの<br>単発の関数呼び出し"| MCP["MCPを使う<br>(ステートレスなツール接続)"]
    Q -->|"別の専門エージェントへ<br>タスクを委任・交渉したい"| A2A["A2Aを使う<br>(ステートフルな多段階委任)"]
    MCP --> Reg["Agent Registry に<br>MCPサーバーとして登録"]
    A2A --> Card["Agent Cardを発行し<br>Agent Registryで発見可能にする"]`,

  securityLayers: `flowchart TB
    Identity["① Agent Identity<br>暗号学的な一意ID(mTLS / DPoP)"]
    Registry["② Agent Registry<br>エージェント・ツール・MCPサーバーの中央カタログ"]
    Gateway["③ Agent Gateway<br>全トラフィックの認可・可観測性の集約点"]
    Armor["④ Model Armor / Semantic Governance Policies<br>プロンプトインジェクション・データ漏洩・意図逸脱の防御"]
    Identity --> Gateway
    Registry --> Gateway
    Gateway --> Armor
    Armor --> Result["監査可能な安全なエージェント実行"]`,

  qualityLoop: `flowchart LR
    Sim["Agent Simulation<br>合成ユーザー・仮想ツールで<br>多段階会話をストレステスト"]
    Eval["Agent Evaluation<br>マルチターン自動評価者で<br>本番トラフィックを継続採点"]
    Obs["Agent Observability<br>Unified Trace Viewerで<br>推論経路を可視化"]
    Opt["Agent Optimizer<br>失敗パターンを自動クラスタリングし<br>システム指示を改善提案"]
    Sim --> Eval --> Obs --> Opt --> Sim`,
};

export default function Page() {
  return (
    <div className={styles.layout}>
      <TocObserver navLinkClassName={styles.navLink} activeClassName={styles.navLinkActive} />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandTag}>2026-07-17 時点</span>
          <div className={styles.brandTitle}>
            Gemini Enterprise
            <br />
            Agent Platform
          </div>
          <p>実践ベストプラクティスガイド</p>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#intro" className={styles.navLink}>
            <span className={styles.num}>00</span>Vertex AI → GEAP
          </a>
          <a href="#architecture" className={styles.navLink}>
            <span className={styles.num}>01</span>全体アーキテクチャ
          </a>
          <a href="#adk" className={styles.navLink}>
            <span className={styles.num}>02</span>ADKの基本設計
          </a>
          <a href="#models" className={styles.navLink}>
            <span className={styles.num}>03</span>モデル選定戦略
          </a>
          <a href="#runtime" className={styles.navLink}>
            <span className={styles.num}>04</span>Agent Runtime
          </a>
          <a href="#memory" className={styles.navLink}>
            <span className={styles.num}>05</span>Memory Bank
          </a>
          <a href="#rag" className={styles.navLink}>
            <span className={styles.num}>06</span>RAG / Vector Search
          </a>
          <a href="#a2a-mcp" className={styles.navLink}>
            <span className={styles.num}>07</span>A2A と MCP
          </a>
          <a href="#security" className={styles.navLink}>
            <span className={styles.num}>08</span>セキュリティ・ガバナンス
          </a>
          <a href="#quality" className={styles.navLink}>
            <span className={styles.num}>09</span>品質保証
          </a>
          <a href="#migration" className={styles.navLink}>
            <span className={styles.num}>10</span>移行チェックリスト
          </a>
          <a href="#antipatterns" className={styles.navLink}>
            <span className={styles.num}>11</span>アンチパターン
          </a>
          <a href="#checklist" className={styles.navLink}>
            <span className={styles.num}>12</span>最終チェックリスト
          </a>
          <a href="#references" className={styles.navLink}>
            <span className={styles.num}>13</span>参考文献
          </a>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Google Cloud · Agentic AI Platform</div>
          <h1>
            Gemini Enterprise Agent Platform
            <br />
            実践ベストプラクティスガイド
          </h1>
          <p className={styles.lead}>
            中級〜上級エンジニア向け。ADK・Agent Runtime・Memory
            Bank・A2A/MCP・ガバナンス機能を実務レベルで使いこなすための設計指針を、ステップバイステップで解説します。
          </p>
          <div className={styles.metaRow}>
            <span className={`${styles.pill} ${styles.pillStrong}`}>
              2026年7月17日時点の情報に基づく
            </span>
            <span className={styles.pill}>Vertex AI からの刷新版</span>
            <span className={styles.pill}>Mermaid 図解 7点</span>
            <span className={styles.pill}>一次情報源・URL付き</span>
          </div>
        </div>

        <section className={styles.contentSection} id="intro">
          <h2>
            <span className="idx">00</span>このガイドの前提 ― 「Vertex AI」から「Gemini Enterprise
            Agent Platform」へ
          </h2>
          <p className={styles.sectionLead}>まず押さえておくべき最重要事実から始めます。</p>

          <p>
            <strong>
              2026年4月22日、Google Cloud Next 2026 において、Google は Vertex AI を「Gemini
              Enterprise Agent Platform(以下 GEAP)」として刷新・拡張することを発表しました。
            </strong>
            これは名称変更にとどまらず、次の3製品を1つに統合する再編です。
          </p>
          <ul>
            <li>
              <strong>Vertex AI</strong> ― モデル訓練・チューニング・デプロイのMLOps基盤
            </li>
            <li>
              <strong>Agentspace</strong> ― エンタープライズ向けエージェント検索・チャット体験
            </li>
            <li>
              <strong>Gemini API</strong> ― モデルアクセスそのもの
            </li>
          </ul>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.evolution} />
            <p className={styles.diagramCaption}>
              図0-1: 3製品がGemini Enterprise Agent Platformへ統合される全体像
            </p>
          </div>

          <p>
            2026年5月21日以降、Google Cloud コンソール上から「Vertex
            AI」という名称は姿を消し、検索してもAgent Platformにリダイレクトされます。一方で
            <strong>
              APIエンドポイントは <code>aiplatform.googleapis.com</code> のまま変更されていません。
            </strong>
            既存のコードやSDK呼び出しは無停止で動作を継続するため緊急移行の必要はありませんが、IAMロール名・コンソールUI・課金明細の項目名(2026年5〜6月に「Vertex
            AI」から「Gemini Enterprise」表記へ移行)は確認が必要です。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>用語について</div>
            以降このガイドでは新名称「Agent Platform」または「GEAP」で統一して解説します。
          </div>
        </section>

        <section className={styles.contentSection} id="architecture">
          <h2>
            <span className="idx">01</span>全体アーキテクチャ ― 4つの柱
          </h2>
          <p className={styles.sectionLead}>
            Build / Scale / Govern / Optimize
            の4本柱でエージェントのライフサイクル全体を捉えるのがGEAPの設計思想です。
          </p>

          <p>個別機能を迷わず選択するための最短ルートは、まずこの全体像を掴むことです。</p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.pillars} />
            <p className={styles.diagramCaption}>
              図1-1: Build / Scale / Govern / Optimize の循環的なライフサイクル
            </p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>柱</th>
                  <th>目的</th>
                  <th>主要コンポーネント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Build</td>
                  <td>エージェントロジックとツール接続を作る</td>
                  <td>Agent Studio、ADK、Model Garden、MCP</td>
                </tr>
                <tr>
                  <td>Scale</td>
                  <td>本番トラフィックに耐える実行基盤を提供する</td>
                  <td>Agent Runtime、Memory Bank、Sessions、双方向ストリーミング</td>
                </tr>
                <tr>
                  <td>Govern</td>
                  <td>誰が・何に・どうアクセスできるかを統制する</td>
                  <td>
                    Agent Identity、Agent Registry、Agent Gateway、Model Armor、Semantic Governance
                    Policies
                  </td>
                </tr>
                <tr>
                  <td>Optimize</td>
                  <td>品質を継続的に計測・改善する</td>
                  <td>Agent Simulation、Agent Evaluation、Agent Observability、Agent Optimizer</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス①</div>
            新規プロジェクトでは「まずBuildだけ作り込んで、後からGovernとOptimizeを足す」という順序は避けてください。ガバナンス設定を後回しにすることは、エンタープライズがエージェント展開で犯す最も高くつく失敗としてしばしば指摘されています。小規模なプロトタイプの段階からAgent
            IdentityとAgent Registryへの登録だけは最初に組み込んでおくことを推奨します。
          </div>
        </section>

        <section className={styles.contentSection} id="adk">
          <h2>
            <span className="idx">02</span>Agent Development Kit(ADK)の基本設計
          </h2>
          <p className={styles.sectionLead}>
            OSSのコードファースト・エージェントフレームワーク。単一の万能エージェントではなく、役割を分割した複数の専門エージェントを協調させる「マイクロサービス的発想」が核にあります。
          </p>

          <h3>なぜ単一巨大エージェントを避けるべきか</h3>
          <p>
            1つのエージェントに指示を詰め込みすぎると、指示追従性が低下し、エラー率が複合的に増加し、結果としてハルシネーションが増えるという経験則が広く共有されています。責務を「パーサー」「クリティック」「ディスパッチャー」のように分割することで、モジュール性・テスト容易性・信頼性が向上します。
          </p>

          <h3>コア概念の関係</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.coreConcept} />
            <p className={styles.diagramCaption}>
              図2-1: ADKにおけるエージェント・状態・ツールの関係
            </p>
          </div>

          <p>
            <code>session.state</code> は複数エージェント間の「共有ホワイトボード」です。
            <code>output_key</code>を使って明示的にキーへ書き込み、後続エージェントの
            <code>instruction</code>内で<code>{"{key名}"}</code>として参照します。
            <code>AgentTool</code>
            を使うと、サブエージェント全体を「1つの関数呼び出し」として親エージェントから呼び出せます。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス②</div>
            <code>output_key</code> には必ず意味のある名前を付けてください(<code>raw_text</code>、
            <code>structured_data</code>
            のように)。これはダウンストリームのエージェントにとっての「API仕様書」そのものであり、曖昧な命名はルーティング精度を直接下げます。同様に、ルーティングに使う
            <code>description</code>
            フィールドはLLMへ向けた説明文であるため、精密に書く必要があります。
          </div>

          <h3>マルチエージェント設計パターン8選</h3>
          <p>
            Google Developers
            Blogが2025年12月に公開した設計ガイドでは、8つの基本パターンが整理されています。実務ではこれらを組み合わせて使うのが一般的です。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>パターン名</th>
                  <th>別名</th>
                  <th>適したユースケース</th>
                  <th>ADKのプリミティブ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Sequential Pipeline</td>
                  <td>組立ライン</td>
                  <td>文書処理パイプライン(解析→抽出→要約)</td>
                  <td>
                    <code>SequentialAgent</code>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Coordinator/Dispatcher</td>
                  <td>コンシェルジュ</td>
                  <td>問い合わせを専門エージェントへ振り分けるサポート</td>
                  <td>
                    <code>LlmAgent</code> + <code>sub_agents</code>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Parallel Fan-Out/Gather</td>
                  <td>タコ足</td>
                  <td>コードレビューの並列チェック</td>
                  <td>
                    <code>ParallelAgent</code> + 集約エージェント
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Hierarchical Decomposition</td>
                  <td>マトリョーシカ</td>
                  <td>大きな目標をサブタスクに分解するリサーチ</td>
                  <td>
                    <code>AgentTool</code>でラップ
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Generator &amp; Critic</td>
                  <td>編集者の机</td>
                  <td>SQL生成の構文検証、コンプライアンスレビュー</td>
                  <td>
                    <code>LoopAgent</code>(合否判定)
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Iterative Refinement</td>
                  <td>彫刻家</td>
                  <td>文章・コード品質の段階的な磨き上げ</td>
                  <td>
                    <code>LoopAgent</code> + <code>max_iterations</code>
                  </td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Human-in-the-loop</td>
                  <td>人間の安全網</td>
                  <td>金融取引・本番デプロイなど不可逆な高リスク操作</td>
                  <td>カスタムツール(承認待ち)</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>Composite</td>
                  <td>ミックス&amp;マッチ</td>
                  <td>実運用の複合ワークフロー全般</td>
                  <td>上記の組み合わせ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            以下, 実務で頻出する3パターンをADK風の疑似コードで示します(クラス名は実際のADK
            APIに準拠しています)。
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>
              <span>パターン1: Sequential Pipeline</span>
              <span>Python</span>
            </div>
            <pre>
              <code className={`${styles.codeBody} language-python`}>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>parser</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"ParserAgent"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>instruction=</span>
                  <span className={styles.cs}>"受け取ったPDFのテキストを抽出する。"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>tools=[pdf_parser_tool],</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>output_key=</span>
                  <span className={styles.cs}>"raw_text"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>extractor</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"ExtractorAgent"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>instruction=</span>
                  <span className={styles.cs}>"{"{raw_text}"} から構造化データを抽出する。"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>output_key=</span>
                  <span className={styles.cs}>"structured_data"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>summarizer</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"SummarizerAgent"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>instruction=</span>
                  <span className={styles.cs}>"{"{structured_data}"} を基に要約を生成する。"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>pipeline</span>
                  <span> = </span>
                  <span className={styles.cm}>SequentialAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"DocumentPipeline"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>sub_agents=[parser, extractor, summarizer],</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
              </code>
            </pre>
          </div>

          <p>
            パターン3(Parallel Fan-Out/Gather)では、<code>ParallelAgent</code>
            配下のサブエージェントは同一の<code>session.state</code>
            を共有しつつ別スレッドで並行実行されるため、
            <strong>
              各エージェントが必ず異なる<code>output_key</code>に書き込むよう設計し、競合状態(race
              condition)を防ぐ
            </strong>
            ことが重要です。
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>
              <span>パターン3: Parallel Fan-Out/Gather</span>
              <span>Python</span>
            </div>
            <pre>
              <code className={`${styles.codeBody} language-python`}>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>security_auditor</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(name=</span>
                  <span className={styles.cs}>"SecurityAuditor"</span>
                  <span>, output_key=</span>
                  <span className={styles.cs}>"security_report"</span>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>style_enforcer</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(name=</span>
                  <span className={styles.cs}>"StyleEnforcer"</span>
                  <span>, output_key=</span>
                  <span className={styles.cs}>"style_report"</span>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>perf_analyst</span> <span>= </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(name=</span>
                  <span className={styles.cs}>"PerformanceAnalyst"</span>
                  <span>, output_key=</span>
                  <span className={styles.cs}>"performance_report"</span>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>review_swarm</span>
                  <span> = </span>
                  <span className={styles.cm}>ParallelAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"CodeReviewSwarm"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>sub_agents=[security_auditor, style_enforcer, perf_analyst],</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>synthesizer</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"PRSummarizer"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>instruction=</span>
                  <span className={styles.cs}>
                    "{"{security_report}"}, {"{style_report}"}, {"{performance_report}"}{" "}
                    を統合したレビューを作成する。"
                  </span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>workflow</span>
                  <span> = </span>
                  <span className={styles.cm}>SequentialAgent</span>
                  <span>(sub_agents=[review_swarm, synthesizer])</span>
                </div>
              </code>
            </pre>
          </div>

          <p>パターン5(Generator &amp; Critic)は品質ゲート付きループの代表例です。</p>

          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>
              <span>パターン5: Generator &amp; Critic</span>
              <span>Python</span>
            </div>
            <pre>
              <code className={`${styles.codeBody} language-python`}>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>generator</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"Generator"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>instruction=</span>
                  <span className={styles.cs}>
                    "SQLクエリを生成する。{"{feedback}"} があれば修正して再生成する。"
                  </span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>output_key=</span>
                  <span className={styles.cs}>"draft"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>critic</span>
                  <span> = </span>
                  <span className={styles.cm}>LlmAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"Critic"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>instruction=</span>
                  <span className={styles.cs}>
                    "{"{draft}"} の妥当性を検証し、問題なければ 'PASS'
                    を、そうでなければ具体的な指摘を出力する。"
                  </span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>output_key=</span>
                  <span className={styles.cs}>"feedback"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>validation_loop</span>
                  <span> = </span>
                  <span className={styles.cm}>LoopAgent</span>
                  <span>(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>name=</span>
                  <span className={styles.cs}>"ValidationLoop"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>sub_agents=[generator, critic],</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>condition_key=</span>
                  <span className={styles.cs}>"feedback"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>exit_condition=</span>
                  <span className={styles.cs}>"PASS"</span>
                  <span>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
              </code>
            </pre>
          </div>

          <p>
            <code>LoopAgent</code>の終了条件には<code>max_iterations</code>
            によるハードリミットに加え、<code>EventActions</code>内で<code>escalate=True</code>
            を発火させることで、閾値到達前でも早期終了させる仕組みが用意されています。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス③(段階的導入)</div>
            初日からネストしたループ構造を組むのは避け、まず単純な<code>SequentialAgent</code>
            チェーンでデバッグしてから複雑さを積み増してください。
          </div>
        </section>

        <section className={styles.contentSection} id="models">
          <h2>
            <span className="idx">03</span>モデル選定戦略 ― コストと性能のトレードオフ
          </h2>
          <p className={styles.sectionLead}>
            2026年7月時点のModel Gardenには、Gemini
            3系・2.5系に加え、サードパーティやオープンウェイトまで200以上のモデルが並びます。
          </p>

          <p>
            エージェント設計において
            <strong>モデル選定はコスト最適化における最もレバレッジの効く意思決定</strong>です。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モデル</th>
                  <th>特性</th>
                  <th>推奨ユースケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gemini 3.1 Flash-Lite</td>
                  <td>最安・低レイテンシ、thinkingレベル(minimal/low/medium/high)を選択可</td>
                  <td>高頻度・低複雑度なルーティングや分類タスク</td>
                </tr>
                <tr>
                  <td>Gemini 3 Flash</td>
                  <td>3 Proの推論力をFlashのコスト感で提供</td>
                  <td>複雑なエージェントワークフローの主力モデル</td>
                </tr>
                <tr>
                  <td>Gemini 3.5 Flash</td>
                  <td>
                    Proに迫る知性をFlash価格帯で提供、コーディングと並列エージェント実行に強み
                  </td>
                  <td>マルチエージェントのオーケストレーション層</td>
                </tr>
                <tr>
                  <td>Gemini 2.5 Pro / 3.1 Pro</td>
                  <td>高度な推論・100万トークン級コンテキスト</td>
                  <td>複雑な推論・コーディング、最終品質チェック</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarn}`}>
            <div className={styles.calloutTitle}>ベストプラクティス④(コスト最適化)</div>
            一部の分析では、Flash-Liteの入力単価がPro系モデルの約20分の1という報告もあります(価格は変動するため必ず
            <Ext href="https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing">
              公式料金ページ
            </Ext>
            を確認してください)。また、Pro系モデルは
            <strong>
              入力コンテキストが約20万トークンを超えると単価が段階的に上昇する「コストの崖」
            </strong>
            が存在するとされています。RAGパイプラインで長文コンテキストをそのまま流し込むと、意図せずこの閾値を超えて課金が跳ね上がることがあるため注意が必要です。すべてのタスクにPro系を使うのではなく、タスクの複雑度に応じてモデルを動的に振り分ける設計(自前のルーターエージェントでも可)を検討してください。
          </div>
        </section>

        <section className={styles.contentSection} id="runtime">
          <h2>
            <span className="idx">04</span>Agent Runtime ― デプロイとスケーリングの実践
          </h2>
          <p className={styles.sectionLead}>
            Agent
            RuntimeはADKエージェントをホストするフルマネージドのサーバーレス実行基盤です。パフォーマンスチューニングの鍵は「コールドスタート」の理解にあります。
          </p>

          <h3>コールドスタートの実測データ</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>条件</th>
                  <th>平均レイテンシ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>min_instances=1</code>(デフォルト)、300同時リクエスト、コールドスタート時
                  </td>
                  <td>約4.7秒</td>
                </tr>
                <tr>
                  <td>同条件、ウォームスタート時(直後の再実行)</td>
                  <td>約0.4秒</td>
                </tr>
                <tr>
                  <td>
                    <code>min_instances=10</code>に変更した場合のコールドスタート
                  </td>
                  <td>約1.4秒</td>
                </tr>
                <tr>
                  <td>
                    <code>min_instances=10</code>・デフォルト同時実行数(9)で1,500クエリ/分(25
                    QPS)を60秒間持続
                  </td>
                  <td>約1.6秒で安定</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>つまり、4秒以上のオーバーヘッドのほとんどは新規インスタンスの起動待ちに起因します。</p>

          <h3>デプロイパラメータの設計指針</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeLabel}>
              <span>Agent Runtime デプロイ設定</span>
              <span>Python</span>
            </div>
            <pre>
              <code className={`${styles.codeBody} language-python`}>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>remote_agent</span>
                  <span> = </span>
                  <span className={styles.cv}>client</span>
                  <span>.agent_engines.create(</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>agent=local_agent,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>config={"{"}</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.cs}>"min_instances"</span>
                  <span>: 10, </span>
                  <span className={styles.cc}># 範囲: [0, 10](VPC-SC/PSC-I有効時は[1, 100])</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.cs}>"max_instances"</span>
                  <span>: 10,</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.cs}>"resource_limits"</span>
                  <span>: {"{"}</span>
                  <span className={styles.cs}>"cpu"</span>
                  <span>: </span>
                  <span className={styles.cs}>"4"</span>
                  <span>, </span>
                  <span className={styles.cs}>"memory"</span>
                  <span>: </span>
                  <span className={styles.cs}>"8Gi"</span>
                  <span>{"}"},</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span className={styles.cs}>"container_concurrency"</span>
                  <span>: 9, </span>
                  <span className={styles.cc}># デフォルト値</span>
                </div>
                <div className={styles.codeLine}>
                  {" "}
                  <span>{"}"},</span>
                </div>
                <div className={styles.codeLine}>
                  <span>)</span>
                </div>
              </code>
            </pre>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス⑤</div>
            バーストしやすい、あるいは常時アクセスされる本番ワークロードでは
            <code>min_instances</code>
            をベースライントラフィックを捌ける水準まで引き上げてください。逆に、断続的にしかアクセスされない社内ツールなどでは
            <code>min_instances=0〜1</code>
            のままにしてコストを抑える判断も合理的です。安定した継続トラフィックを流すことでインスタンスを「温めておく」ことも、スパイクへの耐性を上げる手段になります。依存パッケージについては、
            <code>requirements.txt</code>
            でバージョンを固定(pin)し、再現可能なビルドを保証してください。
          </div>
        </section>

        <section className={styles.contentSection} id="memory">
          <h2>
            <span className="idx">05</span>Memory Bank ― 長期記憶の設計と落とし穴
          </h2>
          <p className={styles.sectionLead}>
            ユーザーとエージェントの会話履歴から長期記憶を自動生成・自己組織化するマネージドサービス。設計を誤ると、プライバシー漏洩やレイテンシ問題に直結します。
          </p>

          <h3>スコープと抽出・統合の流れ</h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.memoryFlow} />
            <p className={styles.diagramCaption}>
              図5-1: Memory Bankにおける記憶の抽出・統合フロー
            </p>
          </div>

          <ul>
            <li>
              記憶は必ず<code>scope</code>(通常は<code>user_id</code>
              )に紐づけて隔離されます。これにより、あるユーザーの記憶が別のユーザーに漏れることはありません。
            </li>
            <li>
              抽出対象は<code>memory_topics</code>
              で制御し、マネージド済みトピックを使うか、few-shot例を与えて挙動をカスタマイズできます。
            </li>
            <li>
              生成は既定では同期的(呼び出し元がポーリングして完了を待つ)ですが、
              <strong>本番環境ではバックグラウンドの非同期処理として実行することが推奨</strong>
              されています。
            </li>
          </ul>

          <h3>よくある誤用パターン(アンチパターン)</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>誤用</th>
                  <th>リスク</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>メモリポイズニング</td>
                  <td>誤情報が書き込まれ、エージェントが事実として利用し続ける</td>
                  <td>IAM Conditionsでスコープ単位の読み書き権限を制限</td>
                </tr>
                <tr>
                  <td>ホットパスでの誤用</td>
                  <td>検索精度優先の設計でありサブ10msの応答を保証しない</td>
                  <td>セッション開始時のコンテキスト事前ロード用途に限定</td>
                </tr>
                <tr>
                  <td>スコープ設計の甘さ</td>
                  <td>
                    <code>scope_keys</code>が粗いと記憶が意図せず混在
                  </td>
                  <td>ユーザー単位・セッション単位など粒度を明確化</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            なお、2026年7月時点でMemory Bankのデフォルトの生成モデルはGemini 2.5 FlashからGemini 3.5
            Flashに更新されています。
          </p>
        </section>

        <section className={styles.contentSection} id="rag">
          <h2>
            <span className="idx">06</span>RAG Engine と Vector Search
          </h2>
          <p className={styles.sectionLead}>
            プライベートデータをLLMに安全に接続し、ハルシネーションを低減するためのマネージド基盤。
          </p>

          <p>
            RAG Engineは検索と生成を接続するパイプラインを、Vector
            Searchはストレージと検索を一体化したAIネイティブな検索エンジンとして提供します。
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス⑥</div>
            Vector
            Searchのインデックス設計では、フィルタリング条件(restricts)の数がシャード数、ひいてはメモリ使用量に直結します。フィルタ条件を絞り込みすぎるとインデックスコストが跳ね上がる点に注意してください。また、RAGで取得したチャンクをそのままPro系モデルへ渡す設計は、前述の「コンテキスト長のコストの崖」を誘発しやすいため、リランキングや要約による事前圧縮を検討してください。
          </div>
        </section>

        <section className={styles.contentSection} id="a2a-mcp">
          <h2>
            <span className="idx">07</span>エージェント間通信 ― A2AプロトコルとMCPの使い分け
          </h2>
          <p className={styles.sectionLead}>
            実務で最も混同されやすいポイントです。A2Aはエージェント間の委任・協調、MCPはエージェントとツール/データの接続を扱います。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.a2aMcp} />
            <p className={styles.diagramCaption}>図7-1: A2AとMCPの使い分け判断フロー</p>
          </div>

          <p>この2つは競合するものではなく、実システムでは両方を併用するのが一般的です。</p>
          <ul>
            <li>
              <strong>A2A</strong>は2026年3月にv1.2がリリースされ、Linux Foundation傘下のAgentic AI
              Foundationによって管理される、ベンダー非依存のオープン標準です。150以上の組織が本番運用しているとされ、Microsoft・AWS・Salesforce・SAP・ServiceNowなど主要ベンダーも対応を進めています。
            </li>
            <li>
              <strong>Agent Card</strong>
              は、エージェントの能力(skills)・認証方式・エンドポイントを記述するJSON文書で、他のエージェントがこれを取得して発見・連携します。
            </li>
            <li>
              ADKでは<code>RemoteA2aAgent</code>
              を使ってリモートのA2Aエージェントを、あたかもローカルのサブエージェントであるかのように呼び出せます。
            </li>
            <li>
              <strong>Agent Gateway</strong>
              はMCP/A2A双方のトラフィックを仲介し、MCPリクエストについては属性を解析して「特定ツールへのアクセスのみ許可する」といったきめ細かい認可ポリシーを設定できます。
            </li>
          </ul>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス⑦</div>
            本番投入前に、構築したエージェントを必ず<strong>Agent Registryに登録</strong>
            してください。開発段階では登録は任意ですが、登録されていないエージェントは他のエージェントメッシュから発見されず、組織横断での再利用や監査ができない「孤立したエージェント」のままになってしまいます。
          </div>
        </section>

        <section className={styles.contentSection} id="security">
          <h2>
            <span className="idx">08</span>セキュリティとガバナンス
          </h2>
          <p className={styles.sectionLead}>
            エージェントが自律的に行動する以上、「誰が」「何に」アクセスできるかを事前に設計することが不可欠です。
          </p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.securityLayers} />
            <p className={styles.diagramCaption}>図8-1: GEAPの4層ガバナンスアーキテクチャ</p>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>コンポーネント</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Agent Identity</td>
                  <td>
                    すべてのエージェントに一意の暗号学的IDを付与し、mTLSとDPoPで保護されたコンテキストアウェアアクセスを既定で強制。すべての行動がこのIDと権限に紐づいて記録され監査を可能にする
                  </td>
                </tr>
                <tr>
                  <td>Agent Registry</td>
                  <td>
                    組織内のすべてのエージェント・ツール・MCPサーバーの中央カタログ。誰が何を利用できるかを制御し、ガバナンスなきエージェントの乱立を防ぐ
                  </td>
                </tr>
                <tr>
                  <td>Agent Gateway</td>
                  <td>
                    Client-to-Agent と Agent-to-Anywhere
                    の2モードで動作し、mTLSハンドシェイクを自動処理しつつIAM・SGP・Model
                    Armorへの委任認可を実施。ネットワーク層のオブザーバビリティテレメトリも出力
                  </td>
                </tr>
                <tr>
                  <td>Model Armor</td>
                  <td>
                    プロンプトインジェクション、ツールポイズニング、機密データ漏洩を防ぐガードレール。MCP特有の攻撃にも対応
                  </td>
                </tr>
                <tr>
                  <td>Semantic Governance Policies(SGP)</td>
                  <td>
                    2026年7月時点プレビュー。ツール呼び出しをユーザー意図・組織ルールに照らして実行時に評価。Natural
                    Language Constraints(NLC)により平易な英語でルールを宣言可能
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutDanger}`}>
            <div className={styles.calloutTitle}>ベストプラクティス⑧(最重要)</div>
            複数の実務者が共通して指摘しているのは、「組織展開の前にガバナンスを整備しないこと」がエンタープライズのエージェント導入における最も高くつく失敗だという点です。Agent
            Identity・Agent Gateway・Model
            Armorの設定は、スケールしてから追加するものではなく、最初の1エージェントを作る段階から組み込むべき土台です。
          </div>
        </section>

        <section className={styles.contentSection} id="quality">
          <h2>
            <span className="idx">09</span>品質保証 ― Evaluation・Simulation・Observability
          </h2>
          <p className={styles.sectionLead}>3段階のサイクルで品質を継続的に計測・改善します。</p>

          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAMS.qualityLoop} />
            <p className={styles.diagramCaption}>図9-1: 品質保証の継続的フィードバックループ</p>
          </div>

          <ul>
            <li>
              <strong>Agent Simulation</strong>:
              人間らしい合成ユーザーと仮想化されたツールを使い、タスク成功率と安全性をスコアリング
            </li>
            <li>
              <strong>Agent Evaluation</strong>:
              マルチターンの自動評価者(autorater)が会話全体の論理を評価。「環境シミュレーション」機能でHTTP
              503エラーやレイテンシスパイクを注入し、耐障害性を検証可能
            </li>
            <li>
              <strong>Agent Observability</strong>:
              OpenTelemetry準拠でトレース・ログ・メトリクス(p50/p95/p99レイテンシ、トークン使用量、エラー率)を収集し、Unified
              Trace Viewerで可視化
            </li>
            <li>
              <strong>Agent Optimizer</strong>:
              実運用の失敗を自動でクラスタリングし、精度向上のためのシステム指示の改訂案を提示
            </li>
          </ul>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>ベストプラクティス⑨</div>
            手動テストは初期プロトタイピングには有効ですが、スケールしません。数千人規模の従業員に展開する前に、ADK
            Evaluation
            Frameworkを使った決定論的なEvalSetを用意し、意味的等価性の判定・ハルシネーション検知・CIパイプラインからのテストスイート実行を組み込んでください。
          </div>
        </section>

        <section className={styles.contentSection} id="migration">
          <h2>
            <span className="idx">10</span>移行時のチェックリスト(Vertex AIからの移行)
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>確認項目</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>APIエンドポイント</td>
                  <td>
                    <code>aiplatform.googleapis.com</code>は変更なし。既存コードは無停止で動作継続
                  </td>
                </tr>
                <tr>
                  <td>コンソール表示</td>
                  <td>
                    「Vertex AI」表記は廃止済み。ブックマークやドキュメントのリンク先を更新推奨
                  </td>
                </tr>
                <tr>
                  <td>IAMロール名</td>
                  <td>
                    一部のロール名称が変更されている場合があるため、サービスアカウントの権限を再確認
                  </td>
                </tr>
                <tr>
                  <td>課金明細</td>
                  <td>
                    2026年5〜6月の請求書で「Vertex AI」から「Gemini Enterprise」への項目移行を確認
                  </td>
                </tr>
                <tr>
                  <td>Agentspace資産</td>
                  <td>既存のAgentspaceエージェントは自動移行されるが、統合UX上で挙動を必ず確認</td>
                </tr>
                <tr>
                  <td>名称変更表</td>
                  <td>
                    個別機能名の新旧対応は公式の
                    <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes">
                      name changesページ
                    </Ext>
                    を参照
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.contentSection} id="antipatterns">
          <h2>
            <span className="idx">11</span>アンチパターン早見表
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>なぜ問題か</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A2AとMCPを混同する</td>
                  <td>ツール接続と委任の設計が破綻する</td>
                  <td>「データ/ツール接続=MCP」「エージェント間委任=A2A」で判断</td>
                </tr>
                <tr>
                  <td>Memory Bankをホットパスキャッシュとして使う</td>
                  <td>検索精度優先の設計でレイテンシが安定しない</td>
                  <td>セッション開始時のコンテキスト事前ロード用途に限定</td>
                </tr>
                <tr>
                  <td>Agent Registryに登録しない</td>
                  <td>組織内で発見・再利用・監査ができない孤立エージェントになる</td>
                  <td>開発段階から登録を習慣化する</td>
                </tr>
                <tr>
                  <td>ガバナンス設定を後回しにする</td>
                  <td>展開後の是正コストが跳ね上がる</td>
                  <td>Identity/Gateway/Model Armorを最初の1体から組み込む</td>
                </tr>
                <tr>
                  <td>すべてのタスクにPro系モデルを使う</td>
                  <td>コストが不必要に膨張する</td>
                  <td>タスク複雑度に応じてFlash-Lite/Flash/Proを使い分ける</td>
                </tr>
                <tr>
                  <td>
                    <code>min_instances=1</code>のまま高トラフィックを受ける
                  </td>
                  <td>コールドスタートで数秒級の遅延が発生する</td>
                  <td>ベースライントラフィックに応じて調整する</td>
                </tr>
                <tr>
                  <td>RAGで長文コンテキストをそのまま投入する</td>
                  <td>コンテキスト長の閾値超過でコストが急増する</td>
                  <td>リランキング・要約による事前圧縮を行う</td>
                </tr>
                <tr>
                  <td>ネストしたループ構造をいきなり実装する</td>
                  <td>デバッグが困難になる</td>
                  <td>Sequentialパターンから始め段階的に複雑化する</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.contentSection} id="checklist">
          <h2>
            <span className="idx">12</span>まとめ ― 実装前の最終チェックリスト
          </h2>
          <ul className={styles.checklist}>
            <li>単一の万能エージェントではなく、役割分担された複数エージェント構成を検討したか</li>
            <li>
              <code>output_key</code>と<code>description</code>を明確に命名したか
            </li>
            <li>タスクの複雑度に応じたモデル選定(Flash-Lite / Flash / Pro)を行ったか</li>
            <li>
              <code>min_instances</code> / <code>container_concurrency</code>
              をトラフィックパターンに合わせて設定したか
            </li>
            <li>
              Memory Bankの<code>scope</code>設計とIAM Conditionsによるアクセス制御を行ったか
            </li>
            <li>MCP(ツール接続)とA2A(エージェント間委任)を正しく使い分けたか</li>
            <li>Agent Identity・Agent Gateway・Model Armorを最初から組み込んだか</li>
            <li>Agent Registryへの登録を行ったか</li>
            <li>Agent Evaluation / Simulationによる継続的な品質評価パイプラインを構築したか</li>
            <li>Vertex AIからの移行チェックリスト(IAM・課金・コンソールリンク)を確認したか</li>
          </ul>
        </section>

        <section className={styles.contentSection} id="references">
          <h2>
            <span className="idx">13</span>参考文献・一次情報源
          </h2>
          <p className={styles.sectionLead}>
            本ガイドの内容は、以下の公式ドキュメント・Google公式ブログ・Google Developer
            Experts等の技術記事を根拠としています(2026年7月17日時点で確認)。
          </p>

          <div className={styles.refGroup}>
            <h4>Google公式ドキュメント・ブログ</h4>
            <ul className={styles.refList}>
              <li>
                <span className="ref-title">Gemini Enterprise Agent Platform 公式トップページ</span>
                <Ext href="https://cloud.google.com/products/gemini-enterprise-agent-platform">
                  cloud.google.com/products/gemini-enterprise-agent-platform
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Platform 概要ドキュメント</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/overview
                </Ext>
              </li>
              <li>
                <span className="ref-title">Vertex AIからの名称変更一覧</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Development Kit(ADK)公式解説</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk
                </Ext>
              </li>
              <li>
                <span className="ref-title">ADKエージェント開発ガイド</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/create-an-adk-agent">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime/create-an-adk-agent
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Runtimeのスケーリング最適化</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/optimize-and-scale">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/optimize-and-scale
                </Ext>
              </li>
              <li>
                <span className="ref-title">エージェントのデプロイ手順</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/deploy-an-agent">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/deploy-an-agent
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Platform Memory Bank</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank
                </Ext>
              </li>
              <li>
                <span className="ref-title">Memory Bankのセットアップ</span>
                <Ext href="https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/set-up">
                  cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/set-up
                </Ext>
              </li>
              <li>
                <span className="ref-title">Memory Bankの記憶生成</span>
                <Ext href="https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/generate-memories">
                  cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/generate-memories
                </Ext>
              </li>
              <li>
                <span className="ref-title">Vertex AI Memory Bank プレビュー発表記事</span>
                <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/vertex-ai-memory-bank-in-public-preview">
                  cloud.google.com/blog/products/ai-machine-learning/vertex-ai-memory-bank-in-public-preview
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Gateway概要</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Gatewayによるガバナンス実践(Codelab)</span>
                <Ext href="https://codelabs.developers.google.com/cloudnet-agent-gateway">
                  codelabs.developers.google.com/cloudnet-agent-gateway
                </Ext>
              </li>
              <li>
                <span className="ref-title">A2Aエージェントのインポートとガバナンス</span>
                <Ext href="https://docs.cloud.google.com/gemini/enterprise/docs/import-govern-agent-registry">
                  docs.cloud.google.com/gemini/enterprise/docs/import-govern-agent-registry
                </Ext>
              </li>
              <li>
                <span className="ref-title">A2A・Agent Runtime連携Codelab</span>
                <Ext href="https://codelabs.developers.google.com/adk-a2a-agent-runtime">
                  codelabs.developers.google.com/adk-a2a-agent-runtime
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Platformの最適化(評価・観測性)概要</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/optimize
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Observability概要</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/observability/overview">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/observability/overview
                </Ext>
              </li>
              <li>
                <span className="ref-title">Agent Evaluation詳細</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/agent-evaluation">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/optimize/evaluation/agent-evaluation
                </Ext>
              </li>
              <li>
                <span className="ref-title">リリースノート(Semantic Governance Policies等)</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  「Gemini Enterprise Agent Platform」発表ブログ(2026/4/22)
                </span>
                <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform">
                  cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform
                </Ext>
              </li>
              <li>
                <span className="ref-title">「新Gemini Enterprise」プラットフォーム解説ブログ</span>
                <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/the-new-gemini-enterprise-one-platform-for-agent-development">
                  cloud.google.com/blog/products/ai-machine-learning/the-new-gemini-enterprise-one-platform-for-agent-development
                </Ext>
              </li>
              <li>
                <span className="ref-title">パートナー向けエージェント公開ガイド(A2A準拠要件)</span>
                <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/publish-agents-in-gemini-enterprise-and-google-cloud-marketplace">
                  cloud.google.com/blog/topics/developers-practitioners/publish-agents-in-gemini-enterprise-and-google-cloud-marketplace
                </Ext>
              </li>
              <li>
                <span className="ref-title">本番エージェント構築のための5つのガイド</span>
                <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/five-guides-to-building-and-scaling-production-ready-ai-agents">
                  cloud.google.com/blog/topics/developers-practitioners/five-guides-to-building-and-scaling-production-ready-ai-agents
                </Ext>
              </li>
              <li>
                <span className="ref-title">Cloud Runのコールドスタート対策ガイド</span>
                <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/a-guide-to-ai-cold-starts-on-cloud-run">
                  cloud.google.com/blog/topics/developers-practitioners/a-guide-to-ai-cold-starts-on-cloud-run
                </Ext>
              </li>
              <li>
                <span className="ref-title">RAG Engine 課金モデル</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-engine-billing">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-engine-billing
                </Ext>
              </li>
              <li>
                <span className="ref-title">Vector Search概要</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/vector-search/overview">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/build/vector-search/overview
                </Ext>
              </li>
              <li>
                <span className="ref-title">Gemini 3.1 Flash-Liteモデルページ</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-flash-lite
                </Ext>
              </li>
              <li>
                <span className="ref-title">Gemini 3 Flashモデルページ</span>
                <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-flash">
                  docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-flash
                </Ext>
              </li>
            </ul>
          </div>

          <div className={styles.refGroup}>
            <h4>著名な開発者・Google Developer Experts等による技術記事</h4>
            <ul className={styles.refList}>
              <li>
                <span className="ref-title">
                  Shubham Saboo (Google, Senior AI Product Manager)「Developer&apos;s guide to
                  multi-agent patterns in ADK」Google Developers Blog(2025/12/16)
                </span>
                <Ext href="https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/">
                  developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  「Agent Development Kit: Making it easy to build multi-agent applications」Google
                  Developers Blog
                </span>
                <Ext href="https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/">
                  developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  「Introducing Agent Development Kit for TypeScript」Google Developers Blog
                </span>
                <Ext href="https://developers.googleblog.com/introducing-agent-development-kit-for-typescript-build-ai-agents-with-the-power-of-a-code-first-approach/">
                  developers.googleblog.com/introducing-agent-development-kit-for-typescript-build-ai-agents-with-the-power-of-a-code-first-approach
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  Gabriel Preda (Google Developer Expert)「From Vertex AI to Gemini Enterprise Agent
                  Platform」Medium(2026/5)
                </span>
                <Ext href="https://medium.com/google-developer-experts/from-vertex-ai-to-gemini-enterprise-agent-platform-57244e686b7a">
                  medium.com/google-developer-experts/from-vertex-ai-to-gemini-enterprise-agent-platform
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  Romin Irani「Tutorial Series: Gemini Enterprise Agent Platform」Part 3・Part 5,
                  Google Cloud Community
                </span>
                <Ext href="https://medium.com/google-cloud/tutorial-series-gemini-enterprise-agent-platform-part-3-scaling-with-agent-runtime-memory-1fe9fe48d829">
                  medium.com/google-cloud/tutorial-series-gemini-enterprise-agent-platform-part-3-scaling-with-agent-runtime-memory-1fe9fe48d829
                </Ext>
              </li>
              <li>
                <span className="ref-title">同上 Part 5(Observability and Evaluation)</span>
                <Ext href="https://medium.com/google-cloud/tutorial-series-gemini-enterprise-agent-platform-part-5-observability-and-evaluation-79c110c38028">
                  medium.com/google-cloud/tutorial-series-gemini-enterprise-agent-platform-part-5-observability-and-evaluation-79c110c38028
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  Vishal Bulbule「Using Long term Memory in Agent (ADK): Vertex AI Memory
                  bank」Google Cloud Community
                </span>
                <Ext href="https://medium.com/google-cloud/using-long-term-memory-in-agent-adk-vertex-ai-memory-bank-2d1e979b6197">
                  medium.com/google-cloud/using-long-term-memory-in-agent-adk-vertex-ai-memory-bank-2d1e979b6197
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  「Google Gemini Enterprise Agent Platform: Build and Deploy A2A Agents」DEV
                  Community
                </span>
                <Ext href="https://dev.to/jangwook_kim_e31e7291ad98/google-gemini-enterprise-agent-platform-build-and-deploy-a2a-agents-11ck">
                  dev.to/jangwook_kim_e31e7291ad98/google-gemini-enterprise-agent-platform-build-and-deploy-a2a-agents-11ck
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  David Regalado「What is Gemini Enterprise Agent Platform?」Google Cloud Community
                </span>
                <Ext href="https://medium.com/google-cloud/what-is-gemini-enterprise-agent-platform-ff621edcbe3d">
                  medium.com/google-cloud/what-is-gemini-enterprise-agent-platform-ff621edcbe3d
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  AIPractitioner「Google ADK Explained: Building Multi-Agent Systems With
                  Google&apos;s Agent Development Kit」Substack
                </span>
                <Ext href="https://aipractitioner.substack.com/p/google-adk-explained-building-multi">
                  aipractitioner.substack.com/p/google-adk-explained-building-multi
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  CloudZero「Google Vertex AI Pricing: Complete Enterprise Guide (2026)」
                </span>
                <Ext href="https://www.cloudzero.com/blog/google-vertex-ai-pricing/">
                  cloudzero.com/blog/google-vertex-ai-pricing
                </Ext>
              </li>
              <li>
                <span className="ref-title">
                  Wikipedia「Gemini Enterprise Agent Platform」(背景・沿革の一次確認用途)
                </span>
                <Ext href="https://en.wikipedia.org/wiki/Gemini_Enterprise_Agent_Platform">
                  en.wikipedia.org/wiki/Gemini_Enterprise_Agent_Platform
                </Ext>
              </li>
            </ul>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarn}`} style={{ marginTop: "28px" }}>
            <div className={styles.calloutTitle}>注記</div>
            Gemini Enterprise Agent Platformは発表から日が浅く(2026年4月22日発表)、Semantic
            Governance
            Policiesをはじめプレビュー段階の機能や価格体系は今後変更される可能性があります。実装前に必ず上記の公式ドキュメントで最新のステータスを確認してください。
          </div>
        </section>

        <footer className={styles.pageFooter}>
          Gemini Enterprise Agent Platform 実践ベストプラクティスガイド · 作成日: 2026年7月17日
        </footer>
      </div>
    </div>
  );
}
