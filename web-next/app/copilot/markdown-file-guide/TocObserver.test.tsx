// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TocObserver } from "./TocObserver";
import styles from "./page.module.css";

describe("TocObserver Component", () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: observeMock,
          disconnect: disconnectMock,
          unobserve: vi.fn(),
          takeRecords: vi.fn(() => []),
          root: null,
          rootMargin: "",
          thresholds: [],
        };
      })
    );
  });

  it("registers observer on section[id] elements and cleans up on unmount", () => {
    document.body.innerHTML = `
      <div id="sidebarToggle"></div>
      <div id="sidebar"></div>
      <div id="sidebarOverlay"></div>
      <section id="overview"></section>
      <section id="step-repo-instructions"></section>
    `;

    const { unmount } = render(<TocObserver />);
    expect(observeMock).toHaveBeenCalledTimes(2);

    unmount();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it("handles sidebar toggle clicks and overlay clicks", () => {
    document.body.innerHTML = `
      <button id="sidebarToggle" aria-expanded="false"></button>
      <div id="sidebar"></div>
      <div id="sidebarOverlay"></div>
    `;

    render(<TocObserver />);

    const toggleBtn = document.getElementById("sidebarToggle")!;
    const sidebar = document.getElementById("sidebar")!;
    const overlay = document.getElementById("sidebarOverlay")!;

    // Open
    fireEvent.click(toggleBtn);
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(overlay.classList.contains(styles.open)).toBe(true);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");

    // Close via toggle button
    fireEvent.click(toggleBtn);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(overlay.classList.contains(styles.open)).toBe(false);
    expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");

    // Open again and close via overlay
    fireEvent.click(toggleBtn);
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    fireEvent.click(overlay);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("updates active TOC link on intersection change", () => {
    document.body.innerHTML = `
      <a class="${styles.navLink}" href="#overview">Overview</a>
      <a class="${styles.navLink}" href="#step-repo-instructions">Repo Instructions</a>
      <section id="overview"></section>
      <section id="step-repo-instructions"></section>
    `;

    render(<TocObserver />);

    const overviewSec = document.getElementById("overview")!;
    overviewSec.getBoundingClientRect = () =>
      ({ top: 10, bottom: 200, left: 0, right: 100, width: 100, height: 190 }) as DOMRect;

    const repoSec = document.getElementById("step-repo-instructions")!;
    repoSec.getBoundingClientRect = () =>
      ({ top: 300, bottom: 500, left: 0, right: 100, width: 100, height: 200 }) as DOMRect;

    // Simulate overview section intersecting
    observerCallback(
      [
        {
          target: overviewSec,
          isIntersecting: true,
          boundingClientRect: overviewSec.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: overviewSec.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );

    const links = document.querySelectorAll(`.${styles.navLink}`);
    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });
});
