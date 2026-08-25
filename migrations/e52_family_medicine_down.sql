-- filepath: namaweb/migrations/e52_family_medicine_down.sql
-- Family Medicine — reverse migration
-- Pattern: nm-sql-table-template (down)

BEGIN;

DROP POLICY IF EXISTS fm_wellness_tenant_isolation ON family_medicine_wellness;
ALTER TABLE family_medicine_wellness DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS family_medicine_wellness CASCADE;

DROP POLICY IF EXISTS fm_visits_tenant_isolation ON family_medicine_visits;
ALTER TABLE family_medicine_visits DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS family_medicine_visits CASCADE;

DROP POLICY IF EXISTS fm_patients_tenant_isolation ON family_medicine_patients;
ALTER TABLE family_medicine_patients DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS family_medicine_patients CASCADE;

COMMIT;