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
docker compose pull web
docker compose up -d --no-build --remove-orphans
```

Production EC2 deployments must use a prebuilt `WEB_IMAGE`; never build on a small instance.
Local development can omit `WEB_IMAGE` and continue using `--build`. See
[`registry-deployment.md`](registry-deployment.md) for the complete GHCR/ECR setup.

The production Dockerfile follows Payload's recommended multi-stage Next.js standalone setup. Its
default `NEXT_BUILD_MODE=compile` uses Next's experimental compile-only build mode so Docker does
not need a live Payload database while building. Use `NEXT_BUILD_MODE=full` only when the build host
has database access and you deliberately want a normal static-generation pass.

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

## GitHub Actions CD

The `Deploy production` workflow runs after `CI` succeeds on `master`, and can also be started
manually. It builds on a GitHub-hosted runner, pushes to GHCR by default or ECR when selected, then
deploys the digest-pinned image over SSH. Full setup, IAM policies, first-run instructions, and
rollback steps are in [`registry-deployment.md`](registry-deployment.md).

Because image builds happen on GitHub Actions, the EC2 instance only needs enough capacity to run
the production containers. It no longer needs enough CPU or memory for `next build` during deploys.

Configure these repository secrets:

- `DEPLOY_HOST`: SSH host or IP for the production server.
- `DEPLOY_USER`: SSH user that can run Docker Compose in the deployment directory.
- `DEPLOY_SSH_KEY`: private SSH key for `DEPLOY_USER`.
- `DEPLOY_PORT`: SSH port. Optional when the server uses port `22`.

Configure these repository variables:

- `DEPLOY_PATH`: absolute path on the server containing `docker-compose.yml` and `.env`.
- `NEXT_PUBLIC_SITE_URL`: production site URL used while building the Next.js image.
- `BUILD_NODE_OPTIONS`: optional Node options for the Docker build, for example
  `--max-old-space-size=1536`.
- `NEXT_BUILD_MODE`: optional Docker build mode. Keep the default `compile` unless the build host
  has database access and you need a full static-generation pass.

On the server, keep the production `.env` in `DEPLOY_PATH`. It should contain the database,
Payload, revalidation, CORS, and Postgres values from `.env.production.example`; the workflow
updates `WEB_IMAGE` during deployment. The first server setup still needs the checked-in
`docker-compose.yml` in `DEPLOY_PATH`; after that, normal app deploys can happen by pulling only the
new image.
