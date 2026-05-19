import { getPayloadClient } from "@/lib/payload/client";
import { mapPayloadGrid } from "@/lib/payload/mappers";
import type { GridSection } from "@/types/grid";

const SKIP_BUILD_CMS = process.env.NEXT_SKIP_BUILD_CMS === "1";

export async function listGridSections(): Promise<GridSection[]> {
  if (SKIP_BUILD_CMS) return [];

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "grids",
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: "orderIndex",
  });
  const grids = result.docs.map((doc) => mapPayloadGrid(doc as unknown as Record<string, unknown>)).filter((grid) => grid.id);
  return grids.sort((a, b) => a.orderIndex - b.orderIndex);
}
