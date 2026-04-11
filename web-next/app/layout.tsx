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
      <body>{children}</body>
    </html>
  );
}
