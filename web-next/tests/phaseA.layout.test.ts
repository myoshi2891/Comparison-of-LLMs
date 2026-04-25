// Phase A [Red] contract test. Expected to FAIL until Green phase
// wires SiteHeader and DisclaimerBanner into app/layout.tsx.

/**
 * Phase A 契約テスト (app/layout.tsx への共通ヘッダー統合)。
 *
 * 戦略:
 * - next/font の loader は vitest で直接 import するとクラッシュするため、
 *   Phase 6/7 と同じ readFileSync 静的文字列検査で契約を固定する。
 *
 * 固定する契約:
 * - layout.tsx が `@/components/site/SiteHeader` と
 *   `@/components/site/DisclaimerBanner` を import している。
 * - `<body>` 内で children より前に SiteHeader / DisclaimerBanner が
 *   描画される (legacy body 冒頭挿入の互換)。
 * - `<body>` に `className="has-common-header"` が付与される
 *   (legacy common-header.js:331 のクラス名を継承)。
 * - 既存の next/font 変数注入 (notoSansJp / jetbrainsMono / syne) は
 *   破壊されない。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const layoutPath = join(__dirname, "..", "app/layout.tsx");
const layoutSrc = readFileSync(layoutPath, "utf8");

describe("Phase A - layout imports", () => {
  it("imports SiteHeader from @/components/site/SiteHeader", () => {
    expect(layoutSrc).toMatch(
      /import\s*\{\s*SiteHeader\s*\}\s*from\s*["']@\/components\/site\/SiteHeader["']/
    );
  });

  it("imports DisclaimerBanner from @/components/site/DisclaimerBanner", () => {
    expect(layoutSrc).toMatch(
      /import\s*\{\s*DisclaimerBanner\s*\}\s*from\s*["']@\/components\/site\/DisclaimerBanner["']/
    );
  });
});

describe("Phase A - body composition", () => {
  it("renders <SiteHeader /> before {children}", () => {
    const siteHeaderIdx = layoutSrc.indexOf("<SiteHeader");
    const childrenIdx = layoutSrc.indexOf("{children}");
    expect(siteHeaderIdx).toBeGreaterThan(-1);
    expect(childrenIdx).toBeGreaterThan(-1);
    expect(siteHeaderIdx).toBeLessThan(childrenIdx);
  });

  it("renders <DisclaimerBanner /> before {children}", () => {
    const bannerIdx = layoutSrc.indexOf("<DisclaimerBanner");
    const childrenIdx = layoutSrc.indexOf("{children}");
    expect(bannerIdx).toBeGreaterThan(-1);
    expect(bannerIdx).toBeLessThan(childrenIdx);
  });

  it("assigns has-common-header class to <body>", () => {
    // `<body className="has-common-header">` もしくは template literal 内含有を許容
    expect(layoutSrc).toMatch(/<body[^>]*className=[^>]*has-common-header/);
  });
});

describe("Phase A - regression guards", () => {
  it("still imports the three next/font variables from @/lib/fonts", () => {
    expect(layoutSrc).toMatch(
      /import\s*\{[^}]*\bnotoSansJp\b[^}]*\}\s*from\s*["']@\/lib\/fonts["']/
    );
    expect(layoutSrc).toMatch(/\bjetbrainsMono\b/);
    expect(layoutSrc).toMatch(/\bsyne\b/);
  });
});
