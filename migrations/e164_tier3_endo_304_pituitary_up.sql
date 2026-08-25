-- e164 TIER3_ENDO-304 Pituitary UP
CREATE TABLE IF NOT EXISTS pituitary_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  mri_indicated BOOLEAN,
  deficiencies TEXT[],
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pituitary_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pituitary_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pit_a_tenant_isolation ON pituitary_assessments;
CREATE POLICY pit_a_tenant_isolation ON pituitary_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));