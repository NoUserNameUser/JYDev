#!/usr/bin/env bash

set -Eeuo pipefail

deploy_path="${1:?deployment path is required}"
image_ref="${2:?image reference is required}"

cd "$deploy_path"

if [[ ! -f .env ]]; then
  echo "Missing $deploy_path/.env. Create it from .env.production.example before deploying."
  exit 1
fi

previous_image="$(sed -n 's/^WEB_IMAGE=//p' .env | tail -n 1)"
deployment_started=false

rollback() {
  if [[ "$deployment_started" != true || -z "$previous_image" || "$previous_image" == "$image_ref" ]]; then
    return
  fi

  echo "Restoring previous image: $previous_image"
  set +e
  sed -i "s|^WEB_IMAGE=.*|WEB_IMAGE=$previous_image|" .env
  docker compose pull web
  docker compose up -d --no-build --remove-orphans
}

on_exit() {
  status=$?
  [[ "$status" -eq 0 ]] || rollback
  exit "$status"
}
trap on_exit EXIT

if grep -q '^WEB_IMAGE=' .env; then
  sed -i "s|^WEB_IMAGE=.*|WEB_IMAGE=$image_ref|" .env
else
  printf '\nWEB_IMAGE=%s\n' "$image_ref" >> .env
fi
deployment_started=true

docker compose config --quiet
docker compose pull web
docker compose up -d --no-build --remove-orphans

for attempt in $(seq 1 30); do
  if curl --fail --silent --show-error http://127.0.0.1:3000/ >/dev/null; then
    docker compose ps
    trap - EXIT
    echo "Deployment healthy: $image_ref"
    exit 0
  fi

  if [[ "$attempt" -lt 30 ]]; then
    sleep 4
  fi
done

echo "Deployment did not become healthy within 120 seconds."
docker compose ps
docker compose logs --tail=100 web
exit 1
