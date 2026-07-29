"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.chapter}, .${styles.hero}`);
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
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
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  return null;
}
