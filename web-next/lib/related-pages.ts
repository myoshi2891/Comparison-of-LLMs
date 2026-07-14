/**
 * F-7 関連ページリンク（plans/009）— registry の topics 近接から関連ページを導出する。
 *
 * 設計判断:
 * - スコアは「共有 topics 数」。0 件は関連なしとして除外する（無関係なリンクを出すくらいなら
 *   何も出さない方が回遊の質が高い）。
 * - 同点のタイブレークは 同一 group → addedAt 降順 → slug 昇順 の 3 段で、順序が一意に決まる。
 *   決定論的でないと、無関係なページ追加で全ページの関連リンクが揺れ SSG 出力が不安定になる。
 * - 手書きの関連リンク表は持たない。registry に登録すれば自動で相互リンクされる。
 */

import { findBySlug, type PageEntry, pageRegistry } from "./page-registry";

/** 1 ページあたりの既定の関連リンク数。 */
export const DEFAULT_LIMIT = 3;

/**
 * Finds the pages most closely related to a given page by shared topics.
 *
 * Ranking: shared-topic count (desc) → same group first → `addedAt` (desc) → `slug` (asc).
 * Pages sharing no topic are excluded, so a page with empty `topics` gets no results.
 *
 * @param slug - Route path of the source page
 * @param limit - Maximum number of related pages to return
 * @param pool - Entries to rank against; defaults to the full registry (injectable for tests)
 * @returns Related entries, best match first; empty when the page is unregistered or has no overlap
 */
export function relatedEntries(
  slug: string,
  limit: number = DEFAULT_LIMIT,
  pool: readonly PageEntry[] = pageRegistry
): PageEntry[] {
  const source = pool === pageRegistry ? findBySlug(slug) : pool.find((e) => e.slug === slug);
  if (!source || source.topics.length === 0) return [];

  const sourceTopics = new Set(source.topics);

  return pool
    .filter((e) => e.slug !== source.slug)
    .map((entry) => ({
      entry,
      shared: entry.topics.filter((t) => sourceTopics.has(t)).length,
      sameGroup: entry.group === source.group ? 1 : 0,
    }))
    .filter((c) => c.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.sameGroup - a.sameGroup ||
        b.entry.addedAt.localeCompare(a.entry.addedAt) ||
        a.entry.slug.localeCompare(b.entry.slug)
    )
    .slice(0, limit)
    .map((c) => c.entry);
}
