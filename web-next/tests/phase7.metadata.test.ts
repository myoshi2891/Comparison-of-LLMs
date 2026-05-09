/**
 * Phase 7 契約テスト (Layout + Metadata API)。
 *
 * 検証方針:
 * - `lib/metadata.ts` は next/font を import しないので、vitest から
 *   直接 import しても Phase 6 のような loader クラッシュは起きない。
 *   → 型付きオブジェクトを実際に import し、Metadata / Viewport の
 *     フィールドを構造的にアサートする（Phase 6 の文字列 contract より強い）。
 * - `app/layout.tsx` は `@/lib/fonts` 経由で next/font を触るため、
 *   依然として vitest から import すると loader がクラッシュする。
 *   そちらは Phase 6 と同じ readFileSync 戦略で re-export パターンを検証する。
 * - metadata のテキストソースは `lib/i18n.tsx` の `t()` と同一参照であることを
 *   パリティテストで強制 → UI と metadata が将来乖離するのを静的に防ぐ。
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata, Viewport } from "next";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { T, t } from "@/lib/i18n";

const repoRoot = join(__dirname, "..");

let layoutTsx = "";
let metadata!: Metadata;
let viewport!: Viewport;

beforeAll(async () => {
  layoutTsx = readFileSync(join(repoRoot, "app/layout.tsx"), "utf8");
  // NEXT_PUBLIC_SITE_URL を確定値に固定してから動的 import する。
  // 静的 import だとモジュール評価時の env に依存し metadataBase の
  // https アサートが flaky になるため、vi.resetModules() で
  // キャッシュを破棄してから再ロードする。
  process.env.NEXT_PUBLIC_SITE_URL = "https://comparison-of-llms.netlify.app";
  vi.resetModules();
  const mod = await import("@/lib/metadata");
  metadata = mod.metadata;
  viewport = mod.viewport;
});

describe("Phase 7 - metadata.title", () => {
  it("defines title as a template object (not a bare string)", () => {
    expect(typeof metadata.title).toBe("object");
    expect(metadata.title).not.toBeNull();
  });

  it("uses t('heroTitle', 'ja') as the default title", () => {
    const title = metadata.title as { default: string; template: string };
    expect(title.default).toBe(t("heroTitle", "ja"));
    expect(title.default).toBe("AIモデル 時間別コスト 計算機");
  });

  it("uses a brand suffix template for child segments", () => {
    const title = metadata.title as { default: string; template: string };
    expect(title.template).toContain("%s");
    expect(title.template).toContain("AI Cost Simulator");
  });
});

describe("Phase 7 - metadata.description", () => {
  it("sources description from t('heroDesc', 'ja') for UI/SEO parity", () => {
    expect(metadata.description).toBe(t("heroDesc", "ja"));
  });

  it("is the full Japanese hero description (not the legacy short blurb)", () => {
    // Phase 6 まで使っていた "AIモデル時間別コスト計算機 (USD/JPY)" は撤去される
    expect(metadata.description).not.toBe("AIモデル時間別コスト計算機 (USD/JPY)");
    expect(metadata.description).toContain("使用トークン量");
  });
});

describe("Phase 7 - metadata.metadataBase", () => {
  it("is a URL instance so openGraph relative paths resolve", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it("has an https origin", () => {
    const base = metadata.metadataBase as URL;
    expect(base.protocol).toBe("https:");
    expect(base.host.length).toBeGreaterThan(0);
  });
});

describe("Phase 7 - metadata.applicationName", () => {
  it("is the brand name", () => {
    expect(metadata.applicationName).toBe("AI Cost Simulator");
  });
});

describe("Phase 7 - metadata.alternates", () => {
  it("defines canonical as root path", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });

  it("declares both ja-JP and en-US hreflang languages", () => {
    const languages = metadata.alternates?.languages;
    expect(languages).toBeDefined();
    const langMap = languages as Record<string, string>;
    expect(langMap["ja-JP"]).toBeDefined();
    expect(langMap["en-US"]).toBeDefined();
  });
});

describe("Phase 7 - metadata.openGraph", () => {
  // OpenGraph は type プロパティで判別される union 型。構造アサートを
  // 型安全に書くためにテスト局所で loose 型へキャストする。
  type LooseOg = {
    type?: string;
    siteName?: string;
    locale?: string;
    alternateLocale?: string[];
    title?: string;
    description?: string;
    url?: string;
  };
  // describe スコープのトップレベルはテスト収集フェーズで実行されるため
  // beforeAll より前に動く。outer beforeAll で metadata を代入した後に
  // 参照するよう、ネストした beforeAll で og を初期化する。
  let og!: LooseOg;
  beforeAll(() => {
    og = metadata.openGraph as LooseOg;
  });

  it("declares website type and brand siteName", () => {
    expect(og.type).toBe("website");
    expect(og.siteName).toBe("AI Cost Simulator");
  });

  it("uses ja_JP as primary locale with en_US alternate", () => {
    expect(og.locale).toBe("ja_JP");
    expect(og.alternateLocale).toContain("en_US");
  });

  it("mirrors title & description from i18n for og:title / og:description", () => {
    expect(og.title).toBe(t("heroTitle", "ja"));
    expect(og.description).toBe(t("heroDesc", "ja"));
  });

  it("defines a root-relative url so metadataBase resolves it", () => {
    expect(og.url).toBe("/");
  });
});

describe("Phase 7 - viewport theme", () => {
  it("matches globals.css --bg token (#05080f) for theme-color meta", () => {
    expect(viewport.themeColor).toBe("#05080f");
  });

  it("declares dark color-scheme to match the app's dark palette", () => {
    expect(viewport.colorScheme).toBe("dark");
  });
});

describe("Phase 7 - viewport responsive defaults", () => {
  it("uses device-width as width", () => {
    expect(viewport.width).toBe("device-width");
  });

  it("uses initialScale 1 (legacy index.html parity)", () => {
    expect(viewport.initialScale).toBe(1);
  });
});

describe("Phase 7 - layout.tsx re-export contract", () => {
  it("re-exports metadata and viewport from @/lib/metadata", () => {
    // 許容形式:
    //   export { metadata, viewport } from "@/lib/metadata";
    //   export { viewport, metadata } from "@/lib/metadata";
    expect(layoutTsx).toMatch(
      /export\s*\{\s*[^}]*\bmetadata\b[^}]*\}\s*from\s*["']@\/lib\/metadata["']/
    );
    expect(layoutTsx).toMatch(
      /export\s*\{\s*[^}]*\bviewport\b[^}]*\}\s*from\s*["']@\/lib\/metadata["']/
    );
  });

  it("no longer defines metadata inline", () => {
    // Phase 6 時代の `export const metadata: Metadata = { ... }` を撲滅
    expect(layoutTsx).not.toMatch(/export\s+const\s+metadata\s*:\s*Metadata/);
  });

  it("no longer imports Metadata type directly (moved to lib/metadata)", () => {
    expect(layoutTsx).not.toMatch(
      /import\s+type\s*\{[^}]*\bMetadata\b[^}]*\}\s*from\s*["']next["']/
    );
  });
});

describe("Phase 7 - i18n ⇄ metadata parity", () => {
  it("metadata.title.default is strictly identical to T.heroTitle.text.ja", () => {
    const title = metadata.title as { default: string };
    expect(title.default).toBe(T.heroTitle.text.ja);
  });

  it("metadata.description is strictly identical to T.heroDesc.text.ja", () => {
    expect(metadata.description).toBe(T.heroDesc.text.ja);
  });
});
