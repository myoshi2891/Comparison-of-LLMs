"use client";
import { useEffect, useRef } from "react";

type Props = {
  chart: string;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  /** Optional rendered SVG height cap for unusually tall diagrams. */
  maxHeight?: React.CSSProperties["maxHeight"];
  /** Mermaid theme. Defaults to "dark". Pass "base" for light-mode pages. */
  theme?: "dark" | "base" | "default" | "forest" | "neutral";
  /**
   * Mermaid themeVariables override (only meaningful when theme="base").
   * IMPORTANT: themeVariables should be a stable reference (e.g. a module-level constant like LOOP_THEME_VARS or wrapped in useMemo)
   * to prevent redundant re-initialization and flickering in the useEffect.
   */
  themeVariables?: Record<string, string>;
};

/**
 * Applies theme-based color overrides to sequence diagram actors, notes, messages, loops, and labels.
 *
 * @param root - The container element holding the sequence diagram SVG.
 * @param themeVariables - Optional theme colors used to style the diagram elements.
 */
function applySequenceDiagramColorOverrides(
  root: HTMLElement,
  themeVariables?: Record<string, string>,
  theme: string = "dark"
): void {
  const isDark = theme === "dark";
  const defaultTxt = isDark ? "#e2e8f0" : "#000000";

  const actorBkgColor = themeVariables?.actorBkg ?? themeVariables?.primaryColor ?? (isDark ? "#1e293b" : "#ffffff");
  const actorBorderColor =
    themeVariables?.actorBorder ?? themeVariables?.primaryBorderColor ?? (isDark ? "#3b82f6" : "#000000");
  const actorTxtColor =
    themeVariables?.actorTextColor ?? themeVariables?.primaryTextColor ?? defaultTxt;

  root.querySelectorAll<SVGRectElement>("rect.actor").forEach((el) => {
    el.style.setProperty("fill", actorBkgColor, "important");
    el.style.setProperty("stroke", actorBorderColor, "important");
  });
  root.querySelectorAll<SVGTextElement>("text.actor").forEach((el) => {
    el.style.setProperty("fill", actorTxtColor, "important");
  });

  const noteBkgColor = themeVariables?.noteBkgColor ?? themeVariables?.secondaryColor ?? (isDark ? "#1e293b" : "#ffffff");
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

  const signalTxtColor =
    themeVariables?.signalTextColor ?? themeVariables?.primaryTextColor ?? defaultTxt;
  root
    .querySelectorAll<SVGTextElement>("text.messageText, text.loopText, text.labelText")
    .forEach((el) => {
      el.style.setProperty("fill", signalTxtColor, "important");
      el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
        ts.style.setProperty("fill", signalTxtColor, "important");
      });
    });

  if (isDark) {
    root.querySelectorAll<SVGPathElement | SVGLineElement>("path.messageLine0, path.messageLine1, line.messageLine0, line.messageLine1").forEach((el) => {
      el.style.setProperty("stroke", "#94a3b8", "important");
    });
    root.querySelectorAll<SVGPathElement>("marker path").forEach((el) => {
      el.style.setProperty("fill", "#94a3b8", "important");
      el.style.setProperty("stroke", "#94a3b8", "important");
    });
  }
}

/**
 * Applies vibrant color overrides to Mermaid pie chart slices, legends, and slice texts.
 *
 * @param root - The container element holding the pie chart SVG.
 */
function applyPieChartColorOverrides(root: HTMLElement, theme?: string): void {
  const isDark = theme === "dark";
  const pieColors = ["#57c7ff", "#a996ff", "#ff9d66", "#5eead4", "#ffd166", "#ef476f"];
  const slices = root.querySelectorAll<SVGPathElement>("path.pieCircle");
  slices.forEach((el, idx) => {
    const color = pieColors[idx % pieColors.length];
    el.style.setProperty("fill", color, "important");
    el.style.setProperty("stroke", "#07111e", "important");
    el.style.setProperty("stroke-width", "2px", "important");
    el.style.setProperty("opacity", "0.95", "important");
  });

  const legendRects = root.querySelectorAll<SVGRectElement>(
    "g.legend rect, .legend rect, svg rect[class*='legend']"
  );
  legendRects.forEach((el, idx) => {
    const color = pieColors[idx % pieColors.length];
    el.style.setProperty("fill", color, "important");
    el.style.setProperty("stroke", "#07111e", "important");
  });

  const legendTextColor = isDark ? "#e8eef5" : "#07111e";
  root
    .querySelectorAll<SVGTextElement>("g.legend text, .legend text, text.legend")
    .forEach((el) => {
      el.style.setProperty("fill", legendTextColor, "important");
    });

  const sliceTextColor = isDark ? "#ffffff" : "#07111e";
  root
    .querySelectorAll<SVGTextElement>("text.slice, .slice text, g text.slice, .pieTitleText")
    .forEach((el) => {
      el.style.setProperty("fill", sliceTextColor, "important");
      el.style.setProperty("font-weight", "700", "important");
    });
}

/**
 * Renders a Mermaid diagram and updates it when its source or rendering options change.
 *
 * @param chart - Mermaid diagram source text.
 * @param id - Optional ID for the inner diagram container.
 * @param style - Optional inline styles for the outer wrapper.
 * @param className - Optional additional CSS classes for the outer wrapper.
 * @param maxHeight - Optional maximum height applied to the rendered SVG.
 * @param theme - Mermaid theme to use.
 * @param themeVariables - Optional Mermaid theme variable overrides.
 * @returns A wrapper containing the rendered Mermaid diagram.
 */
export default function MermaidDiagram({
  chart,
  id,
  style,
  className,
  maxHeight,
  theme = "dark",
  themeVariables,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void import("mermaid")
      .then(async (m) => {
        if (!active || !ref.current) return;
        m.default.initialize({
          startOnLoad: false,
          theme,
          themeVariables: { fontSize: "16px", ...themeVariables },
          flowchart: { useMaxWidth: false, htmlLabels: true },
          sequence: { useMaxWidth: false },
          mindmap: { useMaxWidth: false },
        });
        ref.current.textContent = chart;
        ref.current.removeAttribute("data-processed");
        try {
          await m.default.run({ nodes: [ref.current] });
          // 列幅より広い図は列幅まで縮小して中央に収める（切れ・左寄りを防ぐ）。
          // mermaid は useMaxWidth:false 時に svg へ自然サイズの inline style を付けるため、
          // inline を上書きして max-width:100% / height:auto を強制する。
          const svg = ref.current?.querySelector("svg");
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
          // --- foreignObject 文字色後処理 ---
          // htmlLabels:true の場合、flowchart ノードラベルは SVG <foreignObject> 内の HTML として
          // レンダーされる。この HTML 要素には themeVariables.primaryTextColor が CSS カスケードで
          // 届かない（SVG 内の <style> は foreignObject 内 HTML に非カスケード）。
          // base テーマ、または明示的な themeVariables がある場合のみ補正する。
          // ref: fix-mermaid SKILL Part 2-4
          if (ref.current) {
            if (theme === "base" || theme === "dark" || themeVariables !== undefined) {
              const textColor =
                themeVariables?.primaryTextColor ??
                (theme === "dark" ? "#e2e8f0" : "#000000");
              ref.current.querySelectorAll("foreignObject *").forEach((el) => {
                (el as HTMLElement).style.setProperty("color", textColor, "important");
              });

              applySequenceDiagramColorOverrides(ref.current, themeVariables, theme);
            }

            applyPieChartColorOverrides(ref.current, theme);
          }
        } catch (err) {
          console.error("[MermaidDiagram] render failed:", err);
          if (active && ref.current) {
            ref.current.textContent = "⚠️ ダイアグラムを描画できませんでした";
          }
        }
      })
      .catch((err: unknown) => {
        console.error("[MermaidDiagram] load failed:", err);
      });
    return () => {
      active = false;
    };
    // themeVariables is in the dependency array. If the caller passes an inline object,
    // it will re-initialize mermaid and cause flickering.
  }, [chart, maxHeight, theme, themeVariables]);

  // 2層構造でレイアウトの真実の源を一元化する:
  //   外側 = フレーム全幅（列幅）を占める
  //   内側 = flex 中央寄せ。svg は max-width:100% で列幅に収まるよう縮小（上の useEffect で付与）
  // これにより、列幅に収まる図は自然サイズで中央寄せ、広い図は縮小して中央寄せとなり、
  // 切れ・左寄りが発生しない。ページ側で width/max-width を強制する必要はない。
  return (
    <div className={`mermaid-scroll ${className || ""}`} style={{ ...style, width: "100%" }}>
      <div
        id={id}
        className="mermaid"
        ref={ref}
        style={{ display: "flex", justifyContent: "center", minHeight: "4rem" }}
      />
    </div>
  );
}
