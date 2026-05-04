import type { GridElement, GridKind, GridSection } from "@/types/grid";
import type { CMSMedia } from "@/types/media";

const gridKinds: GridKind[] = ["hero", "image", "text", "index", "quote"];

type RawRecord = Record<string, unknown>;

function isGridKind(value: unknown): value is GridKind {
  return typeof value === "string" && gridKinds.includes(value as GridKind);
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function toNumber(value: unknown, fallback?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toSlug(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function sanitizeScopedCss(value: string) {
  if (!value) return undefined;
  const blocked = /<\/style|<script|@import|javascript:|expression\(/i;
  return blocked.test(value) ? undefined : value;
}

function blockTypeOf(row: RawRecord) {
  return toString(row.blockType || row.__component).replace(/^grid\./, "");
}

function toElements(value: unknown): GridElement[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item): GridElement[] => {
    if (!item || typeof item !== "object") return [];
    const row = item as RawRecord;
    const blockType = blockTypeOf(row);

    if (blockType === "background") {
      const color = toString(row.color);
      const imageSrc = toString(row.imageSrc);
      return [
        {
          type: "background",
          color: color || undefined,
          imageSrc: imageSrc || undefined,
          imageAlt: toString(row.imageAlt) || undefined,
          imageOpacity: toNumber(row.imageOpacity),
        },
      ];
    }

    if (blockType === "text") {
      return [
        {
          type: "text",
          eyebrow: toString(row.eyebrow) || undefined,
          heading: toString(row.heading) || undefined,
          body: toString(row.body) || undefined,
        },
      ];
    }

    if (blockType === "image") {
      const src = toString(row.src);
      const placement = toString(row.placement);
      if (!src) return [];
      return [
        {
          type: "image",
          src,
          alt: toString(row.alt) || undefined,
          caption: toString(row.caption) || undefined,
          placement: placement === "inline" ? "inline" : "background",
        },
      ];
    }

    if (blockType === "link") {
      const label = toString(row.label);
      const href = toString(row.href);
      if (!label || !href) return [];
      return [{ type: "link", label, href, openInNewTab: toBoolean(row.openInNewTab) }];
    }

    if (blockType === "button") {
      const label = toString(row.label);
      const href = toString(row.href);
      const variant = toString(row.variant);
      if (!label || !href) return [];
      return [
        {
          type: "button",
          label,
          href,
          variant: variant === "secondary" || variant === "text" ? variant : "primary",
          openInNewTab: toBoolean(row.openInNewTab),
        },
      ];
    }

    if (blockType === "shape") {
      const shape = toString(row.shape);
      return [
        {
          type: "shape",
          name: toString(row.name) || undefined,
          shape: shape === "circle" || shape === "rectangle" ? shape : "triangle",
          color: toString(row.color) || undefined,
          opacity: toNumber(row.opacity),
          width: toString(row.width) || undefined,
          height: toString(row.height) || undefined,
          x: toString(row.x) || undefined,
          y: toString(row.y) || undefined,
          rotation: toNumber(row.rotation),
          zIndex: toNumber(row.zIndex),
        },
      ];
    }

    return [];
  });
}

export function mapPayloadGrid(entry: RawRecord): GridSection {
  const label = toString(entry.label);
  const orderIndex = Number(entry.orderIndex ?? 0);

  return {
    id: toSlug(label, toString(entry.id, String(orderIndex))),
    label,
    kicker: toString(entry.kicker),
    meta: toString(entry.meta),
    kind: isGridKind(entry.kind) ? entry.kind : "text",
    elements: toElements(entry.elements),
    localCss: sanitizeScopedCss(toString(entry.localCss)),
    orderIndex,
  };
}

export function mapPayloadMedia(value: unknown): CMSMedia | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as RawRecord;
  const url = toString(row.url);
  if (!url) return undefined;

  return {
    url,
    alt: toString(row.alt),
    width: toNumber(row.width),
    height: toNumber(row.height),
  };
}
