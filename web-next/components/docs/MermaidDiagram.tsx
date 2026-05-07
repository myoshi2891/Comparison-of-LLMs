"use client";
import { useEffect, useRef } from "react";

type Props = { chart: string };

/**
 * Render a Mermaid diagram from the provided Mermaid chart source and update it when `chart` changes.
 *
 * Dynamically loads the `mermaid` library, injects the `chart` source into an internal container, and triggers Mermaid to render the diagram. Rendering is skipped if the component unmounts before the library loads.
 *
 * @param chart - Mermaid diagram source text to render
 * @returns The React element containing the rendered Mermaid diagram
 */
export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void import("mermaid")
      .then(async (m) => {
        if (!active || !ref.current) return;
        m.default.initialize({
          startOnLoad: false,
          theme: "default",
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
  }, [chart]);

  return <div className="mermaid" ref={ref} style={{ width: "100%", minHeight: "4rem" }} />;
}
