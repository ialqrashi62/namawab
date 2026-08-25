-- e149 TIER3_PULM-304 Pulmonary Hypertension UP
CREATE TABLE IF NOT EXISTS ph_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  who_class VARCHAR(5),
  reveal_total INTEGER,
  risk VARCHAR(20),
  mortality_1y_pct VARCHAR(20),
  vasoreactive BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
ALTER TABLE ph_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ph_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ph_a_tenant_isolation ON ph_assessments;
CREATE POLICY ph_a_tenant_isolation ON ph_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ph_vasoreactivity_tests (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  test_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug_used VARCHAR(50),
  baseline_mpap NUMERIC(6,2),
  post_mpap NUMERIC(6,2),
  baseline_co NUMERIC(6,2),
  result VARCHAR(20),
  tested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ph_vasoreactivity_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ph_vasoreactivity_tests FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ph_v_tenant_isolation ON ph_vasoreactivity_tests;
CREATE POLICY ph_v_tenant_isolation ON ph_vasoreactivity_tests
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));