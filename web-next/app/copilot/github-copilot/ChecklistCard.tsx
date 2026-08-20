"use client";

import { type ReactNode, useState } from "react";
import styles from "./page.module.css";

interface ChecklistItem {
  id: string;
  label: ReactNode;
}

/** チェック項目の定義。表示順はこの配列の順序に従う。 */
const CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  {
    id: "check-1",
    label: <>タスクの性質に応じてAsk / Edit / Agentモードを使い分けている</>,
  },
  {
    id: "check-2",
    label: (
      <>
        <code>.github/copilot-instructions.md</code>
        を用意し、ビルド・テスト・コーディング規約を簡潔に明記している
      </>
    ),
  },
  {
    id: "check-3",
    label: (
      <>
        エージェント的タスク向けに
        <code>AGENTS.md</code> を用意している(必要な場合)
      </>
    ),
  },
  {
    id: "check-4",
    label: (
      <>
        繰り返すプロンプトは
        <code>.prompt.md</code> 化している
      </>
    ),
  },
  {
    id: "check-5",
    label: <>チームのナレッジベースをCopilot Spacesとして整理している</>,
  },
  {
    id: "check-6",
    label: (
      <>
        複雑な機能追加では「プロトタイプ→計画→Autopilot実装→人間レビュー→Rubber
        Duckレビュー」の流れを踏んでいる
      </>
    ),
  },
  {
    id: "check-7",
    label: <>YOLOモード(Allow All)は必ずサンドボックス環境内でのみ使用している</>,
  },
  {
    id: "check-8",
    label: <>Coding AgentへのIssueアサインでは、スコープと受け入れ条件を明確に記述している</>,
  },
  {
    id: "check-9",
    label: <>Copilot Code ReviewのMCP/Agent Skills設定を、チームの内部標準に合わせて整えている</>,
  },
  {
    id: "check-10",
    label: <>MCPで取得した外部情報を「信頼できない入力」として扱っている</>,
  },
  {
    id: "check-11",
    label: <>タスクの難易度に応じてモデルを選び、作業単位内ではモデル・推論レベルを変えていない</>,
  },
  {
    id: "check-12",
    label: <>AIが生成したコードは必ず自分でテスト・レビューしてからマージしている</>,
  },
  {
    id: "check-13",
    label: <>チームのAI Credits使用状況を定期的に可視化・レビューしている</>,
  },
];

/**
 * Renders an interactive checklist for GitHub Copilot best practices.
 */
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
        {CHECKLIST_ITEMS.map(({ id, label }) => (
          <li key={id} className={checkedState[id] ? styles.checkedItem : ""}>
            <label htmlFor={id}>
              <input
                type="checkbox"
                id={id}
                className={styles.checkbox}
                checked={!!checkedState[id]}
                onChange={() => toggleCheck(id)}
              />
              <span className={styles.checkboxLabelText}>{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
