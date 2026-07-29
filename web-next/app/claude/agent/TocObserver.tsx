"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const sectionIds = [
      "overview",
      "claude-md",
      "subagents",
      "agent-teams",
      "writing-principles",
      "decision-flow",
      "checklist",
      "summary",
      "sources",
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(`.${styles.fileTree} a`));

    if (links.length > 0) {
      links[0].classList.add(styles.active);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            for (const link of links) {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add(styles.active);
              } else {
                link.classList.remove(styles.active);
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
