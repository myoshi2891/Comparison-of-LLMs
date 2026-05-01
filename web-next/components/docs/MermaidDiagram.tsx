"use client";
import { useEffect, useRef } from "react";

type Props = { chart: string };

export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void import("mermaid").then(async (m) => {
      if (!active || !ref.current) return;
      m.default.initialize({
        startOnLoad: false,
        theme: "dark",
        flowchart: { useMaxWidth: true, htmlLabels: true },
        sequence: { useMaxWidth: true },
        mindmap: { useMaxWidth: true },
      });
      ref.current.textContent = chart;
      ref.current.removeAttribute("data-processed");
      await m.default.run({ nodes: [ref.current] });
    });
    return () => {
      active = false;
    };
  }, [chart]);

  return <div className="mermaid" ref={ref} />;
}
