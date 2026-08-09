import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

let io: ReturnType<typeof installIntersectionObserverStub>;

beforeEach(() => {
  io = installIntersectionObserverStub();
});

describe("/copilot/skill - TocObserver", () => {
  it("keeps intersecting headings across batches and activates the topmost one", () => {
    const { container } = render(
      <div>
        <nav>
          <a className={styles.navLink} href="#section-1">
            Section 1
          </a>
          <a className={styles.navLink} href="#section-2">
            Section 2
          </a>
        </nav>
        <main>
          <h2 id="section-1">Section 1</h2>
          <h2 id="section-2">Section 2</h2>
        </main>
        <TocObserver />
      </div>
    );

    const links = container.querySelectorAll("nav a");
    const section1 = container.querySelector("#section-1") as Element;
    const section2 = container.querySelector("#section-2") as Element;

    io.emit([
      {
        target: section1,
        isIntersecting: true,
        boundingClientRect: { top: 20 } as DOMRectReadOnly,
      },
    ]);
    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);

    io.emit([
      {
        target: section2,
        isIntersecting: true,
        boundingClientRect: { top: 40 } as DOMRectReadOnly,
      },
    ]);
    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);

    io.emit([
      {
        target: section1,
        isIntersecting: true,
        boundingClientRect: { top: 50 } as DOMRectReadOnly,
      },
      {
        target: section2,
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(links[0].classList.contains(styles.active)).toBe(false);
    expect(links[1].classList.contains(styles.active)).toBe(true);

    io.emit([
      {
        target: section2,
        isIntersecting: false,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });
});
