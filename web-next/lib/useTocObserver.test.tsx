/**
 * 共有 TOC スクロールスパイフック useTocObserver の単体テスト。
 *
 * 各ページの TocObserver.test.tsx はコンポーネント経由の検証に留まるため、
 * サブリンク経路・モバイルサイドバー開閉・複数 entry の最上位選択といった
 * 分岐をここで直接網羅する。
 *
 * DOM 構造は実ページ（app/claude/skills-sh/page.tsx）に倣う:
 *   - TOC リンク / サブリンクはサイドバー内にあり <section> の子孫ではない
 *   - サブリンクの参照先は <section> 内のカード要素（章に内包される）
 */

import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { useTocObserver } from "@/lib/useTocObserver";
import {
  type IntersectionObserverController,
  installIntersectionObserverStub,
} from "@/tests/tocTestUtils";

type Options = Parameters<typeof useTocObserver>[0];

const ACTIVE = "is-active";
const OPEN = "sidebar-open";

const baseOptions: Options = {
  chapterSelector: "section[id], .card[id]",
  tocLinkSelector: ".toc-link",
  activeClassName: ACTIVE,
  tocSubLinkSelector: ".toc-sub-link",
  toggleId: "navToggle",
  sidebarId: "sidebar",
  sidebarOpenClassName: OPEN,
};

function Harness(props: Options) {
  useTocObserver(props);
  return null;
}

/** entries スタブ生成（top は最上位判定に使われる） */
function entry(target: Element | null, top: number): Partial<IntersectionObserverEntry> {
  return {
    isIntersecting: true,
    target: target as Element,
    boundingClientRect: { top } as DOMRect,
  };
}

let io: IntersectionObserverController;

beforeEach(() => {
  io = installIntersectionObserverStub();
});

/**
 * sec-01: リンクあり・カードなし
 * sec-02: リンクあり・カード card-a を内包（親章連動の検証用）
 * sec-03: TOC リンクなし・カード card-b を内包（親章にリンクが無いケース）
 * loose-card: どの <section> にも属さないカード
 */
function renderHarness(overrides: Partial<Options> = {}) {
  return render(
    <div>
      <button type="button" id="navToggle" aria-label="目次" />
      <aside id="sidebar">
        <a className="toc-link" href="#sec-01">
          01
        </a>
        <a className="toc-link" href="#sec-02">
          02
        </a>
        <a className="toc-sub-link" href="#card-a">
          card A
        </a>
        <a className="toc-sub-link" href="#card-b">
          card B
        </a>
        <a className="toc-sub-link" href="#loose-card">
          loose
        </a>
      </aside>
      <section id="sec-01" />
      <section id="sec-02">
        <div className="card" id="card-a" />
      </section>
      <section id="sec-03">
        <div className="card" id="card-b" />
      </section>
      <div className="card" id="loose-card" />
      <Harness {...baseOptions} {...overrides} />
    </div>
  );
}

function tocLinks() {
  return Array.from(document.querySelectorAll(".toc-link"));
}

function subLink(href: string) {
  return document.querySelector(`.toc-sub-link[href="${href}"]`) as HTMLElement;
}

describe("useTocObserver — スクロールスパイ", () => {
  test("章とカードを監視し、初期状態で先頭 TOC リンクを active にする", () => {
    renderHarness();
    // sec-01 / card-a / sec-02 / sec-03 / card-b / loose-card
    expect(io.observedTargets).toHaveLength(6);
    const links = tocLinks();
    expect(links[0].classList.contains(ACTIVE)).toBe(true);
    expect(links[0].getAttribute("aria-current")).toBe("location");
  });

  test("交差した章の TOC リンクへ active を移す", () => {
    renderHarness();
    io.emit([entry(document.getElementById("sec-02"), 10)]);
    const links = tocLinks();
    expect(links[1].classList.contains(ACTIVE)).toBe(true);
    expect(links[1].getAttribute("aria-current")).toBe("location");
    expect(links[0].classList.contains(ACTIVE)).toBe(false);
    expect(links[0].getAttribute("aria-current")).toBeNull();
  });

  test("どの TOC リンクからも参照されない章は無視する", () => {
    renderHarness();
    io.emit([entry(document.getElementById("sec-03"), 10)]);
    const links = tocLinks();
    // 初期状態（先頭リンク active）が維持される
    expect(links[0].classList.contains(ACTIVE)).toBe(true);
    expect(links[1].classList.contains(ACTIVE)).toBe(false);
  });

  test("交差中の要素が複数ある場合は最上位（top が最小）を採用する", () => {
    renderHarness();
    // 後続 entry のほうが上にある場合 → 後続で上書き
    io.emit([
      entry(document.getElementById("sec-01"), 300),
      entry(document.getElementById("sec-02"), 50),
    ]);
    expect(tocLinks()[1].classList.contains(ACTIVE)).toBe(true);

    // 先頭 entry のほうが上にある場合 → 先頭を維持
    io.emit([
      entry(document.getElementById("sec-01"), 20),
      entry(document.getElementById("sec-02"), 400),
    ]);
    expect(tocLinks()[0].classList.contains(ACTIVE)).toBe(true);

    // 交差していない entry は候補にならない
    io.emit([{ isIntersecting: false, target: document.getElementById("sec-02") as Element }]);
    expect(tocLinks()[0].classList.contains(ACTIVE)).toBe(true);
  });
});

describe("useTocObserver — サブリンク", () => {
  test("カードが交差するとサブリンクと親章の TOC リンクが同時に active になる", () => {
    renderHarness();
    io.emit([entry(document.getElementById("card-a"), 10)]);

    const sub = subLink("#card-a");
    expect(sub.classList.contains(ACTIVE)).toBe(true);
    expect(sub.getAttribute("aria-current")).toBe("location");

    const links = tocLinks();
    // card-a を内包する sec-02 の TOC リンクが連動して点灯する
    expect(links[1].classList.contains(ACTIVE)).toBe(true);
    expect(links[0].classList.contains(ACTIVE)).toBe(false);
  });

  test("親章に TOC リンクが無い場合はサブリンクのみ active になる", () => {
    renderHarness();
    io.emit([entry(document.getElementById("card-b"), 10)]);

    expect(subLink("#card-b").classList.contains(ACTIVE)).toBe(true);
    for (const l of tocLinks()) {
      expect(l.classList.contains(ACTIVE)).toBe(false);
    }
  });

  test("章に属さないカードでもサブリンクだけ active になる", () => {
    renderHarness();
    io.emit([entry(document.getElementById("loose-card"), 10)]);

    expect(subLink("#loose-card").classList.contains(ACTIVE)).toBe(true);
    for (const l of tocLinks()) {
      expect(l.classList.contains(ACTIVE)).toBe(false);
    }
  });

  test("別のサブリンクが交差すると直前のサブリンクの active は解除される", () => {
    renderHarness();
    io.emit([entry(document.getElementById("card-a"), 10)]);
    io.emit([entry(document.getElementById("loose-card"), 10)]);

    expect(subLink("#card-a").classList.contains(ACTIVE)).toBe(false);
    expect(subLink("#card-a").getAttribute("aria-current")).toBeNull();
    expect(subLink("#loose-card").classList.contains(ACTIVE)).toBe(true);
  });
});

describe("useTocObserver — モバイルサイドバー", () => {
  test("トグルクリックで開閉し aria-expanded が追随する", () => {
    renderHarness();
    const toggle = document.getElementById("navToggle") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(OPEN)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(OPEN)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("TOC リンク / サブリンクのクリックでサイドバーが閉じる", () => {
    renderHarness();
    const toggle = document.getElementById("navToggle") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.click(tocLinks()[0]);
    expect(sidebar.classList.contains(OPEN)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle);
    fireEvent.click(subLink("#card-a"));
    expect(sidebar.classList.contains(OPEN)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("トグル / サイドバーが DOM に無くても例外なくマウントできる", () => {
    expect(() =>
      render(
        <div>
          <nav>
            <a className="toc-link" href="#sec-01">
              01
            </a>
          </nav>
          <section id="sec-01" />
          <Harness {...baseOptions} />
        </div>
      )
    ).not.toThrow();
    expect(tocLinks()[0].classList.contains(ACTIVE)).toBe(true);
  });

  test("サイドバーだけ存在しない場合もトグルの aria-expanded は初期化される", () => {
    render(
      <div>
        <button type="button" id="navToggle" aria-label="目次" />
        <nav>
          <a className="toc-link" href="#sec-01">
            01
          </a>
        </nav>
        <section id="sec-01" />
        <Harness {...baseOptions} sidebarId="missing-sidebar" />
      </div>
    );
    const toggle = document.getElementById("navToggle") as HTMLElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    // リスナ未登録のためクリックしても状態は変わらない
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("サイドバー連携オプション未指定でもスクロールスパイは機能する", () => {
    render(
      <div>
        <nav>
          <a className="toc-link" href="#sec-01">
            01
          </a>
          <a className="toc-link" href="#sec-02">
            02
          </a>
        </nav>
        <section id="sec-01" />
        <section id="sec-02" />
        <Harness
          chapterSelector="section[id]"
          tocLinkSelector=".toc-link"
          activeClassName={ACTIVE}
        />
      </div>
    );
    io.emit([entry(document.getElementById("sec-02"), 10)]);
    expect(tocLinks()[1].classList.contains(ACTIVE)).toBe(true);
  });
});

describe("useTocObserver — クリーンアップ", () => {
  test("unmount で observer を切断しトグルのリスナを解除する", () => {
    const { unmount } = renderHarness();
    const toggle = document.getElementById("navToggle") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(OPEN)).toBe(true);

    unmount();
    expect(io.disconnectCount).toBe(1);

    // unmount 後のクリックは何も起こさない（リスナ解除の確認）
    document.body.appendChild(toggle);
    document.body.appendChild(sidebar);
    sidebar.classList.remove(OPEN);
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(OPEN)).toBe(false);
  });
});
