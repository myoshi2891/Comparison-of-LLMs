// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

const sectionIds = ["sec-1", "sec-2", "sec-3"];

type ListenerRecord = { target: unknown; type: unknown; callback: unknown; capture: boolean };
/** spy の呼び出しを「対象・種別・コールバック・capture」の組へ正規化する。 */
const listenerRecords = ({ mock }: { mock: { calls: unknown[][]; contexts: unknown[] } }) =>
  mock.calls.map(
    ([type, callback, options], i): ListenerRecord => ({
      target: mock.contexts[i],
      type,
      callback,
      capture:
        typeof options === "boolean"
          ? options
          : typeof options === "object" &&
            options !== null &&
            "capture" in options &&
            Boolean(options.capture),
    })
  );
const isSameListener = (a: ListenerRecord, b: ListenerRecord) =>
  a.target === b.target &&
  a.type === b.type &&
  a.callback === b.callback &&
  a.capture === b.capture;

let width: number;
let rect: ReturnType<typeof vi.spyOn>;
let position = 0;
function Harness({ checked = false }: { checked?: boolean }) {
  return (
    <div id="antigravity-guide" className={styles.root}>
      <button id="antigravity-backdrop" type="button" aria-label="目次を閉じる" />
      <aside id="antigravity-sidebar">
        <nav>
          {[0, 1, 2].map((i) => (
            <a key={i} href={`#${sectionIds[i]}`}>
              {i}
            </a>
          ))}
        </nav>
      </aside>
      <div id="antigravity-mobile-bar">
        <button
          id="antigravity-menu"
          type="button"
          aria-expanded="false"
          aria-label="目次を開く"
          aria-controls="antigravity-sidebar"
        >
          目次
        </button>
      </div>
      <div data-guide-content>
        <span id="chkDone">0</span>
        <table>
          <tbody>
            {[0, 1, 2].map((i) => (
              <tr key={i}>
                <td>
                  <label className={styles.chk}>
                    <input
                      type="checkbox"
                      defaultChecked={checked && i === 0}
                      aria-label={`item-${i}`}
                    />
                  </label>
                </td>
                <td>{i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {[0, 1, 2].map((i) => (
        <section key={i} id={sectionIds[i]} />
      ))}

      <TocObserver />
    </div>
  );
}
const menu = () => document.getElementById("antigravity-menu") as HTMLElement;
const sidebar = () => document.getElementById("antigravity-sidebar") as HTMLElement;
const root = () => document.getElementById("antigravity-guide") as HTMLElement;
const main = () => document.querySelector("[data-guide-content]") as HTMLElement;
const links = () => Array.from(sidebar().querySelectorAll("a"));
const active = () =>
  Array.from(sidebar().querySelectorAll("a"))
    .filter((e) => e.getAttribute("aria-current") === "location")
    .map((e) => e.getAttribute("href"));
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
  Object.defineProperty(document.documentElement, "clientHeight", { value: 0, configurable: true });
  Object.defineProperty(document.documentElement, "scrollTop", { value: 0, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: 10000,
    configurable: true,
  });
  rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const i = sectionIds.indexOf(this.id);
    return { top: i < 0 ? 100 : i * 1000 - position, bottom: 200, height: 600 } as DOMRect;
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  rect.mockRestore();
  vi.restoreAllMocks();
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true });
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: 0, configurable: true });
});
it("初期選択とモバイル閉状態・inert", () => {
  render(<Harness />);
  expect(active()).toEqual(["#sec-1"]);
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
  fireEvent.click(document.getElementById("antigravity-backdrop") as HTMLElement);
  state(false);
});
it("背景クリックでフォーカスが背景へ移っていても開いた要素へ戻す", () => {
  render(<Harness />);
  fireEvent.click(menu());
  const backdrop = document.getElementById("antigravity-backdrop") as HTMLElement;
  backdrop.focus();
  fireEvent.click(backdrop);
  state(false);
  expect(document.activeElement).toBe(menu());
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
  expect(active()).toEqual(["#sec-2"]);
  position = 2000;
  fireEvent.resize(window);
  expect(active()).toEqual(["#sec-3"]);
});
it("アンカー余白が25%閾値より大きくても選択", () => {
  vi.spyOn(window, "getComputedStyle").mockReturnValue({
    scrollMarginTop: "400px",
  } as CSSStyleDeclaration);
  render(<Harness />);
  position = 600;
  fireEvent.scroll(window);
  expect(active()).toEqual(["#sec-2"]);
});
it("最下部では最後のセクションを選択", () => {
  render(<Harness />);
  Object.defineProperty(window, "scrollY", { value: 10000, configurable: true });
  fireEvent.scroll(window);
  expect(active()).toEqual(["#sec-3"]);
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
it("モバイルバーの実測高さとResizeObserver cleanup", () => {
  const disconnect = vi.fn(),
    observe = vi.fn();
  let callback: () => void = () => undefined;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: () => void) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
    }
  );
  const { unmount } = render(<Harness />);
  expect(root().style.getPropertyValue("--mobile-bar-height")).toBe("600px");
  expect(observe).toHaveBeenCalledWith(document.getElementById("antigravity-mobile-bar"));
  callback();
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  vi.unstubAllGlobals();
});
it("マークアップが無い場合もmount・cleanup可能", () => {
  const { unmount } = render(<TocObserver />);
  fireEvent.scroll(window);
  fireEvent.resize(window);
  unmount();
});

it("モバイルで開く遷移時だけ先頭リンクへフォーカスし、開いている間は本文をinertにする", () => {
  render(<Harness />);
  expect(main().inert).toBe(false);
  fireEvent.click(menu());
  expect(document.activeElement).toBe(links()[0]);
  expect(main().inert).toBe(true);
  // 開いたままの再同期（resize）では利用者のフォーカス位置を奪わない
  links()[2].focus();
  fireEvent.resize(window);
  expect(document.activeElement).toBe(links()[2]);
  expect(main().inert).toBe(true);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(main().inert).toBe(false);
  expect(document.activeElement).toBe(menu());
});
it("デスクトップ幅ではフォーカス移動も本文のinert化も行わない", () => {
  Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
  render(<Harness />);
  menu().focus();
  fireEvent.click(menu());
  expect(document.activeElement).toBe(menu());
  expect(main().inert).toBe(false);
});
it("開いた状態でmobileからdesktopへ広げると本文のinertを解除する", () => {
  render(<Harness />);
  fireEvent.click(menu());
  Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
  fireEvent.resize(window);
  expect(main().inert).toBe(false);
});
it("unmountで本文のinertを解除する", () => {
  const { unmount } = render(<Harness />);
  fireEvent.click(menu());
  const m = main();
  expect(m.inert).toBe(true);
  unmount();
  expect(m.inert).toBe(false);
});
describe("モバイルドロワーのTabフォーカス閉じ込め", () => {
  /** layout.tsx が #antigravity-guide の外へ描画する RelatedPages の代役を含めて描画する。 */
  const renderWithRelated = () =>
    render(
      <>
        <Harness />
        <button id="related-page" type="button">
          関連ページ
        </button>
      </>
    );
  const related = () => document.getElementById("related-page") as HTMLElement;
  /** Tab を送り、ブラウザ既定の移動を止めたかどうかを返す。 */
  const pressTab = (shiftKey = false) => !fireEvent.keyDown(document, { key: "Tab", shiftKey });

  it("最後のメニューからTabで先頭リンクへ戻す", () => {
    renderWithRelated();
    fireEvent.click(menu());
    menu().focus();
    expect(pressTab()).toBe(true);
    expect(document.activeElement).toBe(links()[0]);
  });
  it("先頭リンクからShift+Tabで最後のメニューへ戻す", () => {
    renderWithRelated();
    fireEvent.click(menu());
    expect(document.activeElement).toBe(links()[0]);
    expect(pressTab(true)).toBe(true);
    expect(document.activeElement).toBe(menu());
  });
  it("ドロワー外のRelatedPagesへ出たフォーカスを先頭リンクへ戻す", () => {
    renderWithRelated();
    fireEvent.click(menu());
    related().focus();
    expect(pressTab()).toBe(true);
    expect(document.activeElement).toBe(links()[0]);
  });
  it("ドロワー外からのShift+Tabは最後のメニューへ戻す", () => {
    renderWithRelated();
    fireEvent.click(menu());
    related().focus();
    expect(pressTab(true)).toBe(true);
    expect(document.activeElement).toBe(menu());
  });
  it("目次リンクの途中ではブラウザ既定のTab移動を妨げない", () => {
    renderWithRelated();
    fireEvent.click(menu());
    links()[1].focus();
    expect(pressTab()).toBe(false);
    expect(pressTab(true)).toBe(false);
    expect(document.activeElement).toBe(links()[1]);
  });
  it("閉じると閉じ込めを解除し、inertとフォーカス復帰を維持する", () => {
    renderWithRelated();
    fireEvent.click(menu());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(main().inert).toBe(false);
    expect(document.activeElement).toBe(menu());
    related().focus();
    expect(pressTab()).toBe(false);
    expect(document.activeElement).toBe(related());
  });
  it("デスクトップ幅では開状態でもTabを妨げない", () => {
    Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
    renderWithRelated();
    fireEvent.click(menu());
    menu().focus();
    expect(pressTab()).toBe(false);
    expect(document.activeElement).toBe(menu());
  });
  it("Tab以外のキーは開状態でも妨げない", () => {
    renderWithRelated();
    fireEvent.click(menu());
    menu().focus();
    expect(fireEvent.keyDown(document, { key: "Enter" })).toBe(true);
    expect(document.activeElement).toBe(menu());
  });
});

it("unmount時にscroll・resize・クリック・キー監視を解除", () => {
  // window の登録は EventTarget.prototype の spy を通らないため、window にも spy を張る。
  const addWindow = vi.spyOn(window, "addEventListener");
  const removeWindow = vi.spyOn(window, "removeEventListener");
  const add = vi.spyOn(EventTarget.prototype, "addEventListener");
  const remove = vi.spyOn(EventTarget.prototype, "removeEventListener");
  const { unmount } = render(<Harness />);
  const r = root(),
    s = sidebar(),
    m = main();
  const expected: Array<[EventTarget, string]> = [
    [window, "scroll"],
    [window, "resize"],
    [menu(), "click"],
    [document.getElementById("antigravity-backdrop") as HTMLElement, "click"],
    [document, "keydown"],
    ...links().map((link): [EventTarget, string] => [link, "click"]),
  ];
  // React が親要素へ張る委譲リスナーは解除されないため、期待する対象と種別に絞る。
  const registered = [...listenerRecords(add), ...listenerRecords(addWindow)].filter((a) =>
    expected.some(([target, type]) => a.target === target && a.type === type)
  );
  for (const [target, type] of expected) {
    expect(registered.filter((a) => a.target === target && a.type === type)).not.toEqual([]);
  }
  fireEvent.click(menu());
  unmount();
  expect(r.classList.contains(styles.open)).toBe(false);
  expect(s.inert).toBe(false);
  expect(m.inert).toBe(false);
  const removed = [...listenerRecords(remove), ...listenerRecords(removeWindow)];
  const leaked = registered.filter((a) => !removed.some((x) => isSameListener(a, x)));
  expect(leaked.map((a) => a.type)).toEqual([]);
});

it("表形式チェックの全行とカウンターを同期し、他ページのチェックを集計しない", () => {
  const { container } = render(
    <>
      <input type="checkbox" aria-label="outside" defaultChecked />
      <Harness />
    </>
  );
  const boxes = Array.from(
    container.querySelectorAll<HTMLInputElement>(`label.${styles.chk} input`)
  );
  const count = container.querySelector("#chkDone");
  expect(count?.textContent).toBe("0");
  for (let i = 0; i < boxes.length; i++) {
    fireEvent.click(boxes[i]);
    expect(count?.textContent).toBe(String(i + 1));
    expect(boxes.map((b) => b.closest("tr")?.classList.contains(styles.done))).toEqual(
      boxes.map((_, j) => j <= i)
    );
  }
  fireEvent.click(boxes[1]);
  expect(count?.textContent).toBe("2");
  expect(boxes.map((b) => b.closest("tr")?.classList.contains(styles.done))).toEqual([
    true,
    false,
    true,
  ]);
});
it("初期チェック済みの行もマウント時に集計・装飾する", () => {
  const { container } = render(<Harness checked />);
  const boxes = Array.from(
    container.querySelectorAll<HTMLInputElement>(`label.${styles.chk} input`)
  );
  expect(container.querySelector("#chkDone")?.textContent).toBe("1");
  expect(boxes.map((b) => b.closest("tr")?.classList.contains(styles.done))).toEqual([
    true,
    false,
    false,
  ]);
});
it("unmount後は全チェックのchangeリスナーを解除する", () => {
  const add = vi.spyOn(EventTarget.prototype, "addEventListener");
  const remove = vi.spyOn(EventTarget.prototype, "removeEventListener");
  const { container, unmount } = render(<Harness />);
  const boxes = Array.from(
    container.querySelectorAll<HTMLInputElement>(`label.${styles.chk} input`)
  );
  const count = container.querySelector("#chkDone");
  const registered = listenerRecords(add).filter(
    (a) => boxes.includes(a.target as HTMLInputElement) && a.type === "change"
  );
  expect(registered.map((a) => a.target)).toEqual(boxes);
  unmount();
  const removed = listenerRecords(remove);
  expect(registered.filter((a) => !removed.some((b) => isSameListener(a, b)))).toEqual([]);
  for (const box of boxes) fireEvent.click(box);
  expect(count?.textContent).toBe("0");
  expect(boxes.map((b) => b.closest("tr")?.classList.contains(styles.done))).toEqual([
    false,
    false,
    false,
  ]);
});
it("モバイルバーのボタンはinertにせず、本文だけを対象にする", () => {
  render(<Harness />);
  fireEvent.click(menu());
  expect(main().inert).toBe(true);
  expect(menu().closest("[inert]")).toBeNull();
  expect(main().contains(menu())).toBe(false);
});
it("ResizeObserver非対応でも実測高・resize・cleanupが動作する", () => {
  vi.stubGlobal("ResizeObserver", undefined);
  const { unmount } = render(<Harness />);
  const r = root();
  expect(r.style.getPropertyValue("--mobile-bar-height")).toBe("600px");
  fireEvent.resize(window);
  unmount();
  expect(r.style.getPropertyValue("--mobile-bar-height")).toBe("");
  vi.unstubAllGlobals();
});
describe("モバイルドロワー表示中の背景全体のinert化", () => {
  /** layout.tsx がルート外へ描画する共有ヘッダー等の代役を body 直下へ置く。 */
  const outside = (id: string, inert = false) => {
    const el = document.createElement("div");
    el.id = id;
    el.inert = inert;
    document.body.appendChild(el);
    return el;
  };
  afterEach(() => {
    for (const id of ["outside-header", "outside-preinert"]) document.getElementById(id)?.remove();
  });

  it("開くとルート外の兄弟・同階層の要素もinertにし、目次・メニュー・背景は操作可能に保つ", () => {
    const header = outside("outside-header");
    render(<Harness />);
    fireEvent.click(menu());
    expect(header.inert).toBe(true);
    expect(main().inert).toBe(true);
    // inert プロパティが属性へ反映されることを確かめ、下の closest 検証を意味のあるものにする
    expect(main().closest("[inert]")).not.toBeNull();
    expect(sidebar().inert).toBe(false);
    expect(menu().closest("[inert]")).toBeNull();
    expect(document.getElementById("antigravity-backdrop")?.closest("[inert]")).toBeNull();
    expect(sidebar().closest("[inert]")).toBeNull();
  });
  it("閉じる・desktopへの拡大・unmountで元のinert状態へ戻す", () => {
    const header = outside("outside-header");
    const preinert = outside("outside-preinert", true);
    const { unmount } = render(<Harness />);
    fireEvent.click(menu());
    expect(header.inert).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect([header.inert, preinert.inert]).toEqual([false, true]);
    fireEvent.click(menu());
    Object.defineProperty(window, "innerWidth", { value: 901, configurable: true });
    fireEvent.resize(window);
    expect([header.inert, preinert.inert]).toEqual([false, true]);
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    fireEvent.resize(window);
    fireEvent.click(menu());
    expect(header.inert).toBe(true);
    unmount();
    expect([header.inert, preinert.inert]).toEqual([false, true]);
  });
});
