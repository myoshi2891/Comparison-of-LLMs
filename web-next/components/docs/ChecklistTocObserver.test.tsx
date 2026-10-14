// @vitest-environment jsdom
import { act, fireEvent, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import adversarialStyles from "@/app/books/adversarial-robustness/page.module.css";
import AdversarialTocObserver from "@/app/books/adversarial-robustness/TocObserver";
import handbookStyles from "@/app/books/llm-engineers-handbook/page.module.css";
import HandbookTocObserver from "@/app/books/llm-engineers-handbook/TocObserver";
import ChecklistTocObserver from "./ChecklistTocObserver";

const CLASS_NAMES = { open: "open", show: "show", active: "active", done: "done" };

type ObserverCallback = (entries: Array<{ target: Element; isIntersecting: boolean }>) => void;

/** IntersectionObserver の最小スタブ。コールバックと監視対象を記録して決定論的に発火させる。 */
function stubIntersectionObserver() {
  const state = {
    callback: null as ObserverCallback | null,
    observed: [] as Element[],
    disconnect: vi.fn(),
  };
  class FakeObserver {
    constructor(callback: ObserverCallback) {
      state.callback = callback;
    }
    observe(target: Element) {
      state.observed.push(target);
    }
    disconnect() {
      state.disconnect();
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  return state;
}

function setInnerWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
}

function fixture(observer: ReactNode, ids = { checklist: "checklistItems", counter: "ckCounter" }) {
  return render(
    <div data-testid="layout-root">
      <button type="button" id="menuToggle" aria-expanded="false" aria-controls="sidebar" />
      <div id="scrim" />
      <aside id="sidebar">
        <a href="#s1">S1</a>
        <a href="#s2">S2</a>
        <a href="#missing">Missing</a>
      </aside>
      <section id="s1" />
      <section id="s2" />
      <ul id={ids.checklist}>
        <li>
          <input type="checkbox" aria-label="c1" />
        </li>
        <li>
          <input type="checkbox" aria-label="c2" />
        </li>
      </ul>
      <span id={ids.counter} />
      {observer}
    </div>
  );
}

function sharedObserver(breakpoint = 980) {
  return (
    <ChecklistTocObserver
      classNames={CLASS_NAMES}
      mobileBreakpoint={breakpoint}
      checklistId="checklistItems"
      counterId="ckCounter"
      counterSeparator=" / "
    />
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ChecklistTocObserver — モバイルメニュー", () => {
  it("トグルで開閉し aria-expanded と open/show クラスを同期する", () => {
    // Arrange
    const { container } = fixture(sharedObserver());
    const toggle = container.querySelector("#menuToggle") as HTMLElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const scrim = container.querySelector("#scrim") as HTMLElement;

    // Act
    fireEvent.click(toggle);

    // Assert
    expect(sidebar.classList.contains("open")).toBe(true);
    expect(scrim.classList.contains("show")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains("open")).toBe(false);
    expect(scrim.classList.contains("show")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("scrim クリックでサイドバーを閉じる", () => {
    // Arrange
    const { container } = fixture(sharedObserver());
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    fireEvent.click(container.querySelector("#menuToggle") as HTMLElement);

    // Act
    fireEvent.click(container.querySelector("#scrim") as HTMLElement);

    // Assert
    expect(sidebar.classList.contains("open")).toBe(false);
  });

  it("ブレークポイント以下（inclusive）でのみ目次リンククリック時に閉じる", () => {
    // Arrange
    const { container } = fixture(sharedObserver(980));
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const link = container.querySelector('a[href="#s1"]') as HTMLElement;
    fireEvent.click(container.querySelector("#menuToggle") as HTMLElement);

    // Act: デスクトップ幅では閉じない
    setInnerWidth(981);
    fireEvent.click(link);

    // Assert
    expect(sidebar.classList.contains("open")).toBe(true);

    setInnerWidth(980);
    fireEvent.click(link);
    expect(sidebar.classList.contains("open")).toBe(false);
  });
});

describe("ChecklistTocObserver — チェックリスト", () => {
  it("初期カウンタを描画し、チェックで件数と done クラスを更新する", () => {
    // Arrange
    const { container } = fixture(sharedObserver());
    const counter = container.querySelector("#ckCounter") as HTMLElement;
    const [first] = Array.from(container.querySelectorAll<HTMLInputElement>("input"));

    // Assert: 初期値
    expect(counter.textContent).toBe("0 / 2 完了");

    // Act
    fireEvent.click(first);

    // Assert
    expect(counter.textContent).toBe("1 / 2 完了");
    expect(first.closest("li")?.classList.contains("done")).toBe(true);

    fireEvent.click(first);
    expect(counter.textContent).toBe("0 / 2 完了");
    expect(first.closest("li")?.classList.contains("done")).toBe(false);
  });

  it("チェックリストが存在しなくても例外を投げない", () => {
    // Arrange / Act
    const { container } = fixture(sharedObserver(), {
      checklist: "other",
      counter: "otherCounter",
    });

    // Assert
    expect(container.querySelector("#otherCounter")?.textContent).toBe("");
  });
});

describe("ChecklistTocObserver — スクロールスパイ", () => {
  it("交差したセクションのリンクだけを active + aria-current にする", () => {
    // Arrange
    const io = stubIntersectionObserver();
    const { container } = fixture(sharedObserver());
    const s1 = container.querySelector("#s1") as Element;
    const s2 = container.querySelector("#s2") as Element;
    const link1 = container.querySelector('a[href="#s1"]') as HTMLElement;
    const link2 = container.querySelector('a[href="#s2"]') as HTMLElement;

    // Assert: 存在するターゲットのみ監視する
    expect(io.observed).toEqual([s1, s2]);

    // Act
    act(() => io.callback?.([{ target: s1, isIntersecting: true }]));
    act(() =>
      io.callback?.([
        { target: s1, isIntersecting: false },
        { target: s2, isIntersecting: true },
      ])
    );

    // Assert
    expect(link1.classList.contains("active")).toBe(false);
    expect(link1.hasAttribute("aria-current")).toBe(false);
    expect(link2.classList.contains("active")).toBe(true);
    expect(link2.getAttribute("aria-current")).toBe("location");
  });

  it("アンマウント時に observer を切断しリスナーを解除する", () => {
    // Arrange
    const io = stubIntersectionObserver();
    const { container, unmount } = fixture(sharedObserver());
    const toggle = container.querySelector("#menuToggle") as HTMLElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;

    // Act
    unmount();
    fireEvent.click(toggle);

    // Assert
    expect(io.disconnect).toHaveBeenCalledTimes(1);
    expect(sidebar.classList.contains("open")).toBe(false);
  });

  it("IntersectionObserver 非対応環境でもメニューは動作し、解除も行う", () => {
    // Arrange
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container, unmount } = fixture(sharedObserver());
    const toggle = container.querySelector("#menuToggle") as HTMLElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;

    // Act
    fireEvent.click(toggle);

    // Assert
    expect(sidebar.classList.contains("open")).toBe(true);
    unmount();
    fireEvent.click(toggle);
    expect(sidebar.classList.contains("open")).toBe(true);
  });

  it("layout-root が無ければ何もしない", () => {
    // Arrange / Act / Assert
    expect(() => render(sharedObserver())).not.toThrow();
  });
});

describe("ページ別ラッパー", () => {
  it("adversarial-robustness: 980px・#checklistItems/#ckCounter・' / ' 区切りで委譲する", () => {
    // Arrange
    const { container } = fixture(<AdversarialTocObserver />);
    const sidebar = container.querySelector("#sidebar") as HTMLElement;

    // Act
    fireEvent.click(container.querySelector("#menuToggle") as HTMLElement);

    // Assert
    expect(container.querySelector("#ckCounter")?.textContent).toBe("0 / 2 完了");
    expect(sidebar.classList.contains(adversarialStyles.open)).toBe(true);
  });

  it("llm-engineers-handbook: #setupChecklist/#checklistCounter・'/' 区切りで委譲する", () => {
    // Arrange
    const { container } = fixture(<HandbookTocObserver />, {
      checklist: "setupChecklist",
      counter: "checklistCounter",
    });
    const sidebar = container.querySelector("#sidebar") as HTMLElement;

    // Act
    fireEvent.click(container.querySelector("#menuToggle") as HTMLElement);
    setInnerWidth(960);
    fireEvent.click(container.querySelector('a[href="#s1"]') as HTMLElement);

    // Assert
    expect(container.querySelector("#checklistCounter")?.textContent).toBe("0/2 完了");
    expect(sidebar.classList.contains(handbookStyles.open)).toBe(false);
  });
});
