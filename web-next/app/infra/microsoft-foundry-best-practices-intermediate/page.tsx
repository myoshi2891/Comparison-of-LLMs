import type { Metadata } from "next";
import Ext from "@/components/docs/Ext";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import SidebarToggle from "./SidebarToggle";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Microsoft Foundry 実践ベストプラクティスガイド",
  description:
    "Microsoft Foundry（旧Azure AI Studio/Azure AI Foundry）を用いたAIアプリ・エージェント開発のステップバイステップ・ベストプラクティスガイド。",
};

const MMD_1 = `flowchart TB
    subgraph Client["クライアント層"]
        App["アプリケーション / IDE / Copilot"]
    end

    subgraph Foundry["Microsoft Foundry"]
        Models["Foundry Models<br/>11,000以上のモデルカタログ"]
        Agents["Foundry Agent Service<br/>Prompt Agent / Hosted Agent"]
        Tools["Foundry Tools<br/>1,400以上の連携先"]
        IQ["Foundry IQ<br/>ナレッジ・グラウンディング層"]
        CP["Foundry Control Plane<br/>統合ガバナンス"]
    end

    subgraph AzureBase["Azure基盤サービス"]
        Search["Azure AI Search"]
        DataStores["Cosmos DB / Storage / PostgreSQL"]
        Monitor["Azure Monitor / Application Insights"]
        Entra["Microsoft Entra ID<br/>Entra Agent ID"]
        Purview["Microsoft Purview"]
        Defender["Microsoft Defender for Cloud"]
    end

    App -->|"Responses API"| Agents
    Agents --> Models
    Agents --> Tools
    Agents --> IQ
    IQ --> Search
    Agents --> DataStores
    Agents --> CP
    CP --> Monitor
    CP --> Entra
    CP --> Purview
    CP --> Defender`;

const MMD_2 = `sequenceDiagram
    participant Dev as 開発者
    participant SDK as AIProjectClient (SDK)
    participant Entra as Microsoft Entra ID
    participant Foundry as Foundryプロジェクト<br/>エンドポイント
    participant Model as デプロイ済みモデル

    Dev->>SDK: DefaultAzureCredential()で初期化
    SDK->>Entra: アクセストークン要求
    Entra-->>SDK: 短命トークンを発行
    Dev->>SDK: openai.responses.create(model, input)
    SDK->>Foundry: POST /openai/v1/responses
    Foundry->>Model: 推論リクエストを転送
    Model-->>Foundry: 応答を生成
    Foundry-->>SDK: response.output_text
    SDK-->>Dev: 結果オブジェクトを返却`;

const MMD_3 = `flowchart TB
    Start["エージェントを作りたい"] --> Q1{"宣言的な指示と<br/>組み込みツールだけで<br/>要件を満たせるか?"}
    Q1 -->|"はい"| Prompt["Prompt Agent<br/>ポータル/SDKで定義、<br/>Foundryが実行・運用不要"]
    Q1 -->|"いいえ<br/>独自コードが必要"| Q2{"業務ユーザーが<br/>ライフサイクルを<br/>所有するか?"}
    Q2 -->|"はい<br/>ローコードで十分"| CopilotStudio["Microsoft Copilot Studio<br/>ガバナンス内蔵のローコード基盤"]
    Q2 -->|"いいえ<br/>開発チームが所有"| Q3{"マネージドな<br/>本番運用基盤で<br/>任意フレームワークを<br/>動かしたいか?"}
    Q3 -->|"はい"| Hosted["Foundry Hosted Agent<br/>セッション単位VM分離・<br/>Entra Agentアイデンティティ付与"]
    Q3 -->|"いいえ<br/>ランタイムを完全に自前管理"| SDKProc["In-processエージェント<br/>Microsoft Agent Framework v1.0"]`;

const MMD_4 = `flowchart TB
    subgraph Sequential["① Sequential: 直列処理"]
        direction LR
        A1["Agent A<br/>調査"] --> A2["Agent B<br/>執筆"] --> A3["Agent C<br/>校正"]
    end

    subgraph Concurrent["② Concurrent: 並列処理"]
        direction LR
        B0["Orchestrator"] --> B1["Agent A"]
        B0 --> B2["Agent B"]
        B0 --> B3["Agent C"]
        B1 --> B4["結果の統合"]
        B2 --> B4
        B3 --> B4
    end

    subgraph Handoff["③ Handoff: 引き継ぎ"]
        direction LR
        C1["Agent A<br/>一次対応"] -->|"専門外と判断"| C2["Agent B<br/>専門対応へ移譲"]
    end

    subgraph GroupChat["④ Group Collaboration: 討議"]
        direction LR
        D1["Agent A"] --- D2["Agent B"]
        D2 --- D3["Agent C"]
        D1 --- D3
    end`;

const MMD_5 = `sequenceDiagram
    participant User as ユーザー
    participant Agent as Foundry Agent
    participant IQ as Foundry IQ (ナレッジベース)
    participant Search as Azure AI Search
    participant LLM as モデル

    User->>Agent: 質問を送信
    Agent->>IQ: ナレッジベースへ照会
    IQ->>IQ: LLMによるクエリプランニング<br/>複数サブクエリへ分解
    IQ->>Search: 並列サブクエリ実行<br/>(ハイブリッド: ベクトル+キーワード)
    Search-->>IQ: 関連チャンクを返却
    IQ-->>Agent: 構造化グラウンディングデータ<br/>+ 引用情報
    Agent->>LLM: 質問 + グラウンディングデータ
    LLM-->>Agent: 根拠に基づく回答を生成
    Agent-->>User: 引用付きの回答`;

const MMD_6 = `flowchart TB
    subgraph Inbound["インバウンド分離"]
        Client["クライアント / 開発者"] -->|"Private Link"| PE["Private Endpoint"]
        PE --> FoundryRes["Foundryリソース<br/>Public Network Access: Disabled"]
    end

    subgraph Outbound["アウトバウンド分離: マネージドネットワーク"]
        FoundryRes --> Mode{"managedNetwork<br/>isolation mode"}
        Mode -->|"Disabled"| OpenNet["全アウトバウンド許可<br/>(非推奨)"]
        Mode -->|"AllowInternetOutbound"| InternetNet["インターネット到達可<br/>(開発向け)"]
        Mode -->|"AllowOnlyApprovedOutbound"| ApprovedNet["承認済FQDNのみ許可<br/>(本番推奨)"]
    end

    subgraph BYO["BYO VNet構成: エンドツーエンド分離"]
        ApprovedNet --> VNet["顧客所有VNet"]
        VNet --> AISearch["Azure AI Search<br/>Private Endpoint"]
        VNet --> CosmosDB["Azure Cosmos DB<br/>Private Endpoint"]
        VNet --> StorageAcc["Azure Storage<br/>Private Endpoint"]
        VNet --> KeyVault["Key Vault<br/>Private Endpoint"]
    end`;

const MMD_7 = `flowchart TB
    U["ユーザー入力"] -->|"① User Input"| G1["Prompt Shields<br/>+ Spotlighting"]
    G1 --> Agent1["エージェント / モデル推論"]
    Agent1 -->|"② Tool Call"| G2["Task Adherence<br/>アクション妥当性検証"]
    G2 --> Tool["外部ツール実行"]
    Tool -->|"③ Tool Response"| G3["ツール応答の<br/>信頼性検証"]
    G3 --> Agent2["エージェントへ返却"]
    Agent2 -->|"④ Output"| G4["コンテンツフィルタ<br/>PII検出 / 保護コンテンツ検出"]
    G4 --> Res["ユーザーへの最終応答"]`;

const MMD_8 = `flowchart TB
    Agent["エージェント実行"] -->|"OpenTelemetry Span"| Collector["OTelインストゥルメンテーション"]
    Collector --> AppInsights["Application Insights"]
    AppInsights --> Tracing["Foundryポータル Tracing画面"]
    AppInsights --> Evaluators["組み込み/カスタム評価器<br/>Groundedness・Relevance・Safety等"]
    Evaluators --> Monitoring["継続的モニタリング<br/>ドリフト検知・アラート"]
    Monitoring -->|"閾値割れ"| Alert["Azure Monitorアラート<br/>→ 再評価 / 自動対応"]
    Tracing --> Debug["根本原因調査<br/>ツール呼び出し・レイテンシ・トークン"]`;

const MMD_9 = `flowchart TB
    Commit["コミット / PR"] --> Build["CIビルド<br/>静的解析・単体テスト・ツールテスト"]
    Build --> EvalGate{"評価ゲート<br/>品質・安全性・コストの閾値判定"}
    EvalGate -->|"不合格"| Fail["パイプライン失敗<br/>修正へ差し戻し"]
    EvalGate -->|"合格"| Version["バージョン付きエージェント<br/>成果物: 不変を生成"]
    Version --> Dev["Dev環境へデプロイ<br/>スモークテスト + 評価ゲート"]
    Dev --> Test["Test環境へ昇格<br/>シナリオテスト + 人間承認"]
    Test --> Prod["Production環境へ昇格<br/>エンドポイント有効化 + 監視開始"]
    Prod --> ProdMonitor["本番継続評価<br/>サンプリングトラフィックで監視"]
    ProdMonitor -->|"品質劣化を検知"| Rollback["自動ロールバック / 再評価トリガー"]`;

/**
 * Renders the Microsoft Foundry practical best practices guide with navigation, diagrams, and reference content.
 */
export default function MicrosoftFoundryBestPracticesIntermediatePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.container}>
        <SidebarToggle />
        <aside className={styles.sidebar} id="foundry-intermediate-sidebar">
          <div className={styles.brand}>
            <div className={styles.brandMark}>MF</div>
            <div className={styles.brandText}>
              Microsoft Foundry
              <span>BEST PRACTICES</span>
            </div>
          </div>

          <nav className={styles.tocNav}>
            <div className={styles.tocGroupLabel}>導入・概念</div>
            <ul>
              <li>
                <a href="#sec-intro-body">
                  <span className={styles.num}>•</span>はじめに
                </a>
              </li>
              <li>
                <a href="#sec-0">
                  <span className={styles.num}>00</span>リブランディング
                </a>
              </li>
              <li>
                <a href="#sec-1">
                  <span className={styles.num}>01</span>Microsoft Foundryとは
                </a>
              </li>
              <li>
                <a href="#sec-2">
                  <span className={styles.num}>02</span>セットアップ
                </a>
              </li>
            </ul>

            <div className={styles.tocGroupLabel}>開発・構築</div>
            <ul>
              <li>
                <a href="#sec-3">
                  <span className={styles.num}>03</span>モデル選定・Router
                </a>
              </li>
              <li>
                <a href="#sec-4">
                  <span className={styles.num}>04</span>エージェント開発
                </a>
              </li>
              <li>
                <a href="#sec-5">
                  <span className={styles.num}>05</span>マルチエージェント
                </a>
              </li>
              <li>
                <a href="#sec-6">
                  <span className={styles.num}>06</span>RAG・Foundry IQ
                </a>
              </li>
            </ul>

            <div className={styles.tocGroupLabel}>ガバナンス・運用</div>
            <ul>
              <li>
                <a href="#sec-7">
                  <span className={styles.num}>07</span>セキュリティ・ネットワーク
                </a>
              </li>
              <li>
                <a href="#sec-8">
                  <span className={styles.num}>08</span>ガードレール
                </a>
              </li>
              <li>
                <a href="#sec-9">
                  <span className={styles.num}>09</span>可観測性
                </a>
              </li>
              <li>
                <a href="#sec-10">
                  <span className={styles.num}>10</span>コスト最適化・FinOps
                </a>
              </li>
              <li>
                <a href="#sec-11">
                  <span className={styles.num}>11</span>CI/CD・GenAIOps
                </a>
              </li>
              <li>
                <a href="#sec-12">
                  <span className={styles.num}>12</span>ファインチューニング
                </a>
              </li>
              <li>
                <a href="#sec-13">
                  <span className={styles.num}>13</span>WAFの適用
                </a>
              </li>
            </ul>

            <div className={styles.tocGroupLabel}>実践・リファレンス</div>
            <ul>
              <li>
                <a href="#sec-14">
                  <span className={styles.num}>14</span>アンチパターン
                </a>
              </li>
              <li>
                <a href="#sec-15">
                  <span className={styles.num}>15</span>デプロイ前チェック
                </a>
              </li>
              <li>
                <a href="#sec-16">
                  <span className={styles.num}>16</span>参考文献
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className={styles.main}>
          <header className={styles.hero} id="intro">
            <div className={styles.heroKicker}>● 2026年7月17日時点の情報でブラッシュアップ</div>
            <h1>
              Microsoft Foundry <br />
              <span className={styles.gradientText}>実践ベストプラクティスガイド</span>
            </h1>
            <p className={styles.subtitle}>
              中級者〜上級者のためのステップバイステップ実装リファレンス。Microsoft
              Learn公式ドキュメント、Foundry公式ブログ、Microsoft Build
              2026の発表、および国際的に著名な開発者・コミュニティの投稿を横断的に調査し、実務で使えるベストプラクティスとして再構成しました。
            </p>

            <div className={styles.heroMeta}>
              <span className={styles.chip}>
                対象: アプリ開発者 / MLエンジニア / プラットフォームエンジニア
              </span>
              <span className={styles.chip}>形式: Mermaid図解 9点 + 比較表 15点以上</span>
              <span className={styles.chip}>
                出典: 公式ドキュメント約35件 + ブログ/開発者投稿 約25件
              </span>
            </div>

            <div className={styles.statRow}>
              <div className={styles.stat}>
                <div className={styles.num}>
                  80<small>K+</small>
                </div>
                <div className={styles.label}>Foundry利用企業数</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.num}>
                  80<small>%</small>
                </div>
                <div className={styles.label}>Fortune 500における採用率</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.num}>
                  11<small>K+</small>
                </div>
                <div className={styles.label}>モデルカタログ数</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.num}>
                  36<small>%</small>
                </div>
                <div className={styles.label}>Agentic Retrieval導入時の関連性向上</div>
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/">
                Microsoft Foundry 製品ページ
              </Ext>{" "}
              /{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-boost-response-relevance-by-36-with-agentic-retrieval/4470720">
                Foundry IQ: boost response relevance by 36%
              </Ext>
            </p>
          </header>

          <section className={styles.section} id="sec-intro-body">
            <p>
              本ガイドは{" "}
              <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/">
                Microsoft Foundry 製品ページ
              </Ext>{" "}
              と{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                Microsoft Foundry 公式ドキュメント「Microsoft Foundryとは」
              </Ext>{" "}
              の内容をベースに、2026年7月時点までの公式ブログ・Microsoft Learn・Microsoft Build
              2026の発表内容・および国際的に著名な開発者やコミュニティの投稿を横断的に調査し、実務で使えるベストプラクティスとしてブラッシュアップしたものです。
            </p>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <div className={styles.calloutTitle}>⚠ 実装前に必ず確認</div>
              <p>
                Microsoft
                FoundryはAIの進化速度が非常に速いプロダクトであり、プレビュー機能の名称やRBACロール名なども頻繁に変更されます。本ガイドの各セクションには根拠となる一次情報のURLを付記していますので、実装前に必ず最新のMicrosoft
                Learnドキュメントで仕様を再確認してください。
              </p>
            </div>
            <p>
              <strong>対象読者</strong>: Azure OpenAI / Azure AI
              Foundryの基本を理解しており、これからエージェント型AIシステムを本番環境まで持っていきたいアプリケーション開発者、MLエンジニア、プラットフォームエンジニア、ITアーキテクト。
            </p>
          </section>

          <section className={styles.section} id="sec-0">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 0
            </div>
            <h2>重要な前提知識：Foundryのリブランディング</h2>
            <p>
              質問文にある2つのURLはいずれも現在生きていますが、内容は大きくアップデートされています。まず押さえておくべき変遷は次の通りです。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>時期</th>
                    <th>ブランド名</th>
                    <th>ポータル</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>〜2024年</td>
                    <td>Azure AI Studio</td>
                    <td>旧ポータル</td>
                  </tr>
                  <tr>
                    <td>2024年後半〜2026年前半</td>
                    <td>Azure AI Foundry</td>
                    <td>Foundry (classic) ポータル</td>
                  </tr>
                  <tr>
                    <td>2026年（現行）</td>
                    <td>
                      <strong>Microsoft Foundry</strong>
                    </td>
                    <td>
                      新 Foundry ポータル（<Ext href="https://ai.azure.com">ai.azure.com</Ext>）
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <code className={styles.inlineCode}>azure-ai-services</code>{" "}
              というAzureサービスブランドも
              <strong>Foundry Tools</strong> に統合されました。Hub＋Azure OpenAI＋Azure AI
              Servicesという複数リソースモデルは、単一の
              <strong>Foundryリソース（プロジェクトを内包）</strong> に統合されています。またAgent
              APIも「Assistants API（Agents v0.5/v1、Threads/Messages/Runs/Assistants
              という概念）」から「
              <strong>
                Responses API（Agents v2、Conversations/Items/Responses/Agent Versions という概念）
              </strong>
              」へ刷新されました。
            </p>

            <p>
              この用語マッピングを知らずに古い記事やAI生成コードを参考にすると、廃止予定のAPIを使い続けてしまうリスクがあるため、実務上最初に理解しておくべき最重要ポイントです。
            </p>

            <h3>用語の新旧対応表</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>観点</th>
                    <th>旧</th>
                    <th>新</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ブランド</td>
                    <td>Azure AI Studio / Azure AI Foundry</td>
                    <td>Microsoft Foundry</td>
                  </tr>
                  <tr>
                    <td>ブランド</td>
                    <td>Azure AI Services</td>
                    <td>Foundry Tools</td>
                  </tr>
                  <tr>
                    <td>ポータル</td>
                    <td>Foundry (classic)</td>
                    <td>Foundry（新）</td>
                  </tr>
                  <tr>
                    <td>Agent API</td>
                    <td>Assistants API (Agents v0.5/v1)</td>
                    <td>Responses API (Agents v2)</td>
                  </tr>
                  <tr>
                    <td>APIバージョニング</td>
                    <td>
                      月次の <code className={styles.inlineCode}>api-version</code> パラメータ
                    </td>
                    <td>
                      <code className={styles.inlineCode}>/openai/v1/</code> の安定ルート
                    </td>
                  </tr>
                  <tr>
                    <td>リソースモデル</td>
                    <td>Hub + Azure OpenAI + Azure AI Services</td>
                    <td>Foundryリソース（単一、プロジェクト内包）</td>
                  </tr>
                  <tr>
                    <td>SDK</td>
                    <td>
                      複数パッケージ（<code className={styles.inlineCode}>azure-ai-inference</code>
                      等）、5つ以上のエンドポイント
                    </td>
                    <td>
                      統合プロジェクトクライアント（
                      <code className={styles.inlineCode}>azure-ai-projects</code> 2.x）+{" "}
                      <code className={styles.inlineCode}>OpenAI()</code>
                      、単一プロジェクトエンドポイント
                    </td>
                  </tr>
                  <tr>
                    <td>用語</td>
                    <td>Threads, Messages, Runs, Assistants</td>
                    <td>Conversations, Items, Responses, Agent Versions</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                What is Microsoft Foundry? – Microsoft Learn
              </Ext>
            </p>

            <p>
              既存のAzure
              OpenAIリソースを持っている場合は、エンドポイントやAPIキー、既存の状態を保持したまま{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/upgrade-azure-openai">
                Foundryリソースへアップグレード
              </Ext>{" "}
              することが可能です。Hubベースのプロジェクトを使っている場合は{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry-classic/what-is-foundry">
                Foundry (classic) ポータル
              </Ext>{" "}
              からアクセスできますが、Microsoftは新規投資をすべて新しいFoundryプロジェクト体験に集中させているため、新規構築は新ポータル・新リソースモデルを前提に設計することを強く推奨します。
            </p>
          </section>

          <section className={styles.section} id="sec-1">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 1
            </div>
            <h2>Microsoft Foundryとは何か</h2>
            <p>
              公式には「エンタープライズ向けAIオペレーション、モデル構築者、アプリケーション開発のための統合Azure
              PaaS」と定義されています。単なるモデルホスティングサービスではなく、
              <strong>エージェント、モデル、ツールを単一の管理グループの下に統合</strong>
              し、トレーシング・モニタリング・評価・エンタープライズ向けのセットアップ構成を最初から組み込んでいる点が特徴です。RBAC・ネットワーキング・ポリシーもすべて単一のAzureリソースプロバイダー名前空間の下で一元管理されます。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                What is Microsoft Foundry? – Microsoft Learn
              </Ext>
            </p>

            <p>
              Foundry Blogを率いるTina Schuchman（Microsoft
              Foundry担当コーポレートバイスプレジデント）は、Build
              2026のセッションで「単一のエージェントを作るのは簡単だが、その周辺（発見性、隔離、可観測性、デプロイ）こそが本当の作業になる」と述べ、これはちょうど10年前にマイクロサービスが直面した転換点と同じだと表現しています。Microsoft
              Agent Platformは、まさにこの「周辺の作業」のために設計されたプラットフォームです。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://devblogs.microsoft.com/foundry/agent-service-build2026/">
                Build and run agents at scale with Microsoft Foundry at Build 2026 – Foundry Blog
              </Ext>
            </p>

            <p>
              国際的な技術メディアInfoQは、Microsoft
              Foundryを「AIエージェントが実験から本番システムへ移行する場所」と位置づけ、Foundry担当のNick
              Bradyのブログを引用しながら、単なる新モデルのエンドポイント追加ではなく「ランタイム、ツール、メモリ、グラウンディング、モデル、可観測性、ガバナンス」という本番運用に必要な7要素をまとめて提供する点が今回のBuild
              2026における最大のアップデートだと分析しています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://www.infoq.com/news/2026/06/microsoft-foundry-agents/">
                Microsoft Foundry Adds Runtime, Tooling, and Governance for Production Agents –
                InfoQ
              </Ext>
            </p>

            <p>
              この「ランタイム／ツール／メモリ／グラウンディング／モデル／可観測性／ガバナンス」という7つの柱は、そのまま本ガイドの構成（4〜10章）の骨格にもなっています。
            </p>

            <h3>
              <span className={styles.hNum}>1.1</span>全体アーキテクチャ
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_1} />
              <div className={styles.diagramCaption}>図1: Microsoft Foundry 全体アーキテクチャ</div>
            </div>
            <p className={styles.source}>
              図の根拠:{" "}
              <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/">
                Microsoft Foundry 製品ページ
              </Ext>{" "}
              の構成要素（Models / Agent Service and frameworks / Knowledge and Tools /
              Observability and trust / Local and edge）を統合
            </p>

            <h3>
              <span className={styles.hNum}>1.2</span>誰がFoundryを使うべきか
            </h3>
            <p>公式ドキュメントは3つの主要な利用者像を挙げています。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>利用者像</th>
                    <th>主なゴール</th>
                    <th>最初の入口</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>アプリケーション開発者</td>
                    <td>エージェント・モデル・ツールを使ったAI搭載製品の構築</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code">
                        クイックスタート
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>MLエンジニア／データサイエンティスト</td>
                    <td>モデルのファインチューニング、評価の実行、デプロイ管理</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/fine-tuning-considerations">
                        ファインチューニング
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>IT管理者／プラットフォームエンジニア</td>
                    <td>AIリソースのガバナンス、ポリシー適用、チーム横断のアクセス管理</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview">
                        Foundry Control Plane
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                What is Microsoft Foundry? – Microsoft Learn
              </Ext>
            </p>

            <p>
              なお公式サイトによれば、Foundryは既に8万以上の企業・デジタルネイティブ企業（Fortune
              500の80%を含む）で利用されており、モデルカタログは11,000以上、エンタープライズ検索クエリは1日あたり30億件に達しています。数値の規模はマーケティング資料であることを踏まえて参考程度に捉えつつも、エンタープライズでの採用が急速に進んでいる事実は押さえておくべきです。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/">
                Microsoft Foundry 製品ページ
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-2">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 2
            </div>
            <h2>ステップバイステップ・セットアップ</h2>

            <h3>
              <span className={styles.hNum}>STEP 1</span>Azureアカウントの準備
            </h3>
            <p>
              Foundryの探索自体はAzureアカウントなしで可能ですが、実際にエージェントを構築・デプロイするにはAzureサブスクリプションが必要です。
            </p>

            <h3>
              <span className={styles.hNum}>STEP 2</span>Foundryリソースとプロジェクトの作成
            </h3>
            <p>
              新しいFoundryリソースモデルでは、1つのFoundryリソースの下に複数の「プロジェクト」を作成できます。プロジェクト単位でRBAC・ネットワーク・接続先を分離できるため、
              <strong>チームや環境（Dev/Test/Prod）ごとにプロジェクトを分ける</strong>
              のが基本方針です。
            </p>

            <h3>
              <span className={styles.hNum}>STEP 3</span>SDKのインストールと認証
            </h3>
            <p>
              <code className={styles.inlineCode}>DefaultAzureCredential</code>（Microsoft Entra
              ID認証）を使い、APIキーの手動管理を避けるのがセキュリティ上のベストプラクティスです（詳細は7章）。
            </p>

            <h3>
              <span className={styles.hNum}>STEP 4</span>最初のAPI呼び出し
            </h3>
            <div className={styles.codeBar}>python</div>
            <div className={`${styles.codeBlock} ${styles.hasCodeBar}`}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span>
                <span className={styles.cs}> azure.identity </span>
                <span className={styles.ck}>import</span>
                <span className={styles.cv}> DefaultAzureCredential</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>from</span>
                <span className={styles.cs}> azure.ai.projects </span>
                <span className={styles.ck}>import</span>
                <span className={styles.cv}> AIProjectClient</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  # 形式: &quot;https://resource_name.ai.azure.com/api/projects/project_name&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>PROJECT_ENDPOINT</span> ={" "}
                <span className={styles.cs}>&quot;your_project_endpoint&quot;</span>
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>project</span> = AIProjectClient(
              </div>
              <div className={styles.codeLine}>
                {" "}
                endpoint=<span className={styles.cv}>PROJECT_ENDPOINT</span>,
              </div>
              <div className={styles.codeLine}> credential=DefaultAzureCredential(),</div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>openai</span> = project.get_openai_client()
              </div>
              <div className={styles.codeLine}></div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>response</span> = openai.responses.create(
              </div>
              <div className={styles.codeLine}>
                {" "}
                model=<span className={styles.cs}>&quot;gpt-5-mini&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                input=
                <span className={styles.cs}>
                  &quot;What is the size of France in square miles?&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>print(response.output_text)</div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                What is Microsoft Foundry? – Microsoft Learn
              </Ext>
              （Python/C#/TypeScript/REST全パターンが公式ページに掲載）
            </p>

            <h3>
              <span className={styles.hNum}>2.1</span>リクエストのライフサイクル
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_2} />
              <div className={styles.diagramCaption}>図2: 最初のAPI呼び出しのシーケンス</div>
            </div>

            <h3>
              <span className={styles.hNum}>STEP 5</span>開発サーフェスの選択
            </h3>
            <p>Foundryは複数の開発サーフェスをサポートしているため、目的に応じて入口を選びます。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>やりたいこと</th>
                    <th>開始地点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>コードからモデルを呼び出す</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code">
                        クイックスタート：最初のAPI呼び出し
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>ツールとメモリを持つエージェントを構築する</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow">
                        Agent Serviceの概要
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>ブラウザでモデルを試す</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds">
                        Foundryポータルのプレイグラウンド
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>モデルを大規模にデプロイ・管理する</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview">
                        Foundry Modelsの概要
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>VS Codeで開発する</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/get-started-projects-vs-code">
                        Foundry for VS Code
                      </Ext>
                    </td>
                  </tr>
                  <tr>
                    <td>ガバナンスとセキュリティを設定する</td>
                    <td>
                      <Ext href="https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview">
                        Foundry Control Plane
                      </Ext>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                What is Microsoft Foundry? – Microsoft Learn
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-3">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 3
            </div>
            <h2>モデル選定とModel Router戦略</h2>

            <h3>
              <span className={styles.hNum}>3.1</span>モデルファミリーの選び方
            </h3>
            <p>
              Foundryは1,900以上（カタログ全体では11,000以上）のモデルをMicrosoft、OpenAI、Anthropic、Mistral、xAI、Meta、DeepSeek、Hugging
              Faceなどから提供しています。まず主要ファミリーの使い分けを押さえましょう。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モデルファミリー</th>
                    <th>最適な用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GPT-5</td>
                    <td>最も高性能。複雑な推論、マルチステップタスク、マルチモーダルシナリオ</td>
                  </tr>
                  <tr>
                    <td>GPT-4.1</td>
                    <td>本番ワークロードにおける性能とコストのバランスが最良</td>
                  </tr>
                  <tr>
                    <td>GPT-4.1 mini</td>
                    <td>最速。低レイテンシ・高スループットが求められるシナリオ</td>
                  </tr>
                  <tr>
                    <td>Claude</td>
                    <td>高度な推論、コード生成、マルチモーダルタスク</td>
                  </tr>
                  <tr>
                    <td>Grok</td>
                    <td>推論、コーディング、データ抽出</td>
                  </tr>
                  <tr>
                    <td>Mistral</td>
                    <td>コード生成、多言語対応、汎用チャット</td>
                  </tr>
                  <tr>
                    <td>DeepSeek-R1</td>
                    <td>オープンウェイトの大規模推論</td>
                  </tr>
                  <tr>
                    <td>Phi-4</td>
                    <td>小型言語モデル。オンデバイス・リソース制約環境向け</td>
                  </tr>
                  <tr>
                    <td>Meta Llama</td>
                    <td>オープンモデル。カスタマイズ・ファインチューニング向け</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                What is Microsoft Foundry? – Microsoft Learn
              </Ext>{" "}
              / モデル選定の詳細は{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/model-choice-guide">
                GPT-5 vs GPT-4.1 モデル選択ガイド
              </Ext>
            </p>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>ベストプラクティス</div>
              <p>
                特定モデルへの直接依存を避け、抽象化レイヤー（プロバイダー抽象化）を設けることで、将来のモデル移行時にアプリケーションコードを変更せずに済む設計にします。これはAzure
                Well-Architected
                Frameworkでも「将来のモデル移行の影響を最小化する抽象化を設計する」という原則として明記されています。
              </p>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/well-architected/ai/application-design">
                Application Design for AI Workloads – Azure Well-Architected Framework
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>3.2</span>Model Routerによるコストとパフォーマンスの両立
            </h3>
            <p>
              Model
              Routerは、アプリケーションとモデル群の間に位置する推論レイヤーで、プロンプトの複雑さ・タスク種別・必要な能力を分析し、実行時に最適なモデルへ自動的にルーティングします。アプリケーションコード側の変更は不要です。
            </p>

            <p>
              コミュニティの実測では、Balanced・Cost・Qualityの3モードでそれぞれ4.5%、4.7%、14.2%のコスト削減が確認されており、興味深いことに「Quality」モードが最も高い削減率を記録しています。これは、複雑なタスクだけ上位モデルに回しつつ、単純なプロンプトに対しては高速・低コストなモデルを選ぶことで、品質を落とさずコストを最適化できるためです。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azuredevcommunityblog/optimising-ai-costs-with-microsoft-foundry-model-router/4494776">
                Optimising AI Costs with Microsoft Foundry Model Router – Microsoft Community Hub
              </Ext>
            </p>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>
                実装上の注意点（開発者コミュニティからの実践知）
              </div>
              <ul>
                <li>
                  レート制限（TPM）はModel
                  Router全体に対して設定し、配下の個別モデルごとには設定しない。
                </li>
                <li>ルーティングモード変更の反映には最大5分かかる場合がある。</li>
                <li>
                  Anthropic（Claude）モデルをルーティング対象に含めるには、自分のFoundryリソースに個別にデプロイしておく必要がある。
                </li>
              </ul>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://medium.com/@badrkacimi/the-model-router-explained-intelligent-cost-performance-optimization-in-azure-ai-foundry-c2614a403471">
                The Model Router Explained – Badr Kacimi, Medium
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-4">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 4
            </div>
            <h2>エージェント開発のベストプラクティス</h2>

            <h3>
              <span className={styles.hNum}>4.1</span>Prompt Agent vs Hosted Agent vs Copilot Studio
              の選択
            </h3>
            <p>Foundry Agent Serviceは大きく分けて次の2つのランタイムを提供します。</p>
            <ul>
              <li>
                <strong>Prompt Agent（宣言的エージェント）</strong>:
                ポータルまたはSDK/RESTでプロンプトを定義するだけで、実行はFoundryが行う。アプリケーションコードや計算リソースの管理が不要。
              </li>
              <li>
                <strong>Hosted Agent（ホスト型エージェント）</strong>: Microsoft Agent
                Framework、LangGraph、OpenAI Agents SDK、Anthropic Agent SDK、GitHub Copilot
                SDK、あるいは独自コードで書いたエージェントをコンテナ化し、Foundryが管理エンドポイント・スケーリング・アイデンティティ・可観測性込みで実行する。
              </li>
            </ul>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/overview">
                What is Microsoft Foundry Agent Service? – Microsoft Learn
              </Ext>
            </p>

            <p>
              2026年4月22日のリフレッシュ版では、Hosted
              Agentはセッション単位でハイパーバイザーレベルの分離（Azureデータセンターでテナント間VMを分離するのと同じ境界）を実現しており、各セッションが専用の計算・メモリ・ファイルシステムを持ちます。開発コミュニティのレビューでは「IDやアイソレーション、可観測性、スケールtoゼロの料金体系が、初期デプロイを遅らせていたインフラ判断の大部分を取り除く」と評価されています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://byteiota.com/foundry-agent-service-ga/">
                Microsoft Foundry Agent Service Is GA – byteiota
              </Ext>
              ,{" "}
              <Ext href="https://www.bighatgroup.com/blog/microsoft-foundry-hosted-agents-enterprise-guide-april-2026/">
                Microsoft Foundry Hosted Agents: What Enterprise IT Should Do Now – Big Hat Group
              </Ext>
            </p>

            <p>以下は、実務でどのランタイムを選ぶべきかの判断フローです。</p>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_3} />
              <div className={styles.diagramCaption}>
                図3: エージェント実行ランタイムの意思決定フロー
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://www.bighatgroup.com/blog/microsoft-foundry-hosted-agents-enterprise-guide-april-2026/">
                Microsoft Foundry Hosted Agents: What Enterprise IT Should Do Now – Big Hat Group
              </Ext>{" "}
              の意思決定フレームワークを基に図解
            </p>

            <h3>
              <span className={styles.hNum}>4.2</span>
              ツール利用のベストプラクティス（公式ガイダンス）
            </h3>
            <p>
              Microsoft Learnの「Tool best practices for Microsoft Foundry Agent
              Service」は、以下を明確に推奨しています。
            </p>
            <ol>
              <li>
                <strong>
                  <code className={styles.inlineCode}>tool_choice</code> で決定論的な制御を行う
                </strong>
                : モデルにツール選択を委ねきらず、必要な場面では明示的に制御する。
              </li>
              <li>
                <strong>指示にツールの目的を明記する</strong>:
                複数のツールが重複する機能を持つ場合は、「社内コンテンツにはWeb検索よりFile
                Searchを優先する」といった判断ルールを指示に含める。
              </li>
              <li>
                <strong>ツール出力は信頼しない</strong>:
                ツールの戻り値は「未検証の入力」として扱い、重要な値は行動を起こす前に検証する。
              </li>
              <li>
                <strong>最小限の情報だけを送信する</strong>:
                タスク完了に必要な情報のみをツールに渡す。
              </li>
              <li>
                <strong>秘密情報をプロンプトやログに含めない</strong>:
                キー・トークン・資格情報をプロンプトに埋め込まない、トレースやアプリログにも記録しない。
              </li>
              <li>
                <strong>トレースを確認する</strong>:
                エージェントがいつどのツールを呼んだか、入出力に問題がないかをランのトレースで確認する。
              </li>
            </ol>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-best-practice">
                Tool best practices for Microsoft Foundry Agent Service – Microsoft Learn
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>4.3</span>メモリ機能の活用
            </h3>
            <p>
              Build 2026でパブリックプレビューとなったFoundry Agent
              Serviceのメモリ機能は3種類あります。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>メモリ種別</th>
                    <th>役割</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Procedural memory（手続き記憶）</td>
                    <td>実行を重ねるごとに「作業のやり方」を学習する（発言内容だけでなく）</td>
                  </tr>
                  <tr>
                    <td>User memory（ユーザー記憶）</td>
                    <td>
                      セッションを跨いだ好みや事実を記憶する（例：「乳製品アレルギーがある」）
                    </td>
                  </tr>
                  <tr>
                    <td>Session memory（セッション記憶）</td>
                    <td>単一の会話スレッド内の文脈を維持する</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Tau-benchの初期結果では、Procedural
              memoryの導入によりタスク成功率が絶対値で7〜14ポイント向上し、コストはベースラインとほぼ変わらないと報告されています。
              <strong>
                まずはテスト用エージェントでメモリを有効化し、タスク成功率・ツール呼び出し回数・トークン使用量を有効化前後で比較する
              </strong>
              ことが推奨アクションです。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026/">
                What's new in Microsoft Foundry | Build Edition – Foundry Blog
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>4.4</span>プロンプト設計と非決定性への向き合い方
            </h3>
            <div className={styles.quoteBlock}>
              「あいまいで抽象度の高い指示は、たいてい良い結果を生まない」— Scott
              Hanselman（Microsoft VP, 開発者コミュニティ担当）
            </div>
            <p>
              国際的に著名なMicrosoftの開発者コミュニティ担当バイスプレジデントであるScott
              Hanselmanは、Software Engineering
              Radioのインタビューで、エージェント型ループの持つ曖昧さと非決定性について上記のように述べ、意図を明確に表現し、モデルを能動的にステアリング（誘導）する必要性を強調しています。また、基礎的な知識（fundamentals）を理解していることが、より良い計画を立て、モデルに何を尋ねるべきかを知る助けになるとも指摘しており、経験レベルに応じてエージェントとの向き合い方を変えるべきだという実践的な示唆でもあります。
            </p>
            <p>
              Foundry上でエージェントを設計する際も、この教訓はそのまま当てはまります。指示（instructions）は「何をしてほしいか」だけでなく「どう判断してほしいか」まで具体的に書き下し、ツールの使い分けルールやエラー時の振る舞いまで明文化することで、モデルの非決定性に起因するブレを最小化できます。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://se-radio.net/2026/03/se-radio-711-scott-hanselman-on-ai-assisted-development-tools/">
                SE Radio 711: Scott Hanselman on AI-Assisted Development Tools
              </Ext>
            </p>

            <p>
              なお、Microsoft CTOのKevin
              Scottは同時期のインタビューで、エージェント利用の急拡大を認めつつも「現時点では推論能力にオーバーハング（過剰な期待と実力のギャップ）がある」との認識を示しており、モデル性能の急速な向上を前提にしすぎず、8章のガードレールや9章の可観測性のような防御的な設計を組み合わせることの重要性を裏付けています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://www.aol.com/microsoft-cto-says-number-people-203002589.html">
                Microsoft's big event was all about the 'explosion' of AI agents
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-5">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 5
            </div>
            <h2>マルチエージェント・オーケストレーション</h2>

            <h3>
              <span className={styles.hNum}>5.1</span>Microsoft Agent Frameworkの位置づけ
            </h3>
            <p>
              Microsoft Agent
              Framework（MAF）は、AutoGenの「シンプルなエージェント抽象化」とSemantic
              Kernelの「エンタープライズ機能（セッションベースの状態管理、型安全性、ミドルウェア、テレメトリ）」を統合した後継フレームワークです。両者を開発していたチーム自身が作った直系の後継であり、さらにグラフベースのワークフローによる明示的なマルチエージェント制御を追加しています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/agent-framework/overview/">
                Microsoft Agent Framework Overview – Microsoft Learn
              </Ext>
            </p>

            <p>
              MAFは公式に以下のオーケストレーションパターンを組み込みでサポートしています（人間参加型のツール承認や情報リクエストによる一時停止もサポート）。
            </p>

            <h3>
              <span className={styles.hNum}>5.2</span>4つの基本オーケストレーションパターン
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_4} />
              <div className={styles.diagramCaption}>
                図4: マルチエージェント・オーケストレーションの4パターン
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/">
                Workflow orchestrations in Agent Framework – Microsoft Learn
              </Ext>
              ,{" "}
              <Ext href="https://github.com/microsoft/agent-framework">
                GitHub - microsoft/agent-framework
              </Ext>
            </p>

            <p>
              .NETコミュニティの実装例では、リサーチャー・クリティック・ライターという3つの異なるシステムプロンプトを持つエージェントを、設定可能な深さのフィードバックループで統括するオーケストレータクラスをわずか200行程度のC#コードで実装できることが示されています。要点は「フレームワークそのものより、誰がいつ誰を呼ぶかという調整ロジックをどう設計するか」にあるという指摘は、マルチエージェント設計における本質的な教訓です。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://www.devleader.ca/2026/03/25/multiagent-orchestration-in-microsoft-agent-framework-in-c">
                Multi-Agent Orchestration in Microsoft Agent Framework in C# – DevLeader
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>5.3</span>サブエージェント指示設計のベストプラクティス
            </h3>
            <p>
              Microsoft Copilot
              Studioのマルチエージェントガイダンスは、Foundry上のエージェント設計にもそのまま適用できる重要な注意点を挙げています。
            </p>
            <ul>
              <li>
                <strong>1ターンにつき1エージェントだけがユーザーに応答する</strong>
                ことを親エージェントの指示に明記する（例：「あなたがユーザーと会話する唯一のエージェントです。すべての子エージェントの結果を1つの応答にまとめてください」）。
              </li>
              <li>
                <strong>
                  サブエージェントには「自分はサブエージェントである」と明示的に伝える
                </strong>
                。これを怠ると、サブエージェントは単独のエージェントとして振る舞い、ユーザーへ直接（重複した、または断片的な）メッセージを送ってしまう。
              </li>
              <li>
                マルチエージェント構成は、情報源が本質的に異なる場合にのみ価値を持つ。単純なタスクを無理に複数エージェントへ分割しない。
              </li>
            </ul>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns">
                Multi-agent orchestration patterns and best practices – Microsoft Copilot Studio,
                Microsoft Learn
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-6">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 6
            </div>
            <h2>RAGとナレッジグラウンディング（Foundry IQ）</h2>

            <h3>
              <span className={styles.hNum}>6.1</span>Foundry IQとAzure AI Searchの関係
            </h3>
            <p>
              Foundry IQは、Azure AI
              Searchの進化形として位置づけられる統合ナレッジ層です。複数のナレッジソース（社内文書、SharePoint、Fabric、Web検索など）をエージェントから見て単一の「ナレッジベース」として抽象化し、権限を意識したグラウンディングを提供します。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview">
                Retrieval Augmented Generation (RAG) in Azure AI Search – Microsoft Learn
              </Ext>
            </p>

            <p>
              従来のRAGが「1回のクエリで検索して回答する」パターンだったのに対し、
              <strong>エージェント型検索（Agentic Retrieval）</strong>
              はLLMによるクエリプランニングを組み込み、複雑な質問を複数の焦点を絞ったサブクエリへ分解し、並列実行した上で構造化されたグラウンディングデータを返します。マイクロソフトの実測では、このAgentic
              Retrievalの導入により応答の関連性が36%向上したと報告されています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-boost-response-relevance-by-36-with-agentic-retrieval/4470720">
                Foundry IQ: boost response relevance by 36% with agentic retrieval – Microsoft
                Community Hub
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>6.2</span>RAGパイプラインのシーケンス
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_5} />
              <div className={styles.diagramCaption}>
                図5: Foundry IQによるエージェント型検索（Agentic Retrieval）のシーケンス
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation">
                Retrieval augmented generation (RAG) and indexes in Microsoft Foundry – Microsoft
                Learn
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>6.3</span>RAG品質評価の「トライアド」
            </h3>
            <p>
              RAGエージェントを本番投入する前に、reference-freeな「RAGトライアド評価器」で品質を検証するのが公式に推奨されるベストプラクティスです。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>評価軸</th>
                    <th>評価内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Retrieval（検索）</td>
                    <td>検索されたコンテキストチャンクはクエリにどれだけ関連しているか</td>
                  </tr>
                  <tr>
                    <td>Groundedness（根拠性）</td>
                    <td>
                      生成された応答は検索結果に基づいており、捏造（ハルシネーション）がないか
                    </td>
                  </tr>
                  <tr>
                    <td>Relevance（関連性）</td>
                    <td>検索・生成の結果、ユーザーの質問に的確に答えられているか</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              特に重要度が高いのは <strong>Groundedness</strong> と <strong>Relevance</strong>
              の2つで、これらをまず継続的に監視することが公式ブログで推奨されています。Ground
              truth（正解データ）を用意できる高度なシナリオでは、検索パラメータをXDCGやMax
              Relevanceといった情報検索の標準指標で「スイープ（掃引）」しながらチューニングする手法も紹介されています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/the-future-of-ai-evaluating-and-optimizing-custom-rag-agents-using-azure-ai-foun/4455215">
                Evaluating and Optimizing RAG Agents with Azure AI Foundry
              </Ext>
              ,{" "}
              <Ext href="https://devblogs.microsoft.com/foundry/how-to-debug-and-optimize-rag-agents-in-azure-ai-foundry/">
                How to debug and optimize RAG agents in Microsoft Foundry – Foundry Blog
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-7">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 7
            </div>
            <h2>セキュリティとネットワーク分離</h2>

            <h3>
              <span className={styles.hNum}>7.1</span>最小権限アクセスとIDの原則
            </h3>
            <p>Azure AIセキュリティのベストプラクティスは、次の3点を柱にしています。</p>
            <ol>
              <li>
                <strong>プライベートエンドポイントでネットワークを分離する</strong>:
                パブリックエンドポイントを無効化し、アクセスを仮想ネットワーク内に限定する。
              </li>
              <li>
                <strong>最小権限のRBACを構成する</strong>:
                プロジェクトまたはワークスペース単位で組み込みロールを割り当て、Microsoft Entra
                Agent IDを使ってエージェントのアイデンティティにスコープの狭い短命トークンを与える。
              </li>
              <li>
                <strong>承認済みモデルのみをデプロイする</strong>:
                モデルレジストリでモデルの出自・検証状況・承認履歴を追跡し、デプロイ前に自動スキャンで整合性を検証する。
              </li>
            </ol>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/security/fundamentals/ai-security-best-practices">
                Azure AI security best practices – Microsoft Learn
              </Ext>
            </p>

            <div className={styles.callout}>
              <p>
                <strong>
                  APIキーの利用は避け、マネージドID（
                  <code className={styles.inlineCode}>DefaultAzureCredential</code>
                  など）による認証をデフォルトにする
                </strong>
                ことが、資格情報のローテーション管理を不要にする最も効果的な一手です。
              </p>
            </div>

            <h3>
              <span className={styles.hNum}>7.2</span>Foundry RBACロール（名称変更に注意）
            </h3>
            <p>
              2026年に入り、FoundryのRBACロールは名称が変更されています。役割IDとコア権限自体は変わっていませんが、ドキュメントやチュートリアルによって新旧の名称が混在している点に注意してください。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>現行名</th>
                    <th>旧名</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Foundry User</td>
                    <td>Azure AI User</td>
                  </tr>
                  <tr>
                    <td>Foundry Owner</td>
                    <td>Azure AI Owner</td>
                  </tr>
                  <tr>
                    <td>Foundry Account Owner</td>
                    <td>Azure AI Account Owner</td>
                  </tr>
                  <tr>
                    <td>Foundry Project Manager</td>
                    <td>Azure AI Project Manager</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks">
                Set up private networking for Foundry Agent Service – Microsoft Learn
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>7.3</span>マネージドネットワーク分離モード
            </h3>
            <p>
              FoundryのHub/リソースには <code className={styles.inlineCode}>managedNetwork</code>
              プロパティがあり、3つの分離モードから選択します。本番環境で機密データを扱う場合の目標状態は{" "}
              <strong>AllowOnlyApprovedOutbound</strong> です。
            </p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>モード</th>
                    <th>内容</th>
                    <th>推奨用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Disabled</td>
                    <td>すべてのアウトバウンドが開放</td>
                    <td>検証・PoC以外では非推奨</td>
                  </tr>
                  <tr>
                    <td>AllowInternetOutbound</td>
                    <td>
                      コンピュートがモデルのダウンロードやパッケージ取得のためインターネットに到達可能
                    </td>
                    <td>開発環境</td>
                  </tr>
                  <tr>
                    <td>AllowOnlyApprovedOutbound</td>
                    <td>明示的に承認されたFQDN以外へのアウトバウンドをすべて遮断</td>
                    <td>機密データを扱う本番Hub（推奨）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://protego.me/blog/azure-ai-foundry-security-threat-model-rbac-governance">
                Azure AI Foundry Security: Threat Model, RBAC, and Data Governance Controls –
                Protego
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>7.4</span>ネットワーク分離アーキテクチャ
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_6} />
              <div className={styles.diagramCaption}>
                図6: インバウンド／アウトバウンド分離とBYO VNet構成
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link">
                How to configure network isolation for Microsoft Foundry – Microsoft Learn
              </Ext>
              ,{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks">
                Set up private networking for Foundry Agent Service – Microsoft Learn
              </Ext>
            </p>

            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <div className={styles.calloutTitle}>
                運用上のトラブルシューティング知見（公式ドキュメントより）
              </div>
              <ul>
                <li>
                  Standard
                  Agentデプロイでないと、ネットワーク分離されたプロジェクトでエージェントの起動が失敗する。
                </li>
                <li>サブネットのIPアドレス残数不足がエージェント起動失敗の原因になりうる。</li>
                <li>
                  エージェントがMCPツールにアクセスできない場合、MCPツールがアクセスするすべてのAzureサービスにプライベートエンドポイントが存在するか確認する。
                </li>
              </ul>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/how-to/configure-private-link.md">
                azure-ai-docs: configure-private-link.md – GitHub
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-8">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 8
            </div>
            <h2>ガードレールと責任あるAI</h2>

            <h3>
              <span className={styles.hNum}>8.1</span>4つの介入ポイント
            </h3>
            <p>
              Foundryのガードレール機構は、Azure AI Content
              Safetyの分類モデルを活用し、リクエストのライフサイクル上の
              <strong>4つの介入ポイント</strong>でリスクを検出します。
            </p>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_7} />
              <div className={styles.diagramCaption}>
                図7: ガードレールの4つの介入ポイント（入力・ツール呼び出し・ツール応答・出力）
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview">
                Guardrails and controls overview in Microsoft Foundry – Microsoft Learn
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>8.2</span>各コントロールの役割
            </h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コントロール</th>
                    <th>目的</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Prompt Shields + Spotlighting</td>
                    <td>
                      直接的なプロンプトインジェクションだけでなく、検索結果やドキュメントに埋め込まれた
                      <strong>間接的な</strong>インジェクション攻撃を検出する
                    </td>
                  </tr>
                  <tr>
                    <td>Task Adherence（タスク遵守性）</td>
                    <td>
                      計画されたツール呼び出しがユーザーの意図と一致しているかを検証し、不一致があれば実行をブロックまたは人間へエスカレーションする
                    </td>
                  </tr>
                  <tr>
                    <td>コンテンツフィルタ</td>
                    <td>
                      ヘイト、暴力、性的コンテンツ、自傷などのカテゴリをリスクとして検出する（既定で全モデルに適用、音声モデルは除く）
                    </td>
                  </tr>
                  <tr>
                    <td>PII検出 / 保護コンテンツ検出</td>
                    <td>出力に個人情報や著作権保護されたコンテンツが含まれていないかを確認する</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              ある開発者ブログは、この構成を「深層防御（defence in
              depth）」として整理しており、「Prompt Shieldsが正面玄関を守り、Task
              Adherenceがエージェントの行動を監視し、PII検出が出口をチェックする。単独の層では全てを防げないが、組み合わせることで多くをカバーできる」と表現しています。特にRAGパターンでは、検索対象のドキュメントに隠された指示文（「これまでの指示を無視してXXXしろ」など）を悪用する間接的プロンプトインジェクションへの対策として、Spotlightingの有効化が推奨されます。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://jameswestall.com/2026/01/13/content-safety-agents-task-adherence-prompt-shields/">
                Azure AI Content Safety for Agents: Task Adherence, Prompt Shields, and PII Filters
                – James Westall
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>8.3</span>ガイド付きセットアップの活用
            </h3>
            <p>
              Foundryポータルの「ガイド付きガードレール設定」では、次のような質問に答えるだけで推奨コントロールが提示されます。
            </p>
            <ul>
              <li>このエージェントは誰が使うか（信頼できる社内利用者か、不特定の外部利用者か）</li>
              <li>
                このエージェントは実世界に影響する行動（メール送信、レコード変更、外部サービス呼び出しなど）を取れるか
              </li>
              <li>このエージェントはコードを生成・変更・実行するか</li>
            </ul>
            <p>
              「実世界への行動を取れる」と回答すると、Task AdherenceとAction
              Validationが自動的に推奨コントロールへ追加されるなど、リスクベースでガードレールの構成を素早く決定できます。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/guardrails/guided-set-up">
                Configure guided guardrail set-up for an agent – Microsoft Learn
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-9">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 9
            </div>
            <h2>可観測性（トレーシング・評価・モニタリング）</h2>

            <h3>
              <span className={styles.hNum}>9.1</span>OpenTelemetryを中核とした設計思想
            </h3>
            <p>
              Foundryの可観測性はOpenTelemetry（OTel）標準の上に構築されており、Azure Monitor /
              Application Insightsと統合されています。LangChain、LangGraph、OpenAI Agents
              SDK、Microsoft Agent
              Frameworkなど主要フレームワーク横断でトレーシングがサポートされている点が特徴です。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/observability">
                Observability in Generative AI – Microsoft Learn
              </Ext>
            </p>

            <p>
              MicrosoftはCisco
              Outshiftと共同で、マルチエージェントシステム向けの新しいOpenTelemetryセマンティック規約（W3C
              Trace
              Contextに準拠）を提唱しており、ツール呼び出しや複数エージェント間の連携についても品質・パフォーマンス・安全性・コストの指標を一貫した形式で記録できるようにしています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept">
                Agent tracing in Microsoft Foundry (preview) – Microsoft Learn
              </Ext>
            </p>

            <div className={styles.quoteBlock}>
              「本番のAIエージェントが壊れているとき、その症状は行儀よく現れない。Teamsのチャットに貼られたスクリーンショットや、『昨日の実行はなぜ4倍のコストがかかったのか』という財務からの問い合わせという形で突然現れる」
            </div>
            <p>
              ある実務ブログはこう表現し、可観測性を「あればよい機能」ではなく「信頼性の土台」として扱うべきだと強調しています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://itnext.io/you-cant-debug-what-you-can-t-see-ai-observability-with-opentelemetry-microsoft-foundry-f90407b90e17">
                You Can't Debug What You Can't See: AI Observability with OpenTelemetry + Microsoft
                Foundry – itnext.io
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>9.2</span>可観測性パイプライン
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_8} />
              <div className={styles.diagramCaption}>
                図8: トレーシング〜評価〜継続的モニタリングのパイプライン
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry-classic/how-to/develop/trace-agents-sdk">
                Trace and Observe AI Agents in Microsoft Foundry – Microsoft Learn
              </Ext>
              ,{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup">
                Set Up Tracing for AI Agents in Microsoft Foundry – Microsoft Learn
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>9.3</span>実装のベストプラクティス
            </h3>
            <ul>
              <li>
                <strong>一貫したスパン属性を使う</strong>:
                すべてのエージェント・ツールで同じ属性名・形式を使うことで、後からのクエリや分析がしやすくなる。
              </li>
              <li>
                <strong>評価実行IDをトレースと相関させる</strong>:
                トレースデータと評価実行を結びつけ、品質とパフォーマンスの両面から分析できるようにする。
              </li>
              <li>
                <strong>機密情報を含めない</strong>:
                トレース属性に秘密情報を含めない。センシティブなコンテンツはリダクション（マスキング）する。
              </li>
            </ul>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept">
                Agent tracing in Microsoft Foundry (preview) – Microsoft Learn
              </Ext>
            </p>

            <p>
              現場のオペレーターの経験則としてよく語られるのは、「メトリクスは問題の兆候を見つけるために使うが、そこで止まらない。Groundednessスコアの低下やエラー率の上昇を見つけたら、ダッシュボードのスクリーンショットを撮って終わりにせず、トレースを使った根本原因調査に進むべきだ」という運用習慣です。品質・監視・トレーシングという3つの規律を繋げて初めて、AI運用は「稼働しているかどうか」ではなく「モデルやプロンプト、検索インデックスが変化し続ける中でも正確・安全・効率的・一貫した応答を返し続けられるか」という本質的な問いに答えられるようになります。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/monitoring--observability-in-microsoft-foundry-part-2-configuration-and-operatio/4532674">
                Monitoring &amp; Observability in Microsoft Foundry Part 2 – Microsoft Community Hub
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-10">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 10
            </div>
            <h2>コスト最適化とFinOps</h2>

            <h3>
              <span className={styles.hNum}>10.1</span>「トークン単価」から「タスク完了単価」へ
            </h3>
            <div className={styles.callout}>
              <p>
                <strong>
                  「最も重要なAI
                  FinOpsの指標はトークン単価ではなく、業務タスクを1件成功させるのにかかるコストである」
                </strong>
              </p>
            </div>
            <p>
              AzureのFinOps実践者による分析で最も重要な指摘は上記の一点です。1回のユーザー操作が、Azure
              OpenAI・Azure AI Search・Container Apps・API Management・Log
              Analytics・Storageなど複数サービスの課金を同時に発生させるため、「どのサブスクリプション・リソースグループ・サービスがコストを生んだか」という伝統的なクラウドコスト管理の問いだけでは不十分であり、成功／失敗・テナント・コストセンター・エージェント名・タスク種別・相関IDといったビジネスコンテキストをアプリケーション側で計装する必要があります。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://blog.bajonczak.com/ai-finops-on-azure/">
                AI FinOps on Azure: Costs, Tokens and Agents
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>10.2</span>実践的なコスト最適化戦略
            </h3>
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
                    <td>トークンを最小化する</td>
                    <td>
                      プロンプトに必要最小限のトークンだけを送り、出力トークンにも上限を設定する
                    </td>
                  </tr>
                  <tr>
                    <td>再利用とキャッシュ</td>
                    <td>
                      同一または類似クエリの結果をキャッシュし、静的コンテキストを毎回送信しない
                    </td>
                  </tr>
                  <tr>
                    <td>Model Routerの活用</td>
                    <td>
                      単純なクエリは小型・低コストモデルへ、複雑なクエリのみ上位モデルへ振り分ける
                    </td>
                  </tr>
                  <tr>
                    <td>プロジェクトタグでの按分</td>
                    <td>
                      Foundryプロジェクトは自動的にタグ付けされるため、コスト分析ビューでプロジェクト単位の支出を可視化する（Azure直販モデルが対象）
                    </td>
                  </tr>
                  <tr>
                    <td>TPM割り当ての段階的調整</td>
                    <td>
                      デプロイのトークン/分（TPM）割り当ては保守的な値から始め、必要に応じて引き上げる
                    </td>
                  </tr>
                  <tr>
                    <td>予算とアラートの設定</td>
                    <td>Azure Cost Managementで異常検知アラートを設定する</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/concepts/manage-costs.md">
                azure-ai-docs: manage-costs.md – GitHub
              </Ext>
              ,{" "}
              <Ext href="https://jonnychipz.com/2026/01/30/cost-management-and-optimisation-strategies-for-ai-applications-on-azure-ai-foundry/">
                Cost Management and Optimisation Strategies for AI Applications on Azure AI Foundry
                – Jonny Chipz
              </Ext>
            </p>

            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <div className={styles.calloutTitle}>注意点</div>
              <p>
                プロジェクト単位のコスト按分は現時点でAzureが直接販売するモデル（Azure Direct
                models、Azure OpenAIを含む）にのみ対応しており、Azure
                Marketplace経由のモデルにはまだ対応していません。マルチプロジェクト構成でコスト管理を行う場合は、この制約を踏まえて設計してください。
              </p>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/concepts/manage-costs.md">
                azure-ai-docs: manage-costs.md – GitHub
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-11">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 11
            </div>
            <h2>CI/CDとGenAIOps</h2>

            <h3>
              <span className={styles.hNum}>11.1</span>プロンプトもコードとして扱う
            </h3>
            <p>
              AIエージェントの本番運用で最も見落とされがちなのは、「システムプロンプトのたった一語の変更が、ロジックの書き換えと同じくらいエージェントの振る舞いを大きく変えうる」という点です。ベストプラクティスとしては、プロンプトをコードと一緒にGitで管理し、パイプラインのメタデータで使用バージョンを明示的に参照し、特定コミットの再実行が常に同じ振る舞いを再現できるようにする（そのためにはプロンプトのバージョンごとの不変性が前提になる）ことが挙げられます。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azureinfrastructureblog/cicd-as-a-platform-shipping-microservices-and-ai-agents-with-reusable-github-act/4504550">
                CI/CD as a Platform: Shipping Microservices and AI Agents with Reusable GitHub
                Actions Workflows – Microsoft Community Hub
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>11.2</span>CI/CDパイプライン全体像
            </h3>
            <div className={styles.diagramFrame}>
              <MermaidDiagram chart={MMD_9} />
              <div className={styles.diagramCaption}>
                図9: 評価ゲート付きCI/CDパイプライン（Dev → Test → Production）
              </div>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/educatordeveloperblog/cicd-for-ai-agents-on-microsoft-foundry/4522218">
                CI/CD for AI Agents on Microsoft Foundry – Microsoft Community Hub
              </Ext>
            </p>

            <p>
              このパターンは、GitHub ActionsとAzure
              DevOpsの双方に対応する形でリファレンス実装が公開されています。パイプラインは「CIビルド
              → CI評価 → CD Dev → CD Test → CD Production」という4段階で構成され、GitHub
              Environmentsによる承認ゲートやOIDCワークロードIDフェデレーションによるパスワードレスなAzure認証を採用することで、資格情報をパイプライン内に一切保存しない設計が推奨されています。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://github.com/leestott/foundry-cicd">
                GitHub - leestott/foundry-cicd
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>11.3</span>CI/CDにおける評価ゲートの実装
            </h3>
            <p>
              Foundryは「Run an evaluation in GitHub Action」というGitHub
              Actionを公式に提供しており、テストクエリと評価器のリストを含むデータセットを渡すだけで、エージェントを呼び出して評価を実行し、サマリーレポートを生成できます。評価結果には信頼区間と統計的有意性の検定が含まれており、変化が意味のあるものか、単なる偶然のばらつきかを判定できます。
            </p>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <div className={styles.calloutTitle}>コスト面の注意</div>
              <p>
                公式ドキュメントは「コストを最小化するため、すべてのコミットで評価を実行しない」ことを明示的に推奨しています。評価用のゴールデンデータセットは、エージェントのタスクが進化するのに合わせて更新し続けるべき、コードそのものと同格の「一級のエンジニアリング資産」として扱う必要があります（データセットが古くなると、誤ったパス/フェイルのシグナルを生み出してしまいます）。
              </p>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-github-action">
                How to run an evaluation in GitHub Action – Microsoft Learn
              </Ext>
              ,{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/educatordeveloperblog/cicd-for-ai-agents-on-microsoft-foundry/4522218">
                CI/CD for AI Agents on Microsoft Foundry – Microsoft Community Hub
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-12">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 12
            </div>
            <h2>ファインチューニングと蒸留</h2>

            <h3>
              <span className={styles.hNum}>12.1</span>手法の使い分け
            </h3>
            <p>Foundryは複数のカスタマイズ手法を提供しており、目的に応じて使い分けます。</p>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>手法</th>
                    <th>説明</th>
                    <th>向いているケース</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Supervised Fine-Tuning (SFT)</td>
                    <td>
                      プロンプト/コンプリーション（または会話形式）のラベル付きデータでベースモデルを追加学習させる
                    </td>
                    <td>解法パターンが有限で、特定タスクの精度を高めたい場合</td>
                  </tr>
                  <tr>
                    <td>Direct Preference Optimization (DPO)</td>
                    <td>好ましい出力と好ましくない出力のペアから直接モデルの挙動を調整する</td>
                    <td>出力のスタイルや選好を細かく制御したい場合</td>
                  </tr>
                  <tr>
                    <td>Reinforcement Fine-Tuning (RFT)</td>
                    <td>正しい推論に報酬を与え、望ましくない出力にペナルティを課す</td>
                    <td>複雑なビジネスロジックへの整合が必要な高難度・高リスクな意思決定</td>
                  </tr>
                  <tr>
                    <td>Distillation（蒸留）</td>
                    <td>
                      大型モデル（教師）の出力を使って小型モデル（生徒）を学習させ、同等の性能をより低コストで実現する
                    </td>
                    <td>
                      推論コストがボトルネックで、タスクが明確に定義されている高頻度ワークロード
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/fine-tuning-considerations">
                Microsoft Foundry fine-tuning considerations – Microsoft Learn
              </Ext>
              ,{" "}
              <Ext href="https://devblogs.microsoft.com/foundry/the-developers-guide-to-smarter-fine-tuning/">
                The Developer's Guide to Smarter Fine-tuning – Foundry Blog
              </Ext>
            </p>

            <p>
              蒸留の効果を示す具体例として、あるコンサルティング事例では月間400万回のGPT-4o呼び出しを行っていたクライアントのワークロードを、チューニング済みのGPT-4o
              miniへ置き換えることで、性能を95%程度維持しながら推論コストを約30%まで削減し、月額換算で大きなコスト削減（数万豪ドル規模）を実現し、その投資は約6週間で回収できたと報告されています。「蒸留は過小評価されている。タスクが明確に定義されており、入力ボリュームが大きく、推論コストが制約になっている場合に最適な選択肢だ」という指摘は実務上重要な判断基準です。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://team400.ai/blog/2026-05-custom-ai-model-azure-foundry-build-guide">
                How to Build a Custom AI Model in Azure AI Foundry – Team 400
              </Ext>
            </p>

            <h3>
              <span className={styles.hNum}>12.2</span>実務プロセス
            </h3>
            <ol>
              <li>
                <strong>データ準備</strong>:
                高品質でドメイン固有なデータセットを収集・キュレーションする。
              </li>
              <li>
                <strong>モデル選定</strong>:
                ベースとなる基盤モデル（GPT-4o、GPT-4.1-nanoなど）を選ぶ。
              </li>
              <li>
                <strong>学習と最適化</strong>: DPO、RFT、蒸留などの手法を組み合わせて性能を高める。
              </li>
              <li>
                <strong>デプロイ</strong>:
                自動スケーリングとモニタリング込みでファインチューニング済みモデルをデプロイする。
              </li>
              <li>
                <strong>反復と評価</strong>:
                ベースラインから始め、性能を測定し、結果に基づいてアプローチを改善する反復プロセスとして扱う。
              </li>
            </ol>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://devblogs.microsoft.com/foundry/the-developers-guide-to-smarter-fine-tuning/">
                The Developer's Guide to Smarter Fine-tuning – Foundry Blog
              </Ext>
            </p>

            <div className={styles.callout}>
              <div className={styles.calloutTitle}>権限の注意点</div>
              <p>
                ファインチューニングにはFoundry Ownerロールが必要です。Foundry
                Userはモデルの学習（ファインチューニング）はできますが、デプロイできるのはFoundry
                Ownerのみです。
              </p>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/fine-tuning">
                Customize a model with fine-tuning – Microsoft Learn
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-13">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 13
            </div>
            <h2>Well-Architected Frameworkの適用</h2>
            <p>
              Azure Well-Architected
              Framework（WAF）は、AIワークロード特有の課題（非決定論的な振る舞い、モデルの陳腐化、説明可能性）に対応するための専用ガイダンスを提供しています。5つの柱をFoundryワークロードにどう適用するかを整理します。
            </p>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>柱</th>
                    <th>AIワークロードにおける主な関心事</th>
                    <th>Foundryでの具体策</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>信頼性 (Reliability)</td>
                    <td>障害からの復旧、可用性</td>
                    <td>ゾーン冗長性、Baseline Foundry chatリファレンスアーキテクチャの採用</td>
                  </tr>
                  <tr>
                    <td>セキュリティ (Security)</td>
                    <td>データ保護、脅威検知・緩和</td>
                    <td>プライベートエンドポイント、Entra Agent ID、ガードレール（7・8章）</td>
                  </tr>
                  <tr>
                    <td>コスト最適化 (Cost Optimization)</td>
                    <td>使用量とコスト効率のバランス</td>
                    <td>Model Router、トークン管理、タスク単価でのFinOps（10章）</td>
                  </tr>
                  <tr>
                    <td>運用上の卓越性 (Operational Excellence)</td>
                    <td>包括的な可観測性、DevOpsプラクティス</td>
                    <td>OpenTelemetry、CI/CD評価ゲート（9・11章）</td>
                  </tr>
                  <tr>
                    <td>パフォーマンス効率 (Performance Efficiency)</td>
                    <td>推論の効率的な利用</td>
                    <td>モデル蒸留、キャッシュ、適切なモデルサイズ選定（12章）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/well-architected/ai/get-started">
                AI workloads on Azure – Microsoft Azure Well-Architected Framework
              </Ext>
              ,{" "}
              <Ext href="https://techcommunity.microsoft.com/blog/azurearchitectureblog/designing-ai-workloads-with-the-azure-well-architected-framework/4452252">
                Designing AI Workloads with the Azure Well-Architected Framework – Microsoft
                Community Hub
              </Ext>
            </p>

            <p>
              WAFのAIワークロードガイダンスは「実験的なマインドセットで設計すること」「倫理的で説明可能なAIを確保すること」「モデルの陳腐化を先取りすること」を重要な設計原則として挙げています。これはAIワークロードが従来のソフトウェアと異なり、コードとデータの組み合わせによって独自の（そして時間とともに変化しうる）体験を生み出す非決定論的なシステムであることに由来します。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/shows/azure-essentials-show/designing-ai-workloads-with-waf">
                Design AI Workloads with the Azure Well-Architected Framework – Microsoft Learn
              </Ext>
            </p>

            <p>
              公式のベースラインリファレンスアーキテクチャとしては、「Baseline Microsoft Foundry
              chat reference
              architecture」（プライベートネットワーキング、ゾーン冗長性、厳格なセキュリティ制御を重視）と、それをAzureランディングゾーンに組み込んだ拡張版が公開されており、Foundry
              Agent Service・Azure OpenAI・App
              Serviceをプライベートかつネットワーク分離された環境内で連携させ、Azure
              Firewallで保護しつつゾーン冗長で高可用性を実現する構成が示されています。新規に本番アーキテクチャを設計する際は、まずこのベースラインを起点にするのが効率的です。
            </p>
            <p className={styles.source}>
              出典:{" "}
              <Ext href="https://learn.microsoft.com/en-us/azure/well-architected/ai/architecture-pattern">
                Architecture pattern for AI workloads on Azure – Microsoft Learn
              </Ext>
            </p>
          </section>

          <section className={styles.section} id="sec-14">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 14
            </div>
            <h2>よくあるアンチパターンと落とし穴</h2>
            <p>
              ここまでの調査で繰り返し登場した、実務でつまずきやすいポイントをアンチパターンとしてまとめます。
            </p>

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
                    <td>ツールの出力をそのまま信頼する</td>
                    <td>間接的プロンプトインジェクションの温床になる</td>
                    <td>
                      ツール出力は「未検証の入力」として扱い、重要な値は行動前に検証する（4.2章）
                    </td>
                  </tr>
                  <tr>
                    <td>Model Routerの配下モデルごとにレート制限を設定する</td>
                    <td>ルーター全体のTPM制御と競合し意図通りに動作しない</td>
                    <td>レート制限はルーターデプロイ全体に対して設定する（3.2章）</td>
                  </tr>
                  <tr>
                    <td>プレビュー版のガードレールを最初だけ設定して放置する</td>
                    <td>
                      Task
                      AdherenceやSpotlightingは進化中であり、既定設定のままでは新しいリスクに対応できない
                    </td>
                    <td>
                      ガイド付きセットアップを定期的に見直し、エージェントの権限が増えた際に再評価する（8章）
                    </td>
                  </tr>
                  <tr>
                    <td>プロンプトをコード管理せずポータルで直接編集する</td>
                    <td>再現性が失われ、本番障害時にどのプロンプトが動いていたか分からなくなる</td>
                    <td>
                      プロンプトをGitでバージョン管理し、パイプラインで明示的に参照する（11.1章）
                    </td>
                  </tr>
                  <tr>
                    <td>すべてのネットワークからのアクセスを許可したまま本番運用する</td>
                    <td>攻撃対象領域が不必要に広がる</td>
                    <td>
                      Selected Networks/IP許可リストへ切り替え、機密ワークロードはPrivate
                      Endpointを必須にする（7章）
                    </td>
                  </tr>
                  <tr>
                    <td>トークン単価だけをコスト指標にする</td>
                    <td>タスク成功に対する実質コストを見誤り、真のROIを把握できない</td>
                    <td>
                      「タスク完了単価」を計装し、成功/失敗・エージェント名・タスク種別で按分する（10.1章）
                    </td>
                  </tr>
                  <tr>
                    <td>評価データセットを一度作って更新しない</td>
                    <td>
                      エージェントのタスクが進化するとデータセットが陳腐化し、誤った合否判定を生む
                    </td>
                    <td>
                      ゴールデンデータセットをコードと同格の資産として継続的にメンテナンスする（11.3章）
                    </td>
                  </tr>
                  <tr>
                    <td>サブエージェントに「自分はサブエージェントだ」と伝えない</td>
                    <td>
                      サブエージェントが単独エージェントとして振る舞い、ユーザーに直接・重複した応答を返してしまう
                    </td>
                    <td>すべてのサブエージェントの指示に役割を明示する（5.3章）</td>
                  </tr>
                  <tr>
                    <td>Foundry (classic) の新規構築を続ける</td>
                    <td>
                      新規投資は新しいFoundryプロジェクト体験に集中しており、classicは段階的に非推奨化が進む
                    </td>
                    <td>新規構築は新Foundryリソースモデル・新ポータルを前提に設計する（0章）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section} id="sec-15">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 15
            </div>
            <h2>本番デプロイ前チェックリスト</h2>
            <ul className={styles.checklist}>
              <li>
                <span className={styles.checkBox}></span>
                用語の新旧対応（Assistants API → Responses
                API等）を理解し、廃止予定のAPIに依存していないか確認した（0章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                モデル選定はプロバイダー抽象化レイヤーを介しており、将来のモデル切り替えでアプリケーションコードへの影響が最小化されている（3.1章）
              </li>
              <li>
                <span className={styles.checkBox}></span>Model
                Routerのレート制限はルーターデプロイ全体に対して設定されている（3.2章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                エージェントの指示にツールの使い分けルール（優先順位）が明記されている（4.2章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                ツールの出力を検証せずに重要なアクションへ直結させていない（4.2章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                マルチエージェント構成では、親エージェントのみがユーザーに応答し、子エージェントには役割が明示されている（5.3章）
              </li>
              <li>
                <span className={styles.checkBox}></span>RAGのGroundedness /
                Relevanceを継続的に評価する仕組みがある（6.3章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                本番Hub/プロジェクトはプライベートエンドポイントで受信を、
                <code className={styles.inlineCode}>AllowOnlyApprovedOutbound</code>
                で送信を分離している（7.3, 7.4章）
              </li>
              <li>
                <span className={styles.checkBox}></span>RBACは最小権限で構成され、Entra Agent
                IDでエージェントのアイデンティティが管理されている（7.1, 7.2章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                4つの介入ポイント（入力・ツール呼び出し・ツール応答・出力）すべてにガードレールが設定されている（8章）
              </li>
              <li>
                <span className={styles.checkBox}></span>OpenTelemetryトレーシングがApplication
                Insightsに接続され、スパン属性が一貫している（9.2, 9.3章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                継続的評価とアラートが本番トラフィックのサンプリングに対して稼働している（9.3,
                11.2章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                コストはトークン単価ではなく「タスク完了単価」で計測・按分されている（10.1章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                プロンプトはGitでバージョン管理され、CI/CDパイプラインに評価ゲートが組み込まれている（11.1,
                11.3章）
              </li>
              <li>
                <span className={styles.checkBox}></span>
                評価用ゴールデンデータセットは定期的にメンテナンスされている（11.3章）
              </li>
              <li>
                <span className={styles.checkBox}></span>Well-Architected
                Frameworkの5つの柱に沿ったレビューを実施した（13章）
              </li>
            </ul>
          </section>

          <section className={styles.section} id="sec-16">
            <div className={styles.eyebrow}>
              <span className={styles.line}></span>CHAPTER 16
            </div>
            <h2>参考文献・ソースURL一覧</h2>

            <h3>公式ドキュメント・製品ページ（Microsoft Learn / Azure）</h3>
            <ul className={styles.refList}>
              <li>
                <Ext href="https://azure.microsoft.com/en-us/products/ai-foundry/">
                  Microsoft Foundry 製品ページ
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry?tabs=python">
                  What is Microsoft Foundry? – Microsoft Learn
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/upgrade-azure-openai">
                  Upgrade your Azure OpenAI resource to a Foundry resource
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry-classic/what-is-foundry">
                  Foundry (classic) portal
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/quickstarts/get-started-code">
                  Quickstart: Build with models and agents
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow">
                  Agent Service overview
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds">
                  Foundry portal playgrounds
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview">
                  Foundry Models overview
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/get-started-projects-vs-code">
                  Foundry for VS Code
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview">
                  Foundry Control Plane overview
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/model-choice-guide">
                  GPT-5 vs GPT-4.1 model choice guide
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/well-architected/ai/application-design">
                  Application Design for AI Workloads – Well-Architected Framework
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-best-practice">
                  Tool best practices for Microsoft Foundry Agent Service
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/overview">
                  What is Microsoft Foundry Agent Service?
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/agent-framework/overview/">
                  Microsoft Agent Framework Overview
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/">
                  Workflow orchestrations in Agent Framework
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/microsoft/agent-framework">
                  GitHub - microsoft/agent-framework
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns">
                  Multi-agent orchestration patterns and best practices – Copilot Studio
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview">
                  Retrieval Augmented Generation (RAG) in Azure AI Search
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation">
                  RAG and indexes in Microsoft Foundry
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/security/fundamentals/ai-security-best-practices">
                  Azure AI security best practices
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks">
                  Set up private networking for Foundry Agent Service
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link">
                  How to configure network isolation for Microsoft Foundry
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/how-to/configure-private-link.md">
                  azure-ai-docs: configure-private-link.md (GitHub)
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview">
                  Guardrails and controls overview in Microsoft Foundry
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/guardrails/guided-set-up">
                  Configure guided guardrail set-up for an agent
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/concepts/observability">
                  Observability in Generative AI – Microsoft Foundry
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept">
                  Agent tracing in Microsoft Foundry (preview)
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry-classic/how-to/develop/trace-agents-sdk">
                  Trace and Observe AI Agents in Microsoft Foundry (classic)
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup">
                  Set Up Tracing for AI Agents in Microsoft Foundry
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/foundry/concepts/manage-costs.md">
                  azure-ai-docs: manage-costs.md (GitHub)
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/how-to/evaluation-github-action">
                  How to run an evaluation in GitHub Action
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/fine-tuning-considerations">
                  Microsoft Foundry fine-tuning considerations
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/fine-tuning">
                  Customize a model with fine-tuning
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/well-architected/ai/get-started">
                  AI workloads on Azure – Well-Architected Framework
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/azure/well-architected/ai/architecture-pattern">
                  Architecture pattern for AI workloads on Azure – Well-Architected Framework
                </Ext>
              </li>
              <li>
                <Ext href="https://learn.microsoft.com/en-us/shows/azure-essentials-show/designing-ai-workloads-with-waf">
                  Design AI Workloads with the Azure Well-Architected Framework (video)
                </Ext>
              </li>
            </ul>

            <h3>Microsoft公式ブログ・コミュニティハブ</h3>
            <ul className={styles.refList}>
              <li>
                <Ext href="https://devblogs.microsoft.com/foundry/agent-service-build2026/">
                  Build and run agents at scale with Microsoft Foundry at Build 2026 – Foundry Blog
                </Ext>
              </li>
              <li>
                <Ext href="https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-build-2026/">
                  What's new in Microsoft Foundry | Build Edition – Foundry Blog
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/azuredevcommunityblog/optimising-ai-costs-with-microsoft-foundry-model-router/4494776">
                  Optimising AI Costs with Microsoft Foundry Model Router – Microsoft Community Hub
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-boost-response-relevance-by-36-with-agentic-retrieval/4470720">
                  Foundry IQ: boost response relevance by 36% with agentic retrieval – Microsoft
                  Community Hub
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/the-future-of-ai-evaluating-and-optimizing-custom-rag-agents-using-azure-ai-foun/4455215">
                  Evaluating and Optimizing RAG Agents with Azure AI Foundry – Microsoft Community
                  Hub
                </Ext>
              </li>
              <li>
                <Ext href="https://devblogs.microsoft.com/foundry/how-to-debug-and-optimize-rag-agents-in-azure-ai-foundry/">
                  How to debug and optimize RAG agents in Microsoft Foundry – Foundry Blog
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/monitoring--observability-in-microsoft-foundry-part-2-configuration-and-operatio/4532674">
                  Monitoring &amp; Observability in Microsoft Foundry Part 2 – Microsoft Community
                  Hub
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/azureinfrastructureblog/cicd-as-a-platform-shipping-microservices-and-ai-agents-with-reusable-github-act/4504550">
                  CI/CD as a Platform: Shipping Microservices and AI Agents with Reusable GitHub
                  Actions Workflows – Microsoft Community Hub
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/educatordeveloperblog/cicd-for-ai-agents-on-microsoft-foundry/4522218">
                  CI/CD for AI Agents on Microsoft Foundry – Microsoft Community Hub
                </Ext>
              </li>
              <li>
                <Ext href="https://devblogs.microsoft.com/foundry/the-developers-guide-to-smarter-fine-tuning/">
                  The Developer's Guide to Smarter Fine-tuning – Foundry Blog
                </Ext>
              </li>
              <li>
                <Ext href="https://techcommunity.microsoft.com/blog/azurearchitectureblog/designing-ai-workloads-with-the-azure-well-architected-framework/4452252">
                  Designing AI Workloads with the Azure Well-Architected Framework – Microsoft
                  Community Hub
                </Ext>
              </li>
            </ul>

            <h3>国際的な開発者・業界メディアの投稿（著名な開発者・専門家によるもの）</h3>
            <ul className={styles.refList}>
              <li>
                <span className={styles.badge}>InfoQ</span>
                <Ext href="https://www.infoq.com/news/2026/06/microsoft-foundry-agents/">
                  Microsoft Foundry Adds Runtime, Tooling, and Governance for Production Agents
                </Ext>
                <br />
                <span className={styles.refNote}>Nick Bradyのブログを引用したInfoQの分析記事</span>
              </li>
              <li>
                <span className={styles.badge}>SE Radio</span>
                <Ext href="https://se-radio.net/2026/03/se-radio-711-scott-hanselman-on-ai-assisted-development-tools/">
                  SE Radio 711: Scott Hanselman on AI-Assisted Development Tools
                </Ext>
                <br />
                <span className={styles.refNote}>
                  Microsoft VP, Scott Hanselmanへのインタビュー
                </span>
              </li>
              <li>
                <Ext href="https://www.aol.com/microsoft-cto-says-number-people-203002589.html">
                  Microsoft's big event was all about the 'explosion' of AI agents
                </Ext>
                <br />
                <span className={styles.refNote}>Microsoft CTO, Kevin Scottの発言</span>
              </li>
              <li>
                <Ext href="https://byteiota.com/foundry-agent-service-ga/">
                  Microsoft Foundry Agent Service Is GA: What Developers Need to Know – byteiota
                </Ext>
              </li>
              <li>
                <Ext href="https://www.bighatgroup.com/blog/microsoft-foundry-hosted-agents-enterprise-guide-april-2026/">
                  Microsoft Foundry Hosted Agents: What Enterprise IT Should Do Now – Big Hat Group
                </Ext>
              </li>
              <li>
                <Ext href="https://medium.com/@badrkacimi/the-model-router-explained-intelligent-cost-performance-optimization-in-azure-ai-foundry-c2614a403471">
                  The Model Router Explained – Badr Kacimi, Medium
                </Ext>
              </li>
              <li>
                <Ext href="https://www.devleader.ca/2026/03/25/multiagent-orchestration-in-microsoft-agent-framework-in-c">
                  Multi-Agent Orchestration in Microsoft Agent Framework in C# – DevLeader
                </Ext>
              </li>
              <li>
                <Ext href="https://protego.me/blog/azure-ai-foundry-security-threat-model-rbac-governance">
                  Azure AI Foundry Security: Threat Model, RBAC, and Data Governance Controls –
                  Protego
                </Ext>
              </li>
              <li>
                <Ext href="https://jameswestall.com/2026/01/13/content-safety-agents-task-adherence-prompt-shields/">
                  Azure AI Content Safety for Agents: Task Adherence, Prompt Shields, and PII
                  Filters – James Westall
                </Ext>
              </li>
              <li>
                <Ext href="https://itnext.io/you-cant-debug-what-you-can-t-see-ai-observability-with-opentelemetry-microsoft-foundry-f90407b90e17">
                  You Can't Debug What You Can't See: AI Observability with OpenTelemetry +
                  Microsoft Foundry – itnext.io
                </Ext>
              </li>
              <li>
                <Ext href="https://blog.bajonczak.com/ai-finops-on-azure/">
                  AI FinOps on Azure: Costs, Tokens and Agents
                </Ext>
              </li>
              <li>
                <span className={styles.badge}>MVP</span>
                <Ext href="https://jonnychipz.com/2026/01/30/cost-management-and-optimisation-strategies-for-ai-applications-on-azure-ai-foundry/">
                  Cost Management and Optimisation Strategies for AI Applications on Azure AI
                  Foundry – Jonny Chipz
                </Ext>
              </li>
              <li>
                <Ext href="https://team400.ai/blog/2026-05-custom-ai-model-azure-foundry-build-guide">
                  How to Build a Custom AI Model in Azure AI Foundry – Team 400
                </Ext>
              </li>
              <li>
                <Ext href="https://github.com/leestott/foundry-cicd">
                  GitHub - leestott/foundry-cicd（エンタープライズ向けCI/CDリファレンス実装）
                </Ext>
              </li>
            </ul>
          </section>

          <footer className={styles.footer}>
            <hr />
            <h3 style={{ color: "#eaf1ff" }}>免責事項</h3>
            <p>
              本ガイドは2026年7月17日時点で確認できた公開情報を基に作成しています。Microsoft
              Foundryは高頻度でアップデートされるプラットフォームであり、特にプレビュー機能（Task
              Adherence、Hosted Agents、Memory機能、Prompt
              Optimizerなど）は今後GA（一般提供）に伴い仕様が変更される可能性があります。本番導入の判断にあたっては、必ず各セクションに付記したMicrosoft
              Learnの一次情報を最新版で確認してください。また、コミュニティブログやサードパーティ記事で紹介されている数値（コスト削減率、性能向上率など）は、各執筆者の検証環境に依存するものであり、自社のワークロードでの実測値とは異なる可能性がある点にご留意ください。
            </p>
            <p style={{ marginTop: "24px" }}>
              Microsoft Foundry 実践ベストプラクティスガイド ／ 最終更新: 2026年7月17日
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
