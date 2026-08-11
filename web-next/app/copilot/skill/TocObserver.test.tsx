import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

let io: ReturnType<typeof installIntersectionObserverStub>;

beforeEach(() => {
  io = installIntersectionObserverStub();
});

afterEach(() => {
  cleanup();
});

function renderToc() {
  return render(
    <div>
      <button type="button" id="sidebarToggle" aria-expanded="false" aria-label="目次を開く" />
      <aside id="sidebar">
        <nav>
          <a className={styles.navLink} href="#sec-1">
            Section 1
          </a>
          <a className={styles.navLink} href="#sec-2">
            Section 2
          </a>
        </nav>
      </aside>
      <main>
        <h2 id="sec-1">Section 1</h2>
        <h3 id="sec-2">Section 2</h3>
      </main>
      <TocObserver />
    </div>
  );
}

describe("Copilot skill TocObserver", () => {
  it("opens and closes the sidebar while synchronizing accessible state", () => {
    const { container } = renderToc();
    const toggle = container.querySelector("#sidebarToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;

    fireEvent.click(toggle);
    expect(sidebar).toHaveClass(styles.open);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "目次を閉じる");

    fireEvent.click(toggle);
    expect(sidebar).not.toHaveClass(styles.open);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-label", "目次を開く");
  });

  it("observes headings and activates the topmost intersecting heading", () => {
    const { container } = renderToc();
    const headings = container.querySelectorAll("main h2, main h3");
    const links = container.querySelectorAll(`.${styles.navLink}`);

    expect(io.observedTargets).toEqual(Array.from(headings));

    io.emit([
      {
        target: headings[0],
        isIntersecting: true,
        boundingClientRect: { top: 40 } as DOMRectReadOnly,
      },
      {
        target: headings[1],
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0]).not.toHaveClass(styles.active);
    expect(links[1]).toHaveClass(styles.active);

    io.emit([
      {
        target: headings[1],
        isIntersecting: false,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(links[0]).toHaveClass(styles.active);
    expect(links[1]).not.toHaveClass(styles.active);
  });

  it("does not change link state when no heading intersects", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.navLink}`);

    io.emit([{ target: container.querySelector("#sec-1") as Element, isIntersecting: false }]);
    expect(Array.from(links).every((link) => !link.classList.contains(styles.active))).toBe(true);
  });

  it("disconnects the observer and tolerates missing drawer elements", () => {
    const { unmount } = render(<TocObserver />);
    expect(() => fireEvent.click(document.body)).not.toThrow();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});
