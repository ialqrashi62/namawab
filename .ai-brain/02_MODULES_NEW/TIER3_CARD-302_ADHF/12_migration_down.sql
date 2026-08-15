-- Migration DOWN: TIER3_CARD-302_ADHF
-- Non-destructive

DROP POLICY IF EXISTS hf_meds_tenant_isolation ON hf_medications;
ALTER TABLE hf_medications NO FORCE ROW LEVEL SECURITY;
ALTER TABLE hf_medications DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hf_medications CASCADE;

DROP POLICY IF EXISTS heart_transplants_tenant_isolation ON heart_transplants;
ALTER TABLE heart_transplants NO FORCE ROW LEVEL SECURITY;
ALTER TABLE heart_transplants DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS heart_transplants CASCADE;

DROP POLICY IF EXISTS lvad_patients_tenant_isolation ON lvad_patients;
ALTER TABLE lvad_patients NO FORCE ROW LEVEL SECURITY;
ALTER TABLE lvad_patients DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS lvad_patients CASCADE;

DROP POLICY IF EXISTS hf_admissions_tenant_isolation ON hf_admissions;
ALTER TABLE hf_admissions NO FORCE ROW LEVEL SECURITY;
ALTER TABLE hf_admissions DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hf_admissions CASCADE;

DROP POLICY IF EXISTS hf_cases_tenant_isolation ON hf_cases;
ALTER TABLE hf_cases NO FORCE ROW LEVEL SECURITY;
ALTER TABLE hf_cases DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS hf_cases CASCADE;

-- Restore from backup if needed: ops/live_deploy/pgdump-YYYYMMDD.sql
