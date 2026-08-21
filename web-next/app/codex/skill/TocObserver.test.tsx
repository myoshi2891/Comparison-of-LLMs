// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

describe("/codex/skill — TocObserver", () => {
  // スタブを張ったまま次のテストファイルへ漏らさない。
  const stubs: Array<{ restore(): void }> = [];
  const originalInnerWidth = window.innerWidth;
  afterEach(() => {
    while (stubs.length > 0) stubs.pop()?.restore();
    setInnerWidth(originalInnerWidth);
  });

  /** jsdom の window.innerWidth は書き換え可能なため、モバイル判定を直接注入する。 */
  function setInnerWidth(value: number) {
    Object.defineProperty(window, "innerWidth", { value, configurable: true, writable: true });
  }

  const installStub = () => {
    const io = installIntersectionObserverStub();
    stubs.push(io);
    return io;
  };

  const renderToc = () =>
    render(
      <div>
        <ul className={styles.toc}>
          <li>
            <a href="#sec-1">1</a>
          </li>
          <li>
            <a href="#sec-2">2</a>
          </li>
        </ul>
        <div id="sec-1">Sec 1</div>
        <div id="sec-2">Sec 2</div>
        <TocObserver />
      </div>
    );

  it("交差したセクションのリンクだけがアクティブになる", () => {
    const io = installStub();
    const { container } = renderToc();

    expect(io.observedTargets.map((el) => el.id)).toEqual(["sec-1", "sec-2"]);

    io.emit([{ target: container.querySelector("#sec-2") as Element, isIntersecting: true }]);

    expect(container.querySelector(`.${styles.toc} a.${styles.active}`)?.getAttribute("href")).toBe(
      "#sec-2"
    );
  });

  it("同時に交差した場合は最上位のセクションが選ばれる", () => {
    const io = installStub();
    const { container } = renderToc();

    const first = container.querySelector("#sec-1") as HTMLElement;
    const second = container.querySelector("#sec-2") as HTMLElement;
    first.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;
    second.getBoundingClientRect = () => ({ top: 320 }) as DOMRect;

    // 上→下の順で流す。「最後の交差」を採用する実装だと下の #sec-2 が勝ってしまうため、
    // この順序でこそ「最上位が選ばれる」契約を検証できる。
    io.emit([
      { target: first, isIntersecting: true },
      { target: second, isIntersecting: true },
    ]);

    expect(container.querySelector(`.${styles.toc} a.${styles.active}`)?.getAttribute("href")).toBe(
      "#sec-1"
    );
  });
  /** ハンバーガー・サイドバー・バックドロップを備えたモバイル用フィクスチャ。 */
  const renderMobileToc = ({ withSidebar = true }: { withSidebar?: boolean } = {}) =>
    render(
      <div>
        <button type="button" id="hamburgerBtn" aria-label="目次を開く" />
        {withSidebar ? <aside id="sidebar" /> : null}
        <div id="sidebarBackdrop" />
        <ul className={styles.toc}>
          <li>
            <a href="#sec-1">1</a>
          </li>
        </ul>
        <div id="sec-1">Sec 1</div>
        <TocObserver />
      </div>
    );

  it("交差が解除されたセクションはアクティブ判定から外れる", () => {
    const io = installStub();
    const { container } = renderToc();

    const first = container.querySelector("#sec-1") as HTMLElement;
    const second = container.querySelector("#sec-2") as HTMLElement;
    first.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;
    second.getBoundingClientRect = () => ({ top: 320 }) as DOMRect;

    io.emit([
      { target: first, isIntersecting: true },
      { target: second, isIntersecting: true },
    ]);
    io.emit([{ target: first, isIntersecting: false }]);

    expect(container.querySelector(`.${styles.toc} a.${styles.active}`)?.getAttribute("href")).toBe(
      "#sec-2"
    );
  });

  it("交差が 1 つも無ければアクティブを変更しない", () => {
    const io = installStub();
    const { container } = renderToc();

    io.emit([{ target: container.querySelector("#sec-1") as Element, isIntersecting: false }]);

    expect(container.querySelector(`.${styles.toc} a.${styles.active}`)).toBeNull();
  });

  it("ハンバーガーでサイドバーとバックドロップが開閉し aria 状態が同期する", () => {
    installStub();
    renderMobileToc();
    const button = document.getElementById("hamburgerBtn") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const backdrop = document.getElementById("sidebarBackdrop") as HTMLElement;

    fireEvent.click(button);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(true);
    expect(backdrop.classList.contains(styles.sidebarOpen)).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("目次を閉じる");

    fireEvent.click(button);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(backdrop.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-label")).toBe("目次を開く");
  });

  it("バックドロップのクリックでサイドバーが閉じる", () => {
    installStub();
    renderMobileToc();
    const button = document.getElementById("hamburgerBtn") as HTMLElement;
    const backdrop = document.getElementById("sidebarBackdrop") as HTMLElement;

    fireEvent.click(button);
    fireEvent.click(backdrop);

    expect(document.getElementById("sidebar")?.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("サイドバーが無いページでは aria-expanded を書き換えない", () => {
    installStub();
    renderMobileToc({ withSidebar: false });
    const button = document.getElementById("hamburgerBtn") as HTMLElement;

    fireEvent.click(button);

    // classList.toggle が undefined を返し aria-expanded="undefined" になる退行の検知。
    expect(button.hasAttribute("aria-expanded")).toBe(false);
  });

  it("モバイル幅では目次リンクのクリックでサイドバーが閉じる", () => {
    installStub();
    renderMobileToc();
    const button = document.getElementById("hamburgerBtn") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(button);
    setInnerWidth(900);
    fireEvent.click(document.querySelector(`.${styles.toc} a`) as HTMLElement);

    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
  });

  it("デスクトップ幅では目次リンクをクリックしてもサイドバーは開いたまま", () => {
    installStub();
    renderMobileToc();
    const button = document.getElementById("hamburgerBtn") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(button);
    setInnerWidth(1280);
    fireEvent.click(document.querySelector(`.${styles.toc} a`) as HTMLElement);

    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(true);
  });

  it("アンマウントで observer を切断しリスナを解除する", () => {
    const io = installStub();
    const { unmount } = renderMobileToc();
    const button = document.getElementById("hamburgerBtn") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    unmount();
    expect(io.disconnectCount).toBe(1);

    fireEvent.click(button);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
  });
});
