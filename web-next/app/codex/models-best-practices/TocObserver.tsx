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
    const root = document.getElementById("openai-guide");
    const sidebar = document.getElementById("openai-sidebar");
    const menu = document.getElementById("openai-menu");
    const backdrop = document.getElementById("openai-backdrop");
    const mobileBar = document.getElementById("openai-mobile-bar");
    const links = Array.from(sidebar?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    let alive = true;
    const timers = new Set<ReturnType<typeof setTimeout>>();
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
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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
    };
  }, []);
  return null;
}
