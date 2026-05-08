import type { Metadata } from "next";
import GeminiMdTabs from "./GeminiMdTabs";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Google Antigravity — AI仕様駆動開発 ベストプラクティス完全ガイド",
  description:
    "GEMINI.md から SKILL.md・Rules・Workflows・Artifacts まで、Google Antigravity エコシステムの全体を根拠ソース付きで徹底解説。初学者でもステップバイステップで理解できるベストプラクティス完全ガイド。",
};

export default function Page() {
  return (
    <>
      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroTag}>Google Antigravity × Gemini 3.1 Pro</div>
        <h1 className={styles.heroH1}>
          AI仕様駆動開発における
          <br />
          <span className={styles.rainbow}>Google Antigravity</span>
          <br />
          ベストプラクティス完全ガイド
        </h1>
        <p className={styles.heroSub}>
          初学者でもステップバイステップで理解できる — GEMINI.md から
          SKILL.md・Rules・Workflows・Artifacts まで、
          Antigravityエコシステムの全体を根拠ソース付きで徹底解説
        </p>
        <div className={styles.heroChips}>
          <span className={`${styles.chip} ${styles.cb}`}>Google Antigravity</span>
          <span className={`${styles.chip} ${styles.cg}`}>Gemini 3.1 Pro</span>
          <span className={`${styles.chip} ${styles.cy}`}>Agent-First IDE</span>
          <span className={`${styles.chip} ${styles.cr}`}>Spec-Driven Dev</span>
          <span className={`${styles.chip} ${styles.cp}`}>v1.20.3 対応</span>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.wrap}>
        {/* TOC */}
        <nav className={styles.toc}>
          <div className={styles.tocLabel}>目次</div>
          <ol>
            <li>
              <a href="#overview">Google Antigravity とは — 従来IDEとの比較</a>
            </li>
            <li>
              <a href="#directory">全体ファイル構成と推奨ディレクトリ</a>
            </li>
            <li>
              <a href="#gemini-md">GEMINI.md — グローバル永続メモリ</a>
            </li>
            <li>
              <a href="#skills">SKILL.md — 進歩的開示ナレッジ（最重要）</a>
            </li>
            <li>
              <a href="#rules">Rules — 受動的制約・バックグラウンドシステムプロンプト</a>
            </li>
            <li>
              <a href="#workflows">Workflows — 能動的手順書</a>
            </li>
            <li>
              <a href="#artifacts">Artifacts — エージェント自動生成の証拠</a>
            </li>
            <li>
              <a href="#models">対応モデルと料金</a>
            </li>
            <li>
              <a href="#best-practices">横断ベストプラクティス 10則</a>
            </li>
            <li>
              <a href="#sources">参考ソース一覧</a>
            </li>
          </ol>
        </nav>

        {/* SECTION 01: OVERVIEW */}
        <section id="overview" className={styles.sec}>
          <div className={styles.secLabel}>Section 01</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>01.</span>Google Antigravity とは — 従来IDEとの比較
          </h2>

          <p>
            Google Antigravityは<strong>2025年11月18日にGemini 3と同時発表</strong>
            されたエージェント・ファースト型IDEです。 VS Codeのフォークをベースに、Claude
            CodeのようなCLIツールではなく
            <strong>フルIDEとして「エージェントが主役」のパラダイム</strong>を実装しています。
            人間の役割は「コードを書く人」から「アーキテクトとして指揮する人」へと変わります。
          </p>

          <div className={styles.flowWrap}>
            <div className={styles.flowLabel}>▸ 従来IDE vs Antigravity — パラダイムの違い</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "1.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: "0.68rem",
                    color: "var(--text3, #5a7090)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: "1rem",
                  }}
                >
                  ❌ 従来のIDE
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div
                    style={{
                      background: "rgba(90, 112, 144, 0.12)",
                      border: "1px solid rgba(90, 112, 144, 0.25)",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.78rem",
                      color: "var(--text2, #9aafcc)",
                    }}
                  >
                    👤 人間 — コードを書く主役
                  </div>
                  <div style={{ textAlign: "center", color: "var(--text3, #5a7090)" }}>↓</div>
                  <div
                    style={{
                      background: "rgba(90, 112, 144, 0.08)",
                      border: "1px solid rgba(90, 112, 144, 0.2)",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.78rem",
                      color: "var(--text3, #5a7090)",
                    }}
                  >
                    🤖 AI補完 — 提案するだけ
                  </div>
                  <div style={{ textAlign: "center", color: "var(--text3, #5a7090)" }}>↓</div>
                  <div
                    style={{
                      background: "rgba(90, 112, 144, 0.08)",
                      border: "1px solid rgba(90, 112, 144, 0.2)",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.78rem",
                      color: "var(--text3, #5a7090)",
                    }}
                  >
                    ✅ コード完成（人間が判断・実行）
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display, 'Syne', sans-serif)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--text3, #5a7090)",
                  textAlign: "center",
                }}
              >
                VS
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                    fontSize: "0.68rem",
                    color: "var(--g-green, #34a853)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: "1rem",
                  }}
                >
                  ✅ Google Antigravity
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div
                    style={{
                      background: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.78rem",
                      color: "var(--g-purple, #8b5cf6)",
                    }}
                  >
                    🤖 AIエージェント — 自律的に計画・実行・検証
                  </div>
                  <div style={{ textAlign: "center", color: "var(--text3, #5a7090)" }}>↓</div>
                  <div
                    style={{
                      background: "rgba(251, 188, 4, 0.08)",
                      border: "1px solid rgba(251, 188, 4, 0.25)",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.78rem",
                      color: "var(--g-yellow, #fbbc04)",
                    }}
                  >
                    👤 人間（アーキテクト）— 方針を決め・レビューする
                  </div>
                  <div style={{ textAlign: "center", color: "var(--text3, #5a7090)" }}>↓</div>
                  <div
                    style={{
                      background: "rgba(52, 168, 83, 0.08)",
                      border: "1px solid rgba(52, 168, 83, 0.25)",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.78rem",
                      color: "var(--g-green, #34a853)",
                    }}
                  >
                    📊 Artifact生成 — 証拠付きで結果を可視化
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3>Antigravity vs Claude Code — 比較表</h3>
          <table className={styles.compareTable}>
            <tbody>
              <tr>
                <th>特性</th>
                <th>Google Antigravity</th>
                <th>Claude Code</th>
              </tr>
              <tr>
                <td>種別</td>
                <td>Agent-First IDE（VSCode fork）</td>
                <td>CLI / ターミナルエージェント</td>
              </tr>
              <tr>
                <td>主要AI</td>
                <td>Gemini 3.1 Pro / 3 Flash + Claude Sonnet 4.6 / Opus 4.6 / GPT-OSS 120B</td>
                <td>Claude Opus / Sonnet / Haiku</td>
              </tr>
              <tr>
                <td>永続記憶</td>
                <td>GEMINI.md + Knowledge Base + Rules</td>
                <td>CLAUDE.md + MEMORY.md</td>
              </tr>
              <tr>
                <td>ナレッジ拡張</td>
                <td>SKILL.md（進歩的開示）</td>
                <td>SKILL.md（同一規格）</td>
              </tr>
              <tr>
                <td>手順自動化</td>
                <td>Workflows (.md)</td>
                <td>Custom Commands (.md)</td>
              </tr>
              <tr>
                <td>ブラウザ自動化</td>
                <td>Browser Subagent（ネイティブ）</td>
                <td>なし（MCP経由）</td>
              </tr>
              <tr>
                <td>エビデンス生成</td>
                <td>Artifacts（自動）</td>
                <td>なし（手動）</td>
              </tr>
              <tr>
                <td>価格</td>
                <td>無料（Public Preview中） / Google AI Pro $19.99/月</td>
                <td>Anthropicプランに依存</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.alertInfo}>
            <span>ℹ️</span>
            <div>
              <strong>SKILL.mdは共通規格</strong>です。AntigravityとClaude
              Codeは同一のSKILL.md形式を採用しており、ファイルを両プラットフォーム間でほぼそのまま移植できます。
              また<strong>v1.20.3（2026-03-05）以降はAGENTS.mdにも対応</strong>
              し、他のエージェントツールとのルール共有が可能になりました。
            </div>
          </div>
        </section>

        {/* SECTION 02: DIRECTORY */}
        <section id="directory" className={styles.sec}>
          <div className={styles.secLabel}>Section 02</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>02.</span>全体ファイル構成と推奨ディレクトリ
          </h2>

          <p>
            プロジェクトを始めたら、まずこのディレクトリ構成を作りましょう。5種類のファイル群がAntigravityの中核を成します。
          </p>

          <div className={styles.flowWrap}>
            <div className={styles.flowLabel}>▸ SDD × Antigravity 4フェーズフロー</div>
            <div className={styles.flow}>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbB}`}>
                  Phase 1
                  <br />
                  仕様策定
                </div>
                <div className={styles.ffile}>
                  spec.md
                  <br />
                  requirements.md
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbG}`}>
                  Phase 2
                  <br />
                  設計
                </div>
                <div className={styles.ffile}>
                  design.md
                  <br />
                  always-on.md
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbY}`}>
                  Phase 3
                  <br />
                  エージェント実行
                </div>
                <div className={styles.ffile}>
                  tasks.md
                  <br />
                  workflows/
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbR}`}>
                  Phase 4
                  <br />
                  検証
                </div>
                <div className={styles.ffile}>
                  Artifacts
                  <br />
                  Browser Agent
                </div>
              </div>
              <div className={styles.farrow}>→</div>
              <div className={styles.fstep}>
                <div className={`${styles.fbox} ${styles.fbP}`}>
                  フィードバック
                  <br />
                  ループ
                </div>
                <div className={styles.ffile}>
                  Knowledge
                  <br />
                  更新
                </div>
              </div>
            </div>
          </div>

          <h3>推奨ディレクトリ構成</h3>

          <div className={styles.ftree}>
            {/* ROOT */}
            <div className={styles.ftr}>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDir}`}>📁 your-project/</span>
              </div>
            </div>

            {/* .agent/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDir}`}>📁 .agent/</span>
                <span className={`${styles.ftrBadge} ${styles.fbImportant}`}>
                  Antigravity中心設定
                </span>
              </div>
            </div>

            {/* rules/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDirSub}`}>📁 rules/</span>
                <span className={styles.ftrComment}>
                  ← 受動的制約（常時バックグラウンドで動作）
                </span>
              </div>
            </div>

            {/* rules/always-on.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFrule}`}>📄 always-on.md</span>
                <span className={styles.ftrComment}>
                  ← activation: always — 常時適用（禁止事項等）
                </span>
              </div>
            </div>

            {/* rules/typescript.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFrule}`}>📄 typescript.md</span>
                <span className={styles.ftrComment}>← activation: fileMatch *.ts — 条件適用</span>
              </div>
            </div>

            {/* skills/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDirSub}`}>📁 skills/</span>
                <span className={styles.ftrComment}>← 進歩的開示ナレッジ（オンデマンド）</span>
              </div>
            </div>

            {/* skills/db-migration/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDirSub}`}>📁 db-migration/</span>
                <span className={styles.ftrComment}>← スキルディレクトリ（name と一致させる）</span>
              </div>
            </div>

            {/* SKILL.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFreq}`}>📄 SKILL.md</span>
                <span className={`${styles.ftrBadge} ${styles.fbReq}`}>必須</span>
                <span className={styles.ftrComment}>← スキルの脳（name / description / 手順）</span>
              </div>
            </div>

            {/* scripts/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFopt}`}>📁 scripts/</span>
                <span className={styles.ftrComment}>← 任意: 決定論的スクリプト（Python/Bash）</span>
              </div>
            </div>

            {/* references/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFopt}`}>📁 references/</span>
                <span className={styles.ftrComment}>
                  ← 任意: 参照ドキュメント（オンデマンド読込）
                </span>
              </div>
            </div>

            {/* workflows/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDirSub}`}>📁 workflows/</span>
                <span className={styles.ftrComment}>
                  ← 能動的手順書（スラッシュコマンドで起動）
                </span>
              </div>
            </div>

            {/* deploy.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFwf}`}>📄 deploy.md</span>
                <span className={styles.ftrComment}>← /deploy コマンドで実行</span>
              </div>
            </div>

            {/* review.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFwf}`}>📄 review.md</span>
                <span className={styles.ftrComment}>← /review コマンドで実行</span>
              </div>
            </div>

            {/* .context/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span
                  className={`${styles.ftrLabel} ${styles.ftrDir}`}
                  style={{ color: "var(--g-cyan, #00bcd4)" }}
                >
                  📁 .context/
                </span>
                <span className={styles.ftrComment}>
                  ← Knowledge Base（エージェントが自動学習・蓄積）
                </span>
              </div>
            </div>

            {/* architecture.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFctx}`}>📄 architecture.md</span>
                <span className={styles.ftrComment}>← システム構成・技術スタック情報</span>
              </div>
            </div>

            {/* gotchas.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFctx}`}>📄 gotchas.md</span>
                <span className={styles.ftrComment}>← 発見した落とし穴を記録（自動更新）</span>
              </div>
            </div>

            {/* docs/ */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrDir}`}>📁 docs/</span>
                <span className={styles.ftrComment}>← SDD仕様書群</span>
              </div>
            </div>

            {/* spec.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFsdd}`}>📄 spec.md</span>
                <span className={styles.ftrComment}>← 何を・なぜ（プロダクト仕様）</span>
              </div>
            </div>

            {/* design.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFsdd}`}>📄 design.md</span>
                <span className={styles.ftrComment}>← 技術設計・アーキテクチャ判断</span>
              </div>
            </div>

            {/* tasks.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline}`} />
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFsdd2}`}>📄 tasks.md</span>
                <span className={styles.ftrComment}>← タスク管理・依存関係・並列情報</span>
              </div>
            </div>

            {/* GEMINI.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.vline} ${styles.elbow}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFreq}`}>📄 GEMINI.md</span>
                <span className={`${styles.ftrBadge} ${styles.fbReq}`}>常時ロード</span>
                <span className={styles.ftrComment}>
                  ← プロジェクト共通メモリ（全セッションで注入）
                </span>
              </div>
            </div>

            {/* AGENTS.md */}
            <div className={styles.ftr}>
              <div className={styles.ftrIndent}>
                <div className={`${styles.ftrGuide} ${styles.elbow} ${styles.last}`} />
              </div>
              <div className={styles.ftrName}>
                <span className={`${styles.ftrLabel} ${styles.ftrFopt}`}>📄 AGENTS.md</span>
                <span className={`${styles.ftrBadge} ${styles.fbNew}`}>v1.20.3〜</span>
                <span className={styles.ftrComment}>
                  ← クロスツール共有（Claude Code / Cursor等と共通）
                </span>
              </div>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.miniCard}>
              <div className={styles.mcTag}>🌐 グローバル設定</div>
              <p>
                <code>~/.gemini/GEMINI.md</code>
                <br />
                全プロジェクト共通のワーキングスタイル・禁止事項を記述。プロジェクト固有情報は書かないこと。
              </p>
            </div>
            <div className={styles.miniCard}>
              <div className={styles.mcTag}>🆕 v1.20.3 新機能</div>
              <p>
                <code>AGENTS.md</code>
                対応開始。プロジェクトルートに置くだけでClaude
                Code・Codex・Cursor等と共通ルールを共有可能。
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 03: GEMINI.md */}
        <section id="gemini-md" className={styles.sec}>
          <div className={styles.secLabel}>Section 03</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>03.</span>GEMINI.md — グローバル永続メモリ
          </h2>

          <p>
            Claude Codeの<code>CLAUDE.md</code>に相当する
            <strong>グローバル永続メモリファイル</strong>。<code>~/.gemini/GEMINI.md</code>
            に配置し、全プロジェクト・全エージェントセッションに横断的に注入されます。
            プロジェクト固有のルールは後述の<code>.agent/rules/</code>に分離します。
          </p>

          <GeminiMdTabs />

          <div className={`${styles.info} ${styles.iWarn}`}>
            <span className={styles.infoIcon}>⚠️</span>
            <div>
              <strong>アンチパターン:</strong>
              GEMINI.mdにプロジェクト固有のDB設定やAPIエンドポイントを書かない。
              グローバルファイルはプロジェクト固有情報を持つべきではありません。プロジェクト情報は
              <code>.agent/rules/</code>または<code>.context/</code>へ。
            </div>
          </div>
        </section>

        {/* SECTION 04: SKILLS */}
        <section id="skills" className={styles.sec}>
          <div className={styles.secLabel}>Section 04</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>04.</span>SKILL.md — 進歩的開示ナレッジ（最重要）
          </h2>

          <p>
            Antigravityの Skillsは
            <strong>「Progressive Disclosure（進歩的開示）」</strong>
            という設計思想に基づきます。 全てのナレッジをコンテキストに常時注入するのではなく、
            <strong>エージェントがユーザーの意図を検知したときのみ対応するスキルをロード</strong>
            する仕組みです。 これによりコンテキスト消費を最小化し、応答速度と精度を向上させます。
          </p>

          <h3>3段階の段階的読み込み</h3>
          <div className={styles.levelRow}>
            <div className={`${styles.lv} ${styles.lv1}`}>
              <div className={styles.lvNum}>LEVEL 1 — 常時常駐</div>
              <h4>メタデータのみ</h4>
              <p>
                セッション開始時に全スキルの<code>name</code>と<code>description</code>
                のみがシステムプロンプトに注入される。スキル100個あっても約10,000トークン程度の軽量な状態。
              </p>
            </div>
            <div className={`${styles.lv} ${styles.lv2}`}>
              <div className={styles.lvNum}>LEVEL 2 — オンデマンド</div>
              <h4>SKILL.md本文の展開</h4>
              <p>
                ユーザーのプロンプトとdescriptionを意味論的に照合し、
                <code>activate_skill</code>
                ツールで本文（5,000トークン以内推奨）をコンテキストに展開。
              </p>
            </div>
            <div className={`${styles.lv} ${styles.lv3}`}>
              <div className={styles.lvNum}>LEVEL 3 — 動的参照</div>
              <h4>リソースの動的実行</h4>
              <p>
                references/内のドキュメントはBashで動的読み取り。scripts/内のスクリプトはソースコードではなく
                <strong>実行結果のみ</strong>
                がコンテキストに入る。実質無制限。
              </p>
            </div>
          </div>

          <h3>SKILL.md の完全テンプレート</h3>

          <div className={`${styles.info} ${styles.iCrit}`}>
            <span className={styles.infoIcon}>🔑</span>
            <div>
              <strong>descriptionが命：</strong>
              SKILL.mdのdescriptionフィールドはエージェントが「いつこのスキルを使うか」を判断するための
              <strong>意味的トリガー</strong>
              です。 「何を・いつ・なぜ」を具体的に書くほど精度が向上します。
              曖昧なdescriptionはスキルが全く呼ばれないか、誤った状況で呼ばれる原因になります。
            </div>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.cbHead}>
              <div className={styles.cbDots}>
                <div className={styles.cbd} style={{ background: "#ea4335" }} />
                <div className={styles.cbd} style={{ background: "#fbbc04" }} />
                <div className={styles.cbd} style={{ background: "#34a853" }} />
              </div>
              <span>.agent/skills/db-migration/SKILL.md — 完全テンプレート</span>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.legHd}>{"---"}</span>
              {"\n"}
              <span className={styles.legHl}>{"name"}</span>
              {": "}
              <span className={styles.legStr}>{"db-migration"}</span>
              {"  "}
              <span className={styles.legCmt}>
                {"# ← ハイフン区切り英語小文字・ディレクトリ名と完全一致させる"}
              </span>
              {"\n\n"}
              <span className={styles.legHl}>{"description"}</span>
              {": "}
              <span className={styles.legCmt}>
                {"# ← 【最重要】AIのトリガー条件。具体的なキーワードを入れる！"}
              </span>
              {"\n  "}
              <span className={styles.legStr}>
                {"PostgreSQLのスキーマ変更（マイグレーション）を実行する。"}
              </span>
              {"\n  "}
              <span className={styles.legStr}>
                {"「テーブルを追加」「カラムを追加」「インデックスを作成」"}
              </span>
              {"\n  "}
              <span className={styles.legStr}>
                {"「DBのスキーマを変更して」という指示が出たら必ずこのスキルを使うこと。"}
              </span>
              {"\n"}
              <span className={styles.legHd}>{"---"}</span>
              {"\n\n"}
              <span className={styles.legHd}>{"# DB Migration Skill"}</span>
              {"\n\n"}
              <span className={styles.legHd}>{"## Goal（このスキルの目的）"}</span>
              {"\nPostgreSQL スキーマ変更をプロジェクト標準の手順で安全に実行する。\n\n"}
              <span className={styles.legHd}>{"## Before Starting（前提条件）"}</span>
              {"\n- 変更対象のテーブル名・カラム名・データ型をユーザーから確認すること\n\n"}
              <span className={styles.legHd}>{"## Step-by-Step Guide（具体的な手順）"}</span>
              {"\n1. "}
              <span className={styles.legStr}>{"`migrations/`"}</span>
              {" 配下に "}
              <span className={styles.legStr}>{"`YYYYMMDD_HHMMSS_description.up.sql`"}</span>
              {" を作成\n2. ロールバック用 "}
              <span className={styles.legStr}>{"`·down.sql`"}</span>
              {" を必ず同時に作成\n3. 整合性チェックを実行: "}
              <span className={styles.legStr}>{"`python scripts/check.py`"}</span>
              {"\n4. レビュー後に適用: "}
              <span className={styles.legStr}>{"`python scripts/migrate.py --apply`"}</span>
              {"\n5. 完了後にtasks.mdの該当タスクをチェック済みにする\n\n"}
              <span className={styles.legHd}>{"## Examples（Few-shot：具体的な入出力例）"}</span>
              {"\n"}
              <span className={styles.legCmt}>
                {"# ここに例を書くとAIが期待する動作を模倣する"}
              </span>
              {"\n"}
              <span className={styles.legStr}>
                {'**Input**: "usersテーブルにlast_login_atカラムを追加して"'}
              </span>
              {"\n"}
              <span className={styles.legStr}>
                {"**Output**: migrations/20260101_add_last_login_at.up.sql を生成"}
              </span>
              {"\n\n"}
              <span className={styles.legHd}>{"## Rules（制約事項）"}</span>
              {"\n"}
              <span className={styles.legHl2}>
                {"❌ 既存マイグレーションファイルを絶対に編集しない"}
              </span>
              {"\n"}
              <span className={styles.legHl2}>{"❌ 本番環境への直接適用は人間確認なしに禁止"}</span>
              {"\n"}
              <span className={styles.legOk}>
                {"✅ ロールバックファイルは必ずセットで作成する"}
              </span>
              {"\n"}
              <span className={styles.legOk}>
                {"✅ NULL制約の後付けはデータ移行計画なしに行わない"}
              </span>
            </pre>
          </div>

          <h3>descriptionの書き方 — 良い例 vs 悪い例</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              margin: "1rem 0",
            }}
          >
            <div
              style={{
                background: "rgba(234, 67, 53, 0.07)",
                border: "1px solid rgba(234, 67, 53, 0.25)",
                borderRadius: "10px",
                padding: "1rem 1.2rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--g-red, #ea4335)",
                  marginBottom: "0.6rem",
                }}
              >
                ❌ アンダートリガー（呼ばれない）
              </div>
              <pre
                style={{
                  background: "transparent",
                  padding: 0,
                  fontSize: "0.77rem",
                  color: "var(--text2, #9aafcc)",
                }}
              >{`name: security-auditor\ndescription: |\n  セキュリティ監査を行うスキル。`}</pre>
              <div
                style={{ fontSize: "0.75rem", color: "var(--g-red, #ea4335)", marginTop: "0.6rem" }}
              >
                → AIがいつ使うか判断できない
              </div>
            </div>
            <div
              style={{
                background: "rgba(52, 168, 83, 0.07)",
                border: "1px solid rgba(52, 168, 83, 0.25)",
                borderRadius: "10px",
                padding: "1rem 1.2rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--g-green, #34a853)",
                  marginBottom: "0.6rem",
                }}
              >
                ✅ 正しいトリガー設計
              </div>
              <pre
                style={{
                  background: "transparent",
                  padding: 0,
                  fontSize: "0.77rem",
                  color: "var(--text2, #9aafcc)",
                }}
              >{`name: security-auditor\ndescription: |\n  コードのセキュリティ監査を実施する。\n  脆弱性チェック、OWASP Top 10の検証、\n  セキュリティ、認証、XSS、SQLi、\n  という言葉が出たら必ず使うこと。`}</pre>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--g-green, #34a853)",
                  marginTop: "0.6rem",
                }}
              >
                → トリガーが明確で確実に呼ばれる
              </div>
            </div>
          </div>

          <h3>5つのスキルパターン</h3>
          <div className={styles.patternGrid}>
            <div className={`${styles.patternCard} ${styles.pcB}`}>
              <div className={styles.pn}>01</div>
              <h4>Basic Router</h4>
              <p>SKILL.mdのみ。指示と制約をテキストで記述。最もシンプル。</p>
              <div className={styles.pcStruct}>SKILL.md only</div>
            </div>
            <div className={`${styles.patternCard} ${styles.pcG}`}>
              <div className={styles.pn}>02</div>
              <h4>Reference Pattern</h4>
              <p>references/にドキュメントを置き、SKILL.mdから参照。静的知識の拡張。</p>
              <div className={styles.pcStruct}>SKILL.md + references/</div>
            </div>
            <div className={`${styles.patternCard} ${styles.pcY}`}>
              <div className={styles.pn}>03</div>
              <h4>Few-shot Pattern</h4>
              <p>examples/にInput/Outputのペアを複数用意。精度の向上。</p>
              <div className={styles.pcStruct}>SKILL.md + examples/</div>
            </div>
            <div className={`${styles.patternCard} ${styles.pcR}`}>
              <div className={styles.pn}>04</div>
              <h4>Tool Use Pattern</h4>
              <p>scripts/に実行可能なスクリプトを置く。LLMが苦手な計算・DB操作を外出し。</p>
              <div className={styles.pcStruct}>SKILL.md + scripts/</div>
            </div>
            <div className={`${styles.patternCard} ${styles.pcP}`}>
              <div className={styles.pn}>05</div>
              <h4>All-in-One Pattern</h4>
              <p>全ディレクトリを組み合わせた最強パターン。複雑な業務ロジックに対応。</p>
              <div className={styles.pcStruct}>SKILL.md + all dirs</div>
            </div>
          </div>

          <h3>スキルのスコープ設計</h3>
          <div className={styles.scopeGrid}>
            <div className={`${styles.scopeCard} ${styles.scGlobal} ${styles.scG}`}>
              <div className={styles.scLabel}>🌐 グローバルスキル</div>
              <h3>全プロジェクトで有効</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text2, #9aafcc)" }}>
                すべてのプロジェクトで利用可能な汎用スキル。
              </p>
              <div className={styles.pathBox}>
                ~/.gemini/antigravity/skills/
                <br />
                （Antigravity IDE）
              </div>
              <ul>
                <li>Gitコミット規約フォーマッター</li>
                <li>コードレビュー標準チェック</li>
                <li>JSON/YAML フォーマッター</li>
                <li>テスト生成の標準化</li>
              </ul>
            </div>
            <div className={`${styles.scopeCard} ${styles.scLocal} ${styles.scL}`}>
              <div className={styles.scLabel}>📁 ワークスペーススキル</div>
              <h3>このプロジェクトのみ</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text2, #9aafcc)" }}>
                特定プロジェクトのみで有効。チームでgit管理。
              </p>
              <div className={styles.pathBox}>
                .agent/skills/
                <br />
                （プロジェクト内）
              </div>
              <ul>
                <li>このアプリのデプロイ手順</li>
                <li>プロジェクト固有のAPI仕様</li>
                <li>チーム独自のコーディング規約</li>
                <li>内部DBのマイグレーション</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 05: RULES */}
        <section id="rules" className={styles.sec}>
          <div className={styles.secLabel}>Section 05</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>05.</span>Rules (.agent/rules/) — 受動的制約
          </h2>

          <p>
            Antigravityの
            <strong>Rulesは「常にバックグラウンドで動作するシステムプロンプト」</strong>
            です。 ファイル単位でルールを分割・個別に有効化できる点が特徴です。
          </p>

          <h3>Rules vs SKILL.md — 使い分け早見表</h3>
          <table className={styles.compareTable}>
            <tbody>
              <tr>
                <th>観点</th>
                <th>Rules (.agent/rules/)</th>
                <th>SKILL.md (.agent/skills/)</th>
              </tr>
              <tr>
                <td>起動タイミング</td>
                <td>常時（または設定条件で）</td>
                <td>意図が合致したときのみ</td>
              </tr>
              <tr>
                <td>コンテキスト消費</td>
                <td>高（毎回注入）</td>
                <td>低（オンデマンド）</td>
              </tr>
              <tr>
                <td>用途</td>
                <td>コーディング規約・禁止事項</td>
                <td>専門ワークフロー・知識</td>
              </tr>
              <tr>
                <td>推奨内容</td>
                <td>「〜してはいけない」ルール</td>
                <td>「〜する方法」の手順</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.codeWrap}>
            <div className={styles.cbHead}>
              <div className={styles.cbDots}>
                <div className={styles.cbd} style={{ background: "#ea4335" }} />
                <div className={styles.cbd} style={{ background: "#fbbc04" }} />
                <div className={styles.cbd} style={{ background: "#34a853" }} />
              </div>
              <span>.agent/rules/always-on.md — 常時適用ルール</span>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.legHd}>{"---"}</span>
              {"\n"}
              <span className={styles.legHl}>{"activation"}</span>
              {": "}
              <span className={styles.legStr}>{"always"}</span>
              {"\n"}
              <span className={styles.legHd}>{"---"}</span>
              {"\n\n"}
              <span className={styles.legHd}>{"# Project Core Rules"}</span>
              {"\n\n"}
              <span className={styles.legHd}>{"## Architecture"}</span>
              {
                "\n- このプロジェクトはマイクロサービス構成（Go + gRPC）\n- サービス間通信はgRPCのみ（REST禁止）\n\n"
              }
              <span className={styles.legHd}>{"## Security Constraints"}</span>
              {
                "\n- 認証なしのエンドポイントを新規作成しない\n- パスワードは必ずbcrypt (cost=12)でハッシュ化\n- JWTの有効期限は1時間以内\n\n"
              }
              <span className={styles.legHd}>{"## Forbidden Actions"}</span>
              {"\n"}
              <span className={styles.legHl2}>
                {"- ORM使用禁止（raw SQLのみ） ← なぜ: パフォーマンス測定で20x遅延を確認した"}
              </span>
              {"\n"}
              <span className={styles.legHl2}>{"- グローバル変数の新規追加禁止"}</span>
              {"\n"}
              <span className={styles.legHl2}>{"- panic()の使用禁止（エラーを返せ）"}</span>
            </pre>
          </div>

          <div className={styles.codeWrap}>
            <div className={styles.cbHead}>
              <div className={styles.cbDots}>
                <div className={styles.cbd} style={{ background: "#ea4335" }} />
                <div className={styles.cbd} style={{ background: "#fbbc04" }} />
                <div className={styles.cbd} style={{ background: "#34a853" }} />
              </div>
              <span>.agent/rules/typescript.md — 言語別ルール（fileMatch使用）</span>
            </div>
            <pre className={styles.codeBody}>
              <span className={styles.legHd}>{"---"}</span>
              {"\n"}
              <span className={styles.legHl}>{"activation"}</span>
              {": "}
              <span className={styles.legStr}>{"fileMatch"}</span>
              {"\n"}
              <span className={styles.legHl}>{"pattern"}</span>
              {": "}
              <span className={styles.legStr}>{'"**/*.ts"'}</span>
              {"  "}
              <span className={styles.legCmt}>{"# ← TypeScriptファイル編集時のみ適用される"}</span>
              {"\n"}
              <span className={styles.legHd}>{"---"}</span>
              {"\n\n"}
              <span className={styles.legHd}>{"# TypeScript Coding Standards"}</span>
              {
                "\n\n- strict: true を必ず有効にする\n- enum / namespace は使用禁止（erasableSyntaxOnly）\n- エラーは throw ではなく Result"
              }
              {"<T,E>"}
              {" 型で返す\n- never型を活用して網羅性チェックを徹底する"}
            </pre>
          </div>

          <div className={`${styles.info} ${styles.iTip}`}>
            <span className={styles.infoIcon}>💡</span>
            <div>
              <code>activation: fileMatch</code>で
              <strong>特定ファイルを編集するときだけルールを適用</strong>
              できます。
              Goファイル編集時のみGoルールを、TypeScriptファイル時のみTSルールを注入することでコンテキストを節約できます。
            </div>
          </div>
        </section>

        {/* SECTION 06: WORKFLOWS — TODO: faithful migration */}
        <section id="workflows" className={styles.sec}>
          <div className={styles.secLabel}>Section 06</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>06.</span>Workflows — 能動的手順書
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 07: ARTIFACTS — TODO: faithful migration */}
        <section id="artifacts" className={styles.sec}>
          <div className={styles.secLabel}>Section 07</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>07.</span>Artifacts — エージェント自動生成の証拠
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 08: MODELS — TODO: faithful migration */}
        <section id="models" className={styles.sec}>
          <div className={styles.secLabel}>Section 08</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>08.</span>対応モデルと料金（2026年3月現在）
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 09: BEST-PRACTICES — TODO: faithful migration */}
        <section id="best-practices" className={styles.sec}>
          <div className={styles.secLabel}>Section 09</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>09.</span>横断ベストプラクティス 10則
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 10: SOURCES — TODO: faithful migration */}
        <section id="sources" className={styles.sec}>
          <div className={styles.secLabel}>Section 10</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>10.</span>参考ソース一覧（公式・一次情報優先）
          </h2>
          <div className={styles.codeWrap}>
            <div className={styles.codeBar}>
              <span>sources.placeholder</span>
              <span className={styles.codeLang}>PLACEHOLDER</span>
            </div>
            <div className={styles.codeBody}>
              <span className={styles.cc}>{"/* 実装予定 */"}</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
