"use client";

import { useEffect } from "react";

export default function TocObserver() {
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebarToggle");
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("#sidebar nav a"));

    if (sidebar && toggleBtn) {
      const initialOpen = sidebar.dataset.open === "true";
      toggleBtn.setAttribute("aria-expanded", initialOpen ? "true" : "false");
    }

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
