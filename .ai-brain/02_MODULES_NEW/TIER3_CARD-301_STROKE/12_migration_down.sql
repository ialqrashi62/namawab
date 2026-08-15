-- Migration DOWN: TIER3_CARD-301_STROKE
-- Non-destructive (DROP only if backup exists)

DROP POLICY IF EXISTS stroke_followup_tenant_isolation ON stroke_followup;
ALTER TABLE stroke_followup NO FORCE ROW LEVEL SECURITY;
ALTER TABLE stroke_followup DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS stroke_followup CASCADE;

DROP POLICY IF EXISTS stroke_imaging_tenant_isolation ON stroke_imaging;
ALTER TABLE stroke_imaging NO FORCE ROW LEVEL SECURITY;
ALTER TABLE stroke_imaging DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS stroke_imaging CASCADE;

DROP POLICY IF EXISTS stroke_thrombectomy_tenant_isolation ON stroke_thrombectomy;
ALTER TABLE stroke_thrombectomy NO FORCE ROW LEVEL SECURITY;
ALTER TABLE stroke_thrombectomy DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS stroke_thrombectomy CASCADE;

DROP POLICY IF EXISTS stroke_thrombolysis_tenant_isolation ON stroke_thrombolysis;
ALTER TABLE stroke_thrombolysis NO FORCE ROW LEVEL SECURITY;
ALTER TABLE stroke_thrombolysis DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS stroke_thrombolysis CASCADE;

DROP POLICY IF EXISTS stroke_cases_tenant_isolation ON stroke_cases;
ALTER TABLE stroke_cases NO FORCE ROW LEVEL SECURITY;
ALTER TABLE stroke_cases DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS stroke_cases CASCADE;

-- Restore from backup if needed: ops/live_deploy/pgdump-YYYYMMDD.sql
