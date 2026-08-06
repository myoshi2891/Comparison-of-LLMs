"use client";

import { useEffect } from "react";

export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggle = () => {
      sidebar?.classList.toggle("open");
    };

    menuToggle?.addEventListener("click", handleToggle);

    const tocLinks = document.querySelectorAll("nav a[href^='#']");
    const handleTocClick = () => {
      sidebar?.classList.remove("open");
    };

    for (const a of Array.from(tocLinks)) {
      a.addEventListener("click", handleTocClick);
    }

    // 2. IntersectionObserver for TOC highlight
    const sections = document.querySelectorAll("main section[id]");
    const setActive = (id: string) => {
      for (const a of Array.from(tocLinks)) {
        const href = a.getAttribute("href");
        if (href === `#${id}`) {
          a.classList.add("toc-active");
        } else {
          a.classList.remove("toc-active");
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const section of Array.from(sections)) {
      observer.observe(section);
    }

    return () => {
      menuToggle?.removeEventListener("click", handleToggle);
      for (const a of Array.from(tocLinks)) {
        a.removeEventListener("click", handleTocClick);
      }
      observer.disconnect();
    };
  }, []);

  return null;
}
