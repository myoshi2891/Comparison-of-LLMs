"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function TocObserver() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      '[data-page="knowledge-graphs-and-llms-in-action"]'
    );
    if (!root) return;
    let mounted = true;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("a[data-nav-target]"));
    const targets = new Map<Element, HTMLAnchorElement>();
    for (const link of links) {
      const target = document.getElementById(link.hash.slice(1));
      if (target) targets.set(target, link);
    }
    function updateActiveLink() {
      // Compare viewport coordinates directly so large jumps and restored scroll
      // positions work even when no short heading crosses the observer band.
      const headerHeight =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height")
        ) || 60;
      const activationLine = headerHeight + 80;
      let current = targets.values().next().value;
      for (const [target, link] of targets) {
        if (target.getBoundingClientRect().top <= activationLine) current = link;
      }
      for (const link of links) {
        link.classList.toggle(styles.active, link === current);
        if (link === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => targets.has(entry.target))) updateActiveLink();
            },
            { rootMargin: "-20% 0px -70% 0px" }
          )
        : null;
    for (const target of targets.keys()) observer?.observe(target);
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
    updateActiveLink();
    const states = new Map<
      HTMLButtonElement,
      { children: Node[]; timer?: ReturnType<typeof setTimeout> }
    >();
    for (const button of root.querySelectorAll<HTMLButtonElement>("button[data-copy-target]")) {
      states.set(button, {
        children: Array.from(button.childNodes).map((node) => node.cloneNode(true)),
      });
    }
    function fallbackCopy(text: string): boolean {
      const previous = document.activeElement;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      root?.appendChild(textarea);
      try {
        textarea.focus();
        textarea.select();
        return document.execCommand("copy");
      } catch {
        return false;
      } finally {
        textarea.remove();
        if (previous instanceof HTMLElement) previous.focus();
      }
    }
    function copied(button: HTMLButtonElement) {
      const state = states.get(button);
      if (!mounted || !state) return;
      clearTimeout(state.timer);
      button.classList.add(styles.copied);
      const icon = document.createElement("i");
      icon.className = "ti ti-check";
      button.replaceChildren(icon, document.createTextNode("コピー済み"));
      state.timer = setTimeout(() => {
        button.classList.remove(styles.copied);
        button.replaceChildren(...state.children.map((node) => node.cloneNode(true)));
      }, 1600);
    }
    async function copy(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("button[data-copy-target]");
      if (!button || !states.has(button)) return;
      const code = document.getElementById(button.dataset.copyTarget ?? "");
      if (!code || !root?.contains(code)) return;
      const text = code.textContent ?? "";
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          copied(button);
          return;
        } catch {
          if (!mounted) return;
        }
      }
      if (fallbackCopy(text)) copied(button);
    }
    root.addEventListener("click", copy);
    return () => {
      mounted = false;
      observer?.disconnect();
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("resize", updateActiveLink);
      root.removeEventListener("click", copy);
      for (const state of states.values()) clearTimeout(state.timer);
    };
  }, []);
  return null;
}
