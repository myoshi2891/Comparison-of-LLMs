"use client";
import { useEffect, useRef } from "react";

type Props = {
  chart: string;
  id?: string;
  style?: React.CSSProperties;
  className?: string;
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
 * Render a Mermaid diagram from the provided Mermaid source and update it when `chart` changes.
 *
 * Dynamically loads the `mermaid` library, injects `chart` into an internal container, and triggers Mermaid to render the diagram. If the component unmounts before the library finishes loading or rendering, no update is performed.
 *
 * @param chart - Mermaid diagram source text to render
 * @param id - Optional id attribute applied to the container element
 * @param style - Optional inline styles merged with the component's default width and minimum height
 * @param className - Optional additional CSS classes appended to the container's `"mermaid"` class
 * @param theme - Mermaid theme ("dark" by default)
 * @param themeVariables - Mermaid themeVariables override
 * @returns The React element containing the rendered Mermaid diagram
 */
export default function MermaidDiagram({
  chart,
  id,
  style,
  className,
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
          themeVariables: { fontSize: '16px', ...themeVariables },
          flowchart: { useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true },
          mindmap: { useMaxWidth: true },
        });
        ref.current.textContent = chart;
        ref.current.removeAttribute("data-processed");
        try {
          await m.default.run({ nodes: [ref.current] });
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
  }, [chart, theme, themeVariables]);

  return (
    <div
      id={id}
      className={`mermaid ${className || ""}`}
      ref={ref}
      style={{ width: "100%", minHeight: "4rem", ...style }}
    />
  );
}
