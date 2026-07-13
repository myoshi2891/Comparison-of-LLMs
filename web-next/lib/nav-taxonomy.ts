/**
 * ナビの分類体系と並び順 — plans/008（F-4' / STATE-06 対応）。
 *
 * page-registry.ts が「どのページがどのグループか」を持つのに対し、本ファイルは
 * 「グループをどの順に、どの深さで見せるか」だけを持つ。registry のエントリは
 * slug 昇順に並んでおり、表示順を表現できないため、順序の SSoT はここ。
 *
 * 設計判断:
 * - 2 段ネストは Providers のみ。他グループは最大 9 リンクで 1 段に収まる。全グループを
 *   2 段にすると CI/CD・Git Worktree・RAG のような 1 ページのカテゴリで 3 段ホバーが生まれ、
 *   STATE-06 が指摘した「1 リンクのみのカテゴリ」問題が階層を変えて再発する。
 * - グループを新設するときは NAV_GROUPS に足す（配列の位置がそのまま表示順になる）。
 */

/** ナビのトップレベル。配列の順序がそのまま表示順。 */
export const NAV_GROUPS = [
  "Home",
  "Providers",
  "Agent 開発",
  "開発プロセス",
  "運用・品質",
  "モデル・データ",
  "What's New",
] as const;

export type NavGroup = (typeof NAV_GROUPS)[number];

/** ドロップダウンを作らず単独リンクにするグループ（それぞれ 1 ページしか持たない）。 */
export const FLAT_GROUPS = ["Home", "What's New"] as const satisfies readonly NavGroup[];

/** 2 段ネスト（グループ → カテゴリ → ページ）するグループ。 */
export const NESTED_GROUPS = ["Providers"] as const satisfies readonly NavGroup[];

/** ネストするグループの 2 段目の並び順。ここに無いカテゴリは導出時に throw される。 */
export const CATEGORY_ORDER: Partial<Record<NavGroup, readonly string[]>> = {
  Providers: ["Claude", "Google", "Codex", "Copilot"],
};

export function isFlatGroup(group: NavGroup): boolean {
  return (FLAT_GROUPS as readonly NavGroup[]).includes(group);
}

export function isNestedGroup(group: NavGroup): boolean {
  return (NESTED_GROUPS as readonly NavGroup[]).includes(group);
}
