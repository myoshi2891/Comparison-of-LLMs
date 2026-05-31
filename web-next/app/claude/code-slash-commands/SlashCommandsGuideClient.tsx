"use client";

import { useEffect, useState } from "react";
import CodeCopyButton from "@/components/docs/CodeCopyButton";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

// ── MERMAID DIAGRAMS ──
const DIAG_0 = `flowchart TD
A([ターミナルを開く]) --> B{"プロジェクト初回?"}
B -- Yes --> C[/"/init で CLAUDE.md 作成"/]
B -- No --> D[claude を実行]
C --> D
D --> E[/"/status で環境確認"/]
E --> F[/"/context でコンテキスト確認"/]
F --> G{"コンテキスト 80% 超え?"}
G -- Yes --> H[/"/compact で圧縮"/]
G -- No --> I[作業開始]
H --> I`;

const DIAG_1 = `flowchart LR
A[/"/ スラッシュコマンド"/] --> B[ビルトインコマンド]
A --> C[バンドルスキル]
A --> D[カスタムコマンド]
B --> B1["CLI 本体にハードコード\\n固定ロジックで高速動作\\n例: /clear /compact /model"]
C --> C1["プロンプトベース of 実行指示\\nClaude が知的にオーケストレート\\n例: /batch /code-review /loop"]
D --> D1["ユーザー定義 of Markdown テンプレート\\n.claude/commands/ または ~/.claude/commands/\\n例: /my-review /deploy-check"]`;

const DIAG_2 = `flowchart TD
A([コンテキストが重くなった]) --> B{"同じタスクを続ける?"}
B -- Yes --> C["/compact で圧縮"]
B -- No --> D["/clear で全消去"]
C --> E["重要な文脈を保持したまま継続"]
D --> F["クリーンなコンテキストで再スタート"]`;

const DIAG_3 = `flowchart TD
A([タスクの複雑さを判断]) --> B{"コード補完・検索など軽量?"}
B -- Yes --> C["Haiku\\n/model haiku"]
B -- No --> D{"一般的なコーディング?"}
D -- Yes --> E["Sonnet\\n/model sonnet"]
D -- No --> F{"複雑な設計・難解なバグ?"}
F -- Yes --> G["Opus\\n/model opus"]
F -- No --> H["Opus + 最高精度\\n/model opus → /effort xhigh"]`;

const DIAG_4 = `flowchart TD
A(["/plan タスク説明を入力"]) --> B[Claude がコードベースを探索]
B --> C[実装計画を提案]
C --> D{"計画を承認する?"}
D -- Yes --> E[コード実装を開始]
D -- No --> F[フィードバックを入力]
F --> C
E --> G["/diff で差分確認"]
G --> H["/code-review でレビュー"]
H --> I{"問題あり?"}
I -- Yes --> J[修正を指示]
J --> G
I -- No --> K[完了・PR 作成]`;

const DIAG_5 = `flowchart TD
A(["/batch 大規模変更の指示"]) --> B[コードベースを調査]
B --> C["5から30の独立した作業単位に分解"]
C --> D[実装計画を提示]
D --> E{"承認する?"}
E -- No --> F[修正・再提案]
F --> D
E -- Yes --> G["独立した git worktree を各ユニットに作成"]
G --> H["並列エージェントがそれぞれ実装"]
G --> I["各エージェントがテストを実行"]
G --> J["各ユニットが PR を作成"]
J --> K[全 PR をレビュー・マージ]`;

const DIAG_6 = `flowchart LR
A([セッション開始]) --> B["/status で環境確認"]
B --> C["/context でコンテキスト確認"]
C --> D{"80% 超え?"}
D -- Yes --> E["/compact で圧縮"]
D -- No --> F[作業開始]
E --> F`;

const DIAG_7 = `flowchart TD
A(["claude -n 'feature-xxx' で開始"]) --> B["/plan で実装計画を立案"]
B --> C[計画を確認・修正]
C --> D[実装を指示]
D --> E{"コンテキスト重い?"}
E -- Yes --> F["/compact 重要文脈を中心に"]
E -- No --> G[実装継続]
F --> G
G --> H["/diff で差分確認"]
H --> I["/code-review でバグ検出"]
I --> J["/security-review でセキュリティ確認"]
J --> K[PR 作成・マージ]`;

const DIAG_8 = `flowchart TD
A([claude を起動]) --> B["/plan で移行計画を立案"]
B --> C["/batch で並列エージェントに実装を依頼"]
B --> D["/tasks で進捗を確認"]
D --> E{"全エージェント完了?"}
E -- No --> D
E -- Yes --> F["/agents で結果を確認"]
F --> G[各 PR をレビュー・マージ]`;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function SlashCommandsGuideClient() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    for (const section of Array.from(sections)) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const matchSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const getLinkClassName = (id: string) => {
    return `${styles.navLink} ${activeSection === id ? styles.navLinkActive : ""}`;
  };

  return (
    <div className={styles.layout}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.30.0/dist/tabler-icons.min.css"
      />

      <nav className={styles.sidebar}>
        <div className={styles.sidebarSearch}>
          <div className={styles.searchWrap}>
            <i className={`ti ti-search ${styles.searchIcon}`} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="コマンドを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="コマンドを検索"
            />
          </div>
        </div>

        <div className={styles.navGroupLabel}>基礎</div>
        <a className={getLinkClassName("overview")} href="#overview">
          <i className="ti ti-bulb" />
          スラッシュコマンドとは
        </a>
        <a className={getLinkClassName("install")} href="#install">
          <i className="ti ti-download" />
          インストールと起動
        </a>
        <a className={getLinkClassName("types")} href="#types">
          <i className="ti ti-category" />
          コマンドの種類
        </a>

        <div className={styles.navGroupLabel}>コマンドカテゴリ</div>
        <a className={getLinkClassName("session")} href="#session">
          <i className="ti ti-layout-kanban" />
          セッション管理
        </a>
        <a className={getLinkClassName("model")} href="#model">
          <i className="ti ti-brain" />
          モデルと性能
        </a>
        <a className={getLinkClassName("project")} href="#project">
          <i className="ti ti-folder-cog" />
          プロジェクト設定
        </a>
        <a className={getLinkClassName("review")} href="#review">
          <i className="ti ti-code-circle" />
          コーディング・レビュー
        </a>
        <a className={getLinkClassName("agents")} href="#agents">
          <i className="ti ti-robot" />
          エージェント・スキル
        </a>
        <a className={getLinkClassName("mcp")} href="#mcp">
          <i className="ti ti-plug-connected" />
          MCP インテグレーション
        </a>
        <a className={getLinkClassName("custom")} href="#custom">
          <i className="ti ti-file-code" />
          カスタムコマンド
        </a>

        <div className={styles.navGroupLabel}>応用</div>
        <a className={getLinkClassName("best")} href="#best">
          <i className="ti ti-star" />
          ベストプラクティス
        </a>
        <a className={getLinkClassName("workflow")} href="#workflow">
          <i className="ti ti-route" />
          実践ワークフロー
        </a>
        <a className={getLinkClassName("sources")} href="#sources">
          <i className="ti ti-books" />
          参考ソース
        </a>
      </nav>

      <main className={styles.main}>
        {/* PAGE HEADER */}
        <header className={styles.pageHeader}>
          <div className={styles.headerInner}>
            <div className={styles.headerLogo}>
              <div className={styles.logoIcon}>
                <i className="ti ti-terminal-2" />
              </div>
              <h1 className={styles.headerTitle}>
                Claude Code <span>/</span> スラッシュコマンド完全ガイド
              </h1>
            </div>
            <div className={styles.headerBadges}>
              <span className={`${styles.badge} ${styles.badgeVersion}`}>v2.1.150</span>
              <span className={`${styles.badge} ${styles.badgeDate}`}>2026-05-31</span>
            </div>
          </div>
        </header>

        {/* SECTION 1 */}
        <section className={styles.section} id="overview">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-bulb" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>01</span>
              <h2 className={styles.sectionTitle}>スラッシュコマンドとは何か</h2>
            </div>
          </div>

          <p className={styles.lead}>
            スラッシュコマンドは Claude Code セッションを
            <strong style={{ color: "var(--color-text-primary)" }}>
              制御するためのショートカット
            </strong>
            です。通常のプロンプトが「Claude
            に何をするか」を伝えるのに対し、スラッシュコマンドは「Claude
            がどう振る舞うか」や「セッション自体への操作」を実行します。
          </p>

          <div className={styles.typeCards}>
            <div className={`${styles.typeCard} ${styles.builtin}`}>
              <div className={styles.typeCardLabel}>通常のプロンプト</div>
              <div className={styles.typeCardName}>自然言語の指示</div>
              <div className={styles.typeCardDesc}>
                Claude に対してタスクを指示する。コードを書く、リファクタリングする、調査するなど。
              </div>
              <div className={styles.typeCardExample}>
                &quot;この関数をリファクタリングして&quot;
              </div>
            </div>
            <div className={`${styles.typeCard} ${styles.skill}`}>
              <div className={styles.typeCardLabel}>スラッシュコマンド</div>
              <div className={styles.typeCardName}>セッション制御</div>
              <div className={styles.typeCardDesc}>
                セッション状態、モデル、コンテキスト、権限などを直接操作する。
              </div>
              <div className={styles.typeCardExample}>/compact /model /clear /plan</div>
            </div>
            <div className={`${styles.typeCard} ${styles.custom}`}>
              <div className={styles.typeCardLabel}>表示方法</div>
              <div className={styles.typeCardName}>/ でトリガー</div>
              <div className={styles.typeCardDesc}>
                セッション内で / を入力するとオートコンプリートメニューが表示される。
              </div>
              <div className={styles.typeCardExample}>/ → 一覧 / /comp → 絞り込み</div>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className={`ti ti-info-circle ${styles.calloutIcon}`} />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>オートコンプリートの活用</div>
              <p>
                <code>/</code> に続けて文字を入力することでコマンドを絞り込めます。
                <code>/help</code> で現在のバージョンで使用可能なコマンドの一覧を確認できます。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className={styles.section} id="install">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-download" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>02</span>
              <h2 className={styles.sectionTitle}>インストールと起動</h2>
            </div>
          </div>

          <h3>インストール方法</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                bash — インストール（推奨順）
              </span>
              <CodeCopyButton
                text={`# 方法 1: ネイティブバイナリ（推奨）\ncurl -fsSL https://claude.ai/install.sh | bash\n\n# 方法 2: Homebrew（macOS のみ）\nbrew install --cask claude-code\n\n# 方法 3: npm（非推奨・旧来）\nnpm install -g @anthropic-ai/claude-code\n\n# バージョン確認\nclaude --version\nclaude doctor`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># 方法 1: ネイティブバイナリ（推奨）</span>
                {"\n"}
                <span className={styles.tCmd}>curl</span> -fsSL https://claude.ai/install.sh |{" "}
                <span className={styles.tCmd}>bash</span>
                {"\n\n"}
                <span className={styles.tCmt}># 方法 2: Homebrew（macOS のみ）</span>
                {"\n"}
                <span className={styles.tCmd}>brew</span> install --cask claude-code
                {"\n\n"}
                <span className={styles.tCmt}># 方法 3: npm（非推奨・旧来）</span>
                {"\n"}
                <span className={styles.tCmd}>npm</span> install -g @anthropic-ai/claude-code
                {"\n\n"}
                <span className={styles.tCmt}># バージョン確認</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> --version{"\n"}
                <span className={styles.tCmd}>claude</span> doctor
              </code>
            </pre>
          </div>

          <h3>認証とセッション開始</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                bash — 認証
              </span>
              <CodeCopyButton
                text={`claude auth login    # サインインまたはアカウント切り替え\nclaude auth status   # 認証状態を確認\nclaude auth logout   # サインアウト`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmd}>claude</span> auth login{" "}
                <span className={styles.tCmt}># サインインまたはアカウント切り替え</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> auth status{" "}
                <span className={styles.tCmt}># 認証状態を確認</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> auth logout{" "}
                <span className={styles.tCmt}># サインアウト</span>
              </code>
            </pre>
          </div>

          <h3>主な CLI フラグ</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>フラグ</th>
                <th>説明</th>
                <th>使用例</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("claude インタラクティブセッション開始") ? "" : styles.hidden
                }
              >
                <td>
                  <code>claude</code>
                </td>
                <td>インタラクティブセッション開始</td>
                <td>
                  <code>claude</code>
                </td>
              </tr>
              <tr className={matchSearch("-p プリントモード 1回実行して終了") ? "" : styles.hidden}>
                <td>
                  <code>-p &quot;...&quot;</code>
                </td>
                <td>1回実行して終了（プリントモード）</td>
                <td>
                  <code>claude -p &quot;TODO を列挙して&quot;</code>
                </td>
              </tr>
              <tr className={matchSearch("-c 直近のセッションを継続") ? "" : styles.hidden}>
                <td>
                  <code>-c</code>
                </td>
                <td>直近のセッションを継続</td>
                <td>
                  <code>claude -c</code>
                </td>
              </tr>
              <tr className={matchSearch("-r 指定セッションを再開") ? "" : styles.hidden}>
                <td>
                  <code>-r &quot;名前&quot;</code>
                </td>
                <td>指定セッションを再開</td>
                <td>
                  <code>claude -r &quot;auth-refactor&quot;</code>
                </td>
              </tr>
              <tr className={matchSearch("-n セッションに名前をつけて開始") ? "" : styles.hidden}>
                <td>
                  <code>-n &quot;名前&quot;</code>
                </td>
                <td>セッションに名前をつけて開始</td>
                <td>
                  <code>claude -n &quot;feature-x&quot;</code>
                </td>
              </tr>
              <tr className={matchSearch("--model モデルを指定して起動") ? "" : styles.hidden}>
                <td>
                  <code>--model</code>
                </td>
                <td>モデルを指定して起動</td>
                <td>
                  <code>claude --model opus</code>
                </td>
              </tr>
              <tr
                className={matchSearch("--max-turns 自律ターン数の上限を設定") ? "" : styles.hidden}
              >
                <td>
                  <code>--max-turns N</code>
                </td>
                <td>自律ターン数の上限を設定</td>
                <td>
                  <code>claude -p &quot;fix lint&quot; --max-turns 10</code>
                </td>
              </tr>
              <tr className={matchSearch("--init CLAUDE.md を作成して起動") ? "" : styles.hidden}>
                <td>
                  <code>--init</code>
                </td>
                <td>CLAUDE.md を作成して起動</td>
                <td>
                  <code>claude --init</code>
                </td>
              </tr>
              <tr
                className={
                  matchSearch("--from-pr PR に紐づけてセッションを開始") ? "" : styles.hidden
                }
              >
                <td>
                  <code>--from-pr N</code>
                </td>
                <td>PR に紐づけてセッションを開始</td>
                <td>
                  <code>claude --from-pr 456</code>
                </td>
              </tr>
              <tr className={matchSearch("-w 独立した git worktree で起動") ? "" : styles.hidden}>
                <td>
                  <code>-w</code>
                </td>
                <td>独立した git worktree で起動</td>
                <td>
                  <code>claude -w</code>
                </td>
              </tr>
              <tr className={matchSearch("--debug デバッグログを有効化") ? "" : styles.hidden}>
                <td>
                  <code>--debug</code>
                </td>
                <td>デバッグログを有効化</td>
                <td>
                  <code>claude --debug</code>
                </td>
              </tr>
              <tr
                className={
                  matchSearch("--bare フック・LSP・プラグインをスキップ") ? "" : styles.hidden
                }
              >
                <td>
                  <code>--bare</code>
                </td>
                <td>フック・LSP・プラグインをスキップ</td>
                <td>
                  <code>claude -p &quot;...&quot; --bare</code>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>セッション開始フロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_0} />
            <div className={styles.mermaidCaption}>
              図: セッション開始から作業開始までの推奨フロー
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className={styles.section} id="types">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-category" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>03</span>
              <h2 className={styles.sectionTitle}>コマンドの種類と分類</h2>
            </div>
          </div>

          <p className={styles.lead}>
            スラッシュコマンドは 3 つの種類に分類されます。それぞれ動作の仕組みと用途が異なります。
          </p>

          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_1} />
            <div className={styles.mermaidCaption}>図: スラッシュコマンドの 3 分類</div>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>種類</th>
                <th>格納場所</th>
                <th>特徴</th>
                <th>例</th>
              </tr>
            </thead>
            <tbody>
              <tr className={matchSearch("ビルトイン CLI 本体 固定ロジック") ? "" : styles.hidden}>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>ビルトイン</span>
                </td>
                <td>CLI 本体</td>
                <td>固定ロジック・高速・引数なしで即実行</td>
                <td>
                  <code>/clear</code> <code>/compact</code> <code>/model</code>
                </td>
              </tr>
              <tr
                className={matchSearch("スキル CLI に同梱 プロンプトベース") ? "" : styles.hidden}
              >
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>CLI に同梱</td>
                <td>プロンプトベース・Claude が実行計画を立案</td>
                <td>
                  <code>/batch</code> <code>/code-review</code>
                </td>
              </tr>
              <tr className={matchSearch("カスタム commands ユーザー定義") ? "" : styles.hidden}>
                <td>
                  <span className={`${styles.pill} ${styles.pillNew}`}>カスタム</span>
                </td>
                <td>
                  <code>.claude/commands/</code>
                </td>
                <td>ユーザー定義の Markdown テンプレート</td>
                <td>
                  <code>/my-review</code>
                </td>
              </tr>
            </tbody>
          </table>

          <div className={`${styles.callout} ${styles.calloutWarning}`}>
            <i className={`ti ti-alert-triangle ${styles.calloutIcon}`} />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>2026 年の重要変更点</div>
              <p>
                カスタムコマンド (<code>.claude/commands/</code>) とスキル (
                <code>.claude/skills/</code>)
                が統合されました。既存のコマンドファイルはそのまま動作しますが、新規作成にはスキル形式を推奨します。同名の場合はスキルが優先されます。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className={styles.section} id="session">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-layout-kanban" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>04</span>
              <h2 className={styles.sectionTitle}>セッション・コンテキスト管理</h2>
            </div>
          </div>

          <p className={styles.lead}>
            最も頻繁に使用するカテゴリです。コンテキスト管理は Claude Code
            の出力品質を左右する最大の要因です。
          </p>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>コマンド</th>
                <th>説明</th>
                <th>使いどき</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("/clear 会話履歴を全消去してコンテキストを解放") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/clear</code>
                </td>
                <td>会話履歴を全消去してコンテキストを解放</td>
                <td>新しいタスクに切り替えるとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/compact 会話を要約 圧縮してトークンを節約") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/compact [指示]</code>
                </td>
                <td>会話を要約・圧縮してトークンを節約</td>
                <td>長いセッションで続けたいとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/context コンテキストウィンドウの使用状況を表示")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/context</code>
                </td>
                <td>コンテキストウィンドウの使用状況を表示</td>
                <td>上限に近づいていないか確認するとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/rewind 以前のチェックポイントに巻き戻す") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/rewind</code>
                </td>
                <td>以前のチェックポイントに巻き戻す</td>
                <td>Claude が間違った方向に進んだとき</td>
              </tr>
              <tr className={matchSearch("/resume 以前のセッションを再開") ? "" : styles.hidden}>
                <td>
                  <code>/resume [名前]</code>
                </td>
                <td>以前のセッションを再開</td>
                <td>昨日の作業を引き継ぐとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/rename 現在のセッションに名前をつける") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/rename [名前]</code>
                </td>
                <td>現在のセッションに名前をつける</td>
                <td>複数セッションを管理するとき</td>
              </tr>
              <tr className={matchSearch("/branch 会話を分岐させて並行探索") ? "" : styles.hidden}>
                <td>
                  <code>/branch [名前]</code>
                </td>
                <td>会話を分岐させて並行探索</td>
                <td>リスクのある変更を試したいとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/export 会話を Markdown 等でエクスポート") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/export [ファイル名]</code>
                </td>
                <td>会話を Markdown 等でエクスポート</td>
                <td>ログを保存したいとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/diff インタラクティブな差分ビューワーを開く") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/diff</code>
                </td>
                <td>インタラクティブな差分ビューワーを開く</td>
                <td>変更内容を視覚的に確認するとき</td>
              </tr>
              <tr
                className={
                  matchSearch("/copy 最新または N 番目の回答をコピー") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/copy [N]</code>
                </td>
                <td>最新または N 番目の回答をコピー</td>
                <td>コードをクリップボードに取得</td>
              </tr>
              <tr className={matchSearch("/goal 完了条件を設定して自動継続") ? "" : styles.hidden}>
                <td>
                  <code>/goal [条件]</code>
                  <span className={`${styles.pill} ${styles.pillNew}`}>v2.1.139+</span>
                </td>
                <td>完了条件を設定して自動継続</td>
                <td>複数ターンにまたがる長い作業</td>
              </tr>
              <tr
                className={
                  matchSearch("/status 現在のセッション 環境状態を表示") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/status</code>
                </td>
                <td>現在のセッション・環境状態を表示</td>
                <td>最初に実行して状態を把握</td>
              </tr>
            </tbody>
          </table>

          <h3>/compact の使い方</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton
                text={`/compact\n/compact 認証モジュールと現在のテスト失敗を中心に保持して\n/compact API の設計決定のみ保持`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># 基本: そのまま圧縮</span>
                {"\n"}
                <span className={styles.tCmd}>/compact</span>
                {"\n\n"}
                <span className={styles.tCmt}>
                  # フォーカスを指定して圧縮（重要情報を優先的に保持）
                </span>
                {"\n"}
                <span className={styles.tCmd}>/compact</span>{" "}
                <span className={styles.tStr}>
                  認証モジュールと現在のテスト失敗を中心に保持して
                </span>
                {"\n\n"}
                <span className={styles.tCmt}># API の設計決定だけ残す</span>
                {"\n"}
                <span className={styles.tCmd}>/compact</span>{" "}
                <span className={styles.tStr}>API の設計決定のみ保持</span>
              </code>
            </pre>
          </div>

          <h3>/clear と /compact の使い分け</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_2} />
            <div className={styles.mermaidCaption}>図: /clear と /compact の使い分け判断フロー</div>
          </div>

          <h3>/goal コマンド（v2.1.139+）</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton
                text={`/goal 全ユニットテストが PASS になるまで\n/goal テストカバレッジが 80% 以上になるまで`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># 全ユニットテストが通過するまで修正を続ける</span>
                {"\n"}
                <span className={styles.tCmd}>/goal</span>{" "}
                <span className={styles.tStr}>全ユニットテストが PASS になるまで</span>
                {"\n\n"}
                <span className={styles.tCmt}># カバレッジ 80% 以上を達成するまで</span>
                {"\n"}
                <span className={styles.tCmd}>/goal</span>{" "}
                <span className={styles.tStr}>テストカバレッジが 80% 以上になるまで</span>
                {"\n\n"}
                <span className={styles.tCmt}>
                  # 経過時間・ターン数・トークン数のオーバーレイが表示される
                </span>
              </code>
            </pre>
          </div>

          <h3>コンテキスト管理の黄金ルール</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>状況</th>
                <th>推奨コマンド</th>
                <th>理由</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("新しいタスクを始める /clear 前の作業が干渉しない")
                    ? ""
                    : styles.hidden
                }
              >
                <td>新しいタスクを始める</td>
                <td>
                  <code>/clear</code>
                </td>
                <td>前の作業が干渉しないようにする</td>
              </tr>
              <tr
                className={
                  matchSearch(
                    "長いセッションを続ける /compact 重要な文脈を残しながらトークンを節約"
                  )
                    ? ""
                    : styles.hidden
                }
              >
                <td>長いセッションを続ける</td>
                <td>
                  <code>/compact</code>
                </td>
                <td>重要な文脈を残しながらトークンを節約</td>
              </tr>
              <tr
                className={
                  matchSearch("コンテキスト使用量を確認 /context 上限に達する前に行動")
                    ? ""
                    : styles.hidden
                }
              >
                <td>コンテキスト使用量を確認</td>
                <td>
                  <code>/context</code>
                </td>
                <td>上限に達する前に行動できる</td>
              </tr>
              <tr
                className={
                  matchSearch("作業が迷走したとき /rewind 正しい状態に素早く戻せる")
                    ? ""
                    : styles.hidden
                }
              >
                <td>作業が迷走したとき</td>
                <td>
                  <code>/rewind</code>
                </td>
                <td>正しい状態に素早く戻れる</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 5 */}
        <section className={styles.section} id="model">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-brain" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>05</span>
              <h2 className={styles.sectionTitle}>モデルとパフォーマンス設定</h2>
            </div>
          </div>

          <h3>モデル切り替え</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton
                text={`/model opus    # Claude Opus 4.8 — 高精度・複雑タスク向け\n/model sonnet  # Claude Sonnet 4.6 — バランス型・日常タスク向け\n/model haiku   # Claude Haiku 4.5 — 高速・軽量タスク向け\n/model         # モデルピッカー UI を開く`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmd}>/model</span> opus{" "}
                <span className={styles.tCmt}># Claude Opus 4.8 — 高精度・複雑タスク向け</span>
                {"\n"}
                <span className={styles.tCmd}>/model</span> sonnet{" "}
                <span className={styles.tCmt}>
                  # Claude Sonnet 4.6 — バランス型・日常タスク向け
                </span>
                {"\n"}
                <span className={styles.tCmd}>/model</span> haiku{" "}
                <span className={styles.tCmt}># Claude Haiku 4.5 — 高速・軽量タスク向け</span>
                {"\n"}
                <span className={styles.tCmd}>/model</span>{" "}
                <span className={styles.tCmt}># モデルピッカー UI を開く</span>
              </code>
            </pre>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className={`ti ti-info-circle ${styles.calloutIcon}`} />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>v2.1.153 以降の変更</div>
              <p>
                モデルピッカーで選択したモデルは以降の新規セッションのデフォルトとして保存されます。現在のセッションのみに適用したい場合は{" "}
                <code>s</code> キーを押してください。
              </p>
            </div>
          </div>

          <h3>エフォートレベル（推論の深さ）</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>レベル</th>
                <th>説明</th>
                <th>適したタスク</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={matchSearch("low 軽量な推論 コード補完 単純な検索") ? "" : styles.hidden}
              >
                <td>
                  <code>low</code>
                </td>
                <td>軽量な推論</td>
                <td>コード補完、単純な検索</td>
              </tr>
              <tr
                className={
                  matchSearch("medium 標準推論 一般的なコーディングタスク") ? "" : styles.hidden
                }
              >
                <td>
                  <code>medium</code>
                </td>
                <td>標準推論</td>
                <td>一般的なコーディングタスク</td>
              </tr>
              <tr
                className={
                  matchSearch("high 深い推論 複雑なリファクタリング 設計") ? "" : styles.hidden
                }
              >
                <td>
                  <code>high</code>
                </td>
                <td>深い推論</td>
                <td>複雑なリファクタリング、設計</td>
              </tr>
              <tr
                className={
                  matchSearch("xhigh 最高レベル 難解なバグ修正 アーキテクチャ設計")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>xhigh</code>
                </td>
                <td>最高レベル（Opus 4.8 推奨）</td>
                <td>難解なバグ修正、アーキテクチャ設計</td>
              </tr>
              <tr
                className={matchSearch("auto モデルデフォルトに戻す リセット") ? "" : styles.hidden}
              >
                <td>
                  <code>auto</code>
                </td>
                <td>モデルデフォルトに戻す</td>
                <td>リセットしたいとき</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton
                text={`/effort high    # 高精度推論に設定\n/effort xhigh   # 最高精度（Opus 4.8 推奨）\n/effort         # インタラクティブスライダーを開く\n/fast on        # 素早い・簡潔な回答に切り替え\n/fast off       # 通常モードに戻す`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmd}>/effort</span> high{" "}
                <span className={styles.tCmt}># 高精度推論に設定</span>
                {"\n"}
                <span className={styles.tCmd}>/effort</span> xhigh{" "}
                <span className={styles.tCmt}># 最高精度（Opus 4.8 推奨）</span>
                {"\n"}
                <span className={styles.tCmd}>/effort</span>{" "}
                <span className={styles.tCmt}># インタラクティブスライダーを開く</span>
                {"\n"}
                <span className={styles.tCmd}>/fast</span> on{" "}
                <span className={styles.tCmt}># 素早い・簡潔な回答に切り替え</span>
                {"\n"}
                <span className={styles.tCmd}>/fast</span> off{" "}
                <span className={styles.tCmt}># 通常モードに戻す</span>
              </code>
            </pre>
          </div>

          <h3>タスク別モデル選択フロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_3} />
            <div className={styles.mermaidCaption}>図: タスクの複雑さに応じたモデル選択フロー</div>
          </div>
        </section>

        {/* SECTION 6 */}
        <section className={styles.section} id="project">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-folder-cog" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>06</span>
              <h2 className={styles.sectionTitle}>プロジェクト設定・環境</h2>
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutSuccess}`}>
            <i className={`ti ti-star ${styles.calloutIcon}`} />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>/init は最初に実行すべき最重要コマンド</div>
              <p>
                新しいプロジェクトで Claude Code を使い始める際は必ず <code>/init</code> を実行して{" "}
                <code>CLAUDE.md</code> を作成してください。プロジェクトの文脈を Claude
                に伝える最も効果的な方法です。
              </p>
            </div>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>コマンド</th>
                <th>説明</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("/init CLAUDE.md を作成 初期設定 全プロジェクトで最初に実行")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/init</code>
                </td>
                <td>CLAUDE.md を作成・初期設定</td>
                <td>全プロジェクトで最初に実行</td>
              </tr>
              <tr
                className={
                  matchSearch("/config Settings 設定画面を開く Vimモード") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/config</code>
                </td>
                <td>Claude Code の設定画面を開く</td>
                <td>Vim モード・ワークフロー設定</td>
              </tr>
              <tr className={matchSearch("/memory メモリファイルを開く 編集") ? "" : styles.hidden}>
                <td>
                  <code>/memory</code>
                </td>
                <td>メモリファイルを開く・編集</td>
                <td>CLAUDE.md のワークフロー管理</td>
              </tr>
              <tr
                className={
                  matchSearch("/permissions 権限設定をインタラクティブに管理 コマンドブロック")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/permissions</code>
                </td>
                <td>権限設定をインタラクティブに管理</td>
                <td>コマンドがブロックされたときに確認</td>
              </tr>
              <tr
                className={
                  matchSearch("/hooks フックスクリプトを管理 PreToolUse") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/hooks</code>
                </td>
                <td>フックスクリプトを管理</td>
                <td>PreToolUse・SessionStart イベント</td>
              </tr>
              <tr className={matchSearch("/doctor 診断を実行 問題を自動修正") ? "" : styles.hidden}>
                <td>
                  <code>/doctor</code>
                </td>
                <td>診断を実行・問題を自動修正</td>
                <td>
                  インストール後や更新後に実行。<code>f</code> で自動修正
                </td>
              </tr>
              <tr
                className={
                  matchSearch("/terminal-setup ターミナル統合を設定 VS Code 文字化け")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/terminal-setup</code>
                </td>
                <td>ターミナル統合を設定</td>
                <td>VS Code / Cursor での文字化けを防ぐ</td>
              </tr>
              <tr
                className={
                  matchSearch("/sandbox サンドボックス制御を開く 実行権限") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/sandbox</code>
                </td>
                <td>サンドボックス制御を開く</td>
                <td>実行権限の確認</td>
              </tr>
              <tr
                className={
                  matchSearch("/add-dir 作業スコープにディレクトリを追加 モノレポ")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/add-dir &lt;パス&gt;</code>
                </td>
                <td>作業スコープにディレクトリを追加</td>
                <td>モノレポや隣接プロジェクト向け</td>
              </tr>
              <tr
                className={
                  matchSearch("/keybindings ショートカットをカスタマイズ keybindings.json")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/keybindings</code>
                </td>
                <td>キーボードショートカットをカスタマイズ</td>
                <td>~/.claude/keybindings.json を編集</td>
              </tr>
              <tr className={matchSearch("/theme テーマを変更 作成 themes") ? "" : styles.hidden}>
                <td>
                  <code>/theme</code>
                </td>
                <td>テーマを変更・作成</td>
                <td>~/.claude/themes/ に JSON を配置</td>
              </tr>
              <tr
                className={
                  matchSearch("/team-onboarding チーム向けガイド自動生成 オンボーディング")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/team-onboarding</code>
                  <span className={`${styles.pill} ${styles.pillNew}`}>v2.1.101+</span>
                </td>
                <td>チームメンバー向けガイドを自動生成</td>
                <td>オンボーディングコストを削減</td>
              </tr>
              <tr
                className={
                  matchSearch("/status セッション 環境状態を表示 最初に確認") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/status</code>
                </td>
                <td>現在のセッション・環境状態を表示</td>
                <td>最初に確認する習慣をつける</td>
              </tr>
            </tbody>
          </table>

          <h3>CLAUDE.md に書く内容のテンプレート</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-file-text" />
                CLAUDE.md — テンプレート
              </span>
              <CodeCopyButton
                text={`# プロジェクト名\n\n## コンテキスト\n- 使用言語・フレームワーク（例: TypeScript + Next.js）\n- アーキテクチャの概要\n- 担当チームと責任範囲\n\n## 開発規約\n- コーディングスタイル（Prettier, ESLint の設定）\n- テストの書き方（Vitest, テストカバレッジ要件）\n- コミットメッセージの形式（Conventional Commits）\n\n## 禁止事項\n- 本番コードに console.log を残さない\n- 使用禁止のライブラリ一覧\n\n## よく使うコマンド\n- ビルド: \`npm run build\`\n- テスト: \`npm test\`\n- デプロイ: \`npm run deploy\``}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tKey}># プロジェクト名</span>
                {"\n\n"}
                <span className={styles.tKey}>## コンテキスト</span>
                {"\n"}- 使用言語・フレームワーク（例: TypeScript + Next.js）{"\n"}-
                アーキテクチャの概要{"\n"}- 担当チームと責任範囲
                {"\n\n"}
                <span className={styles.tKey}>## 開発規約</span>
                {"\n"}- コーディングスタイル（Prettier, ESLint の設定）{"\n"}-
                テストの書き方（Vitest, テストカバレッジ要件）{"\n"}-
                コミットメッセージの形式（Conventional Commits）
                {"\n\n"}
                <span className={styles.tKey}>## 禁止事項</span>
                {"\n"}- 本番コードに console.log を残さない{"\n"}- 使用禁止のライブラリ一覧
                {"\n\n"}
                <span className={styles.tKey}>## よく使うコマンド</span>
                {"\n"}- ビルド: `npm run build`{"\n"}- テスト: `npm test`{"\n"}- デプロイ: `npm run
                deploy`
              </code>
            </pre>
          </div>

          <h3>キーボードショートカット（インタラクティブモード）</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>ショートカット</th>
                <th>動作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("Shift+Tab モード切替 自動承認 プランモード") ? "" : styles.hidden
                }
              >
                <td>
                  <code>Shift+Tab</code>
                </td>
                <td>モード切替（通常 → 自動承認 → プランモード）を順番に切り替え</td>
              </tr>
              <tr className={matchSearch("Esc 2回 巻き戻す rewind") ? "" : styles.hidden}>
                <td>
                  <code>Esc × 2</code>
                </td>
                <td>直前の状態に巻き戻す（/rewind と同じ）</td>
              </tr>
              <tr className={matchSearch("Ctrl+A セッション一覧を表示") ? "" : styles.hidden}>
                <td>
                  <code>Ctrl+A</code>
                </td>
                <td>全プロジェクトのセッション一覧を表示</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 7 */}
        <section className={styles.section} id="review">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-code-circle" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>07</span>
              <h2 className={styles.sectionTitle}>コーディング・レビュー</h2>
            </div>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>コマンド</th>
                <th>種別</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr className={matchSearch("/plan 実装計画を立案 プランモード") ? "" : styles.hidden}>
                <td>
                  <code>/plan [説明]</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>プランモードに入る。コードを書く前に実装計画を立案</td>
              </tr>
              <tr
                className={matchSearch("/diff インタラクティブ差分ビューワー") ? "" : styles.hidden}
              >
                <td>
                  <code>/diff</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>インタラクティブ差分ビューワー。左右矢印でターン別差分を切替</td>
              </tr>
              <tr
                className={
                  matchSearch("/code-review バグ セキュリティ問題検出 /simplify")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/code-review [effort]</code>
                  <span className={`${styles.pill} ${styles.pillNew}`}>改名</span>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>バグ・セキュリティ問題の検出（v2.1.147 で /simplify から改名）</td>
              </tr>
              <tr
                className={
                  matchSearch("/security-review セキュリティ脆弱性 SQLインジェクション XSS")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/security-review</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>セキュリティ脆弱性の分析（SQL インジェクション・XSS・認証問題など）</td>
              </tr>
              <tr
                className={
                  matchSearch("/ultrareview 超詳細なコードレビュー PR") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/ultrareview</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>超詳細なコードレビュー。重要な PR に使用</td>
              </tr>
              <tr
                className={matchSearch("/autofix-pr 自動修正エージェント起動") ? "" : styles.hidden}
              >
                <td>
                  <code>/autofix-pr [説明]</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>PR の問題を自動修正するエージェントを起動</td>
              </tr>
            </tbody>
          </table>

          <h3>/plan モードのフロー</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_4} />
            <div className={styles.mermaidCaption}>図: /plan を使った開発フロー</div>
          </div>

          <h3>PR 前の必須チェックリスト</h3>
          <div className={styles.stepList}>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>/diff — 差分を視覚的に確認</div>
                <div className={styles.stepDesc}>
                  左右矢印で git diff とターン別差分を切り替えながら変更内容を確認します。
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>/code-review — バグを検出</div>
                <div className={styles.stepDesc}>
                  正確性のバグをエフォートレベルを指定して検出。<code>--comment</code> オプションで
                  GitHub PR にインラインコメントを投稿できます。
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>/security-review — セキュリティを確認</div>
                <div className={styles.stepDesc}>
                  認証・認可に関わる変更がある場合は必ず実行します。インジェクション・XSS・クレデンシャル露出などを自動でチェックします。
                </div>
              </div>
            </div>
            <div className={styles.stepItem}>
              <div className={styles.stepNum}>4</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>テストを実行して確認</div>
                <div className={styles.stepDesc}>
                  通常のプロンプトで「全テストを実行して結果を報告して」と指示します。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 */}
        <section className={styles.section} id="agents">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-robot" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>08</span>
              <h2 className={styles.sectionTitle}>エージェント・スキル・プラグイン</h2>
            </div>
          </div>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>コマンド</th>
                <th>種別</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("/batch 並列エージェントに分散実行 gh CLI") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/batch &lt;指示&gt;</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>大規模変更を並列エージェントに分散実行（gh CLI 必須）</td>
              </tr>
              <tr
                className={matchSearch("/agents サブエージェントを管理 一覧") ? "" : styles.hidden}
              >
                <td>
                  <code>/agents</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>サブエージェントを管理・一覧表示</td>
              </tr>
              <tr
                className={matchSearch("/tasks バックグラウンドエージェント") ? "" : styles.hidden}
              >
                <td>
                  <code>/tasks</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>バックグラウンドエージェントを一覧表示</td>
              </tr>
              <tr
                className={matchSearch("/bashes バックグラウンド bash タスク") ? "" : styles.hidden}
              >
                <td>
                  <code>/bashes</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>バックグラウンドの bash タスクを一覧</td>
              </tr>
              <tr
                className={
                  matchSearch("/loop 定期的にプロンプトを繰り返し実行 自ペース")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>/loop [間隔] [プロンプト]</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillSkill}`}>スキル</span>
                </td>
                <td>定期的にプロンプトを繰り返し実行。間隔省略で Claude が自ペース</td>
              </tr>
              <tr className={matchSearch("/skills インストール済みスキル") ? "" : styles.hidden}>
                <td>
                  <code>/skills</code>
                  <span className={`${styles.pill} ${styles.pillNew}`}>v2.1.121+</span>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>インストール済みスキルを一覧表示・検索</td>
              </tr>
              <tr
                className={
                  matchSearch("/plugins プラグインを管理 MCPサーバー") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/plugins</code>
                </td>
                <td>
                  <span className={`${styles.pill} ${styles.pillBuiltin}`}>組込</span>
                </td>
                <td>プラグインを管理（MCP サーバー定義・スキル・フックを含む）</td>
              </tr>
            </tbody>
          </table>

          <h3>/batch の仕組み</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_5} />
            <div className={styles.mermaidCaption}>図: /batch による並列エージェント実行フロー</div>
          </div>

          <h3>/batch の使用例</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton
                text={`/batch 全 API エンドポイントのエラーハンドリングを統一して\\n型安全な Result 型を返すようにリファクタリング\n/batch テストカバレッジが 50% 以下のモジュールに\\nユニットテストを追加`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}>
                  # 全 API エンドポイントのエラーハンドリングを統一
                </span>
                {"\n"}
                <span className={styles.tCmd}>/batch</span>{" "}
                <span className={styles.tStr}>
                  全 API エンドポイントのエラーハンドリングを統一して
                </span>
                {"\n"}
                <span className={styles.tStr}>型安全な Result 型を返すようにリファクタリング</span>
                {"\n\n"}
                <span className={styles.tCmt}># テストカバレッジを向上させる</span>
                {"\n"}
                <span className={styles.tCmd}>/batch</span>{" "}
                <span className={styles.tStr}>テストカバレッジが 50% 以下のモジュールに</span>
                {"\n"}
                <span className={styles.tStr}>ユニットテストを追加</span>
              </code>
            </pre>
          </div>

          <h3>/loop の使い方</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton
                text={`/loop 5m テスト結果を確認して失敗しているテストを修正\n/loop ログを監視してエラーが出たら通知\n/loop`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># 5 分ごとにプロンプトを実行</span>
                {"\n"}
                <span className={styles.tCmd}>/loop</span> 5m{" "}
                <span className={styles.tStr}>テスト結果を確認して失敗しているテストを修正</span>
                {"\n\n"}
                <span className={styles.tCmt}># 間隔を省略すると Claude が自分でペースを決定</span>
                {"\n"}
                <span className={styles.tCmd}>/loop</span>{" "}
                <span className={styles.tStr}>ログを監視してエラーが出たら通知</span>
                {"\n\n"}
                <span className={styles.tCmt}>
                  # プロンプトを省略すると自律的なメンテナンスモードに
                </span>
                {"\n"}
                <span className={styles.tCmd}>/loop</span>
              </code>
            </pre>
          </div>
        </section>

        {/* SECTION 9 */}
        <section className={styles.section} id="mcp">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-plug-connected" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>09</span>
              <h2 className={styles.sectionTitle}>MCP インテグレーション</h2>
            </div>
          </div>

          <p className={styles.lead}>
            MCP（Model Context Protocol）サーバーを通じて、外部サービス（GitHub, Asana, Gmail
            など）と連携できます。
          </p>

          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>コマンド</th>
                <th>説明</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={matchSearch("/mcp MCP サーバーの状態を表示 管理") ? "" : styles.hidden}
              >
                <td>
                  <code>/mcp</code>
                </td>
                <td>MCP サーバーの状態を表示・管理</td>
              </tr>
              <tr
                className={
                  matchSearch("/mcp enable 指定した MCP サーバーを有効化") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/mcp enable [名前]</code>
                </td>
                <td>指定した MCP サーバーを有効化</td>
              </tr>
              <tr
                className={
                  matchSearch("/mcp disable 指定した MCP サーバーを無効化") ? "" : styles.hidden
                }
              >
                <td>
                  <code>/mcp disable [名前]</code>
                </td>
                <td>指定した MCP サーバーを無効化</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                使用例
              </span>
              <CodeCopyButton text={`/mcp\n/mcp enable github\n/mcp disable github`} />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># MCP サーバーの状態を確認</span>
                {"\n"}
                <span className={styles.tCmd}>/mcp</span>
                {"\n\n"}
                <span className={styles.tCmt}># GitHub MCP を有効化</span>
                {"\n"}
                <span className={styles.tCmd}>/mcp</span> enable github
                {"\n\n"}
                <span className={styles.tCmt}># 無効化</span>
                {"\n"}
                <span className={styles.tCmd}>/mcp</span> disable github
              </code>
            </pre>
          </div>

          <div className={`${styles.callout} ${styles.calloutInfo}`}>
            <i className={`ti ti-info-circle ${styles.calloutIcon}`} />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>MCP コマンドの拡張</div>
              <p>
                インストール済みのプラグインや接続済みの MCP
                サーバーは追加のスラッシュコマンドを提供することがあります。<code>/skills</code> や{" "}
                <code>/mcp</code> で現在有効なコマンドを確認してください。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 10 */}
        <section className={styles.section} id="custom">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-file-code" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>10</span>
              <h2 className={styles.sectionTitle}>カスタムコマンド / スキルの作り方</h2>
            </div>
          </div>

          <p className={styles.lead}>
            繰り返し使うタスクはカスタムコマンドとして保存することで、チーム全体で再利用できます。
          </p>

          <h3>ステップ 1: ディレクトリを作成</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                bash
              </span>
              <CodeCopyButton text={`mkdir -p .claude/commands\nmkdir -p ~/.claude/commands`} />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># プロジェクトスコープ（Git で共有される）</span>
                {"\n"}
                <span className={styles.tCmd}>mkdir</span> -p .claude/commands
                {"\n\n"}
                <span className={styles.tCmt}># 個人スコープ（全プロジェクトで使える）</span>
                {"\n"}
                <span className={styles.tCmd}>mkdir</span> -p ~/.claude/commands
              </code>
            </pre>
          </div>

          <h3>ステップ 2: Markdown ファイルを作成</h3>
          <p>
            ファイル名がそのままコマンド名になります（例: <code>optimize.md</code> →{" "}
            <code>/optimize</code>）。
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-file-text" />
                .claude/commands/optimize.md
              </span>
              <CodeCopyButton
                text={`このコードのパフォーマンス問題を分析してください：\n\n$ARGUMENTS\n\n各問題について以下を提示してください：\n1. 問題の説明\n2. 影響度（高 / 中 / 低）\n3. 具体的な修正案とサンプルコード`}
              />
            </div>
            <pre>
              <code>
                このコードのパフォーマンス問題を分析してください：
                {"\n\n"}
                <span className={styles.tKey}>$ARGUMENTS</span>
                {"\n\n"}
                各問題について以下を提示してください：{"\n"}
                1. 問題の説明{"\n"}
                2. 影響度（高 / 中 / 低）{"\n"}
                3. 具体的な修正案とサンプルコード
              </code>
            </pre>
          </div>

          <h3>ステップ 3: YAML フロントマターで設定（オプション）</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-file-text" />
                .claude/commands/security-scan.md（フロントマター付き）
              </span>
              <CodeCopyButton
                text={`---\ndescription: セキュリティ脆弱性スキャンを実行\nallowed-tools: Read, Grep, Glob, Bash, WebFetch\nmodel: claude-opus-4-7\nargument-hint: "[ブランチ名またはファイルパス]"\n---\n\n以下の観点でセキュリティ監査を実施してください：\n- SQL インジェクションのリスク\n- XSS 脆弱性\n- 認証・認可の問題\n- クレデンシャルの露出\n\n対象: $ARGUMENTS`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tKey}>---</span>
                {"\n"}
                <span className={styles.tKey}>description</span>: セキュリティ脆弱性スキャンを実行
                {"\n"}
                <span className={styles.tKey}>allowed-tools</span>: Read, Grep, Glob, Bash, WebFetch
                {"\n"}
                <span className={styles.tKey}>model</span>: claude-opus-4-7{"\n"}
                <span className={styles.tKey}>argument-hint</span>:{" "}
                <span className={styles.tStr}>&quot;[ブランチ名またはファイルパス]&quot;</span>
                {"\n"}
                <span className={styles.tKey}>---</span>
                {"\n\n"}
                以下の観点でセキュリティ監査を実施してください：{"\n"}- SQL インジェクションのリスク
                {"\n"}- XSS 脆弱性{"\n"}- 認証・認可の問題{"\n"}- クレデンシャルの露出
                {"\n\n"}
                対象: <span className={styles.tKey}>$ARGUMENTS</span>
              </code>
            </pre>
          </div>

          <h3>フロントマターの設定オプション</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>キー</th>
                <th>説明</th>
                <th>例</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("description コマンドの説明 メニューに表示") ? "" : styles.hidden
                }
              >
                <td>
                  <code>description</code>
                </td>
                <td>コマンドの説明（/ メニューに表示）</td>
                <td>
                  <code>&quot;セキュリティレビューを実行&quot;</code>
                </td>
              </tr>
              <tr
                className={matchSearch("allowed-tools 使用を許可するツール") ? "" : styles.hidden}
              >
                <td>
                  <code>allowed-tools</code>
                </td>
                <td>使用を許可するツール</td>
                <td>
                  <code>Read, Grep, Glob, Bash</code>
                </td>
              </tr>
              <tr className={matchSearch("model 使用するモデルを固定") ? "" : styles.hidden}>
                <td>
                  <code>model</code>
                </td>
                <td>使用するモデルを固定</td>
                <td>
                  <code>claude-opus-4-7</code>
                </td>
              </tr>
              <tr className={matchSearch("argument-hint 引数のヒント表示") ? "" : styles.hidden}>
                <td>
                  <code>argument-hint</code>
                </td>
                <td>引数のヒント表示</td>
                <td>
                  <code>&quot;[ファイルパス]&quot;</code>
                </td>
              </tr>
              <tr className={matchSearch("context コンテキストの扱い fork") ? "" : styles.hidden}>
                <td>
                  <code>context</code>
                </td>
                <td>コンテキストの扱い</td>
                <td>
                  <code>fork</code>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>スキル形式への移行（2026 年推奨）</h3>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-folder" />
                ディレクトリ構成
              </span>
              <CodeCopyButton
                text={`# 従来（引き続き動作）\n.claude/commands/review.md      →  /review\n\n# 推奨（スキル形式）\n.claude/skills/review/SKILL.md  →  /review\n\n# 同名の場合はスキルが優先`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># 従来（引き続き動作）</span>
                {"\n"}
                .claude/commands/review.md → <span className={styles.tCmd}>/review</span>
                {"\n\n"}
                <span className={styles.tCmt}># 推奨（スキル形式）</span>
                {"\n"}
                .claude/skills/review/SKILL.md → <span className={styles.tCmd}>/review</span>
                {"\n\n"}
                <span className={styles.tCmt}># 同名の場合はスキルが優先</span>
              </code>
            </pre>
          </div>

          <h3>引数の扱い</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>変数</th>
                <th>説明</th>
                <th>例</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={
                  matchSearch("$ARGUMENTS コマンド名の後ろに入力した全テキスト")
                    ? ""
                    : styles.hidden
                }
              >
                <td>
                  <code>$ARGUMENTS</code>
                </td>
                <td>コマンド名の後ろに入力した全テキスト</td>
                <td>
                  <code>/fix-issue 123 high</code> → <code>&quot;123 high&quot;</code>
                </td>
              </tr>
              <tr className={matchSearch("$1 $2 スペース区切りの引数") ? "" : styles.hidden}>
                <td>
                  <code>$1</code>, <code>$2</code>
                </td>
                <td>スペース区切りの引数</td>
                <td>
                  <code>/fix-issue 123 high</code> → <code>$1=123, $2=high</code>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 11 */}
        <section className={styles.section} id="best">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-star" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>11</span>
              <h2 className={styles.sectionTitle}>ベストプラクティス集</h2>
            </div>
          </div>

          <div
            className={styles.bestPractice}
            style={{
              display: matchSearch("BP-01 セッション開始時のルーティン status context compact")
                ? ""
                : "none",
            }}
          >
            <div className={styles.bpHeader}>
              <span className={styles.bpNum}>BP-01</span>
              <span className={styles.bpTitle}>セッション開始時のルーティン</span>
            </div>
            <div className={styles.mermaidWrap} style={{ margin: 0 }}>
              <MermaidDiagram chart={DIAG_6} />
            </div>
          </div>

          <div
            className={styles.bestPractice}
            style={{ display: matchSearch("BP-02 CLAUDE.md を育てる memory") ? "" : "none" }}
          >
            <div className={styles.bpHeader}>
              <span className={styles.bpNum}>BP-02</span>
              <span className={styles.bpTitle}>CLAUDE.md を育てる</span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
              プロジェクトのルール・禁止事項・よく使うコマンドを CLAUDE.md に蓄積します。Claude
              はセッション開始時に必ずこのファイルを読み込むため、毎回同じ説明をする必要がなくなります。
              <code>/memory</code> コマンドで随時更新できます。
            </p>
          </div>

          <div
            className={styles.bestPractice}
            style={{
              display: matchSearch("BP-03 100 ファイル以上の変更は /batch を使う") ? "" : "none",
            }}
          >
            <div className={styles.bpHeader}>
              <span className={styles.bpNum}>BP-03</span>
              <span className={styles.bpTitle}>100 ファイル以上の変更は /batch を使う</span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
              並列エージェントが独立した git worktree
              で作業するためコンフリクトが少なく、各ユニットに PR
              が作られるのでレビューも容易になります。大規模リファクタリングには必須です。
            </p>
          </div>

          <div
            className={styles.bestPractice}
            style={{
              display: matchSearch("BP-04 セキュリティコードには必ず /security-review")
                ? ""
                : "none",
            }}
          >
            <div className={styles.bpHeader}>
              <span className={styles.bpNum}>BP-04</span>
              <span className={styles.bpTitle}>セキュリティコードには必ず /security-review</span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
              認証・認可・外部入力処理などセキュリティに関わる変更を行った後は、PR
              をマージする前に必ず <code>/security-review</code>{" "}
              を実行します。インジェクション・XSS・クレデンシャル露出を自動でチェックします。
            </p>
          </div>

          <div
            className={styles.bestPractice}
            style={{
              display: matchSearch("BP-05 チームのワークフローはカスタムコマンドにする")
                ? ""
                : "none",
            }}
          >
            <div className={styles.bpHeader}>
              <span className={styles.bpNum}>BP-05</span>
              <span className={styles.bpTitle}>チームのワークフローはカスタムコマンドにする</span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
              繰り返し実行するセキュリティレビュー・デプロイチェック・コードスタイル確認などは{" "}
              <code>.claude/commands/</code> にカスタムコマンドとして保存し、Git
              で共有します。チーム全体のレビュー品質が均一になります。
            </p>
          </div>

          <div
            className={styles.bestPractice}
            style={{
              display: matchSearch("BP-06 名前付きセッションで文脈を管理する resume") ? "" : "none",
            }}
          >
            <div className={styles.bpHeader}>
              <span className={styles.bpNum}>BP-06</span>
              <span className={styles.bpTitle}>名前付きセッションで文脈を管理する</span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
              複数の機能を並行開発する際は <code>claude -n &quot;feature-xxx&quot;</code>{" "}
              で名前付きセッションを使います。<code>/resume &quot;feature-xxx&quot;</code>{" "}
              で過去の作業文脈をそのまま引き継げます。
            </p>
          </div>
        </section>

        {/* SECTION 12 */}
        <section className={styles.section} id="workflow">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-route" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>12</span>
              <h2 className={styles.sectionTitle}>実践ワークフロー</h2>
            </div>
          </div>

          <h3>ワークフロー A: 新機能開発</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_7} />
            <div className={styles.mermaidCaption}>図: ワークフロー A — 新機能開発</div>
          </div>

          <h3>ワークフロー B: バグ修正</h3>
          <div
            className={styles.codeBlock}
            style={{
              display: matchSearch("ワークフロー B: バグ修正 --from-pr /security-review")
                ? ""
                : "none",
            }}
          >
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                bash — バグ修正セッション
              </span>
              <CodeCopyButton
                text={`claude --from-pr 456\n# バグを分析・修正・テスト（通常のプロンプト）\n"TypeError: Cannot read property 'id' of undefined の原因を調査して修正して"\n/security-review`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># バグのある PR と紐づけてセッション開始</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> --from-pr 456
                {"\n\n"}
                <span className={styles.tCmt}># バグを分析・修正・テスト（通常のプロンプト）</span>
                {"\n"}
                <span className={styles.tStr}>
                  &quot;TypeError: Cannot read property 'id' of undefined
                  の原因を調査して修正して&quot;
                </span>
                {"\n\n"}
                <span className={styles.tCmt}># 修正後にセキュリティも確認</span>
                {"\n"}
                <span className={styles.tCmd}>/security-review</span>
              </code>
            </pre>
          </div>

          <h3>ワークフロー C: 大規模リファクタリング</h3>
          <div className={styles.mermaidWrap}>
            <MermaidDiagram chart={DIAG_8} />
            <div className={styles.mermaidCaption}>
              図: ワークフロー C — /batch を使った大規模リファクタリング
            </div>
          </div>

          <h3>ワークフロー D: CI/CD での自動実行</h3>
          <div
            className={styles.codeBlock}
            style={{
              display: matchSearch(
                "ワークフロー D: CI/CD での自動実行 /code-review /security-scan --bare --output-format json"
              )
                ? ""
                : "none",
            }}
          >
            <div className={styles.codeBlockHeader}>
              <span className={styles.codeBlockLang}>
                <i className="ti ti-terminal" />
                bash — CI パイプラインでの利用
              </span>
              <CodeCopyButton
                text={`claude -p "/code-review" --max-turns 5 --output-format json\nclaude -p "/security-scan src/auth/" --bare\nclaude -p "テストを実行してカバレッジを報告" --output-format json --max-turns 10`}
              />
            </div>
            <pre>
              <code>
                <span className={styles.tCmt}># ノンインタラクティブでコードレビューを実行</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> <span className={styles.tFlag}>-p</span>{" "}
                <span className={styles.tStr}>&quot;/code-review&quot;</span> --max-turns 5
                --output-format json
                {"\n\n"}
                <span className={styles.tCmt}># 特定のファイルを対象にセキュリティスキャン</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> <span className={styles.tFlag}>-p</span>{" "}
                <span className={styles.tStr}>&quot;/security-scan src/auth/&quot;</span> --bare
                {"\n\n"}
                <span className={styles.tCmt}># 結果を JSON で出力して CI ツールで処理</span>
                {"\n"}
                <span className={styles.tCmd}>claude</span> <span className={styles.tFlag}>-p</span>{" "}
                <span className={styles.tStr}>&quot;テストを実行してカバレッジを報告&quot;</span> \
                {"\n"}
                {"  "}--output-format json --max-turns 10
              </code>
            </pre>
          </div>
        </section>

        {/* SECTION 13 */}
        <section className={styles.section} id="sources">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <i className="ti ti-books" />
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionNum}>13</span>
              <h2 className={styles.sectionTitle}>参考ソース</h2>
            </div>
          </div>

          <p className={styles.lead}>
            本ガイドは以下のソースをもとに作成しています。Claude Code
            は頻繁に更新されるため、最新情報は公式ドキュメントを参照してください。
          </p>

          <div className={styles.sourceList}>
            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("Anthropic 公式 Claude Code リリースノート release-notes")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-shield-check" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>Anthropic 公式 — Claude Code リリースノート</div>
                <div className={styles.sourceHref}>
                  <Ext href="https://docs.anthropic.com/en/release-notes/claude-code">
                    https://docs.anthropic.com/en/release-notes/claude-code
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-31</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("Claude Agent SDK Slash Commands 公式ドキュメント agent-sdk")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-shield-check" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  Claude Agent SDK — Slash Commands 公式ドキュメント
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://code.claude.com/docs/en/agent-sdk/slash-commands">
                    https://code.claude.com/docs/en/agent-sdk/slash-commands
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-31</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("Blake Crosley Claude Code Cheat Sheet cheetsheet")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-file-text" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  Blake Crosley — Claude Code Cheat Sheet (v2.1.150)
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://blakecrosley.com/guides/claude-code-cheatsheet">
                    https://blakecrosley.com/guides/claude-code-cheatsheet
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-24</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("ScriptByAI Claude Code Commands Cheat Sheet") ? "" : "none",
              }}
            >
              <i className="ti ti-file-text" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  ScriptByAI — Claude Code Commands Cheat Sheet 2026
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://www.scriptbyai.com/claude-code-commands-cheat-sheet/">
                    https://www.scriptbyai.com/claude-code-commands-cheat-sheet/
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-30</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("Emrah Kondur Medium Complete Guide to Slash Commands ekondur")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-file-text" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  Emrah Kondur (Medium) — Complete Guide to Slash Commands May 2026
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://medium.com/@ekondur/the-complete-guide-to-claude-code-slash-commands-may-2026-48a127aef832">
                    https://medium.com/@ekondur/the-complete-guide-to-claude-code-slash-commands-may-2026-48a127aef832
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-07</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("AiOps School Master Tutorial Every Claude Code Slash Command")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-file-text" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  AiOps School — Master Tutorial: Every Claude Code Slash Command (April 2026)
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://aiopsschool.com/blog/the-master-tutorial-every-claude-code-slash-command-explained-april-2026-edition/">
                    https://aiopsschool.com/blog/the-master-tutorial-every-claude-code-slash-command-explained-april-2026-edition/
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-04-25</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("Hidekazu Konishi Claude Code Features and Settings Reference")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-file-text" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  Hidekazu Konishi — Claude Code Features and Settings Reference 2026
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://hidekazu-konishi.com/entry/claude_code_features_settings_reference_2026.html">
                    https://hidekazu-konishi.com/entry/claude_code_features_settings_reference_2026.html
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-16</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch(
                  "Tim Dietrich Complete Developer Guide to Claude Code Commands"
                )
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-file-text" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  Tim Dietrich — Complete Developer&apos;s Guide to Claude Code Commands
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://timdietrich.me/blog/claude-code-commands-guide/">
                    https://timdietrich.me/blog/claude-code-commands-guide/
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-03-02</span>
            </div>

            <div
              className={styles.sourceRow}
              style={{
                display: matchSearch("luongnv89/claude-howto Slash Commands README GitHub")
                  ? ""
                  : "none",
              }}
            >
              <i className="ti ti-brand-github" />
              <div className={styles.sourceInfo}>
                <div className={styles.sourceName}>
                  luongnv89/claude-howto — Slash Commands README (GitHub)
                </div>
                <div className={styles.sourceHref}>
                  <Ext href="https://github.com/luongnv89/claude-howto/blob/main/01-slash-commands/README.md">
                    https://github.com/luongnv89/claude-howto/blob/main/01-slash-commands/README.md
                  </Ext>
                </div>
              </div>
              <span className={styles.sourceDate}>2026-05-31</span>
            </div>
          </div>

          <div
            className={`${styles.callout} ${styles.calloutWarning}`}
            style={{ marginTop: "20px" }}
          >
            <i className={`ti ti-alert-triangle ${styles.calloutIcon}`} />
            <div className={styles.calloutBody}>
              <div className={styles.calloutTitle}>バージョン差異について</div>
              <p>
                Claude Code は頻繁にアップデートされます。セッション内で <code>/help</code>{" "}
                を実行し、現在のバージョンで使用可能なコマンドの一覧を確認することを推奨します。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
