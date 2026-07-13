"use client";

import { usePathname } from "next/navigation";
import { findBySlug } from "@/lib/page-registry";
import styles from "./PageFreshness.module.css";

/**
 * 鮮度バッジ — 現在のページの最終確認日 / 公開日を表示する。
 *
 * plans/006 §1 の最大の負債（STATE-08: 鮮度が見えない）への対応。
 * SiteHeader と同じく layout.tsx に 1 箇所マウントし、usePathname() で現在地を得て
 * page-registry から引く。これにより 55 個の page.tsx を編集せずに全ページへ適用でき、
 * 今後追加されるページも registry 登録だけで自動的に鮮度表示される。
 *
 * @param pathname - テストから現在地を上書きするためのプロップ（SiteHeader と同じ規約）
 * @returns registry に登録されたページならバッジ。未登録パスでは null
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
