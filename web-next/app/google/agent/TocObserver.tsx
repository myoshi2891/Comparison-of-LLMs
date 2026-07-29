"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("main section, main header");
    const navLinks = document.querySelectorAll(`.${styles.toc} a`);
    if (!sections.length || !navLinks.length) return;

    const linkMap: Record<string, Element> = {};
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        linkMap[href.slice(1)] = a;
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove(styles.tocLinkActive));
            link.classList.add(styles.tocLinkActive);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      sections.forEach((s) => observer.unobserve(s));
      observer.disconnect();
    };
  }, []);

  return null;
}
