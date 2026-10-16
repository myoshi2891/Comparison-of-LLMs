"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const root = document.querySelector('[data-testid="layout-root"]');
    const navigation = root?.querySelector("#nav");
    if (!navigation || typeof window.IntersectionObserver !== "function") return;

    const links = Array.from(navigation.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const targets = new Map<Element, HTMLAnchorElement>();
    for (const link of links) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) targets.set(target, link);
    }
    if (targets.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const current = targets.get(entry.target);
          if (!entry.isIntersecting || !current) continue;
          for (const link of links) {
            link.classList.toggle(styles.active, link === current);
            if (link === current) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    for (const target of targets.keys()) observer.observe(target);
    return () => observer.disconnect();
  }, []);
  return null;
}
