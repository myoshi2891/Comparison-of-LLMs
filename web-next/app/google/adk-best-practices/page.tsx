import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title:
    "Google Agent Development Kit 実践ガイド | 中級者・上級者向けベストプラクティス | LLM-Studies",
  description:
    "Google Agent Development Kit (ADK) を用いた、マルチエージェント設計、状態管理、コンテキスト最適化、コールバック、評価、可観測性、デプロイメントのステップバイステップ実践ガイド。",
};

const DIAGRAMS = {
  d1: `flowchart TB
User[ユーザー] --> Runner
Runner --> Agent[Root Agent]
Runner --> SessionService[Session Service]
Runner --> MemoryService[Memory Service]
Runner --> ArtifactService[Artifact Service]
Agent --> SubAgent1[専門エージェント A]
Agent --> SubAgent2[専門エージェント B]
Agent --> Model[Gemini などのLLM]
Agent --> Tools[Function Tool と MCP Tool と OpenAPI Tool]
Agent --> Callbacks[Callbacks と Plugins]
SessionService --> State[Session State]
MemoryService --> LongTerm[長期記憶ストア]
class Agent,SubAgent1,SubAgent2 core
class SessionService,MemoryService,ArtifactService svc
classDef core fill:#3d2f5c,stroke:#b39ddb,color:#ede7f6
classDef svc fill:#1f4a4a,stroke:#80cbc4,color:#e0f2f1`,

  d2: `flowchart LR
subgraph Sequential[Sequential Agent - パイプライン型]
    direction LR
    S1[取得] --> S2[整形] --> S3[分析] --> S4[要約]
end`,

  d3: `flowchart TB
subgraph Parallel[Parallel Agent - ファンアウト型]
    direction TB
    P0[開始] --> P1[API呼び出し A]
    P0 --> P2[API呼び出し B]
    P0 --> P3[API呼び出し C]
    P1 --> P4[結果集約エージェント]
    P2 --> P4
    P3 --> P4
end`,

  d4: `flowchart LR
L0[開始] --> L1[生成エージェント]
L1 --> L2{終了条件を満たすか}
L2 -- いいえ --> L3[批評エージェント]
L3 --> L1
L2 -- はい --> L4[終了]`,

  d5: `flowchart TD
A[コーディネーターエージェント] -- 共有state経由 --> B[session.state]
A -- LLM駆動の委譲 --> C[サブエージェントへ完全に制御を移譲]
A -- Explicit Invocation --> D[AgentTool として明示的に呼び出す]
B --> E[サブエージェント群が読み書き]`,

  d6: `flowchart LR
Agent[ADK エージェント] -- MCPクライアント --> MCPServer1[MCP サーバー ファイルシステム]
Agent -- MCPクライアント --> MCPServer2[MCP サーバー 社内DB]`,

  d7: `flowchart TB
Conversation[1回の会話] --> Session[Session]
Session --> Events[Event履歴]
Session --> State[state 短期の作業データ]
Session -- 会話終了後に取り込み --> Memory[Memory Service 長期知識ストア]
Memory --> Search[複数セッション横断の検索]`,

  d8: `flowchart LR
subgraph Problem[最適化なしの場合]
    direction TB
    A1[長い会話] --> A2[毎回全文脈を送信]
    A2 --> A3[レイテンシ増大]
    A2 --> A4[コスト増大]
end
subgraph Solution[コンテキストエンジニアリング適用後]
    direction TB
    B1[長い会話] --> B2[Context Caching]
    B1 --> B3[Context Compaction]
    B2 --> B4[応答が高速化]
    B3 --> B5[コストが低下]
end`,

  d9: `flowchart LR
Req[ユーザーリクエスト] --> BMC[before_model_callback で禁止語をチェック]
BMC -- 違反あり --> Block[定型の拒否メッセージを返す]
BMC -- 違反なし --> LLM[LLM呼び出し]
LLM --> AMC[after_model_callback でPIIを除去]
AMC --> BTC[before_tool_callback で引数検証]
BTC --> Tool[ツール実行]
Tool --> ATC[after_tool_callback で結果をstateへ記録]
ATC --> Response[最終応答]`,

  d10: `flowchart TB
Case[test.test.json 形式のテストケース] --> Runner2[AgentEvaluatorがエージェントを実行]
Runner2 --> Actual[実際のツール呼び出し順序と最終応答を記録]
Actual --> TrajEval[TrajectoryEvaluator が期待する経路と比較]
Actual --> RespEval[ResponseEvaluator が期待する応答と比較]
TrajEval --> Result[合否判定とスコア]
RespEval --> Result`,

  d11: `flowchart TB
Root[invoke_agent ルートスパン] --> LLM1[generate_content call_llm]
Root --> Tool1[execute_tool get_weather]
LLM1 --> LLM2[generate_content 2回目の呼び出し]
Tool1 --> SubAgentCall[execute_tool サブエージェント呼び出し]`,

  d12: `flowchart LR
ClientAgent[クライアントエージェント] -- Agent Card取得 --> RemoteAgent[リモートエージェントの Agent Card]
ClientAgent -- JSON RPC over HTTPS --> Server[A2Aサーバー化されたリモートエージェント]
Server -- Artifactを返却 --> ClientAgent`,

  d13: `flowchart TB
Dev[ローカル開発 adk web] --> Choice{デプロイ先の選定}
Choice --> Runtime[Agent Runtime]
Choice --> CloudRun[Cloud Run]
Choice --> GKE[Google Kubernetes Engine]`,
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function AdkBestPracticesPage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        <nav className={styles.sidebar} id="adkSideNav">
          <button className={styles.mobileToggle} id="adkNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <p className={styles.navTitle}>目次</p>
          <ul className={styles.navList} id="adkNavList">
            <li>
              <a href="#overview" className={styles.tocLink}>
                1. ADKとは何か
              </a>
            </li>
            <li>
              <a href="#architecture" className={styles.tocLink}>
                2. アーキテクチャ全体像
              </a>
            </li>
            <li>
              <a href="#setup" className={styles.tocLink}>
                3. 環境セットアップ
              </a>
            </li>
            <li>
              <a href="#agent-basics" className={styles.tocLink}>
                4. エージェント設計の基本
              </a>
            </li>
            <li>
              <a href="#multi-agent" className={styles.tocLink}>
                5. マルチエージェント設計
              </a>
            </li>
            <li>
              <a href="#tools" className={styles.tocLink}>
                6. ツール設計
              </a>
            </li>
            <li>
              <a href="#session-state-memory" className={styles.tocLink}>
                7. セッション・状態・メモリ
              </a>
            </li>
            <li>
              <a href="#context-engineering" className={styles.tocLink}>
                8. コンテキストエンジニアリング
              </a>
            </li>
            <li>
              <a href="#callbacks-plugins" className={styles.tocLink}>
                9. コールバックとプラグイン
              </a>
            </li>
            <li>
              <a href="#evaluation" className={styles.tocLink}>
                10. エージェントの評価
              </a>
            </li>
            <li>
              <a href="#observability" className={styles.tocLink}>
                11. 可観測性
              </a>
            </li>
            <li>
              <a href="#a2a" className={styles.tocLink}>
                12. A2Aプロトコル
              </a>
            </li>
            <li>
              <a href="#deployment" className={styles.tocLink}>
                13. デプロイ戦略
              </a>
            </li>
            <li>
              <a href="#checklist" className={styles.tocLink}>
                14. 運用チェックリスト
              </a>
            </li>
            <li>
              <a href="#references" className={styles.tocLink}>
                15. 参考文献
              </a>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          <div className={styles.hero}>
            <h1>Google Agent Development Kit 実践ガイド</h1>
            <p className={styles.subtitle}>
              中級者・上級者向け ステップバイステップ ベストプラクティス
            </p>
            <div className={styles.meta}>
              <span className={styles.pill}>
                <i className="ti ti-user-check" />
                対象: マルチエージェント設計の実務者
              </span>
              <span className={styles.pill}>
                <i className="ti ti-calendar" />
                2026年7月時点の公式情報に基づく
              </span>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className="ti ti-alert-triangle" />
            <div className={styles.calloutBody}>
              <strong>更新情報。</strong>
              ADKは非常に速いペースで進化しています。押さえておくべき最新の変化は次のとおりです。
              <ul>
                <li>
                  公式ドキュメントは <code>google.github.io/adk-docs</code> から{" "}
                  <strong>adk.dev</strong> に統合された。
                </li>
                <li>
                  Vertex AI Agent Engineは、Google Cloudの新しい{" "}
                  <strong>Gemini Enterprise Agent Platform</strong> における{" "}
                  <strong>Agent Runtime</strong> に統合された。本ガイドでは新名称で統一する。
                </li>
                <li>
                  ADK
                  2.0以降、固定ワークフローに加え単一エージェントが動的にコーディネーター役を担う{" "}
                  <strong>Collaborative workflows</strong> が追加された。
                </li>
                <li>
                  Context CachingとContext Compactionが <code>App</code>{" "}
                  レベルの正式機能として提供され、長時間セッションの最適化が標準化された。
                </li>
                <li>
                  ADKはPython、Java、Go、Kotlin、TypeScriptで同等のAPIを提供するマルチ言語フレームワークになっている。
                </li>
              </ul>
            </div>
          </div>

          <section className={`${styles.adkSection} adkSection`} id="overview">
            <h2>
              <i className="ti ti-info-circle" />
              1. ADKとは何か - 全体像
            </h2>
            <p>
              Agent Development
              Kit（ADK）は、Googleが開発しているオープンソースのコードファーストなエージェント開発フレームワークです。単純な単一ツール利用のアシスタントから、複数の専門エージェントが協調して動く企業レベルのワークフローまで、同じプログラミングモデルの上で段階的に複雑さを積み上げていけるように設計されています。
            </p>
            <p>ADKの中核にある価値提案は次の3点に集約されます。</p>
            <ul>
              <li>
                <strong>コードファースト。</strong>
                エージェントの振る舞い、ツール、オーケストレーションロジックをすべてコードとして定義でき、バージョン管理・テスト・レビューといった通常のソフトウェア工学のプラクティスをそのまま適用できる。
              </li>
              <li>
                <strong>モデル非依存かつGemini最適化。</strong>
                LiteLLM経由で様々なモデルプロバイダーを利用できる一方、Geminiモデルとネイティブに統合されており、Context
                Cachingなどの機能を最大限活用できる。
              </li>
              <li>
                <strong>マルチエージェントをネイティブサポート。</strong>
                単一のエージェントを組み立てるAPIと、複数のエージェントを階層化・連携させるAPIが同じ抽象化の上に統一されている。
              </li>
            </ul>
            <p>
              本ガイドは単体エージェントの作り方ではなく、
              <strong>中級者から上級者が本番運用を見据えて意思決定すべきポイント</strong>
              （マルチエージェント設計、状態管理、コンテキスト最適化、ガードレール、評価、可観測性、デプロイ）を中心に解説します。
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="architecture">
            <h2>
              <i className="ti ti-topology-star" />
              2. アーキテクチャの全体像
            </h2>
            <p>
              ADKアプリケーションは、次の主要コンポーネントの組み合わせとして構成されます。
              <code>Runner</code>が中心となり、Session Service、Memory Service、Artifact
              Service、エージェント本体、モデル、ツールをつなぎ合わせます。
            </p>
            <div className={styles.diagram} id="d1">
              <MermaidDiagram chart={DIAGRAMS.d1} theme="dark" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コンポーネント</th>
                    <th>役割</th>
                    <th>主な実装選択肢</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Runner</strong>
                    </td>
                    <td>
                      1回の呼び出しのライフサイクル全体を統括し、EventをSession Serviceに永続化する
                    </td>
                    <td>Runner（同期・非同期実行）</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Session Service</strong>
                    </td>
                    <td>会話単位のイベント履歴とstateを管理する</td>
                    <td>InMemory / Database / Agent Runtime管理型</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Memory Service</strong>
                    </td>
                    <td>セッションをまたいだ長期知識を検索可能な形で保持する</td>
                    <td>InMemory / RAGベース（Vertex AI RAG、Memory Bank）</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Agent</strong>
                    </td>
                    <td>推論・ツール呼び出し・委譲を行う中心的な単位</td>
                    <td>
                      LlmAgent / SequentialAgent / ParallelAgent / LoopAgent / カスタムBaseAgent
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Tools</strong>
                    </td>
                    <td>エージェントが外部世界とやり取りする手段</td>
                    <td>Function Tool / MCP Tool / OpenAPI Tool / AgentTool</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Callbacks・Plugins</strong>
                    </td>
                    <td>実行ライフサイクルへのフック</td>
                    <td>エージェント単位のCallback / Runner単位のPlugin</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「About」および「Sessions」{" "}
              <Ext href="https://adk.dev/get-started/about/">adk.dev/get-started/about</Ext> /{" "}
              <Ext href="https://adk.dev/sessions/">adk.dev/sessions</Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="setup">
            <h2>
              <i className="ti ti-terminal-2" />
              3. ステップ1: 開発環境のセットアップ
            </h2>
            <h3>3.1 インストール</h3>
            <p>Pythonの場合の基本セットアップは次のとおりです。</p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <span className={styles.codeLine}>python3 -m venv .venv</span>
                  <span className={styles.codeLine}>source .venv/bin/activate</span>
                  <span className={styles.codeLine}>
                    pip install <span className={styles.cs}>google-adk python-dotenv</span>
                  </span>
                  <span className={styles.codeLine}>
                    export <span className={styles.cv}>GOOGLE_API_KEY</span>=
                    <span className={styles.cs}>"your_api_key_here"</span>
                  </span>
                </code>
              </pre>
            </div>
            <p>
              Java、Go、Kotlin、TypeScriptでも同等のSDKが提供されており、LlmAgentやSessionServiceなどの主要概念は言語間で一貫した設計になっています。チーム内で複数言語を使い分ける場合でも、アーキテクチャ設計の議論は共通言語で行えます。
            </p>

            <h3>3.2 プロジェクト構成のベストプラクティス</h3>
            <p>
              推奨されるディレクトリ構成は次のとおりです。エージェントをPythonパッケージとして扱うことで、
              <code>adk web</code>や<code>adk run</code>
              などのCLIツールから自動検出させることができます。<code>__init__.py</code>
              ではroot_agentをエクスポートし、agent.pyにApp定義、tools.pyにFunction
              Tool定義、callbacks.pyにCallback定義をそれぞれ分離します。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Project Structure</span>
                <span className={styles.codeLang}>text</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-text">
                  <span className={styles.codeLine}>parent_folder/</span>
                  <span className={styles.codeLine}>├── requirements.txt</span>
                  <span className={styles.codeLine}>└── my_agent/</span>
                  <span className={styles.codeLine}> ├── __init__.py</span>
                  <span className={styles.codeLine}> ├── agent.py</span>
                  <span className={styles.codeLine}> ├── tools.py</span>
                  <span className={styles.codeLine}> ├── callbacks.py</span>
                  <span className={styles.codeLine}> └── .env</span>
                </code>
              </pre>
            </div>

            <h3>3.3 開発ループのベストプラクティス</h3>
            <ul>
              <li>
                ローカル開発では<code>adk web</code>を使い、インタラクティブなWeb
                UIでエージェントを試しながらセッションとトレースを確認する。
              </li>
              <li>
                ロジックが固まったら<code>.test.json</code>形式のゴールデンケースを作成し、
                <code>adk eval</code>で自動回帰テスト化する（詳細はステップ8）。
              </li>
              <li>
                Pluginを使う場合は、Web UIではPluginが適用されない点に注意し、<code>adk run</code>
                または<code>adk api_server</code>で最終確認を行う。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Deploying Your Agent」{" "}
              <Ext href="https://adk.dev/deploy/">adk.dev/deploy</Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="agent-basics">
            <h2>
              <i className="ti ti-robot" />
              4. ステップ2: エージェント設計の基本
            </h2>
            <p>
              <code>LlmAgent</code>
              はADKの最も基本的な構成単位で、モデル・指示（instruction）・ツール・サブエージェントを組み合わせて定義します。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>agent.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.agents{" "}
                    <span className={styles.ck}>import</span> Agent
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>def</span>{" "}
                    <span className={styles.ch}>get_weather</span>
                    (city: str) -&gt; dict:
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>return</span> &#123;
                    <span className={styles.cs}>"status"</span>:{" "}
                    <span className={styles.cs}>"success"</span>,{" "}
                    <span className={styles.cs}>"report"</span>:{" "}
                    <span className={styles.cs}>"晴れ、25度"</span>&#125;
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>root_agent = Agent(</span>
                  <span className={styles.codeLine}>
                    {"    "}name=<span className={styles.cs}>"weather_agent"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}model=<span className={styles.cs}>"gemini-flash-latest"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}description=
                    <span className={styles.cs}>"指定された都市の天気情報を返すエージェント"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}instruction=
                    <span className={styles.cs}>
                      "ユーザーが指定した都市の天気を get_weather
                      ツールで取得し、簡潔な日本語で回答してください。"
                    </span>
                    ,
                  </span>
                  <span className={styles.codeLine}>{"    "}tools=[get_weather],</span>
                  <span className={styles.codeLine}>)</span>
                </code>
              </pre>
            </div>
            <h3>設計時のベストプラクティス</h3>
            <ul>
              <li>
                <strong>descriptionは正直かつ具体的に書く。</strong>
                マルチエージェント構成では、コーディネーターがこの説明だけを頼りに委譲先を選ぶため、曖昧な記述は誤ルーティングの原因になる。
              </li>
              <li>
                <strong>instructionとstatic_instructionを使い分ける。</strong>
                セッションを通じて変化しない指示はstatic_instructionに分離すると、Context
                Cachingのキャッシュヒット率が向上する。
              </li>
              <li>
                <strong>ツールは単一責任にする。</strong>
                1つのツールに複数の意味を持たせず、モデルが引数だけで意図を判断できる粒度に保つ。
              </li>
              <li>
                <strong>エージェント名は一意かつ説明的にする。</strong>
                トレースやログでの識別性が大きく向上する。
              </li>
            </ul>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="multi-agent">
            <h2>
              <i className="ti ti-affiliate" />
              5. ステップ3: マルチエージェントシステム設計
            </h2>
            <p>
              単一エージェントが対応できる範囲を超えたら、複数の専門エージェントに責務を分割します。ここがADKの最大の強みであり、設計判断が本番品質を左右する部分です。
            </p>

            <h3>5.1 エージェント階層とワークフローエージェント</h3>
            <p>ADKは3種類のワークフローエージェントを標準提供しています。</p>
            <div className={styles.diagram} id="d2">
              <MermaidDiagram chart={DIAGRAMS.d2} theme="dark" />
            </div>
            <div className={styles.diagram} id="d3">
              <MermaidDiagram chart={DIAGRAMS.d3} theme="dark" />
            </div>
            <div className={styles.diagram} id="d4">
              <MermaidDiagram chart={DIAGRAMS.d4} theme="dark" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ワークフローエージェント</th>
                    <th>用途</th>
                    <th>例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>SequentialAgent</strong>
                    </td>
                    <td>前段の出力を次段の入力とする多段パイプライン</td>
                    <td>データ取得 → クレンジング → 分析 → レポート生成</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ParallelAgent</strong>
                    </td>
                    <td>独立したタスクを同時実行しレイテンシを削減する</td>
                    <td>複数APIへの同時問い合わせ、複数視点でのレビュー</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>LoopAgent</strong>
                    </td>
                    <td>終了条件を満たすまでサブエージェントを繰り返す</td>
                    <td>GeneratorとCriticによる反復的な品質改善</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Workflow Agents」「Workflow Patterns」{" "}
              <Ext href="https://adk.dev/workflows/patterns/">adk.dev/workflows/patterns</Ext> /{" "}
              <Ext href="https://adk.dev/workflows/">adk.dev/workflows</Ext>
            </p>
            <p>
              ADK
              2.0では、これらの固定構造に加えて、単一のLLMエージェントが実行時に動的にサブエージェントを選ぶCollaborative
              workflows（コーディネーターパターンの発展形）も利用できます。
            </p>

            <h3>5.2 代表的なマルチエージェント設計パターン</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>パターン名</th>
                    <th>概要</th>
                    <th>適したユースケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Coordinator / Dispatcher</strong>
                    </td>
                    <td>
                      中央のLLMエージェントが意図を解釈し、専門サブエージェントにリクエストを振り分ける
                    </td>
                    <td>カスタマーサポートの一次受付、意図分類</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Sequential Pipeline</strong>
                    </td>
                    <td>決まった順序で処理を渡す組み立てライン型</td>
                    <td>ETL、レポート生成、多段変換処理</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Parallel Fan-out and Gather</strong>
                    </td>
                    <td>独立したサブタスクを並列実行し最後に集約する</td>
                    <td>複数ソースからの情報収集、コードレビューの多角評価</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Hierarchical Task Decomposition</strong>
                    </td>
                    <td>大きなタスクを段階的にサブタスクへ分解し、階層的に処理する</td>
                    <td>複雑なプロジェクト計画、リサーチタスク</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Generator and Critic</strong>
                    </td>
                    <td>生成担当と評価担当を分離し、LoopAgentで反復精緻化する</td>
                    <td>文章作成、コード生成の品質改善</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Human-in-the-loop</strong>
                    </td>
                    <td>重要な意思決定の前に人間の承認を挟む</td>
                    <td>金融取引、医療関連の提案、破壊的な操作</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: Google Developers Blog「Developer's guide to multi-agent patterns in ADK」{" "}
              <Ext href="https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/">
                developers.googleblog.com
              </Ext>
            </p>

            <h3>5.3 エージェント間の通信メカニズム</h3>
            <p>
              サブエージェント間でどうやって情報をやり取りするかは、設計の質を大きく左右します。ADKには主に3つの通信手段があります。
            </p>
            <div className={styles.diagram} id="d5">
              <MermaidDiagram chart={DIAGRAMS.d5} theme="dark" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>通信手段</th>
                    <th>特徴</th>
                    <th>注意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Shared session state</strong>
                    </td>
                    <td>サブエージェント間で共通のstateを読み書きする共有ホワイトボード方式</td>
                    <td>キーの命名規則を統一し、責務の重複を避ける</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>LLM-Driven Delegation</strong>
                    </td>
                    <td>コーディネーターが会話の制御そのものをサブエージェントへ渡す</td>
                    <td>
                      一度移譲すると親エージェントは会話から外れ、複数ステップにまたがるタスクでは文脈が失われやすい
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Explicit Invocation（AgentTool）</strong>
                    </td>
                    <td>
                      サブエージェントをツールとしてラップし、親エージェントが結果を受け取ってから次の判断をする
                    </td>
                    <td>親が「プロジェクトマネージャー」として全体を把握し続けられる</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              単純な意図振り分けだけならAgentTransferで十分ですが、複数の専門エージェントの結果を組み合わせて最終回答を作る必要がある場合は、サブエージェントをツール化するAgentToolパターンの方が文脈の一貫性を保ちやすいことが実務で確認されています。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: Google Cloud Blog「Build multi-agentic systems using Google ADK」{" "}
              <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/build-multi-agentic-systems-using-google-adk">
                cloud.google.com/blog
              </Ext>
            </p>

            <h3>5.4 設計チェックリスト</h3>
            <ul>
              <li>
                サブエージェントのdescriptionは、コーディネーターが誤りなくルーティングできるレベルまで具体的に書く。
              </li>
              <li>
                状態を共有する場合は、キーに app: user: temp:
                などの適切なプレフィックスを付け、スコープを明示する。
              </li>
              <li>
                単純な線形処理はまずSequentialAgentで実装し、本当に並列化が必要な箇所だけParallelAgentへ切り出す。
              </li>
              <li>
                反復精緻化が必要な箇所にのみLoopAgentを使い、最大イテレーション数を必ず設定する。
              </li>
            </ul>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="tools">
            <h2>
              <i className="ti ti-tool" />
              6. ステップ4: ツール設計のベストプラクティス
            </h2>

            <h3>6.1 Function Tools</h3>
            <p>
              最も基本的なツール形式で、Pythonの関数をそのままツールとして公開します。型ヒントとdocstringを必ず明記してください。モデルはこれらを読んでツールの使い方を推論するため、曖昧な記述は誤った引数生成につながります。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>tools.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>def</span>{" "}
                    <span className={styles.ch}>get_weather</span>
                    (city: str) -&gt; dict:
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className={styles.cc}>
                      """指定した都市の現在の天気情報を取得する。"""
                    </span>
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>return</span> &#123;
                    <span className={styles.cs}>"status"</span>:{" "}
                    <span className={styles.cs}>"success"</span>,{" "}
                    <span className={styles.cs}>"report"</span>:{" "}
                    <span className={styles.cs}>"晴れ、25度"</span>&#125;
                  </span>
                </code>
              </pre>
            </div>
            <ul>
              <li>
                戻り値は構造化された辞書（statusキーを含める等）にし、エラー時とのフォーマットを統一する。
              </li>
              <li>
                副作用のある操作（送金、削除など）は、before_tool_callbackによるガードレールとセットで設計する。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Function tools」{" "}
              <Ext href="https://adk.dev/tools-custom/function-tools/">
                adk.dev/tools-custom/function-tools
              </Ext>
            </p>

            <h3>6.2 MCP Tools（Model Context Protocol）</h3>
            <p>
              MCPは「エージェントとツール」を接続するためのオープンプロトコルです。ADKはMCPクライアントを内蔵しており、既存のMCPサーバー（ファイルシステム、データベース、SaaSなど）をそのままツールとして取り込めます。
            </p>
            <div className={styles.diagram} id="d6">
              <MermaidDiagram chart={DIAGRAMS.d6} theme="dark" />
            </div>
            <ul>
              <li>
                サードパーティのMCPサーバーを組み込む際は、ツールの権限範囲を最小化し、破壊的な操作を行うツールにはコールバックによる追加検証を挟む。
              </li>
              <li>
                MCPサーバー側のスキーマ変更に追従できるよう、ツール一覧はハードコードせず起動時に動的取得する構成を検討する。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「MCP tools」{" "}
              <Ext href="https://adk.dev/tools-custom/mcp-tools/">
                adk.dev/tools-custom/mcp-tools
              </Ext>
            </p>

            <h3>6.3 OpenAPI Tools</h3>
            <p>
              既存のREST
              APIがOpenAPI仕様（Swagger）を持っている場合、ADKはその仕様からツール群を自動生成できます。手作業でラッパー関数を書く必要がなく、大規模な社内APIをまとめてエージェントに公開する際に有効です。
            </p>

            <h3>6.4 Agent as a Tool（AgentTool）</h3>
            <p>
              サブエージェントをツールとしてラップすることで、親エージェントが結果受け取り最終判断を下せるようになります。マイクロサービス的にエージェントを部品化する上で重要なパターンです。
            </p>

            <h3>6.5 In-Tool Guardrails（ツール内ガードレール）</h3>
            <p>
              ツールは「モデルが設定する引数」と「開発者が決定論的に設定するTool
              Context」という2種類の入力を受け取ります。この性質を利用し、ツール自身に安全策を組み込む設計が推奨されます。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>tools.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>def</span>{" "}
                    <span className={styles.ch}>query_database</span>
                    (sql_query: str, tool_context) -&gt; dict:
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}allowed_tables = tool_context.state.get(
                    <span className={styles.cs}>"policy:allowed_tables"</span>, [])
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>if</span> <span className={styles.ck}>not</span>{" "}
                    is_query_within_allowed_tables(sql_query, allowed_tables):
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}
                    <span className={styles.ck}>return</span> &#123;
                    <span className={styles.cs}>"status"</span>:{" "}
                    <span className={styles.cs}>"error"</span>,{" "}
                    <span className={styles.cs}>"message"</span>:{" "}
                    <span className={styles.cs}>"許可されていないテーブルへのアクセスです"</span>
                    &#125;
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>return</span> run_query(sql_query)
                  </span>
                </code>
              </pre>
            </div>
            <p>
              こうすることで、モデルの出力が想定外であっても、ツール自体が決定論的なポリシーを強制できます。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Safety and Security for AI Agents」{" "}
              <Ext href="https://adk.dev/safety/">adk.dev/safety</Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="session-state-memory">
            <h2>
              <i className="ti ti-database" />
              7. ステップ5: セッション・状態・メモリ管理
            </h2>

            <h3>7.1 Session、State、Memoryの関係</h3>
            <div className={styles.diagram} id="d7">
              <MermaidDiagram chart={DIAGRAMS.d7} theme="dark" />
            </div>
            <ul>
              <li>
                <strong>Session。</strong>1つの会話スレッドを表し、イベント履歴とstateを持つ。
              </li>
              <li>
                <strong>State。</strong>会話の間だけ有効な作業用のスクラッチパッド。
              </li>
              <li>
                <strong>Memory。</strong>
                セッションをまたいで保持される長期的な知識ストア。多くの場合RAG（埋め込みベースの検索）で実装される。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Conversational Context: Session, State, and Memory」{" "}
              <Ext href="https://adk.dev/sessions/">adk.dev/sessions</Ext>
            </p>

            <h3>7.2 Stateのプレフィックス設計</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>プレフィックス</th>
                    <th>スコープ</th>
                    <th>用途の例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>なし</strong>
                    </td>
                    <td>現在のセッションのみ</td>
                    <td>現在の会話でのみ使う一時的なフラグ</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>user:</strong>
                    </td>
                    <td>同一ユーザーの全セッション</td>
                    <td>ユーザーの言語設定、好み</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>app:</strong>
                    </td>
                    <td>アプリケーション全体</td>
                    <td>全ユーザー共通の設定値</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>temp:</strong>
                    </td>
                    <td>現在のターンのみ、永続化されない</td>
                    <td>中間計算結果</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              stateの更新は、output_key、EventActions.state_delta、CallbackContextまたはToolContextのstateプロパティ経由に限定し、SessionServiceから直接取得したセッションオブジェクトのstateを書き換えないでください。これにより変更履歴の追跡性と永続化の一貫性が保証されます。値は文字列・数値・真偽値・単純なリストや辞書など、シリアライズ可能な基本型に限定し、複雑なオブジェクトのインスタンスを直接保存しないこと。キーは最小限にし、深いネスト構造を避けてください。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「State」{" "}
              <Ext href="https://adk.dev/sessions/state/">adk.dev/sessions/state</Ext>
            </p>

            <h3>7.3 SessionServiceの実装比較</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>実装</th>
                    <th>永続性</th>
                    <th>適した用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>InMemorySessionService</strong>
                    </td>
                    <td>なし（再起動で消失）</td>
                    <td>ローカル開発・プロトタイピング</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>DatabaseSessionService</strong>
                    </td>
                    <td>あり（PostgreSQL / MySQL / SQLite等）</td>
                    <td>自前インフラでの永続化、既存DB資産の活用</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Agent Runtime管理型</strong>
                    </td>
                    <td>あり</td>
                    <td>Google Cloud上でのスケーラブルな本番運用</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              開発初期はInMemoryで素早くイテレーションし、本番投入前に必ずターゲットのデータベースで負荷テストを行ってください。SQLiteとPostgreSQLではJSON列の扱いなど微妙な挙動差があるため注意が必要です。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメントおよびコミュニティ記事「Google ADK Session and State
              Management」{" "}
              <Ext href="https://adk.dev/sessions/session/">adk.dev/sessions/session</Ext>
            </p>

            <h3>7.4 Memory Service（長期記憶）</h3>
            <p>
              RAGベースのMemory
              Serviceを使うと、過去の会話から抽出した情報を埋め込みベクトルとして保存し、類似度検索で関連情報を呼び出せます。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>memory.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.memory{" "}
                    <span className={styles.ck}>import</span> VertexAiMemoryBankService
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>
                    memory_service = VertexAiMemoryBankService(
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}project=<span className={styles.cs}>"PROJECT_ID"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}location=<span className={styles.cs}>"LOCATION"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}agent_engine_id=<span className={styles.cs}>"AGENT_ENGINE_ID"</span>,
                  </span>
                  <span className={styles.codeLine}>)</span>
                </code>
              </pre>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              すべての情報を長期記憶に入れず、次回以降の会話でも価値がある情報（好み、過去の実績、繰り返し発生する課題など）に絞って書き込む設計にしてください。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: Google Cloud Blog「Remember this: Agent state and memory with ADK」{" "}
              <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/remember-this-agent-state-and-memory-with-adk">
                cloud.google.com/blog
              </Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="context-engineering">
            <h2>
              <i className="ti ti-brain" />
              8. ステップ6: コンテキストエンジニアリング
            </h2>
            <p>
              長時間のセッションでは、会話履歴をそのまま毎回モデルへ送信するとレイテンシとコストが増大します。ADKはこれを解決する2つの機能をAppレベルで提供しています。
            </p>
            <div className={styles.diagram} id="d8">
              <MermaidDiagram chart={DIAGRAMS.d8} theme="dark" />
            </div>

            <h3>8.1 Context Caching</h3>
            <p>
              静的な指示や大きなRAGコンテキストなど、繰り返し送信される内容をキャッシュし、モデルへの再送信コストを削減します。min_tokensでキャッシュ発動の最小トークン数、ttl_secondsでキャッシュの有効期限、cache_intervalsで再利用可能な最大回数を設定します。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>app.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.agents{" "}
                    <span className={styles.ck}>import</span> Agent
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.apps.app{" "}
                    <span className={styles.ck}>import</span> App
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.agents.context_cache_config{" "}
                    <span className={styles.ck}>import</span> ContextCacheConfig
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>
                    root_agent = Agent(name=<span className={styles.cs}>"my_agent"</span>, model=
                    <span className={styles.cs}>"gemini-flash-latest"</span>)
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>app = App(</span>
                  <span className={styles.codeLine}>
                    {"    "}name=<span className={styles.cs}>"my-caching-agent-app"</span>,
                  </span>
                  <span className={styles.codeLine}>{"    "}root_agent=root_agent,</span>
                  <span className={styles.codeLine}>
                    {"    "}context_cache_config=ContextCacheConfig(
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}min_tokens=<span className={styles.cv}>2048</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}ttl_seconds=<span className={styles.cv}>600</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}cache_intervals=<span className={styles.cv}>5</span>,
                  </span>
                  <span className={styles.codeLine}>{"    "}),</span>
                  <span className={styles.codeLine}>)</span>
                </code>
              </pre>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              変化しないシステム指示はstatic_instructionとして分離し、キャッシュ対象のプレフィックスを安定させることで、キャッシュヒット率を最大化してください。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Context caching」{" "}
              <Ext href="https://adk.dev/context/caching/">adk.dev/context/caching</Ext>
            </p>

            <h3>8.2 Context Compaction（コンテキスト圧縮）</h3>
            <p>
              古い会話イベントを要約し、直近のやり取りだけを生の形式で保持するスライディングウィンドウ方式です。イベント数ベースとトークン数ベースの2種類の設定があります。token_thresholdでこのトークン数を超えたら圧縮を発動し、event_retention_sizeで直近何件のイベントを生のまま残すかを指定します。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>app.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.apps.app{" "}
                    <span className={styles.ck}>import</span> App, EventsCompactionConfig
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.agents{" "}
                    <span className={styles.ck}>import</span> Agent
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>
                    root_agent = Agent(name=<span className={styles.cs}>"my_root_agent"</span>)
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>
                    compaction_config = EventsCompactionConfig(
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}token_threshold=<span className={styles.cv}>4000</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}event_retention_size=<span className={styles.cv}>5</span>,
                  </span>
                  <span className={styles.codeLine}>)</span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>app = App(</span>
                  <span className={styles.codeLine}>
                    {"    "}name=<span className={styles.cs}>"my_compacting_agent_app"</span>,
                  </span>
                  <span className={styles.codeLine}>{"    "}root_agent=root_agent,</span>
                  <span className={styles.codeLine}>
                    {"    "}events_compaction_config=compaction_config,
                  </span>
                  <span className={styles.codeLine}>)</span>
                </code>
              </pre>
            </div>
            <h3>8.3 ベストプラクティスまとめ</h3>
            <ul>
              <li>
                Compactionは非ブロッキングで、ターン終了後にバックグラウンドで実行される。マルチエージェント構成でも、Sessionを共有するサブエージェント群全体に対して機能する。
              </li>
              <li>
                直近の会話の代名詞解決（それ、あれ、など）に支障が出ないよう、event_retention_sizeは文脈が破綻しない程度の余裕を持たせる。
              </li>
              <li>
                2026年時点でContext
                Cachingは主にGeminiモデルでのみサポートされている点に留意する（LiteLLM経由の他社モデルは未対応）。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Context compression」およびGitHub Discussions{" "}
              <Ext href="https://adk.dev/context/compaction/">adk.dev/context/compaction</Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="callbacks-plugins">
            <h2>
              <i className="ti ti-shield-check" />
              9. ステップ7: コールバックとプラグインによる制御
            </h2>

            <h3>9.1 コールバックの種類</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コールバック</th>
                    <th>発火タイミング</th>
                    <th>主な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>before / after_agent_callback</strong>
                    </td>
                    <td>エージェントのメインロジックの前後</td>
                    <td>アクセス制御、簡易リクエストの即時応答</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>before / after_model_callback</strong>
                    </td>
                    <td>LLM呼び出しの前後</td>
                    <td>
                      入力ガードレール、プロンプト検閲、キャッシュ利用、出力のPIIフィルタリング
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>before / after_tool_callback</strong>
                    </td>
                    <td>ツール実行の前後</td>
                    <td>引数検証、レート制限、結果の後処理、ロギング</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              before_*系のコールバックが値を返すと、通常の処理（LLM呼び出しやツール実行）はスキップされ、その返り値がそのまま結果として扱われます。Noneを返した場合は通常どおり処理が継続します。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Types of callbacks」「Callback patterns」{" "}
              <Ext href="https://adk.dev/callbacks/types-of-callbacks/">
                adk.dev/callbacks/types-of-callbacks
              </Ext>
            </p>

            <h3>9.2 代表的なコールバック設計パターン</h3>
            <div className={styles.diagram} id="d9">
              <MermaidDiagram chart={DIAGRAMS.d9} theme="dark" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>パターン</th>
                    <th>実装コールバック</th>
                    <th>目的</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>ガードレールとポリシー適用</strong>
                    </td>
                    <td>before_model_callback / before_tool_callback</td>
                    <td>禁止トピックや不正な引数をLLM呼び出し前に遮断する</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>動的な状態管理</strong>
                    </td>
                    <td>各種callbackからcontext.stateを読み書き</td>
                    <td>ユーザーの契約プランに応じて挙動を変える</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ロギングと可観測性</strong>
                    </td>
                    <td>after_tool_callback / after_model_callback</td>
                    <td>ツールの引数と結果を構造化ログとして記録する</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>キャッシング</strong>
                    </td>
                    <td>before_model_callback / before_tool_callback</td>
                    <td>過去と同じ入力ならキャッシュ結果を返しLLM呼び出しを省略する</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Callback design patterns and best practices」{" "}
              <Ext href="https://google.github.io/adk-docs/callbacks/design-patterns-and-best-practices/">
                google.github.io/adk-docs
              </Ext>
            </p>

            <h3>9.3 Callback と Plugin の使い分け</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>Callback</th>
                    <th>Plugin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>適用範囲</strong>
                    </td>
                    <td>特定の1つのエージェントやツールに紐づくローカルな設定</td>
                    <td>
                      Runnerに一度登録すると配下の全エージェント・全ツール・全LLM呼び出しに適用されるグローバルな設定
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>向いている用途</strong>
                    </td>
                    <td>特定エージェント固有の振る舞い調整</td>
                    <td>全社共通のロギング、セキュリティポリシー、監視指標の収集</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>実行順序</strong>
                    </td>
                    <td>Plugin側のコールバックの後に実行される</td>
                    <td>
                      Agent・Model・Toolレベルのコールバックより先に実行され、値を返すと後続をスキップする
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ADK Web UI</strong>
                    </td>
                    <td>利用可能</td>
                    <td>利用不可。adk runやadk api_server経由で確認する必要がある</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              「同じロギングロジックを3つのエージェントにコピーしている」と感じたら、それはPluginへ昇格すべきサインです。逆に、1つの実験的エージェントだけに必要な特殊な挙動はCallbackのままにしておく方が見通しが良くなります。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Plugins」およびGoogle Cloudコミュニティ記事「Master ADK
              Callbacks: DOs and DON'Ts」 <Ext href="https://adk.dev/plugins/">adk.dev/plugins</Ext>
            </p>

            <h3>9.4 セキュリティとガードレールのベストプラクティス</h3>
            <ul>
              <li>
                <strong>多層防御。</strong>
                In-Tool
                Guardrails、Callbackによるモデル呼び出し前後の検証、Gemini自体の組み込み安全機能を組み合わせる。
              </li>
              <li>
                <strong>安価なモデルによる追加チェック。</strong>
                高速で安価なモデル（例: Gemini Flash
                Lite）をコールバック内で呼び出し、入出力の安全性を追加でスクリーニングする構成が有効。
              </li>
              <li>
                <strong>サンドボックス化。</strong>
                モデルが生成したコードを実行する場合は、必ず隔離された実行環境で行う。
              </li>
              <li>
                <strong>出力のエスケープ。</strong>
                エージェントの出力をブラウザで表示する場合、HTMLやJavaScriptとして解釈されないよう適切にエスケープする。
              </li>
              <li>
                <strong>内部プロンプトの非開示。</strong>
                説明可能性のために意思決定根拠を示すことは有用だが、システムプロンプトそのものはエンドユーザーに露出しない。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Safety and Security for AI Agents」{" "}
              <Ext href="https://adk.dev/safety/">adk.dev/safety</Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="evaluation">
            <h2>
              <i className="ti ti-checklist" />
              10. ステップ8: エージェントの評価（Evaluation）
            </h2>
            <p>
              LLMエージェントは非決定論的であるため、従来の完全一致によるテストだけでは不十分です。ADKはTrajectory（実行経路）とResponse（最終応答）の両方を評価する仕組みを提供します。
            </p>
            <div className={styles.diagram} id="d10">
              <MermaidDiagram chart={DIAGRAMS.d10} theme="dark" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>評価軸</th>
                    <th>何を検証するか</th>
                    <th>使いどころ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Trajectory Evaluation</strong>
                    </td>
                    <td>正しい順序で正しいツールを呼び出しているか</td>
                    <td>「残高照会の前に必ず認証する」といった業務ルールの遵守確認</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Response Evaluation</strong>
                    </td>
                    <td>最終応答の言語的な品質と正確性</td>
                    <td>丁寧さ、正確性、期待する参照回答との類似度</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>10.1 評価ケースの作り方</h3>
            <ol>
              <li>
                <code>adk web</code>でエージェントと対話し、期待どおりに動くゴールデンパスを作る。
              </li>
              <li>Web UIのEvalタブから現在のセッションを新しい評価ケースとして保存する。</li>
              <li>
                生成された <code>.test.json</code>{" "}
                を編集し、期待する中間ツール呼び出しと期待する最終応答を明確化する。
              </li>
              <li>
                <code>adk eval</code>{" "}
                コマンド、またはCIパイプライン内でAgentEvaluator.evaluate()を呼び出し自動化する。
              </li>
            </ol>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>test_eval.py</span>
                <span className={styles.codeLang}>python</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-python">
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>import</span> pytest
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>from</span> google.adk.evaluation.agent_evaluator{" "}
                    <span className={styles.ck}>import</span> AgentEvaluator
                  </span>
                  <span className={styles.codeLine} />
                  <span className={styles.codeLine}>@pytest.mark.asyncio</span>
                  <span className={styles.codeLine}>
                    <span className={styles.ck}>async</span> <span className={styles.ck}>def</span>{" "}
                    <span className={styles.ch}>test_customer_service_agent_evaluation</span>():
                  </span>
                  <span className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>await</span> AgentEvaluator.evaluate(
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}agent_module=
                    <span className={styles.cs}>"customer_service_agent"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}agent_name=<span className={styles.cs}>"root_agent"</span>,
                  </span>
                  <span className={styles.codeLine}>
                    {"        "}eval_dataset_file_path_or_dir=
                    <span className={styles.cs}>"tests/data"</span>,
                  </span>
                  <span className={styles.codeLine}>{"    "})</span>
                </code>
              </pre>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              Trajectoryの一致判定はEXACT（完全一致）とIN_ORDER（順序だけ保証し他のツール呼び出しの混在を許容）を使い分けます。規制業務や再現性が重要な処理にはEXACT、柔軟性を残したい探索的なタスクにはIN_ORDERが適しています。新しいCallbackやガードレールを追加した際は、必ずadk
              evalをエッジケースのプロンプトに対して実行し、意図せぬ回帰がないか確認してください。CI/CDにはPytest統合を利用し、JUnit
              XML形式のレポートを既存のダッシュボードに接続します。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Why evaluate agents」「Criteria」およびGoogle
              Codelabs「Evaluating Agents with ADK」{" "}
              <Ext href="https://adk.dev/evaluate/">adk.dev/evaluate</Ext> /{" "}
              <Ext href="https://codelabs.developers.google.com/adk-eval/instructions">
                codelabs.developers.google.com
              </Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="observability">
            <h2>
              <i className="ti ti-activity" />
              11. ステップ9: 可観測性（Observability）
            </h2>

            <h3>11.1 ロギング</h3>
            <p>
              ADKは各言語の標準ロギングライブラリ（Pythonならlogging）上に構築されており、アプリケーション側で自由にフォーマットやハンドラを設定できます。Google
              Cloudの構造化ログ形式（トレース相関を含む）に合わせたカスタムフォーマッタを使うと、Cloud
              Loggingとの統合が容易になります。
            </p>

            <h3>11.2 トレーシング（OpenTelemetry）</h3>
            <p>
              ADK
              1.17以降は、OpenTelemetryのGenAI向けセマンティックコンベンションに準拠した組み込みトレース計装を持っています。
            </p>
            <div className={styles.diagram} id="d11">
              <MermaidDiagram chart={DIAGRAMS.d11} theme="dark" />
            </div>
            <ul>
              <li>
                adk webやadk api_server実行時に--otel_to_cloudフラグを付けるだけでCloud
                Traceへ送信できる。
              </li>
              <li>
                標準OTel環境変数を設定すれば、Jaeger、Grafana
                Tempo、Datadogなど任意のOTel互換バックエンドに送信可能。
              </li>
              <li>
                コンテキスト伝播が自動化されており、ツールから呼び出した外部マイクロサービスのスパンも同じトレースに連結される。
              </li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Traces」およびGoogle Cloud Documentation「Instrument ADK
              applications with OpenTelemetry」{" "}
              <Ext href="https://adk.dev/observability/traces/">adk.dev/observability/traces</Ext> /{" "}
              <Ext href="https://docs.cloud.google.com/stackdriver/docs/instrumentation/ai-agent-adk">
                docs.cloud.google.com
              </Ext>
            </p>

            <h3>11.3 サードパーティ観測ツールとの統合</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツール</th>
                    <th>統合方法の概要</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Google Cloud Trace</strong>
                    </td>
                    <td>
                      --otel_to_cloudフラグまたは環境変数で送信、Trace
                      Explorerでウォーターフォール表示
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Langfuse</strong>
                    </td>
                    <td>openinference-instrumentation-google-adkによるOTel計装をLangfuseへ送信</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>MLflow</strong>
                    </td>
                    <td>MLflow 3.6以降のOTLP取り込み機能を利用しADKのスパンを送信</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Arize AX</strong>
                    </td>
                    <td>
                      エージェントの意思決定経路・ツール利用効率・調整品質を評価する専用プラットフォーム
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>SigNoz</strong>
                    </td>
                    <td>トレース・ログ・メトリクスを統合ダッシュボードで可視化</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>ベストプラクティス。</strong>
              単一クラウドで完結する場合はCloud
              Traceで十分ですが、マルチクラウド構成やベンダーニュートラルな分析基盤が必要な場合は、Cloud
              Run上にOTel
              Collectorを立て、複数のバックエンドへ同時にファンアウトする構成が有効です。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: Kablamo Engineering Blog「Tracing AI Agents on Google Cloud with OpenTelemetry
              and Agent Engine」{" "}
              <Ext href="https://engineering.kablamo.com.au/posts/gcp-otel-adk-agent">
                engineering.kablamo.com.au
              </Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="a2a">
            <h2>
              <i className="ti ti-arrows-exchange" />
              12. ステップ10: A2Aプロトコルによるエージェント間連携
            </h2>
            <p>
              同一プロセス内のサブエージェントだけでなく、別サービス・別フレームワーク・別会社が実装したエージェントと連携したい場合、Agent2Agent（A2A）プロトコルを使います。
            </p>
            <div className={styles.diagram} id="d12">
              <MermaidDiagram chart={DIAGRAMS.d12} theme="dark" />
            </div>

            <h3>12.1 MCPとA2Aの違い</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>プロトコル</th>
                    <th>接続対象</th>
                    <th>ひとことで言うと</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>MCP</strong>
                    </td>
                    <td>エージェントとツール・データソース</td>
                    <td>エージェントとツールをつなぐプロトコル</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>A2A</strong>
                    </td>
                    <td>エージェントとエージェント</td>
                    <td>エージェント同士をつなぐプロトコル</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              1つのシステムの中で、あるエージェントがA2Aで別のエージェントにタスクを依頼し、そのエージェントがさらにMCPでデータベースに接続する、という組み合わせも一般的です。
            </p>

            <h3>12.2 ADKにおけるA2Aの実装ステップ</h3>
            <ol>
              <li>
                既存のADKエージェントをA2AServerとして公開する（HTTPサーバーとして待受けさせる）。
              </li>
              <li>
                agent.jsonのようなパスでAgent Card（能力・接続情報を記述したJSON）を公開する。
              </li>
              <li>
                別のエージェント側でRemoteA2aAgentを使い、Agent
                Cardを解決してリモートエージェントをサブエージェントのように扱う。
              </li>
              <li>
                ADKのWeb
                UIで、ローカルエージェントとリモートエージェントの両方が協調して動作することを確認する。
              </li>
            </ol>
            <p>
              <strong>ベストプラクティス。</strong>
              ローカルのサブエージェント（インメモリ、低レイテンシ）と、A2A経由のリモートエージェント（ネットワーク越し、疎結合）は使い分けます。頻繁にやり取りが発生する処理はローカルサブエージェントに、組織間・フレームワーク間をまたぐ連携が必要な処理はA2Aに寄せてください。リモートエージェントが会話コンテキストを保持していない前提で設計し、繰り返し確認を求めてくる場合はクライアント側で必要な文脈を明示的に渡します。
            </p>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Introduction to A2A」およびGoogle Codelabs「Connect to
              Remote Agents with ADK and the Agent2Agent SDK」{" "}
              <Ext href="https://google.github.io/adk-docs/a2a/intro/">
                google.github.io/adk-docs
              </Ext>{" "}
              /{" "}
              <Ext href="https://www.skills.google/focuses/132170?parent=catalog">
                skills.google
              </Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="deployment">
            <h2>
              <i className="ti ti-rocket" />
              13. ステップ11: デプロイ戦略
            </h2>
            <p>
              ADKエージェントは複数の実行環境にデプロイできます。要件に応じて適切な選択を行うことが本番運用の成否を分けます。
            </p>
            <div className={styles.diagram} id="d13">
              <MermaidDiagram chart={DIAGRAMS.d13} theme="dark" />
            </div>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>デプロイ先</th>
                    <th>特徴</th>
                    <th>適したケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Agent Runtime</strong>
                    </td>
                    <td>
                      Google Cloud Agent
                      Platformが提供するエージェント専用のフルマネージド自動スケーリング環境
                    </td>
                    <td>運用負荷を最小化したいエンタープライズ本番運用</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Cloud Run</strong>
                    </td>
                    <td>
                      サーバーレスのコンテナ実行基盤。adk deploy
                      cloud_runコマンドでコンテナビルドからデプロイまで一括実行可能
                    </td>
                    <td>
                      柔軟なネットワーク設定、独自UI、複雑なA2A構成、スケールゼロによるコスト最適化
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>GKE</strong>
                    </td>
                    <td>Kubernetesベースのコンテナオーケストレーション</td>
                    <td>既存のKubernetes運用基盤に統合したい場合、高度なカスタムインフラ要件</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>13.1 Cloud Runへのデプロイ例</h3>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>Terminal</span>
                <span className={styles.codeLang}>bash</span>
              </div>
              <pre className={styles.codeBody}>
                <code className="language-bash">
                  <span className={styles.codeLine}>adk deploy cloud_run \</span>
                  <span className={styles.codeLine}>
                    {"  "}--project=<span className={styles.cs}>YOUR_PROJECT_ID</span> \
                  </span>
                  <span className={styles.codeLine}>
                    {"  "}--region=<span className={styles.cs}>YOUR_REGION</span> \
                  </span>
                  <span className={styles.codeLine}>
                    {"  "}--service_name=<span className={styles.cs}>weather-agent</span> \
                  </span>
                  <span className={styles.codeLine}>{"  "}--with_ui \</span>
                  <span className={styles.codeLine}>{"  "}./my_agent</span>
                </code>
              </pre>
            </div>
            <p>
              デプロイ時に「認証なしの呼び出しを許可するか」を問われますが、公開APIとして提供する場合を除き、認証を必須にする設定を選ぶことが推奨されます。
            </p>

            <h3>13.2 Agent Runtimeへのデプロイ</h3>
            <p>
              標準デプロイパス（Cloud ConsoleとADK CLIによる段階的な手順）と、Agents
              CLIによる加速デプロイパス（CI/CDパイプラインとTerraformによるInfrastructure as
              Codeまで自動生成）の2種類が提供されています。組織のセキュリティ・コンプライアンス基準に照らして、自動生成された設定を必ずレビューすることがベストプラクティスとされています。
            </p>

            <h3>13.3 デプロイ前チェックリスト</h3>
            <ul>
              <li>
                Session
                StateとMemoryの永続化バックエンドを、開発用のInMemoryから本番用に切り替えたか。
              </li>
              <li>
                OpenTelemetryのトレースをCloud
                Traceまたは選択した観測基盤にエクスポートする設定を行ったか。
              </li>
              <li>
                Pluginによるグローバルなガードレール・ロギングが有効化されているか（CLI・API
                Server経由で最終確認したか）。
              </li>
              <li>adk evalによる回帰テストがCI/CDパイプラインに組み込まれているか。</li>
              <li>IAMロールが必要最小限の範囲で付与されているか。</li>
            </ul>
            <p className={styles.source}>
              <i className="ti ti-link" />
              出典: ADK公式ドキュメント「Deploying Your Agent」「Cloud Run」「Deploy to Agent
              Runtime」{" "}
              <Ext href="https://google.github.io/adk-docs/deploy/cloud-run/">
                google.github.io/adk-docs
              </Ext>{" "}
              / <Ext href="https://adk.dev/deploy/agent-runtime/">adk.dev/deploy/agent-runtime</Ext>
            </p>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="checklist">
            <h2>
              <i className="ti ti-list-check" />
              14. 本番運用チェックリスト
            </h2>
            <p>本ガイドで扱ったベストプラクティスを横断的なチェックリストとしてまとめます。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>カテゴリ</th>
                    <th>チェック項目</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>エージェント設計</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      サブエージェントのdescriptionは誤ルーティングが起きないレベルまで具体的か
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>マルチエージェント</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      通信手段を意図的に選択したか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ツール</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      すべての破壊的操作にIn-Tool Guardrailsまたはコールバックによる検証があるか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>状態管理</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      stateの更新をCallbackContext・ToolContext経由に統一しているか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>コンテキスト</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      長時間セッションに対しCaching・Compactionの設定を検討したか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>セキュリティ</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      入力ガードレールと出力フィルタリングを実装したか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>評価</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      TrajectoryとResponseの両方をカバーするテストケースがCIで自動実行されているか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>可観測性</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      OpenTelemetryトレースが本番の観測基盤に届いているか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>連携</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      組織外・フレームワーク外の連携が必要な箇所でA2Aプロトコルを検討したか
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>デプロイ</strong>
                    </td>
                    <td>
                      <i className={`ti ti-square-check ${styles.checklistIcon}`} />
                      環境変数・IAM・セッション永続化先が本番向けに切り替わっているか
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${styles.adkSection} adkSection`} id="references">
            <h2>
              <i className="ti ti-link" />
              15. 参考文献
            </h2>
            <p>
              本ガイドの作成にあたり、以下の一次情報・公式ドキュメント・技術記事を参照しました（2026年7月時点でのアクセス）。
            </p>

            <div className={styles.refsGroup}>
              <h3>公式ドキュメント（adk.dev / Google Cloud）</h3>
              <ul>
                <li>
                  <i className="ti ti-point" />
                  ADK公式トップページ: <Ext href="https://adk.dev/">https://adk.dev/</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Google Cloud Documentation「Agent Development Kit」:{" "}
                  <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk?hl=en">
                    docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  About ADK:{" "}
                  <Ext href="https://adk.dev/get-started/about/">adk.dev/get-started/about</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Workflow Agents:{" "}
                  <Ext href="https://adk.dev/agents/workflow-agents/">
                    adk.dev/agents/workflow-agents
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Workflow Patterns:{" "}
                  <Ext href="https://adk.dev/workflows/patterns/">adk.dev/workflows/patterns</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Workflows overview: <Ext href="https://adk.dev/workflows/">adk.dev/workflows</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Function Tools:{" "}
                  <Ext href="https://adk.dev/tools-custom/function-tools/">
                    adk.dev/tools-custom/function-tools
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  MCP Tools:{" "}
                  <Ext href="https://adk.dev/tools-custom/mcp-tools/">
                    adk.dev/tools-custom/mcp-tools
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Sessions overview: <Ext href="https://adk.dev/sessions/">adk.dev/sessions</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Session:{" "}
                  <Ext href="https://adk.dev/sessions/session/">adk.dev/sessions/session</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  State: <Ext href="https://adk.dev/sessions/state/">adk.dev/sessions/state</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Callback design patterns and best practices:{" "}
                  <Ext href="https://google.github.io/adk-docs/callbacks/design-patterns-and-best-practices/">
                    google.github.io/adk-docs/callbacks
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Types of callbacks:{" "}
                  <Ext href="https://adk.dev/callbacks/types-of-callbacks/">
                    adk.dev/callbacks/types-of-callbacks
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Callbacks overview:{" "}
                  <Ext href="https://google.github.io/adk-docs/callbacks/">
                    google.github.io/adk-docs/callbacks
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Safety and Security for AI Agents:{" "}
                  <Ext href="https://adk.dev/safety/">adk.dev/safety</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Plugins: <Ext href="https://adk.dev/plugins/">adk.dev/plugins</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  App workflow management class:{" "}
                  <Ext href="https://adk.dev/apps/">adk.dev/apps</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Context caching:{" "}
                  <Ext href="https://adk.dev/context/caching/">adk.dev/context/caching</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Context compression:{" "}
                  <Ext href="https://adk.dev/context/compaction/">adk.dev/context/compaction</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Why evaluate agents: <Ext href="https://adk.dev/evaluate/">adk.dev/evaluate</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Criteria:{" "}
                  <Ext href="https://google.github.io/adk-docs/evaluate/criteria/">
                    google.github.io/adk-docs/evaluate/criteria
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Traces:{" "}
                  <Ext href="https://adk.dev/observability/traces/">
                    adk.dev/observability/traces
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Google Cloud Trace observability for ADK:{" "}
                  <Ext href="https://adk.dev/integrations/cloud-trace/">
                    adk.dev/integrations/cloud-trace
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Instrument ADK applications with OpenTelemetry:{" "}
                  <Ext href="https://docs.cloud.google.com/stackdriver/docs/instrumentation/ai-agent-adk">
                    docs.cloud.google.com/stackdriver
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  MLflow observability for ADK:{" "}
                  <Ext href="https://adk.dev/integrations/mlflow-tracing/">
                    adk.dev/integrations/mlflow-tracing
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Introduction to A2A:{" "}
                  <Ext href="https://google.github.io/adk-docs/a2a/intro/">
                    google.github.io/adk-docs/a2a/intro
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Quickstart: Consuming a remote agent via A2A:{" "}
                  <Ext href="https://adk.dev/a2a/quickstart-consuming/">
                    adk.dev/a2a/quickstart-consuming
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Deploying Your Agent:{" "}
                  <Ext href="https://google.github.io/adk-docs/deploy/">
                    google.github.io/adk-docs/deploy
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Cloud Run（デプロイ）:{" "}
                  <Ext href="https://google.github.io/adk-docs/deploy/cloud-run/">
                    google.github.io/adk-docs/deploy/cloud-run
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Deploy to Agent Runtime:{" "}
                  <Ext href="https://adk.dev/deploy/agent-runtime/">
                    adk.dev/deploy/agent-runtime
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Deploy to Agent Runtime with Agents CLI:{" "}
                  <Ext href="https://adk.dev/deploy/agent-runtime/agents-cli/">
                    adk.dev/deploy/agent-runtime/agents-cli
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Build and deploy an AI agent to Cloud Run:{" "}
                  <Ext href="https://docs.cloud.google.com/run/docs/ai/build-and-deploy-ai-agents/deploy-adk-agent">
                    docs.cloud.google.com/run
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Quickstart: Build and deploy an AI agent to Cloud Run:{" "}
                  <Ext href="https://docs.cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-adk-service">
                    docs.cloud.google.com/run/docs/quickstarts
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refsGroup}>
              <h3>Google公式ブログ・Codelabs</h3>
              <ul>
                <li>
                  <i className="ti ti-point" />
                  「Agent Development Kit: Making it easy to build multi-agent applications」:{" "}
                  <Ext href="https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/">
                    developers.googleblog.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Developer's guide to multi-agent patterns in ADK」:{" "}
                  <Ext href="https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/">
                    developers.googleblog.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Architecting efficient context-aware multi-agent framework for production」:{" "}
                  <Ext href="https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/">
                    developers.googleblog.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Remember this: Agent state and memory with ADK」:{" "}
                  <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/remember-this-agent-state-and-memory-with-adk">
                    cloud.google.com/blog
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Building Collaborative AI: A Developer's Guide to Multi-Agent Systems with
                  ADK」:{" "}
                  <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/building-collaborative-ai-a-developers-guide-to-multi-agent-systems-with-adk">
                    cloud.google.com/blog
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Build multi-agentic systems using Google ADK」:{" "}
                  <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/build-multi-agentic-systems-using-google-adk">
                    cloud.google.com/blog
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Codelabs「Deploy, Manage, and Observe ADK Agent on Cloud Run」:{" "}
                  <Ext href="https://codelabs.developers.google.com/deploy-manage-observe-adk-cloud-run">
                    codelabs.developers.google.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Codelabs「Evaluating Agents with ADK」:{" "}
                  <Ext href="https://codelabs.developers.google.com/adk-eval/instructions">
                    codelabs.developers.google.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Codelabs「Getting Started with Agent2Agent Protocol」:{" "}
                  <Ext href="https://codelabs.developers.google.com/intro-a2a-purchasing-concierge">
                    codelabs.developers.google.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Google Skills「Connect to Remote Agents with ADK and the Agent2Agent SDK」:{" "}
                  <Ext href="https://www.skills.google/focuses/132170?parent=catalog">
                    skills.google
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={styles.refsGroup}>
              <h3>コミュニティ記事・技術ブログ</h3>
              <ul>
                <li>
                  <i className="ti ti-point" />
                  「Google ADK Session and State Management」:{" "}
                  <Ext href="https://medium.com/google-cloud/google-adk-session-and-state-management-understanding-sessions-and-state-a5e05b62f1f1">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Adding Sessions and Memory to Your AI Agent with ADK」:{" "}
                  <Ext href="https://dev.to/marianocodes/adding-sessions-and-memory-to-your-ai-agent-with-agent-development-kit-adk-31ap">
                    dev.to/marianocodes
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Arjun Prabhulal「Google ADK - Session, State and Memory」:{" "}
                  <Ext href="https://arjunprabhulal.com/adk-sessions-state/">
                    arjunprabhulal.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Arjun Prabhulal「Google ADK - Context Management」:{" "}
                  <Ext href="https://arjunprabhulal.com/adk-context-management/">
                    arjunprabhulal.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Master ADK Callbacks: DOs and DON'Ts」:{" "}
                  <Ext href="https://medium.com/google-cloud/master-adk-callbacks-dos-and-donts-adedd2386983">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  leoy.blog「Master ADK Callbacks: DOs and DON'Ts」:{" "}
                  <Ext href="https://leoy.blog/posts/master-adk-callbacks/">leoy.blog</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Callbacks vs Plugins in ADK」:{" "}
                  <Ext href="https://medium.com/google-cloud/callbacks-vs-plugins-in-adk-knowing-where-responsibility-belongs-c277517473ee">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Agent Development Kit（ADK）Made Easy — Part 2」:{" "}
                  <Ext href="https://medium.com/google-cloud/agent-development-kit-adk-made-easy-part-2-0c3b8ef32399">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Context Engineering in Google ADK」:{" "}
                  <Ext href="https://medium.com/@juanc.olamendy/context-engineering-in-google-adk-the-ultimate-guide-to-building-scalable-ai-agents-f8d7683f9c60">
                    medium.com/@juanc.olamendy
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  The New Stack「A Step-by-Step Guide To Deploying ADK Agents on Cloud Run」:{" "}
                  <Ext href="https://thenewstack.io/a-step-by-step-guide-to-deploying-adk-agents-on-cloud-run/">
                    thenewstack.io
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Evaluating Agents with ADK, Part 1」:{" "}
                  <Ext href="https://medium.com/google-cloud/evaluating-agents-with-adk-part-1-the-development-loop-with-the-adk-web-ui-7822b592498a">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Agent Evaluation with Google ADK: A Practical Guide」:{" "}
                  <Ext href="https://medium.com/@dcheng_93016/agent-evaluation-with-google-adk-a-practical-guide-for-agent-builders-a3c1622f550c">
                    medium.com/@dcheng_93016
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  DeepWiki「Evaluation and Testing | google/adk-docs」:{" "}
                  <Ext href="https://deepwiki.com/google/adk-docs/8.4-evaluation">deepwiki.com</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  DeepWiki「Plugin System | google/adk-python」:{" "}
                  <Ext href="https://deepwiki.com/google/adk-python/4.3-plugin-system">
                    deepwiki.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Agentic Observability: ADK's Built-in Power」:{" "}
                  <Ext href="https://minherz.medium.com/agentic-observability-adks-built-in-power-4c1e5b2c85a1">
                    minherz.medium.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「AI Agent Observability with ADK on Google Cloud」:{" "}
                  <Ext href="https://medium.com/google-cloud/ai-agent-observability-based-on-agent-development-kit-adk-approach-565c82cb8c80">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  SigNoz Docs「Google ADK Observability and Monitoring with OpenTelemetry」:{" "}
                  <Ext href="https://signoz.io/docs/google-adk-observability/">signoz.io</Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Langfuse「Observability for Google Agent Development Kit」:{" "}
                  <Ext href="https://langfuse.com/integrations/frameworks/google-adk">
                    langfuse.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Arize「Tracing, Evaluation, and Observability for Google ADK」:{" "}
                  <Ext href="https://arize.com/blog/tracing-evaluation-and-observability-for-google-adk-how-to/">
                    arize.com
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  Kablamo Engineering「Tracing AI Agents on Google Cloud with OpenTelemetry and
                  Agent Engine」:{" "}
                  <Ext href="https://engineering.kablamo.com.au/posts/gcp-otel-adk-agent">
                    engineering.kablamo.com.au
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Implementing A2A Agents with ADK: Complete Development Guide」:{" "}
                  <Ext href="https://medium.com/@vampirenalan/implementing-a2a-agents-with-adk-complete-development-guide-6cf3440f4264">
                    medium.com/@vampirenalan
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「A2A Agent Patterns with the Agent Development Kit」:{" "}
                  <Ext href="https://medium.com/google-cloud/a2a-agent-patterns-with-the-agent-development-kit-adk-aee3d61c52cf">
                    medium.com/google-cloud
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Mastering Workflow Strategies in Google ADK」:{" "}
                  <Ext href="https://medium.com/@saminchandeepa/mastering-workflow-strategies-in-google-agent-development-kit-adk-building-effective-multi-agent-59dbfcfa325f">
                    medium.com/@saminchandeepa
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Building Multi-Agent Systems with Google's ADK」:{" "}
                  <Ext href="https://medium.com/@guolisen_38580/building-multi-agent-systems-with-googles-agent-development-kit-adk-3919378be812">
                    medium.com/@guolisen_38580
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Mastering ADK Workflows: Sequential, Parallel, Loop and Custom Agents」:{" "}
                  <Ext href="https://medium.com/@shins777/adk-workflow-the-core-logic-of-ai-agent-8ce4be5c1c40">
                    medium.com/@shins777
                  </Ext>
                </li>
                <li>
                  <i className="ti ti-point" />
                  「Building Persistent Sessions with Google ADK」:{" "}
                  <Ext href="https://medium.com/@juanc.olamendy/building-persistent-sessions-with-google-adk-a-comprehensive-guide-c3bab191269d">
                    medium.com/@juanc.olamendy
                  </Ext>
                </li>
              </ul>
            </div>

            <div className={`${styles.callout} ${styles.calloutWarning}`}>
              <i className="ti ti-info-circle" />
              <div className={styles.calloutBody}>
                ADKは開発速度が非常に速いフレームワークです。実装の詳細（クラス名、パラメータ名、CLIコマンドなど）は変更される可能性があるため、実装時は必ず{" "}
                <Ext href="https://adk.dev/">adk.dev</Ext>{" "}
                の最新ドキュメントで一次情報を確認してください。
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer className={styles.pageFooter}>
        <div>LLM-Studies Guide Playbook &copy; 2026. All rights reserved.</div>
      </footer>
    </div>
  );
}
