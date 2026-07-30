"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // Nav link click closes mobile sidebar
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      const navLinks = sidebar.querySelectorAll(`.${styles.navLink}`);
      const handleLinkClick = () => {
        window.dispatchEvent(new CustomEvent("close-codex-sidebar"));
      };
      navLinks.forEach((link) => {
        link.addEventListener("click", handleLinkClick);
      });

      return () => {
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
