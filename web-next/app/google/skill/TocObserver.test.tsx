import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let callback: IntersectionObserverCallback | undefined;
const observed: Element[] = [];

global.IntersectionObserver = class {
  constructor(next: IntersectionObserverCallback) {
    callback = next;
  }
  observe(element: Element) {
    observed.push(element);
  }
  unobserve() {
    // Test stub.
  }
  disconnect() {
    // Test stub.
  }
} as unknown as typeof IntersectionObserver;

describe("google skill TocObserver", () => {
  it("footer の参考文献を監視し、複数交差時は最上部だけをアクティブ化する", () => {
    callback = undefined;
    observed.length = 0;
    const { container } = render(
      <div>
        <a href="#summary" className={styles.tocLink}>
          Summary
        </a>
        <a href="#references" className={styles.tocLink}>
          References
        </a>
        <section id="summary">Summary section</section>
        <footer id="references">References footer</footer>
        <TocObserver />
      </div>
    );
    const summary = container.querySelector("#summary") as HTMLElement;
    const references = container.querySelector("#references") as HTMLElement;
    const summaryLink = container.querySelector('a[href="#summary"]') as HTMLAnchorElement;
    const referencesLink = container.querySelector('a[href="#references"]') as HTMLAnchorElement;

    expect(observed).toContain(references);
    summary.getBoundingClientRect = () => ({ top: 30 }) as DOMRect;
    references.getBoundingClientRect = () => ({ top: 140 }) as DOMRect;
    callback?.(
      [
        { isIntersecting: true, target: references } as IntersectionObserverEntry,
        { isIntersecting: true, target: summary } as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );

    expect(summaryLink.classList.contains(styles.tocLinkActive)).toBe(true);
    expect(referencesLink.classList.contains(styles.tocLinkActive)).toBe(false);
  });
});
