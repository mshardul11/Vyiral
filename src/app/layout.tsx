import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import {
  getFirebasePublicConfig,
  isFirebasePublicConfigValid,
} from "@/lib/auth/client-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vyiral.com";

export const metadata: Metadata = {
  title: {
    default: "Vyiral — YouTube Creator Operating System",
    template: "%s — Vyiral",
  },
  description:
    "The enterprise creator intelligence platform. AI-powered analytics, SEO optimization, trend discovery, content calendar, and channel growth tools for serious YouTube creators.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: "Vyiral",
    title: "Vyiral — YouTube Creator Operating System",
    description:
      "Enterprise analytics, AI SEO tools, trend discovery, and content calendar for YouTube creators.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyiral — YouTube Creator Operating System",
    description: "AI-powered analytics and SEO tools for YouTube creators.",
  },
  keywords: [
    "youtube seo",
    "youtube analytics",
    "creator tools",
    "youtube keyword research",
    "channel growth",
    "youtube ai tools",
    "content calendar",
    "youtube optimization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const firebaseConfig = getFirebasePublicConfig();
  const firebaseConfigured = isFirebasePublicConfigValid(firebaseConfig);

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
        style={{
          backgroundImage:
            "radial-gradient(at 40% 20%, hsl(262 83% 58% / 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(292 84% 61% / 0.1) 0px, transparent 50%)",
        }}
      >
        <AppProviders
          firebaseConfig={firebaseConfig}
          firebaseConfigured={firebaseConfigured}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
