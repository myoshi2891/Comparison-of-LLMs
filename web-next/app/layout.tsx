import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";
import { PageFreshness } from "@/components/site/PageFreshness";
import { RelatedPages } from "@/components/site/RelatedPages";
import { SiteHeader } from "@/components/site/SiteHeader";
import { jetbrainsMono, syne } from "@/lib/fonts";
import { notoSansJpPreloadHrefs } from "@/lib/noto-sans-jp-preload";
import "./globals.css";

export { metadata, viewport } from "@/lib/metadata";

/**
 * Root layout component that renders the application's top-level HTML structure with Japanese language and global font variables applied.
 *
 * @param children - The React nodes to render inside the document body.
 * @returns A React element containing an `<html lang="ja">` element with the configured font variable classes and a `<body>` wrapping `children`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body className="has-common-header">
        {/* Noto Sans JP は自前ホスト。React 19 が precedence 付き stylesheet を
            <head> へ巻き上げる (next/font と違いビルド時の外部取得が起きない)。 */}
        {notoSansJpPreloadHrefs.map((href) => (
          <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="" />
        ))}
        <link rel="stylesheet" href="/fonts/noto-sans-jp.css" precedence="default" />
        <SiteHeader />
        <DisclaimerBanner />
        <PageFreshness />
        {children}
        <RelatedPages />
      </body>
    </html>
  );
}
