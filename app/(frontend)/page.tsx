import type { Metadata } from "next";

import { LandingPage } from "@/features/landing";
import { buildHomeMetadata, buildHomeStructuredData, getGlobalSettings } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  return buildHomeMetadata(settings);
}

export default async function HomePage() {
  const settings = await getGlobalSettings();
  const structuredData = buildHomeStructuredData(settings);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage settings={settings} />
    </>
  );
}
