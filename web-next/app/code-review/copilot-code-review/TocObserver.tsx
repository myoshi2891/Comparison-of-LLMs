"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

/** チェック状態の永続化キー。テストからも参照するため export する。 */
export const CHECKLIST_STORAGE_KEY = "copilotCodeReviewGuide.checklist.v1";

export default function TocObserver() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sidebar = document.getElementById("copilotCodeReviewSidebar");
    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add(styles.sidebarOpen);
        sidebar.classList.add("open");
      } else {
        sidebar.classList.remove(styles.sidebarOpen);
        sidebar.classList.remove("open");
      }
    }
  }, [isOpen]);

  // Escape キーでサイドバーを閉じる（オフキャンバス UI の慣習）。
  // 閉じた後はフォーカスをトグルボタンへ戻す。閉状態のサイドバーは
  // visibility: hidden で不活性化されるため、戻さないとフォーカスが宙に浮く。
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // TOC ScrollSpy
  useEffect(() => {
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        "#copilotCodeReviewSidebar a[href^='#'], nav.toc a[href^='#']"
      )
    );
    if (!navLinks.length) return;

    const map = new Map<HTMLElement, HTMLAnchorElement>();
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (href?.startsWith("#")) {
        const id = decodeURIComponent(href.slice(1));
        const el = document.getElementById(id);
        if (el) map.set(el, a);
      }
    });

    const targets = Array.from(map.keys());
    if (!targets.length) return;

    // 交差中の要素を保持し、そのうち最も上にあるものをアクティブにする。
    // entries を順に処理して「最後の交差」を採用すると、複数セクションが同時に
    // 交差したときに下のセクションが勝ってしまう。
    const intersecting = new Set<HTMLElement>();

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) intersecting.add(target);
          else intersecting.delete(target);
        }

        const [topmost] = [...intersecting].sort(
          (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
        );
        if (!topmost) return;

        const link = map.get(topmost);
        if (!link) return;

        for (const a of navLinks) {
          a.classList.remove(styles.active);
          a.classList.remove("active");
        }
        link.classList.add(styles.active);
        link.classList.add("active");
      },
      { root: null, rootMargin: "-15% 0px -75% 0px", threshold: 0 }
    );

    targets.forEach((t) => {
      spy.observe(t);
    });

    return () => spy.disconnect();
  }, []);

  // Checklist Interactivity & LocalStorage Persistence
  useEffect(() => {
    const checklist = document.getElementById("checklistList");
    if (!checklist) return;

    const progressEl = document.getElementById("checklistProgress");
    const resetBtn = document.getElementById("checklistReset");
    const inputs = Array.from(checklist.querySelectorAll<HTMLInputElement>(".check-input"));

    const updateProgress = () => {
      const doneCount = inputs.filter((i) => i.checked).length;
      if (progressEl) {
        progressEl.textContent = `${doneCount} / ${inputs.length} 完了`;
      }
    };

    const loadState = () => {
      try {
        const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
        if (!raw) return;
        const state = JSON.parse(raw);
        if (state && typeof state === "object") {
          inputs.forEach((input) => {
            const key = input.getAttribute("data-key");
            if (key && state[key]) {
              input.checked = true;
              const item = input.closest(".check-item");
              if (item) item.classList.add("done");
            }
          });
        }
      } catch {
        // storage disabled
      }
      updateProgress();
    };

    const saveState = () => {
      const state: Record<string, boolean> = {};
      inputs.forEach((input) => {
        const key = input.getAttribute("data-key");
        if (key) state[key] = input.checked;
      });
      try {
        window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
      } catch {
        // storage disabled
      }
    };

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target?.classList.contains("check-input")) {
        const item = target.closest(".check-item");
        if (item) {
          if (target.checked) {
            item.classList.add("done");
          } else {
            item.classList.remove("done");
          }
        }
        updateProgress();
        saveState();
      }
    };

    const handleReset = () => {
      inputs.forEach((input) => {
        input.checked = false;
        const item = input.closest(".check-item");
        if (item) item.classList.remove("done");
      });
      updateProgress();
      try {
        window.localStorage.removeItem(CHECKLIST_STORAGE_KEY);
      } catch {
        // storage disabled
      }
    };

    loadState();

    checklist.addEventListener("change", handleChange);
    if (resetBtn) resetBtn.addEventListener("click", handleReset);

    return () => {
      checklist.removeEventListener("change", handleChange);
      if (resetBtn) resetBtn.removeEventListener("click", handleReset);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <button
      ref={toggleRef}
      type="button"
      className={styles.menuToggle}
      id="menuToggle"
      aria-label={isOpen ? "目次を閉じる" : "目次を開く"}
      aria-controls="copilotCodeReviewSidebar"
      aria-expanded={isOpen}
      onClick={toggleMenu}
    >
      ☰
    </button>
  );
}
