import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

function renderToc(includeHeadings = true) {
  return render(
    <div>
      <button type="button" id="menuToggle" aria-expanded="false" aria-label="メニューを開く" />
      <aside id="sidebar">
        <nav>
          <a href="#sec-1">Section 1</a>
          <a href="#sec-2">Section 2</a>
        </nav>
      </aside>
      <div id="sidebarOverlay" />
      {includeHeadings ? (
        <main>
          <h2 id="sec-1">Section 1</h2>
          <h2 id="sec-2">Section 2</h2>
        </main>
      ) : null}
      <TocObserver />
    </div>
  );
}

describe("Codex harness engineering TocObserver", () => {
  it("opens and closes the mobile sidebar from the toggle, overlay, and TOC links", () => {
    const { container } = renderToc();
    const toggle = container.querySelector("#menuToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const overlay = container.querySelector("#sidebarOverlay") as HTMLElement;
    const firstLink = container.querySelector("#sidebar nav a") as HTMLAnchorElement;

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(true);
    expect(overlay.classList.contains(styles.overlayOpen)).toBe(true);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "メニューを閉じる");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    fireEvent.click(overlay);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);

    fireEvent.click(toggle);
    fireEvent.click(firstLink);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(toggle).toHaveAttribute("aria-label", "メニューを開く");
  });

  it("updates the active link on scroll and resize", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll<HTMLAnchorElement>("#sidebar nav a");
    const headings = container.querySelectorAll<HTMLElement>("main h2[id]");

    expect(links[0]).toHaveClass(styles.active, "active");

    vi.spyOn(headings[0], "getBoundingClientRect").mockReturnValue({ top: -500 } as DOMRect);
    vi.spyOn(headings[1], "getBoundingClientRect").mockReturnValue({ top: -100 } as DOMRect);
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true, writable: true });
    fireEvent.scroll(window);

    expect(links[0]).not.toHaveClass(styles.active, "active");
    expect(links[1]).toHaveClass(styles.active, "active");

    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
    fireEvent.resize(window);
    expect(links[0]).toHaveClass(styles.active, "active");
  });

  it("returns safely when headings are absent", () => {
    const windowRemove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderToc(false);

    expect(() => unmount()).not.toThrow();
    expect(windowRemove).not.toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("renders safely without drawer elements or TOC content", () => {
    expect(() => render(<TocObserver />).unmount()).not.toThrow();
  });
});
