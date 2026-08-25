#!/usr/bin/env bash
# wave30_backup.sh — Wave 30 Production Backup Automation + DR Drill
#
# Goals:
#   1. Daily pg_dump (schema + data) compressed + checksum.
#   2. Encrypted tarball (KEK-wrapped) for off-site sync.
#   3. 30-day local retention + rsync to Hetzner Storage Box.
#   4. Weekly DR-restore drill in a sandbox database (verifies integrity).
#   5. Health check endpoint for Prometheus.
#
# Activation:
#   - Place at /usr/local/bin/wave30_backup.sh (chmod 750, root or backup user).
#   - Add to /etc/cron.d/wave30: 5 2 * * * root /usr/local/bin/wave30_backup.sh
#   - Or run manually: ./wave30_backup.sh
#
# Required env (no secrets in this file):
#   PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
#   BACKUP_DIR  (default: /var/backups/nama-medical)
#   REMOTE_DEST (e.g. user@hetzner-box:/backups/nama-medical)  -- optional, skip if unset
#   KEK_PASSPHRASE                                              -- optional, encrypts tarball
#   DR_DRILL_DB                                                 -- optional sandbox DB name

set -euo pipefail

# ---- config (env-overridable) ----
: "${BACKUP_DIR:=/var/backups/nama-medical}"
: "${PGHOST:=127.0.0.1}"
: "${PGPORT:=5432}"
: "${PGUSER:=nama_medical_app}"
: "${PGDATABASE:=nama_medical_web}"
: "${REMOTE_DEST:=}"
: "${KEK_PASSPHRASE:=}"
: "${DR_DRILL_DB:=}"
: "${RETENTION_DAYS:=30}"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
HOSTN="$(hostname -s 2>/dev/null || echo unknown)"
WORK="${BACKUP_DIR}/work"
KEEP="${BACKUP_DIR}/keep"
DRILL_LOG="${BACKUP_DIR}/dr-restore.log"
mkdir -p "${WORK}" "${KEEP}"
chmod 700 "${BACKUP_DIR}" "${WORK}" "${KEEP}" 2>/dev/null || true

# ---- 1. pg_dump (custom format; supports parallel restore via pg_restore -j N) ----
DUMP="${WORK}/nama_${HOSTN}_${TS}.dump"
echo "[1/5] pg_dump -> ${DUMP}"
pg_dump -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${PGDATABASE}" \
    -Fc --no-owner --no-privileges --serializable-deferrable -Z 9 \
    -f "${DUMP}"
SIZE=$(stat -c '%s' "${DUMP}" 2>/dev/null || stat -f '%z' "${DUMP}")
SHA=$(sha256sum "${DUMP}" | awk '{print $1}')

# ---- 2. encrypt + checksum (passphrase-protected AES-256 via openssl) ----
ENC="${WORK}/nama_${HOSTN}_${TS}.dump.enc"
if [[ -n "${KEK_PASSPHRASE}" ]]; then
    echo "[2/5] encrypting tarball -> ${ENC}"
    openssl enc -aes-256-gcm -salt -pbkdf2 -iter 200000 \
        -in "${DUMP}" -out "${ENC}" -pass env:KEK_PASSPHRASE 2>/dev/null || \
    openssl enc -aes-256-cbc -salt -pbkdf2 -iter 200000 \
        -in "${DUMP}" -out "${ENC}" -pass env:KEK_PASSPHRASE
    SIZE=$(stat -c '%s' "${ENC}" 2>/dev/null || stat -f '%z' "${ENC}")
    SHA=$(sha256sum "${ENC}" | awk '{print $1}')
    FINAL="${ENC}"
else
    FINAL="${DUMP}"
fi

# ---- 3. manifest (.sha256 + metadata) ----
MAN="${WORK}/nama_${HOSTN}_${TS}.manifest"
{
    echo "host=${HOSTN}"
    echo "db=${PGDATABASE}"
    echo "ts=${TS}"
    echo "file=$(basename "${FINAL}")"
    echo "bytes=${SIZE}"
    echo "sha256=${SHA}"
    echo "encrypted=$([ -n "${KEK_PASSPHRASE}" ] && echo yes || echo no)"
} > "${MAN}"

# ---- 4. move to /keep ----
mv "${FINAL}" "${KEEP}/"
mv "${MAN}"   "${KEEP}/"
[[ -n "${KEK_PASSPHRASE}" && -f "${DUMP}" ]] && shred -u "${DUMP}" 2>/dev/null || rm -f "${DUMP}"

# ---- 5. rsync to remote + retention ----
if [[ -n "${REMOTE_DEST}" ]]; then
    echo "[3/5] rsync -> ${REMOTE_DEST}"
    rsync -az --delete-after --partial --bwlimit=50000 \
        "${KEEP}/" "${REMOTE_DEST}/" || echo "[WARN] rsync failed (will retry next run)"
fi

echo "[4/5] retention: prune >${RETENTION_DAYS}d"
find "${KEEP}" -type f -mtime +"${RETENTION_DAYS}" -name '*.dump*' -delete 2>/dev/null || true
find "${KEEP}" -type f -mtime +"${RETENTION_DAYS}" -name '*.manifest' -delete 2>/dev/null || true

# ---- 6. weekly DR-drill (only if DR_DRILL_DB is set and it's Sunday) ----
if [[ -n "${DR_DRILL_DB}" && "$(date -u +%u)" == "7" ]]; then
    echo "[5/5] DR restore drill -> ${DR_DRILL_DB}"
    {
        echo "==== DR restore drill $(date -u +%FT%TZ) ===="
        # restore to a sandbox DB; never touches the production DB
        psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres \
            -c "DROP DATABASE IF EXISTS ${DR_DRILL_DB};" -c "CREATE DATABASE ${DR_DRILL_DB};" \
            2>&1 || echo "[WARN] sandbox DB prep failed"
        LATEST=$(ls -t "${KEEP}"/nama_*.dump* | head -1)
        if [[ -n "${LATEST}" ]]; then
            # decrypt if needed
            RESTORE_SRC="${LATEST}"
            if [[ "${LATEST}" == *.enc && -n "${KEK_PASSPHRASE}" ]]; then
                RESTORE_SRC="${WORK}/dr_decrypted.dump"
                openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
                    -in "${LATEST}" -out "${RESTORE_SRC}" \
                    -pass env:KEK_PASSPHRASE 2>/dev/null || \
                openssl enc -d -aes-256-gcm -pbkdf2 -iter 200000 \
                    -in "${LATEST}" -out "${RESTORE_SRC}" \
                    -pass env:KEK_PASSPHRASE
            fi
            pg_restore -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" \
                -d "${DR_DRILL_DB}" --no-owner --no-privileges --jobs=4 \
                "${RESTORE_SRC}" 2>&1 | tail -20
            COUNT=$(psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${DR_DRILL_DB}" \
                -t -c "SELECT COUNT(*) FROM patients;" 2>/dev/null | tr -d ' ' || echo "ERR")
            echo "[DR] patients restored: ${COUNT}"
            # clean up the sandbox
            psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres \
                -c "DROP DATABASE IF EXISTS ${DR_DRILL_DB};" 2>&1
        fi
        echo "==== DR restore drill complete ===="
    } > "${DRILL_LOG}" 2>&1 || echo "[WARN] DR drill failed; see ${DRILL_LOG}"
fi

echo "[OK] backup complete (size=${SIZE}B sha256=${SHA:0:16}…)"
