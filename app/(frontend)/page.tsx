import type { Metadata } from "next";

import { PoezaCanvas } from "@/features/grid-canvas";
import { listGridSections } from "@/lib/gridCms";
import { buildHomeMetadata, buildHomeStructuredData, getGlobalSettings } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  return buildHomeMetadata(settings);
}

export default async function HomePage() {
  const [settings, sections] = await Promise.all([
    getGlobalSettings(),
    listGridSections().catch(() => []),
  ]);
  const structuredData = buildHomeStructuredData(settings, sections);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PoezaCanvas initialSections={sections} />
    </>
  );
}
