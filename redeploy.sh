#!/bin/bash
set -e

echo "============================================"
echo "  FULL CLEAN REDEPLOY - Nama Medical Web"
echo "  + ZATCA E-Invoicing Integration"
echo "============================================"

echo "=== [1/6] Stopping app ==="
pm2 stop namaweb 2>/dev/null || true
pm2 delete namaweb 2>/dev/null || true

echo "=== [2/6] Dropping & recreating database ==="
sudo -u postgres psql -c "DROP DATABASE IF EXISTS nama_medical_web;"
sudo -u postgres psql -c "CREATE DATABASE nama_medical_web OWNER postgres;"
echo "Database recreated!"

echo "=== [3/6] Cleaning old files ==="
rm -rf /var/www/namaweb

echo "=== [4/6] Copying project from upload ==="
cp -r /tmp/namawab_upload /var/www/namaweb
cd /var/www/namaweb

echo "=== [5/6] Setting up environment ==="
cp .env.example .env
npm install

echo "=== [6/6] Starting app ==="
pm2 start server.js --name namaweb
pm2 save
sleep 5
pm2 logs namaweb --lines 20 --nostream

echo ""
pm2 list
echo "============================================"
echo "  DONE! http://46.224.178.153"
echo "  ZATCA E-Invoice: Configured!"
echo "============================================"
