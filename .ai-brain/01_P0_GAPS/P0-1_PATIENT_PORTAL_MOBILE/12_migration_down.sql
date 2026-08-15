-- Migration DOWN: P0-1_PATIENT_PORTAL_MOBILE

DROP POLICY IF EXISTS pp_consent_tenant_isolation ON pp_consent_log;
ALTER TABLE pp_consent_log NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pp_consent_log DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pp_consent_log CASCADE;

DROP POLICY IF EXISTS pp_caregiver_tenant_isolation ON pp_caregivers;
ALTER TABLE pp_caregivers NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pp_caregivers DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pp_caregivers CASCADE;

DROP POLICY IF EXISTS pp_refill_tenant_isolation ON pp_refill_requests;
ALTER TABLE pp_refill_requests NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pp_refill_requests DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pp_refill_requests CASCADE;

DROP POLICY IF EXISTS pp_vitals_tenant_isolation ON pp_vitals;
ALTER TABLE pp_vitals NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pp_vitals DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pp_vitals CASCADE;

DROP POLICY IF EXISTS pp_appts_tenant_isolation ON pp_appointments;
ALTER TABLE pp_appointments NO FORCE ROW LEVEL SECURITY;
ALTER TABLE pp_appointments DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS pp_appointments CASCADE;
