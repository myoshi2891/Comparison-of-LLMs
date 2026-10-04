"use client";

import { useEffect } from "react";

/** ページ側 CSS Modules のハッシュ化済みクラス名。 */
export interface BookTocClassNames {
  main: string;
  navA: string;
  open: string;
  active: string;
  done: string;
}

interface BookTocObserverProps {
  classNames: BookTocClassNames;
  /** この幅以下（inclusive）をモバイルとして扱う。 */
  mobileBreakpoint: number;
}

/** Preserve the original scroll spy, mobile menu and checklist interactions. */
export default function BookTocObserver({
  classNames: styles,
  mobileBreakpoint,
}: BookTocObserverProps) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-testid="layout-root"]');
    if (!root) return;
    const sidebar = root.querySelector<HTMLElement>("#sidebar");
    const toggle = root.querySelector<HTMLButtonElement>("#menuToggle");
    const scrim = root.querySelector<HTMLElement>("#scrim");
    const main = root.querySelector<HTMLElement>(`.${styles.main}`);
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(`.${styles.navA}`));
    const targets = links.flatMap((link) => {
      const target = document.getElementById(link.hash.slice(1));
      return target ? [{ link, target }] : [];
    });
    const boxes = Array.from(
      root.querySelectorAll<HTMLInputElement>('#checklistItems input[type="checkbox"]')
    );
    const counter = root.querySelector<HTMLElement>("#checklistCounterText");
    let frame: number | null = null;

    function syncInert() {
      if (!sidebar) return;
      const mobile = window.innerWidth <= mobileBreakpoint;
      const open = sidebar.classList.contains(styles.open);
      const hidden = mobile && !open;
      if (hidden && sidebar.contains(document.activeElement)) toggle?.focus();
      sidebar.inert = hidden;
      // メニュー展開中は scrim 背後の本文へ Tab でフォーカスが抜けないよう本文を inert にする
      if (main) main.inert = mobile && open;
    }

    function setOpen(open: boolean) {
      const hadFocus = sidebar?.contains(document.activeElement);
      sidebar?.classList.toggle(styles.open, open);
      scrim?.classList.toggle(styles.open, open);
      toggle?.setAttribute("aria-expanded", String(open));
      toggle?.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
      syncInert();
      if (open) links[0]?.focus();
      else if (hadFocus && window.innerWidth <= mobileBreakpoint) toggle?.focus();
    }

    function handleToggle() {
      setOpen(!sidebar?.classList.contains(styles.open));
    }
    function closeMenu() {
      setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }
    function handleLink() {
      if (window.innerWidth <= mobileBreakpoint) closeMenu();
    }
    function handleResize() {
      if (window.innerWidth > mobileBreakpoint) closeMenu();
      syncInert();
    }

    function updateActive() {
      let current = targets[0];
      for (const target of targets) {
        if (target.target.getBoundingClientRect().top <= window.innerHeight * 0.25)
          current = target;
      }
      for (const link of links) link.classList.toggle(styles.active, link === current?.link);
      frame = null;
    }
    function handleScroll() {
      if (frame === null) frame = window.requestAnimationFrame(updateActive);
    }

    function updateCounter() {
      let done = 0;
      for (const box of boxes) {
        if (box.checked) done++;
        box.closest("li")?.classList.toggle(styles.done, box.checked);
      }
      if (counter) counter.textContent = `${done} / ${boxes.length} 完了`;
    }

    syncInert();
    updateActive();
    updateCounter();
    toggle?.addEventListener("click", handleToggle);
    scrim?.addEventListener("click", closeMenu);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    for (const link of links) link.addEventListener("click", handleLink);
    for (const box of boxes) box.addEventListener("change", updateCounter);

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      scrim?.removeEventListener("click", closeMenu);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      for (const link of links) link.removeEventListener("click", handleLink);
      for (const box of boxes) box.removeEventListener("change", updateCounter);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [styles, mobileBreakpoint]);
  return null;
}
