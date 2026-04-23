#!/bin/bash
set -e

# Configure MSSQL Server silently
export MSSQL_PID=Developer
export ACCEPT_EULA=Y
export MSSQL_SA_PASSWORD='NamaMedical@2026!'

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
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'NamaMedical@2026!' -Q "CREATE DATABASE NAMA_MEDICAL;"
