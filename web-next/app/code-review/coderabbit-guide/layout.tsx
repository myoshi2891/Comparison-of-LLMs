import type { Metadata } from "next";

/**
 * page.tsx が "use client" のため、Next.js の規約により metadata を page から export できない。
 * ルート単位の layout（Server Component）で SEO メタデータを供給する。
 * description は lib/page-registry.ts の summary と同一文言に揃えている。
 */
export const metadata: Metadata = {
  title: "CodeRabbit 実践ガイド — AI コードレビューの導入と運用 | LLM-Studies",
  description: "AI コードレビューツール CodeRabbit の導入・設定・運用を解説する実践ガイド。",
};

/**
 * Renders the content provided to the route layout.
 *
 * @param children - The content to render within the layout
 * @returns The provided content
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
