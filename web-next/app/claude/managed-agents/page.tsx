import type { Metadata } from "next";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Claude Managed Agents 完全ガイド",
  description:
    "初学者でもわかるステップバイステップ解説。エージェントの作成から本番運用まで、ベストプラクティスを網羅します。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_0 = `flowchart LR
A([開発者]) --> B{何を作りたいか}
B -->|細かい制御が必要| C[Messages API]
B -->|長時間・自律タスク| D[Managed Agents]
C --> C1[自前でエージェントループを実装]
C --> C2[ツール実行を自分でハンドル]
D --> D1[エージェントループは Anthropic が管理]
D --> D2[ツールはサンドボックス内で自動実行]
style C fill:#1e293b,stroke:#475569,color:#e2e8f0
style D fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style C1 fill:#141418,stroke:#2a2a36,color:#9898b0
style C2 fill:#141418,stroke:#2a2a36,color:#9898b0
style D1 fill:#141418,stroke:#2a2a36,color:#9898b0
style D2 fill:#141418,stroke:#2a2a36,color:#9898b0`;

const DIAG_1 = `flowchart LR
A["Agent\\n─────\\nモデル設定\\nシステムプロンプト\\nツール / スキル"]
B["Environment\\n─────\\nクラウドサンドボックス\\nor セルフホスト\\n実行インフラ"]
C["Session\\n─────\\n実行中インスタンス\\n特定タスクを実行\\n会話履歴を保持"]
D["Events\\n─────\\nユーザーターン\\nツール結果\\nステータス更新"]
A -->|使用する| B
B -->|起動する| C
C <-->|やりとりする| D
style A fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style B fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style C fill:#300e14,stroke:#f43f5e,color:#e2e8f0
style D fill:#0c1929,stroke:#3b82f6,color:#e2e8f0`;

const DIAG_2 = `flowchart TD
Dev([開発者 / アプリケーション])
Dev -->|1. エージェント作成| API[Managed Agents API]
Dev -->|2. 環境作成| API
Dev -->|3. セッション開始 + タスク送信| API
API --> AgentDef[(Agent 定義\\nモデル / プロンプト / ツール)]
API --> EnvDef[(Environment 定義\\nクラウドサンドボックス)]
API -->|セッション起動| Session[Session]
Session --> Sandbox[セキュアサンドボックス]
Sandbox --> Tool1[bash 実行]
Sandbox --> Tool2[ファイル操作]
Sandbox --> Tool3[Web サーチ]
Sandbox --> Tool4[コード実行]
Session -->|4. イベントストリーム返却| Dev
style Dev fill:#1e293b,stroke:#475569,color:#e2e8f0
style API fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style Session fill:#300e14,stroke:#f43f5e,color:#e2e8f0
style Sandbox fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style AgentDef fill:#0d0d0f,stroke:#2a2a36,color:#9898b0
style EnvDef fill:#0d0d0f,stroke:#2a2a36,color:#9898b0`;

const DIAG_3 = `flowchart LR
A([開始]) --> B{Console\\nアカウント}
B -->|なし| C[アカウント作成\\nplatform.claude.com]
B -->|あり| D{API キー}
C --> D
D -->|なし| E[API キー発行\\nSettings > Keys]
D -->|あり| F([セットアップ開始])
E --> F
style A fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style F fill:#0a2926,stroke:#14b8a6,color:#e2e8f0`;

const DIAG_4 = `flowchart TD
Q([環境タイプを選ぶ]) --> A{データ居住要件\\nまたはコンプライアンス制約}
A -->|あり| B[セルフホストサンドボックス\\n自社インフラ上で実行]
A -->|なし| C{インターネット\\nアクセスが必要?}
C -->|必要| D[cloud\\ninternet_access: true]
C -->|不要| E[cloud\\ninternet_access: false\\n最小権限の原則]
style B fill:#300e14,stroke:#f43f5e,color:#e2e8f0
style D fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style E fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0`;

const DIAG_5 = `flowchart TD
A([セッション開始]) --> B[session_start]
B --> C{エージェントの処理}
C -->|テキスト生成| D[message_delta]
C -->|ツール使用| E[tool_use]
E --> F[tool_result]
F --> C
C -->|完了| G[session_end]
G --> H([結果取得])
style A fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style G fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style H fill:#0a2926,stroke:#14b8a6,color:#e2e8f0`;

const DIAG_6 = `flowchart TD
Q([ツール実行の許可方式を選ぶ]) --> A{信頼レベル}
A -->|高い — 自動化パイプライン| B[always_allow\\n常に自動許可]
A -->|中程度 — 人間の監視あり| C[ask_human\\n実行前に人間が確認]
A -->|低い — 安全最優先| D[always_deny\\n常に拒否]
style B fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style C fill:#3d1a04,stroke:#f59e0b,color:#e2e8f0
style D fill:#300e14,stroke:#f43f5e,color:#e2e8f0`;

const DIAG_7 = `flowchart LR
A([アプリ]) -->|セッション開始| B[Managed Agents API]
B -->|即時レスポンス\\nsession_id 返却| A
B -->|タスク実行中...| C[サンドボックス]
C -->|完了| B
B -->|Webhook 通知\\nsession_end| D([アプリの\\nWebhook エンドポイント])
style A fill:#1e293b,stroke:#475569,color:#e2e8f0
style B fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style D fill:#0a2926,stroke:#14b8a6,color:#e2e8f0`;

const DIAG_8 = `flowchart TD
Coord([コーディネーター]) -->|独立タスク A| A1[検索エージェント 1\\nソース 1 を調査]
Coord -->|独立タスク B| A2[検索エージェント 2\\nソース 2 を調査]
Coord -->|独立タスク C| A3[検索エージェント 3\\nソース 3 を調査]
A1 -->|結果| Coord
A2 -->|結果| Coord
A3 -->|結果| Coord
Coord --> Result([最終レポート合成])
style Coord fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style Result fill:#0a2926,stroke:#14b8a6,color:#e2e8f0`;

const DIAG_9 = `flowchart LR
Lead([エンジニアリングリード]) -->|コードレビュー依頼| Rev[レビューエージェント]
Lead -->|テスト作成依頼| Test[テストエージェント]
Lead -->|ドキュメント作成依頼| Doc[ドキュメントエージェント]
Rev -->|レビュー結果| Lead
Test -->|テスト結果| Lead
Doc -->|ドキュメント| Lead
style Lead fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style Rev fill:#300e14,stroke:#f43f5e,color:#e2e8f0
style Test fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style Doc fill:#0c1929,stroke:#3b82f6,color:#e2e8f0`;

const DIAG_10 = `flowchart LR
Agent([エージェント]) --> S1[claude-api スキル\\nAPI 参照・ベストプラクティス]
Agent --> S2[カスタムスキル\\n自社ドメイン知識]
Agent --> S3[Anthropic\\nプレビルドスキル]
style Agent fill:#1e1b4b,stroke:#8b5cf6,color:#e2e8f0
style S1 fill:#300e14,stroke:#f43f5e,color:#e2e8f0
style S2 fill:#0a2926,stroke:#14b8a6,color:#e2e8f0
style S3 fill:#0c1929,stroke:#3b82f6,color:#e2e8f0`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.layout}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css"
      />

      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.badge}>Beta 2026-04-01</div>
          <div className={styles.sidebarTitle}>
            Claude Managed Agents
            <br />
            完全ガイド
          </div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>はじめに</div>
          <a className={styles.navItem} href="#overview">
            <i className="ti ti-info-circle" />
            概要
          </a>
          <a className={styles.navItem} href="#comparison">
            <i className="ti ti-arrows-exchange" />
            Messages API との違い
          </a>
          <a className={styles.navItem} href="#concepts">
            <i className="ti ti-cube" />
            4つのコアコンセプト
          </a>
          <a className={styles.navItem} href="#architecture">
            <i className="ti ti-topology-star" />
            全体アーキテクチャ
          </a>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>セットアップ</div>
          <a className={styles.navItem} href="#step0">
            <i className="ti ti-checklist" />
            前提条件
          </a>
          <a className={styles.navItem} href="#step1">
            <i className="ti ti-download" />
            インストール
          </a>
          <a className={styles.navItem} href="#step2">
            <i className="ti ti-robot" />
            エージェント作成
          </a>
          <a className={styles.navItem} href="#step3">
            <i className="ti ti-server" />
            環境設定
          </a>
          <a className={styles.navItem} href="#step4">
            <i className="ti ti-player-play" />
            セッション開始
          </a>
          <a className={styles.navItem} href="#step5">
            <i className="ti ti-radio" />
            イベント処理
          </a>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>詳細</div>
          <a className={styles.navItem} href="#tools">
            <i className="ti ti-tool" />
            組み込みツール
          </a>
          <a className={styles.navItem} href="#permissions">
            <i className="ti ti-shield-lock" />
            権限ポリシー
          </a>
          <a className={styles.navItem} href="#webhook">
            <i className="ti ti-webhook" />
            Webhook
          </a>
          <a className={styles.navItem} href="#multiagent">
            <i className="ti ti-users" />
            マルチエージェント
          </a>
          <a className={styles.navItem} href="#skills">
            <i className="ti ti-puzzle" />
            Agent Skills
          </a>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navLabel}>運用</div>
          <a className={styles.navItem} href="#mistakes">
            <i className="ti ti-alert-triangle" />
            よくあるミスと対策
          </a>
          <a className={styles.navItem} href="#checklist">
            <i className="ti ti-circle-check" />
            チェックリスト
          </a>
          <a className={styles.navItem} href="#references">
            <i className="ti ti-book" />
            参考ソース
          </a>
        </div>
      </nav>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {/* Page header */}
          <div className={styles.pageHeader}>
            <div className={styles.eyebrow}>
              <i className="ti ti-robot" />
              Anthropic / Claude API
            </div>
            <h1>
              Claude Managed Agents
              <br />
              完全ガイド
            </h1>
            <p className={styles.subtitle}>
              初学者でもわかるステップバイステップ解説。
              <br />
              エージェントの作成から本番運用まで、ベストプラクティスを網羅します。
            </p>
            <div className={styles.metaRow}>
              <div className={styles.metaChip}>
                <i className="ti ti-calendar" />
                2026-05-30
              </div>
              <div className={styles.metaChip}>
                <i className="ti ti-tag" />
                <code>managed-agents-2026-04-01</code>
              </div>
              <div className={styles.metaChip}>
                <i className="ti ti-user" />
                初学者向け
              </div>
            </div>
          </div>

          {/* 1. Overview */}
          <section className={styles.section} id="overview">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>1</div>
              <h2>Managed Agents とは何か</h2>
            </div>

            <p>
              Claude Managed Agents は、Anthropic が提供する
              <strong>フルマネージド型 AI エージェント実行基盤</strong>
              です。開発者が自前でエージェントループ・ツール実行環境・ランタイムを構築する必要がなく、すぐに使えます。
            </p>

            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <i className="ti ti-bulb" />
              <div className={styles.calloutBody}>
                <strong>フルマネージドとは?</strong>
                <br />
                インフラの構築・運用をすべて Anthropic
                側が担います。開発者は「何をさせるか」だけに集中できます。
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ユースケース</th>
                    <th>説明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>長時間実行タスク</strong>
                    </td>
                    <td>数分〜数時間かかる多ステップ処理</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>クラウドインフラ活用</strong>
                    </td>
                    <td>事前構成済みパッケージ・ネットワーク付きセキュアサンドボックス</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>セルフホスト実行</strong>
                    </td>
                    <td>コンプライアンス・データ居住要件への対応</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>インフラ最小化</strong>
                    </td>
                    <td>エージェントループ・サンドボックスの自前構築が不要</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ステートフルセッション</strong>
                    </td>
                    <td>複数インタラクションにまたがる永続ファイルシステムと会話履歴</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. Comparison */}
          <section className={styles.section} id="comparison">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>2</div>
              <h2>Messages API との違い</h2>
            </div>

            <p>Anthropic には 2 つのビルド方式があります。目的に応じて使い分けましょう。</p>

            <div className={styles.mermaidWrap}>
              <div id="diag-0">
                <MermaidDiagram chart={DIAG_0} />
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>比較項目</th>
                    <th>Messages API</th>
                    <th>Claude Managed Agents</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>概要</strong>
                    </td>
                    <td>モデルへの直接プロンプトアクセス</td>
                    <td>事前構成済みエージェントハーネス（マネージドインフラ上で動作）</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>向いている用途</strong>
                    </td>
                    <td>カスタムエージェントループ・細粒度制御</td>
                    <td>長時間タスク・非同期ワーク</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>インフラ</strong>
                    </td>
                    <td>自前構築が必要</td>
                    <td>Anthropic が管理</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ツール実行</strong>
                    </td>
                    <td>開発者がハンドル</td>
                    <td>サンドボックス内で自動実行</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>ステート管理</strong>
                    </td>
                    <td>自前実装が必要</td>
                    <td>ビルトインで永続化</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Core Concepts */}
          <section className={styles.section} id="concepts">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>3</div>
              <h2>4 つのコアコンセプト</h2>
            </div>

            <p>
              Managed Agents は 4
              つの概念で構成されています。これを理解することがすべての出発点です。
            </p>

            <div className={styles.mermaidWrap}>
              <div id="diag-1">
                <MermaidDiagram chart={DIAG_1} />
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>コンセプト</th>
                    <th>説明</th>
                    <th>例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Agent</strong>
                    </td>
                    <td>
                      モデル・システムプロンプト・ツール・MCP サーバー・スキルの定義体。一度作成して
                      ID で使い回す
                    </td>
                    <td>
                      <code>Coding Assistant</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Environment</strong>
                    </td>
                    <td>エージェントが動くコンテナ設定。クラウドまたはセルフホストから選ぶ</td>
                    <td>
                      <code>cloud</code> / <code>self-hosted</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Session</strong>
                    </td>
                    <td>
                      環境内で特定タスクを実行する実行中エージェントインスタンス。1 タスク = 1
                      セッション
                    </td>
                    <td>fibonacci.txt を生成するタスク</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Events</strong>
                    </td>
                    <td>アプリとエージェント間でやりとりするメッセージ群</td>
                    <td>ユーザーターン・ツール結果</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. Architecture */}
          <section className={styles.section} id="architecture">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>4</div>
              <h2>全体アーキテクチャ</h2>
            </div>

            <p>
              開発者がエージェントと環境を定義し、セッションを通じてタスクを渡す。エージェントはサンドボックス内で自律的にツールを使い、結果をイベントストリームで返します。
            </p>

            <div className={styles.mermaidWrap}>
              <div id="diag-2">
                <MermaidDiagram chart={DIAG_2} />
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* 5. Step-by-Step Prerequisites */}
          <section className={styles.section} id="step0">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>5</div>
              <h2>Step-by-Step セットアップガイド</h2>
            </div>

            <div className={styles.steps}>
              {/* Step 0 */}
              <div className={styles.step}>
                <div className={styles.stepLeft}>
                  <div className={styles.stepDot}>0</div>
                  <div className={styles.stepLine} />
                </div>
                <div className={styles.stepContent} id="step0-content">
                  <div className={styles.stepTitle}>前提条件を確認する</div>

                  <div className={styles.mermaidWrap}>
                    <div id="diag-3">
                      <MermaidDiagram chart={DIAG_3} />
                    </div>
                  </div>

                  <div className={styles.tableWrap}>
                    <table>
                      <thead>
                        <tr>
                          <th>必要なもの</th>
                          <th>取得方法</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Anthropic Console アカウント</td>
                          <td>
                            <Ext href="https://platform.claude.com">platform.claude.com</Ext>{" "}
                            でサインアップ
                          </td>
                        </tr>
                        <tr>
                          <td>API キー</td>
                          <td>
                            Console の <code>Settings &gt; Keys</code> から発行
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div className={styles.step} id="step1">
                <div className={styles.stepLeft}>
                  <div className={styles.stepDot}>1</div>
                  <div className={styles.stepLine} />
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>CLI と SDK をインストールする</div>
                  <p>
                    Anthropic は <code>ant</code> という CLI ツールを提供しています。SDK
                    と合わせてインストールします。
                  </p>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>bash — CLI インストール</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`# macOS (Homebrew)\nbrew install anthropic/tap/ant\n\n# Linux / WSL (curl)\ncurl -fsSL https://cli.anthropic.com/install.sh | sh\n\n# インストール確認\nant --version`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>
                          <span className={styles.cm}># macOS (Homebrew)</span>
                        </div>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>brew</span> install anthropic/tap/ant
                        </div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          <span className={styles.cm}># Linux / WSL (curl)</span>
                        </div>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>curl</span> -fsSL
                          https://cli.anthropic.com/install.sh | sh
                        </div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          <span className={styles.cm}># インストール確認</span>
                        </div>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>ant</span> --version
                        </div>
                      </code>
                    </pre>
                  </div>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>bash — SDK インストール</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`# Python\npip install anthropic\n\n# TypeScript / Node.js\nnpm install @anthropic-ai/sdk`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>
                          <span className={styles.cm}># Python</span>
                        </div>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>pip</span> install anthropic
                        </div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          <span className={styles.cm}># TypeScript / Node.js</span>
                        </div>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>npm</span> install @anthropic-ai/sdk
                        </div>
                      </code>
                    </pre>
                  </div>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>bash — API キー設定</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`export ANTHROPIC_API_KEY="your-api-key-here"`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>export</span> ANTHROPIC_API_KEY=
                          <span className={styles.st}>"your-api-key-here"</span>
                        </div>
                      </code>
                    </pre>
                  </div>

                  <div className={`${styles.callout} ${styles.calloutWarning}`}>
                    <i className="ti ti-alert-triangle" />
                    <div className={styles.calloutBody}>
                      <strong>API キーの取り扱い</strong>
                      <br />
                      <code>.env</code> ファイルで管理し、<code>.gitignore</code>
                      に追加すること。コードへのハードコードは厳禁です。
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={styles.step} id="step2">
                <div className={styles.stepLeft}>
                  <div className={styles.stepDot}>2</div>
                  <div className={styles.stepLine} />
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>エージェントを作成する</div>
                  <p>
                    エージェントは<strong>一度作成して ID を保存</strong>
                    し、複数セッションで使い回します。毎回作成するのは誤りです。
                  </p>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>CLI</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`ant beta:agents create \\\n  --name "Coding Assistant" \\\n  --model '{id: claude-opus-4-7}' \\\n  --system "You are a helpful coding assistant. Write clean, well-documented code." \\\n  --tool '{type: agent_toolset_20260401}'`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>ant beta:agents create \</div>
                        <div className={styles.codeLine}>
                          {"  "}--name <span className={styles.st}>"Coding Assistant"</span> \
                        </div>
                        <div className={styles.codeLine}>
                          {"  "}--model{" "}
                          <span className={styles.st}>'{`{id: claude-opus-4-7}`}'</span> \
                        </div>
                        <div className={styles.codeLine}>
                          {"  "}--system{" "}
                          <span className={styles.st}>
                            "You are a helpful coding assistant. Write clean, well-documented code."
                          </span>{" "}
                          \
                        </div>
                        <div className={styles.codeLine}>
                          {"  "}--tool{" "}
                          <span className={styles.st}>'{`{type: agent_toolset_20260401}`}'</span>
                        </div>
                      </code>
                    </pre>
                  </div>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>Python</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`import anthropic\n\nclient = anthropic.Anthropic()\n\nagent = client.beta.agents.create(\n    name="Coding Assistant",\n    model={"id": "claude-opus-4-7"},\n    system="You are a helpful coding assistant. Write clean, well-documented code.",\n    tools=[{"type": "agent_toolset_20260401"}],\n    betas=["managed-agents-2026-04-01"],\n)\n\n# このIDを環境変数やDBに保存する\nprint(f"Agent ID: {agent.id}")`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>import</span> anthropic
                        </div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          client = anthropic.<span className={styles.fn}>Anthropic</span>()
                        </div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          agent = client.beta.agents.<span className={styles.fn}>create</span>(
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}name=<span className={styles.st}>"Coding Assistant"</span>,
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}model={"{"}
                          <span className={styles.st}>"id"</span>:{" "}
                          <span className={styles.st}>"claude-opus-4-7"</span>
                          {"}"},
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}system=
                          <span className={styles.st}>
                            "You are a helpful coding assistant. Write clean, well-documented code."
                          </span>
                          ,
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}tools=[{"{"}
                          <span className={styles.st}>"type"</span>:{" "}
                          <span className={styles.st}>"agent_toolset_20260401"</span>
                          {"}"}],
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}betas=[
                          <span className={styles.st}>"managed-agents-2026-04-01"</span>],
                        </div>
                        <div className={styles.codeLine}>)</div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          <span className={styles.cm}># このIDを環境変数やDBに保存する</span>
                        </div>
                        <div className={styles.codeLine}>
                          <span className={styles.fn}>print</span>(
                          <span className={styles.st}>f"Agent ID: {`{agent.id}`}"</span>)
                        </div>
                      </code>
                    </pre>
                  </div>

                  <div className={`${styles.callout} ${styles.calloutInfo}`}>
                    <i className="ti ti-info-circle" />
                    <div className={styles.calloutBody}>
                      <strong>agent_toolset_20260401 とは?</strong>
                      <br />
                      bash・ファイル操作・Web
                      サーチ・コード実行などのビルトインツールセット全体を有効にするショートカット指定です。個別ツールを選んで指定することも可能です。
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={styles.step} id="step3">
                <div className={styles.stepLeft}>
                  <div className={styles.stepDot}>3</div>
                  <div className={styles.stepLine} />
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>環境（Environment）を作成する</div>
                  <p>
                    環境はエージェントが動くコンテナの設定です。クラウドとセルフホストから選びます。
                  </p>

                  <div className={styles.mermaidWrap}>
                    <div id="diag-4">
                      <MermaidDiagram chart={DIAG_4} />
                    </div>
                  </div>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>Python</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`env = client.beta.environments.create(\n    name="quickstart-env",\n    config={\n        "type": "cloud",\n        "network": {"internet_access": True}\n    },\n    betas=["managed-agents-2026-04-01"],\n)\nprint(f"Environment ID: {env.id}")`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>
                          env = client.beta.environments.<span className={styles.fn}>create</span>(
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}name=<span className={styles.st}>"quickstart-env"</span>,
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}config={"{"}
                        </div>
                        <div className={styles.codeLine}>
                          {"        "}
                          <span className={styles.st}>"type"</span>:{" "}
                          <span className={styles.st}>"cloud"</span>,
                        </div>
                        <div className={styles.codeLine}>
                          {"        "}
                          <span className={styles.st}>"network"</span>: {"{"}
                          <span className={styles.st}>"internet_access"</span>:{" "}
                          <span className={styles.kw}>True</span>
                          {"}"}
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}
                          {"}"},
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}betas=[
                          <span className={styles.st}>"managed-agents-2026-04-01"</span>],
                        </div>
                        <div className={styles.codeLine}>)</div>
                        <div className={styles.codeLine}>
                          <span className={styles.fn}>print</span>(
                          <span className={styles.st}>f"Environment ID: {`{env.id}`}"</span>)
                        </div>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className={styles.step} id="step4">
                <div className={styles.stepLeft}>
                  <div className={styles.stepDot}>4</div>
                  <div className={styles.stepLine} />
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>セッションを開始してタスクを送信する</div>
                  <p>
                    作成したエージェント ID と環境 ID を使ってセッションを起動し、タスクを送ります。
                  </p>

                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span className={styles.codeLang}>Python — ストリーミング</span>
                      <CodeCopyButton
                        className={styles.codeCopy}
                        text={`AGENT_ID = "agent_xxxxxxxxxxxxxxxx"\nENV_ID = "env_xxxxxxxxxxxxxxxx"\n\nwith client.beta.sessions.stream(\n    agent_id=AGENT_ID,\n    environment_id=ENV_ID,\n    user_event={\n        "type": "user",\n        "content": "フィボナッチ数列の最初の20個を fibonacci.txt に書き出してください"\n    },\n    betas=["managed-agents-2026-04-01"],\n) as stream:\n    for event in stream:\n        print(event)`}
                      />
                    </div>
                    <pre>
                      <code>
                        <div className={styles.codeLine}>
                          AGENT_ID = <span className={styles.st}>"agent_xxxxxxxxxxxxxxxx"</span>
                        </div>
                        <div className={styles.codeLine}>
                          ENV_ID = <span className={styles.st}>"env_xxxxxxxxxxxxxxxx"</span>
                        </div>
                        <div className={styles.codeLine} />
                        <div className={styles.codeLine}>
                          <span className={styles.kw}>with</span> client.beta.sessions.
                          <span className={styles.fn}>stream</span>(
                        </div>
                        <div className={styles.codeLine}>{"    "}agent_id=AGENT_ID,</div>
                        <div className={styles.codeLine}>{"    "}environment_id=ENV_ID,</div>
                        <div className={styles.codeLine}>
                          {"    "}user_event={"{"}
                        </div>
                        <div className={styles.codeLine}>
                          {"        "}
                          <span className={styles.st}>"type"</span>:{" "}
                          <span className={styles.st}>"user"</span>,
                        </div>
                        <div className={styles.codeLine}>
                          {"        "}
                          <span className={styles.st}>"content"</span>:{" "}
                          <span className={styles.st}>
                            "フィボナッチ数列の最初の20個を fibonacci.txt に書き出してください"
                          </span>
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}
                          {"}"},
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}betas=[
                          <span className={styles.st}>"managed-agents-2026-04-01"</span>],
                        </div>
                        <div className={styles.codeLine}>
                          ) <span className={styles.kw}>as</span> stream:
                        </div>
                        <div className={styles.codeLine}>
                          {"    "}
                          <span className={styles.kw}>for</span> event{" "}
                          <span className={styles.kw}>in</span> stream:
                        </div>
                        <div className={styles.codeLine}>
                          {"        "}
                          <span className={styles.fn}>print</span>(event)
                        </div>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className={styles.step} id="step5">
                <div className={styles.stepLeft}>
                  <div className={styles.stepDot}>5</div>
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>イベントストリームを処理する</div>
                  <p>
                    セッションはリアルタイムでイベントを返します。イベントタイプに応じて処理を分岐させます。
                  </p>

                  <div className={styles.mermaidWrap}>
                    <div id="diag-5">
                      <MermaidDiagram chart={DIAG_5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Tools */}
          <section className={styles.section} id="tools">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>6</div>
              <h2>組み込みツール一覧</h2>
            </div>

            <p>
              <code>agent_toolset_20260401</code>
              を指定すると以下のツールがデフォルトで全て有効になります。個別に無効化や権限設定も可能です。
            </p>

            <div className={styles.tagRow}>
              <span className={`${styles.tag} ${styles.tagPurple}`}>
                <i className="ti ti-terminal" />
                bash
              </span>
              <span className={`${styles.tag} ${styles.tagPurple}`}>
                <i className="ti ti-file-text" />
                read_file
              </span>
              <span className={`${styles.tag} ${styles.tagPurple}`}>
                <i className="ti ti-file-plus" />
                write_file
              </span>
              <span className={`${styles.tag} ${styles.tagPurple}`}>
                <i className="ti ti-folder" />
                list_files
              </span>
              <span className={`${styles.tag} ${styles.tagTeal}`}>
                <i className="ti ti-search" />
                web_search
              </span>
              <span className={`${styles.tag} ${styles.tagTeal}`}>
                <i className="ti ti-world-download" />
                web_fetch
              </span>
              <span className={`${styles.tag} ${styles.tagCoral}`}>
                <i className="ti ti-code" />
                code_execution
              </span>
              <span className={`${styles.tag} ${styles.tagCoral}`}>
                <i className="ti ti-pencil" />
                text_editor
              </span>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ツール名</th>
                    <th>説明</th>
                    <th>必要な設定</th>
                    <th>注意点</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>bash</code>
                    </td>
                    <td>bash コマンドをシェルで実行</td>
                    <td>なし</td>
                    <td>本番では権限ポリシーを必ず設定</td>
                  </tr>
                  <tr>
                    <td>
                      <code>read_file</code>
                    </td>
                    <td>ファイルコンテンツを読み取り</td>
                    <td>なし</td>
                    <td>バイナリファイルにも対応</td>
                  </tr>
                  <tr>
                    <td>
                      <code>write_file</code>
                    </td>
                    <td>ファイルに書き込み</td>
                    <td>なし</td>
                    <td>既存ファイルは上書きされる</td>
                  </tr>
                  <tr>
                    <td>
                      <code>list_files</code>
                    </td>
                    <td>ディレクトリ内のファイル一覧</td>
                    <td>なし</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>
                      <code>web_search</code>
                    </td>
                    <td>Web 検索を実行</td>
                    <td>
                      <code>internet_access: true</code>
                    </td>
                    <td>Environment にインターネット設定が必要</td>
                  </tr>
                  <tr>
                    <td>
                      <code>web_fetch</code>
                    </td>
                    <td>指定 URL のコンテンツを取得</td>
                    <td>
                      <code>internet_access: true</code>
                    </td>
                    <td>Environment にインターネット設定が必要</td>
                  </tr>
                  <tr>
                    <td>
                      <code>code_execution</code>
                    </td>
                    <td>コードをサンドボックスで実行</td>
                    <td>なし</td>
                    <td>実行結果はストリームで返される</td>
                  </tr>
                  <tr>
                    <td>
                      <code>text_editor</code>
                    </td>
                    <td>テキストファイルを精密に編集</td>
                    <td>なし</td>
                    <td>diff 形式で変更を管理</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Permissions */}
          <section className={styles.section} id="permissions">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>7</div>
              <h2>権限ポリシー</h2>
            </div>

            <p>
              ツールごとに実行の許可方式を制御できます。本番環境では最小権限の原則を適用することが重要です。
            </p>

            <div className={styles.mermaidWrap}>
              <div id="diag-6">
                <MermaidDiagram chart={DIAG_6} />
              </div>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>Python — 権限ポリシー設定</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`agent = client.beta.agents.create(\n    name="Safe Agent",\n    model={"id": "claude-opus-4-7"},\n    system="...",\n    tools=[{\n        "type": "agent_toolset_20260401",\n        "default_config": {\n            "permission_policy": {\n                "type": "always_allow" # or "always_deny", "ask_human"\n            }\n        }\n    }],\n    betas=["managed-agents-2026-04-01"],\n)`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    agent = client.beta.agents.<span className={styles.fn}>create</span>(
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}name=<span className={styles.st}>"Safe Agent"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}model={"{"}
                    <span className={styles.st}>"id"</span>:{" "}
                    <span className={styles.st}>"claude-opus-4-7"</span>
                    {"}"},
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}system=<span className={styles.st}>"..."</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}tools=[{"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"agent_toolset_20260401"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>"default_config"</span>: {"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {"            "}
                    <span className={styles.st}>"permission_policy"</span>: {"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {"                "}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"always_allow"</span>{" "}
                    <span className={styles.cm}># or "always_deny", "ask_human"</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"            "}
                    {"}"}
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    {"}"}
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    {"}"}],
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}betas=[<span className={styles.st}>"managed-agents-2026-04-01"</span>],
                  </div>
                  <div className={styles.codeLine}>)</div>
                </code>
              </pre>
            </div>
          </section>

          {/* Webhook */}
          <section className={styles.section} id="webhook">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>8</div>
              <h2>Webhook による非同期処理</h2>
            </div>

            <p>
              長時間タスクを同期で待つと接続タイムアウトが発生します。Webhook
              を使って非同期で結果を受け取るのがベストプラクティスです。
            </p>

            <div className={styles.mermaidWrap}>
              <div id="diag-7">
                <MermaidDiagram chart={DIAG_7} />
              </div>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>Python — Webhook 付きセッション</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`session = client.beta.sessions.create(\n    agent_id=AGENT_ID,\n    environment_id=ENV_ID,\n    user_event={\n        "type": "user",\n        "content": "レポートを作成してください"\n    },\n    webhook={"url": "https://your-app.example.com/webhook/session"},\n    betas=["managed-agents-2026-04-01"],\n)`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    session = client.beta.sessions.<span className={styles.fn}>create</span>(
                  </div>
                  <div className={styles.codeLine}>{"    "}agent_id=AGENT_ID,</div>
                  <div className={styles.codeLine}>{"    "}environment_id=ENV_ID,</div>
                  <div className={styles.codeLine}>
                    {"    "}user_event={"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"user"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>"content"</span>:{" "}
                    <span className={styles.st}>"レポートを作成してください"</span>
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    {"}"},
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}webhook={"{"}
                    <span className={styles.st}>"url"</span>:{" "}
                    <span className={styles.st}>
                      "https://your-app.example.com/webhook/session"
                    </span>
                    {"}"},
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}betas=[<span className={styles.st}>"managed-agents-2026-04-01"</span>],
                  </div>
                  <div className={styles.codeLine}>)</div>
                </code>
              </pre>
            </div>

            <div className={`${styles.callout} ${styles.calloutSuccess}`}>
              <i className="ti ti-check" />
              <div className={styles.calloutBody}>
                <strong>ミッドセッション介入</strong>
                <br />
                実行中のエージェントに追加指示を送って方向を変えることも可能です。
                <code>
                  {`session.send_event({"type": "user", "content": "テストも追加で書いてください"})`}
                </code>
                のように使います。
              </div>
            </div>
          </section>

          {/* Multi-agent */}
          <section className={styles.section} id="multiagent">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>9</div>
              <h2>マルチエージェント設計パターン</h2>
            </div>

            <p>
              複数のエージェントが協調して複雑なタスクをこなせます。全エージェントは同じサンドボックスとファイルシステムを共有しますが、それぞれ独立したコンテキスト（会話履歴）を持ちます。
            </p>

            <h3>パターン 1 — 並列化（Parallelization）</h3>

            <div className={styles.mermaidWrap}>
              <div id="diag-8">
                <MermaidDiagram chart={DIAG_8} />
              </div>
            </div>

            <h3>パターン 2 — 専門化（Specialization）</h3>

            <div className={styles.mermaidWrap}>
              <div id="diag-9">
                <MermaidDiagram chart={DIAG_9} />
              </div>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>Python — コーディネーター作成</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`coordinator = client.beta.agents.create(\n    name="Engineering Lead",\n    model={"id": "claude-opus-4-7"},\n    system="You coordinate engineering work. Delegate to specialist agents.",\n    tools=[{"type": "agent_toolset_20260401"}],\n    multiagent={\n        "type": "coordinator",\n        "agents": [\n            {"type": "agent", "id": REVIEWER_AGENT_ID},\n            {"type": "agent", "id": TEST_WRITER_AGENT_ID}\n        ]\n    },\n    betas=["managed-agents-2026-04-01"],\n)`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    coordinator = client.beta.agents.<span className={styles.fn}>create</span>(
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}name=<span className={styles.st}>"Engineering Lead"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}model={"{"}
                    <span className={styles.st}>"id"</span>:{" "}
                    <span className={styles.st}>"claude-opus-4-7"</span>
                    {"}"},
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}system=
                    <span className={styles.st}>
                      "You coordinate engineering work. Delegate to specialist agents."
                    </span>
                    ,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}tools=[{"{"}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"agent_toolset_20260401"</span>
                    {"}"}],
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}multiagent={"{"}
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"coordinator"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"        "}
                    <span className={styles.st}>"agents"</span>: [
                  </div>
                  <div className={styles.codeLine}>
                    {"            "}
                    {"{"}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"agent"</span>,{" "}
                    <span className={styles.st}>"id"</span>: REVIEWER_AGENT_ID{"}"},
                  </div>
                  <div className={styles.codeLine}>
                    {"            "}
                    {"{"}
                    <span className={styles.st}>"type"</span>:{" "}
                    <span className={styles.st}>"agent"</span>,{" "}
                    <span className={styles.st}>"id"</span>: TEST_WRITER_AGENT_ID{"}"},
                  </div>
                  <div className={styles.codeLine}>{"        "}]</div>
                  <div className={styles.codeLine}>
                    {"    "}
                    {"}"},
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}betas=[<span className={styles.st}>"managed-agents-2026-04-01"</span>],
                  </div>
                  <div className={styles.codeLine}>)</div>
                </code>
              </pre>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>制約</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>深さ制限</strong>
                    </td>
                    <td>コーディネーターからサブエージェントへの委譲は 1 階層のみ</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>エージェント上限</strong>
                    </td>
                    <td>
                      <code>multiagent.agents</code> に指定できるユニークエージェントは最大 20 個
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>スキル上限</strong>
                    </td>
                    <td>セッション全体で最大 20 スキル（全エージェント合算）</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>コンテキスト</strong>
                    </td>
                    <td>各エージェントは独立したコンテキストを持つ（共有しない）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Agent Skills */}
          <section className={styles.section} id="skills">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>10</div>
              <h2>Agent Skills の活用</h2>
            </div>

            <p>
              Agent Skills は、Claude
              の機能を拡張するモジュール型の追加能力です。スキルはインストラクション・メタデータ・オプションのリソースをパッケージ化したもので、Claude
              が関連するタスクで自動的に使用します。
            </p>

            <div className={styles.mermaidWrap}>
              <div id="diag-10">
                <MermaidDiagram chart={DIAG_10} />
              </div>
            </div>

            <h3>カスタムスキルの定義</h3>
            <p>
              スキルは Markdown + YAML フロントマターで定義します。
              <code>description</code>
              フィールドを詳細に書くほど、Claude がいつそのスキルを使うかを正確に判断できます。
            </p>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLang}>Markdown — スキル定義ファイル</span>
                <CodeCopyButton
                  className={styles.codeCopy}
                  text={`---\nname: financial-analyzer\ndescription: >\n  財務データを分析するスキル。\n  売上・コスト・利益率の計算と可視化を行う。\n  財務レポートの作成時に使用する。\n---\n\n# Financial Analyzer\n\n## Instructions\n\n1. まずデータのフォーマットを確認する\n2. 欠損値を処理する\n3. 主要指標（売上・利益率・前年比）を計算する\n4. 結果をレポートとして整形する\n\n## Examples\n\n- "Q3 の売上データを分析して" → データ読み込み → 指標計算 → レポート出力`}
                />
              </div>
              <pre>
                <code>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}>---</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}>name: financial-analyzer</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}>description: &gt;</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}> 財務データを分析するスキル。</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}> 売上・コスト・利益率の計算と可視化を行う。</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}> 財務レポートの作成時に使用する。</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cm}>---</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.kw}># Financial Analyzer</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>## Instructions</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.nu}>1.</span> まずデータのフォーマットを確認する
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.nu}>2.</span> 欠損値を処理する
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.nu}>3.</span> 主要指標（売上・利益率・前年比）を計算する
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.nu}>4.</span> 結果をレポートとして整形する
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.kw}>## Examples</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    - <span className={styles.st}>"Q3 の売上データを分析して"</span> →
                    データ読み込み → 指標計算 → レポート出力
                  </div>
                </code>
              </pre>
            </div>

            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <i className="ti ti-bulb" />
              <div className={styles.calloutBody}>
                <strong>claude-api スキルの活用</strong>
                <br />
                Claude Code には <code>claude-api</code>
                スキルがバンドルされています。Claude API・Managed Agents の最新リファレンスや言語別
                SDK ドキュメントを自動で参照してくれます。
              </div>
            </div>
          </section>

          <hr className={styles.divider} />

          {/* Mistakes */}
          <section className={styles.section} id="mistakes">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>11</div>
              <h2>よくあるミスと対策</h2>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>よくあるミス</th>
                    <th>問題</th>
                    <th>正しい対処法</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>ベータヘッダーを忘れる</strong>
                    </td>
                    <td>
                      <code>managed-agents-2026-04-01</code> を付け忘れて API エラー
                    </td>
                    <td>SDK 使用時は自動付与される。curl 使用時はヘッダーを明示的に追加する</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Agent ID を保存しない</strong>
                    </td>
                    <td>毎回エージェントを作成してコストと時間を無駄にする</td>
                    <td>ID を環境変数や DB に保存する。エージェントは一度作れば使い回せる</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>全ツールを常に有効にする</strong>
                    </td>
                    <td>不要なツールがセキュリティリスクになる</td>
                    <td>最小権限の原則を適用し、タスクに必要なツールのみを有効化する</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>長時間タスクを同期で待つ</strong>
                    </td>
                    <td>接続タイムアウトで失敗する</td>
                    <td>Webhook を使った非同期処理に切り替える</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>システムプロンプトが曖昧</strong>
                    </td>
                    <td>エージェントが意図と異なる動作をする</td>
                    <td>役割・制約・出力形式を具体的に明記する</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>環境タイプを深く考えずに選ぶ</strong>
                    </td>
                    <td>コンプライアンス違反やデータ漏洩リスク</td>
                    <td>データ居住要件がある場合はセルフホストを選ぶ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Checklist */}
          <section className={styles.section} id="checklist">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>12</div>
              <h2>セットアップチェックリスト</h2>
            </div>

            <div className={styles.checklist}>
              <div className={styles.checkGroupTitle}>初回セットアップ</div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                Anthropic Console アカウントを作成した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                API キーを発行し、<code>ANTHROPIC_API_KEY</code>
                環境変数に設定した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                <code>ant</code> CLI をインストールし、<code>ant --version</code>
                で確認した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                SDK をインストールした（<code>pip install anthropic</code>
                または
                <code>npm install @anthropic-ai/sdk</code>）
              </div>

              <div className={styles.checkGroupTitle}>エージェント作成時</div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                モデル ID を明示的に指定した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                システムプロンプトでエージェントの役割・制約・出力形式を明確に定義した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                必要なツールのみを有効化した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                <code>agent.id</code> を安全な場所（環境変数・DB）に保存した
              </div>

              <div className={styles.checkGroupTitle}>環境設定時</div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                クラウド vs セルフホストを要件に基づいて選んだ
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                インターネットアクセスの必要性を確認し設定した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                <code>environment.id</code> を保存した
              </div>

              <div className={styles.checkGroupTitle}>本番運用前</div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                権限ポリシー（<code>always_allow</code> / <code>ask_human</code> /
                <code>always_deny</code>
                ）を適切に設定した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                Webhook エンドポイントを設定した（長時間タスク対応）
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                エラーハンドリングを実装した
              </div>
              <div className={styles.checkItem}>
                <div className={styles.checkBox} />
                コスト管理のためのレート制限を設定した
              </div>
            </div>
          </section>

          {/* References */}
          <section className={styles.section} id="references">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>13</div>
              <h2>参考ソース</h2>
            </div>

            <p>
              本ガイドの内容は以下の公式ドキュメントを一次ソースとして作成しています。最新情報は必ず公式を参照してください。
            </p>

            <div className={styles.refGrid}>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/overview">
                <div className={styles.refCard}>
                  <i className="ti ti-file-description" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>Managed Agents 概要</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../overview</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/quickstart">
                <div className={styles.refCard}>
                  <i className="ti ti-rocket" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>クイックスタート</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../quickstart</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/agent-setup">
                <div className={styles.refCard}>
                  <i className="ti ti-settings" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>エージェント設定</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../agent-setup</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/tools">
                <div className={styles.refCard}>
                  <i className="ti ti-tool" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>ツール一覧</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../tools</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/environments">
                <div className={styles.refCard}>
                  <i className="ti ti-server" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>環境設定</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../environments</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/sessions">
                <div className={styles.refCard}>
                  <i className="ti ti-player-play" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>セッション管理</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../sessions</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/events-and-streaming">
                <div className={styles.refCard}>
                  <i className="ti ti-radio" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>イベントストリーム</div>
                    <div className={styles.refCardUrl}>
                      platform.claude.com/.../events-and-streaming
                    </div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/webhooks">
                <div className={styles.refCard}>
                  <i className="ti ti-webhook" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>Webhooks</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../webhooks</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/multi-agent">
                <div className={styles.refCard}>
                  <i className="ti ti-users" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>マルチエージェント</div>
                    <div className={styles.refCardUrl}>platform.claude.com/.../multi-agent</div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/managed-agents/permission-policies">
                <div className={styles.refCard}>
                  <i className="ti ti-shield-lock" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>権限ポリシー</div>
                    <div className={styles.refCardUrl}>
                      platform.claude.com/.../permission-policies
                    </div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview">
                <div className={styles.refCard}>
                  <i className="ti ti-puzzle" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>Agent Skills 概要</div>
                    <div className={styles.refCardUrl}>
                      platform.claude.com/.../agent-skills/overview
                    </div>
                  </div>
                </div>
              </Ext>
              <Ext href="https://www.anthropic.com/engineering/managed-agents">
                <div className={styles.refCard}>
                  <i className="ti ti-brand-github" />
                  <div className={styles.refCardBody}>
                    <div className={styles.refCardTitle}>Anthropic Engineering Blog</div>
                    <div className={styles.refCardUrl}>
                      anthropic.com/engineering/managed-agents
                    </div>
                  </div>
                </div>
              </Ext>
            </div>

            <div
              className={`${styles.callout} ${styles.calloutInfo}`}
              style={{ marginTop: "24px" }}
            >
              <i className="ti ti-terminal-2" />
              <div className={styles.calloutBody}>
                <strong>インタラクティブなチュートリアル</strong>
                <br />
                Claude Code で <code>/claude-api managed-agents-onboard</code>{" "}
                を実行すると、対話形式で Managed Agents のセットアップをガイドしてもらえます。
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
