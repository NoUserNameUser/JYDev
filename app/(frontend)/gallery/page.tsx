import type { Metadata } from "next";
import Link from "next/link";

import { GalleryCanvas } from "@/features/gallery/components/GalleryCanvas";
import { fallbackGalleryItems, resolveWorkVisual } from "@/features/gallery/galleryContent";
import type { GalleryItem } from "@/features/gallery/galleryContent";
import { SiteHeader } from "@/features/landing/SiteChrome";
import { getGlobalSettings, getSiteUrl } from "@/lib/seo";
import { listShowcases, showcaseImageAlt, showcaseImageUrl } from "@/features/gallery/showcases.server";
import type { Showcase } from "@/payload-types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();
  const siteName = settings?.siteName || "Jackie Ye";
  const title = `Work Gallery | ${siteName}`;
  const description =
    "Selected work and case studies: software, AI integrations, cloud infrastructure, and web platforms built by Jackie Ye.";

  return {
    title,
    description,
    alternates: { canonical: `${getSiteUrl(settings)}/gallery` },
    openGraph: { title, description, type: "website", url: `${getSiteUrl(settings)}/gallery` },
  };
}

function toGalleryItem(showcase: Showcase): GalleryItem {
  const imageUrl = showcaseImageUrl(showcase);

  return {
    id: String(showcase.id),
    title: showcase.title,
    kicker: showcase.kicker ?? undefined,
    meta: showcase.meta ?? undefined,
    body: showcase.body ?? undefined,
    accentFrom: showcase.accentFrom || "#77e5c8",
    accentTo: showcase.accentTo || "#b6f35a",
    tags: showcase.tags?.map((tag) => tag.label).filter(Boolean) ?? [],
    visual: resolveWorkVisual(imageUrl, showcase.orderIndex),
    imageUrl,
    imageAlt: showcaseImageAlt(showcase),
    link: showcase.link?.href
      ? {
          label: showcase.link.label ?? undefined,
          href: showcase.link.href,
          openInNewTab: showcase.link.openInNewTab ?? undefined,
        }
      : undefined,
  };
}

export default async function GalleryPage() {
  const [settings, showcases] = await Promise.all([getGlobalSettings(), listShowcases()]);
  const siteName = settings?.siteName || "Jackie Ye";
  const cmsItems = showcases?.map(toGalleryItem);
  const items = cmsItems ?? fallbackGalleryItems;

  return (
    <div className="relative">
      <SiteHeader siteName={siteName} />

      <main>
        {items.length > 0 ? (
          <>
            <h1 className="sr-only">Work Gallery — selected work</h1>
            <GalleryCanvas items={items} />
          </>
        ) : (
          <section className="container flex min-h-[calc(100svh-4rem)] items-center justify-center">
            <div className="max-w-xl rounded-md border border-dashed border-border-strong p-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Coming soon</p>
              <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Work Gallery</h1>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-strong">
                I am curating this gallery right now. In the meantime, the fastest way to see whether we are a fit is
                to tell me about your project.
              </p>
              <Link
                href="/#inquiry"
                className="mt-8 inline-block rounded-pill bg-primary px-6 py-3 text-base font-semibold text-background transition-colors hover:bg-primary-hover"
              >
                Start a free consultation
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
