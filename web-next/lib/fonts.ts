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
 * - CSS 側では font-family: var(--font-sans) の形で参照するため、
 *   各フォントに variable を明示する。
 * - display: "swap" を指定して FOIT を回避 (日本語テキストが
 *   長時間凍結するのを防ぐ)。
 */

import { JetBrains_Mono, Noto_Sans_JP, Syne } from "next/font/google";

export const notoSansJp = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

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
