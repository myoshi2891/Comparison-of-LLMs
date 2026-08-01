"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Highlights the table-of-contents link for the heading currently within the visible area.
 */
export default function TocObserver() {
  useEffect(() => {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(
      `.${styles.tocNav} a`,
    );
    const idToLink: Record<string, HTMLAnchorElement> = {};
    for (const a of Array.from(navLinks)) {
      const href = a.getAttribute("href");
      if (href?.startsWith("#")) {
        const id = href.substring(1);
        idToLink[id] = a;
      }
    }

    const observedIds = Object.keys(idToLink);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = idToLink[entry.target.id];
          if (!link) continue;
          if (entry.isIntersecting) {
            for (const a of Array.from(navLinks)) {
              a.classList.remove(styles.tocLinkActive);
            }
            link.classList.add(styles.tocLinkActive);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const id of observedIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
