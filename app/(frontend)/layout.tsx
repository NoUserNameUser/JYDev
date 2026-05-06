import type { Metadata } from "next";
import type { ReactNode } from "react";

import { buildHomeMetadata } from "@/lib/seo";

import "../globals.css";

export const metadata: Metadata = {
  ...buildHomeMetadata(),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
