-- e295 TIER3_ANES-103 Chronic Pain UP
CREATE TABLE IF NOT EXISTS anes_pain_consults (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  consult_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  chief_complaint TEXT,
  pain_type VARCHAR(40),
  morphine_equivalent_dose NUMERIC(6,1),
  pain_score_nrs INTEGER,
  plan_summary TEXT,
  consulted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE anes_pain_consults ENABLE ROW LEVEL SECURITY;
ALTER TABLE anes_pain_consults FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anes_pc_tenant_isolation ON anes_pain_consults;
CREATE POLICY anes_pc_tenant_isolation ON anes_pain_consults
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));