import type { GridElement, GridKind, GridSection } from "@/types/grid";

const gridKinds: GridKind[] = ["hero", "image", "text", "index", "quote"];

type StrapiGrid = {
  id?: number;
  documentId?: string;
  label?: unknown;
  kicker?: unknown;
  meta?: unknown;
  kind?: unknown;
  elements?: unknown;
  localCss?: unknown;
  orderIndex?: unknown;
  attributes?: Record<string, unknown>;
};

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

function toElements(value: unknown): GridElement[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item): GridElement[] => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const component = toString(row.__component);

    if (component === "grid.background") {
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

    if (component === "grid.text") {
      return [
        {
          type: "text",
          eyebrow: toString(row.eyebrow) || undefined,
          heading: toString(row.heading) || undefined,
          body: toString(row.body) || undefined,
        },
      ];
    }

    if (component === "grid.image") {
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

    if (component === "grid.link") {
      const label = toString(row.label);
      const href = toString(row.href);
      if (!label || !href) return [];
      return [{ type: "link", label, href, openInNewTab: toBoolean(row.openInNewTab) }];
    }

    if (component === "grid.button") {
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

    if (component === "grid.shape") {
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

export function mapGridSection(entry: StrapiGrid): GridSection {
  const row = entry.attributes ?? entry;
  const label = toString(row.label);
  const orderIndex = Number(row.orderIndex ?? 0);

  return {
    id: toSlug(label, toString(row.documentId, toString(row.id, String(entry.documentId ?? entry.id ?? orderIndex)))),
    label,
    kicker: toString(row.kicker),
    meta: toString(row.meta),
    kind: isGridKind(row.kind) ? row.kind : "text",
    elements: toElements(row.elements),
    localCss: sanitizeScopedCss(toString(row.localCss)),
    orderIndex,
  };
}
