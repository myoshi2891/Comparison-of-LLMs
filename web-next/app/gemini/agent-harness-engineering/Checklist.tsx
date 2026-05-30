"use client";

import { useState } from "react";
import styles from "./page.module.css";

const CHECK_ITEMS = [
  "評価セットは実際のユースケースをカバーしているか",
  "Small テストが全テストの 70% 以上あるか",
  "フェイクLLM・フェイクツールを使った Small テストが通るか",
  "安全性テストは 0.95 以上のスコアか",
  "フレイキー評価は存在しないか（または隔離済みか）",
  "評価スコアが前リリースから低下していないか",
  "モデルバージョンがピン留めされているか",
  "Judge モデルが被評価モデルと異なるか",
  "E2E テストは手動レビューで承認されているか",
];

export default function Checklist() {
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(CHECK_ITEMS.length).fill(false)
  );

  const toggle = (index: number) => {
    setCheckedStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(index);
    }
  };

  return (
    <div className={styles.checklist} id="cl">
      {CHECK_ITEMS.map((item, index) => (
        <div
          key={item}
          className={`${styles.checkItem} ${checkedStates[index] ? styles.checked : ""}`}
          role="checkbox"
          aria-checked={checkedStates[index]}
          tabIndex={0}
          onClick={() => toggle(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          <div className={styles.checkBox} />
          <div className={styles.checkText}>{item}</div>
        </div>
      ))}
    </div>
  );
}
