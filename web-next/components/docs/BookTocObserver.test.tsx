// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BookTocObserver from "./BookTocObserver";

const CLASS_NAMES = { main: "main", navA: "navA", open: "open", active: "active", done: "done" };

function fixture(ids: string[]) {
  return render(
    <div data-testid="layout-root">
      <nav id="sidebar">
        {ids.map((id) => (
          <a key={id} className="navA" href={`#${id}`}>
            {id}
          </a>
        ))}
      </nav>
      <div className="main">
        {ids.map((id) => (
          <section key={id} id={id} />
        ))}
      </div>
      <BookTocObserver classNames={CLASS_NAMES} mobileBreakpoint={900} />
    </div>
  );
}

describe("BookTocObserver — 目次リンクの対象解決", () => {
  it("パーセントエンコードされた日本語フラグメントを復号して対象見出しを解決する", () => {
    // Arrange / Act
    fixture(["この記事について"]);
    const link = document.querySelector<HTMLAnchorElement>(".navA");

    // Assert: hash はエンコード済みだが、先頭見出しとして active になる
    expect(link?.hash).not.toBe("#この記事について");
    expect(link?.classList.contains("active")).toBe(true);
  });

  it("ASCII フラグメントは従来どおり解決し、不正なエンコードでも例外を投げない", () => {
    // Arrange / Act
    const view = () => fixture(["step1", "bad%E0"]);

    // Assert: jsdom ではレイアウトが無く全見出しの top が 0 のため、最後に解決できた対象が active になる
    expect(view).not.toThrow();
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".navA"));
    expect(links.map((link) => link.classList.contains("active"))).toEqual([false, true]);
  });
});
