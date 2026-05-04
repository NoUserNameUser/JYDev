const requiredByTarget = {
  production: [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_STRAPI_URL",
    "STRAPI_PUBLIC_URL",
    "POSTGRES_DB",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "STRAPI_APP_KEYS",
    "STRAPI_API_TOKEN_SALT",
    "STRAPI_ADMIN_JWT_SECRET",
    "STRAPI_TRANSFER_TOKEN_SALT",
    "STRAPI_JWT_SECRET",
    "NEXT_REVALIDATE_SECRET",
    "STRAPI_WEBHOOK_SECRET",
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
