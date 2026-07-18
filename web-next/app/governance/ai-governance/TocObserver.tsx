"use client";

import { useEffect } from "react";

/**
 * Tracks visible guide sections and updates the corresponding table-of-contents link.
 */
export default function TocObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const root = document.querySelector(".aiGovernanceGuide");
    if (!root) return;

    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("aside nav a[href^='#']"));
    const sections = links
      .map((link) => root.querySelector(link.getAttribute("href") ?? ""))
      .filter((section): section is Element => section !== null);
    const linksById = new Map(
      links.map((link) => [link.getAttribute("href")?.slice(1), link] as const)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of links) link.classList.remove("active");
          linksById.get(entry.target.id)?.classList.add("active");
        }
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return null;
}
