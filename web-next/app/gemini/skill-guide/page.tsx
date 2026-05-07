import type { Metadata } from "next";
import MermaidDiagram from "@/components/docs/MermaidDiagram";
import styles from "./page.module.css";

const MERMAID_OVERVIEW = `graph LR
SKILL["📄 SKILL.md\\nオープンスタンダード"]
subgraph GC["💻 Gemini CLI"]
GCi["ターミナルネイティブ\\nAIエージェント"]
end
subgraph AG["🚀 Antigravity"]
AGi["エージェントファースト IDE\\nVSCodeフォーク"]
end
subgraph CC["🤖 Claude Code"]
CCi["Anthropic製\\nコーディングエージェント"]
end
SKILL --> GC
SKILL --> AG
SKILL --> CC
style SKILL fill:#d1fae5,stroke:#059669,color:#065f46
style GCi fill:#bfdbfe,stroke:#0284c7,color:#0c4a6e
style AGi fill:#ede9fe,stroke:#7c3aed,color:#3b0764
style CCi fill:#fef3c7,stroke:#d97706,color:#78350f`;

export const metadata: Metadata = {
  title: "SKILL.md 完全ガイド — Gemini CLI & Antigravity",
  description:
    "AIエージェントに「専門知識の教科書」を渡す仕組み — SKILL.md の構造・書き方・インストール手順を Gemini CLI & Antigravity 対応版で完全解説。",
};

export default function Page() {
  return (
    <div className={styles.wrap}>
      {/* ===== Hero header ===== */}
      <header className={styles.hero}>
        <div className={styles.tagRow}>
          <span className={`${styles.tag} ${styles.tagGreen}`}>Google Gemini / Antigravity</span>
          <span className={`${styles.tag} ${styles.tagSky}`}>初学者向け完全ガイド</span>
          <span className={`${styles.tag} ${styles.tagViolet}`}>2026年版</span>
          <span className={`${styles.tag} ${styles.tagTeal}`}>Gemini CLI v0.34.0</span>
          <span className={`${styles.tag} ${styles.tagIndigo}`}>Antigravity v1.20.3</span>
          <span className={`${styles.tag} ${styles.tagOrange}`}>最終更新 2026-03-21</span>
        </div>
        <h1 className={styles.heroTitle}>
          SKILL.md
          <br />
          <span className={styles.heroSub}>完全解剖ガイド</span>
        </h1>
        <p className={styles.heroLead}>
          AIエージェントに「専門知識の教科書」を渡す — Gemini CLI &amp; Antigravity 対応版
        </p>
        <nav className={styles.heroNav}>
          <a href="#overview" className={styles.navBtn}>
            🌐 概要
          </a>
          <a href="#why" className={styles.navBtn}>
            ❓ なぜ必要か
          </a>
          <a href="#structure" className={styles.navBtn}>
            📁 構造
          </a>
          <a href="#howto" className={styles.navBtn}>
            ✍️ 書き方
          </a>
          <a href="#steps" className={styles.navBtn}>
            🚀 ステップ解説
          </a>
          <a href="#install" className={styles.navBtn}>
            📦 インストール
          </a>
          <a href="#examples" className={styles.navBtn}>
            💡 実例集
          </a>
          <a href="#checklist" className={styles.navBtn}>
            ✅ チェックリスト
          </a>
          <a href="#whatsnew" className={`${styles.navBtn} ${styles.navBtnNew}`}>
            🆕 最新情報
          </a>
        </nav>
      </header>

      {/* s02: overview */}
      <section id="overview" className={styles.sec}>
        <h2 className={styles.secTitle}>🌐 SKILL.md とは何か</h2>

        {/* 3-col card grid */}
        <div className={styles.grid3}>
          <div className={`${styles.card} ${styles.cardGreen}`}>
            <div className={styles.cardIcon}>📄</div>
            <div className={styles.cardLabel}>Markdownファイル</div>
            <div className={styles.cardDesc}>
              AIエージェントへの「取扱説明書」。YAMLヘッダー＋指示本文で構成
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardSky}`}>
            <div className={styles.cardIcon}>🧠</div>
            <div className={styles.cardLabel}>専門知識パッケージ</div>
            <div className={styles.cardDesc}>
              再利用可能な知識の塊。一度書けばどのプロジェクトでも使い回せる
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardViolet}`}>
            <div className={styles.cardIcon}>🌐</div>
            <div className={styles.cardLabel}>オープンスタンダード</div>
            <div className={styles.cardDesc}>
              Gemini CLI・Antigravity・Claude Code など主要ツール共通対応
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className={styles.quote}>
          <div className={styles.quoteLabel}>💬 一言で言うと？</div>
          <blockquote className={styles.quoteText}>
            AIエージェントに「専門知識の教科書」を渡す仕組みです。
            <br />
            必要なときだけ読み込まれるので、効率よく高精度な応答が得られます。
          </blockquote>
        </div>

        {/* Mermaid: 2ツール比較 */}
        <h3 className={styles.secH3}>Gemini CLI vs Antigravity — 対応ツール比較</h3>
        <div className={styles.mermaidWrap}>
          <MermaidDiagram chart={MERMAID_OVERVIEW} />
        </div>

        {/* Comparison table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.thGradient} ${styles.tdLeft} ${styles.thTeal}`}>項目</th>
                <th className={`${styles.thGradient} ${styles.thSky}`}>Gemini CLI</th>
                <th className={`${styles.thGradient} ${styles.thViolet}`}>Antigravity</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tr}>
                <td className={`${styles.tdLeft}`} style={{ fontWeight: 600, color: "#334155" }}>
                  形態
                </td>
                <td style={{ color: "#475569" }}>ターミナルアプリ</td>
                <td style={{ color: "#475569" }}>IDE（エディタ）</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  最新バージョン
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeSky}`}>v0.34.0</span>
                  <div className={styles.textSlateLight}>2026-03-17</div>
                  <div className={styles.versionLinks}>
                    <a
                      href="https://github.com/google-gemini/gemini-cli/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Releases
                    </a>
                    {" · "}
                    <a
                      href="https://geminicli.com/docs/changelogs/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Changelog
                    </a>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeViolet}`}>v1.20.3</span>
                  <div className={styles.textSlateLight}>2026-03-05</div>
                  <div className={styles.versionLinks}>
                    <a
                      href="https://antigravity.google/changelog"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Changelog
                    </a>
                  </div>
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  グローバルスキルパス
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  {"~/.gemini/skills/"}
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  {"~/.gemini/antigravity/skills/"}
                </td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  ワークスペーススキルパス
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  {".gemini/skills/"}
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  {".agent/skills/"}
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  インストールコマンド
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  gemini skills install
                </td>
                <td style={{ color: "#475569", fontSize: "0.75rem" }}>GUI または CLI</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  SKILL.md サポート
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ フル対応</td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ フル対応</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  デフォルトモデル
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  Auto (Gemini 3)
                  <br />
                  <span style={{ color: "#94a3b8" }}>(v0.29.0〜 タスクに応じて自動選択)</span>
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  gemini-3-flash-preview
                </td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  最高精度モデル
                </td>
                <td className={styles.mono} style={{ color: "#0369a1", fontSize: "0.75rem" }}>
                  gemini-3.1-pro-preview
                  <br />
                  <span style={{ color: "#94a3b8" }}>
                    (v0.31.0〜,{" "}
                    <a
                      href="https://ai.google.dev/gemini-api/docs/models"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      アクセス要件を確認
                    </a>
                    )
                  </span>
                </td>
                <td className={styles.mono} style={{ color: "#6d28d9", fontSize: "0.75rem" }}>
                  gemini-3.1-pro-preview
                </td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  Plan Mode
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>
                  ✅{" "}
                  <span className={styles.mono} style={{ fontWeight: 400, fontSize: "0.75rem" }}>
                    /plan
                  </span>{" "}
                  (v0.29.0〜)
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ あり</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  skill-creator メタスキル
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ 標準搭載 (v0.26.0〜)</td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ あり</td>
              </tr>
              <tr className={styles.tr}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  /rewind コマンド
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ (v0.27.0〜)</td>
                <td style={{ color: "#94a3b8" }}>—</td>
              </tr>
              <tr className={styles.trEven}>
                <td className={styles.tdLeft} style={{ fontWeight: 600, color: "#334155" }}>
                  AGENTS.md 対応
                </td>
                <td style={{ color: "#475569", fontSize: "0.75rem" }}>
                  ⚙️ 設定が必要
                  <br />
                  <span style={{ color: "#94a3b8" }}>
                    (context.fileName に追加 / デフォルトは GEMINI.md)
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: "#059669" }}>✅ (v1.20.3〜)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* s03: why — TODO: faithful migration */}
      <section id="why" className={styles.sec}>
        <h2 className={styles.secTitle}>❓ なぜ SKILL.md が必要なのか</h2>
      </section>

      {/* s04: structure — TODO: faithful migration */}
      <section id="structure" className={styles.sec}>
        <h2 className={styles.secTitle}>📁 ディレクトリ構造と SKILL.md の解剖</h2>
      </section>

      {/* s05: howto — TODO: faithful migration */}
      <section id="howto" className={styles.sec}>
        <h2 className={styles.secTitle}>✍️ SKILL.md の書き方（推奨テンプレート）</h2>
      </section>

      {/* s06: steps — TODO: faithful migration */}
      <section id="steps" className={styles.sec}>
        <h2 className={styles.secTitle}>🚀 ステップバイステップ — 初めてのスキル作成</h2>
      </section>

      {/* s07: install — TODO: faithful migration */}
      <section id="install" className={styles.sec}>
        <h2 className={styles.secTitle}>📦 スキルのインストール方法</h2>
      </section>

      {/* s08: examples — TODO: faithful migration */}
      <section id="examples" className={styles.sec}>
        <h2 className={styles.secTitle}>💡 パターン別 実例集</h2>
      </section>

      {/* s09: checklist — TODO: faithful migration */}
      <section id="checklist" className={styles.sec}>
        <h2 className={styles.secTitle}>✅ ベストプラクティス &amp; チェックリスト</h2>
      </section>

      {/* s10: whatsnew — TODO: faithful migration */}
      <section id="whatsnew" className={styles.sec}>
        <h2 className={styles.secTitle}>🆕 最新アップデート（2026年3月21日時点）</h2>
      </section>

      {/* s11: footer */}
      <footer className={styles.footer}>
        <p>© 2026 SKILL.md 完全ガイド — Gemini CLI &amp; Antigravity 対応版</p>
      </footer>
    </div>
  );
}
