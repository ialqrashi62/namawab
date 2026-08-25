-- e162 TIER3_ENDO-302 Thyroid UP
CREATE TABLE IF NOT EXISTS thyroid_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  tsh NUMERIC(6,4),
  t4_free NUMERIC(5,2),
  treatment_plan TEXT,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE thyroid_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE thyroid_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS thyr_a_tenant_isolation ON thyroid_assessments;
CREATE POLICY thyr_a_tenant_isolation ON thyroid_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));