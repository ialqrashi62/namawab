#!/bin/bash
export PGPASSWORD=NamaMedicalApp@2026!
for n in 969 970 971 972 973 974; do
  f=$(ls /var/www/namaweb/migrations/e${n}_*.sql 2>/dev/null)
  if [ -n "$f" ]; then
    echo "=== $f ==="
    psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -f "$f" 2>&1 | tail -3
  fi
done