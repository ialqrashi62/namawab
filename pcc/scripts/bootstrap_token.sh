#!/bin/bash
# bootstrap_token.sh — first-time setup for live deployment
# USAGE: ./bootstrap_token.sh [BASE_URL]
# REQUIRES: psql in PATH, PCC_DB_* env vars set
# PRINTS: bootstrap token to stdout (only)

set -euo pipefail

BASE_URL="${1:-${PCC_BASE:-http://localhost:3100}}"
SNAPSHOT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/snapshots"
TOKEN_FILE="$(cd "$(dirname "$0")/.." && pwd)/scratch/bootstrap_token.txt"

echo "============================================================"
echo " PCC v3.316.28 bootstrap"
echo " Target: $BASE_URL"
echo "============================================================"

# 1. Run migration
echo ""
echo "[1] Applying pcc_api_tokens_v3.316.25_up.sql migration"
if [ -n "${PCC_DB_HOST:-}" ]; then
  PGPASSWORD="${PCC_DB_PASSWORD:-}" psql \
    -h "$PCC_DB_HOST" \
    -U "${PCC_DB_USER:-nama_pcc_app}" \
    -d "${PCC_DB_NAME:-nama_medical}" \
    -f "$(dirname "$0")/../migrations/pcc_api_tokens_v3.316.25_up.sql" || {
    echo "  Migration failed (PG might be unreachable) — continuing to token issuance anyway"
  }
else
  echo "  PCC_DB_HOST not set — skipping migration (assumed already applied)"
fi

# 2. Issue bootstrap token
echo ""
echo "[2] Issuing bootstrap token via PCC API"
mkdir -p "$(dirname "$TOKEN_FILE")"
RESP=$(curl -sS -X POST "$BASE_URL/api/v1/pcc-catalog/api-token" \
  -H "Content-Type: application/json" \
  -d '{"label":"bootstrap"}' 2>&1) || {
  echo "  ERROR: token request failed"
  echo "  Response: $RESP"
  exit 1
}

TOKEN=$(echo "$RESP" | node -e "
let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
  try { console.log(JSON.parse(d).token || ''); } catch(e) { console.log(''); }
});
" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "  ERROR: could not extract token from response:"
  echo "  $RESP"
  exit 1
fi

# 3. Save token securely
echo "$TOKEN" > "$TOKEN_FILE"
chmod 600 "$TOKEN_FILE" 2>/dev/null || true

# 4. Print summary
EXPIRES=$(echo "$RESP" | node -e "
let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
  try { console.log(JSON.parse(d).expires_at || 'unknown'); } catch(e) { console.log('unknown'); }
});
" 2>/dev/null)

echo ""
echo "============================================================"
echo " ✓ Bootstrap token issued"
echo "   Token:       $TOKEN"
echo "   Prefix:      ${TOKEN:0:8}..."
echo "   Expires:     $EXPIRES"
echo "   Label:       bootstrap"
echo "   Storage:     PG pcc_api_tokens"
echo "============================================================"
echo ""
echo "Usage:"
echo "  export PCC_API_TOKEN=$TOKEN"
echo "  curl -H \"Authorization: Bearer \$PCC_API_TOKEN\" $BASE_URL/api/v1/pcc-catalog/api-token"
echo ""
echo "Token also saved to: $TOKEN_FILE"
