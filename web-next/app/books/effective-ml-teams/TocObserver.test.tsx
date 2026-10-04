// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

const width = (value: number) =>
  Object.defineProperty(window, "innerWidth", { value, writable: true, configurable: true });
function fixture() {
  return render(
    <div data-testid="layout-root" className={styles.layout}>
      <button
        type="button"
        id="menuToggle"
        aria-label="目次を開く"
        aria-expanded="false"
        aria-controls="sidebar"
      >
        目次
      </button>
      <div id="scrim" className={styles.scrim} />
      <nav id="sidebar" className={styles.sidebar}>
        <a className={styles.navA} href="#intro">
          Intro
        </a>
        <a className={styles.navA} href="#step1">
          Step 1
        </a>
        <a className={styles.navA} href="#absent">
          Absent
        </a>
      </nav>
      <div className={styles.main} data-testid="main-content">
        <header id="intro" />
        <section id="step1" />
        <span id="checklistCounterText">0 / 2 完了</span>
        <ul id="checklistItems">
          <li>
            <input aria-label="one" type="checkbox" />
          </li>
          <li>
            <input aria-label="two" type="checkbox" />
          </li>
        </ul>
        <input aria-label="unrelated" type="checkbox" />
      </div>
      <TocObserver />
    </div>
  );
}
const sidebar = () => document.getElementById("sidebar") as HTMLElement & { inert: boolean };
const toggle = () => document.getElementById("menuToggle") as HTMLButtonElement;
const main = () =>
  document.querySelector('[data-testid="main-content"]') as HTMLElement & { inert: boolean };
const open = () => fireEvent.click(toggle());
function expectClosed(mobile = true) {
  expect(sidebar().classList.contains(styles.open)).toBe(false);
  expect(document.getElementById("scrim")?.classList.contains(styles.open)).toBe(false);
  expect(toggle().getAttribute("aria-expanded")).toBe("false");
  expect(toggle().getAttribute("aria-label")).toBe("目次を開く");
  expect(sidebar().inert).toBe(mobile);
  expect(main().inert).toBe(false);
}
beforeEach(() => {
  width(500);
  // jsdom has no layout: put the second section below the initial viewport.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    return { top: this.id === "step1" ? 900 : 0 } as DOMRect;
  });
  vi.stubGlobal("requestAnimationFrame", vi.fn());
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("TocObserver — all public interactions", () => {
  it("initializes mobile visibility and the initial active anchor", () => {
    fixture();
    expectClosed();
    expect(
      Array.from(sidebar().querySelectorAll(`.${styles.active}`)).map((e) => e.getAttribute("href"))
    ).toEqual(["#intro"]);
  });
  it("keeps desktop TOC available and applies the inclusive 900px breakpoint", () => {
    width(901);
    fixture();
    expectClosed(false);
    width(900);
    fireEvent.resize(window);
    expectClosed(true);
  });
  it("opens, synchronizes labels and scrim, releases inert and focuses the first link", () => {
    fixture();
    open();
    expect(sidebar().classList.contains(styles.open)).toBe(true);
    expect(document.getElementById("scrim")?.classList.contains(styles.open)).toBe(true);
    expect(sidebar().inert).toBe(false);
    expect(toggle().getAttribute("aria-expanded")).toBe("true");
    expect(toggle().getAttribute("aria-label")).toBe("目次を閉じる");
    expect(document.activeElement).toBe(sidebar().querySelector("a"));
  });
  it("makes the main content inert while the mobile menu is open and restores it on close", () => {
    fixture();
    expect(main().inert).toBe(false);
    open();
    expect(main().inert).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(main().inert).toBe(false);
  });
  it("toggles closed and returns focus", () => {
    fixture();
    open();
    open();
    expectClosed();
    expect(document.activeElement).toBe(toggle());
  });
  it("closes via scrim and returns focus", () => {
    fixture();
    open();
    fireEvent.click(document.getElementById("scrim") as HTMLElement);
    expectClosed();
    expect(document.activeElement).toBe(toggle());
  });
  it("ignores other keys, closes via Escape and returns focus", () => {
    fixture();
    open();
    fireEvent.keyDown(document, { key: "Enter" });
    expect(sidebar().inert).toBe(false);
    fireEvent.keyDown(document, { key: "Escape" });
    expectClosed();
    expect(document.activeElement).toBe(toggle());
  });
  it("closes after following a mobile TOC link", () => {
    fixture();
    open();
    fireEvent.click(sidebar().querySelector("a") as Element);
    expectClosed();
  });
  it("keeps desktop links available without moving focus to a hidden toggle", () => {
    width(1200);
    fixture();
    const link = sidebar().querySelector("a") as HTMLAnchorElement;
    link.focus();
    fireEvent.click(link);
    fireEvent.keyDown(document, { key: "Escape" });
    expectClosed(false);
    expect(document.activeElement).toBe(link);
  });
  it("closes an open mobile menu when resized to desktop and releases inert", () => {
    fixture();
    open();
    width(1200);
    fireEvent.resize(window);
    expectClosed(false);
  });
  it("moves focus before a closed sidebar becomes inert on resize", () => {
    width(1200);
    fixture();
    (sidebar().querySelector("a") as HTMLAnchorElement).focus();
    width(500);
    fireEvent.resize(window);
    expectClosed();
    expect(document.activeElement).toBe(toggle());
  });
  it("changes active sections with scrolling and coalesces pending frames", () => {
    fixture();
    vi.spyOn(
      document.getElementById("intro") as HTMLElement,
      "getBoundingClientRect"
    ).mockReturnValue({ top: -400 } as DOMRect);
    vi.spyOn(
      document.getElementById("step1") as HTMLElement,
      "getBoundingClientRect"
    ).mockReturnValue({ top: 100 } as DOMRect);
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    const cb = vi.mocked(requestAnimationFrame).mock.calls[0][0];
    cb(0);
    expect(
      Array.from(sidebar().querySelectorAll(`.${styles.active}`)).map((e) => e.getAttribute("href"))
    ).toEqual(["#step1"]);
    vi.spyOn(
      document.getElementById("step1") as HTMLElement,
      "getBoundingClientRect"
    ).mockReturnValue({ top: 900 } as DOMRect);
    fireEvent.scroll(window);
    vi.mocked(requestAnimationFrame).mock.calls[1][0](0);
    expect(
      Array.from(sidebar().querySelectorAll(`.${styles.active}`)).map((e) => e.getAttribute("href"))
    ).toEqual(["#intro"]);
  });
  it("updates every checkbox, counter and completed item and reverses unchecking", () => {
    const view = fixture();
    fireEvent.click(view.getByLabelText("one"));
    expect(document.getElementById("checklistCounterText")?.textContent).toBe("1 / 2 完了");
    expect(view.getByLabelText("one").closest("li")?.classList.contains(styles.done)).toBe(true);
    fireEvent.click(view.getByLabelText("two"));
    expect(document.getElementById("checklistCounterText")?.textContent).toBe("2 / 2 完了");
    fireEvent.click(view.getByLabelText("one"));
    expect(document.getElementById("checklistCounterText")?.textContent).toBe("1 / 2 完了");
    expect(view.getByLabelText("one").closest("li")?.classList.contains(styles.done)).toBe(false);
    fireEvent.click(view.getByLabelText("unrelated"));
    expect(document.getElementById("checklistCounterText")?.textContent).toBe("1 / 2 完了");
  });
  it("removes DOM and window listeners and cancels scheduled frames on unmount", () => {
    const addWindow = vi.spyOn(window, "addEventListener"),
      removeWindow = vi.spyOn(window, "removeEventListener");
    const addDocument = vi.spyOn(document, "addEventListener"),
      removeDocument = vi.spyOn(document, "removeEventListener");
    const view = fixture();
    const button = toggle();
    const before = button.getAttribute("aria-expanded");
    vi.mocked(requestAnimationFrame).mockReturnValue(17);
    fireEvent.scroll(window);
    view.unmount();
    for (const name of ["scroll", "resize"])
      expect(removeWindow).toHaveBeenCalledWith(
        name,
        addWindow.mock.calls.find(([type]) => type === name)?.[1]
      );
    expect(removeDocument).toHaveBeenCalledWith(
      "keydown",
      addDocument.mock.calls.find(([type]) => type === "keydown")?.[1]
    );
    expect(cancelAnimationFrame).toHaveBeenCalledWith(17);
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe(before);
  });
  it("supports pages with no optional controls or TOC targets", () => {
    const view = render(<TocObserver />);
    fireEvent.resize(window);
    fireEvent.keyDown(document, { key: "Escape" });
    view.unmount();
    expect(document.getElementById("sidebar")).toBeNull();
  });
});
