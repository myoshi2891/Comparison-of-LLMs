import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { jetbrainsMono, notoSansJp, syne } from "@/lib/fonts";
import "./globals.css";

export { metadata, viewport } from "@/lib/metadata";

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
