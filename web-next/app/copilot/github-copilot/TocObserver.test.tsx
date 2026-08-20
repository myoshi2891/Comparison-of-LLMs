import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

let io: ReturnType<typeof installIntersectionObserverStub>;

beforeEach(() => {
  io = installIntersectionObserverStub();
});

afterEach(() => {
  cleanup();
});

function renderToc() {
  return render(
    <div>
      <button type="button" id="sidebarToggle" aria-expanded="false" aria-label="目次を開く" />
      <div id="sidebarOverlay" />
      <aside id="sidebar">
        <nav>
          <a
            className={styles.navLink}
            href="#1-github-copilotの全体像2026年時点のプロダクトファミリー"
          >
            1. GitHub Copilotの全体像
          </a>
          <a className={styles.navLink} href="#2-3つのchatモードを使い分けるask--edit--agent">
            2. 3つのChatモードを使い分ける
          </a>
        </nav>
      </aside>
      <main>
        <h2 id="1-github-copilotの全体像2026年時点のプロダクトファミリー">
          1. GitHub Copilotの全体像
        </h2>
        <h2 id="2-3つのchatモードを使い分けるask--edit--agent">2. 3つのChatモードを使い分ける</h2>
      </main>
      <TocObserver />
    </div>
  );
}

describe("Github Copilot TocObserver", () => {
  it("opens and closes the sidebar while synchronizing accessible state", () => {
    const { container } = renderToc();
    const toggle = container.querySelector("#sidebarToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;

    fireEvent.click(toggle);
    expect(sidebar).toHaveClass(styles.open);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-label", "目次を閉じる");

    fireEvent.click(toggle);
    expect(sidebar).not.toHaveClass(styles.open);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-label", "目次を開く");
  });

  it("closes sidebar when clicking overlay", () => {
    const { container } = renderToc();
    const toggle = container.querySelector("#sidebarToggle") as HTMLButtonElement;
    const sidebar = container.querySelector("#sidebar") as HTMLElement;
    const overlay = container.querySelector("#sidebarOverlay") as HTMLElement;

    fireEvent.click(toggle);
    expect(sidebar).toHaveClass(styles.open);

    fireEvent.click(overlay);
    expect(sidebar).not.toHaveClass(styles.open);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("observes headings and activates the currently topmost intersecting element", () => {
    const { container } = renderToc();
    const headings = container.querySelectorAll("main h2");
    const links = container.querySelectorAll(`.${styles.navLink}`);

    vi.spyOn(headings[0], "getBoundingClientRect").mockReturnValue({ top: 5 } as DOMRect);
    vi.spyOn(headings[1], "getBoundingClientRect").mockReturnValue({ top: 30 } as DOMRect);

    expect(io.observedTargets).toEqual(Array.from(headings));

    // 実装は entry.boundingClientRect ではなく target.getBoundingClientRect() を見るため、
    // entry 側に矛盾する座標を載せない（上の spy が唯一の位置情報源）。
    io.emit([
      { target: headings[0], isIntersecting: true },
      { target: headings[1], isIntersecting: true },
    ]);

    expect(links[0]).toHaveClass(styles.active);
    expect(links[1]).not.toHaveClass(styles.active);

    io.emit([{ target: headings[1], isIntersecting: false }]);
    expect(links[0]).toHaveClass(styles.active);
    expect(links[1]).not.toHaveClass(styles.active);
  });

  it("does not change link state when no heading intersects", () => {
    const { container } = renderToc();
    const links = container.querySelectorAll(`.${styles.navLink}`);

    io.emit([
      {
        target: container.querySelector(
          "[id='1-github-copilotの全体像2026年時点のプロダクトファミリー']"
        ) as Element,
        isIntersecting: false,
      },
    ]);
    expect(Array.from(links).every((link) => !link.classList.contains(styles.active))).toBe(true);
  });

  it("disconnects the observer and tolerates missing drawer elements", () => {
    const { container, unmount } = render(
      <div>
        <button type="button" id="sidebarToggle" />
        <TocObserver />
      </div>
    );
    const toggle = container.querySelector("#sidebarToggle") as HTMLButtonElement;
    expect(() => fireEvent.click(toggle)).not.toThrow();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });
});
