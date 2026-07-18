import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "検索 — 全ガイド横断検索 | LLM-Studies",
  description:
    "LLM-Studies の全ガイドをキーワードとトピックタグで横断検索します。検索インデックスはページレジストリからビルド時に生成しています。",
};

/**
 * Renders the search page shell and interactive search interface.
 *
 * @returns The rendered search page.
 */
export default function SearchPage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.h1}>検索</h1>
        <p className={styles.lead}>
          全ガイドをキーワードとトピックで横断検索します。検索結果は URL（?q= / ?tag=）に
          反映されるため、絞り込んだ状態をそのまま共有できます。
        </p>
      </header>

      <Suspense fallback={<p className={styles.count}>読み込み中…</p>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
