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
      const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      const label = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
      foreignObject.appendChild(label);
      svg.appendChild(foreignObject);

      const actor = document.createElementNS("http://www.w3.org/2000/svg", "text");
      actor.classList.add("actor");
      svg.appendChild(actor);

      const message = document.createElementNS("http://www.w3.org/2000/svg", "text");
      message.classList.add("messageText");
      const messageLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      message.appendChild(messageLine);
      svg.appendChild(message);

      const noteRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      noteRect.classList.add("note");
      svg.appendChild(noteRect);

      const noteText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      noteText.classList.add("noteText");
      const noteLine = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      noteText.appendChild(noteLine);
      svg.appendChild(noteText);

      const genericNote = document.createElementNS("http://www.w3.org/2000/svg", "g");
      genericNote.classList.add("note");
      genericNote.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
      genericNote.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "text"));
      svg.appendChild(genericNote);
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
      expect(mermaid.initialize).toHaveBeenLastCalledWith(
        expect.objectContaining({
          flowchart: expect.objectContaining({ useMaxWidth: false }),
          sequence: expect.objectContaining({ useMaxWidth: false }),
          mindmap: expect.objectContaining({ useMaxWidth: false }),
        })
      );
    });
  });

  it("利用者指定の fontSize を保持する", async () => {
    render(<MermaidDiagram chart="graph TD; A-->B" themeVariables={{ fontSize: "48px" }} />);
    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenLastCalledWith(
        expect.objectContaining({
          themeVariables: expect.objectContaining({ fontSize: "48px" }),
        })
      );
    });
  });

  it("fontSize が未指定なら 16px を使用する", async () => {
    render(<MermaidDiagram chart="graph TD; A-->B" />);
    await waitFor(() => {
      expect(mermaid.initialize).toHaveBeenLastCalledWith(
        expect.objectContaining({
          themeVariables: expect.objectContaining({ fontSize: "16px" }),
        })
      );
    });
  });

  it("maxHeight を描画後の svg に適用する", async () => {
    const { container } = render(<MermaidDiagram chart="stateDiagram-v2" maxHeight="460px" />);
    await waitFor(() => {
      expect((container.querySelector("svg") as SVGElement).style.maxHeight).toBe("460px");
    });
  });

  it.each([
    [320, "320px"],
    [0, "0px"],
  ])("数値 maxHeight=%s を CSS 値 %s として適用する", async (maxHeight, expected) => {
    const { container } = render(<MermaidDiagram chart="stateDiagram-v2" maxHeight={maxHeight} />);
    await waitFor(() => {
      expect((container.querySelector("svg") as SVGElement).style.maxHeight).toBe(expected);
    });
  });

  it.each([
    "default",
    "forest",
    "neutral",
  ] as const)("theme=%s は明示的な themeVariables なしでは Mermaid ネイティブ色を上書きしない", async (theme) => {
    const { container } = render(<MermaidDiagram chart="graph TD; A-->B" theme={theme} />);

    await waitFor(() => expect(container.querySelector("foreignObject div")).not.toBeNull());
    expect((container.querySelector("foreignObject div") as HTMLElement).style.color).toBe("");
    expect((container.querySelector("text.actor") as SVGTextElement).style.fill).toBe("");
    expect((container.querySelector("text.messageText") as SVGTextElement).style.fill).toBe("");
  });

  it("base テーマでは sequenceDiagram の文字色を補正する", async () => {
    const { container } = render(<MermaidDiagram chart="sequenceDiagram" theme="base" />);

    await waitFor(() => {
      expect((container.querySelector("text.actor") as SVGTextElement).style.fill).toBe(
        "rgb(0, 0, 0)"
      );
      expect((container.querySelector("text.messageText") as SVGTextElement).style.fill).toBe(
        "rgb(0, 0, 0)"
      );
      expect(
        (container.querySelector("text.messageText tspan") as SVGTSpanElement).style.fill
      ).toBe("rgb(0, 0, 0)");
      expect((container.querySelector("rect.note") as SVGRectElement).style.fill).toBe(
        "rgb(255, 255, 255)"
      );
      expect((container.querySelector("rect.note") as SVGRectElement).style.stroke).toBe(
        "rgb(0, 0, 0)"
      );
      expect((container.querySelector("text.noteText") as SVGTextElement).style.fill).toBe(
        "rgb(0, 0, 0)"
      );
    });
  });

  it("themeVariables が明示されれば default テーマでも指定色を補正に使う", async () => {
    const { container } = render(
      <MermaidDiagram
        chart="sequenceDiagram"
        theme="default"
        themeVariables={{ primaryTextColor: "#123456", signalTextColor: "#654321" }}
      />
    );

    await waitFor(() => {
      expect((container.querySelector("text.actor") as SVGTextElement).style.fill).toBe(
        "rgb(18, 52, 86)"
      );
      expect((container.querySelector("text.messageText") as SVGTextElement).style.fill).toBe(
        "rgb(101, 67, 33)"
      );
      expect(
        (container.querySelector("text.messageText tspan") as SVGTSpanElement).style.fill
      ).toBe("rgb(101, 67, 33)");
    });
  });

  it("noteTextColor は note 専用で、signalTextColor と広い .note 子孫には適用しない", async () => {
    const { container } = render(
      <MermaidDiagram
        chart="sequenceDiagram"
        theme="base"
        themeVariables={{ noteTextColor: "#112233", signalTextColor: "#abcdef" }}
      />
    );

    await waitFor(() => {
      expect((container.querySelector("text.noteText") as SVGTextElement).style.fill).toBe(
        "rgb(17, 34, 51)"
      );
      expect((container.querySelector("text.noteText tspan") as SVGTSpanElement).style.fill).toBe(
        "rgb(17, 34, 51)"
      );
    });
    expect((container.querySelector("g.note text") as SVGTextElement).style.fill).toBe("");
    expect((container.querySelector("g.note rect") as SVGRectElement).style.fill).toBe("");
  });
});
