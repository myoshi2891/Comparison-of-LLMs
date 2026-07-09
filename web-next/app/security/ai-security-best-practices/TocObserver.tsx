"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Client component that manages the active state of TOC (Table of Contents) links
 * by observing the intersection of step sections as the user scrolls.
 */
export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("section.step");
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    if (links.length > 0) links[0].classList.add(styles.tocLinkActive);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
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
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    for (const sec of sections) observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  return null;
}
