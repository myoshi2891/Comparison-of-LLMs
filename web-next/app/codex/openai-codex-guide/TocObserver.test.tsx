import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

function renderToc(includeSections = true) {
  return render(
    <div>
      <button type="button" id="menuToggle" aria-expanded="false" aria-label="目次を開く" />
      <aside id="sidebar">
        <nav>
          <a href="#sec-1">Section 1</a>
          <a href="#sec-2">Section 2</a>
        </nav>
      </aside>
      <div id="sidebarOverlay" />
      {includeSections ? (
        <main>
          <section id="sec-1">
            <h2>Section 1</h2>
          </section>
          <section id="sec-2">
            <h2>Section 2</h2>
          </section>
        </main>
      ) : null}
      <TocObserver />
    </div>
  );
}

describe("OpenAI Codex guide TocObserver", () => {
  it("activates the first section initially and switches links on scroll", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll<HTMLAnchorElement>("#sidebar nav a");
    const sections = container.querySelectorAll<HTMLElement>("main section[id]");

    expect(links[0].classList.contains(styles.active)).toBe(true);

    vi.spyOn(sections[0], "getBoundingClientRect").mockReturnValue({
      top: -600,
    } as DOMRect);
    vi.spyOn(sections[1], "getBoundingClientRect").mockReturnValue({
      top: -100,
    } as DOMRect);
    Object.defineProperty(window, "scrollY", { value: 600, configurable: true, writable: true });
    fireEvent.scroll(window);

    expect(links[0].classList.contains(styles.active)).toBe(false);
    expect(links[1].classList.contains(styles.active)).toBe(true);
  });

  it("opens and closes the drawer from the toggle, overlay, and TOC links", () => {
    const { container } = renderToc();
    const toggle = container.querySelector("#menuToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const overlay = container.querySelector("#sidebarOverlay") as HTMLElement;
    const firstLink = container.querySelector("#sidebar nav a") as HTMLAnchorElement;

    fireEvent.click(toggle);
    expect(sidebar).toHaveClass(styles.sidebarOpen);
    expect(overlay).toHaveClass(styles.overlayOpen);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "目次を閉じる");

    fireEvent.click(toggle);
    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    firstLink.focus();
    fireEvent.click(overlay);
    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    expect(toggle).toHaveFocus();

    fireEvent.click(toggle);
    firstLink.focus();
    fireEvent.click(firstLink);
    expect(sidebar).not.toHaveClass(styles.sidebarOpen);
    expect(toggle).toHaveAttribute("aria-label", "目次を開く");
    expect(toggle).toHaveFocus();
  });

  it("renders safely when drawer elements and TOC links are absent", () => {
    expect(() => render(<TocObserver />).unmount()).not.toThrow();
  });

  it("removes toggle, overlay, nav-link, scroll, and resize listeners on unmount", () => {
    const { container, unmount } = renderToc();
    const toggle = container.querySelector("#menuToggle") as HTMLButtonElement;
    const overlay = container.querySelector("#sidebarOverlay") as HTMLDivElement;
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>("#sidebar nav a"));
    const toggleRemove = vi.spyOn(toggle, "removeEventListener");
    const overlayRemove = vi.spyOn(overlay, "removeEventListener");
    const linkRemoves = links.map((link) => vi.spyOn(link, "removeEventListener"));
    const windowRemove = vi.spyOn(window, "removeEventListener");

    unmount();

    expect(toggleRemove).toHaveBeenCalledWith("click", expect.any(Function));
    expect(overlayRemove).toHaveBeenCalledWith("click", expect.any(Function));
    for (const remove of linkRemoves) {
      expect(remove).toHaveBeenCalledWith("click", expect.any(Function));
    }
    expect(windowRemove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(windowRemove).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("removes listeners attached before the no-sections early return", () => {
    const { container, unmount } = renderToc(false);
    const toggle = container.querySelector("#menuToggle") as HTMLButtonElement;
    const overlay = container.querySelector("#sidebarOverlay") as HTMLDivElement;
    const toggleRemove = vi.spyOn(toggle, "removeEventListener");
    const overlayRemove = vi.spyOn(overlay, "removeEventListener");

    unmount();

    expect(toggleRemove).toHaveBeenCalledWith("click", expect.any(Function));
    expect(overlayRemove).toHaveBeenCalledWith("click", expect.any(Function));
  });
});
