"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
export default function TocObserver() {
  useEffect(() => {
    const sidebar = document.getElementById("guide-sidebar"),
      menu = document.getElementById("menu");
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("nav a") ?? []);
    // aria-expanded と状態依存の aria-label を常に同期する
    const sync = (open: boolean) => {
      menu?.setAttribute("aria-expanded", String(open));
      menu?.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
    };
    const close = () => {
      sidebar?.classList.remove(styles.open);
      sync(false);
    };
    const toggle = () => {
      sync(Boolean(sidebar?.classList.toggle(styles.open)));
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const update = () => {
      let current = 0;
      links.forEach((a, i) => {
        const el = document.getElementById(a.hash.slice(1));
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.25) current = i;
      });
      links.forEach((a, i) => {
        a.classList.toggle(styles.active, i === current);
        if (i === current) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    const boxes = Array.from(document.querySelectorAll<HTMLInputElement>("#s-sec10 input"));
    const progress = () => {
      const n = boxes.filter((b) => b.checked).length;
      const count = document.getElementById("ckCount"),
        fill = document.getElementById("ckFill");
      if (count) count.textContent = `${n} / ${boxes.length} 完了`;
      if (fill) fill.style.width = `${(n / boxes.length) * 100}%`;
    };
    menu?.addEventListener("click", toggle);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    links.forEach((a) => {
      a.addEventListener("click", close);
    });
    boxes.forEach((b) => {
      b.addEventListener("change", progress);
    });
    update();
    progress();
    return () => {
      menu?.removeEventListener("click", toggle);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      links.forEach((a) => {
        a.removeEventListener("click", close);
      });
      boxes.forEach((b) => {
        b.removeEventListener("change", progress);
      });
    };
  }, []);
  return null;
}
