import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import TocObserver from "./TocObserver";

let io: ReturnType<typeof installIntersectionObserverStub>;

beforeEach(() => {
  io = installIntersectionObserverStub();
});

describe("/google/sandbox-best-practices - TocObserver", () => {
  it("toggles data-open on sidebar and aria-expanded on toggle button, and closes on TOC link click", () => {
    const { container } = render(
      <div>
        <button id="sidebarToggle" aria-label="目次を開く" type="button">
          ≡
        </button>
        <nav id="sidebar">
          <ul className="navList">
            <li>
              <a href="#section-1">1. はじめに</a>
            </li>
          </ul>
        </nav>
        <main>
          <section id="section-1">Intro</section>
        </main>
        <TocObserver />
      </div>
    );

    const sidebarToggle = container.querySelector("#sidebarToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const tocLink = container.querySelector('a[href="#section-1"]') as HTMLAnchorElement;

    expect(sidebar.hasAttribute("data-open")).toBe(false);
    expect(sidebarToggle.hasAttribute("aria-expanded")).toBe(false);

    // Toggle open
    fireEvent.click(sidebarToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");
    expect(sidebarToggle.getAttribute("aria-expanded")).toBe("true");

    // Toggle close
    fireEvent.click(sidebarToggle);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(sidebarToggle.getAttribute("aria-expanded")).toBe("false");

    // Open again then click TOC link
    fireEvent.click(sidebarToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");

    fireEvent.click(tocLink);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(sidebarToggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("observes section elements with ids for scroll spy", () => {
    const { container } = render(
      <div>
        <nav id="sidebar">
          <a href="#section-1">1. はじめに</a>
          <a href="#section-2">2. 全体マップ</a>
        </nav>
        <main>
          <section id="section-1" />
          <section id="section-2" />
        </main>
        <TocObserver />
      </div>
    );

    expect(io.observedTargets.map((target) => target.id)).toEqual(["section-1", "section-2"]);

    const links = container.querySelectorAll("nav a");
    io.emit([
      {
        target: container.querySelector("#section-1") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 20 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0].classList.contains("active")).toBe(true);
    expect(links[1].classList.contains("active")).toBe(false);

    io.emit([
      {
        target: container.querySelector("#section-1") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 40 } as DOMRectReadOnly,
      },
      {
        target: container.querySelector("#section-2") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0].classList.contains("active")).toBe(false);
    expect(links[1].classList.contains("active")).toBe(true);

    io.emit([
      {
        target: container.querySelector("#section-2") as Element,
        isIntersecting: false,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0].classList.contains("active")).toBe(true);
    expect(links[1].classList.contains("active")).toBe(false);
  });
});
