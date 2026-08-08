import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import TocObserver from "./TocObserver";

let io: ReturnType<typeof installIntersectionObserverStub>;

beforeEach(() => {
  io = installIntersectionObserverStub();
});

describe("Claude skill TocObserver - mobile sidebar contract", () => {
  it("toggles data-open on sidebar and aria-expanded on toggle button, and closes on TOC link click", () => {
    const { container } = render(
      <div>
        <button id="menuToggle" aria-label="メニュー開閉" type="button">
          ≡
        </button>
        <nav id="sidebar">
          <ul className="toc">
            <li>
              <a href="#s0">はじめに</a>
            </li>
          </ul>
        </nav>
        <main>
          <section id="s0">Intro</section>
        </main>
        <TocObserver />
      </div>
    );

    const menuToggle = container.querySelector("#menuToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const tocLink = container.querySelector('a[href="#s0"]') as HTMLAnchorElement;

    expect(sidebar.hasAttribute("data-open")).toBe(false);
    expect(menuToggle.hasAttribute("aria-expanded")).toBe(false);

    // Toggle open
    fireEvent.click(menuToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");
    expect(menuToggle.getAttribute("aria-expanded")).toBe("true");

    // Toggle close
    fireEvent.click(menuToggle);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(menuToggle.getAttribute("aria-expanded")).toBe("false");

    // Open again then click TOC link
    fireEvent.click(menuToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");

    fireEvent.click(tocLink);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(menuToggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("handles back to top click", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const { container } = render(
      <div>
        <button id="backToTop" type="button">
          ↑
        </button>
        <TocObserver backToTopClass="backToTop" backToTopVisibleClass="visible" />
      </div>
    );

    const backToTopBtn = container.querySelector("#backToTop") as HTMLButtonElement;
    fireEvent.click(backToTopBtn);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});

/**
 * window.scrollY を任意の値へ差し替える（jsdom はスクロールを実装しないため）。
 *
 * @param value - 設定する縦スクロール量（px）
 */
function setScrollY(value: number): void {
  Object.defineProperty(window, "scrollY", { value, configurable: true, writable: true });
}

describe("Claude skill TocObserver - scroll spy", () => {
  /**
   * 目次リンクとセクションを含むフィクスチャを描画する。
   *
   * @returns RTL のレンダリング結果
   */
  function renderToc() {
    return render(
      <div>
        <nav id="sidebar">
          <a href="#s1">S1</a>
          <a href="#s2">S2</a>
        </nav>
        <main>
          <section id="s1" />
          <section id="s2" />
        </main>
        <TocObserver />
      </div>
    );
  }

  it("observes every section with an id", () => {
    renderToc();
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2"]);
  });

  it("activates the topmost intersecting section's link", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll("nav a");

    io.emit([
      {
        target: container.querySelector("#s2") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 320 } as DOMRectReadOnly,
      },
      {
        target: container.querySelector("#s1") as Element,
        isIntersecting: true,
        boundingClientRect: { top: -10 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0].classList.contains("toc-active")).toBe(true);
    expect(links[1].classList.contains("toc-active")).toBe(false);
  });

  it("keeps earlier intersecting sections active across partial observer callbacks", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll("nav a");

    io.emit([
      {
        target: container.querySelector("#s1") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 20 } as DOMRectReadOnly,
      },
    ]);
    io.emit([
      {
        target: container.querySelector("#s2") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 120 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0].classList.contains("toc-active")).toBe(true);
    expect(links[1].classList.contains("toc-active")).toBe(false);
  });

  it("ignores callbacks with no intersecting entry", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll("nav a");

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: false }]);

    expect(Array.from(links).some((link) => link.classList.contains("toc-active"))).toBe(false);
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});

describe("Claude skill TocObserver - back to top visibility", () => {
  /**
   * クラス指定で解決するバックトゥトップボタンのフィクスチャを描画する。
   *
   * @returns RTL のレンダリング結果
   */
  function renderBackToTop() {
    return render(
      <div>
        <button type="button" className="backToTop" aria-label="トップへ戻る" />
        <TocObserver backToTopClass="backToTop" backToTopVisibleClass="visible" />
      </div>
    );
  }

  it("resolves the button by class name and hides it near the top of the page", () => {
    setScrollY(0);
    const { container } = renderBackToTop();
    const btn = container.querySelector(".backToTop") as HTMLElement;
    expect(btn.classList.contains("visible")).toBe(false);
  });

  it("shows the button once the page is scrolled past the threshold", () => {
    setScrollY(0);
    const { container } = renderBackToTop();
    const btn = container.querySelector(".backToTop") as HTMLElement;

    setScrollY(400);
    fireEvent.scroll(window);
    expect(btn.classList.contains("visible")).toBe(true);

    setScrollY(10);
    fireEvent.scroll(window);
    expect(btn.classList.contains("visible")).toBe(false);
  });

  it("removes the scroll listener on unmount", () => {
    setScrollY(0);
    const { container, unmount } = renderBackToTop();
    const btn = container.querySelector(".backToTop") as HTMLElement;
    unmount();

    setScrollY(400);
    fireEvent.scroll(window);
    expect(btn.classList.contains("visible")).toBe(false);
  });

  it("skips visibility handling when no visible class is provided", () => {
    setScrollY(400);
    const { container } = render(
      <div>
        <button type="button" className="backToTop" aria-label="トップへ戻る" />
        <TocObserver backToTopClass="backToTop" />
      </div>
    );
    const btn = container.querySelector(".backToTop") as HTMLElement;
    expect(btn.className).toBe("backToTop");
  });
});
