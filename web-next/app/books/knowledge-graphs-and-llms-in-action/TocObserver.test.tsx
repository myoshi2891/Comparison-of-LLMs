// @vitest-environment jsdom
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let callback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();
const writeText = vi.fn();
const execCommand = vi.fn();
function mount() {
  return render(
    <>
      <div data-page="knowledge-graphs-and-llms-in-action">
        <nav>
          <a
            href="#sec-0"
            data-nav-target="sec-0"
            className={styles.active}
            aria-current="location"
          >
            First
          </a>
          <a href="#step-1" data-nav-target="step-1">
            Second
          </a>
          <a href="#missing" data-nav-target="missing">
            Missing
          </a>
        </nav>
        <h2 id="sec-0">First</h2>
        <h3 id="step-1">Second</h3>
        <button type="button" data-copy-target="code-0">
          <i className="ti ti-copy" />
          コピー
        </button>
        <button type="button" data-copy-target="absent">
          Missing code
        </button>
        <code id="code-0">{"def f():\n    return 1\n"}</code>
      </div>
      <TocObserver />
    </>
  );
}
const clickCopy = async (container: HTMLElement) => {
  await act(async () =>
    fireEvent.click(container.querySelector('button[data-copy-target="code-0"] i') as Element)
  );
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (this: IntersectionObserver, cb: IntersectionObserverCallback) {
      callback = cb;
      return { observe, disconnect };
    })
  );
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand });
  writeText.mockResolvedValue(undefined);
  execCommand.mockReturnValue(true);
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("guide navigation and copy behavior", () => {
  it("observes only resolved original TOC targets with the original margins", () => {
    const { container } = mount();
    expect(observe.mock.calls.map((call) => call[0].id)).toEqual(["sec-0", "step-1"]);
    expect(vi.mocked(IntersectionObserver).mock.calls[0][1]).toEqual({
      rootMargin: "-20% 0px -70% 0px",
    });
    expect(container.querySelector('[aria-current="location"]')?.getAttribute("href")).toBe(
      "#sec-0"
    );
  });
  it("moves current styling and aria state to an intersecting step", () => {
    const { container } = mount();
    act(() =>
      callback(
        [
          { target: container.querySelector("#step-1"), isIntersecting: true },
        ] as IntersectionObserverEntry[],
        {} as IntersectionObserver
      )
    );
    expect(
      Array.from(container.querySelectorAll(`a.${styles.active}`)).map((link) =>
        link.getAttribute("href")
      )
    ).toEqual(["#step-1"]);
    expect(
      Array.from(container.querySelectorAll('[aria-current="location"]')).map((link) =>
        link.getAttribute("href")
      )
    ).toEqual(["#step-1"]);
  });
  it("ignores invisible and unknown observer entries", () => {
    const { container } = mount();
    act(() =>
      callback(
        [
          { target: container.querySelector("#step-1"), isIntersecting: false },
          { target: document.body, isIntersecting: true },
        ] as IntersectionObserverEntry[],
        {} as IntersectionObserver
      )
    );
    expect(container.querySelector('[aria-current="location"]')?.getAttribute("href")).toBe(
      "#sec-0"
    );
  });
  it("copies exact whitespace through a click on the nested icon and resets after 1600ms", async () => {
    const { container } = mount();
    await clickCopy(container);
    expect(writeText.mock.calls).toEqual([["def f():\n    return 1\n"]]);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect([button.textContent, button.classList.contains(styles.copied)]).toEqual([
      "コピー済み",
      true,
    ]);
    act(() => vi.advanceTimersByTime(1600));
    expect([button.textContent, button.classList.contains(styles.copied)]).toEqual([
      "コピー",
      false,
    ]);
    expect(button.querySelector("i")?.className).toBe("ti ti-copy");
  });
  it("falls back when clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    const { container } = mount();
    const textarea = vi.spyOn(HTMLTextAreaElement.prototype, "select");
    await clickCopy(container);
    expect(execCommand.mock.calls).toEqual([["copy"]]);
    expect(textarea).toHaveBeenCalledOnce();
    expect(container.querySelector("button")?.textContent).toBe("コピー済み");
    expect(document.querySelectorAll("textarea")).toHaveLength(0);
  });
  it("falls back after clipboard rejection", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const { container } = mount();
    await clickCopy(container);
    expect(execCommand.mock.calls).toEqual([["copy"]]);
    expect(container.querySelector("button")?.textContent).toBe("コピー済み");
  });
  for (const failure of ["false", "throw"])
    it(`keeps the original label after fallback ${failure}`, async () => {
      writeText.mockRejectedValue(new Error("denied"));
      if (failure === "throw")
        execCommand.mockImplementation(() => {
          throw new Error("denied");
        });
      else execCommand.mockReturnValue(false);
      const { container } = mount();
      await clickCopy(container);
      expect(container.querySelector("button")?.textContent).toBe("コピー");
      expect(document.querySelectorAll("textarea")).toHaveLength(0);
    });
  it("ignores missing copy targets and unrelated clicks", async () => {
    const { container } = mount();
    await act(async () => {
      fireEvent.click(container.querySelector('button[data-copy-target="absent"]') as Element);
      fireEvent.click(container.querySelector("h2") as Element);
    });
    expect(writeText.mock.calls).toEqual([]);
    expect(execCommand.mock.calls).toEqual([]);
  });
  it("keeps copy available without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = mount();
    await clickCopy(container);
    expect(writeText.mock.calls).toEqual([["def f():\n    return 1\n"]]);
  });
  it("cleans up listeners, observer and timers on unmount", async () => {
    const { container, unmount } = mount();
    await clickCopy(container);
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("does nothing when the guide root is absent", () => {
    render(<TocObserver />);
    expect(observe.mock.calls).toEqual([]);
  });
  it("does not show copied after an asynchronous resolution following unmount", async () => {
    let resolve: () => void = () => {
      /* Replaced by the pending clipboard promise below. */
    };
    writeText.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        })
    );
    const { container, unmount } = mount();
    fireEvent.click(container.querySelector("button") as Element);
    unmount();
    await act(async () => resolve());
    expect(vi.getTimerCount()).toBe(0);
  });
});
