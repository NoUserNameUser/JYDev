import "server-only";

import { getPayloadClient } from "@/lib/payload/client";
import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "@/lib/cacheTags";
import type { Showcase } from "@/payload-types";

const SKIP_BUILD_CMS = process.env.NEXT_SKIP_BUILD_CMS === "1";

const getCachedShowcases = unstable_cache(
  async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "showcases",
      depth: 1,
      limit: 100,
      overrideAccess: false,
      sort: "orderIndex",
    });
    return result.docs;
  },
  ["showcases"],
  {
    revalidate: 300,
    tags: [CACHE_TAGS.payload, CACHE_TAGS.showcases],
  },
);

export async function listShowcases(): Promise<Showcase[] | null> {
  if (SKIP_BUILD_CMS) return null;

  try {
    return await getCachedShowcases();
  } catch {
    return null;
  }
}

export function showcaseImageUrl(showcase: Showcase): string | undefined {
  const image = showcase.image;
  if (image && typeof image === "object") {
    return image.sizes?.card?.url || image.url || undefined;
  }
  return showcase.imageUrl || undefined;
}

export function showcaseImageAlt(showcase: Showcase): string {
  const image = showcase.image;
  if (image && typeof image === "object" && image.alt) return image.alt;
  return showcase.title;
}
