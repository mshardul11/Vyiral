import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { getServerLocale } from "@/i18n/server";

/** Covers Hindi, Marathi, etc.; other scripts use OS fallbacks in the font stack */
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vyiral — YouTube Creator Growth",
    template: "%s | Vyiral",
  },
  description:
    "Premium creator analytics: keyword research, AI optimization, channel audits, and competitor insights.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} min-h-screen font-sans antialiased`}
      >
        <AppProviders initialLocale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
}
