"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile sidebar toggle
    const toggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    const handleToggle = () => {
      sidebar?.classList.toggle(styles.open);
      const isOpen = sidebar?.classList.contains(styles.open) ?? false;
      toggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    const handleClose = () => {
      sidebar?.classList.remove(styles.open);
      toggle?.setAttribute("aria-expanded", "false");
    };

    toggle?.setAttribute("aria-expanded", "false");
    toggle?.addEventListener("click", handleToggle);
    overlay?.addEventListener("click", handleClose);

    const navLinks = sidebar
      ? Array.from(sidebar.querySelectorAll<HTMLAnchorElement>("a[href^='#']"))
      : [];
    for (const a of navLinks) {
      a.addEventListener("click", handleClose);
    }

    // 2. Checklist counter
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".checklist-card"));
    const cleanups: Array<() => void> = [];

    for (const card of cards) {
      const boxes = Array.from(card.querySelectorAll<HTMLInputElement>("input[type='checkbox']"));
      const doneEl = card.querySelector<HTMLElement>(".checklist-done");

      const updateProgress = () => {
        let count = 0;
        for (const b of boxes) {
          if (b.checked) count++;
        }
        if (doneEl) {
          doneEl.textContent = String(count);
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
    let observer: IntersectionObserver | null = null;

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const link = map.get(entry.target);
            if (!link) continue;
            if (entry.isIntersecting) {
              for (const l of navLinks) {
                l.classList.remove(styles.active);
                l.removeAttribute("aria-current");
              }
              link.classList.add(styles.active);
              link.setAttribute("aria-current", "location");
            }
          }
        },
        { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );

      for (const t of targets) {
        observer.observe(t);
      }
    }

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      overlay?.removeEventListener("click", handleClose);
      for (const a of navLinks) {
        a.removeEventListener("click", handleClose);
      }
      for (const cleanup of cleanups) {
        cleanup();
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
}
