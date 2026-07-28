"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import styles from "./page.module.css";

export default function SidebarToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <input type="checkbox" className={styles.navToggleCheckbox} checked={open} readOnly />
      <button
        type="button"
        className={styles.navToggleBtn}
        aria-label={open ? "目次を閉じる" : "目次を開く"}
        aria-expanded={open}
        aria-controls="claude-agent-sidebar"
        onClick={() => setOpen((current) => !current)}
      >
        ☰
      </button>
      <div className={styles.layout}>{children}</div>
    </>
  );
}
