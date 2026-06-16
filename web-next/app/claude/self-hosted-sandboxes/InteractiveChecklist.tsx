"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface InteractiveChecklistProps {
  readonly items: string[];
}

/**
 * An interactive, stateful checklist component for self-hosted sandboxes guide.
 * It displays items as a list of button checkboxes with custom styles and accessibility attributes.
 */
export default function InteractiveChecklist({ items }: InteractiveChecklistProps) {
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  useEffect(() => {
    setCheckedStates(new Array(items.length).fill(false));
  }, [items]);

  const toggle = (index: number) => {
    setCheckedStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(index);
    }
  };

  return (
    <ul className={styles.clList}>
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: array index as key
        <li key={index}>
          {/* biome-ignore lint/a11y/useSemanticElements: custom checkbox styling */}
          <button
            type="button"
            className={styles.clButton}
            role="checkbox"
            aria-checked={checkedStates[index]}
            onClick={() => toggle(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div className={`${styles.clBox} ${checkedStates[index] ? styles.clBoxChecked : ""}`} />
            <span className={styles.clText}>{item}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
