const DEFAULT_STRAPI_URL = "http://127.0.0.1:1337";
const DEFAULT_SITE_URL = "http://localhost:3000";

function readServerEnv(name: string, fallback?: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

export const env = {
  siteUrl: readServerEnv("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL),
  strapiUrl: readServerEnv("STRAPI_URL", DEFAULT_STRAPI_URL),
  strapiPublicUrl: readServerEnv("STRAPI_PUBLIC_URL", readServerEnv("NEXT_PUBLIC_STRAPI_URL", DEFAULT_STRAPI_URL)),
  strapiApiToken: readServerEnv("STRAPI_API_TOKEN"),
  previewSecret: readServerEnv("PREVIEW_SECRET"),
  revalidateSecret: readServerEnv("NEXT_REVALIDATE_SECRET"),
  strapiWebhookSecret: readServerEnv("STRAPI_WEBHOOK_SECRET"),
} as const;

export function requireServerEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
