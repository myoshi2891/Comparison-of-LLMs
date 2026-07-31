"use client";

import TocObserver from "@/components/docs/TocObserver";
import styles from "./page.module.css";

/**
 * Renders a table of contents observer for the DeepSeek best-practices page.
 */
export default function DeepSeekTocObserver() {
  return (
    <TocObserver
      navLinkClassName={styles.navLink}
      activeClassName={styles.active}
      chapterSelector="header[id], section"
    />
  );
}
