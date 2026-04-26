import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Syne } from "next/font/google";

import { Cursor } from "@/components/effects/Cursor";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { homeSeo } from "@/content/pages/home";
import { createMetadata } from "@/lib/metadata";

import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
});

export const metadata: Metadata = createMetadata({
  title: homeSeo.title,
  description: homeSeo.description,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} antialiased`}>
        <SmoothScroll />
        <Cursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
