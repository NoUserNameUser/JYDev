import type { CMSMedia } from "./media";

export type SEO = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalURL?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: CMSMedia;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
};
