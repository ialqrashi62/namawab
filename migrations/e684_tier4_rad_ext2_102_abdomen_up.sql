-- TIER4_RAD_EXT2-102: Abdomen
CREATE TABLE IF NOT EXISTS tier4_rad_ext2_102_abdomen (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  peritoneal_free_air BOOLEAN,
  lactate NUMERIC,
  liver_lesion BOOLEAN,
  pancreatic_lesion BOOLEAN,
  renal_lesion BOOLEAN,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tier4_rad_ext2_102_abdomen ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_ext2_102_abdomen FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t_rls ON tier4_rad_ext2_102_abdomen;
CREATE POLICY t_rls ON tier4_rad_ext2_102_abdomen USING (tenant_id = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS idx_tier4_rad_ext2_102 ON tier4_rad_ext2_102_abdomen(tenant_id, patient_id);