import type { Metadata } from "next";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

export const metadata: Metadata = {
  title: "MCP実践ベストプラクティス | Model Context Protocol 完全ガイド | LLM-Studies",
  description: "Model Context Protocol (MCP) の詳細なアーキテクチャ、バージョン管理、トランスポート、セキュリティ、認証・認可から運用プラクティスまで網羅的に解説するベストプラクティスガイド。",
};

export default function McpBestPracticesIntermediatePage() {
  return (
    <div className={styles.pageWrap}>
      <TocObserver />
      <div className={styles.layout}>
        <nav className={styles.sidebar} id="mcpSideNav">
          <button className={styles.mobileToggle} id="mcpInterNavToggle" type="button">
            <i className="ti ti-menu-2" />
            目次を開く
          </button>
          <p className={styles.navTitle}>目次</p>
          <ul className={styles.navList} id="mcpInterNavList">
            <li>
              <a href="#sec01" className={styles.tocLink}>
                第1章
              </a>
            </li>
          </ul>
        </nav>
        <main className={styles.main}>
          <header className={styles.hero}>
            <h1>MCP実践ベストプラクティス</h1>
          </header>
          <section className={`${styles.chapter} chapter`} id="sec01">
            <h2>第1章</h2>
          </section>
        </main>
      </div>
    </div>
  );
}
