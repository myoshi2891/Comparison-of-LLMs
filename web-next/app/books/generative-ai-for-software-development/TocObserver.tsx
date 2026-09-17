"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Observes document sections for active TOC tracking, mobile menu toggling, and checklist interactivity.
 */
export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile menu toggle
    const sidebar = document.getElementById("sidebar");
    const scrim = document.getElementById("scrim");
    const menuToggle = document.getElementById("menuToggle");

    const openMenu = () => {
      sidebar?.classList.add(styles.open);
      scrim?.classList.add(styles.show);
    };

    const closeMenu = () => {
      sidebar?.classList.remove(styles.open);
      scrim?.classList.remove(styles.show);
    };

    const handleToggle = () => {
      if (sidebar?.classList.contains(styles.open)) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    menuToggle?.addEventListener("click", handleToggle);
    scrim?.addEventListener("click", closeMenu);

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`.${styles.sidebar} .${styles.navA}`)
    );

    const handleLinkClick = () => {
      if (window.innerWidth <= 980) {
        closeMenu();
      }
    };

    for (const a of navLinks) {
      a.addEventListener("click", handleLinkClick);
    }

    // 2. Active TOC tracking
    const navTargets = navLinks
      .map((a) => {
        const href = a.getAttribute("href");
        return {
          link: a,
          el: href?.startsWith("#") ? document.querySelector(href) : null,
        };
      })
      .filter((t): t is { link: HTMLAnchorElement; el: Element } => t.el !== null);

    let ticking = false;
    const updateActiveNav = () => {
      ticking = false;
      const viewportMark = window.innerHeight * 0.25;
      let current = navTargets[0];
      for (const t of navTargets) {
        const rect = t.el.getBoundingClientRect();
        if (rect.top <= viewportMark) {
          current = t;
        }
      }
      for (const a of navLinks) {
        a.classList.remove(styles.active);
      }
      if (current) {
        current.link.classList.add(styles.active);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveNav);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    updateActiveNav();

    // 3. Checklist interaction
    const checkItems = Array.from(
      document.querySelectorAll<HTMLInputElement>(".check-item input[type='checkbox']")
    );
    const checkCounter = document.getElementById("checkCounter");

    const updateCounter = () => {
      if (!checkCounter) return;
      const total = checkItems.length;
      const done = checkItems.filter((c) => c.checked).length;
      checkCounter.textContent = `${done} / ${total} 完了`;
    };

    const handleCheckboxChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const parent = target.closest(".check-item");
      if (parent) {
        parent.classList.toggle(styles.done, target.checked);
        parent.classList.toggle("done", target.checked);
      }
      updateCounter();
    };

    for (const c of checkItems) {
      c.addEventListener("change", handleCheckboxChange);
      const parent = c.closest(".check-item");
      if (parent && c.checked) {
        parent.classList.add(styles.done);
        parent.classList.add("done");
      }
    }
    updateCounter();

    return () => {
      menuToggle?.removeEventListener("click", handleToggle);
      scrim?.removeEventListener("click", closeMenu);
      for (const a of navLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
      window.removeEventListener("scroll", onScroll);
      for (const c of checkItems) {
        c.removeEventListener("change", handleCheckboxChange);
      }
    };
  }, []);

  return null;
}
