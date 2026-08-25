-- e146 TIER3_PULM-301 COPD UP
-- Tables: copd_assessments, copd_exacerbations, copd_inhalers

CREATE TABLE IF NOT EXISTS copd_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  fev1_pct NUMERIC(5,2),
  mMRC INTEGER,
  cat_score INTEGER,
  gold_group VARCHAR(5),
  airflow_severity INTEGER,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
CREATE INDEX IF NOT EXISTS idx_copd_a_tenant ON copd_assessments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_copd_a_patient ON copd_assessments(patient_id);
ALTER TABLE copd_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE copd_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS copd_a_tenant_isolation ON copd_assessments;
CREATE POLICY copd_a_tenant_isolation ON copd_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS copd_exacerbations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  exac_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  severity VARCHAR(20),
  anthonisen_count INTEGER,
  required_hospitalization BOOLEAN,
  treated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  treated_by INTEGER
);
ALTER TABLE copd_exacerbations ENABLE ROW LEVEL SECURITY;
ALTER TABLE copd_exacerbations FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS copd_exac_tenant_isolation ON copd_exacerbations;
CREATE POLICY copd_exac_tenant_isolation ON copd_exacerbations
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS copd_inhalers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  inhaler_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug_name VARCHAR(100),
  prescribed_puffs_per_day INTEGER,
  actual_puffs_per_day NUMERIC(6,2),
  adherence_pct NUMERIC(5,2),
  last_refill_date DATE,
  next_refill_date DATE,
  status VARCHAR(20)
);
ALTER TABLE copd_inhalers ENABLE ROW LEVEL SECURITY;
ALTER TABLE copd_inhalers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS copd_inh_tenant_isolation ON copd_inhalers;
CREATE POLICY copd_inh_tenant_isolation ON copd_inhalers
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));