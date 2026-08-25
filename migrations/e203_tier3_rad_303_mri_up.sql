-- e203 TIER3_RAD-303 MRI UP
CREATE TABLE IF NOT EXISTS tier3_rad_mri_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
    mri_safety_status TEXT,
  gadolinium_risk TEXT,
  spine_impression TEXT,
  ms_diagnosis_possible BOOLEAN DEFAULT false,
  cardiac_viability_pct NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rad_mri_tenant ON tier3_rad_mri_assessments(tenant_id);
ALTER TABLE tier3_rad_mri_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rad_mri_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rad_mri_t_tenant_isolation ON tier3_rad_mri_assessments;
CREATE POLICY tier3_rad_mri_t_tenant_isolation ON tier3_rad_mri_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));