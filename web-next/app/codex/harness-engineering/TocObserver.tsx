"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // Mobile sidebar toggle
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggle = () => {
      if (sidebar) {
        const isHidden = getComputedStyle(sidebar).display === "none";
        sidebar.style.display = isHidden ? "block" : "none";
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("click", handleToggle);
    }

    // TOC Intersection Observer
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const tocLinks = Array.from(document.querySelectorAll(`.${styles.tocLink}`));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            tocLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add(styles.tocLinkActive);
              } else {
                link.classList.remove(styles.tocLinkActive);
              }
            });
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleToggle);
      }
      observer.disconnect();
    };
  }, []);

  return null;
}
