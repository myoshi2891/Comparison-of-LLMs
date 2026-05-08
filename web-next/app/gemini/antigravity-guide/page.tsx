import type { Metadata } from "next";
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

        {/* SECTION 02: DIRECTORY — TODO: faithful migration */}
        <section id="directory" className={styles.sec}>
          <div className={styles.secLabel}>Section 02</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>02.</span>全体ファイル構成と推奨ディレクトリ
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 03: GEMINI.md — TODO: faithful migration */}
        <section id="gemini-md" className={styles.sec}>
          <div className={styles.secLabel}>Section 03</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>03.</span>GEMINI.md — グローバル永続メモリ
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 04: SKILLS — TODO: faithful migration */}
        <section id="skills" className={styles.sec}>
          <div className={styles.secLabel}>Section 04</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>04.</span>SKILL.md — 進歩的開示ナレッジ（最重要）
          </h2>
          <p>（実装予定）</p>
        </section>

        {/* SECTION 05: RULES — TODO: faithful migration */}
        <section id="rules" className={styles.sec}>
          <div className={styles.secLabel}>Section 05</div>
          <h2 className={styles.secTitle}>
            <span className={styles.num}>05.</span>Rules (.agent/rules/) — 受動的制約
          </h2>
          <p>（実装予定）</p>
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
