-- TIER4_RAD_EXT2-106: Pediatric Imaging
CREATE TABLE IF NOT EXISTS tier4_rad_ext2_106_peds (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years NUMERIC,
  weight_kg NUMERIC,
  examination TEXT,
  suspected TEXT,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tier4_rad_ext2_106_peds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_ext2_106_peds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t_rls ON tier4_rad_ext2_106_peds;
CREATE POLICY t_rls ON tier4_rad_ext2_106_peds USING (tenant_id = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS idx_tier4_rad_ext2_106 ON tier4_rad_ext2_106_peds(tenant_id, patient_id);