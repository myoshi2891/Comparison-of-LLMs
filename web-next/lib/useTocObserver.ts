"use client";

import { useEffect } from "react";

interface UseTocObserverOptions {
  chapterSelector: string;
  tocLinkSelector: string;
  activeClassName: string;
}

/**
 * IntersectionObserver ベースの TOC スクロールスパイ。
 * 交差中のセクションに対応する TOC リンクへ activeClassName と
 * aria-current="location" を付与し、他のリンクからは取り除く。
 */
export function useTocObserver({
  chapterSelector,
  tocLinkSelector,
  activeClassName,
}: UseTocObserverOptions) {
  useEffect(() => {
    const sections = document.querySelectorAll(chapterSelector);
    const links = Array.from(document.querySelectorAll(tocLinkSelector));

    if (links.length > 0) {
      links[0].classList.add(activeClassName);
      links[0].setAttribute("aria-current", "location");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const link = links.find((l) => l.getAttribute("href") === `#${id}`);
          if (!link) continue;

          if (entry.isIntersecting) {
            for (const l of links) {
              l.classList.remove(activeClassName);
              l.removeAttribute("aria-current");
            }
            link.classList.add(activeClassName);
            link.setAttribute("aria-current", "location");
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    return () => {
      observer.disconnect();
    };
  }, [chapterSelector, tocLinkSelector, activeClassName]);
}
