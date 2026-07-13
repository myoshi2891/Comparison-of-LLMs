import type { Metadata } from "next";
import Link from "next/link";
import { byAddedAtDesc, byLastReviewedDesc, type PageEntry } from "@/lib/page-registry";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "What's New — 新着・更新情報 | LLM-Studies",
  description:
    "LLM-Studies の新着ページと最近内容を確認したページの一覧。各ガイドの公開日・最終確認日をページレジストリから自動生成しています。",
};

/** 一覧に出す件数。全 56 ページを並べても読者は読まないため上位のみ。 */
const LIST_LIMIT = 12;

function PageCard({
  entry,
  date,
  dateLabel,
}: {
  entry: PageEntry;
  date: string;
  dateLabel: string;
}) {
  return (
    <li>
      <Link className={styles.card} href={entry.slug}>
        <span className={styles.cardHead}>
          <span className={styles.cardTitle}>
            <span className={styles.group}>{entry.group}</span>
            {entry.title}
          </span>
          <span className={styles.date}>
            {dateLabel}
            <time dateTime={date}> {date}</time>
          </span>
        </span>
        <p className={styles.summary}>{entry.summary}</p>
      </Link>
    </li>
  );
}

/**
 * What's New — 新着・更新情報ページ（plans/006 §3 Phase 1 の F-2）。
 *
 * 内容は lib/page-registry.ts から静的生成する。docs/PROGRESS.md（開発者向け）とは
 * 役割を分離し、本ページは読者向けの鮮度導線に徹する（006 §4）。
 */
export default function WhatsNewPage() {
  const newest = byAddedAtDesc(LIST_LIMIT);
  const freshest = byLastReviewedDesc(LIST_LIMIT);

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.h1}>What&apos;s New</h1>
        <p className={styles.lead}>
          新しく公開したガイドと、直近で内容を確認したガイドの一覧です。
          日付はページレジストリを唯一の出典としており、各ページ上部の鮮度表示と常に一致します。
        </p>
      </header>

      <section className={styles.section} aria-labelledby="newest">
        <h2 className={styles.h2} id="newest">
          新着ページ
        </h2>
        <p className={styles.sectionNote}>公開日（初回追加日）の新しい順・上位 {LIST_LIMIT} 件</p>
        <ul className={styles.list}>
          {newest.map((entry) => (
            <PageCard key={entry.slug} entry={entry} date={entry.addedAt} dateLabel="公開" />
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="recently-reviewed">
        <h2 className={styles.h2} id="recently-reviewed">
          最近更新したページ
        </h2>
        <p className={styles.sectionNote}>
          最終確認日の新しい順・上位 {LIST_LIMIT} 件。月次更新で内容を確認した日を示します
        </p>
        <ul className={styles.list}>
          {freshest.map((entry) => (
            <PageCard
              key={entry.slug}
              entry={entry}
              date={entry.lastReviewed}
              dateLabel="最終確認"
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
