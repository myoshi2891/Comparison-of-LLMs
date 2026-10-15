"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      '[data-page="knowledge-graphs-fundamentals-techniques"]'
    );
    if (!root) return;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("a[data-nav-target]"));
    const targets = new Map<Element, HTMLAnchorElement>();
    for (const link of links) {
      const target = root.querySelector<HTMLElement>(link.hash);
      if (target) targets.set(target, link);
    }
    let activeLink: HTMLAnchorElement | undefined;
    const button = root.querySelector<HTMLButtonElement>("#back-to-top");
    function update() {
      const headerHeight =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 60;
      let current = targets.values().next().value;
      for (const [target, link] of targets) {
        if (target.getBoundingClientRect().top <= headerHeight + 80) current = link;
      }
      if (activeLink !== current) {
        activeLink = current;
        for (const link of links) {
          link.classList.toggle(styles.active, link === current);
          if (link === current) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
      button?.classList.toggle(styles.visible, window.scrollY > 600);
    }
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => targets.has(entry.target))) update();
            },
            { rootMargin: "-20% 0px -70% 0px" }
          )
        : null;
    for (const target of targets.keys()) observer?.observe(target);
    function backToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    button?.addEventListener("click", backToTop);
    update();
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      button?.removeEventListener("click", backToTop);
    };
  }, []);
  return null;
}
