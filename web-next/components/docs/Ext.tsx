import type React from "react";

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Renders an external link that opens in a new tab.
 *
 * @returns An anchor element configured with the provided URL and content
 */
export default function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
