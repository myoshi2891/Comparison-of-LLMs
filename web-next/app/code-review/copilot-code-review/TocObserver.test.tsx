// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

describe("/code-review/copilot-code-review — TocObserver", () => {
  it("Q-1: 交差したセクションに応じてアクティブな見出しが更新される", () => {
    // jsdom は IntersectionObserver を実装せず fireEvent.scroll では観測が走らないため、
    // 制御可能なスタブへ差し替えて entries を直接流し込む。
    const io = installIntersectionObserverStub();

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
    const io = installIntersectionObserverStub();

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

    // 同一バッチで両方が交差しても、より上にある #intro が選ばれる
    io.emit([
      { target: whatIsIt, isIntersecting: true },
      { target: intro, isIntersecting: true },
    ]);

    expect(container.querySelector(`nav.toc a.${styles.active}`)?.getAttribute("href")).toBe(
      "#intro"
    );
  });
});
