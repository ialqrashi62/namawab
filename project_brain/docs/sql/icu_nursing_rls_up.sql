-- ============================================================================
-- SQL Script: icu_nursing_rls_up.sql
-- Description: Enable RLS & FORCE RLS and create Tenant Isolation policies on ICU & Nursing tables
-- Environment: Staging Only
-- ============================================================================

-- 1. Enable RLS and Force RLS on all 8 target tables
ALTER TABLE nursing_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_vitals FORCE ROW LEVEL SECURITY;

ALTER TABLE nursing_care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_care_plans FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_monitoring FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_ventilator ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_ventilator FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_scores FORCE ROW LEVEL SECURITY;

ALTER TABLE icu_fluid_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_fluid_balance FORCE ROW LEVEL SECURITY;

ALTER TABLE emar_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE emar_orders FORCE ROW LEVEL SECURITY;

ALTER TABLE emar_administrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emar_administrations FORCE ROW LEVEL SECURITY;


-- 2. Drop existing policies if any, and create the RLS tenant isolation policies
DROP POLICY IF EXISTS rls_nursing_vitals_tenant_isolation ON nursing_vitals;
CREATE POLICY rls_nursing_vitals_tenant_isolation ON nursing_vitals
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_nursing_care_plans_tenant_isolation ON nursing_care_plans;
CREATE POLICY rls_nursing_care_plans_tenant_isolation ON nursing_care_plans
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_icu_monitoring_tenant_isolation ON icu_monitoring;
CREATE POLICY rls_icu_monitoring_tenant_isolation ON icu_monitoring
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_icu_ventilator_tenant_isolation ON icu_ventilator;
CREATE POLICY rls_icu_ventilator_tenant_isolation ON icu_ventilator
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_icu_scores_tenant_isolation ON icu_scores;
CREATE POLICY rls_icu_scores_tenant_isolation ON icu_scores
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_icu_fluid_balance_tenant_isolation ON icu_fluid_balance;
CREATE POLICY rls_icu_fluid_balance_tenant_isolation ON icu_fluid_balance
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_emar_orders_tenant_isolation ON emar_orders;
CREATE POLICY rls_emar_orders_tenant_isolation ON emar_orders
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_emar_administrations_tenant_isolation ON emar_administrations;
CREATE POLICY rls_emar_administrations_tenant_isolation ON emar_administrations
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);


-- 3. Create performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_nursing_care_plans_tenant_facility ON nursing_care_plans (tenant_id, facility_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_icu_monitoring_tenant_facility ON icu_monitoring (tenant_id, facility_id, admission_id);
CREATE INDEX IF NOT EXISTS idx_icu_ventilator_tenant_facility ON icu_ventilator (tenant_id, facility_id, admission_id);
CREATE INDEX IF NOT EXISTS idx_icu_scores_tenant_facility ON icu_scores (tenant_id, facility_id, admission_id);
CREATE INDEX IF NOT EXISTS idx_icu_fluid_balance_tenant_facility ON icu_fluid_balance (tenant_id, facility_id, admission_id);
CREATE INDEX IF NOT EXISTS idx_emar_orders_tenant_facility ON emar_orders (tenant_id, facility_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_emar_administrations_tenant_facility ON emar_administrations (tenant_id, facility_id, patient_id);
