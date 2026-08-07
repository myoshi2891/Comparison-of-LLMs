"use client";

import { useEffect } from "react";

interface TocObserverProps {
  backToTopClass?: string;
  backToTopVisibleClass?: string;
}

export default function TocObserver({
  backToTopClass,
  backToTopVisibleClass,
}: TocObserverProps = {}) {
  useEffect(() => {
    // 1. Mobile menu toggle
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    const handleToggle = () => {
      const isOpen = sidebar?.dataset.open === "true";
      const nextState = !isOpen;
      if (sidebar) {
        sidebar.dataset.open = String(nextState);
      }
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", String(nextState));
      }
    };

    menuToggle?.addEventListener("click", handleToggle);

    const tocLinks = document.querySelectorAll("nav a[href^='#']");
    const handleTocClick = () => {
      if (sidebar) {
        sidebar.dataset.open = "false";
      }
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }
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

    // 3. Back to top button visibility scroll handling & click behavior
    const backToTopBtn =
      document.getElementById("backToTop") ||
      (backToTopClass ? document.querySelector(`.${backToTopClass}`) : null);
    const handleScroll = () => {
      if (!backToTopBtn || !backToTopVisibleClass) return;
      if (window.scrollY > 300) {
        backToTopBtn.classList.add(backToTopVisibleClass);
      } else {
        backToTopBtn.classList.remove(backToTopVisibleClass);
      }
    };
    const handleBackToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", handleBackToTop);
      if (backToTopVisibleClass) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
      }
    }

    return () => {
      menuToggle?.removeEventListener("click", handleToggle);
      for (const a of Array.from(tocLinks)) {
        a.removeEventListener("click", handleTocClick);
      }
      if (backToTopBtn) {
        backToTopBtn.removeEventListener("click", handleBackToTop);
        if (backToTopVisibleClass) {
          window.removeEventListener("scroll", handleScroll);
        }
      }
      observer.disconnect();
    };
  }, [backToTopClass, backToTopVisibleClass]);

  return null;
}
