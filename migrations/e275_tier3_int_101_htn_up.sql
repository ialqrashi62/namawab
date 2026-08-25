-- e275 TIER3_INT-101 Hypertension UP
CREATE TABLE IF NOT EXISTS int_htn_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  sbp_mmhg INTEGER,
  dbp_mmhg INTEGER,
  stage VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider_id INTEGER
);
ALTER TABLE int_htn_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_htn_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_h_tenant_isolation ON int_htn_assessments;
CREATE POLICY int_h_tenant_isolation ON int_htn_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS int_htn_medications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  med_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug_class VARCHAR(30),
  drug_name VARCHAR(60),
  dose_mg VARCHAR(20),
  started_date DATE,
  status VARCHAR(20)
);
ALTER TABLE int_htn_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_htn_medications FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_hm_tenant_isolation ON int_htn_medications;
CREATE POLICY int_hm_tenant_isolation ON int_htn_medications
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));