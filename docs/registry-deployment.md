# Registry-based EC2 deployment

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
- `DEPLOY_REGISTRY`: `ghcr` or `ecr`; defaults to `ghcr`.
- `DEPLOY_PLATFORM`: `linux/amd64` for x86 EC2 or `linux/arm64` for Graviton; defaults to amd64.
- `BUILD_NODE_OPTIONS`: optional runner build limit; defaults to `--max-old-space-size=2048`.

The workflow uploads `docker-compose.yml` and `scripts/deploy-prebuilt-image.sh`, so EC2 does not
need Node.js, npm, a Git checkout, or enough RAM for a build. It does need Docker Engine, Docker
Compose v2, `curl`, a populated `.env`, and disk for two image generations during rollout.

## GHCR

GHCR is the default. GitHub Actions pushes with its short-lived `GITHUB_TOKEN`, so no push secret is
required. New packages are private by default. Either make the package public or log in once on EC2
with a classic PAT containing only `read:packages`:

```bash
echo "$GHCR_READ_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
```

Run this as the same Linux user stored in `DEPLOY_USER`; Docker retains the login for later pulls.

## ECR

Additional GitHub settings:

- Secret `AWS_DEPLOY_ROLE_ARN`: IAM role assumed by GitHub Actions using OIDC.
- Variable `AWS_REGION`: for example `us-west-2`.
- Variable `ECR_REPOSITORY`: optional; defaults to the lower-case GitHub repository name.

Create GitHub's OIDC identity provider in AWS. Then restrict the role trust to this repository and
branch (replace `AWS_ACCOUNT_ID` if necessary):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:NoUserNameUser/JYDev:ref:refs/heads/master"
      }
    }
  }]
}
```

Give that role permission to create the ECR repository on first use and push images:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:CreateRepository",
        "ecr:DescribeRepositories"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart"
      ],
      "Resource": "arn:aws:ecr:AWS_REGION:AWS_ACCOUNT_ID:repository/ECR_REPOSITORY"
    }
  ]
}
```

Attach an EC2 instance role with `ecr:GetAuthorizationToken`, `ecr:BatchGetImage`, and
`ecr:GetDownloadUrlForLayer`, and install AWS CLI v2. The server then obtains temporary ECR login
credentials from its instance role; no permanent AWS key is stored on EC2.

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
2. Pushes `latest`, a commit tag, and an immutable digest to the selected registry.
3. Uploads current deployment assets over SSH.
4. Runs `docker compose pull web` and `docker compose up -d --no-build --remove-orphans`.
5. Waits up to 120 seconds for the homepage health check; on failure it restores the previous image
   and prints container logs.

Do not run `docker compose up --build` on the EC2 instance. A swap file can provide runtime safety
for a very small host, but it is not part of the build path and is no longer needed to compile the
application.

## Rollback

Copy a previous image digest from GHCR/ECR or an earlier Actions run, then on EC2:

```bash
cd /opt/jydev
sed -i 's|^WEB_IMAGE=.*|WEB_IMAGE=REGISTRY/IMAGE@sha256:PREVIOUS_DIGEST|' .env
docker compose pull web
docker compose up -d --no-build --remove-orphans
```

Image rollout and rollback do not replace the PostgreSQL or Payload media volumes.
