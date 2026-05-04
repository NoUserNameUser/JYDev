import { defaultGridSections } from "@/content/grids";
import { getPayloadClient } from "@/lib/payload/client";

import { toPayloadGridData } from "./grid-utils";

async function seedGrids() {
  const payload = await getPayloadClient();

  for (const grid of defaultGridSections) {
    const existing = await payload.find({
      collection: "grids",
      limit: 1,
      where: {
        orderIndex: {
          equals: grid.orderIndex,
        },
      },
    });

    const data = toPayloadGridData(grid);

    if (existing.docs[0]?.id) {
      await payload.update({
        collection: "grids",
        id: existing.docs[0].id,
        data: data as any,
      });
    } else {
      await payload.create({
        collection: "grids",
        data: data as any,
      });
    }
  }

  payload.logger.info(`Seeded ${defaultGridSections.length} Payload grid documents.`);
}

seedGrids()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
