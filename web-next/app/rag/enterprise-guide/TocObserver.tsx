"use client";

import { useEffect } from "react";

export default function TocObserver() {
  useEffect(() => {
    const root = document.querySelector('[data-testid="layout-root"]');
    if (!root) return;

    // --- 1. Mobile Navigation Toggle ---
    // メニュー・背景幕・Top ボタンは layout-root の兄弟として描画されるため document から引く。
    const menuBtn = document.getElementById("menuBtn");
    const backdrop = document.getElementById("sidebarBackdrop");
    const body = document.body;

    function closeNav() {
      body.classList.remove("nav-open");
      menuBtn?.setAttribute("aria-expanded", "false");
    }

    function toggleNav() {
      const isOpen = body.classList.toggle("nav-open");
      menuBtn?.setAttribute("aria-expanded", String(isOpen));
    }

    menuBtn?.addEventListener("click", toggleNav);
    backdrop?.addEventListener("click", closeNav);

    const tocLinks = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("a.toc-link, [class*='tocLink']")
    );
    for (const a of tocLinks) {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 980) {
          closeNav();
        }
      });
    }

    // --- 2. Back to Top Button ---
    const topBtn = document.getElementById("topBtn");
    function handleScroll() {
      if (topBtn) {
        if (window.scrollY > 480) {
          topBtn.classList.add("is-visible");
        } else {
          topBtn.classList.remove("is-visible");
        }
      }
    }

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    topBtn?.addEventListener("click", scrollToTop);
    handleScroll();

    // --- 3. Scroll Spy / Active TOC Tracking ---
    const targets = tocLinks
      .map((a) => {
        const href = a.getAttribute("href");
        if (!href?.startsWith("#")) return null;
        const id = href.slice(1);
        const el = document.getElementById(id);
        return el ? { link: a, el } : null;
      })
      .filter((item): item is { link: HTMLAnchorElement; el: HTMLElement } => item !== null);

    function onScrollSpy() {
      const pos = window.scrollY + 120;
      let current = targets[0];
      for (const target of targets) {
        if (target.el.offsetTop <= pos) {
          current = target;
        }
      }
      for (const item of targets) {
        item.link.classList.remove("is-active");
      }
      if (current) {
        current.link.classList.add("is-active");
      }
    }

    window.addEventListener("scroll", onScrollSpy, { passive: true });
    onScrollSpy();

    return () => {
      menuBtn?.removeEventListener("click", toggleNav);
      backdrop?.removeEventListener("click", closeNav);
      window.removeEventListener("scroll", handleScroll);
      topBtn?.removeEventListener("click", scrollToTop);
      window.removeEventListener("scroll", onScrollSpy);
      body.classList.remove("nav-open");
    };
  }, []);

  return null;
}
