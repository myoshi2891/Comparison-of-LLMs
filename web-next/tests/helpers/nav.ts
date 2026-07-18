/**
 * ナビ木を走査するテスト用ヘルパー（F-4' / plans/008）。
 *
 * ナビは Providers のみ 2 段ネストするため、木の深さは
 * トップレベル → カテゴリ → ページ の最大 3 段で固定。
 * 各テストが `"children" in link` を書き散らすのを防ぐために集約する。
 */
import { isNavLeaf, type NavLeaf, type NavLink } from "@/components/site/nav-links";

/**
 * Collects the `href` values of all navigation leaves in display order.
 *
 * @returns The leaf `href` values in occurrence order
 */
export function collectNavHrefs(links: readonly NavLink[]): string[] {
  return collectNavLeaves(links).map((leaf) => leaf.href);
}

/**
 * Collects all navigation leaves in their occurrence order.
 *
 * @returns The navigation leaves found in display order
 */
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

/**
 * Finds the first navigation leaf with the specified `href`.
 *
 * @param href - The `href` to search for
 * @returns The matching navigation leaf, or `undefined` if none is found
 */
export function findNavLeaf(links: readonly NavLink[], href: string): NavLeaf | undefined {
  return collectNavLeaves(links).find((leaf) => leaf.href === href);
}
