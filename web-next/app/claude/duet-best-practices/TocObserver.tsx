"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

/** コピー成功表示を出し、1600ms 後に元へ戻す。タイマーは解除用の Set で追跡する。 */
function showCopied(button: HTMLButtonElement, timers: Set<ReturnType<typeof setTimeout>>) {
  button.textContent = "コピー済み";
  button.classList.add(styles.done);
  const timer = setTimeout(() => {
    button.textContent = "コピー";
    button.classList.remove(styles.done);
    timers.delete(timer);
  }, 1600);
  timers.add(timer);
}

export default function TocObserver() {
  useEffect(() => {
    const root = document.getElementById("duet-guide");
    const sidebar = document.getElementById("duet-sidebar");
    const menu = document.getElementById("duet-menu");
    const backdrop = document.getElementById("duet-backdrop");
    const mobileBar = document.getElementById("duet-mobile-bar");
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const main = root?.querySelector("main") ?? null;
    let alive = true;
    let wasOpen = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();
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
      const max = h.scrollHeight - h.clientHeight;
      const progress = document.getElementById("progress");
      if (progress)
        progress.style.width = `${Math.min(100, Math.max(0, max > 0 ? (h.scrollTop / max) * 100 : 0))}%`;
      let current = 0;
      links.forEach((link, index) => {
        const section = document.getElementById(link.hash.slice(1));
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
      sync(window.innerWidth <= 900 && Boolean(root?.classList.contains(styles.open)));
      update();
    };
    const buttons = Array.from(root?.querySelectorAll<HTMLButtonElement>("[data-copy-code]") ?? []);
    const copyHandlers = buttons.map((button) => {
      const copy = () => {
        const code = button.closest(`.${styles["code-block"]}`)?.querySelector("code");
        if (!code) return;
        const done = () => {
          if (!alive) return;
          showCopied(button, timers);
        };
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(code.textContent ?? "").then(done, () => undefined);
          return;
        }
        const textarea = document.createElement("textarea");
        textarea.value = code.textContent ?? "";
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        try {
          if (document.execCommand("copy")) done();
        } catch {
          // A denied or unavailable copy operation must not show a success message.
        } finally {
          textarea.remove();
          button.focus();
        }
      };
      button.addEventListener("click", copy);
      return [button, copy] as const;
    });

    const cleanups: Array<() => void> = [];
    const listen = (element: Element | null, event: string, handler: () => void) => {
      element?.addEventListener(event, handler);
      cleanups.push(() => element?.removeEventListener(event, handler));
    };
    const boxes = Array.from(
      root?.querySelectorAll<HTMLInputElement>(`li.${styles.task} input`) ?? []
    );
    const cards = Array.from(root?.querySelectorAll<HTMLElement>(`.${styles["check-card"]}`) ?? []);
    const overall = root?.querySelector<HTMLElement>("#check-overall");
    const setText = (parent: Element | null | undefined, selector: string, value: string) => {
      const node = parent?.querySelector(selector);
      if (node) node.textContent = value;
    };
    const setBar = (parent: Element | null | undefined, percent: number) => {
      const bar = parent?.querySelector<HTMLElement>(`.${styles["check-bar"]} i`);
      if (bar) bar.style.width = `${percent}%`;
    };
    const refresh = () => {
      const done = boxes.filter((b) => b.checked).length;
      for (const card of cards) {
        const inputs = Array.from(
          card.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        );
        const n = inputs.length,
          d = inputs.filter((b) => b.checked).length;
        inputs.forEach((b) => {
          b.closest("li")?.classList.toggle(styles.done, b.checked);
        });
        setText(card, `.${styles["check-count"]}`, `${(d === n ? "完了 " : "") + d} / ${n}`);
        setBar(card, n ? (d / n) * 100 : 0);
        card.classList.toggle(styles.complete, n > 0 && n === d);
      }
      const percent = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
      setText(overall, `.${styles["ov-num"]}`, `${percent}%`);
      setText(overall, `.${styles["ov-sub"]}`, `${done} / ${boxes.length} 項目`);
      setBar(overall, percent);
      overall?.classList.toggle(styles.complete, boxes.length > 0 && done === boxes.length);
    };
    const save = () => {
      try {
        localStorage.setItem(
          "duet-guide-checks-v1",
          JSON.stringify(boxes.flatMap((b, i) => (b.checked ? [i] : [])))
        );
      } catch {
        /* Storage may be unavailable; the checklist still works in memory. */
      }
      refresh();
    };
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("duet-guide-checks-v1") ?? "[]");
      if (Array.isArray(saved))
        boxes.forEach((b, i) => {
          b.checked = saved.includes(i);
        });
    } catch {
      /* A corrupt or blocked store starts with unchecked items. */
    }
    refresh();
    boxes.forEach((b) => {
      listen(b, "change", save);
    });
    listen(root?.querySelector("#check-reset") ?? null, "click", () => {
      boxes.forEach((b) => {
        b.checked = false;
      });
      save();
    });
    const items = Array.from(
      root?.querySelectorAll<HTMLDetailsElement>(`.${styles["faq-item"]}`) ?? []
    );
    const search = root?.querySelector<HTMLInputElement>("#faq-filter");
    const filter = () => {
      const query = (search?.value ?? "").trim().toLowerCase();
      let count = 0;
      items.forEach((item) => {
        const matches = !query || (item.textContent ?? "").toLowerCase().includes(query);
        item.classList.toggle(styles.hide, !matches);
        if (matches) {
          count++;
          if (query) item.open = true;
        }
      });
      setText(root, "#faq-hit", query ? `${count} 件` : "");
      const none = root?.querySelector<HTMLElement>("#faq-none");
      if (none) none.hidden = !(query && count === 0);
    };
    listen(search ?? null, "input", filter);
    listen(root?.querySelector("#faq-open") ?? null, "click", () => {
      items.forEach((item) => {
        if (!item.classList.contains(styles.hide)) item.open = true;
      });
    });
    listen(root?.querySelector("#faq-close") ?? null, "click", () => {
      items.forEach((item) => {
        item.open = false;
      });
    });

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
      alive = false;
      cleanups.forEach((dispose) => {
        dispose();
      });
      timers.forEach(clearTimeout);
      observer?.disconnect();
      menu?.removeEventListener("click", toggle);
      backdrop?.removeEventListener("click", close);
      document.removeEventListener("keydown", key);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", resize);
      links.forEach((link) => {
        link.removeEventListener("click", close);
      });
      copyHandlers.forEach(([button, copy]) => {
        button.removeEventListener("click", copy);
      });
      root?.classList.remove(styles.open);
      root?.style.removeProperty("--mobile-bar-height");
      if (sidebar) sidebar.inert = false;
      if (main) main.inert = false;
    };
  }, []);
  return null;
}
