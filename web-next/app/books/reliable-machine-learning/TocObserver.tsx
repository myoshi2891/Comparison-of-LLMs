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
    const cardSelector = [styles.checklistCard ? `.${styles.checklistCard}` : "", ".checklist-card"]
      .filter(Boolean)
      .join(", ");
    const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSelector));
    const cleanups: Array<() => void> = [];

    const boxSelector = [
      styles.checklistCheckbox ? `.${styles.checklistCheckbox}` : "",
      ".checklist-checkbox",
      "input[type='checkbox']",
    ]
      .filter(Boolean)
      .join(", ");

    const doneSelector = [styles.checklistDone ? `.${styles.checklistDone}` : "", ".checklist-done"]
      .filter(Boolean)
      .join(", ");

    for (const card of cards) {
      const boxes = Array.from(card.querySelectorAll<HTMLInputElement>(boxSelector));
      const doneEl = card.querySelector<HTMLElement>(doneSelector);

      const updateProgress = () => {
        let count = 0;
        for (const b of boxes) {
          const item = b.closest("li");
          if (b.checked) {
            count++;
            if (styles.done) item?.classList.add(styles.done);
            item?.classList.add("done");
          } else {
            if (styles.done) item?.classList.remove(styles.done);
            item?.classList.remove("done");
          }
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
        const fragment = href.slice(1);
        let id = fragment;
        try {
          id = decodeURIComponent(fragment);
        } catch (err) {
          // 不正なパーセントエスケープは生のフラグメントで照合する
          if (!(err instanceof URIError)) throw err;
        }
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
