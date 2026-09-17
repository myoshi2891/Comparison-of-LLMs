"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

const MOBILE_BREAKPOINT = 860;

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
      sidebar.inert = hidden;
    }

    function openSidebar() {
      if (!sidebar || !scrim || !navToggle) return;
      sidebar.classList.add(styles.open);
      scrim.classList.add(styles.show);
      navToggle.classList.add(styles.isHidden);
      navToggle.setAttribute("aria-expanded", "true");
      syncSidebarInert();
      sidebar.querySelector<HTMLAnchorElement>("nav[data-testid='toc'] a")?.focus();
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
      document.querySelectorAll("nav[data-testid='toc'] a")
    ) as HTMLAnchorElement[];

    const handleLinkClick = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) closeSidebar();
    };

    for (const a of navLinks) {
      a.addEventListener("click", handleLinkClick);
    }

    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeSidebar();
      syncSidebarInert();
    };
    window.addEventListener("resize", handleResize);

    const sections = navLinks
      .map((a) => {
        const href = a.getAttribute("href");
        if (!href?.startsWith("#")) return null;
        return document.getElementById(decodeURIComponent(href.slice(1)));
      })
      .filter((el): el is HTMLElement => el !== null);

    let observer: IntersectionObserver | null = null;
    if (sections.length > 0 && navLinks.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id;
            const link = navLinks.find((a) => {
              const href = a.getAttribute("href");
              return href === `#${id}` || href === `#${encodeURIComponent(id)}`;
            });
            if (!link) continue;
            if (entry.isIntersecting) {
              for (const a of navLinks) {
                a.classList.remove("active");
              }
              link.classList.add("active");
            }
          }
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );

      for (const sec of sections) {
        observer.observe(sec);
      }
    }

    return () => {
      navToggle?.removeEventListener("click", handleToggle);
      scrim?.removeEventListener("click", closeSidebar);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      for (const a of navLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
      observer?.disconnect();
    };
  }, []);

  return <div data-testid="toc-observer" style={{ display: "none" }} aria-hidden="true" />;
}
