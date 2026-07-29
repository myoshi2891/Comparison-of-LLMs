import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let callback: IntersectionObserverCallback | undefined;
const readCallback = () => callback;

global.IntersectionObserver = class {
  constructor(next: IntersectionObserverCallback) {
    callback = next;
  }
  observe() {
    // Test stub.
  }
  unobserve() {
    // Test stub.
  }
  disconnect() {
    // Test stub.
  }
} as unknown as typeof IntersectionObserver;

describe("antigravity-best-practices TocObserver", () => {
  it("初期位置と複数交差時の最上部セクションを CSS Modules クラスで示す", () => {
    callback = undefined;
    const { container } = render(
      <div>
        <a href="#first" data-toc-link>
          First
        </a>
        <a href="#second" data-toc-link>
          Second
        </a>
        <main>
          <section id="first">First section</section>
          <section id="second">Second section</section>
        </main>
        <TocObserver />
      </div>
    );
    const first = container.querySelector('a[href="#first"]') as HTMLAnchorElement;
    const second = container.querySelector('a[href="#second"]') as HTMLAnchorElement;
    const firstSection = container.querySelector("#first") as HTMLElement;
    const secondSection = container.querySelector("#second") as HTMLElement;

    expect(first.classList.contains(styles.navLinkActive)).toBe(true);
    firstSection.getBoundingClientRect = () => ({ top: 20 }) as DOMRect;
    secondSection.getBoundingClientRect = () => ({ top: 120 }) as DOMRect;
    const observerCallback = readCallback();
    if (!observerCallback) throw new Error("IntersectionObserver callback was not captured");
    observerCallback(
      [
        { isIntersecting: true, target: secondSection } as unknown as IntersectionObserverEntry,
        { isIntersecting: true, target: firstSection } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );

    expect(first.classList.contains(styles.navLinkActive)).toBe(true);
    expect(second.classList.contains(styles.navLinkActive)).toBe(false);
    expect(first.classList.contains("active")).toBe(false);
  });
});
