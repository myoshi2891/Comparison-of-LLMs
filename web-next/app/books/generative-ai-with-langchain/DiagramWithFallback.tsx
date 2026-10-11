"use client";

import { type ReactNode, useEffect, useRef } from "react";
import styles from "./page.module.css";

interface Props {
  id: string;
  children: ReactNode;
}

export default function DiagramWithFallback({ id, children }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const update = () => {
      const fallback = element.querySelector<HTMLParagraphElement>(`.${styles.diagramFallback}`);
      if (fallback) fallback.hidden = element.querySelector("svg") !== null;
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(element, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} ref={root} className={styles.diagramTarget}>
      {children}
    </div>
  );
}
