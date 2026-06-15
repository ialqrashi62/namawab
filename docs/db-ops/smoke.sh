#!/usr/bin/env bash
# smoke.sh — Smoke test critical services after deploy.
# Usage: ./smoke.sh https://api.nama.local

set -euo pipefail

BASE="${1:-http://localhost:8000}"

echo "[$(date -u +%FT%TZ)] Smoke test against $BASE"

ENDPOINTS=(
  "/health"
  "/ready"
  "/version"
  "/api/v1/cardio/orders?status=requested&page_size=1"
  "/api/v1/ed/board"
  "/metrics"
)

for EP in "${ENDPOINTS[@]}"; do
  CODE=$(curl -fsS -o /dev/null -w "%{http_code}" "$BASE$EP" || echo "FAIL")
  echo "  $EP → $CODE"
  if [ "$CODE" = "FAIL" ] || [ "$CODE" -ge 500 ]; then
    echo "Smoke FAILED on $EP"
    exit 1
  fi
done

echo "[$(date -u +%FT%TZ)] Smoke OK"
