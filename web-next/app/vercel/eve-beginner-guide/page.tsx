import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import { TocObserver } from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Vercel eve 完全ガイド ― 初学者のためのステップバイステップ・ベストプラクティス",
  description:
    "「エージェントはディレクトリである」という思想のもと、永続実行・サンドボックス・承認フロー・可観測性を標準搭載したVercelのオープンソース・エージェントフレームワーク eve の完全解説ガイド。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAGRAM_ARCH = `flowchart TD
    A["開発者が書くファイル群<br/>agent/ ディレクトリ"] --> B["eve コンパイラ"]
    B --> C["Vercel Functions上で動くアプリ"]
    C --> D["Vercel Workflows<br/>(セッションの永続化)"]
    C --> E["Vercel Sandbox<br/>(隔離された実行環境)"]
    C --> F["AI Gateway<br/>(モデル呼び出し・フォールバック)"]
    C --> G["Vercel Connect<br/>(OAuth・APIキー管理)"]
    C --> H["Vercel Observability<br/>(Agent Runsダッシュボード)"]
    F --> I["任意のLLMプロバイダ<br/>(Anthropic / OpenAIなど)"]`;

const DIAGRAM_MAPPING = `flowchart LR
    subgraph Files["agentディレクトリ内のファイル"]
        F1["instructions.md"]
        F2["tools/send_email.ts"]
        F3["skills/refund-policy.md"]
        F4["channels/slack.ts"]
        F5["schedules/weekly-report.ts"]
    end

    subgraph Runtime["eveが自動的に配線するもの"]
        R1["常時プロンプトに注入"]
        R2["モデルが呼び出せる関数 send_email"]
        R3["話題に応じて動的ロードされる知識"]
        R4["Slackからのメッセージ受付"]
        R5["Vercel Cron Jobとして毎週実行"]
    end

    F1 --> R1
    F2 --> R2
    F3 --> R3
    F4 --> R4
    F5 --> R5`;

const DIAGRAM_SESSION = `sequenceDiagram
    participant U as ユーザー
    participant C as チャネル(HTTP/Slack等)
    participant S as eveセッション(Workflow上で永続化)
    participant M as モデル
    participant T as ツール/サンドボックス

    U->>C: メッセージ送信
    C->>S: セッション作成 or 継続
    S->>M: 指示+ツール定義を渡して呼び出し
    M-->>S: テキスト or ツール呼び出しを返す
    S->>T: 必要ならツール実行
    T-->>S: 実行結果を返す
    S-->>C: NDJSONで逐次イベントをストリーム
    C-->>U: 回答を表示
    Note over S: 各ステップはチェックポイントされ、<br/>クラッシュ・再デプロイをまたいで再開可能`;

const DIAGRAM_APPROVAL = `stateDiagram-v2
    [*] --> 実行中
    実行中 --> 承認待ち: needsApprovalの条件を満たす
    承認待ち --> 実行中: 人間が承認
    承認待ち --> 中断: 人間が却下
    実行中 --> 完了: ツール実行成功
    完了 --> [*]
    中断 --> [*]
    note right of 承認待ち
        待機中は計算リソースを消費しない
        Slackのボタン等から承認可能
    end note`;

const DIAGRAM_SANDBOX = `flowchart TD
    A["エージェントがコードを書く必要があるか?"] -->|"Yes: 未知の分析・変換処理がある"| B["サンドボックスを使う<br/>(bash, write_file, read_file)"]
    A -->|"No: 定型のAPI呼び出しだけで完結"| C["サンドボックスなしで運用する"]
    B --> D["モデル生成コードは信頼しない前提で<br/>アプリ本体と隔離実行"]
    C --> E["余計な複雑性を持ち込まない"]`;

const DIAGRAM_CHANNEL = `flowchart LR
    Slack["Slackイベント"] --> Connect["Vercel Connect<br/>(Webhook検証)"]
    Connect -->|"--trigger-path /eve/v1/slack を<br/>指定した場合のみ正しく到達"| Route["/eve/v1/slack ルート"]
    Route --> Agent["デプロイ済みeveエージェント"]
    Agent --> Slack`;

const DIAGRAM_CICD = `flowchart LR
    A["コミット"] --> B["プレビューデプロイ<br/>(チャネルも含めて再現)"]
    B --> C["npx eve eval<br/>(デプロイゲート)"]
    C -->|Pass| D["本番デプロイ<br/>vercel deploy"]
    C -->|Fail| E["CIで停止・修正"]
    D --> F["問題発生時はInstant Rollback"]`;

const DIAGRAM_FLEET = `flowchart TD
    Human["人間(承認・監督)"]
    Content["コンテンツ担当エージェント"]
    Ops["運用担当エージェント"]
    Growth["成長施策担当エージェント"]
    Slack["共有Slackチャンネル<br/>(可視化・承認)"]

    Content -->|"eveChannel.send<br/>認証済みPOST"| Ops
    Ops -->|"eveChannel.send"| Growth
    Content -.->|状態を通知| Slack
    Ops -.->|状態を通知・承認依頼| Slack
    Growth -.->|状態を通知・承認依頼| Slack
    Human -->|Slackから承認/却下| Slack`;

export default function VercelEveBeginnerGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.brand}>
          <div className={styles.brandMark}>ev</div>
          <div className={styles.brandText}>
            <strong>eve 完全ガイド</strong>
            <span>Vercel Agent Framework</span>
          </div>
        </div>
        <span className={styles.badge}>🔧 Public Beta / 2026-07-17時点</span>
        <nav className={styles.sidebarNav}>
          <a href="#overview">1. eveとは何か</a>
          <a href="#concepts">2. コアコンセプト</a>
          <a href="#quickstart">3. 最初のエージェントを作る</a>
          <a href="#advanced">4. 本番品質のエージェントへ</a>
          <a href="#multiagent">5. マルチエージェント構成</a>
          <a href="#best-practices">6. ベストプラクティス集</a>
          <a href="#anti-patterns">7. アンチパターンと落とし穴</a>
          <a href="#comparison">8. 他フレームワークとの比較</a>
          <a href="#pricing">9. 料金と制限の考え方</a>
          <a href="#conclusion">10. まとめ</a>
          <a href="#references">11. 参考ソース一覧</a>
        </nav>
      </aside>

      <main className={styles.main} id="main">
        <header className={styles.hero}>
          <span className={styles.fileLabel} style={{ marginTop: 0 }}>
            Beginner Guide · Best Practices
          </span>
          <h1>
            Vercel eve 完全ガイド
            <br />
            初学者のためのステップバイステップ・ベストプラクティス
          </h1>
          <p className={styles.lead}>
            「エージェントはディレクトリである」という思想のもと、永続実行・サンドボックス・承認フロー・可観測性を標準搭載したVercelのオープンソース・エージェントフレームワーク
            <strong>eve</strong>
            を、公式ドキュメントと実運用エンジニアの一次情報の両方から解説します。
          </p>
          <div className={styles.metaRow}>
            <span className={styles.metaPill}>執筆時点：2026年7月17日</span>
            <span className={styles.metaPill}>対象：eve（Public Beta / Apache 2.0）</span>
            <span className={styles.metaPill}>対象読者：TypeScript初学者〜中級者</span>
            <span className={styles.metaPill}>形式：ステップバイステップ + Mermaid図解</span>
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutTitle}>⚠️ このガイドについて</div>
            <p>
              eve は2026年6月17日にロンドンの「Vercel Ship
              26」で発表されたばかりのパブリックベータです。API・挙動ともに正式リリース（GA）までに変更される可能性があります。実装前には必ず公式ドキュメント（
              <Ext href="https://vercel.com/docs/eve">vercel.com/docs/eve</Ext>
              ）の最新版をご確認ください。
            </p>
          </div>
        </header>

        {/* ================= 1. OVERVIEW ================= */}
        <section className={styles.section} id="overview">
          <h2>
            <span className={styles.num}>01</span> eveとは何か
          </h2>
          <p>
            eve
            は、AIエージェントの「本番運用に必要なインフラ」をあらかじめ内蔵した、ファイルシステム・ファーストのオープンソースフレームワークです。Vercel
            は eve を「エージェントのための Next.js」と表現しています。Next.js がフォルダ構造だけで
            Web アプリのルーティングを解決したように、eve
            はディレクトリ内のファイル配置だけでエージェントの振る舞い（モデル、指示、ツール、知識、委譲先、チャネル、実行スケジュール）を定義します。
          </p>
          <p>
            Vercel
            がこのフレームワークを作った背景には、社内で「コーディングエージェントの普及によって誰もがエージェントを作れるようになったが、どのチームも同じ配管（永続化、サンドボックス、承認フロー、監視）を毎回一から組み立て直していた」という課題がありました。eve
            はその配管を標準化し、開発者が「エージェントが何をするか」だけに集中できるようにすることを目指しています。
          </p>

          <h3>
            <span className={styles.subNum}>1-1</span>eve の基本ステータス
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>発表日</td>
                  <td>2026年6月17日（Vercel Ship 26、ロンドン）</td>
                </tr>
                <tr>
                  <td>ライセンス</td>
                  <td>Apache 2.0（オープンソース）</td>
                </tr>
                <tr>
                  <td>npm パッケージ名</td>
                  <td>
                    <code>eve</code>
                  </td>
                </tr>
                <tr>
                  <td>GitHub リポジトリ</td>
                  <td>
                    <code>vercel/eve</code>
                  </td>
                </tr>
                <tr>
                  <td>現在のステータス</td>
                  <td>パブリックベータ（Vercel Beta Terms 適用、GA前に破壊的変更の可能性あり）</td>
                </tr>
                <tr>
                  <td>主な用途</td>
                  <td>
                    永続実行が必要なバックエンドAIエージェント（チャットボット、SDR、サポート、データ分析、社内自動化など）
                  </td>
                </tr>
                <tr>
                  <td>デプロイ先</td>
                  <td>Vercel Functions（他プラットフォーム向けアダプタは開発中）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.quoteBlock}>
            エージェントは現在、Vercel上のコミットの過半数（半年前は3%未満だったものが急増）を占めるようになった。eveはこの急増するエージェント開発を、使い捨てのプロトタイプから保守可能な本番システムへ引き上げるための基盤である。
            <cite>Guillermo Rauch（Vercel CEO）、eveローンチにあたっての発言より要約</cite>
          </div>

          <h3>
            <span className={styles.subNum}>1-2</span>eve が標準搭載する6つの本番機能
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>何を解決するか</th>
                  <th>裏側の技術</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Durable Execution
                    <br />
                    （永続実行）
                  </td>
                  <td>
                    長時間・数日にまたがる会話の状態を保持し、クラッシュやデプロイをまたいで再開する
                  </td>
                  <td>Vercel Workflows（OSSのWorkflow SDK）</td>
                </tr>
                <tr>
                  <td>
                    Sandboxed Compute
                    <br />
                    （サンドボックス）
                  </td>
                  <td>モデルが生成したコードを、アプリ本体と隔離された環境で安全に実行する</td>
                  <td>Vercel Sandbox（本番）／Docker・microsandbox・just-bash（ローカル）</td>
                </tr>
                <tr>
                  <td>
                    Human-in-the-loop Approvals
                    <br />
                    （人間による承認）
                  </td>
                  <td>破壊的・不可逆な操作の前に人間の承認を挟み、無期限に待機できる</td>
                  <td>
                    eveのランタイム（<code>needsApproval</code>）
                  </td>
                </tr>
                <tr>
                  <td>
                    Subagents
                    <br />
                    （サブエージェント）
                  </td>
                  <td>焦点を絞ったタスクを、独立したコンテキストを持つ子エージェントに委譲する</td>
                  <td>eveのエージェントループ</td>
                </tr>
                <tr>
                  <td>
                    Tracing &amp; Evals
                    <br />
                    （トレースと評価）
                  </td>
                  <td>各ターンで何が起きたかを再現可能にし、回帰をCIで検知する</td>
                  <td>OpenTelemetry / eve Evals</td>
                </tr>
                <tr>
                  <td>
                    Connections
                    <br />
                    （外部接続）
                  </td>
                  <td>資格情報をコードから切り離し、MCPサーバーやOpenAPI互換APIに安全に接続する</td>
                  <td>Vercel Connect / AI Gateway</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <span className={styles.subNum}>1-3</span>全体アーキテクチャ
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_ARCH} />
          </div>
          <p className={styles.diagramCaption}>
            図1：eveのランタイムはVercelの各プロダクト（Workflows / Sandbox / AI Gateway / Connect /
            Observability）の上に薄く重なる形で成り立っている
          </p>
        </section>

        {/* ================= 2. CONCEPTS ================= */}
        <section className={styles.section} id="concepts">
          <h2>
            <span className={styles.num}>02</span> コアコンセプト：エージェントはディレクトリである
          </h2>
          <p>
            eve における「エージェント」とは、<code>agent/</code>
            ディレクトリ配下に置かれたファイル群のことです。ファイルの<strong>置き場所</strong>そのものが設定になっており、明示的な登録処理（レジストリへの追加など）は一切不要です。
          </p>

          <h3>
            <span className={styles.subNum}>2-1</span>ディレクトリ構成一覧
          </h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>パス</th>
                  <th>役割</th>
                  <th>必須/任意</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>agent/instructions.md</code>
                  </td>
                  <td>常時有効なシステムプロンプト（人格・行動規範）</td>
                  <td>必須</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/agent.ts</code>
                  </td>
                  <td>
                    使用モデルなどのランタイム設定（<code>defineAgent</code>）
                  </td>
                  <td>任意（省略時デフォルトあり）</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/tools/*.ts</code>
                  </td>
                  <td>1ファイル＝1ツール。ファイル名がツール名になる</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/skills/*.md</code>
                  </td>
                  <td>必要な時だけ読み込まれる手続き知識・ドメイン知識</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/subagents/*/</code>
                  </td>
                  <td>特定タスクに特化した子エージェント</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/channels/*.ts</code>
                  </td>
                  <td>HTTP・Slack・Discord等、エージェントへの入口</td>
                  <td>任意（HTTPはデフォルト有効）</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/connections/*.ts</code>
                  </td>
                  <td>MCPサーバーやOpenAPI互換APIとの型付き接続</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/schedules/*.ts</code> または <code>*.md</code>
                  </td>
                  <td>cron式による自律実行タスク</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/sandbox/</code>
                  </td>
                  <td>エージェント専用の隔離実行環境の設定</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>agent/instrumentation.ts</code>
                  </td>
                  <td>外部OpenTelemetryバックエンドへのエクスポート設定</td>
                  <td>任意</td>
                </tr>
                <tr>
                  <td>
                    <code>evals/*.eval.ts</code>
                  </td>
                  <td>振る舞いを検証するスコア付きテストスイート</td>
                  <td>任意（推奨）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            <span className={styles.subNum}>2-2</span>ファイル配置がそのまま機能になる仕組み
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_MAPPING} />
          </div>
          <p className={styles.diagramCaption}>
            図2：ファイルの配置場所がそのままeveランタイムへの配線になる
          </p>

          <p>
            このモデルの利点は、Roboto Studio の Jono Alford
            氏がブログで指摘しているとおり「振る舞いを説明する（describe）だけで済み、実行ループの配線を書く必要がない」ことにあります。ツールを1本追加する行為が「ファイルを1本追加する」行為と等しくなるため、レビューの単位もGitのコミット単位と一致します。
          </p>
        </section>

        {/* ================= 3. QUICKSTART ================= */}
        <section className={styles.section} id="quickstart">
          <h2>
            <span className={styles.num}>03</span> ステップバイステップ：最初のエージェントを作る
          </h2>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>0</div>
              <h4>前提条件を整える</h4>
            </div>
            <ul>
              <li>Node.js（最新のLTS推奨）とパッケージマネージャ（npm / pnpm）</li>
              <li>Vercelアカウント（デプロイ時に必要。ローカル開発だけなら必須ではない）</li>
              <li>
                LLMプロバイダの利用資格（Vercel上ではAI
                Gateway経由でOIDC認証されるため、個別のAPIキー管理は基本的に不要）
              </li>
            </ul>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>1</div>
              <h4>プロジェクトを作成する</h4>
            </div>
            <p>
              CLIを <code>npx</code>{" "}
              経由で叩くだけで、依存関係のインストール・Gitの初期化・開発サーバーの起動まで自動で行われます。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash — 新規プロジェクトの作成</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npx</span>
                  <span className={styles.cv}> eve@latest init support-agent</span>
                </div>
              </div>
            </div>
            <p>既存のアプリにeveを組み込みたい場合は、パッケージを追加するだけです。</p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash — 既存プロジェクトへの追加</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npm</span>
                  <span className={styles.cv}> install eve@latest</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>2</div>
              <h4>最小構成を理解する</h4>
            </div>
            <p>
              eveのエージェントは、理論上<strong>2ファイルだけ</strong>で動作します。
            </p>
            <span className={styles.fileLabel}>
              <code>agent/instructions.md</code>（人格・行動規範）
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>markdown</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    あなたは丁寧で簡潔なカスタマーサポート担当者です。
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    ツールが使える場面では、推測せず必ずツールを使って確認してください。
                  </span>
                </div>
              </div>
            </div>
            <span className={styles.fileLabel}>
              <code>agent/agent.ts</code>（モデル設定）
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; defineAgent &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineAgent</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  model: </span>
                  <span className={styles.cs}>&apos;anthropic/claude-sonnet-5&apos;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
            <p>
              モデル文字列は AI Gateway
              を通じて解決されるため、Vercel上にデプロイする際はプロバイダのAPIキーを個別に管理する必要がなく、Vercel
              OIDCによる認証だけで済みます。
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>3</div>
              <h4>最初のツールを追加する</h4>
            </div>
            <p>
              <code>agent/tools/</code>
              配下の1ファイルが1つのツールになり、<strong>ファイル名がそのままモデルに見えるツール名</strong>になります。
            </p>
            <span className={styles.fileLabel}>
              <code>agent/tools/lookup_order.ts</code>
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; defineTool &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/tools&apos;;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; z &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;zod&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineTool</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  description: </span>
                  <span className={styles.cs}>
                    &apos;注文番号から配送ステータスを取得する&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  inputSchema: z.object</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>    orderId: z.string().describe</span>
                  <span className={styles.cs}>
                    (&apos;例: ORD-10234&apos;),
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>  async</span>
                  <span className={styles.cw}> execute</span>
                  <span className={styles.cs}>(&#123; orderId &#125;) &#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>    // 実際には社内APIやDBを呼び出す</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>    return</span>
                  <span className={styles.cs}>
                    &#123; orderId, status: &apos;発送済み&apos;, carrier:
                    &apos;ヤマト運輸&apos; &#125;;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>4</div>
              <h4>ローカルで対話する</h4>
            </div>
            <p>
              eveの開発ループは、Next.jsの <code>localhost:3000</code>{" "}
              を眺める感覚とは異なります。ターミナルUI（TUI）にドロップされ、<strong>エージェントと会話しながら</strong>開発を進めるのが基本形です。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # 通常はTUIで対話しながら開発する
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npx</span>
                  <span className={styles.cv}> eve dev</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # コーディングエージェント(Claude Codeなど)に運転させる場合はヘッドレスモード
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npx</span>
                  <span className={styles.cv}> eve dev --no-ui</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>5</div>
              <h4>HTTP経由でセッションを直接操作する</h4>
            </div>
            <p>
              TUIの裏側では、標準のHTTP APIが動いています。セッションを作成すると{" "}
              <code>continuationToken</code> と <code>x-eve-session-id</code>{" "}
              ヘッダーが返り、これを使って会話を継続したり、ストリームに接続したりできます。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cc}># セッションを作成する</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>curl</span>
                  <span className={styles.cv}>
                    {" "}
                    -X POST http://127.0.0.1:3000/eve/v1/session \
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>
                    {" "}
                    -H &apos;content-type: application/json&apos; \
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>
                    {" "}
                    -d
                    &apos;&#123;&quot;message&quot;:&quot;注文ORD-10234の配送状況を教えて&quot;&#125;&apos;
                  </span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # 返却された x-eve-session-id を使ってストリームに接続する
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>curl</span>
                  <span className={styles.cv}>
                    {" "}
                    http://127.0.0.1:3000/eve/v1/session/&lt;sessionId&gt;/stream
                  </span>
                </div>
              </div>
            </div>
            <p>セッション・ターン・ストリームの関係を図解すると次のようになります。</p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_SESSION} />
            </div>
            <p className={styles.diagramCaption}>
              図3：セッション内の1ターンが処理される流れ。各ステップがチェックポイントされる
            </p>
          </div>
        </section>

        {/* ================= 4. ADVANCED ================= */}
        <section className={styles.section} id="advanced">
          <h2>
            <span className={styles.num}>04</span> 発展編：本番品質のエージェントへ
          </h2>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>6</div>
              <h4>スキル（skills/）で手続き知識を分離する</h4>
            </div>
            <p>
              「常に守るべきルール」は <code>instructions.md</code> に、「特定の話題の時だけ必要な手順書」は <code>skills/</code>{" "}
              に分離します。こうすることで、システムプロンプトが肥大化してコンテキストを圧迫するのを防げます。
            </p>
            <span className={styles.fileLabel}>
              <code>agent/skills/refund-policy.md</code>
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>markdown</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cm}>---</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>description: </span>
                  <span className={styles.cs}>
                    返金対応に関するフロー。返金の話題が出たら必ず読み込むこと。
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cm}>---</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    - 購入から30日以内かつ未開封の場合のみ全額返金の対象とする。
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    - 返金額が5万円を超える場合は必ず人間の承認を得る。
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    - 返金の判断根拠（購入日・条件）を必ず本文中に明記する。
                  </span>
                </div>
              </div>
            </div>
            <p>
              Roboto Studio
              の事例では、「週次のSEO監査」のような手順は指示文に埋め込まず、独立したスキルとして切り出すことで、常時消費されるコンテキストを最小限に保っています。
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>7</div>
              <h4>承認フロー（needsApproval）で安全性を確保する</h4>
            </div>
            <p>
              破壊的・不可逆・対外公開を伴う操作には、ツール1つにつき1行の設定を加えるだけで人間の承認ゲートを設けられます。承認されるまでセッションは計算リソースを消費せず待機し続けます。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; defineTool &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/tools&apos;;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; z &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;zod&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineTool</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  description: </span>
                  <span className={styles.cs}>&apos;返金を実行する&apos;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  inputSchema: z.object</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>    orderId: z.string(),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>    amountJpy: z.number(),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  needsApproval: </span>
                  <span className={styles.cs}>
                    (&#123; toolInput &#125;) =&gt; toolInput.amountJpy &gt; 50000,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>  async</span>
                  <span className={styles.cw}> execute</span>
                  <span className={styles.cs}>
                    (&#123; orderId, amountJpy &#125;) &#123;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>    // 実際の返金処理</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>    return</span>
                  <span className={styles.cs}>
                    {" "}
                    &#123; orderId, refunded: amountJpy &#125;;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
            <p>承認フローの状態遷移は次のとおりです。</p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_APPROVAL} />
            </div>
            <p className={styles.diagramCaption}>図4：承認ゲートを持つツールの状態遷移</p>
            <div className={styles.quoteBlock}>
              可逆な操作はエージェントに自由にやらせ、公開・不可逆な操作（キャンペーン送信、PRのマージ、記事の公開など）はすべて人間の承認待ちにする。この単純なルールを徹底することで、エージェント群を安心して自律稼働させられる。
              <cite>Zachary Proser（WorkOS、元Pinecone / Cloudflare）</cite>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>8</div>
              <h4>サブエージェントに委譲する</h4>
            </div>
            <p>
              サブエージェントは「スキル」と違い、<strong>独立した会話履歴と状態を持つ別のエージェント</strong>です。並列作業、専門特化、権限の絞り込みに向いています。
            </p>
            <span className={styles.fileLabel}>
              <code>agent/subagents/researcher/agent.ts</code>
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; defineAgent &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineAgent</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  description: </span>
                  <span className={styles.cs}>
                    &apos;問い合わせ内容の背景調査に特化し、親エージェントに要約を返す&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  model: </span>
                  <span className={styles.cs}>
                    &apos;anthropic/claude-opus-4-8&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <div className={styles.calloutTitle}>⚠️ 注意</div>
              <p>
                <code>schedules/</code>
                から実行されたタスク（cron起動）は、サブエージェント呼び出しで「一時停止して再開を待つ」ことができない場合があります。この制約はRoboto
                Studioの実運用で確認されており、<code>Cannot park: no continuation token</code>
                のようなエラーになることがあるため、スケジュール実行の中でサブエージェントに処理を委譲する設計は避け、処理をインラインで完結させるか、ハンドラ形式に変更することが推奨されます。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>9</div>
              <h4>サンドボックスの使いどころを見極める</h4>
            </div>
            <p>
              すべてのエージェントに1つずつ、独立したbashスタイルの実行環境（サンドボックス）が用意されます。本番ではVercel
              Sandbox（マイクロVM）、ローカルではDockerなどが使われます。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_SANDBOX} />
            </div>
            <p className={styles.diagramCaption}>図5：サンドボックス採用の判断フロー</p>
            <p>
              Roboto Studio
              の事例では、コンテンツ運用エージェントは「ページを読み、APIを叩き、REST経由でコミットするだけ」なのでサンドボックスを一切使っておらず、逆に自社のバックグラウンドコーディングエージェント（Satoru）はリポジトリのクローンとコード実行を行うためサンドボックスが必須、という明確な使い分けをしています。<strong>「カタログに載っているから」という理由だけでサンドボックスのような重い機能を導入しない</strong>ことが、実務上のアンチパターン回避として重要です。
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>10</div>
              <h4>コネクション（connections/）で外部サービスと繋ぐ</h4>
            </div>
            <p>
              コネクションは、MCPサーバーやOpenAPI互換APIへの「型付きの窓口」です。認証情報はコード内に埋め込まず、実行時に解決します。
            </p>
            <span className={styles.fileLabel}>
              <code>agent/connections/linear.ts</code>
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}>
                    {" "}
                    &#123; defineMcpClientConnection &#125;{" "}
                  </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/connections&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineMcpClientConnection</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  url: </span>
                  <span className={styles.cs}>
                    &apos;https://mcp.linear.app/sse&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  description: </span>
                  <span className={styles.cs}>
                    &apos;自社Linearワークスペース：課題・プロジェクト・サイクル・コメント&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  auth: </span>
                  <span className={styles.cs}>&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>    getToken: async</span>
                  <span className={styles.cs}> () =&gt; (&#123; token: process.env.LINEAR_API_TOKEN! &#125;),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
            <p>
              eveはリモートツールを自動的に発見してモデルに渡し、認証を仲介します。モデル自身は接続先のURLや資格情報を一切目にしません。ローンチ時点でSlack、GitHub、Snowflake、Salesforce、Notion、Linearなどへの接続がサポートされています。
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>11</div>
              <h4>チャンネル（channels/）でSlack等に公開する</h4>
            </div>
            <p>
              チャンネルはエージェントへの「入口」です。CLIで1コマンド実行するだけで、Slack用のチャンネルファイルが生成されます。Slackとの接続は
              Vercel Connect 経由で行います。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.cc}># Slackチャンネルファイルを生成する</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npx</span>
                  <span className={styles.cv}> eve channels add slack</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.cc}>
                    # Vercel Connect でSlackとの接続を作成し、正しいルートに紐付ける
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>vercel</span>
                  <span className={styles.cv}>
                    {" "}
                    connect create slack --name support-agent --triggers
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>vercel</span>
                  <span className={styles.cv}>
                    {" "}
                    connect attach slack/support-agent --triggers \
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>    --trigger-path /eve/v1/slack</span>
                </div>
              </div>
            </div>
            <div className={`${styles.callout} ${styles.calloutDanger}`}>
              <div className={styles.calloutTitle}>🚨 最重要の落とし穴</div>
              <p>
                <code>--trigger-path /eve/v1/slack</code> を付け忘れると、Vercel
                Connectはデフォルトのパスにイベントを送り続けますが、eveはそのパスを待ち受けていないため、<strong>404もエラーバナーも一切出ないまま、Slackイベントが静かに失われます</strong>。Agent
                Runsダッシュボードにも記録が一切残らないため、原因究明が非常に困難です。Zachary
                Proser氏はこの問題を「ボットが静かに沈黙する」と表現し、Slack連携直後にボットが応答しない場合は、まずコード側ではなくトリガーパスの設定を疑うべきだと強調しています。
              </p>
            </div>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_CHANNEL} />
            </div>
            <p className={styles.diagramCaption}>図6：Slack連携時のイベント到達経路</p>
            <p>
              さらに、Vercelの Deployment Protection
              がデフォルトでSlackのWebhookを401で拒否することがあるため、Slack連携を有効化する際はプレビュー保護のバイパス設定も併せて確認する必要があります。
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>12</div>
              <h4>スケジュール（schedules/）で自律実行させる</h4>
            </div>
            <p>
              cron式とハンドラを書いた1ファイルが、自動的にVercel Cron Jobとしてデプロイされます。
            </p>
            <span className={styles.fileLabel}>
              <code>agent/schedules/weekly-report.ts</code>
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; defineSchedule &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/schedules&apos;;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> slack </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;../channels/slack.js&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineSchedule</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  cron: </span>
                  <span className={styles.cs}>&apos;0 9 * * 1&apos;,</span>
                  <span className={styles.cc}> // 毎週月曜9:00 UTC</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>  async</span>
                  <span className={styles.cw}> run</span>
                  <span className={styles.cs}>
                    (&#123; receive, waitUntil, appAuth &#125;) &#123;
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cw}>    waitUntil</span>
                  <span className={styles.cs}>(</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cw}>      receive</span>
                  <span className={styles.cs}>(slack, &#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>        message: </span>
                  <span className={styles.cs}>
                    &apos;先週の問い合わせ件数と主要トピックをまとめて投稿して&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>        target: </span>
                  <span className={styles.cs}>
                    &#123; channelId: &apos;C0123ABC&apos; &#125;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>        auth: </span>
                  <span className={styles.cs}>appAuth,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>      &#125;),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>    );</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
            <div className={`${styles.callout} ${styles.calloutWarn}`}>
              <div className={styles.calloutTitle}>⚠️ プラン上の制限</div>
              <p>
                Hobbyプランではcronの実行間隔が「1日1回」までに制限されており、それより頻繁な実行にはProプラン以上が必要です。
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>13</div>
              <h4>Evalsでテストする</h4>
            </div>
            <p>
              Evalsは、ソフトウェアの単体テストと同じ感覚でエージェントの振る舞いを検証する仕組みです。
            </p>
            <span className={styles.fileLabel}>
              <code>evals/refund.eval.ts</code>
            </span>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; defineEval &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/evals&apos;;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; includes &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/evals/expect&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineEval</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  description: </span>
                  <span className={styles.cs}>
                    &apos;高額返金は必ず承認待ちになり、判断根拠を提示する&apos;,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>  async</span>
                  <span className={styles.cw}> test</span>
                  <span className={styles.cs}>(t) &#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>    await</span>
                  <span className={styles.cv}> t.send</span>
                  <span className={styles.cs}>
                    (&apos;注文ORD-99の8万円を返金して&apos;);
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>    t.calledTool</span>
                  <span className={styles.cs}>
                    (&apos;process_refund&apos;);
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>    t.check</span>
                  <span className={styles.cs}>
                    (t.reply, includes(&apos;承認&apos;));
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>  &#125;,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>npx</span>
                  <span className={styles.cv}> eve eval</span>
                </div>
              </div>
            </div>
            <p>
              CIにこのコマンドを組み込むことで、プロンプトやモデルの変更が本番に届く前に回帰を検知できます。
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>14</div>
              <h4>デプロイする</h4>
            </div>
            <p>
              eveのエージェントは「普通のVercelプロジェクト」であるため、デプロイは他のフロントエンド／バックエンドと同じコマンドで完結します。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>bash</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>vercel</span>
                  <span className={styles.cv}> deploy</span>
                </div>
              </div>
            </div>
            <p>
              デプロイの最中でも、実行中のセッションは中断されず、開始時点のバージョンのまま処理を終えてから新バージョンに切り替わります。コミットごとにプレビュー環境も自動生成されるため、次バージョンのSlackボットを本番に反映する前にチームで試すことができます。問題が起きた場合は、Vercelの
              Instant Rollback で即座に前バージョンへ戻せます。
            </p>
            <div className={styles.diagramWrap}>
              <MermaidDiagram chart={DIAGRAM_CICD} />
            </div>
            <p className={styles.diagramCaption}>図7：コミットから本番反映までのCI/CDパイプライン</p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepNum}>15</div>
              <h4>可観測性を確認する</h4>
            </div>
            <p>
              デプロイ後、Vercelダッシュボードの <strong>Agent Runs</strong>{" "}
              タブで、追加設定なしにセッション・ターン・ツール呼び出し・トークン使用量を確認できます。開発者向けの詳細モード（生のツール名・JSON）と、非エンジニア向けの平易なモード（人間向け要約）を切り替えられるのも特徴です。
            </p>
            <p>
              外部のトレーシング基盤（Braintrust、Datadog、Honeycomb、Jaegerなど）にも送りたい場合は、
              <code>agent/instrumentation.ts</code>{" "}
              を追加するだけでOpenTelemetryのエクスポートが有効になります。
            </p>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span>typescript</span>
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; BraintrustExporter &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;@braintrust/otel&apos;;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}>
                    {" "}
                    &#123; defineInstrumentation &#125;{" "}
                  </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;eve/instrumentation&apos;;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>import</span>
                  <span className={styles.cs}> &#123; registerOTel &#125; </span>
                  <span className={styles.ck}>from</span>
                  <span className={styles.cs}> &apos;@vercel/otel&apos;;</span>
                </div>
                <div className={styles.codeLine}>&nbsp;</div>
                <div className={styles.codeLine}>
                  <span className={styles.ck}>export default</span>
                  <span className={styles.cw}> defineInstrumentation</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>  setup: </span>
                  <span className={styles.cs}>(&#123; agentName &#125;) =&gt;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cw}>    registerOTel</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>      serviceName: agentName,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>      traceExporter: </span>
                  <span className={styles.ck}>new</span>
                  <span className={styles.cw}> BraintrustExporter</span>
                  <span className={styles.cs}>(&#123;</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>        parent: </span>
                  <span className={styles.cs}>
                    `project_name:$&#123;agentName&#125;`,
                  </span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cv}>        filterAISpans: </span>
                  <span className={styles.ck}>true</span>
                  <span className={styles.cs}>,</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>      &#125;),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>    &#125;),</span>
                </div>
                <div className={styles.codeLine}>
                  <span className={styles.cs}>&#125;);</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. MULTI-AGENT ================= */}
        <section className={styles.section} id="multiagent">
          <h2>
            <span className={styles.num}>05</span> マルチエージェント構成のベストプラクティス
          </h2>
          <p>複数のエージェントを組み合わせて「小さなチーム」を作る際の設計原則です。</p>

          <h3>
            <span className={styles.subNum}>5-1</span>「1エージェント＝1リポジトリ＝1責務」
          </h3>
          <p>
            Zachary
            Proser氏は自身のWebサイト運営で、コンテンツ担当・運用担当・成長施策担当という3つのボットをそれぞれ
            <strong>別リポジトリ・別デプロイ・別シークレットストア</strong>
            として構築しました。これは「課金サービスと認証サービスを同じプロセスに詰め込まない」のと同じ理由です。ある担当ボットの改修が、別の担当ボットの挙動に影響しない「壁」を作ることが、システムが育つほど重要になります。
          </p>

          <h3>
            <span className={styles.subNum}>5-2</span>エージェント間のハンドオフ
          </h3>
          <p>
            エージェント同士の連携は、片方のエージェントがもう片方の認証済みエンドポイントにPOSTするだけのシンプルな仕組みで実現できます。共有データベースや自前のキューは不要です。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>typescript</span>
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeLine}>
                <span className={styles.ck}>import</span>
                <span className={styles.cs}> &#123; eveChannel &#125; </span>
                <span className={styles.ck}>from</span>
                <span className={styles.cs}> &apos;eve&apos;;</span>
              </div>
              <div className={styles.codeLine}>&nbsp;</div>
              <div className={styles.codeLine}>
                <span className={styles.cc}>
                  // 記事公開エージェントが、公開直後に運用エージェントへ通知する
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.ck}>await</span>
                <span className={styles.cv}> eveChannel.send</span>
                <span className={styles.cs}>(&#123;</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>  to: </span>
                <span className={styles.cs}>&apos;ops-agent&apos;,</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>  type: </span>
                <span className={styles.cs}>&apos;article.published&apos;,</span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cv}>  payload: </span>
                <span className={styles.cs}>
                  &#123; slug: &apos;new-feature-announcement&apos; &#125;,
                </span>
              </div>
              <div className={styles.codeLine}>
                <span className={styles.cs}>&#125;);</span>
              </div>
            </div>
          </div>

          <h3>
            <span className={styles.subNum}>5-3</span>マルチエージェント構成図
          </h3>
          <div className={styles.diagramWrap}>
            <MermaidDiagram chart={DIAGRAM_FLEET} />
          </div>
          <p className={styles.diagramCaption}>
            図8：3体編成のマルチエージェント構成。機械同士のハンドオフ(実線)と人間の監督(点線+Slack)が分離されている
          </p>
          <p>
            この構成では、機械同士のハンドオフはHTTP
            POSTのレーン、人間の監督はSlackのレーンという2つの経路が明確に分かれており、どちらか一方に処理が集中しない設計になっています。
          </p>
        </section>

        {/* ================= 6. BEST PRACTICES ================= */}
        <section className={styles.section} id="best-practices">
          <h2>
            <span className={styles.num}>06</span> 実運用から得られたベストプラクティス集
          </h2>
          <p>
            実際にeveで本番エージェントを運用しているエンジニア（Zachary Proser氏＝WorkOS、Jono
            Alford氏＝Roboto
            Studio）の一次情報と、Vercel公式ドキュメントの記述をもとにまとめた実践知です。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ベストプラクティス</th>
                  <th>理由・背景</th>
                  <th>出典</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>1エージェント＝1リポジトリ＝1責務を徹底する</td>
                  <td>責務が分離されていれば、新機能追加が既存の挙動を退行させない</td>
                  <td>Zachary Proser氏のブログ</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    モデルに直接「公開物」を書かせず、決定的なゲート（ガードレールエンジン）を通す
                  </td>
                  <td>
                    モデルは「慎重に」とは指示できても構造的な安全性は保証できない。ソースの信頼度階層でしか通さない検証層をコードで実装する
                  </td>
                  <td>Roboto Studio社ブログ</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <code>needsApproval</code>
                    は「不可逆・公開・破壊的」操作にのみ設定し、可逆な操作は自由に実行させる
                  </td>
                  <td>
                    過剰な承認ゲートは自律性を殺し、過少だと事故につながる。線引きの基準を明文化する
                  </td>
                  <td>Zachary Proser氏のブログ</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    ベータ期間中は<code>eve</code>・<code>@ai-sdk</code>・<code>@vercel/connect</code>のバージョンをピン留めし、lockfileをコミットする
                  </td>
                  <td>
                    クリーンインストールでCANARYビルドが混入し、型検証エラーで実行が壊れた実例がある
                  </td>
                  <td>Zachary Proser氏のブログ</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>
                    SlackなどのチャネルをVercel
                    Connectで接続する際は<code>--trigger-path</code>を必ず指定する
                  </td>
                  <td>
                    指定漏れは404すら出ない「サイレント障害」になり、デバッグが極めて困難になる
                  </td>
                  <td>Zachary Proser氏のブログ</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>サンドボックスは「モデルにコードを書かせる必要がある」場合にのみ使う</td>
                  <td>定型API呼び出しだけのエージェントにサンドボックスは不要な複雑性を持ち込む</td>
                  <td>Roboto Studio社ブログ</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>判断の難しいタスクには強いモデルを、機械的なタスクには軽量モデルを充てる</td>
                  <td>
                    ガードレールは「安全でない変更」は防げても「よく調べられているが微妙に間違っている変更」は防げない。判断が必要な部分にモデル性能を投資する
                  </td>
                  <td>Roboto Studio社ブログ</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>
                    資格情報はコネクションの定義に閉じ込め、モデルやツール本体には一切持たせない
                  </td>
                  <td>認証情報の漏洩経路を構造的に断つ</td>
                  <td>Vercel公式ドキュメント / Roboto Studio社ブログ</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>
                    コーディングエージェントにeveを実装させる際は、必ず<code>eve.dev/docs</code>や<code>node_modules/eve/docs</code>を読ませてから着手させる
                  </td>
                  <td>
                    eveはリリース直後で学習データに存在しないため、放置すると古い（実際には存在しない）パターンで実装してしまう
                  </td>
                  <td>Roboto Studio社ブログ</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>スケジュール（cron）からサブエージェントへ処理を委譲する設計は避ける</td>
                  <td>
                    task modeでは一時停止・再開に必要なcontinuation
                    tokenが存在せず、実行時エラーになる場合がある
                  </td>
                  <td>Roboto Studio社ブログ</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>Evalsをデプロイゲートとして CI に組み込む</td>
                  <td>プロンプト変更やモデル変更による回帰を、本番投入前にスコアで検知できる</td>
                  <td>Vercel公式ブログ</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>Agent Runsの「開発者モード／ビジネスモード」を使い分ける</td>
                  <td>
                    エンジニアはツール名やJSONで原因調査し、非エンジニアの関係者には平易な要約を見せる
                  </td>
                  <td>Vercel公式ドキュメント</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= 7. ANTI-PATTERNS ================= */}
        <section className={styles.section} id="anti-patterns">
          <h2>
            <span className={styles.num}>07</span> アンチパターンと落とし穴
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>落とし穴</th>
                  <th>症状</th>
                  <th>回避策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Slack Connectの<code>--trigger-path</code>未指定
                  </td>
                  <td>イベントが静かに失われ、Agent Runsにも記録が残らない</td>
                  <td>
                    接続時に必ず<code>--trigger-path /eve/v1/slack</code>を指定する
                  </td>
                </tr>
                <tr>
                  <td>Vercel Deployment Protection</td>
                  <td>SlackなどのWebhookが401で拒否される</td>
                  <td>プレビュー保護のバイパス設定、または本番ドメインでの接続を確認する</td>
                </tr>
                <tr>
                  <td>ベータ版の依存関係ドリフト</td>
                  <td>
                    <code>@ai-sdk</code>のCANARYビルド混入によるツールループの型検証エラー
                  </td>
                  <td>バージョンをピン留めし、lockfileをコミットする</td>
                </tr>
                <tr>
                  <td>Hobbyプランでの高頻度cron</td>
                  <td>1日1回より高頻度のスケジュールが動かない</td>
                  <td>Proプラン以上へアップグレードする</td>
                </tr>
                <tr>
                  <td>「カタログにあるから」という理由でのサンドボックス導入</td>
                  <td>不要な複雑性・攻撃対象領域の増加</td>
                  <td>コード実行が本当に必要かをタスクごとに判断する</td>
                </tr>
                <tr>
                  <td>スケジュール内でサブエージェントに委譲</td>
                  <td>
                    <code>Cannot park: no continuation token</code>
                    のような実行時エラー
                  </td>
                  <td>処理をインラインで完結させるか、ハンドラ形式に変更する</td>
                </tr>
                <tr>
                  <td>モデルに直接、公開コンテンツやデータを編集させる</td>
                  <td>誤情報の公開、取り消し不能な事故</td>
                  <td>決定的なガードレール層（ソース階層による検証など）を挟む</td>
                </tr>
                <tr>
                  <td>eveをよく知らないコーディングエージェントに丸投げする</td>
                  <td>学習データにない新フレームワークのため、存在しないAPIで実装してしまう</td>
                  <td>
                    実装前に公式ドキュメントを読み込ませ、要件をドキュメントの記述と突き合わせる
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= 8. COMPARISON ================= */}
        <section className={styles.section} id="comparison">
          <h2>
            <span className={styles.num}>08</span> eveと他のエージェントフレームワークの比較
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>観点</th>
                  <th>eve（Vercel）</th>
                  <th>Mastra</th>
                  <th>自前実装（フルスクラッチ）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>設計思想</td>
                  <td>Convention over Configuration（ディレクトリ規約）</td>
                  <td>TypeScriptライブラリとしてのエージェント/ツール/ワークフロー</td>
                  <td>完全に自由</td>
                </tr>
                <tr>
                  <td>永続実行</td>
                  <td>標準搭載（Vercel Workflows）</td>
                  <td>別途ワークフロー機構が必要な場合がある</td>
                  <td>自前で実装</td>
                </tr>
                <tr>
                  <td>サンドボックス</td>
                  <td>標準搭載（Vercel Sandbox / Docker等アダプタ）</td>
                  <td>別途統合が必要</td>
                  <td>自前で実装</td>
                </tr>
                <tr>
                  <td>ポータビリティ（マルチクラウド／セルフホスト）</td>
                  <td>現時点ではVercelに強く結合（他プラットフォームアダプタは開発中）</td>
                  <td>クラウド非依存で自己ホスト・マルチクラウドが可能</td>
                  <td>完全に自由（その分すべて自前）</td>
                </tr>
                <tr>
                  <td>学習コスト</td>
                  <td>低い（規約に従うだけ）</td>
                  <td>中程度</td>
                  <td>高い</td>
                </tr>
                <tr>
                  <td>向いているチーム</td>
                  <td>すでにVercel/AI SDKを使っている個人〜チーム</td>
                  <td>マルチクラウド・自己ホストが要件のチーム</td>
                  <td>フレームワークの内部を理解したい学習目的、または特殊要件</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.quoteBlock}>
            すでにVercelとAI
            SDKで生活しているなら、eveはそのスタックにファイルシステムとデプロイボタンを与えてくれたような感覚になる。一方、マルチクラウドや自己ホストが要件なら、eveのVercelネイティブな前提はメリットよりコストの方が大きい。
            <cite>
              Zachary Proser（WorkOS、元Pinecone / Cloudflare / Gruntwork）
            </cite>
          </div>
        </section>

        {/* ================= 9. PRICING ================= */}
        <section className={styles.section} id="pricing">
          <h2>
            <span className={styles.num}>09</span> 料金とリソース制限の考え方
          </h2>
          <p>
            eve自体に専用の課金体系があるわけではなく、<strong>利用したVercelのリソースと、モデル・サードパーティサービスの利用量</strong>に応じて課金されます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>課金要因</th>
                  <th>影響する範囲</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>セッション／ターン数</td>
                  <td>Functionsの起動回数、Workflowのイベント数</td>
                </tr>
                <tr>
                  <td>モデル利用量</td>
                  <td>プロンプト長、ツール結果、推論、キャッシュ済みトークン、出力長</td>
                </tr>
                <tr>
                  <td>ツール呼び出し</td>
                  <td>
                    外部API呼び出しによるFunction実行時間・Workflowイベント数・サードパーティ利用量の増加
                  </td>
                </tr>
                <tr>
                  <td>ストリーミング</td>
                  <td>Workflowによって永続化されるストリーム書き込み量</td>
                </tr>
                <tr>
                  <td>サンドボックス利用</td>
                  <td>コマンド実行、確保リソース、ネットワーク転送、スナップショット保存</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            制限についても、eve固有の上限というより「土台となっているVercelプロダクトの上限」をそのまま継承します（Functionsの実行時間・メモリ・並行数、Workflowのリプレイ時間・ペイロードサイズ、Sandboxのランタイム・vCPU、モデル側のコンテキストウィンドウ・レート制限など）。非常に大きい、あるいは長時間にわたるジョブは、複数の小さなセッションやサブエージェントに分割することが推奨されています。本番運用では
            Spend Management（予算アラート）の設定も忘れずに行いましょう。
          </p>
        </section>

        {/* ================= 10. CONCLUSION ================= */}
        <section className={styles.section} id="conclusion">
          <h2>
            <span className={styles.num}>10</span> まとめ：eveを選ぶべきか
          </h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>あなたの状況</th>
                  <th>推奨</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>すでにVercel／AI SDKでチャットボットや自動化を作っている</td>
                  <td>強く推奨。当日中にデプロイまで到達できる</td>
                </tr>
                <tr>
                  <td>マルチクラウド・セルフホストが要件</td>
                  <td>現時点では推奨しない。Mastraのようなポータブルなフレームワークを検討する</td>
                </tr>
                <tr>
                  <td>エージェント基盤の内部動作を学びたい</td>
                  <td>
                    eveより先に、永続実行・サンドボックス・承認フローを自作して仕組みを理解するのも有益
                  </td>
                </tr>
                <tr>
                  <td>今四半期に本番導入したい</td>
                  <td>バージョンを厳密にピン留めし、パイロット運用してから本格導入する</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            eveはまだパブリックベータであり、API・挙動ともにGA（正式リリース）までに変更される可能性があります。特にSlack
            Connectのトリガーパス設定や依存関係のバージョン管理には、実運用者が共通して時間を溶かしていることが複数の一次情報から確認できるため、本ガイドの「6.
            実運用から得られたベストプラクティス集」「7.
            アンチパターンと落とし穴」を先に一読してから着手することを強くおすすめします。
          </p>
        </section>

        {/* ================= 11. REFERENCES ================= */}
        <section className={styles.section} id="references">
          <h2>
            <span className={styles.num}>11</span> 参考ソース一覧
          </h2>

          <h3>Vercel公式ドキュメント・ブログ</h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refName}>eve トップページ（製品ページ）</span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/eve">https://vercel.com/eve</Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                eve 公式ドキュメント（Getting Started）
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/docs/eve">
                  https://vercel.com/docs/eve
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                eve Concepts（アーキテクチャ詳細）
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/docs/eve/concepts">
                  https://vercel.com/docs/eve/concepts
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>eve Pricing and Limits</span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/docs/eve/pricing">
                  https://vercel.com/docs/eve/pricing
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>eve Observability</span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/docs/eve/observability">
                  https://vercel.com/docs/eve/observability
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                公式ローンチブログ「Introducing eve」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/blog/introducing-eve">
                  https://vercel.com/blog/introducing-eve
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                Changelog「Introducing eve, an open-source agent framework」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/changelog/introducing-eve-an-open-source-agent-framework">
                  https://vercel.com/changelog/introducing-eve-an-open-source-agent-framework
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                Changelog「Trace and debug eve agent sessions with Vercel Observability」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://vercel.com/changelog/eve-agent-observability">
                  https://vercel.com/changelog/eve-agent-observability
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>GitHubリポジトリ</span>
              <span className={styles.refUrl}>
                <Ext href="https://github.com/vercel/eve">
                  https://github.com/vercel/eve
                </Ext>
              </span>
            </li>
          </ul>

          <h3>実運用エンジニアによる一次情報（国際的な開発者の投稿）</h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refName}>
                Zachary Proser（WorkOS、元Pinecone/Cloudflare/Gruntwork）「Reviewing Vercel&apos;s eve
                agent framework by hiring my website three AI employees」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://zackproser.com/blog/reviewing-vercels-eve-agent-framework">
                  https://zackproser.com/blog/reviewing-vercels-eve-agent-framework
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                Zachary Proser「Vercel&apos;s eve agentic framework review. Is eve worth it?」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://zackproser.com/blog/is-vercel-eve-worth-it-agent-framework-review">
                  https://zackproser.com/blog/is-vercel-eve-worth-it-agent-framework-review
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                Roboto Studio（Jono Alford氏）「What we&apos;ve built with eve so far」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://robotostudio.com/blog/building-agents-on-eve">
                  https://robotostudio.com/blog/building-agents-on-eve
                </Ext>
              </span>
            </li>
          </ul>

          <h3>業界メディアの報道・解説</h3>
          <ul className={styles.refList}>
            <li>
              <span className={styles.refName}>
                The New Stack「Vercel launches eve, an open-source framework that treats agents as
                directories」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://thenewstack.io/vercel-launches-eve-an-open-source-framework-that-treats-agents-as-directories/">
                  https://thenewstack.io/vercel-launches-eve-an-open-source-framework-that-treats-agents-as-directories/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                InfoQ「Vercel Introduces Eve, an Open-Source Framework for Building AI
                Agents」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.infoq.com/news/2026/06/vercel-eve-agents/">
                  https://www.infoq.com/news/2026/06/vercel-eve-agents/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                MarkTechPost「Vercel Releases Eve: An Open-Source AI Agent Framework Where Each
                Agent is a Directory of Files Mapped to Capabilities」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.marktechpost.com/2026/06/17/vercel-releases-eve/">
                  https://www.marktechpost.com/2026/06/17/vercel-releases-eve/
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                TechTimes「Vercel Eve Launches as Open-Source Agent Framework Backed by Its Own
                Production Fleet」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.techtimes.com/articles/318642/20260618/vercel-eve-launches-open-source-agent-framework-backed-its-own-production-fleet.htm">
                  https://www.techtimes.com/articles/318642/20260618/vercel-eve-launches-open-source-agent-framework-backed-its-own-production-fleet.htm
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                Developers Digest「Vercel eve: The Framework for Building AI Agents」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.developersdigest.tech/blog/vercel-eve-framework-for-building-ai-agents">
                  https://www.developersdigest.tech/blog/vercel-eve-framework-for-building-ai-agents
                </Ext>
              </span>
            </li>
            <li>
              <span className={styles.refName}>
                DevClass「Vercel debuts eve open source agent framework, tries to fix shadow AI
                with Passport」
              </span>
              <span className={styles.refUrl}>
                <Ext href="https://www.devclass.com/devops/2026/06/23/vercel-debuts-eve-open-source-agent-framework-tries-to-fix-shadow-ai-with-passport/5260169">
                  https://www.devclass.com/devops/2026/06/23/vercel-debuts-eve-open-source-agent-framework-tries-to-fix-shadow-ai-with-passport/5260169
                </Ext>
              </span>
            </li>
          </ul>
        </section>

        <footer className={styles.pageFooter}>
          本ガイドはeveがパブリックベータの時点（2026年7月17日）の情報に基づいています。eveはGA（正式リリース）に向けて仕様が変わる可能性があるため、実装前に必ず公式ドキュメント（
          <Ext href="https://vercel.com/docs/eve">vercel.com/docs/eve</Ext>
          ／
          <Ext href="https://eve.dev/docs">eve.dev/docs</Ext>
          ）の最新版を確認してください。
        </footer>
      </main>
    </div>
  );
}
