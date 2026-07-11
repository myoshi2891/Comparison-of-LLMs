"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const sections = document.querySelectorAll("section.adkSection");
    const links = Array.from(document.querySelectorAll(`.${styles.tocLink}`));
    if (links.length > 0) links[0].classList.add(styles.tocLinkActive);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            for (const l of links) {
              if (l.getAttribute("href") === `#${id}`) {
                l.classList.add(styles.tocLinkActive);
              } else {
                l.classList.remove(styles.tocLinkActive);
              }
            }
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    for (const sec of sections) {
      observer.observe(sec);
    }

    // Mobile nav toggle implementation
    const toggle = document.getElementById("adkNavToggle");
    const list = document.getElementById("adkNavList");
    
    if (toggle && list) {
      const handleToggle = () => {
        list.classList.toggle(styles.navListOpen);
      };
      
      const handleLinkClick = () => {
        list.classList.remove(styles.navListOpen);
      };

      toggle.addEventListener("click", handleToggle);
      const linksInList = list.querySelectorAll("a");
      for (const a of Array.from(linksInList)) {
        a.addEventListener("click", handleLinkClick);
      }

      return () => {
        observer.disconnect();
        toggle.removeEventListener("click", handleToggle);
        for (const a of Array.from(linksInList)) {
          a.removeEventListener("click", handleLinkClick);
        }
      };
    }

    return () => observer.disconnect();
  }, []);
  return null;
}
