-- e450 TIER4_RAD-105 Contrast Safety
CREATE TABLE IF NOT EXISTS tier4_rad_105_contrast_renal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  egfr NUMERIC NOT NULL,
  diabetes BOOLEAN,
  dehydration BOOLEAN,
  risk TEXT,
  precaution TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_105_contrast_renal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_105_contrast_renal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_105_contrast_renal_t ON tier4_rad_105_contrast_renal;
CREATE POLICY tier4_rad_105_contrast_renal_t ON tier4_rad_105_contrast_renal
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rad_105_contrast_gfr (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  is_female BOOLEAN,
  is_black BOOLEAN,
  scr NUMERIC NOT NULL,
  gfr_ml_min_1_73m2 NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_105_contrast_gfr ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_105_contrast_gfr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_105_contrast_gfr_t ON tier4_rad_105_contrast_gfr;
CREATE POLICY tier4_rad_105_contrast_gfr_t ON tier4_rad_105_contrast_gfr
  USING (tenant_id = current_setting('app.tenant_id', true));