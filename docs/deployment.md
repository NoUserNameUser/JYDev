# Deployment

## Production Docker

1. Copy `.env.production.example` to `.env.production`.
2. Fill every secret. Production compose intentionally fails when required values are missing.
3. Start the stack:

```bash
docker compose --env-file .env.production up --build -d
```

Services:

- `web`: Next.js standalone server on port `3000`
- `strapi`: Strapi CMS on port `1337`
- `db`: PostgreSQL with persistent `postgres-data` volume

## Revalidation Webhook

Configure a Strapi webhook to call:

```text
POST https://example.com/api/revalidate
Header: x-revalidate-secret: <STRAPI_WEBHOOK_SECRET>
Body: { "tag": "strapi" }
```

For page-specific updates:

```json
{ "path": "/" }
```

## Backup Baseline

- Run daily PostgreSQL backups with at least 7 daily, 4 weekly, and 3 monthly restore points.
- Store backups outside the application host.
- Test restore into staging before relying on the backup policy.

## Operational Checks

- Confirm `/` returns 200 from `web`.
- Confirm `/_health` returns 204 from Strapi.
- Confirm uploads are stored in durable object storage before production traffic.
- Confirm `CORS_ORIGINS` only contains trusted frontend origins.
