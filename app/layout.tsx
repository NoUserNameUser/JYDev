import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jackie Ye — Full Stack Developer",
  description:
    "Full stack developer building digital products from idea to deployment. Every encounter is meaningful.",
  openGraph: {
    title: "Jackie Ye — Full Stack Developer",
    description:
      "Full stack developer based in Asia-Pacific. I listen, plan precisely, and build the most direct path to your vision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
