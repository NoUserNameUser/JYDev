# GHCR-based EC2 deployment

The production workflow builds the image on GitHub Actions and makes EC2 perform only three cheap
operations: authenticate, pull, and restart with `--no-build`. This removes `npm ci` and
`next build` from the small instance, which is the root cause of build-time exit code 137.

## GitHub configuration

Create a GitHub environment named `production`; the deploy job and OIDC trust policy both use that
exact environment name.

Repository secrets:

- `AWS_DEPLOY_ROLE_ARN`: IAM role GitHub Actions assumes through OIDC to call SSM.

Repository variables:

- `AWS_REGION`: EC2 region, for example `us-west-2`.
- `EC2_INSTANCE_ID`: target managed instance, for example `i-0123456789abcdef0`.
- `DEPLOY_PATH`: absolute server path, `/var/www/html/jackiey.me` for this site.
- `DEPLOY_USER`: Linux runtime user; defaults to `ec2-user`.
- `NEXT_PUBLIC_SITE_URL`: production URL used during the Next.js build.
- `DEPLOY_PLATFORM`: `linux/amd64` for x86 EC2 or `linux/arm64` for Graviton; defaults to amd64.
- `BUILD_NODE_OPTIONS`: optional runner build limit; defaults to `--max-old-space-size=2048`.

The workflow sends `docker-compose.yml` and `scripts/deploy-prebuilt-image.sh` through SSM Run
Command. EC2 needs no public SSH rule, Node.js, npm, Git checkout, or build memory. It needs SSM
Agent, Docker Engine, Docker Compose v2, `curl`, a populated `.env`, and disk for two image
generations during rollout.

## GHCR

GitHub Actions pushes to GHCR with its short-lived `GITHUB_TOKEN`, so no push secret is
required. New packages are private by default. Either make the package public or log in once on EC2
with a classic PAT containing only `read:packages`:

```bash
echo "$GHCR_READ_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USER --password-stdin
```

Run this as the same Linux user stored in `DEPLOY_USER`; Docker retains the login for later pulls.

## EC2 and SSM setup

```bash
sudo systemctl enable --now amazon-ssm-agent
sudo usermod -aG docker ec2-user
sudo mkdir -p /var/www/html/jackiey.me
sudo chown -R ec2-user:ec2-user /var/www/html/jackiey.me
sudo chmod 750 /var/www/html/jackiey.me
cd /var/www/html/jackiey.me
# Create .env from .env.production.example and fill every required value.
sudo chown ec2-user:ec2-user .env
sudo chmod 600 .env
```

Log out and reconnect after adding `ec2-user` to the Docker group. Run the GHCR login command from
the previous section as `ec2-user`, never with `sudo`, so SSM deployments can reuse that user's
Docker credentials.

Attach an EC2 instance profile containing the AWS managed policy
`AmazonSSMManagedInstanceCore`. Confirm the instance appears as a managed node in Systems Manager
before triggering a deployment. No inbound port 22 rule is required; the instance only needs
outbound HTTPS access to SSM and GHCR.

The `.env` must include the site URL, database, Postgres, Payload, revalidation, CORS, and Telegram
values from `.env.production.example`. The workflow owns `WEB_IMAGE` and changes it to an immutable
digest after every successful build.

## GitHub OIDC deployment role

Create GitHub's OIDC provider in IAM with provider URL
`https://token.actions.githubusercontent.com` and audience `sts.amazonaws.com`. The role trust
policy should restrict access to this repository's `production` environment:

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
        "token.actions.githubusercontent.com:sub": "repo:NoUserNameUser/JYDev:environment:production"
      }
    }
  }]
}
```

Give that role permission to send the approved shell document only to this EC2 instance and read
the result. Replace the region, account, and instance placeholders:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ssm:SendCommand",
      "Resource": [
        "arn:aws:ssm:AWS_REGION::document/AWS-RunShellScript",
        "arn:aws:ec2:AWS_REGION:AWS_ACCOUNT_ID:instance/EC2_INSTANCE_ID"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "ssm:GetCommandInvocation",
      "Resource": "*"
    }
  ]
}
```

Save the role ARN as the `AWS_DEPLOY_ROLE_ARN` repository secret. The workflow receives temporary
AWS credentials; no permanent AWS access key is stored in GitHub or on EC2.

Merging to `master` starts `CI`; a successful CI run starts `Deploy production`. The workflow then:

1. Builds and caches the image on GitHub Actions.
2. Pushes `latest`, a commit tag, and an immutable digest to GHCR.
3. Sends current deployment assets to EC2 using `AWS-RunShellScript`.
4. SSM runs the deployment as `ec2-user`, including `docker compose pull` and `up --no-build`.
5. Waits up to 120 seconds for the homepage health check; on failure it restores the previous image
   and prints container logs.

Do not run `docker compose up --build` on the EC2 instance. A swap file can provide runtime safety
for a very small host, but it is not part of the build path and is no longer needed to compile the
application.

## Rollback

Copy a previous image digest from GHCR or an earlier Actions run, then on EC2:

```bash
cd /var/www/html/jackiey.me
sed -i 's|^WEB_IMAGE=.*|WEB_IMAGE=ghcr.io/nousernameuser/jydev@sha256:PREVIOUS_DIGEST|' .env
docker compose pull web
docker compose up -d --no-build --remove-orphans
```

Image rollout and rollback do not replace the PostgreSQL or Payload media volumes.
