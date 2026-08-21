"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Initializes sidebar controls and highlights the navigation link for the uppermost visible section.
 */
export default function TocObserver() {
  useEffect(() => {
    // 1. Mobile Sidebar toggle
    const toggle = document.querySelector(`.${styles.sidebarToggle}`) as HTMLElement | null;
    const sidebar = document.querySelector(`.${styles.sidebar}`) as HTMLElement | null;

    const syncToggleState = () => {
      if (!toggle || !sidebar) return;
      const open = sidebar.classList.contains(styles.open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    };

    const handleToggle = () => {
      if (!sidebar) return;
      sidebar.classList.toggle(styles.open);
      syncToggleState();
    };

    const handleLinkClick = () => {
      if (!sidebar) return;
      sidebar.classList.remove(styles.open);
      syncToggleState();
    };

    // 2. Scroll Spy Intersection Observer
    // navLinks はトグルのリスナ登録とスパイの双方で使うため先に確定させる。
    // 「登録時と解除時で querySelectorAll を撮り直す」と対象がずれうるので、
    // 同じ配列を cleanup でも使う。
    const navLinks = Array.from(
      document.querySelectorAll(`.${styles.sideNav} a`)
    ) as HTMLAnchorElement[];

    if (toggle && sidebar) {
      toggle.addEventListener("click", handleToggle);
      for (const a of navLinks) {
        a.addEventListener("click", handleLinkClick);
      }
    }

    let observer: IntersectionObserver | undefined;

    if (navLinks.length > 0) {
      const idToLink: Record<string, HTMLAnchorElement> = {};
      const sections: HTMLElement[] = [];

      for (const a of navLinks) {
        const href = a.getAttribute("href");
        if (href?.startsWith("#")) {
          const id = decodeURIComponent(href.slice(1));
          idToLink[id] = a;
          const el = document.getElementById(id);
          if (el) sections.push(el);
        }
      }

      // 交差中の要素を保持し、そのうち最も上にあるものをアクティブにする。
      // entries を順に処理して最後の交差を採用すると、同時に複数が交差したとき
      // 下のセクションが勝ってしまう。
      const intersecting = new Set<Element>();

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target);
            else intersecting.delete(entry.target);
          }

          const [topmost] = [...intersecting].sort(
            (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
          );
          if (!topmost) return;

          const link = idToLink[topmost.id];
          if (!link) return;

          for (const a of navLinks) {
            a.classList.remove(styles.active);
          }
          link.classList.add(styles.active);
        },
        { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
      );

      for (const s of sections) {
        observer.observe(s);
      }
    }

    // cleanup は navLinks の有無に関わらず必ず返す。
    // 以前は navLinks.length > 0 の分岐内にのみ return があったため、
    // TOC が空のページではトグルのリスナが解除されずに残っていた。
    return () => {
      if (toggle) toggle.removeEventListener("click", handleToggle);
      for (const a of navLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
      observer?.disconnect();
    };
  }, []);

  return null;
}
