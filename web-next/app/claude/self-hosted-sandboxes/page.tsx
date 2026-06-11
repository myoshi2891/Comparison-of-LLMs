import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Self-hosted Sandboxes 完全ガイド",
  description: "Self-hosted Sandboxesの解説ページ",
};

export default function Page() {
  return (
    <div>
      <h1>Claude Self-hosted Sandboxes 完全ガイド</h1>
      {/* Intentionally missing h2 tags and external links to trigger failures */}
    </div>
  );
}
