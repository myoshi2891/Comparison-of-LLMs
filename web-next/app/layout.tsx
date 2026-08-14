import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";
import { PageFreshness } from "@/components/site/PageFreshness";
import { RelatedPages } from "@/components/site/RelatedPages";
import { SiteHeader } from "@/components/site/SiteHeader";
import { jetbrainsMono, syne } from "@/lib/fonts";
import { notoSansJpPreloadHrefs } from "@/lib/noto-sans-jp-preload";
import "./globals.css";

export { metadata, viewport } from "@/lib/metadata";

/**
 * Renders the application's root document with Japanese language settings, global fonts, shared site elements, and page content.
 *
 * @param children - The page content rendered between the freshness indicator and related pages.
 * @returns The root HTML document containing the shared layout and page content.
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
