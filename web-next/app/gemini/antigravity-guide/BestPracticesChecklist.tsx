"use client";

import { useState } from "react";
import styles from "./page.module.css";

const ITEMS = [
  <>
    <code>name</code> はハイフン区切りの英語小文字か（64文字以内）
  </>,
  <>
    <code>description</code> に具体的なトリガーキーワードが含まれているか
  </>,
  <>SKILL.md 本文は 500 行以内か（参照資料は references/ に分離済みか）</>,
  <>スクリプトはハードコードされた値ではなく引数で動作変更できるか</>,
  <>
    危険な操作のスキルに <code>disable-model-invocation: true</code> が設定されているか
  </>,
  <>Few-shot の Examples セクションが含まれているか（入出力の例示）</>,
  <>Rules セクションで ❌禁止事項 と ✅推奨行動 が明確に定義されているか</>,
  <>アクティブなスキルの合計数が 15 個以内に収まっているか</>,
  <>ワークスペーススキルはチームで共有できるようにGitにコミットされているか</>,
  <>AGENTS.md にクロスツール共有ルールを記述し他ツールでも動作確認したか（v1.20.3〜）</>,
];

/**
 * Renders an interactive checklist of best-practice items with toggleable entries.
 *
 * The component maintains which items are checked and updates each item's visual and accessibility state when toggled.
 *
 * @returns The checklist React element containing toggleable items
 */
export default function BestPracticesChecklist() {
  const [checked, setChecked] = useState<boolean[]>(Array(ITEMS.length).fill(false));

  const toggle = (i: number) => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className={styles.checklist}>
      {ITEMS.map((label, i) => (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: index is stable for fixed checklist
          key={i}
          type="button"
          className={styles.checkItem}
          aria-pressed={checked[i]}
          onClick={() => toggle(i)}
        >
          <div
            className={
              checked[i] ? `${styles.checkBox} ${styles.checkBoxChecked}` : styles.checkBox
            }
          />
          <div
            className={
              checked[i] ? `${styles.checkText} ${styles.checkTextChecked}` : styles.checkText
            }
          >
            {label}
          </div>
        </button>
      ))}
    </div>
  );
}
