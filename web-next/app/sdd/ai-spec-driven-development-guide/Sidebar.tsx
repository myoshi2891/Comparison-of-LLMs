"use client";

import { useState } from "react";
import styles from "./page.module.css";

const links = [
  ["#top", "はじめに"],
  ["#ch1", "1. なぜ今SDDなのか"],
  ["#ch2", "2. SDDとは何か"],
  ["#ch3", "3. 成熟度モデル"],
  ["#ch4", "4. 主要ツール比較"],
  ["#ch5", "5. EARS記法"],
  ["#ch6", "6. ワークフロー実践"],
  ["#ch7", "7. 良い仕様の書き方"],
  ["#ch8", "8. Claude Codeでの実践"],
  ["#ch9", "9. チェックリスト"],
  ["#ch10", "10. 批判的視点と限界"],
  ["#ch11", "11. 最新動向"],
  ["#ch12", "12. まとめ"],
  ["#refs", "参考文献"],
] as const;

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav id="ai-sdd-sidebar" className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <p className={styles.brand}>Spec-driven development</p>
        <p className={styles.brandTitle}>AI仕様駆動開発 実践ガイド</p>
        <ul className={styles.sidebarNav}>
          {links.map(([href, label]) => (
            <li key={href}>
              <a className={styles.tocLink} href={href}>
                <span className={styles.dot} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        className={styles.sidebarToggle}
        aria-label="目次を開く"
        aria-expanded={open}
        aria-controls="ai-sdd-sidebar"
        onClick={() => setOpen((current) => !current)}
      >
        ☰
      </button>
    </>
  );
}
