"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("[data-toc-link]");
    const intersecting = new Set<Element>();
    navLinks[0]?.classList.add(styles.navLinkActive);

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

        navLinks.forEach((link) => {
          link.classList.toggle(
            styles.navLinkActive,
            link.getAttribute("href") === `#${uppermost.id}`
          );
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
