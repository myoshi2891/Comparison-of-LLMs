import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

let capturedCallback: ObserverCallback | null = null;
let observedTargets: Element[];
let disconnectCallCount: number;

beforeEach(() => {
  capturedCallback = null;
  observedTargets = [];
  disconnectCallCount = 0;

  class IntersectionObserverStub {
    constructor(callback: ObserverCallback) {
      capturedCallback = callback;
    }
    observe(target: Element) {
      observedTargets.push(target);
    }
    unobserve() {
      /* noop */
    }
    disconnect() {
      disconnectCallCount += 1;
    }
  }

  global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  cleanup();
});

function renderWithToc() {
  return render(
    <div>
      <nav>
        <a className={styles.tocLink} href="#sec1">
          Sec1
        </a>
        <a className={styles.tocLink} href="#sec2">
          Sec2
        </a>
      </nav>
      <section id="sec1" className="chapter" />
      <section id="sec2" className="chapter" />
      <TocObserver />
    </div>
  );
}

test("observes every chapter section and activates the first TOC link initially", () => {
  const { container } = renderWithToc();

  expect(observedTargets).toHaveLength(2);
  const links = container.querySelectorAll(`.${styles.tocLink}`);
  expect(links[0].classList.contains(styles.tocLinkActive)).toBe(true);
  expect(links[0].getAttribute("aria-current")).toBe("location");
  expect(links[1].classList.contains(styles.tocLinkActive)).toBe(false);
  expect(links[1].getAttribute("aria-current")).toBeNull();
});

test("switches the active link when a section intersects", () => {
  const { container } = renderWithToc();
  const sec2 = container.querySelector("#sec2") as Element;

  capturedCallback?.([{ target: sec2, isIntersecting: true }]);

  const links = container.querySelectorAll(`.${styles.tocLink}`);
  expect(links[0].classList.contains(styles.tocLinkActive)).toBe(false);
  expect(links[0].getAttribute("aria-current")).toBeNull();
  expect(links[1].classList.contains(styles.tocLinkActive)).toBe(true);
  expect(links[1].getAttribute("aria-current")).toBe("location");
});

test("disconnects the observer on unmount", () => {
  const { unmount } = renderWithToc();

  unmount();

  expect(disconnectCallCount).toBe(1);
});
