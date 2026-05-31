"use client";

import { useState } from "react";

interface CodeCopyButtonProps {
  text: string;
  className?: string;
}

export default function CodeCopyButton({ text, className }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleCopy}
      aria-label={copied ? "コピーしました" : "コードをコピー"}
      aria-live="polite"
    >
      <i className={copied ? "ti ti-check" : "ti ti-copy"} aria-hidden="true" />
      {copied ? "コピー完了" : "コピー"}
    </button>
  );
}
