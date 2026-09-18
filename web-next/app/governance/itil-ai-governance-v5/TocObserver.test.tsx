import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { installIntersectionObserverStub } from "@/tests/tocTestUtils";
import styles from "./page.module.css";
import TocObserver from "./TocObserver";

function setInnerWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
}

function renderToc() {
  return render(
    <div>
      <button type="button" id="navToggle" aria-label="目次を開く" aria-expanded="false" />
      <div id="scrim" />
      <aside id="sidebar">
        <nav data-testid="toc">
          <a href="#s1">S1</a>
          <a href="#s2">S2</a>
        </nav>
      </aside>
      <section id="s1" />
      <section id="s2" />
      <TocObserver />
    </div>
  );
}

beforeEach(() => {
  setInnerWidth(500);
});

describe("itil-ai-governance-v5 TocObserver - mobile sidebar", () => {
  it("marks the sidebar inert on mount at mobile widths", () => {
    installIntersectionObserverStub();
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(true);
  });

  it("does not mark the sidebar inert on mount at desktop widths", () => {
    installIntersectionObserverStub();
    setInnerWidth(1200);
    renderToc();
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    expect(sidebar.inert).toBe(false);
  });

  it("opens the sidebar via navToggle, clears inert, and focuses the first TOC link", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle);

    expect(sidebar.classList.contains(styles.open)).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.classList.contains(styles.isHidden)).toBe(true);
    expect(sidebar.inert).toBe(false);
    expect(document.activeElement).toBe(sidebar.querySelector("nav[data-testid='toc'] a"));
  });

  it("closes the sidebar via navToggle and restores focus to navToggle", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle); // open
    fireEvent.click(toggle); // close

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(sidebar.inert).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it("closes the sidebar when the scrim is clicked", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const scrim = document.getElementById("scrim") as HTMLElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.click(scrim);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(scrim.classList.contains(styles.show)).toBe(false);
  });

  it("closes the sidebar on Escape key", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;

    fireEvent.click(toggle);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("closes the sidebar when a TOC link is clicked at mobile widths", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const link = sidebar.querySelector("nav[data-testid='toc'] a") as HTMLAnchorElement;

    fireEvent.click(toggle);
    fireEvent.click(link);

    expect(sidebar.classList.contains(styles.open)).toBe(false);
  });

  it("leaves the sidebar open when a TOC link is clicked at desktop widths", () => {
    installIntersectionObserverStub();
    setInnerWidth(1200);
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const link = sidebar.querySelector("nav[data-testid='toc'] a") as HTMLAnchorElement;

    fireEvent.click(toggle);
    fireEvent.click(link);

    expect(sidebar.classList.contains(styles.open)).toBe(true);
  });

  it("closes and re-shows the sidebar when resized past the breakpoint to desktop width", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };

    fireEvent.click(toggle); // open at mobile width
    setInnerWidth(1200);
    fireEvent(window, new Event("resize"));

    expect(sidebar.classList.contains(styles.open)).toBe(false);
    expect(sidebar.inert).toBe(false);
  });

  it("moves focus to navToggle instead of trapping it inside the sidebar as it becomes inert", () => {
    installIntersectionObserverStub();
    renderToc();
    const toggle = document.getElementById("navToggle") as HTMLButtonElement;
    const sidebar = document.getElementById("sidebar") as HTMLElement & { inert: boolean };
    const link = sidebar.querySelector("nav[data-testid='toc'] a") as HTMLAnchorElement;

    link.focus();
    expect(document.activeElement).toBe(link);

    fireEvent(window, new Event("resize"));

    expect(document.activeElement).toBe(toggle);
    expect(sidebar.inert).toBe(true);
  });
});

describe("itil-ai-governance-v5 TocObserver - intersection-based active nav", () => {
  it("observes every section resolved from a TOC link href", () => {
    const io = installIntersectionObserverStub();
    renderToc();
    expect(io.observedTargets.map((t) => t.id)).toEqual(["s1", "s2"]);
  });

  it("activates the TOC link matching the intersecting section", () => {
    const io = installIntersectionObserverStub();
    const { container } = renderToc();
    const links = container.querySelectorAll("nav[data-testid='toc'] a");
    const s2 = container.querySelector("#s2") as Element;

    io.emit([{ target: s2, isIntersecting: true }]);

    expect(links[1].classList.contains("active")).toBe(true);
    expect(links[0].classList.contains("active")).toBe(false);
  });

  it("ignores non-intersecting entries", () => {
    const io = installIntersectionObserverStub();
    const { container } = renderToc();
    const links = container.querySelectorAll("nav[data-testid='toc'] a");
    const s1 = container.querySelector("#s1") as Element;

    io.emit([{ target: s1, isIntersecting: false }]);

    expect(Array.from(links).some((l) => l.classList.contains("active"))).toBe(false);
  });

  it("disconnects the observer on unmount", () => {
    const io = installIntersectionObserverStub();
    const { unmount } = renderToc();
    unmount();
    expect(io.disconnectCount).toBe(1);
  });

  it("skips observer creation when there are no TOC links", () => {
    const io = installIntersectionObserverStub();
    render(
      <div>
        <button type="button" id="navToggle" />
        <div id="scrim" />
        <aside id="sidebar" />
        <TocObserver />
      </div>
    );
    expect(io.observedTargets).toHaveLength(0);
  });
});
