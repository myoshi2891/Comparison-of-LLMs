/**
 * next/font/google 経由で self-host するフォント設定。
 *
 * 移行元: web/src/index.css の
 *   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP...')
 *
 * 方針:
 * - Google CDN へのランタイム fetch を廃止し、ビルド時に self-host する。
 *   next/font/google が Vercel 配下のフォント配信ではなく、
 *   Next.js プロジェクト内に埋め込む形で配信するため、CLS 防止と
 *   プライバシー (CDN への外部リクエスト排除) を同時に満たす。
 * - ただし Noto Sans JP はここでは扱わない。next/font/google は
 *   @font-face を全件ビルド時にダウンロードするため、CJK を 124 分割 ×
 *   4 weight = 496 本取得することになり、CI (Netlify) のビルドで
 *   fonts.gstatic.com への取得が失敗していた。woff2 と @font-face CSS を
 *   リポジトリへ vendor し (scripts/vendor-noto-sans-jp.ts →
 *   public/fonts/noto-sans-jp.css)、--font-sans は globals.css の :root で
 *   定義する。ここに残すのは latin のみで完結する 2 フォント。
 * - CSS 側では font-family: var(--font-sans) の形で参照するため、
 *   各フォントに variable を明示する。
 * - display: "swap" を指定して FOIT を回避 (日本語テキストが
 *   長時間凍結するのを防ぐ)。
 */

import { JetBrains_Mono, Syne } from "next/font/google";

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});
