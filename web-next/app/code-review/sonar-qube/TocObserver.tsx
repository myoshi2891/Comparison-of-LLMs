"use client";

import { useEffect } from "react";

export default function TocObserver() {
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("#sidebar nav a"));

    const syncToggleState = (isOpen: boolean) => {
      if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        toggleBtn.setAttribute("aria-label", isOpen ? "目次を閉じる" : "目次を開く");
      }
    };

    if (sidebar && toggleBtn) {
      const initialOpen = sidebar.dataset.open === "true";
      syncToggleState(initialOpen);
    }

    const handleToggleClick = () => {
      if (sidebar) {
        const isOpen = sidebar.dataset.open === "true";
        sidebar.dataset.open = isOpen ? "false" : "true";
        syncToggleState(!isOpen);
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("click", handleToggleClick);
    }

    const handleNavLinkClick = () => {
      if (sidebar && window.innerWidth <= 900) {
        sidebar.dataset.open = "false";
        syncToggleState(false);
      }
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    const headings = Array.from(document.querySelectorAll<HTMLElement>("main h2[id]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              navLinks.forEach((link) => {
                const href = link.getAttribute("href");
                if (href === `#${id}`) {
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
        rootMargin: "-15% 0px -75% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener("click", handleToggleClick);
      }
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavLinkClick);
      });
      headings.forEach((heading) => {
        observer.unobserve(heading);
      });
      observer.disconnect();
    };
  }, []);

  return null;
}
