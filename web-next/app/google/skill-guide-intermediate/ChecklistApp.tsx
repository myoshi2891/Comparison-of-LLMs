"use client";
import { useState } from "react";
import styles from "./page.module.css";

type CheckItem = {
  id: string;
  content: React.ReactNode;
  isNew?: boolean;
};

const ITEMS: CheckItem[] = [
  {
    id: "c01",
    content: (
      <>
        <code>name</code> はハイフン区切りの英語小文字か（64文字以内・予約語なし）
      </>
    ),
  },
  {
    id: "c02",
    content: (
      <>
        <code>description</code>
        に具体的なトリガーキーワードが含まれているか（「この言葉が出たら使うこと」）
      </>
    ),
  },
  {
    id: "c03",
    content: "SKILL.md 本文は 500 行以内か（参照資料は references/ に分離済みか）",
  },
  {
    id: "c04",
    content: "スクリプトはハードコードされた値ではなく引数で動作変更できるか",
  },
  {
    id: "c05",
    content: (
      <>
        危険な操作（DB削除・インフラ変更等）のスキルに
        <code>disable-model-invocation: true</code> が設定されているか
      </>
    ),
  },
  {
    id: "c06",
    content: "Few-shot の Examples セクションが含まれているか（期待する入出力の例示）",
  },
  {
    id: "c07",
    content: "Rules セクションで ❌禁止事項 と ✅推奨行動 が明確に定義されているか",
  },
  {
    id: "c08",
    content: (
      <>
        実際にエージェントから呼び出されるかテストしたか（<code>gemini skills list</code>
        で確認）
      </>
    ),
  },
  {
    id: "c09",
    content: "アクティブなスキルの合計数が 15 個以内に収まっているか",
  },
  {
    id: "c10",
    content: "ワークスペーススキルはチームで共有できるようにコミットされているか",
  },
  {
    id: "c11",
    isNew: true,
    content: (
      <>
        <span className={styles.newBadge}>v0.29.0〜</span> <code>/plan</code>（Plan Mode）でスキルが
        read-only 環境で安全に動作することを確認したか
      </>
    ),
  },
  {
    id: "c12",
    isNew: true,
    content: (
      <>
        <span className={styles.newBadge}>v0.26.0〜</span>
        <code>skill-creator</code>
        メタスキルでスキル品質レビューを受けたか（「このスキルを改善して」と入力するだけ）
      </>
    ),
  },
  {
    id: "c13",
    isNew: true,
    content: (
      <>
        <span className={styles.newBadge}>v1.20.3〜</span> クロスツール共有が必要な場合、
        <code>AGENTS.md</code>
        にルールを記述して他ツールでも動作確認したか
      </>
    ),
  },
];

/**
 * Renders an interactive checklist and manages which items are selected.
 *
 * Each checklist entry is displayed as a toggleable button; selection state is kept internally.
 *
 * @returns A React element representing the checklist UI
 */
export default function ChecklistApp() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={styles.checklist}>
      {ITEMS.map((item) => {
        const isChecked = checked.has(item.id);
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.checkItem}${item.isNew ? ` ${styles.itemNew}` : ""}`}
            aria-pressed={isChecked}
            onClick={() => toggle(item.id)}
          >
            <div className={styles.checkBox} />
            <div className={styles.checkText}>{item.content}</div>
          </button>
        );
      })}
    </div>
  );
}
