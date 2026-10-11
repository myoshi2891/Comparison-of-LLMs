import { act, render } from "@testing-library/react";
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
      <nav id="side-nav">
        <a href="#intro" className={styles.active} aria-current="location">
          Intro
        </a>
        <a href="#ch1">Chapter 1</a>
        <a href="#missing">Missing</a>
      </nav>
      <header id="intro" />
      <section id="ch1" />
      <TocObserver />
    </div>
  );
}
const active = () =>
  Array.from(document.querySelectorAll(`#side-nav .${styles.active}`)).map((link) => [
    link.getAttribute("href"),
    link.getAttribute("aria-current"),
  ]);
function intersect(entries: { id: string; isIntersecting: boolean }[]) {
  act(() =>
    callback(
      entries.map((entry) => ({
        target: document.getElementById(entry.id) ?? document.createElement("section"),
        isIntersecting: entry.isIntersecting,
      })) as IntersectionObserverEntry[],
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
describe("LangChain TOC — original IntersectionObserver behavior", () => {
  it("observes only existing anchor targets with the original viewport margins", () => {
    fixture();
    expect(construct.mock.calls).toEqual([[{ rootMargin: "-20% 0px -70% 0px" }]]);
    expect(observe.mock.calls.map(([target]) => target.id)).toEqual(["intro", "ch1"]);
    expect(active()).toEqual([["#intro", "location"]]);
  });
  it("moves the active class and current state to the entering chapter", () => {
    fixture();
    intersect([{ id: "ch1", isIntersecting: true }]);
    expect(active()).toEqual([["#ch1", "location"]]);
    expect(document.querySelector('a[href="#intro"]')?.hasAttribute("aria-current")).toBe(false);
  });
  it("retains current state for exit notifications", () => {
    fixture();
    intersect([{ id: "ch1", isIntersecting: false }]);
    expect(active()).toEqual([["#intro", "location"]]);
  });
  it("handles multiple notifications in original callback order and returns to the introduction", () => {
    fixture();
    intersect([
      { id: "intro", isIntersecting: true },
      { id: "ch1", isIntersecting: true },
    ]);
    expect(active()).toEqual([["#ch1", "location"]]);
    intersect([{ id: "intro", isIntersecting: true }]);
    expect(active()).toEqual([["#intro", "location"]]);
  });
  it("ignores unknown observed targets", () => {
    fixture();
    intersect([{ id: "unknown", isIntersecting: true }]);
    expect(active()).toEqual([["#intro", "location"]]);
  });
  it("disconnects observation on unmount", () => {
    const view = fixture();
    view.unmount();
    expect(disconnect.mock.calls).toEqual([[]]);
  });
  it("keeps the original initial navigation available without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    fixture();
    expect(construct.mock.calls).toEqual([]);
    expect(active()).toEqual([["#intro", "location"]]);
  });
  it("handles absent page and absent navigation without observation", () => {
    const view = render(<TocObserver />);
    expect(construct.mock.calls).toEqual([]);
    view.unmount();
    render(
      <div data-testid="layout-root">
        <TocObserver />
      </div>
    );
    expect(construct.mock.calls).toEqual([]);
  });
  it("does not construct an observer when no target exists", () => {
    render(
      <div data-testid="layout-root">
        <nav id="side-nav">
          <a href="#missing">Missing</a>
        </nav>
        <TocObserver />
      </div>
    );
    expect(construct.mock.calls).toEqual([]);
  });
});
