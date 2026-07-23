"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Synchronizes table-of-contents link styling with the section visible in the viewport.
 *
 * @returns `null`, because the component renders no content
 */
export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}, .${styles.hero}`);
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    if (links.length > 0) links[0].classList.add(styles.tocLinkActive);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!id) continue;
            for (const l of links) {
              if (l.getAttribute("href") === `#${id}`) {
                l.classList.add(styles.tocLinkActive);
              } else {
                l.classList.remove(styles.tocLinkActive);
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
