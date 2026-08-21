"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Observes document sections to highlight the active table-of-contents link and manage responsive sidebar controls.
 */
export default function TocObserver() {
  useEffect(() => {
    const tocLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(`.${styles.toc} a[href^="#"]`)
    );

    // 監視対象は TOC リンクの href から導出する。ID をハードコードすると
    // セクションの増減で監視漏れ・幽霊 ID が生じるため。
    const sections = tocLinks
      .map((link) => {
        const href = link.getAttribute("href");
        return href ? document.getElementById(decodeURIComponent(href.slice(1))) : null;
      })
      .filter((el): el is HTMLElement => el !== null);

    // 交差中のセクションを保持し、そのうち最も上にあるものをアクティブにする。
    // entries を順に処理して「最後の交差」を採用すると、複数セクションが同時に
    // 交差したときに下のセクションが勝ってしまう。
    const intersecting = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }

        const [topmost] = [...intersecting].sort(
          (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
        );
        if (!topmost) return;

        for (const link of tocLinks) {
          if (link.getAttribute("href") === `#${topmost.id}`) {
            link.classList.add(styles.active);
          } else {
            link.classList.remove(styles.active);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    // Hamburger button toggle
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    const toggleSidebar = () => {
      // sidebar が無いと classList.toggle が undefined を返し、
      // aria-expanded="undefined" という不正な値が出力されるため先に抜ける。
      if (!sidebar) return;
      const isOpen = sidebar.classList.toggle(styles.sidebarOpen);
      backdrop?.classList.toggle(styles.sidebarOpen, isOpen);
      hamburgerBtn?.setAttribute("aria-expanded", String(isOpen));
      hamburgerBtn?.setAttribute("aria-label", isOpen ? "目次を閉じる" : "目次を開く");
    };

    const closeSidebar = () => {
      sidebar?.classList.remove(styles.sidebarOpen);
      backdrop?.classList.remove(styles.sidebarOpen);
      hamburgerBtn?.setAttribute("aria-expanded", "false");
      hamburgerBtn?.setAttribute("aria-label", "目次を開く");
    };

    const handleTocLinkClick = () => {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    };

    hamburgerBtn?.addEventListener("click", toggleSidebar);
    backdrop?.addEventListener("click", closeSidebar);
    for (const link of tocLinks) {
      link.addEventListener("click", handleTocLinkClick);
    }

    return () => {
      observer.disconnect();
      hamburgerBtn?.removeEventListener("click", toggleSidebar);
      backdrop?.removeEventListener("click", closeSidebar);
      for (const link of tocLinks) {
        link.removeEventListener("click", handleTocLinkClick);
      }
    };
  }, []);

  return null;
}
