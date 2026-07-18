/**
 * F-3' 契約テスト: /rss.xml が page-registry から導出されることを固定する（plans/009）。
 *
 * RSS は「更新を購読する」導線であり、registry に新しいページを足したら自動で流れることが要件。
 * ここでは XML の構造・件数上限・エスケープ・並び順（addedAt 降順）を固定する。
 */
import { describe, expect, it } from "vitest";
import { GET } from "@/app/rss.xml/route";
import { byAddedAtDesc } from "@/lib/page-registry";
import { escapeXml, MAX_ITEMS } from "@/lib/rss-utils";

describe("F-3' - escapeXml", () => {
  it("XML の予約 5 文字をすべてエスケープする", () => {
    expect(escapeXml(`a & b < c > d " e ' f`)).toBe("a &amp; b &lt; c &gt; d &quot; e &apos; f");
  });

  it("& を二重エスケープしない（先に & を置換する順序であること）", () => {
    expect(escapeXml("<")).toBe("&lt;");
    expect(escapeXml("&amp;")).toBe("&amp;amp;");
  });
});

describe("F-3' - GET /rss.xml", () => {
  it("application/rss+xml を返す", async () => {
    const res = GET();
    expect(res.headers.get("content-type")).toContain("application/rss+xml");
    expect(res.headers.get("content-type")).toContain("charset=utf-8");
  });

  it("XML 宣言と RSS 2.0 のルート要素を含む", async () => {
    const xml = await GET().text();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain("</rss>");
  });

  it("item は最大 20 件（MAX_ITEMS）", async () => {
    const xml = await GET().text();
    const items = xml.match(/<item>/g) ?? [];
    expect(MAX_ITEMS).toBe(20);
    expect(items.length).toBe(Math.min(MAX_ITEMS, byAddedAtDesc().length));
  });

  it("最新 addedAt のページが item として含まれる（registry からの導出）", async () => {
    const xml = await GET().text();
    const newest = byAddedAtDesc(1)[0];
    expect(xml).toContain(`<title>${escapeXml(newest.title)}</title>`);
    expect(xml).toContain(newest.slug);
  });

  it("item は addedAt 降順で並ぶ", async () => {
    const xml = await GET().text();
    const expected = byAddedAtDesc(MAX_ITEMS).map((e) => e.slug);
    const positions = expected.map((slug) => xml.indexOf(`${slug}</link>`));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("pubDate が RFC 822 形式（RSS 2.0 の要求）", async () => {
    const xml = await GET().text();
    const pubDate = xml.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] ?? "";
    expect(pubDate).toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
  });

  it("guid は絶対 URL のパーマリンク", async () => {
    const xml = await GET().text();
    expect(xml).toMatch(/<guid isPermaLink="true">https?:\/\/[^<]+<\/guid>/);
  });

  it("description に生の & を出さない（エスケープ漏れ検知）", async () => {
    const xml = await GET().text();
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });
});
