import type { Metadata } from "next";

import { homeSeo } from "@/content/pages/home";
import { createMetadata } from "@/lib/metadata";

import "./globals.css";

export const metadata: Metadata = {
  ...createMetadata({
    title: homeSeo.title,
    description: homeSeo.description,
  }),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
