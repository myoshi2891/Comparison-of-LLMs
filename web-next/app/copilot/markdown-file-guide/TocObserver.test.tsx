// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

describe("TocObserver Component", () => {
  let io: ReturnType<typeof installIntersectionObserverStub>;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });

  afterEach(() => {
    cleanup();
  });

  it("registers observer on section[id] elements and cleans up on unmount", () => {
    document.body.innerHTML = `
      <div id="sidebarToggle"></div>
      <div id="sidebar"></div>
      <div id="sidebarOverlay"></div>
      <section id="overview"></section>
      <section id="step-instructions"></section>
    `;

    const { unmount } = render(<TocObserver />);
    expect(io.observedTargets.length).toBe(2);

    unmount();
    expect(io.disconnectCount).toBe(1);
  });

  it("handles sidebar toggle clicks and overlay clicks", () => {
    document.body.innerHTML = `
      <button id="sidebarToggle" aria-expanded="false"></button>
      <div id="sidebar"></div>
      <div id="sidebarOverlay"></div>
    `;

    render(<TocObserver />);

    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    expect(toggleBtn).toBeInstanceOf(HTMLElement);
    expect(sidebar).toBeInstanceOf(HTMLElement);
    expect(overlay).toBeInstanceOf(HTMLElement);
    if (!toggleBtn || !sidebar || !overlay) return;

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
      <a class="${styles.navLink}" href="#step-instructions">Repo Instructions</a>
      <section id="overview"></section>
      <section id="step-instructions"></section>
    `;

    render(<TocObserver />);

    const overviewSec = document.getElementById("overview");
    const repoSec = document.getElementById("step-instructions");
    expect(overviewSec).toBeInstanceOf(HTMLElement);
    expect(repoSec).toBeInstanceOf(HTMLElement);
    if (!overviewSec || !repoSec) return;

    overviewSec.getBoundingClientRect = () =>
      ({ top: 10, bottom: 200, left: 0, right: 100, width: 100, height: 190 }) as DOMRect;

    repoSec.getBoundingClientRect = () =>
      ({ top: 300, bottom: 500, left: 0, right: 100, width: 100, height: 200 }) as DOMRect;

    // Simulate overview section intersecting
    io.emit([
      {
        target: overviewSec,
        isIntersecting: true,
        boundingClientRect: overviewSec.getBoundingClientRect(),
        intersectionRatio: 1,
      },
    ]);

    const links = document.querySelectorAll(`.${styles.navLink}`);
    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });
});
