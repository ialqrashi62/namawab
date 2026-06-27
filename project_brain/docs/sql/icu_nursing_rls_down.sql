-- ============================================================================
-- SQL Script: icu_nursing_rls_down.sql
-- Description: Rollback RLS enablement & FORCE RLS and drop RLS policies/indexes for ICU & Nursing
-- Environment: Staging Only
-- ============================================================================

-- 1. Disable RLS and FORCE RLS on target tables
-- Note: nursing_vitals relrowsecurity was originally true (enabled) but relforcerowsecurity was false.
-- So we disable RLS for the others, but for nursing_vitals we just set NO FORCE and restore original policy.
ALTER TABLE nursing_vitals NO FORCE ROW LEVEL SECURITY;

ALTER TABLE nursing_care_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_care_plans NO FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_monitoring DISABLE ROW LEVEL SECURITY;
ALTER TABLE icu_monitoring NO FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_ventilator DISABLE ROW LEVEL SECURITY;
ALTER TABLE icu_ventilator NO FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE icu_scores NO FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_fluid_balance DISABLE ROW LEVEL SECURITY;
ALTER TABLE icu_fluid_balance NO FORCE ROW LEVEL SECURITY;

ALTER TABLE emar_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE emar_orders NO FORCE ROW LEVEL SECURITY;

ALTER TABLE emar_administrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE emar_administrations NO FORCE ROW LEVEL SECURITY;


-- 2. Drop RLS policies
DROP POLICY IF EXISTS rls_nursing_care_plans_tenant_isolation ON nursing_care_plans;
DROP POLICY IF EXISTS rls_icu_monitoring_tenant_isolation ON icu_monitoring;
DROP POLICY IF EXISTS rls_icu_ventilator_tenant_isolation ON icu_ventilator;
DROP POLICY IF EXISTS rls_icu_scores_tenant_isolation ON icu_scores;
DROP POLICY IF EXISTS rls_icu_fluid_balance_tenant_isolation ON icu_fluid_balance;
DROP POLICY IF EXISTS rls_emar_orders_tenant_isolation ON emar_orders;
DROP POLICY IF EXISTS rls_emar_administrations_tenant_isolation ON emar_administrations;


-- 3. Drop created indexes
DROP INDEX IF EXISTS idx_nursing_care_plans_tenant_facility;
DROP INDEX IF EXISTS idx_icu_monitoring_tenant_facility;
DROP INDEX IF EXISTS idx_icu_ventilator_tenant_facility;
DROP INDEX IF EXISTS idx_icu_scores_tenant_facility;
DROP INDEX IF EXISTS idx_icu_fluid_balance_tenant_facility;
DROP INDEX IF EXISTS idx_emar_orders_tenant_facility;
DROP INDEX IF EXISTS idx_emar_administrations_tenant_facility;
