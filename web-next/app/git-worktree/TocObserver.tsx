"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById("gitWorktreeSidebar");
    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add(styles.sidebarOpen);
      } else {
        sidebar.classList.remove(styles.sidebarOpen);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`.${styles.sidebarNav} a`)
    );
    if (!navLinks.length) return;

    const map = new Map<HTMLElement, HTMLAnchorElement>();
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (href?.startsWith("#")) {
        const id = decodeURIComponent(href.slice(1));
        const el = document.getElementById(id);
        if (el) map.set(el, a);
      }
    });

    const targets = Array.from(map.keys());
    if (!targets.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => {
              a.classList.remove(styles.active);
            });
            const link = map.get(entry.target as HTMLElement);
            if (link) link.classList.add(styles.active);
          }
        });
      },
      { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    targets.forEach((t) => {
      spy.observe(t);
    });

    return () => spy.disconnect();
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <button
      type="button"
      className={styles.menuToggle}
      id="menuToggle"
      aria-label="メニュー"
      aria-controls="gitWorktreeSidebar"
      aria-expanded={isOpen}
      onClick={toggleMenu}
    >
      ☰
    </button>
  );
}
