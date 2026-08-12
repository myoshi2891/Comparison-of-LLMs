import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
          <a className={styles.navLink} href="#overview">
            1. .agent.md とは何か
          </a>
          <a className={styles.navLink} href="#frontmatter">
            2. フロントマター全仕様
          </a>
        </nav>
      </aside>
      <main>
        <section id="overview">
          <h2>1. .agent.md とは何か</h2>
        </section>
        <section id="frontmatter">
          <h2>2. フロントマター全仕様</h2>
        </section>
      </main>
      <TocObserver />
    </div>
  );
}

describe("Copilot agent TocObserver", () => {
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

  it("observes headings/sections and activates the currently topmost intersecting element", () => {
    const { container } = renderToc();
    const sections = container.querySelectorAll("main section");
    const links = container.querySelectorAll(`.${styles.navLink}`);

    vi.spyOn(sections[0], "getBoundingClientRect").mockReturnValue({ top: 5 } as DOMRect);
    vi.spyOn(sections[1], "getBoundingClientRect").mockReturnValue({ top: 30 } as DOMRect);

    expect(io.observedTargets).toEqual(Array.from(sections));

    io.emit([
      {
        target: sections[0],
        isIntersecting: true,
        boundingClientRect: { top: 40 } as DOMRectReadOnly,
      },
      {
        target: sections[1],
        isIntersecting: true,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(links[0]).toHaveClass(styles.active);
    expect(links[1]).not.toHaveClass(styles.active);

    io.emit([
      {
        target: sections[1],
        isIntersecting: false,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);
    expect(links[0]).toHaveClass(styles.active);
    expect(links[1]).not.toHaveClass(styles.active);
  });

  it("does not change link state when no section intersects", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.navLink}`);

    io.emit([{ target: container.querySelector("#overview") as Element, isIntersecting: false }]);
    expect(Array.from(links).every((link) => !link.classList.contains(styles.active))).toBe(true);
  });

  it("disconnects the observer and tolerates missing drawer elements", () => {
    const { container, unmount } = render(
      <div>
        <button type="button" id="sidebarToggle" />
        <TocObserver />
      </div>
    );
    const toggle = container.querySelector("#sidebarToggle") as HTMLButtonElement;
    expect(() => fireEvent.click(toggle)).not.toThrow();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});
