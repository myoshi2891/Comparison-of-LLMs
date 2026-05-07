import type { Metadata } from "next";
import styles from "./page.module.css";

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

      {/* s02: overview — TODO: faithful migration */}
      <section id="overview" className={styles.sec}>
        <h2 className={styles.secTitle}>🌐 SKILL.md とは何か</h2>
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
