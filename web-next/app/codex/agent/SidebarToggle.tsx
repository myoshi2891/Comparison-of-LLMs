"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      if (nextState) {
        sidebar.classList.add(styles.sidebarOpen);
      } else {
        sidebar.classList.remove(styles.sidebarOpen);
      }
    }
  };

  return (
    <button
      type="button"
      className={styles.sidebarToggle}
      id="sidebarToggle"
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
      aria-expanded={isOpen}
      aria-controls="sidebar"
      onClick={toggleSidebar}
    >
      ☰
    </button>
  );
}
