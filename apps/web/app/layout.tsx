import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import { publicEnv } from "@/lib/env/public";

import "./globals.css";

const displayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: "Scalzo Studio",
  description:
    "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
