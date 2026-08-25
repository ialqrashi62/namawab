-- e200 TIER3_PSYCH-305 Geriatric Psychiatry UP
CREATE TABLE IF NOT EXISTS tier3_psych_geriatric_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  mmse_total INTEGER,
  moca_total INTEGER,
  gds_severity TEXT,
  dementia_type TEXT,
  cam_result TEXT,
  cognitive_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_psych_geri_tenant ON tier3_psych_geriatric_assessments(tenant_id);
ALTER TABLE tier3_psych_geriatric_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_psych_geriatric_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_psych_geri_t_tenant_isolation ON tier3_psych_geriatric_assessments;
CREATE POLICY tier3_psych_geri_t_tenant_isolation ON tier3_psych_geriatric_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));