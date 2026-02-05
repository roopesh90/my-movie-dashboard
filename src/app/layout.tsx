import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Attribution from "@/components/Attribution";
import CacheCleanup from "@/components/CacheCleanup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_OWNER = process.env.NEXT_PUBLIC_SITE_OWNER || 'My';

export const metadata: Metadata = {
  title: `🎬 ${SITE_OWNER}'s Movie Archive`,
  description: "A personal collection of movies I've watched and loved (or not). Browse by category to see what I recommend.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen`}
      >
        <CacheCleanup />
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Attribution />
      </body>
    </html>
  );
}
