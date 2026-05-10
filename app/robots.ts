import type { MetadataRoute } from "next";

import { getGlobalSettings, getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getGlobalSettings();
  const siteUrl = getSiteUrl(settings);

  return {
    rules: settings?.defaultSeo?.noIndex
      ? {
          userAgent: "*",
          disallow: "/",
        }
      : {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/api", "/cms", "/graphql", "/graphql-playground"],
        },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
