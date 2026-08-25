-- e201 TIER3_RAD-301 Plain X-Ray UP
CREATE TABLE IF NOT EXISTS tier3_rad_xray_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  cxr_impression TEXT,
  fracture_type TEXT,
  displacement TEXT,
  estimated_xray_dose_msv NUMERIC(5,3),
  foreign_body_visible BOOLEAN DEFAULT false,
  line_position TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rad_xray_tenant ON tier3_rad_xray_assessments(tenant_id);
ALTER TABLE tier3_rad_xray_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rad_xray_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rad_xray_t_tenant_isolation ON tier3_rad_xray_assessments;
CREATE POLICY tier3_rad_xray_t_tenant_isolation ON tier3_rad_xray_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));