// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./page";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

vi.mock("@/components/docs/MermaidDiagram", () => ({ default: () => null }));
const boxes = () =>
  Array.from(document.querySelectorAll<HTMLInputElement>(`li.${styles.task} input`));
const allCount = () => document.querySelector(`.${styles["ov-sub"]}`)?.textContent;
const counts = () =>
  Array.from(document.querySelectorAll(`.${styles["check-count"]}`)).map((e) => e.textContent);
const faqs = () => Array.from(document.querySelectorAll<HTMLDetailsElement>("details"));
const filter = (value: string) =>
  fireEvent.input(document.getElementById("faq-filter") as HTMLElement, { target: { value } });

let width: number;
let rect: ReturnType<typeof vi.spyOn>;
let position = 0;
function Harness() {
  return (
    <div id="duet-guide" className={styles.root}>
      <button
        id="duet-menu"
        type="button"
        aria-expanded="false"
        aria-label="目次を開く"
        aria-controls="duet-sidebar"
      >
        目次
      </button>
      <button id="duet-backdrop" type="button" aria-label="目次を閉じる" />
      <aside id="duet-sidebar">
        <nav>
          {[0, 1, 2].map((i) => (
            <a key={i} href={`#s${i}`}>
              {i}
            </a>
          ))}
        </nav>
      </aside>
      <main />
      {[0, 1, 2].map((i) => (
        <section key={i} id={`s${i}`} />
      ))}
      <div id="progress" />
      <div id="duet-mobile-bar" />
      <div className={styles["code-block"]}>
        <pre>
          <code>{"line\n    indent"}</code>
        </pre>
        <button type="button" data-copy-code>
          コピー
        </button>
      </div>
      <TocObserver />
    </div>
  );
}
const menu = () => document.getElementById("duet-menu") as HTMLElement;
const sidebar = () => document.getElementById("duet-sidebar") as HTMLElement;
const root = () => document.getElementById("duet-guide") as HTMLElement;
const main = () => document.querySelector("main") as HTMLElement;
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
  localStorage.clear();
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
    const i = ["s0", "s1", "s2"].indexOf(this.id);
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
  fireEvent.click(document.getElementById("duet-backdrop") as HTMLElement);
  state(false);
});
it("背景クリックでフォーカスが背景へ移っていても開いた要素へ戻す", () => {
  render(<Harness />);
  fireEvent.click(menu());
  const backdrop = document.getElementById("duet-backdrop") as HTMLElement;
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
it("読書進捗はスクロール位置で更新し短い文書では0%", () => {
  Object.defineProperty(document.documentElement, "clientHeight", {
    value: 1000,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "scrollTop", { value: 4500, configurable: true });
  render(<Harness />);
  expect(document.getElementById("progress")?.style.width).toBe("50%");
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: 1000,
    configurable: true,
  });
  fireEvent.scroll(window);
  expect(document.getElementById("progress")?.style.width).toBe("0%");
});
it("コピー成功時は全文を渡し1600ms後に表示を戻す", async () => {
  vi.useFakeTimers();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  render(<Harness />);
  const button = document.querySelector("[data-copy-code]") as HTMLButtonElement;
  fireEvent.click(button);
  await Promise.resolve();
  expect(writeText).toHaveBeenCalledWith("line\n    indent");
  expect(button.textContent).toBe("コピー済み");
  expect(button.classList.contains(styles.done)).toBe(true);
  vi.advanceTimersByTime(1600);
  expect(button.textContent).toBe("コピー");
  expect(button.classList.contains(styles.done)).toBe(false);
  vi.useRealTimers();
});
it("コピーが拒否された場合は成功表示にしない", async () => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    configurable: true,
  });
  render(<Harness />);
  const button = document.querySelector("[data-copy-code]") as HTMLButtonElement;
  fireEvent.click(button);
  await Promise.resolve();
  await Promise.resolve();
  expect(button.textContent).toBe("コピー");
});
it("clipboard非対応時はtextarea経由で全文をコピーし破棄する", () => {
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  const exec = vi.fn(() => true);
  Object.defineProperty(document, "execCommand", { value: exec, configurable: true });
  render(<Harness />);
  const button = document.querySelector("[data-copy-code]") as HTMLButtonElement;
  fireEvent.click(button);
  expect(exec).toHaveBeenCalledWith("copy");
  expect(button.textContent).toBe("コピー済み");
  expect(document.querySelector("textarea")).toBeNull();
});
it("fallback失敗時にもtextareaを除去して成功表示を出さない", () => {
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  Object.defineProperty(document, "execCommand", {
    value: () => {
      throw new Error("unsupported");
    },
    configurable: true,
  });
  render(<Harness />);
  const button = document.querySelector("[data-copy-code]") as HTMLButtonElement;
  fireEvent.click(button);
  expect(button.textContent).toBe("コピー");
  expect(document.querySelector("textarea")).toBeNull();
});
it("unmountはイベントとタイマーを解除し遅延コピー結果を無視する", async () => {
  vi.useFakeTimers();
  let finish: () => void = () => undefined;
  const writeText = vi.fn(
    () =>
      new Promise<void>((r) => {
        finish = r;
      })
  );
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  const remove = vi.spyOn(window, "removeEventListener");
  const { unmount } = render(<Harness />);
  const r = root(),
    s = sidebar(),
    button = document.querySelector("[data-copy-code]") as HTMLButtonElement;
  fireEvent.click(menu());
  fireEvent.click(button);
  unmount();
  finish();
  await Promise.resolve();
  vi.runAllTimers();
  expect(button.textContent).toBe("コピー");
  expect(s.inert).toBe(false);
  expect(r.classList.contains(styles.open)).toBe(false);
  expect(remove.mock.calls.map((c) => c[0])).toEqual(expect.arrayContaining(["scroll", "resize"]));
  vi.useRealTimers();
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
  expect(observe).toHaveBeenCalledWith(document.getElementById("duet-mobile-bar"));
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
  /** layout.tsx が #duet-guide の外へ描画する RelatedPages の代役を含めて描画する。 */
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

it("19チェックの初期状態と4カードの分母を正しく表示", () => {
  render(<Page />);
  expect(allCount()).toBe("0 / 19 項目");
  expect(counts()).toEqual(["0 / 6", "0 / 4", "0 / 5", "0 / 4"]);
  expect(boxes().map((b) => b.checked)).toEqual(Array(19).fill(false));
});
it("保存したチェックを復元しカードと全体の進捗へ反映", () => {
  localStorage.setItem("duet-guide-checks-v1", JSON.stringify([0, 1, 2, 3, 4, 5]));
  render(<Page />);
  expect(boxes().map((b) => b.checked)).toEqual([...Array(6).fill(true), ...Array(13).fill(false)]);
  expect(counts()).toEqual(["完了 6 / 6", "0 / 4", "0 / 5", "0 / 4"]);
  expect(allCount()).toBe("6 / 19 項目");
  expect(document.querySelector(`.${styles["ov-num"]}`)?.textContent).toBe("32%");
  expect(
    document.querySelector(`.${styles["check-card"]}`)?.classList.contains(styles.complete)
  ).toBe(true);
});
it("クリックで保存・取り消し・全完了・リセットを同期", () => {
  render(<Page />);
  fireEvent.click(boxes()[0]);
  expect(localStorage.getItem("duet-guide-checks-v1")).toBe("[0]");
  expect(boxes()[0].closest("li")?.classList.contains(styles.done)).toBe(true);
  fireEvent.click(boxes()[0]);
  expect(allCount()).toBe("0 / 19 項目");
  boxes().forEach((b) => {
    fireEvent.click(b);
  });
  expect(document.getElementById("check-overall")?.classList.contains(styles.complete)).toBe(true);
  expect(document.querySelector(`.${styles["ov-num"]}`)?.textContent).toBe("100%");
  fireEvent.click(document.getElementById("check-reset") as HTMLElement);
  expect(boxes().map((b) => b.checked)).toEqual(Array(19).fill(false));
  expect(allCount()).toBe("0 / 19 項目");
  expect(localStorage.getItem("duet-guide-checks-v1")).toBe("[]");
});
it.each(["broken", "{}", "null", "true"])("保存値が不正でも表示と操作を継続: %s", (value) => {
  localStorage.setItem("duet-guide-checks-v1", value);
  render(<Page />);
  expect(allCount()).toBe("0 / 19 項目");
  fireEvent.click(boxes()[0]);
  expect(allCount()).toBe("1 / 19 項目");
});
it("storage読み書き拒否でもチェックとリセット可能", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw Error("denied");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("denied");
  });
  render(<Page />);
  fireEvent.click(boxes()[0]);
  expect(allCount()).toBe("1 / 19 項目");
  fireEvent.click(document.getElementById("check-reset") as HTMLElement);
  expect(allCount()).toBe("0 / 19 項目");
});
it("FAQの初期開閉・検索・件数・一致項目の自動展開・検索解除", () => {
  render(<Page />);
  expect(faqs().map((e) => e.open)).toEqual([
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  filter("  追加料金  ");
  expect(faqs().map((e) => e.classList.contains(styles.hide))).toEqual([
    true,
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  expect(faqs()[1].open).toBe(true);
  expect(document.getElementById("faq-hit")?.textContent).toBe("1 件");
  filter("");
  expect(faqs().map((e) => e.classList.contains(styles.hide))).toEqual(Array(9).fill(false));
  expect(document.getElementById("faq-hit")?.textContent).toBe("");
  expect(document.getElementById("faq-none")?.hidden).toBe(true);
});
it("FAQ検索は回答も大文字小文字を区別せず対象にする", () => {
  render(<Page />);
  filter("OPUS");
  expect(
    faqs()
      .filter((e) => !e.classList.contains(styles.hide))
      .map((e) => e.querySelector("summary")?.textContent?.replace(/\s+/g, " ").trim())
  ).toEqual(["Q6モデルを選べますか？"]);
});
it("該当なし表示と表示中のみの一括展開・全閉じ", () => {
  render(<Page />);
  filter("追加料金");
  fireEvent.click(document.getElementById("faq-close") as HTMLElement);
  expect(faqs().map((e) => e.open)).toEqual(Array(9).fill(false));
  fireEvent.click(document.getElementById("faq-open") as HTMLElement);
  expect(faqs().map((e) => e.open)).toEqual([
    false,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  filter("zzzz-nothing");
  expect(document.getElementById("faq-hit")?.textContent).toBe("0 件");
  expect(document.getElementById("faq-none")?.hidden).toBe(false);
});
it("チェックとFAQイベントはunmount時にすべて解除", () => {
  const remove = vi.spyOn(EventTarget.prototype, "removeEventListener");
  const { unmount } = render(<Page />);
  const box = boxes()[0],
    input = document.getElementById("faq-filter");
  unmount();
  expect(remove.mock.calls.some((c) => c[0] === "change")).toBe(true);
  expect(remove.mock.calls.some((c) => c[0] === "input")).toBe(true);
  fireEvent.click(box);
  expect(localStorage.getItem("duet-guide-checks-v1")).toBeNull();
  expect(input).not.toBeNull();
});
