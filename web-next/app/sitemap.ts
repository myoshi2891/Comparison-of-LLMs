import type { MetadataRoute } from "next";

import { pageRegistry } from "@/lib/page-registry";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const SITE_URL = resolveSiteUrl("sitemap.ts");

/**
 * Generate sitemap entries from the page registry (plans/006 §2.3 の F-1c)。
 *
 * ハードコードのルート一覧は 24 件で止まり実ルート 55 と乖離していたため、
 * lib/page-registry.ts を唯一の導出元にする。新規ページは registry 登録だけで
 * sitemap に載る（登録漏れは tests/page-registry-coverage.test.ts が検知する）。
 *
 * `lastModified` にはページの `lastReviewed`（人間が内容を確認した日）を使う。
 * ビルド日時ではなく実際の確認日を出すことで、クローラーに正しい鮮度を伝える。
 *
 * @returns 各エントリが url / lastModified / changeFrequency / priority を持つ sitemap 配列
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return pageRegistry.map((page) => {
    const isRoot = page.slug === "/";
    return {
      url: isRoot ? `${SITE_URL}/` : `${SITE_URL}${page.slug}`,
      lastModified: page.lastReviewed,
      changeFrequency: isRoot ? ("weekly" as const) : ("monthly" as const),
      priority: isRoot ? 1.0 : 0.8,
    };
  });
}
