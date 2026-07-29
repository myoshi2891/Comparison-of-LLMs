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

function applySequenceDiagramColorOverrides(
  root: HTMLElement,
  themeVariables?: Record<string, string>
): void {
  const actorBkgColor = themeVariables?.actorBkg ?? themeVariables?.primaryColor ?? "#ffffff";
  const actorBorderColor =
    themeVariables?.actorBorder ?? themeVariables?.primaryBorderColor ?? "#000000";
  const actorTxtColor =
    themeVariables?.actorTextColor ?? themeVariables?.primaryTextColor ?? "#000000";

  root.querySelectorAll<SVGRectElement>("rect.actor").forEach((el) => {
    el.style.setProperty("fill", actorBkgColor, "important");
    el.style.setProperty("stroke", actorBorderColor, "important");
  });
  root.querySelectorAll<SVGTextElement>("text.actor").forEach((el) => {
    el.style.setProperty("fill", actorTxtColor, "important");
  });

  const noteBkgColor = themeVariables?.noteBkgColor ?? themeVariables?.secondaryColor ?? "#FBF0DF";
  const noteBorderColor = themeVariables?.noteBorderColor ?? "#EACB99";
  const noteTxtColor =
    themeVariables?.noteTextColor ?? themeVariables?.primaryTextColor ?? "#14161C";

  root
    .querySelectorAll<SVGRectElement>(
      "rect.note, rect.noteRect, g.note rect, .note rect"
    )
    .forEach((el) => {
      el.style.setProperty("fill", noteBkgColor, "important");
      el.style.setProperty("stroke", noteBorderColor, "important");
    });
  root
    .querySelectorAll<SVGTextElement>("text.noteText, g.note text, .note text")
    .forEach((el) => {
      el.style.setProperty("fill", noteTxtColor, "important");
      el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
        ts.style.setProperty("fill", noteTxtColor, "important");
      });
    });

  const signalTxtColor =
    themeVariables?.signalTextColor ?? themeVariables?.primaryTextColor ?? "#000000";
  root
    .querySelectorAll<SVGTextElement>(
      "text.messageText, text.loopText, text.labelText"
    )
    .forEach((el) => {
      el.style.setProperty("fill", signalTxtColor, "important");
      el.querySelectorAll<SVGTSpanElement>("tspan").forEach((ts) => {
        ts.style.setProperty("fill", signalTxtColor, "important");
      });
    });
}

/**
 * Renders a Mermaid diagram and updates it when its source or rendering options change.
 *
 * @param chart - Mermaid diagram source text.
 * @param id - Optional ID for the inner diagram container.
 * @param style - Optional inline styles for the outer wrapper.
 * @param className - Optional additional CSS classes for the outer wrapper.
 * @param theme - Mermaid theme to use.
 * @param themeVariables - Optional Mermaid theme variable overrides.
 * @returns A wrapper containing the rendered Mermaid diagram.
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
          themeVariables: { fontSize: "1rem", ...themeVariables },
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
            svg.style.height = "auto";
          }
          // --- foreignObject 文字色後処理 ---
          // htmlLabels:true の場合、flowchart ノードラベルは SVG <foreignObject> 内の HTML として
          // レンダーされる。この HTML 要素には themeVariables.primaryTextColor が CSS カスケードで
          // 届かない（SVG 内の <style> は foreignObject 内 HTML に非カスケード）。
          // base テーマ、または明示的な themeVariables がある場合のみ補正する。
          // ref: fix-mermaid SKILL Part 2-4
          if ((theme === "base" || themeVariables !== undefined) && ref.current) {
            const textColor = themeVariables?.primaryTextColor ?? "#000000";
            ref.current.querySelectorAll("foreignObject *").forEach((el) => {
              (el as HTMLElement).style.setProperty("color", textColor, "important");
            });

            // --- sequenceDiagram アクター後処理 ---
            // sequenceDiagram のアクターボックスは SVG <rect class="actor"> / <text class="actor"> で
            // 描画される（foreignObject ではない）。themeVariables.actorBkg が SVG 内 CSS に
            // 反映されない場合のフォールバックとして JS で直接 style を上書きする。
            // --- sequenceDiagram メッセージラベル後処理 ---
            // 矢印上のラベル（messageText）・ループラベル（loopText）・条件ラベル（labelText）も
            // SVG <text> 要素。themeVariables.signalTextColor が届かない場合のフォールバック。
            applySequenceDiagramColorOverrides(ref.current, themeVariables);
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
  }, [chart, theme, themeVariables]);

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
