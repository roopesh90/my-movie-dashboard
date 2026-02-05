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

export const metadata: Metadata = {
  title: "Movie Archive - Personal Collection",
  description: "My personal movie archive and recommendations",
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
