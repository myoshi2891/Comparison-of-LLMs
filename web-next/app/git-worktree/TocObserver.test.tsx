import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

/**
 * git-worktree ページの TocObserver は自前でハンバーガーボタンを描画し、
 * React state (`isOpen`) を `#gitWorktreeSidebar` のクラスへ反映する。
 * 目次リンクは href から監視対象を解決する。
 */
describe("git-worktree TocObserver", () => {
  let io: ReturnType<typeof installIntersectionObserverStub>;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  /**
   * サイドバー・目次リンク・セクションを含むフィクスチャを描画する。
   *
   * @param options - フィクスチャの構成（サイドバー / セクションの有無）
   * @returns RTL のレンダリング結果
   */
  function renderToc(options: { withSidebar?: boolean; withSections?: boolean } = {}) {
    const { withSidebar = true, withSections = true } = options;
    return render(
      <div>
        {withSidebar ? (
          <aside id="gitWorktreeSidebar">
            <nav className={styles.sidebarNav}>
              <a href="#s1">S1</a>
              <a href="#s2">S2</a>
              {/* ハッシュ以外の href（startsWith("#") の false 分岐） */}
              <a href="external.html">External</a>
              {/* 解決できない href（getElementById が null を返す分岐） */}
              <a href="#missing">Missing</a>
            </nav>
          </aside>
        ) : null}
        {withSections ? (
          <>
            <section id="s1" />
            <section id="s2" />
          </>
        ) : null}
        <TocObserver />
      </div>
    );
  }

  test("renders the menu toggle button closed by default", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBe("gitWorktreeSidebar");
    expect(toggle.getAttribute("aria-label")).toBe("目次を開く");
  });

  test("toggles the sidebarOpen class and aria-expanded", () => {
    renderToc();
    const toggle = document.getElementById("menuToggle") as HTMLElement;
    const sidebar = document.getElementById("gitWorktreeSidebar") as HTMLElement;

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.getAttribute("aria-label")).toBe("目次を閉じる");

    fireEvent.click(toggle);
    expect(sidebar.classList.contains(styles.sidebarOpen)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-label")).toBe("目次を開く");
  });

  test("toggling without a sidebar element does not throw", () => {
    renderToc({ withSidebar: false });
    const toggle = document.getElementById("menuToggle") as HTMLElement;
    expect(() => fireEvent.click(toggle)).not.toThrow();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  test("observes only hash links whose target exists", () => {
    renderToc();
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2"]);
  });

  test("moves the active class to the intersecting section's link", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.sidebarNav} a`);

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: true }]);
    expect(links[1].classList.contains(styles.active)).toBe(true);
    expect(links[0].classList.contains(styles.active)).toBe(false);

    io.emit([{ target: container.querySelector("#s1") as Element, isIntersecting: true }]);
    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });

  test("ignores non-intersecting entries and unmapped targets", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.sidebarNav} a`);
    const unknown = document.createElement("section");
    unknown.id = "unknown";

    io.emit([{ target: container.querySelector("#s1") as Element, isIntersecting: false }]);
    io.emit([{ target: unknown, isIntersecting: true }]);

    expect(Array.from(links).some((link) => link.classList.contains(styles.active))).toBe(false);
  });

  test("skips observing when there are no TOC links", () => {
    renderToc({ withSidebar: false });
    expect(io.observedTargets).toHaveLength(0);
  });

  test("skips observing when no link resolves to a section", () => {
    renderToc({ withSections: false });
    expect(io.observedTargets).toHaveLength(0);
  });

  test("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});
