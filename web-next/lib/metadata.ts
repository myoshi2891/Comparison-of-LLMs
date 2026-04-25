/**
 * サイト全体の Metadata / Viewport 定義。
 *
 * 設計判断:
 * - Next.js 14+ では `themeColor` / `colorScheme` / `viewport` が
 *   `metadata` から剥がされ、別エクスポート `viewport: Viewport` に
 *   移動した。両方を同ファイルでまとめて定義し、layout.tsx から
 *   re-export する。
 * - 静的オブジェクトで定義（`generateMetadata` を使わない）理由:
 *     1. Phase 13 で output:'export' (SSG) を採用予定なのでリクエスト時情報なし
 *     2. JA/EN 切替は URL で分けない単一ページ（ステップ 0 決定事項）
 *     3. Next 公式ドキュメントが「リクエスト時情報に依存しないなら
 *        静的 metadata を使え」と明言
 * - title/description は `lib/i18n` の `t()` 経由で JA キー（`heroTitle`,
 *   `heroDesc`）を参照する。これにより metadata と UI 本文が静的に同期し、
 *   将来 i18n キーが変わっても metadata 側が自動追随する。
 * - このファイルは next/font を一切 import しないため vitest から直接
 *   import 可能。型付き契約テスト（tests/phase7.metadata.test.ts）で
 *   構造をアサートしている。
 */

import type { Metadata, Viewport } from "next";
import { t } from "./i18n";

const DEFAULT_ORIGIN = "https://comparison-of-llms.netlify.app";
const BRAND = "AI Cost Simulator";

/**
 * `metadataBase` 用 URL を環境変数優先で解決する。
 *
 * - 優先: `process.env.NEXT_PUBLIC_SITE_URL`（Netlify のプレビュー URL
 *   など、デプロイ先で動的に書き換えたい場合に使う）
 * - フォールバック: `DEFAULT_ORIGIN`（本番 Netlify URL）
 * - 無効な URL 文字列を env に入れられた場合は throw せずフォールバック。
 *   ビルドを失敗させるより、本番 origin に縮退して生存させる方が安全。
 */
function resolveSiteOrigin(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw && raw.length > 0) {
    try {
      const url = new URL(raw);
      if ((url.protocol === "http:" || url.protocol === "https:") && url.host.length > 0) {
        return url;
      }
    } catch {
      // 無効 URL はフォールバックへ。
    }
  }
  return new URL(DEFAULT_ORIGIN);
}

const heroTitleJa = t("heroTitle", "ja");
const heroDescJa = t("heroDesc", "ja");

export const metadata: Metadata = {
  metadataBase: resolveSiteOrigin(),
  title: {
    default: heroTitleJa,
    template: `%s | ${BRAND}`,
  },
  description: heroDescJa,
  applicationName: BRAND,
  alternates: {
    canonical: "/",
    languages: {
      "ja-JP": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: BRAND,
    title: heroTitleJa,
    description: heroDescJa,
    locale: "ja_JP",
    alternateLocale: ["en_US"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05080f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
