-- e170 TIER3_NEURO-305 Dementia UP
CREATE TABLE IF NOT EXISTS dementia_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  mmse_total INTEGER,
  cdr_score NUMERIC(3,2),
  treatment_plan TEXT,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE dementia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dementia_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dem_a_tenant_isolation ON dementia_assessments;
CREATE POLICY dem_a_tenant_isolation ON dementia_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));