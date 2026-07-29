import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Antigravity CLI 完全ガイド — 全コマンド & ベストプラクティス",
  description:
    "Antigravity CLI (agy) の全スラッシュコマンド、キーバインド、設定ファイル (settings.json)、自動化・CI/CD連携、セキュリティモデルを包括的に解説した完全ガイド。",
};

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const DIAG_1 = `graph TD
  Harness["共有エージェントハーネス<br />Shared Agent Harness"]
  CLI["Antigravity CLI<br />ターミナルTUI・Go実装"]
  GUI["Antigravity 2.0<br />デスクトップGUI"]
  IDE["Antigravity IDE<br />VS Codeフォーク"]
  SDK["Antigravity SDK<br />Python製カスタムエージェント基盤"]

  Harness --> CLI
  Harness --> GUI
  Harness --> IDE
  Harness --> SDK
  CLI -.->|設定・権限を同期| GUI
  GUI -.->|会話をインポート| CLI`;

const DIAG_2 = `sequenceDiagram
  participant User as 開発者
  participant CLI as Antigravity CLI
  participant Keyring as OSキーリング
  participant Browser as ブラウザ

  User->>CLI: agy を起動
  CLI->>Keyring: 保存済みトークンを確認
  alt トークンあり
    Keyring-->>CLI: トークンを返却
    CLI-->>User: サイレントログイン完了
  else トークンなし(ローカル環境)
    CLI->>Browser: 既定ブラウザを自動起動
    Browser-->>User: Googleアカウントでサインイン
    User-->>CLI: 認証完了・トークン保存
  else トークンなし(SSHリモート環境)
    CLI-->>User: 認証用URLをターミナルに表示
    User->>Browser: URLをローカルPCで開く
    Browser-->>User: 認証コードを表示
    User-->>CLI: コードをターミナルに貼り付け
  end`;

const DIAG_3 = `stateDiagram-v2
  [*] --> mode_default
  state "通常モード" as mode_default
  state "accept-edits" as accept_edits
  state "plan" as plan_mode

  mode_default --> accept_edits: Shift+Tab
  accept_edits --> plan_mode: Shift+Tab
  plan_mode --> mode_default: Shift+Tab`;

const DIAG_4 = `flowchart LR
  VCS["VCSモード<br />未コミット・未追跡ファイル一覧<br />Git/Hg/JJ対応"] -- Tab --> Turn["Turnモード<br />会話ターンごとの変更差分"]
  Turn -- Tab --> Commit["Commitモード<br />インタラクティブなコミットグラフ"]
  Commit -- Tab --> VCS`;

const DIAG_5 = `stateDiagram-v2
  [*] --> running
  running --> done: 正常終了
  running --> error: 実行時エラー
  running --> killed: ユーザーが k で強制終了
  done --> [*]
  error --> [*]
  killed --> [*]`;

const DIAG_6 = `flowchart TD
  A["エージェントがツール実行を要求"] --> B{"toolPermission 設定"}
  B -->|"request-review 既定"| C["書込み・bash・ネット呼び出しを都度確認"]
  B -->|"proceed-in-sandbox"| D{"サンドボックス内で安全に実行可能か"}
  D -->|"安全"| E["自動実行"]
  D -->|"要注意"| C
  B -->|"always-proceed"| F["確認なしで常に実行"]
  B -->|"strict"| G["読み取り以外は全て確認"]`;

const DIAG_7 = `flowchart LR
  Trigger["PR作成 / pushイベント"] --> Hook["CIジョブが agy -p を実行"]
  Hook --> Review["diffレビュー・テスト実行"]
  Review --> Comment["結果をPRコメントとして投稿"]`;

const DIAG_8 = `flowchart LR
  Explore["① 探索<br />該当箇所の調査・仕様確認"] --> Plan["② 計画<br />Implementation Plan作成"]
  Plan --> Approve{"承認する?"}
  Approve -->|"No 要修正"| Plan
  Approve -->|"Yes"| Execute["③ 実行<br />コード変更を適用"]
  Execute --> Verify["④ 検証<br />テスト・ビルド実行"]
  Verify -->|"失敗"| Execute
  Verify -->|"成功"| Done["完了"]`;

export default function AntigravityCliGuidePage() {
  return (
    <div className={styles.layout}>
      <TocObserver />
      <div className={styles.shell}>
        {/* SIDEBAR TOC */}
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className={styles.brandBadge}>CLI Reference</span>
            <span className={styles.brandTitle}>Antigravity CLI</span>
          </div>
          <nav className={styles.toc}>
            <div className={styles.tocGroupHeader}>目次</div>
            <a href="#overview" className={styles.tocLink}>
              <span className={styles.tocNum}>00</span>概要 & アーキテクチャ
            </a>
            <a href="#install" className={styles.tocLink}>
              <span className={styles.tocNum}>01</span>インストール & 認証
            </a>
            <a href="#start" className={styles.tocLink}>
              <span className={styles.tocNum}>02</span>初回起動 & 基本操作
            </a>
            <a href="#modes" className={styles.tocLink}>
              <span className={styles.tocNum}>03</span>実行モード
            </a>
            <a href="#commands" className={styles.tocLink}>
              <span className={styles.tocNum}>04</span>スラッシュコマンド
            </a>
            <a href="#details" className={styles.tocLink}>
              <span className={styles.tocNum}>05</span>主要コマンド詳細
            </a>
            <a href="#keybindings" className={styles.tocLink}>
              <span className={styles.tocNum}>06</span>キーボードショートカット
            </a>
            <a href="#settings" className={styles.tocLink}>
              <span className={styles.tocNum}>07</span>settings.json 設定
            </a>
            <a href="#permissions" className={styles.tocLink}>
              <span className={styles.tocNum}>08</span>権限 & サンドボックス
            </a>
            <a href="#mcp" className={styles.tocLink}>
              <span className={styles.tocNum}>09</span>MCP サーバー連携
            </a>
            <a href="#extend" className={styles.tocLink}>
              <span className={styles.tocNum}>10</span>Skills & Plugins & Hooks
            </a>
            <a href="#automation" className={styles.tocLink}>
              <span className={styles.tocNum}>11</span>自動化 & CI/CD
            </a>
            <a href="#practices" className={styles.tocLink}>
              <span className={styles.tocNum}>12</span>ベストプラクティス
            </a>
            <a href="#troubleshoot" className={styles.tocLink}>
              <span className={styles.tocNum}>13</span>トラブルシューティング
            </a>
            <a href="#security" className={styles.tocLink}>
              <span className={styles.tocNum}>14</span>セキュリティ
            </a>
            <a href="#references" className={styles.tocLink}>
              <span className={styles.tocNum}>15</span>参考文献 / ソース
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <div className={styles.hero}>
            <span className={styles.eyebrow}>
              <span className={styles.dot} />
              UPDATED THROUGH JULY 28, 2026
            </span>
            <h1 className={styles.title}>
              Antigravity CLI
              <br />
              完全ガイド
            </h1>
            <p className={styles.subtitle}>
              全スラッシュコマンド・キーバインド・設定・自動化を、中級〜上級開発者向けにステップバイステップで解説。公式ドキュメントと著名開発者の一次情報にもとづく実務リファレンス。
            </p>

            <div className={styles.term}>
              <div className={styles.termBar}>
                <span className={`${styles.termDot} ${styles.termDotR}`} />
                <span className={`${styles.termDot} ${styles.termDotY}`} />
                <span className={`${styles.termDot} ${styles.termDotG}`} />
                <span className={styles.termTitle}>~/projects/my-app — agy</span>
              </div>
              <div className={styles.termBody}>
                <p className={styles.termLine}>
                  <span className={styles.termPrompt}>❯</span> agy --mode=plan
                </p>
                <p className={`${styles.termLine} ${styles.termOut}`}>
                  Antigravity CLI へようこそ。共有エージェントハーネスに接続中…
                </p>
                <p className={`${styles.termLine} ${styles.termOut}`}>
                  [plan] コードベースを調査し、実装計画を作成しています…
                </p>
                <p className={styles.termLine}>
                  <span className={styles.termPrompt}>❯</span>{" "}
                  <span className={styles.caret} />
                </p>
              </div>
            </div>

            <div className={styles.metaLine}>
              <span>
                <b>対象:</b> Antigravity CLI (agy) v1.1.x
              </span>
              <span>
                <b>形式:</b> 全コマンドリファレンス + ベストプラクティス
              </span>
              <span>
                <b>図解:</b> Mermaid
              </span>
            </div>
          </div>

          <div className="content-wrap">
            {/* 00 OVERVIEW */}
            <section id="overview" className={styles.section}>
              <h2>
                <span className={styles.idx}>00 /</span> 概要 & アーキテクチャ
              </h2>
              <p>
                Antigravity CLI (<code>agy</code>) は、Google が 2026 年 5 月に発表した Terminal UI (TUI) 型のエージェント型コーディングツールです。旧 Gemini CLI の後継にあたり、Go 言語で実装されています。最大の特徴は、Antigravity 2.0 (デスクトップ GUI) ・ Antigravity IDE (VS Code フォーク) ・ Antigravity SDK (Python) と<strong>「共有エージェントハーネス」</strong>を利用する点です。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_1} id="diag-1" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図1: Antigravity 製品群の共有ハーネス構成
                </div>
              </div>

              <p>
                同じハーネスを使っているため、<strong>推論エンジンの改善は CLI と GUI 双方に自動反映</strong>され、パーミッション設定なども共有されます (会話履歴自体は既定では共有されません)。本ガイドでは、インストールから日常運用、自動化、トラブルシューティングまでを実務で使う順に沿って解説します。
              </p>
            </section>

            {/* 01 INSTALL */}
            <section id="install" className={styles.section}>
              <h2>
                <span className={styles.idx}>01 /</span> インストール & 認証
              </h2>

              <h3>インストールコマンド</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>OS</th>
                      <th>コマンド</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>macOS / Linux</td>
                      <td>
                        <code>curl -fsSL https://antigravity.google/cli/install.sh | bash</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Windows (PowerShell)</td>
                      <td>
                        <code>irm https://antigravity.google/cli/install.ps1 | iex</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Windows (CMD)</td>
                      <td>
                        <code>curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                既定のインストール先: macOS/Linux は <code>~/.local/bin/agy</code>、Windows は <code>C:\Users\&lt;Username&gt;\AppData\Local\agy\bin</code>。
              </p>

              <h4>インストールスクリプトのフラグ</h4>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>フラグ</th>
                      <th>効果</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>--skip-aliases</code></td>
                      <td>旧 <code>agy</code>/<code>antigravity</code> シェルエイリアスの整理をスキップ</td>
                    </tr>
                    <tr>
                      <td><code>--skip-path</code></td>
                      <td>シェルプロファイルへの <code>PATH</code> 追記をスキップ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`${styles.callout} ${styles.calloutInfo}`}>
                <div className={styles.calloutTitle}>TIP</div>
                <p>
                  <code>agy: command not found</code> になる場合は <code>~/.bashrc</code> または <code>~/.zshrc</code> に <code>export PATH="~/.local/bin:$PATH"</code> を追記し <code>source</code> し直してください。
                </p>
              </div>

              <h3>認証フロー</h3>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_2} id="diag-2" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図2: ローカル / SSH 環境別の認証シーケンス
                </div>
              </div>

              <p>
                CLI は macOS の Keychain、Linux の Secret Service (D-Bus)、Windows Credential Manager など OS 標準のセキュアストレージにトークンを保存します。エンタープライズ利用時はオンボーディング時に GCP プロジェクトを接続してください。ログアウトは以下で行います。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>ログアウト</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/logout</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 02 START */}
            <section id="start" className={styles.section}>
              <h2>
                <span className={styles.idx}>02 /</span> 初回起動 & プロジェクトの基本操作
              </h2>
              <p>プロジェクトディレクトリに移動して起動するだけです。</p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>起動コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>cd</span>
                    <span className={styles.cv}> ~/my-project</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                  </div>
                </div>
              </div>

              <p>
                初回起動時にカラースキーム・レンダリングモード (Alt-Screen / Inline) ・ワークスペースの信頼設定などをウィザード形式で聞かれます。
              </p>

              <div className={styles.callout}>
                <div className={styles.calloutTitle}>TIPS</div>
                <p>
                  プロジェクトを 1 つの親フォルダにまとめておくと、そのフォルダ配下であれば毎回パーミッション確認なしにエージェントがアクセスできるようになり、複数プロジェクトを横断する指示 (「Aのこの機能をBにも適用して」等) がスムーズになります。
                </p>
              </div>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>推奨ディレクトリ構造</span>
                  <span className={styles.codeLang}>Text</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>~/Desktop/antigravity-projects/</div>
                  <div className={styles.codeLine}>├── project-a/</div>
                  <div className={styles.codeLine}>└── project-b/</div>
                </div>
              </div>
            </section>

            {/* 03 MODES */}
            <section id="modes" className={styles.section}>
              <h2>
                <span className={styles.idx}>03 /</span> 実行モード (Execution Modes)
              </h2>
              <p>
                Antigravity CLI には 3 つの実行モードがあり、<strong>エージェントの自律性と開発者のレビュー負荷のトレードオフ</strong>を調整します。
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>モード</th>
                      <th>挙動</th>
                      <th>向いている場面</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>default</code></td>
                      <td>ファイル作成・変更の都度、差分プレビューで確認を求める</td>
                      <td>標準的な開発、機微なコードの慎重なレビュー</td>
                    </tr>
                    <tr>
                      <td><code>accept-edits</code></td>
                      <td>ファイルの作成・編集・置換を自動承認</td>
                      <td>高速なプロトタイピング、信頼済みコードの反復</td>
                    </tr>
                    <tr>
                      <td><code>plan</code></td>
                      <td>プロンプトに <code>/plan</code> を自動付与し、変更前に調査・計画を提示</td>
                      <td>未知のアーキテクチャ調査、複雑な複数ファイル変更の設計</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_3} id="diag-3" maxHeight="460px" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図3: Shift+Tab による実行モードの循環
                </div>
              </div>

              <div className={`${styles.callout} ${styles.calloutWarn}`}>
                <div className={styles.calloutTitle}>注意</div>
                <p>
                  <code>command(git)</code> のようなシェルコマンド実行の可否は、実行モードに関係なく常に <code>/permissions</code> の設定 (または <code>--dangerously-skip-permissions</code>) が優先されます。実行モードはあくまで「ファイル書き込み」の自動承認に関わる設定です。
                </p>
              </div>

              <h3>モードの起動・切り替え方法</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>モード指定起動</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 既定モードで起動 (差分レビューあり)</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 編集を自動承認するモードで起動</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> --mode=accept-edits</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 計画優先モードで起動</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> --mode=plan</span>
                  </div>
                </div>
              </div>

              <p>
                セッション中に切り替える場合は <code>Shift+Tab</code> を押すだけで循環します。恒久的な既定値は <code>/config</code> (<code>/settings</code>) から変更するか、<code>settings.json</code> に以下を書きます。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>settings.json</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"agentMode"</span>:{" "}
                    <span className={styles.cs}>"accept-edits"</span>
                  </div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>

              <div className={`${styles.callout} ${styles.calloutWarn}`}>
                <div className={styles.calloutTitle}>既知の不整合</div>
                <p>
                  公式の「Choose an execution mode」ドキュメントによれば、<strong>旧来の <code>/planning</code> と <code>/fast</code> スラッシュコマンドは v1.1.0 で廃止 (vestigial)</strong> となり、現在は <code>Shift+Tab</code> によるモード循環、または <code>/plan</code> をプロンプト先頭に付ける方式に統一されています。一方で同時期に取得した CLI リファレンス表にはまだ <code>/fast</code>・<code>/planning</code> の記載が残っており、ドキュメント間で不整合が見られました。実運用では <code>/help</code> または <code>agy --help</code> で手元のバージョンの正式な挙動を必ず確認してください。
                </p>
              </div>

              <h3><code>default</code> モードでの差分レビュー操作</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>y</code></td>
                      <td>変更を承認してディスクに保存</td>
                    </tr>
                    <tr>
                      <td><code>n</code></td>
                      <td>変更を拒否して既存ファイルを維持</td>
                    </tr>
                    <tr>
                      <td><code>f</code></td>
                      <td>フルスクリーンのスクロール可能な差分ビュー (前後 3 行のコンテキスト付き) を開く</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+G</code></td>
                      <td><code>$EDITOR</code> でファイルを開き手動編集</td>
                    </tr>
                    <tr>
                      <td>入力後 <code>Enter</code></td>
                      <td>変更を拒否しつつ、修正指示をそのままエージェントへ送信</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 04 COMMANDS */}
            <section id="commands" className={styles.section}>
              <h2>
                <span className={styles.idx}>04 /</span> スラッシュコマンド 全リファレンス
              </h2>
              <p>
                <code>/</code> を入力するとタイプアヘッド候補メニューが開きます。以下は公式リファレンスに掲載されている全 31 個の中核コマンド一覧です。
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>コマンド</th>
                      <th>カテゴリ</th>
                      <th>エイリアス</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>/add-dir &lt;path&gt;</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>アクティブなワークスペースにディレクトリを追加</td>
                    </tr>
                    <tr>
                      <td><code>/agents</code></td>
                      <td>ツール・タスク</td>
                      <td>—</td>
                      <td>エージェントマネージャーパネル (カスタムエージェント切替・サブエージェント監視)</td>
                    </tr>
                    <tr>
                      <td><code>/artifact</code></td>
                      <td>ツール・タスク</td>
                      <td>—</td>
                      <td>Artifact Review パネル (実装計画・ウォークスルー) を開く</td>
                    </tr>
                    <tr>
                      <td><code>/btw &lt;query&gt;</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>メイン会話を中断せずバックグラウンドで別質問</td>
                    </tr>
                    <tr>
                      <td><code>/clear</code></td>
                      <td>ユーティリティ</td>
                      <td><code>/new</code></td>
                      <td>ターミナルをクリアし会話コンテキストをリセット</td>
                    </tr>
                    <tr>
                      <td><code>/config</code></td>
                      <td>設定</td>
                      <td><code>/settings</code></td>
                      <td>インタラクティブな設定エディタを開く</td>
                    </tr>
                    <tr>
                      <td><code>/context</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>コンテキスト使用量の可視化パネル</td>
                    </tr>
                    <tr>
                      <td><code>/copy</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>直近のエージェント応答をクリップボードにコピー</td>
                    </tr>
                    <tr>
                      <td><code>/credits</code></td>
                      <td>アカウント</td>
                      <td>—</td>
                      <td>AI Premium クレジット残高と購入リンクを表示</td>
                    </tr>
                    <tr>
                      <td><code>/diff</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>インタラクティブ差分ビューア (VCS / Turn / Commit)</td>
                    </tr>
                    <tr>
                      <td><code>/exit</code></td>
                      <td>コア</td>
                      <td><code>/quit</code></td>
                      <td>TUI セッションを終了</td>
                    </tr>
                    <tr>
                      <td><code>/fast</code> (廃止予定)</td>
                      <td>設定</td>
                      <td>—</td>
                      <td>推論プランをバイパスする高速モード</td>
                    </tr>
                    <tr>
                      <td><code>/feedback</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>フィードバック送信パネル</td>
                    </tr>
                    <tr>
                      <td><code>/fork</code></td>
                      <td>会話</td>
                      <td><code>/branch</code></td>
                      <td>現在の会話を新しい並行セッションに複製</td>
                    </tr>
                    <tr>
                      <td><code>/help</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>コマンド・ショートカット一覧のヘルプパネル</td>
                    </tr>
                    <tr>
                      <td><code>/hooks</code></td>
                      <td>ツール・タスク</td>
                      <td>—</td>
                      <td>実行中の pre/post-format フックを閲覧</td>
                    </tr>
                    <tr>
                      <td><code>/keybindings</code></td>
                      <td>設定</td>
                      <td>—</td>
                      <td>キーボードショートカットエディタ</td>
                    </tr>
                    <tr>
                      <td><code>/logout</code></td>
                      <td>アカウント</td>
                      <td>—</td>
                      <td>認証情報を破棄しサインアウト</td>
                    </tr>
                    <tr>
                      <td><code>/mcp</code></td>
                      <td>ツール・タスク</td>
                      <td>—</td>
                      <td>MCP サーバーマネージャー</td>
                    </tr>
                    <tr>
                      <td><code>/model</code></td>
                      <td>設定</td>
                      <td>—</td>
                      <td>使用する推論モデルを選択 (セッション間で永続化)</td>
                    </tr>
                    <tr>
                      <td><code>/open &lt;path&gt;</code></td>
                      <td>ユーティリティ</td>
                      <td>—</td>
                      <td>指定パスを既定エディタで開く</td>
                    </tr>
                    <tr>
                      <td><code>/permissions</code></td>
                      <td>設定</td>
                      <td>—</td>
                      <td>ツール許可ルールのインタラクティブ管理パネル</td>
                    </tr>
                    <tr>
                      <td><code>/planning</code> (廃止予定)</td>
                      <td>設定</td>
                      <td>—</td>
                      <td>複数ターンの計画生成モード</td>
                    </tr>
                    <tr>
                      <td><code>/rename &lt;name&gt;</code></td>
                      <td>会話</td>
                      <td>—</td>
                      <td>現在のセッションに名前を付ける</td>
                    </tr>
                    <tr>
                      <td><code>/resume</code></td>
                      <td>会話</td>
                      <td><code>/switch</code>, <code>/conversation</code></td>
                      <td>過去の会話を一覧・検索・再開</td>
                    </tr>
                    <tr>
                      <td><code>/rewind</code></td>
                      <td>会話</td>
                      <td><code>/undo</code></td>
                      <td>会話履歴を過去の状態に巻き戻す</td>
                    </tr>
                    <tr>
                      <td><code>/skills</code></td>
                      <td>ツール・タスク</td>
                      <td>—</td>
                      <td>ロード済みのローカル/グローバル Agent Skills を閲覧</td>
                    </tr>
                    <tr>
                      <td><code>/statusline</code></td>
                      <td>設定</td>
                      <td>—</td>
                      <td>ステータスバーのカスタマイズ</td>
                    </tr>
                    <tr>
                      <td><code>/tasks</code></td>
                      <td>ツール・タスク</td>
                      <td>—</td>
                      <td>バックグラウンドシェル実行ログのタスクマネージャー</td>
                    </tr>
                    <tr>
                      <td><code>/title [on/off]</code></td>
                      <td>設定</td>
                      <td>—</td>
                      <td>ターミナルウィンドウタイトル更新のオン・オフ</td>
                    </tr>
                    <tr>
                      <td><code>/usage</code></td>
                      <td>ユーティリティ</td>
                      <td><code>/quota</code></td>
                      <td>モデルクォータ使用量の表示</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>追加で確認されたコマンド (公式 Codelab・チュートリアル由来)</h3>
              <p>
                Google Codelabs のハンズオン教材では、上表には無い以下のプロンプト接頭辞・コマンドが紹介されています。挙動が確認できるまでは <code>/help</code> での併用確認を推奨します。
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>コマンド</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>/goal &lt;指示&gt;</code></td>
                      <td>指定したゴールが完全に達成されるまでエージェントが自律的に反復実行し続ける (テスト全通過まで自己修復するようなタスクに有効)</td>
                    </tr>
                    <tr>
                      <td><code>/plan &lt;指示&gt;</code></td>
                      <td>UI やアーキテクチャのリファクタリングなど複雑な変更の前に、まず実装計画 (Implementation Plan) を提示させる</td>
                    </tr>
                    <tr>
                      <td><code>/grill-me &lt;指示&gt;</code></td>
                      <td>実装前にインタビュー形式で要件・デザインの選択肢を 1 問ずつ確認してくれる、詳細な壁打ちプランニング</td>
                    </tr>
                    <tr>
                      <td><code>! &lt;shellコマンド&gt;</code></td>
                      <td>Bash モード。<code>!</code> を先頭に付けるとエージェントを介さず直接シェルコマンドを実行 (例: <code>! git status</code>)</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+B</code></td>
                      <td>実行中の長時間タスクをバックグラウンドに送る</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 05 DETAILS */}
            <section id="details" className={styles.section}>
              <h2>
                <span className={styles.idx}>05 /</span> 主要コマンドの詳細ステップ
              </h2>

              <h3 id="d-permissions"><code>/permissions</code> — パーミッション管理</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/permissions</span>
                  </div>
                </div>
              </div>
              <ol>
                <li>
                  <strong>スコープピッカー</strong>: <code>Project</code> (現在のプロジェクトのみ) / <code>Shared</code> (全 Antigravity 製品共通) / <code>Global</code> (全セッション共通) から選択 (<code>↑/↓</code>, <code>Enter</code>)。
                </li>
                <li>
                  <strong>ルールビューア</strong>: <code>←/→</code> (または <code>Tab</code>) で <code>allowlist</code> / <code>denylist</code> / <code>asklist</code> タブを切替。<code>a</code> で追加、<code>e</code> (または <code>Ctrl+G</code>) で編集、<code>d</code> (または <code>Backspace</code>) で削除。
                </li>
                <li>
                  <strong>ルール追加/編集</strong>: <code>action(target)</code> 形式で入力 (例: <code>command(git)</code>, <code>read_file(/path/to/dir)</code>)。<code>Enter</code> で保存。
                </li>
              </ol>
              <div className={`${styles.callout} ${styles.calloutInfo}`}>
                <div className={styles.calloutTitle}>TIP</div>
                <p>
                  ワークスペース外のファイルにエージェントがアクセスするたびに確認を求められるのが煩わしい場合、<code>settings.json</code> に直接 <code>permissions.allow</code> を追記すると快適です。パスマッチングは再帰的なので、ディレクトリを 1 つ許可すれば配下すべてに適用されます。<code>write_file</code> は <code>read_file</code> を包含します。
                </p>
              </div>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>settings.json (permissions 例)</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"permissions"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"allow"</span>: [
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.cs}>"read_file(/Users/you/Desktop/projects/my-app)"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.cs}>"write_file(/Users/you/.gemini/config/mcp_config.json)"</span>
                  </div>
                  <div className={styles.codeLine}>{"    "}]</div>
                  <div className={styles.codeLine}>{"  "}&#125;</div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>

              <h3 id="d-diff"><code>/diff</code> — インタラクティブ差分ビューア</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/diff</span>
                  </div>
                </div>
              </div>
              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_4} id="diag-4" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図4: /diff の 3 モード循環
                </div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ビュー</th>
                      <th>主なキー操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ファイル一覧 (VCS/Turn)</td>
                      <td><code>↑/↓</code> 移動、<code>Enter</code> 詳細表示、<code>Esc</code> 終了</td>
                    </tr>
                    <tr>
                      <td>詳細ビュー</td>
                      <td><code>↑/↓</code> スクロール、<code>j/k</code> または <code>←/→</code> でファイル切替、<code>n/N</code> でハンク間ジャンプ、<code>c</code> でコメント追加、<code>d</code> でコメント削除</td>
                    </tr>
                    <tr>
                      <td>コミットツリー</td>
                      <td><code>↑/↓</code> コミット移動、<code>←/→</code> ブランチ移動、<code>Enter</code> で差分表示</td>
                    </tr>
                    <tr>
                      <td>終了確認画面</td>
                      <td><code>Shift+Y</code> コメント送信して終了、<code>Shift+N</code> 破棄して終了</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p><strong>ステップバイステップ: 行コメントでエージェントを誘導する</strong></p>
              <ol>
                <li>詳細ビューでコメントしたい行にカーソルを合わせる。</li>
                <li><code>c</code> を押してコメント入力欄を開く。</li>
                <li>フィードバックを入力し <code>Enter</code> で保存 (💬アイコンがガター表示)。</li>
                <li><code>Esc</code> でファイル一覧に戻り、さらに <code>Esc</code> で終了。</li>
                <li>
                  未送信コメントの確認画面で <code>Shift+Y</code> を押すと、<code>&lt;file&gt;:&lt;line&gt;: &lt;comment&gt;</code> 形式で整形されエージェントへの次の指示として送られます。
                </li>
              </ol>

              <h3 id="d-resume"><code>/resume</code> — 会話の再開</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/resume</span>
                  </div>
                </div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>操作</th>
                      <th>キー</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>検索</td>
                      <td>文字入力で即時フィルタ</td>
                    </tr>
                    <tr>
                      <td>移動</td>
                      <td><code>↑/↓</code></td>
                    </tr>
                    <tr>
                      <td>ページ送り</td>
                      <td><code>←/→</code></td>
                    </tr>
                    <tr>
                      <td>リネーム</td>
                      <td><code>F2</code></td>
                    </tr>
                    <tr>
                      <td>削除</td>
                      <td><code>Ctrl+Delete</code> → <code>Enter</code>/<code>y</code> で確定</td>
                    </tr>
                    <tr>
                      <td>Antigravity 2.0からインポート</td>
                      <td><code>Tab</code> でタブ切替 → <code>Enter</code> → <code>y</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>CLI 起動オプション</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 現在のワークスペースで直近の会話を再開</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> -c</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># または</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> --continue</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 特定の会話 ID を直接指定</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> --conversation &lt;conversation-id&gt;</span>
                  </div>
                </div>
              </div>
              <p>
                再開キャッシュは <code>~/.gemini/antigravity-cli/cache/last_conversations.json</code> に、ワークスペースの絶対パスと会話 ID のマップとして保存されています。
              </p>

              <h3 id="d-codesearch">
                <code>/codesearch</code> (エイリアス: <code>/cs</code>, <code>/search</code>) — コード検索
              </h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>使用例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/codesearch</span>
                    <span className={styles.cv}> UserSession</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/codesearch</span>
                    <span className={styles.cv}> -F map[string]*UserSession   </span>
                    <span className={styles.cc}># リテラル一致 (regexメタ文字を無効化)</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/codesearch</span>
                    <span className={styles.cv}> f:store.go Session           </span>
                    <span className={styles.cc}># ファイルパスで絞り込み</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/codesearch</span>
                    <span className={styles.cv}> -f:*_test.go NewUserSession  </span>
                    <span className={styles.cc}># 除外フィルタ</span>
                  </div>
                </div>
              </div>
              <p>
                結果を <code>Enter</code> で開いてファイルビューアでコードを閲覧し、<code>c</code> で行コメント、<code>Esc</code> で終了時に送信確認 (<code>y</code>/<code>n</code>) が出る点は <code>/diff</code> と同様の設計です。
              </p>

              <h3 id="d-agents">
                <code>/agents</code> — カスタムエージェント & サブエージェント管理
              </h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/agents</span>
                  </div>
                </div>
              </div>
              <p><strong>カスタムエージェントの作成 (グローバル)</strong></p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>agent.md の作成</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>mkdir -p</span>
                    <span className={styles.cv}> ~/.gemini/config/agents/code-reviewer</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>cat &lt;&lt; 'EOF' &gt;</span>
                    <span className={styles.cv}> ~/.gemini/config/agents/code-reviewer/agent.md</span>
                  </div>
                  <div className={styles.codeLine}>---</div>
                  <div className={styles.codeLine}>name: code-reviewer</div>
                  <div className={styles.codeLine}>description: エッジケースとセキュリティに重点を置くコードレビュー専門エージェント</div>
                  <div className={styles.codeLine}>---</div>
                  <div className={styles.codeLine}>あなたは熟練のコードレビュアーです。差分を注意深く分析し、エッジケースを検証してください。</div>
                  <div className={styles.codeLine}>EOF</div>
                </div>
              </div>
              <p>
                プロジェクト単位で限定したい場合は <code>&#123;workspace&#125;/.agents/agents/&lt;agent_name&gt;/agent.md</code> に配置します。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_5} id="diag-5" maxHeight="400px" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図5: サブエージェントのライフサイクル
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>↑/↓</code></td>
                      <td>ヘッダー・サブエージェント・利用可能エージェント間を移動</td>
                    </tr>
                    <tr>
                      <td><code>Enter</code></td>
                      <td>グループの展開/折りたたみ、詳細ビューを開く、エージェントを選択</td>
                    </tr>
                    <tr>
                      <td><code>k</code></td>
                      <td>実行中のサブエージェントを強制終了 (完了済みには無効)</td>
                    </tr>
                    <tr>
                      <td><code>a</code> / <code>d</code></td>
                      <td>パネル内から承認/拒否の即時応答</td>
                    </tr>
                    <tr>
                      <td><code>Esc</code></td>
                      <td>パネルを閉じ、選択したエージェント切替を適用</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={`${styles.callout} ${styles.calloutWarn}`}>
                <div className={styles.calloutTitle}>落とし穴</div>
                <p>
                  アクティブな会話中にエージェントを切り替えると、履歴の整合性を保つために<strong>自動的に会話がフォーク</strong>されます。新規セッションからの切替は直接反映されます。
                </p>
              </div>

              <h3 id="d-statusline"><code>/statusline</code> — ステータスバーのカスタマイズ</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/statusline</span>
                    <span className={styles.cc}>              # トグル (オン/オフ切替)</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/statusline</span>
                    <span className={styles.cv}> on</span>
                    <span className={styles.cc}>            # 明示的に有効化</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/statusline</span>
                    <span className={styles.cv}> off</span>
                    <span className={styles.cc}>           # 明示的に無効化</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/statusline</span>
                    <span className={styles.cv}> ~/.gemini/antigravity-cli/statusline.sh</span>
                    <span className={styles.cc}>   # カスタムスクリプトを設定</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/statusline</span>
                    <span className={styles.cv}> delete</span>
                    <span className={styles.cc}>         # 既定表示に戻す (reset も可)</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/statusline</span>
                    <span className={styles.cv}> help</span>
                    <span className={styles.cc}>           # クイックリファレンス表示</span>
                  </div>
                </div>
              </div>
              <p>
                <strong>実務例</strong> (著名な Google Cloud Developer Advocate の公開スクリプトより): モデル名・カレントディレクトリ・git ブランチ・未コミット数・同期状況・トークン使用率をカラー表示するステータスラインの例。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>statusline スクリプト取得</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>mkdir -p</span>
                    <span className={styles.cv}> ~/.gemini/antigravity-cli</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>curl -o</span>
                    <span className={styles.cv}> ~/.gemini/antigravity-cli/statusline.sh \</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.cv}>  https://raw.githubusercontent.com/ykdojo/antigravity-cli-tips/main/scripts/context-bar.sh</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>chmod +x</span>
                    <span className={styles.cv}> ~/.gemini/antigravity-cli/statusline.sh</span>
                  </div>
                </div>
              </div>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>settings.json</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"statusLine"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"type"</span>:{" "}
                    <span className={styles.cs}>"command"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"command"</span>:{" "}
                    <span className={styles.cs}>"~/.gemini/antigravity-cli/statusline.sh"</span>
                  </div>
                  <div className={styles.codeLine}>{"  "}&#125;</div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>

              <h3 id="d-title"><code>/title</code> — ウィンドウタイトル</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>使用例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/title</span>
                    <span className={styles.cc}>       # トグル</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/title</span>
                    <span className={styles.cv}> on</span>
                    <span className={styles.cc}>    # 有効化</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/title</span>
                    <span className={styles.cv}> off</span>
                    <span className={styles.cc}>   # 無効化</span>
                  </div>
                </div>
              </div>
              <p>
                有効化すると、ターミナルのタイトルバーにアクティブなモデル・ワークスペース・エージェント状態が動的に反映されます。
              </p>

              <h3 id="d-usage">
                <code>/usage</code> (エイリアス <code>/quota</code>) ・ <code>/credits</code> — 使用量管理
              </h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>使用例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/usage</span>
                    <span className={styles.cc}>    # モデルごとのクォータ (残リクエスト/トークン数) を表示・自動リフレッシュ</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/credits</span>
                    <span className={styles.cc}>  # AI Premium クレジットの残高・消費履歴・購入リンクを表示</span>
                  </div>
                </div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー (<code>/usage</code> パネル)</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>↑/↓</code> (<code>j/k</code>)</td>
                      <td>1 行スクロール</td>
                    </tr>
                    <tr>
                      <td><code>PgUp/PgDn</code></td>
                      <td>1 ページスクロール</td>
                    </tr>
                    <tr>
                      <td><code>g</code>/<code>G</code></td>
                      <td>先頭/末尾へジャンプ</td>
                    </tr>
                    <tr>
                      <td><code>Esc</code> (<code>q</code>)</td>
                      <td>閉じる</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 06 KEYBINDINGS */}
            <section id="keybindings" className={styles.section}>
              <h2>
                <span className={styles.idx}>06 /</span> キーボードショートカット 完全リファレンス
              </h2>

              <h3>グローバル (常時有効)</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Esc</code></td>
                      <td>アクティブなパネルを閉じる / ストリームを停止 / 空プロンプトをクリア</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+C</code></td>
                      <td>セッション終了 (エージェント実行中は確認あり)</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+D</code></td>
                      <td>セッション終了 (プロンプトが空の場合のみ)</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+L</code></td>
                      <td>ターミナルバッファを再描画</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>プロンプト入力中</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Enter</code></td>
                      <td>プロンプト送信 / メニュー選択確定</td>
                    </tr>
                    <tr>
                      <td><code>Shift+Enter</code> / <code>Ctrl+J</code></td>
                      <td>改行 (送信しない)</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+V</code></td>
                      <td>クリップボードの画像・メディアを添付</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+O</code></td>
                      <td>ツール推論の詳細トラジェクトリを展開/折りたたみ</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+R</code></td>
                      <td>Artifact Review パネルを開く</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+G</code></td>
                      <td><code>$EDITOR</code> を起動してプロンプトを作成</td>
                    </tr>
                    <tr>
                      <td><code>Alt+J</code></td>
                      <td>承認待ちの次のサブエージェントへフォーカス移動</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+K</code></td>
                      <td>ステータスに表示中の保留アクションを即時承認</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+A</code> / <code>Ctrl+E</code></td>
                      <td>カーソルを行頭/行末へ移動</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl+Z</code> / <code>Ctrl+Shift+Z</code></td>
                      <td>元に戻す / やり直す</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>ナビゲーション・スクロール (パネル/メニュー内)</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>↑/↓</code></td>
                      <td>選択項目を上下に移動</td>
                    </tr>
                    <tr>
                      <td><code>PgUp</code> / <code>Shift+↑</code></td>
                      <td>1 ページ分上スクロール</td>
                    </tr>
                    <tr>
                      <td><code>PgDn</code> / <code>Shift+↓</code></td>
                      <td>1 ページ分下スクロール</td>
                    </tr>
                    <tr>
                      <td><code>←/→</code></td>
                      <td>ページ切替 (セッションピッカー等)</td>
                    </tr>
                    <tr>
                      <td><code>Tab</code></td>
                      <td>オートコンプリート候補を確定</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>ツール確認プロンプト中</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>動作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>y</code></td>
                      <td>提案されたツール・コマンド・変更を承認</td>
                    </tr>
                    <tr>
                      <td><code>n</code></td>
                      <td>拒否</td>
                    </tr>
                    <tr>
                      <td><code>A</code> (Review パネル内)</td>
                      <td>生成された全アーティファクトを一括承認</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 07 SETTINGS */}
            <section id="settings" className={styles.section}>
              <h2>
                <span className={styles.idx}>07 /</span> settings.json 設定ファイル 完全リファレンス
              </h2>
              <p>
                保存場所: <code>~/.gemini/antigravity-cli/settings.json</code> (TUI 内では <code>/config</code> または <code>/settings</code> で編集可能)
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>settings.json 例</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"colorScheme"</span>:{" "}
                    <span className={styles.cs}>"tokyo night"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"altScreenMode"</span>:{" "}
                    <span className={styles.cs}>"always"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"toolPermission"</span>:{" "}
                    <span className={styles.cs}>"request-review"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"notifications"</span>:{" "}
                    <span className={styles.cg}>true</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"enableTerminalSandbox"</span>:{" "}
                    <span className={styles.cg}>true</span>
                  </div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キー</th>
                      <th>型</th>
                      <th>既定値</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>colorScheme</code></td>
                      <td>string</td>
                      <td><code>terminal</code></td>
                      <td><code>light</code> / <code>solarized light</code> / <code>colorblind-friendly light</code> / <code>dark</code> / <code>solarized dark</code> / <code>colorblind-friendly dark</code> / <code>tokyo night</code> / <code>terminal</code></td>
                    </tr>
                    <tr>
                      <td><code>altScreenMode</code></td>
                      <td>string</td>
                      <td><code>default</code></td>
                      <td><code>default</code> (適応的) / <code>always</code> (常にオルタネートスクリーン) / <code>never</code> (常にインライン)</td>
                    </tr>
                    <tr>
                      <td><code>toolPermission</code></td>
                      <td>string</td>
                      <td><code>request-review</code></td>
                      <td><code>request-review</code> / <code>proceed-in-sandbox</code> / <code>always-proceed</code> / <code>strict</code></td>
                    </tr>
                    <tr>
                      <td><code>artifactReviewPolicy</code></td>
                      <td>string</td>
                      <td><code>asks-for-review</code></td>
                      <td><code>asks-for-review</code> / <code>agent-decides</code> / <code>always-proceed</code></td>
                    </tr>
                    <tr>
                      <td><code>notifications</code></td>
                      <td>boolean</td>
                      <td><code>false</code></td>
                      <td>タスク完了時のデスクトップ通知・ベル音</td>
                    </tr>
                    <tr>
                      <td><code>showTips</code></td>
                      <td>boolean</td>
                      <td><code>true</code></td>
                      <td>プロンプト上部にエージェンティックなヒントを表示</td>
                    </tr>
                    <tr>
                      <td><code>showFeedbackSurvey</code></td>
                      <td>boolean</td>
                      <td><code>true</code></td>
                      <td>定期的な品質フィードバック調査を表示</td>
                    </tr>
                    <tr>
                      <td><code>editor</code></td>
                      <td>string</td>
                      <td><code>auto</code></td>
                      <td><code>auto</code> (<code>$EDITOR</code> 参照) / <code>vim</code> / <code>emacs</code> / カスタム文字列</td>
                    </tr>
                    <tr>
                      <td><code>allowNonWorkspaceAccess</code></td>
                      <td>boolean</td>
                      <td><code>false</code></td>
                      <td>Git / ワークスペースルート外への読み書きを許可</td>
                    </tr>
                    <tr>
                      <td><code>enableTerminalSandbox</code></td>
                      <td>boolean</td>
                      <td><code>false</code></td>
                      <td>ローカル実行コマンドを OS コンテインメントリング内に制限</td>
                    </tr>
                    <tr>
                      <td><code>useG1Credits</code></td>
                      <td>boolean</td>
                      <td><code>false</code></td>
                      <td>(外部ビルドのみ) プランのクォータ超過後に個人 AI クレジットを使用</td>
                    </tr>
                    <tr>
                      <td><code>enableTelemetry</code></td>
                      <td>boolean</td>
                      <td><code>true</code></td>
                      <td>メトリクス収集・クラッシュログ送信の許可</td>
                    </tr>
                    <tr>
                      <td><code>verbosity</code></td>
                      <td>string</td>
                      <td><code>high</code></td>
                      <td><code>high</code> (全表示) / <code>low</code> (最小限のインジケータのみ)</td>
                    </tr>
                    <tr>
                      <td><code>runningLightSpeed</code></td>
                      <td>string</td>
                      <td><code>medium</code></td>
                      <td>進捗アニメーション速度: <code>fast</code>/<code>medium</code>/<code>slow</code>/<code>off</code></td>
                    </tr>
                    <tr>
                      <td><code>agentMode</code></td>
                      <td>string</td>
                      <td><code>default</code></td>
                      <td>起動時の既定実行モード: <code>default</code>/<code>accept-edits</code>/<code>plan</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>その他の関連ファイル</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ファイル</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>~/.gemini/antigravity-cli/keybindings.json</code></td>
                      <td>カスタムキーバインド (<code>/keybindings</code> からも編集可)</td>
                    </tr>
                    <tr>
                      <td><code>~/.gemini/antigravity-cli/cache/last_conversations.json</code></td>
                      <td><code>agy -c</code> 用のワークスペース別・直近会話キャッシュ</td>
                    </tr>
                    <tr>
                      <td><code>~/.gemini/antigravity-cli/updater/update.lock</code></td>
                      <td>セルフアップデーターのアドバイザリロック</td>
                    </tr>
                    <tr>
                      <td><code>~/.gemini/config/agents/&lt;name&gt;/agent.md</code></td>
                      <td>グローバルなカスタムエージェント定義</td>
                    </tr>
                    <tr>
                      <td><code>&#123;workspace&#125;/.agents/agents/&lt;name&gt;/agent.md</code></td>
                      <td>プロジェクト限定のカスタムエージェント定義</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>コマンドラインフラグによる上書き</h3>
              <p>
                <code>--sandbox</code> や <code>--dangerously-skip-permissions</code> のように、起動時フラグは <code>settings.json</code> の値を一時的に上書きできます。設定パネルには上書き元が表示され、永続設定自体は変更されません (再起動でフラグの効果は消えます)。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>自動化フラグ起動</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># 隔離環境 (コンテナ/VM/専用テストマシン) で全承認を自動化する場合</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> --dangerously-skip-permissions</span>
                  </div>
                </div>
              </div>
              <div className={`${styles.callout} ${styles.calloutWarn}`}>
                <div className={styles.calloutTitle}>セキュリティ注意</div>
                <p>
                  <code>--dangerously-skip-permissions</code> は全てのツール承認要求を無条件で自動承認します。信頼できない入力やネットワークアクセス可能な本番環境に近い場所では使用しないでください。
                </p>
              </div>
            </section>

            {/* 08 PERMISSIONS */}
            <section id="permissions" className={styles.section}>
              <h2>
                <span className={styles.idx}>08 /</span> 権限 & サンドボックスモデル
              </h2>
              <p>
                Antigravity CLI は「どこまでエージェントに自律性を与えるか」を、<strong>Tool Permission (何を許可するか)</strong> と <strong>Sandbox (どこで実行するか)</strong> の 2 軸で制御します。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_6} id="diag-6" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図6: toolPermission の判定フロー
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>設定</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>request-review</code> (既定)</td>
                      <td>書込み・bash コマンド・リモートネットワーク呼び出しの前に必ず確認</td>
                    </tr>
                    <tr>
                      <td><code>proceed-in-sandbox</code></td>
                      <td>実行をサンドボックスに封じ込め、安全なコマンドは自動実行・危険なコマンドのみ確認</td>
                    </tr>
                    <tr>
                      <td><code>always-proceed</code></td>
                      <td>確認なし (信頼できる自動化専用)</td>
                    </tr>
                    <tr>
                      <td><code>strict</code></td>
                      <td>読み取り以外の操作を逐一確認し、完全な透明性を確保</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                サンドボックスが有効な場合、確認プロンプトには「サンドボックスなしで今回だけ実行」というオプションが、無効な場合は「今回だけサンドボックス内で実行」というオプションが追加表示されます (単発の例外対応)。
              </p>

              <h3>推奨設定例 (中〜高リスクなプロジェクト向け)</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>settings.json</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"toolPermission"</span>:{" "}
                    <span className={styles.cs}>"proceed-in-sandbox"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"enableTerminalSandbox"</span>:{" "}
                    <span className={styles.cg}>true</span>
                  </div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>

              <h3>パーミッションルールの書式</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>パーミッションルール記述</span>
                  <span className={styles.codeLang}>Text</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>command(git)              <span className={styles.cc}># git コマンド全体を許可</span></div>
                  <div className={styles.codeLine}>command(git diff)         <span className={styles.cc}># git diff のみ許可 (より限定的)</span></div>
                  <div className={styles.codeLine}>read_file(/path/to/dir)   <span className={styles.cc}># 指定ディレクトリ配下の読み取りを許可 (再帰的)</span></div>
                  <div className={styles.codeLine}>write_file(/path/to/file) <span className={styles.cc}># 指定ファイル/ディレクトリへの書込みを許可 (read_fileを包含)</span></div>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>スコープ</th>
                      <th>適用範囲</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Project</td>
                      <td>現在開いているプロジェクトのみ</td>
                    </tr>
                    <tr>
                      <td>Shared</td>
                      <td>Antigravity CLI / 2.0 / IDE など全製品共通</td>
                    </tr>
                    <tr>
                      <td>Global</td>
                      <td>全セッション共通</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 09 MCP */}
            <section id="mcp" className={styles.section}>
              <h2>
                <span className={styles.idx}>09 /</span> MCP (Model Context Protocol) サーバー連携
              </h2>
              <p>
                Antigravity CLI は MCP を通じて Jira・Confluence・GitHub・Playwright・Snyk などの外部ツールと連携できます。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/mcp</span>
                    <span className={styles.cc}>   # 設定済み MCP サーバーの一覧・状態を確認</span>
                  </div>
                </div>
              </div>

              <p><strong>設定ファイルの場所</strong> (Google Codelabs のハンズオン教材による記載):</p>
              <ul>
                <li>グローバル設定: <code>~/.gemini/antigravity-cli/mcp_config.json</code></li>
                <li>ワークスペースローカル設定: <code>.agents/mcp_config.json</code> (プロジェクト直下)</li>
              </ul>

              <div className={`${styles.callout} ${styles.calloutInfo}`}>
                <div className={styles.calloutTitle}>情報源の差異</div>
                <p>
                  上記は Codelab の記載ですが、実務 Tips 記事側では <code>~/.gemini/config/mcp_config.json</code> (エージェント定義と同じ <code>~/.gemini/config/</code> 配下) への書き込みパーミッション例が示されています。共有 (Shared) スコープの設定は <code>~/.gemini/config/</code> 配下、CLI 固有の設定は <code>~/.gemini/antigravity-cli/</code> 配下、という命名分離の可能性が高いですが、手元の環境では <code>/mcp</code> コマンドの表示、または <code>agy --help</code> で実際のパスを確認することを推奨します。
                </p>
              </div>

              <h4>設定例: Context7 (単一サーバー、リモート URL 指定)</h4>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>mcp_config.json</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"mcpServers"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"context7"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"serverURL"</span>:{" "}
                    <span className={styles.cs}>"https://mcp.context7.com/mcp"</span>
                  </div>
                  <div className={styles.codeLine}>{"    "}&#125;</div>
                  <div className={styles.codeLine}>{"  "}&#125;</div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>

              <h4>設定例: 複数サーバー (Snyk / Atlassian / Playwright / GitHub)</h4>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>mcp_config.json</span>
                  <span className={styles.codeLang}>JSON</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>&#123;</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"mcpServers"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"Snyk Security Scanner"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"command"</span>:{" "}
                    <span className={styles.cs}>"snyk"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"args"</span>: [<span className={styles.cs}>"mcp"</span>, <span className={styles.cs}>"-t"</span>, <span className={styles.cs}>"stdio"</span>, <span className={styles.cs}>"--experimental"</span>],
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"env"</span>: &#123;&#125;
                  </div>
                  <div className={styles.codeLine}>{"    "}&#125;,</div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"atlassian"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"command"</span>:{" "}
                    <span className={styles.cs}>"npx"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"args"</span>: [<span className={styles.cs}>"-y"</span>, <span className={styles.cs}>"mcp-remote"</span>, <span className={styles.cs}>"https://mcp.atlassian.com/v1/sse"</span>]
                  </div>
                  <div className={styles.codeLine}>{"    "}&#125;,</div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"playwright"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"command"</span>:{" "}
                    <span className={styles.cs}>"npx"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"args"</span>: [<span className={styles.cs}>"@playwright/mcp@latest"</span>]
                  </div>
                  <div className={styles.codeLine}>{"    "}&#125;,</div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"github"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"command"</span>:{" "}
                    <span className={styles.cs}>"npx"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"args"</span>: [<span className={styles.cs}>"-y"</span>, <span className={styles.cs}>"@modelcontextprotocol/server-github"</span>],
                  </div>
                  <div className={styles.codeLine}>
                    {"      "}
                    <span className={styles.ck}>"env"</span>: &#123; <span className={styles.ck}>"GITHUB_PERSONAL_ACCESS_TOKEN"</span>: <span className={styles.cs}>"******"</span> &#125;
                  </div>
                  <div className={styles.codeLine}>{"    "}&#125;</div>
                  <div className={styles.codeLine}>{"  "}&#125;</div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>
              <ul>
                <li>
                  <strong>Snyk</strong>: ワークスペースを離れずに依存関係の脆弱性スキャンをエージェントに実行させる
                </li>
                <li>
                  <strong>Atlassian</strong>: Jira/Confluence のチケット作成・検索・更新を自然言語で指示
                </li>
                <li>
                  <strong>Playwright</strong>: ブラウザ自動操作 (<code>browser_navigate</code>、<code>browser_click</code>、<code>browser_take_screenshot</code> 等) による E2E テストや画面確認
                </li>
                <li>
                  <strong>GitHub</strong>: PR 作成・Issue トリアージ・リポジトリ解析を直接連携
                </li>
              </ul>
            </section>

            {/* 10 EXTEND */}
            <section id="extend" className={styles.section}>
              <h2>
                <span className={styles.idx}>10 /</span> カスタムエージェント・Skills・Plugins・Hooks
              </h2>

              <h3>Agent Skills</h3>
              <p>
                Skills は、特定タスクの手順・スクリプト・参照リソースを記述した宣言的な Markdown ファイルです。登録されると自動的にスラッシュコマンド化されます (例: <code>/refactor-ui</code>)。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/skills</span>
                    <span className={styles.cc}>   # ロード済みのローカル/グローバル Skills を一覧表示</span>
                  </div>
                </div>
              </div>

              <h3>Plugins</h3>
              <p>
                Plugins は Skills・バックグラウンドサブエージェント・Lint ルール・MCP 定義・イベントフックを 1 つのパッケージにまとめた名前空間付きバンドルです。カスタムエージェントも Plugin 経由で配布できます。
              </p>

              <h3>Hooks</h3>
              <p>
                ツール実行の直前/直後に処理を挟み込む仕組みで、pre-flight チェックや post-format フォーマッタ (例: ファイル書込み後の <code>prettier</code> 自動実行) に使われます。Plugin 内の <code>hooks.json</code>、または <code>settings.json</code> 本体に定義します。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>コマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>/hooks</span>
                    <span className={styles.cc}>   # 現在アクティブなフックを一覧表示</span>
                  </div>
                </div>
              </div>

              <h3>プロジェクトルールファイル (<code>AGENTS.md</code> / <code>GEMINI.md</code>)</h3>
              <p>
                プロジェクトルートに <code>AGENTS.md</code> (または <code>GEMINI.md</code>) を配置すると、コーディング規約・スタイル指針・テストコマンド・非推奨事項などをエージェントが起動時に自動的に読み込み、変更提案の前に参照します。
              </p>
              <div className={`${styles.callout} ${styles.calloutInfo}`}>
                <div className={styles.calloutTitle}>TIP</div>
                <p>
                  Claude Code など他ツールも併用している場合、シンボリックリンクで指示ファイルを共有すると二重管理を避けられます。
                </p>
              </div>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>シンボリックリンク例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>ln -s</span>
                    <span className={styles.cv}> AGENTS.md CLAUDE.md</span>
                  </div>
                </div>
              </div>
              <p>
                <code>AGENTS.md</code> には TODO リストを書いておくのもおすすめです。「TODOリストの状況を教えて」と聞くだけで、エージェントが正確に現在地を把握して回答してくれます。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>AGENTS.md (To-Do 例)</span>
                  <span className={styles.codeLang}>Markdown</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>## To-Do</div>
                  <div className={styles.codeLine}>### Done</div>
                  <div className={styles.codeLine}>- [x] プロジェクト初期スキャフォールド</div>
                  <div className={styles.codeLine}>- [x] 基本UI実装</div>
                  <div className={styles.codeLine}>### Up Next</div>
                  <div className={styles.codeLine}>- [ ] エラーハンドリングの追加</div>
                </div>
              </div>
              <p>
                グローバル版のルールファイルは <code>~/.gemini/AGENTS.md</code> に置くことで全プロジェクト共通の指示にできます。
              </p>
            </section>

            {/* 11 AUTOMATION */}
            <section id="automation" className={styles.section}>
              <h2>
                <span className={styles.idx}>11 /</span> 自動化・スクリプティング・CI/CD連携
              </h2>

              <h3>非対話モード (<code>-p</code> フラグ)</h3>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>使用例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                    <span className={styles.cv}> -p "このgit diffをレビューしてConventional Commits形式のコミットメッセージを提案して" --cwd $(pwd)</span>
                  </div>
                </div>
              </div>
              <p>Git フックやスクリプトへの組み込み、単発クエリの自動化に有効です。</p>

              <h3>Bash モード (<code>!</code> プレフィックス)</h3>
              <p>
                対話中に単純なコマンドをすぐ実行したい場合、<code>!</code> を先頭に付けるとチャットを介さず直接シェルへ渡せます。
              </p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>使用例</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>!</span>
                    <span className={styles.cv}> git status</span>
                  </div>
                </div>
              </div>

              <h3>バックグラウンドタスク</h3>
              <p>
                長時間かかるタスクは <code>Ctrl+B</code> でバックグラウンドに送れます。進行状況は <code>/tasks</code> (シェル実行系) または <code>/agents</code> (サブエージェント系) で監視できます。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_7} id="diag-7" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図7: CI/CDパイプラインでの利用イメージ
                </div>
              </div>

              <p>
                <code>AGY_CLI_DISABLE_AUTO_UPDATE=true</code> を環境変数に設定しておくと、CI 環境でセルフアップデーターが介入するのを防げます。
              </p>
            </section>

            {/* 12 BEST PRACTICES */}
            <section id="practices" className={styles.section}>
              <h2>
                <span className={styles.idx}>12 /</span> ベストプラクティス (公式ガイド + 実務Tips統合版)
              </h2>

              <h3>12-1. 検証ループを必ず組み込む</h3>
              <p>
                自律型エージェントから信頼できる変更を得る最も効果的な方法は、<strong>ローカルに検証手段 (ユニットテスト・ビルドコマンド・フォーマッタ) を用意しておく</strong>ことです。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_8} id="diag-8" />
                <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-mute)", marginTop: "8px" }}>
                  図8: 探索 → 計画 → 実行 → 検証のループ
                </div>
              </div>

              <ol>
                <li>ワークスペースにテストスイートを用意する (無ければ先にテストを書かせる)。</li>
                <li>コード変更を依頼する際、検証コマンドまで指定する。</li>
              </ol>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>プロンプト指示例</span>
                  <span className={styles.codeLang}>Text</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>Implement feature X in main.py. Run npm test afterward to verify the build.</div>
                </div>
              </div>
              <ol start={3}>
                <li>
                  エージェントがテストを実行し、失敗があれば自動的に反復修正する様子を確認する。
                </li>
              </ol>

              <h3>12-2. 「探索 → 計画 → 実行」の 3 段階に分ける</h3>
              <p>複雑な変更ほど、いきなり実装させず段階を踏むことで精度が上がります。</p>
              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>プロンプト指示例</span>
                  <span className={styles.codeLang}>Text</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>Explore how our router resolves `/docs/:page`. Write down an implementation plan to add `/docs/best-practices`.</div>
                </div>
              </div>
              <ul>
                <li>
                  <strong>探索</strong>: 対象コードの解決方法・インターフェース定義をまず説明させる
                </li>
                <li>
                  <strong>計画</strong>: Implementation Plan artifact (対象ファイル・依存関係・ロジック変更点を列挙) を要求
                </li>
                <li>
                  <strong>実行</strong>: 承認後にのみ編集を適用させる
                </li>
              </ul>
              <p>
                複雑な UI やアーキテクチャ変更では <code>/plan</code> コマンドや、要件を 1 問ずつ確認してくれる <code>/grill-me</code> の活用も有効です。
              </p>

              <h3>12-3. コンテキストを高精度に与える</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>手法</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ファイルパス補完</td>
                      <td>プロンプト内で <code>@</code> を入力すると Interactive Path Suggestion が開き、絶対パスを挿入できる</td>
                    </tr>
                    <tr>
                      <td>スクリーンショット添付</td>
                      <td>UI 崩れ等のビジュアルバグはスクリーンショット/動画をコピーし <code>Ctrl+V</code> で貼り付け</td>
                    </tr>
                    <tr>
                      <td>Webページ/ターミナル出力の貼り付け</td>
                      <td><code>Cmd+A</code>/<code>Ctrl+A</code> で全選択しコピーしてそのまま貼り付け</td>
                    </tr>
                    <tr>
                      <td>絶対パスの取得</td>
                      <td><code>realpath some/relative/path</code> で絶対パスを取得しプロンプトに貼る</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>12-4. ワークスペース環境を整備する</h3>
              <p>
                <code>AGENTS.md</code>/<code>GEMINI.md</code> にディレクトリ規約・スタイル・テストコマンド・非推奨事項を明記し、リスクレベルに応じて <code>toolPermission</code> を調整します (§08 参照)。
              </p>

              <h3>12-5. セッションを能動的に管理する</h3>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>状況</th>
                      <th>対処</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>誤った検索パターン・意図とズレたコードを実行中</td>
                      <td><code>Esc</code> で即座に中断しクリーンなプロンプトに戻る</td>
                    </tr>
                    <tr>
                      <td>複数回の変更でビルドエラーが蓄積した</td>
                      <td><code>/rewind</code> (<code>/undo</code>) で会話を安定していた時点まで巻き戻す</td>
                    </tr>
                    <tr>
                      <td>実装方針に確信が持てない</td>
                      <td><code>/fork</code> で並行セッションを作り試行錯誤。失敗したら <code>/resume</code> で本線に戻る</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>12-6. 並列サブエージェントで作業をファンアウトする</h3>
              <p>
                大規模な一括置換や複数ファイルにまたがるリファクタリングでは、メインエージェントにバックグラウンドのサブエージェントを生成させ、<code>/agents</code> パネルで監視しながら自分は別作業を継続できます。
              </p>

              <h3>12-7. ソフトウェア開発ライフサイクル全体でエージェントを使う</h3>
              <p>
                コード生成だけに偏重せず、Issue 理解・設計検討・PR レビュー・テスト作成など、SDLC 全体でエージェントを活用することが推奨されています (著名な Google Cloud Developer Advocate による実務記事より)。
              </p>

              <h3>12-8. 音声入力の活用 (上級者向け実務 Tips)</h3>
              <p>
                タイピングより音声の方が指示速度が速いという Tips も共有されています。ローカルの音声認識モデルを使えば、多少の誤認識があっても LLM が文脈から意図を汲み取ってくれるため実用上問題ないケースが多いとされています。
              </p>
            </section>

            {/* 13 TROUBLESHOOT */}
            <section id="troubleshoot" className={styles.section}>
              <h2>
                <span className={styles.idx}>13 /</span> トラブルシューティング
              </h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>症状</th>
                      <th>原因</th>
                      <th>対処</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>agy: command not found</code></td>
                      <td>インストール先が <code>$PATH</code> に含まれていない</td>
                      <td><code>~/.bashrc</code>/<code>~/.zshrc</code> に <code>export PATH="~/.local/bin:$PATH"</code> を追記し <code>source</code>。Windows は <code>SetEnvironmentVariable</code> で PATH を追記</td>
                    </tr>
                    <tr>
                      <td><code>keyring: secure lock out</code></td>
                      <td>OS キーリングサービスの権限不足・ロック</td>
                      <td>macOS: Keychain Access で <code>agy</code> のアクセス許可を確認、SSH 経由なら <code>security unlock-keychain</code> 実行。Linux: <code>export $(dbus-launch)</code> で D-Bus セッションを起動</td>
                    </tr>
                    <tr>
                      <td>SSH 経由でのクリップボード貼付失敗</td>
                      <td>SSH 標準ストリームはグラフィカルクリップボードを転送しない</td>
                      <td>iTerm2/Ghostty を使用し「Applications in terminal may access clipboard」を有効化 (OSC 52)。tmux 利用時は <code>set -s set-clipboard on</code></td>
                    </tr>
                    <tr>
                      <td>アップデートが失敗・ハングする</td>
                      <td>セルフアップデーターのアドバイザリロックが残留</td>
                      <td><code>rm -f ~/.gemini/antigravity-cli/updater/update.lock</code> でロック解除。<code>export AGY_CLI_DISABLE_AUTO_UPDATE=true</code> で自動更新を停止可能</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 14 SECURITY */}
            <section id="security" className={styles.section}>
              <h2>
                <span className={styles.idx}>14 /</span> セキュリティ上の注意
              </h2>
              <p>
                Antigravity CLI の公式 GitHub リポジトリでは、AI コーディングエージェント全般に共通するリスクとして以下が明記されています。
              </p>
              <ul>
                <li>自律的なコード実行 (autonomous code execution)</li>
                <li>データ持ち出し (data exfiltration)</li>
                <li>プロンプトインジェクション (prompt injection)</li>
                <li>サプライチェーンリスク (supply chain risks)</li>
              </ul>
              <p>
                エージェントが取る全てのアクションを監視・検証することが推奨されています。実務上は以下のような多層防御が現実的です。
              </p>
              <ol>
                <li>
                  <strong>既定 (<code>request-review</code>/<code>strict</code>) で運用</strong>し、信頼度に応じて <code>proceed-in-sandbox</code> → <code>always-proceed</code> へ緩めていく。
                </li>
                <li>
                  <strong>サンドボックス (<code>enableTerminalSandbox: true</code>) を有効化</strong>し、ローカル実行コマンドを OS コンテインメントリングに封じ込める。
                </li>
                <li>
                  <strong><code>--dangerously-skip-permissions</code> はコンテナ・使い捨て VM など隔離環境限定</strong>で使用する。
                </li>
                <li>
                  外部ネットワーク接続を伴う MCP サーバー (GitHub トークン等) は<strong>最小権限のトークン</strong>を発行する。
                </li>
                <li>
                  Antigravity (旧 Gemini CLI を含む) はサービス提供状況が急遽変更されることがあった実績があるため (著名な AI 評論家 Simon Willison 氏のブログ・X 投稿でも複数回報告)、本番 CI/CD に組み込む場合は可用性リスクも考慮してください。
                </li>
              </ol>
            </section>

            {/* 15 REFERENCES */}
            <section id="references" className={styles.section}>
              <h2>
                <span className={styles.idx}>15 /</span> 参考文献 & 情報源
              </h2>
              <p>
                本ガイドは以下の一次情報源 (公式ドキュメント・公式リポジトリ・Google 公認 Developer Advocate による技術記事・国際的に著名な AI/開発者評論家の投稿) を根拠にしています。確認日は 2026 年 7 月 28 日です。
              </p>

              <div>
                <h4>公式ドキュメント (antigravity.google)</h4>
                <ul>
                  <li>
                    CLI 概要: <Ext href="https://antigravity.google/docs/cli/overview">https://antigravity.google/docs/cli/overview</Ext>
                  </li>
                  <li>
                    インストール・認証: <Ext href="https://antigravity.google/docs/cli/install">https://antigravity.google/docs/cli/install</Ext>
                  </li>
                  <li>
                    実行モード: <Ext href="https://antigravity.google/docs/cli/modes">https://antigravity.google/docs/cli/modes</Ext>
                  </li>
                  <li>
                    CLI リファレンス (全コマンド・キーバインド・設定キー): <Ext href="https://antigravity.google/docs/cli/reference">https://antigravity.google/docs/cli/reference</Ext>
                  </li>
                  <li>
                    ベストプラクティス: <Ext href="https://antigravity.google/docs/cli/best-practices">https://antigravity.google/docs/cli/best-practices</Ext>
                  </li>
                  <li>
                    トラブルシューティング: <Ext href="https://antigravity.google/docs/cli/troubleshooting">https://antigravity.google/docs/cli/troubleshooting</Ext>
                  </li>
                  <li>
                    機能概要 (サンドボックス・サブエージェントパネル): <Ext href="https://antigravity.google/docs/cli/features">https://antigravity.google/docs/cli/features</Ext>
                  </li>
                  <li>
                    /agents コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/agents">https://antigravity.google/docs/cli/commands/agents</Ext>
                  </li>
                  <li>
                    /codesearch コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/codesearch">https://antigravity.google/docs/cli/commands/codesearch</Ext>
                  </li>
                  <li>
                    /credits コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/credits">https://antigravity.google/docs/cli/commands/credits</Ext>
                  </li>
                  <li>
                    /diff コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/diff">https://antigravity.google/docs/cli/commands/diff</Ext>
                  </li>
                  <li>
                    /permissions コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/permissions">https://antigravity.google/docs/cli/commands/permissions</Ext>
                  </li>
                  <li>
                    /resume コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/resume">https://antigravity.google/docs/cli/commands/resume</Ext>
                  </li>
                  <li>
                    /statusline コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/statusline">https://antigravity.google/docs/cli/commands/statusline</Ext>
                  </li>
                  <li>
                    /title コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/title">https://antigravity.google/docs/cli/commands/title</Ext>
                  </li>
                  <li>
                    /usage コマンド詳細: <Ext href="https://antigravity.google/docs/cli/commands/usage">https://antigravity.google/docs/cli/commands/usage</Ext>
                  </li>
                  <li>
                    Antigravity CLI 発表ブログ: <Ext href="https://antigravity.google/blog/introducing-google-antigravity-cli">https://antigravity.google/blog/introducing-google-antigravity-cli</Ext>
                  </li>
                </ul>

                <h4>公式リポジトリ</h4>
                <ul>
                  <li>
                    GitHub: google-antigravity/antigravity-cli: <Ext href="https://github.com/google-antigravity/antigravity-cli">https://github.com/google-antigravity/antigravity-cli</Ext>
                  </li>
                </ul>

                <h4>Google 公式ブログ・Developer Advocate 記事</h4>
                <ul>
                  <li>
                    Gemini CLIからの移行アナウンス: <Ext href="https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/">https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/</Ext>
                  </li>
                  <li>
                    サーフェス選択ガイド (CLI/IDE/SDK/2.0比較): <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk">https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk</Ext>
                  </li>
                  <li>
                    Antigravity vs Gemini CLI 比較: <Ext href="https://cloud.google.com/blog/topics/developers-practitioners/choosing-antigravity-or-gemini-cli">https://cloud.google.com/blog/topics/developers-practitioners/choosing-antigravity-or-gemini-cli</Ext>
                  </li>
                  <li>
                    Antigravity CLI チュートリアルシリーズ (Medium, Google Cloud Community): <Ext href="https://medium.com/google-cloud/antigravity-cli-tutorial-series-12b46cfe3bf2">https://medium.com/google-cloud/antigravity-cli-tutorial-series-12b46cfe3bf2</Ext>
                  </li>
                  <li>
                    Getting Started with Antigravity CLI (Medium, Google Cloud Community): <Ext href="https://medium.com/google-cloud/getting-started-with-antigravity-cli-26c5da90951f">https://medium.com/google-cloud/getting-started-with-antigravity-cli-26c5da90951f</Ext>
                  </li>
                  <li>
                    Antigravity CLI ハンズオン公式 Codelab: <Ext href="https://codelabs.developers.google.com/genai-for-dev-antigravity-cli">https://codelabs.developers.google.com/genai-for-dev-antigravity-cli</Ext>
                  </li>
                  <li>
                    Antigravity CLI ハンズオン公式 Codelab (別編): <Ext href="https://codelabs.developers.google.com/antigravity-cli-hands-on">https://codelabs.developers.google.com/antigravity-cli-hands-on</Ext>
                  </li>
                </ul>

                <h4>著名な開発者による実務 Tips・評論</h4>
                <ul>
                  <li>
                    「15 Antigravity CLI tips」— YK氏 (Claude Code tipsリポジトリ作者・9,000+スター、CS Dojo YouTubeチャンネル創設者・登録者190万人超、Eventual社 Developer Experience Manager)、Google Cloud Community寄稿: <Ext href="https://medium.com/google-cloud/15-antigravity-cli-tips-ddbc21c10a20">https://medium.com/google-cloud/15-antigravity-cli-tips-ddbc21c10a20</Ext>
                  </li>
                  <li>
                    Simon Willison氏 (国際的に著名なAI/LLM評論家) によるGoogle I/O・Antigravity関連の考察: <Ext href="https://simonwillison.net/2026/May/20/google-io/">https://simonwillison.net/2026/May/20/google-io/</Ext>
                  </li>
                </ul>
              </div>

              <div className={`${styles.callout} ${styles.calloutWarn}`} style={{ marginTop: "24px" }}>
                <div className={styles.calloutTitle}>留意事項</div>
                <p>
                  本ガイドの内容は執筆時点 (2026 年 7 月 28 日) の公開情報に基づきます。Antigravity CLI は数週間単位でバージョンアップされており (調査中にも v1.1.5〜v1.1.7 の表記揺れを確認)、コマンド名・設定キー・ファイルパスは変更される可能性があります。重要な自動化や CI/CD 組み込みの前には、必ず <code>agy --help</code> および公式ドキュメントの最新版を確認してください。
                </p>
              </div>
            </section>
          </div>

          <footer className={styles.pageFooter}>
            Antigravity CLI 完全ガイド — 2026-07-28 時点の公開情報にもとづく非公式リファレンス。図解はすべて Mermaid で描画。
          </footer>
        </main>
      </div>
    </div>
  );
}
