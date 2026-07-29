"use client";

import { type ReactNode, useState } from "react";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

interface SkillGuideClientProps {
  children: ReactNode;
}

export default function SkillGuideClient({ children }: SkillGuideClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <TocObserver />
      <button
        type="button"
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded={sidebarOpen}
        aria-controls="skillSidebar"
        aria-label={sidebarOpen ? "目次を閉じる" : "目次を開く"}
      >
        <i className="ti ti-menu-2" />
      </button>

      <aside
        id="skillSidebar"
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarBrand}>
          <i className="ti ti-puzzle" />
          SKILL.md 実践ガイド
        </div>

        <div className={styles.navGroupLabel}>はじめに</div>
        <nav className={styles.toc}>
          <a
            href="#intro"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-info-circle" />
            なぜ今 SKILL.md なのか
          </a>
          <a
            href="#architecture"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-stack-2" />
            Progressive Disclosure
          </a>
        </nav>

        <div className={styles.navGroupLabel}>ステップバイステップ</div>
        <nav className={styles.toc}>
          <a
            href="#step1"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-1" />
            ギャップの特定
          </a>
          <a
            href="#step2"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-2" />
            ディレクトリ設計
          </a>
          <a
            href="#step3"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-3" />
            フロントマター
          </a>
          <a
            href="#step4"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-4" />
            description設計
          </a>
          <a
            href="#step5"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-5" />
            本文を簡潔に書く
          </a>
          <a
            href="#step6"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-6" />
            分割パターン
          </a>
          <a
            href="#step7"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-7" />
            ワークフロー設計
          </a>
          <a
            href="#step8"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-8" />
            Claude Code固有フィールド
          </a>
          <a
            href="#step9"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-9" />
            実行コードの設計
          </a>
          <a
            href="#step10"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-10" />
            セキュリティ
          </a>
          <a
            href="#step11"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-number-11" />
            評価とイテレーション
          </a>
        </nav>

        <div className={styles.navGroupLabel}>まとめ</div>
        <nav className={styles.toc}>
          <a
            href="#antipatterns"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-alert-triangle" />
            アンチパターン集
          </a>
          <a
            href="#checklist"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-checklist" />
            チェックリスト
          </a>
          <a
            href="#summary"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-flag" />
            まとめ
          </a>
          <a
            href="#sources"
            className={styles.tocLink}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ti ti-books" />
            参考文献・ソース
          </a>
        </nav>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
