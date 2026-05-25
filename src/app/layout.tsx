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

export const metadata: Metadata = {
  title: {
    default: "Vyiral — YouTube Creator Growth",
    template: "%s | Vyiral",
  },
  description:
    "Premium creator analytics: keyword research, AI optimization, channel audits, and competitor insights.",
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
