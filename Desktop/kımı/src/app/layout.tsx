import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import ScrollProgressBar from "@/components/effects/ScrollProgressBar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Azveb Media | Rəqəmsal Marketinq Agentliyi",
  description: "Brendinizi böyüdən, transformasiya edən və önə çıxaran strateji rəqəmsal marketinq həlləri.",
  keywords: ["rəqəmsal marketinq", "sosial media", "SEO", "reklam", "brend strategiyası", "veb dizayn"],
  authors: [{ name: "Azveb Media" }],
  openGraph: {
    title: "Azveb Media | Rəqəmsal Marketinq Agentliyi",
    description: "Strateji rəqəmsal marketinq həlləri",
    type: "website",
    locale: "az_AZ",
    siteName: "Azveb Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azveb Media",
    description: "Rəqəmsal Marketinq Agentliyi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import ResourcePreloader from "@/components/effects/ResourcePreloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={geist.variable}>
      <head>
        {/* Preconnect to external asset origins for instant rendering */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen antialiased">
        <ResourcePreloader />
        <ScrollProgressBar />
        {children}
      </body>
    </html>
  );
}

