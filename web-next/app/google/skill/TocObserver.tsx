"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Keeps the table-of-contents link for the uppermost visible section active.
 */
export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("section[id], footer[id]");
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    const intersecting = new Set<Element>();
    if (links.length > 0) {
      links[0].classList.add(styles.tocLinkActive);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }

        const [uppermost] = [...intersecting].sort(
          (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
        );
        if (!uppermost) return;

        for (const link of links) {
          link.classList.toggle(
            styles.tocLinkActive,
            link.getAttribute("href") === `#${uppermost.id}`
          );
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
