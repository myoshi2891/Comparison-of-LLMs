"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  backToTopClass?: string;
  backToTopVisibleClass?: string;
}

export default function TocObserver({ backToTopClass, backToTopVisibleClass }: Props) {
  const [backVisible, setBackVisible] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar") as HTMLElement | null;
    sidebarRef.current = sidebar;

    const handleToggle = () => {
      if (sidebar) {
        sidebar.dataset.open = sidebar.dataset.open === "true" ? "false" : "true";
      }
    };

    menuToggle?.addEventListener("click", handleToggle);

    const tocLinks = document.querySelectorAll("nav a[href^='#']");
    const handleTocClick = () => {
      if (sidebar) sidebar.dataset.open = "false";
    };

    for (const a of Array.from(tocLinks)) {
      a.addEventListener("click", handleTocClick);
    }

    // 2. IntersectionObserver for TOC highlight
    const sections = document.querySelectorAll("main section[id]");
    const setActive = (id: string) => {
      for (const a of Array.from(tocLinks)) {
        const href = a.getAttribute("href");
        (a as HTMLElement).dataset.active = href === `#${id}` ? "true" : "false";
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

    // 3. Back to top scroll visibility
    const handleScroll = () => {
      setBackVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      menuToggle?.removeEventListener("click", handleToggle);
      for (const a of Array.from(tocLinks)) {
        a.removeEventListener("click", handleTocClick);
      }
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      id="backToTop"
      type="button"
      aria-label="ページトップへ戻る"
      className={`${backToTopClass ?? ""} ${backVisible ? (backToTopVisibleClass ?? "") : ""}`.trim()}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
