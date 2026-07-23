import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MermaidDiagram from "./MermaidDiagram";

// mermaid の動的 import を無害化（DOM 構造のみを検証するため実描画は不要）
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    run: vi.fn().mockResolvedValue(undefined),
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
});
