-- e199 TIER3_PSYCH-304 Child/Adolescent UP
CREATE TABLE IF NOT EXISTS tier3_psych_child_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  vanderbilt_subtype TEXT,
  adhd_positive BOOLEAN DEFAULT false,
  scared_total INTEGER,
  cdi2_severity TEXT,
  mchat_r_score INTEGER,
  autism_risk TEXT,
  scoff_positive BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_psych_child_tenant ON tier3_psych_child_assessments(tenant_id);
ALTER TABLE tier3_psych_child_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_psych_child_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_psych_child_t_tenant_isolation ON tier3_psych_child_assessments;
CREATE POLICY tier3_psych_child_t_tenant_isolation ON tier3_psych_child_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));