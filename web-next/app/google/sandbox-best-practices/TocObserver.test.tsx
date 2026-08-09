import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TocObserver from "./TocObserver";

describe("TocObserver Component", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: mockObserve,
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
      };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    observerCallback = null;
  });

  it("renders null (returns empty DOM)", () => {
    const { container } = render(<TocObserver />);
    expect(container.firstChild).toBeNull();
  });

  it("observes elements with class 'chapter' or section anchors on mount", () => {
    document.body.innerHTML = `
      <div id="section-1" class="chapter">Section 1</div>
      <div id="section-2" class="chapter">Section 2</div>
      <nav class="sidebar">
        <a href="#section-1" class="tocLink">Link 1</a>
        <a href="#section-2" class="tocLink">Link 2</a>
      </nav>
    `;

    render(<TocObserver />);
    expect(window.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledTimes(2);
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<TocObserver />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
