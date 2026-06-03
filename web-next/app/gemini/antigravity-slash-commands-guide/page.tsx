import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

export const metadata = {
  title: "Gemini CLI / Antigravity スラッシュコマンド完全ガイド v0.44.1",
  description:
    "Gemini CLI / Antigravity CLI の全コマンドをステップバイステップで解説。初学者がゼロから実践できるベストプラクティス付き。",
};

export default function AntigravitySlashCommandsGuidePage() {
  return (
    <main className={`antigravity-guide-wrapper ${styles.pageWrapper}`}>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="nav-brand">
            Gemini<span>/</span>Antigravity
          </div>
          <a className="nav-link" href="#ch1">
            プレフィックス
          </a>
          <a className="nav-link" href="#ch2">
            全体マップ
          </a>
          <a className="nav-link" href="#ch3">
            セッション管理
          </a>
          <a className="nav-link" href="#ch4">
            コンテキスト
          </a>
          <a className="nav-link" href="#ch5">
            ツール確認
          </a>
          <a className="nav-link" href="#ch6">
            UI設定
          </a>
          <a className="nav-link" href="#ch7">
            Plan Mode
          </a>
          <a className="nav-link" href="#ch8">
            カスタム
          </a>
          <a className="nav-link" href="#ch9">
            @と!
          </a>
          <a className="nav-link" href="#ch10">
            選択フロー
          </a>
          <a className="nav-link" href="#ch11">
            ベスト10則
          </a>
          <a className="nav-link" href="#ch12">
            よくあるミス
          </a>
          <a className="nav-link" href="#ch13">
            リファレンス
          </a>
          <a className="nav-link" href="#ch14">
            参考ソース
          </a>
          <div className="nav-ver">CLI v0.44.1 / Antigravity 1.0.3</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-tag">
          Gemini CLI v0.44.1 &nbsp;|&nbsp; Antigravity CLI 1.0.3 &nbsp;|&nbsp; IDE 2.0.3
        </div>
        <h1>
          <span className="accent">スラッシュコマンド</span>
          <br />
          完全ガイド
        </h1>
        <p className="hero-sub">
          Gemini CLI / Antigravity CLI の全コマンドをステップバイステップで解説。
          <br />
          初学者がゼロから実践できるベストプラクティス付き。
        </p>
        <div className="hero-badges">
          <span className="ver-badge vb-g">Gemini CLI v0.44.1</span>
          <span className="ver-badge vb-c">Antigravity CLI 1.0.3</span>
          <span className="ver-badge vb-y">IDE Commit 2.0.3</span>
          <span className="ver-badge vb-r">2026-06-18 移行予告</span>
        </div>
      </section>

      <div className="wrap">
        {/* IMPORTANT NOTICE */}
        <div className="alert alert-warn" style={{ marginBottom: "32px" }}>
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>移行のお知らせ（2026年6月18日）</strong>
            <br />
            無料ユーザー・Google One ユーザー向けに
            <strong>Gemini CLI → Antigravity CLI</strong> へ移行されます。有料ユーザー（Google AI
            Pro / Ultra）は引き続き Gemini CLI を利用できます。
            コマンド体系・設定場所はほぼ共通です。
            <a
              href="https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli"
              target="_blank"
              rel="noopener noreferrer"
            >
              公式ブログ ↗
            </a>
          </div>
        </div>

        {/* TOC */}
        <section id="toc" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">目次</span>
            <h2>全章一覧</h2>
          </div>
          <div className="toc-grid">
            <a className="toc-card" href="#ch1">
              <div className="toc-card-num">Ch 1 · K1</div>
              <div className="toc-card-title">コマンドプレフィックスの3種類</div>
              <div className="toc-card-sub">/ @ ! の使い分け</div>
            </a>
            <a className="toc-card" href="#ch2">
              <div className="toc-card-num">Ch 2 · K1</div>
              <div className="toc-card-title">スラッシュコマンド全体マップ</div>
              <div className="toc-card-sub">全コマンドのカテゴリ構造</div>
            </a>
            <a className="toc-card" href="#ch3">
              <div className="toc-card-num">Ch 3 · K3</div>
              <div className="toc-card-title">セッション管理コマンド</div>
              <div className="toc-card-sub">/chat /clear /compress /restore /copy</div>
            </a>
            <a className="toc-card" href="#ch4">
              <div className="toc-card-num">Ch 4 · K3</div>
              <div className="toc-card-title">コンテキスト・メモリ管理</div>
              <div className="toc-card-sub">/memory /directory /init</div>
            </a>
            <a className="toc-card" href="#ch5">
              <div className="toc-card-num">Ch 5 · K2</div>
              <div className="toc-card-title">ツール・設定確認コマンド</div>
              <div className="toc-card-sub">/mcp /tools /settings /stats</div>
            </a>
            <a className="toc-card" href="#ch6">
              <div className="toc-card-num">Ch 6 · K1</div>
              <div className="toc-card-title">UIカスタマイズコマンド</div>
              <div className="toc-card-sub">/theme /editor /vim</div>
            </a>
            <a className="toc-card" href="#ch7">
              <div className="toc-card-num">Ch 7 · K3</div>
              <div className="toc-card-title">Plan Mode — 安全な計画立案</div>
              <div className="toc-card-sub">read-only で影響範囲を把握</div>
            </a>
            <a className="toc-card" href="#ch8">
              <div className="toc-card-num">Ch 8 · K3</div>
              <div className="toc-card-title">カスタムコマンド TOML形式</div>
              <div className="toc-card-sub">.gemini/commands/ に .toml で定義</div>
            </a>
            <a className="toc-card" href="#ch9">
              <div className="toc-card-num">Ch 9 · K2</div>
              <div className="toc-card-title">@ コマンドと ! コマンド</div>
              <div className="toc-card-sub">ファイル注入・シェル実行</div>
            </a>
            <a className="toc-card" href="#ch10">
              <div className="toc-card-num">Ch 10 · K2</div>
              <div className="toc-card-title">コマンド選択フローチャート</div>
              <div className="toc-card-sub">状況に応じた判断フロー</div>
            </a>
            <a className="toc-card" href="#ch11">
              <div className="toc-card-num">Ch 11 · K3</div>
              <div className="toc-card-title">ベストプラクティス 10 則</div>
              <div className="toc-card-sub">効率的な開発ワークフロー</div>
            </a>
            <a className="toc-card" href="#ch12">
              <div className="toc-card-num">Ch 12 · K2</div>
              <div className="toc-card-title">よくあるミスと解決策</div>
              <div className="toc-card-sub">初学者が陥りがちなパターン</div>
            </a>
            <a className="toc-card" href="#ch13">
              <div className="toc-card-num">Ch 13 · K1</div>
              <div className="toc-card-title">クイックリファレンスカード</div>
              <div className="toc-card-sub">全コマンドの早見表</div>
            </a>
            <a className="toc-card" href="#ch14">
              <div className="toc-card-num">Ch 14</div>
              <div className="toc-card-title">参考ソース一覧</div>
              <div className="toc-card-sub">公式ドキュメント・URL</div>
            </a>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH1: PREFIX TYPES */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch1" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 01</span>
            <span className="chapter-klevel kl1">K1 認識</span>
            <h2>
              コマンドプレフィックスの<span className="cmd">3種類</span>
            </h2>
          </div>

          <p>
            <strong>定義</strong>: Gemini CLI / Antigravity CLI では、入力の
            <strong>先頭文字</strong>
            によって処理が3種類に分岐します。プレフィックスを理解することで、あらゆる操作を迷わず使えるようになります。
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>プレフィックス</th>
                  <th>名称</th>
                  <th>役割</th>
                  <th>例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/</td>
                  <td>スラッシュ</td>
                  <td>CLI 自体の動作を制御する「メタコマンド」</td>
                  <td>
                    <code>/memory show</code>
                  </td>
                </tr>
                <tr>
                  <td>@</td>
                  <td>アットマーク</td>
                  <td>ファイル・ディレクトリの内容をプロンプトに埋め込む</td>
                  <td>
                    <code>@src/main.ts を説明して</code>
                  </td>
                </tr>
                <tr>
                  <td>!</td>
                  <td>エクスクラメーション</td>
                  <td>シェルコマンドをターミナルで直接実行する</td>
                  <td>
                    <code>!git status</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="compare-grid">
            <div className="compare-card compare-ok">
              <div className="compare-label">✅ 正しい使い分け</div>
              <pre>
                <span className="code-comment"># CLI 設定を確認したい → /</span>
                {"\n"}
                <span className="code-green">/memory show</span>
                {"\n\n"}
                <span className="code-comment"># ファイルを読ませたい → @</span>
                {"\n"}
                <span className="code-green">@src/app.ts この関数を最適化して</span>
                {"\n\n"}
                <span className="code-comment"># git の状態を確認したい → !</span>
                {"\n"}
                <span className="code-green">!git log --oneline -5</span>
              </pre>
            </div>
            <div className="compare-card compare-ng">
              <div className="compare-label">❌ よくある混同</div>
              <pre>
                <span className="code-comment"># ファイルを読ませたいのに / を使う</span>
                {"\n"}
                <span className="code-red">/src/app.ts を説明して</span>
                {"\n"}
                <span className="code-comment"># → コマンドとして解釈されエラーになる</span>
                {"\n\n"}
                <span className="code-comment"># CLI 設定を変えたいのに @ を使う</span>
                {"\n"}
                <span className="code-red">@memory refresh</span>
                {"\n"}
                <span className="code-comment"># → memory ファイルを探してしまう</span>
              </pre>
            </div>
          </div>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ プレフィックス別の処理フロー</div>
            <div id="diag-1" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart LR\nINPUT["ユーザーの入力"]\nINPUT --> S["/ スラッシュ<br />CLI自体を制御<br />/memory<br />/chat /settings"]\nINPUT --> A["@ アットマーク<br />ファイル内容を注入<br />@src/file.ts"]\nINPUT --> B["! エクスクラメーション<br />シェル直接実行<br />!git status"]\nINPUT --> P["プレーンテキスト<br />AIへの通常の指示"]\nstyle S fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle A fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle B fill:#2a1a0d,stroke:#f0b429,color:#f0b429\nstyle P fill:#1c1c1c,stroke:#4a5568,color:#8b949e'
                }
              />
            </div>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://google-gemini.github.io/gemini-cli/docs/cli/commands.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CLI Commands Reference (公式)
              </a>
              — コマンドプレフィックスの公式仕様
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH2: OVERALL MAP */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch2" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 02</span>
            <span className="chapter-klevel kl1">K1 認識</span>
            <h2>
              スラッシュコマンド<span className="cmd">全体マップ</span>
            </h2>
          </div>

          <p>
            <strong>定義</strong>:
            スラッシュコマンドは5つのカテゴリに分類されます。全体像を把握してから個別コマンドを学ぶことで、「どこに何があるか」を迷わず判断できます。
          </p>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ スラッシュコマンド カテゴリマップ</div>
            <div id="diag-2" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart TB\nROOT["スラッシュコマンド"]\nROOT --> S["セッション管理<br />chat /<br />clear<br />compress / restore<br />copy"]\nROOT --> C["コンテキスト管理<br />memory /<br />directory<br />init"]\nROOT --> T["ツール確認<br />mcp / tools<br />settings / stats<br />extensions"]\nROOT --> U["UIカスタマイズ<br />theme / editor<br />vim"]\nROOT --> O["その他<br />auth / about<br />bug<br />/ privacy<br />help / quit"]\nstyle ROOT fill:#0d1117,stroke:#00ff88,color:#00ff88\nstyle S fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle C fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle T fill:#1e1a2a,stroke:#7c4dff,color:#7c4dff\nstyle U fill:#2a1a0d,stroke:#f0b429,color:#f0b429\nstyle O fill:#1c1c1c,stroke:#4a5568,color:#8b949e'
                }
              />
            </div>
          </div>

          <div className="arch-layers">
            <div className="arch-layer l-cyan">
              <div className="arch-label" style={{ color: "var(--neon-cyan)" }}>
                セッション
              </div>
              <div className="arch-content">
                <strong>/chat, /clear, /compress, /restore, /copy</strong>
                <span>会話の保存・再開・圧縮・ファイル巻き戻し</span>
              </div>
            </div>
            <div className="arch-layer l-green">
              <div className="arch-label" style={{ color: "var(--neon-green)" }}>
                コンテキスト
              </div>
              <div className="arch-content">
                <strong>/memory, /directory, /init</strong>
                <span>GEMINI.md 管理・ワークスペース設定・自動生成</span>
              </div>
            </div>
            <div className="arch-layer l-purple">
              <div className="arch-label" style={{ color: "var(--neon-purple)" }}>
                ツール確認
              </div>
              <div className="arch-content">
                <strong>/mcp, /tools, /settings, /stats, /extensions</strong>
                <span>MCP サーバー・設定エディタ・統計表示</span>
              </div>
            </div>
            <div className="arch-layer l-yellow">
              <div className="arch-label" style={{ color: "var(--neon-yellow)" }}>
                UI設定
              </div>
              <div className="arch-content">
                <strong>/theme, /editor, /vim</strong>
                <span>テーマ・エディタ・vim モードの切り替え</span>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/reference/commands/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Command Reference (geminicli.com)
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH3: SESSION MANAGEMENT */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch3" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 03</span>
            <span className="chapter-klevel kl3">K3 適用</span>
            <h2>セッション管理コマンド</h2>
          </div>

          <h3>
            3.1 <code>/chat</code> — 会話の保存と再開
          </h3>
          <p>
            <strong>定義</strong>: 会話状態をタグ付きで保存し、後から再開・共有できる機能です。
          </p>
          <p>
            <strong>理由</strong>:
            セッションをまたいで長い作業を続けるとき、再度コンテキストを説明し直す手間を省けます。
          </p>

          <div className="alert alert-warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>v0.44.x の変更点</strong>: 以前の
              <code>/rewind</code>（ファイル変更の巻き戻し）機能は
              <code>/restore</code> に統合されました。<code>/chat</code>
              はセッションの保存・再開専用です。
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>説明</th>
                  <th>使用例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/chat save &lt;タグ&gt;</td>
                  <td>現在の会話をタグ付きで保存</td>
                  <td>
                    <code>/chat save feature-auth</code>
                  </td>
                </tr>
                <tr>
                  <td>/chat resume &lt;タグ&gt;</td>
                  <td>保存した会話を再開</td>
                  <td>
                    <code>/chat resume feature-auth</code>
                  </td>
                </tr>
                <tr>
                  <td>/chat list</td>
                  <td>保存済み会話の一覧表示</td>
                  <td>
                    <code>/chat list</code>
                  </td>
                </tr>
                <tr>
                  <td>/chat delete &lt;タグ&gt;</td>
                  <td>保存済み会話を削除</td>
                  <td>
                    <code>/chat delete old-session</code>
                  </td>
                </tr>
                <tr>
                  <td>/chat share &lt;ファイル名&gt;</td>
                  <td>会話を Markdown/JSON に書き出し</td>
                  <td>
                    <code>/chat share report.md</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>ステップバイステップ: 翌日に作業を再開する</h4>
          <div className="step-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">作業の区切りで保存する</div>
                <div className="step-desc">
                  <div className="code-block">
                    <div className="code-bar">
                      <div className="code-code-dots">
                        <div className="cd" style={{ background: "#ff5f57" }}></div>
                        <div className="cd" style={{ background: "#ffbd2e" }}></div>
                        <div className="cd" style={{ background: "#28c840" }}></div>
                      </div>
                      <span className="code-title">terminal</span>
                    </div>
                    <pre className="code-body">
                      <span className="code-green">/chat save</span>{" "}
                      <span className="code-arg">before-refactor</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <div className="step-title">翌日・別ターミナルから再開する</div>
                <div className="step-desc">
                  <div className="code-block">
                    <div className="code-bar">
                      <div className="code-code-dots">
                        <div className="cd" style={{ background: "#ff5f57" }}></div>
                        <div className="cd" style={{ background: "#ffbd2e" }}></div>
                        <div className="cd" style={{ background: "#28c840" }}></div>
                      </div>
                      <span className="code-title">terminal</span>
                    </div>
                    <pre className="code-body">
                      <span className="code-green">/chat resume</span>{" "}
                      <span className="code-arg">before-refactor</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <div className="step-title">保存済み一覧を確認する</div>
                <div className="step-desc">
                  <div className="code-block">
                    <div className="code-bar">
                      <div className="code-code-dots">
                        <div className="cd" style={{ background: "#ff5f57" }}></div>
                        <div className="cd" style={{ background: "#ffbd2e" }}></div>
                        <div className="cd" style={{ background: "#28c840" }}></div>
                      </div>
                      <span className="code-title">terminal</span>
                    </div>
                    <pre className="code-body">
                      <span className="code-green">/chat list</span>
                      {"\n"}
                      <span className="code-comment"># 出力例:</span>
                      {"\n"}
                      <span className="code-white"> before-refactor 2026-05-30 14:22</span>
                      {"\n"}
                      <span className="code-white"> feature-auth 2026-05-29 09:11</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <div className="step-title">会話をチームと共有する</div>
                <div className="step-desc">
                  <div className="code-block">
                    <div className="code-bar">
                      <div className="code-code-dots">
                        <div className="cd" style={{ background: "#ff5f57" }}></div>
                        <div className="cd" style={{ background: "#ffbd2e" }}></div>
                        <div className="cd" style={{ background: "#28c840" }}></div>
                      </div>
                      <span className="code-title">terminal</span>
                    </div>
                    <pre className="code-body">
                      <span className="code-green">/chat share</span>{" "}
                      <span className="code-arg">review-2026-05-31.md</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          <h3>
            3.2 <code>/clear</code> — 画面クリア
          </h3>
          <p>
            <strong>定義</strong>: ターミナルの表示をクリアします。セッションデータは保持されます。
          </p>
          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">terminal</span>
              <span className="code-lang">ショートカット: Ctrl+L</span>
            </div>
            <pre className="code-body">
              <span className="code-green">/clear</span>
            </pre>
          </div>

          <div className="section-divider"></div>

          <h3>
            3.3 <code>/compress</code> — コンテキスト圧縮
          </h3>
          <p>
            <strong>定義</strong>:
            チャット履歴全体を高レベルの要約に置き換えてトークンを節約します。
          </p>
          <p>
            <strong>理由</strong>: 長時間の作業でコンテキストが膨らむと応答が遅くなります。
            <code>/compress</code>
            で圧縮すると作業の文脈を保ちながら軽量化できます。
          </p>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ /compress の効果</div>
            <div id="diag-3" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart LR\nA["長くなった<br />チャット履歴<br />大量トークン消費"]\nB["/compress 実行"]\nC["高レベルの要約<br />文脈は保持<br />トークン節約"]\nD["レスポンスが<br />軽快に戻る"]\nA --> B\nB --> C\nC --> D\nstyle A fill:#2a0d0d,stroke:#ff4757,color:#ff4757\nstyle C fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle D fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff'
                }
              />
            </div>
          </div>

          <div className="section-divider"></div>

          <h3>
            3.4 <code>/restore</code> — ファイル変更の巻き戻し
          </h3>
          <p>
            <strong>定義</strong>: ツール実行前の状態にプロジェクトファイルを復元します。
          </p>
          <div className="alert alert-warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>前提条件</strong>:<code>--checkpointing</code> オプション付きで起動するか、
              <code>.gemini/settings.json</code>
              でチェックポインティングを有効化している必要があります。
            </div>
          </div>

          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">terminal</span>
            </div>
            <pre className="code-body">
              <span className="code-comment"># 直前のチェックポイントに戻す</span>
              {"\n"}
              <span className="code-green">/restore</span>
              {"\n\n"}
              <span className="code-comment"># 特定のツール呼び出し時点まで戻す</span>
              {"\n"}
              <span className="code-green">/restore</span>{" "}
              <span className="code-arg">{"<tool_call_id>"}</span>
            </pre>
          </div>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ /restore と /chat resume の使い分け</div>
            <div id="diag-4" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart TD\nA["問題が発生した"]\nB{"何を戻したいか"}\nB --> C["ファイルの変更を<br />元に戻したい"]\nB --> D["会話の流れを<br />特定時点から再開したい"]\nC --> E["/restore<br />チェックポイント時点に復元<br />前提: checkpointing有効"]\nD --> F["/chat<br />resume タグ名<br />保存済み会話から再開<br />前提: chat save済み"]\nA --> B\nstyle E fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle F fill:#0d2e1a,stroke:#00ff88,color:#00ff88'
                }
              />
            </div>
          </div>

          <div className="section-divider"></div>

          <h3>
            3.5 <code>/copy</code> — 最後の出力をコピー
          </h3>
          <p>AI の最後の出力をクリップボードにコピーします。</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>OS</th>
                  <th>必要なツール</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Linux</td>
                  <td>
                    <code>xclip</code> または <code>xsel</code>（要インストール）
                  </td>
                </tr>
                <tr>
                  <td>macOS</td>
                  <td>
                    <code>pbcopy</code>（プリインストール済み）
                  </td>
                </tr>
                <tr>
                  <td>Windows</td>
                  <td>
                    <code>clip</code>（プリインストール済み）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/cli/tutorials/session-management/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Session Management Tutorial (公式)
              </a>
              ·
              <a
                href="https://geminicli.com/docs/cli/checkpointing/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Checkpointing (公式)
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH4: CONTEXT MANAGEMENT */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch4" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 04</span>
            <span className="chapter-klevel kl3">K3 適用</span>
            <h2>コンテキスト・メモリ管理コマンド</h2>
          </div>

          <h3>
            4.1 <code>/memory</code> — GEMINI.md 管理
          </h3>
          <p>
            <strong>定義</strong>: GEMINI.md
            ファイルから読み込まれた階層型メモリを確認・更新・追記する機能です。
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>説明</th>
                  <th>使用例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/memory show</td>
                  <td>現在ロードされているコンテキスト全体を表示</td>
                  <td>
                    <code>/memory show</code>
                  </td>
                </tr>
                <tr>
                  <td>/memory refresh</td>
                  <td>全 GEMINI.md を再スキャンして更新</td>
                  <td>
                    <code>/memory refresh</code>
                  </td>
                </tr>
                <tr>
                  <td>/memory add &lt;テキスト&gt;</td>
                  <td>メモリにテキストを即時追記</td>
                  <td>
                    <code>/memory add "本番DBへのDELETE禁止"</code>
                  </td>
                </tr>
                <tr>
                  <td>/memory list</td>
                  <td>使用中の GEMINI.md ファイルのパス一覧</td>
                  <td>
                    <code>/memory list</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>ステップバイステップ</h4>
          <div className="step-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">エージェントが何を知っているか確認する</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-green">/memory show</span>
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <div className="step-title">GEMINI.md 編集後、即座に反映させる</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-green">/memory refresh</span>
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <div className="step-title">作業中に発見した知識を永続化する</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-green">/memory add</span>{" "}
                    <span className="code-string">
                      &quot;Cloud SQLの接続は/cloudsql/&#123;conn-name&#125;を使う&quot;
                    </span>
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <div className="step-title">読み込まれているファイルを確認する</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-green">/memory list</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <h4>GEMINI.md の階層構造と優先度</h4>
          <div className="arch-layers">
            <div className="arch-layer l-green">
              <div className="arch-label" style={{ color: "var(--neon-green)" }}>
                最高優先
              </div>
              <div className="arch-content">
                <strong>Auto-scan — 作業ファイル近くの GEMINI.md</strong>
                <span>エージェントがアクセスしたファイルの近傍を自動検出</span>
              </div>
            </div>
            <div className="arch-layer l-cyan">
              <div className="arch-label" style={{ color: "var(--neon-cyan)" }}>
                高優先
              </div>
              <div className="arch-content">
                <strong>Sub-directory — src/GEMINI.md 等</strong>
                <span>サブディレクトリ固有のルールを定義</span>
              </div>
            </div>
            <div className="arch-layer l-yellow">
              <div className="arch-label" style={{ color: "var(--neon-yellow)" }}>
                中優先
              </div>
              <div className="arch-content">
                <strong>Project Root — ./GEMINI.md</strong>
                <span>プロジェクト全体のコンテキスト</span>
              </div>
            </div>
            <div className="arch-layer l-red">
              <div className="arch-label" style={{ color: "var(--neon-red)" }}>
                低優先
              </div>
              <div className="arch-content">
                <strong>Global — ~/.gemini/GEMINI.md</strong>
                <span>全プロジェクト共通のデフォルト設定</span>
              </div>
            </div>
          </div>
          <div className="callout callout-info">
            <strong>ポイント</strong>: すべての GEMINI.md が<strong>結合</strong>
            されてモデルに送られます。より深い階層のファイルの内容が優先されます。
          </div>

          <div className="section-divider"></div>

          <h3>
            4.2 <code>/directory</code> (<code>/dir</code>) — ワークスペース管理
          </h3>
          <p>
            複数ディレクトリのサポートのために、ワークスペースにディレクトリを追加・確認します。
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>説明</th>
                  <th>使用例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/dir add &lt;パス&gt;</td>
                  <td>ワークスペースにディレクトリを追加</td>
                  <td>
                    <code>/dir add ../shared-lib</code>
                  </td>
                </tr>
                <tr>
                  <td>/dir show</td>
                  <td>追加済みディレクトリを表示</td>
                  <td>
                    <code>/dir show</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="alert alert-warn">
            <span className="alert-icon">⚠️</span>
            <div>
              制限的なサンドボックスプロファイル使用時は <code>/dir add</code> が無効です。
            </div>
          </div>

          <div className="section-divider"></div>

          <h3>
            4.3 <code>/init</code> — GEMINI.md 自動生成
          </h3>
          <p>
            <strong>定義</strong>: 現在のディレクトリを分析して、プロジェクト専用の GEMINI.md
            を自動生成します。
          </p>
          <p>
            <strong>理由</strong>: 新しいプロジェクトで手動で GEMINI.md
            を作成するのは手間がかかります。<code>/init</code>
            を使えば技術スタックを自動検出して最適な初期コンテキストを生成できます。
          </p>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ /init の処理フロー</div>
            <div id="diag-5" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart LR\nA["/init 実行"]\nB["現在のディレクトリを分析<br />技術スタック・構成を把握"]\nC["GEMINI.md を自動生成<br />プロジェクト固有のコンテキスト"]\nD["エージェントがプロジェクトを<br />深く理解した状態で作業開始"]\nA --> B\nB --> C\nC --> D\nstyle A fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle C fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle D fill:#1e1a2a,stroke:#7c4dff,color:#7c4dff'
                }
              />
            </div>
          </div>

          <div className="callout callout-info">
            <strong>初回セットアップのベストプラクティス</strong>: 新規プロジェクトでは最初に
            <code>/init</code> を実行し、生成された GEMINI.md
            を確認・編集してからコーディングを開始しましょう。
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/cli/gemini-md/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Context (GEMINI.md) 公式ドキュメント
              </a>
              ·
              <a
                href="https://geminicli.com/docs/cli/tutorials/memory-management/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Memory Management Tutorial
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH5: TOOLS & SETTINGS */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch5" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 05</span>
            <span className="chapter-klevel kl2">K2 理解</span>
            <h2>ツール・設定確認コマンド</h2>
          </div>

          <h3>
            5.1 <code>/mcp</code> — MCP サーバー確認
          </h3>
          <p>
            設定済みの MCP (Model Context Protocol) サーバーの状態と利用可能なツールを確認します。
            <br />
            <strong>キーボードショートカット</strong>: <kbd>Ctrl+T</kbd>{" "}
            でツール説明の表示/非表示を切り替え
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/mcp</td>
                  <td>MCP サーバーの一覧・接続状態・ツール表示</td>
                </tr>
                <tr>
                  <td>/mcp desc</td>
                  <td>MCP サーバーとツールの詳細説明を表示</td>
                </tr>
                <tr>
                  <td>/mcp nodesc</td>
                  <td>ツール名のみ表示（説明を非表示）</td>
                </tr>
                <tr>
                  <td>/mcp schema</td>
                  <td>ツールの JSON スキーマを表示</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            5.2 <code>/tools</code> — 使用可能ツール一覧
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>説明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/tools</td>
                  <td>ツール名の一覧を表示</td>
                </tr>
                <tr>
                  <td>/tools desc</td>
                  <td>各ツールの詳細説明を表示</td>
                </tr>
                <tr>
                  <td>/tools nodesc</td>
                  <td>ツール名のみ表示</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>
            5.3 <code>/settings</code> — 設定エディタ
          </h3>
          <p>
            <code>.gemini/settings.json</code> を直接編集するより安全な GUI
            設定エディタを開きます。バリデーション付きの UI で設定を変更できます。
          </p>
          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
            </div>
            <pre className="code-body">
              <span className="code-green">/settings</span>
            </pre>
          </div>

          <h3>
            5.4 <code>/stats</code> — セッション統計
          </h3>
          <p>現在のセッションのトークン使用量・キャッシュ節約量・セッション時間を表示します。</p>
          <div className="alert alert-warn">
            <span className="alert-icon">⚠️</span>
            <div>
              キャッシュトークン情報は <strong>API キー認証時のみ</strong>表示されます。OAuth
              認証（Google アカウント）では現時点では表示されません。
            </div>
          </div>

          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Input Tokens 使用量</span>
                <span className="progress-val">42,300 / 1,000,000</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill pf-g"
                  style={{ "--prog-w": "4.2%" } as React.CSSProperties}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Output Tokens 使用量</span>
                <span className="progress-val">8,100 / 1,000,000</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill pf-c"
                  style={{ "--prog-w": "0.8%" } as React.CSSProperties}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">キャッシュ節約率</span>
                <span className="progress-val">67%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill pf-y"
                  style={{ "--prog-w": "67%" } as React.CSSProperties}
                ></div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            ※ /stats の表示イメージ（実際の値はセッションによって異なります）
          </p>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/reference/commands/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Full Command Reference
              </a>
              ·
              <a
                href="https://geminicli.com/docs/reference/keyboard-shortcuts/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Keyboard Shortcuts
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH6: UI CUSTOMIZATION */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch6" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 06</span>
            <span className="chapter-klevel kl1">K1 認識</span>
            <h2>UIカスタマイズコマンド</h2>
          </div>

          <div className="exam-grid">
            <div className="exam-card">
              <div className="exam-cmd">/theme</div>
              <div className="exam-desc">
                視覚テーマを変更するダイアログを開く。色覚多様性対応テーマ含む（v0.40.0〜）
              </div>
              <div className="exam-stars">★★★☆☆</div>
            </div>
            <div className="exam-card">
              <div className="exam-cmd">/editor</div>
              <div className="exam-desc">
                対応エディタを選択するダイアログを開く。マルチライン入力に活用
              </div>
              <div className="exam-stars">★★☆☆☆</div>
            </div>
            <div className="exam-card">
              <div className="exam-cmd">/vim</div>
              <div className="exam-desc">
                入力エリアで vim スタイルのナビゲーションを有効化/無効化。設定は永続保存
              </div>
              <div className="exam-stars">★★★★☆</div>
            </div>
          </div>

          <h3>vim モードの操作表</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>モード</th>
                  <th>フッター表示</th>
                  <th>主な操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NORMAL</td>
                  <td>
                    <code>[NORMAL]</code>
                  </td>
                  <td>
                    <code>h/j/k/l</code> 移動、<code>w/b</code> 単語移動、<code>dd</code>
                    行削除、<code>i</code> で INSERT へ
                  </td>
                </tr>
                <tr>
                  <td>INSERT</td>
                  <td>
                    <code>[INSERT]</code>
                  </td>
                  <td>
                    通常のテキスト入力。<code>Esc</code> で NORMAL へ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="callout callout-info">
            vim モードの設定は
            <code>~/.gemini/settings.json</code> に保存され、セッション間で保持されます。
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/reference/keyboard-shortcuts/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Keyboard Shortcuts Reference (公式)
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH7: PLAN MODE */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch7" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 07</span>
            <span className="chapter-klevel kl3">K3 適用</span>
            <h2>
              Plan Mode — <span className="cmd">安全な計画立案</span>
            </h2>
          </div>

          <p>
            <strong>定義</strong>: Plan Mode は<strong>コードを一切変更せず</strong>{" "}
            に、変更計画だけを安全に立案できる read-only モードです。
          </p>
          <p>
            <strong>理由</strong>:
            大きな変更や影響範囲が不明な修正でも、まず計画を立てて人間がレビューすることでミスを防げます。「5分の計画が数時間のバグ修正を防ぐ」の原則です。
          </p>

          <div className="alert alert-warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>起動方法（v0.44.x）</strong>: Plan Mode は独立したスラッシュコマンドではなく、
              <code>/settings</code>
              から切り替えるか、起動時フラグで有効化します。
            </div>
          </div>

          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">起動方法</span>
            </div>
            <pre className="code-body">
              <span className="code-comment"># 起動時に Plan Mode で開始する</span>
              {"\n"}
              <span className="code-cmd">gemini</span> <span className="code-keyword">--plan</span>
              {"\n\n"}
              <span className="code-comment"># または /settings から手動で切り替え</span>
              {"\n"}
              <span className="code-green">/settings</span>
              {"\n"}
              <span className="code-comment"># → Plan Mode の ON/OFF を切り替え</span>
            </pre>
          </div>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ Plan Mode の動作フロー</div>
            <div id="diag-6" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart TD\nA["Plan Mode 有効化"]\nB["作業内容を自然言語で伝える<br />例:<br />JWT認証をOAuth2に移行したい"]\nC["エージェントが read-only で<br />コードベースを分析"]\nD["Implementation Plan を生成<br />変更ファイル・変更内容・影響範囲・リスク"]\nE{"人間がレビュー"}\nF["Plan Mode を無効化して<br />通常モードで実装を依頼"]\nG["計画を修正して<br />再立案"]\nA --> B\nB --> C\nC --> D\nD --> E\nE --> |承認| F\nE --> |修正| G\nG --> B\nstyle A fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle D fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle F fill:#2a1a0d,stroke:#f0b429,color:#f0b429'
                }
              />
            </div>
          </div>

          <h4>Plan Mode でできること・できないこと</h4>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>操作</th>
                  <th>Plan Mode</th>
                  <th>通常モード</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ファイルの読み取り・分析</td>
                  <td>
                    <span className="badge badge-g">できる</span>
                  </td>
                  <td>
                    <span className="badge badge-g">できる</span>
                  </td>
                </tr>
                <tr>
                  <td>コードの計画立案・提案</td>
                  <td>
                    <span className="badge badge-g">できる</span>
                  </td>
                  <td>
                    <span className="badge badge-g">できる</span>
                  </td>
                </tr>
                <tr>
                  <td>ファイルの書き込み・変更</td>
                  <td>
                    <span className="badge badge-r">できない</span>
                  </td>
                  <td>
                    <span className="badge badge-g">できる</span>
                  </td>
                </tr>
                <tr>
                  <td>シェルコマンドの実行</td>
                  <td>
                    <span className="badge badge-r">できない</span>
                  </td>
                  <td>
                    <span className="badge badge-g">できる</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="trend-card">
            <div className="trend-label">v0.33.0 以降の強化</div>
            <h4>Plan Mode にリサーチサブエージェントが追加</h4>
            <p>
              Plan Mode
              でリサーチサブエージェントとアノテーション機能が統合されました。外部ドキュメントも調査した上で、根拠付きの詳細な
              Implementation Plan を生成できるようになりました。
            </p>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/cli/plan-mode/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plan Mode 公式ドキュメント
              </a>
              ·
              <a
                href="https://dev.to/googleai/unlocking-gemini-cli-with-skills-hooks-plan-mode-2bgf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Skills + Hooks + Plan Mode 解説 (DEV Community)
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH8: CUSTOM COMMANDS (TOML) */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch8" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 08</span>
            <span className="chapter-klevel kl3">K3 適用</span>
            <h2>
              カスタムコマンド <span className="cmd">TOML形式</span>
            </h2>
          </div>

          <div className="alert alert-danger">
            <span className="alert-icon">🚨</span>
            <div>
              <strong>v0.44.1 での重要な仕様変更</strong>: カスタムコマンドは
              <strong>TOML 形式</strong> (<code>.toml</code>) で定義します。旧バージョンの Markdown
              形式 (<code>.agent/workflows/*.md</code>) は使用しません。保存場所も
              <strong>
                <code>.gemini/commands/</code>
              </strong>{" "}
              に変わりました。
            </div>
          </div>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ グローバル vs プロジェクトコマンドの優先度</div>
            <div id="diag-7" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart TB\nU["User Global Commands<br />~/.gemini/commands/<br />全プロジェクトで有効"]\nP["Project Local<br />Commands<br />プロジェクト/.gemini/commands/<br />このプロジェクトのみ<br />gitで共有可能"]\nM["アクティブなコマンド<br />同名の場合はProjectが優先"]\nU --> M\nP --> M\nstyle U fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle P fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle M fill:#1e1a2a,stroke:#7c4dff,color:#7c4dff'
                }
              />
            </div>
          </div>

          <h3>8.1 基本的な TOML ファイルの書き方</h3>
          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">.gemini/commands/review.toml</span>
              <span className="code-lang">TOML</span>
            </div>
            <pre className="code-body">
              <span className="code-comment">
                # /review コマンドとして登録される（ファイル名 = コマンド名）
              </span>
              {"\n\n"}
              <span className="code-keyword">description</span>
              {" = "}
              <span className="code-string">
                &quot;コードレビューを実施してレポートを生成する&quot;
              </span>
              {"\n\n"}
              <span className="code-keyword">prompt</span>
              {" = "}
              <span className="code-string">{`"""\n以下の観点でコードレビューを実施してください:\n1. セキュリティ: SQLインジェクション・XSS・認証漏れ\n2. パフォーマンス: N+1クエリ・不要なループ\n3. 設計: 単一責任原則・依存方向\n問題があれば重大度 (P0=致命的/P1=重要/P2=軽微) 付きでリストアップしてください。\n"""`}</span>
            </pre>
          </div>

          <h3>8.2 引数を受け取るコマンド</h3>
          <p>
            <code>&lt;args&gt;</code> プレースホルダーを使ってユーザーの入力を受け取れます。
          </p>
          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">
                .gemini/commands/git/fix.toml → /git:fix "問題の説明"
              </span>
              <span className="code-lang">TOML</span>
            </div>
            <pre className="code-body">
              <span className="code-keyword">description</span>
              {" = "}
              <span className="code-string">
                &quot;指定された問題のコード修正案を生成する&quot;
              </span>
              {"\n\n"}
              <span className="code-keyword">prompt</span>
              {" = "}
              <span className="code-string">
                &quot;以下の問題に対するコード修正案を提供してください: {"<args>"}&quot;
              </span>
            </pre>
          </div>

          <h3>8.3 シェルコマンドの結果を埋め込む</h3>
          <p>
            <code>!&#123;シェルコマンド&#125;</code> 構文でシェルの出力をプロンプトに注入できます。
          </p>
          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">.gemini/commands/git/commit.toml → /git:commit</span>
              <span className="code-lang">TOML</span>
            </div>
            <pre className="code-body">
              <span className="code-keyword">description</span>
              {" = "}
              <span className="code-string">
                &quot;ステージ済みの変更からGitコミットメッセージを生成する&quot;
              </span>
              {"\n\n"}
              <span className="code-keyword">prompt</span>
              {" = "}
              <span className="code-string">{`"""\n以下のgit diffに基づいてConventional Commits形式の\nコミットメッセージを生成してください:\n\`\`\`diff\n!{git diff --staged}\n\`\`\`\n"""`}</span>
            </pre>
          </div>

          <h3>8.4 ファイル内容を埋め込む</h3>
          <p>
            <code>@&#123;ファイルパス&#125;</code> 構文でファイルの内容をプロンプトに注入できます。
          </p>
          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">
                .gemini/commands/review-strict.toml → /review-strict src/UserService.ts
              </span>
              <span className="code-lang">TOML</span>
            </div>
            <pre className="code-body">
              <span className="code-keyword">description</span>
              {" = "}
              <span className="code-string">
                &quot;ベストプラクティスガイドを参照してコードを厳格にレビューする&quot;
              </span>
              {"\n\n"}
              <span className="code-keyword">prompt</span>
              {" = "}
              <span className="code-string">{`"""\n以下のコードをレビューしてください: <args>\n以下のベストプラクティスに従ってレビューすること:\n@{docs/best-practices.md}\n"""`}</span>
            </pre>
          </div>

          <h3>8.5 名前空間（ディレクトリ構造 → コロン区切り）</h3>
          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ ディレクトリ構造とコマンド名のマッピング</div>
            <div id="diag-8" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart LR\nA[".gemini/commands/test.toml"] --> B["/test コマンド"]\nC[".gemini/commands/git/commit.toml"] --> D["/git:commit コマンド"]\nE[".gemini/commands/refactor/pure.toml"] --> F["/refactor:pure コマンド"]\nstyle B fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle D fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle F fill:#1e1a2a,stroke:#7c4dff,color:#7c4dff'
                }
              />
            </div>
          </div>

          <h3>8.6 カスタムコマンド作成 ステップバイステップ</h3>
          <div className="step-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <div className="step-title">プロジェクト用のコマンドディレクトリを作成する</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-cmd">mkdir</span> <span className="code-keyword">-p</span>
                    {" .gemini/commands"}
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <div className="step-title">TOML ファイルを作成する（ファイル名 = コマンド名）</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-cmd">touch</span>
                    {" .gemini/commands/deploy.toml"}
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <div className="step-title">TOML ファイルを記述する</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                    <span className="code-title">.gemini/commands/deploy.toml</span>
                  </div>
                  <pre className="code-body">
                    <span className="code-keyword">description</span>
                    {" = "}
                    <span className="code-string">&quot;ステージング環境にデプロイする&quot;</span>
                    {"\n\n"}
                    <span className="code-keyword">prompt</span>
                    {" = "}
                    <span className="code-string">{`"""\n以下の手順でデプロイを実行してください:\n現在のgitの状態: !{git status}\n1. 未コミットのファイルがある場合は停止してユーザーに報告する\n2. テストを全件実行してPASSを確認する\n3. ビルドを実行する\n4. ステージング環境にデプロイする\n5. ヘルスチェックで動作確認する\n6. デプロイサマリーを出力する\n"""`}</span>
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <div className="step-title">チャットでコマンドを実行する</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-green">/deploy</span>
                  </pre>
                </div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">5</div>
              <div className="step-content">
                <div className="step-title">チームで共有するために git にコミットする</div>
                <div className="code-block">
                  <div className="code-bar">
                    <div className="code-code-dots">
                      <div className="cd" style={{ background: "#ff5f57" }}></div>
                      <div className="cd" style={{ background: "#ffbd2e" }}></div>
                      <div className="cd" style={{ background: "#28c840" }}></div>
                    </div>
                  </div>
                  <pre className="code-body">
                    <span className="code-cmd">git add</span>
                    {" .gemini/commands/\n"}
                    <span className="code-cmd">git commit</span>{" "}
                    <span className="code-keyword">-m</span>{" "}
                    <span className="code-string">
                      &quot;feat: チーム共用デプロイコマンドを追加&quot;
                    </span>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/cli/custom-commands/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Custom Commands 公式ドキュメント
              </a>
              ·
              <a
                href="https://geminicli.com/docs/cli/tutorials/automation/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Automate Tasks Tutorial
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH9: @ AND ! COMMANDS */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch9" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 09</span>
            <span className="chapter-klevel kl2">K2 理解</span>
            <h2>
              <span className="cmd">@</span> コマンドと <span className="cmd">!</span> コマンド
            </h2>
          </div>

          <h3>
            9.1 <code>@</code> — ファイル・ディレクトリ内容の注入
          </h3>
          <p>
            <strong>定義</strong>:<code>@</code>
            に続けてファイルパスを入力すると、そのファイルの内容がプロンプトに埋め込まれます。
          </p>

          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">使用例</span>
            </div>
            <pre className="code-body">
              <span className="code-comment"># 単一ファイルを読ませる</span>
              {"\n"}
              <span className="code-cmd">@src/UserService.ts</span>
              {" このファイルの問題点を指摘して\n\n"}
              <span className="code-comment"># ディレクトリ全体を読ませる</span>
              {"\n"}
              <span className="code-cmd">@src/components/</span>
              {"\nこのディレクトリのコンポーネント設計を評価して\n\n"}
              <span className="code-comment"># 複数ファイルを同時に読ませる</span>
              {"\n"}
              <span className="code-cmd">@src/models/User.ts</span>
              {"\n"}
              <span className="code-cmd">@src/services/UserService.ts</span>
              {" 両ファイルの整合性を確認して"}
            </pre>
          </div>

          <div className="callout callout-info">
            <strong>自動除外</strong>: <code>.gitignore</code> /<code>.geminiignore</code>{" "}
            で除外されているファイルは自動でスキップされます。
          </div>

          <h3>
            9.2 <code>!</code> — シェルコマンドの直接実行
          </h3>
          <p>
            <strong>定義</strong>:<code>!</code>
            に続けてシェルコマンドを入力すると、そのコマンドがターミナルで直接実行されます。
          </p>

          <div className="code-block">
            <div className="code-bar">
              <div className="code-code-dots">
                <div className="cd" style={{ background: "#ff5f57" }}></div>
                <div className="cd" style={{ background: "#ffbd2e" }}></div>
                <div className="cd" style={{ background: "#28c840" }}></div>
              </div>
              <span className="code-title">使用例</span>
            </div>
            <pre className="code-body">
              <span className="code-comment"># 単発実行</span>
              {"\n"}
              <span className="code-cmd">!git</span>
              {" log --oneline -10\n"}
              <span className="code-cmd">!ls</span>
              {" -la src/\n\n"}
              <span className="code-comment"># ! だけ入力するとシェルモードに切り替わる</span>
              {"\n"}
              <span className="code-cmd">!</span>
              {"\n"}
              <span className="code-comment"># → シェルモードに入る。exit で CLI に戻る</span>
            </pre>
          </div>

          <div className="alert alert-danger">
            <span className="alert-icon">🚨</span>
            <div>
              <strong>セキュリティ注意</strong>:<code>!</code>
              で実行したコマンドはターミナルで直接実行したのと同等の権限・影響があります。
              <strong>実行前に内容をよく確認してください。</strong>
              カスタムコマンドの <code>!&#123;...&#125;</code>{" "}
              は実行前に確認ダイアログが表示されます。
            </div>
          </div>

          <div className="compare-grid">
            <div className="compare-card compare-ok">
              <div className="compare-label">✅ 安全な使い方</div>
              <pre>
                <span className="code-comment"># 読み取り専用の確認コマンド</span>
                {"\n"}
                <span className="code-green">!git status</span>
                {"\n"}
                <span className="code-green">!ls -la</span>
                {"\n"}
                <span className="code-green">!cat package.json</span>
                {"\n\n"}
                <span className="code-comment"># 実行前に内容を確認してから</span>
                {"\n"}
                <span className="code-green">!npm test</span>
              </pre>
            </div>
            <div className="compare-card compare-ng">
              <div className="compare-label">❌ 危険な使い方</div>
              <pre>
                <span className="code-comment"># 確認なしに破壊的コマンドを実行</span>
                {"\n"}
                <span className="code-red">!rm -rf node_modules</span>
                {"\n\n"}
                <span className="code-comment"># 本番に影響するコマンドを不注意に実行</span>
                {"\n"}
                <span className="code-red">!kubectl delete pod --all</span>
              </pre>
            </div>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://google-gemini.github.io/gemini-cli/docs/cli/commands.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CLI Commands Reference (公式)
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH10: DECISION FLOWCHART */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch10" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 10</span>
            <span className="chapter-klevel kl2">K2 理解</span>
            <h2>
              コマンド選択<span className="cmd">フローチャート</span>
            </h2>
          </div>

          <p>
            「今どのコマンドを使うべきか」の判断フローです。状況に応じて最適なコマンドを選択できます。
          </p>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ 状況別コマンド選択フロー</div>
            <div id="diag-9" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart TD\nSTART["今何をしたいか"]\nSTART --> Q1["会話を保存・再開したい"]\nSTART --> Q2["ファイルの変更を元に戻したい"]\nSTART --> Q3["コンテキストが膨らんで重い"]\nSTART --> Q4["エージェントの動作がおかしい"]\nSTART --> Q5["繰り返す作業を自動化したい"]\nSTART --> Q6["新しいプロジェクトを始めた"]\nSTART --> Q7["コードを変えず計画だけ立てたい"]\nQ1 --> R1["/chat save タグ名 で保存<br />/chat resume タグ名 で再開"]\nQ2 --> R2["/restore<br />チェックポイントからファイルを復元"]\nQ3 --> R3["/compress<br />コンテキストを要約に圧縮"]\nQ4 --> R4["/memory show で確認<br />/memory<br />refresh で再スキャン"]\nQ5 --> R5[".gemini/commands/に<br />TOMLファイルを作成して実行"]\nQ6 --> R6["/init<br />GEMINI.mdを自動生成"]\nQ7 --> R7["Plan Mode を有効化<br />/settings<br />から切り替え"]\nstyle R1 fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle R2 fill:#2a0d0d,stroke:#ff4757,color:#ff4757\nstyle R3 fill:#2a1a0d,stroke:#f0b429,color:#f0b429\nstyle R4 fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle R5 fill:#1e1a2a,stroke:#7c4dff,color:#7c4dff\nstyle R6 fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle R7 fill:#1a1a2a,stroke:#7c4dff,color:#7c4dff'
                }
              />
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH11: BEST PRACTICES */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch11" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 11</span>
            <span className="chapter-klevel kl3">K3 適用</span>
            <h2>
              ベストプラクティス <span className="cmd">10 則</span>
            </h2>
          </div>

          <div className="metric-grid">
            <div className="metric-card mc-c">
              <div className="metric-num">01</div>
              <div className="metric-title">新プロジェクトは /init から始める</div>
              <div className="metric-desc">
                まず <code>/init</code> で GEMINI.md
                を自動生成。エージェントにプロジェクト文脈を即座に伝えられます。
              </div>
            </div>
            <div className="metric-card mc-g">
              <div className="metric-num">02</div>
              <div className="metric-title">実装前は Plan Mode を活用する</div>
              <div className="metric-desc">
                大きな変更は必ず Plan Mode で計画立案してからレビュー → 承認 →
                実装の順で進めましょう。
              </div>
            </div>
            <div className="metric-card mc-y">
              <div className="metric-num">03</div>
              <div className="metric-title">/chat save で定期的に保存する</div>
              <div className="metric-desc">
                長い作業セッションでは節目ごとに保存。<code>/chat save phase-1-complete</code>
                のように意味のあるタグを付けましょう。
              </div>
            </div>
            <div className="metric-card mc-p">
              <div className="metric-num">04</div>
              <div className="metric-title">/compress でコンテキストを軽量化</div>
              <div className="metric-desc">
                レスポンスが遅くなってきたら
                <code>/compress</code> で圧縮。高レベルの要約が保持されるため文脈は失われません。
              </div>
            </div>
            <div className="metric-card mc-r">
              <div className="metric-num">05</div>
              <div className="metric-title">description を必ず書く</div>
              <div className="metric-desc">
                カスタムコマンドの TOML には <code>description</code> を必ず記述。<code>/help</code>
                メニューでの表示とチームの理解に不可欠です。
              </div>
            </div>
            <div className="metric-card mc-g">
              <div className="metric-num">06</div>
              <div className="metric-title">シェル埋め込みは内容を明示する</div>
              <div className="metric-desc">
                <code>!&#123;...&#125;</code>
                は実行前に確認ダイアログが表示されます。チーム共有コマンドでは実行されるコマンドを明示しましょう。
              </div>
            </div>
            <div className="metric-card mc-c">
              <div className="metric-num">07</div>
              <div className="metric-title">名前空間でコマンドを整理する</div>
              <div className="metric-desc">
                <code>git/commit.toml</code> →<code>/git:commit</code>
                のようにサブディレクトリで整理。コマンドが増えても管理しやすくなります。
              </div>
            </div>
            <div className="metric-card mc-y">
              <div className="metric-num">08</div>
              <div className="metric-title">プロジェクトコマンドは git で共有</div>
              <div className="metric-desc">
                <code>.gemini/commands/</code>
                をリポジトリにコミット。チーム全員が同じカスタムコマンドを使えます。
              </div>
            </div>
            <div className="metric-card mc-p">
              <div className="metric-num">09</div>
              <div className="metric-title">/memory show で定期確認する</div>
              <div className="metric-desc">
                エージェントが期待どおりに動かないときはまず
                <code>/memory show</code> で確認。意図しない GEMINI.md
                が読まれていることがよくあります。
              </div>
            </div>
            <div className="metric-card mc-r">
              <div className="metric-num">10</div>
              <div className="metric-title">Plan → 実装 → /review → /deploy のサイクル</div>
              <div className="metric-desc">
                Plan Mode で計画 → 通常モードで実装 → <code>/review</code> でレビュー →
                <code>/deploy</code> でデプロイの黄金サイクルを習慣化しましょう。
              </div>
            </div>
          </div>

          <div className="mermaid-wrap">
            <div className="mermaid-title">▸ Rule 10 — 黄金の開発サイクル</div>
            <div id="diag-10" className={styles.mermaid}>
              <MermaidDiagram
                chart={
                  'flowchart LR\nA["Plan Mode<br />計画立案・承認"]\nB["通常モードで<br />実装"]\nC["/review<br />コードレビュー"]\nD{"レビュー通過"}\nE["/deploy staging<br />ステージング"]\nF["動作確認"]\nG["/deploy production<br />本番デプロイ"]\nA --> B\nB --> C\nC --> D\nD --> |Yes| E\nD --> |No| B\nE --> F\nF --> G\nstyle A fill:#0d1e2a,stroke:#00d4ff,color:#00d4ff\nstyle C fill:#0d2e1a,stroke:#00ff88,color:#00ff88\nstyle E fill:#2a1a0d,stroke:#f0b429,color:#f0b429\nstyle G fill:#2a0d0d,stroke:#ff4757,color:#ff4757'
                }
              />
            </div>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>参照ソース</strong>:
              <a
                href="https://geminicli.com/docs/cli/tutorials/automation/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Automate Tasks Tutorial
              </a>
              ·
              <a
                href="https://codelabs.developers.google.com/getting-started-google-antigravity"
                target="_blank"
                rel="noopener noreferrer"
              >
                Getting Started with Antigravity (Codelabs)
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH12: COMMON MISTAKES */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch12" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 12</span>
            <span className="chapter-klevel kl2">K2 理解</span>
            <h2>
              よくあるミスと<span className="cmd">解決策</span>
            </h2>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>よくあるミス</th>
                  <th>原因</th>
                  <th>解決策</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>カスタムコマンドが認識されない</td>
                  <td>.md 形式で作成した、または場所が違う</td>
                  <td>
                    <code>.gemini/commands/</code> に <code>.toml</code> 形式で作成する
                  </td>
                </tr>
                <tr>
                  <td>/restore が使えない</td>
                  <td>チェックポインティング未設定</td>
                  <td>
                    <code>--checkpointing</code> フラグで起動するか
                    <code>settings.json</code> で有効化する
                  </td>
                </tr>
                <tr>
                  <td>/memory show で GEMINI.md が表示されない</td>
                  <td>ファイルの場所が違う</td>
                  <td>
                    <code>~/.gemini/GEMINI.md</code> または <code>./GEMINI.md</code> に配置する
                  </td>
                </tr>
                <tr>
                  <td>!&#123;...&#125; コマンドが実行されない</td>
                  <td>確認ダイアログでキャンセルした</td>
                  <td>セキュリティ確認は正常な動作。内容を確認して承認する</td>
                </tr>
                <tr>
                  <td>/chat resume で会話が見つからない</td>
                  <td>タグ名を間違えた</td>
                  <td>
                    <code>/chat list</code> で保存済みタグを確認する
                  </td>
                </tr>
                <tr>
                  <td>カスタムコマンドで引数が反映されない</td>
                  <td>&lt;args&gt; プレースホルダーがない</td>
                  <td>
                    <code>prompt</code> 内に <code>&lt;args&gt;</code> を記述する
                  </td>
                </tr>
                <tr>
                  <td>@ファイルパス でファイルが読まれない</td>
                  <td>.geminiignore で除外されている</td>
                  <td>
                    <code>.geminiignore</code> の設定を確認する
                  </td>
                </tr>
                <tr>
                  <td>Plan Mode が解除できない</td>
                  <td>設定の戻し方が分からない</td>
                  <td>
                    <code>/settings</code> を開いて Plan Mode を OFF にする
                  </td>
                </tr>
                <tr>
                  <td>旧形式の /agent/workflows/*.md が動かない</td>
                  <td>v0.44.x で仕様変更</td>
                  <td>
                    <code>.gemini/commands/*.toml</code> 形式に移行する
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH13: QUICK REFERENCE */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch13" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 13</span>
            <span className="chapter-klevel kl1">K1 認識</span>
            <h2>クイックリファレンスカード</h2>
          </div>

          <h3>組み込みスラッシュコマンド 全一覧</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>コマンド</th>
                  <th>カテゴリ</th>
                  <th>用途</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>/chat save &lt;タグ&gt;</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>会話をタグ付きで保存</td>
                </tr>
                <tr>
                  <td>/chat resume &lt;タグ&gt;</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>保存済み会話を再開</td>
                </tr>
                <tr>
                  <td>/chat list</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>保存済み会話の一覧</td>
                </tr>
                <tr>
                  <td>/chat share &lt;ファイル&gt;</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>会話をファイルに出力</td>
                </tr>
                <tr>
                  <td>/clear</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>画面クリア（Ctrl+L）</td>
                </tr>
                <tr>
                  <td>/compress</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>コンテキストを圧縮</td>
                </tr>
                <tr>
                  <td>/copy</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>最後の出力をコピー</td>
                </tr>
                <tr>
                  <td>/restore [id]</td>
                  <td>
                    <span className="badge badge-c">セッション</span>
                  </td>
                  <td>ファイル変更を巻き戻し</td>
                </tr>
                <tr>
                  <td>/memory show</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>コンテキスト全体を表示</td>
                </tr>
                <tr>
                  <td>/memory refresh</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>GEMINI.md を再スキャン</td>
                </tr>
                <tr>
                  <td>/memory add &lt;テキスト&gt;</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>メモリに即時追記</td>
                </tr>
                <tr>
                  <td>/memory list</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>GEMINI.md ファイル一覧</td>
                </tr>
                <tr>
                  <td>/dir add &lt;パス&gt;</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>ワークスペースにディレクトリ追加</td>
                </tr>
                <tr>
                  <td>/dir show</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>ワークスペース一覧表示</td>
                </tr>
                <tr>
                  <td>/init</td>
                  <td>
                    <span className="badge badge-g">コンテキスト</span>
                  </td>
                  <td>GEMINI.md を自動生成</td>
                </tr>
                <tr>
                  <td>/mcp</td>
                  <td>
                    <span className="badge badge-p">ツール</span>
                  </td>
                  <td>MCP サーバー確認</td>
                </tr>
                <tr>
                  <td>/tools</td>
                  <td>
                    <span className="badge badge-p">ツール</span>
                  </td>
                  <td>使用可能ツール一覧</td>
                </tr>
                <tr>
                  <td>/settings</td>
                  <td>
                    <span className="badge badge-p">ツール</span>
                  </td>
                  <td>設定エディタを開く</td>
                </tr>
                <tr>
                  <td>/stats</td>
                  <td>
                    <span className="badge badge-p">ツール</span>
                  </td>
                  <td>セッション統計表示</td>
                </tr>
                <tr>
                  <td>/extensions</td>
                  <td>
                    <span className="badge badge-p">ツール</span>
                  </td>
                  <td>アクティブな拡張一覧</td>
                </tr>
                <tr>
                  <td>/theme</td>
                  <td>
                    <span className="badge badge-y">UI</span>
                  </td>
                  <td>テーマ変更</td>
                </tr>
                <tr>
                  <td>/editor</td>
                  <td>
                    <span className="badge badge-y">UI</span>
                  </td>
                  <td>エディタ選択</td>
                </tr>
                <tr>
                  <td>/vim</td>
                  <td>
                    <span className="badge badge-y">UI</span>
                  </td>
                  <td>vim モード切り替え</td>
                </tr>
                <tr>
                  <td>/auth</td>
                  <td>
                    <span className="badge badge-r">その他</span>
                  </td>
                  <td>認証方法変更</td>
                </tr>
                <tr>
                  <td>/about</td>
                  <td>
                    <span className="badge badge-r">その他</span>
                  </td>
                  <td>バージョン情報</td>
                </tr>
                <tr>
                  <td>/help または /?</td>
                  <td>
                    <span className="badge badge-r">その他</span>
                  </td>
                  <td>ヘルプ表示</td>
                </tr>
                <tr>
                  <td>/bug &lt;内容&gt;</td>
                  <td>
                    <span className="badge badge-r">その他</span>
                  </td>
                  <td>バグ報告</td>
                </tr>
                <tr>
                  <td>/privacy</td>
                  <td>
                    <span className="badge badge-r">その他</span>
                  </td>
                  <td>プライバシー設定</td>
                </tr>
                <tr>
                  <td>/quit または /exit</td>
                  <td>
                    <span className="badge badge-r">その他</span>
                  </td>
                  <td>終了</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>カスタムコマンド (TOML) 書き方早見表</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>機能</th>
                  <th>構文</th>
                  <th>例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>基本定義</td>
                  <td>
                    <code>description = "..."</code> + <code>prompt = "..."</code>
                  </td>
                  <td>すべてのコマンドに必須</td>
                </tr>
                <tr>
                  <td>引数受け取り</td>
                  <td>
                    <code>prompt</code> 内に <code>&lt;args&gt;</code>
                  </td>
                  <td>
                    <code>prompt = "修正して: &lt;args&gt;"</code>
                  </td>
                </tr>
                <tr>
                  <td>シェル出力埋め込み</td>
                  <td>
                    <code>prompt</code> 内に <code>!&#123;コマンド&#125;</code>
                  </td>
                  <td>
                    <code>!&#123;git diff --staged&#125;</code>
                  </td>
                </tr>
                <tr>
                  <td>ファイル内容埋め込み</td>
                  <td>
                    <code>prompt</code> 内に <code>@&#123;パス&#125;</code>
                  </td>
                  <td>
                    <code>@&#123;docs/guide.md&#125;</code>
                  </td>
                </tr>
                <tr>
                  <td>名前空間</td>
                  <td>
                    <code>サブディレクトリ名/ファイル名.toml</code>
                  </td>
                  <td>
                    <code>git/commit.toml</code> → <code>/git:commit</code>
                  </td>
                </tr>
                <tr>
                  <td>グローバルコマンド</td>
                  <td>
                    <code>~/.gemini/commands/</code> に配置
                  </td>
                  <td>全プロジェクトで有効</td>
                </tr>
                <tr>
                  <td>プロジェクトコマンド</td>
                  <td>
                    <code>プロジェクト/.gemini/commands/</code> に配置
                  </td>
                  <td>このプロジェクトのみ有効</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ──────────────────────────────────────────────── */}
        {/* CH14: REFERENCES */}
        {/* ──────────────────────────────────────────────── */}
        <section id="ch14" className="chapter">
          <div className="chapter-header">
            <span className="chapter-num">Ch 14</span>
            <h2>参考ソース一覧</h2>
          </div>

          <div className="ref-grid">
            <a
              className="ref-card"
              href="https://geminicli.com/docs/reference/commands/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">公式ドキュメント</div>
              <div className="ref-title">Command Reference — 全コマンドリファレンス</div>
              <div className="ref-url">geminicli.com/docs/reference/commands/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/custom-commands/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">公式ドキュメント</div>
              <div className="ref-title">Custom Commands — TOML カスタムコマンド公式仕様</div>
              <div className="ref-url">geminicli.com/docs/cli/custom-commands/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/plan-mode/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">公式ドキュメント</div>
              <div className="ref-title">Plan Mode — read-only 計画立案モード</div>
              <div className="ref-url">geminicli.com/docs/cli/plan-mode/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/tutorials/memory-management/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">チュートリアル</div>
              <div className="ref-title">Manage Context and Memory — コンテキスト管理</div>
              <div className="ref-url">geminicli.com/docs/cli/tutorials/memory-management/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/tutorials/session-management/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">チュートリアル</div>
              <div className="ref-title">Manage Sessions and History — セッション管理</div>
              <div className="ref-url">geminicli.com/docs/cli/tutorials/session-management/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/tutorials/automation/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">チュートリアル</div>
              <div className="ref-title">Automate Tasks — タスク自動化チュートリアル</div>
              <div className="ref-url">geminicli.com/docs/cli/tutorials/automation/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/checkpointing/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">公式ドキュメント</div>
              <div className="ref-title">Checkpointing — /restore の前提機能</div>
              <div className="ref-url">geminicli.com/docs/cli/checkpointing/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/cli/gemini-md/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">公式ドキュメント</div>
              <div className="ref-title">Project Context (GEMINI.md) — 階層型メモリ</div>
              <div className="ref-url">geminicli.com/docs/cli/gemini-md/</div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/changelogs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">リリースノート</div>
              <div className="ref-title">Gemini CLI Changelog — バージョン履歴</div>
              <div className="ref-url">geminicli.com/docs/changelogs/</div>
            </a>
            <a
              className="ref-card"
              href="https://github.com/google-gemini/gemini-cli/releases/tag/v0.44.1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">GitHub リリース</div>
              <div className="ref-title">Gemini CLI v0.44.1 リリース — 最新バージョン</div>
              <div className="ref-url">
                github.com/google-gemini/gemini-cli/releases/tag/v0.44.1
              </div>
            </a>
            <a
              className="ref-card"
              href="https://geminicli.com/docs/reference/keyboard-shortcuts/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">リファレンス</div>
              <div className="ref-title">Keyboard Shortcuts — キーボードショートカット一覧</div>
              <div className="ref-url">geminicli.com/docs/reference/keyboard-shortcuts/</div>
            </a>
            <a
              className="ref-card"
              href="https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">Google Developers Blog</div>
              <div className="ref-title">Gemini CLI → Antigravity CLI 移行のお知らせ</div>
              <div className="ref-url">
                developers.googleblog.com/…transitioning-gemini-cli-to-antigravity-cli
              </div>
            </a>
            <a
              className="ref-card"
              href="https://codelabs.developers.google.com/getting-started-google-antigravity"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">Google Codelabs</div>
              <div className="ref-title">Getting Started with Google Antigravity</div>
              <div className="ref-url">
                codelabs.developers.google.com/getting-started-google-antigravity
              </div>
            </a>
            <a
              className="ref-card"
              href="https://dev.to/googleai/unlocking-gemini-cli-with-skills-hooks-plan-mode-2bgf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="ref-cat">DEV Community</div>
              <div className="ref-title">Skills + Hooks + Plan Mode の詳細解説</div>
              <div className="ref-url">
                dev.to/googleai/unlocking-gemini-cli-with-skills-hooks-plan-mode-2bgf
              </div>
            </a>
          </div>
        </section>
      </div>
      {/* /wrap */}

      <footer>
        <div className="footer-brand">Gemini CLI / Antigravity CLI</div>
        <p>スラッシュコマンド完全ガイド — CLI v0.44.1 / Antigravity CLI 1.0.3 / IDE Commit 2.0.3</p>
        <p style={{ marginTop: "6px" }}>
          最終更新: 2026年5月31日 &nbsp;|&nbsp;
          <a href="https://geminicli.com/docs" target="_blank" rel="noopener noreferrer">
            公式ドキュメント ↗
          </a>
        </p>
      </footer>
    </main>
  );
}
