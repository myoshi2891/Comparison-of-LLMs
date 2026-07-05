"use client";

import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

/**
 * Client-side component that monitors scroll position and updates active class for TOC links.
 */
export default function TocObserver() {
  useTocObserver({
    chapterSelector: `section.${styles.chapter}`,
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.tocLinkActive,
  });

  return null;
}
