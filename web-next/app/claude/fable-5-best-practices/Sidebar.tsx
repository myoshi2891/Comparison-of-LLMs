"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside id="fable-sidebar" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <a href="#top" className={styles.brand}>
          <div className={styles.brandMark}>F5</div>
          <div className={styles.brandText}>
            Claude Fable 5<span className={styles.brandSub}>Field Guide</span>
          </div>
        </a>
        <div className={styles.sidebarMeta}>
          最終更新: 2026-07-26
          <br />
          対象: Claude Code 中〜上級者
        </div>
        <nav className={styles.toc} id="toc">
          <a href="#s1" className={styles.tocLink}>
            <span className={styles.num}>01</span>Claude Fable 5 とは何か
          </a>
          <a href="#s2" className={styles.tocLink}>
            <span className={styles.num}>02</span>タイムライン
          </a>
          <a href="#s3" className={styles.tocLink}>
            <span className={styles.num}>03</span>安全分類器とフォールバック
          </a>
          <a href="#s4" className={styles.tocLink}>
            <span className={styles.num}>04</span>プロンプティング思想の転換
          </a>
          <a href="#s5" className={styles.tocLink}>
            <span className={styles.num}>05</span>Effortレベルの使い方
          </a>
          <a href="#s6" className={styles.tocLink}>
            <span className={styles.num}>06</span>Claude Code での実践設定
          </a>
          <a href="#s7" className={styles.tocLink}>
            <span className={styles.num}>07</span>Loop Engineering
          </a>
          <a href="#s8" className={styles.tocLink}>
            <span className={styles.num}>08</span>Unknowns フレームワーク
          </a>
          <a href="#s9" className={styles.tocLink}>
            <span className={styles.num}>09</span>検証ループとメモリシステム
          </a>
          <a href="#s10" className={styles.tocLink}>
            <span className={styles.num}>10</span>コスト管理とモデル選定
          </a>
          <a href="#s11" className={styles.tocLink}>
            <span className={styles.num}>11</span>よくある落とし穴
          </a>
          <a href="#s12" className={styles.tocLink}>
            <span className={styles.num}>12</span>実力と検証の必要性
          </a>
          <a href="#s13" className={styles.tocLink}>
            <span className={styles.num}>13</span>既知の制限事項
          </a>
          <a href="#s14" className={styles.tocLink}>
            <span className={styles.num}>14</span>まとめ
          </a>
          <a href="#s15" className={styles.tocLink}>
            <span className={styles.num}>15</span>参考文献・ソースURL一覧
          </a>
        </nav>
      </aside>
      <button
        type="button"
        className={styles.sidebarToggle}
        aria-label="目次を開く"
        aria-expanded={open}
        aria-controls="fable-sidebar"
        onClick={() => setOpen((current) => !current)}
      >
        ☰
      </button>
    </>
  );
}
