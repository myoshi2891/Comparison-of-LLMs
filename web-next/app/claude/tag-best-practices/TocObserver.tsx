"use client";

import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

export default function TocObserver() {
  useTocObserver({
    chapterSelector: "section.chapter",
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.tocLinkActive,
    toggleId: "navToggle",
    sidebarId: "sidebar",
    sidebarOpenClassName: styles.sidebarOpen,
  });

  return null;
}
