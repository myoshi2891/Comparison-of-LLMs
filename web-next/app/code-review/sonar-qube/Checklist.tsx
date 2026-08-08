"use client";

import { useState } from "react";
import styles from "./page.module.css";

const CHECKLIST_ITEMS = [
  <>
    エディション（Community Build / Developer / Enterprise / Data Center /
    Cloud）をブランチ運用の要件から選定した
  </>,
  <>
    New Code Definitionを<code>Reference branch</code>（例: <code>main</code>
    ）ベースで設定した
  </>,
  <>
    <code>Sonar way</code>を土台にQuality
    Gateを設計し、全体コードではなく新規コード条件を中心に据えた
  </>,
  <>
    Quality
    Profileを組織共通のベースから継承する形で運用し、プロジェクト差分だけを子プロファイルで管理している
  </>,
  <>Issueトリアージ（Accepted / False Positive判定）のレビュー時間をスプリントに組み込んだ</>,
  <>Security Hotspotのレビュー率100%をQuality Gate条件に含めた</>,
  <>SonarQube for IDEをConnected Modeでチーム全体に展開した</>,
  <>
    CI/CDにプルリクエストデコレーション＋ブランチ保護ルールを設定し、Quality Gate
    Redでマージ不可にした
  </>,
  <>
    <code>fetch-depth: 0</code>など、SCM blame情報が正しく取得できるCI設定を確認した
  </>,
  <>
    AI CodeFix / AI Code Assurance / MCP
    Serverなど、AI関連機能の要否をチームのAI活用度に応じて評価した
  </>,
  <>他のAIレビューツールと併用する場合、役割分担をドキュメント化した</>,
  <>半年〜1年に一度、Quality Gate・Quality Profileの妥当性を棚卸しする運用を定めた</>,
];

export default function Checklist() {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(CHECKLIST_ITEMS.length).fill(false)
  );

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const doneCount = checkedItems.filter(Boolean).length;
  const isAllDone = doneCount === CHECKLIST_ITEMS.length;

  return (
    <div className={styles.checklistWrap}>
      <div className={styles.checklistHeader}>
        <span className={styles.checklistHeaderIcon}>✓</span>
        <span className={styles.checklistHeaderTitle}>チェックリスト</span>
        <span className={`${styles.checklistCounter} ${isAllDone ? styles.allDone : ""}`}>
          {doneCount} / {CHECKLIST_ITEMS.length} 完了
        </span>
      </div>
      <ul className={styles.checklistCard}>
        {CHECKLIST_ITEMS.map((item, idx) => {
          const isChecked = checkedItems[idx];
          return (
            /* biome-ignore lint/suspicious/noArrayIndexKey: items are static and constant in order */
            <li key={`chk-${idx}`} className={isChecked ? styles.checkedLi : ""}>
              <label>
                <input type="checkbox" checked={isChecked} onChange={() => toggleItem(idx)} />
                <span>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
