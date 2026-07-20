import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import Ext from "@/components/docs/Ext";
import { findBySlug } from "@/lib/page-registry";
import styles from "./page.module.css";
import TocObserver from "@/components/docs/TocObserver";

const pageEntry = findBySlug("/google/enterprise-agent-platform");

export const metadata: Metadata = {
  title: pageEntry ? `${pageEntry.title} 完全ガイド | 初学者向けステップバイステップ・ベストプラクティス | LLM コスト計算機` : "Gemini Enterprise Agent Platform 完全ガイド | 初学者向けステップバイステップ・ベストプラクティス | LLM コスト計算機",
  description:
    pageEntry?.summary ??
    "Google Cloud の Gemini Enterprise Agent Platform を初めて触るエンジニア向けに、概念の理解から最初のエージェント構築、マルチエージェント設計、セキュリティ・ガバナンス、そして本番運用までをステップバイステップで解説します。",
};

const DIAGRAMS = {
  evolution: `flowchart LR
    A["Vertex AI<br/>(2021年5月〜)<br/>統合ML/生成AIプラットフォーム"] --> B["Vertex AI Agent Builder<br/>(2024年4月〜)<br/>ノーコード会話エージェント構築"]
    B --> C["Gemini Enterprise Agent Platform<br/>(2026年4月22日〜)<br/>Google Cloud Next '26で発表"]
    C --> D["ADK 2.0 / Managed Agents<br/>(2026年5月 Google I/O)<br/>機能拡張が継続中"]`,

  pillars: `flowchart TB
    subgraph BuildPillar["Build（構築）"]
        AS["Agent Studio<br/>ローコードのビジュアルキャンバス"]
        ADK["Agent Development Kit (ADK)<br/>モデル非依存のコードファースト・フレームワーク"]
        AGarden["Agent Garden<br/>事前構築済みエージェント/テンプレート集"]
        MGarden["Model Garden<br/>200以上のファースト/サードパーティ/OSSモデル"]
    end

    subgraph ScalePillar["Scale（拡張）"]
        Runtime["Agent Runtime<br/>サーバーレスの実行基盤"]
        Sessions["Sessions<br/>対話状態の管理"]
        Memory["Memory Bank<br/>長期記憶の保存/検索"]
        A2ALayer["A2Aプロトコル<br/>エージェント間連携"]
    end

    subgraph GovernPillar["Govern（統制）"]
        Registry["Agent Registry<br/>登録/バージョン管理/監視"]
        Gateway["Agent Gateway<br/>トラフィックの一元経路化"]
        Identity["Agent Identity<br/>mTLS/DPoPによる認証"]
        Armor["Model Armor<br/>プロンプトインジェクション対策"]
        SGP["Semantic Governance Policies<br/>自然言語ベースのポリシー"]
    end

    subgraph OptimizePillar["Optimize（最適化）"]
        Eval["Gen AI Evaluation Service<br/>オフライン/オンライン評価"]
        Obs["Observability<br/>Trace/Logging/Monitoring"]
    end

    BuildPillar --> ScalePillar
    ScalePillar --> GovernPillar
    GovernPillar --> OptimizePillar
    OptimizePillar -. 継続的な改善フィードバック .-> BuildPillar`,

  pathSelection: `flowchart TD
    Start(["エージェント開発を始める"]) --> Q1{"コードを書きたいか？"}
    Q1 -- "いいえ（ノーコード）" --> AS["Agent Studio で<br/>ビジュアルにエージェントを設計"]
    Q1 -- "はい（プロコード）" --> Q2{"複数エージェントの<br/>連携が必要か？"}
    Q2 -- "いいえ" --> ADK1["ADK で単一エージェントを実装<br/>(Python / Java / Go / TypeScript)"]
    Q2 -- "はい" --> ADK2["ADK でワークフローエージェントを設計<br/>(Sequential / Parallel / Loop)"]
    AS --> Deploy["Agent Runtime へデプロイ"]
    ADK1 --> Deploy
    ADK2 --> Deploy`,

  projectLayout: `flowchart TB
    ROOT["adk_project/"] --> A1["my_search_agent/"]
    ROOT --> A2["llm_auditor/"]
    ROOT --> A3["app_agent/"]
    A1 --> F1["__init__.py"]
    A1 --> F2["agent.py"]
    A1 --> F3[".env"]`,

  toolIntegrations: `flowchart LR
    Agent["エージェント<br/>(推論の中枢)"] --> BuiltIn["組み込みツール<br/>(Google検索/BigQuery等)"]
    Agent --> Custom["カスタム関数ツール<br/>(自作コード)"]
    Agent --> MCP["MCPサーバー経由のツール<br/>(外部システム連携)"]`,

  localDevelopment: `flowchart LR
    Dev["開発者"] -->|"adk web を起動"| WebUI["ローカルWeb UI"]
    WebUI --> Agent["エージェント実行"]
    Agent --> Trace["ツール呼び出し/推論過程の可視化"]
    Trace --> Dev`,

  sequentialPattern: `flowchart LR
    subgraph SeqPattern["Sequential Agent: 逐次実行"]
        direction LR
        S1["収集エージェント"] --> S2["分析エージェント"] --> S3["要約エージェント"]
    end`,

  parallelPattern: `flowchart TB
    subgraph ParPattern["Parallel Agent: 並列実行"]
        P0["コーディネーター"] --> P1["市場調査エージェント"]
        P0 --> P2["競合分析エージェント"]
        P0 --> P3["財務分析エージェント"]
        P1 --> P4["結果統合エージェント"]
        P2 --> P4
        P3 --> P4
    end`,

  loopPattern: `flowchart LR
    subgraph LoopPattern["Loop Agent: 反復実行"]
        L1["生成エージェント"] --> L2{"品質基準を満たすか？"}
        L2 -- "いいえ" --> L1
        L2 -- "はい" --> L3["完了"]
    end`,

  routingPattern: `flowchart TB
    ROOT["ルートエージェント<br/>(LLMによる動的ルーティング)"] --> D1["専門エージェントA<br/>(請求関連)"]
    ROOT --> D2["専門エージェントB<br/>(技術サポート)"]
    ROOT --> D3["専門エージェントC<br/>(一般問い合わせ)"]`,

  a2aProtocol: `sequenceDiagram
    actor O as オーケストレーターエージェント
    participant REG as Agent Registry
    participant R1 as リサーチエージェント (ADK)
    participant R2 as 実行エージェント (別フレームワーク)
    O->>REG: 対応可能なエージェントを検索
    REG-->>O: Agent Card の一覧を返却
    O->>R1: タスクを委譲 (JSON-RPC 2.0)
    R1-->>O: 結果を返却
    O->>R2: 後続タスクを委譲
    R2-->>O: 結果を返却
    O-->>O: 最終結果を統合`,

  flywheel: `flowchart LR
    Deployed["デプロイ済みエージェント"] --> Logs["Cloud Logging / Trace"]
    Logs --> EvalSvc["Gen AI Evaluation Service<br/>(オフライン評価+オンライン評価)"]
    EvalSvc --> ExStore["Example Store<br/>(Few-shot例の蓄積)"]
    ExStore --> Improve["プロンプト/ツール/モデルの改善"]
    Improve --> Deployed`,

  cicdFlow: `flowchart LR
    Dev["ローカル開発<br/>(agent-starter-pack create)"] --> Test["ユニットテスト &<br/>Gen AI Evaluation"]
    Test --> CICD["Cloud Build /<br/>GitHub Actions"]
    CICD --> Stage["ステージング環境へデプロイ<br/>(Terraform)"]
    Stage --> OnlineEval["ステージングでの<br/>オンライン評価"]
    OnlineEval --> Prod["本番環境へデプロイ<br/>(Agent Runtime / Cloud Run)"]
    Prod --> Monitor["Observability<br/>(Trace/Logging/Monitoring)"]
    Monitor -. 継続的な改善 .-> Dev`,

  securityLayers: `flowchart TB
    L1["レイヤー1: Agent Identity<br/>(mTLS + DPoPによる認証)"] --> L2["レイヤー2: IAM / IAP<br/>(最小権限の認可)"]
    L2 --> L3["レイヤー3: Agent Gateway<br/>(全トラフィックの一元経路化)"]
    L3 --> L4["レイヤー4: Model Armor<br/>(プロンプトインジェクション/漏洩対策)"]
    L4 --> L5["レイヤー5: Semantic Governance Policies<br/>(危険なツール組み合わせの禁止)"]
    L5 --> L6["レイヤー6: Security Command Center<br/>(統合脅威検知)"]`,

  lifecycle: `sequenceDiagram
    actor U as 呼び出し元 (ユーザー/他エージェント)
    participant GW as Agent Gateway
    participant IAM as IAM / Agent Identity
    participant MA as Model Armor
    participant AG as エージェント (Agent Runtime)
    U->>GW: リクエスト送信 (mTLS/DPoP)
    GW->>IAM: エージェントIDと権限を検証
    IAM-->>GW: 認可結果
    GW->>MA: プロンプト内容を検査
    MA-->>GW: 安全性判定(許可/ブロック/redact)
    GW->>AG: 検証済みリクエストを転送
    AG-->>GW: レスポンス
    GW->>MA: レスポンス内容を検査
    MA-->>GW: 安全性判定
    GW-->>U: 最終レスポンス`
};

export default function Page() {
  return (
    <div className={styles.layout}>
      <TocObserver navLinkClassName={styles.navLink} activeClassName={styles.active} />
      <nav className={styles.sidebar}>
        <div className={styles.sidebarBrand}>Gemini Enterprise Agent Platform</div>
        <div className={styles.sidebarSub}>初学者向け完全ガイド</div>

        <div className={styles.navGroupTitle}>基礎編</div>
        <a className={styles.navLink} href="#overview"><span className={styles.navDot}></span>1. とは何か</a>
        <a className={styles.navLink} href="#architecture"><span className={styles.navDot}></span>2. 4つの柱</a>
        <a className={styles.navLink} href="#components"><span className={styles.navDot}></span>3. 主要コンポーネント</a>

        <div className={styles.navGroupTitle}>実践編：構築</div>
        <a className={styles.navLink} href="#step0"><span className={styles.navDot}></span>Step 0. 事前準備</a>
        <a className={styles.navLink} href="#step1"><span className={styles.navDot}></span>Step 1. 開発パスの選択</a>
        <a className={styles.navLink} href="#step2"><span className={styles.navDot}></span>Step 2. Agent Studio</a>
        <a className={styles.navLink} href="#step3"><span className={styles.navDot}></span>Step 3. ADK</a>
        <a className={styles.navLink} href="#step4"><span className={styles.navDot}></span>Step 4. ツール追加</a>
        <a className={styles.navLink} href="#step5"><span className={styles.navDot}></span>Step 5. ローカルテスト</a>

        <div className={styles.navGroupTitle}>応用編：拡張</div>
        <a className={styles.navLink} href="#step6"><span className={styles.navDot}></span>Step 6. マルチエージェント</a>
        <a className={styles.navLink} href="#step7"><span className={styles.navDot}></span>Step 7. A2Aプロトコル</a>
        <a className={styles.navLink} href="#step8"><span className={styles.navDot}></span>Step 8. 評価</a>
        <a className={styles.navLink} href="#step9"><span className={styles.navDot}></span>Step 9. デプロイ</a>

        <div className={styles.navGroupTitle}>運用編：統制と最適化</div>
        <a className={styles.navLink} href="#step10"><span className={styles.navDot}></span>Step 10. セキュリティ</a>
        <a className={styles.navLink} href="#step11"><span className={styles.navDot}></span>Step 11. 可観測性</a>
        <a className={styles.navLink} href="#step12"><span className={styles.navDot}></span>Step 12. コスト最適化</a>

        <div className={styles.navGroupTitle}>付録</div>
        <a className={styles.navLink} href="#checklist"><span className={styles.navDot}></span>チェックリスト</a>
        <a className={styles.navLink} href="#antipatterns"><span className={styles.navDot}></span>アンチパターン</a>
        <a className={styles.navLink} href="#trends"><span className={styles.navDot}></span>最新動向</a>
        <a className={styles.navLink} href="#references"><span className={styles.navDot}></span>参考文献・出典</a>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.hero}>
          <span className={styles.heroBadge}>初学者向け実践ガイド</span>
          <h1>Gemini Enterprise Agent Platform 完全ガイド</h1>
          <p className={styles.lead}>
            Google Cloud の Gemini Enterprise Agent Platform
            を初めて触るエンジニア向けに、概念の理解から最初のエージェント構築、マルチエージェント設計、セキュリティ・ガバナンス、保存した会話コンテキストの維持と本番運用までをステップバイステップで解説します。
          </p>
          <div className={styles.meta}>
            最終更新: 2026年7月18日時点の公開情報に基づく ／ 図解はすべて Mermaid
            で記述（ASCIIアートは不使用）
          </div>
        </div>

        <section id="overview">
          <h2>1. Gemini Enterprise Agent Platform とは何か</h2>
          <p>
            <strong>Gemini Enterprise Agent Platform</strong> は、Google Cloud
            が提供するエージェント開発のための統合プラットフォームです。企業がエンタープライズ級の
            AI
            エージェントを「構築（Build）」「拡張（Scale）」「統制（Govern）」「最適化（Optimize）」するための、フルスタックな基盤を提供します。
          </p>
          <p>
            このプラットフォームは Vertex AI
            の正当な後継であり、名称と提供範囲は次のように進化してきました。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.evolution} />
            <div className={styles.diagramCaption}>
              図1: Vertex AI から Gemini Enterprise Agent Platform への進化
            </div>
          </div>

          <p>「Gemini Enterprise」という名称は2つの製品を指す点に注意してください。</p>
          <ul>
            <li>
              <strong>Gemini Enterprise Agent Platform</strong>
              ：開発者・技術チーム向けの構築基盤（本ガイドの主題）
            </li>
            <li>
              <strong>Gemini Enterprise app</strong>
              ：Agent Platform
              の上に構築された、社内の従業員がエージェントを発見・利用・共有するためのフロントエンドアプリケーション
            </li>
          </ul>

          <div className={styles.callout}>
            <strong>初学者向けポイント：</strong>「エージェントを作る場所が Agent
            Platform、作ったエージェントを社内の人が使う入口が Gemini Enterprise
            app」という区別を押さえておくと理解がスムーズです。
          </div>
        </section>

        <section id="architecture">
          <h2>2. 全体アーキテクチャ：4つの柱</h2>
          <p>
            Gemini Enterprise Agent Platform は、公式ドキュメントにおいて
            <strong>Build・Scale・Govern・Optimize</strong> という4つの柱を軸に構成されています。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.pillars} />
            <div className={styles.diagramCaption}>図2: Build → Scale → Govern → Optimize の循環ループ</div>
          </div>

          <p>
            初学者にとって重要なのは、この4つが<strong>一直線のパイプラインではなく循環するループ</strong>であるという点です。評価（Optimize）で得た知見が、再びエージェントの設計（Build）にフィードバックされることで、エージェントの品質が継続的に改善されていきます。
          </p>
        </section>

        <section id="components">
          <h2>3. 主要コンポーネント一覧</h2>
          <p>はじめに全体像をつかむため、主要コンポーネントを一覧化します。</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>分類</th>
                  <th>コンポーネント</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Build</td>
                  <td>Agent Studio</td>
                  <td>
                    コードを書かずに、ビジュアルキャンバス上でエージェントのフローとサブエージェントを設計できるローコードツール
                  </td>
                </tr>
                <tr>
                  <td>Build</td>
                  <td>Agent Development Kit (ADK)</td>
                  <td>
                    Python / Java / Go / TypeScript
                    に対応した、モデル非依存のオープンソース・エージェント開発フレームワーク
                  </td>
                </tr>
                <tr>
                  <td>Build</td>
                  <td>Agent Garden</td>
                  <td>業種・用途別の事前構築済みエージェントやテンプレートのライブラリ</td>
                </tr>
                <tr>
                  <td>Build</td>
                  <td>Model Garden</td>
                  <td>
                    Gemini モデル、Claude モデルファミリー、Gemma などの OSS
                    モデルを含む200以上のモデルへのアクセス窓口
                  </td>
                </tr>
                <tr>
                  <td>Scale</td>
                  <td>Agent Runtime</td>
                  <td>
                    エージェントをサーバーレスで実行するための管理された実行環境（旧 Vertex AI Agent
                    Engine）
                  </td>
                </tr>
                <tr>
                  <td>Scale</td>
                  <td>Sessions</td>
                  <td>ユーザーとエージェントの対話を保存し、会話コンテキストを維持する仕組み</td>
                </tr>
                <tr>
                  <td>Scale</td>
                  <td>Memory Bank</td>
                  <td>
                    セッションをまたいだ長期記憶を保存・検索し、パーソナライズされた応答を可能にする
                  </td>
                </tr>
                <tr>
                  <td>Scale</td>
                  <td>Example Store</td>
                  <td>Few-shot の実例を蓄積し、動的に取得してエージェントの応答品質を高める</td>
                </tr>
                <tr>
                  <td>Govern</td>
                  <td>Agent Registry</td>
                  <td>
                    組織内で承認されたエージェントとツール（MCPサーバーを含む）を一元管理する台帳
                  </td>
                </tr>
                <tr>
                  <td>Govern</td>
                  <td>Agent Gateway</td>
                  <td>
                    すべてのエージェント間・エージェント-ツール間通信を経路化するコントロールプレーン
                  </td>
                </tr>
                <tr>
                  <td>Govern</td>
                  <td>Agent Identity</td>
                  <td>
                    エージェントごとに割り当てられる一意なID。mTLS と DPoP による暗号学的認証を提供
                  </td>
                </tr>
                <tr>
                  <td>Govern</td>
                  <td>Model Armor</td>
                  <td>
                    プロンプトインジェクション、ジェイルブレイク、機密情報漏洩をリアルタイムで検知・遮断するガードレール
                  </td>
                </tr>
                <tr>
                  <td>Govern</td>
                  <td>Semantic Governance Policies</td>
                  <td>自然言語でツールの危険な組み合わせなどを制御するポリシーエンジン</td>
                </tr>
                <tr>
                  <td>Optimize</td>
                  <td>Gen AI Evaluation Service</td>
                  <td>
                    ルーブリックベースの自動評価や、本番トラフィックに対するオンライン評価を提供
                  </td>
                </tr>
                <tr>
                  <td>Optimize</td>
                  <td>Observability</td>
                  <td>
                    Cloud Trace / Logging / Monitoring
                    と統合したトークン消費量・レイテンシ・エラー率・ツール呼び出しの可視化
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="step0">
          <span className={styles.stepBadge}>STEP 0</span>
          <h2>事前準備</h2>
          <p>初学者がまず最初に行う準備です。</p>
          <ol>
            <li>
              <strong>Google Cloud プロジェクトの作成</strong>
              ：課金アカウントを有効化したプロジェクトを1つ用意します。新規ユーザーは無料クレジット（申込時点で最大
              $300）を利用できる場合があります。
            </li>
            <li>
              <strong>必要な API の有効化</strong>：以下のように <code>gcloud</code> コマンドで有効化します。
            </li>
          </ol>

          <div className={styles.codeBlockWrap}>
            <div className={styles.codeBlockLabel}>bash</div>
            <pre className={styles.codeBody}>
              <code>
                <div className={styles.codeLine}><span className={styles.ck}>gcloud</span><span className={styles.cv}> services enable</span> \</div>
                <div className={styles.codeLine}>  aiplatform.googleapis.com \</div>
                <div className={styles.codeLine}>  discoveryengine.googleapis.com \</div>
                <div className={styles.codeLine}>  cloudbuild.googleapis.com \</div>
                <div className={styles.codeLine}>  run.googleapis.com</div>
              </code>
            </pre>
          </div>

          <ol start={3}>
            <li>
              <strong>開発ツールの選択</strong>：ローカルで Python 3.10 以上（ADK
              を使う場合）、または単にブラウザだけで始めるか（Agent Studio を使う場合）を決めます。
            </li>
            <li>
              <strong>認証情報の準備</strong>：Gemini API キー（AI Studio 経由）または Google Cloud
              の Application Default Credentials（ADC）のいずれかを用意します。
            </li>
          </ol>

          <div className={styles.callout + " " + styles.warning}>
            <strong>ベストプラクティス：</strong>ユーザー資格情報・サービスアカウントキー・API
            キーなどの機微情報は、決してコードベースに直接コミットしないでください。環境変数やシークレットマネージャーを利用します。
          </div>
        </section>

        <section id="step1">
          <span className={styles.stepBadge}>STEP 1</span>
          <h2>開発パスを選ぶ（ノーコード vs プロコード）</h2>
          <p>
            Gemini Enterprise Agent Platform
            は、スキルレベルに応じて複数の入り口を用意しています。初学者はまずどちらのパスから始めるかを決めましょう。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.pathSelection} />
            <div className={styles.diagramCaption}>図3: 開発パス選択の意思決定フロー</div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>Agent Studio（ノーコード）</th>
                  <th>ADK（プロコード）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>対象者</td>
                  <td>業務担当者、プロトタイピングを急ぐエンジニア</td>
                  <td>ソフトウェアエンジニア、複雑な要件を持つチーム</td>
                </tr>
                <tr>
                  <td>開発方法</td>
                  <td>ブラウザ上のビジュアルキャンバスでフロー設計</td>
                  <td>Python/Java/Go/TypeScript でコードを記述</td>
                </tr>
                <tr>
                  <td>得意な用途</td>
                  <td>プロンプト設計、マルチモーダル検証、簡易な業務アシスタント</td>
                  <td>複雑な推論、独自ツール統合、CI/CD、テスト駆動開発</td>
                </tr>
                <tr>
                  <td>移行性</td>
                  <td>「Export to ADK」でコードにエクスポート可能</td>
                  <td>Agent Studio からのインポートも可能</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.note}>
            初学者への推奨は、まず
            <strong>Agent Studio で最小限のプロトタイプを作り、要件が複雑化したら ADK
            にエクスポートして本格開発に移行する</strong>という順路です。
          </p>
        </section>

        <section id="step2">
          <span className={styles.stepBadge}>STEP 2</span>
          <h2>Agent Studio でノーコード開発</h2>
          <p>Agent Studio は、Google Cloud コンソールに組み込まれたビジュアル設計ツールです。</p>

          <h3>手順</h3>
          <ol>
            <li>Google Cloud コンソールの <strong>Agents</strong> ページを開く</li>
            <li><strong>Create agent</strong> をクリックし、Agent Studio のキャンバスを開く</li>
            <li>
              <strong>Flow タブ</strong>で、メインエージェントとサブエージェントを視覚的に配置する
            </li>
            <li>
              各エージェントをクリックし、<strong>Details パネル</strong>で以下を設定する
              <ul>
                <li><strong>Name</strong>：識別しやすい名前</li>
                <li><strong>Description</strong>：エージェントの目的の要約</li>
                <li>
                  <strong>Instructions</strong>：エージェントの振る舞いを導く指示（システムプロンプトに相当）
                </li>
                <li><strong>Model</strong>：Gemini など、動かすモデルを選択</li>
                <li>
                  <strong>Tools</strong>：エージェントがタスクを遂行するために使うツールを追加
                </li>
              </ul>
            </li>
            <li>画面上のシミュレーターでリアルタイムに応答をテストする</li>
            <li>
              問題なければ <strong>Deploy</strong> から Cloud Run へのデプロイ、または ADK
              コードへのエクスポートを行う
            </li>
          </ol>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              最初のイテレーションでは、ツールを最小限に絞り、コア機能が正しく動くことを確認してから拡張する
            </li>
            <li>
              Instructions
              は曖昧な指示を避け、「何をすべきか」だけでなく「何をすべきでないか」も明記する
            </li>
            <li>シミュレーターで境界値（想定外の入力、悪意のある入力）を必ず試す</li>
          </ul>
        </section>

        <section id="step3">
          <span className={styles.stepBadge}>STEP 3</span>
          <h2>Agent Development Kit (ADK) でプロコード開発</h2>
          <p>
            ADK
            は、エージェントの構築・デバッグ・デプロイをソフトウェア開発の標準的なワークフローに近づけることを目的とした、オープンソースのフレームワークです。Python・Java・Go・TypeScript
            に対応しています。
          </p>

          <h3>ADK のコアコンセプト</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>概念</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Agent</td>
                  <td>特定のシステム指示とツールを持つ、LLM 駆動の構成可能なオブジェクト</td>
                </tr>
                <tr>
                  <td>Runner</td>
                  <td>
                    実行フローを管理し、Events
                    に基づいてエージェントの相互作用をオーケストレーションするエンジン
                  </td>
                </tr>
                <tr>
                  <td>Session</td>
                  <td>ユーザーとの対話状態を標準化して管理する仕組み</td>
                </tr>
                <tr>
                  <td>Tools</td>
                  <td>
                    Google 検索や BigQuery などの組み込みツール、または独自の関数ツール、MCP
                    経由のツール
                  </td>
                </tr>
                <tr>
                  <td>Events</td>
                  <td>
                    エージェントの実行過程で発生する出来事（メッセージ、ツール呼び出し、状態変化など）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>プロジェクト構成の例</h3>
          <p>
            ADK プロジェクトでは、エージェントごとにディレクトリを分離する構成が推奨されています。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.projectLayout} />
            <div className={styles.diagramCaption}>図4: ADK プロジェクトのディレクトリ構成例</div>
          </div>

          <h3>最小構成のエージェントコード例（Python）</h3>
          <div className={styles.codeBlockWrap}>
            <div className={styles.codeBlockLabel}>my_search_agent/agent.py</div>
            <pre className={styles.codeBody}>
              <code>
                <div className={styles.codeLine}><span className={styles.ck}>from</span> google.adk.agents <span className={styles.ck}>import</span> Agent</div>
                <div className={styles.codeLine}><span className={styles.ck}>from</span> google.adk.tools <span className={styles.ck}>import</span> google_search</div>
                <div className={styles.codeLine}></div>
                <div className={styles.codeLine}>root_agent = Agent(</div>
                <div className={styles.codeLine}>    name=<span className={styles.cs}>"my_search_agent"</span>,</div>
                <div className={styles.codeLine}>    model=<span className={styles.cs}>"gemini-2.5-flash"</span>,</div>
                <div className={styles.codeLine}>    description=<span className={styles.cs}>"ウェブ検索を使ってユーザーの質問に答えるエージェント"</span>,</div>
                <div className={styles.codeLine}>    instruction=(</div>
                <div className={styles.codeLine}>        <span className={styles.cs}>"ユーザーの質問に対して、必要であれば google_search ツールを使い、"</span></div>
                <div className={styles.codeLine}>        <span className={styles.cs}>"根拠を明示した簡潔な日本語で回答してください。"</span></div>
                <div className={styles.codeLine}>        <span className={styles.cs}>"分からない場合は推測せず、その旨を伝えてください。"</span></div>
                <div className={styles.codeLine}>    ),</div>
                <div className={styles.codeLine}>    tools=[google_search],</div>
                <div className={styles.codeLine}>)</div>
              </code>
            </pre>
          </div>

          <div className={styles.codeBlockWrap}>
            <div className={styles.codeBlockLabel}>requirements.txt</div>
            <pre className={styles.codeBody}>
              <code>
                <div className={styles.codeLine}>google-adk</div>
              </code>
            </pre>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              1つのエージェントに責務を詰め込みすぎない。複雑なタスクは Step 6
              で扱うマルチエージェント構成に分割する
            </li>
            <li>
              <code>instruction</code>
              には、成功例だけでなく失敗を避けるための否定的な指示（〜しないでください）も含める
            </li>
            <li>
              モデル選定は「タスクの複雑さ」に応じて行う。単純な分類や抽出には軽量モデル、複雑な推論には高性能モデルを使う
            </li>
          </ul>
        </section>

        <section id="step4">
          <span className={styles.stepBadge}>STEP 4</span>
          <h2>ツールを追加する</h2>
          <p>
            エージェントの価値は「ツールをどう使わせるか」で大きく変わります。ADK
            は次の3種類のツール統合をサポートします。
          </p>
          <ol>
            <li>
              <strong>組み込みツール</strong>：Google 検索、BigQuery
              など、あらかじめ用意された標準ツール
            </li>
            <li>
              <strong>カスタム関数ツール</strong>：Python
              関数などとして自作するツール。入出力を明確な型で定義する
            </li>
            <li>
              <strong>MCP (Model Context Protocol) 経由のツール</strong>：外部システム（データベース、SaaS、社内API）に接続するための標準プロトコル
            </li>
          </ol>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.toolIntegrations} />
            <div className={styles.diagramCaption}>図5: ADK の3種類のツール統合</div>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              ツールの説明（description）は、LLM
              がいつそのツールを選ぶべきかを判断できるよう、具体的かつ簡潔に書く
            </li>
            <li>ツールが多数になる場合は「Toolset」として整理し、関連ツールをグループ化する</li>
            <li>
              MCP サーバーに接続する際は、専用のサービスアカウントを用意し、必要最小限の IAM
              ロール（例：<code>viewer</code> であって <code>admin</code> ではない）のみを付与する
            </li>
            <li>
              危険な操作（削除、送金など）を行うツールには、必ず確認ステップや承認フローを挟む
            </li>
          </ul>
        </section>

        <section id="step5">
          <span className={styles.stepBadge}>STEP 5</span>
          <h2>ローカルテストとデバッグ</h2>
          <p>ADK には、ローカル環境でエージェントを素早く試すための Web UI が付属しています。</p>

          <div className={styles.codeBlockWrap}>
            <div className={styles.codeBlockLabel}>bash</div>
            <pre className={styles.codeBody}>
              <code>
                <div className={styles.codeLine}><span className={styles.cc}># プロジェクトのルートディレクトリで実行</span></div>
                <div className={styles.codeLine}>adk web</div>
              </code>
            </pre>
          </div>

          <p>
            このコマンドを実行すると、ブラウザ上でエージェントとチャット形式で対話しながら、内部の推論過程・ツール呼び出し・レスポンスをステップごとに確認できます。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.localDevelopment} />
            <div className={styles.diagramCaption}>図6: ローカル開発ループ</div>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              本番相当のツール（実データベースなど）に接続する前に、モックデータでロジックを検証する
            </li>
            <li>
              想定される「悪意のある入力」（プロンプトインジェクションの試み）を必ずローカルでテストする
            </li>
            <li>
              OpenTelemetry
              ベースのログ・トレースが標準搭載されているため、早い段階からトレースの読み方に慣れておく
            </li>
          </ul>
        </section>

        <section id="step6">
          <span className={styles.stepBadge}>STEP 6</span>
          <h2>マルチエージェント・オーケストレーション設計パターン</h2>
          <p>
            1つのエージェントにすべての責務を負わせると、コンテキストウィンドウの制約や指示の複雑化により、性能が急激に劣化することが知られています。ADK
            は、これを解決するための <strong>Workflow Agent</strong> を提供しています。
          </p>

          <h3>パターン比較表</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パターン</th>
                  <th>実行方式</th>
                  <th>適した用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sequential Agent</td>
                  <td>前段の出力を次段の入力として渡す直列パイプライン</td>
                  <td>データ変換、多段階のコンテンツ生成</td>
                </tr>
                <tr>
                  <td>Parallel Agent</td>
                  <td>複数エージェントを同時実行し、結果を統合</td>
                  <td>独立した複数の情報源からの並行調査</td>
                </tr>
                <tr>
                  <td>Loop Agent</td>
                  <td>条件を満たすまで同じエージェントを反復実行</td>
                  <td>品質基準を満たすまでの反復的な生成・改善</td>
                </tr>
                <tr>
                  <td>動的ルーティング（LLM駆動）</td>
                  <td>ルートエージェントが状況に応じて委譲先を判断</td>
                  <td>問い合わせ内容に応じた専門エージェントへの振り分け</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Sequential（逐次実行）</h3>
          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.sequentialPattern} />
            <div className={styles.diagramCaption}>図7: Sequential Agent パターン</div>
          </div>

          <h3>Parallel（並列実行）</h3>
          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.parallelPattern} />
            <div className={styles.diagramCaption}>図8: Parallel Agent パターン</div>
          </div>

          <h3>Loop（反復実行）</h3>
          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.loopPattern} />
            <div className={styles.diagramCaption}>図9: Loop Agent パターン</div>
          </div>

          <h3>動的ルーティング（階層型）</h3>
          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.routingPattern} />
            <div className={styles.diagramCaption}>
              図10: 動的ルーティングによる階層型オーケストレーション
            </div>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              Workflow
              Agent（Sequential/Parallel/Loop）は<strong>決定的</strong>な制御が必要な場面で使い、LLM
              駆動の動的委譲は<strong>柔軟な判断</strong>が必要な場面で使い分ける
            </li>
            <li>
              すべてのサブエージェントは同じ <code>InvocationContext</code> を共有できるため、
              <code>session.state</code>
              を介したデータの受け渡しを設計段階で明確にする
            </li>
            <li>
              専門化の原則（Specialization）に従い、各エージェントの担当領域を狭く保つことで、個々のプロンプトをシンプルに保つ
            </li>
          </ul>
        </section>

        <section id="step7">
          <span className={styles.stepBadge}>STEP 7</span>
          <h2>Agent2Agent (A2A) プロトコルによるエージェント間連携</h2>
          <p>
            <strong>A2A (Agent2Agent) プロトコル</strong>は、Google が提唱し Linux Foundation
            に寄贈されたオープン標準で、異なるフレームワーク（ADK、LangGraph、CrewAI
            など）で構築されたエージェント同士が、共通の「Agent Card」スキーマと JSON-RPC 2.0
            形式のメッセージで連携できるようにするものです。
          </p>
          <p>
            <strong>MCP（Model Context Protocol）</strong>が「エージェント対ツール」の垂直統合を担うのに対し、<strong>A2A</strong>
            は「エージェント対エージェント」の水平的な連携を担います。両者は競合するものではなく、併用するのがベストプラクティスとされています。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.a2aProtocol} />
            <div className={styles.diagramCaption}>図11: A2A プロトコルによるクロスフレームワーク連携</div>
          </div>

          <p>
            Gemini Enterprise Agent Platform の <strong>Agent Runtime</strong> は A2A
            を標準サポートしており、ADK でデプロイしたエージェントは自動的に A2A の Agent Card
            として発見可能になります。
          </p>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              エージェント間のハンドオフは、API
              契約と同様に<strong>明示的・構造化・バージョン管理</strong>された形で設計する
            </li>
            <li>
              組織をまたぐ連携では、A2A のセキュリティカード署名機能を活用し、なりすましを防止する
            </li>
            <li>
              単一フレームワークで完結する場合は A2A を無理に導入せず、まずは ADK
              標準のワークフローエージェントで十分か検討する
            </li>
          </ul>
        </section>

        <section id="step8">
          <span className={styles.stepBadge}>STEP 8</span>
          <h2>評価（Evaluation）とデータフライホイール</h2>
          <p>
            エージェントは非決定的に動作するため、通常のソフトウェアテストだけでは品質を担保できません。Gen
            AI Evaluation Service を使い、継続的な評価ループを構築します。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.flywheel} />
            <div className={styles.diagramCaption}>図12: 評価のデータフライホイール</div>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>評価手法</th>
                  <th>説明</th>
                  <th>使いどころ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ルーブリックベース評価</td>
                  <td>明確な評価基準（ルーブリック）に基づき自動採点</td>
                  <td>開発中の回帰テスト</td>
                </tr>
                <tr>
                  <td>マルチターン自動採点（auto-rater）</td>
                  <td>複数ターンの会話品質をLLM自身に評価させる</td>
                  <td>対話エージェントの品質検証</td>
                </tr>
                <tr>
                  <td>オンライン評価</td>
                  <td>本番の実トラフィックに対してリアルタイムで評価</td>
                  <td>本番投入後の継続監視</td>
                </tr>
                <tr>
                  <td>Unified Trace Viewer</td>
                  <td>エージェントの推論経路をステップごとに可視化</td>
                  <td>非決定的な失敗のデバッグ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              デプロイ前に必ずオフライン評価データセットで回帰テストを行う（Agent Starter Pack
              の評価統合機能が活用できる）
            </li>
            <li>
              本番投入後もオンライン評価を止めず、モデルやプロンプトの微修正がユーザー体験に与える影響を継続的に監視する
            </li>
            <li>
              Example Store に蓄積した優良事例を Few-shot
              として活用し、プロンプトエンジニアリングだけに頼らない品質改善サイクルを作る
            </li>
          </ul>
        </section>

        <section id="step9">
          <span className={styles.stepBadge}>STEP 9</span>
          <h2>デプロイ（Agent Runtime / Cloud Run / GKE）</h2>
          <p>ADK エージェントを本番環境に移行する際は、要件に応じて3つの選択肢があります。</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>デプロイ先</th>
                  <th>特徴</th>
                  <th>向いているケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Agent Runtime</td>
                  <td>
                    サーバーレスで完全マネージド。A2A・Sessions・Memory Bank・Observability
                    が標準統合
                  </td>
                  <td>迅速に本番運用したい、インフラ管理を最小化したい場合</td>
                </tr>
                <tr>
                  <td>Cloud Run</td>
                  <td>柔軟性が高く、カスタムUI・特殊なネットワーク要件・スケールtoゼロに対応</td>
                  <td>コストを抑えたい、独自のWeb UIを持たせたい場合</td>
                </tr>
                <tr>
                  <td>GKE / カスタムインフラ</td>
                  <td>最大限の制御が可能</td>
                  <td>既存のKubernetes基盤に統合したい、特殊な要件がある場合</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Agent Starter Pack を使ったデプロイフロー</h3>
          <p>
            <strong>Agent Starter Pack</strong> は、Google Cloud
            が提供する本番運用向けテンプレート集で、CI/CD・Terraform
            によるインフラ定義・評価統合・セキュリティ設定をあらかじめ備えています。
          </p>

          <div className={styles.codeBlockWrap}>
            <div className={styles.codeBlockLabel}>bash</div>
            <pre className={styles.codeBody}>
              <code>
                <div className={styles.codeLine}><span className={styles.cc}># ReAct/RAG/マルチエージェントなどのテンプレートから選択して新規プロジェクトを作成</span></div>
                <div className={styles.codeLine}>uvx agent-starter-pack create my-agent-project -a adk@rag</div>
              </code>
            </pre>
          </div>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.cicdFlow} />
            <div className={styles.diagramCaption}>図13: Agent Starter Pack による CI/CD デプロイフロー</div>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              プロトタイピング段階から Agent Starter Pack を使うことで、後から CI/CD
              やセキュリティ設定を後付けする手戻りを防げる
            </li>
            <li>
              ステージング環境でオンライン評価を実施してから本番昇格させる、段階的リリースを徹底する
            </li>
            <li>
              Cloud Run
              を選ぶ場合、スポラディックなトラフィックにはスケールtoゼロ設定でコストを最適化する
            </li>
          </ul>
        </section>

        <section id="step10">
          <span className={styles.stepBadge}>STEP 10</span>
          <h2>セキュリティとガバナンス</h2>
          <p>
            エージェントは非決定的に動作し、人間の監督なしに行動する可能性があるため、多層防御（Defense
            in Depth）の設計が不可欠です。
          </p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.securityLayers} />
            <div className={styles.diagramCaption}>図14: セキュリティの多層防御レイヤー</div>
          </div>

          <h3>リクエストのライフサイクル</h3>
          <p>エージェント宛のリクエストが Agent Gateway を通過する流れは次の通りです。</p>

          <div className={styles.diagramFrame}>
            <MermaidDiagram chart={DIAGRAMS.lifecycle} />
            <div className={styles.diagramCaption}>
              図15: Agent Gateway を通過するリクエストのライフサイクル
            </div>
          </div>

          <h3>セキュリティ・ガバナンスのベストプラクティス一覧</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>推奨事項</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>エージェントIDの分離</td>
                  <td>
                    エージェント／アプリケーションごとに専用のサービスアカウントを用意し、既存の広範な権限を持つアカウントを使い回さない
                  </td>
                </tr>
                <tr>
                  <td>最小権限の原則</td>
                  <td>
                    例えば <code>viewer</code> ロールで十分な場合に
                    <code>admin</code> ロールを付与しない
                  </td>
                </tr>
                <tr>
                  <td>Model Armor の有効化</td>
                  <td>
                    プロンプトインジェクション、ジェイルブレイク、機密情報漏洩を検知するテンプレートを設定する
                  </td>
                </tr>
                <tr>
                  <td>Agent Gateway 経由の一元化</td>
                  <td>
                    Agent-to-Agent 通信を含む、すべてのエージェント通信を Agent Gateway
                    経由にルーティングする
                  </td>
                </tr>
                <tr>
                  <td>ドライラン運用の徹底</td>
                  <td>
                    Semantic Governance Policies や IAP
                    は、まずドライランモードで検証してから強制適用に切り替える
                  </td>
                </tr>
                <tr>
                  <td>MCPサーバーの隔離</td>
                  <td>
                    VPC Service Controls で MCP
                    サーバーとデータをリングフェンスし、データ持ち出しを防止する
                  </td>
                </tr>
                <tr>
                  <td>ツールのフィルタ設計</td>
                  <td>
                    ユーザーが指定した条件をエージェントが直接クエリに埋め込める設計を避け、専用の安全な関数（例：<code>lookup_active_order</code>）を用意する
                  </td>
                </tr>
                <tr>
                  <td>統合監視</td>
                  <td>Security Command Center で脅威検知とAIポスチャ管理を一元化する</td>
                </tr>
                <tr>
                  <td>トレースIDによる相関</td>
                  <td>
                    Agent Gateway〜Model
                    Armor〜下流エージェントまでのログとトレースをトレースIDで関連付ける
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="step11">
          <span className={styles.stepBadge}>STEP 11</span>
          <h2>可観測性（Observability）とモニタリング</h2>
          <p>
            エージェントは自律的に振る舞うため、内部状態を可視化する仕組みが信頼性確保の土台になります。
          </p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>シグナル</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>トークン消費量</td>
                  <td>コストとレイテンシの主要因を把握する</td>
                </tr>
                <tr>
                  <td>レイテンシ</td>
                  <td>ユーザー体験への影響、ボトルネックの特定</td>
                </tr>
                <tr>
                  <td>エラー率</td>
                  <td>障害検知とアラートのトリガー</td>
                </tr>
                <tr>
                  <td>ツール呼び出しのトレース</td>
                  <td>
                    エージェントがどのツールをどの順序で呼んだかを追跡し、非決定的な失敗の原因を特定する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Cloud Trace（OpenTelemetry 対応）、Cloud Monitoring、Cloud Logging
            と統合されたダッシュボードにより、これらを一元的に確認できます。
          </p>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              ローカル開発時に使う
              <code>adk web</code>
              の体験をそのまま本番監視に持ち込めるよう、開発初期からトレースの読み方に慣れておく
            </li>
            <li>
              マルチエージェント構成では、エージェント単位のトレースに加えて、オーケストレーター全体のトレース相関を確認できるダッシュボードを用意する
            </li>
            <li>
              複雑な非決定的ワークフロー（マルチエージェント、ツールチェーン）では、標準機能に加えてカスタムダッシュボードや追加の監視フックを検討する
            </li>
          </ul>
        </section>

        <section id="step12">
          <span className={styles.stepBadge}>STEP 12</span>
          <h2>コスト最適化</h2>
          <p>Gemini Enterprise Agent Platform は従量課金制です。主な課金要素は次の通りです。</p>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>課金要素</th>
                  <th>課金基準</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>生成AI（テキスト/チャット/コード生成）</td>
                  <td>入出力の文字数(1,000文字あたり)</td>
                </tr>
                <tr>
                  <td>Agent Runtime</td>
                  <td>vCPU使用時間ベース</td>
                </tr>
                <tr>
                  <td>Agent Platform Pipelines</td>
                  <td>実行あたりの料金</td>
                </tr>
                <tr>
                  <td>Agent Platform Vector Search</td>
                  <td>データ量・クエリ数(QPS)・ノード数</td>
                </tr>
                <tr>
                  <td>ノートブック/ストレージ</td>
                  <td>Compute Engine / Cloud Storage と同水準</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              タスクの複雑さに見合ったモデルサイズを選ぶ（単純作業に高性能・高コストなモデルを使わない）
            </li>
            <li>
              スポラディックなトラフィックには Cloud Run
              のスケールtoゼロを活用し、アイドル時のコストを抑える
            </li>
            <li>
              新規プロジェクトでは無料クレジットや無料枠を活用し、小規模な検証で設計を固めてから本番規模にスケールする
            </li>
            <li>料金は変更されることがあるため、実装前に必ず最新の公式価格ページで確認する</li>
          </ul>
        </section>

        <section id="checklist">
          <h2>ベストプラクティス総まとめチェックリスト</h2>
          <ul className={styles.checklist}>
            <li>
              エージェントの責務は単一・明確にし、複雑なタスクはマルチエージェントに分割したか
            </li>
            <li>Instructions に「やるべきこと」だけでなく「やってはいけないこと」を明記したか</li>
            <li>ツールの説明文は、LLM が適切に選択できるほど具体的か</li>
            <li>ローカル環境でプロンプトインジェクションなどの悪意ある入力をテストしたか</li>
            <li>デプロイ前にオフライン評価で回帰テストを行ったか</li>
            <li>本番投入後もオンライン評価とトレースによる継続監視を行っているか</li>
            <li>エージェントごとに専用のサービスアカウントと最小権限を設定したか</li>
            <li>すべてのエージェント通信を Agent Gateway 経由に統一したか</li>
            <li>Model Armor でプロンプトインジェクション対策を有効化したか</li>
            <li>Semantic Governance Policies や IAP をドライランで検証してから本適用したか</li>
            <li>MCPサーバーを VPC Service Controls でリングフェンスしたか</li>
            <li>コストと性能のバランスを踏まえてモデルサイズを選定したか</li>
          </ul>
        </section>

        <section id="antipatterns">
          <h2>よくある落とし穴（アンチパターン）</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>アンチパターン</th>
                  <th>問題点</th>
                  <th>対策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>単一の万能エージェント</td>
                  <td>コンテキスト過多で性能が非線形に劣化する</td>
                  <td>Sequential/Parallel/Loop などへの分割</td>
                </tr>
                <tr>
                  <td>広範な権限を持つ共有サービスアカウントの使い回し</td>
                  <td>侵害時の影響範囲が広がる</td>
                  <td>エージェントごとの専用ID・最小権限</td>
                </tr>
                <tr>
                  <td>Model Armor/ガバナンスポリシーをいきなり強制適用</td>
                  <td>想定外のブロックで業務が止まる</td>
                  <td>まずドライランで検証</td>
                </tr>
                <tr>
                  <td>ローカル動作確認だけで本番投入</td>
                  <td>非決定的な失敗が本番で初めて顕在化する</td>
                  <td>オフライン評価+オンライン評価の徹底</td>
                </tr>
                <tr>
                  <td>ツール説明が曖昧</td>
                  <td>LLM が誤ったツールを選択する</td>
                  <td>具体的かつ簡潔なツール説明を書く</td>
                </tr>
                <tr>
                  <td>ユーザー入力を直接クエリに埋め込む設計</td>
                  <td>インジェクション経由でのデータ漏洩リスク</td>
                  <td>安全な専用関数でパラメータを外部化する</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="trends">
          <h2>2026年7月時点の最新動向</h2>
          <p>本ガイド執筆時点（2026年7月18日）で押さえておくべき最新の動きを補足します。</p>
          <ul>
            <li>
              <strong>Google Cloud Next &apos;26（2026年4月22日）</strong>：Gemini Enterprise Agent
              Platform が Vertex AI の進化系として正式発表され、Agent Gateway・Agent
              Identity・Semantic Governance Policies などのガバナンス機能が拡充されました。
            </li>
            <li>
              <strong>Google I/O &apos;26（2026年5月）</strong>：ADK 2.0 とともに、Google
              Antigravity（Gemini 3.5 Flash を基盤とする Managed
              Agents）が発表されました。エージェントは <code>AGENTS.md</code> や
              <code>SKILL.md</code> といったバージョン管理可能な Markdown
              ファイルで定義できるようになり、各 Managed Agent
              には専用のエフェメラルなサンドボックスが提供されます。A2A や Agent Platform
              のガバナンス機能との本格統合は今後の展開が予定されています。
            </li>
            <li>
              <strong>CX Agent Studio</strong>：ADK
              を基盤とした低コード・AIオーグメンテッドな会話エージェント構築ツールとして、カスタマーエクスペリエンス領域向けに提供されています。
            </li>
            <li>
              <strong>セキュリティ機能の拡充</strong>：Identity-Aware Proxy (IAP)
              のエージェント向け対応、Certificate Manager による Agent Identity
              証明書管理などがプレビュー展開されています。
            </li>
          </ul>
          <div className={styles.callout + " " + styles.warning}>
            <strong>注意：</strong>これらは変化の速い領域のため、実装前には必ず公式ドキュメントで最新状況を確認してください。
          </div>
        </section>

        <section id="references">
          <h2>参考文献・出典一覧</h2>

          <h3>公式ドキュメント・公式ブログ</h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>Gemini Enterprise Agent Platform 製品ページ</span><br />
              <Ext href="https://cloud.google.com/products/gemini-enterprise-agent-platform">
                https://cloud.google.com/products/gemini-enterprise-agent-platform
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>プラットフォーム概要ドキュメント</span><br />
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview">
                https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>発表ブログ「The new Gemini Enterprise」</span><br />
              <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/the-new-gemini-enterprise-one-platform-for-agent-development">
                https://cloud.google.com/blog/products/ai-machine-learning/the-new-gemini-enterprise-one-platform-for-agent-development
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>発表ブログ「Introducing Gemini Enterprise Agent Platform」</span><br />
              <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform">
                https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agents 概要ドキュメント</span><br />
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents">
                https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Build ドキュメント</span><br />
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build">
                https://docs.cloud.google.com/gemini-enterprise-agent-platform/build
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>ADK ドキュメント</span><br />
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk">
                https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>ADK Google Cloud連携ガイド</span><br />
              <Ext href="https://adk.dev/get-started/google-cloud/">
                https://adk.dev/get-started/google-cloud/
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>ADKビルド用コードラボ</span><br />
              <Ext href="https://codelabs.developers.google.com/build-ai-agent-google-adk">
                https://codelabs.developers.google.com/build-ai-agent-google-adk
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Gateway 概要</span><br />
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview">
                https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Gateway セットアップガイド</span><br />
              <Ext href="https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway">
                https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/set-up-agent-gateway
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Model Armor と Agent Gateway の統合</span><br />
              <Ext href="https://docs.cloud.google.com/model-armor/model-armor-agent-gateway-integration">
                https://docs.cloud.google.com/model-armor/model-armor-agent-gateway-integration
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Identity 概要</span><br />
              <Ext href="https://docs.cloud.google.com/iam/docs/agent-identity-overview">
                https://docs.cloud.google.com/iam/docs/agent-identity-overview
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>MCP連携のセキュリティベストプラクティス（Spanner向け）</span><br />
              <Ext href="https://docs.cloud.google.com/spanner/docs/secure-agent-interactions-mcp">
                https://docs.cloud.google.com/spanner/docs/secure-agent-interactions-mcp
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>IAMの新機能まとめブログ</span><br />
              <Ext href="https://cloud.google.com/blog/products/identity-security/whats-new-in-iam-security-governance-and-runtime-defense">
                https://cloud.google.com/blog/products/identity-security/whats-new-in-iam-security-governance-and-runtime-defense
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Gatewayガバナンスのコードラボ</span><br />
              <Ext href="https://codelabs.developers.google.com/cloudnet-agent-gateway">
                https://codelabs.developers.google.com/cloudnet-agent-gateway
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>A2Aプロトコル発表ブログ</span><br />
              <Ext href="https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/">
                https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>A2A + Agent Runtimeのコードラボ</span><br />
              <Ext href="https://codelabs.developers.google.com/adk-a2a-agent-runtime">
                https://codelabs.developers.google.com/adk-a2a-agent-runtime
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Vertex AI Agent Engine（Agent Runtime）概要</span><br />
              <Ext href="https://cloud.google.com/agent-builder/agent-engine/overview">
                https://cloud.google.com/agent-builder/agent-engine/overview
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Builder拡張ブログ</span><br />
              <Ext href="https://cloud.google.com/blog/products/ai-machine-learning/more-ways-to-build-and-scale-ai-agents-with-vertex-ai-agent-builder">
                https://cloud.google.com/blog/products/ai-machine-learning/more-ways-to-build-and-scale-ai-agents-with-vertex-ai-agent-builder
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>エージェント設計パターンの選び方（Architecture Center）</span><br />
              <Ext href="https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system">
                https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>エージェントアーキテクチャ構成要素の選び方</span><br />
              <Ext href="https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components">
                https://docs.cloud.google.com/architecture/choose-agentic-ai-architecture-components
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>マルチエージェントAIシステムのリファレンスアーキテクチャ</span><br />
              <Ext href="https://docs.cloud.google.com/architecture/multiagent-ai-system">
                https://docs.cloud.google.com/architecture/multiagent-ai-system
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Well-Architected Framework: AI/ML の視点</span><br />
              <Ext href="https://docs.cloud.google.com/architecture/framework/perspectives/ai-ml">
                https://docs.cloud.google.com/architecture/framework/perspectives/ai-ml
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Starter Pack 公式サイト</span><br />
              <Ext href="https://googlecloudplatform.github.io/agent-starter-pack/">
                https://googlecloudplatform.github.io/agent-starter-pack/
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>Agent Starter Pack GitHubリポジトリ</span><br />
              <Ext href="https://github.com/googlecloudplatform/agent-starter-pack">
                https://github.com/googlecloudplatform/agent-starter-pack
              </Ext>
            </li>
          </ul>

          <h3>海外の開発者・実務者による記事</h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refTitle}>
                Vishal Bulbule「Build Powerful AI Agents with Google ADK Tools and Best Practices」(Google Cloud Community, Medium)
              </span><br />
              <Ext href="https://medium.com/google-cloud/build-powerful-ai-agents-with-google-adk-tools-and-best-practices-adk-blo-bb9af140662f">
                https://medium.com/google-cloud/build-powerful-ai-agents-with-google-adk-tools-and-best-practices-adk-blo-bb9af140662f
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Vishal Bulbule「Agent Development Kit (ADK) Deployment Guide」(Medium, 2026年7月)
              </span><br />
              <Ext href="https://medium.com/google-cloud/agent-development-kit-adk-deployment-guide-0a927ccc6e69">
                https://medium.com/google-cloud/agent-development-kit-adk-deployment-guide-0a927ccc6e69
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Yusuf Baykaloğlu「Multi-Agent Systems: Orchestrating AI Agents with A2A Protocol」(Medium)
              </span><br />
              <Ext href="https://medium.com/@yusufbaykaloglu/multi-agent-systems-orchestrating-ai-agents-with-a2a-protocol-19a27077aed8">
                https://medium.com/@yusufbaykaloglu/multi-agent-systems-orchestrating-ai-agents-with-a2a-protocol-19a27077aed8
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                「AI Agent Observability with ADK on Google Cloud」(Google Cloud Community, Medium)
              </span><br />
              <Ext href="https://medium.com/google-cloud/ai-agent-observability-based-on-agent-development-kit-adk-approach-565c82cb8c80">
                https://medium.com/google-cloud/ai-agent-observability-based-on-agent-development-kit-adk-approach-565c82cb8c80
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                Yash Kavaiya「Getting Started with CX Agent Studio」(Google Cloud Community, Medium, 2026年5月)
              </span><br />
              <Ext href="https://medium.com/google-cloud/getting-started-with-cx-agent-studio-setting-up-and-building-your-first-agent-step-by-step-849d2a0aa5c5">
                https://medium.com/google-cloud/getting-started-with-cx-agent-studio-setting-up-and-building-your-first-agent-step-by-step-849d2a0aa5c5
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                sk_firdous_ali「Gemini Enterprise Agent Platform: A Developer&apos;s First Look (And Honest Critique)」(DEV Community)
              </span><br />
              <Ext href="https://dev.to/sk_firdous_ali/gemini-enterprise-agent-platform-a-developers-first-look-and-honest-critique-5f8m">
                https://dev.to/sk_firdous_ali/gemini-enterprise-agent-platform-a-developers-first-look-and-honest-critique-5f8m
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                njericodecraft「Building Smart in 2026: A Hands-On First Look at Google&apos;s Agent Development Kit (ADK)」(DEV Community)
              </span><br />
              <Ext href="https://dev.to/njericodecraft/building-smart-in-2026-a-hands-on-first-look-at-googles-agent-development-kit-adk-3n0">
                https://dev.to/njericodecraft/building-smart-in-2026-a-hands-on-first-look-at-googles-agent-development-kit-adk-3n0
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                「Google I/O &apos;26 Fills Out Enterprise Agent Stack with Managed Agents, ADK 2.0」(Virtualization Review)
              </span><br />
              <Ext href="https://virtualizationreview.com/articles/2026/05/19/google-io-26-fills-out-enterprise-agent-stack-with-managed-agents-adk-2,-d-,0.aspx">
                https://virtualizationreview.com/articles/2026/05/19/google-io-26-fills-out-enterprise-agent-stack-with-managed-agents-adk-2,-d-,0.aspx
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                「Google boosts Vertex AI Agent Builder with new observability and deployment tools」(InfoWorld)
              </span><br />
              <Ext href="https://www.infoworld.com/article/4085736/google-boosts-vertex-ai-agent-builder-with-new-observability-and-deployment-tools.html">
                https://www.infoworld.com/article/4085736/google-boosts-vertex-ai-agent-builder-with-new-observability-and-deployment-tools.html
              </Ext>
            </li>
            <li>
              <span className={styles.refTitle}>
                「Vertex AI Agent Builder: 2026 guide」(UI Bakery Blog、料金体系の第三者解説)
              </span><br />
              <Ext href="https://uibakery.io/blog/vertex-ai-agent-builder">
                https://uibakery.io/blog/vertex-ai-agent-builder
              </Ext>
            </li>
          </ul>

          <div className={styles.callout}>
            <strong>注記：</strong>本ガイドは
            2026年7月18日時点で確認できた公開情報に基づいています。Gemini Enterprise Agent Platform
            は変化が速い領域のため、実装の際は必ず上記の公式ドキュメントで最新情報を確認してください。
          </div>
        </section>

        <footer className={styles.pageFooter}>
          Gemini Enterprise Agent Platform 完全ガイド ／
          初学者向けステップバイステップ・ベストプラクティス ／ 最終更新: 2026年7月18日
        </footer>
      </main>
    </div>
  );
}
