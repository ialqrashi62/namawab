#!/bin/bash
# Secrets are read from the environment — never hardcode them in tracked files.
# Required: MSSQL_SA_PASSWORD
set -euo pipefail
: "${MSSQL_SA_PASSWORD:?Set MSSQL_SA_PASSWORD env var before running}"

wget http://archive.ubuntu.com/ubuntu/pool/main/o/openldap/libldap-2.5-0_2.5.16+dfsg-0ubuntu0.22.04.2_amd64.deb -O libldap.deb || true
dpkg -i libldap.deb || true
rm -f libldap.deb

systemctl restart mssql-server
sleep 5

systemctl status mssql-server

/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "CREATE DATABASE NAMA_MEDICAL;"
