import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

function setInnerWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
}

function renderToc() {
  return render(
    <div>
      <button type="button" id="navToggle" aria-label="目次を開く" aria-expanded="false" />
      <div id="scrim" />
      <aside id="sidebar" className={styles.sidebar}>
        <nav className={styles.navlist}>
          <a href="#s1">S1</a>
          <a href="#s2">S2</a>
        </nav>
      </aside>
      <section id="s1" />
      <section id="s2" />
      <TocObserver />
    </div>
  );
}

beforeEach(() => {
  // requestAnimationFrame をコールバック即時実行にスタブし、スクロールスパイを決定論的にする
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ai-engineering-guide TocObserver - mobile sidebar", () => {
  it("marks the sidebar inert on mount at mobile widths", () => {
    setInnerWidth(500);
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(true);
  });

  it("does not mark the sidebar inert on mount at desktop widths", () => {
    setInnerWidth(1200);
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(false);
  });

  it("opens the sidebar via navToggle, clears inert, and focuses the first nav link", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle);

    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.classList.contains(styles.isHidden)).toBe(true);
    expect(sidebar.inert).toBe(false);
    expect(document.activeElement).toBe(sidebar.querySelector(`.${styles.navlist} a`));
  });

  it("closes the sidebar via navToggle and restores focus to navToggle", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle); // open
    fireEvent.click(toggle); // close

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.inert).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it("closes the sidebar when the scrim is clicked", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const scrim = document.getElementById("scrim") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.click(scrim);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(scrim.classList.contains(styles.show)).toBe(false);
  });

  it("closes the sidebar on Escape key", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("closes the sidebar when a nav link is clicked at mobile widths", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const link = sidebar.querySelector(`.${styles.navlist} a`) as HTMLAnchorElement;

    fireEvent.click(toggle);
    fireEvent.click(link);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("leaves the sidebar open when a nav link is clicked at desktop widths", () => {
    setInnerWidth(1200);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const link = sidebar.querySelector(`.${styles.navlist} a`) as HTMLAnchorElement;

    fireEvent.click(toggle);
    fireEvent.click(link);

    expect(sidebar.classList.contains(styles.open)).toBe(true);
  });

  it("closes and re-hides the sidebar when resized past the breakpoint to desktop width", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle); // open at mobile width
    setInnerWidth(1200);
    fireEvent(window, new Event("resize"));

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(sidebar.inert).toBe(false);
  });

  it("moves focus to navToggle instead of trapping it inside the sidebar as it becomes inert", () => {
    setInnerWidth(500);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    const link = sidebar.querySelector(`.${styles.navlist} a`) as HTMLAnchorElement;

    // sidebar は開かれていない (hidden = true) が、リンクへ直接フォーカスが入っているケースを再現する
    link.focus();
    expect(document.activeElement).toBe(link);

    // モバイル幅のまま resize を発火させ、syncSidebarInert を直接再実行させる
    fireEvent(window, new Event("resize"));

    expect(document.activeElement).toBe(toggle);
    expect(sidebar.inert).toBe(true);
  });
});

describe("ai-engineering-guide TocObserver - scroll spy", () => {
  it("activates the nav link whose section has scrolled past the threshold", () => {
    setInnerWidth(1200);
    const { container } = renderToc();
    const s1 = container.querySelector("#s1") as HTMLElement;
    const s2 = container.querySelector("#s2") as HTMLElement;
    const links = container.querySelectorAll(`.${styles.navlist} a`);

    vi.spyOn(s1, "getBoundingClientRect").mockReturnValue({ top: -50 } as DOMRect);
    vi.spyOn(s2, "getBoundingClientRect").mockReturnValue({ top: 500 } as DOMRect);

    fireEvent.scroll(window);

    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });

  it("removes scroll and resize listeners on unmount", () => {
    setInnerWidth(1200);
    const { unmount } = renderToc();
    unmount();
    expect(() => fireEvent.scroll(window)).not.toThrow();
    expect(() => fireEvent(window, new Event("resize"))).not.toThrow();
  });
});
