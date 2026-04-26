import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { jetbrainsMono, notoSansJp, syne } from "@/lib/fonts";
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
    <html lang="ja" className={`${notoSansJp.variable} ${jetbrainsMono.variable} ${syne.variable}`}>
      <body className="has-common-header">
        <SiteHeader />
        <DisclaimerBanner />
        {children}
      </body>
    </html>
  );
}
