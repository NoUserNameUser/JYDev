import type { Metadata } from "next";

import { env } from "@/config/env";
import { getPayloadClient } from "@/lib/payload/client";
import type { GlobalSetting, Media } from "@/payload-types";
import type { GridSection } from "@/types/grid";

const FALLBACK_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Jackie Ye";
const FALLBACK_SITE_URL = "http://localhost:3000";
const FALLBACK_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  "DRE-focused full-stack engineer with 6+ years owning Rogers/Cityfone systems, Dockerized automation, CI/CD strategy, observability, CMS optimization, and cloud reliability.";
const DRE_KEYWORDS = [
  "Development Release Engineering",
  "DRE",
  "Full Stack Engineer",
  "Docker",
  "Docker Compose",
  "CI/CD",
  "Observability",
  "CMS optimization",
  "Rogers Communications",
  "Cityfone",
  "Java Spring Boot",
  "Python",
  "AWS",
  "Linux",
];

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function absoluteUrl(pathOrUrl: string, siteUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${trimTrailingSlash(siteUrl)}${path}`;
}

function mediaUrl(media: unknown, siteUrl: string) {
  if (!media || typeof media !== "object") return undefined;
  const url = (media as Media).url;
  return url ? absoluteUrl(url, siteUrl) : undefined;
}

export async function getGlobalSettings(): Promise<GlobalSetting | null> {
  try {
    const payload = await getPayloadClient();
    return await payload.findGlobal({
      slug: "global-settings",
      depth: 1,
      overrideAccess: false,
    });
  } catch {
    return null;
  }
}

export function getSiteUrl(settings?: GlobalSetting | null) {
  return trimTrailingSlash(settings?.siteUrl || env.siteUrl || FALLBACK_SITE_URL);
}

export function buildHomeMetadata(settings?: GlobalSetting | null): Metadata {
  const siteUrl = getSiteUrl(settings);
  const seo = settings?.defaultSeo;
  const title = seo?.metaTitle || seo?.ogTitle || settings?.siteName || FALLBACK_SITE_NAME;
  const description = seo?.metaDescription || seo?.ogDescription || FALLBACK_DESCRIPTION;
  const canonical = seo?.canonicalURL ? absoluteUrl(seo.canonicalURL, siteUrl) : siteUrl;
  const ogImage = mediaUrl(seo?.ogImage, siteUrl) || absoluteUrl("/images/poeza-collection.png", siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: DRE_KEYWORDS,
    applicationName: settings?.siteName || FALLBACK_SITE_NAME,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: settings?.siteName || FALLBACK_SITE_NAME,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo?.ogTitle || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: [ogImage],
    },
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

function collectKeywords(sections: GridSection[]) {
  const words = new Set<string>();

  for (const section of sections) {
    [section.label, section.kicker, section.meta].forEach((value) => {
      if (value) words.add(value);
    });
  }

  return Array.from(words).slice(0, 12);
}

export function buildHomeStructuredData(settings: GlobalSetting | null, sections: GridSection[]) {
  const siteUrl = getSiteUrl(settings);
  const siteName = settings?.siteName || FALLBACK_SITE_NAME;
  const description = settings?.defaultSeo?.metaDescription || FALLBACK_DESCRIPTION;
  const configuredData = settings?.defaultSeo?.structuredData;

  if (configuredData && typeof configuredData === "object") {
    return configuredData;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        description,
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: siteName,
        url: siteUrl,
        sameAs: settings?.socialLinks?.map((link) => link.href).filter(Boolean) ?? [],
        knowsAbout: collectKeywords(sections),
      },
    ],
  };
}
