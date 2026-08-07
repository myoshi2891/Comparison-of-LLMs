"use client";

import { useEffect } from "react";

/**
 * TocObserver attaches intersection observer listeners to section headings
 * and updates `data-active` attributes on corresponding table of contents links.
 * Also handles mobile sidebar toggle with `data-open` attribute.
 */
export default function TocObserver() {
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link, [data-id]"));

    // Mobile sidebar toggle handler
    const handleToggleClick = () => {
      if (sidebar) {
        const isOpen = sidebar.dataset.open === "true";
        sidebar.dataset.open = isOpen ? "false" : "true";
        if (toggleBtn) {
          toggleBtn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        }
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("click", handleToggleClick);
    }

    // Close sidebar when clicking nav links on mobile
    const handleNavLinkClick = () => {
      if (sidebar && window.innerWidth <= 900) {
        sidebar.dataset.open = "false";
        if (toggleBtn) {
          toggleBtn.setAttribute("aria-expanded", "false");
        }
      }
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    // IntersectionObserver for TOC highlight
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              navLinks.forEach((link) => {
                const href = link.getAttribute("href");
                if (href === `#${id}` || link.dataset.id === id) {
                  link.dataset.active = "true";
                } else {
                  link.dataset.active = "false";
                }
              });
            }
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleToggleClick);
      }
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavLinkClick);
      });
      headings.forEach((heading) => observer.unobserve(heading));
      observer.disconnect();
    };
  }, []);

  return null;
}
