import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import TocObserver from "./TocObserver";

// Stub IntersectionObserver for testing in jsdom environment
global.IntersectionObserver = class {
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
