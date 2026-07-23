"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Tracks document sections and highlights the corresponding table-of-contents link as sections enter the viewport.
 */
export default function TocObserver() {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll(`.${styles.navItem}`));
    const sections = links
      .map((l) => {
        const href = l.getAttribute("href");
        return href ? document.querySelector(href) : null;
      })
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            for (const l of links) {
              if (l.getAttribute("href") === id) {
                l.classList.add(styles.active);
              } else {
                l.classList.remove(styles.active);
              }
            }
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
