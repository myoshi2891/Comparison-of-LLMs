"use client";

import { useEffect } from "react";
import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

export default function TocObserver() {
  // 1. スクロール連動ハイライト & モバイルサイドバー開閉を共有フックに委譲
  useTocObserver({
    chapterSelector: `section[id], .${styles.skillCard}[id]`,
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.tocLinkActive,
    tocSubLinkSelector: `.${styles.tocSubLink}`,
    toggleId: "navToggle",
    sidebarId: "sidebar",
    sidebarOpenClassName: styles.sidebarOpen,
  });

  useEffect(() => {
    // 2. スクロール進捗バー
    const progressFill = document.getElementById("progressFill");
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      if (progressFill) progressFill.style.width = `${pct}%`;
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return null;
}
