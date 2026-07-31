"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(`.${styles.sidebarNav} a`);
    if (!sections.length || !links.length) return;

    const linkMap = new Map<string, Element>();
    links.forEach((l) => {
      const href = l.getAttribute("href");
      if (href?.startsWith("#")) {
        linkMap.set(href.slice(1), l);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkMap.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove(styles.active));
            link.classList.add(styles.active);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return null;
}
