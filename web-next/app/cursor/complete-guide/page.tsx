import type { Metadata } from "next";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Cursor 完全ガイド ― 初学者のためのステップバイステップ・ベストプラクティス",
  description:
    "初学者のためのCursor完全ガイド。AIオートコンプリート(Tab補完)、自律Agentモード、コンテキスト管理(@ Symbols)、カスタムルール/サブエージェント設定、MCP連携等の使い方とベストプラクティスを解説。",
};

// ── MERMAID DIAGRAMS ──
const DIAG_ARCH = `flowchart TB
    subgraph EDITOR["Cursor エディタ"]
        TAB["Tab 補完<br/>次の一手を予測"]
        INLINE["Inline Edit<br/>Cmd/Ctrl+K"]
        CHAT["Chat / Agent<br/>Cmd/Ctrl+L"]
    end

    subgraph CONTEXT["コンテキスト層"]
        RULES["Rules<br/>.cursor/rules, AGENTS.md"]
        MEM["Memories<br/>会話から自動学習"]
        INDEX["Codebase Indexing<br/>&nbsp;セマンティック検索&nbsp;"]
        ATSIGN["@ Symbols<br/>ファイル/Web/Git参照"]
    end

    subgraph EXT["外部連携"]
        MCP["MCP Servers<br/>Slack/DB/Figma等"]
        SKILLS["Skills / Subagents<br/>動的な専門知識"]
    end

    subgraph EXEC["実行基盤"]
        LOCAL["ローカル実行<br/>ターミナル/ファイル編集"]
        CLOUD["Cloud Agents<br/>並列クラウドVM"]
        BUGBOT["Bugbot<br/>PR自動レビュー"]
    end

    CHAT --> CONTEXT
    INLINE --> CONTEXT
    CONTEXT --> EXEC
    EXT --> CHAT
    CHAT --> CLOUD
    CLOUD --> BUGBOT

    style EDITOR fill:#0d1b2e,stroke:#5eead4,color:#e8edf5
    style CONTEXT fill:#0d1b2e,stroke:#a78bfa,color:#e8edf5
    style EXT fill:#0d1b2e,stroke:#fbbf24,color:#e8edf5
    style EXEC fill:#0d1b2e,stroke:#fb7185,color:#e8edf5`;

const DIAG_AGENT = `sequenceDiagram
    participant U as 開発者
    participant A as Agent
    participant C as コードベース
    participant T as ターミナル

    U->>A: 自然言語でタスクを依頼
    A->>C: 関連ファイルを検索(grep/セマンティック検索)
    C-->>A: 該当コードを返す
    A->>A: 変更計画を立てる
    A->>C: 複数ファイルを編集(diffとして反映)
    A->>T: テスト/ビルドコマンドを実行
    T-->>A: 実行結果・エラーを返す
    alt エラーがある場合
        A->>C: 自律的に修正を適用
        A->>T: 再実行
    end
    A-->>U: 差分をレビュー用に提示`;

const DIAG_SEARCH = `flowchart LR
    Q["開発者の質問"] --> D{"完全一致で\n探せるか?"}
    D -- "はい\n関数名/変数名が分かる" --> G["Instant Grep\n正規表現・単語境界マッチ"]
    D -- "いいえ\n概念的な質問" --> S["セマンティック検索\nベクトル類似度検索"]
    G --> R["該当コードを特定"]
    S --> R
    R --> A["Agentが編集/回答を生成"]

    style Q fill:#0d1b2e,stroke:#9db0c9,color:#e8edf5
    style G fill:#0d1b2e,stroke:#5eead4,color:#e8edf5
    style S fill:#0d1b2e,stroke:#a78bfa,color:#e8edf5
    style R fill:#0d1b2e,stroke:#fbbf24,color:#e8edf5
    style A fill:#0d1b2e,stroke:#fb7185,color:#e8edf5`;

const DIAG_EXT = `flowchart TB
    R["Rules<br/>常時読み込み・静的"] -->|"会話開始時に自動適用"| CTX["Agentのコンテキスト"]
    SK["Skills (SKILL.md)<br/>動的・オンデマンド"] -->|"関連性があると判断された時のみ"| CTX
    CTX --> MA["メインAgent"]
    MA -->|"タスクを委譲"| SA1["Subagent: explore<br/>コードベース検索"]
    MA -->|"タスクを委譲"| SA2["Subagent: bash<br/>シェル実行"]
    MA -->|"タスクを委譲"| SA3["Subagent: browser<br/>ブラウザ自動化"]
    MA -->|"カスタム委譲"| SA4["カスタムSubagent<br/>.cursor/agents/*.md"]
    SA4 -.->|"Cursor 2.5+ ネスト可"| SA5["孫Subagent"]

    style R fill:#0d1b2e,stroke:#a78bfa,color:#e8edf5
    style SK fill:#0d1b2e,stroke:#5eead4,color:#e8edf5
    style MA fill:#0d1b2e,stroke:#fbbf24,color:#e8edf5`;

const DIAG_CLOUD = `flowchart LR
    A["タスクを依頼<br/>(ローカル or cursor.com/agents)"] --> B{"実行環境を選択"}
    B --> C["Cursor管理の<br/>Cloud Agent(デフォルト)"]
    B --> D["My Machines /<br/>Self-Hosted Pool"]
    C --> E["環境セットアップ<br/>Agent主導 / スナップショット / Dockerfile"]
    E --> F["独立VM上でworktree実行"]
    F --> G["ビルド・テスト・検証"]
    G --> H["マージ可能なPRを生成"]

    style A fill:#0d1b2e,stroke:#9db0c9,color:#e8edf5
    style C fill:#0d1b2e,stroke:#5eead4,color:#e8edf5
    style F fill:#0d1b2e,stroke:#a78bfa,color:#e8edf5
    style H fill:#0d1b2e,stroke:#fbbf24,color:#e8edf5`;

const DIAG_ONBOARD = `flowchart TD
    A["Ask モードで概要を質問<br/>「このコードベースの構成を説明して」"] --> B["Agentにアーキテクチャ図を<br/>Mermaidで生成させる"]
    B --> C["@Docs / @Web で<br/>使用ライブラリの外部ドキュメントを参照"]
    C --> D["小さく安全な改善タスクを依頼"]
    D --> E["diffをレビューし、テストを実行"]
    E --> F["学んだ規約を Project Rule として記録"]

    style A fill:#0d1b2e,stroke:#5eead4,color:#e8edf5
    style F fill:#0d1b2e,stroke:#a78bfa,color:#e8edf5`;

const DIAG_LOOP = `flowchart LR
    D1["Agentのミスを発見"] --> D2["Project Rule /<br/>.cursor/BUGBOT.md に追記"]
    D2 --> D3["以降の全Agent実行<br/>および全Bugbotレビューに反映"]
    D3 --> D4["レビューで繰り返しの<br/>指摘パターンを観測"]
    D4 --> D1

    style D1 fill:#0d1b2e,stroke:#fb7185,color:#e8edf5
    style D2 fill:#0d1b2e,stroke:#fbbf24,color:#e8edf5
    style D3 fill:#0d1b2e,stroke:#5eead4,color:#e8edf5
    style D4 fill:#0d1b2e,stroke:#a78bfa,color:#e8edf5`;

interface ExtProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function Ext({ href, children, className }: ExtProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <>
      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>C</div>
            <div>
              <div className={styles.brandText}>Cursor 完全ガイド</div>
              <div className={styles.brandSub}>v2026.07 &middot; 日本語版</div>
            </div>
          </div>
          <div className={styles.sidebarDivider} />

          <nav className={styles.tocGroup}>
            <div className={styles.tocGroupLabel}>目次</div>
            <a className={styles.tocLink} href="#ch-00">
              <span className={styles.tocNum}>00</span>Cursor とは何か
            </a>
            <a className={styles.tocLink} href="#ch-01">
              <span className={styles.tocNum}>01</span>インストールとクイックスタート
            </a>
            <a className={styles.tocLink} href="#ch-02">
              <span className={styles.tocNum}>02</span>Tab補完
            </a>
            <a className={styles.tocLink} href="#ch-03">
              <span className={styles.tocNum}>03</span>Agentモード
            </a>
            <a className={styles.tocLink} href="#ch-04">
              <span className={styles.tocNum}>04</span>Inline Edit (Cmd/Ctrl+K)
            </a>
            <a className={styles.tocLink} href="#ch-05">
              <span className={styles.tocNum}>05</span>コンテキスト管理
            </a>
            <a className={styles.tocLink} href="#ch-06">
              <span className={styles.tocNum}>06</span>Rules
            </a>
            <a className={styles.tocLink} href="#ch-07">
              <span className={styles.tocNum}>07</span>Skills / Subagents / Hooks
            </a>
            <a className={styles.tocLink} href="#ch-08">
              <span className={styles.tocNum}>08</span>Memories
            </a>
            <a className={styles.tocLink} href="#ch-09">
              <span className={styles.tocNum}>09</span>Model Context Protocol (MCP)
            </a>
            <a className={styles.tocLink} href="#ch-10">
              <span className={styles.tocNum}>10</span>モデル選択・Max Mode・料金体系
            </a>
            <a className={styles.tocLink} href="#ch-11">
              <span className={styles.tocNum}>11</span>Background Agents / Cloud Agents
            </a>
            <a className={styles.tocLink} href="#ch-12">
              <span className={styles.tocNum}>12</span>Bugbot
            </a>
            <a className={styles.tocLink} href="#ch-13">
              <span className={styles.tocNum}>13</span>セキュリティとガードレール
            </a>
            <a className={styles.tocLink} href="#ch-14">
              <span className={styles.tocNum}>14</span>キーボードショートカット早見表
            </a>
            <a className={styles.tocLink} href="#ch-15">
              <span className={styles.tocNum}>15</span>実践ワークフロー
            </a>
            <a className={styles.tocLink} href="#ch-16">
              <span className={styles.tocNum}>16</span>参考文献
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.eyebrow}>
              ● COMPLETE GUIDE &middot; CURSOR 2.5+ &middot; 2026年7月更新
            </div>
            <h1>
              Cursor 完全ガイド
              <br />
              初学者のためのステップバイステップ・ベストプラクティス
            </h1>
            <p className={styles.lead}>
              Cursor は VS Code をベースにした AI ネイティブなコードエディタです。本ガイドでは、
              Tab補完・Agentモード・Rules・MCP・Memories・Bugbot など Cursor の全主要機能について、
              公式ドキュメント (cursor.com/docs)
              を根拠に、初学者でも迷わず実践できるようステップバイステップで解説します。
              各章末には参照した公式ソースの URL を明記しています。
            </p>
            <div className={styles.heroMeta}>
              <span>📄 全17章 + 参考文献</span>
              <span>🔗 一次情報: cursor.com/docs</span>
              <span>🌐 対象: Cursor 初学者〜中級者</span>
            </div>
          </section>

          {/* CHAPTER 00 */}
          <section className={styles.chapter} id="ch-00">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 00 &middot; OVERVIEW
            </div>
            <h2 className={styles.chapterTitle}>Cursor とは何か ― 全体像をつかむ</h2>
            <p className={styles.text}>
              Cursor は、コード補完だけでなく「コードベースを理解し、自律的にタスクをこなす AI
              エージェント」を エディタの中核に据えた開発ツールです。VS Code
              の操作感をそのまま引き継ぎながら、 Tab補完・Chat・Inline Edit・Agent(自律実行)・Cloud
              Agents(クラウド実行)という 5つの入力方式で、AIとコードのやり取りを行います。
            </p>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>FIG 0-1. Cursor の機能アーキテクチャ全体像</div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_ARCH} />
              </div>
            </div>

            <p className={styles.text}>
              重要なのは、これらが「バラバラの機能」ではなく{" "}
              <strong className={styles.strongText}>
                共通のコンテキスト層(Rules / Memories / Codebase Indexing / @ Symbols)
              </strong>{" "}
              を介して連携している点です。Agentに何かを依頼するとき、その裏側では常にこのコンテキスト層が
              「どのファイルを読むべきか」「どんな規約に従うべきか」を判断しています。大規模言語モデルは補完のあいだメモリを保持しないため、Rules
              がプロンプトレベルで永続的な文脈を提供する仕組みになっています。
            </p>

            <h3 className={styles.sectionTitle}>Cursor の4つの動作モード</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>モード</th>
                    <th>用途</th>
                    <th>特徴</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Agent</strong>
                    </td>
                    <td>実装・リファクタ・バグ修正</td>
                    <td>
                      コードベースを検索し、複数ファイルを編集し、ターミナルコマンドを実行し、自律的にエラーを修正する
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Ask</strong>
                    </td>
                    <td>コード変更なしの質問・調査</td>
                    <td>コードベースを検索して質問に答えるのみで、ファイルは編集しない</td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Plan</strong>
                    </td>
                    <td>複雑な実装前の設計レビュー</td>
                    <td>
                      Agentがコードベースを調査し、明確化のための質問をし、レビュー可能な計画を生成する
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Debug</strong>
                    </td>
                    <td>再現・原因特定が難しいバグ</td>
                    <td>再現困難なバグの原因調査に特化</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 モード切替のコツ</div>
              <p className={styles.calloutText}>
                各モードは独自のコンテキストを使用するため、モードを切り替えると新しいコンテキストウィンドウで会話が始まります。タスクの種類が変わったら、既存チャットを使い回さず新しいチャットを開始するのがベストプラクティスです。
              </p>
            </div>
          </section>

          {/* CHAPTER 01 */}
          <section className={styles.chapter} id="ch-01">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 01 &middot; GETTING STARTED
            </div>
            <h2 className={styles.chapterTitle}>インストールとクイックスタート</h2>
            <p className={styles.text}>
              Cursor は macOS / Windows / Linux に対応しており、公式サイトからダウンロードするか、
              Linux では apt / yum リポジトリ経由でインストールできます。ここでは「インストール →
              初めての変更 → レビュー」までの最短ルートを解説します。
            </p>

            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Cursor をダウンロードしてサインイン</strong>
                <p className={styles.stepText}>
                  cursor.com からアプリをダウンロードし、起動後にサインインします。既存の VS Code
                  設定・拡張機能・キーバインドはインポート可能です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>(Linux) apt/yum でのインストール</strong>
                <p className={styles.stepText}>
                  Debian系ではGPGキーを登録してからaptリポジトリを追加します。apt/yumパッケージはAppImageより推奨されており、デスクトップアイコンや自動更新、CLIツールが同梱されます。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>bash — Debian/Ubuntu 系</span>
                    <span className={styles.codeLang}>bash</span>
                    <CodeCopyButton
                      text={`curl -fsSL https://downloads.cursor.com/keys/anysphere.asc \\\n  | gpg --dearmor | sudo tee /etc/apt/keyrings/cursor.gpg > /dev/null\n\necho "deb [arch=amd64,arm64 signed-by=/etc/apt/keyrings/cursor.gpg] \\\nhttps://downloads.cursor.com/aptrepo stable main" \\\n  | sudo tee /etc/apt/sources.list.d/cursor.list > /dev/null\n\nsudo apt update && sudo apt install cursor`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>curl</span> -fsSL
                      https://downloads.cursor.com/keys/anysphere.asc \
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      | gpg --dearmor | <span className={styles.ck}>sudo tee</span>{" "}
                      /etc/apt/keyrings/cursor.gpg &gt; /dev/null
                    </div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>echo</span>{" "}
                      <span className={styles.cs}>
                        "deb [arch=amd64,arm64 signed-by=/etc/apt/keyrings/cursor.gpg] \
                      </span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.cs}>
                        https://downloads.cursor.com/aptrepo stable main"
                      </span>{" "}
                      \
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      | <span className={styles.ck}>sudo tee</span>{" "}
                      /etc/apt/sources.list.d/cursor.list &gt; /dev/null
                    </div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ck}>sudo apt</span> update &amp;&amp;{" "}
                      <span className={styles.ck}>sudo apt</span> install cursor
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>プロジェクトフォルダを開く</strong>
                <p className={styles.stepText}>
                  <code className={styles.inlineCode}>File &gt; Open Folder</code>{" "}
                  でプロジェクトを開くと、Cursor
                  はバックグラウンドで自動的にコードベースのインデックス作成を開始します。設定は不要です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>コードベースを理解させる</strong>
                <p className={styles.stepText}>
                  最初の一手として、Agentに「このリポジトリの構成を説明して」と依頼するのが定石です。Cursorはリポジトリを検索し、関連ファイルを読み、プロジェクトの構造を要約します。これは不慣れなコードベースを素早く把握する最速の方法の一つです。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>プロンプト例</span>
                    <span className={styles.codeLang}>text</span>
                    <CodeCopyButton
                      text={`このコードベースの構成を説明してください。\n主要なディレクトリの役割と、エントリーポイントがどこかを教えてください。`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      このコードベースの構成を説明してください。
                    </div>
                    <div className={styles.codeLine}>
                      主要なディレクトリの役割と、エントリーポイントがどこかを教えてください。
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>小さく安全な変更から始める</strong>
                <p className={styles.stepText}>
                  コードベースを理解したら、Agentに安全な改善案を3つ提案させ、1つ選んで実装させます。低リスクなタスク(文言修正、小さなUI修正など)から始めるのが推奨されています。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>差分をレビューする</strong>
                <p className={styles.stepText}>
                  Agentの変更はdiffビュー上に適用されます。完了したら、そのプロジェクトが元々使っているチェック(テスト・型チェック・lint・ビルド)を実行させて検証しましょう。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/get-started/quickstart">
                    cursor.com/docs/get-started/quickstart
                  </Ext>
                  <span className={styles.refDesc}>Quickstart — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/getting-started/install">
                    cursor.com/help/getting-started/install
                  </Ext>
                  <span className={styles.refDesc}>Download and install Cursor</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/getting-started/first-project">
                    cursor.com/help/getting-started/first-project
                  </Ext>
                  <span className={styles.refDesc}>Your first project</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 02 */}
          <section className={styles.chapter} id="ch-02">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 02 &middot; TAB
            </div>
            <h2 className={styles.chapterTitle}>Tab補完 ― AIオートコンプリート</h2>
            <p className={styles.text}>
              Tab は Cursor 独自の AI
              駆動オートコンプリートです。最近の編集履歴・周辺コード・リンターエラーをもとに、
              次に書くべきコードをグレー表示のゴーストテキストとして提案します。
            </p>

            <div className={styles.grid2}>
              <div className={styles.featureCard}>
                <div className={styles.fcTitle}>
                  <span className={styles.dot} style={{ background: "var(--accent)" }}></span>
                  複数行の編集提案
                </div>
                <p>
                  単一行の補完だけでなく、複数行の書き換え・不足しているimport文の追加・関連コード間の協調的な編集も提案できます。
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.fcTitle}>
                  <span
                    className={styles.dot}
                    style={{ background: "var(--accent-violet)" }}
                  ></span>
                  次の編集位置へジャンプ
                </div>
                <p>
                  提案をTabで確定した後、もう一度Tabを押すと次に編集すべき場所へカーソルが自動でジャンプします。手動でのスクロールや移動が不要になります。
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.fcTitle}>
                  <span className={styles.dot} style={{ background: "var(--accent-amber)" }}></span>
                  クロスファイル編集予測
                </div>
                <p>
                  あるファイルの変更が別のファイルの更新を必要とする場合、Tabはそれを予測します。別ファイルへジャンプ可能なときは、エディタ下部にポータルウィンドウが表示されます。
                </p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.fcTitle}>
                  <span className={styles.dot} style={{ background: "var(--accent-rose)" }}></span>
                  専用モデルで高速動作
                </div>
                <p>
                  Tab補完はCursor独自の専用モデル(Fusion系)によって処理されており、通常のチャット用モデル一覧には表示されません。低レイテンシで動作するよう最適化されています。
                </p>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>ステップバイステップ: Tab を使いこなす</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>提案が出たらそのまま様子を見る</strong>
                <p className={styles.stepText}>
                  タイピング中、カーソルの先にグレーの提案テキストが自動的に表示されます。何も設定は不要です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <kbd className={styles.kbd}>Tab</kbd> で確定 /{" "}
                  <kbd className={styles.kbd}>Esc</kbd> で却下
                </strong>
                <p className={styles.stepText}>
                  提案が正しければTabキーで確定します。不要な場合はEscで却下し、自分でタイプを続けられます。
                </p>
                <div className={styles.kbdRow}>
                  <kbd className={styles.kbd}>Tab</kbd>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "13px" }}>
                    受け入れる
                  </span>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>確定後にもう一度 Tab を押す</strong>
                <p className={styles.stepText}>
                  編集後、次の編集候補位置にカーソルが移動している場合があります。連続してTabを押すことで、複数箇所の編集をテンポよく進められます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>状況に応じてTabを一時停止する</strong>
                <p className={styles.stepText}>
                  エディタ右下のTabステータスインジケーターをクリックすると、指定時間だけTabを無効化する「Snooze」機能や詳細設定にアクセスできます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 ベストプラクティス</div>
              <p className={styles.calloutText}>
                Tabの提案精度は「最近の編集パターン」に強く依存します。似た変更を複数ファイルに適用する場合、最初の1〜2箇所を丁寧に手で編集すると、以降の箇所でTabの予測精度が大きく向上します。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/ai-features/tab">
                    cursor.com/help/ai-features/tab
                  </Ext>
                  <span className={styles.refDesc}>Tab completion — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/tab/overview">
                    cursor.com/docs/tab/overview
                  </Ext>
                  <span className={styles.refDesc}>Tab completion overview</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 03 */}
          <section className={styles.chapter} id="ch-03">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 03 &middot; AGENT
            </div>
            <h2 className={styles.chapterTitle}>Agentモード ― 自律的なコーディング</h2>
            <p className={styles.text}>
              Agent は Cursor
              の中核機能です。コードベースを検索し、複数ファイルを編集し、ターミナルコマンドを実行し、
              自律的にエラーを修正します。ゼロからの機能構築、既存コードのリファクタリング、バグ修正、テスト作成、
              シェルコマンド実行までを自然言語の指示ひとつでこなします。
            </p>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>FIG 3-1. Agentのタスク実行フロー</div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_AGENT} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>ステップバイステップ: Agentを使う</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>具体的な依頼を書く</strong>
                <p className={styles.stepText}>
                  例:「ホームページにメールアドレスとパスワードのフィールドを持つログインフォームを追加して」のように、何をしたいか具体的に書きます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <kbd className={styles.kbd}>Enter</kbd> で送信し、探索を見守る
                </strong>
                <p className={styles.stepText}>
                  Agentはどのファイルを読み、どこを変更し、結果をどう検証すべきかを自分で判断してコードベースの探索を始めます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>diffビューで変更を確認する</strong>
                <p className={styles.stepText}>
                  変更はリアルタイムでdiffビューに反映されます。不要な変更はその場で却下できます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>途中で止めて方向転換する</strong>
                <p className={styles.stepText}>
                  Stopボタンを押すとタスクを途中で停止できます。別のアプローチを指示し直したいときに便利です。
                </p>
              </li>
            </ol>

            <h3 className={styles.sectionTitle}>4つのモードの使い分け</h3>
            <p className={styles.text}>
              Agentパネルでは <kbd className={styles.kbd}>Shift</kbd>+
              <kbd className={styles.kbd}>Tab</kbd>{" "}
              でAgent/Plan/Ask/Debugをローテーション切り替えできます。
              複雑なタスクを検知すると、Cursorが自動でPlanモードを提案することもあります。
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>状況</th>
                    <th>推奨モード</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>普段のほとんどのタスク</td>
                    <td>Agent</td>
                    <td>最も汎用的で高速に実装まで完了する</td>
                  </tr>
                  <tr>
                    <td>コードを変更せず理解したいだけ</td>
                    <td>Ask</td>
                    <td>ファイルを一切編集せず、質問への回答に専念する</td>
                  </tr>
                  <tr>
                    <td>複数ファイルにまたがる大きな機能追加</td>
                    <td>Plan</td>
                    <td>実装前にレビュー可能な計画を生成し、事前に方向性を確認できる</td>
                  </tr>
                  <tr>
                    <td>再現しづらい・原因不明のバグ</td>
                    <td>Debug</td>
                    <td>バグの原因調査に特化した振る舞いをする</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 Plan Mode活用のベストプラクティス</div>
              <p className={styles.calloutText}>
                Planは Markdown ファイルとして開かれるため直接編集できます。「Save to workspace」で{" "}
                <code className={styles.inlineCode}>.cursor/plans/</code>{" "}
                に保存すればチーム向けドキュメントになり、作業の再開や将来のAgentへの引き継ぎにも役立ちます。ただし、単純作業や慣れたタスクでは詳細な計画は不要で、直接Agentに投げてしまって構いません。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.warn}`}>
              <div className={styles.calloutTitle}>⚠️ 計画通りにならなかったとき</div>
              <p className={styles.calloutText}>
                Agentの生成物が想定と違う場合、フォローアップの指示で細かく修正しようとするより、変更を{" "}
                revert{" "}
                してPlanをより具体的に練り直し、再実行する方が結果的に速く、クリーンな結果になりやすいとされています。
              </p>
            </div>

            <h3 className={styles.sectionTitle}>実践パターン: テスト駆動開発(TDD)でAgentを使う</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  期待する入出力ペアに基づいてテストを書かせる
                </strong>
                <p className={styles.stepText}>
                  TDDで進めていることを明示し、まだ存在しない機能に対してモック実装を作らないよう伝えます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>テストを実行させ、失敗を確認させる</strong>
                <p className={styles.stepText}>
                  この段階では実装コードを書かないよう明示的に指示します。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>テストに満足したらコミットする</strong>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>テストに合格する実装コードを書かせる</strong>
                <p className={styles.stepText}>
                  テスト自体は変更しないよう指示し、全テストが通るまで反復させます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/ai-features/agent">
                    cursor.com/help/ai-features/agent
                  </Ext>
                  <span className={styles.refDesc}>Agent mode — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/agent/overview">
                    cursor.com/docs/agent/overview
                  </Ext>
                  <span className={styles.refDesc}>Agent overview</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/agent/plan-mode">
                    cursor.com/docs/agent/plan-mode
                  </Ext>
                  <span className={styles.refDesc}>Plan Mode</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/blog/agent-best-practices">
                    cursor.com/blog/agent-best-practices
                  </Ext>
                  <span className={styles.refDesc}>Best practices for coding with agents</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 04 */}
          <section className={styles.chapter} id="ch-04">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 04 &middot; INLINE EDIT
            </div>
            <h2 className={styles.chapterTitle}>Inline Edit (Cmd/Ctrl+K) ― その場での即時編集</h2>
            <p className={styles.text}>
              Inline Edit は、チャットパネルを開かずにコードをその場で修正できる機能です。
              コードを選択し、やりたいことを説明するだけで、Cursorがその場で編集を適用します。
              ターミナル内でも同じ仕組みが使え、コマンド生成にも利用できます。
            </p>

            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>編集したいコードを選択する</strong>
                <p className={styles.stepText}>関数・ブロック・1行など、任意の範囲を選択します。</p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <kbd className={styles.kbd}>Cmd</kbd>+<kbd className={styles.kbd}>K</kbd>(Mac)/{" "}
                  <kbd className={styles.kbd}>Ctrl</kbd>+<kbd className={styles.kbd}>K</kbd>
                  (Win/Linux)を押す
                </strong>
                <p className={styles.stepText}>インライン入力欄が開きます。</p>
                <div className={styles.kbdRow}>
                  <kbd className={styles.kbd}>⌘</kbd>+<kbd className={styles.kbd}>K</kbd>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>指示を入力してEnter</strong>
                <p className={styles.stepText}>
                  例:「この関数を async
                  関数に変換して」。選択範囲に対してその場で編集が適用されます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>フォローアップで微調整</strong>
                <p className={styles.stepText}>
                  結果に満足しなければ、続けて追加の指示を入力しEnterを押すことで、その場で反復修正できます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>より複雑な変更はChatへ</strong>
                <p className={styles.stepText}>
                  複数ファイルにまたがる変更や大きめの修正が必要になった場合は、コードを選択して{" "}
                  <kbd className={styles.kbd}>Cmd</kbd>/<kbd className={styles.kbd}>Ctrl</kbd>+
                  <kbd className={styles.kbd}>L</kbd>{" "}
                  でChatパネルへエスカレーションするのが自然な流れです。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>ターミナルでもInline Editを使う</strong>
                <p className={styles.stepText}>
                  ターミナル内で <kbd className={styles.kbd}>Ctrl</kbd>+
                  <kbd className={styles.kbd}>K</kbd>{" "}
                  を押すと下部にプロンプトバーが開き、やりたい操作を説明するだけでコマンドを生成してくれます。直近のターミナル履歴も文脈として利用されます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.warn}`}>
              <div className={styles.calloutTitle}>
                ⚠️ User Rules は Inline Edit には適用されない
              </div>
              <p className={styles.calloutText}>
                公式FAQで明言されている通り、User Rules(ユーザー全体設定のルール)はInline
                Edit(Cmd/Ctrl+K)には適用されず、Agent(Chat)でのみ使用されます。Inline
                Editで一貫したコーディング規約を守らせたい場合は、Project
                Rulesやプロンプト内での明示が必要です。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/inline-edit/overview">
                    cursor.com/docs/inline-edit/overview
                  </Ext>
                  <span className={styles.refDesc}>Inline edit — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/rules.md">cursor.com/docs/rules.md</Ext>
                  <span className={styles.refDesc}>
                    Rules — FAQ (User Rules と Inline Edit の関係)
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 05 */}
          <section className={styles.chapter} id="ch-05">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 05 &middot; CONTEXT
            </div>
            <h2 className={styles.chapterTitle}>コンテキスト管理 ― @ Symbols とコードベース検索</h2>
            <p className={styles.text}>
              AIエージェントの回答品質は「どれだけ正確なコンテキストを渡せるか」に大きく左右されます。
              Cursorは <code className={styles.inlineCode}>@</code>{" "}
              記号によるコンテキスト参照と、自動的なコードベースインデックス作成(セマンティック検索)を組み合わせることで、
              大規模なコードベースでも正確に目的のコードへたどり着けるよう設計されています。
            </p>

            <h3 className={styles.sectionTitle}>主要な @ Symbols 一覧</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>記号</th>
                    <th>用途</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>
                      <code>@Files &amp; Folders</code>
                    </td>
                    <td>特定のファイル・フォルダをコンテキストとして明示的に指定する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Code</code>
                    </td>
                    <td>特定の関数やコードシンボルを参照する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Docs</code>
                    </td>
                    <td>外部ドキュメント(ライブラリ公式ドキュメント等)を参照する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Git</code>
                    </td>
                    <td>コミット・ブランチ・PRなどGit情報を参照する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Past Chats</code>
                    </td>
                    <td>過去の会話履歴を参照する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Cursor Rules</code>
                    </td>
                    <td>特定のルールをチャットに手動で適用する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Web</code>
                    </td>
                    <td>Web検索結果をコンテキストに含める</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Link</code>
                    </td>
                    <td>URLを指定してページ内容(PDF含む)を取り込む</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Recent Changes</code>
                    </td>
                    <td>直近の変更差分を参照する</td>
                  </tr>
                  <tr>
                    <td>
                      <code>@Linter Errors</code>
                    </td>
                    <td>現在のリンターエラーを参照する</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>コードベースインデックスの仕組み</h3>
            <p className={styles.text}>
              Cursorはワークスペースを開いた瞬間から自動的にインデックス作成を開始します。設定は不要です。
              コードは意味のあるチャンク(関数・クラス・論理ブロック単位)に分割され、各チャンクは専用の埋め込みモデルによってベクトル化され、ベクトルデータベースに格納されます。
            </p>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>
                FIG 5-1. grep とセマンティック検索の使い分け
              </div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_SEARCH} />
              </div>
            </div>

            <p className={styles.text}>
              Cursorは正確な文字列一致にはCursor独自の高速検索エンジン「Instant Grep」を、意味ベース
              of 検索にはセマンティック検索を、
              それぞれ状況に応じて自動的に使い分けます。研究によれば、grepとセマンティック検索を組み合わせることで、grep単体と比較して
              コードベースに関する質問への回答精度が平均12.5%向上し、1,000ファイル超の大規模コードベースほどその効果は大きくなります。
            </p>

            <h3 className={styles.sectionTitle}>
              ステップバイステップ: 大規模コードベースを効率よく探索する
            </h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  関数名や変数名が分かっているなら、それを明言する
                </strong>
                <p className={styles.stepText}>
                  「processOrder
                  の呼び出し元をすべて見つけて」のように具体的なターゲットを与えると、Agentは正確なgrepパターンを構築できます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>不慣れな領域では「振る舞い」で説明する</strong>
                <p className={styles.stepText}>
                  「認証はどこで処理していますか?」のように尋ねると、"authentication"
                  という単語がファイル内に一切登場しなくても、意味的に近いコード(例:{" "}
                  <code className={styles.inlineCode}>middleware/session.ts</code>)を発見できます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>変更前に既存パターンを確認させる</strong>
                <p className={styles.stepText}>
                  新しいコードを追加する前に、Agentへ既存の実装パターンを提示させることで、重複実装や規約違反を防げます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  探索結果が膨大になりそうならSubagentに任せる
                </strong>
                <p className={styles.stepText}>
                  多数のファイルを横断検索するとコンテキストを大量に消費します。Subagent(第8章参照)は結果を要約して返すため、メインの会話をすっきり保てます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  不明瞭なコードベースはMermaid図で可視化させる
                </strong>
                <p className={styles.stepText}>
                  「認証システムのデータフローを、OAuthプロバイダ・セッション管理・トークンリフレッシュを含めてMermaid図で示して」のように依頼すると、オンボーディングや設計レビューに使えるアーキテクチャ図を生成してくれます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 インデックス対象を絞り込む</div>
              <p className={styles.calloutText}>
                <code className={styles.inlineCode}>.gitignore</code> や{" "}
                <code className={styles.inlineCode}>.cursorignore</code>{" "}
                に記載したファイルはインデックス対象から除外されます。生成物や巨大なコンテンツファイルを除外しておくと検索精度が向上します。インデックス済みのファイル一覧は「Cursor
                Settings &gt; Indexing &amp; Docs &gt; View included files」から確認できます。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://docs.cursor.com/en/context/@-symbols/overview">
                    docs.cursor.com/en/context/@-symbols/overview
                  </Ext>
                  <span className={styles.refDesc}>@ Symbols overview</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/context/codebase-indexing">
                    cursor.com/docs/context/codebase-indexing
                  </Ext>
                  <span className={styles.refDesc}>Semantic &amp; Agentic Search</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/cookbook/large-codebases">
                    cursor.com/docs/cookbook/large-codebases
                  </Ext>
                  <span className={styles.refDesc}>Understanding Your Codebase — Cursor Learn</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/blog/secure-codebase-indexing">
                    cursor.com/blog/secure-codebase-indexing
                  </Ext>
                  <span className={styles.refDesc}>Securely indexing large codebases</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 06 */}
          <section className={styles.chapter} id="ch-06">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 06 &middot; RULES
            </div>
            <h2 className={styles.chapterTitle}>Rules ― 永続的な指示をAgentに与える</h2>
            <p className={styles.text}>
              大規模言語モデルは補完と補完のあいだで記憶を保持しません。Rulesは、プロンプトレベルで
              「常に読み込まれる永続的な文脈」を提供する仕組みです。ルールの内容はモデルコンテキストの先頭に含まれ、
              コード生成・編集の解釈・ワークフロー支援に一貫したガイダンスを与えます。
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>種類</th>
                    <th>保存場所</th>
                    <th>スコープ</th>
                    <th>プラン</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Project Rules</strong>
                    </td>
                    <td>
                      <code>.cursor/rules/*.mdc</code>
                    </td>
                    <td>バージョン管理され、コードベースにスコープされる</td>
                    <td>
                      <span className={`${styles.badge} styles.badgeFree`}>全プラン</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>User Rules</strong>
                    </td>
                    <td>Cursor環境全体(グローバル)</td>
                    <td>Agent(Chat)のみに適用、全プロジェクト共通</td>
                    <td>
                      <span className={`${styles.badge} styles.badgeFree`}>全プラン</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Team Rules</strong>
                    </td>
                    <td>ダッシュボードで管理</td>
                    <td>チーム全体、全リポジトリに適用</td>
                    <td>
                      <span className={`${styles.badge} styles.badgeTeam`}>Team/Enterprise</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>AGENTS.md</strong>
                    </td>
                    <td>プロジェクトルート</td>
                    <td>
                      <code>.cursor/rules</code>のシンプルな代替。素のMarkdownで記述可
                    </td>
                    <td>
                      <span className={`${styles.badge} styles.badgeFree`}>全プラン</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className={styles.text}>
              複数のルールが適用される場合の優先順位は{" "}
              <strong className={styles.strongText}>Team Rules → Project Rules → User Rules</strong>{" "}
              の順です。
              該当するすべてのルールがマージされ、内容が競合する場合は前者(より上位のもの)が優先されます。
            </p>

            <h3 className={styles.sectionTitle}>ステップバイステップ: Project Ruleを作成する</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <code>.cursor/rules/</code> ディレクトリにファイルを作成
                </strong>
                <p className={styles.stepText}>
                  拡張子は必ず <code>.mdc</code> にします。プレーンな{" "}
                  <code className={styles.inlineCode}>.md</code>{" "}
                  ファイルはfrontmatter(description/globs/alwaysApply)を持たないため、ルールシステムに認識されず無視されます。素のMarkdownで済ませたい場合はAGENTS.mdを使いましょう。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>bash — ディレクトリ構成の例</span>
                    <span className={styles.codeLang}>bash</span>
                    <CodeCopyButton
                      text={`.cursor/rules/\n  react-patterns.mdc     # 正しく認識される\n  api-guidelines.md      # 拡張子が違うため無視される\n  frontend/\n    components.mdc       # フォルダで整理も可能`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>.cursor/rules/</div>
                    <div className={styles.codeLine}>
                      {" "}
                      react-patterns.mdc <span className={styles.cc}># 正しく認識される</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      api-guidelines.md{" "}
                      <span className={styles.cc}># 拡張子が違うため無視される</span>
                    </div>
                    <div className={styles.codeLine}> frontend/</div>
                    <div className={styles.codeLine}>
                      {" "}
                      components.mdc <span className={styles.cc}># フォルダで整理も可能</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>frontmatterで適用範囲を定義</strong>
                <p className={styles.stepText}>
                  「Apply
                  Intelligently(内容に応じて自動適用)」を使う場合はdescriptionを必ず定義します。「Apply
                  to Specific
                  Files(特定ファイルにのみ適用)」を使う場合は、参照するファイルにglobsパターンが一致しているか確認してください。ルールが適用されない場合、大抵はこのどちらかの設定漏れが原因です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  本文にはコマンド・規約・参照先を簡潔に書く
                </strong>
                <p className={styles.stepText}>
                  ファイルの内容を丸ごとコピーするのではなく、正規のコード例へのポインタを記載するのがコツです。こうすることでルールが短く保たれ、コードが変わってもルールが陳腐化しにくくなります。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>markdown — .cursor/rules/project.mdc の例</span>
                    <span className={styles.codeLang}>markdown</span>
                    <CodeCopyButton
                      text={`# Commands\n- \`npm run build\`: プロジェクトをビルド\n- \`npm run typecheck\`: 型チェックを実行\n- \`npm run test\`: テストを実行(高速化のため単一ファイル指定を推奨)\n\n# Code style\n- ES modules (import/export) を使用し、CommonJS (require) は使わない\n- 可能な限り分割代入でimportする: \`import { foo } from 'bar'\`\n- 正規のコンポーネント構造は \`components/Button.tsx\` を参照\n\n# Workflow\n- 一連のコード変更後は必ず型チェックを実行する\n- APIルートは既存パターンに従い \`app/api/\` に配置する`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      <span className={styles.ch}># Commands</span>
                    </div>
                    <div className={styles.codeLine}>
                      - <span className={styles.ce}>`npm run build`</span>: プロジェクトをビルド
                    </div>
                    <div className={styles.codeLine}>
                      - <span className={styles.ce}>`npm run typecheck`</span>: 型チェックを実行
                    </div>
                    <div className={styles.codeLine}>
                      - <span className={styles.ce}>`npm run test`</span>:
                      テストを実行(高速化のため単一ファイル指定を推奨)
                    </div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ch}># Code style</span>
                    </div>
                    <div className={styles.codeLine}>
                      - ES modules (import/export) を使用し、CommonJS (require) は使わない
                    </div>
                    <div className={styles.codeLine}>
                      - 可能な限り分割代入でimportする:{" "}
                      <span className={styles.cs}>`import {"{ foo }"} from 'bar'`</span>
                    </div>
                    <div className={styles.codeLine}>
                      - 正規のコンポーネント構造は{" "}
                      <span className={styles.cs}>`components/Button.tsx`</span> を参照
                    </div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ch}># Workflow</span>
                    </div>
                    <div className={styles.codeLine}>
                      - 一連のコード変更後は必ず型チェックを実行する
                    </div>
                    <div className={styles.codeLine}>
                      - APIルートは既存パターンに従い <span className={styles.cs}>`app/api/`</span>{" "}
                      に配置する
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>他ファイルを参照する</strong>
                <p className={styles.stepText}>
                  ルール内で <code className={styles.inlineCode}>@filename.ts</code>{" "}
                  と書くとそのファイルをコンテキストに含められます。チャット内で特定のルールを手動適用したい場合も{" "}
                  <code className={styles.inlineCode}>@</code> でルール名をメンションします。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Agentにミスから学ばせる</strong>
                <p className={styles.stepText}>
                  Agentが間違いを犯したら、その都度ルールを更新します。GitHub上のissueやPRで{" "}
                  <code className={styles.inlineCode}>@cursor</code>{" "}
                  をタグ付けし、Agent自身にルールを更新させることも可能です。
                </p>
              </li>
            </ol>

            <h3 className={styles.sectionTitle}>GitHubからルールをインポートする</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  Cursor Settings → Rules, Commands を開く
                </strong>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  Project Rules 横の「+ Add Rule」から「Remote Rule (GitHub)」を選択
                </strong>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>対象GitHubリポジトリのURLを貼り付ける</strong>
                <p className={styles.stepText}>
                  アクセス権があれば公開・非公開いずれのリポジトリからもルールをインポートできます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.warn}`}>
              <div className={styles.calloutTitle}>⚠️ .cursorrules はレガシー</div>
              <p className={styles.calloutText}>
                プロジェクトルート直下の <code className={styles.inlineCode}>.cursorrules</code>{" "}
                ファイルはレガシー形式であり、将来的に廃止予定です。コマンドパレットから「New Cursor
                Rule」を実行して <code className={styles.inlineCode}>.cursor/rules/*.mdc</code>{" "}
                形式に移行することが推奨されています。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 FAQ: Rulesが他のAI機能に影響するか</div>
              <p className={styles.calloutText}>
                Rulesは Cursor Tab
                や他のAI機能には影響しません。あくまでAgent(Chat)向けの仕組みです。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/rules">cursor.com/docs/rules</Ext>
                  <span className={styles.refDesc}>Rules — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/rules.md">cursor.com/docs/rules.md</Ext>
                  <span className={styles.refDesc}>Rules — 詳細仕様とFAQ</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/blog/agent-best-practices">
                    cursor.com/blog/agent-best-practices
                  </Ext>
                  <span className={styles.refDesc}>Best practices for coding with agents</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 07 */}
          <section className={styles.chapter} id="ch-07">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 07 &middot; SKILLS &amp;
              SUBAGENTS
            </div>
            <h2 className={styles.chapterTitle}>Skills / Subagents / Hooks ― 動的な拡張機構</h2>
            <p className={styles.text}>
              RulesとSkillsは似て非なるものです。
              <strong className={styles.strongText}>Rulesは常時有効な静的コンテキスト</strong>
              である一方、
              <strong className={styles.strongText}>
                Skillsは関連性があると判断されたときにだけ動的に読み込まれる能力
              </strong>
              です。
              この違いにより、コンテキストウィンドウを圧迫せずに専門知識をAgentへ持たせることができます。
            </p>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>FIG 7-1. Rules / Skills / Subagents の関係</div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_EXT} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>Skills(スキル)</h3>
            <p className={styles.text}>
              SkillsはSKILL.mdファイルで定義され、以下を含めることができます。
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong className={styles.strongText}>カスタムコマンド</strong> — Agent入力欄で{" "}
                <code className={styles.inlineCode}>/</code> から呼び出せる再利用可能なワークフロー
              </li>
              <li className={styles.listItem}>
                <strong className={styles.strongText}>フック</strong> —
                Agentのアクション前後に実行されるスクリプト
              </li>
              <li className={styles.listItem}>
                <strong className={styles.strongText}>ドメイン知識</strong> —
                特定タスクのためにオンデマンドで参照される指示
              </li>
            </ul>
            <p className={styles.text}>
              スキルとフックを組み合わせることで、セキュリティツール・シークレット管理・オブザーバビリティ基盤との連携も可能になり、
              「テストが全て通るまで自律的に反復し続けるAgent」のような長時間稼働パターンも構築できます。
            </p>

            <h3 className={styles.sectionTitle}>Subagents(サブエージェント)</h3>
            <p className={styles.text}>
              Cursorには <code className={styles.inlineCode}>explore</code> (コードベース検索)・
              <code className={styles.inlineCode}>bash</code>(シェル実行)・
              <code className={styles.inlineCode}>browser</code>(MCP経由のブラウザ自動化)という
              3つの組み込みSubagentがあり、コンテキストを大量消費する処理を自動的に肩代わりします。設定は不要です。
            </p>

            <h4 className={styles.subSectionTitle}>ステップバイステップ: カスタムSubagentを作る</h4>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <code>.cursor/agents/</code> にYAML frontmatter付きファイルを作成
                </strong>
                <p className={styles.stepText}>
                  <code>name</code> と <code>description</code> を必須で定義します。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>markdown — .cursor/agents/verifier.md</span>
                    <span className={styles.codeLang}>yaml</span>
                    <CodeCopyButton
                      text={`---\nname: verifier\ndescription: 完了した作業を検証する。実装が機能しているか確認し、\n  テストを実行し、合否を報告する。「use proactively」を含めると自動委譲されやすくなる。\nmodel: gpt-5.5\n---\n完了した実装を検証してください。テストを実行し、\n何が合格し、何が未完了かを具体的に報告してください。`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      <span className={styles.cs}>---</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.cm}>name</span>: verifier
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.cm}>description</span>:
                      完了した作業を検証する。実装が機能しているか確認し、
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      テストを実行し、合否を報告する。「use
                      proactively」を含めると自動委譲されやすくなる。
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.cm}>model</span>: gpt-5.5
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.cs}>---</span>
                    </div>
                    <div className={styles.codeLine}>
                      完了した実装を検証してください。テストを実行し、
                    </div>
                    <div className={styles.codeLine}>
                      何が合格し、何が未完了かを具体的に報告してください。
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>descriptionフィールドを練り込む</strong>
                <p className={styles.stepText}>
                  Agentがどのタイミングでこのサブエージェントに委譲するかは{" "}
                  <code className={styles.inlineCode}>description</code> の内容で決まります。「use
                  proactively」「always use
                  for」のようなフレーズを含めると自動委譲が促進されます。実際にプロンプトを試し、意図通りのSubagentが起動するか検証しましょう。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <code>/名前</code> で明示的に呼び出す
                </strong>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>プロンプト例</span>
                    <span className={styles.codeLang}>text</span>
                    <CodeCopyButton
                      text={`/verifier 認証フローが完成しているか確認して\n/debugger このエラーを調査して\n/security-auditor 決済モジュールをレビューして`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      /verifier 認証フローが完成しているか確認して
                    </div>
                    <div className={styles.codeLine}>/debugger このエラーを調査して</div>
                    <div className={styles.codeLine}>
                      /security-auditor 決済モジュールをレビューして
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>複数Subagentを並列起動する</strong>
                <p className={styles.stepText}>
                  「APIの変更をレビューしつつ、ドキュメントを並行して更新して」のように依頼すると、複数のSubagentが並列実行されスループットが向上します。ただし並列実行はトークン消費も比例して増える(5つ並列なら概ね5倍)点に注意が必要です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>汎用的すぎるSubagentを乱立させない</strong>
                <p className={styles.stepText}>
                  「changelogを生成する」「importを整形する」のような単発の単純作業には、Subagentではなく軽量なSkillの利用が推奨されています。各Subagentは単一の明確な責務に絞り込みましょう。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <code>.cursor/agents/</code> をバージョン管理する
                </strong>
                <p className={styles.stepText}>
                  リポジトリにコミットすることでチーム全体がカスタムSubagentの恩恵を受けられます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 Rules vs Skills の判断基準</div>
              <p className={styles.calloutText}>
                「毎回のプロンプトに絶対に必要な短い前提」はRulesへ。「特定タスクの時だけ必要な、やや長めの手順書」はSkillsへ、という切り分けがコンテキスト効率の観点で有効です。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/subagents">cursor.com/docs/subagents</Ext>
                  <span className={styles.refDesc}>Subagents — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/hooks">cursor.com/docs/hooks</Ext>
                  <span className={styles.refDesc}>Hooks — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/blog/agent-best-practices">
                    cursor.com/blog/agent-best-practices
                  </Ext>
                  <span className={styles.refDesc}>
                    Best practices for coding with agents(Skills章)
                  </span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/changelog/2-5">cursor.com/changelog/2-5</Ext>
                  <span className={styles.refDesc}>
                    Plugins, Sandbox Access Controls, and Async Subagents
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 08 */}
          <section className={styles.chapter} id="ch-08">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 08 &middot; MEMORIES
            </div>
            <h2 className={styles.chapterTitle}>Memories ― 会話から自動で学習する記憶機能</h2>
            <p className={styles.text}>
              Memoriesは、会話の中からCursorが事実を自動的に記憶し、以降の会話で参照できるようにする機能です。
              「以前このプロジェクトではこう決めた」といった文脈を毎回タイプし直す必要がなくなります。
            </p>

            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>設定を開く</strong>
                <p className={styles.stepText}>
                  <kbd className={styles.kbd}>Cmd</kbd>/<kbd className={styles.kbd}>Ctrl</kbd>+
                  <kbd className={styles.kbd}>Shift</kbd>+<kbd className={styles.kbd}>J</kbd>{" "}
                  でCursor Settingsを開き、Rulesタブ内のMemoriesセクションを確認します。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>自動生成された記憶を確認する</strong>
                <p className={styles.stepText}>
                  会話中にCursorが「覚えておくべき」と判断した事実は自動的にMemoriesとして蓄積されます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>プロジェクト単位・個人単位で管理する</strong>
                <p className={styles.stepText}>
                  Memoriesはプロジェクトごとに、かつ個人アカウント単位で保存され、設定画面から管理(閲覧・削除)できます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.warn}`}>
              <div className={styles.calloutTitle}>⚠️ プライバシーに関する注意</div>
              <p className={styles.calloutText}>
                Memories機能では、内容とそのインデックスの両方がCursorのインデックス領域に保存されます。機密性の高いプロジェクトで利用する場合は、この保存範囲を理解した上で有効化するかどうかを検討してください。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/changelog/1-0">cursor.com/changelog/1-0</Ext>
                  <span className={styles.refDesc}>
                    Bugbot, Background Agent access to everyone, and one-click MCP
                    install(Memories初出のリリースノート)
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 09 */}
          <section className={styles.chapter} id="ch-09">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 09 &middot; MCP
            </div>
            <h2 className={styles.chapterTitle}>Model Context Protocol (MCP) ― 外部ツール連携</h2>
            <p className={styles.text}>
              MCPは、CursorのAgentを外部ツール・データソースに接続するオープンな規格です。
              Slackメッセージの読み取り、Datadogログの調査、Sentryのエラー調査、データベースへのクエリなど、
              コーディングの枠を超えた作業をAgentに任せられるようになります。
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>MCPプロトコル機能</th>
                    <th>Cursorでのサポート</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>Tools(ツール)</td>
                    <td>AIモデルが実行できる関数。サポート済み</td>
                  </tr>
                  <tr>
                    <td>Prompts(プロンプト)</td>
                    <td>テンプレート化されたメッセージ/ワークフロー。サポート済み</td>
                  </tr>
                  <tr>
                    <td>Resources(リソース)</td>
                    <td>読み取り・参照可能な構造化データソース。サポート済み</td>
                  </tr>
                  <tr>
                    <td>Roots(ルート)</td>
                    <td>サーバー起点のURI/ファイルシステム境界の問い合わせ。サポート済み</td>
                  </tr>
                  <tr>
                    <td>Elicitation(聞き出し)</td>
                    <td>サーバー起点の追加情報要求。サポート済み</td>
                  </tr>
                  <tr>
                    <td>Apps(拡張)</td>
                    <td>ツール出力とともに返るインタラクティブUI。サポート済み</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>ステップバイステップ: MCPサーバーを設定する</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>接続方式を選ぶ(stdio / リモート)</strong>
                <p className={styles.stepText}>
                  ローカルプロセスとして起動するstdio方式(npx, python,
                  dockerなど)と、既にホストされているリモートサーバーにHTTP/SSEで接続する方式があります。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <code>mcp.json</code> に設定を書く
                </strong>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>json — stdioサーバーの例(Node.js)</span>
                    <span className={styles.codeLang}>json</span>
                    <CodeCopyButton
                      text={`{\n  "mcpServers": {\n    "postgres": {\n      "command": "npx",\n      "args": [\n        "-y",\n        "@modelcontextprotocol/server-postgres",\n        "postgresql://localhost/mydb"\n      ]\n    }\n  }\n}`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      <span className={styles.cs}>{"{"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"mcpServers"</span>:{" "}
                      <span className={styles.cs}>{"{"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"postgres"</span>:{" "}
                      <span className={styles.cs}>{"{"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"command"</span>:{" "}
                      <span className={styles.cv}>"npx"</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"args"</span>:{" "}
                      <span className={styles.cs}>[</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cv}>"-y"</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cv}>"@modelcontextprotocol/server-postgres"</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cv}>"postgresql://localhost/mydb"</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cs}>]</span>
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
                      <span className={styles.cs}>{"}"}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>json — リモートサーバーの例(HTTP/SSE)</span>
                    <span className={styles.codeLang}>json</span>
                    <CodeCopyButton
                      text={`{\n  "mcpServers": {\n    "server-name": {\n      "url": "http://localhost:3000/mcp",\n      "headers": { "API_KEY": "value" }\n    }\n  }\n}`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      <span className={styles.cs}>{"{"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"mcpServers"</span>:{" "}
                      <span className={styles.cs}>{"{"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"server-name"</span>:{" "}
                      <span className={styles.cs}>{"{"}</span>
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"url"</span>:{" "}
                      <span className={styles.cv}>"http://localhost:3000/mcp"</span>,
                    </div>
                    <div className={styles.codeLine}>
                      {" "}
                      <span className={styles.cm}>"headers"</span>:{" "}
                      <span className={styles.cs}>{"{ "}</span>
                      <span className={styles.cm}>"API_KEY"</span>:{" "}
                      <span className={styles.cv}>"value"</span>
                      <span className={styles.cs}>{" }"}</span>
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
                      <span className={styles.cs}>{"}"}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  OAuth対応サーバーの認証情報を設定する(必要な場合)
                </strong>
                <p className={styles.stepText}>
                  プロバイダが固定のClient
                  IDを発行している場合や、リダイレクトURLのホワイトリスト登録が必要な場合(FigmaやLinearなど)、Dynamic
                  Client Registrationに対応していない場合は、
                  <code className={styles.inlineCode}>mcp.json</code>
                  に静的なOAuthクライアント資格情報を指定できます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>接続を承認する</strong>
                <p className={styles.stepText}>
                  すべてのMCP接続には明示的な承認が必要です。承認後も、各ツール呼び出しには個別の承認が必要になります(MCPアローリストで特定ツールを事前承認することも可能)。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  ワンクリックインストールリンクを活用する
                </strong>
                <p className={styles.stepText}>
                  MCP開発者であれば、READMEに「Add to
                  Cursor」ボタンを設置してデプロイリンク経由での簡単インストールを提供できます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.danger}`}>
              <div className={styles.calloutTitle}>🔒 セキュリティ上の注意</div>
              <p className={styles.calloutText}>
                MCPサーバーは外部サービスにアクセスし、ユーザーに代わってコードを実行できます。導入前に必ず以下を確認してください。
              </p>
              <ul className={styles.list} style={{ marginTop: "8px" }}>
                <li className={styles.listItem}>
                  信頼できる開発者・リポジトリのMCPサーバーのみ導入する
                </li>
                <li className={styles.listItem}>
                  サーバーがアクセスするデータ・APIの権限範囲を確認する
                </li>
                <li className={styles.listItem}>APIキーは必要最小限の権限に制限する</li>
                <li className={styles.listItem}>
                  重要な連携については、可能であればソースコードを監査する
                </li>
              </ul>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/mcp">cursor.com/docs/mcp</Ext>
                  <span className={styles.refDesc}>Model Context Protocol (MCP) — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/mcp.md">cursor.com/docs/mcp.md</Ext>
                  <span className={styles.refDesc}>MCP — 設定詳細・セキュリティガイドライン</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/context/mcp/install-links">
                    cursor.com/docs/context/mcp/install-links
                  </Ext>
                  <span className={styles.refDesc}>MCP Install Links</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/cli/mcp.md">cursor.com/docs/cli/mcp.md</Ext>
                  <span className={styles.refDesc}>MCP for CLI</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 10 */}
          <section className={styles.chapter} id="ch-10">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 10 &middot; MODELS &amp;
              PRICING
            </div>
            <h2 className={styles.chapterTitle}>モデル選択・Max Mode・料金体系</h2>
            <p className={styles.text}>
              Cursorは Anthropic・OpenAI・Google・xAI
              などのフロンティアモデルに加え、独自のCursorモデルも提供しています。
              どのモデルを選ぶか、Max
              Modeをいつ使うかは、コストと精度のバランスを左右する重要な意思決定です。
            </p>

            <h3 className={styles.sectionTitle}>モデルルーター: Auto と Premium</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>ルーター</th>
                    <th>挙動</th>
                    <th>課金</th>
                    <th>向いている用途</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Auto</strong>
                    </td>
                    <td>知性・コスト効率・信頼性のバランスを考慮しCursorが自動選択</td>
                    <td>固定トークンレート(Cursor Token Rateの対象外)</td>
                    <td>日常的なタスク全般</td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Premium</strong>
                    </td>
                    <td>
                      内部ベンチマーク・評価・ユーザーフィードバックに基づき最も高性能なモデルを選択
                    </td>
                    <td>選択されたモデルのAPIレートで課金</td>
                    <td>最も複雑なタスク</td>
                  </tr>
                  <tr>
                    <td>
                      <strong className={styles.strongText}>Composer 2.5</strong>
                    </td>
                    <td>エージェント型コーディングに特化したCursor独自モデル</td>
                    <td>Autoと同じプールから利用</td>
                    <td>コーディングタスク全般</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className={styles.sectionTitle}>Max Mode</h3>
            <p className={styles.text}>
              Max
              Modeは、そのモデルがサポートする最大のコンテキストウィンドウまで拡張するモードです。
              より広いコンテキストはコードベースへの深い理解につながり、複雑なタスクでの精度向上が期待できます。
              ただしトークンベースの課金となるため、通常モードよりも使用量を早く消費します。
            </p>

            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  チャット/Agentパネルのモデルセレクタを開く
                </strong>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Max Modeをトグルでオンにする</strong>
                <p className={styles.stepText}>
                  これはグローバル設定であり、会話をまたいで有効な状態が維持されます。一部のモデルはMax
                  Mode専用で、選択すると自動的に有効化されます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>効果が大きいケースを見極める</strong>
                <p className={styles.stepText}>
                  Max
                  Modeはデフォルトの約20万トークンより大きなコンテキストウィンドウを持つモデルで最も効果を発揮します。コストよりも最高の精度を優先したい、難易度の高いタスクに向いています。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.warn}`}>
              <div className={styles.calloutTitle}>⚠️ 課金体系の違いに注意</div>
              <p className={styles.calloutText}>
                現行の個人向けプランでは、Max
                ModeはモデルのAPIレートで課金されます。Teamsプランでは、Auto以外のリクエストに1Mトークンあたり$0.25の「Cursor
                Token Rate」が上乗せされます。レガシーなリクエストベースのプランでは、Max
                Modeに20%のサーチャージが加算されます。
              </p>
            </div>

            <h3 className={styles.sectionTitle}>
              個人向けプランの含有APIクレジット(2026年7月時点)
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>プラン</th>
                    <th>月額</th>
                    <th>含まれるAPI利用枠</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>Pro</td>
                    <td>$20/月</td>
                    <td>$20分のAPIエージェント利用 + Auto/Composerの潤沢な利用枠</td>
                  </tr>
                  <tr>
                    <td>Pro Plus</td>
                    <td>$60/月</td>
                    <td>$70分のAPIエージェント利用 + Auto/Composerの潤沢な利用枠</td>
                  </tr>
                  <tr>
                    <td>Ultra</td>
                    <td>$200/月</td>
                    <td>$400分のAPIエージェント利用 + Auto/Composerの潤沢な利用枠</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
              ※
              料金は変更される可能性があるため、最新の金額は必ず公式ページ(下記参照元)で確認してください。
            </p>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 モデル選びの実践指針</div>
              <p className={styles.calloutText}>
                迷ったらまずAutoから始め、複雑な設計判断やリファクタリングなど「一発で高精度な回答がほしい」場面でだけPremiumやMax
                Modeへ切り替えるという運用が、コストと生産性のバランスとして扱いやすい考え方です。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/models-and-pricing">
                    cursor.com/docs/models-and-pricing
                  </Ext>
                  <span className={styles.refDesc}>Models &amp; Pricing — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/ai-features/max-mode">
                    cursor.com/help/ai-features/max-mode
                  </Ext>
                  <span className={styles.refDesc}>Max Mode</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/account-and-billing/pricing">
                    cursor.com/help/account-and-billing/pricing
                  </Ext>
                  <span className={styles.refDesc}>Pricing and plans</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/models-and-usage/usage-limits">
                    cursor.com/help/models-and-usage/usage-limits
                  </Ext>
                  <span className={styles.refDesc}>Usage and limits</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/pricing">cursor.com/pricing</Ext>
                  <span className={styles.refDesc}>Cursor Pricing(最新の公式料金ページ)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 11 */}
          <section className={styles.chapter} id="ch-11">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 11 &middot; CLOUD AGENTS
            </div>
            <h2 className={styles.chapterTitle}>
              Background Agents / Cloud Agents ― クラウドでの並列実行
            </h2>
            <p className={styles.text}>
              Cloud Agentsは、ローカルマシンに縛られずクラウドVM上でAgentを実行する機能です。
              複数のAgentを並列で走らせても互いに干渉しないよう、Cursorが自動的にGit
              worktreeを作成・管理します。
            </p>

            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>FIG 11-1. Cloud Agent の環境構成フロー</div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_CLOUD} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>ステップバイステップ: Cloud Agentを起動する</h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>ソースコード管理サービスと連携する</strong>
                <p className={styles.stepText}>
                  GitHub・GitLab・Azure
                  DevOps・Bitbucketいずれかのアカウントを接続し、必要なリポジトリ権限があることを確認します。有料プランへの加入が必要です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>環境を設定する</strong>
                <p className={styles.stepText}>
                  3つの方法があります: (1) Agent主導のセットアップに任せる、(2)
                  保存済みスナップショットを使う、(3)
                  <code className={styles.inlineCode}>.cursor/environment.json</code>{" "}
                  でDockerfileを指定する。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  チャットの途中からCloud Agentへ委譲する
                </strong>
                <p className={styles.stepText}>
                  メッセージの先頭に <code>&amp;</code> を付けて送信すると、その会話をCloud
                  Agentへプッシュして実行を継続させ、離席中も処理を続けさせられます。あとから{" "}
                  <code className={styles.inlineCode}>cursor.com/agents</code>{" "}
                  でWebやモバイルから再開できます。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>プロンプト例(会話の途中でクラウドに送る)</span>
                    <span className={styles.codeLang}>text</span>
                    <CodeCopyButton
                      text={`& 認証モジュールをリファクタリングして、包括的なテストを追加して`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      &amp; 認証モジュールをリファクタリングして、包括的なテストを追加して
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>シークレット・環境変数を設定する</strong>
                <p className={styles.stepText}>
                  クラウドVM上で人間の開発者と同じようにコードをビルド・テストするには、APIキーやDB認証情報などのシークレットが必要です。
                  <code className={styles.inlineCode}>cursor.com/dashboard/cloud-agents</code>
                  のSecretsタブから管理するのが推奨される方法です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>フックで整合性を保つ</strong>
                <p className={styles.stepText}>
                  Cloud Agentsはリポジトリ内の
                  <code className={styles.inlineCode}>.cursor/hooks.json</code>
                  に定義されたコマンドベースのフックを実行します。
                  <code className={styles.inlineCode}>beforeShellExecution</code>・
                  <code className={styles.inlineCode}>afterFileEdit</code>・
                  <code className={styles.inlineCode}>preToolUse</code>・
                  <code className={styles.inlineCode}>subagentStart</code>
                  などが対応しており、フォーマッタや監査スクリプト、ポリシーチェックをクラウド実行時にも維持できます。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 実践アイデア: モデルの多数決</div>
              <p className={styles.calloutText}>
                複数のモデルに同じ問題を並列で試させ、最良の結果を選ぶという運用パターンは、特に難易度の高いタスクにおいて最終的な出力品質を大きく改善することが確認されています。Cloud
                Agentsの並列実行はこのパターンと相性が良好です。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/cloud-agent">cursor.com/docs/cloud-agent</Ext>
                  <span className={styles.refDesc}>Cloud Agents — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/cloud-agent/setup">
                    cursor.com/docs/cloud-agent/setup
                  </Ext>
                  <span className={styles.refDesc}>Cloud Environment Setup</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/blog/agent-best-practices">
                    cursor.com/blog/agent-best-practices
                  </Ext>
                  <span className={styles.refDesc}>
                    Best practices for coding with agents(並列実行の章)
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 12 */}
          <section className={styles.chapter} id="ch-12">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 12 &middot; BUGBOT
            </div>
            <h2 className={styles.chapterTitle}>Bugbot ― 自動PRコードレビュー</h2>
            <p className={styles.text}>
              BugbotはCursorの自動PRレビュー製品です。すべてのプルリクエストをバグ・セキュリティ脆弱性・コード品質の観点で分析し、
              説明と修正案付きのインラインコメントを残します。GitHub/GitLab/Bitbucketと連携して動作します。
            </p>

            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>リポジトリでBugbotを有効化する</strong>
                <p className={styles.stepText}>
                  GitHub / GitLab /
                  Bitbucketいずれかの連携ページからセットアップします。有効化後はPRの作成・更新のたびに自動的にレビューが走ります。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>手動でレビューをトリガーする</strong>
                <p className={styles.stepText}>
                  PR上に <code>cursor review</code> または <code>bugbot run</code>{" "}
                  とコメントすると、その場でレビューを実行できます。詳細ログが必要な場合は{" "}
                  <code>cursor review verbose=true</code> を使います。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>プロジェクト固有のレビュー基準を教える</strong>
                <p className={styles.stepText}>
                  <code>.cursor/BUGBOT.md</code>{" "}
                  を作成し、レビュー時に守ってほしい基準を記述します。Bugbotは常にルートのファイルを含み、変更されたファイルから上位ディレクトリへ遡って関連コンテキストを探します。
                </p>
                <div className={styles.codeWrap}>
                  <div className={styles.codeBar}>
                    <span>markdown — .cursor/BUGBOT.md の例</span>
                    <span className={styles.codeLang}>markdown</span>
                    <CodeCopyButton
                      text={`# Review Standards\n\n## テストカバレッジ\n\`server/**\`, \`api/**\` に変更があり、\`**/*.test.*\`, \`tests/**\` に変更がない場合、\nテスト不足としてフラグを立てる。\n\n## セキュリティ機微な領域\n\`auth/**\`, \`payments/**\`, \`security/**\` を変更するPRには\nセキュリティレビューを促すコメントを追加する。\n\n## よくあるパターン\n- 非同期コードでの \`.Result\` や \`.Wait()\` の使用(awaitを使うべき)にフラグを立てる\n- 紐づくissueのないTODOコメントにフラグを立てる\n- PR説明に正当化理由のない新規依存関係にフラグを立てる`}
                    />
                  </div>
                  <div className={styles.codeBody}>
                    <div className={styles.codeLine}>
                      <span className={styles.ch}># Review Standards</span>
                    </div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ch}>## テストカバレッジ</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ce}>`server/**`</span>,{" "}
                      <span className={styles.ce}>`api/**`</span> に変更があり、
                      <span className={styles.ce}>`**/*.test.*`</span>,{" "}
                      <span className={styles.ce}>`tests/**`</span> に変更がない場合、
                    </div>
                    <div className={styles.codeLine}>テスト不足としてフラグを立てる。</div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ch}>## セキュリティ機微な領域</span>
                    </div>
                    <div className={styles.codeLine}>
                      <span className={styles.ce}>`auth/**`</span>,{" "}
                      <span className={styles.ce}>`payments/**`</span>,{" "}
                      <span className={styles.ce}>`security/**`</span> を変更するPRには
                    </div>
                    <div className={styles.codeLine}>
                      セキュリティレビューを促すコメントを追加する。
                    </div>
                    <div className={styles.codeLine} />
                    <div className={styles.codeLine}>
                      <span className={styles.ch}>## よくあるパターン</span>
                    </div>
                    <div className={styles.codeLine}>
                      - 非同期コードでの <span className={styles.ce}>`.Result`</span> や{" "}
                      <span className={styles.ce}>`.Wait()`</span>{" "}
                      の使用(awaitを使うべき)にフラグを立てる
                    </div>
                    <div className={styles.codeLine}>
                      - 紐づくissueのないTODOコメントにフラグを立てる
                    </div>
                    <div className={styles.codeLine}>
                      - PR説明に正当化理由のない新規依存関係にフラグを立てる
                    </div>
                  </div>
                </div>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  1週間ほど運用してルールをチューニングする
                </strong>
                <p className={styles.stepText}>
                  運用開始後しばらくすると、どのコメントが価値があり、どれを無視すべきかの傾向が見えてきます。それに応じてルールを調整していきます。まずは繰り返し発生する1〜2個の問題から着手し、パターンが見えるたびにルールを追加するのが定石です。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Bugbot Autofixを有効にする(任意)</strong>
                <p className={styles.stepText}>
                  BugbotダッシュボードでAutofixを有効にすると、Bugbotが発見した問題に対して独立したクラウドAgentが自律的に修正案を生成します。Autofixによる変更の35%以上が実際にベースPRへマージされています。
                </p>
              </li>
            </ol>

            <h3 className={styles.sectionTitle}>
              レビュアーとしてCursorを使う(人間が主導するレビュー)
            </h3>
            <p className={styles.text}>
              Bugbotとは別に、レビュアー自身がAgentを使って理解を助けることもできます。
            </p>
            <div className={styles.codeWrap}>
              <div className={styles.codeBar}>
                <span>プロンプト例 — レビュー時の質問集</span>
                <span className={styles.codeLang}>text</span>
                <CodeCopyButton
                  text={`このPRを説明してください。何を達成しようとしていて、\nどんなアプローチを取っていますか?\n\nこのPRは決済フローに触れています。変更されたコードが\n決済システムの他の部分とどうつながっているか見せてください。\n\nこのPRは返金処理の扱いを変更しています。\nどんなエッジケースを確認すべきですか?`}
                />
              </div>
              <div className={styles.codeBody}>
                <div className={styles.codeLine}>
                  このPRを説明してください。何を達成しようとしていて、
                </div>
                <div className={styles.codeLine}>どんなアプローチを取っていますか?</div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>
                  このPRは決済フローに触れています。変更されたコードが
                </div>
                <div className={styles.codeLine}>
                  決済システムの他の部分とどうつながっているか見せてください。
                </div>
                <div className={styles.codeLine} />
                <div className={styles.codeLine}>このPRは返金処理の扱いを変更しています。</div>
                <div className={styles.codeLine}>どんなエッジケースを確認すべきですか?</div>
              </div>
            </div>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 レビュー知識をルール化する</div>
              <p className={styles.calloutText}>
                優れたレビュアーが持つ知識は、Bugbot Rules(
                <code className={styles.inlineCode}>.cursor/BUGBOT.md</code>)やProject
                Rulesとして明文化できます。一度エンコードすれば、Cursor(とBugbot)はすべてのレビューでその知識を一貫して適用してくれます。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/ai-features/bugbot">
                    cursor.com/help/ai-features/bugbot
                  </Ext>
                  <span className={styles.refDesc}>Bugbot — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/bugbot">cursor.com/bugbot</Ext>
                  <span className={styles.refDesc}>
                    AI Code Review Built for Production — Bugbot by Cursor
                  </span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/for/code-review">cursor.com/for/code-review</Ext>
                  <span className={styles.refDesc}>Reviewing Code with Cursor</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/blog/bugbot-autofix">
                    cursor.com/blog/bugbot-autofix
                  </Ext>
                  <span className={styles.refDesc}>
                    Closing the code review loop with Bugbot Autofix
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 13 */}
          <section className={styles.chapter} id="ch-13">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 13 &middot; SECURITY
            </div>
            <h2 className={styles.chapterTitle}>セキュリティとガードレール</h2>
            <p className={styles.text}>
              AIエージェントはプロンプトインジェクション・ハルシネーションなどにより予期しない挙動を取る可能性があります。
              Cursorはデフォルトで複数のガードレールを備えており、公式には「これらのデフォルト設定は有効なままにしておくことを推奨する」とされています。
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>アクション種別</th>
                    <th>承認要否</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>ファイル読み取り・コード検索</td>
                    <td>承認不要</td>
                  </tr>
                  <tr>
                    <td>ワークスペースファイルの編集</td>
                    <td>
                      原則不要(即座にディスクへ保存されるため、バージョン管理での差し戻しを前提とする)
                    </td>
                  </tr>
                  <tr>
                    <td>設定ファイル(コンフィグ)の変更</td>
                    <td>承認が必要</td>
                  </tr>
                  <tr>
                    <td>ターミナルコマンドの実行</td>
                    <td>デフォルトで承認が必要(Run Modesで信頼済みコマンドのみ自動許可も可能)</td>
                  </tr>
                  <tr>
                    <td>MCP接続</td>
                    <td>接続時に承認が必要。承認後も各ツール呼び出しごとに個別承認が必要</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  <code>.cursorignore</code> でアクセス制限する
                </strong>
                <p className={styles.stepText}>
                  Agentにアクセスさせたくない特定のファイル(シークレット、機密文書など)は{" "}
                  <code>.cursorignore</code> でブロックします。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Run Modesを設定する</strong>
                <p className={styles.stepText}>
                  単純なアローリストから「Auto-review
                  classifier」まで、ターミナルコマンドの自動承認範囲を段階的に設定できます。ただしこれらは「ベストエフォートのガードレール」であり、ハードなセキュリティ境界ではない点に注意してください。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>
                  ワークスペーストラストを有効化する(必要な場合)
                </strong>
                <p className={styles.stepText}>
                  デフォルトでは無効ですが、有効にすると新しいワークスペースを開く際に「通常モード」か「制限モード」かを選択するよう促されます。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>自動リロード設定を確認する</strong>
                <p className={styles.stepText}>
                  自動リロードが有効な場合、レビューする前にAgentの変更が実行されてしまう可能性があります。レビューを重視する場合はこの設定を見直しましょう。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>常にバージョン管理を使う</strong>
                <p className={styles.stepText}>
                  Agentはワークスペースファイル(設定ファイルを除く)を承認なしに変更でき、変更は即座にディスクへ保存されます。Gitなどのバージョン管理を必ず併用し、いつでも変更を差し戻せる状態にしておくことが公式に推奨されています。
                </p>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.danger}`}>
              <div className={styles.calloutTitle}>🔒 ネットワークアクセスについて</div>
              <p className={styles.calloutText}>
                デフォルト設定では、Agentのツールは限定されたネットワーク先にしかリクエストを送れず、任意のネットワークリクエストを自由に行うことはできません。攻撃者はネットワークリクエストを悪用してデータを窃取しようとする可能性があるため、この制限がセキュリティ上重要な役割を果たしています。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/agent/security">
                    cursor.com/docs/agent/security
                  </Ext>
                  <span className={styles.refDesc}>Agent Security — Cursor Docs</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 14 */}
          <section className={styles.chapter} id="ch-14">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 14 &middot; SHORTCUTS
            </div>
            <h2 className={styles.chapterTitle}>キーボードショートカット早見表</h2>
            <p className={styles.text}>
              CursorはVS Codeをベースにしているため、既存のVS Codeショートカットはそのまま使えます。
              その上でCursor独自のAI機能向けショートカットが追加されています。以下は日常的な開発でとくに重要なものです。
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>ショートカット</th>
                    <th>機能</th>
                    <th>章</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>⌘</kbd>/<kbd className={styles.kbd}>Ctrl</kbd> +{" "}
                      <kbd className={styles.kbd}>K</kbd>
                    </td>
                    <td>Inline Edit を開く(選択範囲をその場で編集)</td>
                    <td>Ch.04</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>⌘</kbd>/<kbd className={styles.kbd}>Ctrl</kbd> +{" "}
                      <kbd className={styles.kbd}>L</kbd>
                    </td>
                    <td>Chat / Agent パネルを開く(複雑な変更・複数ファイル編集へ)</td>
                    <td>Ch.03, 04</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>Tab</kbd>
                    </td>
                    <td>Tab補完の提案を確定する</td>
                    <td>Ch.02</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>Esc</kbd>
                    </td>
                    <td>提案を却下する</td>
                    <td>Ch.02</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>Shift</kbd> +{" "}
                      <kbd className={styles.kbd}>Tab</kbd>
                    </td>
                    <td>Agent / Plan / Ask / Debug モードをローテーション切替</td>
                    <td>Ch.03</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>⌘</kbd>/<kbd className={styles.kbd}>Ctrl</kbd> +{" "}
                      <kbd className={styles.kbd}>E</kbd>
                    </td>
                    <td>Background Agent のコントロールパネルを開く</td>
                    <td>Ch.11</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>Ctrl</kbd> + <kbd className={styles.kbd}>K</kbd>
                      (ターミナル内)
                    </td>
                    <td>ターミナル用Inline Editでコマンド生成</td>
                    <td>Ch.04</td>
                  </tr>
                  <tr>
                    <td>
                      <kbd className={styles.kbd}>⌘</kbd>/<kbd className={styles.kbd}>Ctrl</kbd> +{" "}
                      <kbd className={styles.kbd}>Shift</kbd> + <kbd className={styles.kbd}>J</kbd>
                    </td>
                    <td>Cursor Settingsを開く(Rules / Memories 管理)</td>
                    <td>Ch.06, 08</td>
                  </tr>
                  <tr>
                    <td>@ + 入力</td>
                    <td>@ Symbols メニューを開き、矢印キーで候補をナビゲート</td>
                    <td>Ch.05</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 ショートカットのカスタマイズ</div>
              <p className={styles.calloutText}>
                Tab補完の確定キーなど、多くのショートカットはKeyboard Shortcuts設定から「Accept
                Cursor Tab Suggestions」のようなコマンド名で検索してリマップできます。VS Codeの
                <code>keybindings.json</code>もそのままインポート可能です。
              </p>
            </div>

            <div className={`${styles.callout} ${styles.cite}`}>
              <div className={styles.calloutTitle}>📚 この章の参照元</div>
              <ul className={styles.citeList}>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/reference/keyboard-shortcuts">
                    cursor.com/docs/reference/keyboard-shortcuts
                  </Ext>
                  <span className={styles.refDesc}>Keyboard Shortcuts — Cursor Docs</span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/docs/tab/overview">
                    cursor.com/docs/tab/overview
                  </Ext>
                  <span className={styles.refDesc}>
                    Tab completion(ショートカットのリマップ方法)
                  </span>
                </li>
                <li className={styles.citeListItem}>
                  <Ext href="https://cursor.com/help/ai-features/terminal">
                    docs.cursor.com/en/inline-edit/terminal
                  </Ext>
                  <span className={styles.refDesc}>Inline Edit — Terminal</span>
                </li>
              </ul>
            </div>
          </section>

          {/* CHAPTER 15 */}
          <section className={styles.chapter} id="ch-15">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 15 &middot; WORKFLOWS
            </div>
            <h2 className={styles.chapterTitle}>実践ワークフロー ― 機能を組み合わせる</h2>
            <p className={styles.text}>
              ここまで個々の機能を見てきましたが、実際の開発では複数機能を組み合わせて使います。
              最後に、代表的な3つのワークフローを通じて機能同士の連携をおさらいします。
            </p>

            <h3 className={styles.sectionTitle}>
              ワークフロー1: 未知のコードベースへのオンボーディング
            </h3>
            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>
                FIG 15-1. 新規参画者のオンボーディングフロー
              </div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_ONBOARD} />
              </div>
            </div>

            <h3 className={styles.sectionTitle}>
              ワークフロー2: 大規模リファクタリング(Plan → 並列Cloud Agent)
            </h3>
            <ol className={styles.steps}>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Planモードで計画を立てる</strong>
                <p className={styles.stepText}>
                  Agentに調査させ、明確化のための質問に答え、レビュー可能な計画を{" "}
                  <code className={styles.inlineCode}>.cursor/plans/</code> に保存する。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>計画をチームでレビューする</strong>
                <p className={styles.stepText}>
                  Markdownファイルなので、Pull Request同様にコメント・修正が可能。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Cloud Agentへ委譲する</strong>
                <p className={styles.stepText}>
                  <code>&amp;</code>{" "}
                  を使って計画の実行をクラウドへ送り、複数モジュールを並列worktreeで処理させる。
                </p>
              </li>
              <li className={styles.stepItem}>
                <strong className={styles.stepTitle}>Bugbotで最終チェック</strong>
                <p className={styles.stepText}>
                  生成されたPRに対してBugbotが自動レビューし、見落としを検出する。
                </p>
              </li>
            </ol>

            <h3 className={styles.sectionTitle}>ワークフロー3: 継続的な品質改善ループ</h3>
            <div className={styles.diagramCard}>
              <div className={styles.diagramLabel}>
                FIG 15-2. Rules と Bugbot による品質フィードバックループ
              </div>
              <div className={styles.mermaid}>
                <MermaidDiagram chart={DIAG_LOOP} />
              </div>
            </div>
            <p className={styles.text}>
              このループの本質は「Agentが同じ間違いを繰り返さないようにする」ことです。ルールもBugbotの基準も、
              一度書けば以降のすべてのセッションに永続的に適用されるため、チームの暗黙知を資産として蓄積できます。
            </p>

            <div className={`${styles.callout} ${styles.tip}`}>
              <div className={styles.calloutTitle}>💡 まとめの指針</div>
              <p className={styles.calloutText}>
                Tab(単発の予測) → Inline Edit(局所的な即時編集) → Agent(自律的な複数ファイル編集) →
                Plan(大規模タスクの事前設計) → Cloud
                Agents(並列・非同期実行)という順に「介入の粒度」が変わっていきます。タスクの規模と不確実性に応じて、この中から適切な入口を選ぶことが上達の近道です。
              </p>
            </div>
          </section>

          {/* CHAPTER 16 */}
          <section className={styles.chapter} id="ch-16">
            <div className={styles.chapterKicker}>
              <span className={styles.chapterKickerLine}></span>CHAPTER 16 &middot; REFERENCES
            </div>
            <h2 className={styles.chapterTitle}>参考文献一覧 ― 全参照URL</h2>
            <p className={styles.text}>
              本ガイド作成にあたり参照した公式ドキュメント・公式ブログのURLを、章を横断してすべて掲載します(2026年7月1日時点でアクセス確認済み)。
            </p>

            <ol className={styles.refList}>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs">https://cursor.com/docs</Ext>
                <span className={styles.refDesc}>Cursor Docs トップページ</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/get-started/quickstart">
                  https://cursor.com/docs/get-started/quickstart
                </Ext>
                <span className={styles.refDesc}>Quickstart</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/getting-started/install">
                  https://cursor.com/help/getting-started/install
                </Ext>
                <span className={styles.refDesc}>Download and install Cursor</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/getting-started/first-project">
                  https://cursor.com/help/getting-started/first-project
                </Ext>
                <span className={styles.refDesc}>Your first project</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/ai-features/tab">
                  https://cursor.com/help/ai-features/tab
                </Ext>
                <span className={styles.refDesc}>Tab completion</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/tab/overview">
                  https://cursor.com/docs/tab/overview
                </Ext>
                <span className={styles.refDesc}>Tab completion overview</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/ai-features/agent">
                  https://cursor.com/help/ai-features/agent
                </Ext>
                <span className={styles.refDesc}>Agent mode</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/agent/overview">
                  https://cursor.com/docs/agent/overview
                </Ext>
                <span className={styles.refDesc}>Agent overview</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/agent/plan-mode">
                  https://cursor.com/docs/agent/plan-mode
                </Ext>
                <span className={styles.refDesc}>Plan Mode</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/blog/agent-best-practices">
                  https://cursor.com/blog/agent-best-practices
                </Ext>
                <span className={styles.refDesc}>Best practices for coding with agents</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/inline-edit/overview">
                  https://cursor.com/docs/inline-edit/overview
                </Ext>
                <span className={styles.refDesc}>Inline edit</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/rules">https://cursor.com/docs/rules</Ext>
                <span className={styles.refDesc}>Rules</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/rules.md">https://cursor.com/docs/rules.md</Ext>
                <span className={styles.refDesc}>Rules — 詳細仕様とFAQ</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/subagents">
                  https://cursor.com/docs/subagents
                </Ext>
                <span className={styles.refDesc}>Subagents</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/hooks">https://cursor.com/docs/hooks</Ext>
                <span className={styles.refDesc}>Hooks</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/changelog/2-5">https://cursor.com/changelog/2-5</Ext>
                <span className={styles.refDesc}>
                  Plugins, Sandbox Access Controls, and Async Subagents
                </span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/changelog/1-0">https://cursor.com/changelog/1-0</Ext>
                <span className={styles.refDesc}>
                  Bugbot, Background Agent, Memories 初出リリースノート
                </span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/mcp">https://cursor.com/docs/mcp</Ext>
                <span className={styles.refDesc}>Model Context Protocol (MCP)</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/mcp.md">https://cursor.com/docs/mcp.md</Ext>
                <span className={styles.refDesc}>MCP — 設定詳細・セキュリティガイドライン</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/context/mcp/install-links">
                  https://cursor.com/docs/context/mcp/install-links
                </Ext>
                <span className={styles.refDesc}>MCP Install Links</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/cli/mcp.md">
                  https://cursor.com/docs/cli/mcp.md
                </Ext>
                <span className={styles.refDesc}>MCP for CLI</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/models-and-pricing">
                  https://cursor.com/docs/models-and-pricing
                </Ext>
                <span className={styles.refDesc}>Models &amp; Pricing</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/ai-features/max-mode">
                  https://cursor.com/help/ai-features/max-mode
                </Ext>
                <span className={styles.refDesc}>Max Mode</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/account-and-billing/pricing">
                  https://cursor.com/help/account-and-billing/pricing
                </Ext>
                <span className={styles.refDesc}>Pricing and plans</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/models-and-usage/usage-limits">
                  https://cursor.com/help/models-and-usage/usage-limits
                </Ext>
                <span className={styles.refDesc}>Usage and limits</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/pricing">https://cursor.com/pricing</Ext>
                <span className={styles.refDesc}>Cursor Pricing(最新の公式料金ページ)</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/cloud-agent">
                  https://cursor.com/docs/cloud-agent
                </Ext>
                <span className={styles.refDesc}>Cloud Agents</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/cloud-agent/setup">
                  https://cursor.com/docs/cloud-agent/setup
                </Ext>
                <span className={styles.refDesc}>Cloud Environment Setup</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/help/ai-features/bugbot">
                  https://cursor.com/help/ai-features/bugbot
                </Ext>
                <span className={styles.refDesc}>Bugbot</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/bugbot">https://cursor.com/bugbot</Ext>
                <span className={styles.refDesc}>AI Code Review Built for Production — Bugbot</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/for/code-review">
                  https://cursor.com/for/code-review
                </Ext>
                <span className={styles.refDesc}>Reviewing Code with Cursor</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/blog/bugbot-autofix">
                  https://cursor.com/blog/bugbot-autofix
                </Ext>
                <span className={styles.refDesc}>
                  Closing the code review loop with Bugbot Autofix
                </span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/agent/security">
                  https://cursor.com/docs/agent/security
                </Ext>
                <span className={styles.refDesc}>Agent Security</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/reference/keyboard-shortcuts">
                  https://cursor.com/docs/reference/keyboard-shortcuts
                </Ext>
                <span className={styles.refDesc}>Keyboard Shortcuts</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/context/codebase-indexing">
                  https://cursor.com/docs/context/codebase-indexing
                </Ext>
                <span className={styles.refDesc}>Semantic &amp; Agentic Search</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/docs/cookbook/large-codebases">
                  https://cursor.com/docs/cookbook/large-codebases
                </Ext>
                <span className={styles.refDesc}>Understanding Your Codebase — Cursor Learn</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://cursor.com/blog/secure-codebase-indexing">
                  https://cursor.com/blog/secure-codebase-indexing
                </Ext>
                <span className={styles.refDesc}>Securely indexing large codebases</span>
              </li>
              <li className={styles.refListItem}>
                <Ext href="https://docs.cursor.com/en/context/@-symbols/overview">
                  https://docs.cursor.com/en/context/@-symbols/overview
                </Ext>
                <span className={styles.refDesc}>@ Symbols overview</span>
              </li>
            </ol>

            <div className={`${styles.callout} ${styles.warn}`} style={{ marginTop: "28px" }}>
              <div className={styles.calloutTitle}>⚠️ 免責事項</div>
              <p className={styles.calloutText}>
                Cursorは頻繁に機能更新・料金体系の見直しが行われる製品です。本ガイドは2026年7月1日時点の公式ドキュメントに基づいて作成されていますが、特に料金・Max
                Modeの課金条件・モデルラインナップについては、実際の利用前に必ず最新の公式ページをご確認ください。
              </p>
            </div>
          </section>
        </main>
      </div>

      <footer className={styles.pageFooter}>
        Cursor 完全ガイド &middot; 一次情報源: cursor.com/docs &middot; 作成日: 2026-07-01
        <br />
        本ドキュメントは教育目的の非公式ガイドであり、Anysphere Inc. / Cursor
        による公式資料ではありません。
      </footer>
    </>
  );
}
