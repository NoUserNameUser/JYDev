const DEFAULT_SITE_URL = "http://localhost:3000";

function readServerEnv(name: string, fallback?: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

export const env = {
  siteUrl: readServerEnv("NEXT_PUBLIC_SITE_URL", DEFAULT_SITE_URL),
  payloadSecret: readServerEnv("PAYLOAD_SECRET"),
  previewSecret: readServerEnv("PREVIEW_SECRET"),
  revalidateSecret: readServerEnv("NEXT_REVALIDATE_SECRET"),
  cmsWebhookSecret: readServerEnv("PAYLOAD_WEBHOOK_SECRET"),
} as const;

export function requireServerEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
