import type { Metadata } from "next";

/**
 * page.tsx が "use client" のため、Next.js の規約により metadata を page から export できない。
 * ルート単位の layout（Server Component）で SEO メタデータを供給する。
 * description は lib/page-registry.ts の summary と同一文言に揃えている。
 */
export const metadata: Metadata = {
  title: "SonarQube Code Review 実践ガイド — 静的解析と品質ゲート | LLM-Studies",
  description:
    "SonarQube による静的解析とコード品質ゲートの実践ガイド。CI 連携とカバレッジ計測を解説。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
