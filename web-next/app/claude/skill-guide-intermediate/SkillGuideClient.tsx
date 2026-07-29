/* biome-ignore-all lint/a11y/useValidAnchor: Hash anchors navigate within this guide. */

"use client";

import { type ReactNode, useState } from "react";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

interface SkillGuideClientProps {
  children: ReactNode;
}

const NAV_GROUPS = [
  {
    label: "はじめに",
    items: [
      { id: "intro", icon: "ti-info-circle", label: "なぜ今 SKILL.md なのか" },
      { id: "architecture", icon: "ti-stack-2", label: "Progressive Disclosure" },
    ],
  },
  {
    label: "ステップバイステップ",
    items: [
      { id: "step1", icon: "ti-number-1", label: "ギャップの特定" },
      { id: "step2", icon: "ti-number-2", label: "ディレクトリ設計" },
      { id: "step3", icon: "ti-number-3", label: "フロントマター" },
      { id: "step4", icon: "ti-number-4", label: "description設計" },
      { id: "step5", icon: "ti-number-5", label: "本文を簡潔に書く" },
      { id: "step6", icon: "ti-number-6", label: "分割パターン" },
      { id: "step7", icon: "ti-number-7", label: "ワークフロー設計" },
      { id: "step8", icon: "ti-number-8", label: "Claude Code固有フィールド" },
      { id: "step9", icon: "ti-number-9", label: "実行コードの設計" },
      { id: "step10", icon: "ti-number-10", label: "セキュリティ" },
      { id: "step11", icon: "ti-number-11", label: "評価とイテレーション" },
    ],
  },
  {
    label: "まとめ",
    items: [
      { id: "antipatterns", icon: "ti-alert-triangle", label: "アンチパターン集" },
      { id: "checklist", icon: "ti-checklist", label: "チェックリスト" },
      { id: "summary", icon: "ti-flag", label: "まとめ" },
      { id: "sources", icon: "ti-books", label: "参考文献・ソース" },
    ],
  },
] as const;

/**
 * Renders the SKILL.md guide layout with a navigable table of contents and main content.
 *
 * @param children - The guide content rendered in the main area
 */
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

        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className={styles.navGroupLabel}>{group.label}</div>
            <nav className={styles.toc}>
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={styles.tocLink}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={`ti ${item.icon}`} />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
