"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      className={`${styles.cbCopy} ${copied ? styles.copied : ""}`}
      onClick={handleCopy}
      aria-label={copied ? "コピー完了" : "コードをコピー"}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
