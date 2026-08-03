"use client";
import { useEffect, useRef } from "react";

type Props = {
  chart: string;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  /** Optional rendered SVG height cap for unusually tall diagrams. */
  maxHeight?: React.CSSProperties["maxHeight"];
  /** Use Mermaid HTML labels for flowcharts. Disable when scaled labels overflow their nodes. */
  flowchartHtmlLabels?: boolean;
  /** Mermaid theme. Defaults to "dark". Pass "base" for light-mode pages. */
  theme?: "dark" | "base" | "default" | "forest" | "neutral";
  /**
   * Mermaid themeVariables override (only meaningful when theme="base").
   * IMPORTANT: themeVariables should be a stable reference (e.g. a module-level constant like LOOP_THEME_VARS or wrapped in useMemo)
   * to prevent redundant re-initialization and flickering in the useEffect.
   */
  themeVariables?: Record<string, string>;
};

let mermaidRenderQueue: Promise<void> = Promise.resolve();

const MERMAID_RENDER_TIMEOUT_MS = 15000;

/**
 * Resolves with the promise's value or completes without a value after the specified duration.
 *
 * @param promise - The promise to await
 * @param ms - The maximum wait duration in milliseconds
 * @returns The promise's resolved value, or `undefined` if the duration elapses first
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | void> {
  return Promise.race([
    promise,
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    }),
  ]);
}

/**
 * Queues a Mermaid render so it runs after previously queued renders.
 *
 * @param render - The asynchronous rendering operation to execute
 * @returns The rendering operation's result
 */
function enqueueMermaidRender<T>(render: () => Promise<T>): Promise<T> {
  const queued = mermaidRenderQueue.then(render, render);
  mermaidRenderQueue = withTimeout(queued, MERMAID_RENDER_TIMEOUT_MS).then(
    () => undefined,
    () => undefined
  );
  return queued;
}

/**
 * Converts an unknown thrown value into an `Error` with an informative message and optional chart context.
 *
 * @param err - The thrown value to normalize
 * @param chartInfo - Optional chart information to include in the error message
 * @returns An `Error` representing the thrown value
 */
function normalizeError(err: unknown, chartInfo?: string): Error {
  const context = chartInfo ? ` [chart: "${chartInfo}"]` : "";
  if (err instanceof Error) {
    if (chartInfo && !err.message.includes(chartInfo)) {
      const normalized = new Error(`${err.message}${context}`);
      normalized.stack = err.stack;
      return normalized;
    }
    return err;
  }
  let message = "";
  if (typeof err === "string") {
    message = err;
  } else if (typeof err === "object" && err !== null) {
    try {
      const json = JSON.stringify(err);
      message = json !== "{}" ? json : String(err);
    } catch {
      message = String(err);
    }
  } else {
    message = String(err);
  }
  return new Error(`${message || "Unknown error"}${context}`);
}

/**
 * Applies theme and configurable color overrides to sequence diagram elements.
 *
 * @param root - The container element holding the sequence diagram SVG.
 * @param themeVariables - Optional colors used to style diagram elements.
 * @param theme - The active theme used to select default colors.
 */
function applySequenceDiagramColorOverrides(
  root: HTMLElement,
  themeVariables?: Record<string, string>,
  theme: string = "dark"
): void {
  const isDark = theme === "dark";
  const defaultTxt = isDark ? "#e2e8f0" : "#000000";

  const actorBkgColor =
    themeVariables?.actorBkg ?? themeVariables?.primaryColor ?? (isDark ? "#1e293b" : "#ffffff");
  const actorBorderColor =
    themeVariables?.actorBorder ??
    themeVariables?.primaryBorderColor ??
    (isDark ? "#3b82f6" : "#000000");
  const actorTxtColor =
    themeVariables?.actorTextColor ?? themeVariables?.primaryTextColor ?? defaultTxt;

  root.querySelectorAll<SVGRectElement>("rect.actor").forEach((el) => {
    el.style.setProperty("fill", actorBkgColor, "important");
    el.style.setProperty("stroke", actorBorderColor, "important");
  });
  root.querySelectorAll<SVGTextElement>("text.actor").forEach((el) => {
    el.style.setProperty("fill", actorTxtColor, "important");
  });

  const noteBkgColor =
    themeVariables?.noteBkgColor ??
    themeVariables?.secondaryColor ??
    (isDark ? "#1e293b" : "#ffffff");
  const noteBorderColor = themeVariables?.noteBorderColor ?? (isDark ? "#64748b" : "#000000");
  const noteTxtColor =
    themeVariables?.noteTextColor ?? themeVariables?.primaryTextColor ?? defaultTxt;

  root.querySelectorAll<SVGRectElement>("rect.note").forEach((el) => {
    el.style.setProperty("fill", noteBkgColor, "important");
    el.style.setProperty("stroke", noteBorderColor, "important");
  });
  root.querySelectorAll<SVGTextElement>("text.noteText").forEach((el) => {
    el.style.setProperty("fill", noteTxtColor, "important");
    el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
      ts.style.setProperty("fill", noteTxtColor, "important");
    });
  });

  const messageTxtColor =
    themeVariables?.messageTextColor ??
    themeVariables?.signalTextColor ??
    themeVariables?.primaryTextColor ??
    defaultTxt;
  root.querySelectorAll<SVGTextElement>("text.messageText").forEach((el) => {
    el.style.setProperty("fill", messageTxtColor, "important");
    el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
      ts.style.setProperty("fill", messageTxtColor, "important");
    });
  });

  const loopTxtColor =
    themeVariables?.loopTextColor ??
    themeVariables?.signalTextColor ??
    themeVariables?.primaryTextColor ??
    defaultTxt;
  root.querySelectorAll<SVGTextElement>("text.loopText").forEach((el) => {
    el.style.setProperty("fill", loopTxtColor, "important");
    el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
      ts.style.setProperty("fill", loopTxtColor, "important");
    });
  });

  const labelTxtColor =
    themeVariables?.labelTextColor ??
    themeVariables?.signalTextColor ??
    themeVariables?.primaryTextColor ??
    defaultTxt;
  root.querySelectorAll<SVGTextElement>("text.labelText").forEach((el) => {
    el.style.setProperty("fill", labelTxtColor, "important");
    el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
      ts.style.setProperty("fill", labelTxtColor, "important");
    });
  });

  const messageLines = root.querySelectorAll<SVGPathElement | SVGLineElement>(
    "path.messageLine0, path.messageLine1, line.messageLine0, line.messageLine1"
  );
  if (messageLines.length > 0) {
    const signalLineColor = themeVariables?.signalColor ?? "#94a3b8";
    messageLines.forEach((el) => {
      el.style.setProperty("stroke", signalLineColor, "important");
    });
    root.querySelectorAll<SVGPathElement>("marker path").forEach((el) => {
      el.style.setProperty("fill", signalLineColor, "important");
      el.style.setProperty("stroke", signalLineColor, "important");
    });
  }
}

/**
 * Applies color and text styling to pie chart slices, legends, titles, and labels.
 *
 * @param root - The container element holding the pie chart SVG.
 * @param themeVariables - Optional color and opacity overrides for pie chart elements.
 * @param theme - The active theme used to select default text colors.
 */
function applyPieChartColorOverrides(
  root: HTMLElement,
  themeVariables?: Record<string, string>,
  theme: string = "dark"
): void {
  const isDark = theme === "dark";
  const defaultPieColors = [
    "#57c7ff",
    "#a996ff",
    "#ff9d66",
    "#5eead4",
    "#ffd166",
    "#ef476f",
    "#38bdf8",
    "#c084fc",
    "#fb923c",
    "#2dd4bf",
    "#facc15",
    "#f43f5e",
  ];

  const pieStrokeColor = themeVariables?.pieStrokeColor ?? "#07111e";
  const pieOpacity = themeVariables?.pieOpacity ?? "0.95";

  const slices = root.querySelectorAll<SVGPathElement>("path.pieCircle");
  slices.forEach((el, idx) => {
    const pieKey = `pie${idx + 1}`;
    const color = themeVariables?.[pieKey] ?? defaultPieColors[idx % defaultPieColors.length];
    el.style.setProperty("fill", color, "important");
    el.style.setProperty("stroke", pieStrokeColor, "important");
    el.style.setProperty("stroke-width", "2px", "important");
    el.style.setProperty("opacity", pieOpacity, "important");
  });

  const legendRects = root.querySelectorAll<SVGRectElement>(
    "g.legend rect, .legend rect, svg rect[class*='legend']"
  );
  legendRects.forEach((el, idx) => {
    const pieKey = `pie${idx + 1}`;
    const color = themeVariables?.[pieKey] ?? defaultPieColors[idx % defaultPieColors.length];
    el.style.setProperty("fill", color, "important");
    el.style.setProperty("stroke", pieStrokeColor, "important");
  });

  const titleTextColor =
    themeVariables?.pieTitleTextColor ??
    themeVariables?.primaryTextColor ??
    (isDark ? "#e8eef5" : "#07111e");
  root.querySelectorAll<SVGTextElement>(".pieTitleText").forEach((el) => {
    el.style.setProperty("fill", titleTextColor, "important");
  });

  const legendTextColor =
    themeVariables?.pieLegendTextColor ??
    themeVariables?.primaryTextColor ??
    (isDark ? "#e8eef5" : "#07111e");
  root
    .querySelectorAll<SVGTextElement>("g.legend text, .legend text, text.legend")
    .forEach((el) => {
      el.style.setProperty("fill", legendTextColor, "important");
    });

  const sliceTextColor = themeVariables?.pieSectionTextColor ?? "#07111e";
  root.querySelectorAll<SVGTextElement>("text.slice, .slice text, g text.slice").forEach((el) => {
    el.style.setProperty("fill", sliceTextColor, "important");
    el.style.setProperty("font-weight", "700", "important");
  });
}

/**
 * Renders a Mermaid diagram and updates it when its source or rendering options change.
 *
 * @param chart - Mermaid diagram source text.
 * @param id - Optional ID for the diagram container.
 * @param style - Optional inline styles for the outer wrapper.
 * @param className - Optional CSS classes for the outer wrapper.
 * @param maxHeight - Optional maximum height for the rendered SVG.
 * @param flowchartHtmlLabels - Whether flowcharts use foreignObject-based HTML labels.
 * @param theme - Mermaid theme to use.
 * @param themeVariables - Optional Mermaid theme variable overrides.
 * @returns A wrapper containing the rendered diagram.
 */
export default function MermaidDiagram({
  chart,
  id,
  style,
  className,
  maxHeight,
  flowchartHtmlLabels = true,
  theme = "dark",
  themeVariables,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    const currentToken = ++renderCountRef.current;
    let active = true;

    const isCurrent = () =>
      active && ref.current !== null && currentToken === renderCountRef.current;

    void import("mermaid")
      .then((m) =>
        enqueueMermaidRender(async () => {
          if (!isCurrent()) return;

          // Dynamic theme & variables configuration bound to the active generation token
          m.default.initialize({
            startOnLoad: false,
            theme,
            themeVariables: { fontSize: "16px", ...themeVariables },
            flowchart: { useMaxWidth: false, htmlLabels: flowchartHtmlLabels },
            sequence: { useMaxWidth: false },
            mindmap: { useMaxWidth: false },
          });

          if (!isCurrent()) return;
          if (!ref.current) return;

          if (document.fonts) {
            await Promise.race([
              document.fonts.ready,
              new Promise((resolve) => setTimeout(resolve, 3000)),
            ]);
          }
          if (!isCurrent()) return;

          const tempEl = document.createElement("div");
          tempEl.style.position = "absolute";
          tempEl.style.top = "-9999px";
          tempEl.style.left = "-9999px";
          tempEl.style.visibility = "hidden";
          tempEl.style.pointerEvents = "none";
          tempEl.textContent = chart;
          document.body.appendChild(tempEl);

          try {
            await m.default.run({ nodes: [tempEl] });
            if (!isCurrent() || !ref.current) return;

            const svg = tempEl.querySelector("svg");
            if (svg instanceof SVGElement) {
              svg.style.maxWidth = "100%";
              if (maxHeight !== undefined) {
                svg.style.maxHeight =
                  typeof maxHeight === "number"
                    ? maxHeight === 0
                      ? "0"
                      : `${maxHeight}px`
                    : maxHeight;
              }
              svg.style.height = "auto";
            }

            if (theme === "base" || theme === "dark" || themeVariables !== undefined) {
              const textColor =
                themeVariables?.primaryTextColor ?? (theme === "dark" ? "#e2e8f0" : "#000000");
              tempEl.querySelectorAll("foreignObject *").forEach((el) => {
                const htmlElement = el as HTMLElement;
                htmlElement.style.setProperty("color", textColor, "important");
                htmlElement.style.setProperty("line-height", "1.2", "important");
              });

              applySequenceDiagramColorOverrides(tempEl, themeVariables, theme);
            }

            applyPieChartColorOverrides(tempEl, themeVariables, theme);

            if (!isCurrent() || !ref.current) return;
            ref.current.replaceChildren(...tempEl.childNodes);
          } catch (err) {
            if (isCurrent() && ref.current) {
              const chartSnippet = chart.trim().slice(0, 60).replace(/\s+/g, " ");
              console.error("[MermaidDiagram] render failed:", normalizeError(err, chartSnippet));
              ref.current.textContent = "⚠️ ダイアグラムを描画できませんでした";
            }
          } finally {
            if (tempEl.parentNode === document.body) {
              document.body.removeChild(tempEl);
            }
          }
        })
      )
      .catch((err: unknown) => {
        if (isCurrent()) {
          console.error("[MermaidDiagram] load failed:", normalizeError(err));
        }
      });

    return () => {
      active = false;
    };
  }, [chart, flowchartHtmlLabels, maxHeight, theme, themeVariables]);

  return (
    <div
      className={`mermaid-scroll ${className || ""}`}
      data-mermaid-theme={theme}
      style={{ ...style, width: "100%" }}
    >
      <div
        id={id}
        className="mermaid"
        ref={ref}
        style={{ display: "flex", justifyContent: "center", minHeight: "4rem" }}
      />
    </div>
  );
}
