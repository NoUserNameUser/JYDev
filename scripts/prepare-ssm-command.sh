#!/usr/bin/env bash

set -Eeuo pipefail

deploy_user="${1:?deploy user is required}"
deploy_path="${2:?deploy path is required}"
image_ref="${3:?image reference is required}"
output_file="${4:-ssm-parameters.json}"

command -v jq >/dev/null || {
  echo "jq is required to build the SSM command payload."
  exit 1
}

compose_b64="$(base64 -w 0 docker-compose.yml)"
deploy_script_b64="$(base64 -w 0 scripts/deploy-prebuilt-image.sh)"

jq -n \
  --arg deploy_user "$deploy_user" \
  --arg deploy_path "$deploy_path" \
  --arg image_ref "$image_ref" \
  --arg compose_b64 "$compose_b64" \
  --arg deploy_script_b64 "$deploy_script_b64" \
  '{
    commands: [
      "set -Eeuo pipefail",
      ("deploy_user=" + ($deploy_user | @sh)),
      ("deploy_path=" + ($deploy_path | @sh)),
      ("image_ref=" + ($image_ref | @sh)),
      "deploy_group=\"$(id -gn \"$deploy_user\")\"",
      "mkdir -p \"$deploy_path\"",
      "chown \"$deploy_user:$deploy_group\" \"$deploy_path\"",
      ("printf %s " + ($compose_b64 | @sh) + " | base64 -d > \"$deploy_path/docker-compose.yml\""),
      ("printf %s " + ($deploy_script_b64 | @sh) + " | base64 -d > \"$deploy_path/deploy-prebuilt-image.sh\""),
      "chown \"$deploy_user:$deploy_group\" \"$deploy_path/docker-compose.yml\" \"$deploy_path/deploy-prebuilt-image.sh\"",
      "chmod 750 \"$deploy_path/deploy-prebuilt-image.sh\"",
      "runuser -u \"$deploy_user\" -- bash \"$deploy_path/deploy-prebuilt-image.sh\" \"$deploy_path\" \"$image_ref\""
    ]
  }' > "$output_file"

jq -e '
  (.commands | type == "array") and
  (.commands | length == 12) and
  (all(.commands[]; type == "string" and length > 0))
' "$output_file" >/dev/null
