import { defaultGridSections } from "@/content/grids";
import { getPayloadClient } from "@/lib/payload/client";
import { mapPayloadGrid } from "@/lib/payload/mappers";
import type { GridSection } from "@/types/grid";

export async function listGridSections(): Promise<GridSection[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "grids",
      depth: 1,
      limit: 100,
      overrideAccess: false,
      sort: "orderIndex",
    });
    const grids = result.docs.map((doc) => mapPayloadGrid(doc as unknown as Record<string, unknown>)).filter((grid) => grid.id);
    return grids.length ? grids.sort((a, b) => a.orderIndex - b.orderIndex) : defaultGridSections;
  } catch {
    return defaultGridSections;
  }
}
