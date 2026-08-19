"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile Sidebar toggle
    const toggle = document.querySelector(`.${styles.sidebarToggle}`) as HTMLElement | null;
    const sidebar = document.querySelector(`.${styles.sidebar}`) as HTMLElement | null;

    const syncToggleState = () => {
      if (!toggle || !sidebar) return;
      const open = sidebar.classList.contains(styles.open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    };

    const handleToggle = () => {
      if (!sidebar) return;
      sidebar.classList.toggle(styles.open);
      syncToggleState();
    };

    const handleLinkClick = () => {
      if (!sidebar) return;
      sidebar.classList.remove(styles.open);
      syncToggleState();
    };

    if (toggle && sidebar) {
      toggle.addEventListener("click", handleToggle);
      const links = document.querySelectorAll(`.${styles.sideNav} a`);
      for (const a of Array.from(links)) {
        a.addEventListener("click", handleLinkClick);
      }
    }

    // 2. Scroll Spy Intersection Observer
    const navLinks = Array.from(
      document.querySelectorAll(`.${styles.sideNav} a`)
    ) as HTMLAnchorElement[];

    if (navLinks.length > 0) {
      const idToLink: Record<string, HTMLAnchorElement> = {};
      const sections: HTMLElement[] = [];

      for (const a of navLinks) {
        const href = a.getAttribute("href");
        if (href?.startsWith("#")) {
          const id = decodeURIComponent(href.slice(1));
          idToLink[id] = a;
          const el = document.getElementById(id);
          if (el) sections.push(el);
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const link = idToLink[entry.target.id];
            if (!link) continue;
            if (entry.isIntersecting) {
              for (const a of navLinks) {
                a.classList.remove(styles.active);
              }
              link.classList.add(styles.active);
            }
          }
        },
        { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );

      for (const s of sections) {
        observer.observe(s);
      }

      return () => {
        if (toggle) toggle.removeEventListener("click", handleToggle);
        const links = document.querySelectorAll(`.${styles.sideNav} a`);
        for (const a of Array.from(links)) {
          a.removeEventListener("click", handleLinkClick);
        }
        observer.disconnect();
      };
    }
  }, []);

  return null;
}
