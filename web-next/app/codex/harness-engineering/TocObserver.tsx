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

    // Scroll spy for TOC - exact match with original HTML
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("#sidebar nav a"));
    const headingIdToLink = new Map<string, HTMLAnchorElement>();

    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        headingIdToLink.set(href.slice(1), a);
      }
      a.addEventListener("click", closeSidebar);
    });

    const headings = Array.from(document.querySelectorAll<HTMLElement>("article h2"));

    if (headings.length && "IntersectionObserver" in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const link = headingIdToLink.get(entry.target.id);
              if (link) {
                navLinks.forEach((l) => {
                  l.classList.remove(styles.active);
                });
                link.classList.add(styles.active);
              }
            }
          });
        },
        { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );

      headings.forEach((h) => {
        spy.observe(h);
      });

      return () => {
        spy.disconnect();
      };
    }
  }, []);

  return null;
}
