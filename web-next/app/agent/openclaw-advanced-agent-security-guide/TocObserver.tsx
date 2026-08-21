"use client";

import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

/**
 * Observes guide sections and updates the corresponding table-of-contents link styling.
 */
export default function TocObserver() {
  useTocObserver({
    chapterSelector: "section[id]",
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.active,
  });

  return null;
}
