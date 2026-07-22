"use client";

import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

/**
 * Registers table-of-contents observation behavior for the page.
 *
 * @returns `null`, indicating that the component renders no content
 */
export default function TocObserver() {
  useTocObserver({
    chapterSelector: "section[id]",
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.tocLinkActive,
    toggleId: "navToggle",
    sidebarId: "sidebar",
    sidebarOpenClassName: styles.sidebarOpen,
  });

  return null;
}
