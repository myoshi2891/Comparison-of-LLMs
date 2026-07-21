"use client";

import { useEffect } from "react";

interface UseTocObserverOptions {
  chapterSelector: string;
  tocLinkSelector: string;
  activeClassName: string;
  tocSubLinkSelector?: string;
  toggleId?: string;
  sidebarId?: string;
  sidebarOpenClassName?: string;
}

/**
 * Tracks visible content sections and updates the table of contents to reflect the active section.
 *
 * @param chapterSelector - Selector for the content sections to observe
 * @param tocLinkSelector - Selector for top-level table-of-contents links
 * @param activeClassName - Class applied to active table-of-contents links
 * @param tocSubLinkSelector - Optional selector for nested table-of-contents links
 * @param toggleId - Optional ID of the mobile sidebar toggle
 * @param sidebarId - Optional ID of the mobile sidebar
 * @param sidebarOpenClassName - Optional class indicating that the mobile sidebar is open
 */
export function useTocObserver({
  chapterSelector,
  tocLinkSelector,
  activeClassName,
  tocSubLinkSelector,
  toggleId,
  sidebarId,
  sidebarOpenClassName,
}: UseTocObserverOptions) {
  useEffect(() => {
    const sections = document.querySelectorAll(chapterSelector);
    const links = Array.from(document.querySelectorAll(tocLinkSelector));
    const subLinks = tocSubLinkSelector
      ? Array.from(document.querySelectorAll(tocSubLinkSelector))
      : [];

    if (links.length > 0) {
      links[0].classList.add(activeClassName);
      links[0].setAttribute("aria-current", "location");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const hasLink =
              links.some((l) => l.getAttribute("href") === `#${id}`) ||
              subLinks.some((l) => l.getAttribute("href") === `#${id}`);
            if (!hasLink) continue;

            if (!bestEntry || entry.boundingClientRect.top < bestEntry.boundingClientRect.top) {
              bestEntry = entry;
            }
          }
        }

        if (bestEntry) {
          const id = bestEntry.target.id;

          // 全てのアクティブ状態をクリア
          for (const l of links) {
            l.classList.remove(activeClassName);
            l.removeAttribute("aria-current");
          }
          for (const l of subLinks) {
            l.classList.remove(activeClassName);
            l.removeAttribute("aria-current");
          }

          // 該当リンクのアクティブ化
          const link = links.find((l) => l.getAttribute("href") === `#${id}`);
          if (link) {
            link.classList.add(activeClassName);
            link.setAttribute("aria-current", "location");
          } else {
            const subLink = subLinks.find((l) => l.getAttribute("href") === `#${id}`);
            if (subLink) {
              subLink.classList.add(activeClassName);
              subLink.setAttribute("aria-current", "location");
              // 親章は「交差した対象要素」から辿る。TOC 側のリンクはサイドバー内にあり
              // <section> の子孫ではないため、リンク側から closest しても必ず null になる。
              const parentSection = bestEntry.target.closest("section");
              if (parentSection) {
                const parentTocLink = links.find(
                  (l) => l.getAttribute("href") === `#${parentSection.id}`
                );
                if (parentTocLink) {
                  parentTocLink.classList.add(activeClassName);
                }
              }
            }
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    // 2. モバイルサイドバートグル
    // ハンドラはリスナ登録ブロック内の const に閉じ込める。外側の let で保持すると
    // クロージャ内で null 絞り込みが効かず、到達不能な null ガードが必要になるため。
    let cleanupSidebar: (() => void) | undefined;

    if (toggleId && sidebarId && sidebarOpenClassName) {
      const toggle = document.getElementById(toggleId);
      const sidebar = document.getElementById(sidebarId);
      const openClassName = sidebarOpenClassName;

      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }

      if (toggle && sidebar) {
        const handleToggle = () => {
          const isOpen = sidebar.classList.toggle(openClassName);
          toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        };

        const handleLinkClick = () => {
          sidebar.classList.remove(openClassName);
          toggle.setAttribute("aria-expanded", "false");
        };

        const allLinks = [...links, ...subLinks];
        toggle.addEventListener("click", handleToggle);
        for (const l of allLinks) {
          l.addEventListener("click", handleLinkClick);
        }

        cleanupSidebar = () => {
          toggle.removeEventListener("click", handleToggle);
          for (const l of allLinks) {
            l.removeEventListener("click", handleLinkClick);
          }
        };
      }
    }

    return () => {
      observer.disconnect();
      cleanupSidebar?.();
    };
  }, [
    chapterSelector,
    tocLinkSelector,
    activeClassName,
    tocSubLinkSelector,
    toggleId,
    sidebarId,
    sidebarOpenClassName,
  ]);
}
