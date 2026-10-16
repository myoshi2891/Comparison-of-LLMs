// @vitest-environment jsdom
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let callback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();
const construct = vi.fn();

function fixture() {
  return render(
    <div className={styles.layout} data-testid="layout-root">
      <button
        type="button"
        id="sidebarToggle"
        className={styles.sidebarToggle}
        aria-label="メニューを開く"
      />
      <div id="sidebarOverlay" className={styles.sidebarOverlay} />
      <nav id="sidebar" className={styles.sidebar}>
        <a href="#intro" className={`${styles.navLink} ${styles.active}`} aria-current="location">
          Intro
        </a>
        <a href="#ch1" className={styles.navLink}>
          Chapter 1
        </a>
        <a href="#missing" className={styles.navLink}>
          Missing
        </a>
      </nav>
      <header id="intro" />
      <section id="ch1" />
      <div className="checklist-card">
        <span className="checklist-done">0</span>
        <input type="checkbox" className="checklist-checkbox" aria-label="task1" />
        <input type="checkbox" className="checklist-checkbox" aria-label="task2" />
      </div>
      <TocObserver />
    </div>
  );
}

const byId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el;
};

const active = () =>
  Array.from(document.querySelectorAll(`#sidebar .${styles.active}`)).map((link) => [
    link.getAttribute("href"),
    link.getAttribute("aria-current"),
  ]);

function intersect(entries: { id: string; isIntersecting: boolean }[]) {
  act(() =>
    callback(
      entries.map((entry) => {
        const target = document.getElementById(entry.id) ?? document.createElement("section");
        const bounds = target.getBoundingClientRect();
        return {
          target,
          isIntersecting: entry.isIntersecting,
          time: 0,
          rootBounds: null,
          boundingClientRect: bounds,
          intersectionRect: bounds,
          intersectionRatio: entry.isIntersecting ? 1 : 0,
        };
      }),
      {} as IntersectionObserver
    )
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(handler: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        callback = handler;
        construct(options);
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "";
      thresholds = [];
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Reliable Machine Learning ガイド TocObserver", () => {
  it("O-1: サイドバートグルボタンのクリックで open クラスと aria-expanded をトグルする", () => {
    fixture();
    const toggle = byId("sidebarToggle");
    const sidebar = byId("sidebar");

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("O-2: オーバーレイまたはナビリンクをクリックするとサイドバーが閉じる", () => {
    fixture();
    const toggle = byId("sidebarToggle");
    const sidebar = byId("sidebar");
    const overlay = byId("sidebarOverlay");

    // オーバーレイクローズ
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    fireEvent.click(overlay);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    // ナビリンククローズ
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    const link = document.querySelector('a[href="#intro"]') as HTMLAnchorElement;
    fireEvent.click(link);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("O-3: チェックボックスの状態変更で .checklist-done カウンターを更新する", () => {
    fixture();
    const done = document.querySelector(".checklist-done") as HTMLElement;
    expect(done.textContent).toBe("0");

    const checkbox1 = document.querySelector('input[aria-label="task1"]') as HTMLInputElement;
    fireEvent.click(checkbox1);
    expect(done.textContent).toBe("1");

    const checkbox2 = document.querySelector('input[aria-label="task2"]') as HTMLInputElement;
    fireEvent.click(checkbox2);
    expect(done.textContent).toBe("2");

    fireEvent.click(checkbox1);
    expect(done.textContent).toBe("1");
  });

  it("O-4: スクロール交差時にアクティブリンクと aria-current を更新する", () => {
    fixture();
    expect(active()).toEqual([["#intro", "location"]]);

    intersect([{ id: "ch1", isIntersecting: true }]);
    expect(active()).toEqual([["#ch1", "location"]]);

    intersect([{ id: "ch1", isIntersecting: false }]);
    expect(active()).toEqual([["#ch1", "location"]]);
  });

  it("O-6: 不正なパーセントエスケープのフラグメントでも例外を出さず、生のフラグメントで対応付ける", () => {
    // Arrange
    const rawId = "%E0%A4%A";
    const view = render(
      <div>
        <nav id="sidebar" className={styles.sidebar}>
          <a href="#intro" className={`${styles.navLink} ${styles.active}`}>
            Intro
          </a>
          <a href={`#${rawId}`} className={styles.navLink}>
            Broken
          </a>
        </nav>
        <header id="intro" />
        <section id={rawId} />
        <TocObserver />
      </div>
    );

    // Act
    intersect([{ id: rawId, isIntersecting: true }]);

    // Assert
    expect(active()).toEqual([[`#${rawId}`, "location"]]);
    view.unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("O-5: CSS Modules クラス (styles.checklistCard) でレンダリングされた場合でもカウンターと完了スタイルが連動する", () => {
    render(
      <div>
        <div className={styles.checklistCard} data-total="2">
          <div className={styles.checklistCounter}>
            <span className={styles.checklistDone}>0</span>/2
          </div>
          <ul className={styles.checklistList}>
            <li className={styles.checklistItem}>
              <label>
                <input
                  className={styles.checklistCheckbox}
                  type="checkbox"
                  aria-label="mod-task1"
                />
                <span className={styles.checklistText}>Task 1</span>
              </label>
            </li>
            <li className={styles.checklistItem}>
              <label>
                <input
                  className={styles.checklistCheckbox}
                  type="checkbox"
                  aria-label="mod-task2"
                />
                <span className={styles.checklistText}>Task 2</span>
              </label>
            </li>
          </ul>
        </div>
        <TocObserver />
      </div>
    );

    const done = document.querySelector(`.${styles.checklistDone}`) as HTMLElement;
    expect(done.textContent).toBe("0");

    const checkbox1 = document.querySelector('input[aria-label="mod-task1"]') as HTMLInputElement;
    const item1 = checkbox1.closest(`.${styles.checklistItem}`) as HTMLElement;

    fireEvent.click(checkbox1);
    expect(done.textContent).toBe("1");
    expect(item1.classList.contains("done") || item1.classList.contains(styles.done)).toBe(true);

    const checkbox2 = document.querySelector('input[aria-label="mod-task2"]') as HTMLInputElement;
    fireEvent.click(checkbox2);
    expect(done.textContent).toBe("2");

    fireEvent.click(checkbox1);
    expect(done.textContent).toBe("1");
    expect(item1.classList.contains("done") || item1.classList.contains(styles.done)).toBe(false);
  });
});
