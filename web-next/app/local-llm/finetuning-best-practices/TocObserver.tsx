"use client";

import { useEffect } from "react";

/**
 * Synchronizes the table of contents with the currently visible guide section.
 */
export default function TocObserver() {
  useEffect(() => {
    const root = document.querySelector(".fineTuningGuide");
    if (!root) return;
    const sections = root.querySelectorAll("main section, main header#intro");
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".nav-list a"));
    const byId = new Map(links.map((link) => [link.getAttribute("href")?.slice(1), link]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of links) link.classList.remove("active");
          byId.get(entry.target.id)?.classList.add("active");
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return null;
}
