// @vitest-environment jsdom
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
      <nav id="nav">
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
  Array.from(document.querySelectorAll(`#nav .${styles.active}`)).map((link) => [
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

describe("TocObserver for LangChain in your Pocket guide", () => {
  it("initializes intersection observer and observes existing targets", () => {
    fixture();
    expect(construct).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("updates active link and aria-current when an entry intersects", () => {
    fixture();
    expect(active()).toEqual([["#intro", "location"]]);

    intersect([{ id: "ch1", isIntersecting: true }]);
    expect(active()).toEqual([["#ch1", "location"]]);
  });

  it("ignores non-intersecting entries", () => {
    fixture();
    intersect([{ id: "ch1", isIntersecting: false }]);
    expect(active()).toEqual([["#intro", "location"]]);
  });

  it("cleans up observer on unmount", () => {
    const { unmount } = fixture();
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
