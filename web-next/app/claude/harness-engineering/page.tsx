import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ハーネスエンジニアリング完全ガイド 2026",
  description: "AIエージェントが安定して動作するための「環境設計（ハーネス）」完全ガイド。",
};

const TOC_ITEMS = [
  { id: "s1", label: "1. ハーネスエンジニアリングとは？" },
  { id: "s2", label: "2. なぜハーネスが必要なのか" },
  { id: "s3", label: "3. コアアーキテクチャ：2段階構造" },
  { id: "s4", label: "4. CLAUDE.md の設計" },
  { id: "s5", label: "5. 状態管理とセッション間の引き継ぎ" },
  { id: "s6", label: "6. セッションプロトコル（8ステップ）" },
  { id: "s7", label: "7. フィードバックループの構築" },
  { id: "s8", label: "8. コンテキストウィンドウの管理" },
  { id: "s9", label: "9. よくある失敗パターンと対策" },
  { id: "s10", label: "10. Minimum Viable Harness" },
  { id: "s11", label: "11. 参考ソース一覧" },
] as const;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Page() {
  return (
    <div className={styles.wrapper}>
      {/* ════ HERO ════ */}
      <div className={styles.hero}>
        <div className={styles.heroBadge}>🛠 Claude Code × Harness Engineering</div>
        <h1 className={styles.heroTitle}>
          ハーネスエンジニアリング
          <br />
          <span className={styles.heroTitleAccent}>完全ガイド 2026</span>
        </h1>
        <p className={styles.heroDesc}>
          Anthropic
          公式推奨。AIエージェントが長時間・複数セッションにわたって安定して動作するための「環境設計」を、初学者向けにステップバイステップで解説します。
        </p>
        <div className={styles.heroMeta}>
          <div className={styles.metaChip}>
            <strong>対象</strong>初学者〜中級者
          </div>
          <div className={styles.metaChip}>
            <strong>ツール</strong>Claude Code / Agent SDK
          </div>
          <div className={styles.metaChip}>
            <strong>更新</strong>2026年5月
          </div>
          <div className={styles.metaChip}>
            <strong>情報源</strong>Anthropic Engineering Blog
          </div>
        </div>
      </div>

      {/* ════ TOC ════ */}
      <nav className={styles.toc}>
        <h2>📋 目次</h2>
        <ol>
          {TOC_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ════ S1 ════ */}
      <section id="s1" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 01</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>1</span>ハーネスエンジニアリングとは？
        </h2>
        <p className={styles.sectionLead}>
          AIエージェントに「手・目・記憶・制御」を与えるための環境設計の技術です。
        </p>

        <div className={`${styles.callout} ${styles.info}`}>
          <span className={styles.calloutIcon}>💡</span>
          <div className={styles.calloutBody}>
            <strong>アナロジーで理解する</strong>
            <p>
              馬に「馬具（ハーネス）」を装着することで人間が馬の力を制御・活用できるように、エンジニアはAIに「ハーネス」を与えることで、AIの能力を安全・効率的に引き出します。
              <br />
              「ハーネスがClaudeを賢くするのではない。Claudeはすでに賢い。ハーネスはClaudeに手・目・作業空間を与えるのだ。」
            </p>
          </div>
        </div>

        <div className={`${styles.cardGrid} ${styles.mt24}`}>
          <div className={styles.cardItem}>
            <span className={styles.icon}>👁</span>
            <h3>Eyes（目）</h3>
            <p>
              ファイル読み込み・ブラウザ操作・スクリーンショット取得。エージェントが「見る」手段を提供する。
            </p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🤲</span>
            <h3>Hands（手）</h3>
            <p>
              コード実行・コマンド実行・ファイル書き込み。エージェントが「操作する」手段を提供する。
            </p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🧠</span>
            <h3>Memory（記憶）</h3>
            <p>セッション間の状態引き継ぎ。progress.txt / Git がエージェントの「記憶」を担う。</p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🛡</span>
            <h3>Guard（制御）</h3>
            <p>
              サンドボックス・コマンド許可リスト・Lint
              によるガードレール。安全な実行環境を保証する。
            </p>
          </div>
        </div>

        <div className={`${styles.callout} ${styles.tip}`}>
          <span className={styles.calloutIcon}>🔑</span>
          <div className={styles.calloutBody}>
            <strong>最重要原則</strong>
            <p>
              ハーネスの質がモデルの質より成果に影響します。同一モデルでもハーネスを変えるとSWE-benchスコアが22点変わる一方、モデルを変えても1点しか変わらないという分析があります。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S2 ════ */}
      <section id="s2" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 02</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>2</span>なぜハーネスが必要なのか
        </h2>
        <p className={styles.sectionLead}>
          AIエージェントはセッションをまたぐと前の記憶をすべて失います。これが「長時間タスク」の核心的な課題です。
        </p>

        <h3
          style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px", color: "var(--muted)" }}
        >
          ❌ ハーネスなし：記憶喪失エンジニア問題
        </h3>
        <div className={styles.mermaidWrap}>
          <div id="diag-0" />
        </div>

        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            margin: "28px 0 12px",
            color: "var(--muted)",
          }}
        >
          ✅ ハーネスあり：構造化された引き継ぎ
        </h3>
        <div className={styles.mermaidWrap}>
          <div id="diag-1" />
        </div>

        <div className={`${styles.callout} ${styles.warn}`}>
          <span className={styles.calloutIcon}>⚠️</span>
          <div className={styles.calloutBody}>
            <strong>2大失敗パターン（Anthropic の実験より）</strong>
            <p>
              <strong>①一括実装しようとする</strong>
              ：コンテキストが枯渇するまで全機能を一度に実装しようとして、半完成状態で終了する。
              <br />
              <strong>②早期勝利宣言</strong>
              ：後半のセッションで進捗を確認し、まだ終わっていないのに「完成しました」と宣言してしまう。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ S3 ════ */}
      <section id="s3" className={styles.sec}>
        <div className={styles.sectionLabel}>Section 03</div>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionTitleNum}>3</span>コアアーキテクチャ：2段階エージェント構造
        </h2>
        <p className={styles.sectionLead}>
          Anthropic が公式に推奨する構造は「Initializer Agent ＋ Coding Agent」の2層構造です。
        </p>

        {/* architecture visual */}
        <div style={{ margin: "24px 0" }}>
          {/* Phase label row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 40px 1fr",
              gap: 0,
              alignItems: "stretch",
            }}
          >
            {/* Phase 1 box */}
            <div
              style={{
                background: "rgba(124, 110, 245, 0.08)",
                border: "1px solid rgba(124, 110, 245, 0.35)",
                borderRadius: "16px",
                padding: "24px 20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <span
                  style={{
                    background: "rgba(124, 110, 245, 0.2)",
                    color: "#b5aaff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "4px 12px",
                    borderRadius: "99px",
                  }}
                >
                  PHASE 1 ── 初回のみ
                </span>
                <div style={{ fontSize: "1rem", fontWeight: 800, marginTop: "8px" }}>
                  🚀 Initializer Agent
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
                  プロジェクト開始時に一度だけ実行
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>📋 feature_list.json</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    全機能を「失敗」状態でリスト化
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>⚙️ init.sh</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    環境を一発で起動するスクリプト
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>📝 claude-progress.txt</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    進捗を記録するログファイル
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>🗂 初回 git commit</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    初期状態を履歴に保存
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", color: "var(--accent2)" }}>→</div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
                    marginTop: "2px",
                  }}
                >
                  引き継ぎ
                </div>
              </div>
            </div>

            {/* Phase 2 box */}
            <div
              style={{
                background: "rgba(79, 195, 247, 0.07)",
                border: "1px solid rgba(79, 195, 247, 0.3)",
                borderRadius: "16px",
                padding: "24px 20px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "18px" }}>
                <span
                  style={{
                    background: "rgba(79, 195, 247, 0.15)",
                    color: "var(--accent2)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "4px 12px",
                    borderRadius: "99px",
                  }}
                >
                  PHASE 2 ── 繰り返し実行
                </span>
                <div style={{ fontSize: "1rem", fontWeight: 800, marginTop: "8px" }}>
                  ⚙️ Coding Agent
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px" }}>
                  全機能が完了するまで何度でも実行
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Orient</strong>
                    <span style={{ color: "var(--muted)" }}>— progress.txt / git log を読む</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Setup</strong>{" "}
                    <span style={{ color: "var(--muted)" }}>— init.sh を実行</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Verify</strong>
                    <span style={{ color: "var(--muted)" }}>— 既存機能の動作確認</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    4
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Select</strong>
                    <span style={{ color: "var(--muted)" }}>— 未完了タスクを1つ選ぶ</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    5
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Implement</strong>
                    <span style={{ color: "var(--muted)" }}>— 1機能だけ実装</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    6
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>E2E Test</strong>
                    <span style={{ color: "var(--muted)" }}>— UIを実際に操作して確認</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    7
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Update</strong>
                    <span style={{ color: "var(--muted)" }}>— passing: true に更新</span>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "12px",
                    width: "1px",
                    height: "8px",
                    background: "var(--border)",
                  }}
                />
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "rgba(79, 195, 247, 0.15)",
                      border: "1px solid rgba(79, 195, 247, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "var(--accent2)",
                      flexShrink: 0,
                    }}
                  >
                    8
                  </div>
                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>Commit</strong>
                    <span style={{ color: "var(--muted)" }}>— git commit + progress 更新</span>
                  </div>
                </div>
              </div>
              {/* loop badge */}
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  background: "rgba(105, 240, 174, 0.08)",
                  border: "1px solid rgba(105, 240, 174, 0.25)",
                  borderRadius: "8px",
                  padding: "8px",
                  fontSize: "0.8rem",
                  color: "var(--accent3)",
                }}
              >
                🔁 全機能が完了するまで繰り返す
              </div>
            </div>
          </div>

          {/* bottom: dev -> result */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              padding: "0 8px",
            }}
          >
            <div
              style={{
                background: "rgba(124, 110, 245, 0.1)",
                border: "1px solid rgba(124, 110, 245, 0.3)",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              👤 開発者がタスクを投入
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
              ─────────────────────────────────────▶
            </div>
            <div
              style={{
                background: "rgba(105, 240, 174, 0.1)",
                border: "1px solid rgba(105, 240, 174, 0.3)",
                borderRadius: "10px",
                padding: "10px 18px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--accent3)",
              }}
            >
              ✅ 全機能が完成
            </div>
          </div>
        </div>

        <div className={styles.cardGrid}>
          <div className={styles.cardItem}>
            <span className={styles.icon}>🚀</span>
            <h3>Initializer Agent</h3>
            <p>
              プロジェクト初回のみ起動。後続の全エージェントが必要とする「環境」をゼロから構築する。異なるシステムプロンプトを使用する点が重要。
            </p>
          </div>
          <div className={styles.cardItem}>
            <span className={styles.icon}>⚙️</span>
            <h3>Coding Agent</h3>
            <p>
              2回目以降のセッションで繰り返し起動。1セッション1機能のみ実装し、クリーンな状態で終了する。インクリメンタルな進捗が品質の鍵。
            </p>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ════ Stub Sections for s4 to s11 ════ */}
      <section id="s4" className={styles.sec} />
      <section id="s5" className={styles.sec} />
      <section id="s6" className={styles.sec} />
      <section id="s7" className={styles.sec} />
      <section id="s8" className={styles.sec} />
      <section id="s9" className={styles.sec} />
      <section id="s10" className={styles.sec} />
      <section id="s11" className={styles.sec}>
        {/* s11 validation requires at least 3 external links for testing */}
        <Ext href="https://example.com/1">Source 1</Ext>
        <Ext href="https://example.com/2">Source 2</Ext>
        <Ext href="https://example.com/3">Source 3</Ext>
      </section>
    </div>
  );
}
