"use client";

import { useEffect } from "react";

interface TocObserverProps {
  activeClass?: string;
}

export default function TocObserver({ activeClass = "active" }: TocObserverProps) {
  useEffect(() => {
    // 1. Mobile menu toggle
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    const setSidebarState = (isOpen: boolean) => {
      if (sidebar) {
        sidebar.setAttribute("data-open", String(isOpen));
      }
      if (sidebarToggle) {
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
        sidebarToggle.setAttribute("aria-label", isOpen ? "目次を閉じる" : "目次を開く");
      }
    };

    const handleToggle = () => {
      const isOpen = sidebar?.getAttribute("data-open") === "true";
      setSidebarState(!isOpen);
    };

    sidebarToggle?.addEventListener("click", handleToggle);

    const tocLinks = document.querySelectorAll("nav a[href^='#']");
    const handleTocClick = () => {
      setSidebarState(false);
    };

    for (const a of Array.from(tocLinks)) {
      a.addEventListener("click", handleTocClick);
    }

    // 2. IntersectionObserver for TOC highlight
    const sections = document.querySelectorAll(
      "main section[id], main h2[id], main [id^='section-']"
    );
    const setActive = (id: string) => {
      for (const a of Array.from(tocLinks)) {
        const href = a.getAttribute("href");
        if (href === `#${id}`) {
          a.classList.add(activeClass);
        } else {
          a.classList.remove(activeClass);
        }
      }
    };

    const intersectingSections = new Map<Element, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingSections.set(entry.target, entry);
          } else {
            intersectingSections.delete(entry.target);
          }
        }
        const bestEntry = Array.from(intersectingSections.values()).reduce<
          IntersectionObserverEntry | undefined
        >(
          (topmost, entry) =>
            !topmost || entry.boundingClientRect.top < topmost.boundingClientRect.top
              ? entry
              : topmost,
          undefined
        );
        if (bestEntry?.target.id) {
          setActive(bestEntry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const section of Array.from(sections)) {
      observer.observe(section);
    }

    return () => {
      sidebarToggle?.removeEventListener("click", handleToggle);
      for (const a of Array.from(tocLinks)) {
        a.removeEventListener("click", handleTocClick);
      }
      observer.disconnect();
    };
  }, [activeClass]);

  return null;
}
