"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { relatedEntries } from "@/lib/related-pages";
import styles from "./RelatedPages.module.css";

/**
 * Renders links to the pages most related to the current one (F-7 / plans/009).
 *
 * Mounted once in `app/layout.tsx` after `{children}`, so every page gets related
 * links without editing 55 page.tsx files — the same strategy as `PageFreshness`.
 *
 * @param pathname - Optional route override used to select the source page.
 * @returns A related-pages nav, or `null` when the page is unregistered or has no overlap.
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
