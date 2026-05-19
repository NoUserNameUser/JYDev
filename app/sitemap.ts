import type { MetadataRoute } from "next";

import { getGlobalSettings, getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getGlobalSettings();
  const siteUrl = getSiteUrl(settings);

  return [
    {
      url: siteUrl,
      lastModified: settings?.updatedAt ? new Date(settings.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
