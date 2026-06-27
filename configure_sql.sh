#!/bin/bash
set -e

# Configure MSSQL Server silently
# MSSQL_SA_PASSWORD must be provided via the environment — never hardcoded in a tracked file.
: "${MSSQL_SA_PASSWORD:?Set MSSQL_SA_PASSWORD env var before running}"
export MSSQL_PID=Developer
export ACCEPT_EULA=Y

/opt/mssql/bin/mssql-conf setup

# Configure UFW Firewall for SQL Server
ufw allow 1433/tcp
ufw reload || true

# Install SQL Server Command Line Tools (sqlcmd) silently
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | tee /etc/apt/keyrings/microsoft.asc > /dev/null
echo "deb [arch=amd64,armhf,arm64 signed-by=/etc/apt/keyrings/microsoft.asc] https://packages.microsoft.com/ubuntu/22.04/prod jammy main" | tee /etc/apt/sources.list.d/mssql-tools.list > /dev/null
apt-get update
ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev

# Create the NAMA_MEDICAL database
sleep 5
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "CREATE DATABASE NAMA_MEDICAL;"
