-- e460 TIER4_OPHTH-102 Retina
CREATE TABLE IF NOT EXISTS tier4_ophth_102_retina_dr (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hba1c NUMERIC NOT NULL,
  sd_oct_thickness NUMERIC NOT NULL,
  csme BOOLEAN,
  ischemia BOOLEAN,
  nephropathy BOOLEAN,
  grade TEXT NOT NULL,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_102_retina_dr ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_102_retina_dr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_102_retina_dr_t ON tier4_ophth_102_retina_dr;
CREATE POLICY tier4_ophth_102_retina_dr_t ON tier4_ophth_102_retina_dr
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_ophth_102_retina_amd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  wet BOOLEAN,
  central_metamorphopsia BOOLEAN,
  acuity NUMERIC NOT NULL,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_102_retina_amd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_102_retina_amd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_102_retina_amd_t ON tier4_ophth_102_retina_amd;
CREATE POLICY tier4_ophth_102_retina_amd_t ON tier4_ophth_102_retina_amd
  USING (tenant_id = current_setting('app.tenant_id', true));