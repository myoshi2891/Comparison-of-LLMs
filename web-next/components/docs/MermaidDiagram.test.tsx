import { render, waitFor } from "@testing-library/react";
import mermaid from "mermaid";
import { afterEach, describe, expect, it, vi } from "vitest";
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

      // ── sequenceDiagram の残り要素（アクター矩形・loop/label ラベル・シグナル線）──
      const ns = "http://www.w3.org/2000/svg";
      const withTspan = (className: string) => {
        const text = document.createElementNS(ns, "text");
        text.classList.add(className);
        text.appendChild(document.createElementNS(ns, "tspan"));
        return text;
      };

      const actorRect = document.createElementNS(ns, "rect");
      actorRect.classList.add("actor");
      svg.appendChild(actorRect);
      svg.appendChild(withTspan("loopText"));
      svg.appendChild(withTspan("labelText"));

      const signalLine = document.createElementNS(ns, "path");
      signalLine.classList.add("messageLine0");
      svg.appendChild(signalLine);
      const marker = document.createElementNS(ns, "marker");
      marker.appendChild(document.createElementNS(ns, "path"));
      svg.appendChild(marker);

      // ── pieChart 要素（スライス 2 枚・凡例・タイトル・スライス内テキスト）──
      for (let i = 0; i < 2; i += 1) {
        const slice = document.createElementNS(ns, "path");
        slice.classList.add("pieCircle");
        svg.appendChild(slice);
      }
      const legend = document.createElementNS(ns, "g");
      legend.classList.add("legend");
      for (let i = 0; i < 2; i += 1) {
        legend.appendChild(document.createElementNS(ns, "rect"));
      }
      legend.appendChild(document.createElementNS(ns, "text"));
      svg.appendChild(legend);

      const pieTitle = document.createElementNS(ns, "text");
      pieTitle.classList.add("pieTitleText");
      svg.appendChild(pieTitle);

      const sliceText = document.createElementNS(ns, "text");
      sliceText.classList.add("slice");
      svg.appendChild(sliceText);

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

  it("Webフォントの読み込み完了後に Mermaid を描画する", async () => {
    const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
    let resolveFonts!: () => void;
    const fontsReady = new Promise<void>((resolve) => {
      resolveFonts = resolve;
    });
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: fontsReady },
    });
    vi.mocked(mermaid.run).mockClear();

    try {
      render(<MermaidDiagram chart="graph TD; A-->B" />);

      await waitFor(() => expect(mermaid.initialize).toHaveBeenCalled());
      expect(mermaid.run).not.toHaveBeenCalled();

      resolveFonts();
      await waitFor(() => expect(mermaid.run).toHaveBeenCalledTimes(1));
    } finally {
      if (originalFonts) {
        Object.defineProperty(document, "fonts", originalFonts);
      } else {
        Reflect.deleteProperty(document, "fonts");
      }
    }
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

describe("MermaidDiagram sequenceDiagram 配色補正", () => {
  it("dark テーマでは既定のダーク配色をアクター・ノート・ラベルへ適用する", async () => {
    const { container } = render(<MermaidDiagram chart="sequenceDiagram" theme="dark" />);

    await waitFor(() => {
      expect((container.querySelector("rect.actor") as SVGRectElement).style.fill).toBe(
        "rgb(30, 41, 59)"
      );
    });
    expect((container.querySelector("rect.actor") as SVGRectElement).style.stroke).toBe(
      "rgb(59, 130, 246)"
    );
    expect((container.querySelector("text.actor") as SVGTextElement).style.fill).toBe(
      "rgb(226, 232, 240)"
    );
    expect((container.querySelector("rect.note") as SVGRectElement).style.stroke).toBe(
      "rgb(100, 116, 139)"
    );
    expect((container.querySelector("text.loopText") as SVGTextElement).style.fill).toBe(
      "rgb(226, 232, 240)"
    );
    expect((container.querySelector("text.labelText tspan") as SVGTSpanElement).style.fill).toBe(
      "rgb(226, 232, 240)"
    );
    // 注: foreignObject 配下の color 上書きは jsdom では検証できない。
    // nwsapi は camelCase の型セレクタ + 子孫結合子を querySelector では解決するが
    // querySelectorAll では 0 件を返すため、コンポーネント側の
    // querySelectorAll("foreignObject *") が jsdom 上でだけ空になる（実ブラウザは正常）。
  });

  it("シグナル線と矢印マーカーへ signalColor を適用する", async () => {
    const { container } = render(
      <MermaidDiagram
        chart="sequenceDiagram"
        theme="base"
        themeVariables={{ signalColor: "#ff0000" }}
      />
    );

    await waitFor(() => {
      expect((container.querySelector("path.messageLine0") as SVGPathElement).style.stroke).toBe(
        "rgb(255, 0, 0)"
      );
    });
    const markerPath = container.querySelector("marker path") as SVGPathElement;
    expect(markerPath.style.fill).toBe("rgb(255, 0, 0)");
    expect(markerPath.style.stroke).toBe("rgb(255, 0, 0)");
  });

  it("signalColor 未指定なら既定のシグナル線色を使う", async () => {
    const { container } = render(<MermaidDiagram chart="sequenceDiagram" theme="dark" />);

    await waitFor(() => {
      expect((container.querySelector("path.messageLine0") as SVGPathElement).style.stroke).toBe(
        "rgb(148, 163, 184)"
      );
    });
  });

  it("actorBkg / actorBorder / actorTextColor の明示指定を優先する", async () => {
    const { container } = render(
      <MermaidDiagram
        chart="sequenceDiagram"
        theme="base"
        themeVariables={{
          actorBkg: "#010203",
          actorBorder: "#040506",
          actorTextColor: "#070809",
          loopTextColor: "#0a0b0c",
          labelTextColor: "#0d0e0f",
        }}
      />
    );

    await waitFor(() => {
      expect((container.querySelector("rect.actor") as SVGRectElement).style.fill).toBe(
        "rgb(1, 2, 3)"
      );
    });
    expect((container.querySelector("rect.actor") as SVGRectElement).style.stroke).toBe(
      "rgb(4, 5, 6)"
    );
    expect((container.querySelector("text.actor") as SVGTextElement).style.fill).toBe(
      "rgb(7, 8, 9)"
    );
    expect((container.querySelector("text.loopText") as SVGTextElement).style.fill).toBe(
      "rgb(10, 11, 12)"
    );
    expect((container.querySelector("text.labelText") as SVGTextElement).style.fill).toBe(
      "rgb(13, 14, 15)"
    );
  });
});

describe("MermaidDiagram pieChart 配色補正", () => {
  it("themeVariables 未指定ならスライスと凡例へ既定パレットを順番に適用する", async () => {
    const { container } = render(<MermaidDiagram chart="pie" />);

    await waitFor(() => {
      const slices = container.querySelectorAll<SVGPathElement>("path.pieCircle");
      expect(slices[0].style.fill).toBe("rgb(87, 199, 255)");
      expect(slices[1].style.fill).toBe("rgb(169, 150, 255)");
    });

    const slices = container.querySelectorAll<SVGPathElement>("path.pieCircle");
    expect(slices[0].style.stroke).toBe("rgb(7, 17, 30)");
    expect(slices[0].style.opacity).toBe("0.95");
    expect(slices[0].style.getPropertyValue("stroke-width")).toBe("2px");

    const legendRects = container.querySelectorAll<SVGRectElement>("g.legend rect");
    expect(legendRects[0].style.fill).toBe("rgb(87, 199, 255)");
    expect(legendRects[1].style.fill).toBe("rgb(169, 150, 255)");

    // dark（既定）テーマのテキスト色
    expect((container.querySelector(".pieTitleText") as SVGTextElement).style.fill).toBe(
      "rgb(232, 238, 245)"
    );
    expect((container.querySelector("g.legend text") as SVGTextElement).style.fill).toBe(
      "rgb(232, 238, 245)"
    );
    const sliceText = container.querySelector("text.slice") as SVGTextElement;
    expect(sliceText.style.fill).toBe("rgb(7, 17, 30)");
    expect(sliceText.style.getPropertyValue("font-weight")).toBe("700");
  });

  it("pieN / pieStrokeColor / pieOpacity の明示指定を優先する", async () => {
    const { container } = render(
      <MermaidDiagram
        chart="pie"
        themeVariables={{
          pie1: "#111111",
          pie2: "#222222",
          pieStrokeColor: "#333333",
          pieOpacity: "0.5",
          pieTitleTextColor: "#444444",
          pieLegendTextColor: "#555555",
          pieSectionTextColor: "#666666",
        }}
      />
    );

    await waitFor(() => {
      const slices = container.querySelectorAll<SVGPathElement>("path.pieCircle");
      expect(slices[0].style.fill).toBe("rgb(17, 17, 17)");
      expect(slices[1].style.fill).toBe("rgb(34, 34, 34)");
    });

    const slices = container.querySelectorAll<SVGPathElement>("path.pieCircle");
    expect(slices[0].style.stroke).toBe("rgb(51, 51, 51)");
    expect(slices[0].style.opacity).toBe("0.5");
    expect((container.querySelector(".pieTitleText") as SVGTextElement).style.fill).toBe(
      "rgb(68, 68, 68)"
    );
    expect((container.querySelector("g.legend text") as SVGTextElement).style.fill).toBe(
      "rgb(85, 85, 85)"
    );
    expect((container.querySelector("text.slice") as SVGTextElement).style.fill).toBe(
      "rgb(102, 102, 102)"
    );
  });

  it("ライトテーマ（base）ではタイトル・凡例・スライス文字を暗色にする", async () => {
    const { container } = render(<MermaidDiagram chart="pie" theme="base" />);

    await waitFor(() => {
      expect((container.querySelector(".pieTitleText") as SVGTextElement).style.fill).toBe(
        "rgb(7, 17, 30)"
      );
    });
    expect((container.querySelector("g.legend text") as SVGTextElement).style.fill).toBe(
      "rgb(7, 17, 30)"
    );
    expect((container.querySelector("text.slice") as SVGTextElement).style.fill).toBe(
      "rgb(7, 17, 30)"
    );
  });
});

describe("MermaidDiagram 失敗時と世代管理", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("描画に失敗したらエラーメッセージへ差し替える", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(mermaid.run).mockRejectedValueOnce(new Error("bad syntax"));

    const { container } = render(<MermaidDiagram chart="graph TD; A--" />);

    await waitFor(() => {
      expect(container.querySelector<HTMLElement>(".mermaid")?.textContent).toBe(
        "⚠️ ダイアグラムを描画できませんでした"
      );
    });
    expect(consoleError).toHaveBeenCalledWith("[MermaidDiagram] render failed:", expect.any(Error));
    const errorArg = consoleError.mock.calls[0][1] as Error;
    expect(errorArg.message).toContain("bad syntax");
    expect(errorArg.message).toContain('chart: "graph TD; A--"');
  });

  it("非Errorオブジェクトや空オブジェクトが例外としてスローされた場合も正規化してログ出力する", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(mermaid.run).mockRejectedValueOnce({});

    render(<MermaidDiagram chart="graph TD; X-->Y" />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "[MermaidDiagram] render failed:",
        expect.any(Error)
      );
    });
    const errorArg = consoleError.mock.calls[0][1] as Error;
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).not.toBe("{}");
    expect(errorArg.message).toContain('chart: "graph TD; X-->Y"');
  });

  it.each<[string, unknown, string]>([
    ["文字列", "parser unavailable", "parser unavailable"],
    ["空文字列", "", "Unknown error"],
    ["数値", 503, "503"],
    ["null", null, "null"],
    ["内容を持つオブジェクト", { code: "PARSE_ERROR" }, '{"code":"PARSE_ERROR"}'],
  ])("%s の描画例外も Error へ正規化する", async (_label, thrown, expectedMessage) => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(mermaid.run).mockRejectedValueOnce(thrown);

    render(<MermaidDiagram chart="graph TD; X-->Y" />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "[MermaidDiagram] render failed:",
        expect.any(Error)
      );
    });
    const errorArg = consoleError.mock.calls[0][1] as Error;
    expect(errorArg.message).toContain(expectedMessage);
    expect(errorArg.message).toContain('chart: "graph TD; X-->Y"');
  });

  it("循環参照を含む描画例外も安全に Error へ正規化する", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const circular: { self?: unknown } = {};
    circular.self = circular;
    vi.mocked(mermaid.run).mockRejectedValueOnce(circular);

    render(<MermaidDiagram chart="graph TD; X-->Y" />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "[MermaidDiagram] render failed:",
        expect.any(Error)
      );
    });
    const errorArg = consoleError.mock.calls[0][1] as Error;
    expect(errorArg.message).toContain("[object Object]");
    expect(errorArg.message).toContain('chart: "graph TD; X-->Y"');
  });

  it("初期化に失敗したら Error を正規化して load failed としてログ出力する", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const initializeError = new Error("initialize failed");
    vi.mocked(mermaid.initialize).mockImplementationOnce(() => {
      throw initializeError;
    });

    render(<MermaidDiagram chart="graph TD; A-->B" />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith("[MermaidDiagram] load failed:", initializeError);
    });
  });

  it("foreignObject の文字色と行高を補正する", async () => {
    const defaultRun = vi.mocked(mermaid.run).getMockImplementation();
    expect(defaultRun).toBeDefined();
    vi.mocked(mermaid.run).mockImplementationOnce(async (args) => {
      await defaultRun?.(args);
      const target = args?.nodes?.[0] as HTMLElement;
      const label = target.querySelector("foreignObject div");
      const querySelectorAll = target.querySelectorAll.bind(target);
      vi.spyOn(target, "querySelectorAll").mockImplementation((selectors: string) => {
        if (selectors === "foreignObject *" && label) {
          return [label] as unknown as NodeListOf<Element>;
        }
        return querySelectorAll(selectors);
      });
    });

    const { container } = render(
      <MermaidDiagram
        chart="sequenceDiagram"
        theme="base"
        themeVariables={{ primaryTextColor: "#123456" }}
      />
    );

    await waitFor(() => {
      expect((container.querySelector("foreignObject div") as HTMLElement).style.color).toBe(
        "rgb(18, 52, 86)"
      );
      expect((container.querySelector("foreignObject div") as HTMLElement).style.lineHeight).toBe(
        "1.2"
      );
    });
  });

  it("一時要素が描画中に外された場合は cleanup で二重削除しない", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const removeChildSpy = vi.spyOn(document.body, "removeChild");
    vi.mocked(mermaid.run).mockImplementationOnce(async (args) => {
      document.body.removeChild(args?.nodes?.[0] as Node);
      throw new Error("detached while rendering");
    });

    try {
      render(<MermaidDiagram chart="graph TD; A-->B" />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "[MermaidDiagram] render failed:",
          expect.any(Error)
        );
      });
      expect(removeChildSpy).toHaveBeenCalledTimes(1);
    } finally {
      removeChildSpy.mockRestore();
    }
  });

  it("描画処理中に一時 DOM 要素が body へ追加され、完了・失敗後に確実に削除される", async () => {
    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    try {
      render(<MermaidDiagram chart="graph TD; A-->B" />);

      await waitFor(() => {
        const tempEl = appendChildSpy.mock.calls
          .map(([node]) => node)
          .find(
            (node): node is HTMLDivElement =>
              node instanceof HTMLDivElement && node.style.visibility === "hidden"
          );

        expect(tempEl).toBeDefined();
        expect(tempEl?.style.top).toBe("-9999px");
        expect(tempEl?.style.left).toBe("-9999px");
        expect(appendChildSpy).toHaveBeenCalledWith(tempEl);
        expect(removeChildSpy).toHaveBeenCalledWith(tempEl);
      });
    } finally {
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    }
  });

  it("世代が更新された後は古い描画結果を反映しない", async () => {
    let releaseFirstRun: (() => void) | undefined;
    vi.mocked(mermaid.run).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          releaseFirstRun = () => {
            resolve();
          };
        })
    );

    const { container, rerender } = render(<MermaidDiagram chart="graph TD; A-->B" />);
    await waitFor(() => expect(releaseFirstRun).toBeDefined());

    // 先行描画が未完了のまま chart を差し替える（世代トークンが進む）
    rerender(<MermaidDiagram chart="graph TD; B-->C" />);
    releaseFirstRun?.();

    await waitFor(() => {
      expect(container.querySelector("svg")).not.toBeNull();
    });
    // 後発の描画のみが svg を 1 つ挿入し、古い世代の後処理は行われない
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("アンマウント済みなら描画処理を開始しない", async () => {
    const initializeCalls = vi.mocked(mermaid.initialize).mock.calls.length;
    const { unmount } = render(<MermaidDiagram chart="graph TD; A-->B" />);
    unmount();

    await Promise.resolve();
    await Promise.resolve();
    expect(vi.mocked(mermaid.initialize).mock.calls.length).toBe(initializeCalls);
  });
});
