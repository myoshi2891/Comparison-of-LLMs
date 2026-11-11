"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

/** 目次追従、モバイルドロワーの操作制御とチェック進捗を同期する。 */
export default function TocObserver() {
  useEffect(() => {
    const root = document.getElementById("codex-practices-guide");
    const sidebar = document.getElementById("codex-practices-sidebar");
    const menu = document.getElementById("codex-practices-menu");
    const backdrop = document.getElementById("codex-practices-backdrop");
    const mobileBar = document.getElementById("codex-practices-mobile-bar");
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const main = root?.querySelector<HTMLElement>("[data-guide-content]");
    // inert未実装のDOMでも初期値を真偽値へ揃え、既存のtrueは保持する。
    if (main) main.inert = main.inert === true;
    const backgroundInert = new Map<HTMLElement, boolean>();
    /** ドロワー操作部への祖先経路を残し、各階層の背景の状態を保存して操作不能にする。 */
    const isolateBackground = (parent: HTMLElement) => {
      const controls = [sidebar, mobileBar, backdrop].filter((element) => element !== null);
      for (const child of parent.children) {
        if (!(child instanceof HTMLElement) || controls.includes(child)) continue;
        if (controls.some((control) => child.contains(control))) isolateBackground(child);
        else {
          backgroundInert.set(child, child.inert === true);
          child.inert = true;
        }
      }
    };
    /** 開く直前のinert状態を復元し、次回の開閉に備えて保存値を破棄する。 */
    const restoreBackground = () => {
      for (const [element, inert] of backgroundInert) element.inert = inert;
      backgroundInert.clear();
    };
    // The guide is static; resolve section targets once per mount rather than on every scroll.
    const sections = links.map((link) =>
      document.getElementById((link.getAttribute("href") ?? "").slice(1))
    );
    let wasOpen = false;
    /** 開閉状態、背景の操作可否とフォーカスを現在の画面幅へ同期する。 */
    const sync = (open: boolean) => {
      root?.classList.toggle(styles.open, open);
      menu?.setAttribute("aria-expanded", String(open));
      menu?.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
      const mobile = window.innerWidth <= 900;
      if (sidebar) {
        const hidden = mobile && !open;
        // 背景クリック等でフォーカスが目次外へ移っていても、閉じたら開いた要素へ戻す。
        if (hidden && (wasOpen || sidebar.contains(document.activeElement))) menu?.focus();
        sidebar.inert = hidden;
      }
      if (mobile && open && sidebar && menu) {
        if (!backgroundInert.size) isolateBackground(document.body);
      } else restoreBackground();
      // 先頭リンクへの移動は閉→開の遷移時だけ。resize の再同期で利用者のフォーカス位置を奪わない。
      if (mobile && open && !wasOpen) links[0]?.focus();
      wasOpen = open;
    };
    /** ドロワーを閉じ、背景の操作状態を戻す。 */
    const close = () => sync(false);
    /** メニューボタンからドロワーの開閉を切り替える。 */
    const toggle = () => sync(!root?.classList.contains(styles.open));
    /** 開いたモバイルドロワーでは、Tab 移動を目次リンクとメニューの間で循環させる。 */
    const containFocus = (event: KeyboardEvent) => {
      if (!menu || !wasOpen || window.innerWidth > 900) return;
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
    /** Escapeで閉じ、開いている間のTab移動を制御する。 */
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") containFocus(event);
    };
    /** モバイルバーの実測高さをページの配置用CSS変数へ渡す。 */
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
    /** スクロール位置から現在の章を選び、目次内で可視に保つ。 */
    const update = () => {
      const h = document.documentElement;
      let current = 0;
      sections.forEach((section, index) => {
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
    /** サイズ変更後にバー高さ、ドロワー状態と現在の章を再計算する。 */
    const resize = () => {
      measure();
      sync(window.innerWidth <= 900 && Boolean(root?.classList.contains(styles.open)));
      update();
    };
    const boxes = Array.from(
      root?.querySelectorAll<HTMLInputElement>(`.${styles.chk} input[type="checkbox"]`) ?? []
    );
    const counter = root?.querySelector<HTMLElement>("#chkDone");
    /** チェック行の完了装飾とページ内の完了件数を更新する。 */
    const progress = () => {
      for (const box of boxes) box.closest("tr")?.classList.toggle(styles.done, box.checked);
      if (counter) counter.textContent = String(boxes.filter((box) => box.checked).length);
    };
    for (const box of boxes) box.addEventListener("change", progress);
    progress();
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
      for (const box of boxes) box.removeEventListener("change", progress);
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
      restoreBackground();
    };
  }, []);
  return null;
}
