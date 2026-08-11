#!/bin/bash
# Find user-like tables on live
export PGPASSWORD='NamaMedicalApp@2026!'
echo "=== User/encounter/doctor/staff tables ==="
psql -h localhost -p 5432 -U nama_medical_app -d nama_medical_web -tAc "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND (table_name LIKE '%user%' OR table_name LIKE '%staff%' OR table_name LIKE '%encounter%' OR table_name LIKE '%clinician%' OR table_name LIKE '%provider%' OR table_name LIKE '%doctor%' OR table_name = 'patients' OR table_name LIKE '%auth%') ORDER BY table_name"
echo "=== Departments table ==="
psql -h localhost -p 5432 -U nama_medical_app -d nama_medical_web -tAc "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='patients' LIMIT 10"
