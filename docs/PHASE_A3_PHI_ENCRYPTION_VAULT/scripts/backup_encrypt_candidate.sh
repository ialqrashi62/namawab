#!/usr/bin/env bash
# backup_encrypt_candidate.sh — CANDIDATE, DO NOT EXECUTE as-is. Encrypted DB backup for NamaMedical (Ubuntu host).
# Key MUST come from KMS/secret store at runtime; never hardcode/commit a key.
set -euo pipefail
: "${NAMA_BACKUP_KEY_CMD:?provide a command that prints the symmetric key, e.g. from KMS}"   # e.g. aws kms decrypt ...
DB="${1:-nama_medical_web}"
OUT="${2:-/var/nama_backups}/nama_$(date +%Y%m%d_%H%M%S).sql.gpg"
mkdir -p "$(dirname "$OUT")"
# pg_dump piped straight into symmetric encryption (key from KMS via stdin); plaintext never hits disk
pg_dump "$DB" | gpg --batch --symmetric --cipher-algo AES256 --passphrase-fd 3 -o "$OUT" 3< <("$NAMA_BACKUP_KEY_CMD")
echo "encrypted backup written: $OUT  (then sync offsite; verify restore in isolated drill)"
# Restore (drill): gpg --batch --decrypt --passphrase-fd 3 "$OUT" 3< <("$NAMA_BACKUP_KEY_CMD") | psql <isolated_db>
