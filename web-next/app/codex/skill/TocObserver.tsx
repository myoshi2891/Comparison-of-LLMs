"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

const TOC_IDS = [
  "sec-1",
  "sec-2",
  "sec-3",
  "sec-4",
  "sec-5",
  "sec-6",
  "sec-7",
  "sec-8",
  "sec-9",
  "sec-10",
  "sec-11",
  "sec-12",
  "sec-13",
  "sec-14",
  "sec-15",
] as const;

export default function TocObserver() {
  useEffect(() => {
    const sections = TOC_IDS.map((id) => document.getElementById(id)).filter(
      Boolean
    ) as HTMLElement[];
    const tocLinks = Array.from(document.querySelectorAll(`.${styles.toc} a`));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            for (const link of tocLinks) {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add(styles.active);
              } else {
                link.classList.remove(styles.active);
              }
            }
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    // Hamburger button toggle
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    const toggleSidebar = () => {
      const isOpen = sidebar?.classList.toggle(styles.sidebarOpen);
      backdrop?.classList.toggle(styles.sidebarOpen, isOpen);
      hamburgerBtn?.setAttribute("aria-expanded", String(isOpen));
      hamburgerBtn?.setAttribute("aria-label", isOpen ? "目次を閉じる" : "目次を開く");
    };

    const closeSidebar = () => {
      sidebar?.classList.remove(styles.sidebarOpen);
      backdrop?.classList.remove(styles.sidebarOpen);
      hamburgerBtn?.setAttribute("aria-expanded", "false");
      hamburgerBtn?.setAttribute("aria-label", "目次を開く");
    };

    hamburgerBtn?.addEventListener("click", toggleSidebar);
    backdrop?.addEventListener("click", closeSidebar);

    for (const link of tocLinks) {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          closeSidebar();
        }
      });
    }

    return () => {
      observer.disconnect();
      hamburgerBtn?.removeEventListener("click", toggleSidebar);
      backdrop?.removeEventListener("click", closeSidebar);
    };
  }, []);

  return null;
}
