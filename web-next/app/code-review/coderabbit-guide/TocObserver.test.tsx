import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import TocObserver from "./TocObserver";

/**
 * CodeRabbit ガイドの TocObserver は data 属性ベース（`data-open` / `data-active`）で
 * サイドバー開閉と目次ハイライトを制御する。IntersectionObserver のコールバック本体は
 * グローバルの no-op スタブでは実行されないため、制御可能スタブを注入して分岐を検証する。
 */

const DESKTOP_WIDTH = 1200;
const MOBILE_WIDTH = 800;

/**
 * jsdom の window.innerWidth を任意の値へ差し替える。
 *
 * @param width - 設定するビューポート幅（px）
 */
function setViewportWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
    writable: true,
  });
}

describe("CodeRabbit guide TocObserver", () => {
  let io: ReturnType<typeof installIntersectionObserverStub>;

  beforeEach(() => {
    io = installIntersectionObserverStub();
    setViewportWidth(DESKTOP_WIDTH);
  });
  afterEach(() => {
    cleanup();
  });

  /**
   * サイドバー・目次リンク・見出しを含むフィクスチャを描画する。
   *
   * @param sidebarOpen - サイドバーの初期 `data-open` 値
   * @returns RTL のレンダリング結果
   */
  function renderToc(sidebarOpen?: string) {
    return render(
      <div>
        <button type="button" id="sidebarToggle" aria-label="目次を開く" />
        <aside id="sidebar" data-open={sidebarOpen}>
          <a className="nav-link" href="#s1">
            S1
          </a>
          <a className="nav-link" href="#s2">
            S2
          </a>
          {/* href ではなく data-id で対応付けるリンク（別分岐） */}
          <button type="button" data-id="s3">
            S3
          </button>
        </aside>
        <article>
          <h2 id="s1">S1</h2>
          <h3 id="s2">S2</h3>
          <h2 id="s3">S3</h2>
        </article>
        <TocObserver />
      </div>
    );
  }

  test("observes every heading with an id", () => {
    renderToc();
    expect(io.observedTargets.map((target) => target.id)).toEqual(["s1", "s2", "s3"]);
  });

  test("toggles data-open and aria-expanded on the sidebar toggle", () => {
    renderToc();
    const toggle = document.getElementById("sidebarToggle") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    expect(sidebar.dataset.open).toBe("true");
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(toggle);
    expect(sidebar.dataset.open).toBe("false");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("closes the sidebar when a nav link is clicked on mobile widths", () => {
    setViewportWidth(MOBILE_WIDTH);
    renderToc("true");
    const toggle = document.getElementById("sidebarToggle") as HTMLElement;
    const link = document.querySelector('a[href="#s1"]') as HTMLElement;

    fireEvent.click(link);
    expect((document.getElementById("sidebar") as HTMLElement).dataset.open).toBe("false");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("keeps the sidebar open when a nav link is clicked on desktop widths", () => {
    renderToc("true");
    const link = document.querySelector('a[href="#s1"]') as HTMLElement;

    fireEvent.click(link);
    expect((document.getElementById("sidebar") as HTMLElement).dataset.open).toBe("true");
  });

  test("marks the link of the intersecting heading active by href", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll<HTMLElement>(".nav-link, [data-id]");

    io.emit([{ target: container.querySelector("#s2") as Element, isIntersecting: true }]);

    expect(links[0].dataset.active).toBe("false");
    expect(links[1].dataset.active).toBe("true");
    expect(links[2].dataset.active).toBe("false");
  });

  test("marks the link of the intersecting heading active by data-id", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll<HTMLElement>(".nav-link, [data-id]");

    io.emit([{ target: container.querySelector("#s3") as Element, isIntersecting: true }]);

    expect(links[2].dataset.active).toBe("true");
    expect(links[0].dataset.active).toBe("false");
  });

  test("ignores non-intersecting entries and targets without an id", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll<HTMLElement>(".nav-link, [data-id]");
    const idless = document.createElement("h2");

    io.emit([{ target: container.querySelector("#s1") as Element, isIntersecting: false }]);
    io.emit([{ target: idless, isIntersecting: true }]);

    expect(Array.from(links).every((link) => link.dataset.active === undefined)).toBe(true);
  });

  test("disconnects the observer on unmount", () => {
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });

  test("renders safely without a sidebar or toggle button", () => {
    const { unmount } = render(<TocObserver />);
    expect(io.observedTargets).toHaveLength(0);
    expect(() => unmount()).not.toThrow();
  });
});
