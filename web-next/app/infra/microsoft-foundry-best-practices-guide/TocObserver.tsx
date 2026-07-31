"use client";

import { useEffect } from "react";

interface TocObserverProps {
  navSelector?: string;
  sectionSelector?: string;
  activeClass: string;
}

/**
 * Synchronizes navigation link highlighting with the sections currently in view.
 *
 * @param navSelector - CSS selector for the navigation links
 * @param sectionSelector - CSS selector for the observed sections
 * @param activeClass - CSS class applied to the link for the visible section
 * @returns `null`
 */
export function TocObserver({
  navSelector = "#side-nav a",
  sectionSelector = "section[id]",
  activeClass,
}: TocObserverProps) {
  useEffect(() => {
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(navSelector));
    const sections = Array.from(document.querySelectorAll<HTMLElement>(sectionSelector));

    if (navLinks.length === 0 || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (!id) continue;
            for (const link of navLinks) {
              const href = link.getAttribute("href");
              if (href === `#${id}`) {
                link.classList.add(activeClass);
              } else {
                link.classList.remove(activeClass);
              }
            }
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, [navSelector, sectionSelector, activeClass]);

  return null;
}
