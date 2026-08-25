-- e169 TIER3_NEURO-304 Movement Disorders UP
CREATE TABLE IF NOT EXISTS movement_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  hoehn_yahr_stage INTEGER,
  updrs_score NUMERIC(5,1),
  dbs_candidate BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE movement_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mvt_a_tenant_isolation ON movement_assessments;
CREATE POLICY mvt_a_tenant_isolation ON movement_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));