// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

let width: number;
let rect: ReturnType<typeof vi.spyOn>;
let position = 0;
function Harness() {
  return (
    <div id="gemini-guide" className={styles.root}>
      <button
        id="gemini-menu"
        type="button"
        aria-expanded="false"
        aria-label="目次を開く"
        aria-controls="gemini-sidebar"
      >
        目次
      </button>
      <button id="gemini-backdrop" type="button" aria-label="目次を閉じる" />
      <aside id="gemini-sidebar">
        <nav>
          {[0, 1, 2].map((i) => (
            <a key={i} href={`#s${i}`}>
              {i}
            </a>
          ))}
        </nav>
      </aside>
      <div className={styles.main} data-testid="guide-content">
        {[0, 1, 2].map((i) => (
          <section key={i} id={`s${i}`} />
        ))}
        <label>
          <input type="checkbox" data-guide-check />A
        </label>
        <label>
          <input type="checkbox" data-guide-check />B
        </label>
        <span id="chkCount">0</span>
        <span id="chkTotal">0</span>
        <i id="chkBar" />
      </div>
      <TocObserver />
    </div>
  );
}
const menu = () => document.getElementById("gemini-menu") as HTMLElement;
const sidebar = () => document.getElementById("gemini-sidebar") as HTMLElement;
const root = () => document.getElementById("gemini-guide") as HTMLElement;
const guideContent = () => document.querySelector('[data-testid="guide-content"]') as HTMLElement;
const links = () => Array.from(sidebar().querySelectorAll("a"));
const active = () =>
  Array.from(sidebar().querySelectorAll("a"))
    .filter((e) => e.getAttribute("aria-current") === "location")
    .map((e) => e.hash);
const state = (open: boolean) => {
  expect(menu().getAttribute("aria-expanded")).toBe(String(open));
  expect(menu().getAttribute("aria-label")).toBe(open ? "目次を閉じる" : "目次を開く");
  expect(root().classList.contains(styles.open)).toBe(open);
  expect(sidebar().inert).toBe(window.innerWidth <= 900 && !open);
};
beforeEach(() => {
  width = window.innerWidth;
  Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
  position = 0;
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: 10000,
    configurable: true,
  });
  rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const i = ["s0", "s1", "s2"].indexOf(this.id);
    return { top: i < 0 ? 100 : i * 1000 - position, bottom: 200, height: 600 } as DOMRect;
  });
});
afterEach(() => {
  cleanup();
  rect.mockRestore();
  vi.restoreAllMocks();
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 0, configurable: true });
});
it("初期選択とモバイル閉状態・inert", () => {
  render(<Harness />);
  expect(active()).toEqual(["#s0"]);
  state(false);
});
it("トグル往復でaria・クラス・inertを同期", () => {
  render(<Harness />);
  fireEvent.click(menu());
  state(true);
  fireEvent.click(menu());
  state(false);
});
it("背景クリックで閉じる", () => {
  render(<Harness />);
  fireEvent.click(menu());
  fireEvent.click(document.getElementById("gemini-backdrop") as HTMLElement);
  state(false);
});
it("Escapeのみで閉じフォーカスを戻す", () => {
  render(<Harness />);
  fireEvent.click(menu());
  (sidebar().querySelector("a") as HTMLAnchorElement).focus();
  fireEvent.keyDown(document, { key: "Enter" });
  state(true);
  fireEvent.keyDown(document, { key: "Escape" });
  state(false);
  expect(document.activeElement).toBe(menu());
});
it("目次リンクで閉じる", () => {
  render(<Harness />);
  fireEvent.click(menu());
  fireEvent.click(sidebar().querySelector("a") as HTMLAnchorElement);
  state(false);
});
it("900pxを跨いでdesktopのinertを解除しmobileへ戻す", () => {
  render(<Harness />);
  fireEvent.click(menu());
  Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
  fireEvent.resize(window);
  state(false);
  expect(sidebar().inert).toBe(false);
  Object.defineProperty(window, "innerWidth", { value: 900, configurable: true });
  fireEvent.resize(window);
  state(false);
});
it("スクロールとresizeでセクションを選択", () => {
  render(<Harness />);
  position = 1000;
  fireEvent.scroll(window);
  expect(active()).toEqual(["#s1"]);
  position = 2000;
  fireEvent.resize(window);
  expect(active()).toEqual(["#s2"]);
});
it("アンカー余白が25%閾値より大きくても選択", () => {
  vi.spyOn(window, "getComputedStyle").mockReturnValue({
    scrollMarginTop: "400px",
  } as CSSStyleDeclaration);
  render(<Harness />);
  position = 600;
  fireEvent.scroll(window);
  expect(active()).toEqual(["#s1"]);
});
it("最下部では最後のセクションを選択", () => {
  render(<Harness />);
  Object.defineProperty(window, "scrollY", { value: 10000, configurable: true });
  fireEvent.scroll(window);
  expect(active()).toEqual(["#s2"]);
});
it("目次の選択リンクが可視範囲外なら目次内スクロール", () => {
  render(<Harness />);
  const link = sidebar().querySelector("a") as HTMLAnchorElement;
  Object.defineProperty(link, "getBoundingClientRect", {
    value: () => ({ top: 900, bottom: 950, height: 50 }) as DOMRect,
    configurable: true,
  });
  const initial = sidebar().scrollTop;
  fireEvent.scroll(window);
  expect(sidebar().scrollTop).toBeGreaterThan(initial);
});
it("チェック全件・解除でカウンターと幅を更新", () => {
  render(<Harness />);
  const boxes = Array.from(document.querySelectorAll("input"));
  expect(document.getElementById("chkTotal")?.textContent).toBe("2");
  expect(document.getElementById("chkBar")?.style.width).toBe("0%");
  fireEvent.click(boxes[0]);
  expect(document.getElementById("chkCount")?.textContent).toBe("1");
  expect(document.getElementById("chkBar")?.style.width).toBe("50%");
  fireEvent.click(boxes[1]);
  expect(document.getElementById("chkCount")?.textContent).toBe("2");
  expect(document.getElementById("chkBar")?.style.width).toBe("100%");
  fireEvent.click(boxes[0]);
  expect(document.getElementById("chkCount")?.textContent).toBe("1");
});
it("unmountで全リスナー・inert・開状態を解除", () => {
  const remove = vi.spyOn(window, "removeEventListener");
  const { unmount } = render(<Harness />);
  const r = root(),
    s = sidebar(),
    b = menu(),
    count = document.getElementById("chkCount") as HTMLElement,
    box = document.querySelector("input") as HTMLInputElement;
  fireEvent.click(b);
  unmount();
  expect(s.inert).toBe(false);
  expect(r.classList.contains(styles.open)).toBe(false);
  fireEvent.click(b);
  fireEvent.click(box);
  fireEvent.scroll(window);
  expect(count.textContent).toBe("0");
  expect(remove.mock.calls.map((c) => c[0])).toEqual(expect.arrayContaining(["scroll", "resize"]));
});
it("マークアップが無い場合もmount・cleanup可能", () => {
  const { unmount } = render(<TocObserver />);
  fireEvent.scroll(window);
  fireEvent.resize(window);
  unmount();
});
it("モバイルで開くと先頭リンクへ移動し、チェックリストを含む本文をinertにする", () => {
  render(<Harness />);
  menu().focus();
  expect(guideContent().inert).toBe(false);
  fireEvent.click(menu());
  expect(document.activeElement).toBe(links()[0]);
  expect(guideContent().inert).toBe(true);
  expect(guideContent().contains(document.querySelector("input[data-guide-check]"))).toBe(true);
  expect(sidebar().inert).toBe(false);
});
it("開いたままのresizeでは利用者のフォーカス位置を奪わない", () => {
  render(<Harness />);
  fireEvent.click(menu());
  links()[2].focus();
  fireEvent.resize(window);
  expect(document.activeElement).toBe(links()[2]);
  expect(guideContent().inert).toBe(true);
});
it.each([
  ["Escape", () => fireEvent.keyDown(document, { key: "Escape" })],
  ["メニュー", () => fireEvent.click(menu())],
  ["目次リンク", () => fireEvent.click(links()[0])],
])("%sで閉じると本文のinertを解除し開いた要素へフォーカスを戻す", (_label, closeDrawer) => {
  render(<Harness />);
  fireEvent.click(menu());
  closeDrawer();
  expect(guideContent().inert).toBe(false);
  expect(document.activeElement).toBe(menu());
});
it("背景クリックでフォーカスが背景へ移っていても開いた要素へ戻す", () => {
  render(<Harness />);
  fireEvent.click(menu());
  const backdrop = document.getElementById("gemini-backdrop") as HTMLElement;
  backdrop.focus();
  fireEvent.click(backdrop);
  expect(guideContent().inert).toBe(false);
  expect(document.activeElement).toBe(menu());
});
it("閉じた状態のEscapeでは本文のフォーカスを奪わない", () => {
  render(<Harness />);
  const box = document.querySelector("input[data-guide-check]") as HTMLInputElement;
  box.focus();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(document.activeElement).toBe(box);
});
it("デスクトップ幅ではフォーカス移動も本文のinert化も行わない", () => {
  Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
  render(<Harness />);
  menu().focus();
  fireEvent.click(menu());
  expect(document.activeElement).toBe(menu());
  expect(guideContent().inert).toBe(false);
});
it("開いた状態でdesktopへ広げると本文のinertを解除しフォーカスを動かさない", () => {
  render(<Harness />);
  fireEvent.click(menu());
  links()[1].focus();
  Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
  fireEvent.resize(window);
  expect(guideContent().inert).toBe(false);
  expect(document.activeElement).toBe(links()[1]);
});
it("unmountで本文のinertを解除する", () => {
  const { unmount } = render(<Harness />);
  fireEvent.click(menu());
  const content = guideContent();
  expect(content.inert).toBe(true);
  unmount();
  expect(content.inert).toBe(false);
});
