import { z } from "zod";
import {
  CATEGORY_ORDER,
  isFlatGroup,
  isNestedGroup,
  NAV_GROUPS,
  type NavGroup,
} from "@/lib/nav-taxonomy";
import { type PageEntry, pageRegistry } from "@/lib/page-registry";

/**
 * ナビゲーションデータ — page-registry.ts から導出する（plans/008 / F-4'）。
 *
 * 以前は 18 項目・170 行の手書きデータだったが、registry と二重管理になり、
 * ページを足してもナビに載らない事故が検知できなかった。現在はナビを registry の
 * 導出結果とし、tests/nav-derivation.test.ts が両者の全単射を機械検証する。
 *
 * 木の深さは最大 3 段（グループ → カテゴリ → ページ）。カテゴリ層を持つのは
 * Providers だけで、他グループはリーフを直接ぶら下げる（lib/nav-taxonomy.ts 参照）。
 */

/**
 * href バリデーション: clean URL のみ許可、javascript: やプロトコル相対 URL を拒否。
 * legacy/shared/common-header.js:94-104 の isSafeHref 相当を Zod スキーマに内包した形。
 */
const hrefSchema = z
  .string()
  .min(1)
  .refine((href) => {
    if (href.startsWith("//")) return false;
    if (!href.startsWith("/")) return false;
    if (href.includes("javascript:")) return false;
    return true;
  }, "href must be an absolute path starting with /");

const LeafSchema = z.object({
  name: z.string().min(1),
  href: hrefSchema,
});

/** ドロップダウン内の 2 段目（Providers ▸ Claude など）。リーフのみを持つ。 */
const SubGroupSchema = z.object({
  name: z.string().min(1),
  children: z.array(LeafSchema).min(1),
});

/** トップレベルのドロップダウン。子はリーフとサブグループの混在を許す。 */
const DropdownSchema = z.object({
  name: z.string().min(1),
  children: z.array(z.union([LeafSchema, SubGroupSchema])).min(1),
});

export const NavLinkSchema = z.union([LeafSchema, DropdownSchema]);

export type NavLeaf = z.infer<typeof LeafSchema>;
export type NavSubGroup = z.infer<typeof SubGroupSchema>;
export type NavDropdown = z.infer<typeof DropdownSchema>;
/** ドロップダウンの子になれるもの。 */
export type NavNode = NavLeaf | NavSubGroup;
export type NavLink = NavLeaf | NavDropdown;

export function isNavLeaf<T extends { name: string }>(node: T): node is T & NavLeaf {
  return "href" in node;
}

export function isNavSubGroup<T extends { name: string }>(node: T): node is T & NavSubGroup {
  return "children" in node;
}

/** 表示順のキー: addedAt 昇順 → slug 昇順。辞書順ソートが成立する形に組む。 */
function sortKey(entry: PageEntry): string {
  return `${entry.addedAt} ${entry.slug}`;
}

function toLeaf(entry: PageEntry): NavLeaf {
  return { name: entry.title, href: entry.slug };
}

function sortedLeaves(entries: readonly PageEntry[]): NavLeaf[] {
  return [...entries].sort((a, b) => sortKey(a).localeCompare(sortKey(b))).map(toLeaf);
}

/** Providers のようなネストするグループを「カテゴリ → ページ」の 2 段に組む。 */
function buildSubGroups(group: NavGroup, entries: readonly PageEntry[]): NavSubGroup[] {
  const order = CATEGORY_ORDER[group];
  if (!order) {
    throw new Error(`nav: group "${group}" はネスト対象だが CATEGORY_ORDER が未定義`);
  }

  const byCategory = new Map<string, PageEntry[]>();
  for (const entry of entries) {
    // registry の Zod refine が category 必須を保証するが、buildNavLinks は
    // 任意の配列を受け取れるため（テスト・将来の呼び出し）ここでも防御する。
    if (!entry.category) {
      throw new Error(`nav: ${entry.slug} は ${group} 配下だが category が無い`);
    }
    if (!order.includes(entry.category)) {
      throw new Error(
        `nav: ${entry.slug} の category "${entry.category}" が CATEGORY_ORDER.${group} に無い`
      );
    }
    const bucket = byCategory.get(entry.category) ?? [];
    bucket.push(entry);
    byCategory.set(entry.category, bucket);
  }

  return order
    .filter((category) => byCategory.has(category))
    .map((category) => ({
      name: category,
      children: sortedLeaves(byCategory.get(category) ?? []),
    }));
}

/**
 * pageRegistry からナビ木を組む純粋関数。
 *
 * 未知の group や category 欠落は silent drop せず throw する。黙って落とすと
 * ページがナビから消えたまま気付けないため（registry の Zod parse と同じ思想）。
 */
export function buildNavLinks(entries: readonly PageEntry[] = pageRegistry): NavLink[] {
  const byGroup = new Map<NavGroup, PageEntry[]>();

  for (const entry of entries) {
    if (!(NAV_GROUPS as readonly string[]).includes(entry.group)) {
      throw new Error(`nav: ${entry.slug} の group "${entry.group}" は NAV_GROUPS に無い`);
    }
    const bucket = byGroup.get(entry.group) ?? [];
    bucket.push(entry);
    byGroup.set(entry.group, bucket);
  }

  const links: NavLink[] = [];

  for (const group of NAV_GROUPS) {
    const groupEntries = byGroup.get(group);
    if (!groupEntries || groupEntries.length === 0) continue;

    if (isFlatGroup(group)) {
      if (groupEntries.length > 1) {
        throw new Error(
          `nav: フラットグループ "${group}" に ${groupEntries.length} ページある（1 ページのみ想定）`
        );
      }
      links.push(toLeaf(groupEntries[0]));
      continue;
    }

    const children: NavNode[] = isNestedGroup(group)
      ? buildSubGroups(group, groupEntries)
      : sortedLeaves(groupEntries);

    links.push({ name: group, children });
  }

  return links;
}

export const navLinks: readonly NavLink[] = buildNavLinks().map(
  (link) => NavLinkSchema.parse(link) as NavLink
);
