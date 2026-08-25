-- e451 TIER4_RAD-106 Pediatric Imaging
CREATE TABLE IF NOT EXISTS tier4_rad_106_ped_dose (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  modality TEXT NOT NULL,
  base_dose NUMERIC,
  pediatric_factor NUMERIC,
  weight_factor NUMERIC,
  adjusted_dose_mgy NUMERIC,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_106_ped_dose ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_106_ped_dose FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_106_ped_dose_t ON tier4_rad_106_ped_dose;
CREATE POLICY tier4_rad_106_ped_dose_t ON tier4_rad_106_ped_dose
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rad_106_ped_app (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  ultrasound_first TEXT,
  wbc NUMERIC,
  alvarado INT,
  imaging TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_106_ped_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_106_ped_app FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_106_ped_app_t ON tier4_rad_106_ped_app;
CREATE POLICY tier4_rad_106_ped_app_t ON tier4_rad_106_ped_app
  USING (tenant_id = current_setting('app.tenant_id', true));