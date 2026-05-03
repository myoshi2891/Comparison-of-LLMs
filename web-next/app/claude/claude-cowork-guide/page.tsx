import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Claude Cowork 完全入門ガイド",
  description:
    "コードを一行も書かずに自然言語の指示だけでファイル管理・タスク自動化を実現する Anthropic のデスクトップツール「Cowork」を初学者向けにゼロから解説します。",
};

export default function Page() {
  return (
    <div className={styles.pageWrap}>
      {/* ── TOP NAV ── */}
      <nav className={styles.topnav} aria-label="ページナビゲーション">
        <div className={styles.topnavInner}>
          <div className={styles.topnavLogo}>
            <span className={styles.logoPill}>Cowork</span>
            <span className={styles.siteTitle}>完全入門ガイド</span>
          </div>
          <div className={styles.topnavLinks}>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>基礎</span>
              <a href="#what" className={styles.navLink}>
                <span className={styles.navNum}>01</span>&nbsp;概要
              </a>
              <a href="#products" className={styles.navLink}>
                <span className={styles.navNum}>02</span>&nbsp;製品比較
              </a>
              <a href="#setup" className={styles.navLink}>
                <span className={styles.navNum}>03</span>&nbsp;セットアップ
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>機能</span>
              <a href="#natural-language" className={styles.navLink}>
                <span className={styles.navNum}>04</span>&nbsp;自然言語操作
              </a>
              <a href="#file-tasks" className={styles.navLink}>
                <span className={styles.navNum}>05</span>&nbsp;タスク自動化
              </a>
              <a href="#skills" className={styles.navLink}>
                <span className={styles.navNum}>06</span>&nbsp;Skills連携
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>実践</span>
              <a href="#workflow" className={styles.navLink}>
                <span className={styles.navNum}>07</span>&nbsp;ワークフロー
              </a>
              <a href="#skill-writing" className={styles.navLink}>
                <span className={styles.navNum}>08</span>&nbsp;スキルの書き方
              </a>
              <a href="#best-practices" className={styles.navLink}>
                <span className={styles.navNum}>09</span>&nbsp;ベストプラクティス
              </a>
              <a href="#advanced" className={styles.navLink}>
                <span className={styles.navNum}>10</span>&nbsp;応用
              </a>
            </div>
            <div className={styles.topnavGroup}>
              <span className={styles.groupLabel}>参考</span>
              <a href="#sources" className={styles.navLink}>
                <span className={styles.navNum}>11</span>&nbsp;ソース
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.pageContent}>
        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            Claude Cowork · 非開発者向けデスクトップ自動化ツール
          </div>
          <h1>
            Claude Cowork
            <br />
            完全入門ガイド
          </h1>
          <p className={styles.heroSub}>
            コードを一行も書かずに、自然言語の指示だけでファイル管理・タスク自動化を実現する
            Anthropic のデスクトップツール「Cowork」を、初学者向けにゼロから解説します。 Skills
            との連携・ベストプラクティス・実践ワークフロー例まで網羅。
          </p>
          <div className={styles.heroMeta}>
            <span className={`${styles.heroChip} ${styles.chipOrange}`}>🖥️ デスクトップアプリ</span>
            <span className={`${styles.heroChip} ${styles.chipBlue}`}>👥 非開発者向け</span>
            <span className={`${styles.heroChip} ${styles.chipGreen}`}>⚡ Skills 対応</span>
            <span className={`${styles.heroChip} ${styles.chipPurple}`}>🤖 Claude AI 搭載</span>
          </div>
        </section>

        {/* sections will be added in Green commits */}
      </div>
    </div>
  );
}
