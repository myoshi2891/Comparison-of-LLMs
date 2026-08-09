"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export function TocObserver() {
  useEffect(() => {
    // 1. Sidebar toggle logic
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggle = () => {
      if (!sidebar || !toggleBtn) return;
      const isOpen = sidebar.classList.contains(styles.open);
      if (isOpen) {
        sidebar.classList.remove(styles.open);
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "目次を開く");
      } else {
        sidebar.classList.add(styles.open);
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.setAttribute("aria-label", "目次を閉じる");
      }
    };

    toggleBtn?.addEventListener("click", handleToggle);

    // 2. IntersectionObserver for TOC highlight
    const headings = Array.from(document.querySelectorAll("h2[id], h3[id]"));
    const navLinks = Array.from(document.querySelectorAll(`.${styles.navLink}`));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            for (const link of navLinks) {
              const href = link.getAttribute("href") ?? "";
              if (href === `#${id}`) {
                link.classList.add(styles.active);
              } else {
                link.classList.remove(styles.active);
              }
            }
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const h of headings) {
      observer.observe(h);
    }

    return () => {
      toggleBtn?.removeEventListener("click", handleToggle);
      observer.disconnect();
    };
  }, []);

  return null;
}
