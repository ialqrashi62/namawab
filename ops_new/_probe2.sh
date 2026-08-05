#!/usr/bin/env bash
echo "PROBE2_BEGIN"
echo "--- python3 ---"
command -v python3 && python3 --version
echo "--- python ---"
command -v python && python --version 2>&1
echo "--- node ---"
command -v node && node --version
echo "--- pm2 list (raw, 10 lines) ---"
pm2 jlist 2>/dev/null | head -c 400
echo ""
echo "--- pm2 names only ---"
pm2 jlist 2>/dev/null | grep -oE '"name":"[^"]+"' | head -10
echo "--- nginx -t (try) ---"
nginx -t 2>&1 | head -5
echo "--- /etc/nginx/sites-enabled (peek) ---"
ls /etc/nginx/sites-enabled/ 2>&1 | head -5
echo "--- PM2 home for nama_medical? ---"
ls /var/www/namaweb/ops/ | grep -E "smoke|test" || echo "no smoke scripts yet"
echo "PROBE2_END"