#!/bin/bash
# Secrets are read from the environment — never hardcode them in tracked files.
# Required: MSSQL_SA_PASSWORD  (export it before running, e.g. from a secret store / untracked .env)
set -euo pipefail
: "${MSSQL_SA_PASSWORD:?Set MSSQL_SA_PASSWORD env var before running}"
chmod 666 /var/opt/mssql/data/backup_nama_medical.bak
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "RESTORE DATABASE NAMA_MEDICAL FROM DISK='/var/opt/mssql/data/backup_nama_medical.bak' WITH REPLACE, RECOVERY, MOVE 'NAMA_MEDICAL' TO '/var/opt/mssql/data/NAMA_MEDICAL.mdf', MOVE 'NAMA_MEDICAL_log' TO '/var/opt/mssql/data/NAMA_MEDICAL_log.ldf';"
