"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

/**
 * legacy/shared/common-header.js:160-290 相当。
 * SiteHeader (Client) が描画した nav#common-header 配下に、
 * ハンバーガー開閉・dropdown トグル・Escape・外側クリックを束ねる
 * イベントハンドラを取り付ける。children は SiteHeader が生成する
 * RSC 由来の DOM ツリー全体で、ハンドラは useEffect で後付けする。
 *
 * 設計メモ:
 * - React の synthetic event ではなく addEventListener を使う。
 *   legacy の stopPropagation 連鎖を忠実に再現するため、document への
 *   直接 listener も併用する。
 * - 要素取得は document.getElementById("common-header") スコープに
 *   限定。Fragment 返しにより余計な wrapper DOM を作らない。
 */
export function SiteHeaderClient({ children }: { children: ReactNode }) {
  useEffect(() => {
    const nav = document.getElementById("common-header");
    if (!nav) return;
    const hamburger = nav.querySelector<HTMLElement>(".ch-hamburger");
    const linksList = nav.querySelector<HTMLElement>(".ch-links");
    const toggles = Array.from(nav.querySelectorAll<HTMLElement>(".ch-dropdown-toggle"));
    if (!hamburger || !linksList) return;

    const closeAllDropdowns = () => {
      for (const t of toggles) {
        const li = t.closest<HTMLElement>("li.ch-dropdown");
        li?.classList.remove("ch-dropdown-open");
        t.setAttribute("aria-expanded", "false");
      }
    };

    const closeMenu = () => {
      linksList.classList.remove("ch-open");
      hamburger.classList.remove("ch-open");
      hamburger.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      linksList.classList.add("ch-open");
      hamburger.classList.add("ch-open");
      hamburger.setAttribute("aria-expanded", "true");
    };

    const handleHamburger = (e: MouseEvent) => {
      e.stopPropagation();
      if (linksList.classList.contains("ch-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    const makeToggleHandler = (toggle: HTMLElement) => (e: MouseEvent) => {
      e.stopPropagation();
      const li = toggle.closest<HTMLElement>("li.ch-dropdown");
      if (!li) return;
      const wasOpen = li.classList.contains("ch-dropdown-open");
      closeAllDropdowns();
      if (!wasOpen) {
        li.classList.add("ch-dropdown-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
        closeMenu();
      }
    };

    const handleOutsideClick = (e: Event) => {
      const target = e.target as Node | null;
      if (target && !nav.contains(target)) {
        closeAllDropdowns();
        closeMenu();
      }
    };

    hamburger.addEventListener("click", handleHamburger);
    const toggleHandlers = toggles.map((t) => {
      const h = makeToggleHandler(t);
      t.addEventListener("click", h);
      return { t, h };
    });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      hamburger.removeEventListener("click", handleHamburger);
      for (const { t, h } of toggleHandlers) t.removeEventListener("click", h);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return <>{children}</>;
}
