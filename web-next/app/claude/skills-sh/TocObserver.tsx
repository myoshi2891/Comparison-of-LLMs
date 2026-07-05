"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. スクロール連動ハイライト (IntersectionObserver)
    const chapterSections = document.querySelectorAll("section[id]");
    const skillCards = document.querySelectorAll(`.${styles.skillCard}[id]`);
    const tocLinks = document.querySelectorAll(`.${styles.tocLink}`);
    const tocSubLinks = document.querySelectorAll(`.${styles.tocSubLink}`);
    const observerTargets = [...Array.from(chapterSections), ...Array.from(skillCards)];

    function clearActive() {
      for (const l of Array.from(tocLinks)) {
        l.classList.remove(styles.tocLinkActive);
        l.removeAttribute("aria-current");
      }
      for (const l of Array.from(tocSubLinks)) {
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
        return;
      }
      const subLink = document.querySelector(`.${styles.tocSubLink}[href="#${id}"]`);
      if (subLink) {
        subLink.classList.add(styles.tocLinkActive);
        subLink.setAttribute("aria-current", "location");
        const parentSection = subLink.closest("section");
        if (parentSection) {
          const parentTocLink = document.querySelector(
            `.${styles.tocLink}[href="#${parentSection.id}"]`
          );
          if (parentTocLink) {
            parentTocLink.classList.add(styles.tocLinkActive);
          }
        }
      }
    }

    // 初期アクティブ状態: 最初の TOC リンクをデフォルトでアクティブにする
    const firstLink = tocLinks[0];
    if (firstLink) {
      firstLink.classList.add(styles.tocLinkActive);
      firstLink.setAttribute("aria-current", "location");
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

    for (const el of observerTargets) {
      io.observe(el);
    }

    // 2. スクロール進捗バー
    const progressFill = document.getElementById("progressFill");
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      if (progressFill) progressFill.style.width = `${pct}%`;
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // 3. モバイルサイドバー開閉
    const navToggle = document.getElementById("navToggle");
    const sidebar = document.getElementById("sidebar");

    // 初期状態の aria-expanded を設定
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }

    const handleToggleClick = () => {
      if (sidebar) {
        const isOpen = sidebar.classList.toggle(styles.sidebarOpen);
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      }
    };

    const handleLinkClick = () => {
      if (sidebar) {
        sidebar.classList.remove(styles.sidebarOpen);
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
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
      window.removeEventListener("scroll", updateProgress);
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
