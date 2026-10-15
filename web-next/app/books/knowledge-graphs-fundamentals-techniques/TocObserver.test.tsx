// @vitest-environment jsdom
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let callback: IntersectionObserverCallback;
const observe = vi.fn(),
  disconnect = vi.fn(),
  scrollTo = vi.fn();
function mount(withButton = true) {
  return render(
    <>
      <div data-page="knowledge-graphs-fundamentals-techniques">
        <nav>
          <a
            href="#first"
            data-nav-target="first"
            className={styles.active}
            aria-current="location"
          >
            First
          </a>
          <a href="#second" data-nav-target="second">
            Second
          </a>
          <a href="#third" data-nav-target="third">
            Third
          </a>
          <a href="#missing" data-nav-target="missing">
            Missing
          </a>
        </nav>
        <section id="first" />
        <section id="second" />
        <section id="third" />
        {withButton && (
          <button type="button" id="back-to-top">
            <i />
            Top
          </button>
        )}
      </div>
      <TocObserver />
    </>
  );
}
const current = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('[aria-current="location"]')).map((e) => e.getAttribute("href"));
function scroll(position: number) {
  vi.stubGlobal("scrollY", position);
  fireEvent.scroll(window);
}
beforeEach(() => {
  vi.stubGlobal("scrollY", 0);
  vi.stubGlobal("scrollTo", scrollTo);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const top = ({ first: 200, second: 1200, third: 2400 } as Record<string, number>)[this.id] ?? 0;
    return {
      top: top - window.scrollY,
      bottom: top - window.scrollY + 30,
      height: 30,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: top - window.scrollY,
      toJSON: () => ({}),
    };
  });
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (this: IntersectionObserver, cb: IntersectionObserverCallback) {
      callback = cb;
      return { observe, disconnect };
    })
  );
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  document.documentElement.style.removeProperty("--header-height");
});
describe("guide navigation and back to top", () => {
  it("observes resolved targets and selects first initially", () => {
    const { container } = mount();
    expect(observe.mock.calls.map((c) => c[0].id)).toEqual(["first", "second", "third"]);
    expect(current(container)).toEqual(["#first"]);
  });
  it("updates active class and aria state after scroll", () => {
    const { container } = mount();
    scroll(1100);
    expect(current(container)).toEqual(["#second"]);
    expect(
      Array.from(container.querySelectorAll(`a.${styles.active}`)).map((e) =>
        e.getAttribute("href")
      )
    ).toEqual(["#second"]);
  });
  it("handles large jumps and returning above the first section", () => {
    const { container } = mount();
    scroll(3000);
    expect(current(container)).toEqual(["#third"]);
    scroll(0);
    expect(current(container)).toEqual(["#first"]);
  });
  it("does not lose a short section between observer deliveries", () => {
    const { container } = mount();
    scroll(2300);
    expect(current(container)).toEqual(["#third"]);
  });
  it("uses coordinates regardless of observer entry order", () => {
    const { container } = mount();
    vi.stubGlobal("scrollY", 2300);
    act(() =>
      callback(
        [
          { target: container.querySelector("#third"), isIntersecting: true },
          { target: container.querySelector("#second"), isIntersecting: true },
        ] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver
      )
    );
    expect(current(container)).toEqual(["#third"]);
  });
  it("ignores unknown observer entries", () => {
    const { container } = mount();
    vi.stubGlobal("scrollY", 2300);
    act(() =>
      callback(
        [{ target: document.body, isIntersecting: true }] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver
      )
    );
    expect(current(container)).toEqual(["#first"]);
  });
  it("updates on resize and respects a dynamic shared header", () => {
    const { container } = mount();
    vi.stubGlobal("scrollY", 1000);
    document.documentElement.style.setProperty("--header-height", "160px");
    fireEvent.resize(window);
    expect(current(container)).toEqual(["#second"]);
  });
  it("restores initial scroll position immediately", () => {
    vi.stubGlobal("scrollY", 2300);
    const { container } = mount();
    expect(current(container)).toEqual(["#third"]);
  });
  it("works without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = mount();
    scroll(1100);
    expect(current(container)).toEqual(["#second"]);
  });
  it("shows top button only above the original 600px threshold", () => {
    const { container } = mount();
    const button = container.querySelector("button") as HTMLElement;
    expect(button.classList.contains(styles.visible)).toBe(false);
    scroll(600);
    expect(button.classList.contains(styles.visible)).toBe(false);
    scroll(601);
    expect(button.classList.contains(styles.visible)).toBe(true);
    scroll(600);
    expect(button.classList.contains(styles.visible)).toBe(false);
  });
  it("scrolls smoothly to top when the nested icon is clicked", () => {
    const { container } = mount();
    fireEvent.click(container.querySelector("button i") as Element);
    expect(scrollTo.mock.calls).toEqual([[{ top: 0, behavior: "smooth" }]]);
  });
  it("works when optional top button is absent", () => {
    const { container } = mount(false);
    scroll(1100);
    expect(current(container)).toEqual(["#second"]);
  });
  it("does nothing when guide root is absent", () => {
    render(<TocObserver />);
    expect(observe.mock.calls).toEqual([]);
  });
  it("disconnects observer and removes scroll, resize and click handlers on unmount", () => {
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const { container, unmount } = mount();
    const button = container.querySelector("button") as HTMLButtonElement;
    const removeButton = vi.spyOn(button, "removeEventListener");
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(removeWindow.mock.calls.map((c) => c[0])).toEqual(
      expect.arrayContaining(["scroll", "resize"])
    );
    expect(removeButton.mock.calls.map((c) => c[0])).toContain("click");
    fireEvent.click(button);
    expect(scrollTo.mock.calls).toEqual([]);
  });
});
