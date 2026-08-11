#!/bin/bash
# Verify which tables were created + check ownership
export PGPASSWORD='NamaMedicalApp@2026!'
echo "=== Current user ==="
psql -h localhost -p 5432 -U nama_medical_app -d nama_medical_web -tAc "SELECT current_user, session_user"

echo ""
echo "=== Owner of cardiology_procedures ==="
psql -h localhost -p 5432 -U nama_medical_app -d nama_medical_web -tAc "SELECT tableowner FROM pg_tables WHERE tablename='cardiology_procedures'"

echo ""
echo "=== Newly created dept tables (any table starting with cardio_/onco_/peds_/etc) ==="
psql -h localhost -p 5432 -U nama_medical_app -d nama_medical_web -tAc "SELECT tablename FROM pg_tables WHERE schemaname='public' AND (tablename LIKE 'cardio%' OR tablename LIKE 'onco%' OR tablename LIKE 'pediatrics_%' OR tablename LIKE 'surgery_%' OR tablename LIKE 'drug_%' OR tablename LIKE 'renal_%' OR tablename LIKE 'er_triage' OR tablename LIKE 'insulin%' OR tablename LIKE 'hba1c%' OR tablename LIKE 'apgar%' OR tablename LIKE 'asa_%' OR tablename LIKE 'caprini%' OR tablename LIKE 'pulmonology_%' OR tablename LIKE 'gi_assessments' OR tablename LIKE 'rheum_%' OR tablename LIKE 'ortho_%' OR tablename LIKE 'neuro_%' OR tablename LIKE 'nephrology_%' OR tablename LIKE 'bishop%') ORDER BY tablename"

echo ""
echo "=== Current DB stats ==="
psql -h localhost -p 5432 -U nama_medical_app -d nama_medical_web -tAc "SELECT count(*) FROM pg_tables WHERE schemaname='public'"
