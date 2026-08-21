// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

describe("/google/multi-agent-best-practices — TocObserver", () => {
  // スタブを張ったまま次のテストファイルへ漏らさない。
  const stubs: Array<{ restore(): void }> = [];
  afterEach(() => {
    while (stubs.length > 0) stubs.pop()?.restore();
  });

  const installStub = () => {
    const io = installIntersectionObserverStub();
    stubs.push(io);
    return io;
  };

  /**
   * サイドバー・目次リンク・セクションを備えた最小フィクスチャを描画する。
   *
   * @param options.withLinks 目次リンクを描画するか（空 TOC 分岐の検証用）
   */
  const renderToc = ({ withLinks = true }: { withLinks?: boolean } = {}) =>
    render(
      <div>
        <button type="button" className={styles.sidebarToggle} aria-label="メニューを開く" />
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            {withLinks ? (
              <>
                <a href="#sec-1">1</a>
                <a href="#sec-2">2</a>
                {/* ハッシュ以外の href（startsWith("#") の false 分岐） */}
                <a href="https://example.com/">External</a>
                {/* 解決できない href（getElementById が null を返す分岐） */}
                <a href="#missing">Missing</a>
              </>
            ) : null}
          </nav>
        </aside>
        <section id="sec-1">Sec 1</section>
        <section id="sec-2">Sec 2</section>
        <TocObserver />
      </div>
    );

  it("ハッシュ href かつ実在するセクションだけを監視する", () => {
    const io = installStub();
    renderToc();

    expect(io.observedTargets.map((el) => el.id)).toEqual(["sec-1", "sec-2"]);
  });

  it("交差したセクションのリンクだけがアクティブになる", () => {
    const io = installStub();
    const { container } = renderToc();
    const second = container.querySelector("#sec-2") as Element;

    io.emit([{ target: second, isIntersecting: false }]);
    expect(container.querySelector(`.${styles.sideNav} a.${styles.active}`)).toBeNull();

    io.emit([{ target: second, isIntersecting: true }]);
    expect(
      container.querySelector(`.${styles.sideNav} a.${styles.active}`)?.getAttribute("href")
    ).toBe("#sec-2");
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

    expect(
      container.querySelector(`.${styles.sideNav} a.${styles.active}`)?.getAttribute("href")
    ).toBe("#sec-1");
  });

  it("交差が解除されると残った交差要素へアクティブが移る", () => {
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

    expect(
      container.querySelector(`.${styles.sideNav} a.${styles.active}`)?.getAttribute("href")
    ).toBe("#sec-2");
  });

  it("目次に対応リンクが無いセクションではアクティブを変更しない", () => {
    const io = installStub();
    const { container } = renderToc();
    const orphan = document.createElement("section");
    orphan.id = "orphan";

    io.emit([{ target: orphan, isIntersecting: true }]);

    expect(container.querySelector(`.${styles.sideNav} a.${styles.active}`)).toBeNull();
  });

  it("トグルでサイドバーが開閉し aria 状態が同期する", () => {
    installStub();
    const { container } = renderToc();
    const toggle = container.querySelector(`.${styles.sidebarToggle}`) as HTMLElement;
    const sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("メニューを閉じる");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-label")).toBe("メニューを開く");
  });

  it("目次リンクのクリックでサイドバーが閉じる", () => {
    installStub();
    const { container } = renderToc();
    const toggle = container.querySelector(`.${styles.sidebarToggle}`) as HTMLElement;
    const sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.click(container.querySelector(`.${styles.sideNav} a`) as HTMLElement);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("目次が空でも監視を行わずアンマウントできる", () => {
    const io = installStub();
    const { unmount } = renderToc({ withLinks: false });

    expect(io.observedTargets).toHaveLength(0);
    expect(() => unmount()).not.toThrow();
  });

  it("アンマウントで observer を切断しリスナを解除する", () => {
    const io = installStub();
    const { container, unmount } = renderToc();
    const toggle = container.querySelector(`.${styles.sidebarToggle}`) as HTMLElement;
    const sidebar = container.querySelector(`.${styles.sidebar}`) as HTMLElement;

    unmount();
    expect(io.disconnectCount).toBe(1);

    // 解除後のクリックが状態を書き換えないこと（リスナ残留の検知）
    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });
});
