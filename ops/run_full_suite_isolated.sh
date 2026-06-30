#!/usr/bin/env bash
# run_full_suite_isolated.sh
# Run the FULL namaweb test suite (incl. cross-tenant/RLS integration tests) against an
# ISOLATED test database — never production. Provides the missing piece that the code-box
# environment could not do (the only local DB there is production nama_medical_web).
#
# PREREQUISITES (owner provides — agent never sees these):
#   - A test DB already provisioned with the production schema (apply migrations/*_up.sql via your
#     normal migration flow) and the nama_medical_app role + grants, so RLS behaves like prod.
#   - Env: TEST_DB_NAME (e.g. nama_medical_test), DB_HOST, DB_PORT, DB_USER, DB_PASSWORD for that DB.
#
# HARD SAFETY: refuses to run if the target DB looks like production.
set -euo pipefail

TEST_DB_NAME="${TEST_DB_NAME:-nama_medical_test}"

# ---- PRODUCTION GUARD (fail-closed) ----
case "$TEST_DB_NAME" in
  nama_medical_web|*prod*|*production*)
    echo "ABORT: '$TEST_DB_NAME' looks like PRODUCTION. This script only runs against an isolated test DB." >&2
    exit 2;;
esac
if [ "${NODE_ENV:-}" = "production" ]; then
  echo "ABORT: NODE_ENV=production. Unset it (tests need a non-prod env)." >&2
  exit 2
fi

echo "== Isolated full-suite run =="
echo "Target test DB : $TEST_DB_NAME @ ${DB_HOST:-localhost}:${DB_PORT:-5432}"
echo "NODE_ENV       : ${NODE_ENV:-test}"

cd "$(dirname "$0")/../namaweb"

export DB_NAME="$TEST_DB_NAME"
export NODE_ENV="${NODE_ENV:-test}"

# Confirm we are NOT pointed at production before doing anything
ACTUAL=$(node -e "const {pool}=require('./db_postgres'); pool.query('SELECT current_database()').then(r=>{console.log(r.rows[0].current_database);process.exit(0)}).catch(e=>{console.error(e.message);process.exit(1)})")
if [ "$ACTUAL" = "nama_medical_web" ]; then
  echo "ABORT: connected DB resolved to production nama_medical_web." >&2
  exit 2
fi
echo "Confirmed connected to: $ACTUAL (not production)."

echo "== Running full suite (run_all_tests.js) =="
node run_all_tests.js
echo "== Done. Review pass/fail summary above. =="
