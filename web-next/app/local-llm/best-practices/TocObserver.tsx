"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    if (links.length > 0) {
      links[0].classList.add(styles.tocLinkActive);
      links[0].setAttribute("aria-current", "location");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            for (const l of links) {
              if (l.getAttribute("href") === `#${id}`) {
                l.classList.add(styles.tocLinkActive);
                l.setAttribute("aria-current", "location");
              } else {
                l.classList.remove(styles.tocLinkActive);
                l.removeAttribute("aria-current");
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
