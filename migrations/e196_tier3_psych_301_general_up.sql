-- e196 TIER3_PSYCH-301 General Psychiatry UP
CREATE TABLE IF NOT EXISTS tier3_psych_general_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  mse_findings TEXT,
  sad_persons_score INTEGER,
  suicide_risk TEXT,
  capacity_status TEXT,
  dsm5_category TEXT,
  psych_med_class TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_psych_gen_tenant ON tier3_psych_general_assessments(tenant_id);
ALTER TABLE tier3_psych_general_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_psych_general_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_psych_gen_t_tenant_isolation ON tier3_psych_general_assessments;
CREATE POLICY tier3_psych_gen_t_tenant_isolation ON tier3_psych_general_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));