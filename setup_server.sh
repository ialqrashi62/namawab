#!/bin/bash
# DB_PASSWORD must be provided via the environment — never hardcoded in a tracked file.
set -euo pipefail
: "${DB_PASSWORD:?Set DB_PASSWORD env var before running}"

echo "=== [1/5] Installing Node.js 20 LTS ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
echo "Node: $(node --version) | NPM: $(npm --version)"

echo "=== [2/5] Installing PostgreSQL ==="
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER namasoft WITH PASSWORD '${DB_PASSWORD}';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE namasoft OWNER namasoft;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE namasoft TO namasoft;" 2>/dev/null || true

echo "=== [3/5] Installing Nginx ==="
apt-get install -y nginx
systemctl enable nginx

echo "=== [4/5] Installing PM2 ==="
npm install -g pm2

echo "=== [5/5] Creating app directory ==="
mkdir -p /var/www/namaweb

echo "=== ALL DONE ==="
node --version
npm --version
psql --version
nginx -v 2>&1
pm2 --version
