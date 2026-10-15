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
    <>
      <button type="button" id="sidebarToggle" />
      <div data-testid="layout-root">
        <nav id="sidebar">
          <a href="#intro" className="nav-link">
            Intro
          </a>
          <a href="#ch%E2%91%A0" className="nav-link">
            Chapter 1
          </a>
          <a href="#missing" className="nav-link">
            Missing
          </a>
          <a href="https://example.com" className="nav-link">
            External
          </a>
        </nav>
        <section id="intro" />
        <section id="ch①" />
        <div className="checklist-card">
          <span className="checklist-progress" />
          <input type="checkbox" aria-label="a" />
          <input type="checkbox" aria-label="b" />
        </div>
        <div className="checklist-card">
          <input type="checkbox" aria-label="c" />
        </div>
      </div>
      <TocObserver />
    </>
  );
}

const byId = (id: string) => document.getElementById(id) as HTMLElement;
const activeHrefs = () =>
  Array.from(document.querySelectorAll(`#sidebar .${styles.active}`)).map((a) =>
    a.getAttribute("href")
  );

function intersect(id: string, isIntersecting: boolean) {
  const target = byId(id);
  const bounds = target.getBoundingClientRect();
  act(() =>
    callback(
      [
        {
          target,
          isIntersecting,
          time: 0,
          rootBounds: null,
          boundingClientRect: bounds,
          intersectionRect: bounds,
          intersectionRatio: isIntersecting ? 1 : 0,
        },
      ],
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
    }
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("Hands-On LLM TocObserver", () => {
  it("toggles the sidebar and syncs aria-expanded", () => {
    // Arrange
    fixture();
    // Act
    fireEvent.click(byId("sidebarToggle"));
    // Assert
    expect(byId("sidebar").classList.contains(styles.open)).toBe(true);
    expect(byId("sidebarToggle").getAttribute("aria-expanded")).toBe("true");

    // Act
    fireEvent.click(byId("sidebarToggle"));
    // Assert
    expect(byId("sidebar").classList.contains(styles.open)).toBe(false);
    expect(byId("sidebarToggle").getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the sidebar when a nav link is clicked", () => {
    // Arrange
    fixture();
    fireEvent.click(byId("sidebarToggle"));
    // Act
    fireEvent.click(document.querySelector('a[href="#intro"]') as HTMLAnchorElement);
    // Assert
    expect(byId("sidebar").classList.contains(styles.open)).toBe(false);
    expect(byId("sidebarToggle").getAttribute("aria-expanded")).toBe("false");
  });

  it("counts checked items per checklist card", () => {
    // Arrange
    fixture();
    const progress = document.querySelector(".checklist-progress") as HTMLElement;
    // Assert（初期表示）
    expect(progress.textContent).toBe("0 / 2 完了");
    // Act
    fireEvent.click(document.querySelector('input[aria-label="a"]') as HTMLInputElement);
    // Assert
    expect(progress.textContent).toBe("1 / 2 完了");
  });

  it("observes only existing anchor targets, decoding encoded ids", () => {
    // Arrange / Act
    fixture();
    // Assert
    expect(construct).toHaveBeenCalledWith({
      root: null,
      rootMargin: "-15% 0px -75% 0px",
      threshold: 0,
    });
    expect(observe.mock.calls.map(([target]) => target.id)).toEqual(["intro", "ch①"]);
  });

  it("moves the active link to the entering section and ignores exits", () => {
    // Arrange
    fixture();
    // Act
    intersect("intro", true);
    intersect("ch①", true);
    intersect("intro", false);
    // Assert
    expect(activeHrefs()).toEqual(["#ch%E2%91%A0"]);
  });

  it("skips scroll-spy when IntersectionObserver is unavailable", () => {
    // Arrange
    vi.stubGlobal("IntersectionObserver", undefined);
    // Act
    const { unmount } = fixture();
    // Assert
    expect(construct).not.toHaveBeenCalled();
    unmount();
    expect(disconnect).not.toHaveBeenCalled();
  });

  it("removes listeners and disconnects on unmount", () => {
    // Arrange
    const { unmount } = fixture();
    const toggle = byId("sidebarToggle");
    const sidebar = byId("sidebar");
    // Act
    unmount();
    fireEvent.click(toggle);
    // Assert
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });
});
