import type { Metadata } from "next";
import { jetbrainsMono, notoSansJp, syne } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cost Simulator",
  description: "AIモデル時間別コスト計算機 (USD/JPY)",
};

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
