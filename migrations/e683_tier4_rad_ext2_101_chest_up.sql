-- TIER4_RAD_EXT2-101: Chest
CREATE TABLE IF NOT EXISTS tier4_rad_ext2_101_chest (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_mm NUMERIC,
  spiculation BOOLEAN,
  smoker BOOLEAN,
  ddimer NUMERIC,
  wells NUMERIC,
  pregnant BOOLEAN,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tier4_rad_ext2_101_chest ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_ext2_101_chest FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t_rls ON tier4_rad_ext2_101_chest;
CREATE POLICY t_rls ON tier4_rad_ext2_101_chest USING (tenant_id = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS idx_tier4_rad_ext2_101 ON tier4_rad_ext2_101_chest(tenant_id, patient_id);