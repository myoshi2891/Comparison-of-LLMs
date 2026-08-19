// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TocObserver from "./TocObserver";

describe("/code-review/copilot-code-review — TocObserver", () => {
  it("Q-1: スクロール時にアクティブな見出しが更新される", () => {
    const { container } = render(
      <div>
        <nav>
          <a href="#intro" className="active">
            はじめに
          </a>
          <a href="#what-is-it">GitHub Copilot Code Reviewとは何か</a>
        </nav>
        <div id="intro" style={{ height: "500px" }}>
          Intro
        </div>
        <div id="what-is-it" style={{ height: "500px" }}>
          What is it
        </div>
        <TocObserver />
      </div>
    );

    expect(container.querySelector("nav a.active")?.getAttribute("href")).toBe("#intro");

    fireEvent.scroll(window, { target: { scrollY: 600 } });
  });
});
