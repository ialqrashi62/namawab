-- e447 TIER4_RAD-101 Chest Imaging
CREATE TABLE IF NOT EXISTS tier4_rad_101_chest_nodule (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_mm NUMERIC NOT NULL,
  attenuation TEXT NOT NULL,
  age INT NOT NULL,
  risk TEXT NOT NULL,
  smoker BOOLEAN,
  followup TEXT,
  surveillance TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_101_chest_nodule ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_101_chest_nodule FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_101_chest_nodule_t ON tier4_rad_101_chest_nodule;
CREATE POLICY tier4_rad_101_chest_nodule_t ON tier4_rad_101_chest_nodule
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rad_101_chest_pe (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hemodynamically_stable BOOLEAN,
  rv_dysfunction BOOLEAN,
  troponin BOOLEAN,
  bnpep BOOLEAN,
  risk TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_101_chest_pe ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_101_chest_pe FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_101_chest_pe_t ON tier4_rad_101_chest_pe;
CREATE POLICY tier4_rad_101_chest_pe_t ON tier4_rad_101_chest_pe
  USING (tenant_id = current_setting('app.tenant_id', true));