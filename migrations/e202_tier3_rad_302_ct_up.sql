-- e202 TIER3_RAD-302 CT UP
CREATE TABLE IF NOT EXISTS tier3_rad_ct_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  total_dlp_mgy_cm NUMERIC(8,2),
  effective_dose_msv NUMERIC(5,2),
  contrast_nephropathy_risk TEXT,
  stroke_management TEXT,
  trauma_ct_protocol TEXT,
  pe_interpretation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rad_ct_tenant ON tier3_rad_ct_assessments(tenant_id);
ALTER TABLE tier3_rad_ct_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rad_ct_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rad_ct_t_tenant_isolation ON tier3_rad_ct_assessments;
CREATE POLICY tier3_rad_ct_t_tenant_isolation ON tier3_rad_ct_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));