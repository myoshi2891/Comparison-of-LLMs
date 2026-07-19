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
 * IntersectionObserver ベースの TOC スクロールスパイ。
 * 交差中のセクションに対応する TOC リンクへ activeClassName と
 * aria-current="location" を付与し、他のリンクからは取り除く。
 * toggleId, sidebarId, sidebarOpenClassName が指定された場合は、
 * モバイル用のサイドバーのトグル開閉およびリンククリックによる閉じる動作も同時に管理する。
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
    const subLinks = tocSubLinkSelector ? Array.from(document.querySelectorAll(tocSubLinkSelector)) : [];

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
            const hasLink = links.some((l) => l.getAttribute("href") === `#${id}`) ||
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
              const parentSection = subLink.closest("section");
              if (parentSection) {
                const parentTocLink = links.find((l) => l.getAttribute("href") === `#${parentSection.id}`);
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
    let handleToggle: (() => void) | undefined;
    let handleLinkClick: (() => void) | undefined;
    let toggle: HTMLElement | null = null;
    let sidebar: HTMLElement | null = null;

    if (toggleId && sidebarId && sidebarOpenClassName) {
      toggle = document.getElementById(toggleId);
      sidebar = document.getElementById(sidebarId);

      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }

      handleToggle = () => {
        if (sidebar) {
          const isOpen = sidebar.classList.toggle(sidebarOpenClassName);
          toggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      };

      handleLinkClick = () => {
        if (sidebar) {
          sidebar.classList.remove(sidebarOpenClassName);
          toggle?.setAttribute("aria-expanded", "false");
        }
      };

      if (toggle && sidebar) {
        toggle.addEventListener("click", handleToggle);
        const allLinks = [...links, ...subLinks];
        for (const l of allLinks) {
          l.addEventListener("click", handleLinkClick);
        }
      }
    }

    return () => {
      observer.disconnect();
      if (toggle && handleToggle) {
        toggle.removeEventListener("click", handleToggle);
      }
      if (handleLinkClick) {
        const allLinks = [...links, ...subLinks];
        for (const l of allLinks) {
          l.removeEventListener("click", handleLinkClick);
        }
      }
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
