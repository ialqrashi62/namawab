-- e204 TIER3_RAD-304 Ultrasound UP
CREATE TABLE IF NOT EXISTS tier3_rad_us_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  fast_interpretation TEXT,
  obstetric_edd_method TEXT,
  lvef_pct NUMERIC(5,2),
  stenosis_grade TEXT,
  abdominal_impression TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rad_us_tenant ON tier3_rad_us_assessments(tenant_id);
ALTER TABLE tier3_rad_us_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rad_us_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rad_us_t_tenant_isolation ON tier3_rad_us_assessments;
CREATE POLICY tier3_rad_us_t_tenant_isolation ON tier3_rad_us_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));