"use client";

import { useEffect, useRef, useState } from "react";

interface CodeCopyButtonProps {
  text: string;
  className?: string;
}

/**
 * Renders a button that copies the provided text to the clipboard and shows a temporary "copied" state.
 *
 * The button displays different icon, label, and accessible name while the "copied" state is active (cleared after 2 seconds).
 *
 * @param text - The string to copy to the user's clipboard when the button is clicked.
 * @param className - Optional CSS class applied to the button element.
 * @returns A React element for a copy-to-clipboard button that reflects a transient copied state.
 */
export default function CodeCopyButton({ text, className }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

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
