#!/usr/bin/env bash
# run_full_staging_setup.sh — guarded end-to-end staging setup for Jumanasoft (steps 2-6 of the handoff).
# TEMPLATE — NOT executed by the agent. DevOps runs this ON THE ISOLATED STAGING HOST only.
#
# It REFUSES to run unless the environment is provably staging (hard isolation guard), so it can never
# touch production. It does NOT print secrets. Step 7 (enforce) is intentionally NOT automated here.
#
# Prerequisites (step 1 done by DevOps): isolated staging cluster + role/db created via provision_staging.sql,
# namaweb/.env.staging filled, app reachable on PORT (default 3010).
#
# Required env (set by DevOps; standard libpq vars — never echoed):
#   PGHOST PGPORT PGUSER PGPASSWORD PGDATABASE   (PGDATABASE MUST be jumanasoft_staging)
#   NODE_ENV (must NOT be production)             APP_URL (default http://127.0.0.1:3010)
#
# Usage:  NODE_ENV=staging PGDATABASE=jumanasoft_staging ... bash ops/staging/run_full_staging_setup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MIG="$ROOT/namaweb/migrations"
APP_URL="${APP_URL:-http://127.0.0.1:3010}"

echo "== Jumanasoft staging setup =="

# ---- Step 2: HARD isolation guard (abort on anything production) ----
: "${PGDATABASE:?ABORT: PGDATABASE not set}"
[ "${NODE_ENV:-}" != "production" ] || { echo "ABORT: NODE_ENV=production"; exit 1; }
[ "$PGDATABASE" = "jumanasoft_staging" ] || { echo "ABORT: PGDATABASE='$PGDATABASE' (expected jumanasoft_staging)"; exit 1; }
case "$PGDATABASE" in *nama_medical*) echo "ABORT: production DB name"; exit 1;; esac

read -r DB USR SUPER BYPASS < <(psql -tAF' ' -c \
  "SELECT current_database(), current_user, \
   COALESCE((SELECT rolsuper FROM pg_roles WHERE rolname=current_user),true), \
   COALESCE((SELECT rolbypassrls FROM pg_roles WHERE rolname=current_user),true)")
echo "current_database=$DB  current_user=$USR  rolsuper=$SUPER  rolbypassrls=$BYPASS"
[ "$DB" = "jumanasoft_staging" ] || { echo "ABORT: connected DB is not jumanasoft_staging"; exit 1; }
[ "$SUPER" = "f" ]  || { echo "ABORT: staging role must be NOSUPERUSER"; exit 1; }
[ "$BYPASS" = "f" ] || { echo "ABORT: staging role must be NOBYPASSRLS"; exit 1; }
echo "[OK] isolation verified."

# ---- Step 3: e25 (additive) + validate ----
echo "-- running e25_up --"
psql -v ON_ERROR_STOP=1 -1 -f "$MIG/e25_plans_pricing_candidate_up.sql"
echo "-- validating e25 --"
ALL_OK="$(psql -tA -f "$MIG/e25_plans_pricing_candidate_validate.sql" | tail -n1 | tr -d '[:space:]')"
[ "$ALL_OK" = "t" ] || { echo "ABORT: e25 validate all_ok != t (got '$ALL_OK')"; exit 1; }
echo "[OK] e25 applied + validated (all_ok=t)."

# ---- Step 4: seed synthetic plans ----
echo "-- seeding staging plans --"
psql -v ON_ERROR_STOP=1 -1 -f "$ROOT/ops/staging/seed_staging_plans.sql"
echo "[OK] plans seeded."

# ---- Step 5: observe-only reminder (flags live in .env.staging; do NOT enable enforce here) ----
echo "[ACTION] ensure namaweb/.env.staging has: ENTITLEMENTS_ENABLED=true, ENTITLEMENTS_ENFORCEMENT_MODE=observe, ENTITLEMENTS_FAIL_MODE=allow_existing  then restart: pm2 restart jumanasoft-app-staging"

# ---- Step 6: smoke (resolver + public surface). Assign a tenant + create a user via the UI/API to confirm count growth. ----
echo "-- smoke: health --"
curl -fsS "$APP_URL/api/health" >/dev/null && echo "[OK] health UP"
echo "-- smoke: public plans (active only) --"
curl -fsS "$APP_URL/api/public/plans" | head -c 400; echo
echo "[MANUAL] in Super Admin: assign a staging tenant a plan; confirm GET /api/super-admin/tenants/:id/entitlements shows source=plan (not no_plan/default); create a user via POST /api/settings/users and confirm countTenantUsers grows by 1 (Batch 4D)."

echo "== staging setup complete (observe). Step 7 (enforce) is a SEPARATE, deliberate action: =="
echo "   set ENTITLEMENTS_ENFORCEMENT_MODE=enforce in .env.staging, restart, and run the 4C enforce smoke."
echo "   rollback any time: ENTITLEMENTS_ENFORCEMENT_MODE=observe  OR  ENTITLEMENTS_ENABLED=false."
