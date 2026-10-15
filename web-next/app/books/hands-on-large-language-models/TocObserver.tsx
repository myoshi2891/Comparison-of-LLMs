"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile sidebar toggle
    const toggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggle = () => {
      sidebar?.classList.toggle(styles.open);
      const isOpen = sidebar?.classList.contains(styles.open) ?? false;
      toggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    const handleLinkClick = () => {
      sidebar?.classList.remove(styles.open);
      toggle?.setAttribute("aria-expanded", "false");
    };

    toggle?.addEventListener("click", handleToggle);
    const navLinks = sidebar
      ? Array.from(sidebar.querySelectorAll<HTMLAnchorElement>(".nav-link"))
      : [];
    for (const a of navLinks) {
      a.addEventListener("click", handleLinkClick);
    }

    // 2. Checklist counter
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".checklist-card, [data-testid='checklist-card']")
    );
    const cleanups: Array<() => void> = [];

    for (const card of cards) {
      const boxes = Array.from(card.querySelectorAll<HTMLInputElement>("input[type='checkbox']"));
      const progress = card.querySelector<HTMLElement>(".checklist-progress");

      const updateProgress = () => {
        let checked = 0;
        for (const b of boxes) {
          if (b.checked) checked++;
        }
        if (progress) {
          progress.textContent = `${checked} / ${boxes.length} 完了`;
        }
      };

      for (const b of boxes) {
        b.addEventListener("change", updateProgress);
        cleanups.push(() => b.removeEventListener("change", updateProgress));
      }
      updateProgress();
    }

    // 3. Scroll-spy with IntersectionObserver
    const map = new Map<Element, HTMLAnchorElement>();
    for (const a of navLinks) {
      const href = a.getAttribute("href");
      if (href?.startsWith("#")) {
        const id = decodeURIComponent(href.slice(1));
        const el = document.getElementById(id);
        if (el) map.set(el, a);
      }
    }

    const targets = Array.from(map.keys());
    let bandObserver: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== "undefined") {
      bandObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const link = map.get(entry.target);
            if (!link) continue;
            if (entry.isIntersecting) {
              for (const l of navLinks) {
                l.classList.remove(styles.active);
              }
              link.classList.add(styles.active);
            }
          }
        },
        { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );

      for (const t of targets) {
        bandObserver.observe(t);
      }
    }

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      for (const a of navLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
      for (const cleanup of cleanups) {
        cleanup();
      }
      if (bandObserver) {
        bandObserver.disconnect();
      }
    };
  }, []);

  return null;
}
