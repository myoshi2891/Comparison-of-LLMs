"use client";

import { useEffect } from "react";

export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("[data-toc-link]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          if (!id) return;

          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
