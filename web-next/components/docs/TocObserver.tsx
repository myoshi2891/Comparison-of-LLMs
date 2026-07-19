"use client";

import { useEffect } from "react";

interface TocObserverProps {
  navLinkClassName: string;
  activeClassName: string;
}

export default function TocObserver({
  navLinkClassName,
  activeClassName,
}: TocObserverProps) {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const links = Array.from(document.querySelectorAll(`.${navLinkClassName}`));
    if (links.length > 0) links[0].classList.add(activeClassName);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            for (const l of links) {
              if (l.getAttribute("href") === `#${id}`) {
                l.classList.add(activeClassName);
              } else {
                l.classList.remove(activeClassName);
              }
            }
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) observer.observe(sec);
    return () => observer.disconnect();
  }, [navLinkClassName, activeClassName]);

  return null;
}
