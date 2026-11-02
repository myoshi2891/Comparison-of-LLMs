"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const root = document.getElementById("gemini-guide");
    const sidebar = document.getElementById("gemini-sidebar");
    const menu = document.getElementById("gemini-menu");
    const backdrop = document.getElementById("gemini-backdrop");
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("nav a") ?? []);
    const sync = (open: boolean) => {
      root?.classList.toggle(styles.open, open);
      menu?.setAttribute("aria-expanded", String(open));
      menu?.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
      if (sidebar) {
        const hidden = window.innerWidth <= 900 && !open;
        if (hidden && sidebar.contains(document.activeElement)) menu?.focus();
        sidebar.inert = hidden;
      }
    };
    const close = () => sync(false);
    const toggle = () => sync(!root?.classList.contains(styles.open));
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const update = () => {
      let current = 0;
      links.forEach((a, i) => {
        const section = document.getElementById(a.hash.slice(1));
        if (!section) return;
        const margin = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop);
        const threshold = Math.max(
          window.innerHeight * 0.25,
          (Number.isFinite(margin) ? margin : 0) + 1
        );
        if (section.getBoundingClientRect().top <= threshold) current = i;
      });
      if (
        document.documentElement.scrollHeight > window.innerHeight &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      )
        current = links.length - 1;
      links.forEach((a, i) => {
        a.classList.toggle(styles.active, i === current);
        if (i === current) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
      const active = links[current];
      if (active && sidebar) {
        const r = active.getBoundingClientRect(),
          sr = sidebar.getBoundingClientRect();
        if (r.top < sr.top + 60 || r.bottom > sr.bottom - 20)
          sidebar.scrollTop += r.top - sr.top - sr.height / 3;
      }
    };
    const resize = () => {
      sync(window.innerWidth <= 900 && Boolean(root?.classList.contains(styles.open)));
      update();
    };
    const boxes = Array.from(
      root?.querySelectorAll<HTMLInputElement>("input[data-guide-check]") ?? []
    );
    const progress = () => {
      const n = boxes.filter((b) => b.checked).length;
      const count = document.getElementById("chkCount"),
        total = document.getElementById("chkTotal"),
        bar = document.getElementById("chkBar");
      if (count) count.textContent = String(n);
      if (total) total.textContent = String(boxes.length);
      if (bar) bar.style.width = `${boxes.length ? (n / boxes.length) * 100 : 0}%`;
    };
    menu?.addEventListener("click", toggle);
    backdrop?.addEventListener("click", close);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    links.forEach((a) => {
      a.addEventListener("click", close);
    });
    boxes.forEach((b) => {
      b.addEventListener("change", progress);
    });
    sync(false);
    update();
    progress();
    return () => {
      menu?.removeEventListener("click", toggle);
      backdrop?.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      links.forEach((a) => {
        a.removeEventListener("click", close);
      });
      boxes.forEach((b) => {
        b.removeEventListener("change", progress);
      });
      root?.classList.remove(styles.open);
      if (sidebar) sidebar.inert = false;
    };
  }, []);
  return null;
}
