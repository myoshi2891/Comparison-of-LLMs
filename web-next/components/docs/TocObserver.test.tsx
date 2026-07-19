import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import TocObserver from "./TocObserver";

// Stub IntersectionObserver for testing in jsdom environment
let capturedCallback: IntersectionObserverCallback | null = null;

global.IntersectionObserver = class {
  constructor(callback: IntersectionObserverCallback) {
    capturedCallback = callback;
  }
  observe() {
    // stub
  }
  unobserve() {
    // stub
  }
  disconnect() {
    // stub
  }
} as unknown as typeof IntersectionObserver;

test("shared TocObserver component mounts and disconnects successfully", () => {
  const { unmount } = render(
    <div>
      <section id="s1">Section 1</section>
      <section id="s2">Section 2</section>
      <a href="#s1" className="nav-link">Link 1</a>
      <a href="#s2" className="nav-link">Link 2</a>
      <TocObserver navLinkClassName="nav-link" activeClassName="active" />
    </div>
  );
  expect(unmount).toBeTruthy();
  unmount();
});

test("shared TocObserver updates activeClassName as intersections change", () => {
  capturedCallback = null;
  const { container, unmount } = render(
    <div>
      <section id="s1">Section 1</section>
      <section id="s2">Section 2</section>
      <a href="#s1" className="nav-link">Link 1</a>
      <a href="#s2" className="nav-link">Link 2</a>
      <TocObserver navLinkClassName="nav-link" activeClassName="active" />
    </div>
  );

  const link1 = container.querySelector('a[href="#s1"]');
  const link2 = container.querySelector('a[href="#s2"]');

  // Initial state: first link gets active class from useTocObserver
  expect(link1?.classList.contains("active")).toBe(true);
  expect(link2?.classList.contains("active")).toBe(false);

  // Trigger intersection callback for section 2
  expect(capturedCallback).not.toBeNull();
  capturedCallback!([
    {
      isIntersecting: true,
      target: container.querySelector("#s2")!,
      boundingClientRect: { top: 100 } as DOMRect,
    } as unknown as IntersectionObserverEntry,
  ], {} as unknown as IntersectionObserver);

  // Link 2 should gain active, Link 1 should lose active
  expect(link1?.classList.contains("active")).toBe(false);
  expect(link2?.classList.contains("active")).toBe(true);

  unmount();
});
