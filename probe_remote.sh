#!/bin/bash
echo "=== p1_01 up ==="
cat /var/www/namaweb/migrations/p1_01_legacy_core_rls_up.sql 2>/dev/null | head -80
echo ""
echo "=== audit_trail RLS check ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='audit_trail';" 2>&1 | head -5
echo "=== audit_trail policies ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT polname, polcmd, polpermissive FROM pg_policy WHERE polrelid='audit_trail'::regclass;" 2>&1 | head -10
echo "=== audit_trail columns ==="
sudo -u postgres psql -d nama_medical_web -c "\d audit_trail" 2>&1 | head -25
echo "=== done ==="
