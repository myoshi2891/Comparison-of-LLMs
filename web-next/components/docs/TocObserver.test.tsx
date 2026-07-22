import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import TocObserver from "./TocObserver";

// Stub IntersectionObserver for testing in jsdom environment
let capturedCallback: IntersectionObserverCallback | null = null;

// 関数経由で読む。直接参照すると、代入が render() 内のコンストラクタ経由で起きることを
// TS の制御フロー解析が追えず、直前の `capturedCallback = null` で null に絞り込まれてしまう。
const readCapturedCallback = () => capturedCallback;

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
      <a href="#s1" className="nav-link">
        Link 1
      </a>
      <a href="#s2" className="nav-link">
        Link 2
      </a>
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
      <a href="#s1" className="nav-link">
        Link 1
      </a>
      <a href="#s2" className="nav-link">
        Link 2
      </a>
      <TocObserver navLinkClassName="nav-link" activeClassName="active" />
    </div>
  );

  const link1 = container.querySelector('a[href="#s1"]');
  const link2 = container.querySelector('a[href="#s2"]');

  // Initial state: first link gets active class from useTocObserver
  expect(link1?.classList.contains("active")).toBe(true);
  expect(link2?.classList.contains("active")).toBe(false);

  // Trigger intersection callback for section 2
  const callback = readCapturedCallback();
  if (!callback) throw new Error("IntersectionObserver callback was not captured");
  const section2 = container.querySelector("#s2");
  expect(section2).not.toBeNull();
  callback(
    [
      {
        isIntersecting: true,
        target: section2,
        boundingClientRect: { top: 100 } as DOMRect,
      } as unknown as IntersectionObserverEntry,
    ],
    {} as unknown as IntersectionObserver
  );

  // Link 2 should gain active, Link 1 should lose active
  expect(link1?.classList.contains("active")).toBe(false);
  expect(link2?.classList.contains("active")).toBe(true);

  unmount();
});
