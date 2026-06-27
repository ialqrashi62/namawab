#!/usr/bin/env bash
# backup-verify.sh — Restore last night's backup to staging + verify row counts.
# Run nightly via cron; alerts if anything fails.

set -euo pipefail

BACKUP_BUCKET="${BACKUP_BUCKET:-nama-backups}"
STAGING_HOST="${STAGING_HOST:-mssql-staging.nama.svc.cluster.local}"
SA_PASS="${SA_PASS:?required}"
DB="${DB:-nama_prod}"
DATE_TAG="$(date -u +%F)"

echo "[$(date -u +%FT%TZ)] Verifying backup for $DATE_TAG"

# 1. Pull latest backup from MinIO
mc cp "minio/${BACKUP_BUCKET}/${DB}/${DATE_TAG}.bak" /tmp/restore.bak

# 2. Restore to staging as nama_verify
sqlcmd -S "$STAGING_HOST" -U sa -P "$SA_PASS" -Q "
IF DB_ID('nama_verify') IS NOT NULL
    ALTER DATABASE nama_verify SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
RESTORE DATABASE nama_verify FROM DISK = '/tmp/restore.bak'
WITH MOVE 'nama_data' TO '/var/opt/mssql/data/nama_verify.mdf',
     MOVE 'nama_log'  TO '/var/opt/mssql/data/nama_verify.ldf',
     REPLACE, RECOVERY;
"

# 3. Sanity counts
PATIENT_COUNT=$(sqlcmd -S "$STAGING_HOST" -U sa -P "$SA_PASS" -d nama_verify -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM patients;" -h-1 | tr -d ' \r\n')
ORDERS_COUNT=$(sqlcmd  -S "$STAGING_HOST" -U sa -P "$SA_PASS" -d nama_verify -Q "SET NOCOUNT ON; SELECT COUNT(*) FROM cardio_orders;" -h-1 | tr -d ' \r\n')

echo "patients=$PATIENT_COUNT  cardio_orders=$ORDERS_COUNT"

if [ "$PATIENT_COUNT" -lt 1 ]; then
  echo "FAIL: zero patients in restored DB"
  exit 1
fi

# 4. Drop verify DB
sqlcmd -S "$STAGING_HOST" -U sa -P "$SA_PASS" -Q "DROP DATABASE nama_verify;"

# 5. Emit metric (Pushgateway) for observability
cat <<EOF | curl --data-binary @- http://pushgateway.nama.svc.cluster.local:9091/metrics/job/backup_verify
# TYPE backup_verify_success gauge
backup_verify_success{db="$DB"} 1
# TYPE backup_verify_patients gauge
backup_verify_patients{db="$DB"} $PATIENT_COUNT
EOF

echo "[$(date -u +%FT%TZ)] Backup verified OK"
