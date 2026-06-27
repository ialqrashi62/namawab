#!/bin/bash
# Secrets are read from the environment — never hardcode them in tracked files.
# Required: DATABASE_URL, SESSION_SECRET  (export from a secret store / untracked .env)
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL env var before running}"
: "${SESSION_SECRET:?Set SESSION_SECRET env var before running}"

echo "============================================"
echo "  FULL CLEAN REDEPLOY from namaweb3"
echo "============================================"

echo "=== [1/5] Stopping app ==="
pm2 stop namaweb 2>/dev/null || true
pm2 delete namaweb 2>/dev/null || true

echo "=== [2/5] Dropping & recreating database ==="
sudo -u postgres psql -c "DROP DATABASE IF EXISTS nama_medical_web;"
sudo -u postgres psql -c "CREATE DATABASE nama_medical_web OWNER postgres;"
echo "Database recreated!"

echo "=== [3/5] Deploying uploaded files ==="
rm -rf /var/www/namaweb
cp -r /tmp/namaweb3_upload /var/www/namaweb
cd /var/www/namaweb

echo "=== [4/5] Setting up environment ==="
if [ -f .env.example ]; then
    cp .env.example .env
elif [ ! -f .env ]; then
    umask 077
    cat > .env << ENVEOF
DATABASE_URL=${DATABASE_URL}
SESSION_SECRET=${SESSION_SECRET}
PORT=3000
NODE_ENV=production
ENVEOF
fi
npm install

echo "=== [5/5] Starting app ==="
pm2 start server.js --name namaweb
pm2 save
sleep 5
pm2 logs namaweb --lines 20 --nostream
pm2 list

echo "============================================"
echo "  DONE! http://46.224.178.153"
echo "============================================"
