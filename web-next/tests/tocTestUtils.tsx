/**
 * TocObserver 系クライアントコンポーネントのテスト用共通スタブ／スイートファクトリ。
 *
 * jsdom は IntersectionObserver / matchMedia を実装しないため、
 * 各 TocObserver.test.tsx はここで提供するスタブを注入して
 * スクロールスパイとモバイルナビの分岐を決定論的に検証する。
 */

import { cleanup, fireEvent, render } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, beforeEach, expect, test } from "vitest";

export type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

export interface IntersectionObserverController {
  /** observe() に渡された要素 */
  readonly observedTargets: Element[];
  /** disconnect() の呼び出し回数 */
  readonly disconnectCount: number;
  /** 直近に生成された observer のコールバックへ entries を流し込む */
  emit(entries: Array<Partial<IntersectionObserverEntry>>): void;
}

/**
 * global.IntersectionObserver を制御可能なスタブへ差し替える。
 * 返り値の emit() でコールバックを任意のタイミングで発火できる。
 */
export function installIntersectionObserverStub(): IntersectionObserverController {
  const state = {
    callback: null as ObserverCallback | null,
    observedTargets: [] as Element[],
    disconnectCount: 0,
  };

  class IntersectionObserverStub {
    constructor(callback: ObserverCallback) {
      state.callback = callback;
    }
    observe(target: Element) {
      state.observedTargets.push(target);
    }
    unobserve() {
      /* noop */
    }
    disconnect() {
      state.disconnectCount += 1;
    }
    takeRecords() {
      return [];
    }
  }

  global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

  return {
    get observedTargets() {
      return state.observedTargets;
    },
    get disconnectCount() {
      return state.disconnectCount;
    },
    emit(entries) {
      state.callback?.(entries);
    },
  };
}

type MediaListener = (event: { matches: boolean }) => void;

export interface MatchMediaController {
  /** matches を更新し登録済みリスナへ change を通知する */
  setMatches(value: boolean): void;
  /** 現在登録されているリスナ数（cleanup 検証用） */
  readonly listenerCount: number;
}

/**
 * window.matchMedia を制御可能なスタブへ差し替える。
 * addEventListener/addListener 両 API を受け付け、setMatches で change を発火する。
 */
export function installMatchMediaStub(initialMatches: boolean): MatchMediaController {
  let matches = initialMatches;
  const listeners = new Set<MediaListener>();

  const mql = {
    get matches() {
      return matches;
    },
    media: "(max-width: 900px)",
    onchange: null,
    addEventListener: (_type: string, cb: MediaListener) => {
      listeners.add(cb);
    },
    removeEventListener: (_type: string, cb: MediaListener) => {
      listeners.delete(cb);
    },
    addListener: (cb: MediaListener) => {
      listeners.add(cb);
    },
    removeListener: (cb: MediaListener) => {
      listeners.delete(cb);
    },
    dispatchEvent: () => true,
  };

  window.matchMedia = ((_query: string) => mql) as unknown as typeof window.matchMedia;

  return {
    setMatches(value: boolean) {
      matches = value;
      for (const cb of listeners) {
        cb({ matches });
      }
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

type Styles = Record<string, string>;

interface InlineNavTocConfig {
  /** テスト対象コンポーネント */
  TocObserver: ComponentType;
  /** 対象ページの page.module.css プロキシ */
  styles: Styles;
  /** observer が監視する section の className（プレーン section の場合は "") */
  sectionClassName: string;
  /** モバイルナビのトグルボタン id */
  toggleId: string;
  /** モバイルナビのリスト id */
  listId: string;
}

/**
 * インライン IntersectionObserver + モバイルナビ（navListOpen 方式）を持つ
 * TocObserver 向けの共通テストスイートを登録する（Group B1）。
 */
export function registerInlineNavTocSuite({
  TocObserver,
  styles,
  sectionClassName,
  toggleId,
  listId,
}: InlineNavTocConfig): void {
  let io: IntersectionObserverController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  function renderToc() {
    return render(
      <div>
        <nav>
          <button type="button" id={toggleId} aria-label="目次" />
          <ul id={listId}>
            <li>
              <a className={styles.tocLink} href="#s1">
                S1
              </a>
            </li>
            <li>
              <a className={styles.tocLink} href="#s2">
                S2
              </a>
            </li>
          </ul>
        </nav>
        <section id="s1" className={sectionClassName || undefined} />
        <section id="s2" className={sectionClassName || undefined} />
        <TocObserver />
      </div>
    );
  }

  test("observes both sections and activates the first TOC link initially", () => {
    const { container } = renderToc();
    expect(io.observedTargets).toHaveLength(2);
    const links = container.querySelectorAll(`.${styles.tocLink}`);
    expect(links[0].classList.contains(styles.tocLinkActive)).toBe(true);
    expect(links[0].getAttribute("aria-current")).toBe("location");
  });

  test("moves the active link to the intersecting section", () => {
    const { container } = renderToc();
    const sec2 = container.querySelector("#s2") as Element;
    io.emit([{ target: sec2, isIntersecting: true }]);
    const links = container.querySelectorAll(`.${styles.tocLink}`);
    expect(links[1].classList.contains(styles.tocLinkActive)).toBe(true);
    expect(links[1].getAttribute("aria-current")).toBe("location");
    expect(links[0].classList.contains(styles.tocLinkActive)).toBe(false);
    expect(links[0].getAttribute("aria-current")).toBeNull();
  });

  test("toggles the mobile nav open and closed via aria-expanded", () => {
    renderToc();
    const toggle = document.getElementById(toggleId) as HTMLElement;
    const list = document.getElementById(listId) as HTMLElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(list.classList.contains(styles.navListOpen)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(toggle);
    expect(list.classList.contains(styles.navListOpen)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("closes the mobile nav when a link is clicked", () => {
    renderToc();
    const toggle = document.getElementById(toggleId) as HTMLElement;
    const list = document.getElementById(listId) as HTMLElement;
    fireEvent.click(toggle);
    const firstLink = list.querySelector("a") as HTMLElement;
    fireEvent.click(firstLink);
    expect(list.classList.contains(styles.navListOpen)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
}

interface ObserverOnlyTocConfig {
  TocObserver: ComponentType;
  styles: Styles;
  /** observer が監視する section の className（プレーン section の場合は "") */
  sectionClassName: string;
}

/**
 * Registers shared tests for a TocObserver that uses IntersectionObserver without mobile navigation.
 *
 * @param TocObserver - The TocObserver component under test
 * @param styles - CSS class names used by the component
 * @param sectionClassName - Class name applied to observed sections
 */
export function registerObserverOnlyTocSuite({
  TocObserver,
  styles,
  sectionClassName,
}: ObserverOnlyTocConfig): void {
  let io: IntersectionObserverController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  function renderToc() {
    return render(
      <div>
        <nav>
          <a className={styles.tocLink} href="#s1">
            S1
          </a>
          <a className={styles.tocLink} href="#s2">
            S2
          </a>
        </nav>
        <section id="s1" className={sectionClassName || undefined} />
        <section id="s2" className={sectionClassName || undefined} />
        <TocObserver />
      </div>
    );
  }

  test("observes both sections and activates the first TOC link initially", () => {
    const { container } = renderToc();
    expect(io.observedTargets).toHaveLength(2);
    const links = container.querySelectorAll(`.${styles.tocLink}`);
    expect(links[0].classList.contains(styles.tocLinkActive)).toBe(true);
    expect(links[0].getAttribute("aria-current")).toBe("location");
  });

  test("moves the active link to the intersecting section", () => {
    const { container } = renderToc();
    const sec2 = container.querySelector("#s2") as Element;
    io.emit([{ target: sec2, isIntersecting: true }]);
    const links = container.querySelectorAll(`.${styles.tocLink}`);
    expect(links[1].classList.contains(styles.tocLinkActive)).toBe(true);
    expect(links[0].classList.contains(styles.tocLinkActive)).toBe(false);
  });

  test("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
}

interface ClassSelectedObserverTocConfig {
  TocObserver: ComponentType;
  linkClassName: string;
  activeClassName: string;
  sectionClassName: string;
  heroClassName: string;
}

/**
 * Registers shared tests for a `TocObserver` that monitors sections selected by CSS classes, including a hero element.
 *
 * @param TocObserver - The `TocObserver` component under test
 * @param linkClassName - The CSS class applied to TOC links
 * @param activeClassName - The CSS class applied to the active TOC link
 * @param sectionClassName - The CSS class used to select section targets
 * @param heroClassName - The CSS class used to select the hero target
 */
export function registerClassSelectedObserverTocSuite({
  TocObserver,
  linkClassName,
  activeClassName,
  sectionClassName,
  heroClassName,
}: ClassSelectedObserverTocConfig): void {
  let io: IntersectionObserverController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  /**
   * Renders the class-selected observer test fixture with optional TOC links.
   *
   * @param includeLinks - Whether to include the navigation links in the fixture
   * @returns The rendered test fixture
   */
  function renderToc(includeLinks = true) {
    return render(
      <div>
        {includeLinks ? (
          <nav>
            <a className={linkClassName} href="#hero">
              Hero
            </a>
            <a className={linkClassName} href="#s2">
              S2
            </a>
          </nav>
        ) : null}
        <header className={heroClassName} id="hero" />
        <section className={sectionClassName} id="s2" />
        <TocObserver />
      </div>
    );
  }

  test("observes class-selected targets, changes the active link, and disconnects", () => {
    const { container, unmount } = renderToc();
    const links = container.querySelectorAll(`.${linkClassName}`);
    expect(io.observedTargets).toHaveLength(2);
    expect(links[0].classList.contains(activeClassName)).toBe(true);

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: true }]);
    expect(links[0].classList.contains(activeClassName)).toBe(false);
    expect(links[1].classList.contains(activeClassName)).toBe(true);

    unmount();
    expect(io.disconnectCount).toBe(1);
  });

  test("ignores non-intersecting and id-less entries", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${linkClassName}`);
    const idlessTarget = document.createElement("section");

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: false }]);
    io.emit([{ target: idlessTarget, isIntersecting: true }]);

    expect(links[0].classList.contains(activeClassName)).toBe(true);
    expect(links[1].classList.contains(activeClassName)).toBe(false);
  });

  test("handles an empty TOC without throwing", () => {
    const { unmount } = renderToc(false);
    expect(io.observedTargets).toHaveLength(2);
    expect(() => unmount()).not.toThrow();
    expect(io.disconnectCount).toBe(1);
  });
}

interface HrefResolvedObserverTocConfig {
  TocObserver: ComponentType;
  linkClassName: string;
  activeClassName: string;
}

/**
 * Registers a test suite for TocObserver implementations that resolve observation targets from TOC links' href attributes.
 *
 * Verifies that only elements with valid href targets are observed, that non-intersecting entries are ignored, that matching intersecting entries activate the correct link, and that the observer disconnects properly during cleanup. Also tests behavior when no resolvable targets exist.
 */
export function registerHrefResolvedObserverTocSuite({
  TocObserver,
  linkClassName,
  activeClassName,
}: HrefResolvedObserverTocConfig): void {
  let io: IntersectionObserverController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  /**
   * Renders a TOC fixture with links and optionally matching section targets.
   *
   * @param includeTargets - Whether to render the sections referenced by the TOC links.
   * @returns The rendered test fixture.
   */
  function renderToc(includeTargets = true) {
    return render(
      <div>
        <nav>
          <a className={linkClassName} href="#s1">
            S1
          </a>
          <a className={linkClassName} href="#s2">
            S2
          </a>
          <span className={linkClassName}>No href</span>
          <a className={linkClassName} href="#missing">
            Missing target
          </a>
        </nav>
        {includeTargets ? (
          <>
            <section id="s1" />
            <section id="s2" />
          </>
        ) : null}
        <TocObserver />
      </div>
    );
  }

  test("observes only valid href targets and disconnects", () => {
    const { unmount } = renderToc();
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2"]);

    unmount();
    expect(io.disconnectCount).toBe(1);
  });

  test("ignores non-intersecting entries and activates the matching link", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${linkClassName}`);
    const secondSection = container.querySelector("#s2") as Element;

    io.emit([{ target: secondSection, isIntersecting: false }]);
    expect(Array.from(links).some((link) => link.classList.contains(activeClassName))).toBe(false);

    io.emit([{ target: secondSection, isIntersecting: true }]);
    expect(links[0].classList.contains(activeClassName)).toBe(false);
    expect(links[1].classList.contains(activeClassName)).toBe(true);
  });

  test("returns safely when no href resolves to a section", () => {
    const { unmount } = renderToc(false);
    expect(io.observedTargets).toHaveLength(0);
    expect(() => unmount()).not.toThrow();
    expect(io.disconnectCount).toBe(0);
  });
}

interface SidebarTocConfig {
  TocObserver: ComponentType;
  styles: Styles;
  /** サイドバー開閉トグルボタンの id（navToggle / sidebarToggle 等） */
  toggleId: string;
}

/**
 * 共有 hook + matchMedia 連動サイドバー（sidebarOpen 方式）を持つ TocObserver 向けの
 * 共通テストスイートを登録する（Group A）。サイドバー id は "sidebar" 固定。
 */
export function registerSidebarTocSuite({ TocObserver, styles, toggleId }: SidebarTocConfig): void {
  let io: IntersectionObserverController;
  let mm: MatchMediaController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
    mm = installMatchMediaStub(true); // モバイル幅を初期状態とする
  });
  afterEach(() => {
    cleanup();
  });

  function renderToc() {
    return render(
      <div>
        <button type="button" id={toggleId} aria-label="目次を開く" />
        <aside id="sidebar">
          <a className={styles.tocLink} href="#s1">
            S1
          </a>
          <a className={styles.tocLink} href="#s2">
            S2
          </a>
        </aside>
        <section id="s1" />
        <section id="s2" />
        <TocObserver />
      </div>
    );
  }

  test("activates the first TOC link and observes sections via the shared hook", () => {
    const { container } = renderToc();
    expect(io.observedTargets).toHaveLength(2);
    const links = container.querySelectorAll(`.${styles.tocLink}`);
    expect(links[0].classList.contains(styles.tocLinkActive)).toBe(true);
    expect(links[0].getAttribute("aria-current")).toBe("location");
  });

  test("hides the sidebar initially at mobile widths", () => {
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    expect(sidebar.getAttribute("aria-hidden")).toBe("true");
    expect(sidebar.hasAttribute("inert")).toBe(true);
  });

  test("opening the sidebar clears aria-hidden and sets aria-expanded", () => {
    renderToc();
    const toggle = document.getElementById(toggleId) as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(sidebar.hasAttribute("aria-hidden")).toBe(false);
  });

  test("closing the sidebar restores aria-hidden on mobile", () => {
    renderToc();
    const toggle = document.getElementById(toggleId) as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.getAttribute("aria-hidden")).toBe("true");
  });

  test("clicking a sidebar link closes the sidebar", () => {
    renderToc();
    const toggle = document.getElementById(toggleId) as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    fireEvent.click(toggle);
    const link = sidebar.querySelector("a") as HTMLElement;
    fireEvent.click(link);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("responds to a media query change to desktop width", () => {
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    mm.setMatches(false);
    expect(sidebar.hasAttribute("aria-hidden")).toBe(false);
    expect(sidebar.hasAttribute("inert")).toBe(false);
  });

  test("detaches the media listener and disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    expect(mm.listenerCount).toBe(1);
    unmount();
    expect(mm.listenerCount).toBe(0);
    expect(io.disconnectCount).toBe(1);
  });
}
