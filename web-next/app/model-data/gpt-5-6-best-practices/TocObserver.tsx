"use client";

import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

/**
 * Tracks the visible guide section and highlights its corresponding table-of-contents link.
 */
export default function TocObserver() {
  useTocObserver({
    chapterSelector: `.${styles.section}`,
    tocLinkSelector: `.${styles.navLink}`,
    activeClassName: styles.navLinkActive,
  });
  return null;
}
