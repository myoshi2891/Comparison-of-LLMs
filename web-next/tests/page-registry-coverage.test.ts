/**
 * クロスカット契約テスト: app/**\/page.tsx と lib/page-registry.ts の双方向一致を機械検証する。
 *
 * plans/006 §2.3 が要求する「全 page.tsx が registry に登録済み」を保証し、
 * 新規ページ追加時の registry 更新漏れ（= 鮮度表示・What's New・sitemap からの脱落）を防ぐ。
 * 既存の静的検査テスト（tests/phase10.page.test.ts）と同じく node:fs でソースを直接走査する。
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_GROUPS } from "@/lib/nav-taxonomy";
import { pageRegistry } from "@/lib/page-registry";

const APP_DIR = join(__dirname, "../app");

function collectPageSlugs(dir: string, base = ""): string[] {
  const slugs: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      slugs.push(...collectPageSlugs(full, `${base}/${name}`));
    } else if (name === "page.tsx") {
      slugs.push(base === "" ? "/" : base);
    }
  }
  return slugs;
}

const pageSlugs = collectPageSlugs(APP_DIR).sort();
const registrySlugs = pageRegistry.map((e) => e.slug).sort();

describe("page-registry coverage", () => {
  it("app 配下に page.tsx が 1 件以上存在する（走査の健全性）", () => {
    expect(pageSlugs.length).toBeGreaterThan(50);
  });

  it("全 page.tsx が registry に登録されている（登録漏れ検知）", () => {
    const missing = pageSlugs.filter((s) => !registrySlugs.includes(s));
    expect(missing).toEqual([]);
  });

  it("registry の全 slug に対応する page.tsx が存在する（幽霊エントリ検知）", () => {
    const ghosts = registrySlugs.filter((s) => !pageSlugs.includes(s));
    expect(ghosts).toEqual([]);
  });

  it("registry の各 slug が実ファイルへ解決できる", () => {
    for (const slug of registrySlugs) {
      const file = slug === "/" ? join(APP_DIR, "page.tsx") : join(APP_DIR, slug, "page.tsx");
      expect(existsSync(file), `missing page.tsx for ${slug}`).toBe(true);
    }
  });
});

// F-4'（plans/008）: ナビは registry から導出されるため、group / category の
// 不備はそのままナビの欠落になる。ビルドを待たずにここで検知する。
describe("page-registry nav metadata", () => {
  it("全エントリの group が NAV_GROUPS のいずれか", () => {
    const invalid = pageRegistry
      .filter((e) => !NAV_GROUPS.includes(e.group))
      .map((e) => `${e.slug}: ${e.group}`);
    expect(invalid).toEqual([]);
  });

  it("Providers 配下の全エントリが category を持つ（2 段目ラベル）", () => {
    const missing = pageRegistry
      .filter((e) => e.group === "Providers" && !e.category)
      .map((e) => e.slug);
    expect(missing).toEqual([]);
  });

  it("Providers 以外は category を持たない（未使用フィールドの混入防止）", () => {
    const stray = pageRegistry
      .filter((e) => e.group !== "Providers" && e.category)
      .map((e) => e.slug);
    expect(stray).toEqual([]);
  });
});
