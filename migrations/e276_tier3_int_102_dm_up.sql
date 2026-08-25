-- e276 TIER3_INT-102 Diabetes Mellitus UP
CREATE TABLE IF NOT EXISTS int_dm_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  dm_type VARCHAR(20),
  hba1c_pct NUMERIC(4,2),
  hba1c_target_pct NUMERIC(4,2),
  fasting_glucose_mg_dl INTEGER,
  classification VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE int_dm_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_dm_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_dm_tenant_isolation ON int_dm_assessments;
CREATE POLICY int_dm_tenant_isolation ON int_dm_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS int_dm_medications (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  med_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug_class VARCHAR(40),
  drug_name VARCHAR(60),
  dose VARCHAR(30),
  started_date DATE
);
ALTER TABLE int_dm_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE int_dm_medications FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS int_dmm_tenant_isolation ON int_dm_medications;
CREATE POLICY int_dmm_tenant_isolation ON int_dm_medications
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));