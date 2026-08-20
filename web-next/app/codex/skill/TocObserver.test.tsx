// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

describe("/codex/skill — TocObserver", () => {
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
});
