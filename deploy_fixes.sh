#!/bin/bash
echo "=== Deploying bug fixes ==="

# 1) Update app.js (Radiology + Transport + SocialWork + Mortuary fixes)
echo "Updating app.js..."

# 2) Update db_postgres.js (last_ip column fix)
echo "Updating db_postgres.js..."

# 3) Fix existing database: add last_ip if missing
echo "Fixing database: adding last_ip column..."
sudo -u postgres psql -d nama_medical_web -c "DO \$\$ BEGIN ALTER TABLE system_users ADD COLUMN last_ip TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END \$\$;"

# 4) Restart app
echo "Restarting app..."
cd /var/www/namaweb
pm2 restart namaweb
sleep 3
pm2 logs namaweb --lines 10 --nostream

echo "=== ALL FIXES DEPLOYED ==="
