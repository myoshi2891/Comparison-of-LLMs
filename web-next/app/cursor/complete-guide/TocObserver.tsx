"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Client-side component that monitors scroll position and updates active class for TOC links.
 */
export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll(`section.${styles.chapter}`);
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));

    // Set first link as active initially
    if (links.length > 0) {
      links[0].classList.add(styles.tocLinkActive);
      links[0].setAttribute("aria-current", "location");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const link = links.find((l) => l.getAttribute("href") === `#${id}`);
          if (!link) continue;

          if (entry.isIntersecting) {
            for (const l of links) {
              l.classList.remove(styles.tocLinkActive);
              l.removeAttribute("aria-current");
            }
            link.classList.add(styles.tocLinkActive);
            link.setAttribute("aria-current", "location");
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
