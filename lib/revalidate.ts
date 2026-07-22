import { revalidatePath, revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cacheTags";

export function revalidateHome() {
  try {
    revalidatePath("/");
    revalidateTag(CACHE_TAGS.globalSettings);
  } catch (error) {
    console.warn("[revalidate] skipped:", error instanceof Error ? error.message : error);
  }
}

export function revalidateGallery() {
  try {
    revalidatePath("/gallery");
    revalidateTag(CACHE_TAGS.showcases);
  } catch (error) {
    console.warn("[revalidate] skipped:", error instanceof Error ? error.message : error);
  }
}
