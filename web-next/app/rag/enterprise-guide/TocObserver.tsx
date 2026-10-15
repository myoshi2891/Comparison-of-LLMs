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
    function handleTocLinkClick() {
      if (window.innerWidth <= 980) {
        closeNav();
      }
    }
    for (const a of tocLinks) {
      a.addEventListener("click", handleTocLinkClick);
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

    // 従来の判定オフセット。scroll-margin-top がこれより小さい（未指定は 0px）場合の下限。
    const MIN_OFFSET = 120;
    // 実ブラウザのスクロール位置は小数になりうるため、境界に 1px の許容を持たせる。
    const ROUNDING_TOLERANCE = 1;

    // TOC クリックで見出しが止まる位置（scroll-margin-top）まで判定線を下げる。
    // 固定値だとそれより大きい margin のセクションへ移動しても直前の項目が点灯したままになる。
    function activationOffset(el: HTMLElement): number {
      const margin = Number.parseFloat(window.getComputedStyle(el).scrollMarginTop);
      return Number.isFinite(margin) ? Math.max(MIN_OFFSET, margin) : MIN_OFFSET;
    }

    function onScrollSpy() {
      let current = targets[0];
      for (const target of targets) {
        // offsetTop は offsetParent 基準のため、文書座標に換算して比較する。
        const documentTop = target.el.getBoundingClientRect().top + window.scrollY;
        const pos = window.scrollY + activationOffset(target.el) + ROUNDING_TOLERANCE;
        if (documentTop <= pos) {
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
      for (const a of tocLinks) {
        a.removeEventListener("click", handleTocLinkClick);
      }
      window.removeEventListener("scroll", handleScroll);
      topBtn?.removeEventListener("click", scrollToTop);
      window.removeEventListener("scroll", onScrollSpy);
      body.classList.remove("nav-open");
    };
  }, []);

  return null;
}
