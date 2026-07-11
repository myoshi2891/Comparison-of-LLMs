"use client";

import { useTocObserver } from "@/lib/useTocObserver";
import styles from "./page.module.css";

/**
 * Client component that manages the active state of TOC (Table of Contents) links
 * by observing the intersection of step sections as the user scrolls.
 */
export default function TocObserver() {
  useTocObserver({
    chapterSelector: "section.step",
    tocLinkSelector: `.${styles.tocLink}`,
    activeClassName: styles.tocLinkActive,
  });

  return null;
}
