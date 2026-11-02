/**
 * next/font/local 経由でリポジトリ内のフォントを配信する設定。
 *
 * 移行元: web/src/index.css の
 *   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP...')
 *
 * 方針:
 * - JetBrains Mono / Syne の可変フォントとOFLを public/fonts/latin/ に保存。
 *   Google Fonts取得経路のTurbopack解決エラーを避け、ビルド時も外部取得しない。
 *   出典は同ディレクトリのREADME.mdを参照。
 * - ただし Noto Sans JP はここでは扱わない。next/font/google は
 *   @font-face を全件ビルド時にダウンロードするため、CJK を 124 分割 ×
 *   4 weight = 496 本取得することになり、CI (Netlify) のビルドで
 *   fonts.gstatic.com への取得が失敗していた。woff2 と @font-face CSS を
 *   リポジトリへ vendor し (scripts/vendor-noto-sans-jp.ts →
 *   public/fonts/noto-sans-jp.css)、--font-sans は globals.css の :root で
 *   定義する。ここに残す2フォントもローカルファイルを使用する。
 * - CSS 側では font-family: var(--font-sans) の形で参照するため、
 *   各フォントに variable を明示する。
 * - display: "swap" を指定して FOIT を回避 (日本語テキストが
 *   長時間凍結するのを防ぐ)。
 */

import localFont from "next/font/local";

export const jetbrainsMono = localFont({
  src: "../public/fonts/latin/JetBrainsMono-Variable.woff2",
  variable: "--font-mono",
  weight: "300 700",
  display: "swap",
});

export const syne = localFont({
  src: "../public/fonts/latin/Syne-Variable.woff2",
  variable: "--font-display",
  weight: "400 800",
  display: "swap",
});
