"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Tracks visible page sections to highlight the corresponding table-of-contents link.
 */
export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}, .${styles.hero}`);
    const links = Array.from(document.querySelectorAll(`.${styles.navLink}`));
    if (links.length > 0) links[0].classList.add(styles.active);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!id) continue;
            for (const l of links) {
              if (l.getAttribute("href") === `#${id}`) {
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

    for (const sec of sections) observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  return null;
}
