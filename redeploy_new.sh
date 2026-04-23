#!/bin/bash
set -e

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
    cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nama_medical_web
SESSION_SECRET=nama_medical_secret_2024
PORT=3000
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
