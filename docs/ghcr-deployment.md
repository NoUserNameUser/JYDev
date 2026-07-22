# GHCR-based EC2 deployment

The production workflow builds the image on GitHub Actions and makes EC2 perform only three cheap
operations: authenticate, pull, and restart with `--no-build`. This removes `npm ci` and
`next build` from the small instance, which is the root cause of build-time exit code 137.

## Common GitHub configuration

Repository secrets:

- `DEPLOY_HOST`: EC2 host or IP.
- `DEPLOY_USER`: SSH user that can run Docker Compose.
- `DEPLOY_SSH_KEY`: private SSH key for that user.
- `DEPLOY_PORT`: optional SSH port; defaults to `22`.

Repository variables:

- `DEPLOY_PATH`: absolute server path, for example `/opt/jydev`.
- `NEXT_PUBLIC_SITE_URL`: production URL used during the Next.js build.
- `DEPLOY_PLATFORM`: `linux/amd64` for x86 EC2 or `linux/arm64` for Graviton; defaults to amd64.
- `BUILD_NODE_OPTIONS`: optional runner build limit; defaults to `--max-old-space-size=2048`.

The workflow uploads `docker-compose.yml` and `scripts/deploy-prebuilt-image.sh`, so EC2 does not
need Node.js, npm, a Git checkout, or enough RAM for a build. It does need Docker Engine, Docker
Compose v2, `curl`, a populated `.env`, and disk for two image generations during rollout.

## GHCR

GitHub Actions pushes to GHCR with its short-lived `GITHUB_TOKEN`, so no push secret is
required. New packages are private by default. Either make the package public or log in once on EC2
with a classic PAT containing only `read:packages`:

```bash
echo "$GHCR_READ_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
```

Run this as the same Linux user stored in `DEPLOY_USER`; Docker retains the login for later pulls.

## First EC2 setup

```bash
sudo mkdir -p /opt/jydev
sudo chown "$USER:$USER" /opt/jydev
cd /opt/jydev
# Create .env from .env.production.example and fill every required value.
```

The `.env` must include the site URL, database, Postgres, Payload, revalidation, CORS, and Telegram
values from `.env.production.example`. The workflow owns `WEB_IMAGE` and changes it to an immutable
digest after every successful build.

Merging to `master` starts `CI`; a successful CI run starts `Deploy production`. The workflow then:

1. Builds and caches the image on GitHub Actions.
2. Pushes `latest`, a commit tag, and an immutable digest to GHCR.
3. Uploads current deployment assets over SSH.
4. Runs `docker compose pull web` and `docker compose up -d --no-build --remove-orphans`.
5. Waits up to 120 seconds for the homepage health check; on failure it restores the previous image
   and prints container logs.

Do not run `docker compose up --build` on the EC2 instance. A swap file can provide runtime safety
for a very small host, but it is not part of the build path and is no longer needed to compile the
application.

## Rollback

Copy a previous image digest from GHCR or an earlier Actions run, then on EC2:

```bash
cd /opt/jydev
sed -i 's|^WEB_IMAGE=.*|WEB_IMAGE=ghcr.io/nousernameuser/jydev@sha256:PREVIOUS_DIGEST|' .env
docker compose pull web
docker compose up -d --no-build --remove-orphans
```

Image rollout and rollback do not replace the PostgreSQL or Payload media volumes.
