/**
 * Replaces the `showcases` collection with the curated work set.
 *
 *   npx payload run scripts/seed-showcases.ts
 *
 * Safe to re-run: it clears existing showcases first, then recreates them in
 * spiral order (orderIndex 1 = centre cell of the gallery canvas).
 *
 * Every project owns its own accent pair, so each cell on the canvas reads as
 * a distinct piece of work rather than a repeat of the same card.
 */
import config from "@payload-config";
import { getPayload } from "payload";

type SeedShowcase = {
  title: string;
  kicker: string;
  meta: string;
  body: string;
  accentFrom: string;
  accentTo: string;
  tags: { label: string }[];
  imageUrl: string;
  link?: { label: string; href: string };
  orderIndex: number;
};

const tags = (...labels: string[]) => labels.map((label) => ({ label }));

const SHOWCASES: SeedShowcase[] = [
  {
    orderIndex: 1,
    kicker: "Cloud migration",
    meta: "Cityfone / Rogers",
    title: "A live telecom platform moved without going dark.",
    body: "Planned and delivered the move from on-premise infrastructure to AWS behind Akamai, with rehearsals, rollback coverage, and continuity for a customer-facing platform.",
    accentFrom: "#5eead4",
    accentTo: "#38bdf8",
    tags: tags("AWS", "Akamai", "Linux", "Docker"),
    imageUrl: "/images/work/01-migration.svg",
    link: { label: "Infrastructure & cloud", href: "/#services" },
  },
  {
    orderIndex: 2,
    kicker: "Product engineering",
    meta: "100K+ subscribers",
    title: "Self-serve account care, designed around real customer jobs.",
    body: "Built customer flows for payments, number transfers, account changes, and order activity so subscribers could finish common tasks without calling support.",
    accentFrom: "#fbbf24",
    accentTo: "#fb7185",
    tags: tags("PHP", "MySQL", "Payments", "UX"),
    imageUrl: "/images/work/02-portal.svg",
    link: { label: "Software development", href: "/#services" },
  },
  {
    orderIndex: 3,
    kicker: "Platform architecture",
    meta: "5 brands / 1 codebase",
    title: "Five distinct brands. One maintainable publishing core.",
    body: "Created a multi-site CMS foundation that shared components and release workflows while preserving each brand's content, routes, theme, and search identity.",
    accentFrom: "#c084fc",
    accentTo: "#fb7185",
    tags: tags("CMS", "Multi-site", "SEO", "Theming"),
    imageUrl: "/images/work/03-multibrand.svg",
    link: { label: "How I work", href: "/#process" },
  },
  {
    orderIndex: 4,
    kicker: "Creative development",
    meta: "JYDev",
    title: "A consulting site that turns technical depth into a clear next step.",
    body: "Designed and built this service platform with a conversion-focused landing page, spatial work gallery, Payload CMS, inquiry operations, SEO foundations, and production deployment.",
    accentFrom: "#77e5c8",
    accentTo: "#b6f35a",
    tags: tags("Next.js", "Payload", "Motion", "PostgreSQL"),
    imageUrl: "/images/work/04-ai.svg",
    link: { label: "Web development", href: "/#services" },
  },
  {
    orderIndex: 5,
    kicker: "Performance engineering",
    meta: "~5s to ~2s",
    title: "A slow content model rebuilt into a faster product experience.",
    body: "Reshaped reusable content, queries, and caching around how pages were actually assembled, cutting typical page-load time by more than half without a ground-up rewrite.",
    accentFrom: "#fb6a4a",
    accentTo: "#fbbf24",
    tags: tags("Profiling", "Caching", "MySQL", "CMS"),
    imageUrl: "/images/work/05-performance.svg",
    link: { label: "Performance services", href: "/#services" },
  },
  {
    orderIndex: 6,
    kicker: "Full-stack product",
    meta: "Thrinacia Origin",
    title: "Crowdfunding flows where the interface and the money both work.",
    body: "Led development across the single-page campaign experience, REST services, and Stripe payment journey—from creating a project to backing it.",
    accentFrom: "#f472b6",
    accentTo: "#facc15",
    tags: tags("AngularJS", "REST API", "Stripe", "Agile"),
    imageUrl: "/images/work/06-payments.svg",
    link: { label: "Web apps", href: "/#services" },
  },
];

const payload = await getPayload({ config });

const existing = await payload.find({ collection: "showcases", limit: 500, depth: 0 });
if (existing.docs.length > 0) {
  await payload.delete({ collection: "showcases", where: { id: { exists: true } } });
  payload.logger.info(`Removed ${existing.docs.length} existing showcase(s).`);
}

for (const showcase of SHOWCASES) {
  const created = await payload.create({ collection: "showcases", data: showcase });
  payload.logger.info(`Created #${created.orderIndex} ${created.title}`);
}

payload.logger.info(`Seeded ${SHOWCASES.length} works.`);
process.exit(0);
