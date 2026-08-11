import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    expect(sidebarToggle).toHaveAttribute("aria-label", "目次を開く");

    // Toggle open
    fireEvent.click(sidebarToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");
    expect(sidebarToggle.getAttribute("aria-expanded")).toBe("true");
    expect(sidebarToggle).toHaveAttribute("aria-label", "目次を閉じる");

    // Toggle close
    fireEvent.click(sidebarToggle);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(sidebarToggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebarToggle).toHaveAttribute("aria-label", "目次を開く");

    // Open again then click TOC link
    fireEvent.click(sidebarToggle);
    expect(sidebar.getAttribute("data-open")).toBe("true");

    fireEvent.click(tocLink);
    expect(sidebar.getAttribute("data-open")).toBe("false");
    expect(sidebarToggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebarToggle).toHaveAttribute("aria-label", "目次を開く");
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
        boundingClientRect: { top: 5 } as DOMRectReadOnly,
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

  it("supports a custom active class and ignores callbacks without a usable target id", () => {
    const { container } = render(
      <div>
        <nav>
          <a href="#section-1">Section 1</a>
        </nav>
        <main>
          <section id="section-1" />
        </main>
        <TocObserver activeClass="is-current" />
      </div>
    );
    const link = container.querySelector("nav a") as HTMLAnchorElement;

    io.emit([
      {
        target: document.createElement("section"),
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(link).not.toHaveClass("is-current");

    io.emit([
      {
        target: container.querySelector("#section-1") as Element,
        isIntersecting: false,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(link).not.toHaveClass("is-current");

    io.emit([
      {
        target: container.querySelector("#section-1") as Element,
        isIntersecting: true,
        boundingClientRect: { top: 5 } as DOMRectReadOnly,
      },
    ]);
    expect(link).toHaveClass("is-current");
  });

  it("removes listeners, disconnects the observer, and tolerates missing drawer elements", () => {
    const link = document.createElement("a");
    link.href = "#section-1";
    const nav = document.createElement("nav");
    nav.append(link);
    const main = document.createElement("main");
    const section = document.createElement("section");
    section.id = "section-1";
    main.append(section);
    document.body.append(nav, main);
    const removeListener = vi.spyOn(link, "removeEventListener");

    const { unmount } = render(<TocObserver />);
    fireEvent.click(link);
    unmount();

    expect(removeListener).toHaveBeenCalledWith("click", expect.any(Function));
    expect(io.disconnectCount).toBe(1);
  });
});
