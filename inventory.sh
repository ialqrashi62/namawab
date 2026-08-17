#!/bin/bash
cd /var/www/namaweb
echo "=== ENGINES ==="
ls -1 | grep "tier.*ext.*engine.js" | wc -l
echo "=== ROUTERS ==="
ls -1 | grep "tier.*ext.*router.js" | wc -l
echo "=== MIGRATIONS ==="
ls -1 migrations/ | grep ".sql" | wc -l
echo "=== TIER TABLES ==="
PGPASSWORD=NamaMedicalApp@2026! psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc "SELECT count(*) FROM pg_tables WHERE tablename LIKE 'tier%'"
echo "=== ALL PUBLIC TABLES ==="
PGPASSWORD=NamaMedicalApp@2026! psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -tAc "SELECT count(*) FROM pg_tables WHERE schemaname='public'"
echo "=== ROUTE PREFIXES ==="
grep -oP "app\.use\('/api/[a-z0-9_]+'" server.js | sort -u | head -50
echo "=== ROUTE COUNT ==="
grep -c "app.use" server.js