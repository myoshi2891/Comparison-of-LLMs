"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. TOC交差監視
    const sections = document.querySelectorAll("section.chapter");
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    if (links.length > 0) links[0].classList.add(styles.tocLinkActive);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            for (const l of links) {
              if (l.getAttribute("href") === `#${id}`) {
                l.classList.add(styles.tocLinkActive);
              } else {
                l.classList.remove(styles.tocLinkActive);
              }
            }
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) observer.observe(sec);

    // 2. モバイルサイドバートグル
    const toggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggle = () => {
      sidebar?.classList.toggle(styles.sidebarOpen);
    };

    const handleLinkClick = () => {
      sidebar?.classList.remove(styles.sidebarOpen);
    };

    if (toggle && sidebar) {
      toggle.addEventListener("click", handleToggle);
      links.forEach((l) => {
        l.addEventListener("click", handleLinkClick);
      });
    }

    return () => {
      observer.disconnect();
      if (toggle) {
        toggle.removeEventListener("click", handleToggle);
      }
      links.forEach((l) => {
        l.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);
  return null;
}
