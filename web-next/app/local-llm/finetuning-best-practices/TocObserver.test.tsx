// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import TocObserver from "./TocObserver";

describe("/local-llm/finetuning-best-practices — TocObserver", () => {
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
   * ガイド本体のルート（.fineTuningGuide）を持つ最小フィクスチャを描画する。
   *
   * @param options.withRoot ルート要素を描画するか（early return 分岐の検証用）
   */
  const renderToc = ({ withRoot = true }: { withRoot?: boolean } = {}) => {
    const body = (
      <>
        <nav>
          <ul className="nav-list">
            <li>
              <a href="#intro">Intro</a>
            </li>
            <li>
              <a href="#sec-1">Sec 1</a>
            </li>
          </ul>
        </nav>
        <main>
          <header id="intro" />
          <section id="sec-1" />
        </main>
        <TocObserver />
      </>
    );
    return render(withRoot ? <div className="fineTuningGuide">{body}</div> : <div>{body}</div>);
  };

  it("intro ヘッダーと section を監視対象にする", () => {
    const io = installStub();
    renderToc();

    expect(io.observedTargets.map((el) => el.id)).toEqual(["intro", "sec-1"]);
  });

  it("交差したセクションのリンクだけが active になる", () => {
    const io = installStub();
    const { container } = renderToc();
    const links = container.querySelectorAll(".nav-list a");

    io.emit([{ target: container.querySelector("#sec-1") as Element, isIntersecting: true }]);
    expect(links[1].classList.contains("active")).toBe(true);
    expect(links[0].classList.contains("active")).toBe(false);

    io.emit([{ target: container.querySelector("#intro") as Element, isIntersecting: true }]);
    expect(links[0].classList.contains("active")).toBe(true);
    expect(links[1].classList.contains("active")).toBe(false);
  });

  it("非交差エントリでは active を変更しない", () => {
    const io = installStub();
    const { container } = renderToc();
    const links = container.querySelectorAll(".nav-list a");

    io.emit([{ target: container.querySelector("#sec-1") as Element, isIntersecting: true }]);
    io.emit([{ target: container.querySelector("#intro") as Element, isIntersecting: false }]);

    expect(links[1].classList.contains("active")).toBe(true);
  });

  it("目次に対応リンクが無いセクションでは active を付けない", () => {
    const io = installStub();
    const { container } = renderToc();
    const orphan = document.createElement("section");
    orphan.id = "orphan";

    io.emit([{ target: orphan, isIntersecting: true }]);

    expect(container.querySelector(".nav-list a.active")).toBeNull();
  });

  it("アンマウントで observer を切断する", () => {
    const io = installStub();
    const { unmount } = renderToc();

    unmount();
    expect(io.disconnectCount).toBe(1);
  });

  it("ガイドのルートが無いページでは監視を開始しない", () => {
    const io = installStub();
    const { unmount } = renderToc({ withRoot: false });

    expect(io.observedTargets).toHaveLength(0);
    expect(() => unmount()).not.toThrow();
    expect(io.disconnectCount).toBe(0);
  });
});
