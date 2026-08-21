"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

/**
 * Initializes sidebar controls and highlights the table-of-contents link for the uppermost visible heading.
 *
 * @returns `null`
 */
export function TocObserver() {
  useEffect(() => {
    // 1. Sidebar toggle logic
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    // 閉じる操作はトグル・オーバーレイ・Escape の 3 経路から呼ばれるため共通化する。
    const closeSidebar = () => {
      if (!sidebar || !toggleBtn) return;
      sidebar.classList.remove(styles.open);
      overlay?.classList.remove(styles.open);
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "目次を開く");
    };

    const handleToggle = () => {
      if (!sidebar || !toggleBtn) return;
      if (sidebar.classList.contains(styles.open)) {
        closeSidebar();
        return;
      }
      sidebar.classList.add(styles.open);
      overlay?.classList.add(styles.open);
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.setAttribute("aria-label", "目次を閉じる");
    };

    const handleOverlayClick = () => {
      closeSidebar();
    };

    // オフキャンバス目次はキーボード利用者が Escape で閉じられる必要がある。
    // 閉じた後はフォーカスをトグルボタンへ戻し、フォーカスが迷子にならないようにする。
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (!sidebar?.classList.contains(styles.open)) return;
      closeSidebar();
      toggleBtn?.focus();
    };

    toggleBtn?.addEventListener("click", handleToggle);
    overlay?.addEventListener("click", handleOverlayClick);
    document.addEventListener("keydown", handleKeyDown);

    // 2. IntersectionObserver for TOC highlight
    const headings = Array.from(document.querySelectorAll("section[id], h2[id]"));
    const navLinks = Array.from(document.querySelectorAll(`.${styles.navLink}`));
    const intersectingHeadings = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingHeadings.add(entry.target);
          } else {
            intersectingHeadings.delete(entry.target);
          }
        }
        const topmostHeading = Array.from(intersectingHeadings).reduce<Element | undefined>(
          (topmost, heading) =>
            !topmost || heading.getBoundingClientRect().top < topmost.getBoundingClientRect().top
              ? heading
              : topmost,
          undefined
        );
        if (topmostHeading) {
          const id = topmostHeading.getAttribute("id");
          for (const link of navLinks) {
            const href = link.getAttribute("href") ?? "";
            link.classList.toggle(styles.active, href === `#${id}`);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const h of headings) {
      observer.observe(h);
    }

    return () => {
      toggleBtn?.removeEventListener("click", handleToggle);
      overlay?.removeEventListener("click", handleOverlayClick);
      document.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, []);

  return null;
}
