"use client";

import { usePathname } from "next/navigation";
import { findBySlug } from "@/lib/page-registry";
import styles from "./PageFreshness.module.css";

/**
 * Displays the current page's last-reviewed and publication dates.
 *
 * @param pathname - Optional route path override used to select the page metadata.
 * @returns A freshness badge for a registered page, or `null` when no registry entry exists.
 */
export function PageFreshness({ pathname: pathnameProp }: { pathname?: string } = {}) {
  const fromHook = usePathname();
  const pathname = pathnameProp ?? fromHook ?? "/";
  const entry = findBySlug(pathname);

  if (!entry) return null;

  return (
    <div className={styles.bar} lang="ja">
      <span className={styles.item}>
        最終確認
        <time className={styles.value} dateTime={entry.lastReviewed}>
          {entry.lastReviewed}
        </time>
      </span>
      <span className={styles.sep} aria-hidden="true">
        /
      </span>
      <span className={styles.item}>
        公開
        <time className={styles.value} dateTime={entry.addedAt}>
          {entry.addedAt}
        </time>
      </span>
    </div>
  );
}
