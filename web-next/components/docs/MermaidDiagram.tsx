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
 * Renders a Mermaid diagram and updates it when the source or rendering options change.
 *
 * @param chart - Mermaid diagram source text to render
 * @param id - Optional ID for the diagram container
 * @param style - Optional inline styles merged with the container's default styles
 * @param className - Optional additional CSS class names for the container
 * @param theme - Mermaid theme to use
 * @param themeVariables - Optional Mermaid theme variable overrides
 * @returns A container element for the rendered Mermaid diagram
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
          themeVariables: { fontSize: "16px", ...themeVariables },
          flowchart: { useMaxWidth: false, htmlLabels: true },
          sequence: { useMaxWidth: false },
          mindmap: { useMaxWidth: false },
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

  // 2層構造でレイアウトの真実の源を一元化する:
  //   外側 = フレーム全幅・横スクロール担当（図がはみ出したら横スクロール）
  //   内側 = 自然サイズを中央寄せ（引き伸ばし・縮小を禁止し useMaxWidth:false と整合）
  // inline style は非 !important の per-page CSS より優先されるため、各ページの
  // 図解ラッパー側で width/max-width を強制しなくても中央寄せ・スクロールが成立する。
  return (
    <div
      className={`mermaid-scroll ${className || ""}`}
      style={{ width: "100%", overflowX: "auto", ...style }}
    >
      <div
        id={id}
        className="mermaid"
        ref={ref}
        style={{ width: "fit-content", margin: "0 auto", minHeight: "4rem" }}
      />
    </div>
  );
}
