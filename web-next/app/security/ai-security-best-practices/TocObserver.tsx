"use client";

import { useEffect } from "react";
import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

/**
 * Client component that manages the active state of TOC (Table of Contents) links
 * by observing the intersection of step sections as the user scrolls,
 * and handles mobile sidebar collapse interactions.
 */
export default function TocObserver() {
  // スクロール連動ハイライトは共有 hook に委譲
  useTocObserver({
    chapterSelector: "section[id]",
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.tocLinkActive,
  });

  useEffect(() => {
    // モバイルサイドバー開閉
    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggleClick = () => {
      if (sidebar) {
        const isOpen = sidebar.classList.toggle(styles.sidebarOpen);
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", String(isOpen));
          navToggle.setAttribute("aria-label", isOpen ? "目次を閉じる" : "目次を開く");
        }
      }
    };

    const handleLinkClick = () => {
      if (sidebar) {
        sidebar.classList.remove(styles.sidebarOpen);
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "目次を開く");
        }
      }
    };

    if (navToggle) {
      navToggle.addEventListener("click", handleToggleClick);
    }

    let links: HTMLAnchorElement[] = [];
    if (sidebar) {
      links = Array.from(sidebar.querySelectorAll("a"));
      for (const a of links) {
        a.addEventListener("click", handleLinkClick);
      }
    }

    return () => {
      if (navToggle) {
        navToggle.removeEventListener("click", handleToggleClick);
      }
      for (const a of links) {
        a.removeEventListener("click", handleLinkClick);
      }
    };
  }, []);

  return null;
}
