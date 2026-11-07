"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const root = document.getElementById("grok-guide");
    const sidebar = document.getElementById("grok-sidebar");
    const menu = document.getElementById("grok-menu");
    const backdrop = document.getElementById("grok-backdrop");
    const mobileBar = document.getElementById("grok-mobile-bar");
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const main = root?.querySelector("main") ?? null;
    let wasOpen = false;
    const sync = (open: boolean) => {
      root?.classList.toggle(styles.open, open);
      menu?.setAttribute("aria-expanded", String(open));
      menu?.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
      const mobile = window.innerWidth <= 960;
      if (sidebar) {
        const hidden = mobile && !open;
        // 背景クリック等でフォーカスが目次外へ移っていても、閉じたら開いた要素へ戻す。
        if (hidden && (wasOpen || sidebar.contains(document.activeElement))) menu?.focus();
        sidebar.inert = hidden;
      }
      // モバイルのドロワー表示中は背後の本文を操作不能にする。Tab の循環は containFocus が担当する。
      if (main) main.inert = mobile && open;
      // 先頭リンクへの移動は閉→開の遷移時だけ。resize の再同期で利用者のフォーカス位置を奪わない。
      if (mobile && open && !wasOpen) links[0]?.focus();
      wasOpen = open;
    };
    const close = () => sync(false);
    const toggle = () => sync(!root?.classList.contains(styles.open));
    /** 開いたモバイルドロワーでは、Tab 移動を目次リンクとメニューの間で循環させる。 */
    const containFocus = (event: KeyboardEvent) => {
      if (!menu || !wasOpen || window.innerWidth > 960) return;
      const stops = [...links, menu];
      const first = stops[0];
      const last = stops[stops.length - 1];
      const edge = event.shiftKey ? first : last;
      const active = document.activeElement;
      // 範囲内かつ端以外ならブラウザ既定の移動に任せる。
      if (active !== edge && stops.some((stop) => stop === active)) return;
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") containFocus(event);
    };
    const measure = () => {
      if (mobileBar)
        root?.style.setProperty(
          "--mobile-bar-height",
          `${mobileBar.getBoundingClientRect().height}px`
        );
    };
    const observer =
      typeof ResizeObserver !== "undefined" && mobileBar ? new ResizeObserver(measure) : null;
    if (mobileBar) observer?.observe(mobileBar);
    const update = () => {
      const h = document.documentElement;
      let current = 0;
      links.forEach((link, index) => {
        const section = document.getElementById((link.getAttribute("href") ?? "").slice(1));
        if (!section) return;
        const margin = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop);
        const threshold = Math.max(
          window.innerHeight * 0.25,
          (Number.isFinite(margin) ? margin : 0) + 1
        );
        if (section.getBoundingClientRect().top <= threshold) current = index;
      });
      if (
        h.scrollHeight > window.innerHeight &&
        window.innerHeight + window.scrollY >= h.scrollHeight - 4
      )
        current = links.length - 1;
      links.forEach((link, index) => {
        link.classList.toggle(styles.active, index === current);
        if (index === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
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
      measure();
      sync(window.innerWidth <= 960 && Boolean(root?.classList.contains(styles.open)));
      update();
    };
    menu?.addEventListener("click", toggle);
    backdrop?.addEventListener("click", close);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    links.forEach((link) => {
      link.addEventListener("click", close);
    });
    measure();
    sync(false);
    update();
    return () => {
      observer?.disconnect();
      menu?.removeEventListener("click", toggle);
      backdrop?.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      links.forEach((link) => {
        link.removeEventListener("click", close);
      });
      root?.classList.remove(styles.open);
      root?.style.removeProperty("--mobile-bar-height");
      if (sidebar) sidebar.inert = false;
      if (main) main.inert = false;
    };
  }, []);
  return null;
}
