import { render } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import styles from "./page.module.css";
import { TocObserver } from "./TocObserver";

type ObserverCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

let capturedCallback: ObserverCallback | null = null;

beforeEach(() => {
  capturedCallback = null;

  class IntersectionObserverStub {
    constructor(callback: ObserverCallback) {
      capturedCallback = callback;
    }
    observe() {
      // Test stub.
    }
    unobserve() {
      // Test stub.
    }
    disconnect() {
      // Test stub.
    }
  }

  global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
});

test("複数の対応セクションが交差したとき DOM 上で最上位のリンクだけを有効化する", () => {
  const { container } = render(
    <div>
      <nav className={styles.toc}>
        <a href="#section-1">Section 1</a>
        <a href="#section-2">Section 2</a>
      </nav>
      <main>
        <section id="section-1" />
        <section id="section-2" />
      </main>
      <TocObserver />
    </div>
  );
  const section1 = container.querySelector("#section-1") as HTMLElement;
  const section2 = container.querySelector("#section-2") as HTMLElement;
  const link1 = container.querySelector('a[href="#section-1"]') as HTMLAnchorElement;
  const link2 = container.querySelector('a[href="#section-2"]') as HTMLAnchorElement;

  capturedCallback?.([
    { target: section1, isIntersecting: true },
    { target: section2, isIntersecting: true },
  ]);

  expect(link1).toHaveClass(styles.tocLinkActive);
  expect(link2).not.toHaveClass(styles.tocLinkActive);
});
