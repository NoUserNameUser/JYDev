import { defaultGridSections } from "@/content/grids";
import { strapiFetch } from "@/lib/strapi/client";
import { mapGridSection } from "@/lib/strapi/mappers";
import { gridSectionsQuery } from "@/lib/strapi/queries";
import type { StrapiCollectionResponse } from "@/lib/strapi/types";
import type { GridSection } from "@/types/grid";

export async function listGridSections(): Promise<GridSection[]> {
  try {
    const payload = await strapiFetch<StrapiCollectionResponse<Record<string, unknown>>>(gridSectionsQuery, {
      next: { revalidate: 300, tags: ["strapi", "grids"] },
    });
    const grids = payload.data?.map(mapGridSection).filter((grid) => grid.id) ?? [];
    return grids.length ? grids.sort((a, b) => a.orderIndex - b.orderIndex) : defaultGridSections;
  } catch {
    return defaultGridSections;
  }
}
