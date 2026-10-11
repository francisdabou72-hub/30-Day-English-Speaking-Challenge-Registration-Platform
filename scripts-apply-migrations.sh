#!/usr/bin/env bash
set -euo pipefail

# Load env
if [[ ! -f .env.local ]]; then
  echo "ERROR: .env.local not found"; exit 1
fi
set -a; source .env.local; set +a

: "${NEXT_PUBLIC_SUPABASE_URL:?missing NEXT_PUBLIC_SUPABASE_URL}"
: "${SUPABASE_SERVICE_ROLE_KEY:?missing SUPABASE_SERVICE_ROLE_KEY}"

# Supabase Management API endpoint (requires personal access token)
if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "ERROR: SUPABASE_ACCESS_TOKEN not set."
  echo "This is a personal access token (Settings -> Account -> Access Tokens), not the service key."
  echo "Get one at: https://supabase.com/dashboard/account/tokens"
  echo ""
  echo "Alternative: paste each file into the Supabase SQL Editor manually in order:"
  ls -1 supabase/migrations/*.sql
  exit 1
fi

PROJECT_REF="$(echo "$NEXT_PUBLIC_SUPABASE_URL" | sed -E 's#https://([^.]+)\.supabase\.co#\1#')"

echo "Project ref: $PROJECT_REF"
for f in supabase/migrations/*.sql; do
  echo "--- Applying $f ---"
  sql="$(cat "$f")"
  curl -sS -X POST \
    "https://api.supabase.com/v1/projects/$PROJECT_REF/database/query" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    --data "$(jq -Rs '{query: .}' <<< "$sql")" \
    | head -c 500
  echo ""
done
echo "=== ALL MIGRATIONS APPLIED ==="
