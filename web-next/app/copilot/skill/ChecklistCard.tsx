"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface ChecklistItem {
  id: string;
  text: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "c1", text: "name フィールドと親ディレクトリ名が完全に一致しているか" },
  { id: "c2", text: "description が三人称(The agent should...)で書かれているか" },
  { id: "c3", text: "description に Trigger Triad(能力・文脈・除外条件)が反映されているか" },
  { id: "c4", text: "一人称(I, my, me)や抽象的すぎる表現を排除できているか" },
  { id: "c5", text: "allowed-tools は最小権限原則に沿って絞り込まれているか" },
  { id: "c6", text: "SKILL.md 本文は 500 行 / 5,000 トークン未満に収まっているか" },
  { id: "c7", text: "500 行を超える詳細情報は references/ 配下に分割されているか" },
  { id: "c8", text: "重要な原則・警告が本文の先頭付近に配置されているか" },
  { id: "c9", text: "手順が明確な番号付きリスト(1. 2. 3...)で書かれているか" },
  { id: "c10", text: "コードブロックに言語識別子(yaml, bash, markdown等)が付与されているか" },
  { id: "c11", text: "スクリプトを追加した場合、allowed-tools または実行許可を確認したか" },
  { id: "c12", text: "直接リクエスト・間接リクエスト・否定ケースの3パターンで発火テストを行ったか" },
  { id: "c13", text: "gh skill preview / gh skill install での検証を終えているか" },
  { id: "c14", text: "サードパーティ製のスキルの場合、コードとネットワーク接続指示を事前監査したか" },
  { id: "c15", text: "プロジェクトスキルとしてコミットする際、PR レビューを通しているか" },
];

export function ChecklistCard() {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={styles.checklistCard}>
      <ul className={styles.taskList}>
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checkedState[item.id];
          return (
            <li key={item.id} className={isChecked ? styles.checkedItem : ""}>
              <label htmlFor={item.id}>
                <input
                  type="checkbox"
                  id={item.id}
                  checked={isChecked}
                  onChange={() => toggleCheck(item.id)}
                />
                <span>{item.text}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
