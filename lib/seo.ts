import type { Metadata } from "next";

import { env } from "@/config/env";
import { getPayloadClient } from "@/lib/payload/client";
import { SERVICE_TYPES } from "@/lib/inquiries";
import type { GlobalSetting, Media } from "@/payload-types";

const SKIP_BUILD_CMS = process.env.NEXT_SKIP_BUILD_CMS === "1";
const FALLBACK_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Jackie Ye";
const FALLBACK_TITLE = "Jackie Ye | Freelance Software, AI & Infrastructure Consultant";
const FALLBACK_SITE_URL = "http://localhost:3000";
const FALLBACK_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
  "Jackie Ye is a freelance software consultant in Vancouver offering free consultations and estimates for software development, AI integration, cloud infrastructure, and web projects.";
const SEO_KEYWORDS = [
  "Jackie Ye",
  "freelance software developer",
  "software consultant",
  "free software consultation",
  "project estimate",
  "AI integration",
  "LLM integration",
  "cloud infrastructure",
  "AWS migration",
  "infrastructure architecture",
  "web development",
  "full stack developer",
  "backend systems",
  "CMS development",
  "Payload CMS",
  "Next.js",
  "TypeScript",
  "Python",
  "Docker",
  "CI/CD",
  "Vancouver",
  "remote",
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
  if (SKIP_BUILD_CMS) return null;

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
  return trimTrailingSlash(env.siteUrl || settings?.siteUrl || FALLBACK_SITE_URL);
}

export function buildHomeMetadata(settings?: GlobalSetting | null): Metadata {
  const siteUrl = getSiteUrl(settings);
  const seo = settings?.defaultSeo;
  const title = seo?.metaTitle || seo?.ogTitle || FALLBACK_TITLE;
  const description = seo?.metaDescription || seo?.ogDescription || FALLBACK_DESCRIPTION;
  const canonical = seo?.canonicalURL ? absoluteUrl(seo.canonicalURL, siteUrl) : siteUrl;
  const ogImage = mediaUrl(seo?.ogImage, siteUrl) || absoluteUrl("/images/poeza-collection.png", siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: SEO_KEYWORDS,
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

function stripStructuredDataEmail(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripStructuredDataEmail);

  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) =>
      key.toLowerCase() === "email" ? [] : [[key, stripStructuredDataEmail(entry)]],
    ),
  );
}

export function buildHomeStructuredData(settings: GlobalSetting | null) {
  const siteUrl = getSiteUrl(settings);
  const siteName = settings?.siteName || FALLBACK_SITE_NAME;
  const description = settings?.defaultSeo?.metaDescription || FALLBACK_DESCRIPTION;
  const configuredData = settings?.defaultSeo?.structuredData;

  if (configuredData && typeof configuredData === "object") {
    return stripStructuredDataEmail(configuredData);
  }

  const sameAs = settings?.socialLinks?.map((link) => link.href).filter(Boolean) ?? [];

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
        jobTitle: "Freelance Software Consultant",
        sameAs,
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#service`,
        name: `${siteName} — Freelance Software Consulting`,
        url: siteUrl,
        description,
        founder: { "@id": `${siteUrl}/#person` },
        areaServed: "Worldwide (remote)",
        priceRange: "Free consultation & estimate",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Consulting services",
          itemListElement: SERVICE_TYPES.filter((service) => service.value !== "other").map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.label,
            },
          })),
        },
      },
    ],
  };
}
