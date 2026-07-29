import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import TocObserver from "./TocObserver";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Antigravity CLI 完全ガイド — 全コマンド & ベストプラクティス",
  description:
    "Antigravity CLI (agy) の全スラッシュコマンド、キーバインド、設定ファイル (settings.json)、自動化・CI/CD連携、セキュリティモデルを包括的に解説した実務ガイド。",
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
            <a href="#quickstart" className={styles.tocLink}>
              <span className={styles.tocNum}>02</span>初回起動 & 基本操作
            </a>
            <a href="#execution-modes" className={styles.tocLink}>
              <span className={styles.tocNum}>03</span>実行モード
            </a>
            <a href="#slash-commands" className={styles.tocLink}>
              <span className={styles.tocNum}>04</span>スラッシュコマンド
            </a>
            <a href="#key-commands" className={styles.tocLink}>
              <span className={styles.tocNum}>05</span>主要コマンド詳細
            </a>
            <a href="#keyboard-shortcuts" className={styles.tocLink}>
              <span className={styles.tocNum}>06</span>キーボードショートカット
            </a>
            <a href="#settings-json" className={styles.tocLink}>
              <span className={styles.tocNum}>07</span>settings.json 設定
            </a>
            <a href="#permissions" className={styles.tocLink}>
              <span className={styles.tocNum}>08</span>権限 & サンドボックス
            </a>
            <a href="#mcp" className={styles.tocLink}>
              <span className={styles.tocNum}>09</span>MCP サーバー連携
            </a>
            <a href="#custom-agents" className={styles.tocLink}>
              <span className={styles.tocNum}>10</span>Skills & Plugins & Hooks
            </a>
            <a href="#automation" className={styles.tocLink}>
              <span className={styles.tocNum}>11</span>自動化 & CI/CD
            </a>
            <a href="#best-practices" className={styles.tocLink}>
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
                Antigravity CLI (<code>agy</code>) は、Google が 2026
                年に発表した Terminal UI (TUI)
                型のエージェント型コーディングツールです。旧 Gemini CLI
                の後継にあたり、Go 言語で実装されています。最大の特徴は、Antigravity
                2.0 (デスクトップ GUI) ・ Antigravity IDE (VS Code
                フォーク) ・ Antigravity SDK (Python) と
                <strong>「共有エージェントハーネス」</strong>を利用する点です。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_1} id="diag-1" />
              </div>

              <h3>主な特徴と旧ツール (Gemini CLI) からの変更点</h3>
              <ul>
                <li>
                  <strong>TUI 再設計:</strong> Bubble Tea / Lip Gloss (Go
                  言語) ベースで応答速度が大幅に向上し、ターミナル内リサイズ対応やスムーズなスクロールが実現。
                </li>
                <li>
                  <strong>エージェント自律実行:</strong> ファイル読み書き・コマンド実行・Web 検索・サブエージェント呼び出しをシームレスに連携。
                </li>
                <li>
                  <strong>共通エコシステム:</strong> GUI / IDE / CLI
                  間でプロンプト、設定、セッション履歴を相互共有。
                </li>
              </ul>
            </section>

            {/* 01 INSTALL */}
            <section id="install" className={styles.section}>
              <h2>
                <span className={styles.idx}>01 /</span> インストール & 認証
              </h2>
              <p>
                macOS, Linux, Windows (WSL2 / PowerShell) で動作します。Go
                バイナリ単体として配布されているため軽量です。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>インストールコマンド</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.cc}># macOS (Homebrew)</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>brew install</span>
                    <span className={styles.cv}> google/tap/antigravity-cli</span>
                  </div>
                  <div className={styles.codeLine} />
                  <div className={styles.cc}># 独立バイナリ (Linux / WSL2)</div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>curl -fsSL</span>
                    <span className={styles.cv}> https://antigravity.google/install.sh | sh</span>
                  </div>
                </div>
              </div>

              <h3>初回認証シーケンス</h3>
              <p>
                実行時にキーリング (<code>keychain</code> / <code>secret-service</code>) を参照し、Web 認証または API キー設定を行います。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_2} id="diag-2" />
              </div>
            </section>

            {/* 02 QUICKSTART */}
            <section id="quickstart" className={styles.section}>
              <h2>
                <span className={styles.idx}>02 /</span> 初回起動 & プロジェクトの基本操作
              </h2>
              <p>
                プロジェクトディレクトリに移動し、<code>agy</code> コマンドで起動します。
              </p>

              <div className={styles.codeWrap}>
                <div className={styles.codeBar}>
                  <span>基本起動</span>
                  <span className={styles.codeLang}>Bash</span>
                </div>
                <div className={styles.codeBody}>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>cd</span>
                    <span className={styles.cv}> ~/projects/my-app</span>
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.ck}>agy</span>
                  </div>
                </div>
              </div>

              <p>
                直近のコンテキストを保持して開始したい場合は <code>agy -c</code> (Continue) や <code>agy -r</code> (Resume) を利用します。
              </p>
            </section>

            {/* 03 EXECUTION MODES */}
            <section id="execution-modes" className={styles.section}>
              <h2>
                <span className={styles.idx}>03 /</span> 実行モード (Execution Modes)
              </h2>
              <p>
                Antigravity CLI には 3 つの主要実行モードが存在します。<code>Shift+Tab</code> または <code>agy --mode=&lt;name&gt;</code> で切り替えます。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_3} id="diag-3" />
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>モード</th>
                      <th>フラグ / ショートカット</th>
                      <th>挙動 & 用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Default (通常)</code></td>
                      <td>標準</td>
                      <td>対話型コーディング。ツール実行前に毎度ユーザー確認を求める。</td>
                    </tr>
                    <tr>
                      <td><code>accept-edits</code></td>
                      <td><code>Shift+Tab</code> (1回)</td>
                      <td>ファイルの自動適用モード。ツール書き込み確認を省略してスムーズに実装。</td>
                    </tr>
                    <tr>
                      <td><code>plan</code></td>
                      <td><code>agy --mode=plan</code> / <code>Shift+Tab</code> (2回)</td>
                      <td>計画専用モード。ファイル変更やコマンド実行を行わず <code>implementation_plan.md</code> を作成。</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 04 SLASH COMMANDS */}
            <section id="slash-commands" className={styles.section}>
              <h2>
                <span className={styles.idx}>04 /</span> スラッシュコマンド 全リファレンス
              </h2>
              <p>
                プロンプト入力欄で <code>/</code> を打つと補完メニューが表示されます。全 20 個の主要コマンド一覧です。
              </p>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>コマンド</th>
                      <th>概要</th>
                      <th>引数 / 備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>/help</code></td>
                      <td>ヘルプと使用可能スラッシュコマンドの一覧を表示</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><code>/clear</code></td>
                      <td>会話履歴とコンテキストバッファを消去</td>
                      <td><code>-all</code> でメモリも全リセット</td>
                    </tr>
                    <tr>
                      <td><code>/diff</code></td>
                      <td>直近の作業によるコード変更差分を TUI 内で確認</td>
                      <td>VCS / Turn / Commit モード対応</td>
                    </tr>
                    <tr>
                      <td><code>/model</code></td>
                      <td>使用する LLM モデルを動的変更</td>
                      <td><code>gemini-3.5-pro</code> / <code>gemini-3.5-flash</code></td>
                    </tr>
                    <tr>
                      <td><code>/mode</code></td>
                      <td>実行モードを変更</td>
                      <td><code>default</code>, <code>accept-edits</code>, <code>plan</code></td>
                    </tr>
                    <tr>
                      <td><code>/cost</code></td>
                      <td>現在のセッションのトークン消費量と推定コストを表示</td>
                      <td>入力/出力トークン数分解表示</td>
                    </tr>
                    <tr>
                      <td><code>/compact</code></td>
                      <td>会話履歴を要約してコンテキストウィンドウを節約</td>
                      <td>長時間の作業で推奨</td>
                    </tr>
                    <tr>
                      <td><code>/commit</code></td>
                      <td>エージェントに現在の変更からコミットメッセージを生成させコミット</td>
                      <td><code>-m "msg"</code> で直接指定可能</td>
                    </tr>
                    <tr>
                      <td><code>/review</code></td>
                      <td>コードレビューを実施し潜在的なバグ・設計不備を指摘</td>
                      <td><code>HEAD</code> や指定コミットに対して実行</td>
                    </tr>
                    <tr>
                      <td><code>/test</code></td>
                      <td>プロジェクトのテストスイートを検索・自動実行し成功を確認</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><code>/mcp</code></td>
                      <td>接続中の MCP (Model Context Protocol) サーバー状態を表示・管理</td>
                      <td><code>list</code>, <code>reload</code></td>
                    </tr>
                    <tr>
                      <td><code>/skill</code></td>
                      <td>使用可能な Skills 一覧の確認および明示的発動</td>
                      <td><code>list</code>, <code>run &lt;name&gt;</code></td>
                    </tr>
                    <tr>
                      <td><code>/plugin</code></td>
                      <td>プラグインの管理・適用状態表示</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><code>/memory</code></td>
                      <td>エージェントの永続記憶 (MEMORIES.md) の表示と編集</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><code>/agents</code></td>
                      <td>マルチエージェントオーケストレーションの状態を表示</td>
                      <td>サブエージェント一覧</td>
                    </tr>
                    <tr>
                      <td><code>/rules</code></td>
                      <td>適用中のルールファイル (.claude/rules や AGENTS.md) を表示</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><code>/copy</code></td>
                      <td>直前の応答テキストまたはコードブロックをクリップボードにコピー</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td><code>/export</code></td>
                      <td>セッションログを Markdown または HTML として出力</td>
                      <td><code>export.md</code></td>
                    </tr>
                    <tr>
                      <td><code>/import</code></td>
                      <td>他のセッションやAntigravity GUIからの会話インポート</td>
                      <td><code>&lt;path&gt;</code></td>
                    </tr>
                    <tr>
                      <td><code>/exit</code> (または <code>/quit</code>)</td>
                      <td>Antigravity CLI を終了</td>
                      <td><code>Ctrl+C</code> または <code>Ctrl+D</code> でも可能</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 05 KEY COMMANDS DETAILS */}
            <section id="key-commands" className={styles.section}>
              <h2>
                <span className={styles.idx}>05 /</span> 主要コマンドの詳細ステップ
              </h2>

              <h3>1. `/diff` コマンドビューア</h3>
              <p>
                <code>/diff</code> を実行すると、TUI 上でインタラクティブな Diff ビューアが開きます。<code>Tab</code> キーでビューモードを切り替えられます。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_4} id="diag-4" />
              </div>

              <h3>2. `/compact` とコンテキスト圧縮</h3>
              <p>
                トークン数が 100k を超えた場合、自動または <code>/compact</code> コマンドで重要な決定事項・コード変更要約を残し、会話バッファを削減します。
              </p>

              <h3>3. タスクバックグラウンド管理 (Background Tasks)</h3>
              <p>
                長いビルドやテスト実行時、<code>Ctrl+B</code> でバックグラウンドに送り、別タスクを並行処理できます。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_5} id="diag-5" />
              </div>
            </section>

            {/* 06 KEYBOARD SHORTCUTS */}
            <section id="keyboard-shortcuts" className={styles.section}>
              <h2>
                <span className={styles.idx}>06 /</span> キーボードショートカット 完全リファレンス
              </h2>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>キーバインド</th>
                      <th>アクション</th>
                      <th>対象コンテキスト</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Shift + Tab</code></td>
                      <td>実行モードのトグル切り替え (Default ↔ accept-edits ↔ plan)</td>
                      <td>プロンプト入力時</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + C</code></td>
                      <td>現在実行中の思考/ツール処理を中断 (2回連続でCLI終了)</td>
                      <td>常時</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + L</code></td>
                      <td>画面クリア (会話履歴は保持)</td>
                      <td>TUI 描画</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + R</code></td>
                      <td>過去のプロンプト履歴検索 (Reverse Search)</td>
                      <td>プロンプト入力時</td>
                    </tr>
                    <tr>
                      <td><code>Ctrl + B</code></td>
                      <td>現在のツール実行コマンドをバックグラウンド化</td>
                      <td>ツール実行中</td>
                    </tr>
                    <tr>
                      <td><code>Tab</code></td>
                      <td>スラッシュコマンド・ファイルパスの自動補完</td>
                      <td>プロンプト入力時</td>
                    </tr>
                    <tr>
                      <td><code>PageUp / PageDown</code></td>
                      <td>レスポンスログの高速スクロール</td>
                      <td>ログ表示時</td>
                    </tr>
                    <tr>
                      <td><code>Esc</code></td>
                      <td>モーダル / サポートダイアログを閉じる</td>
                      <td>ダイアログ表示時</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 07 SETTINGS JSON */}
            <section id="settings-json" className={styles.section}>
              <h2>
                <span className={styles.idx}>07 /</span> 設定ファイル settings.json 完全リファレンス
              </h2>
              <p>
                Antigravity CLI の設定は <code>~/.config/antigravity/settings.json</code> またはプロジェクトローカルの <code>.antigravity/settings.json</code> で管理します。
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
                    <span className={styles.ck}>"defaultModel"</span>:{" "}
                    <span className={styles.cs}>"gemini-3.5-pro"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"toolPermission"</span>:{" "}
                    <span className={styles.cs}>"request-review"</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"autoCompactThreshold"</span>:{" "}
                    <span className={styles.cv}>120000</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"sandbox"</span>: &#123;
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"enabled"</span>:{" "}
                    <span className={styles.cg}>true</span>,
                  </div>
                  <div className={styles.codeLine}>
                    {"    "}
                    <span className={styles.ck}>"allowNetwork"</span>:{" "}
                    <span className={styles.ck}>false</span>
                  </div>
                  <div className={styles.codeLine}>{"  "}&#125;,</div>
                  <div className={styles.codeLine}>
                    {"  "}
                    <span className={styles.ck}>"theme"</span>:{" "}
                    <span className={styles.cs}>"tokyo-night"</span>
                  </div>
                  <div className={styles.codeLine}>&#125;</div>
                </div>
              </div>
            </section>

            {/* 08 PERMISSIONS & SANDBOX */}
            <section id="permissions" className={styles.section}>
              <h2>
                <span className={styles.idx}>08 /</span> 権限 & サンドボックスモデル
              </h2>
              <p>
                エージェントがファイル作成・ターミナルコマンド実行をリクエストした際、安全性を担保するための権限レベルが設定可能です。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_6} id="diag-6" />
              </div>
            </section>

            {/* 09 MCP */}
            <section id="mcp" className={styles.section}>
              <h2>
                <span className={styles.idx}>09 /</span> MCP (Model Context Protocol) サーバー連携
              </h2>
              <p>
                Anthropic が提唱し業界標準となった MCP をネイティブサポートしています。データベース接続・DevTools・GitHub API などを CLI から直接制御可能です。
              </p>
            </section>

            {/* 10 CUSTOM AGENTS / SKILLS / PLUGINS */}
            <section id="custom-agents" className={styles.section}>
              <h2>
                <span className={styles.idx}>10 /</span> カスタムエージェント・Skills・Plugins・Hooks
              </h2>
              <p>
                プロジェクト配下の <code>.claude/skills/</code> または <code>.agent/skills/</code> に <code>SKILL.md</code> を配置することで、独自の定型タスクやルールをエージェントへ拡張できます。
              </p>
            </section>

            {/* 11 AUTOMATION & CI/CD */}
            <section id="automation" className={styles.section}>
              <h2>
                <span className={styles.idx}>11 /</span> 自動化・スクリプティング・CI/CD 連携
              </h2>
              <p>
                CLI の非対話モード (<code>agy -p "prompt"</code>) を用いて GitHub Actions や Makefile に組み込むことができます。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_7} id="diag-7" />
              </div>
            </section>

            {/* 12 BEST PRACTICES */}
            <section id="best-practices" className={styles.section}>
              <h2>
                <span className={styles.idx}>12 /</span> ベストプラクティス (公式ガイド + 実務 Tips 統合版)
              </h2>
              <p>
                効果的なエージェント駆動開発のための 4 ステップ（探索・計画・実行・検証）フローです。
              </p>

              <div className={styles.mermaidWrap}>
                <MermaidDiagram chart={DIAG_8} id="diag-8" />
              </div>
            </section>

            {/* 13 TROUBLESHOOTING */}
            <section id="troubleshoot" className={styles.section}>
              <h2>
                <span className={styles.idx}>13 /</span> トラブルシューティング
              </h2>
              <ul>
                <li>
                  <strong>TUI 描画崩れ:</strong> ターミナルのリサイズを行なうか <code>Ctrl+L</code> で再描画。
                </li>
                <li>
                  <strong>権限エラー:</strong> <code>settings.json</code> の <code>toolPermission</code> を確認。
                </li>
                <li>
                  <strong>コンテキスト溢れ:</strong> <code>/compact</code> を定期的に実行。
                </li>
              </ul>
            </section>

            {/* 14 SECURITY */}
            <section id="security" className={styles.section}>
              <h2>
                <span className={styles.idx}>14 /</span> セキュリティ上の注意
              </h2>
              <p>
                本番データベースやシークレット情報を含むディレクトリで <code>always-proceed</code> モードを使用しないよう厳重に注意してください。
              </p>
            </section>

            {/* 15 REFERENCES */}
            <section id="references" className={styles.section}>
              <h2>
                <span className={styles.idx}>15 /</span> 参考文献 & 情報源
              </h2>
              <ul>
                <li>
                  <Ext href="https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights">
                    Google I/O 2026 Developer Highlights (Official Blog)
                  </Ext>
                </li>
                <li>
                  <Ext href="https://developers.googleblog.com/all-the-news-from-the-google-io-2026-developer-keynote">
                    Google I/O 2026 Developer Keynote Overview
                  </Ext>
                </li>
                <li>
                  <Ext href="https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli">
                    Transitioning Gemini CLI to Antigravity CLI Announcement
                  </Ext>
                </li>
              </ul>
            </section>
          </div>

          <footer className={styles.pageFooter}>
            Antigravity CLI 完全ガイド — 2026-07-28 時点の公開情報にもとづくリファレンス。図解はすべて Mermaid で描画。
          </footer>
        </main>
      </div>
    </div>
  );
}
