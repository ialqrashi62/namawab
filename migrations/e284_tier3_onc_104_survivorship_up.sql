-- e284 TIER3_ONC-104 Survivorship UP
CREATE TABLE IF NOT EXISTS onc_survivorship_plans (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  plan_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  cancer_type VARCHAR(60),
  treatment_completion_date DATE,
  surveillance_protocol VARCHAR(200),
  late_effects_monitoring TEXT,
  psychosocial_referrals TEXT,
  lifestyle_recommendations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE onc_survivorship_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_survivorship_plans FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_sp_tenant_isolation ON onc_survivorship_plans;
CREATE POLICY onc_sp_tenant_isolation ON onc_survivorship_plans
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));