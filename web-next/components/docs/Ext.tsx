import type React from "react";

interface ExtProps {
  href: string;
  children: React.ReactNode;
}

export default function Ext({ href, children }: ExtProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
