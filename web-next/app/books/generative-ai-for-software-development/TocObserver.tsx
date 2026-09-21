"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

const MOBILE_BREAKPOINT = 980;

/**
 * Observes document sections for active TOC tracking, mobile menu toggling, and checklist interactivity.
 */
export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile menu toggle
    const sidebar = document.getElementById("sidebar");
    const scrim = document.getElementById("scrim");
    const menuToggle = document.getElementById("menuToggle");

    const syncSidebarInert = () => {
      if (!sidebar) return;
      const hidden =
        window.innerWidth <= MOBILE_BREAKPOINT && !sidebar.classList.contains(styles.open);
      if (hidden && menuToggle && sidebar.contains(document.activeElement)) {
        menuToggle.focus();
      }
      sidebar.inert = hidden;
    };

    const openMenu = () => {
      sidebar?.classList.add(styles.open);
      scrim?.classList.add(styles.show);
      menuToggle?.setAttribute("aria-expanded", "true");
      syncSidebarInert();
      sidebar?.querySelector<HTMLAnchorElement>(`.${styles.navA}`)?.focus();
    };

    const closeMenu = () => {
      const hadFocus = !!sidebar?.contains(document.activeElement);
      sidebar?.classList.remove(styles.open);
      scrim?.classList.remove(styles.show);
      menuToggle?.setAttribute("aria-expanded", "false");
      syncSidebarInert();
      if (hadFocus && window.innerWidth <= MOBILE_BREAKPOINT) menuToggle?.focus();
    };

    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && sidebar?.classList.contains(styles.open)) {
        closeMenu();
      } else {
        syncSidebarInert();
      }
    };

    syncSidebarInert();
    window.addEventListener("resize", handleResize);

    const handleToggle = () => {
      if (sidebar?.classList.contains(styles.open)) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    menuToggle?.addEventListener("click", handleToggle);
    scrim?.addEventListener("click", closeMenu);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`.${styles.sidebar} .${styles.navA}`)
    );

    const handleLinkClick = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
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
      document.removeEventListener("keydown", handleKeyDown);
      for (const a of navLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      for (const c of checkItems) {
        c.removeEventListener("change", handleCheckboxChange);
      }
    };
  }, []);

  return null;
}
