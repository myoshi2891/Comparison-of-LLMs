import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  type IntersectionObserverController,
  installIntersectionObserverStub,
} from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

/**
 * このページの TocObserver は監視対象を `main section[id]` から取得し、
 * リンクは `.sidebarNav a` からスコープ検索する（href → 要素の逆引きはしない）。
 * 共有ファクトリのどのフィクスチャとも DOM 形状が異なるため専用スイートを置く。
 */
describe("eve-beginner-guide TocObserver", () => {
  let io: IntersectionObserverController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  /**
   * サイドバーナビと本文セクションを描画する。
   *
   * @param options.withSections - `main` 内にセクションを描画するかどうか
   * @param options.withLinks - サイドバーにリンクを描画するかどうか
   * @returns 描画結果
   */
  function renderToc({ withSections = true, withLinks = true } = {}) {
    return render(
      <div>
        <nav className={styles.sidebarNav}>
          {withLinks ? (
            <>
              <a href="#s1">S1</a>
              <a href="#s2">S2</a>
              {/* ハッシュ以外の href（linkMap に載らない分岐） */}
              <a href="external.html">External</a>
            </>
          ) : null}
        </nav>
        <main>
          {withSections ? (
            <>
              <section id="s1" />
              <section id="s2" />
              {/* id なしセクションは `main section[id]` に一致しない */}
              <section />
            </>
          ) : null}
        </main>
        <TocObserver />
      </div>
    );
  }

  test("observes only sections that carry an id", () => {
    renderToc();
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2"]);
  });

  test("ignores non-intersecting entries and activates the matching link", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.sidebarNav} a`);
    const secondSection = container.querySelector("#s2") as Element;

    io.emit([{ target: secondSection, isIntersecting: false }]);
    expect(Array.from(links).some((link) => link.classList.contains(styles.active))).toBe(false);

    io.emit([{ target: secondSection, isIntersecting: true }]);
    expect(links[0].classList.contains(styles.active)).toBe(false);
    expect(links[1].classList.contains(styles.active)).toBe(true);
  });

  test("moves the active class to the newly intersecting section", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.sidebarNav} a`);

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: true }]);
    io.emit([{ target: container.querySelector("#s1") as Element, isIntersecting: true }]);

    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });

  test("ignores entries whose target has no matching link", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.sidebarNav} a`);
    const unknown = document.createElement("section");
    unknown.id = "unknown";

    io.emit([{ target: unknown, isIntersecting: true }]);
    expect(Array.from(links).some((link) => link.classList.contains(styles.active))).toBe(false);
  });

  test("bails out when there is no section to observe", () => {
    const { unmount } = renderToc({ withSections: false });
    expect(io.observedTargets).toHaveLength(0);
    unmount();
    expect(io.disconnectCount).toBe(0);
  });

  test("bails out when there is no TOC link", () => {
    renderToc({ withLinks: false });
    expect(io.observedTargets).toHaveLength(0);
  });

  test("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});
