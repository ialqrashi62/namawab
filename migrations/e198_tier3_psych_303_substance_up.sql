-- e198 TIER3_PSYCH-303 Substance Abuse UP
CREATE TABLE IF NOT EXISTS tier3_psych_substance_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  audit_total INTEGER,
  dast_score INTEGER,
  ciwa_ar_total INTEGER,
  cows_total INTEGER,
  sbirt_recommendation TEXT,
  withdrawal_severity TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_psych_sub_tenant ON tier3_psych_substance_assessments(tenant_id);
ALTER TABLE tier3_psych_substance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_psych_substance_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_psych_sub_t_tenant_isolation ON tier3_psych_substance_assessments;
CREATE POLICY tier3_psych_sub_t_tenant_isolation ON tier3_psych_substance_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));