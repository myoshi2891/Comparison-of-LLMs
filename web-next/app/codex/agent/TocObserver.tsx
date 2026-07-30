"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. Sidebar Toggle for Mobile
    const btn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    if (btn && sidebar) {
      const handleToggle = () => {
        sidebar.classList.toggle(styles.sidebarOpen);
      };
      btn.addEventListener("click", handleToggle);

      const navLinks = sidebar.querySelectorAll(`.${styles.navLink}`);
      const handleLinkClick = () => {
        sidebar.classList.remove(styles.sidebarOpen);
      };
      navLinks.forEach((link) => {
        link.addEventListener("click", handleLinkClick);
      });

      return () => {
        btn.removeEventListener("click", handleToggle);
        navLinks.forEach((link) => {
          link.removeEventListener("click", handleLinkClick);
        });
      };
    }
  }, []);

  useEffect(() => {
    // 2. IntersectionObserver for TOC scroll spy
    const headings = Array.from(document.querySelectorAll(`.${styles.main} h2[id]`));
    const links = Array.from(document.querySelectorAll(`.${styles.navLink}`));
    if (!headings.length || !links.length) return;

    const linkMap = new Map<string, Element>();
    links.forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("#")) {
        linkMap.set(decodeURIComponent(href.slice(1)), a);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((l) => {
              l.classList.remove(styles.navLinkActive);
            });
            const activeLink = linkMap.get(id);
            if (activeLink) {
              activeLink.classList.add(styles.navLinkActive);
            }
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => {
      observer.observe(h);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
