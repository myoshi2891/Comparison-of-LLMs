/**
 * F-5 横断検索（plans/009）— page-registry をインデックスとする自前検索。
 *
 * 設計判断:
 * - 外部ライブラリ（Fuse.js 等）を追加しない。57 ページの title/summary/topics は数十 KB であり、
 *   全件走査の部分一致で十分に速い。依存を増やさない方がビルドと保守が安定する。
 * - タグ導線は /tags/[tag] の静的ページ群を作らず本ページに集約する（1〜2 ページしか持たない
 *   タグで薄いページが量産されるため）。状態は ?q= / ?tag= の URL クエリで共有する。
 * - 正規化は NFKC + toLowerCase。全角で打たれた「ＲＡＧ」を rag に一致させる。
 * - 並び順は常に nav-taxonomy のグループ順 → addedAt 降順 → slug 昇順。スコアリングを持たない
 *   ぶん、同じ入力に常に同じ並びを返す（SSG / テストの決定論性）。
 */

import { NAV_GROUPS } from "./nav-taxonomy";
import { type PageEntry, pageRegistry } from "./page-registry";

/** 検索・タグの照合用に文字列を正規化する（全角吸収 + 大小無視）。 */
function normalize(value: string): string {
  return value.normalize("NFKC").toLowerCase();
}

/** エントリの検索対象テキスト（title / summary / topics / group / category）を 1 本に連結する。 */
function haystack(entry: PageEntry): string {
  return normalize(
    [entry.title, entry.summary, entry.topics.join(" "), entry.group, entry.category ?? ""].join(
      " "
    )
  );
}

function byGroupThenDate(a: PageEntry, b: PageEntry): number {
  const groupDelta = NAV_GROUPS.indexOf(a.group) - NAV_GROUPS.indexOf(b.group);
  return groupDelta || b.addedAt.localeCompare(a.addedAt) || a.slug.localeCompare(b.slug);
}

/**
 * Searches the page registry by free text and/or an exact topic tag.
 *
 * All whitespace-separated query tokens must match (AND) somewhere in the entry's
 * title, summary, topics, group, or category. An empty query with no tag returns
 * every page, which is the browse mode of `/search`.
 *
 * @param query - Free-text query; empty or whitespace-only means "no text filter"
 * @param tag - Exact topic to filter by, or `null` for no tag filter
 * @param pool - Entries to search; defaults to the full registry (injectable for tests)
 * @returns Matching entries ordered by nav group, then newest first
 */
export function searchEntries(
  query: string,
  tag: string | null,
  pool: readonly PageEntry[] = pageRegistry
): PageEntry[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  const normalizedTag = tag ? normalize(tag) : null;

  return pool
    .filter((entry) => {
      if (normalizedTag && !entry.topics.some((t) => normalize(t) === normalizedTag)) return false;
      if (tokens.length === 0) return true;
      const text = haystack(entry);
      return tokens.every((token) => text.includes(token));
    })
    .sort(byGroupThenDate);
}

/**
 * Counts every topic used across the registry, most common first.
 *
 * @param pool - Entries to aggregate; defaults to the full registry
 * @returns Topics ordered by count (desc), then name (asc) for determinism
 */
export function allTopics(
  pool: readonly PageEntry[] = pageRegistry
): { topic: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of pool) {
    for (const topic of entry.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}
