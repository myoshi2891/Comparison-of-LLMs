import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let callback: IntersectionObserverCallback | undefined;

global.IntersectionObserver = class {
  constructor(next: IntersectionObserverCallback) {
    callback = next;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;

describe("skill-guide TocObserver", () => {
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

    expect(first.classList.contains(styles.navLinkGlobalActive)).toBe(true);
    firstSection.getBoundingClientRect = () => ({ top: 20 }) as DOMRect;
    secondSection.getBoundingClientRect = () => ({ top: 120 }) as DOMRect;
    callback?.(
      [
        { isIntersecting: true, target: secondSection } as IntersectionObserverEntry,
        { isIntersecting: true, target: firstSection } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );

    expect(first.classList.contains(styles.navLinkGlobalActive)).toBe(true);
    expect(second.classList.contains(styles.navLinkGlobalActive)).toBe(false);
    expect(first.classList.contains("active")).toBe(false);
  });
});
