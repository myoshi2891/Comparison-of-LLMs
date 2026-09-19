import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

function setInnerWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
}

function renderToc() {
  return render(
    <div>
      <button type="button" id="menuToggle" aria-label="メニューを開く" aria-expanded="false" />
      <div id="scrim" />
      <aside id="sidebar" className={styles.sidebar}>
        <a className={styles.navA} href="#s1">
          S1
        </a>
        <a className={styles.navA} href="#s2">
          S2
        </a>
      </aside>
      <section id="s1" />
      <section id="s2" />
      <TocObserver />
    </div>
  );
}

beforeEach(() => {
  setInnerWidth(500);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("generative-ai-for-software-development TocObserver - mobile sidebar", () => {
  it("marks the sidebar inert on mount at mobile widths", () => {
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(true);
  });

  it("does not mark the sidebar inert on mount at desktop widths", () => {
    setInnerWidth(1200);
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(false);
  });

  it("opens the menu via menuToggle, clears inert, and focuses the first nav link", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle);

    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(sidebar.inert).toBe(false);
    expect(document.activeElement).toBe(sidebar.querySelector(`.${styles.navA}`));
  });

  it("closes the menu via menuToggle and restores focus to menuToggle", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle); // open
    fireEvent.click(toggle); // close

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.inert).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it("closes the menu when the scrim is clicked", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const scrim = document.getElementById("scrim") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.click(scrim);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(scrim.classList.contains(styles.show)).toBe(false);
  });

  it("closes the menu on Escape key", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("closes the menu when a nav link is clicked at mobile widths", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const link = sidebar.querySelector(`.${styles.navA}`) as HTMLAnchorElement;

    fireEvent.click(toggle);
    fireEvent.click(link);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("leaves the menu open when a nav link is clicked at desktop widths", () => {
    setInnerWidth(1200);
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const link = sidebar.querySelector(`.${styles.navA}`) as HTMLAnchorElement;

    fireEvent.click(toggle);
    fireEvent.click(link);

    expect(sidebar.classList.contains(styles.open)).toBe(true);
  });

  it("re-syncs inert via the resize listener as the viewport crosses the breakpoint", () => {
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(true);

    setInnerWidth(1200);
    fireEvent(window, new Event("resize"));
    expect(sidebar.inert).toBe(false);

    setInnerWidth(500);
    fireEvent(window, new Event("resize"));
    expect(sidebar.inert).toBe(true);
  });

  it("closes the open menu and hides the scrim when resizing past the breakpoint to desktop", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const scrim = document.getElementById("scrim") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle); // open at mobile width
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(scrim.classList.contains(styles.show)).toBe(true);

    setInnerWidth(1200);
    fireEvent(window, new Event("resize"));

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(scrim.classList.contains(styles.show)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.inert).toBe(false);
  });

  it("moves focus to menuToggle instead of trapping it inside the sidebar as it becomes inert", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    const link = sidebar.querySelector(`.${styles.navA}`) as HTMLAnchorElement;

    link.focus();
    expect(document.activeElement).toBe(link);

    fireEvent(window, new Event("resize"));

    expect(document.activeElement).toBe(toggle);
    expect(sidebar.inert).toBe(true);
  });
});

describe("generative-ai-for-software-development TocObserver - scroll spy", () => {
  it("activates the nav link whose section has scrolled past the threshold", () => {
    setInnerWidth(1200);
    const { container } = renderToc();
    const s1 = container.querySelector("#s1") as HTMLElement;
    const s2 = container.querySelector("#s2") as HTMLElement;
    const links = container.querySelectorAll(`.${styles.navA}`);

    vi.spyOn(s1, "getBoundingClientRect").mockReturnValue({ top: -50 } as DOMRect);
    vi.spyOn(s2, "getBoundingClientRect").mockReturnValue({ top: 500 } as DOMRect);

    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    fireEvent.scroll(window);

    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });

  it("removes scroll and resize listeners on unmount", () => {
    setInnerWidth(1200);
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderToc();

    const scrollCallback = addSpy.mock.calls.find(([type]) => type === "scroll")?.[1];
    const resizeCallback = addSpy.mock.calls.find(([type]) => type === "resize")?.[1];
    expect(scrollCallback).toBeTypeOf("function");
    expect(resizeCallback).toBeTypeOf("function");

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", scrollCallback);
    expect(removeSpy).toHaveBeenCalledWith("resize", resizeCallback);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

describe("generative-ai-for-software-development TocObserver - checklist", () => {
  function renderChecklist() {
    return render(
      <div>
        <span id="checkCounter" />
        <li className="check-item">
          <input type="checkbox" id="c1" />
        </li>
        <li className="check-item">
          <input type="checkbox" id="c2" defaultChecked />
        </li>
        <TocObserver />
      </div>
    );
  }

  it("initializes the counter and marks pre-checked items as done", () => {
    const { container } = renderChecklist();
    const counter = document.getElementById("checkCounter") as HTMLElement;
    const items = container.querySelectorAll(".check-item");

    expect(counter.textContent).toBe("1 / 2 完了");
    expect(items[1].classList.contains("done")).toBe(true);
    expect(items[0].classList.contains("done")).toBe(false);
  });

  it("toggles the done class and updates the counter when a checkbox changes", () => {
    const { container } = renderChecklist();
    const counter = document.getElementById("checkCounter") as HTMLElement;
    const checkbox = container.querySelector("#c1") as HTMLInputElement;

    fireEvent.click(checkbox);

    expect(checkbox.closest(".check-item")?.classList.contains("done")).toBe(true);
    expect(counter.textContent).toBe("2 / 2 完了");

    fireEvent.click(checkbox);

    expect(checkbox.closest(".check-item")?.classList.contains("done")).toBe(false);
    expect(counter.textContent).toBe("1 / 2 完了");
  });
});
