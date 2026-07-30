"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add(styles.sidebarOpen);
      } else {
        sidebar.classList.remove(styles.sidebarOpen);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    window.addEventListener("close-codex-sidebar", handleClose);
    return () => window.removeEventListener("close-codex-sidebar", handleClose);
  }, []);

  return (
    <button
      type="button"
      className={styles.sidebarToggle}
      id="sidebarToggle"
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
      aria-expanded={isOpen}
      aria-controls="sidebar"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      ☰
    </button>
  );
}
