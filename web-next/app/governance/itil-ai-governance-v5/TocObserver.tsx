"use client";

import { useEffect } from "react";

/**
 * Observes document sections for active TOC tracking.
 */
export default function TocObserver() {
  useEffect(() => {
    const navLinks = Array.from(
      document.querySelectorAll("nav[data-testid='toc'] a")
    ) as HTMLAnchorElement[];
    const sections = navLinks
      .map((a) => {
        const href = a.getAttribute("href");
        if (!href?.startsWith("#")) return null;
        return document.getElementById(decodeURIComponent(href.slice(1)));
      })
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div data-testid="toc-observer" style={{ display: "none" }} aria-hidden="true" />;
}
