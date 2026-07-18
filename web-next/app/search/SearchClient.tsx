"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { allTopics, searchEntries } from "@/lib/search";
import styles from "./page.module.css";

/**
 * Interactive search UI for `/search` (F-5 / plans/009).
 *
 * The query and tag live in the URL (`?q=` / `?tag=`) so a result view can be shared.
 * `useSearchParams` requires a Suspense boundary under `output: 'export'`, which the
 * server component in `page.tsx` provides.
 *
 * @returns The search box, topic chips, and the matching result cards.
 */
export function SearchClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const tag = params.get("tag");

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  const topics = useMemo(() => allTopics(), []);
  const results = useMemo(() => searchEntries(query, tag), [query, tag]);

  /** URL を検索状態の SSoT に保つ（共有・ブラウザ履歴のため）。replace で履歴を汚さない。 */
  const syncUrl = (nextQuery: string, nextTag: string | null) => {
    const next = new URLSearchParams();
    if (nextQuery.trim()) next.set("q", nextQuery.trim());
    if (nextTag) next.set("tag", nextTag);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    syncUrl(value, tag);
  };

  const toggleTag = (topic: string) => {
    syncUrl(query, tag === topic ? null : topic);
  };

  return (
    <>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.input}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="キーワードで検索（例: skill, セキュリティ, RAG）"
          aria-label="ページを検索"
        />

        <ul className={styles.chips} aria-label="トピックで絞り込む">
          {topics.map(({ topic, count }) => (
            <li key={topic}>
              <button
                type="button"
                className={tag === topic ? `${styles.chip} ${styles.chipOn}` : styles.chip}
                aria-pressed={tag === topic}
                onClick={() => toggleTag(topic)}
              >
                {topic}
                <span className={styles.chipCount}>{count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.count} aria-live="polite">
        {results.length} 件{tag ? ` / タグ: ${tag}` : ""}
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>
          一致するページがありません。キーワードを減らすか、タグの選択を解除してください。
        </p>
      ) : (
        <ul className={styles.list}>
          {results.map((entry) => (
            <li key={entry.slug}>
              <Link className={styles.card} href={entry.slug}>
                <span className={styles.cardHead}>
                  <span className={styles.group}>{entry.group}</span>
                  <span className={styles.cardTitle}>{entry.title}</span>
                </span>
                <p className={styles.summary}>{entry.summary}</p>
                <span className={styles.topics}>
                  {entry.topics.map((t) => (
                    <span key={t} className={styles.topic}>
                      #{t}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
