import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  type IntersectionObserverController,
  installIntersectionObserverStub,
} from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

/**
 * このページの TocObserver はセレクタと active クラスを props で受け取る唯一の変種。
 * page.tsx 側は `#side-nav a` / `main section[id]` を渡すため、
 * 既定セレクタと明示セレクタの双方を検証する。
 */
describe("microsoft-foundry-best-practices-guide TocObserver", () => {
  let io: IntersectionObserverController;

  beforeEach(() => {
    io = installIntersectionObserverStub();
  });
  afterEach(() => {
    cleanup();
  });

  /**
   * ナビとセクションを描画する。
   *
   * @param options.withLinks - `#side-nav` 内にリンクを描画するかどうか
   * @param options.withSections - `main` 内にセクションを描画するかどうか
   * @param options.explicitSelectors - page.tsx と同じセレクタを props で明示するかどうか
   * @returns 描画結果
   */
  function renderToc({ withLinks = true, withSections = true, explicitSelectors = true } = {}) {
    return render(
      <div>
        <nav id="side-nav">
          {withLinks ? (
            <>
              <a href="#s1">S1</a>
              <a href="#s2">S2</a>
            </>
          ) : null}
        </nav>
        <main>
          {withSections ? (
            <>
              <section id="s1" />
              <section id="s2" />
            </>
          ) : null}
        </main>
        {explicitSelectors ? (
          <TocObserver
            activeClass={styles.active}
            navSelector="#side-nav a"
            sectionSelector="main section[id]"
          />
        ) : (
          <TocObserver activeClass={styles.active} />
        )}
      </div>
    );
  }

  test("observes the sections matched by the supplied selector", () => {
    renderToc();
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2"]);
  });

  test("falls back to the default selectors", () => {
    renderToc({ explicitSelectors: false });
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2"]);
  });

  test("ignores non-intersecting entries and activates the matching link", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll("#side-nav a");
    const secondSection = container.querySelector("#s2") as Element;

    io.emit([{ target: secondSection, isIntersecting: false }]);
    expect(Array.from(links).some((link) => link.classList.contains(styles.active))).toBe(false);

    io.emit([{ target: secondSection, isIntersecting: true }]);
    expect(links[0].classList.contains(styles.active)).toBe(false);
    expect(links[1].classList.contains(styles.active)).toBe(true);
  });

  test("moves the active class to the newly intersecting section", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll("#side-nav a");

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: true }]);
    io.emit([{ target: container.querySelector("#s1") as Element, isIntersecting: true }]);

    expect(links[0].classList.contains(styles.active)).toBe(true);
    expect(links[1].classList.contains(styles.active)).toBe(false);
  });

  test("skips intersecting entries without an id", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll("#side-nav a");

    io.emit([{ target: document.createElement("section"), isIntersecting: true }]);
    expect(Array.from(links).some((link) => link.classList.contains(styles.active))).toBe(false);
  });

  test("bails out when there is no TOC link", () => {
    const { unmount } = renderToc({ withLinks: false });
    expect(io.observedTargets).toHaveLength(0);
    unmount();
    expect(io.disconnectCount).toBe(0);
  });

  test("bails out when there is no section", () => {
    renderToc({ withSections: false });
    expect(io.observedTargets).toHaveLength(0);
  });

  test("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});
