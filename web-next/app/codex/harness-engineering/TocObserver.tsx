"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    // Mobile sidebar toggle
    const toggleBtn = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove(styles.sidebarOpen);
      if (overlay) overlay.classList.remove(styles.overlayOpen);
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "メニューを開く");
      }
    }

    function openSidebar() {
      if (sidebar) sidebar.classList.add(styles.sidebarOpen);
      if (overlay) overlay.classList.add(styles.overlayOpen);
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.setAttribute("aria-label", "メニューを閉じる");
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        if (sidebar?.classList.contains(styles.sidebarOpen)) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    // Scroll spy logic - 100% robust & smooth update on scroll
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("#sidebar nav a")
    );

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("h2[id]")
    );

    if (navLinks.length === 0 || headings.length === 0) return;

    function updateActiveLink() {
      const scrollPos = window.scrollY || window.pageYOffset;
      const offset = 180; // Offset considering header + margin

      let currentActiveId = headings[0]?.id || "";

      if (scrollPos > 0) {
        for (let i = 0; i < headings.length; i++) {
          const h = headings[i];
          const top = h.getBoundingClientRect().top + scrollPos;
          if (scrollPos >= top - offset) {
            currentActiveId = h.id;
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

    // Listen to scroll & resize
    function onScroll() {
      updateActiveLink();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial update
    updateActiveLink();

    // Close mobile sidebar on link click
    navLinks.forEach((a) => {
      a.addEventListener("click", closeSidebar);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
