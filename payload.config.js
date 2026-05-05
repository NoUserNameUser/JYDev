import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";
import { migrations } from "./migrations/index.ts";

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

const gridElementBlocks = [
  {
    slug: "background",
    fields: [
      { name: "color", type: "text", defaultValue: "#ffffff" },
      { name: "imageSrc", type: "text" },
      { name: "imageAlt", type: "text" },
      { name: "imageOpacity", type: "number", min: 0, max: 1, defaultValue: 0.88 },
    ],
  },
  {
    slug: "text",
    fields: [
      { name: "eyebrow", type: "text" },
      { name: "heading", type: "text" },
      { name: "body", type: "textarea" },
    ],
  },
  {
    slug: "image",
    fields: [
      { name: "src", type: "text", required: true },
      { name: "alt", type: "text" },
      { name: "caption", type: "text" },
      { name: "placement", type: "select", required: true, defaultValue: "inline", options: ["inline", "background"] },
    ],
  },
  { slug: "link", fields: linkFields },
  {
    slug: "button",
    fields: [
      { name: "label", type: "text", required: true },
      { name: "href", type: "text", required: true },
      { name: "variant", type: "select", required: true, defaultValue: "primary", options: ["primary", "secondary", "text"] },
      { name: "openInNewTab", type: "checkbox", defaultValue: false },
    ],
  },
  {
    slug: "shape",
    fields: [
      { name: "name", type: "text" },
      { name: "shape", type: "select", required: true, defaultValue: "triangle", options: ["triangle", "circle", "rectangle"] },
      { name: "color", type: "text", defaultValue: "rgba(53, 47, 42, 0.16)" },
      { name: "opacity", type: "number", min: 0, max: 1, defaultValue: 1 },
      { name: "width", type: "text", defaultValue: "16%" },
      { name: "height", type: "text", defaultValue: "86px" },
      { name: "x", type: "text", defaultValue: "50%" },
      { name: "y", type: "text", defaultValue: "20%" },
      { name: "rotation", type: "number", defaultValue: 0 },
      { name: "zIndex", type: "number", defaultValue: 1 },
    ],
  },
];

const pageSectionBlocks = [
  {
    slug: "hero",
    fields: [
      { name: "eyebrow", type: "text" },
      { name: "heading", type: "text", required: true },
      { name: "body", type: "textarea" },
      { name: "image", type: "upload", relationTo: "media" },
      { name: "primaryAction", type: "group", fields: linkFields },
      { name: "secondaryAction", type: "group", fields: linkFields },
      { name: "visible", type: "checkbox", defaultValue: true },
    ],
  },
  {
    slug: "textImage",
    fields: [
      { name: "eyebrow", type: "text" },
      { name: "heading", type: "text", required: true },
      { name: "body", type: "richText" },
      { name: "image", type: "upload", relationTo: "media" },
      { name: "imagePosition", type: "select", defaultValue: "right", options: ["left", "right"] },
      { name: "visible", type: "checkbox", defaultValue: true },
    ],
  },
  {
    slug: "cta",
    fields: [
      { name: "heading", type: "text", required: true },
      { name: "body", type: "textarea" },
      { name: "action", type: "group", fields: linkFields },
      { name: "visible", type: "checkbox", defaultValue: true },
    ],
  },
  {
    slug: "faq",
    fields: [
      { name: "heading", type: "text", defaultValue: "FAQ" },
      {
        name: "items",
        type: "array",
        required: true,
        fields: [
          { name: "question", type: "text", required: true },
          { name: "answer", type: "textarea", required: true },
        ],
      },
      { name: "visible", type: "checkbox", defaultValue: true },
    ],
  },
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

const Grids = {
  slug: "grids",
  access: { create: authenticatedOnly, read: publicRead, update: authenticatedOnly, delete: authenticatedOnly },
  admin: { useAsTitle: "label", defaultColumns: ["label", "kind", "orderIndex", "updatedAt"], group: "Content" },
  defaultSort: "orderIndex",
  fields: [
    { name: "label", type: "text", required: true },
    { name: "kicker", type: "text", required: true },
    { name: "meta", type: "text", required: true },
    { name: "kind", type: "select", required: true, defaultValue: "text", options: ["hero", "image", "text", "index", "quote"] },
    { name: "elements", type: "blocks", blocks: gridElementBlocks },
    { name: "localCss", type: "textarea" },
    { name: "orderIndex", type: "number", required: true, unique: true, index: true },
  ],
};

const Pages = {
  slug: "pages",
  versions: { drafts: true },
  access: { create: authenticatedOnly, read: publicRead, update: authenticatedOnly, delete: authenticatedOnly },
  admin: { useAsTitle: "title", defaultColumns: ["title", "slug", "updatedAt"], group: "Content" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "seo", type: "group", fields: seoFields },
    { name: "sections", type: "blocks", blocks: pageSectionBlocks },
  ],
};

const GlobalSettings = {
  slug: "global-settings",
  access: { read: publicRead, update: authenticatedOnly },
  admin: { group: "Settings" },
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
  collections: [Users, Media, Grids, Pages],
  cors: corsOrigins?.length ? corsOrigins : [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  csrf: corsOrigins?.length ? corsOrigins : [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    prodMigrations: migrations,
    push: process.env.PAYLOAD_DB_PUSH === "true",
  }),
  editor: lexicalEditor(),
  globals: [GlobalSettings, Navigation],
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? "",
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  sharp,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
