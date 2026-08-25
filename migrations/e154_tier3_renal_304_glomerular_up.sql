-- e154 TIER3_RENAL-304 Glomerular UP
CREATE TABLE IF NOT EXISTS glomerular_diagnoses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  diagnosis_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  syndrome VARCHAR(20),
  etiology VARCHAR(50),
  induction_regimen TEXT,
  biopsy_done BOOLEAN,
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE glomerular_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE glomerular_diagnoses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS glomerular_d_tenant_isolation ON glomerular_diagnoses;
CREATE POLICY glomerular_d_tenant_isolation ON glomerular_diagnoses
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS glomerular_relapses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  relapse_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis_id VARCHAR(50),
  severity VARCHAR(20),
  action TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE glomerular_relapses ENABLE ROW LEVEL SECURITY;
ALTER TABLE glomerular_relapses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS glomerular_r_tenant_isolation ON glomerular_relapses;
CREATE POLICY glomerular_r_tenant_isolation ON glomerular_relapses
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));