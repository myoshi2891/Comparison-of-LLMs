"use client";
import { useEffect } from "react";

/** ページ側 CSS Modules のハッシュ化済みクラス名。 */
export interface DrawerTocClassNames {
  main: string;
  open: string;
  active: string;
  checklist: string;
  done: string;
}

interface DrawerTocObserverProps {
  /** `<prefix>-guide` / `-sidebar` / `-menu` / `-backdrop` の要素IDを参照する。 */
  idPrefix: string;
  classNames: DrawerTocClassNames;
}

/**
 * 900px以下のドロワー目次、スクロール連動ハイライト、リスト単位のチェック進捗を担う。
 * Fable 5.1 / GPT-6 Astra ガイドで共有する（ページ固有なのはIDとクラス名のみ）。
 */
export default function DrawerTocObserver({
  idPrefix,
  classNames: styles,
}: DrawerTocObserverProps) {
  useEffect(() => {
    const root = document.getElementById(`${idPrefix}-guide`);
    const sidebar = document.getElementById(`${idPrefix}-sidebar`);
    const menu = document.getElementById(`${idPrefix}-menu`);
    const backdrop = document.getElementById(`${idPrefix}-backdrop`);
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const guideContent = root?.querySelector<HTMLElement>(`.${styles.main}`) ?? null;
    let wasOpen = false;
    const siteHamburger = document.querySelector<HTMLElement>("#common-header .ch-hamburger");
    const sync = (open: boolean, restoreFocus = true) => {
      root?.classList.toggle(styles.open, open);
      menu?.setAttribute("aria-expanded", String(open));
      menu?.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
      const mobile = window.innerWidth <= 900;
      if (sidebar) {
        const hidden = mobile && !open;
        // 背景クリック等でフォーカスが目次外へ移っていても、閉じたら開いた要素へ戻す。
        if (restoreFocus && hidden && (wasOpen || sidebar.contains(document.activeElement)))
          menu?.focus();
        sidebar.inert = hidden;
      }
      // モバイルのドロワー表示中は、チェックリストを含む本文をキーボード操作の対象から外す。
      if (guideContent) guideContent.inert = mobile && open;
      // 先頭リンクへの移動は閉→開の遷移時だけ。resize の再同期で利用者のフォーカス位置を奪わない。
      if (mobile && open && !wasOpen) links[0]?.focus();
      wasOpen = open;
    };
    const close = () => sync(false);
    // サイトメニューを開くときはドロワーを閉じる。フォーカスはサイトのハンバーガーに残す。
    const closeForSiteMenu = () => {
      if (wasOpen) sync(false, false);
    };
    const toggle = () => sync(!root?.classList.contains(styles.open));
    /** 開いたモバイルドロワーでは、Tab 移動をメニューと目次リンクの間で DOM 順に循環させる。 */
    const containFocus = (event: KeyboardEvent) => {
      if (!menu || !wasOpen || window.innerWidth > 900) return;
      const stops = [menu, ...links];
      const first = stops[0];
      const last = stops[stops.length - 1];
      const edge = event.shiftKey ? first : last;
      const active = document.activeElement;
      // 範囲内かつ端以外ならブラウザ既定の移動に任せる。
      if (active !== edge && stops.some((stop) => stop === active)) return;
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") containFocus(e);
    };
    const update = () => {
      let current = 0;
      links.forEach((a, i) => {
        const section = document.getElementById((a.getAttribute("href") ?? "").slice(1));
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
      const menuHadFocus = document.activeElement === menu;
      sync(window.innerWidth <= 900 && Boolean(root?.classList.contains(styles.open)));
      update();
      // デスクトップ幅ではメニューボタンが非表示になる。そこに残ったフォーカスを、現在のセクションの
      // 目次リンク（無ければ先頭）へ移す。sync で inert を解除し、update で選択を確定した後に移す。
      // メニュー以外（目次内など）にあるフォーカスは動かさない。
      if (window.innerWidth > 900 && menuHadFocus)
        (links.find((a) => a.getAttribute("aria-current") === "location") ?? links[0])?.focus();
    };
    // 原本と同じUL単位で集計し、進捗DOMもそのリスト直前の表示へ限定する。
    const disposeChecklists = Array.from(
      root?.querySelectorAll<HTMLUListElement>(`ul.${styles.checklist}`) ?? []
    ).map((list) => {
      const boxes = Array.from(list.querySelectorAll<HTMLInputElement>("input[data-guide-check]"));
      const panel = list.previousElementSibling;
      const count = panel?.querySelector<HTMLElement>("[data-check-count]");
      const total = panel?.querySelector<HTMLElement>("[data-check-total]");
      const bar = panel?.querySelector<HTMLElement>("[data-check-bar]");
      const progress = () => {
        boxes.forEach((box) => {
          box.closest("li")?.classList.toggle(styles.done, box.checked);
        });
        const n = boxes.filter((box) => box.checked).length;
        if (count) count.textContent = String(n);
        if (total) total.textContent = String(boxes.length);
        if (bar) bar.style.width = `${boxes.length ? (n / boxes.length) * 100 : 0}%`;
      };
      boxes.forEach((box) => {
        box.addEventListener("change", progress);
      });
      progress();
      return () => {
        boxes.forEach((box) => {
          box.removeEventListener("change", progress);
        });
      };
    });
    menu?.addEventListener("click", toggle);
    siteHamburger?.addEventListener("click", closeForSiteMenu);
    backdrop?.addEventListener("click", close);
    document.addEventListener("keydown", key);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", resize);
    links.forEach((a) => {
      a.addEventListener("click", close);
    });
    sync(false);
    update();
    return () => {
      menu?.removeEventListener("click", toggle);
      siteHamburger?.removeEventListener("click", closeForSiteMenu);
      backdrop?.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      links.forEach((a) => {
        a.removeEventListener("click", close);
      });
      disposeChecklists.forEach((dispose) => {
        dispose();
      });
      root?.classList.remove(styles.open);
      // 開状態のまま解除されても、メニューの aria 状態を閉に戻す。
      menu?.setAttribute("aria-expanded", "false");
      menu?.setAttribute("aria-label", "目次を開く");
      if (sidebar) sidebar.inert = false;
      if (guideContent) guideContent.inert = false;
    };
  }, [idPrefix, styles]);
  return null;
}
