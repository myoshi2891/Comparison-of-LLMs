"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

/**
 * Renders a mobile sidebar toggle button and manages sidebar state.
 */
export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector(`.${styles.sidebar}`);
    if (!sidebar) return;

    if (isOpen) {
      sidebar.classList.add(styles.sidebarOpen);
    } else {
      sidebar.classList.remove(styles.sidebarOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    const links = document.querySelectorAll(`.${styles.sidebar} a`);
    const handleLinkClick = () => {
      setIsOpen(false);
    };

    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);

  return (
    <button
      type="button"
      className={styles.sidebarToggle}
      aria-label={isOpen ? "目次を閉じる" : "目次を開く"}
      aria-expanded={isOpen}
      aria-controls="foundry-intermediate-sidebar"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <span>☰ 目次</span>
    </button>
  );
}
