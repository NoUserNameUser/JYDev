import "server-only";

import { getPayloadClient } from "@/lib/payload/client";
import type { Showcase } from "@/payload-types";

const SKIP_BUILD_CMS = process.env.NEXT_SKIP_BUILD_CMS === "1";

export async function listShowcases(): Promise<Showcase[] | null> {
  if (SKIP_BUILD_CMS) return null;

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "showcases",
      depth: 1,
      limit: 100,
      overrideAccess: false,
      sort: "orderIndex",
    });
    return result.docs;
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
