"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
        <li className={checkedState["check-1"] ? styles.checkedItem : ""}>
          <label htmlFor="check-1">
            <input
              type="checkbox"
              id="check-1"
              className={styles.checkbox}
              checked={!!checkedState["check-1"]}
              onChange={() => toggleCheck("check-1")}
            />
            <span className={styles.checkboxLabelText}>
              タスクの性質に応じてAsk / Edit / Agentモードを使い分けている
            </span>
          </label>
        </li>
        <li className={checkedState["check-2"] ? styles.checkedItem : ""}>
          <label htmlFor="check-2">
            <input
              type="checkbox"
              id="check-2"
              className={styles.checkbox}
              checked={!!checkedState["check-2"]}
              onChange={() => toggleCheck("check-2")}
            />
            <span className={styles.checkboxLabelText}>
              <code>.github/copilot-instructions.md</code>
              を用意し、ビルド・テスト・コーディング規約を簡潔に明記している
            </span>
          </label>
        </li>
        <li className={checkedState["check-3"] ? styles.checkedItem : ""}>
          <label htmlFor="check-3">
            <input
              type="checkbox"
              id="check-3"
              className={styles.checkbox}
              checked={!!checkedState["check-3"]}
              onChange={() => toggleCheck("check-3")}
            />
            <span className={styles.checkboxLabelText}>
              エージェント的タスク向けに
              <code>AGENTS.md</code> を用意している(必要な場合)
            </span>
          </label>
        </li>
        <li className={checkedState["check-4"] ? styles.checkedItem : ""}>
          <label htmlFor="check-4">
            <input
              type="checkbox"
              id="check-4"
              className={styles.checkbox}
              checked={!!checkedState["check-4"]}
              onChange={() => toggleCheck("check-4")}
            />
            <span className={styles.checkboxLabelText}>
              繰り返すプロンプトは
              <code>.prompt.md</code> 化している
            </span>
          </label>
        </li>
        <li className={checkedState["check-5"] ? styles.checkedItem : ""}>
          <label htmlFor="check-5">
            <input
              type="checkbox"
              id="check-5"
              className={styles.checkbox}
              checked={!!checkedState["check-5"]}
              onChange={() => toggleCheck("check-5")}
            />
            <span className={styles.checkboxLabelText}>
              チームのナレッジベースをCopilot Spacesとして整理している
            </span>
          </label>
        </li>
        <li className={checkedState["check-6"] ? styles.checkedItem : ""}>
          <label htmlFor="check-6">
            <input
              type="checkbox"
              id="check-6"
              className={styles.checkbox}
              checked={!!checkedState["check-6"]}
              onChange={() => toggleCheck("check-6")}
            />
            <span className={styles.checkboxLabelText}>
              複雑な機能追加では「プロトタイプ→計画→Autopilot実装→人間レビュー→Rubber
              Duckレビュー」の流れを踏んでいる
            </span>
          </label>
        </li>
        <li className={checkedState["check-7"] ? styles.checkedItem : ""}>
          <label htmlFor="check-7">
            <input
              type="checkbox"
              id="check-7"
              className={styles.checkbox}
              checked={!!checkedState["check-7"]}
              onChange={() => toggleCheck("check-7")}
            />
            <span className={styles.checkboxLabelText}>
              YOLOモード(Allow All)は必ずサンドボックス環境内でのみ使用している
            </span>
          </label>
        </li>
        <li className={checkedState["check-8"] ? styles.checkedItem : ""}>
          <label htmlFor="check-8">
            <input
              type="checkbox"
              id="check-8"
              className={styles.checkbox}
              checked={!!checkedState["check-8"]}
              onChange={() => toggleCheck("check-8")}
            />
            <span className={styles.checkboxLabelText}>
              Coding AgentへのIssueアサインでは、スコープと受け入れ条件を明確に記述している
            </span>
          </label>
        </li>
        <li className={checkedState["check-9"] ? styles.checkedItem : ""}>
          <label htmlFor="check-9">
            <input
              type="checkbox"
              id="check-9"
              className={styles.checkbox}
              checked={!!checkedState["check-9"]}
              onChange={() => toggleCheck("check-9")}
            />
            <span className={styles.checkboxLabelText}>
              Copilot Code ReviewのMCP/Agent Skills設定を、チームの内部標準に合わせて整えている
            </span>
          </label>
        </li>
        <li className={checkedState["check-10"] ? styles.checkedItem : ""}>
          <label htmlFor="check-10">
            <input
              type="checkbox"
              id="check-10"
              className={styles.checkbox}
              checked={!!checkedState["check-10"]}
              onChange={() => toggleCheck("check-10")}
            />
            <span className={styles.checkboxLabelText}>
              MCPで取得した外部情報を「信頼できない入力」として扱っている
            </span>
          </label>
        </li>
        <li className={checkedState["check-11"] ? styles.checkedItem : ""}>
          <label htmlFor="check-11">
            <input
              type="checkbox"
              id="check-11"
              className={styles.checkbox}
              checked={!!checkedState["check-11"]}
              onChange={() => toggleCheck("check-11")}
            />
            <span className={styles.checkboxLabelText}>
              タスクの難易度に応じてモデルを選び、作業単位内ではモデル・推論レベルを変えていない
            </span>
          </label>
        </li>
        <li className={checkedState["check-12"] ? styles.checkedItem : ""}>
          <label htmlFor="check-12">
            <input
              type="checkbox"
              id="check-12"
              className={styles.checkbox}
              checked={!!checkedState["check-12"]}
              onChange={() => toggleCheck("check-12")}
            />
            <span className={styles.checkboxLabelText}>
              AIが生成したコードは必ず自分でテスト・レビューしてからマージしている
            </span>
          </label>
        </li>
        <li className={checkedState["check-13"] ? styles.checkedItem : ""}>
          <label htmlFor="check-13">
            <input
              type="checkbox"
              id="check-13"
              className={styles.checkbox}
              checked={!!checkedState["check-13"]}
              onChange={() => toggleCheck("check-13")}
            />
            <span className={styles.checkboxLabelText}>
              チームのAI Credits使用状況を定期的に可視化・レビューしている
            </span>
          </label>
        </li>
      </ul>
    </div>
  );
}
