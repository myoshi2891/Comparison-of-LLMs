import type { Metadata } from "next";
import type { ReactNode } from "react";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Amazon Bedrock 活用ベストプラクティスガイド | AI Hub",
  description:
    "Amazon Bedrockを使ったジェネレーティブAIアプリケーション構築のベストプラクティスを初学者から実務者まで段階的に学べる完全ガイド。",
};

/**
 * Renders content as a link that opens in a new browser tab.
 *
 * @param href - The destination URL
 * @param children - The content displayed inside the link
 */
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/**
 * Presents a step-by-step guide to building and operating Amazon Bedrock applications.
 */
export default function AmazonBedrockBestPracticesGuidePage() {
  return (
    <div className={styles.container}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <i className="ti ti-brand-aws" />
          <span>Amazon Bedrock ガイド</span>
        </div>
        <div className={styles.navGroupTitle}>目次</div>
        <a className={styles.navItem} href="#overview">
          <i className="ti ti-info-circle" />
          Amazon Bedrockとは
        </a>
        <a className={styles.navItem} href="#architecture">
          <i className="ti ti-topology-star-3" />
          全体アーキテクチャ
        </a>
        <a className={styles.navItem} href="#roadmap">
          <i className="ti ti-route" />
          導入ロードマップ
        </a>
        <a className={styles.navItem} href="#step1">
          <i className="ti ti-shield-lock" />
          1. IAM設計と最小権限
        </a>
        <a className={styles.navItem} href="#step2">
          <i className="ti ti-key" />
          2. モデルアクセス有効化
        </a>
        <a className={styles.navItem} href="#step3">
          <i className="ti ti-code" />
          3. 初めてのAPI呼び出し
        </a>
        <a className={styles.navItem} href="#step4">
          <i className="ti ti-prompt" />
          4. プロンプトエンジニアリング
        </a>
        <a className={styles.navItem} href="#step5">
          <i className="ti ti-shield-check" />
          5. Guardrailsの安全性
        </a>
        <a className={styles.navItem} href="#step6">
          <i className="ti ti-database-search" />
          6. Knowledge Bases (RAG)
        </a>
        <a className={styles.navItem} href="#step7">
          <i className="ti ti-robot" />
          7. Agents / AgentCore
        </a>
        <a className={styles.navItem} href="#step8">
          <i className="ti ti-chart-line" />
          8. 評価と可観測性
        </a>
        <a className={styles.navItem} href="#step9">
          <i className="ti ti-coin" />
          9. コスト最適化
        </a>
        <a className={styles.navItem} href="#step10">
          <i className="ti ti-server-cog" />
          10. 本番運用・信頼性
        </a>
        <a className={styles.navItem} href="#best-practices">
          <i className="ti ti-list-check" />
          ベストプラクティス総覧
        </a>
        <a className={styles.navItem} href="#pitfalls">
          <i className="ti ti-alert-triangle" />
          よくある落とし穴
        </a>
        <a className={styles.navItem} href="#references">
          <i className="ti ti-link" />
          参考情報源
        </a>
        <a className={styles.navItem} href="#summary">
          <i className="ti ti-flag-3" />
          まとめ
        </a>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.eyebrow}>
            <i className="ti ti-calendar-event" />
            2026年7月17日時点の情報に基づく
            <span>運用・品質</span>
          </div>
          <h1>Amazon Bedrock 活用ベストプラクティスガイド</h1>
          <p className={styles.leadText}>
            世界トップクラスのAIエンジニア・AWSスペシャリストの視点から、Amazon
            Bedrockを使ったジェネレーティブAIアプリケーション構築のベストプラクティスを、初学者でも迷わず実践できるようステップバイステップで解説します。AWS公式ドキュメント・公式ブログに加え、AWS
            re:Invent
            2025のセッションや著名な実務者・コミュニティの知見を横断的に調査し、根拠となる情報源（URL）とともに整理しています。
          </p>
        </div>

        <section id="overview" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cTeal}`}>
              <i className="ti ti-info-circle" />
            </span>
            Amazon Bedrockとは何か
          </h2>
          <p className={styles.stepSub}>まずBedrockの立ち位置を正しく理解する</p>

          <p>
            Amazon Bedrockは、Anthropic Claude・Meta Llama・Mistral AI・Amazon
            Novaなど複数のAIプロバイダーが提供する100以上の基盤モデル（Foundation Models, FM）を
            <strong>単一の統一API</strong>
            経由で呼び出せる、フルマネージドのサーバーレスサービスです。インフラの構築・管理は不要で、モデルの切り替えは基本的にモデルIDを変更するだけで済みます。Amazonの説明によれば、Bedrockはリーディングなプロバイダーから高性能な基盤モデルへの安全でエンタープライズグレードのアクセスを提供し、Amazon・Anthropic・DeepSeek・Moonshot
            AI・MiniMax・OpenAIを含む複数のプロバイダーから100以上のモデルを利用できるフルマネージドサービスです。
          </p>

          <p>
            Bedrockが単なる「モデルAPI」ではなく<strong>プラットフォーム</strong>
            である理由は、以下の高レベルなビルディングブロックを標準で備えている点にあります。
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              margin: "24px 0",
            }}
          >
            <div
              style={{
                background: "var(--color-background-secondary)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--c-teal-300)", marginBottom: "4px" }}>
                Converse API
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                モデル横断で共通化された推論呼び出しインターフェース
              </div>
            </div>
            <div
              style={{
                background: "var(--color-background-secondary)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--c-coral-300)", marginBottom: "4px" }}>
                Guardrails
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                有害コンテンツ・PII・ハルシネーションを防ぐ安全性レイヤー
              </div>
            </div>
            <div
              style={{
                background: "var(--color-background-secondary)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--c-blue-300)", marginBottom: "4px" }}>
                Knowledge Bases
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                マネージドRAG（検索拡張生成）パイプライン
              </div>
            </div>
            <div
              style={{
                background: "var(--color-background-secondary)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--c-pink-300)", marginBottom: "4px" }}>
                Agents / AgentCore
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                複数ステップのタスクを自律実行するエージェント基盤
              </div>
            </div>
            <div
              style={{
                background: "var(--color-background-secondary)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--c-amber-300)", marginBottom: "4px" }}>
                Model Evaluation
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                自動評価・人手評価・LLM-as-a-Judgeによる品質検証
              </div>
            </div>
            <div
              style={{
                background: "var(--color-background-secondary)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--c-purple-300)", marginBottom: "4px" }}>
                Prompt Management / Flows
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                プロンプトのバージョン管理とワークフロー編成
              </div>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "16px" }}>
            出典：
            <Ext href="https://aws.amazon.com/bedrock/">
              AWS公式ユーザーガイド「What is Amazon Bedrock?」／aws.amazon.com/bedrock/
            </Ext>
          </div>
        </section>

        <section id="architecture" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cBlue}`}>
              <i className="ti ti-topology-star-3" />
            </span>
            全体アーキテクチャを理解する
          </h2>
          <p className={styles.stepSub}>
            Bedrockを中核としたジェネレーティブAIアプリケーションの典型構成
          </p>

          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <MermaidDiagram
              chart={`flowchart TB
    subgraph "クライアント層"
        A["Webアプリ / モバイルアプリ / 業務システム"]
    end
    subgraph "Amazon Bedrock"
        B["統一API<br/>Converse API / InvokeModel API"]
        C["基盤モデル<br/>Nova・Claude・Llama・Mistral 等"]
        D["Guardrails<br/>安全性フィルタ"]
        E["Knowledge Bases<br/>マネージドRAG"]
        F["Agents / AgentCore<br/>自律型タスク実行"]
        G["Model Evaluation<br/>品質評価"]
    end
    subgraph "データ層"
        H["Amazon S3<br/>ドキュメント"]
        I["ベクトルストア<br/>OpenSearch Serverless 等"]
    end
    A --> B
    B --> D
    D --> C
    B --> E
    E --> H
    E --> I
    B --> F
    F --> E
    F --> D
    C --> G`}
            />
          </div>
          <div className={styles.mermaidCaption}>図1：Amazon Bedrock 全体アーキテクチャ</div>

          <p>初学者がまず押さえるべきポイントは次の3つです。</p>
          <ol>
            <li>
              <strong>モデルはあくまで「差し替え可能な部品」</strong>
              であり、アプリケーションのロジックはモデルIDを変えるだけで別モデルに切り替えられるよう設計する
            </li>
            <li>
              <strong>Guardrailsは基盤モデルの前後に必ず挟む</strong>
              安全性レイヤーであり、後付けではなく設計初期から組み込む
            </li>
            <li>
              <strong>RAG（Knowledge Bases）とAgents（AgentCore）は別レイヤー</strong>
              であり、「知識を与えるRAG」と「行動させるAgent」を混同しない
            </li>
          </ol>
        </section>

        <section id="roadmap" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cPurple}`}>
              <i className="ti ti-route" />
            </span>
            導入ロードマップ（10ステップ概観）
          </h2>
          <p className={styles.stepSub}>本ガイド全体の流れ</p>

          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <MermaidDiagram
              chart={`%%{init: {"flowchart": {"useMaxWidth": false}}}%%
flowchart LR
    S1["Step1<br/>IAM設計・最小権限"] --> S2["Step2<br/>モデルアクセス有効化"]
    S2 --> S3["Step3<br/>初回API呼び出し"]
    S3 --> S4["Step4<br/>プロンプト設計"]
    S4 --> S5["Step5<br/>Guardrails設定"]
    S5 --> S6["Step6<br/>Knowledge Bases構築"]
    S6 --> S7["Step7<br/>Agents / AgentCore構築"]
    S7 --> S8["Step8<br/>評価とオブザーバビリティ"]
    S8 --> S9["Step9<br/>コスト最適化"]
    S9 --> S10["Step10<br/>本番運用・ガバナンス"]`}
            />
          </div>
          <div className={styles.mermaidCaption}>図2：導入ロードマップ</div>
        </section>

        <section id="step1" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cCoral}`}>1</span>
            IAM設計と最小権限の原則
          </h2>
          <p className={styles.stepSub}>Bedrockのベストプラクティスで最初かつ最重要な土台</p>

          <p>
            AWS Well-Architected Generative AI
            Lensでは、基盤モデルエンドポイントへのアクセスは最小権限で許可することが明示的なベストプラクティス（
            <code>GENSEC01-BP01</code>
            ）として定義されています。最小権限アクセスは生成AIワークロードにIDベースのセキュリティレイヤーを確立し、認可されたIDのみがモデルエンドポイントにアクセスできることを保証するために重要です。
          </p>

          <h3>初学者向けの実践手順</h3>
          <ol>
            <li>
              Bedrock専用のIAMロールをタスクごとに分離する（プロンプトエンジニア用ロール、エージェント実行用ロール、監視用ロールなど）
            </li>
            <li>
              <code>bedrock:InvokeModel</code> を許可する際は <code>Resource</code> を{" "}
              <code>*</code>{" "}
              にせず、利用するモデル・インファレンスプロファイルARNに絞り込み、Guardrail制限は{" "}
              <code>bedrock:GuardrailIdentifier</code> 条件で制御する（Knowledge
              Baseアクセス権限は別途 <code>bedrock:Retrieve</code> /{" "}
              <code>bedrock:RetrieveAndGenerate</code> ガイドに切り離す）
            </li>
            <li>
              Bedrock API keys（サービス固有認証情報）よりも、可能な限り
              <strong>AWS STSによる一時的な認証情報</strong>を優先する
            </li>
            <li>
              エージェントのワークフローでは、実行ロールとプロンプトエンジニア用ロールを分離し、権限境界（Permissions
              Boundary）を設定する
            </li>
          </ol>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>JSON</span>
              <span>IAMポリシー例（最小権限の考え方）</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Version&quot;</span>:{" "}
                <span className={styles.cs}>&quot;2012-10-17&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Statement&quot;</span>: [
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Effect&quot;</span>:{" "}
                <span className={styles.cs}>&quot;Allow&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Action&quot;</span>:{" "}
                <span className={styles.cs}>&quot;bedrock:InvokeModel&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Resource&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Effect&quot;</span>:{" "}
                <span className={styles.cs}>&quot;Allow&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Action&quot;</span>:{" "}
                <span className={styles.cs}>&quot;bedrock:ApplyGuardrail&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Resource&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;arn:aws:bedrock:us-east-1:123456789012:guardrail/my-production-guardrail&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Effect&quot;</span>:{" "}
                <span className={styles.cs}>&quot;Deny&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Action&quot;</span>:{" "}
                <span className={styles.cs}>&quot;bedrock:InvokeModel&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Resource&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0&quot;
                </span>
                ,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;Condition&quot;</span>:{" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;StringNotEquals&quot;</span>:{" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.ck}>&quot;bedrock:GuardrailIdentifier&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;arn:aws:bedrock:us-east-1:123456789012:guardrail/my-production-guardrail/1&quot;
                </span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}> ]</div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>{"}"}</span>
              </div>
            </div>
          </div>

          <div className={`${styles.calloutBox} ${styles.info}`}>
            <div className={styles.calloutTitle}>
              <i className="ti ti-info-circle" />
              職務分離の推奨
            </div>
            <div>
              エージェントを作成するプロンプトエンジニアと、IAMサービスロールを作成するセキュリティエンジニアには
              <strong>別々のIAMロール</strong>
              を用意し、職務分離によってリソースへの過剰な権限付与を防ぐことが推奨されます。
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "16px" }}>
            出典：
            <Ext href="https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/">
              AWS Security Blog「Implementing least privilege access for Amazon Bedrock」
            </Ext>
            ／AWS Well-Architected Generative AI Lens GENSEC01-BP01, GENSEC05-BP01
          </div>
        </section>

        <section id="step2" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cBlue}`}>2</span>
            モデルアクセスの有効化
          </h2>
          <p className={styles.stepSub}>コンソールから利用モデルを選定する</p>

          <p>
            AWSマネジメントコンソールの「Model
            access」画面から、利用したいモデルへのアクセスをリクエスト・有効化します。多くのモデルは即時利用可能ですが、一部は利用規約への同意やユースケース申請が必要です。
          </p>

          <h3>ベストプラクティス</h3>
          <ul>
            <li>
              本番運用前に、複数モデル（コスト重視の軽量モデルと高精度モデル）へのアクセスを事前に有効化し、後述の
              <strong>モデルルーティング</strong>に備える
            </li>
            <li>
              Bedrockのモデルカタログは18以上のプロバイダーから100以上のモデルを提供し、ほぼ毎月更新されているため、定期的にカタログを見直すプロセスを運用に組み込む
            </li>
            <li>
              組織全体でモデルアクセスを一元管理する場合は、AWS
              Organizationsのサービスコントロールポリシー（SCP）と組み合わせて、利用可能なモデルを組織単位で制御する
            </li>
          </ul>
        </section>

        <section id="step3" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cTeal}`}>3</span>
            初めてのAPI呼び出し（Converse API）
          </h2>
          <p className={styles.stepSub}>モデル横断で共通化された呼び出し方式から始める</p>

          <p>
            Bedrockでは、モデルプロバイダーごとに異なっていたリクエスト形式を統一する
            <strong>Converse API</strong>
            の使用が推奨されます。これにより、モデルを切り替えてもアプリケーションコードの変更を最小限にできます。
          </p>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>Python</span>
              <span>boto3実装例</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span> boto3
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                client = boto3.client(<span className={styles.cs}>&quot;bedrock-runtime&quot;</span>
                , region_name=<span className={styles.cs}>&quot;us-east-1&quot;</span>)
              </div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>response = client.converse(</div>
              <div className={styles.codeLine}>
                {" "}
                modelId=<span className={styles.cs}>&quot;anthropic.claude-opus-4-7&quot;</span>,
              </div>
              <div className={styles.codeLine}> messages=[</div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;role&quot;</span>:{" "}
                <span className={styles.cs}>&quot;user&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;content&quot;</span>: [
                <span className={styles.cs}>{"{"}</span>
                <span className={styles.cs}>&quot;text&quot;</span>:{" "}
                <span className={styles.cs}>&quot;Amazon Bedrockの特徴を教えてください&quot;</span>
                <span className={styles.cs}>{"}"}</span>]
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}> ],</div>
              <div className={styles.codeLine}>
                {" "}
                inferenceConfig=<span className={styles.cs}>{"{"}</span>
                <span className={styles.cs}>&quot;maxTokens&quot;</span>: 1024
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine} />
              <div className={styles.codeLine}>
                print(response[<span className={styles.cs}>&quot;output&quot;</span>][
                <span className={styles.cs}>&quot;message&quot;</span>][
                <span className={styles.cs}>&quot;content&quot;</span>][0][
                <span className={styles.cs}>&quot;text&quot;</span>])
              </div>
            </div>
          </div>

          <h3>初学者がつまずきやすいポイント</h3>
          <ul>
            <li>
              モデルによって最大トークン数・対応言語・レイテンシ特性が異なるため、必ず対象モデルのドキュメントを確認する
            </li>
            <li>
              同期呼び出し（<code>invoke_model</code> / <code>converse</code>
              ）とストリーミング呼び出し（<code>invoke_model_with_response_stream</code> /{" "}
              <code>converse_stream</code>
              ）を用途に応じて使い分ける（チャットUIではストリーミングが体感速度を大きく改善する）
            </li>
          </ul>

          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "16px" }}>
            出典：
            <Ext href="https://docs.aws.amazon.com/bedrock/">
              AWS公式ドキュメント「Amazon Bedrock Documentation」／docs.aws.amazon.com/bedrock/
            </Ext>
          </div>
        </section>

        <section id="step4" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cPurple}`}>4</span>
            プロンプトエンジニアリングの基礎
          </h2>
          <p className={styles.stepSub}>出力品質はプロンプト設計で大きく変わる</p>

          <p>
            AWSの公式ガイダンスでは、ハルシネーションを減らすにはプロンプト最適化の手法でプロンプトを改善するか、RAGを使ってモデルにより関連性の高いデータへのアクセスを与えるか、あるいは別のモデルを使用することが有効とされています。
          </p>

          <h3>初学者向けベストプラクティス</h3>
          <ol>
            <li>
              <strong>タスクを明確に分解する</strong>
              ：曖昧な依頼ではなく、対象・観点・出力形式を具体的に指定する。「Amazon
              S3について」ではなく「ソリューションアーキテクトアソシエイト試験のためのAmazon
              S3とAmazon
              EBSの3つの主な違い」のように依頼することで、適切にスコープされた回答が得られます。
            </li>
            <li>
              <strong>モデルごとのプロンプト作法に従う</strong>：例えばAnthropic
              Claudeでは、少数ショット例の最後の回答を意図的に省略し <code>Assistant:</code>{" "}
              で終えることでモデルに続きを生成させる手法が有効です。
            </li>
            <li>
              <strong>Prompt Optimizationを活用する</strong>
              ：Bedrockのプロンプト最適化機能は、Claude・Llama・Mistral・Titanなど複数モデル向けにプロンプトを自動的に書き直し、応答品質を改善できます。
            </li>
            <li>
              <strong>Prompt Cachingで反復コンテキストを再利用する</strong>
              ：システムプロンプトや長いドキュメントを繰り返し送る場合、プロンプトキャッシュによって入力トークンコストとレイテンシを大幅に削減できます。
            </li>
            <li>
              <strong>Tool Use（Function Calling）で構造化出力を安定させる</strong>
              ：自由記述よりも、JSON Schemaに基づくTool
              Useを使う方が構造化データの抽出精度が安定します。
            </li>
          </ol>

          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "16px" }}>
            出典：
            <Ext href="https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock">
              AWS ML Blog「Prompt engineering techniques and best practices」
            </Ext>
            ／
            <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html">
              AWS公式「Prompt engineering guidelines」
            </Ext>
          </div>
        </section>

        <section id="step5" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cRed}`}>5</span>
            Guardrailsによる安全性の確保
          </h2>
          <p className={styles.stepSub}>モデル非依存の防御レイヤーを最初から組み込む</p>

          <p>
            Amazon Bedrock Guardrailsは、ユースケースと責任あるAIポリシーに基づいて設定できる
            <strong>6つの安全対策（Safeguard）</strong>を提供します。
          </p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>安全対策</th>
                <th>機能概要</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>コンテンツフィルタ</td>
                <td>
                  ヘイト・侮辱・性的表現・暴力・違法行為・プロンプト攻撃を検知（感度をLow〜Highで調整可）
                </td>
              </tr>
              <tr>
                <td>禁止トピック（Denied Topics）</td>
                <td>特定の話題（例：法律相談、競合他社の話題）への言及を拒否</td>
              </tr>
              <tr>
                <td>単語フィルタ</td>
                <td>特定の単語・フレーズを入出力からブロック</td>
              </tr>
              <tr>
                <td>機密情報フィルタ（PII）</td>
                <td>氏名・住所・電話番号・クレジットカード番号などを検出しマスキング／ブロック</td>
              </tr>
              <tr>
                <td>コンテキスト根拠確認</td>
                <td>
                  応答が根拠データに基づいているか、質問と関連しているかを評価しハルシネーションを検出
                </td>
              </tr>
              <tr>
                <td>Automated Reasoning checks</td>
                <td>数理論理検証によりファクトの正確性を検証・説明</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <MermaidDiagram
              chart={`%%{init: {"flowchart": {"rankSpacing": 24, "nodeSpacing": 20}}}%%
flowchart TD
    In["ユーザー入力"] --> L1{"コンテンツフィルタ<br/>有害カテゴリ検出"}
    L1 -->|"通過"| L2{"トピックフィルタ<br/>禁止トピック判定"}
    L1 -->|"違反"| Blocked["ブロック / 代替応答"]
    L2 -->|"通過"| L3{"機密情報フィルタ<br/>PII検出"}
    L2 -->|"違反"| Blocked
    L3 -->|"マスキング後"| L4["基盤モデル呼び出し"]
    L4 --> L5{"コンテキスト根拠確認<br/>ハルシネーション検出"}
    L5 -->|"通過"| L6{"Automated Reasoning<br/>事実検証"}
    L5 -->|"違反"| Blocked
    L6 -->|"通過"| Out["ユーザーへ応答"]
    L6 -->|"違反"| Blocked`}
            />
          </div>
          <div className={styles.mermaidCaption}>図3：Guardrailsの多層防御フロー</div>

          <h3>導入のベストプラクティス（段階的ロールアウト）</h3>
          <ol>
            <li>
              まずは非本番環境で「コンテンツフィルタ」と「禁止トピック」のみを持つ単一のGuardrailから始め、CloudWatchメトリクスでブロック率・誤検知率を1週間程度観測してから、PIIフィルタとコンテキスト根拠確認を段階的に追加する
            </li>
            <li>
              複数のGuardrail（組織全体・部門別・アプリケーション別）を
              <strong>レイヤーとして重ねて</strong>適用できる
            </li>
            <li>
              モデル呼び出しを行わずにテキストのみを検査したい場合は <code>ApplyGuardrail</code>{" "}
              APIを使う（例：ユーザー投稿の事前スクリーニング）
            </li>
            <li>
              コンテキスト根拠確認のしきい値を低く設定しすぎると、関連性の薄い情報を応答に混入させるリスクが増す点に注意する
            </li>
            <li>
              Amazon Bedrock以外でホストされたモデルにも <code>ApplyGuardrail</code>{" "}
              APIで同じ安全基準を適用でき、マルチモデル環境でも一貫した保護が可能
            </li>
          </ol>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>Python</span>
              <span>boto3実装例</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>response = bedrock_runtime.apply_guardrail(</div>
              <div className={styles.codeLine}>
                {" "}
                guardrailIdentifier=<span className={styles.cs}>&quot;my-guardrail-id&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                guardrailVersion=<span className={styles.cs}>&quot;1&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                source=<span className={styles.cs}>&quot;INPUT&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                content=[<span className={styles.cs}>{"{"}</span>
                <span className={styles.cs}>&quot;text&quot;</span>:{" "}
                <span className={styles.cs}>{"{"}</span>
                <span className={styles.cs}>&quot;text&quot;</span>:{" "}
                <span className={styles.cs}>
                  &quot;私のSSNは123-45-6789です。口座について教えて&quot;
                </span>
                <span className={styles.cs}>{"}"}</span>
                <span className={styles.cs}>{"}"}</span>]
              </div>
              <div className={styles.codeLine}>)</div>
              <div className={styles.codeLine}>
                print(response[<span className={styles.cs}>&quot;action&quot;</span>]){" "}
                <span className={styles.cc}># GUARDRAIL_INTERVENED または NONE</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "16px" }}>
            出典：
            <Ext href="https://aws.amazon.com/bedrock/guardrails/">
              Amazon Bedrock Guardrails 製品ページ
            </Ext>
          </div>
        </section>

        <section id="step6" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cGreen}`}>6</span>
            Knowledge Basesを使ったRAGの構築
          </h2>
          <p className={styles.stepSub}>マネージドRAGパイプラインで知識を与える</p>

          <p>
            Knowledge Bases for Amazon
            Bedrockは、S3上のドキュメントを自動的にチャンク分割・ベクトル化し、ベクトルストアへ格納・同期する、マネージドRAGパイプラインです。S3バケットからのデータ同期、チャンク分割、ベクトル埋め込みの生成、ベクトルインデックスへの格納を管理し、インテリジェントな差分検出・スループット管理・障害管理が組み込まれています。
          </p>

          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <MermaidDiagram
              chart={`%%{init: {"flowchart": {"useMaxWidth": false}}}%%
flowchart LR
    subgraph "データ取り込み（非同期・事前処理）"
        D1["S3上のドキュメント"] --> D2["パース・チャンキング"]
        D2 --> D3["埋め込みモデルでベクトル化"]
        D3 --> D4["ベクトルストアに格納"]
    end
    subgraph "実行時（同期・リアルタイム）"
        Q["ユーザーの質問"] --> QE["質問文をベクトル化"]
        QE --> R["ベクトル検索・ハイブリッド検索"]
        D4 --> R
        R --> CH["関連チャンクを抽出"]
        CH --> G["基盤モデルにコンテキストとして注入"]
        G --> Ans["根拠付きの回答を生成"]
    end`}
            />
          </div>
          <div className={styles.mermaidCaption}>図4：RAGパイプラインの全体像</div>

          <h3>チャンキング戦略の選び方</h3>
          <p>
            RAGの品質は<strong>チャンキング設定</strong>
            に大きく左右されます。以下は主要な戦略の比較です。
          </p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>戦略</th>
                <th>特徴</th>
                <th>推奨用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>固定サイズ（Fixed-size）</td>
                <td>トークン数とオーバーラップ率を指定して機械的に分割。最もシンプルで高速</td>
                <td>開発初期の高速なイテレーション</td>
              </tr>
              <tr>
                <td>階層的（Hierarchical）</td>
                <td>親子関係を持つチャンクを生成し、粗い検索と詳細な文脈の両方を確保</td>
                <td>本番環境のデフォルトとして堅牢性が高い</td>
              </tr>
              <tr>
                <td>セマンティック（Semantic）</td>
                <td>意味的なまとまりで分割し文脈の一貫性を保持</td>
                <td>均質で密度の高い文章（論文・記事等）</td>
              </tr>
              <tr>
                <td>構文木ベース（Syntax-aware）</td>
                <td>Markdown見出しやコード構造など文書構造を保持して分割</td>
                <td>技術文書・API仕様書など構造化文書</td>
              </tr>
              <tr>
                <td>チャンクなし（No chunking）</td>
                <td>文書全体を1チャンクとして扱う</td>
                <td>小規模・事前分割済みの文書のみ（本番非推奨）</td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.calloutBox} ${styles.success}`}>
            <div className={styles.calloutTitle}>
              <i className="ti ti-bulb" />
              推奨構成
            </div>
            <div>
              実務者による検証では、
              <strong>階層的チャンキング＋ハイブリッド検索＋リランキング</strong>
              の組み合わせが本番環境で最も堅牢なデフォルトとされています。文書が一様に密な散文の場合のみセマンティックへの切り替えを検討し、開発時の素早いイテレーションにはFixed-sizeを使うのが実践的です。
            </div>
          </div>

          <div className={`${styles.calloutBox} ${styles.warning}`}>
            <div className={styles.calloutTitle}>
              <i className="ti ti-alert-triangle" />
              注意点
            </div>
            <div>
              複数戦略を実際のコーパスでベンチマークした検証では、5種類のチャンキング戦略のうち実際に本番の技術文書コーパスを処理できたのは3種類のみだったと報告されています。「机上の比較」ではなく
              <strong>自組織のデータで実測すること</strong>が強く推奨されます。
            </div>
          </div>

          <h3>その他のRAGベストプラクティス</h3>
          <ul>
            <li>オーバーラップ率は10〜15%を目安に、文脈の連続性と検索精度のバランスを取る</li>
            <li>
              パース設定（表・グラフなど複雑なレイアウトの扱い）はデフォルト設定のままにせず、実データで調整する
            </li>
            <li>小規模なドキュメントセットから始め、検索品質をテストしながら段階的に拡張する</li>
            <li>
              RAG評価機能を使い、チャンキング戦略やベクトル長、生成モデルの違いによる性能差を定量的に比較する
            </li>
          </ul>

          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>Python</span>
              <span>boto3実装例</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                response = bedrock_agent_runtime.retrieve_and_generate(
              </div>
              <div className={styles.codeLine}>
                {" "}
                input=<span className={styles.cs}>{"{"}</span>
                <span className={styles.cs}>&quot;text&quot;</span>:{" "}
                <span className={styles.cs}>&quot;返品ポリシーについて教えてください&quot;</span>
                <span className={styles.cs}>{"}"}</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                retrieveAndGenerateConfiguration=<span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;type&quot;</span>:{" "}
                <span className={styles.cs}>&quot;KNOWLEDGE_BASE&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;knowledgeBaseConfiguration&quot;</span>:{" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;knowledgeBaseId&quot;</span>:{" "}
                <span className={styles.cs}>&quot;XXXXXXXXXX&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;modelArn&quot;</span>:{" "}
                <span className={styles.cs}>&quot;anthropic.claude-opus-4-7&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;generationConfiguration&quot;</span>:{" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;guardrailConfiguration&quot;</span>:{" "}
                <span className={styles.cs}>{"{"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;guardrailId&quot;</span>:{" "}
                <span className={styles.cs}>&quot;my-guardrail-id&quot;</span>,
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>&quot;guardrailVersion&quot;</span>:{" "}
                <span className={styles.cs}>&quot;1&quot;</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>
                {" "}
                <span className={styles.cs}>{"}"}</span>
              </div>
              <div className={styles.codeLine}>)</div>
            </div>
          </div>
        </section>

        <section id="step7" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cPink}`}>7</span>
            Agents / AgentCoreによる自律型AI
          </h2>
          <p className={styles.stepSub}>「知識を与えるRAG」に対し「行動させる」レイヤー</p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>種類</th>
                <th>特徴</th>
                <th>向いているチーム</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bedrock Agents（クラシック）</td>
                <td>アクショングループとKnowledge Basesを宣言的に設定。ノーコード／ローコード</td>
                <td>素早く始めたいチーム</td>
              </tr>
              <tr>
                <td>Bedrock AgentCore</td>
                <td>
                  LangGraphやStrands
                  Agentsなど任意のフレームワーク・独自コードで構築するサーバーレスコンテナランタイム
                </td>
                <td>本番グレードで細かい制御が必要なチーム</td>
              </tr>
            </tbody>
          </table>

          <p>
            AgentCoreは2025年10月13日にGA（一般提供開始）となり、AWSは「あらゆるフレームワーク、モデル、プロトコルを用いて安全かつスケーラブルにエージェントを構築・デプロイ・運用するためのプラットフォーム」と説明しています。
          </p>

          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <MermaidDiagram
              chart={`flowchart TB
    Agent["エージェントコード<br/>LangGraph / Strands Agents 等"] --> RT["AgentCore Runtime<br/>セッション分離実行環境"]
    subgraph "Amazon Bedrock AgentCore"
        RT
        MEM["Memory<br/>短期・長期記憶"]
        GW["Gateway<br/>ツール接続 / MCP対応"]
        ID["Identity<br/>認証・認可"]
        OBS["Observability<br/>OpenTelemetry連携"]
        EVAL["Evaluations<br/>LLM-as-a-Judge"]
    end
    RT --> MEM
    RT --> GW
    GW --> Tools["外部API / Lambda / MCPサーバー"]
    ID --> RT
    RT --> OBS
    OBS --> CW["Amazon CloudWatch"]
    OBS --> EVAL`}
            />
          </div>
          <div className={styles.mermaidCaption}>図5：AgentCoreのコンポーネント構成</div>

          <h3>本番投入前のベストプラクティス</h3>
          <ol>
            <li>
              <strong>セッション分離を確認する</strong>：AgentCore
              Runtimeでは各セッションが独立したmicroVMで実行され、ファイルシステムとシェルアクセスを持ちます
            </li>
            <li>
              <strong>自然言語でツール境界を定義する</strong>
              ：AgentCoreは「営業時間内のみ顧客データにアクセスできる」といったルールを、カスタム認可ロジックを書かずに自然言語ポリシーからオープンソースの認可ポリシー言語Cedarへ自動的に変換できます
            </li>
            <li>
              <strong>デプロイ前に必ず評価を実行する</strong>
              ：ビルトイン評価フレームワークにより、精度・安全性のリグレッションを自動検出できます（AIエージェント向けのユニットテストに相当）
            </li>
            <li>
              <strong>Gatewayでツールアクセスを一元化する</strong>：Lambda関数・REST
              API・MCPサーバーをGateway経由で標準化することで、個別のツール統合コードを削減しつつ、認証・リトライ・監査ログを一元管理できます
            </li>
            <li>
              <strong>本番運用にはVPCとPrivateLinkを組み込む</strong>：GAと同時にVPCサポート・AWS
              PrivateLink・CloudFormation・リソースタグ付けが追加され、エンタープライズのネットワーク境界にエージェントを統合しやすくなりました
            </li>
          </ol>
        </section>

        <section id="step8" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cAmber}`}>8</span>
            モデル評価とオブザーバビリティ
          </h2>
          <p className={styles.stepSub}>「動くAIアプリ」と「信頼できるAIアプリ」の違い</p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>評価方式</th>
                <th>特徴</th>
                <th>向いている場面</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>自動評価（Automatic）</td>
                <td>完全一致・ROUGE等の伝統的NLP指標で高速に評価</td>
                <td>分類・要約タスクの一次スクリーニング</td>
              </tr>
              <tr>
                <td>人手評価（Human review）</td>
                <td>人間のレビュアーがスコアリング。最も高精度だが低速・高コスト</td>
                <td>最終品質保証、判断が難しいケース</td>
              </tr>
              <tr>
                <td>LLM-as-a-Judge</td>
                <td>別のLLMが応答を採点し、根拠となる説明も出力</td>
                <td>主観的な品質（トーン・共感等）を人手評価に近いコストで評価</td>
              </tr>
            </tbody>
          </table>

          <p>
            Bedrock Model
            Evaluationでは、正確性・完全性・文体・トーンといった品質指標に加え、有害性や回答拒否率などの責任あるAI指標もLLM-as-a-Judgeで評価でき、複数の評価ジョブにわたる結果を比較して迅速な意思決定が可能になります。
          </p>

          <h3>評価運用のベストプラクティス</h3>
          <ol>
            <li>
              RAGアプリケーションでは、モデル単体でなく<strong>パイプライン全体</strong>
              （検索品質・コンテキスト関連性・回答の根拠性・引用網羅性）を評価対象に含める
            </li>
            <li>
              AgentCore
              Evaluationsのビルトイン評価者（13種類）を使い、目標達成率・有用性・安全性・ツール選択精度をCloudWatch上で継続的にモニタリングする
            </li>
            <li>
              評価をCI/CDパイプラインに組み込み、しきい値ベースのPass/Failゲートとしてリグレッションを検出する
            </li>
            <li>
              OpenTelemetry（OTel）ベースの計装を統一し、CloudWatch Transaction
              Searchを有効化しておく（これを怠るとスパンクエリが機能しない）
            </li>
            <li>
              本番投入後もモデルや利用者行動の変化により品質は静かに劣化していくため、定期的な再評価とA/Bテストを運用サイクルに組み込む
            </li>
          </ol>
        </section>

        <section id="step9" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cGreen}`}>9</span>
            コスト最適化
          </h2>
          <p className={styles.stepSub}>推論の課金モード選択がコストの大部分を左右する</p>

          <div className={`${styles.calloutBox} ${styles.success}`}>
            <div className={styles.calloutTitle}>
              <i className="ti ti-coin" />
              コスト削減の実績
            </div>
            <div>
              実務者のコスト最適化事例では、バッチ推論（非同期ワークロードで約50%割引）・プロンプトキャッシング（キャッシュされた入力トークンで最大90%安価）・モデルルーティング（簡単なタスクには安価なモデル、40〜70%のコスト削減）を組み合わせたプレイブックにより、ある顧客が月額4万ドルから1万8千ドルへコストを削減した事例が報告されています。
            </div>
          </div>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>モード</th>
                <th>課金方式</th>
                <th>向いている用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>オンデマンド（On-Demand）</td>
                <td>入出力トークン数に応じた従量課金</td>
                <td>不規則・低頻度・PoC段階のワークロード</td>
              </tr>
              <tr>
                <td>バッチ推論（Batch）</td>
                <td>オンデマンドの約50%割引で非同期実行</td>
                <td>リアルタイム性が不要な大量処理（要約・分類・抽出）</td>
              </tr>
              <tr>
                <td>プロビジョンドスループット（Provisioned Throughput）</td>
                <td>モデルユニットを時間単位で予約し定額課金</td>
                <td>安定的かつ高頻度で、低レイテンシ保証が必要な本番ワークロード</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.mermaidContainer} data-testid="mermaid-diagram">
            <MermaidDiagram
              chart={`%%{init: {"flowchart": {"rankSpacing": 24, "nodeSpacing": 20}}}%%
flowchart TD
    Start["ワークロードの特性を確認"] --> Q1{"トラフィックは<br/>予測可能か？"}
    Q1 -->|"不規則・低頻度"| OD["オンデマンド<br/>従量課金"]
    Q1 -->|"安定・高頻度"| Q2{"リアルタイム応答が<br/>必要か？"}
    Q2 -->|"不要（非同期でよい）"| Batch["バッチ推論<br/>約50%割引"]
    Q2 -->|"必要"| Q3{"利用率が損益分岐点を<br/>継続的に超えるか？"}
    Q3 -->|"Yes"| PT["プロビジョンドスループット<br/>予約容量・低レイテンシ保証"]
    Q3 -->|"No"| OD`}
            />
          </div>
          <div className={styles.mermaidCaption}>図6：課金モードの選択フロー</div>

          <h3>コスト最適化のベストプラクティス</h3>
          <ol>
            <li>
              <strong>プロビジョンドスループットは「利用率」を必ず監視する</strong>
              ：ある事例では、負荷テスト時に設定したプロビジョンドスループットをオンデマンドへ戻し忘れ、利用率15%のまま3か月間コストが垂れ流された事例が報告されています
            </li>
            <li>
              <strong>モデルルーティングを設計する</strong>
              ：単純なタスク（分類・簡単な抽出）には軽量・低コストモデルを、複雑なタスク（多段推論・複雑な文書分析）には高性能モデルを割り当てる
            </li>
            <li>
              <strong>LLM-as-a-Judgeでモデルダウングレードの妥当性を検証する</strong>
              ：安価なモデルへの切り替えが品質を損なわないかをベンチマークで確認してから本番反映する
            </li>
            <li>
              <strong>オブザーバビリティでコストドリフトを検知する</strong>
              ：OpenTelemetryベースの計測とダッシュボードにより、想定外のコスト増加を早期に検知する
            </li>
            <li>
              <strong>ストレージ・データ転送コストも見落とさない</strong>：Knowledge
              Basesの埋め込み保存やログ出力先（S3/CloudWatch Logs）のコストも積算する
            </li>
          </ol>
        </section>

        <section id="step10" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cBlue}`}>10</span>
            本番運用・信頼性・データレジデンシー
          </h2>
          <p className={styles.stepSub}>可用性・スループット・データ所在の設計</p>

          <h3>クロスリージョン推論（Cross-Region Inference, CRIS）の活用</h3>
          <p>
            Bedrockのクロスリージョン推論は、単一リージョンの容量では吸収しきれないバーストトラフィックを、複数リージョンの容量へ自動的に分散させる仕組みです。可用性・レイテンシ・現在の需要といったリアルタイムの要因に基づいてリクエストを最適な宛先リージョンへ自動ルーティングし、ピーク利用時のトラフィックバーストや、AWSリージョンのサービスクォータがインファレンスに与える影響を低減します。
          </p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>方式</th>
                <th>特徴</th>
                <th>選択基準</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Geographic CRIS</td>
                <td>地理的境界内でのみルーティング</td>
                <td>データレジデンシー要件がある場合</td>
              </tr>
              <tr>
                <td>Global CRIS</td>
                <td>地理的制約なくグローバルにルーティング</td>
                <td>最大スループットとコスト削減を優先する場合</td>
              </tr>
            </tbody>
          </table>

          <h3>データレジデンシー設計のベストプラクティス</h3>
          <ul>
            <li>
              ルーティングされる処理では入力プロンプトと出力結果が選択された宛先リージョンで処理され、モデルによっては乱用検知（abuse
              detection）等の目的でデータが宛先リージョンで保持される可能性がある
            </li>
            <li>
              顧客データが常にソースリージョンのみに残るわけではないため、規制用途やデータレジデンシー要件がある場合は、利用する使用プロファイル（Cross-Region
              Inference
              Profile）、許容リージョン、データ保持・乱用検知仕様をあらかじめ確認しておく必要がある
            </li>
            <li>
              RAGシステムでは実際のドキュメントを保存するため、Knowledge
              Basesとベクトルストアのリージョン設計も含めてレジデンシー要件を満たす必要がある
            </li>
          </ul>

          <h3>その他の信頼性パターン</h3>
          <ul>
            <li>
              LLMゲートウェイによるマルチモデル・オーケストレーションを組み合わせ、クォータ枯渇時のフェイルオーバーやマルチテナント環境でのノイジーネイバー問題に備える
            </li>
            <li>
              レイテンシがクリティカルな用途では、Latency-optimized
              inferenceの対応モデル・リージョンを確認し、通常モードへのフォールバック条件（トークン数上限等）も把握しておく
            </li>
            <li>
              本番投入前にAWS Well-Architected Generative AI
              Lensでレビューを実施し、セキュリティ・信頼性・パフォーマンス・コスト最適化・運用上の優秀性・持続可能性の6つの観点で評価する
            </li>
          </ul>
        </section>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--color-border-tertiary)",
            margin: "48px 0",
          }}
        />

        <section id="best-practices" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cTeal}`}>
              <i className="ti ti-list-check" />
            </span>
            ベストプラクティス総まとめ表
          </h2>
          <p className={styles.stepSub}>各ステップの要点を横断的に一覧化</p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>カテゴリ</th>
                <th>ベストプラクティス</th>
                <th>主な根拠</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>セキュリティ・IAM</td>
                <td>タスク別に最小権限ロールを分離し、STSの一時認証情報を優先</td>
                <td>AWS Security Blog</td>
              </tr>
              <tr>
                <td>セキュリティ・IAM</td>
                <td>エージェントの実行ロールとプロンプトエンジニア用ロールを分離</td>
                <td>Well-Architected Gen AI Lens</td>
              </tr>
              <tr>
                <td>安全性</td>
                <td>Guardrailsは段階的にロールアウトし、CloudWatchで誤検知率を監視</td>
                <td>techjacksolutions.com</td>
              </tr>
              <tr>
                <td>安全性</td>
                <td>複数Guardrailを組織／部門／アプリ単位でレイヤー化</td>
                <td>AWS製品ページ</td>
              </tr>
              <tr>
                <td>RAG設計</td>
                <td>本番は階層的チャンキング＋ハイブリッド検索＋リランキングから開始</td>
                <td>Suhas Mallesh（Medium）</td>
              </tr>
              <tr>
                <td>RAG設計</td>
                <td>チャンキング戦略は自組織データで実測してから採用</td>
                <td>Gerardo Arroyo&apos;s Blog</td>
              </tr>
              <tr>
                <td>エージェント</td>
                <td>本番デプロイ前に必ず評価（agentcore eval等）を実行</td>
                <td>Pingax／AWS re:Invent 2025</td>
              </tr>
              <tr>
                <td>エージェント</td>
                <td>VPC・PrivateLinkでエンタープライズのネットワーク境界に統合</td>
                <td>Chaos and Order</td>
              </tr>
              <tr>
                <td>評価</td>
                <td>RAGはパイプライン全体（検索＋生成）を評価対象にする</td>
                <td>Shawn Jiang（Medium）</td>
              </tr>
              <tr>
                <td>評価</td>
                <td>評価をCI/CDに組み込みしきい値ベースでゲートする</td>
                <td>hidekazu-konishi.com</td>
              </tr>
              <tr>
                <td>コスト</td>
                <td>プロビジョンドスループットの利用率を継続監視</td>
                <td>DoiT International</td>
              </tr>
              <tr>
                <td>コスト</td>
                <td>単純タスクは軽量モデルへルーティングしコストを最適化</td>
                <td>DoiT International</td>
              </tr>
              <tr>
                <td>信頼性</td>
                <td>クロスリージョン推論でバーストトラフィックと可用性を確保</td>
                <td>AWS ML Blog</td>
              </tr>
              <tr>
                <td>信頼性</td>
                <td>データレジデンシー要件に応じGeographic／Global CRISを選択</td>
                <td>AWS公式ドキュメント</td>
              </tr>
              <tr>
                <td>ガバナンス</td>
                <td>AWS Well-Architected Generative AI Lensで定期レビュー</td>
                <td>AWS Well-Architected</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="pitfalls" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cRed}`}>
              <i className="ti ti-alert-triangle" />
            </span>
            よくある落とし穴（アンチパターン）
          </h2>
          <p className={styles.stepSub}>初学者・チームが陥りやすい失敗パターンと対策</p>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>アンチパターン</th>
                <th>何が起きるか</th>
                <th>対策</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Guardrailsを本番直前に後付けする</td>
                <td>チューニング不足で誤検知が多発し、ユーザー体験を損なう</td>
                <td>開発初期からGuardrailsを組み込み、非本番環境で継続チューニングする</td>
              </tr>
              <tr>
                <td>デフォルトのチャンキング設定をそのまま使う</td>
                <td>検索精度が低く、モデルが的外れな回答を生成する</td>
                <td>実データでチャンキング戦略をベンチマークする</td>
              </tr>
              <tr>
                <td>プロビジョンドスループットを設定したまま放置する</td>
                <td>利用率が低いままコストだけが積み上がる</td>
                <td>CloudWatchで利用率を継続監視し、不要になったら即座にオンデマンドへ戻す</td>
              </tr>
              <tr>
                <td>すべてのタスクに最上位モデルを使う</td>
                <td>コストが不必要に膨張する</td>
                <td>モデルルーティングとLLM-as-a-Judgeによる検証で軽量モデルの適用範囲を広げる</td>
              </tr>
              <tr>
                <td>
                  IAMポリシーの <code>Resource</code> を <code>*</code> にする
                </td>
                <td>想定外のモデル・リソースへのアクセスが発生しうる</td>
                <td>モデルARN・Guardrail ID・Knowledge Base IDまで絞り込む</td>
              </tr>
              <tr>
                <td>エージェントに評価なしでツールアクセスを全開放する</td>
                <td>意図しない操作やデータ漏洩のリスクが高まる</td>
                <td>Gatewayとポリシーでツールアクセスを最小化し、評価をデプロイゲートにする</td>
              </tr>
              <tr>
                <td>クロスリージョン推論のデータレジデンシー影響を確認しない</td>
                <td>規制業種でコンプライアンス違反のリスクが生じる</td>
                <td>Geographic CRISの範囲とログ保存リージョンを事前に確認する</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="references" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cPurple}`}>
              <i className="ti ti-link" />
            </span>
            参考情報源（根拠URL一覧）
          </h2>
          <p className={styles.stepSub}>
            AWS公式情報源に加え、国際的に知られる実務者の記事も横断的に調査
          </p>

          <div style={{ margin: "20px 0" }}>
            <h4
              style={{ fontSize: "15px", color: "var(--color-text-primary)", margin: "0 0 12px 0" }}
            >
              <i className="ti ti-brand-aws" style={{ marginRight: "8px" }} />
              AWS公式ドキュメント・製品ページ
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/bedrock/">Amazon Bedrock 製品ページ</Ext>{" "}
                (aws.amazon.com/bedrock/)
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/">
                  Amazon Bedrock ドキュメントトップ
                </Ext>{" "}
                (docs.aws.amazon.com/bedrock/)
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html">
                  What is Amazon Bedrock?（ユーザーガイド）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html">
                  Prompt engineering guidelines
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation-judge.html">
                  Evaluate model performance using another LLM as a judge
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-sensitive-filters.html">
                  Remove PII from conversations（sensitive information filters）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html">
                  Increase throughput with cross-Region inference
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/bedrock/latest/userguide/latency-optimized-inference.html">
                  Optimize model inference for latency
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/bedrock/guardrails/">
                  Amazon Bedrock Guardrails 製品ページ
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/conclusion.html">
                  AWS Well-Architected Generative AI Lens（結論）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/gensec01-bp01.html">
                  GENSEC01-BP01（基盤モデルエンドポイントへの最小権限アクセス）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/gensec05-bp01.html">
                  GENSEC05-BP01（エージェントワークフローの最小権限）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://docs.aws.amazon.com/audit-manager/latest/userguide/aws-generative-ai-best-practices.html">
                  AWS Generative AI Best Practices Framework v2（Audit Manager）
                </Ext>
              </li>
            </ul>
          </div>

          <div style={{ margin: "20px 0" }}>
            <h4
              style={{ fontSize: "15px", color: "var(--color-text-primary)", margin: "0 0 12px 0" }}
            >
              <i className="ti ti-notebook" style={{ marginRight: "8px" }} />
              AWS公式ブログ（Security / Machine Learning / News / Architecture）
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/security/securing-amazon-bedrock-api-keys-best-practices-for-implementation-and-management/">
                  Securing Amazon Bedrock API keys: Best practices
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/security/implementing-least-privilege-access-for-amazon-bedrock/">
                  Implementing least privilege access for Amazon Bedrock
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/prompt-engineering-techniques-and-best-practices-learn-by-doing-with-anthropics-claude-3-on-amazon-bedrock">
                  Prompt engineering techniques and best practices（Claude 3 × Bedrock）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/supercharge-your-development-with-claude-code-and-amazon-bedrock-prompt-caching/">
                  Supercharge your development with Claude Code and prompt caching
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/structured-data-response-with-amazon-bedrock-prompt-engineering-and-tool-use/">
                  Structured data response with Amazon Bedrock: Prompt Engineering and Tool Use
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/use-rag-for-drug-discovery-with-knowledge-bases-for-amazon-bedrock">
                  Use RAG for drug discovery with Amazon Bedrock Knowledge Bases
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/achieve-operational-excellence-with-well-architected-generative-ai-solutions-using-amazon-bedrock">
                  Achieve operational excellence with well-architected generative AI solutions
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/build-reliable-ai-agents-with-amazon-bedrock-agentcore-evaluations/">
                  Build reliable AI agents with Amazon Bedrock AgentCore Evaluations
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/llm-as-a-judge-on-amazon-bedrock-model-evaluation">
                  LLM-as-a-judge on Amazon Bedrock Model Evaluation
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-guardrails-image-content-filters-provide-industry-leading-safeguards-helping-customer-block-up-to-88-of-harmful-multimodal-content-generally-available-today/">
                  Amazon Bedrock Guardrails image content filters（マルチモーダル安全性）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/aws/amazon-bedrock-guardrails-enhances-generative-ai-application-safety-with-new-capabilities/">
                  Amazon Bedrock Guardrails enhances generative AI application safety
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/machine-learning/implementing-resilience-patterns-with-amazon-bedrock-and-llm-gateway/">
                  Implementing resilience patterns with Amazon Bedrock and LLM gateway
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/blogs/architecture/announcing-the-updated-aws-well-architected-generative-ai-lens">
                  Announcing the updated AWS Well-Architected Generative AI Lens
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/about-aws/whats-new/2026/04/agentcore-new-features-to-build-agents-faster/">
                  AWS What&apos;s New：AgentCore adds new features（2026年4月）
                </Ext>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <Ext href="https://aws.amazon.com/about-aws/whats-new/2025/06/amazon-bedrock-guardrails-tiers-content-filters-denied-topics">
                  AWS What&apos;s New：Guardrails tiers for content filters and denied topics
                </Ext>
              </li>
            </ul>
          </div>
        </section>

        <section id="summary" className={styles.step}>
          <h2>
            <span className={`${styles.stepBadge} ${styles.cAmber}`}>
              <i className="ti ti-flag-3" />
            </span>
            まとめ
          </h2>

          <div className={`${styles.calloutBox} ${styles.info}`}>
            <p style={{ margin: "0 0 12px 0", fontWeight: 600 }}>
              Amazon Bedrockのベストプラクティスは、突き詰めると次の5原則に集約されます。
            </p>
            <ol style={{ margin: 0, paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>
                <strong>最小権限を起点に設計する</strong>
                （IAM・Guardrails・エージェント境界のすべてに一貫して適用）
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>安全性は後付けでなく最初から組み込む</strong>
                （Guardrailsの段階的ロールアウト）
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>RAGとAgentsは別レイヤーとして設計し、それぞれを実データで検証する</strong>
                （チャンキング・評価の実測）
              </li>
              <li style={{ marginBottom: "6px" }}>
                <strong>評価とオブザーバビリティを本番運用の一部として継続する</strong>
                （CI/CDゲート・LLM-as-a-Judge・OpenTelemetry）
              </li>
              <li>
                <strong>コストと信頼性はトレードオフとして可視化し、継続的に最適化する</strong>
                （課金モード選択・クロスリージョン推論）
              </li>
            </ol>
          </div>
        </section>

        <footer className={styles.pageFooter}>
          <div>Amazon Bedrock Best Practices Guide</div>
          <div>© 2026 AI Model Cost Calculator. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}
