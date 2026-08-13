/**
 * 自動生成ファイル — 直接編集しない。
 * 生成: cd web-next && bun scripts/vendor-noto-sans-jp.ts
 *
 * next/font/google の `subsets: ["latin"]` は latin slice を preload する挙動だった。
 * 自前ホストでも同じ体感速度を保つため、latin slice だけを preload する。
 * CJK slice は元々 preload 対象外 (合計数百 KB になるため)。
 */

export const notoSansJpPreloadHrefs = [
  "/fonts/noto-sans-jp/f-F62fjtqLzI2JPCgQBnw7HFYwQgP-FVthw.woff2",
] as const;
