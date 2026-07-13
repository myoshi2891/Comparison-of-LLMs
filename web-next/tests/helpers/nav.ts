/**
 * ナビ木を走査するテスト用ヘルパー（F-4' / plans/008）。
 *
 * ナビは Providers のみ 2 段ネストするため、木の深さは
 * トップレベル → カテゴリ → ページ の最大 3 段で固定。
 * 各テストが `"children" in link` を書き散らすのを防ぐために集約する。
 */
import { isNavLeaf, type NavLeaf, type NavLink } from "@/components/site/nav-links";

/** ナビ木のすべてのリーフ href を出現順（＝表示順）に集める。 */
export function collectNavHrefs(links: readonly NavLink[]): string[] {
  return collectNavLeaves(links).map((leaf) => leaf.href);
}

/** ナビ木のすべてのリーフを出現順に集める。 */
export function collectNavLeaves(links: readonly NavLink[]): NavLeaf[] {
  const leaves: NavLeaf[] = [];
  for (const link of links) {
    if (isNavLeaf(link)) {
      leaves.push(link);
      continue;
    }
    for (const child of link.children) {
      if (isNavLeaf(child)) {
        leaves.push(child);
        continue;
      }
      leaves.push(...child.children);
    }
  }
  return leaves;
}

/** 指定 href のリーフを深さに関係なく探す。 */
export function findNavLeaf(links: readonly NavLink[], href: string): NavLeaf | undefined {
  return collectNavLeaves(links).find((leaf) => leaf.href === href);
}
