/**
 * F-3' RSS フィード（plans/009）— page-registry から導出する更新購読用フィード。
 *
 * 設計判断:
 * - Route Handler + `dynamic = "force-static"` により `output: 'export'` でもビルド時に
 *   1 回だけ評価され、`out/rss.xml` として静的配信される（sitemap.ts と同じ静的化戦略）。
 * - registry が SSoT。新規ページを registry に登録すれば自動でフィードに載る（追加作業なし）。
 * - XML エスケープは自前の純粋関数。summary に `&` 等が入るとフィードが壊れるため必須。
 */

import { byAddedAtDesc } from "@/lib/page-registry";
import { resolveSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/** フィードに載せる最大件数（新着 20 件）。 */
export const MAX_ITEMS = 20;

const SITE_URL = resolveSiteUrl("rss.xml/route.ts");

/**
 * Escapes the five characters reserved in XML.
 *
 * `&` must be replaced first, otherwise the ampersands introduced by the other
 * replacements would be escaped twice.
 *
 * @param value - Raw text that may contain XML-reserved characters
 * @returns The text with `& < > " '` replaced by their entity references
 */
export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Converts a `YYYY-MM-DD` date to the RFC 822 form required by RSS 2.0.
 *
 * @param isoDate - Date in `YYYY-MM-DD` form (registry guarantees this shape)
 * @returns e.g. `Sat, 11 Jul 2026 00:00:00 GMT`
 */
function toRfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

function absoluteUrl(slug: string): string {
  return slug === "/" ? `${SITE_URL}/` : `${SITE_URL}${slug}`;
}

/**
 * Serves the site feed as RSS 2.0, listing the newest registry pages first.
 *
 * @returns A static `Response` containing the RSS document
 */
export function GET(): Response {
  const items = byAddedAtDesc(MAX_ITEMS)
    .map((entry) => {
      const url = absoluteUrl(entry.slug);
      return [
        "    <item>",
        `      <title>${escapeXml(entry.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <description>${escapeXml(entry.summary)}</description>`,
        `      <pubDate>${toRfc822(entry.addedAt)}</pubDate>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml("AI Cost Simulator — 更新情報")}</title>`,
    `    <link>${escapeXml(`${SITE_URL}/`)}</link>`,
    `    <description>${escapeXml("AI ツール導入ガイドとコスト計算機の新着・更新フィード。")}</description>`,
    "    <language>ja</language>",
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
