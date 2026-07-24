import { render, waitFor } from "@testing-library/react";
import mermaid from "mermaid";
import { describe, expect, it, vi } from "vitest";
import MermaidDiagram from "./MermaidDiagram";

// mermaid の動的 import を無害化。実描画の代わりに run が対象ノードへ代表 SVG を挿入し、
// コンポーネントの svg 後処理（max-width:100% / height:auto の付与）を検証できるようにする。
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    run: vi.fn(async ({ nodes }: { nodes: Element[] }) => {
      const target = nodes[0];
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      target.appendChild(svg);
    }),
  },
}));

describe("MermaidDiagram レイアウト規約", () => {
  it("外側に全幅ラッパー、内側に flex 中央寄せの .mermaid を持つ2層構造", () => {
    const { container } = render(<MermaidDiagram chart="graph TD; A-->B" />);

    const outer = container.firstElementChild as HTMLElement;
    const inner = container.querySelector<HTMLElement>(".mermaid");

    // 2層構造であること（外側 ≠ 内側 .mermaid）
    expect(inner).not.toBeNull();
    expect(outer).not.toBeNull();
    expect(outer).not.toBe(inner);
    expect(outer.contains(inner as HTMLElement)).toBe(true);

    // 外側 = フレーム全幅（列幅）を占める
    expect(outer.style.width).toBe("100%");
    // .mermaid クラスは内側にのみ付与（外側には付けない）
    expect(outer.classList.contains("mermaid")).toBe(false);

    // 内側 = flex 中央寄せ（svg を列幅に収めて中央に置く）
    expect((inner as HTMLElement).style.display).toBe("flex");
    expect((inner as HTMLElement).style.justifyContent).toBe("center");
  });

  it("id は内側 .mermaid に、className は外側ラッパーに付与される", () => {
    const { container } = render(
      <MermaidDiagram chart="graph TD; A-->B" id="diag-1" className="customFrame" />
    );
    const outer = container.firstElementChild as HTMLElement;
    const inner = container.querySelector<HTMLElement>(".mermaid");

    expect(inner?.id).toBe("diag-1");
    expect(outer.classList.contains("customFrame")).toBe(true);
  });

  it("描画後に生成された svg へ max-width:100% / height:auto を後付けする（列幅への縮小フィット）", async () => {
    const { container } = render(<MermaidDiagram chart="graph TD; A-->B" />);

    // run が挿入した svg にコンポーネントが inline style を付与するまで待つ
    await waitFor(() => {
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect((svg as SVGElement).style.maxWidth).toBe("100%");
      expect((svg as SVGElement).style.height).toBe("auto");
    });
  });

  it("initialize に flowchart・sequence・mindmap の useMaxWidth: false を渡して呼び出す", async () => {
    render(<MermaidDiagram chart="graph TD; A-->B" />);
    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          flowchart: expect.objectContaining({ useMaxWidth: false }),
          sequence: expect.objectContaining({ useMaxWidth: false }),
          mindmap: expect.objectContaining({ useMaxWidth: false }),
        })
      );
    });
  });
});
