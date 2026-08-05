
echo "=== policies on RLS-enabled tables ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('patients', 'invoices', 'appointments');" 2>&1
echo ""
echo "=== migration tracker table candidates ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND (tablename LIKE '%migration%' OR tablename LIKE '%schema%');" 2>&1
echo ""
echo "=== RLS status on those 3 tables ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, rowsecurity, forcerowsecurity FROM pg_tables WHERE schemaname='public' AND tablename IN ('patients','invoices','appointments','medical_records');" 2>&1
echo ""
echo "=== full migration list (look for p1_01) ==="
ls /var/www/namaweb/migrations/ | grep "p1_01_legacy_core_rls"
echo "=== p1_01 migration content for medical_records ==="
grep -A 15 "medical_records" /var/www/namaweb/migrations/p1_01_legacy_core_rls_up.sql | head -40
