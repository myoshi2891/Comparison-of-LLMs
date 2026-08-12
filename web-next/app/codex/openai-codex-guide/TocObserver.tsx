"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Initializes mobile table-of-contents controls and highlights the section corresponding to the current scroll position.
 */
export default function TocObserver() {
  useEffect(() => {
    // Mobile sidebar toggle logic
    const toggleBtn = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
      const wasOpen = sidebar?.classList.contains(styles.sidebarOpen) ?? false;
      if (sidebar) sidebar.classList.remove(styles.sidebarOpen);
      if (overlay) overlay.classList.remove(styles.overlayOpen);
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "目次を開く");
        if (wasOpen) toggleBtn.focus();
      }
    }

    /**
     * Opens the table-of-contents sidebar and updates its accessibility state.
     */
    function openSidebar() {
      if (sidebar) sidebar.classList.add(styles.sidebarOpen);
      if (overlay) overlay.classList.add(styles.overlayOpen);
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.setAttribute("aria-label", "目次を閉じる");
      }
    }

    function handleToggle() {
      if (sidebar?.classList.contains(styles.sidebarOpen)) {
        closeSidebar();
      } else {
        openSidebar();
      }
    }

    toggleBtn?.addEventListener("click", handleToggle);
    overlay?.addEventListener("click", closeSidebar);

    function removeDrawerListeners() {
      toggleBtn?.removeEventListener("click", handleToggle);
      overlay?.removeEventListener("click", closeSidebar);
    }

    // Scroll spy logic for section highlighting
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("#sidebar nav a"));

    const sections = navLinks
      .map((link) => {
        const href = link.getAttribute("href");
        return href ? document.querySelector<HTMLElement>(href) : null;
      })
      .filter((section): section is HTMLElement => section !== null);

    if (navLinks.length === 0 || sections.length === 0) {
      return removeDrawerListeners;
    }

    /**
     * Updates the table-of-contents link that corresponds to the section nearest the current scroll position.
     */
    function updateActiveLink() {
      const scrollPos = window.scrollY || window.pageYOffset;
      const offset = 180; // Header height + extra margin

      let currentActiveId = sections[0]?.id || "";

      if (scrollPos > 0) {
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const top = section.getBoundingClientRect().top + scrollPos;
          if (scrollPos >= top - offset) {
            currentActiveId = section.id;
          } else {
            break;
          }
        }
      }

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const targetId = href ? href.replace("#", "") : "";

        if (targetId === currentActiveId) {
          link.classList.add(styles.active);
          link.classList.add("active");
        } else {
          link.classList.remove(styles.active);
          link.classList.remove("active");
        }
      });
    }

    function onScroll() {
      updateActiveLink();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    updateActiveLink();

    navLinks.forEach((a) => {
      a.addEventListener("click", closeSidebar);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      removeDrawerListeners();
      navLinks.forEach((a) => {
        a.removeEventListener("click", closeSidebar);
      });
    };
  }, []);

  return null;
}
