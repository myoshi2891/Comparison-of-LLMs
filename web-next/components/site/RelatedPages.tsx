"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { relatedEntries } from "@/lib/related-pages";
import styles from "./RelatedPages.module.css";

/**
 * Renders navigation links to pages related to the current route.
 *
 * @param pathname - Optional route used instead of the current route.
 * @returns A related-pages navigation element, or `null` when no related pages are available.
 */
export function RelatedPages({ pathname: pathnameProp }: { pathname?: string } = {}) {
  const fromHook = usePathname();
  const pathname = pathnameProp ?? fromHook ?? "/";
  const related = relatedEntries(pathname);

  if (related.length === 0) return null;

  return (
    <nav className={styles.wrap} aria-label="関連ページ" lang="ja">
      <h2 className={styles.heading}>関連ページ</h2>
      <ul className={styles.list}>
        {related.map((entry) => (
          <li key={entry.slug} className={styles.item}>
            <Link href={entry.slug} className={styles.card}>
              <span className={styles.group}>{entry.category ?? entry.group}</span>
              <span className={styles.title}>{entry.title}</span>
              <span className={styles.summary}>{entry.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
