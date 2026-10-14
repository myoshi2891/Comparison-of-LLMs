"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const root = document.querySelector('[data-testid="layout-root"]');
    if (!root) return;

    // --- 1. Mobile Menu Toggle ---
    const sidebar = root.querySelector("#sidebar");
    const toggle = root.querySelector("#menuToggle");
    const scrim = root.querySelector("#scrim");

    function closeSidebar() {
      sidebar?.classList.remove(styles.open);
      scrim?.classList.remove(styles.show);
      toggle?.setAttribute("aria-expanded", "false");
    }

    function openSidebar() {
      sidebar?.classList.add(styles.open);
      scrim?.classList.add(styles.show);
      toggle?.setAttribute("aria-expanded", "true");
    }

    function handleToggle() {
      if (sidebar?.classList.contains(styles.open)) {
        closeSidebar();
      } else {
        openSidebar();
      }
    }

    toggle?.addEventListener("click", handleToggle);
    scrim?.addEventListener("click", closeSidebar);

    const sidebarLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>("#sidebar a"));
    function handleLinkClick() {
      if (window.innerWidth <= 980) {
        closeSidebar();
      }
    }
    for (const a of sidebarLinks) {
      a.addEventListener("click", handleLinkClick);
    }

    // --- 2. Checklist ---
    const checklist = root.querySelector("#checklistItems");
    const counter = root.querySelector("#ckCounter");
    const checkboxes = checklist
      ? Array.from(checklist.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'))
      : [];

    function updateChecklist() {
      let count = 0;
      for (const box of checkboxes) {
        const li = box.closest("li");
        if (box.checked) {
          count++;
          li?.classList.add(styles.done);
        } else {
          li?.classList.remove(styles.done);
        }
      }
      if (counter) {
        counter.textContent = `${count} / ${checkboxes.length} 完了`;
      }
    }

    for (const box of checkboxes) {
      box.addEventListener("change", updateChecklist);
    }
    updateChecklist();

    // --- 3. Scroll Spy / Active TOC ---
    if (typeof window.IntersectionObserver === "function") {
      const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("#sidebar a[href^='#']"));
      const map = new Map<Element, HTMLAnchorElement>();

      for (const link of links) {
        const hash = link.getAttribute("href")?.slice(1);
        if (hash) {
          const target = document.getElementById(hash);
          if (target) map.set(target, link);
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const link = map.get(entry.target);
            if (!link || !entry.isIntersecting) continue;
            for (const l of links) {
              l.classList.remove(styles.active);
              l.removeAttribute("aria-current");
            }
            link.classList.add(styles.active);
            link.setAttribute("aria-current", "location");
          }
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );

      for (const target of map.keys()) {
        observer.observe(target);
      }

      return () => {
        toggle?.removeEventListener("click", handleToggle);
        scrim?.removeEventListener("click", closeSidebar);
        for (const a of sidebarLinks) {
          a.removeEventListener("click", handleLinkClick);
        }
        for (const box of checkboxes) {
          box.removeEventListener("change", updateChecklist);
        }
        observer.disconnect();
      };
    }

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      scrim?.removeEventListener("click", closeSidebar);
      for (const a of sidebarLinks) {
        a.removeEventListener("click", handleLinkClick);
      }
      for (const box of checkboxes) {
        box.removeEventListener("change", updateChecklist);
      }
    };
  }, []);

  return null;
}
