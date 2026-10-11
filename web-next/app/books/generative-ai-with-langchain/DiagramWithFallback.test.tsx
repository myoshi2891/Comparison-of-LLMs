import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DiagramWithFallback from "./DiagramWithFallback";
import styles from "./page.module.css";

let callback: MutationCallback;
let drawInitially = false;
const observe = vi.fn();
const disconnect = vi.fn();
vi.mock("@/components/docs/MermaidDiagram", () => ({
  default: ({
    chart,
    id,
    theme,
    flowchartHtmlLabels,
  }: {
    chart: string;
    id: string;
    theme: string;
    flowchartHtmlLabels: boolean;
  }) => (
    <div
      data-testid="mermaid"
      id={id}
      data-chart={chart}
      data-theme={theme}
      data-labels={String(flowchartHtmlLabels)}
    >
      {drawInitially ? <svg role="img" /> : null}
    </div>
  ),
}));
const props = {
  id: "diagram-rag",
  chart: "flowchart LR\nA --> B",
  fallback: "元ドキュメント → Vector Store → 回答",
};
function notify() {
  act(() => callback([], {} as MutationObserver));
}
beforeEach(() => {
  drawInitially = false;
  vi.clearAllMocks();
  vi.stubGlobal(
    "MutationObserver",
    class {
      constructor(handler: MutationCallback) {
        callback = handler;
      }
      observe = observe;
      disconnect = disconnect;
    }
  );
});
afterEach(() => vi.unstubAllGlobals());
describe("LangChain diagrams — preserve original fallback lifecycle", () => {
  it("preserves full fallback text while the shared renderer is pending", () => {
    const view = render(<DiagramWithFallback {...props} />);
    const root = view.container.firstElementChild as HTMLElement;
    expect([root.id, root.className]).toEqual([props.id, styles.diagramTarget]);
    expect(view.container.querySelector("p")?.textContent).toBe(props.fallback);
    expect(view.container.querySelector("p")?.hidden).toBe(false);
    expect(observe.mock.calls).toEqual([[root, { childList: true, subtree: true }]]);
    expect([
      view.getByTestId("mermaid").getAttribute("data-chart"),
      view.getByTestId("mermaid").getAttribute("data-theme"),
      view.getByTestId("mermaid").getAttribute("data-labels"),
    ]).toEqual([props.chart, "dark", "false"]);
  });
  it("hides but does not remove fallback text after an SVG appears", () => {
    const view = render(<DiagramWithFallback {...props} />);
    view
      .getByTestId("mermaid")
      .appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
    notify();
    expect(view.container.querySelector("p")?.hidden).toBe(true);
    expect(view.container.querySelector("p")?.textContent).toBe(props.fallback);
  });
  it("recognizes a renderer that has already produced an SVG", () => {
    drawInitially = true;
    const view = render(<DiagramWithFallback {...props} />);
    expect(view.container.querySelector("p")?.hidden).toBe(true);
  });
  it("keeps fallback text visible when the renderer fails or produces no SVG", () => {
    const view = render(<DiagramWithFallback {...props} />);
    view.getByTestId("mermaid").textContent = "⚠️ ダイアグラムを描画できませんでした";
    notify();
    expect(view.container.querySelector("p")?.hidden).toBe(false);
    expect(view.container.querySelector("p")?.textContent).toBe(props.fallback);
  });
  it("restores fallback text if a previous SVG disappears", () => {
    const view = render(<DiagramWithFallback {...props} />);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    view.getByTestId("mermaid").appendChild(svg);
    notify();
    expect(view.container.querySelector("p")?.hidden).toBe(true);
    svg.remove();
    notify();
    expect(view.container.querySelector("p")?.hidden).toBe(false);
  });
  it("disconnects its mutation observer on unmount", () => {
    const view = render(<DiagramWithFallback {...props} />);
    view.unmount();
    expect(disconnect.mock.calls).toEqual([[]]);
  });
});
