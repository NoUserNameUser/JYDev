# Deployment

## Production Docker

1. Copy `.env.production.example` to `.env`.
2. Fill every secret. Keep `.env` on the server only.
3. Validate the environment:

```bash
npm run validate:env
```

4. Start the stack:

```bash
docker compose up --build -d
```

Services:

- `web`: Next.js standalone server on port `3000`
- `db`: PostgreSQL with persistent `postgres-data` volume
- `payload-media`: durable local uploads volume mounted at `/app/media`

The production compose file intentionally keeps only two runtime services. Put TLS, redirects,
and domain routing in your platform load balancer or a small external reverse proxy.

## Revalidation Webhook

Configure a Payload webhook to call:

```text
POST https://example.com/api/revalidate
Header: x-revalidate-secret: <PAYLOAD_WEBHOOK_SECRET>
Body: { "tag": "payload" }
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
- Confirm `/admin` loads the Payload admin.
- Confirm uploads are stored in the `payload-media` volume or durable object storage before production traffic.
- Confirm `CORS_ORIGINS` only contains trusted frontend origins.
