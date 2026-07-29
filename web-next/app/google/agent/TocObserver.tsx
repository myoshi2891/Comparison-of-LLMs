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
      if (href?.startsWith("#")) {
        linkMap[href.slice(1)] = a;
      }
    });
    const intersecting = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!linkMap[entry.target.id]) continue;
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }

        const [topmost] = [...intersecting].sort((a, b) => {
          if (a === b) return 0;
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        if (!topmost) return;

        navLinks.forEach((link) => {
          link.classList.toggle(styles.tocLinkActive, link === linkMap[topmost.id]);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((s) => {
      observer.observe(s);
    });

    return () => {
      sections.forEach((s) => {
        observer.unobserve(s);
      });
      observer.disconnect();
    };
  }, []);

  return null;
}
