import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { migrations } from "./migrations/index.ts";
import { revalidateGallery, revalidateHome } from "./lib/revalidate.ts";

const revalidateHomeHook = () => {
  revalidateHome();
};

const revalidateGalleryHook = () => {
  revalidateGallery();
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const publicRead = () => true;
const authenticatedOnly = ({ req: { user } }) => Boolean(user);

const linkFields = [
  { name: "label", type: "text", required: true },
  { name: "href", type: "text", required: true },
  { name: "openInNewTab", type: "checkbox", defaultValue: false },
];

const seoFields = [
  { name: "metaTitle", type: "text", maxLength: 70 },
  { name: "metaDescription", type: "textarea", maxLength: 180 },
  { name: "canonicalURL", type: "text" },
  { name: "ogTitle", type: "text", maxLength: 70 },
  { name: "ogDescription", type: "textarea", maxLength: 180 },
  { name: "ogImage", type: "upload", relationTo: "media" },
  { name: "noIndex", type: "checkbox", defaultValue: false },
  { name: "structuredData", type: "json" },
];

const Users = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email", group: "System" },
  fields: [],
};

const Media = {
  slug: "media",
  access: { create: authenticatedOnly, read: publicRead, update: authenticatedOnly, delete: authenticatedOnly },
  admin: { useAsTitle: "alt", group: "Content" },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 960 },
      { name: "hero", width: 1600 },
    ],
  },
  fields: [{ name: "alt", type: "text", required: true }],
};

const Inquiries = {
  slug: "inquiries",
  access: {
    create: publicRead,
    read: authenticatedOnly,
    update: authenticatedOnly,
    delete: authenticatedOnly,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "serviceType", "status", "createdAt"],
    group: "Inbox",
    description: "Project inquiries submitted through the website form.",
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120 },
    { name: "email", type: "email", required: true },
    { name: "company", type: "text", maxLength: 160 },
    {
      name: "serviceType",
      type: "select",
      required: true,
      options: [
        { label: "Software Development", value: "software" },
        { label: "AI Integration", value: "ai" },
        { label: "Infrastructure & Cloud", value: "infra" },
        { label: "Website / Web App", value: "web" },
        { label: "Other / Not sure yet", value: "other" },
      ],
    },
    {
      name: "budget",
      type: "select",
      options: [
        { label: "Under $2k", value: "under-2k" },
        { label: "$2k – $10k", value: "2k-10k" },
        { label: "$10k – $50k", value: "10k-50k" },
        { label: "$50k+", value: "50k-plus" },
        { label: "Not sure yet", value: "undecided" },
      ],
    },
    { name: "message", type: "textarea", required: true, maxLength: 4000 },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In review", value: "in-review" },
        { label: "Replied", value: "replied" },
        { label: "Closed", value: "closed" },
      ],
      access: {
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
      },
      admin: { position: "sidebar" },
    },
  ],
};

const Showcases = {
  slug: "showcases",
  access: {
    create: authenticatedOnly,
    read: publicRead,
    update: authenticatedOnly,
    delete: authenticatedOnly,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "kicker", "orderIndex", "updatedAt"],
    group: "Content",
    description: "One card per project on the /gallery canvas, ordered by orderIndex (1 = centre cell).",
  },
  defaultSort: "orderIndex",
  hooks: {
    afterChange: [revalidateGalleryHook],
    afterDelete: [revalidateGalleryHook],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "kicker", type: "text", admin: { description: "Category label, e.g. INFRASTRUCTURE." } },
    { name: "meta", type: "text", admin: { description: "Year / context, e.g. 2019 · Telecom." } },
    { name: "body", type: "textarea", admin: { description: "One or two sentences describing the work." } },
    {
      name: "accentFrom",
      type: "text",
      defaultValue: "#77e5c8",
      admin: { description: "Primary accent hex for this project (drives border, glow and type)." },
    },
    {
      name: "accentTo",
      type: "text",
      defaultValue: "#b6f35a",
      admin: { description: "Secondary accent hex, used for gradients." },
    },
    {
      name: "tags",
      type: "array",
      admin: { description: "Stack chips shown under the description." },
      fields: [{ name: "label", type: "text", required: true }],
    },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Artwork inlaid into the card. External URL or a path like /images/work/foo.svg." },
    },
    {
      name: "link",
      type: "group",
      fields: [
        { name: "label", type: "text" },
        { name: "href", type: "text" },
        { name: "openInNewTab", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "orderIndex", type: "number", required: true, unique: true, index: true },
  ],
};

const GlobalSettings = {
  slug: "global-settings",
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: "Settings" },
  hooks: {
    afterChange: [revalidateHomeHook],
  },
  fields: [
    { name: "siteName", type: "text", required: true },
    { name: "siteUrl", type: "text", required: true },
    { name: "defaultSeo", type: "group", fields: seoFields },
    { name: "socialLinks", type: "array", fields: linkFields },
  ],
};

const Navigation = {
  slug: "navigation",
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: "Settings" },
  hooks: {
    afterChange: [revalidateHomeHook],
  },
  fields: [
    { name: "items", type: "array", fields: linkFields },
    { name: "cta", type: "group", fields: linkFields },
  ],
};

const corsOrigins = process.env.CORS_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, "app/(payload)/admin/importMap.js"),
    },
  },
  collections: [Users, Media, Inquiries, Showcases],
  cors: corsOrigins?.length ? corsOrigins : [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  csrf: corsOrigins?.length ? corsOrigins : [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    prodMigrations: migrations,
    push: process.env.PAYLOAD_DB_PUSH === "true",
  }),
  globals: [GlobalSettings, Navigation],
  graphQL: {
    disable: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? "",
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  sharp,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
