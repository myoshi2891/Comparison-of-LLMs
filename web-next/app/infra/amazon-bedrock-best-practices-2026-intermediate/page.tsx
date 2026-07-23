import type { Metadata } from "next";
import type React from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Amazon Bedrock ベストプラクティス完全ガイド | AI Model Cost Calculator",
  description:
    "Amazon Bedrockのアーキテクチャ、モデル選定、Prompt Management、RAG、エージェント、Guardrails、コスト最適化、セキュリティ、可観測性を網羅した実践ガイド。",
};

/**
 * Renders an external link that opens in a new browser tab.
 *
 * @param href - The destination URL
 * @param children - The link content
 */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_1 = `flowchart TB
    subgraph Client["クライアント層"]
        A["Webアプリ / モバイルアプリ / バッチジョブ"]
    end
    subgraph Access["アクセス経路"]
        B["Bedrock Runtime API"]
        C["VPCインターフェースエンドポイント（PrivateLink）"]
    end
    subgraph Core["Amazon Bedrock コア"]
        D["Guardrails（入力チェック）"]
        E["Intelligent Prompt Routing"]
        F["基盤モデル（Claude / Nova / Llama など）"]
        G["Guardrails（出力チェック）"]
        H["Knowledge Bases（RAG）"]
        I["Agents / AgentCore"]
    end
    subgraph Ops["運用・ガバナンス基盤"]
        J["CloudWatch（メトリクス・ログ）"]
        K["CloudTrail（監査ログ）"]
        L["Bedrock Evaluations / AgentCore Evaluations"]
    end
    A --> C --> B
    B --> D --> E --> F --> G --> A
    F --- H
    F --- I
    B -.-> J
    B -.-> K
    F -.-> L

    classDef purpleNode fill:#2a2145,stroke:#8b7ef0,color:#f2f3f5
    classDef tealNode fill:#123330,stroke:#4fd6c4,color:#f2f3f5
    classDef coralNode fill:#3a2416,stroke:#f0925c,color:#f2f3f5
    class D,G coralNode
    class F purpleNode
    class H,I,J,K,L tealNode`;

const DIAGRAM_2 = `flowchart LR
    A["データソース（S3 / Confluence / SharePoint など）"]
    B["取り込み（Ingestion）"]
    C["チャンキング（Chunking）"]
    D["Embeddingモデル（Titan Embeddings など）"]
    E["ベクトルストア（OpenSearch Serverless / S3 Vectors / Aurora）"]
    F["ユーザークエリ"]
    G["クエリEmbedding"]
    H["類似検索（Retrieve）"]
    I["メタデータフィルタリング"]
    J["プロンプト拡張（Augment）"]
    K["基盤モデル生成（Generate）"]
    L["出典付き回答"]

    A --> B --> C --> D --> E
    F --> G --> H
    E --> H
    H --> I --> J --> K --> L

    classDef storeNode fill:#123330,stroke:#4fd6c4,color:#f2f3f5
    classDef genNode fill:#2a2145,stroke:#8b7ef0,color:#f2f3f5
    class E storeNode
    class K genNode`;

const DIAGRAM_3 = `flowchart TB
    U["ユーザーリクエスト"] --> S["Supervisor Agent（統括エージェント）"]
    S -->|"ルーティング"| A1["専門エージェントA（例: 注文管理）"]
    S -->|"ルーティング"| A2["専門エージェントB（例: 返品対応）"]
    S -->|"ルーティング"| A3["専門エージェントC（例: FAQ検索）"]
    A1 --> G1["AgentCore Gateway（MCPツール）"]
    A2 --> G2["AgentCore Gateway（MCPツール）"]
    A3 --> KB["Knowledge Base"]
    G1 --> R1["社内API / DB"]
    G2 --> R2["社内API / DB"]
    A1 --> S
    A2 --> S
    A3 --> S
    S --> RESP["統合された最終回答"]

    classDef supervisorNode fill:#2a2145,stroke:#8b7ef0,color:#f2f3f5
    classDef agentNode fill:#123330,stroke:#4fd6c4,color:#f2f3f5
    classDef toolNode fill:#3a2416,stroke:#f0925c,color:#f2f3f5
    class S supervisorNode
    class A1,A2,A3 agentNode
    class G1,G2,KB,R1,R2 toolNode`;

const DIAGRAM_4 = `flowchart TD
    Q1{"リアルタイム応答が必要か?"}
    Q1 -->|"いいえ（非同期でよい）"| BATCH["Batch推論を選択（最大50%割引）"]
    Q1 -->|"はい"| Q2{"トラフィックは安定・予測可能か?"}
    Q2 -->|"はい（高スループットが常時必要）"| PT["Provisioned Throughputを検討"]
    Q2 -->|"いいえ（変動が大きい）"| Q3{"同じコンテキストを繰り返し利用するか?"}
    Q3 -->|"はい"| CACHE["Prompt Cachingを有効化"]
    Q3 -->|"いいえ"| Q4{"リクエストの複雑さにばらつきがあるか?"}
    CACHE --> Q4
    Q4 -->|"はい"| ROUTE["Intelligent Prompt Routingで自動振り分け"]
    Q4 -->|"いいえ"| ONDEMAND["On-Demand推論（単一モデル）"]

    classDef outcomeNode fill:#123330,stroke:#4fd6c4,color:#f2f3f5
    class BATCH,PT,CACHE,ROUTE,ONDEMAND outcomeNode`;

const DIAGRAM_5 = `flowchart TB
    A["IAM Principal（ユーザー / ロール）"]
    B{"SCPで対象リージョン\nが許可されているか"}
    C{"IAMポリシーでモデルARN\nGuardrailIdentifier\nが許可されているか"}
    D["VPCインターフェースエンドポイント（PrivateLink）"]
    E{"エンドポイントポリシー\nで許可されているか"}
    F["Guardrails（入力フィルタ）"]
    G["基盤モデル呼び出し（InvokeModel）"]
    H["Guardrails（出力フィルタ）"]
    I["KMSで暗号化されたレスポンス"]
    J["Model Invocation Logging（CloudWatch / S3）"]
    K["CloudTrail（監査証跡）"]
    X1["アクセス拒否"]

    A --> B
    B -->|"許可"| C
    B -->|"拒否"| X1
    C -->|"許可"| D
    C -->|"拒否"| X1
    D --> E
    E -->|"許可"| F
    E -->|"拒否"| X1
    F --> G --> H --> I
    G -.-> J
    A -.-> K

    classDef guardNode fill:#3a2416,stroke:#f0925c,color:#f2f3f5
    classDef denyNode fill:#3a1717,stroke:#f29a9a,color:#f2f3f5
    classDef modelNode fill:#2a2145,stroke:#8b7ef0,color:#f2f3f5
    class F,H guardNode
    class X1 denyNode
    class G modelNode`;

const DIAGRAM_6 = `flowchart LR
    A["プロンプト / エージェント変更をコミット"]
    B["CI/CDパイプライン起動"]
    C["正解ラベル付き評価データセット"]
    D["Bedrock Evaluations / AgentCore Evaluations実行"]
    E["LLM-as-a-Judgeスコアリング"]
    F{"スコアが閾値を超えているか"}
    G["本番デプロイを承認"]
    H["デプロイをブロックし担当者へ通知"]

    A --> B --> D
    C --> D
    D --> E --> F
    F -->|"はい"| G
    F -->|"いいえ"| H

    classDef passNode fill:#123330,stroke:#4fd6c4,color:#f2f3f5
    classDef failNode fill:#3a1717,stroke:#f29a9a,color:#f2f3f5
    class G passNode
    class H failNode`;

/**
 * Renders the Amazon Bedrock best practices guide page.
 */
export default function AmazonBedrockBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.topAccentBar} />

      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.sidebarBrandIcon}>⚡</div>
          <div className={styles.sidebarBrandText}>
            <span className={styles.sidebarBrandTitle}>Amazon Bedrock</span>
            <span className={styles.sidebarBrandSub}>完全ガイド 2026</span>
          </div>
        </div>

        <div className={styles.navGroup}>
          <div className={styles.navGroupLabel}>目次</div>
          <a href="#overview" className={styles.navLink}>
            <span>概要</span>
          </a>
          <a href="#architecture" className={styles.navLink}>
            <span>全体アーキテクチャ像</span>
          </a>
          <a href="#step-1" className={styles.navLink}>
            <span>1. モデル選定戦略</span>
          </a>
          <a href="#step-2" className={styles.navLink}>
            <span>2. Prompt Management</span>
          </a>
          <a href="#step-3" className={styles.navLink}>
            <span>3. RAG・Knowledge Bases</span>
          </a>
          <a href="#step-4" className={styles.navLink}>
            <span>4. エージェント構築</span>
          </a>
          <a href="#step-5" className={styles.navLink}>
            <span>5. Guardrails</span>
          </a>
          <a href="#step-6" className={styles.navLink}>
            <span>6. コスト最適化</span>
          </a>
          <a href="#step-7" className={styles.navLink}>
            <span>7. 推論性能</span>
          </a>
          <a href="#step-8" className={styles.navLink}>
            <span>8. セキュリティ・ガバナンス</span>
          </a>
          <a href="#step-9" className={styles.navLink}>
            <span>9. 可観測性・ロギング</span>
          </a>
          <a href="#step-10" className={styles.navLink}>
            <span>10. 評価・CI/CD</span>
          </a>
          <a href="#step-11" className={styles.navLink}>
            <span>11. Well-Architected</span>
          </a>
          <a href="#step-12" className={styles.navLink}>
            <span>12. チェックリスト</span>
          </a>
          <a href="#references" className={styles.navLink}>
            <span>参考情報源</span>
          </a>
          <a href="#summary" className={styles.navLink}>
            <span>まとめ</span>
          </a>
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.pageHeader} id="overview">
          <span className={styles.eyebrow}>📅 2026年7月17日時点の情報に基づく</span>
          <h1>Amazon Bedrock ベストプラクティス完全ガイド</h1>
          <p>
            中級〜上級者向け。すでにBedrockでPoCやプロトタイプを構築した経験があり、本番運用・スケール・ガバナンスの段階に進みたいAIエンジニア／ソフトウェアアーキテクト／QAエンジニアを対象にしています。
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              🖥️ 対象: モデル選定〜運用ガバナンスまで12ステップ
            </span>
            <span className={styles.metaItem}>📊 図解: Mermaidフローチャート6種</span>
            <span className={styles.metaItem}>📚 参考情報源: AWS公式＋著名コミュニティ記事</span>
          </div>
        </div>

        <p>
          Amazon
          Bedrockは、Anthropic・Meta・Mistral・Google・NVIDIA・OpenAI・MiniMax・Moonshot・Qwen・Amazonなど複数プロバイダーの基盤モデル（FM）を単一APIで利用できるフルマネージド型の生成AIサービスです。2026年時点でモデルカタログは約100モデルまで拡大し、テキストだけでなく画像・音声・コードを含むマルチモーダルなワークロードをカバーしています。
        </p>
        <p>
          本ガイドは「動くものを作る」段階から一歩進み、本番環境で安全に・安く・速く・監査可能にBedrockを運用するためのベストプラクティスを、ステップバイステップで解説します。
        </p>

        <section className={styles.chapter} id="architecture">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>0</div>
            <h2>全体アーキテクチャ像</h2>
          </div>
          <p>
            これから解説するベストプラクティスがBedrockのどの部分に対応するのかを、まず俯瞰します。
          </p>
          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <div style={{ width: "100%" }}>
              <MermaidDiagram chart={DIAGRAM_1} />
              <div className={styles.mermaidCaption}>
                図1: Bedrock全体アーキテクチャとリクエストの流れ
              </div>
            </div>
          </div>
        </section>

        <section className={styles.chapter} id="step-1">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>1</div>
            <h2>モデル選定戦略</h2>
          </div>
          <h3>単一モデルに固定しない設計にする</h3>
          <p>
            Bedrockの最大の価値は、モデルプロバイダーを切り替える際にAPIパラメータ（モデルID）を変更するだけで済む点にあります。アプリケーションコードとモデル呼び出しの間に抽象化レイヤーを設け、モデルIDやパラメータを設定値として外出しすることで、新しいモデルのベンチマークやコスト最適化を継続的に行える構成にしておきます。
          </p>

          <h3>タスクの難易度でモデルを階層化する</h3>
          <p>
            すべてのリクエストに最も高性能（＝最も高価）なモデルを使うのはアンチパターンです。以下のような階層化が実務的です。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>階層</th>
                  <th>用途</th>
                  <th>モデル例の傾向</th>
                  <th>判断基準</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tier 1（軽量・高速）</td>
                  <td>定型応答、FAQ、簡単な分類</td>
                  <td>Nova Lite / Claude Haiku系</td>
                  <td>レイテンシ最優先、コスト最優先</td>
                </tr>
                <tr>
                  <td>Tier 2（バランス型）</td>
                  <td>一般的なチャット、要約</td>
                  <td>Nova Pro / Claude Sonnet系</td>
                  <td>品質とコストのバランス</td>
                </tr>
                <tr>
                  <td>Tier 3（高精度・推論）</td>
                  <td>複雑な多段推論、コード生成、金融・法務分析</td>
                  <td>Claude Opus系 / 高度な推論モデル</td>
                  <td>精度最優先、コストは二の次</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertContent}>
              <p>
                この階層化を手動で行うのではなく、Step 6で解説する Intelligent Prompt Routing
                を使うと、リクエストごとに自動でモデルを振り分けられます。
              </p>
            </div>
          </div>

          <h3>モデル選定はBedrock Evaluationsで定量的に行う</h3>
          <p>
            「どのモデルが良さそうか」を主観で決めず、Bedrock Model
            Evaluationの自動メトリクス・LLM-as-a-Judge・人手レビューの3手法を組み合わせて、自社のタスク・データセットに対して定量的に比較します（詳細はStep
            10）。
          </p>
        </section>

        <section className={styles.chapter} id="step-2">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>2</div>
            <h2>プロンプトエンジニアリングとPrompt Management</h2>
          </div>
          <h3>Prompt Managementでプロンプトをコードから分離する</h3>
          <p>
            プロンプトをアプリケーションコードにハードコーディングすると、変更のたびにデプロイが必要になり、A/Bテストも困難になります。Bedrockの
            Prompt
            Management機能を使い、プロンプトをバージョン管理された独立したリソースとして管理し、エイリアス（本番用・検証用など）で切り替えられるようにします。
          </p>

          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Prompt Managementから取得したプロンプトでConverse APIを呼び出す例</span>
              <span className={styles.codeLang}>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span style={{ color: "#ff7b72" }}>import</span>
                <span style={{ color: "#79c0ff" }}> boto3</span>
              </div>
              <div className={styles.codeLine}> </div>
              <div className={styles.codeLine}>
                <span>bedrock_agent = boto3.client(</span>
                <span style={{ color: "#a5d6ff" }}>&quot;bedrock-agent&quot;</span>
                <span>, region_name=</span>
                <span style={{ color: "#a5d6ff" }}>&quot;ap-northeast-1&quot;</span>
                <span>)</span>
              </div>
              <div className={styles.codeLine}>
                <span>bedrock_runtime = boto3.client(</span>
                <span style={{ color: "#a5d6ff" }}>&quot;bedrock-runtime&quot;</span>
                <span>, region_name=</span>
                <span style={{ color: "#a5d6ff" }}>&quot;ap-northeast-1&quot;</span>
                <span>)</span>
              </div>
              <div className={styles.codeLine}> </div>
              <div className={styles.codeLine}>
                <span>prompt_arn = </span>
                <span style={{ color: "#a5d6ff" }}>
                  &quot;arn:aws:bedrock:ap-northeast-1:123456789012:prompt/PROMPT_ID:1&quot;
                </span>
              </div>
              <div className={styles.codeLine}> </div>
              <div className={styles.codeLine}>
                <span>response = bedrock_runtime.converse(</span>
              </div>
              <div className={styles.codeLine}>
                <span> modelId=prompt_arn,</span>
              </div>
              <div className={styles.codeLine}>
                <span> promptVariables=&#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span>
                  {" "}
                  &quot;question&quot;: &#123;&quot;text&quot;:
                  &quot;返品ポリシーを教えてください&quot;&#125;
                </span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
            </div>
          </div>

          <h3>Prompt Optimizationを活用する</h3>
          <p>
            Prompt ManagementのPrompt
            Optimization機能は、モデルに応じてプロンプトを自動的に書き換え、精度向上や応答の簡潔化を図ります。特にモデルを切り替えた直後（例:
            Claude系からNova系へ）は、プロンプトの「クセ」がモデルごとに異なるため、この機能で再最適化するのが効率的です。
          </p>

          <h3>長い共通コンテキストは先頭に固定する</h3>
          <p>
            システムプロンプトやFew-shot例、長大なドキュメントなど「毎回同じ内容」は、プロンプトの先頭にまとめて配置します。
          </p>

          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span className={styles.alertIcon}>💡</span>
            <div className={styles.alertContent}>
              <p>
                これはStep 6で解説するPrompt
                Cachingの効果を最大化するための設計上の前提条件です。ユーザー固有の質問文は末尾に配置してください。
              </p>
            </div>
          </div>

          <h3>構造化出力とTool Useを前提に設計する</h3>
          <p>
            後続処理（他システムへの連携、UIへの描画など）が必要な場合、自由文ではなくJSON
            Schemaに準拠した構造化出力やTool Use（Function
            Calling）を前提にプロンプトを設計します。これによりパース失敗によるエラーハンドリングの複雑化を防げます。
          </p>
        </section>

        <section className={styles.chapter} id="step-3">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>3</div>
            <h2>RAG（Retrieval Augmented Generation）とKnowledge Bases設計</h2>
          </div>
          <h3>RAGパイプライン全体を俯瞰する</h3>
          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <div style={{ width: "100%" }}>
              <MermaidDiagram chart={DIAGRAM_2} />
              <div className={styles.mermaidCaption}>
                図2: Knowledge Bases for Amazon BedrockによるRAGパイプライン
              </div>
            </div>
          </div>

          <h3>小さく始めて反復的にチューニングする</h3>
          <p>
            RAGの品質はチャンキング戦略・埋め込みモデル・メタデータ設計に強く依存し、「唯一の正解」は存在しません。少量のドキュメントセットから開始し、検索精度をテストしながらチャンクサイズ・オーバーラップ・メタデータフィルタを調整し、段階的にデータ量を拡大していくアプローチが推奨されます。
          </p>

          <h3>ベクトルストアの選定</h3>
          <p>
            2026年時点では、Amazon S3
            Vectorsがネイティブのベクトルインデックスをオブジェクトストレージ上に直接提供するようになり、専用のベクトルデータベースを別途運用する必要性が大幅に下がりました。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ベクトルストア</th>
                  <th>強み</th>
                  <th>注意点</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>OpenSearch Serverless</td>
                  <td>ハイブリッド検索、豊富なフィルタリング機能</td>
                  <td>運用コストが比較的高め</td>
                </tr>
                <tr>
                  <td>Amazon S3 Vectors</td>
                  <td>追加インフラ不要、コスト効率が高い</td>
                  <td>高度なクエリ機能はまだ発展途上</td>
                </tr>
                <tr>
                  <td>Amazon Aurora（pgvector）</td>
                  <td>既存のリレーショナルデータと統合しやすい</td>
                  <td>スケール設計を自前で行う必要がある</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Knowledge Baseへの問い合わせ例</h3>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>Knowledge Base問い合わせ Python サンプル</span>
              <span className={styles.codeLang}>Python</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span style={{ color: "#ff7b72" }}>import</span>
                <span style={{ color: "#79c0ff" }}> boto3</span>
              </div>
              <div className={styles.codeLine}> </div>
              <div className={styles.codeLine}>
                <span>client = boto3.client(</span>
                <span style={{ color: "#a5d6ff" }}>&quot;bedrock-agent-runtime&quot;</span>
                <span>, region_name=</span>
                <span style={{ color: "#a5d6ff" }}>&quot;ap-northeast-1&quot;</span>
                <span>)</span>
              </div>
              <div className={styles.codeLine}> </div>
              <div className={styles.codeLine}>
                <span>response = client.retrieve_and_generate(</span>
              </div>
              <div className={styles.codeLine}>
                <span> input=&#123;</span>
                <span style={{ color: "#a5d6ff" }}>&quot;text&quot;</span>
                <span>: </span>
                <span style={{ color: "#a5d6ff" }}>
                  &quot;解約時の違約金について教えてください&quot;
                </span>
                <span>&#125;,</span>
              </div>
              <div className={styles.codeLine}>
                <span> retrieveAndGenerateConfiguration=&#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span style={{ color: "#a5d6ff" }}>&quot;type&quot;</span>
                <span>: </span>
                <span style={{ color: "#a5d6ff" }}>&quot;KNOWLEDGE_BASE&quot;</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span style={{ color: "#a5d6ff" }}>&quot;knowledgeBaseConfiguration&quot;</span>
                <span>: &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span style={{ color: "#a5d6ff" }}>&quot;knowledgeBaseId&quot;</span>
                <span>: </span>
                <span style={{ color: "#a5d6ff" }}>&quot;MY_KB_ID&quot;</span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span style={{ color: "#a5d6ff" }}>&quot;modelArn&quot;</span>
                <span>: </span>
                <span style={{ color: "#a5d6ff" }}>
                  &quot;arn:aws:bedrock:ap-northeast-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0&quot;
                </span>
                <span>,</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span style={{ color: "#a5d6ff" }}>&quot;retrievalConfiguration&quot;</span>
                <span>: &#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span> </span>
                <span style={{ color: "#a5d6ff" }}>&quot;vectorSearchConfiguration&quot;</span>
                <span>: &#123;</span>
                <span style={{ color: "#a5d6ff" }}>&quot;numberOfResults&quot;</span>
                <span>: 5&#125;</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;</span>
              </div>
              <div className={styles.codeLine}>
                <span> &#125;</span>
              </div>
              <div className={styles.codeLine}>
                <span>)</span>
              </div>
              <div className={styles.codeLine}> </div>
              <div className={styles.codeLine}>
                <span>print(response[</span>
                <span style={{ color: "#a5d6ff" }}>&quot;output&quot;</span>
                <span>][</span>
                <span style={{ color: "#a5d6ff" }}>&quot;text&quot;</span>
                <span>])</span>
              </div>
              <div className={styles.codeLine}>
                <span>print(response[</span>
                <span style={{ color: "#a5d6ff" }}>&quot;citations&quot;</span>
                <span>])</span>
              </div>
            </div>
          </div>

          <h3>RAG専用の評価を別立てで行う</h3>
          <p>
            RAGはモデル単体の評価だけでは不十分です。Bedrock Knowledge Basesの評価機能では、Context
            Relevance（検索文脈の関連性）、Faithfulness（生成内容が検索結果に忠実か）、Correctness（正解との一致度）などRAG特有の指標を分離して評価できます。検索コンポーネントと生成コンポーネントのどちらに問題があるかを切り分けることが、改善の第一歩です。
          </p>
        </section>

        <section className={styles.chapter} id="step-4">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>4</div>
            <h2>エージェント構築とマルチエージェント・オーケストレーション（AgentCore）</h2>
          </div>
          <h3>1エージェントに詰め込みすぎない</h3>
          <p>
            単一のエージェントにツールや指示を詰め込みすぎると、システムプロンプトが肥大化し、モデルのツール選択精度が急激に低下します。
          </p>

          <div className={`${styles.alert} ${styles.alertWarning}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <p>
                実務データでは、ツール数が5〜10個程度までは90%以上の精度を維持できても、20個に達すると正しいツールを選択できる確率が6割弱まで落ち込むという報告もあります。専門エージェントごとにツールを5〜6個程度に絞り込み、振り分けは統括（Supervisor）エージェント側に任せる設計が安全です。
              </p>
            </div>
          </div>

          <h3>マルチエージェント・オーケストレーションパターン</h3>
          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <div style={{ width: "100%" }}>
              <MermaidDiagram chart={DIAGRAM_3} />
              <div className={styles.mermaidCaption}>
                図3: Supervisor型マルチエージェント・オーケストレーション
              </div>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>パターン</th>
                  <th>特徴</th>
                  <th>適した場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Supervisor + Routing</td>
                  <td>統括エージェントは振り分けのみ行い、応答生成は専門エージェントに委任</td>
                  <td>シンプルな委譲で十分な場合</td>
                </tr>
                <tr>
                  <td>Supervisor + Orchestration（Collaboration）</td>
                  <td>統括エージェントがタスクを分割し、複数エージェントの結果を統合</td>
                  <td>複数分野の知識を組み合わせた回答が必要な場合</td>
                </tr>
                <tr>
                  <td>A2A Protocol</td>
                  <td>標準化されたAgent Cardを介してエージェント間で通信</td>
                  <td>他チーム・他プラットフォームのエージェントと連携する場合</td>
                </tr>
                <tr>
                  <td>ルールベース（Step Functions）</td>
                  <td>決定論的なワークフローエンジンが実行パスを固定</td>
                  <td>監査要件が厳しい規制業界（保険金支払い判断など）</td>
                </tr>
                <tr>
                  <td>LangGraph</td>
                  <td>宣言的なワークフローグラフ＋Memoryによる状態永続化</td>
                  <td>複雑な状態遷移を伴う長時間タスク</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            規制業界など「同じ入力に対して常に同じ実行パスを説明できる必要がある」場合は、LLMによる動的判断よりもStep
            Functionsのようなルールベースのワークフローエンジンでエージェントを制御するほうが、監査要件に適合しやすいという実務上の知見も報告されています。
          </p>

          <h3>AgentCoreによる本番運用のための主要コンポーネント</h3>
          <ul>
            <li>
              <b>AgentCore Runtime</b>:
              エージェントをセッションごとに隔離されたマイクロVM環境でホストし、ライフサイクル管理・ガードレール適用・ストリーミング応答を担う
            </li>
            <li>
              <b>AgentCore Gateway</b>: 既存のREST
              API（OpenAPI仕様）をコード変更なしにMCPツールとして公開する
            </li>
            <li>
              <b>AgentCore Identity</b>:
              OAuthクレデンシャルやAPIキーを安全に管理し、エージェントコード内へのクレデンシャル露出を防ぐ
            </li>
            <li>
              <b>AgentCore Memory</b>:
              セッションをまたいだ文脈の永続化と、ストリーミング通知による状態共有
            </li>
            <li>
              <b>AgentCore Observability</b>: OpenTelemetry準拠のトレースをCloudWatchに集約
            </li>
            <li>
              <b>AgentCore Evaluations</b>: 継続的な品質評価（Step 10で詳述）
            </li>
            <li>
              <b>Policy制御（Cedar言語）</b>:
              エージェントがツール呼び出しを実行する前に、推論ループの外側で許可判定を行う決定論的な制御層
            </li>
          </ul>

          <h3>PoCから本番への「谷」を越えるための実践知</h3>
          <p>
            re:Invent 2025のセッションで語られた知見として、PoCと本番運用の間には「PoC to production
            chasm」と呼ばれる大きなギャップが存在します。これを越えるための実践的な指針は次の通りです。
          </p>
          <ol>
            <li>小さく始める（Start small） — 1つのユースケースに絞ってエンドツーエンドで動かす</li>
            <li>可観測性を最初から組み込む（Observability from day one）</li>
            <li>ツールを最小限に絞って公開する</li>
            <li>評価を継続的に実行する仕組みを用意する</li>
            <li>必要になった時点でマルチエージェント化する（最初から複雑にしない）</li>
            <li>セキュアなスケーリングを設計する（IAM・Guardrails・VPC）</li>
            <li>コードで表現できる処理はLLMに判断させない</li>
            <li>継続的なテスト（回帰テスト）をCI/CDに組み込む</li>
          </ol>
        </section>

        <section className={styles.chapter} id="step-5">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>5</div>
            <h2>Guardrailsによる安全性・コンプライアンス制御</h2>
          </div>
          <h3>Guardrailsのフィルタ種類を理解する</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>フィルタ種別</th>
                  <th>主な役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>コンテンツフィルタ</td>
                  <td>暴力・ヘイト・性的表現などの有害コンテンツを検出しブロック</td>
                </tr>
                <tr>
                  <td>拒否トピック（Denied Topics）</td>
                  <td>業務上扱うべきでない話題（法律相談・投資助言など）を自然言語で定義し拒否</td>
                </tr>
                <tr>
                  <td>機密情報フィルタ（PII）</td>
                  <td>クレジットカード番号・氏名・住所などをマスキングまたはブロック</td>
                </tr>
                <tr>
                  <td>ワードフィルタ</td>
                  <td>特定の禁止語句・競合他社名などを直接ブロック</td>
                </tr>
                <tr>
                  <td>プロンプトアタック対策</td>
                  <td>プロンプトインジェクション・脱獄（jailbreak）試行を検出</td>
                </tr>
                <tr>
                  <td>Automated Reasoning checks</td>
                  <td>数学的検証（形式手法）によりハルシネーションや前提の誤りを検出</td>
                </tr>
                <tr>
                  <td>画像コンテンツフィルタ</td>
                  <td>マルチモーダル入出力に含まれる有害な画像を検出</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Automated Reasoning checksは形式論理に基づく検証</h3>
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <span className={styles.alertIcon}>ℹ️</span>
            <div className={styles.alertContent}>
              <p>
                Automated Reasoning
                checksは、他のGuardrailsの機能が確率的な分類モデルであるのに対し、SAT/SMTソルバーに基づく形式手法（Formal
                Verification）で形式論理に則ってモデル出力を検証するという点で本質的に異なります。
              </p>
            </div>
          </div>
          <p>
            HRポリシーや金融商品の約款など、自然言語で書かれたルール文書からポリシーを生成し、モデルの回答がそのルールと論理的に矛盾していないかを検証します。GA時点でAWSは正答検出において最大99%の精度を報告しており、規制業界（金融・保険・製薬）でのハルシネーション対策として採用が進んでいます。
          </p>

          <h3>GuardrailsはIAMで「必須化」する</h3>
          <p>
            Guardrailsをアプリケーションコード側で「呼び出す・呼び出さない」を選べる状態にしておくと、実装漏れによって保護されないパスが生まれます。IAMポリシーの条件キー{" "}
            <code>bedrock:GuardrailIdentifier</code>{" "}
            を用いて、承認されたGuardrailを指定しないInvokeModel呼び出しそのものを拒否する設定にします。
          </p>
        </section>

        <section className={styles.chapter} id="step-6">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>6</div>
            <h2>コスト最適化</h2>
          </div>
          <h3>5つの主要コストレバー</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>施策</th>
                  <th>効果の目安</th>
                  <th>適用条件</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Prompt Caching</td>
                  <td>入力トークンコスト最大90%減、レイテンシ最大85%減</td>
                  <td>システムプロンプトや長文コンテキストを繰り返し利用する場合</td>
                </tr>
                <tr>
                  <td>Intelligent Prompt Routing</td>
                  <td>コスト最大30%減（実測では50〜65%減の報告例も）</td>
                  <td>単純なリクエストと難しいリクエストが混在する場合</td>
                </tr>
                <tr>
                  <td>Batch推論</td>
                  <td>オンデマンド比約50%減</td>
                  <td>リアルタイム応答が不要な非同期処理</td>
                </tr>
                <tr>
                  <td>Provisioned Throughput</td>
                  <td>予測可能な高スループット時のレイテンシ安定化</td>
                  <td>トラフィックが安定して大きい本番ワークロード</td>
                </tr>
                <tr>
                  <td>Model Distillation</td>
                  <td>大型モデル相当の精度を小型・低コストモデルで再現</td>
                  <td>特定タスクに特化させたい場合</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>コスト最適化の意思決定フロー</h3>
          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <div style={{ width: "100%" }}>
              <MermaidDiagram chart={DIAGRAM_4} />
              <div className={styles.mermaidCaption}>図4: コスト最適化の意思決定フロー</div>
            </div>
          </div>
        </section>

        <section className={styles.chapter} id="step-7">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>7</div>
            <h2>推論性能とスケーラビリティ</h2>
          </div>
          <h3>Cross-Region Inferenceの2種類</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>種類</th>
                  <th>特徴</th>
                  <th>適したユースケース</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Geographic Cross-Region Inference</td>
                  <td>米国・EU・APACなど特定の地理的範囲内でのみルーティング</td>
                  <td>データ所在地規制・コンプライアンス要件がある場合</td>
                </tr>
                <tr>
                  <td>Global Cross-Region Inference</td>
                  <td>世界中の商用リージョンへ自動ルーティング</td>
                  <td>データ所在地の制約がなく、最大限のスループットを求める場合</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.chapter} id="step-8">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>8</div>
            <h2>セキュリティとガバナンス</h2>
          </div>
          <h3>リクエストが通過する保護層を可視化する</h3>
          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <div style={{ width: "100%" }}>
              <MermaidDiagram chart={DIAGRAM_5} />
              <div className={styles.mermaidCaption}>
                図5: リクエストが通過するセキュリティ保護層
              </div>
            </div>
          </div>
          <h3>IAM最小権限の徹底</h3>
          <p>
            承認済みのモデルARNのみを明示的に許可し、Permissions BoundaryやIAM Access
            Analyzerで定期的に検証します。
          </p>
        </section>

        <section className={styles.chapter} id="step-9">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>9</div>
            <h2>可観測性とロギング</h2>
          </div>
          <h3>モデル呼び出しレベルの可観測性</h3>
          <p>CloudWatchで以下のシグナルを個別に監視します。</p>
          <ul>
            <li>初回トークンまでのレイテンシ（Time to First Token）</li>
            <li>スロットリング発生率</li>
            <li>トークン消費量（入力・出力・キャッシュ利用分）</li>
            <li>Guardrail発火件数とカテゴリ内訳</li>
            <li>ナレッジベースの取り込みエラー</li>
          </ul>
        </section>

        <section className={styles.chapter} id="step-10">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>10</div>
            <h2>評価とCI/CDへの組み込み</h2>
          </div>
          <h3>評価手法の使い分け</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>手法</th>
                  <th>特徴</th>
                  <th>適した場面</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>自動メトリクス</td>
                  <td>ROUGEなど定量指標を用い高速・低コスト</td>
                  <td>要約・分類など定型タスクの一次スクリーニング</td>
                </tr>
                <tr>
                  <td>人手レビュー</td>
                  <td>最も精度が高いが低速・高コスト</td>
                  <td>本番ローンチ前の最終確認</td>
                </tr>
                <tr>
                  <td>LLM-as-a-Judge</td>
                  <td>人手評価に近い精度をより低コスト・短時間で実現</td>
                  <td>継続的な品質モニタリング、CI/CDへの組み込み</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>評価をCI/CDのゲートにする</h3>
          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <div style={{ width: "100%" }}>
              <MermaidDiagram chart={DIAGRAM_6} />
              <div className={styles.mermaidCaption}>図6: 評価をゲートとするCI/CDパイプライン</div>
            </div>
          </div>
        </section>

        <section className={styles.chapter} id="step-11">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>11</div>
            <h2>AWS Well-Architected Frameworkとの整合</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>柱</th>
                  <th>Bedrockでの適用ポイント</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>運用上の優秀性</td>
                  <td>Prompt Management、継続的評価、CI/CDへの組み込み</td>
                </tr>
                <tr>
                  <td>セキュリティ</td>
                  <td>IAM最小権限、Guardrails強制、VPCエンドポイント、KMS暗号化</td>
                </tr>
                <tr>
                  <td>信頼性</td>
                  <td>Cross-Region Inference、モデルフォールバック戦略、Provisioned Throughput</td>
                </tr>
                <tr>
                  <td>パフォーマンス効率</td>
                  <td>Latency-optimized Inference、タスク難易度に応じたモデル階層化</td>
                </tr>
                <tr>
                  <td>コスト最適化</td>
                  <td>Prompt Caching、Intelligent Prompt Routing、Batch推論</td>
                </tr>
                <tr>
                  <td>持続可能性</td>
                  <td>サーバーレスアーキテクチャの活用、過剰スペックのモデル選定を避ける</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.chapter} id="step-12">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>12</div>
            <h2>本番展開前チェックリスト</h2>
          </div>
          <ul>
            <li>
              ✅ モデルは単一プロバイダーに固定されず、切り替え可能な抽象化レイヤーの背後にあるか
            </li>
            <li>
              ✅ Prompt ManagementでプロンプトがGitやCI/CDと同様のライフサイクルで管理されているか
            </li>
            <li>
              ✅ RAGを使う場合、検索コンポーネントと生成コンポーネントを別々に評価できているか
            </li>
            <li>
              ✅
              エージェントの場合、1エージェントあたりのツール数は絞り込まれているか（目安5〜10個）
            </li>
            <li>✅ Guardrailsが bedrock:GuardrailIdentifier のIAM条件キーで強制されているか</li>
            <li>✅ Model Invocation LoggingとCloudTrailの両方が有効化されているか</li>
            <li>✅ VPCインターフェースエンドポイント経由でプライベートに呼び出しているか</li>
            <li>
              ✅ カスタムモデル・Guardrails・エージェントセッションはKMS CMKで暗号化されているか
            </li>
            <li>✅ Prompt CachingとIntelligent Prompt Routingを適用余地の観点で検討済みか</li>
            <li>✅ Cross-Region Inference / Provisioned Throughputの使い分けを決めているか</li>
            <li>✅ LLM-as-a-Judgeによる継続評価がCI/CDの回帰テストとして組み込まれているか</li>
            <li>✅ AgentCore ObservabilityまたはCloudWatchで異常検知アラートが設定されているか</li>
            <li>
              ✅
              マルチアカウント運用の場合、SCP・IAM・VPCエンドポイントポリシーがStackSetsなどで統一配布されているか
            </li>
          </ul>
        </section>

        <section className={styles.chapter} id="references">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>📚</div>
            <h2>補足: その他のベストプラクティスと参考情報源</h2>
          </div>
          <p>
            以下は、本ガイド作成にあたって参照した主な一次情報源および参考ドキュメント一覧です。
          </p>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>タイトル / 著者</th>
                  <th>内容</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Amazon Bedrock 製品ページ</td>
                  <td>サービス概要</td>
                  <td>
                    <Ext href="https://aws.amazon.com/bedrock/">aws.amazon.com/bedrock</Ext>
                  </td>
                </tr>
                <tr>
                  <td>Amazon Bedrock ユーザーガイド</td>
                  <td>公式ドキュメントポータル</td>
                  <td>
                    <Ext href="https://docs.aws.amazon.com/bedrock/">
                      docs.aws.amazon.com/bedrock
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>Guardrails公式ガイド</td>
                  <td>フィルタ種別の詳細</td>
                  <td>
                    <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html">
                      guardrails.html
                    </Ext>
                  </td>
                </tr>
                <tr>
                  <td>AWS Well-Architected Generative AI Lens</td>
                  <td>6つの柱によるアセスメント</td>
                  <td>
                    <Ext href="https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/generative-ai-lens.html">
                      generative-ai-lens.html
                    </Ext>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.chapter} id="summary">
          <div className={styles.chapterHeader}>
            <div className={styles.chapterNumber}>🚩</div>
            <h2>まとめ</h2>
          </div>
          <p>
            Amazon Bedrockのベストプラクティスは、単発の「Tips集」ではなく、モデル選定 →
            プロンプト設計 → RAG/エージェント構築 → 安全性制御 → コスト最適化 → 性能・可用性 →
            セキュリティ・ガバナンス → 可観測性 →
            継続的評価という一連のライフサイクルとして捉えることが重要です。
          </p>
        </section>

        <footer className={styles.pageFooter}>
          <p>© 2026 AI Model Cost Calculator. Amazon Bedrock Best Practices Guide.</p>
        </footer>
      </main>
    </div>
  );
}
