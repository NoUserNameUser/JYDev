import type { GridElement, GridSection } from "@/types/grid";

type PayloadGridElement = Record<string, unknown> & {
  blockType: GridElement["type"];
};

export function toPayloadGridElement(element: GridElement): PayloadGridElement {
  return {
    ...element,
    blockType: element.type,
  };
}

export function toPayloadGridData(grid: GridSection) {
  return {
    label: grid.label,
    kicker: grid.kicker,
    meta: grid.meta,
    kind: grid.kind,
    orderIndex: grid.orderIndex,
    elements: grid.elements?.map(toPayloadGridElement) ?? [],
    localCss: grid.localCss,
  };
}
