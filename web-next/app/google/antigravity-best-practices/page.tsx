import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "Google Antigravity 完全ガイド:仕様駆動開発を支えるエコシステムのベストプラクティス | AI Model Cost Calculator",
  description:
    "Google Antigravity IDE・CLI の設計思想、アーキテクチャ、Rules (GEMINI.md)、Skills (SKILL.md)、Workflows、Artifacts、Permissions、MCP、Agent Manager まで、仕様駆動開発を支えるエコシステム全容を網羅。",
};

const MERMAID_TRADITIONAL_VS_AGENT = `flowchart LR
    subgraph Traditional["従来のIDEワークフロー"]
        A1["開発者"] --> A2["コードを直接編集"]
        A2 --> A3["実行・確認"]
        A3 --> A1
    end

    subgraph AgentFirst["Agent-Firstワークフロー"]
        B1["開発者<br/>(マネージャー)"] --> B2["Agent Manager<br/>経由で指示"]
        B2 --> B3["エージェントが<br/>計画・実行・検証"]
        B3 --> B4["Artifactsで<br/>結果を報告"]
        B4 --> B1
    end`;

const MERMAID_ECOSYSTEM = `flowchart TB
    subgraph Config["① 設定レイヤー"]
        A["GEMINI.md<br/>(Global Rules)"]
        B[".agents/rules<br/>(Workspace Rules)"]
        C["SKILL.md群<br/>(.agents/skills)"]
        D["Workflows<br/>(.md + /command)"]
    end

    subgraph Runtime["② 実行レイヤー"]
        E["Antigravity Agent"]
        F["MCP Servers"]
        G["Browser Subagent"]
        H["Terminal / Sandbox"]
    end

    subgraph Trust["③ 信頼レイヤー"]
        I["Artifacts<br/>Plan / Walkthrough /<br/>Screenshots / Recordings"]
    end

    J["開発者によるレビュー<br/>(Agent Manager)"]

    A --> E
    B --> E
    C -->|"関連タスク時にActivate"| E
    D -->|"/workflow-name で呼出"| E
    E --> F
    E --> G
    E --> H
    E --> I
    I --> J
    J -->|"承認 or フィードバック"| E`;

const MERMAID_PROGRESSIVE = `flowchart LR
    A["会話開始"] --> B["Discovery:<br/>利用可能なSkill一覧<br/>(name+description)を把握"]
    B --> C{"タスクに関連する<br/>Skillがあるか?"}
    C -->|"Yes"| D["Activation:<br/>該当SKILL.mdの<br/>全文を読込"]
    C -->|"No"| E["通常の推論で対応"]
    D --> F["Execution:<br/>指示に従いタスクを実行"]`;

const MERMAID_PLAN_LOOP = `flowchart TB
    A["ユーザーがゴールを入力"] --> B["Planning Mode:<br/>Implementation Plan生成"]
    B --> C{"Review Policy"}
    C -->|"承認が必要"| D["人間が承認 or<br/>インライン修正"]
    C -->|"Always Proceed"| E["即時実行"]
    D --> E
    E --> F["Execution:<br/>コード編集・コマンド実行"]
    F --> G["Verification:<br/>Walkthrough / Screenshots /<br/>Browser Recording生成"]
    G --> H["人間がArtifactsをレビュー"]
    H -->|"OK"| I["完了"]
    H -->|"修正指示"| B`;

const MERMAID_PARALLEL_AGENTS = `flowchart TB
    M["開発者(マネージャー)"] --> A1["Agent A:<br/>レガシー認証モジュールを<br/>リファクタリング"]
    M --> A2["Agent B:<br/>同モジュールの<br/>Jestテストを作成"]
    M --> A3["Agent C:<br/>バックグラウンドで<br/>ドキュメントを更新"]
    A1 --> R["Artifactsとして<br/>Agent Managerに集約"]
    A2 --> R
    A3 --> R
    R --> M`;

const MERMAID_DECISION_TREE = `flowchart TD
    A["新しく設定したいことがある"] --> B{"常に守ってほしい<br/>ルール・スタイルか?"}
    B -->|"Yes"| C["Rules(GEMINI.md /<br/>.agents/rules)に書く"]
    B -->|"No"| D{"特定タスクの<br/>専門知識・手順か?"}
    D -->|"Yes、かつ<br/>タスク発生時のみ必要"| E["Skill(SKILL.md)を作る"]
    D -->|"No"| F{"繰り返す一連の<br/>作業手順か?"}
    F -->|"Yes"| G["Workflowとして保存し<br/>/workflow-nameで呼出"]
    F -->|"No"| H["都度プロンプトで指示する"]`;

export default function AntigravityBestPracticesPage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div>
            <div className={styles.sidebarBrandTitle}>Google Antigravity 完全ガイド</div>
            <div className={styles.sidebarBrandSub}>仕様駆動開発・エコシステム</div>
          </div>
        </div>

        <div className={styles.navGroupLabel}>目次</div>
        <a href="#scope" className={styles.navLink} data-toc-link>
          対象範囲
        </a>
        <a href="#glossary" className={styles.navLink} data-toc-link>
          0. 用語集
        </a>
        <a href="#overview" className={styles.navLink} data-toc-link>
          1. Google Antigravity とは何か
        </a>
        <a href="#ecosystem" className={styles.navLink} data-toc-link>
          2. エコシステム全体像
        </a>
        <a href="#step1" className={styles.navLink} data-toc-link>
          3. Step 1:セットアップ
        </a>
        <a href="#step2" className={styles.navLink} data-toc-link>
          4. Step 2:GEMINI.md
        </a>
        <a href="#step3" className={styles.navLink} data-toc-link>
          5. Step 3:SKILL.md
        </a>
        <a href="#step4" className={styles.navLink} data-toc-link>
          6. Step 4:Workflows
        </a>
        <a href="#step5" className={styles.navLink} data-toc-link>
          7. Step 5:Artifacts
        </a>
        <a href="#step6" className={styles.navLink} data-toc-link>
          8. Step 6:Permissions & Sandbox
        </a>
        <a href="#step7" className={styles.navLink} data-toc-link>
          9. Step 7:MCP
        </a>
        <a href="#step8" className={styles.navLink} data-toc-link>
          10. Step 8:Agent Manager
        </a>
        <a href="#summary" className={styles.navLink} data-toc-link>
          11. 総まとめ
        </a>
        <a href="#conclusion" className={styles.navLink} data-toc-link>
          12. まとめ
        </a>
        <a href="#sources" className={styles.navLink} data-toc-link>
          13. 参考文献・出典
        </a>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerBadge}>AI仕様駆動開発 ― Antigravityエコシステム完全ガイド</div>
          <h1 className={styles.title}>
            Google Antigravity 完全ガイド:仕様駆動開発を支えるエコシステムのベストプラクティス
          </h1>
          <div className={styles.subtitle}>
            <span>対象読者: AI駆動開発ツールに初めて触れるエンジニアから、既存のAI IDE(Cursor、Claude Code、Windsurf等)経験者まで</span>
            <br />
            <span>最終更新: 2026年7月27日時点の公式ドキュメント・国際的な開発者の一次情報をもとに作成</span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>🗺️</div>
              <div className={styles.statCardValue}>15</div>
              <div className={styles.statCardLabel}>主要セクション</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>📊</div>
              <div className={styles.statCardValue}>6図</div>
              <div className={styles.statCardLabel}>Mermaidアーキテクチャ図</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>⚠️</div>
              <div className={styles.statCardValue}>10選</div>
              <div className={styles.statCardLabel}>Do/Don't・アンチパターン</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardIcon}>🔗</div>
              <div className={styles.statCardValue}>20+</div>
              <div className={styles.statCardLabel}>公式参照ソース</div>
            </div>
          </div>
        </header>

        <section id="scope" className={styles.section}>
          <h2>この記事で扱う範囲</h2>
          <p>
            Google Antigravity は、Google が2025年11月18日(Gemini 3 Pro と同時)に発表した「エージェントファースト」の開発プラットフォームです。単なるコード補完ツールではなく、<strong>GEMINI.md(Rules)・SKILL.md(Skills)・Workflows・Artifacts</strong> という4つの「仕様駆動」コンポーネントを中心に、AIエージェントに継続的なコンテキストと再現可能な手順を与える設計になっています。
          </p>
          <p>
            本ガイドは、この4コンポーネントを軸にしながら、周辺の Permissions(権限)・MCP・Agent Manager(サブエージェント運用)まで含めた<strong>Antigravityエコシステム全体</strong>を、ステップバイステップで解説します。
          </p>
        </section>

        <section id="glossary" className={styles.section}>
          <h2>0. 用語集(はじめにここだけ読めばOK)</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>用語</th>
                  <th>意味</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>GEMINI.md</strong></td>
                  <td>
                    エージェントの「脳」にあたるグローバル設定ファイル。<code>~/.gemini/GEMINI.md</code> に置き、全ワークスペース共通のRuleとして適用される
                  </td>
                </tr>
                <tr>
                  <td><strong>Rules</strong></td>
                  <td>
                    エージェントに恒久的な制約・スタイルを与える仕組み。GEMINI.md(グローバル)と <code>.agents/rules</code>(ワークスペース)の2階層がある
                  </td>
                </tr>
                <tr>
                  <td><strong>SKILL.md</strong></td>
                  <td>
                    特定タスクの手順・ベストプラクティスを記述した「専門知識パッケージ」。フォルダ単位で管理され、Agent Skills というオープン標準に準拠する
                  </td>
                </tr>
                <tr>
                  <td><strong>Workflows</strong></td>
                  <td>
                    「デプロイする」「PRコメントに対応する」といった繰り返し作業をMarkdownの手順書として定義し、<code>/workflow-name</code> で呼び出す仕組み
                  </td>
                </tr>
                <tr>
                  <td><strong>Artifacts</strong></td>
                  <td>
                    エージェントが作業中・完了後に生成する成果物(Implementation Plan、Walkthrough、Screenshots、Browser Recordings)。「信頼のレイヤー」として人間のレビューを支える
                  </td>
                </tr>
                <tr>
                  <td><strong>Agent Manager</strong></td>
                  <td>
                    複数のエージェントを非同期・並列に生成・監視・レビューするための専用インターフェース(Manager Surface)
                  </td>
                </tr>
                <tr>
                  <td><strong>MCP</strong></td>
                  <td>
                    Model Context Protocol。外部ツール(DB、GitHub、Notion等)にエージェントが安全に接続するためのオープン標準
                  </td>
                </tr>
                <tr>
                  <td><strong>Permissions</strong></td>
                  <td>
                    <code>action(target)</code> 形式でファイル読み書き・コマンド実行・URL閲覧などを Deny/Ask/Allow に振り分ける権限エンジン
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="overview" className={styles.section}>
          <h2>1. Google Antigravity とは何か</h2>
          <h3>1.1 誕生の背景</h3>
          <p>
            2025年7月、Windsurf(旧Codeium)買収交渉が破談になった後、Google は Windsurf の CEO であった Varun Mohan や共同創業者 Douglas Chen を含む中核チームを迎え入れました。その4か月後の2025年11月18日、Gemini 3 Pro の発表に合わせて Antigravity が公開されています。アーキテクチャ的には VS Code(OSS版)をベースにした Electron アプリであり、内部には Windsurf のエージェントシステム「Cascade」に由来するコードが残っているとの分析も出ています。
          </p>
          <p>
            著名なAI関連ブロガーである Simon Willison は公開直後、「一見するとまた別のVS CodeフォークのCursorクローンに見えるが、よく見るとかなり興味深い」と評しました。Antigravity 独自の概念として彼が特に注目したのが、後述する <strong>Artifacts</strong>(Claude の Artifacts 機能とは名前が同じだが全くの別物)です。
          </p>
          <h3>1.2 3つのサーフェス</h3>
          <p>
            Google公式ブログによれば、Antigravity は次の3つの操作面(サーフェス)を統合したプラットフォームです。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>サーフェス</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Editor View</strong></td>
                  <td>
                    Tab補完・インラインコマンドを備えた、従来型のAI支援IDE。手を動かしたいときに使う
                  </td>
                </tr>
                <tr>
                  <td><strong>Manager Surface(Agent Manager)</strong></td>
                  <td>
                    複数のエージェントを異なるワークスペースで非同期に生成・orchestrate・観察する専用インターフェース
                  </td>
                </tr>
                <tr>
                  <td><strong>Browser(Chrome拡張)</strong></td>
                  <td>
                    エージェントが実際にブラウザを操作し、UIをテスト・検証するための面。Playwright MCP に近い役割を果たす
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>1.3 製品ラインナップ</h3>
          <p>2026年7月時点で、Antigravity は用途別に複数の製品として提供されています。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>製品</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Antigravity 2.0</strong></td>
                  <td>
                    フル機能のデスクトップアプリ。Editor View + Manager Surface + Browser を統合
                  </td>
                </tr>
                <tr>
                  <td><strong>Antigravity CLI</strong></td>
                  <td>
                    ターミナルネイティブの軽量インターフェース。キーボード駆動でArtifactsをレビュー
                  </td>
                </tr>
                <tr>
                  <td><strong>Antigravity IDE</strong></td>
                  <td>エディタ機能に寄せたコンポーネント(Tab補完、Side Panel、Review Changes等)</td>
                </tr>
                <tr>
                  <td><strong>Antigravity SDK</strong></td>
                  <td>
                    Python から Agent を直接組み込むためのプログラマブルSDK。MCP・Web検索ツールを統合可能
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            公開当初は Gemini 3 Pro に加えて Anthropic の Claude Sonnet 4.5、OpenAI の GPT-OSS もサポートされており、モデルを選択できる「model optionality」が特徴として掲げられています。
          </p>
          <h3>1.4 従来のIDEとの発想の違い</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_TRADITIONAL_VS_AGENT} />
          </div>
          <p>
            Google はこれを「manager mindset」と呼んでいます。開発者はコードを1行ずつ書く代わりに、タスクを割り当て(assign)、進捗を監視し(monitor)、成果物をレビューする(review)役割にシフトします。
          </p>
        </section>

        <section id="ecosystem" className={styles.section}>
          <h2>2. エコシステム全体像</h2>
          <p>
            GEMINI.md・SKILL.md・Rules・Workflows・Artifacts は、それぞれ役割の異なる層として組み合わさっています。まず全体の関係を図で押さえましょう。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_ECOSYSTEM} />
          </div>
          <h3>2.1 4コンポーネントの役割比較</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>コンポーネント</th>
                  <th>主な役割</th>
                  <th>形式</th>
                  <th>適用タイミング</th>
                  <th>主な保存場所</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rules(GEMINI.md含む)</strong></td>
                  <td>プロンプトレベルの恒久的な制約・スタイルガイド</td>
                  <td>Markdown(1ファイルあたり最大12,000文字)</td>
                  <td>常時 or 条件付きで自動適用</td>
                  <td>
                    <code>~/.gemini/GEMINI.md</code>(Global)/ <code>.agents/rules</code>(Workspace)
                  </td>
                </tr>
                <tr>
                  <td><strong>Skills(SKILL.md)</strong></td>
                  <td>特定タスクの専門知識・手順(オンデマンド展開)</td>
                  <td>フォルダ + <code>SKILL.md</code>(YAMLフロントマター)</td>
                  <td>関連タスクを検知した時のみ全文読込</td>
                  <td>
                    <code>.agents/skills/&lt;name&gt;/</code>(Workspace)/ <code>~/.gemini/config/skills/&lt;name&gt;/</code>(Global)
                  </td>
                </tr>
                <tr>
                  <td><strong>Workflows</strong></td>
                  <td>反復作業の「手順書」。トラジェクトリレベルの一連の行動を規定</td>
                  <td>Markdown(タイトル・説明・ステップ、最大12,000文字)</td>
                  <td><code>/workflow-name</code> で明示的に呼出</td>
                  <td>Customizationsパネルから Global / Workspace で作成</td>
                </tr>
                <tr>
                  <td><strong>Artifacts</strong></td>
                  <td>エージェントの思考・作業を人間が検証可能な形にした成果物</td>
                  <td>
                    Markdown / 画像 / 動画(Plan, Walkthrough, Screenshots, Browser Recordings)
                  </td>
                  <td>Planningモード中、および実行完了時に自動生成</td>
                  <td>会話内(Agent Manager / CLIレビューパネル)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Rules は「常にモデルにどう振る舞ってほしいか」を定義するのに対し、Workflows は「特定の一連のタスクをどう進めるか」を定義する、という使い分けが公式ドキュメントで明記されています。
          </p>
        </section>

        <section id="step1" className={styles.section}>
          <h2>3. Step 1:セットアップ ― インストールとプロジェクト作成</h2>
          <h3>3.1 動作環境</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>OS</th>
                  <th>要件</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>macOS</td>
                  <td>
                    Appleのセキュリティアップデート対象バージョン(概ね最新+過去2世代)。最低 macOS 12(Monterey)。x86は非対応
                  </td>
                </tr>
                <tr>
                  <td>Windows</td>
                  <td>Windows 10(64bit)</td>
                </tr>
                <tr>
                  <td>Linux</td>
                  <td>
                    glibc &gt;= 2.28, glibcxx &gt;= 3.4.25(Ubuntu 20 / Debian 10 / Fedora 36 / RHEL 8相当)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <code>antigravity.google/download</code> からダウンロードし、インストーラーの指示に従います。既存バージョンがある場合は「Replace」を選択します。
          </p>
          <h3>3.2 プロジェクト作成の手順</h3>
          <ol>
            <li>左サイドバーの「フォルダ+」アイコンをクリック</li>
            <li>「New Project」を選択</li>
            <li>
              「Add Folder」でローカルフォルダまたはGitリポジトリを1つ以上関連付ける(複数フォルダを追加するとクロスリポジトリのコンテキストが得られる)
            </li>
            <li>「Create」をクリック</li>
            <li>(任意)プロジェクトごとの設定・セキュリティポリシーを構成する</li>
          </ol>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>💡</div>
            <div>
              <p>
                <strong>ポイント</strong>: Agentは「Project」の境界内でしかファイルにアクセスできません。つまりProjectの設計そのものが最初のセキュリティ境界になります。
              </p>
            </div>
          </div>
          <h3>3.3 エージェント起動モード</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モード</th>
                  <th>特徴</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Local Mode</strong></td>
                  <td>アクティブなフォルダ内で直接作業する</td>
                </tr>
                <tr>
                  <td><strong>New Worktree Mode</strong></td>
                  <td>
                    隔離されたGit worktree内で作業する(mainブランチを汚さずに試行錯誤したい場合に有効)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>3.4 覚えておきたいスラッシュコマンド</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/goal</code></td>
                  <td>中間確認なしで、指定タスクが完全に終わるまで実行し続ける</td>
                </tr>
                <tr>
                  <td><code>/grill-me</code></td>
                  <td>実装前にエージェントから質問を受け、計画の細部をすり合わせる</td>
                </tr>
                <tr>
                  <td><code>/schedule</code></td>
                  <td>一度きり、または定期実行のタイマータスクとして指示を予約する</td>
                </tr>
                <tr>
                  <td><code>/browser</code></td>
                  <td>ブラウザ操作を明示的に許可する(Chromeとデバッグセッションへの許可が必要)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            初学者はまず <code>/grill-me</code> を使い、いきなり大きなタスクを丸投げしないことをおすすめします。実装計画(Plan Artifact)の精度が大きく変わります。
          </p>
        </section>

        <section id="step2" className={styles.section}>
          <h2>4. Step 2:GEMINI.md でエージェントの「脳」を設計する</h2>
          <h3>4.1 Rules の2階層</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>種別</th>
                  <th>保存場所</th>
                  <th>適用範囲</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Global Rules(GEMINI.md)</strong></td>
                  <td><code>~/.gemini/GEMINI.md</code></td>
                  <td>すべてのワークスペースに適用</td>
                </tr>
                <tr>
                  <td><strong>Workspace Rules</strong></td>
                  <td>
                    <code>&lt;workspace-root&gt;/.agents/rules/</code>(旧 <code>.agent/rules</code> も後方互換あり)
                  </td>
                  <td>そのワークスペース内のみ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Rule自体は単なるMarkdownファイルで、スタック・スタイル・制約を自由に書けます。ただし<strong>1ファイルあたり最大12,000文字</strong>という制限があるため、詰め込みすぎず、後述の <code>@</code> メンションで分割管理するのがコツです。
          </p>
          <h3>4.2 Ruleのアクティベーションモード</h3>
          <p>Workspace Ruleは、以下の4種類のうちどれで有効化するかを選べます。</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>モード</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Manual</strong></td>
                  <td>Agentの入力欄で <code>@ルール名</code> と明示的にメンションした時だけ適用</td>
                </tr>
                <tr>
                  <td><strong>Always On</strong></td>
                  <td>常に適用</td>
                </tr>
                <tr>
                  <td><strong>Model Decision</strong></td>
                  <td>Ruleに書かれた自然言語の説明を見て、モデル自身が「今適用すべきか」を判断</td>
                </tr>
                <tr>
                  <td><strong>Glob</strong></td>
                  <td>
                    指定したglobパターン(例:<code>*.js</code>、<code>src/**/*.ts</code>)にマッチするファイルを扱う時のみ適用
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            初心者ほど「全部 Always On」にしがちですが、コンテキストを圧迫し、指示追従性(instruction following)が落ちる原因になります。コーディング規約は Glob、プロジェクト全体の方針は Always On、といった使い分けが定石です。
          </p>
          <h3>4.3 <code>@</code> メンションによるファイル参照</h3>
          <p>Ruleファイル内で <code>@filename</code> と書くと他ファイルを参照できます。</p>
          <ul>
            <li>相対パス:Ruleファイルの場所からの相対パスとして解決</li>
            <li>
              絶対パス:まず真の絶対パスとして解決を試み、存在しなければ <code>workspace/path/to/file.md</code> として再解決
            </li>
          </ul>
          <p>
            これにより、GEMINI.mdを「目次」として薄く保ち、詳細は <code>@architecture.md</code> や <code>@testing.md</code> のような専門ファイルに逃がす設計が可能になります。
          </p>
          <h3>4.4 GEMINI.md サンプル</h3>
          <div className={styles.codeLabel}>GEMINI.md</div>
          <pre className={styles.codeBlock}><code>{`# GEMINI.md — グローバルルール

## 私についてのコンテキスト
私はフルスタックのFinanceアプリを開発するエンジニアです。
フロントエンドはReact、バックエンドはPythonを使います。

## コーディング規約
- コミットメッセージは Conventional Commits に従う
- すべての新規APIエンドポイントにはユニットテストを追加する
- セキュリティ関連の変更は必ず実装計画(Plan)を提示してから着手する

## 参照
@security.md
@testing-strategy.md`}</code></pre>
          <h3>4.5 GEMINI.md ベストプラクティス</h3>
          <ul>
            <li>
              <strong>役割(ペルソナ)とゴールを最初に明記する</strong>:「あなたはReactフロントエンドとPythonバックエンドに強いフルスタックエンジニアです」といった一文が、以降のコード生成のトーンを決める
            </li>
            <li>
              <strong>セキュリティプロトコルなど絶対に譲れない制約を明文化する</strong>:「本番DBへの直接アクセス禁止」のような一文は、後述するPermissionsと二重に効かせると安心
            </li>
            <li>
              <strong>新しいコンポーネントを導入するたびに更新する</strong>:あるコミュニティ投稿では、機能実装完了時のコードレビューフローと連動してGEMINI.mdを半自動更新する運用が紹介されています
            </li>
            <li>
              <strong>GEMINI.md / Skills / <code>\doc</code> のようなプロジェクト固有ドキュメントの役割分担を最初に決めておく</strong>:「何をどこに書くか」が曖昧なまま育てると、後で肥大化したGEMINI.mdの棚卸しが必要になります
            </li>
          </ul>
        </section>

        <section id="step3" className={styles.section}>
          <h2>5. Step 3:SKILL.md でエージェントに専門知識を持たせる</h2>
          <h3>5.1 Skills とは何か</h3>
          <p>
            Skills は <a href="https://agentskills.io/home" target="_blank" rel="noopener noreferrer">Agent Skills</a> というオープン標準に基づく仕組みで、「特定タスクへの取り組み方」をパッケージ化したものです。1つのSkillフォルダには次のものを含められます。
          </p>
          <ul>
            <li>特定タスクへの取り組み方の<strong>指示</strong></li>
            <li>従うべき<strong>ベストプラクティス・コーディング規約</strong></li>
            <li>エージェントが利用できる<strong>任意のスクリプトやリソース</strong></li>
          </ul>
          <p>
            ライブラリ全体のドキュメントを毎回モデルに読み込ませる代わりに、Skillsは「必要な時にだけ展開されるオンデマンドの専門知識」として働きます。
          </p>
          <h3>5.2 保存場所</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>場所</th>
                  <th>スコープ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>&lt;workspace-root&gt;/.agents/skills/&lt;skill-folder&gt;/</code></td>
                  <td>ワークスペース固有</td>
                </tr>
                <tr>
                  <td><code>~/.gemini/config/skills/&lt;skill-folder&gt;/</code></td>
                  <td>グローバル(全ワークスペース共通)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Workspace Skillsはチーム固有のデプロイ手順やテスト規約に、Global Skillsは個人の汎用ユーティリティに向いています。なお <code>.agent/skills</code>(単数形)という旧パスも後方互換のため残っています。
          </p>
          <h3>5.3 SKILL.md の作り方</h3>
          <div className={styles.codeLabel}>Folder Structure</div>
          <pre className={styles.codeBlock}><code>{`.agents/skills/
└─ my-skill/
    └─ SKILL.md`}</code></pre>
          <div className={styles.codeLabel}>SKILL.md Template</div>
          <pre className={styles.codeBlock}><code>{`---
name: my-skill
description: 特定タスクを支援する。XやYを行う必要がある時に使用する。
---

# My Skill

エージェントへの詳細な指示をここに書く。

## このSkillを使うタイミング

- こういう場合に使う
- こういう場面で役立つ

## 使い方

エージェントが従うべきステップバイステップのガイダンス、規約、パターン。`}</code></pre>
          <h3>5.4 フロントマターの必須・任意フィールド</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>フィールド</th>
                  <th>必須</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>name</code></td>
                  <td>いいえ</td>
                  <td>
                    Skillの一意な識別子(小文字・ハイフン区切り)。省略時はフォルダ名がそのまま使われる
                  </td>
                </tr>
                <tr>
                  <td><code>description</code></td>
                  <td>はい</td>
                  <td>
                    Skillが何をするか・いつ使うべきかの明確な説明。エージェントが適用可否を判断する材料になる
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            公式ドキュメントは、<code>description</code> を<strong>三人称で、かつエージェントが認識しやすいキーワードを含めて</strong>書くことを推奨しています。例:「pytestの規約に従ってPythonコードのユニットテストを生成する」。
          </p>
          <p>
            コミュニティの実践例では、これに加えて次のような拡張フィールドを独自に運用しているケースも見られます(これは公式仕様ではなく、あくまで一部開発者の運用パターンです)。
          </p>
          <div className={styles.codeLabel}>Advanced SKILL.md Frontmatter</div>
          <pre className={styles.codeBlock}><code>{`---
name: meta-ads-management
description: Meta Ads Marketing API経由でキャンペーンを管理する
version: 2.0.0
triggers:
  - facebook ads
  - meta ads
  - campaign
access_level: restricted
requires_approval: true    # true の場合、実行前に必ず人間の承認を挟む
turbo_safe: false          # false の場合、自動実行(turbo)モードから除外
model_preference: gemini-3-pro
---`}</code></pre>
          <p>
            金融操作やデータ破壊的な操作を伴うSkillには、こうした「承認必須」フラグを立てておくと安全性が高まります。
          </p>
          <h3>5.5 Skillフォルダの構造</h3>
          <p><code>SKILL.md</code> だけが必須ですが、以下のような補助リソースも同梱できます。</p>
          <div className={styles.codeLabel}>Full Skill Structure</div>
          <pre className={styles.codeBlock}><code>{`.agents/skills/my-skill/
├─ SKILL.md       # メイン指示(必須)
├─ scripts/       # 補助スクリプト(任意)
├─ examples/      # 参照実装(任意)
└─ resources/     # テンプレートなど(任意)`}</code></pre>
          <h3>5.6 エージェントの利用フロー(Progressive Disclosure)</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_PROGRESSIVE} />
          </div>
          <p>
            ユーザーが明示的に「このSkillを使って」と指定することも可能ですが、基本的にはエージェントが <code>description</code> を見て自律的に判断します。
          </p>
          <h3>5.7 Skills ベストプラクティス</h3>
          <ul>
            <li>
              <strong>1つのSkillは1つのことに専念させる</strong>:「何でも屋」のSkillではなく、タスクごとに分割する
            </li>
            <li>
              <strong>descriptionを明確に書く</strong>:これがトリガー精度を左右する唯一の情報源
            </li>
            <li>
              <strong>スクリプトは"ブラックボックス"として扱わせる</strong>:スクリプトを含めるなら、まず <code>--help</code> で使い方を確認させ、ソース全文を読ませない。これによりコンテキストをタスクに集中させられる
            </li>
            <li>
              <strong>複雑なSkillには判断木(decision tree)を入れる</strong>:状況に応じてどのアプローチを取るべきかをエージェントが選べるようにする
            </li>
            <li>
              <strong>権限とサンドボックスを意識する</strong>:エージェントは基本的にログインユーザーの権限で動作するため、雑に書かれたSkillがファイル削除や環境変数の漏えいを引き起こしうるという指摘があります。Skillに強い権限を持たせる場合ほど、レビューを丁寧に行いましょう
            </li>
          </ul>
        </section>

        <section id="step4" className={styles.section}>
          <h2>6. Step 4:Workflows で再現可能な作業手順を自動化する</h2>
          <h3>6.1 RulesとWorkflowsの違い</h3>
          <p>公式ドキュメントは両者の違いを次のように整理しています。</p>
          <ul>
            <li>
              <strong>Rules</strong>:プロンプトレベルで、恒期的かつ再利用可能なコンテキストを与える
            </li>
            <li>
              <strong>Workflows</strong>:トラジェクトリ(一連の行動の軌跡)レベルで、相互に関連したタスク・行動の構造化されたステップ列を与える
            </li>
          </ul>
          <p>
            つまりRulesは「常にどう振る舞うか」、Workflowsは「この作業を頼まれたら、この順番で進めてほしい」という違いです。
          </p>
          <h3>6.2 作成手順</h3>
          <ol>
            <li>エディタのAgentパネル上部の「...」ドロップダウンから「Customizations」パネルを開く</li>
            <li>「Workflows」パネルに移動</li>
            <li>「+ Global」(全ワークスペース共通)または「+ Workspace」(そのワークスペース限定)をクリック</li>
          </ol>
          <p>
            Workflowファイルも<strong>1ファイルあたり最大12,000文字</strong>まで。タイトル・説明・具体的な指示を含むステップ列で構成します。
          </p>
          <h3>6.3 呼び出し方とチェイン</h3>
          <p>
            Agentの入力欄で <code>/workflow-name</code> と打つだけで実行されます。Workflow同士を連鎖させることも可能です。
          </p>
          <div className={styles.codeLabel}>/ship-feature Workflow Example</div>
          <pre className={styles.codeBlock}><code>{`# /ship-feature

## 説明
機能開発が完了した際の一連のリリース作業を自動化する。

## ステップ
1. \`/run-tests\` を呼び出してテストスイートを実行する
2. すべてのテストが通過したら、変更内容のCHANGELOGエントリを作成する
3. \`/open-pr\` を呼び出してPull Requestを作成する
4. PR説明文に、実施したテストの概要を含める`}</code></pre>
          <p>
            上記の <code>/run-tests</code> や <code>/open-pr</code> のように、Workflow内から別のWorkflowを「呼び出してください」と自然文で指示するだけで連携できます。
          </p>
          <h3>6.4 Agentにワークフローを生成させる</h3>
          <p>
            これは実務上かなり便利な機能です。エージェントと<strong>手作業で</strong>一連の作業を進めた後、「今やった手順をWorkflowとして保存して」と頼むと、会話履歴をもとにWorkflowファイルを自動生成してくれます。最初から完璧なWorkflowを書こうとせず、まず1回手動で実行してから "昇格" させる、という進め方が現実的です。
          </p>
          <h3>6.5 Workflows ベストプラクティス</h3>
          <ul>
            <li>
              デプロイ作業やPRレビュー対応など、<strong>チームで頻繁に繰り返す定型作業</strong>から着手する
            </li>
            <li>
              ステップは「何をするか」だけでなく「なぜそうするか」を一言添えると、エージェントの逸脱を防げる
            </li>
            <li>
              複雑な一連の作業は、1つの巨大なWorkflowにせず、<code>/run-tests</code> のような小さな単位に分割してチェインする
            </li>
            <li>
              Skillsが「知識」、Workflowsが「手順」という役割分担を意識し、同じ内容を両方に重複して書かない
            </li>
          </ul>
        </section>

        <section id="step5" className={styles.section}>
          <h2>7. Step 5:Artifacts ―「信頼のレイヤー」を使いこなす</h2>
          <h3>7.1 Artifactsとは何か</h3>
          <p>
            <strong>Artifact</strong>は、エージェントがタスクを遂行し、その進捗・思考を人間に伝えるために生成する構造化された成果物です。リッチなMarkdown形式の計画(Implementation Plan)、コード差分、アーキテクチャ図、画像、ブラウザ録画などが含まれます。
          </p>
          <p>
            Google Developers Blogは、これを「ログの代わりにArtifactsで検証する(Verify with Artifacts, not logs)」という言葉で説明しています。生の膨大なツール呼び出しログを1つずつ追う代わりに、要所要所でArtifactsという高レベルの成果物をレビューすればよい、という設計思想です。
          </p>
          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <div className={styles.calloutIcon}>⚠️</div>
            <div>
              <p>
                <strong>注意</strong>: Antigravityの「Artifacts」は、Claudeの「Artifacts」機能とは名前が同じだけで、コンセプトは異なります(Simon Willisonも明確に指摘している点です)。Antigravityの場合は主に「エージェントが自動生成する、実装計画・作業報告のMarkdown文書群」を指します。
              </p>
            </div>
          </div>
          <h3>7.2 Artifactsの4種類</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Artifact</th>
                  <th>生成タイミング</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Plan(Implementation Plan)</strong></td>
                  <td>Planningモード中、実行着手前</td>
                  <td>対象ファイル、必要な依存関係、ロジックの上書き方針などを列挙した計画書</td>
                </tr>
                <tr>
                  <td><strong>Walkthrough</strong></td>
                  <td>実行完了後</td>
                  <td>何を行ったかの作業報告</td>
                </tr>
                <tr>
                  <td><strong>Screenshots</strong></td>
                  <td>UI変更・デバッグ時</td>
                  <td>ブラウザ上でのビジュアルな検証結果</td>
                </tr>
                <tr>
                  <td><strong>Browser Recordings</strong></td>
                  <td>ブラウザ操作を伴うタスク</td>
                  <td>エージェントがUIを操作する様子の録画</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>7.3 Plan → Execute → Verify のループ</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_PLAN_LOOP} />
          </div>
          <h3>7.4 Review Policy(レビューポリシー)</h3>
          <p>
            Artifactsには対応する Review Policy が設定でき、"Always Proceed"(常にエージェント任せ)から"Agent Decides to Request Review"(常に人間の確認を求める)まで、リスク許容度に応じて調整できます。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>ポリシー(概念)</th>
                  <th>挙動</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Always Proceed寄り</td>
                  <td>エージェントが確認なしで進む。信頼度が高いタスク・チームに向く</td>
                </tr>
                <tr>
                  <td>Agent Decides to Request Review寄り</td>
                  <td>
                    エージェントが重要な判断のたびに立ち止まり、確認を求める。新規プロジェクトや高リスク操作に向く
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            計画(Plan)の段階に不備があれば、エージェントに大量のコードを書かせる前にその場で修正させるのが鉄則です。あるコミュニティの上級者向け解説では「Plan Artifactを"厳しく尋問"せよ。承認を急いでコーディング段階に進むのが初心者の典型的な失敗パターンだ」と強調されています。気に入らないライブラリが計画に含まれていれば、その場で拒否(veto)すべきという指摘も参考になります。
          </p>
          <h3>7.5 ブラウザSubagentとAllowlist</h3>
          <p>
            Antigravityはエージェント管理下の隔離ブラウザ(Chrome)を操作でき、通常のブラウジングとは分離されています。デフォルトのallowlistは<code>localhost</code>のみで、allowlist外のURLへ遷移しようとするとプロンプトが表示され、「常に許可」を選ぶとそのサイトがリストに追加される、という安全側デフォルトの設計です。
          </p>
          <h3>7.6 Artifacts ベストプラクティス</h3>
          <ul>
            <li>
              <strong>Planを読まずに承認しない</strong>:コードが書かれる前に、対象ファイル・依存関係・設計判断を確認する
            </li>
            <li>
              <strong>長い会話を1つのウィンドウに溜め込まない</strong>:コンテキストが肥大化すると、高性能なモデルでも応答の質が落ちる傾向がある。適度に会話を区切り、Artifactsを積み重ねる運用にする
            </li>
            <li>
              <strong>Review Policyはプロジェクトの成熟度に合わせて調整する</strong>:立ち上げ初期は厳しめ(Ask寄り)、信頼が積み上がったタスクは緩め、という段階的な運用が推奨されます
            </li>
            <li>
              <strong>Walkthrough・Screenshotsはコードの差分と同じ重みで読む</strong>:「読むべきものはコード差分ではなくArtifacts」という発想の転換が必要
            </li>
          </ul>
        </section>

        <section id="step6" className={styles.section}>
          <h2>8. Step 6:Permissions & Sandbox ― 自律性と安全性のバランス設計</h2>
          <h3>8.1 permission resourceの基本構造</h3>
          <p>
            Antigravityの権限エンジンは、すべての機微な操作を <code>action(target)</code> という形式の<strong>permission resource</strong>として表現します。
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>リスト</th>
                  <th>挙動</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Deny</strong></td>
                  <td>即座にブロックする</td>
                </tr>
                <tr>
                  <td><strong>Ask</strong></td>
                  <td>明示的な承認をエージェントが求めて一時停止する</td>
                </tr>
                <tr>
                  <td><strong>Allow</strong></td>
                  <td>確認なしで自動承認される</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <div className={styles.calloutIcon}>💡</div>
            <div>
              <p>
                <strong>優先順位ルール</strong>: 競合するルールは必ず <strong>Deny &gt; Ask &gt; Allow</strong> の順で評価されます。例えば <code>command(*)</code> をAskに、<code>command(git)</code> をAllowに設定した場合でも、Askが優先され、すべてのコマンドで確認が入ります。
              </p>
            </div>
          </div>
          <h3>8.2 サポートされているアクション</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>アクション</th>
                  <th>ターゲット形式</th>
                  <th>マッチング挙動</th>
                  <th>デフォルト</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>read_file</code></td>
                  <td><code>read_file(/path)</code> 等</td>
                  <td>絶対パスまたはワークスペース相対パスにマッチ。配下を再帰的に許可</td>
                  <td>Ask(ワークスペース内は自動許可)</td>
                </tr>
                <tr>
                  <td><code>write_file</code></td>
                  <td><code>write_file(/path)</code> 等</td>
                  <td>同上。同じパスへの<code>read_file</code>も暗黙的に付与</td>
                  <td>Ask(ワークスペース内は自動許可)</td>
                </tr>
                <tr>
                  <td><code>read_url</code></td>
                  <td><code>read_url(domain)</code> 等</td>
                  <td>ホスト名・サブドメインにマッチ(パスは無視)</td>
                  <td>Ask</td>
                </tr>
                <tr>
                  <td><code>execute_url</code></td>
                  <td><code>execute_url(domain)</code> 等</td>
                  <td>ブラウザ上でのクリック・入力等のUI操作</td>
                  <td>Ask</td>
                </tr>
                <tr>
                  <td><code>command</code></td>
                  <td><code>command(prefix)</code> 等</td>
                  <td>空白区切りのトークンごとに正規表現として評価</td>
                  <td>Ask</td>
                </tr>
                <tr>
                  <td><code>unsandboxed</code></td>
                  <td><code>unsandboxed(prefix)</code> 等</td>
                  <td>サンドボックス外でコマンドを実行する権限</td>
                  <td>Ask</td>
                </tr>
                <tr>
                  <td><code>mcp</code></td>
                  <td><code>mcp(server/tool)</code> 等</td>
                  <td>特定MCPツール、または特定サーバー全体にマッチ</td>
                  <td>Ask</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>8.3 暗黙のルール</h3>
          <ul>
            <li>
              <strong>Write は Read を含意する</strong>:あるパスへの <code>write_file</code> を許可すると、同じパスへの <code>read_file</code> も自動的に付与される
            </li>
            <li>
              <strong>Read拒否 は Write拒否 を含意する</strong>:あるパスの <code>read_file</code> を拒否すると、そのパスへの <code>write_file</code> も即座にブロックされる
            </li>
          </ul>
          <h3>8.4 設定例</h3>
          <div className={styles.codeLabel}>Allow List (確認なしで自動承認)</div>
          <pre className={styles.codeBlock}><code>{`command(git)                       # 標準的なgitコマンド
command(npm run (build|lint|test)) # 安全なnpmスクリプトを正規表現で許可
unsandboxed(git push)              # サンドボックス外でのgit pushを許可
write_file(src/)                   # src/配下の編集を許可
read_url(google.com)               # Googleのサブドメインの取得を許可
mcp(linter/*)                      # linter MCPの全ツールを許可`}</code></pre>

          <div className={styles.codeLabel}>Deny List (恒久的にブロック)</div>
          <pre className={styles.codeBlock}><code>{`command(rm -rf)                    # 破壊的な削除をブロック
command(sudo)                      # sudo権限をブロック
write_file(.git/)                  # Git履歴を保護
write_file(/home/user/.ssh)        # SSH鍵を保護`}</code></pre>

          <div className={styles.codeLabel}>Ask List (都度確認を求める)</div>
          <pre className={styles.codeBlock}><code>{`command(*)                         # すべてのコマンドで確認を求める
execute_url(aws.amazon.com)        # AWSコンソール操作時に確認
mcp(sql/execute_mutation)          # SQLの変更系クエリ実行時に確認`}</code></pre>

          <h3>8.5 Terminal Sandboxing(プレビュー機能)</h3>
          <p>
            サンドボックスを有効にすると、<code>read_file</code>/<code>write_file</code>/<code>read_url</code> の許可設定が、そのままサンドボックスの読み取り専用・読み書き可能なファイルシステムallowlist、およびアウトバウンドのネットワーク許可リストに反映されます。2026年7月時点ではmacOS/Linuxでプレビュー提供、Windows対応は予定段階です。
          </p>
          <h3>8.6 Permissions ベストプラクティス</h3>
          <ul>
            <li>
              <strong>破壊的コマンド(<code>rm -rf</code>、<code>sudo</code>)は最初からDenyに入れる</strong>:これは「念のため」ではなく必須の初期設定と考える
            </li>
            <li>
              <strong><code>.git/</code> や <code>.ssh</code> のような機微なパスは明示的にwrite_fileをDenyする</strong>:ワークスペース内は自動許可される、というデフォルトを過信しない
            </li>
            <li>
              <strong>プロンプトカード上でスコープを直接編集できる機能を活用する</strong>:単一ファイルへの許可を親ディレクトリまで広げる、といった調整がその場ででき、同種の操作で毎回聞かれるのを防げる(ターミナルコマンドのスコープ編集は非対応)
            </li>
            <li>
              <strong>Skillやワークフローに強い権限(<code>requires_approval: false</code>相当)を与える前に、Deny/Askの設計を先に固める</strong>
            </li>
          </ul>
        </section>

        <section id="step7" className={styles.section}>
          <h2>9. Step 7:MCP(Model Context Protocol)で外部ツールと連携する</h2>
          <h3>9.1 MCPとは</h3>
          <p>
            MCPは、AIエージェントやエディタがローカルの開発ツール・データベース・外部APIに安全に接続するためのオープン標準です。Antigravityでは、次の2つの用途で使われます。
          </p>
          <ul>
            <li>
              <strong>コンテキストの追加</strong>:SQLクエリを書く際にNeon/Supabase/AlloyDBの実スキーマを参照させる、デプロイ失敗時にNetlify/Herokuのビルドログを直接取得させる、など
            </li>
            <li>
              <strong>カスタムツールの追加</strong>:「このTODOからLinearのIssueを作って」「NotionやGitHubで認証パターンを検索して」といった安全なアクションの実行
            </li>
          </ul>
          <h3>9.2 設定ファイルの構造</h3>
          <p>
            MCPサーバーは <code>mcpServers</code> オブジェクトの下にサーバーごとの設定を並べる、共通フォーマットで定義します。
          </p>
          <div className={styles.codeLabel}>mcp_config.json</div>
          <pre className={styles.codeBlock}><code>{`{
  "mcpServers": {
    "sqlite-explorer": {
      "command": "node",
      "args": ["/usr/local/bin/sqlite-mcp-server.js"],
      "env": {
        "SQLITE_DB_PATH": "/var/data/app.db"
      }
    },
    "my-remote-server": {
      "serverUrl": "https://api.example.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    }
  }
}`}</code></pre>
          <p>
            グローバル設定は <code>~/.gemini/config/mcp_config.json</code>、ワークスペース固有の設定は <code>.agents/mcp_config.json</code> に置きます。リモート接続では <code>serverUrl</code> フィールドが必須で、旧来の <code>url</code> や <code>httpUrl</code> は非対応になっている点に注意してください。
          </p>
          <h3>9.3 認証方式</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>方式</th>
                  <th>概要</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Google Credentials</strong></td>
                  <td>
                    <code>authProviderType: "google_credentials"</code> を指定し、<code>gcloud auth application-default login</code> で設定したADCを利用
                  </td>
                </tr>
                <tr>
                  <td><strong>OAuth(自動)</strong></td>
                  <td>Dynamic Client Registration対応サーバーなら追加設定不要</td>
                </tr>
                <tr>
                  <td><strong>OAuth(手動)</strong></td>
                  <td>
                    <code>oauth.clientId</code> / <code>oauth.clientSecret</code> を指定し、リダイレクトURIとして <code><a href="https://antigravity.google/oauth-callback" target="_blank" rel="noopener noreferrer">https://antigravity.google/oauth-callback</a></code> を登録
                  </td>
                </tr>
                <tr>
                  <td><strong>カスタムヘッダー</strong></td>
                  <td><code>headers</code> にAPIキーやBearerトークンを設定</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>9.4 サポートされている主なMCPサーバー(抜粋)</h3>
          <p>
            BigQuery、Cloud SQL各種、Firebase、GitHub、GitLab、Linear、MongoDB、Neon、Netlify、Notion、Postman、Redis、Sequential Thinking、SonarQube、Spanner、Stripe、Supabase など、開発・データ・生産性系のサービスが幅広くMCP Storeから直接インストール可能です。
          </p>
          <h3>9.5 MCP ベストプラクティス</h3>
          <ul>
            <li>
              未設定のMCPツールは<strong>デフォルトでAskモード</strong>になる。頻繁に使う安全なツールだけを個別にAllowへ昇格させる
            </li>
            <li>
              <code>mcp(server/*)</code> のようにサーバー単位で許可する場合は、そのサーバーが持つ全ツールの影響範囲を事前に把握してから設定する
            </li>
            <li>SQLの変更系クエリなど、副作用のある操作は個別にAskへ残す(8章の設定例を参照)</li>
          </ul>
        </section>

        <section id="step8" className={styles.section}>
          <h2>10. Step 8:Agent Manager と並列サブエージェント運用</h2>
          <h3>10.1 マネージャーマインドセットへの転換</h3>
          <p>
            Antigravityは非同期運用を前提に設計されています。複数のエージェントを人間が逐一監視せずに並列稼働させ、Agent Managerで進捗を管理する、というのが本来の使い方です。ある実践者の解説では、この非同期・並列という特性こそが CursorやClaude Codeの単一スレッド型のサブエージェントと異なる、Antigravity独自の強みとして位置づけられています。
          </p>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_PARALLEL_AGENTS} />
          </div>
          <h3>10.2 実務での使い分けの例</h3>
          <ul>
            <li>
              Agent Aが古い認証モジュールをリファクタリングしている間に、Agent Bは同モジュールの後方互換性を検証するテストスイートを並行して書く、といった役割分担が可能です
            </li>
            <li>
              大規模なリファクタリングや複数ファイルにまたがる一括変更は、メインのエージェントにバックグラウンドのサブエージェントを生成させ、Managerが非同期に処理を任せる、という運用が推奨されています
            </li>
            <li>
              結果は翌朝Artifactsとしてまとまって届く、という「一晩寝かせる」運用も紹介されており、CIジョブに近いが、エージェントレベルのコード理解を伴う点が違いとして語られています
            </li>
          </ul>
          <h3>10.3 Agent Manager ベストプラクティス</h3>
          <ul>
            <li>
              <strong>エージェントを"専門の外注先"として扱う</strong>:1つのエージェントに何でもやらせず、リファクタリング担当・テスト担当のように役割を分ける
            </li>
            <li>
              <strong>保守的なReview Policyとterminalポリシーから始める</strong>:信頼が積み上がってから緩めていく
            </li>
            <li>
              <strong>1つの会話ウィンドウを長く伸ばしすぎない</strong>:高性能モデルでもコンテキストが大きくなるほど性能劣化が起きやすいという指摘がある。区切りの良いところで新しい会話・新しいエージェントに切り出す
            </li>
          </ul>
        </section>

        <section id="summary" className={styles.section}>
          <h2>11. ベストプラクティス総まとめ</h2>
          <h3>11.1 Do / Don't 早見表</h3>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>項目</th>
                  <th>Do(推奨)</th>
                  <th>Don't(避けるべき)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GEMINI.md</td>
                  <td>役割・絶対制約・参照ファイルを簡潔に整理する</td>
                  <td>すべてをGEMINI.md1ファイルに詰め込む</td>
                </tr>
                <tr>
                  <td>Rules活性化</td>
                  <td>タスクの性質に応じてManual/Always On/Model Decision/Globを使い分ける</td>
                  <td>すべてをAlways Onにしてコンテキストを圧迫する</td>
                </tr>
                <tr>
                  <td>Skills</td>
                  <td>1 Skill = 1タスクに専念させ、descriptionを明確に書く</td>
                  <td>「何でも屋」のSkillを作り、判断基準を曖昧にする</td>
                </tr>
                <tr>
                  <td>Workflows</td>
                  <td>頻出の定型作業を手動実行後に"昇格"させて作る</td>
                  <td>最初から完璧な巨大Workflowを一気に書こうとする</td>
                </tr>
                <tr>
                  <td>Artifacts(Plan)</td>
                  <td>コード生成前にPlanを厳しくレビューし、必要なら拒否する</td>
                  <td>Planを流し読みしてすぐ承認し、コーディング段階を急ぐ</td>
                </tr>
                <tr>
                  <td>Permissions</td>
                  <td>破壊的コマンドとシークレットパスを最初からDenyに入れる</td>
                  <td>ワークスペース内だから安全、とデフォルトを過信する</td>
                </tr>
                <tr>
                  <td>Agent Manager</td>
                  <td>役割分担された複数エージェントを並列稼働させる</td>
                  <td>1つのエージェントに何もかも任せ、長時間の単一会話を続ける</td>
                </tr>
                <tr>
                  <td>Review Policy</td>
                  <td>プロジェクトの信頼度に応じて段階的に緩める</td>
                  <td>最初からAlways Proceedにして検証を省略する</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3>11.2 コンポーネント選択のミニフローチャート</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={MERMAID_DECISION_TREE} />
          </div>
        </section>

        <section id="conclusion" className={styles.section}>
          <h2>12. まとめ</h2>
          <p>
            Google Antigravity のエコシステムは、「常に効かせたい制約(Rules/GEMINI.md)」「必要な時だけ展開する専門知識(Skills)」「繰り返す手順(Workflows)」「検証可能な成果物(Artifacts)」という4つの層を組み合わせることで、エージェントに高い自律性を与えながら、人間が信頼して検証できる状態を保つ設計になっています。Permissions(Deny &gt; Ask &gt; Allowの優先順位)とMCPによる外部連携がこれを下支えし、Agent Managerによる並列運用がスケールを可能にします。
          </p>
          <p>
            初学者は、まず(1)GEMINI.mdで最低限の役割・制約を定義し、(2)Plan Artifactを丁寧にレビューする習慣をつけ、(3)慣れてきたら頻出タスクをSkillsやWorkflowsに昇格させる、という順番で慣れていくのが無理のない進め方です。
          </p>
        </section>

        <section id="sources" className={styles.section}>
          <h2>13. 参考文献・出典(Sources)</h2>
          <p>
            本ガイドの内容は、以下の公式ドキュメントおよび国際的な開発者・メディアの一次情報をもとに、2026年7月27日時点でのWeb検索により作成しています。
          </p>

          <div className={styles.sourceGroupTitle}>Google公式ドキュメント・ブログ</div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google Antigravity Docs - Rules &amp; Workflows</td>
                  <td>
                    <a href="https://antigravity.google/docs/rules-workflows" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/rules-workflows
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Docs - Skills</td>
                  <td>
                    <a href="https://antigravity.google/docs/skills" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/skills
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Docs - Artifacts (Overview)</td>
                  <td>
                    <a href="https://antigravity.google/docs/artifacts" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/artifacts
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Docs - Getting Started</td>
                  <td>
                    <a href="https://antigravity.google/docs/getting-started" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/getting-started
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Docs - Permissions</td>
                  <td>
                    <a href="https://antigravity.google/docs/permissions" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/permissions
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Docs - MCP</td>
                  <td>
                    <a href="https://antigravity.google/docs/mcp" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/mcp
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Docs - CLI Best Practices</td>
                  <td>
                    <a href="https://antigravity.google/docs/cli/best-practices" target="_blank" rel="noopener noreferrer">
                      https://antigravity.google/docs/cli/best-practices
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    Build with Google Antigravity, our new agentic development platform(Google Developers Blog, 2025/11/20)
                  </td>
                  <td>
                    <a href="https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/" target="_blank" rel="noopener noreferrer">
                      https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.sourceGroupTitle}>国際的な開発者・メディアによる解説記事</div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>タイトル</th>
                  <th>著者/媒体</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google Antigravity(link post)</td>
                  <td>Simon Willison(2025/11/18)</td>
                  <td>
                    <a href="https://simonwillison.net/2025/Nov/18/google-antigravity/" target="_blank" rel="noopener noreferrer">
                      https://simonwillison.net/2025/Nov/18/google-antigravity/
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Tutorial: Getting Started with Google Antigravity</td>
                  <td>Romin Irani, Google Cloud Community(Medium)</td>
                  <td>
                    <a href="https://medium.com/google-cloud/tutorial-getting-started-with-google-antigravity-b5cc74c103c2" target="_blank" rel="noopener noreferrer">
                      https://medium.com/google-cloud/tutorial-getting-started-with-google-antigravity-b5cc74c103c2
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Skills Made Easy with Google Antigravity and Gemini CLI</td>
                  <td>Karl Weinmeister, Google Cloud Community(Medium)</td>
                  <td>
                    <a href="https://medium.com/google-cloud/skills-made-easy-with-google-antigravity-and-gemini-cli-5435139b0af8" target="_blank" rel="noopener noreferrer">
                      https://medium.com/google-cloud/skills-made-easy-with-google-antigravity-and-gemini-cli-5435139b0af8
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Authoring Google Antigravity Skills</td>
                  <td>Google Codelabs</td>
                  <td>
                    <a href="https://codelabs.developers.google.com/getting-started-with-antigravity-skills" target="_blank" rel="noopener noreferrer">
                      https://codelabs.developers.google.com/getting-started-with-antigravity-skills
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    Build Autonomous Developer Pipelines using agents.md and skills.md in Antigravity
                  </td>
                  <td>Google Codelabs</td>
                  <td>
                    <a href="https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity" target="_blank" rel="noopener noreferrer">
                      https://codelabs.developers.google.com/autonomous-ai-developer-pipelines-antigravity
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>My First Experience Creating Antigravity Skills</td>
                  <td>DEV Community(googleai)</td>
                  <td>
                    <a href="https://dev.to/googleai/my-first-experience-creating-antigravity-skills-524b" target="_blank" rel="noopener noreferrer">
                      https://dev.to/googleai/my-first-experience-creating-antigravity-skills-524b
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Mastering the Antigravity Agent Manager: 2026 Guide (Part 1)</td>
                  <td>aifire.co</td>
                  <td>
                    <a href="https://www.aifire.co/p/mastering-the-antigravity-agent-manager-2026-guide-part-1" target="_blank" rel="noopener noreferrer">
                      https://www.aifire.co/p/mastering-the-antigravity-agent-manager-2026-guide-part-1
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Advanced Tips for Mastering Google Antigravity</td>
                  <td>Amulya Bhatia</td>
                  <td>
                    <a href="https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/" target="_blank" rel="noopener noreferrer">
                      https://iamulya.one/posts/advanced-tips-for-mastering-google-antigravity/
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity Explained: 2026 Beginner-to-Expert Guide</td>
                  <td>Helply</td>
                  <td>
                    <a href="https://helply.com/blog/google-antigravity-explained" target="_blank" rel="noopener noreferrer">
                      https://helply.com/blog/google-antigravity-explained
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Antigravity: Complete Guide to the Agent IDE</td>
                  <td>aibuilderclub.com</td>
                  <td>
                    <a href="https://www.aibuilderclub.com/blog/google-antigravity-complete-guide" target="_blank" rel="noopener noreferrer">
                      https://www.aibuilderclub.com/blog/google-antigravity-complete-guide
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    Google Antigravity Skills: Mastering AI-Assisted IDEs and Agentic Orchestration
                  </td>
                  <td>William Spurlock</td>
                  <td>
                    <a href="https://williamspurlock.com/blog/google-antigravity-skills-guide/" target="_blank" rel="noopener noreferrer">
                      https://williamspurlock.com/blog/google-antigravity-skills-guide/
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>What are Google Antigravity Skills? Build 24/7 AI Agents</td>
                  <td>VERTU</td>
                  <td>
                    <a href="https://vertu.com/lifestyle/mastering-google-antigravity-skills-the-ultimate-guide-to-extending-agentic-ai-in-2026" target="_blank" rel="noopener noreferrer">
                      https://vertu.com/lifestyle/mastering-google-antigravity-skills-the-ultimate-guide-to-extending-agentic-ai-in-2026
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    Google’s $2.4B Hedge — Antigravity and the Panic Play / I Was Wrong About AntiGravity
                  </td>
                  <td>Robert Matsuoka, Hyperdev</td>
                  <td>
                    <a href="https://hyperdev.matsuoka.com/p/googles-24b-hedge-antigravity-and" target="_blank" rel="noopener noreferrer">
                      https://hyperdev.matsuoka.com/p/googles-24b-hedge-antigravity-and
                    </a>
                    ,{" "}
                    <a href="https://hyperdev.matsuoka.com/p/i-was-wrong-about-antigravity" target="_blank" rel="noopener noreferrer">
                      https://hyperdev.matsuoka.com/p/i-was-wrong-about-antigravity
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={`${styles.callout} ${styles.calloutWarning}`} style={{ marginTop: "24px" }}>
            <div className={styles.calloutIcon}>⚠️</div>
            <div>
              <p>
                注記:Antigravityは2025年11月の公開から現在も活発にアップデートされているプロダクトです。UI・コマンド名・デフォルト値等は本ガイド作成時点(2026年7月27日)の情報であり、実際に導入する際は上記の公式ドキュメントで最新状況を確認することを推奨します。
              </p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Google Antigravity 完全ガイド ― 本ドキュメントはGoogle公式ドキュメントおよび国際的な開発者・メディアの一次情報をもとに作成された非公式の解説資料です。</p>
        </footer>
      </main>
    </div>
  );
}
