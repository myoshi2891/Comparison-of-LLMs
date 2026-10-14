import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TocObserver from "./TocObserver";

// 本番と同じく、メニュー・背景幕・Top ボタンは layout-root の兄弟として配置する。
function fixture() {
  return render(
    <>
      <button type="button" id="menuBtn" aria-expanded="false" />
      <div id="sidebarBackdrop" />
      <div data-testid="layout-root">
        <nav>
          <a href="#intro" className="toc-link">
            Intro
          </a>
          <a href="#part1" className="toc-link">
            Part 1
          </a>
          <a href="#missing" className="toc-link">
            Missing
          </a>
          <a href="https://example.com" className="toc-link">
            External
          </a>
        </nav>
        <section id="intro" />
        <section id="part1" />
      </div>
      <button type="button" id="topBtn" />
      <TocObserver />
    </>
  );
}

const byId = (id: string) => document.getElementById(id) as HTMLElement;

// offsetTop は祖先基準の値なので、文書座標（viewport top + scrollY）とわざと食い違わせる。
function setDocumentTop(id: string, documentTop: number, misleadingOffsetTop: number) {
  const el = byId(id);
  Object.defineProperty(el, "offsetTop", { configurable: true, value: misleadingOffsetTop });
  el.getBoundingClientRect = () =>
    ({ top: documentTop - window.scrollY }) as DOMRect;
}

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: y });
    window.dispatchEvent(new Event("scroll"));
  });
}

afterEach(() => {
  document.body.classList.remove("nav-open");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
  vi.restoreAllMocks();
});

describe("Enterprise RAG TocObserver", () => {
  it("does nothing when the layout root is absent", () => {
    // Arrange / Act
    render(<TocObserver />);
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(false);
  });

  it("toggles the mobile sidebar from the menu button outside the layout root", () => {
    // Arrange
    fixture();
    // Act
    fireEvent.click(byId("menuBtn"));
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(true);
    expect(byId("menuBtn").getAttribute("aria-expanded")).toBe("true");

    // Act
    fireEvent.click(byId("menuBtn"));
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(false);
    expect(byId("menuBtn").getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the sidebar from the backdrop", () => {
    // Arrange
    fixture();
    fireEvent.click(byId("menuBtn"));
    // Act
    fireEvent.click(byId("sidebarBackdrop"));
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(false);
    expect(byId("menuBtn").getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the sidebar on TOC link click only at mobile widths", () => {
    // Arrange
    fixture();
    const link = document.querySelector('a[href="#part1"]') as HTMLAnchorElement;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
    fireEvent.click(byId("menuBtn"));
    // Act
    fireEvent.click(link);
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(true);

    // Arrange
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });
    // Act
    fireEvent.click(link);
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(false);
  });

  it("shows the top button after 480px and scrolls back to the top", () => {
    // Arrange
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    fixture();
    // Act
    scrollTo(600);
    // Assert
    expect(byId("topBtn").classList.contains("is-visible")).toBe(true);

    // Act
    fireEvent.click(byId("topBtn"));
    // Assert
    expect(scroll).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });

    // Act
    scrollTo(100);
    // Assert
    expect(byId("topBtn").classList.contains("is-visible")).toBe(false);
  });

  it("marks the last section above the scroll position by document coordinates", () => {
    // Arrange
    fixture();
    setDocumentTop("intro", 0, 0);
    setDocumentTop("part1", 1000, 50);
    const activeHrefs = () =>
      Array.from(document.querySelectorAll(".is-active")).map((a) => a.getAttribute("href"));
    // Act
    scrollTo(0);
    // Assert
    expect(activeHrefs()).toEqual(["#intro"]);

    // Act
    scrollTo(950);
    // Assert
    expect(activeHrefs()).toEqual(["#part1"]);
  });

  it("removes the TOC link click handlers on unmount", () => {
    // Arrange
    const { unmount } = fixture();
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a.toc-link"));
    const added = links.map((link) => vi.spyOn(link, "addEventListener"));
    const removed = links.map((link) => vi.spyOn(link, "removeEventListener"));
    // Act
    unmount();
    // Assert
    expect(added.every((spy) => spy.mock.calls.length === 0)).toBe(true);
    for (const spy of removed) {
      expect(spy).toHaveBeenCalledWith("click", expect.any(Function));
    }
  });

  it("removes listeners and the open state on unmount", () => {
    // Arrange
    const { unmount } = fixture();
    const menuBtn = byId("menuBtn");
    fireEvent.click(menuBtn);
    // Act
    unmount();
    // Assert
    expect(document.body.classList.contains("nav-open")).toBe(false);
  });
});
