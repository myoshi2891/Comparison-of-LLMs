"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

const MOBILE_BREAKPOINT = 960;

/**
 * Observes document sections for active TOC tracking and handles mobile sidebar toggling.
 */
export default function TocObserver() {
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const navToggle = document.getElementById("navToggle");
    const scrim = document.getElementById("scrim");

    function syncSidebarInert() {
      if (!sidebar) return;
      const hidden =
        window.innerWidth <= MOBILE_BREAKPOINT && !sidebar.classList.contains(styles.open);
      if (hidden && navToggle && sidebar.contains(document.activeElement)) {
        navToggle.focus();
      }
      sidebar.inert = hidden;
    }

    function openSidebar() {
      if (!sidebar || !scrim || !navToggle) return;
      sidebar.classList.add(styles.open);
      scrim.classList.add(styles.show);
      navToggle.classList.add(styles.isHidden);
      navToggle.setAttribute("aria-expanded", "true");
      syncSidebarInert();
      sidebar.querySelector<HTMLAnchorElement>(`.${styles.navlist} a`)?.focus();
    }

    function closeSidebar() {
      if (!sidebar || !scrim || !navToggle) return;
      const hadFocus = sidebar.contains(document.activeElement);
      sidebar.classList.remove(styles.open);
      scrim.classList.remove(styles.show);
      navToggle.classList.remove(styles.isHidden);
      navToggle.setAttribute("aria-expanded", "false");
      syncSidebarInert();
      if (hadFocus) navToggle.focus();
    }

    syncSidebarInert();

    const handleToggle = () => {
      if (!sidebar) return;
      if (sidebar.classList.contains(styles.open)) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };

    navToggle?.addEventListener("click", handleToggle);
    scrim?.addEventListener("click", closeSidebar);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", handleKeyDown);

    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`.${styles.sidebar} .${styles.navlist} a`)
    );

    const handleLinkClick = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) closeSidebar();
    };

    for (const a of navLinks) {
      a.addEventListener("click", handleLinkClick);
    }

    // Scroll-position based active nav highlighting
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    let scrollTicking = false;

    function updateActiveNav() {
      const threshold = window.innerHeight * 0.25;
      let currentId = chapters.length ? chapters[0].id : null;
      for (const ch of chapters) {
        const rect = ch.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentId = ch.id;
        } else {
          break;
        }
      }
      for (const a of navLinks) {
        const match = a.getAttribute("href") === `#${currentId}`;
        a.classList.toggle(styles.active, match);
      }
      scrollTicking = false;
    }

    const onScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateActiveNav);
        scrollTicking = true;
      }
    };

    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeSidebar();
      syncSidebarInert();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    updateActiveNav();

    return () => {
      navToggle?.removeEventListener("click", handleToggle);
      scrim?.removeEventListener("click", closeSidebar);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      for (const a of navLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
    };
  }, []);

  return null;
}
