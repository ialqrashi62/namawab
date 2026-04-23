#!/bin/bash
set -e
mkdir -p /etc/apt/keyrings
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | tee /etc/apt/keyrings/microsoft.asc > /dev/null
echo "deb [arch=amd64,armhf,arm64 signed-by=/etc/apt/keyrings/microsoft.asc] https://packages.microsoft.com/ubuntu/22.04/mssql-server-2022 jammy main" | tee /etc/apt/sources.list.d/mssql-server-2022.list > /dev/null

apt-get update
# Workaround for libssl1.1 missing in Ubuntu 24.04 which mssql needs
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb -O libssl1.1.deb || true
dpkg -i libssl1.1.deb || true
rm -f libssl1.1.deb

apt-get install -y mssql-server
