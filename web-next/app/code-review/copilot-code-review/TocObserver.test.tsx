// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

describe("/code-review/copilot-code-review — TocObserver", () => {
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

  it("Q-1: 交差したセクションに応じてアクティブな見出しが更新される", () => {
    // jsdom は IntersectionObserver を実装せず fireEvent.scroll では観測が走らないため、
    // 制御可能なスタブへ差し替えて entries を直接流し込む。
    const io = installStub();

    const { container } = render(
      <div>
        {/* TocObserver は `nav.toc a[href^='#']` を TOC リンクとして探す */}
        <nav className="toc">
          <a href="#intro" className={`${styles.active} active`}>
            はじめに
          </a>
          <a href="#what-is-it">GitHub Copilot Code Reviewとは何か</a>
        </nav>
        <div id="intro">Intro</div>
        <div id="what-is-it">What is it</div>
        <TocObserver />
      </div>
    );

    const activeHref = () =>
      container.querySelector(`nav.toc a.${styles.active}`)?.getAttribute("href");

    expect(io.observedTargets.map((el) => el.id)).toEqual(["intro", "what-is-it"]);
    expect(activeHref()).toBe("#intro");

    const target = container.querySelector("#what-is-it") as Element;
    io.emit([{ target, isIntersecting: true }]);

    expect(activeHref()).toBe("#what-is-it");
    // 旧アクティブは両方のクラスが外れる（styles.active と素の "active"）
    const previous = container.querySelector('nav.toc a[href="#intro"]');
    expect(previous?.classList.contains(styles.active)).toBe(false);
    expect(previous?.classList.contains("active")).toBe(false);
  });

  it("Q-1b: 最上位に位置する交差セクションが選ばれる", () => {
    const io = installStub();

    const { container } = render(
      <div>
        <nav className="toc">
          <a href="#intro">はじめに</a>
          <a href="#what-is-it">GitHub Copilot Code Reviewとは何か</a>
        </nav>
        <div id="intro">Intro</div>
        <div id="what-is-it">What is it</div>
        <TocObserver />
      </div>
    );

    const intro = container.querySelector("#intro") as HTMLElement;
    const whatIsIt = container.querySelector("#what-is-it") as HTMLElement;
    intro.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;
    whatIsIt.getBoundingClientRect = () => ({ top: 320 }) as DOMRect;

    // 上→下の順で流す。「最後の交差」を採用する実装だと下の #what-is-it が勝つため、
    // この順序でこそ「最上位が選ばれる」契約を検証できる。
    io.emit([
      { target: intro, isIntersecting: true },
      { target: whatIsIt, isIntersecting: true },
    ]);

    expect(container.querySelector(`nav.toc a.${styles.active}`)?.getAttribute("href")).toBe(
      "#intro"
    );
  });

  it("Q-1c: Escape でサイドバーが閉じ、フォーカスがトグルボタンへ戻る", () => {
    installStub();

    const { container } = render(
      <div>
        <aside className="sidebar" id="copilotCodeReviewSidebar">
          <nav className="toc">
            <a href="#intro">はじめに</a>
          </nav>
        </aside>
        <div id="intro">Intro</div>
        <TocObserver />
      </div>
    );

    const toggle = container.querySelector<HTMLButtonElement>("#menuToggle");
    if (toggle === null) throw new Error("menuToggle が存在しない");
    const sidebar = container.querySelector("#copilotCodeReviewSidebar");
    if (sidebar === null) throw new Error("sidebar が存在しない");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(sidebar.classList.contains("open")).toBe(true);

    // 閉状態のサイドバーは visibility: hidden で不活性化されるため、
    // Escape で閉じた後のフォーカスはトグルボタンへ戻っていなければならない。
    toggle.blur();
    fireEvent.keyDown(document, { key: "Escape" });

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.classList.contains("open")).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });
});
