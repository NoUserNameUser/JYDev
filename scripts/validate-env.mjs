import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const requiredByTarget = {
  production: [
    "NEXT_PUBLIC_SITE_URL",
    "DATABASE_URL",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "PAYLOAD_SECRET",
    "NEXT_REVALIDATE_SECRET",
    "PAYLOAD_WEBHOOK_SECRET",
    "CORS_ORIGINS",
  ],
  development: [],
};

const target = process.env.NODE_ENV === "production" ? "production" : "development";
const missing = requiredByTarget[target].filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing required ${target} environment variables:`);
  for (const name of missing) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

console.log(`Environment validation passed for ${target}.`);
