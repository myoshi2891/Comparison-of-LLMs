"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. スクロール連動ハイライト (IntersectionObserver)
    const chapterSections = document.querySelectorAll("section[id]");
    const tocLinks = document.querySelectorAll(`.${styles.tocLink}`);

    function clearActive() {
      for (const l of Array.from(tocLinks)) {
        l.classList.remove(styles.tocLinkActive);
        l.removeAttribute("aria-current");
      }
    }

    function setActiveById(id: string) {
      clearActive();
      const link = document.querySelector(`.${styles.tocLink}[href="#${id}"]`);
      if (link) {
        link.classList.add(styles.tocLinkActive);
        link.setAttribute("aria-current", "location");
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.boundingClientRect.top < bestEntry.boundingClientRect.top) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          setActiveById(bestEntry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );

    for (const el of Array.from(chapterSections)) {
      io.observe(el);
    }

    // 2. モバイルサイドバー開閉
    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggleClick = () => {
      if (sidebar) sidebar.classList.toggle(styles.sidebarOpen);
    };

    const handleLinkClick = () => {
      if (sidebar) sidebar.classList.remove(styles.sidebarOpen);
    };

    if (navToggle) {
      navToggle.addEventListener("click", handleToggleClick);
    }

    let links: HTMLAnchorElement[] = [];
    if (sidebar) {
      links = Array.from(sidebar.querySelectorAll("a"));
      for (const a of links) {
        a.addEventListener("click", handleLinkClick);
      }
    }

    return () => {
      io.disconnect();
      if (navToggle) {
        navToggle.removeEventListener("click", handleToggleClick);
      }
      for (const a of links) {
        a.removeEventListener("click", handleLinkClick);
      }
    };
  }, []);

  return null;
}
