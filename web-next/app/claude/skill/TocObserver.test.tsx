import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TocObserver from "./TocObserver";

global.IntersectionObserver = class {
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

describe("Claude skill TocObserver - mobile sidebar contract", () => {
  it("toggles data-open on sidebar and aria-expanded on toggle button, and closes on TOC link click", () => {
    const { container } = render(
      <div>
        <button id="menuToggle" aria-label="メニュー開閉" type="button">
          ≡
        </button>
        <nav id="sidebar" data-open="false">
          <ul className="toc">
            <li>
              <a href="#s0">はじめに</a>
            </li>
          </ul>
        </nav>
        <main>
          <section id="s0">Intro</section>
        </main>
        <TocObserver />
      </div>
    );

    const menuToggle = container.querySelector("#menuToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const tocLink = container.querySelector('a[href="#s0"]') as HTMLAnchorElement;

    expect(sidebar.getAttribute("data-open")).toBe("false");

    // Toggle open
    fireEvent.click(menuToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");
    expect(menuToggle.getAttribute("aria-expanded")).toBe("true");

    // Toggle close
    fireEvent.click(menuToggle);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(menuToggle.getAttribute("aria-expanded")).toBe("false");

    // Open again then click TOC link
    fireEvent.click(menuToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");

    fireEvent.click(tocLink);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(menuToggle.getAttribute("aria-expanded")).toBe("false");
  });
});
