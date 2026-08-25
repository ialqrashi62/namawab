-- e151 TIER3_RENAL-301 CKD UP
CREATE TABLE IF NOT EXISTS ckd_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  egfr NUMERIC(6,2),
  gfr_stage VARCHAR(5),
  alb_stage VARCHAR(5),
  uacr NUMERIC(8,2),
  risk_category VARCHAR(20),
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
ALTER TABLE ckd_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ckd_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ckd_a_tenant_isolation ON ckd_assessments;
CREATE POLICY ckd_a_tenant_isolation ON ckd_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ckd_anemia (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  hemoglobin NUMERIC(4,2),
  ferritin NUMERIC(8,2),
  transferrin_sat NUMERIC(5,2),
  epo_dose_weekly INTEGER,
  iron_route VARCHAR(20)
);
ALTER TABLE ckd_anemia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ckd_anemia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ckd_an_tenant_isolation ON ckd_anemia;
CREATE POLICY ckd_an_tenant_isolation ON ckd_anemia
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));