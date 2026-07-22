export type WorkVisual = "cutover" | "portal" | "brands" | "portfolio" | "performance" | "funding" | "image";

export type GalleryItem = {
  id: string;
  title: string;
  kicker?: string;
  meta?: string;
  body?: string;
  accentFrom: string;
  accentTo: string;
  tags: string[];
  visual: WorkVisual;
  imageUrl?: string;
  imageAlt?: string;
  link?: {
    label?: string;
    href?: string;
    openInNewTab?: boolean;
  };
};

export const visualOrder: WorkVisual[] = ["cutover", "portal", "brands", "portfolio", "performance", "funding"];

export function resolveWorkVisual(imageUrl: string | undefined, orderIndex: number): WorkVisual {
  const filenameMatch = imageUrl?.match(/(?:^|\/)(\d{2})-[^/]+$/);
  const imageIndex = filenameMatch ? Number(filenameMatch[1]) - 1 : Number.NaN;

  if (Number.isInteger(imageIndex) && imageIndex >= 0 && imageIndex < visualOrder.length) {
    return visualOrder[imageIndex];
  }

  if (imageUrl) return "image";

  const safeIndex = Math.max(0, Math.trunc(orderIndex) - 1) % visualOrder.length;
  return visualOrder[safeIndex] ?? "portfolio";
}

export const fallbackGalleryItems: GalleryItem[] = [
  {
    id: "cityfone-cloud-cutover",
    title: "A live telecom platform moved without going dark.",
    kicker: "Cloud migration",
    meta: "Cityfone / Rogers",
    body: "Planned and delivered the move from on-premise infrastructure to AWS behind Akamai, with rehearsals, rollback coverage, and continuity for a customer-facing platform.",
    accentFrom: "#5eead4",
    accentTo: "#38bdf8",
    tags: ["AWS", "Akamai", "Linux", "Docker"],
    visual: "cutover",
    link: { label: "Infrastructure services", href: "/#services" },
  },
  {
    id: "my-assistant-portal",
    title: "Self-serve account care, designed around real customer jobs.",
    kicker: "Product engineering",
    meta: "100K+ subscribers",
    body: "Built customer flows for payments, number transfers, account changes, and order activity so subscribers could finish common tasks without calling support.",
    accentFrom: "#facc15",
    accentTo: "#fb7185",
    tags: ["PHP", "MySQL", "Payments", "UX"],
    visual: "portal",
    link: { label: "Software development", href: "/#services" },
  },
  {
    id: "multi-brand-platform",
    title: "Five distinct brands. One maintainable publishing core.",
    kicker: "Platform architecture",
    meta: "5 brands / 1 codebase",
    body: "Created a multi-site CMS foundation that shared components and release workflows while preserving each brand's content, routes, theme, and search identity.",
    accentFrom: "#c084fc",
    accentTo: "#fb7185",
    tags: ["CMS", "Multi-site", "SEO", "Theming"],
    visual: "brands",
    link: { label: "How I work", href: "/#process" },
  },
  {
    id: "jydev-consulting-platform",
    title: "A consulting site that turns technical depth into a clear next step.",
    kicker: "Creative development",
    meta: "JYDev",
    body: "Designed and built this service platform with a conversion-focused landing page, spatial work gallery, Payload CMS, inquiry operations, SEO foundations, and production deployment.",
    accentFrom: "#77e5c8",
    accentTo: "#b6f35a",
    tags: ["Next.js", "Payload", "Motion", "PostgreSQL"],
    visual: "portfolio",
    link: { label: "Web development", href: "/#services" },
  },
  {
    id: "cms-performance-rebuild",
    title: "A slow content model rebuilt into a faster product experience.",
    kicker: "Performance engineering",
    meta: "~5s to ~2s",
    body: "Reshaped reusable content, queries, and caching around how pages were actually assembled, cutting typical page-load time by more than half without a ground-up rewrite.",
    accentFrom: "#fb6a4a",
    accentTo: "#fbbf24",
    tags: ["Profiling", "Caching", "MySQL", "CMS"],
    visual: "performance",
    link: { label: "Performance services", href: "/#services" },
  },
  {
    id: "thrinacia-origin",
    title: "Crowdfunding flows where the interface and the money both work.",
    kicker: "Full-stack product",
    meta: "Thrinacia Origin",
    body: "Led development across the single-page campaign experience, REST services, and Stripe payment journey—from creating a project to backing it.",
    accentFrom: "#f472b6",
    accentTo: "#facc15",
    tags: ["AngularJS", "REST API", "Stripe", "Agile"],
    visual: "funding",
    link: { label: "Web apps", href: "/#services" },
  },
];
