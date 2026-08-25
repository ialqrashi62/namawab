#!/usr/bin/env bash
# =============================================================================
# NamaMedical ERP — Backup Round-Trip Test
# =============================================================================
# File:         /var/www/namaweb/ops/backup_db_test.sh
# Purpose:      Verify backup_db.sh works by:
#                 1) creating a throwaway DB
#                 2) loading a test schema + sample rows
#                 3) running pg_dump | gzip via backup_db.sh logic
#                 4) restoring into a second throwaway DB
#                 5) comparing row counts (must match)
# Exit code:    0 = round-trip success; 1 = failure
# Safety:       creates DB names backup_test_<pid>_<rand>; drops them on exit
# =============================================================================

set -euo pipefail

APP_ROOT="/var/www/namaweb"
BACKUP_ROOT="${APP_ROOT}/backups/auto"
TEST_DIR="${BACKUP_ROOT}/_test"
PID_TAG="$$"
RAND_TAG="$(head -c4 /dev/urandom | od -An -tx1 | tr -d ' \n')"
SRC_DB="backup_test_src_${PID_TAG}_${RAND_TAG}"
DST_DB="backup_test_dst_${PID_TAG}_${RAND_TAG}"

# Use postgres superuser for admin operations (CREATE/DROP DATABASE,
# CREATE TABLE in throwaway DBs, and RLS-free test data). We do this
# via sudo peer auth to avoid hardcoding a postgres password; the
# script must run as root (or with sudo NOPASSWD to postgres).
# This matches the BACKUP_USER=postgres mode of backup_db.sh.
BACKUP_USER="${BACKUP_USER:-postgres}"
DB_SUPERUSER="${BACKUP_USER}"

run_as_superuser() {
    sudo -n -u "${DB_SUPERUSER}" "$@"
}

cleanup() {
    echo "--- cleanup ---"
    run_as_superuser dropdb --if-exists "${SRC_DB}" 2>/dev/null || true
    run_as_superuser dropdb --if-exists "${DST_DB}" 2>/dev/null || true
    rm -rf "${TEST_DIR}"
}
trap cleanup EXIT

echo "=== round-trip test START (pid=${PID_TAG}) ==="
mkdir -p "${TEST_DIR}"

# 1) Create source DB + test schema
echo "[1/5] create source DB ${SRC_DB}"
run_as_superuser createdb "${SRC_DB}"

echo "[2/5] load schema + sample rows"
run_as_superuser psql -d "${SRC_DB}" -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE test_widgets (
    id          SERIAL PRIMARY KEY,
    sku         TEXT NOT NULL UNIQUE,
    qty         INTEGER NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO test_widgets (sku, qty) VALUES
    ('W-001', 10),
    ('W-002', 20),
    ('W-003', 30),
    ('W-004', 40),
    ('W-005', 50);
SQL

SRC_COUNT=$(run_as_superuser psql -d "${SRC_DB}" -tA -c "SELECT count(*) FROM test_widgets;")
echo "    src rows: ${SRC_COUNT}"

# 2) pg_dump | gzip (same pipeline as backup_db.sh)
echo "[3/5] dump → gzip"
TEST_FILE="${TEST_DIR}/test_${PID_TAG}.sql.gz"
run_as_superuser pg_dump -d "${SRC_DB}" -Fc --no-owner --no-privileges | gzip -9 > "${TEST_FILE}"
echo "    dump size: $(du -h "${TEST_FILE}" | cut -f1)"

# 3) Create destination DB + restore
echo "[4/5] create dst DB ${DST_DB} and restore"
run_as_superuser createdb "${DST_DB}"
gunzip -c "${TEST_FILE}" | run_as_superuser pg_restore -d "${DST_DB}" --no-owner --no-privileges 2>/dev/null || true

# 4) Compare row counts
echo "[5/5] compare row counts"
DST_COUNT=$(run_as_superuser psql -d "${DST_DB}" -tA -c "SELECT count(*) FROM test_widgets;" 2>/dev/null || echo "0")
echo "    dst rows: ${DST_COUNT}"

if [[ "${SRC_COUNT}" == "${DST_COUNT}" && "${SRC_COUNT}" -gt 0 ]]; then
    echo "=== round-trip test OK (rows match: ${SRC_COUNT}) ==="
    exit 0
else
    echo "=== round-trip test FAILED (src=${SRC_COUNT} dst=${DST_COUNT}) ==="
    exit 1
fi
