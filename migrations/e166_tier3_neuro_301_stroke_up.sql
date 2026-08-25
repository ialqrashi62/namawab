-- e166 TIER3_NEURO-301 Stroke UP
CREATE TABLE IF NOT EXISTS stroke_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  nihss_total INTEGER,
  aspects_score INTEGER,
  tpa_eligible BOOLEAN,
  thrombectomy_eligible BOOLEAN,
  stroke_etiology VARCHAR(50),
  onset_at TIMESTAMPTZ,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE stroke_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroke_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS str_a_tenant_isolation ON stroke_assessments;
CREATE POLICY str_a_tenant_isolation ON stroke_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));