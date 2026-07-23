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
  it("外側に全幅・横スクロールのラッパー、内側に中央寄せの .mermaid を持つ2層構造", () => {
    const { container } = render(<MermaidDiagram chart="graph TD; A-->B" />);

    const outer = container.firstElementChild as HTMLElement;
    const inner = container.querySelector<HTMLElement>(".mermaid");

    // 2層構造であること（外側 ≠ 内側 .mermaid）
    expect(inner).not.toBeNull();
    expect(outer).not.toBeNull();
    expect(outer).not.toBe(inner);
    expect(outer.contains(inner as HTMLElement)).toBe(true);

    // 外側 = フレーム全幅・横スクロール担当
    expect(outer.style.width).toBe("100%");
    expect(outer.style.overflowX).toBe("auto");
    // .mermaid クラスは内側にのみ付与（外側には付けない）
    expect(outer.classList.contains("mermaid")).toBe(false);

    // 内側 = 自然サイズを中央寄せ（引き伸ばし禁止 = width:fit-content）
    expect((inner as HTMLElement).style.width).toBe("fit-content");
    expect((inner as HTMLElement).style.margin).toContain("auto");
    // 縮小の原因になる max-width は内側に設定しない
    expect((inner as HTMLElement).style.maxWidth).toBe("");
  });

  it("id は内側 .mermaid に、className は外側ラッパーに付与される", () => {
    const { container } = render(
      <MermaidDiagram chart="graph TD; A-->B" id="diag-1" className="customFrame" />,
    );
    const outer = container.firstElementChild as HTMLElement;
    const inner = container.querySelector<HTMLElement>(".mermaid");

    expect(inner?.id).toBe("diag-1");
    expect(outer.classList.contains("customFrame")).toBe(true);
  });
});
