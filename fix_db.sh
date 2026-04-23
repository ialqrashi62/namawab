#!/bin/bash
sudo -u postgres psql -d nama_medical_web -c "ALTER TABLE system_users ADD COLUMN IF NOT EXISTS last_ip TEXT DEFAULT '';"
echo "DONE! last_ip column added"
pm2 restart namaweb
sleep 3
pm2 logs namaweb --lines 5 --nostream
