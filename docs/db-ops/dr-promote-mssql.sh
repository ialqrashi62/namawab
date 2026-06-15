#!/usr/bin/env bash
# dr-promote-mssql.sh — Promote DR replica to primary during DR failover.
# Usage: ./dr-promote-mssql.sh
# Pre-req: kubectl context = DR cluster; sqlcmd in PATH.

set -euo pipefail

DR_HOST="${DR_HOST:-mssql-dr.nama.svc.cluster.local}"
DR_USER="${DR_USER:-sa}"
DR_PASS="${DR_PASS:?must be set via env or Vault}"
AG_NAME="${AG_NAME:-nama_ag}"

echo "[$(date -u +%FT%TZ)] Starting DR promotion of $AG_NAME on $DR_HOST"

# 1. Verify DR replica is sync-able
sqlcmd -S "$DR_HOST" -U "$DR_USER" -P "$DR_PASS" -Q "
SELECT replica_server_name, role_desc, synchronization_health_desc
FROM sys.dm_hadr_availability_replica_states s
JOIN sys.availability_replicas r ON s.replica_id = r.replica_id
WHERE r.group_id = (SELECT group_id FROM sys.availability_groups WHERE name = '$AG_NAME');
" -h-1

read -r -p "Proceed with FORCE FAILOVER (data loss possible)? type 'YES' to confirm: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted."
  exit 1
fi

# 2. Force failover (allow data loss in disaster scenario)
sqlcmd -S "$DR_HOST" -U "$DR_USER" -P "$DR_PASS" -Q "
ALTER AVAILABILITY GROUP $AG_NAME FORCE_FAILOVER_ALLOW_DATA_LOSS;
"

echo "[$(date -u +%FT%TZ)] FORCE_FAILOVER_ALLOW_DATA_LOSS issued."

# 3. Verify new primary
sqlcmd -S "$DR_HOST" -U "$DR_USER" -P "$DR_PASS" -Q "
SELECT replica_server_name, role_desc
FROM sys.dm_hadr_availability_replica_states s
JOIN sys.availability_replicas r ON s.replica_id = r.replica_id
WHERE r.group_id = (SELECT group_id FROM sys.availability_groups WHERE name = '$AG_NAME');
" -h-1

# 4. Smoke test
sqlcmd -S "$DR_HOST" -U "$DR_USER" -P "$DR_PASS" -d nama_prod -Q "SELECT TOP 1 GETDATE();"

echo "[$(date -u +%FT%TZ)] DR promotion complete. Update DNS via dr-dns-flip.sh."
