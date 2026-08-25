-- e156 TIER3_GI-301 IBD UP
CREATE TABLE IF NOT EXISTS ibd_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  ibd_type VARCHAR(20),
  activity_score NUMERIC(8,2),
  severity VARCHAR(20),
  treatment_line VARCHAR(30),
  biologic_indicated BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ibd_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibd_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ibd_a_tenant_isolation ON ibd_assessments;
CREATE POLICY ibd_a_tenant_isolation ON ibd_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));