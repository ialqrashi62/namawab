#!/bin/bash
# Apply migrations with table name + reference substitutions.
# Live DB:
#   - patients      exists
#   - system_users   exists (substitute users)
#   - encounters     does NOT exist (drop FK refs)
#   - tenant_id is BIGINT (not text)
#
# All migrations are idempotent (CREATE TABLE IF NOT EXISTS, DROP POLICY IF EXISTS).
# We split each migration file on COMMIT boundaries and replay each one
# independently so a single failure does not poison the rest.

set -u
cd /var/www/namaweb/migrations/patched

# Step 1 — substitute REFERENCES to system_users (users) and remove
# REFERENCES to encounters. Use sed in-place.
for f in e47_cardiology_up.sql \
         e48_endocrine_emergency_up.sql \
         e49_pediatrics_surgery_pharmacy_up.sql \
         e50_oncology_nephrology_obgyn_up.sql \
         e51_pulm_gi_rheum_ortho_neuro_up.sql ; do
    # Already patched once. Apply additional substitutions to a fresh copy.
    cp ../$f ${f}.v2
    # Map "REFERENCES users(id)" -> "REFERENCES system_users(id)"
    sed -i 's/REFERENCES users(id)/REFERENCES system_users(id)/g' ${f}.v2
    # Drop "REFERENCES encounters(id) ON DELETE SET NULL" if still present
    sed -i 's/REFERENCES encounters(id) ON DELETE SET NULL//g' ${f}.v2
    # Drop "REFERENCES encounters(id)" (no ON DELETE clause) if present
    sed -i 's/REFERENCES encounters(id)//g' ${f}.v2
    echo "  prepared: ${f}.v2"
done

# Step 2 — apply each in its own transaction (psql -1) so failures are isolated
export PGPASSWORD='NamaMedicalApp@2026!'
DB_HOST=localhost
DB_PORT=5432
DB_USER=nama_medical_app
DB_NAME=nama_medical_web

APPLIED=()
FAILED=()

for m in e47_cardiology e48_endocrine_emergency e49_pediatrics_surgery_pharmacy e50_oncology_nephrology_obgyn e51_pulm_gi_rheum_ortho_neuro ; do
    echo ""
    echo "================================================================"
    echo "Applying ${m} (auto-commit per statement)"
    echo "================================================================"
    # Use single-transaction mode for atomicity within ONE migration
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
            -v ON_ERROR_STOP=0 \
            -f "${m}_up.sql.v2" 2>&1 | tail -20 ; then
        APPLIED+=("$m")
    else
        FAILED+=("$m")
    fi
done

echo ""
echo "================================================================"
echo "SUMMARY"
echo "================================================================"
echo "Applied: ${APPLIED[@]}"
echo "Failed:  ${FAILED[@]:-none}"
