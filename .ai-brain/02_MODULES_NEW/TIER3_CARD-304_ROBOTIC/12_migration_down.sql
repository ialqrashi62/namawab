-- Migration DOWN: TIER3_CARD-304_ROBOTIC

DROP POLICY IF EXISTS rcv_dev_tenant_isolation ON robotic_cv_devices;
ALTER TABLE robotic_cv_devices NO FORCE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_devices DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS robotic_cv_devices CASCADE;

DROP POLICY IF EXISTS rcv_fup_tenant_isolation ON robotic_cv_followups;
ALTER TABLE robotic_cv_followups NO FORCE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_followups DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS robotic_cv_followups CASCADE;

DROP POLICY IF EXISTS rcv_proc_tenant_isolation ON robotic_cv_procedures;
ALTER TABLE robotic_cv_procedures NO FORCE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_procedures DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS robotic_cv_procedures CASCADE;

DROP POLICY IF EXISTS rcv_cases_tenant_isolation ON robotic_cv_cases;
ALTER TABLE robotic_cv_cases NO FORCE ROW LEVEL SECURITY;
ALTER TABLE robotic_cv_cases DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS robotic_cv_cases CASCADE;

-- Restore from backup if needed: ops/live_deploy/pgdump-YYYYMMDD.sql
