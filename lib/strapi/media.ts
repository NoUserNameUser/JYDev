import { env } from "@/config/env";

import type { CMSMedia } from "@/types/media";

type RawMedia = {
  url?: unknown;
  alternativeText?: unknown;
  width?: unknown;
  height?: unknown;
  attributes?: RawMedia;
};

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function resolveStrapiMediaUrl(url: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, env.strapiPublicUrl).toString();
}

export function mapStrapiMedia(value: RawMedia | null | undefined): CMSMedia | undefined {
  const row = value?.attributes ?? value;
  const url = resolveStrapiMediaUrl(toString(row?.url));
  if (!url) return undefined;

  return {
    url,
    alt: toString(row?.alternativeText),
    width: toNumber(row?.width),
    height: toNumber(row?.height),
  };
}
