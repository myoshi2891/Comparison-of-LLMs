"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const links = Array.from(document.querySelectorAll(`.${styles.navLink}`));
    const sidebar = document.querySelector(`.${styles.sidebar}`);
    const sections = links
      .map((l) => {
        const href = l.getAttribute("href");
        return href ? document.querySelector(href) : null;
      })
      .filter((el): el is Element => el !== null);

    if (sidebar) {
      if (mobileOpen) {
        sidebar.classList.add(styles.mobileOpen);
      } else {
        sidebar.classList.remove(styles.mobileOpen);
      }
    }

    const handleLinkClick = () => setMobileOpen(false);
    for (const l of links) {
      l.addEventListener("click", handleLinkClick);
    }

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            for (const l of links) {
              if (l.getAttribute("href") === id) {
                l.classList.add(styles.active);
              } else {
                l.classList.remove(styles.active);
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

    return () => {
      observer.disconnect();
      for (const l of links) {
        l.removeEventListener("click", handleLinkClick);
      }
    };
  }, [mobileOpen]);

  return (
    <button
      type="button"
      className={styles.sidebarToggle}
      aria-label="目次を開閉"
      onClick={() => setMobileOpen((prev) => !prev)}
    >
      📋
    </button>
  );
}
